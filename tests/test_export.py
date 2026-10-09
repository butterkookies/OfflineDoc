import os
import pytest
from pathlib import Path

from app.storage import save_visit, get_visit
from app.checklist import generate_checklist_text
from app.export_pdf import generate_visit_pdf, generate_referral_pdf

SAMPLE_VISIT = {
    "patient_label": "Tatay Ruben Dela Peña", # Contains 'ñ' to stress-test Unicode!
    "saved_at": "2026-10-09 18:30:00",
    "location": "Sitio Sto. Niño, Barangay Kawayan", # 'ñ' here too!
    "age_years": 65,
    "sex": "male",
    "chief_complaint": "Severe dizziness and neck pain",
    "symptoms": ["Dizziness", "Neck pain", "Headache"],
    "vitals": {
        "bp": "150/95",
        "temp_c": 37.1,
        "pulse_bpm": 82,
        "resp_rate": 18,
        "weight_kg": 68.0,
    },
    "medications_given": ["Paracetamol 500mg"],
    "advice_given": ["Rest in cool area", "Avoid salty food"],
    "follow_up": [
        {"task": "Home visit blood pressure re-check", "due": "Biyernes (Friday)"}
    ],
    "referral": {
        "facility": "Rural Health Unit (RHU) Doctor",
        "reason": "Stage 1 Hypertension triage and maintenance review",
        "urgency": "urgent"
    },
    "evidence": {
        "vitals.bp": "BP niya kanina 150 over 95",
        "chief_complaint": "Masakit daw ang batok at nahihilo"
    }
}

def test_storage_save_and_retrieve():
    visit_id = save_visit(SAMPLE_VISIT)
    assert visit_id.startswith("visit_")
    
    loaded = get_visit(visit_id)
    assert loaded is not None
    assert loaded["patient_label"] == "Tatay Ruben Dela Peña"
    assert loaded["vitals"]["bp"] == "150/95"

def test_checklist_generation():
    checklist_txt = generate_checklist_text(SAMPLE_VISIT)
    assert "TALAAN NG GAWAIN" in checklist_txt
    assert "Tatay Ruben" in checklist_txt
    assert "Home visit blood pressure re-check" in checklist_txt
    assert "Rural Health Unit" in checklist_txt

def test_generate_visit_pdf(tmp_path):
    pdf_path = tmp_path / "visit_summary.pdf"
    res_path = generate_visit_pdf(SAMPLE_VISIT, pdf_path)
    assert res_path.exists()
    assert res_path.stat().st_size > 1000 # Valid non-empty PDF
    with open(res_path, "rb") as f:
        header = f.read(4)
        assert header == b"%PDF"

def test_generate_referral_pdf(tmp_path):
    ref_pdf_path = tmp_path / "referral_slip.pdf"
    res_path = generate_referral_pdf(SAMPLE_VISIT, ref_pdf_path)
    assert res_path is not None
    assert res_path.exists()
    assert res_path.stat().st_size > 1000
    with open(res_path, "rb") as f:
        header = f.read(4)
        assert header == b"%PDF"

def test_generate_referral_pdf_none_when_no_referral(tmp_path):
    no_ref_visit = dict(SAMPLE_VISIT)
    no_ref_visit["referral"] = None
    res = generate_referral_pdf(no_ref_visit, tmp_path / "no_ref.pdf")
    assert res is None

def test_api_confirm_and_export():
    from fastapi.testclient import TestClient
    from app.main import app
    client = TestClient(app)

    payload = {
        "record": SAMPLE_VISIT,
        "transcript": "Si Tatay Ruben, 65. BP niya 150 over 95."
    }
    resp = client.post("/api/confirm", json=payload)
    assert resp.status_code == 200
    data = resp.json()
    assert data["status"] == "confirmed"
    assert "visit_id" in data
    assert data["exports"]["visit_pdf"] is not None
    assert data["exports"]["referral_pdf"] is not None
    assert data["exports"]["checklist_txt"] is not None

    # Test downloading the generated PDF
    pdf_url = data["exports"]["visit_pdf"]
    pdf_resp = client.get(pdf_url)
    assert pdf_resp.status_code == 200
    assert pdf_resp.headers["content-type"] == "application/pdf"
    assert pdf_resp.content.startswith(b"%PDF")

    # Test downloading checklist
    chk_url = data["exports"]["checklist_txt"]
    chk_resp = client.get(chk_url)
    assert chk_resp.status_code == 200
    assert "TALAAN NG GAWAIN" in chk_resp.text

    # Test visits list
    visits_resp = client.get("/api/visits")
    assert visits_resp.status_code == 200
    assert len(visits_resp.json()["visits"]) > 0

