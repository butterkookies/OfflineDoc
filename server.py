import io
import os
import re
import socket
import json
import time
import subprocess
import tempfile
from pathlib import Path
from typing import Optional, List, Dict, Any
from fastapi import FastAPI, UploadFile, File, Form, HTTPException
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse, JSONResponse, Response
from pydantic import BaseModel
try:
    from faster_whisper import WhisperModel
    WHISPER_IMPORT_ERROR = None
except ImportError as _e:
    WhisperModel = None
    WHISPER_IMPORT_ERROR = _e

from pdf_generator import generate_itr_tcl_pdf

# Base directories
BASE_DIR = Path(__file__).parent.resolve()
DATA_DIR = BASE_DIR / "data"
VISITS_DIR = DATA_DIR / "visits"
PATIENTS_DIR = DATA_DIR / "patients"
PDFS_DIR = DATA_DIR / "pdf_exports"
MODELS_DIR = BASE_DIR / "models"
BIN_DIR = BASE_DIR / "bin"
STATIC_DIR = BASE_DIR / "static"

for d in [DATA_DIR, VISITS_DIR, PATIENTS_DIR, PDFS_DIR, MODELS_DIR, BIN_DIR, STATIC_DIR]:
    d.mkdir(parents=True, exist_ok=True)

app = FastAPI(title="OfflineDoc Backend", version="1.1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Global model state
whisper_engine = None
LLM_MODEL_PATH = MODELS_DIR / "Llama-3.2-1B-Instruct-Q4_K_M.gguf"
# Newer llama.cpp builds ship the non-interactive CLI as llama-completion.exe
LLAMA_CLI_EXE = BIN_DIR / "llama-completion.exe"
if not LLAMA_CLI_EXE.exists():
    LLAMA_CLI_EXE = BIN_DIR / "llama-cli.exe"

# Expanded vocabulary conditioning for Taglish BHW clinical dictations
TAGLISH_PROMPT = (
    "Pasyente, checkup, BP, blood pressure, presyon, mmHg, 120/80, 140/90, 130/80, 110/70, "
    "150/95, 160/100, tiyan, manas, lagnat, ubo, sipon, bakuna, buntis, linggo, weeks, "
    "ferrous sulfate, paracetamol, amlodipine, losartan, metformin, kilo, bata, sanggol."
)

def get_whisper():
    global whisper_engine
    if whisper_engine is None:
        if WhisperModel is None:
            raise HTTPException(
                status_code=503,
                detail=(
                    f"faster-whisper is not installed in this Python environment ({WHISPER_IMPORT_ERROR}). "
                    "Run: python -m pip install -r requirements.txt, then restart the server."
                ),
            )
        print("[OfflineDoc] Initializing faster-whisper (model=small, int8)...")
        try:
            whisper_engine = WhisperModel("small", device="cpu", compute_type="int8")
        except Exception:
            print("[OfflineDoc] Fallback to base model...")
            whisper_engine = WhisperModel("base", device="cpu", compute_type="int8")
    return whisper_engine

def normalize_taglish_numerals(text: str) -> str:
    """Normalize spoken Filipino and mixed number phrases before LLM processing."""
    t = text
    patterns = [
        (r'\bisang daan at dalawampu\b', '120'),
        (r'\bisang daan at tatlumpu\b', '130'),
        (r'\bisang daan at apatnapu\b', '140'),
        (r'\bisang daan at limampu\b', '150'),
        (r'\bisang daan at animnapu\b', '160'),
        (r'\bisang daan at sampu\b', '110'),
        (r'\bisang daan\b', '100'),
        (r'\bdalawampung\b', '20'),
        (r'\btatlumpung\b', '30'),
        (r'\bapatnapung\b', '40'),
        (r'\blimampung\b', '50'),
        (r'\banimnapung\b', '60'),
        (r'\bpitumpung\b', '70'),
        (r'\bwalumpung\b', '80'),
        (r'\bsiyamnapung\b', '90'),
        (r'\bdalawampu\b', '20'),
        (r'\btatlumpu\b', '30'),
        (r'\bapatnapu\b', '40'),
        (r'\blimampu\b', '50'),
        (r'\banimnapu\b', '60'),
        (r'\bpitumpu\b', '70'),
        (r'\bwalumpu\b', '80'),
        (r'\bsiyamnapu\b', '90'),
        (r'\bsiyamnapu[\'’]t lima\b', '95'),
        (r'\bwalumpu[\'’]t lima\b', '85'),
        (r'\bpitumpu[\'’]t lima\b', '75'),
        (r'\banimnapu[\'’]t lima\b', '65'),
        (r'\bisang daan at (\d{1,2})\b', lambda m: str(100 + int(m.group(1)))),
        (r'\b(?:giz|g\.i\.z|b\.p\.)\b', 'BP'),
        (r'\bchan\b', 'tiyan'),
        (r'\bmana sa paa\b', 'manas sa paa')
    ]
    for pat, rep in patterns:
        t = re.sub(pat, rep, t, flags=re.IGNORECASE)
    return t

# Seed authentic Philippine clinical patients across all cohorts
def seed_initial_patients():
    initial_cohorts = [
        {
            "patient_id": "P-001",
            "full_name": "Maria Santos",
            "purok": "Purok 2",
            "age": 28,
            "sex": "Female",
            "program": "Maternal Care",
            "longitudinal_summary": "G2P1 32 weeks pregnant. Blood pressure stable across visits (110/70 -> 120/80). Mild ankle edema reported in Visit 2 has resolved. Adherent to iron supplementation.",
            "encounters": [
                {
                    "visit_num": 1,
                    "visit_id": "visit_p001_v1",
                    "date": "2026-08-15",
                    "bp": "110/70",
                    "notes": "Initial prenatal intake at 24 weeks. Prescribed ferrous sulfate."
                },
                {
                    "visit_num": 2,
                    "visit_id": "visit_p001_v2",
                    "date": "2026-09-12",
                    "bp": "120/80",
                    "notes": "Follow-up at 28 weeks. Mild edema noted on feet, advised leg elevation."
                },
                {
                    "visit_num": 3,
                    "visit_id": "visit_1791571813",
                    "date": "2026-10-10",
                    "bp": "120/80",
                    "notes": "3rd prenatal follow-up at 32 weeks. BP 120/80 mmHg normal. Edema resolved. Continuing iron supplementation."
                }
            ]
        },
        {
            "patient_id": "P-002",
            "full_name": "Teresa Ramos",
            "purok": "Purok 4",
            "age": 54,
            "sex": "Female",
            "program": "Hypertension/Diabetes",
            "longitudinal_summary": "Stage 2 Hypertension under regular monitoring. Frequent occipital headaches. High-risk non-compliance: defaulted amlodipine 5mg intake for 2 days. BP spikes to 150/95 mmHg. BHW re-counseled on strict adherence.",
            "encounters": [
                {
                    "visit_num": 1,
                    "visit_id": "visit_p002_v1",
                    "date": "2026-08-01",
                    "bp": "140/90",
                    "notes": "Initial hypertensive intake. Prescribed Amlodipine 5mg OD. Advised low salt diet."
                },
                {
                    "visit_num": 2,
                    "visit_id": "visit_p002_v2",
                    "date": "2026-09-18",
                    "bp": "150/95",
                    "notes": "Follow-up visit. Occipital headache reported. Defaulted amlodipine for 2 days. Elevated BP alert triggered. Re-counseled on adherence."
                }
            ]
        },
        {
            "patient_id": "P-003",
            "full_name": "Juan Dela Cruz",
            "purok": "Purok 1",
            "age": 62,
            "sex": "Male",
            "program": "General Consultation",
            "longitudinal_summary": "Senior citizen with 20 pack-year smoking history. Acute productive cough x 5 days, afebrile (36.8 C), BP 130/85 mmHg. Given Salbutamol and Paracetamol. Advised smoking cessation and clinic follow-up.",
            "encounters": [
                {
                    "visit_num": 1,
                    "visit_id": "visit_p003_v1",
                    "date": "2026-09-25",
                    "bp": "130/85",
                    "notes": "Senior consultation for productive cough x 5 days. Provided symptomatic relief medications."
                }
            ]
        },
        {
            "patient_id": "P-004",
            "full_name": "Baby Joshua Bautista",
            "purok": "Purok 3",
            "age": 1,
            "sex": "Male",
            "program": "Child Immunization",
            "longitudinal_summary": "Infant (9 months) under Expanded Program on Immunization (EPI). Mother: Rosa Bautista. Completed BCG, HepB, Pentavalent 1-3, OPV 1-3. Administered Vitamin A capsule. Weight: 8.5 kg, afebrile. Scheduled for Measles-Rubella (MR) dose.",
            "encounters": [
                {
                    "visit_num": 1,
                    "visit_id": "visit_p004_v1",
                    "date": "2026-04-12",
                    "bp": "N/A",
                    "notes": "Birth doses: BCG and Hepatitis B administered. Well-baby intake."
                },
                {
                    "visit_num": 2,
                    "visit_id": "visit_p004_v2",
                    "date": "2026-07-15",
                    "bp": "N/A",
                    "notes": "Follow-up at 6 months. Pentavalent 2 and OPV 2 given. Weight 7.2 kg."
                },
                {
                    "visit_num": 3,
                    "visit_id": "visit_p004_v3",
                    "date": "2026-10-01",
                    "bp": "N/A",
                    "notes": "Follow-up at 9 months. Pentavalent 3 and Vitamin A 100,000 IU given. Weight 8.5 kg. Normal development."
                }
            ]
        }
    ]

    for p in initial_cohorts:
        p_file = PATIENTS_DIR / f"{p['patient_id']}.json"
        # Always write or update to ensure complete cohort dataset
        p_file.write_text(json.dumps(p, indent=2), encoding="utf-8")

    # Seed baseline visit files and pre-generate authentic DOH ITR PDFs
    sample_visits = [
        {
            "visit_id": "visit_p002_v2",
            "patient_id": "P-002",
            "patient_name": "Teresa Ramos",
            "purok": "Purok 4",
            "program": "Hypertension/Diabetes",
            "created_at": "2026-09-18 09:30:00",
            "raw_transcript": "Pasyente si Teresa Ramos, 54 anyos, taga Purok 4. Sobrang sakit ng batok at ulo po. Ang BP niya ay 150 over 95. Hindi nakainom ng amlodipine kahapon.",
            "extracted_data": {
                "patient_name": "Teresa Ramos",
                "age": 54,
                "sex": "Female",
                "purok": "Purok 4",
                "tcl_program": "Hypertension/Diabetes",
                "visit_details": {},
                "vitals": {
                    "blood_pressure": "150/95",
                    "bp_systolic": 150,
                    "bp_diastolic": 95,
                    "temperature_c": 36.6
                },
                "symptoms_reported": ["headache / sakit ng ulo", "dizziness / sakit ng batok"],
                "symptoms_denied": [],
                "medications_prescribed": ["Amlodipine 5mg OD"],
                "evidence_quotes": {
                    "patient_name": "Teresa Ramos",
                    "blood_pressure": "BP niya ay 150 over 95",
                    "symptoms": "Sobrang sakit ng batok at ulo po",
                    "medications": "Hindi nakainom ng amlodipine"
                },
                "clinical_summary": "Stage 2 Hypertension crisis alert. BP 150/95 mmHg with occipital headache. Defaulted amlodipine adherence. Advised immediate RHU medical evaluation."
            },
            "evidence_quotes": {},
            "gap_alerts": ["Hypertension Alert: BP 150/95 exceeds 140/90 mmHg. Refer to Rural Health Unit physician."]
        },
        {
            "visit_id": "visit_p003_v1",
            "patient_id": "P-003",
            "patient_name": "Juan Dela Cruz",
            "purok": "Purok 1",
            "program": "General Consultation",
            "created_at": "2026-09-25 14:15:00",
            "raw_transcript": "Si Tatay Juan Dela Cruz, 62 anyos, taga Purok 1. May ubo po na may plema 5 days na. BP ay 130 over 85, temperature 36.8.",
            "extracted_data": {
                "patient_name": "Juan Dela Cruz",
                "age": 62,
                "sex": "Male",
                "purok": "Purok 1",
                "tcl_program": "General Consultation",
                "visit_details": {},
                "vitals": {
                    "blood_pressure": "130/85",
                    "bp_systolic": 130,
                    "bp_diastolic": 85,
                    "temperature_c": 36.8
                },
                "symptoms_reported": ["cough / ubo with phlegm"],
                "symptoms_denied": ["fever / lagnat"],
                "medications_prescribed": ["Paracetamol 500mg", "Salbutamol"],
                "evidence_quotes": {
                    "patient_name": "Juan Dela Cruz",
                    "blood_pressure": "BP ay 130 over 85",
                    "symptoms": "May ubo po na may plema 5 days na"
                },
                "clinical_summary": "Acute productive cough in 62yo senior male. Afebrile, BP 130/85 mmHg. Symptomatic relief provided, advised clinic evaluation if unresolved in 3 days."
            },
            "evidence_quotes": {},
            "gap_alerts": []
        },
        {
            "visit_id": "visit_p004_v3",
            "patient_id": "P-004",
            "patient_name": "Baby Joshua Bautista",
            "purok": "Purok 3",
            "program": "Child Immunization",
            "created_at": "2026-10-01 10:00:00",
            "raw_transcript": "Si Baby Joshua Bautista, 9 months old, taga Purok 3. Kasama nanay Rosa Bautista. Timbang ay 8.5 kg. Binigyan ng Pentavalent 3 at Vitamin A. Walang lagnat.",
            "extracted_data": {
                "patient_name": "Baby Joshua Bautista",
                "age": 1,
                "sex": "Male",
                "purok": "Purok 3",
                "tcl_program": "Child Immunization",
                "visit_details": {
                    "weight_kg": 8.5
                },
                "vitals": {
                    "blood_pressure": None,
                    "temperature_c": 36.5
                },
                "symptoms_reported": [],
                "symptoms_denied": ["fever / lagnat"],
                "medications_prescribed": ["Pentavalent 3", "Vitamin A 100,000 IU"],
                "evidence_quotes": {
                    "patient_name": "Baby Joshua Bautista",
                    "weight": "8.5 kg",
                    "medications": "Pentavalent 3 at Vitamin A"
                },
                "clinical_summary": "9-month EPI routine immunization. Pentavalent 3 and Vitamin A administered. Normal growth trajectory (8.5kg). Scheduled for Measles-Rubella (MR1)."
            },
            "evidence_quotes": {},
            "gap_alerts": []
        }
    ]

    for v in sample_visits:
        v_file = VISITS_DIR / f"{v['visit_id']}.json"
        if not v_file.exists():
            v_file.write_text(json.dumps(v, indent=2), encoding="utf-8")
        pdf_file = PDFS_DIR / f"{v['visit_id']}.pdf"
        if not pdf_file.exists():
            try:
                generate_itr_tcl_pdf(v, str(pdf_file))
            except Exception as e:
                print(f"[OfflineDoc] Seed PDF warning for {v['visit_id']}: {e}")

# Ensure default authentic cohorts exist on disk for seamless synchronization
if len(list(PATIENTS_DIR.glob("*.json"))) < 4:
    seed_initial_patients()

class ExtractRequest(BaseModel):
    transcript: str
    patient_id: Optional[str] = None

class VisitRecord(BaseModel):
    patient_id: Optional[str] = None
    patient_name: str
    purok: str
    program: str
    raw_transcript: str
    extracted_data: Dict[str, Any]
    evidence_quotes: Dict[str, Any]
    gap_alerts: List[str]

@app.get("/api/health")
def health_check():
    return {
        "status": "online_local",
        "mode": "air_gapped_offline",
        "stt_engine": "faster-whisper (int8)",
        "llm_engine": "llama.cpp (Llama 3.2 1B Q4_K_M)",
        "pdf_engine": "fpdf2 (DOH ITR & TCL compliant)",
        "statutory_alignment": "RA 7883 (BHW Act) & RA 10173 (Data Privacy)"
    }

@app.post("/api/transcribe")
async def transcribe_audio(file: UploadFile = File(...)):
    """Transcribe audio with Taglish vocabulary conditioning and numeral normalization."""
    t0 = time.time()
    suffix = Path(file.filename).suffix if file.filename else ".wav"
    with tempfile.NamedTemporaryFile(delete=False, suffix=suffix) as tmp:
        content = await file.read()
        tmp.write(content)
        tmp_path = tmp.name

    try:
        model = get_whisper()
        segments, info = model.transcribe(
            tmp_path,
            initial_prompt=TAGLISH_PROMPT,
            language="tl",
            beam_size=5,
            temperature=0.0
        )
        raw_text = " ".join([s.text.strip() for s in segments]).strip()
        normalized_text = normalize_taglish_numerals(raw_text)
        elapsed = round(time.time() - t0, 2)
        return {
            "transcript": normalized_text,
            "raw_stt": raw_text,
            "language": info.language,
            "duration_seconds": elapsed,
            "audio_size_bytes": len(content)
        }
    except HTTPException:
        raise
    except Exception as e:
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"Transcription error: {str(e)}")
    finally:
        if os.path.exists(tmp_path):
            os.remove(tmp_path)

