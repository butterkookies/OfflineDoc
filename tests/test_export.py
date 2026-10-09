import os
import pytest
import io
import base64
from pathlib import Path
from PIL import Image

from app.storage import save_visit, get_visit
from app.export_pdf import generate_unified_report_pdf, compute_triage_alerts

# Create a small sample image base64 data URI for testing photo attachments
buf = io.BytesIO()
Image.new("RGB", (100, 100), color="crimson").save(buf, format="JPEG")
SAMPLE_PHOTO_DATA_URI = "data:image/jpeg;base64," + base64.b64encode(buf.getvalue()).decode("utf-8")

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
        "temp_c": 38.5,
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
    "triage_level": "urgent",
    "alerts": ["MATAAS NA BP (150/95): Stage 1/2 Hypertension", "MAY LAGNAT (38.5°C): Moderate fever"],
    "image_attachment": SAMPLE_PHOTO_DATA_URI,
    "image_caption": "Sugat sa kanang binti (Clinical Photo)",
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
    assert loaded["image_caption"] == "Sugat sa kanang binti (Clinical Photo)"

def test_compute_triage_alerts():
    level, alerts = compute_triage_alerts(SAMPLE_VISIT)
    assert level == "urgent"
    assert any("BP" in a for a in alerts)
    assert any("LAGNAT" in a for a in alerts)

    # Routine case
    routine_visit = {
        "vitals": {"bp": "110/70", "temp_c": 36.8},
        "referral": None
    }
    r_level, r_alerts = compute_triage_alerts(routine_visit)
    assert r_level == "routine"

def test_generate_unified_pdf_with_photo_and_referral(tmp_path):
    pdf_path = tmp_path / "unified_summary_referral.pdf"
    res_path = generate_unified_report_pdf(SAMPLE_VISIT, pdf_path)
    assert res_path.exists()
    assert res_path.stat().st_size > 2000 # Valid non-empty PDF with image
    with open(res_path, "rb") as f:
        header = f.read(4)
        assert header == b"%PDF"

def test_generate_unified_pdf_without_referral_or_photo(tmp_path):
    no_ref_visit = dict(SAMPLE_VISIT)
    no_ref_visit["referral"] = None
    no_ref_visit["image_attachment"] = None
    pdf_path = tmp_path / "unified_no_ref.pdf"
    res_path = generate_unified_report_pdf(no_ref_visit, pdf_path)
    assert res_path.exists()
    assert res_path.stat().st_size > 1000
    with open(res_path, "rb") as f:
        header = f.read(4)
        assert header == b"%PDF"

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
    assert data["exports"]["pdf_url"] is not None

    # Test downloading the generated unified PDF
    pdf_url = data["exports"]["pdf_url"]
    pdf_resp = client.get(pdf_url)
    assert pdf_resp.status_code == 200
    assert pdf_resp.headers["content-type"] == "application/pdf"
    assert pdf_resp.content.startswith(b"%PDF")

    # Test visits list
    visits_resp = client.get("/api/visits")
    assert visits_resp.status_code == 200
    visits_data = visits_resp.json()["visits"]
    assert len(visits_data) > 0
    latest = visits_data[0]
    assert "triage_level" in latest
    assert "pdf_url" in latest


