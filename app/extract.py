import json
import re
import time
from typing import Dict, Any, Optional
import httpx

from app.config import config
from app.schema import ClinicalVisitRecord, get_visit_json_schema
from app.evidence import verify_evidence_spans

SYSTEM_PROMPT = """You are an expert offline clinical assistant for Barangay Health Workers in the Philippines.
The user provides conversational Filipino/Taglish dictation from a house-to-house visit.
Your job is to extract clinical facts into a standardized medical JSON record.

CRITICAL RULES:
1. Standardize clinical facts into English medical terminology (e.g., "masakit ang ulo" -> "Headache", "nahihilo" -> "Dizziness").
2. For EVERY extracted fact, find the verbatim Taglish quote from the transcript and place it in the 'evidence' object matching the field name.
3. If an item was not explicitly mentioned in the transcript, its value MUST BE NULL. Never guess, extrapolate, or hallucinate unstated vitals, symptoms, or diagnoses.
4. If the health worker states that the patient should go to a doctor, clinic, or Rural Health Unit, extract the 'referral' object with facility, reason, and urgency.
5. Return ONLY a valid JSON object matching the requested schema.
"""

def extract_clinical_record_fallback(transcript: str) -> Dict[str, Any]:
    """
    Deterministic rule-based extractor for Taglish clinical dictation.
    Used for testing or when llama-server is in standby.
    Always produces schema-compliant JSON with verbatim evidence quotes.
    """
    evidence = {}
    
    # 1. Patient label
    patient_label = None
    patient_match = re.search(r"(?:Si|Pasyente(?: ay)?|Tatay|Nanay|Aling|Mang)\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)?)", transcript, re.IGNORECASE)
    if patient_match:
        patient_label = patient_match.group(1).strip()
        evidence["patient_label"] = patient_match.group(0).strip()

    # 2. Age
    age = None
    age_match = re.search(r"(\d{1,3})\s*(?:years old|taong gulang|anyos)", transcript, re.IGNORECASE)
    if age_match:
        age = int(age_match.group(1))
        evidence["age_years"] = age_match.group(0).strip()

    # 3. Location / Sitio
    location = None
    loc_match = re.search(r"(?:taga|sa|Sitio|Barangay|Purok)\s+([A-Za-z0-9\s]+?)(?:\.|\,|$|Masakit|BP|May)", transcript, re.IGNORECASE)
    if loc_match:
        location = loc_match.group(0).strip()
        evidence["location"] = location

    # 4. Vitals - Blood Pressure
    bp = None
    bp_match = re.search(r"(?:BP|blood pressure)[^\d]*(\d{2,3}\s*(?:over|\/)\s*\d{2,3})", transcript, re.IGNORECASE)
    if bp_match:
        bp_raw = bp_match.group(1)
        bp = bp_raw.replace("over", "/").replace(" ", "")
        evidence["vitals.bp"] = bp_match.group(0).strip()

    # 5. Vitals - Temperature
    temp_c = None
    temp_match = re.search(r"(?:temp|temperature|lagnat)[^\d]*(\d{2}(?:\.\d{1,2})?)", transcript, re.IGNORECASE)
    if temp_match:
        temp_c = float(temp_match.group(1))
        evidence["vitals.temp_c"] = temp_match.group(0).strip()

    # 6. Symptoms & Chief Complaint
    symptoms = []
    complaint = None
    if re.search(r"ubo", transcript, re.IGNORECASE):
        symptoms.append("Cough")
    if re.search(r"lagnat", transcript, re.IGNORECASE):
        symptoms.append("Fever")
    if re.search(r"nahihilo|dizzy", transcript, re.IGNORECASE):
        symptoms.append("Dizziness")
    if re.search(r"masakit ang batok|neck pain", transcript, re.IGNORECASE):
        symptoms.append("Neck pain")
    if re.search(r"masakit ang ulo|headache", transcript, re.IGNORECASE):
        symptoms.append("Headache")

    if symptoms:
        complaint = ", ".join(symptoms)
        comp_match = re.search(r"Masakit[^\.]*?(?:kahapon|araw)", transcript, re.IGNORECASE)
        if comp_match:
            evidence["chief_complaint"] = comp_match.group(0).strip()

    # 7. Medications
    meds = []
    med_match = re.search(r"(?:paracetamol|amoxicillin|losartan|amlodipine|ferrous sulfate)", transcript, re.IGNORECASE)
    if med_match:
        meds.append(med_match.group(0).capitalize())
        evidence["medications_given"] = med_match.group(0)

    # 8. Follow-up
    follow_up = []
    fu_match = re.search(r"(?:Babalikan|follow[-\s]?up)[^\.]*?(?:Biyernes|Lunes|Martes|Miyerkules|Huwebes|Sabado|Linggo|araw)", transcript, re.IGNORECASE)
    if fu_match:
        follow_up.append({"task": "Home visit follow-up check", "due": fu_match.group(0).strip()})
        evidence["follow_up"] = fu_match.group(0).strip()

    # 9. Referral
    referral = None
    ref_match = re.search(r"(?:RHU|Rural Health Unit|Health Center|Doc|Doktor)[^\.]*?(?:bukas|umaga|ngayon|Lunes|Martes|Miyerkules|Huwebes|Biyernes|Sabado|Linggo|araw)", transcript, re.IGNORECASE)
    if ref_match:
        referral = {
            "facility": "Rural Health Unit (RHU)",
            "reason": f"Evaluation for {complaint or 'symptoms'}",
            "urgency": "urgent" if (bp and int(bp.split("/")[0]) >= 140) else "routine"
        }
        evidence["referral"] = ref_match.group(0).strip()

    return {
        "patient_label": patient_label or "Patient",
        "visit_date": None,
        "location": location,
        "age_years": age,
        "sex": None,
        "chief_complaint": complaint,
        "symptoms": symptoms,
        "vitals": {
            "bp": bp,
            "temp_c": temp_c,
            "pulse_bpm": None,
            "resp_rate": None,
            "weight_kg": None,
        },
        "medications_given": meds,
        "advice_given": ["Rest and adequate hydration"],
        "follow_up": follow_up,
        "referral": referral,
        "evidence": evidence,
    }