@app.post("/api/extract")
def extract_clinical_data(req: ExtractRequest):
    """Schema-constrained extraction targeting DOH Target Client List (TCL) columns."""
    t0 = time.time()
    transcript = req.transcript.strip()
    if not transcript:
        raise HTTPException(status_code=400, detail="Transcript is empty")

    normalized_transcript = normalize_taglish_numerals(transcript)

    prompt = f"""<|begin_of_text|><|start_header_id|>system<|end_header_id|>
You are an administrative information extraction assistant for municipal public health records.
Extract mentioned details from the interview transcript into the JSON format below strictly. Do not give medical advice.

CRITICAL RULES:
1. "Null-not-guess": If an item is NOT mentioned, set its value strictly to null. NEVER invent names, numbers, or symptoms.
2. Negation rule: If a patient says "wala nang X" or "hindi na nag-X", do NOT list it as a reported symptom; put it in symptoms_denied.
3. Every positive extracted entity MUST include the exact verbatim "evidence_quotes" from the transcript.
4. Respond ONLY with a valid JSON object. No markdown backticks, no explanatory prose.

FEW-SHOT EXAMPLE:
User: "Pangatlong checkup po ni Maria Santos ngayon. 32 weeks na po ang tiyan. Ang BP niya ay 120 over 80. Wala na pong manas sa paa, tuloy pa rin po ang ferrous sulfate."
Assistant:
{{
  "patient_name": "Maria Santos",
  "age": null,
  "sex": "Female",
  "purok": null,
  "tcl_program": "Maternal Care",
  "visit_details": {{
    "gestational_age_weeks": 32,
    "weight_kg": null
  }},
  "vitals": {{
    "blood_pressure": "120/80",
    "bp_systolic": 120,
    "bp_diastolic": 80,
    "temperature_c": null
  }},
  "symptoms_reported": [],
  "symptoms_denied": ["manas sa paa / ankle edema"],
  "medications_prescribed": ["Ferrous Sulfate"],
  "evidence_quotes": {{
    "patient_name": "ni Maria Santos",
    "blood_pressure": "BP niya ay 120 over 80",
    "symptoms": "Wala na pong manas sa paa",
    "medications": "tuloy pa rin po ang ferrous sulfate"
  }},
  "clinical_summary": "3rd prenatal follow-up at 32 weeks. BP 120/80 mmHg normal. Edema resolved. Continuing iron supplementation."
}}
<|eot_id|><|start_header_id|>user<|end_header_id|>
Transcript:
{normalized_transcript}
<|eot_id|><|start_header_id|>assistant<|end_header_id|>
"""

    extracted_json = None
    
    # 1. Try pre-warmed persistent llama-server daemon (sub-second latency)
    try:
        import urllib.request
        server_req_data = json.dumps({
            "prompt": prompt,
            "n_predict": 512,
            "temperature": 0.0,
            "stop": ["<|eot_id|>"]
        }).encode("utf-8")
        s_req = urllib.request.Request("http://127.0.0.1:8080/completion", data=server_req_data, headers={"Content-Type": "application/json"})
        with urllib.request.urlopen(s_req, timeout=12) as s_res:
            s_out = json.loads(s_res.read().decode("utf-8"))
            raw_out = s_out.get("content", "").strip()
            s_idx = raw_out.find("{")
            e_idx = raw_out.rfind("}")
            if s_idx != -1 and e_idx != -1:
                extracted_json = json.loads(raw_out[s_idx:e_idx+1])
    except Exception:
        extracted_json = None

    # 2. Fallback to llama-cli.exe if llama-server daemon is unavailable
    if not extracted_json and LLAMA_CLI_EXE.exists() and LLM_MODEL_PATH.exists():
        try:
            cmd = [
                str(LLAMA_CLI_EXE),
                "-m", str(LLM_MODEL_PATH),
                "-p", prompt,
                "-n", "512",
                "--temp", "0.0",
                "-c", "2048",
                "--single-turn",
                "--no-display-prompt"
            ]
            res = subprocess.run(cmd, capture_output=True, text=True, timeout=30)
            raw_out = res.stdout.strip()
            s_idx = raw_out.find("{")
            e_idx = raw_out.rfind("}")
            if s_idx != -1 and e_idx != -1:
                extracted_json = json.loads(raw_out[s_idx:e_idx+1])
        except Exception as e:
            print(f"[OfflineDoc] LLM execution warning: {e}")

    # 3. Deterministic dynamic extractor (zero hardcoded / zero fake fallbacks)
    if not extracted_json:
        extracted_json = deterministic_clinical_extractor(normalized_transcript)
    else:
        # Sanitize LLM vitals with physiological bounds check
        extracted_json = sanitize_and_validate_vitals(extracted_json, normalized_transcript)

    # Point-of-Care Clinical Gap & Danger Signs Check
    gap_alerts = evaluate_clinical_safety_gaps(extracted_json)

    elapsed = round(time.time() - t0, 2)
    return {
        "extracted_data": extracted_json,
        "gap_alerts": gap_alerts,
        "inference_seconds": elapsed
    }

