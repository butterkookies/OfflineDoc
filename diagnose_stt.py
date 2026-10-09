"""Speech-to-text diagnostics for OfflineDoc.

Run inside the project venv:  python diagnose_stt.py
Paste the full output when reporting a "Transcription error".
"""
import platform
import sys
import traceback
from pathlib import Path

SAMPLE = Path(__file__).parent / "static" / "test_taglish.mp3"


def step(title, fn):
    print(f"\n--- {title} ---")
    try:
        result = fn()
        print("OK", result if result is not None else "")
        return result
    except Exception:
        traceback.print_exc()
        return None


def versions():
    import importlib.metadata as md
    out = {}
    for pkg in ["faster-whisper", "ctranslate2", "av", "numpy", "onnxruntime", "tokenizers", "huggingface-hub"]:
        try:
            out[pkg] = md.version(pkg)
        except md.PackageNotFoundError:
            out[pkg] = "MISSING"
    return out


def decode():
    from faster_whisper.audio import decode_audio
    audio = decode_audio(str(SAMPLE))
    return f"{len(audio)} samples, dtype={audio.dtype}"


def load_model():
    from faster_whisper import WhisperModel
    return WhisperModel("small", device="cpu", compute_type="int8")


def transcribe(model):
    segments, info = model.transcribe(str(SAMPLE), language="tl", beam_size=5, temperature=0.0)
    return " ".join(s.text.strip() for s in segments)


if __name__ == "__main__":
    print("Python:", sys.version)
    print("Executable:", sys.executable)
    print("Platform:", platform.platform(), platform.machine())
    step("Package versions", versions)
    step("Decode sample audio with PyAV", decode)
    model = step("Load Whisper small (int8)", load_model)
    if model is not None:
        step("Transcribe sample", lambda: transcribe(model))