async def extract_clinical_record(transcript: str) -> Dict[str, Any]:
    """
    Extracts structured clinical JSON from Taglish transcript using local llama-server,
    or deterministic fallback if server is not yet running.
    Attaches verified character spans for UI grounding.
    """
    start_time = time.perf_counter()
    llama_url = f"{config.models.llama_server_url}/v1/chat/completions"
    schema = get_visit_json_schema()

    record_data = None
    is_sample_fallback = False

    # Attempt to query live llama-server on 127.0.0.1:8081 with fast health probe
    try:
        async with httpx.AsyncClient(timeout=0.6) as client:
            h_resp = await client.get(f"{config.models.llama_server_url}/health")
            if h_resp.status_code == 200:
                payload = {
                    "messages": [
                        {"role": "system", "content": SYSTEM_PROMPT},
                        {"role": "user", "content": f"Transcript:\n{transcript}"},
                    ],
                    "temperature": 0.0,
                    "max_tokens": 600,
                    "response_format": {
                        "type": "json_object",
                        "schema": schema,
                    },
                }
                resp = await client.post(llama_url, json=payload, timeout=25.0)
                if resp.status_code == 200:
                    result_json = resp.json()
                    content_str = result_json["choices"][0]["message"]["content"]
                    record_data = json.loads(content_str)
                else:
                    is_sample_fallback = True
            else:
                is_sample_fallback = True
    except Exception:
        # Fallback to local deterministic extractor
        is_sample_fallback = True

    if record_data is None:
        record_data = extract_clinical_record_fallback(transcript)
        is_sample_fallback = True

    # Evidence grounding verification
    evidence_map = record_data.get("evidence", {})
    verified_spans = verify_evidence_spans(transcript, evidence_map)

    elapsed_ms = int((time.perf_counter() - start_time) * 1000)

    return {
        "status": "success",
        "data": record_data,
        "verified_spans": verified_spans,
        "elapsed_ms": elapsed_ms,
        "is_sample_fallback": is_sample_fallback,
    }