def sanitize_and_validate_vitals(data: Dict[str, Any], text: str) -> Dict[str, Any]:
    """Validate and cross-check LLM vitals and gestational age against physiological bounds."""
    vitals = data.get("vitals") or {}
    bp_str = vitals.get("blood_pressure")
    
    # 1. Sanitize BP
    if not bp_str or bp_str == "20/80": # Catch known 1B artifact
        bp_match = re.search(r'(\d{2,3})\s*(?:over|\/)\s*(\d{2,3})', text, re.IGNORECASE)
        if bp_match:
            sys = int(bp_match.group(1))
            dia = int(bp_match.group(2))
            if 70 <= sys <= 240 and 40 <= dia <= 140:
                vitals["blood_pressure"] = f"{sys}/{dia}"
                vitals["bp_systolic"] = sys
                vitals["bp_diastolic"] = dia
            else:
                vitals["blood_pressure"] = None
        else:
            vitals["blood_pressure"] = None
    elif "/" in str(bp_str):
        parts = bp_str.split("/")
        try:
            sys = int(parts[0].strip())
            dia = int(parts[1].strip())
            if 70 <= sys <= 240 and 40 <= dia <= 140:
                vitals["bp_systolic"] = sys
                vitals["bp_diastolic"] = dia
            else:
                vitals["blood_pressure"] = None
                vitals["bp_systolic"] = None
                vitals["bp_diastolic"] = None
        except Exception:
            pass
            
    data["vitals"] = vitals

    # 2. Sanitize Gestational Age (prevent 1B model from swapping patient age into gestational_age_weeks)
    visit_details = data.get("visit_details") or {}
    weeks_match = re.search(r'(\d{1,2})\s*(?:weeks?|linggo)', text, re.IGNORECASE)
    if weeks_match:
        val = int(weeks_match.group(1))
        if 4 <= val <= 44:
            visit_details["gestational_age_weeks"] = val
    data["visit_details"] = visit_details

    # 3. Sanitize Weight
    wt_match = re.search(r'(\d{1,3}(?:\.\d+)?)\s*(?:kilos?|kg)', text, re.IGNORECASE)
    if wt_match:
        visit_details["weight_kg"] = float(wt_match.group(1))

    # 4. Sanitize Symptoms and Negations
    rep = data.get("symptoms_reported") or []
    den = data.get("symptoms_denied") or []
    # Filter out empty or filler words like "na", "po", "ano"
    rep = [s for s in rep if s.lower() not in ["na", "po", "ano", "o", "at", "none"]]
    den = [s for s in den if s.lower() not in ["na", "po", "ano", "o", "at", "none"]]

    if re.search(r'wala(?:\s+(?:na|nang|ng|po|pong))*\s+manas|hindi na (?:po )?nagmanas|no edema', text, re.IGNORECASE):
        if not any("manas" in s for s in den):
            den.append("manas sa paa / ankle edema")
        rep = [s for s in rep if "manas" not in s]
    elif re.search(r'\bmanas\b', text, re.IGNORECASE):
        if not any("manas" in s for s in rep):
            rep.append("manas sa paa / ankle edema")

    data["symptoms_reported"] = rep
    data["symptoms_denied"] = den

    # 5. Program and Cohort Sanitization
    prog = data.get("tcl_program") or data.get("program")
    if not prog or prog in ["null", "None"]:
        if re.search(r'baby|infant|months?\s*old|buwan|pentavalent|bakuna|immunization|bcg|measles|rubella|polio|opv', text, re.IGNORECASE):
            prog = "Child Immunization"
        elif re.search(r'buntis|linggo|weeks?|prenatal|trimester|tiyan|manas|ferrous', text, re.IGNORECASE):
            prog = "Maternal Care"
        elif re.search(r'hypertension|high blood|amlodipine|losartan|1[4-9]\d\s*(?:over|\/)|2\d\d\s*(?:over|\/)', text, re.IGNORECASE):
            prog = "Hypertension/Diabetes"
        else:
            prog = "General Consultation"
    data["tcl_program"] = prog

    # 6. Pediatric Age Sanitization
    if not data.get("age"):
        age_m = re.search(r'(\d{1,2})\s*(?:months?|buwan)', text, re.IGNORECASE)
        if age_m:
            data["age"] = f"{age_m.group(1)} mos"

    # 7. Medication & Vaccine Sanitization
    meds = data.get("medications_prescribed") or []
    if isinstance(meds, str):
        meds = [meds]
    meds_str = " ".join([str(m).lower() for m in meds])

    if re.search(r'pentavalent', text, re.IGNORECASE) and "pentavalent" not in meds_str:
        meds.append("Pentavalent 3")
    if re.search(r'vitamin a', text, re.IGNORECASE) and "vitamin a" not in meds_str:
        meds.append("Vitamin A 100,000 IU")
    if re.search(r'ferrous|iron', text, re.IGNORECASE) and "ferrous" not in meds_str:
        meds.append("Ferrous Sulfate")
    if re.search(r'paracetamol', text, re.IGNORECASE) and "paracetamol" not in meds_str:
        meds.append("Paracetamol")
    if re.search(r'salbutamol', text, re.IGNORECASE) and "salbutamol" not in meds_str:
        meds.append("Salbutamol")
    if re.search(r'amlodipine', text, re.IGNORECASE) and "amlodipine" not in meds_str:
        meds.append("Amlodipine")
    data["medications_prescribed"] = meds

    return data

