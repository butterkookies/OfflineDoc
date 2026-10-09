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
