import pytest
from starlette.testclient import TestClient
from server import app

client = TestClient(app)

def test_api_health():
    response = client.get("/api/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "online_local"
    assert data["mode"] == "air_gapped_offline"
    assert "pdf_engine" in data

def test_scenario_a_maternal_extraction():
    transcript = (
        "Pangatlong checkup po ni Maria Santos, 28 years old, taga Purok 2. "
        "32 weeks na po ang tiyan, BP ay isang daan at dalawampu over walumpu, 54 kilos. "
        "Wala na pong manas sa paa, tuloy pa rin po ang ferrous sulfate."
    )
    response = client.post("/api/extract", json={"transcript": transcript})
    assert response.status_code == 200
    res = response.json()
    ext = res["extracted_data"]
    assert "Maria" in ext.get("patient_name", "")
    assert ext.get("vitals", {}).get("blood_pressure") == "120/80"
    assert ext.get("visit_details", {}).get("gestational_age_weeks") == 32
    assert "manas" in str(ext.get("symptoms_denied", []))

def test_scenario_b_hypertension_urgency():
    transcript = (
        "Pasyente si Teresa Ramos, 54 anyos, Purok 4. Sobrang sakit ng batok at ulo po. "
        "Ang BP niya ay 150 over 95. Hindi nakainom ng amlodipine kahapon."
    )
    response = client.post("/api/extract", json={"transcript": transcript})
    assert response.status_code == 200
    res = response.json()
    ext = res["extracted_data"]
    assert ext.get("vitals", {}).get("blood_pressure") == "150/95"
    assert any("Hypertension" in a or "140/90" in a for a in res.get("gap_alerts", []))

def test_scenario_c_gap_alert_missing_bp():
    transcript = (
        "Si Juan Dela Cruz, 35 anyos, may mataas na lagnat at ubo tatlong araw na. "
        "Uminom ng paracetamol kaninang umaga."
    )
    response = client.post("/api/extract", json={"transcript": transcript})
    assert response.status_code == 200
    res = response.json()
    ext = res["extracted_data"]
    assert ext.get("vitals", {}).get("blood_pressure") is None
    assert any("Blood Pressure" in a for a in res.get("gap_alerts", []))

def test_scenario_d_child_immunization():
    transcript = (
        "Si Baby Joshua Bautista, 9 months old, taga Purok 3. Kasama nanay Rosa Bautista. "
        "Timbang ay 8.5 kg. Binigyan ng Pentavalent 3 at Vitamin A. Walang lagnat."
    )
    response = client.post("/api/extract", json={"transcript": transcript})
    assert response.status_code == 200
    res = response.json()
    ext = res["extracted_data"]
    assert "Baby Joshua" in ext.get("patient_name", "")
    assert ext.get("tcl_program") == "Child Immunization"

def test_commit_encounter_and_export_pdf():
    save_payload = {
        "patient_id": "P-TEST-001",
        "patient_name": "Maria Santos",
        "purok": "Purok 2",
        "program": "Maternal Care",
        "raw_transcript": "Checkup ni Maria Santos, 32 weeks, BP 120/80.",
        "extracted_data": {
            "patient_name": "Maria Santos",
            "age": 28,
            "sex": "Female",
            "purok": "Purok 2",
            "tcl_program": "Maternal Care",
            "vitals": {
                "blood_pressure": "120/80",
                "bp_systolic": 120,
                "bp_diastolic": 80,
                "weight_kg": 54.0
            },
            "symptoms_reported": [],
            "symptoms_denied": ["manas sa paa (resolved)"],
            "medications_prescribed": ["Ferrous Sulfate"],
            "clinical_summary": "Routine maternal checkup at 32 weeks gestation. Vitals normal. Continuing ferrous sulfate.",
            "evidence_quotes": {}
        },
        "evidence_quotes": {},
        "gap_alerts": []
    }
    commit_res = client.post("/api/visits", json=save_payload)
    assert commit_res.status_code == 200
    cdata = commit_res.json()
    assert cdata["success"] is True
    visit_id = cdata["visit_id"]

    pdf_res = client.get(f"/api/export-pdf/{visit_id}")
    assert pdf_res.status_code == 200
    assert pdf_res.headers["content-type"] == "application/pdf"
    assert pdf_res.content.startswith(b"%PDF-")

def test_patients_directory():
    res = client.get("/api/patients")
    assert res.status_code == 200
    data = res.json()
    assert isinstance(data, list)

def test_pwa_static_assets():
    res_manifest = client.get("/manifest.json")
    assert res_manifest.status_code == 200
    assert "OfflineDoc" in res_manifest.text

    res_sw = client.get("/sw.js")
    assert res_sw.status_code == 200
    assert "offlinedoc-pwa" in res_sw.text