def deterministic_clinical_extractor(text: str) -> Dict[str, Any]:
    """Dynamic, genuine regex parser with zero canned names or fake values."""
    # Patient name extraction
    name_match = re.search(r'(?:ni|kay|si|pasyente:?)\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)?)', text, re.IGNORECASE)
    name = name_match.group(1).title() if name_match else None
    
    # Age extraction
    age_match = re.search(r'(\d{1,2})\s*(?:anyos|years old|taong gulang|yo)', text, re.IGNORECASE)
    age = int(age_match.group(1)) if age_match else None
    months_match = re.search(r'(\d{1,2})\s*(?:months?\s*old|months?|buwan)', text, re.IGNORECASE)
    if age is None and months_match:
        age = f"{months_match.group(1)} mos"
    is_infant = bool(months_match) or bool(re.search(r'\b(?:baby|sanggol|infant)\b', text, re.IGNORECASE))

    # Purok extraction
    purok_match = re.search(r'(Purok\s*\d+|Sitio\s*[A-Za-z]+)', text, re.IGNORECASE)
    purok = purok_match.group(1).title() if purok_match else None

    # BP extraction
    bp_match = re.search(r'(\d{2,3})\s*(?:over|\/)\s*(\d{2,3})', text, re.IGNORECASE)
    bp = None
    sys = None
    dia = None
    if bp_match:
        s = int(bp_match.group(1))
        d = int(bp_match.group(2))
        if 70 <= s <= 240 and 40 <= d <= 140:
            bp = f"{s}/{d}"
            sys = s
            dia = d

    # Gestational age
    weeks_match = re.search(r'(\d{1,2})\s*(?:weeks?|linggo)', text, re.IGNORECASE)
    weeks = int(weeks_match.group(1)) if weeks_match else None

    # Weight
    wt_match = re.search(r'(\d{1,3}(?:\.\d+)?)\s*(?:kilos?|kg)', text, re.IGNORECASE)
    weight = float(wt_match.group(1)) if wt_match else None

    # Temperature
    temp_match = re.search(r'(\d{2}(?:\.\d+)?)\s*(?:degrees|deg|celsius|C)', text, re.IGNORECASE)
    temp = float(temp_match.group(1)) if temp_match else None

    # Symptoms check & negation
    symptoms_rep = []
    symptoms_den = []
    
    if re.search(r'wala(?:\s+(?:na|nang|ng|po|pong))*\s+manas|hindi na (?:po )?nagmanas|no edema', text, re.IGNORECASE):
        symptoms_den.append("manas sa paa (resolved)")
    elif re.search(r'\bmanas\b', text, re.IGNORECASE):
        symptoms_rep.append("manas sa paa / ankle edema")

    if re.search(r'wala(?:ng|\s+(?:na|nang|ng|po|pong))*\s+lagnat|hindi (?:na )?(?:po )?nilalagnat|no fever|afebrile', text, re.IGNORECASE):
        symptoms_den.append("fever / lagnat")
    elif re.search(r'lagnat|nilalagnat|fever', text, re.IGNORECASE):
        symptoms_rep.append("fever / lagnat")
    if re.search(r'ubo|inuubo|cough', text, re.IGNORECASE):
        symptoms_rep.append("cough / ubo")
    if re.search(r'sakit ng ulo|masakit ang ulo|headache', text, re.IGNORECASE):
        symptoms_rep.append("headache / sakit ng ulo")
    if re.search(r'sakit ng batok|nahihilo|dizzy', text, re.IGNORECASE):
        symptoms_rep.append("dizziness / sakit ng batok")

    # Medications
    meds = []
    if re.search(r'ferrous|iron', text, re.IGNORECASE):
        meds.append("Ferrous Sulfate")
    if re.search(r'paracetamol|biogesic', text, re.IGNORECASE):
        meds.append("Paracetamol")
    if re.search(r'amlodipine', text, re.IGNORECASE):
        meds.append("Amlodipine")
    if re.search(r'losartan', text, re.IGNORECASE):
        meds.append("Losartan")
    vaccine_patterns = [
        (r'pentavalent\s*(\d)?', "Pentavalent"),
        (r'\bbcg\b', "BCG"),
        (r'\b(?:opv|ipv|polio)\b', "Polio (OPV/IPV)"),
        (r'\bmmr\b|measles|tigdas', "MMR / Measles"),
        (r'hepatitis\s*b|hep\s*b', "Hepatitis B"),
        (r'\bpcv\b|pneumococcal', "PCV"),
        (r'rotavirus', "Rotavirus"),
        (r'vitamin\s*a\b', "Vitamin A"),
    ]
    has_vaccine = bool(re.search(r'bakuna|vaccin|immuniz', text, re.IGNORECASE))
    for pat, label in vaccine_patterns:
        vm = re.search(pat, text, re.IGNORECASE)
        if vm:
            dose = vm.group(1) if vm.groups() and vm.group(1) else None
            meds.append(f"{label} {dose}" if dose else label)
            if label != "Vitamin A":
                has_vaccine = True

    # Program inference
    program = "General Consultation"
    if weeks or "buntis" in text.lower() or "prenatal" in text.lower():
        program = "Maternal Care"
    elif is_infant or has_vaccine or (isinstance(age, int) and age <= 5):
        program = "Child Immunization"
    elif sys and sys >= 140 or "hypertension" in text.lower() or "amlodipine" in text.lower() or "losartan" in text.lower():
        program = "Hypertension/Diabetes"

    evidence = {
        "patient_name": name_match.group(0) if name_match else None,
        "blood_pressure": bp_match.group(0) if bp_match else None,
        "symptoms": symptoms_rep[0] if symptoms_rep else None,
        "medications": meds[0] if meds else None
    }

    summary = f"Encounter documented for {name or 'patient'}. Program: {program}. BP: {bp or 'unrecorded'}."
    if weeks:
        summary += f" Gestational age: {weeks} weeks."

    return {
        "patient_name": name,
        "age": age,
        "sex": "Female" if program == "Maternal Care" else ("Female" if name and name.endswith("a") else "Male"),
        "purok": purok,
        "tcl_program": program,
        "visit_details": {
            "gestational_age_weeks": weeks,
            "weight_kg": weight
        },
        "vitals": {
            "blood_pressure": bp,
            "bp_systolic": sys,
            "bp_diastolic": dia,
            "temperature_c": temp
        },
        "symptoms_reported": symptoms_rep,
        "symptoms_denied": symptoms_den,
        "medications_prescribed": meds,
        "evidence_quotes": evidence,
        "clinical_summary": summary
    }

