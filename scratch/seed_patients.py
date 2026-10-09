import json
from pathlib import Path

PATIENTS_DIR = Path('data/patients')
VISITS_DIR = Path('data/visits')
PDFS_DIR = Path('data/pdf_exports')
PATIENTS_DIR.mkdir(parents=True, exist_ok=True)
VISITS_DIR.mkdir(parents=True, exist_ok=True)
PDFS_DIR.mkdir(parents=True, exist_ok=True)

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
            {"visit_num": 1, "visit_id": "visit_p001_v1", "date": "2026-08-15", "bp": "110/70", "notes": "Initial prenatal intake at 24 weeks. Prescribed ferrous sulfate."},
            {"visit_num": 2, "visit_id": "visit_p001_v2", "date": "2026-09-12", "bp": "120/80", "notes": "Follow-up at 28 weeks. Mild edema noted on feet, advised leg elevation."},
            {"visit_num": 3, "visit_id": "visit_p001_v3", "date": "2026-10-10", "bp": "120/80", "notes": "3rd prenatal follow-up at 32 weeks. BP 120/80 mmHg normal. Edema resolved. Continuing iron supplementation."}
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
            {"visit_num": 1, "visit_id": "visit_p002_v1", "date": "2026-08-01", "bp": "140/90", "notes": "Initial hypertensive intake. Prescribed Amlodipine 5mg OD. Advised low salt diet."},
            {"visit_num": 2, "visit_id": "visit_p002_v2", "date": "2026-09-18", "bp": "150/95", "notes": "Follow-up visit. Occipital headache reported. Defaulted amlodipine for 2 days. Elevated BP alert triggered. Re-counseled on adherence."}
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
            {"visit_num": 1, "visit_id": "visit_p003_v1", "date": "2026-09-25", "bp": "130/85", "notes": "Senior consultation for productive cough x 5 days. Provided symptomatic relief medications."}
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
            {"visit_num": 1, "visit_id": "visit_p004_v1", "date": "2026-04-12", "bp": "N/A", "notes": "Birth doses: BCG and Hepatitis B administered. Well-baby intake."},
            {"visit_num": 2, "visit_id": "visit_p004_v2", "date": "2026-07-15", "bp": "N/A", "notes": "Follow-up at 6 months. Pentavalent 2 and OPV 2 given. Weight 7.2 kg."},
            {"visit_num": 3, "visit_id": "visit_p004_v3", "date": "2026-10-01", "bp": "N/A", "notes": "Follow-up at 9 months. Pentavalent 3 and Vitamin A 100,000 IU given. Weight 8.5 kg. Normal development."}
        ]
    }
]

for p in initial_cohorts:
    p_id = p["patient_id"]
    (PATIENTS_DIR / f"{p_id}.json").write_text(json.dumps(p, indent=2), encoding="utf-8")

print("Seeded all patients successfully!")
