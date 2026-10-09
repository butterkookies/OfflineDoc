import math
import struct
import wave
import pytest
from pathlib import Path
from fastapi.testclient import TestClient

from app.main import app
from app.validate import validate_wav_file

client = TestClient(app)

def create_synthetic_wav(path: Path, duration_s: float, freq_hz: float = 440.0, sample_rate: int = 16000, silent: bool = False):
    """
    Creates a synthetic 16-bit mono PCM WAV file for deterministic offline testing.
    """
    num_samples = int(duration_s * sample_rate)
    with wave.open(str(path), "wb") as wf:
        wf.setnchannels(1)
        wf.setsampwidth(2)
        wf.setframerate(sample_rate)

        raw_samples = bytearray()
        for i in range(num_samples):
            if silent:
                val = 0
            else:
                # 440 Hz sine wave tone with amplitude
                val = int(12000 * math.sin(2 * math.pi * freq_hz * i / sample_rate))
            raw_samples.extend(struct.pack("<h", val))

        wf.writeframes(raw_samples)

def test_validate_nonexistent_file():
    with pytest.raises(FileNotFoundError):
        validate_wav_file("nonexistent_audio.wav")

def test_validate_too_short(tmp_path):
    short_wav = tmp_path / "short.wav"
    create_synthetic_wav(short_wav, duration_s=1.0) # only 1.0s, minimum is 2.0s
    with pytest.raises(ValueError, match="too short"):
        validate_wav_file(short_wav, min_duration=2.0)

def test_validate_silent_audio(tmp_path):
    silent_wav = tmp_path / "silent.wav"
    create_synthetic_wav(silent_wav, duration_s=3.0, silent=True)
    with pytest.raises(ValueError, match="completely silent"):
        validate_wav_file(silent_wav, min_duration=2.0)

def test_validate_valid_audio(tmp_path):
    valid_wav = tmp_path / "valid.wav"
    create_synthetic_wav(valid_wav, duration_s=2.5, freq_hz=300.0)
    res = validate_wav_file(valid_wav, min_duration=2.0)
    assert res.is_valid is True
    assert res.duration_seconds == 2.5
    assert res.sample_rate == 16000
    assert res.channels == 1
    assert res.rms_volume > 0.05

def test_api_transcribe_rejects_non_wav(tmp_path):
    fake_txt = tmp_path / "test.mp3"
    fake_txt.write_text("not an audio file")
    with open(fake_txt, "rb") as f:
        response = client.post("/api/transcribe", files={"file": ("test.mp3", f, "audio/mpeg")})
    assert response.status_code == 400
    assert "Invalid file format" in response.json()["error"]

def test_api_transcribe_with_valid_audio(tmp_path):
    valid_wav = tmp_path / "speech.wav"
    create_synthetic_wav(valid_wav, duration_s=2.5, freq_hz=440.0)
    with open(valid_wav, "rb") as f:
        response = client.post("/api/transcribe", files={"file": ("speech.wav", f, "audio/wav")})
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "success"
    assert "transcript" in data
    assert len(data["transcript"]) > 0
    assert "elapsed_ms" in data
    assert "validation" in data
    assert data["validation"]["duration_seconds"] == 2.5