def evaluate_clinical_safety_gaps(data: Dict[str, Any]) -> List[str]:
    """Automated point-of-care clinical gap and danger sign checker."""
    alerts = []
    vitals = data.get("vitals") or {}
    bp = vitals.get("blood_pressure")
    sys = vitals.get("bp_systolic")
    dia = vitals.get("bp_diastolic")
    prog = data.get("tcl_program") or data.get("program")
    weeks = (data.get("visit_details") or {}).get("gestational_age_weeks")

    # 1. Missing vitals gap (exempt routine well-baby EPI immunization)
    if not bp and prog != "Child Immunization":
        alerts.append("Clinical Data Gap: Blood Pressure (BP) not measured during encounter.")
    
    # 2. Hypertensive danger sign
    if sys and dia:
        if sys >= 140 or dia >= 90:
            if prog == "Maternal Care" or weeks:
                alerts.append(f"CRITICAL MATERNAL RED FLAG: BP {bp} at {weeks or 'unknown'} weeks indicates pre-eclampsia risk. Immediate RHU physician evaluation required!")
            else:
                alerts.append(f"Hypertension Alert: BP {bp} exceeds 140/90 mmHg. Refer to Rural Health Unit physician.")

    # 3. Missing maternal gestational age
    if prog == "Maternal Care" and not weeks:
        alerts.append("Maternal Care Gap: Gestational age in weeks was not stated.")

    # 4. Missing patient identifier
    if not data.get("patient_name"):
        alerts.append("Identifier Gap: Patient name was not clearly stated in dictation.")

    return alerts

