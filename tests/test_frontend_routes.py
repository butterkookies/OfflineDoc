from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_static_routes_exist():
    # 1. Index page
    res_index = client.get("/")
    assert res_index.status_code == 200
    assert "OfflineDoc" in res_index.text
    assert "recorder.js" in res_index.text
    assert "app.js" in res_index.text

    # 2. Manifest
    res_manifest = client.get("/manifest.json")
    assert res_manifest.status_code == 200
    assert res_manifest.json()["short_name"] == "OfflineDoc"

    # 3. CSS
    res_css = client.get("/styles.css")
    assert res_css.status_code == 200
    assert "content-type" in res_css.headers
    assert "text/css" in res_css.headers["content-type"]
    assert "--accent-cyan" in res_css.text

    # 4. Recorder JS
    res_recorder = client.get("/recorder.js")
    assert res_recorder.status_code == 200
    assert "WavAudioRecorder" in res_recorder.text

    # 5. App JS
    res_app = client.get("/app.js")
    assert res_app.status_code == 200
    assert "populateReviewScreen" in res_app.text
    assert "setupGroundingInteractions" in res_app.text

    # 6. Fonts
    res_font = client.get("/fonts/font.ttf")
    assert res_font.status_code == 200

def test_visit_endpoints_and_edit_flow():
    # 1. Confirm a new visit
    payload = {
        "record": {
            "patient_label": "Elena Reyes",
            "age_years": 45,
            "location": "Purok 2, Lipa City",
            "chief_complaint": "Mataas na BP at Pananakit ng Ulo",
            "symptoms": ["Headache", "Dizziness"],
            "vitals": {"bp": "150/95", "temp_c": 37.0},
            "medications_given": ["Paracetamol 500mg"],
            "advice_given": ["Magpahinga at uminom ng tubig"],
            "follow_up": [{"task": "BP re-check", "due": "Bukas ng umaga"}],
            "referral": {"facility": "Rural Health Unit (RHU)", "reason": "Hypertension triage", "urgency": "urgent"},
            "triage_level": "urgent",
            "alerts": ["Mataas na BP (150/95)"],
        },
        "transcript": "Si Elena Reyes, 45 anyos taga Purok 2, Lipa City. BP 150 over 95."
    }
    res_confirm = client.post("/api/confirm", json=payload)
    assert res_confirm.status_code == 200
    confirm_data = res_confirm.json()
    visit_id = confirm_data["visit_id"]
    assert visit_id.startswith("visit_")

    # 2. Get single visit by ID
    res_single = client.get(f"/api/visits/{visit_id}")
    assert res_single.status_code == 200
    single_data = res_single.json()
    assert single_data["visit"]["patient_label"] == "Elena Reyes"
    assert single_data["visit"]["location"] == "Purok 2, Lipa City"
    assert single_data["visit"]["triage_level"] == "urgent"

    # 3. Edit and update the same visit_id
    edit_payload = {
        "record": {
            "visit_id": visit_id,
            "patient_label": "Elena Reyes Updated",
            "age_years": 46,
            "location": "Purok 2, Lipa City",
            "chief_complaint": "Mataas na BP (Controlled)",
            "symptoms": ["Mild headache"],
            "vitals": {"bp": "130/85", "temp_c": 36.8},
            "medications_given": ["Losartan 50mg"],
            "advice_given": ["Ipagpatuloy ang maintenance"],
            "follow_up": [{"task": "Routine check", "due": "Sa susunod na buwan"}],
            "referral": None,
            "triage_level": "monitor",
            "alerts": ["Elevated BP (130/85)"],
        },
        "transcript": "Updated consultation record."
    }
    res_update = client.post("/api/confirm", json=edit_payload)
    assert res_update.status_code == 200
    assert res_update.json()["visit_id"] == visit_id

    # 4. Verify updated record in single visit endpoint
    res_check = client.get(f"/api/visits/{visit_id}")
    assert res_check.status_code == 200
    assert res_check.json()["visit"]["patient_label"] == "Elena Reyes Updated"
    assert res_check.json()["visit"]["age_years"] == 46
    assert res_check.json()["visit"]["vitals"]["bp"] == "130/85"
