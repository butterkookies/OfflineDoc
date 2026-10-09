import pytest
from fastapi.testclient import TestClient

from app.main import app
from app.schema import ClinicalVisitRecord, Vitals, ReferralInfo
from app.evidence import verify_evidence_spans

client = TestClient(app)

def test_schema_valid():
    rec = ClinicalVisitRecord(
        patient_label="Tatay Ruben",
        age_years=65,
        vitals=Vitals(bp="150/95", temp_c=37.1),
        referral=ReferralInfo(facility="RHU", reason="Hypertension triage", urgency="urgent"),
        evidence={"vitals.bp": "BP niya 150 over 95"}
    )
    assert rec.patient_label == "Tatay Ruben"
    assert rec.vitals.bp == "150/95"
    assert rec.referral.facility == "RHU"
    assert rec.vitals.pulse_bpm is None # Null if not stated!

def test_evidence_verification_exact():
    transcript = "Si Tatay Ruben, 65 years old. BP niya kanina 150 over 95."
    evidence_map = {"vitals.bp": "150 over 95"}
    spans = verify_evidence_spans(transcript, evidence_map)
    assert "vitals.bp" in spans
    assert spans["vitals.bp"]["status"] == "verified"
    start = spans["vitals.bp"]["start_char"]
    end = spans["vitals.bp"]["end_char"]
    assert transcript[start:end] == "150 over 95"

def test_evidence_verification_fuzzy():
    transcript = "Si Tatay Ruben. Masakit daw ang batok at nahihilo."
    evidence_map = {"chief_complaint": "masakit daw ang batok"}
    spans = verify_evidence_spans(transcript, evidence_map)
    assert "chief_complaint" in spans
    assert spans["chief_complaint"]["status"] == "verified"

def test_evidence_verification_unverified_quote():
    transcript = "Si Nanay Maria, lagnat at ubo lang."
    evidence_map = {"vitals.bp": "BP 180 over 100"} # Hallucinated! Not in audio!
    spans = verify_evidence_spans(transcript, evidence_map)
    assert "vitals.bp" in spans
    assert spans["vitals.bp"]["status"] == "unverified"
    assert spans["vitals.bp"]["start_char"] is None

def test_extract_endpoint_empty():
    response = client.post("/api/extract", json={"transcript": ""})
    assert response.status_code == 400

def test_extract_endpoint_taglish():
    sample_transcript = (
        "Si Tatay Ruben, 65 years old, taga Sitio Kawayan. Masakit daw ang batok at nahihilo since kahapon. "
        "BP niya kanina 150 over 95, medyo mataas. Temperature 37.1. Binigyan ko ng paracetamol. "
        "Sinabihan ko siya na magpunta sa RHU kay Doc Santos bukas ng umaga. Babalikan ko sa Biyernes."
    )
    response = client.post("/api/extract", json={"transcript": sample_transcript})
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "success"
    record = data["data"]
    assert "Tatay Ruben" in record["patient_label"]
    assert record["age_years"] == 65
    assert record["vitals"]["bp"] == "150/95"
    assert "Dizziness" in record["symptoms"] or "Neck pain" in record["symptoms"]
    assert record["referral"] is not None
    assert "RHU" in record["referral"]["facility"] or "Rural Health Unit" in record["referral"]["facility"]
    # Evidence must contain quote
    assert len(record["evidence"]) > 0
    # Verified spans must exist
    assert "vitals.bp" in data["verified_spans"]
    assert data["verified_spans"]["vitals.bp"]["status"] == "verified"