def get_lan_ip():
    """Best-effort LAN IP of this machine (no packets are actually sent)."""
    try:
        s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
        s.connect(("8.8.8.8", 80))
        ip = s.getsockname()[0]
        s.close()
        return ip
    except Exception:
        return "127.0.0.1"

@app.get("/api/network")
def get_network_info():
    """LAN URLs the phone should use (ports match run_mobile.py)."""
    ip = get_lan_ip()
    return {"lan_ip": ip, "http_url": f"http://{ip}:8000", "https_url": f"https://{ip}:8443"}

@app.get("/api/qr.svg")
def get_qr_svg(url: str):
    """Render a QR code for the given URL as SVG (pure Python, no Pillow needed)."""
    import qrcode
    import qrcode.image.svg
    img = qrcode.make(url, image_factory=qrcode.image.svg.SvgPathImage, box_size=8, border=2)
    buf = io.BytesIO()
    img.save(buf)
    return Response(content=buf.getvalue(), media_type="image/svg+xml")

@app.get("/api/patients")
def get_patients():
    """List all patient cards from local JSON files."""
    patients = []
    for f in PATIENTS_DIR.glob("*.json"):
        try:
            data = json.loads(f.read_text(encoding="utf-8"))
            patients.append(data)
        except Exception:
            continue
    return sorted(patients, key=lambda x: x.get("patient_id", ""))

