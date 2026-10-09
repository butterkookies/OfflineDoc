from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_health_endpoint():
    response = client.get("/api/health")
    assert response.status_code == 200
    data = response.json()
    assert "status" in data
    assert data["offline_mode"] is True
    assert data["runtime"]["host"] == "127.0.0.1"
    assert "engines" in data
    assert "whisper" in data["engines"]
    assert "llama" in data["engines"]
    assert "storage" in data

def test_index_page():
    response = client.get("/")
    assert response.status_code == 200
    assert "OfflineDoc" in response.text

def test_manifest():
    response = client.get("/manifest.json")
    assert response.status_code == 200
    data = response.json()
    assert data["short_name"] == "OfflineDoc"