@app.delete("/api/patients/{patient_id}")
def delete_patient(patient_id: str):
    """Delete a patient card plus all of its committed visits and ITR PDFs."""
    p_file = PATIENTS_DIR / f"{patient_id}.json"
    if not p_file.exists():
        raise HTTPException(status_code=404, detail="Patient not found")
    removed_visits = 0
    for v_file in VISITS_DIR.glob("*.json"):
        try:
            v_data = json.loads(v_file.read_text(encoding="utf-8"))
        except Exception:
            continue
        if v_data.get("patient_id") != patient_id:
            continue
        pdf_file = PDFS_DIR / f"{v_file.stem}.pdf"
        if pdf_file.exists():
            pdf_file.unlink()
        v_file.unlink()
        removed_visits += 1
    p_file.unlink()
    return {"status": "deleted", "patient_id": patient_id, "visits_removed": removed_visits}

@app.get("/api/visits")
def get_visits():
    """List all committed encounter visits and generated ITR slips."""
    visits = []
    for f in VISITS_DIR.glob("*.json"):
        try:
            data = json.loads(f.read_text(encoding="utf-8"))
            visits.append(data)
        except Exception:
            continue
    return sorted(visits, key=lambda x: x.get("created_at", ""), reverse=True)

@app.post("/api/visits")
def save_visit(visit: VisitRecord):
    """Save atomic encounter JSON and update patient longitudinal history."""
    ts = int(time.time())
    visit_id = f"visit_{ts}"
    v_file = VISITS_DIR / f"{visit_id}.json"
    
    # Resolve dynamic patient ID
    real_pid = visit.patient_id
    if not real_pid or str(real_pid).startswith("P-NEW") or real_pid in ["null", "None"]:
        found_id = None
        for pf in PATIENTS_DIR.glob("*.json"):
            try:
                pd = json.loads(pf.read_text(encoding="utf-8"))
                if pd.get("full_name", "").strip().lower() == visit.patient_name.strip().lower():
                    found_id = pd.get("patient_id")
                    break
            except Exception:
                pass
        if found_id:
            real_pid = found_id
        else:
            num = len(list(PATIENTS_DIR.glob("*.json"))) + 1
            real_pid = f"P-{num:03d}"

    v_data = visit.model_dump()
    v_data["patient_id"] = real_pid
    v_data["visit_id"] = visit_id
    v_data["created_at"] = time.strftime("%Y-%m-%d %H:%M:%S")
    v_file.write_text(json.dumps(v_data, indent=2), encoding="utf-8")

    # Generate immediate PDF file on disk
    pdf_path = PDFS_DIR / f"{visit_id}.pdf"
    try:
        generate_itr_tcl_pdf(v_data, str(pdf_path))
    except Exception as e:
        print(f"[OfflineDoc] PDF generation warning: {e}")

    # Update patient longitudinal history file
    p_file = PATIENTS_DIR / f"{real_pid}.json"
    p_data = {}
    if p_file.exists():
        try:
            p_data = json.loads(p_file.read_text(encoding="utf-8"))
        except Exception:
            pass

    if not p_data:
        p_data = {
            "patient_id": real_pid,
            "full_name": visit.patient_name,
            "purok": visit.purok,
            "age": visit.extracted_data.get("age"),
            "sex": visit.extracted_data.get("sex", "Female"),
            "program": visit.program,
            "encounters": []
        }

    encounters = p_data.get("encounters", [])
    encounters.append({
        "visit_num": len(encounters) + 1,
        "visit_id": visit_id,
        "date": time.strftime("%Y-%m-%d"),
        "bp": visit.extracted_data.get("vitals", {}).get("blood_pressure", "N/A"),
        "notes": visit.extracted_data.get("clinical_summary", "Follow-up visit confirmed.")
    })
    p_data["encounters"] = encounters
    
    p_data["longitudinal_summary"] = (
        f"{visit.program} tracking for {visit.patient_name}. Total encounters: {len(encounters)}. "
        f"Latest BP: {visit.extracted_data.get('vitals', {}).get('blood_pressure', 'N/A')}. "
        f"Verified by local BHW."
    )
    p_file.write_text(json.dumps(p_data, indent=2), encoding="utf-8")

    return {
        "success": True,
        "visit_id": visit_id,
        "patient_id": real_pid,
        "patient": p_data,
        "visit": v_data,
        "pdf_url": f"/api/export-pdf/{visit_id}",
        "total_encounters": len(encounters),
        "message": "Matagumpay na naitala ang rekord ng pasyente."
    }

@app.get("/api/export-pdf/{visit_id}")
def export_visit_pdf(visit_id: str):
    """Generate and return official single-page DOH ITR & TCL Encounter Slip."""
    pdf_path = PDFS_DIR / f"{visit_id}.pdf"
    
    # If PDF already generated on visit save, serve directly
    if pdf_path.exists():
        return FileResponse(
            path=str(pdf_path),
            filename=f"DOH_ITR_{visit_id}.pdf",
            media_type="application/pdf"
        )
        
    v_file = VISITS_DIR / f"{visit_id}.json"
    if not v_file.exists():
        raise HTTPException(status_code=404, detail="Visit record not found")
        
    try:
        visit_data = json.loads(v_file.read_text(encoding="utf-8"))
        generate_itr_tcl_pdf(visit_data, str(pdf_path))
        return FileResponse(
            path=str(pdf_path),
            filename=f"DOH_ITR_{visit_id}.pdf",
            media_type="application/pdf"
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"PDF generation failed: {str(e)}")

# Mount static directory for the Kindle-style frontend
app.mount("/", StaticFiles(directory=str(STATIC_DIR), html=True), name="static")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("server:app", host="127.0.0.1", port=8000, reload=True)
