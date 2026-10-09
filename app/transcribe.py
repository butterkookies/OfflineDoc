import os
import subprocess
import time
from pathlib import Path
from dataclasses import dataclass
from typing import Optional, Dict, Any

from app.config import config

@dataclass
class TranscriptionResult:
    transcript: str
    elapsed_ms: int
    language: str
    is_sample_fallback: bool = False
    details: Optional[Dict[str, Any]] = None

# Pre-defined synthetic Taglish demo script for fallback/offline testing
SYNTHETIC_SAMPLE_TAGLISH = (
    "Si Tatay Ruben, 65 years old, taga Sitio Kawayan. Masakit daw ang batok at nahihilo "
    "since kahapon. Ang BP niya kanina 150 over 95, medyo mataas. Temperature 37.1 degrees, "
    "pulse rate 82. Binigyan ko muna ng paracetamol at pinayuhang magpahinga at uminom ng tubig. "
    "Sinabihan ko siya na magpunta sa Rural Health Unit kay Doc Santos bukas ng alas otso ng umaga "
    "para ma-check ang hypertension at mabigyan ng regular na maintenance. Babalikan ko sa Biyernes."
)

def transcribe_audio(wav_path: Path, language: str = "tl") -> TranscriptionResult:
    """
    Transcribes audio using local whisper-cli with Philippine Taglish vocabulary priming.
    Forces Tagalog ('tl') language head by default to prevent English phonetic corruption.
    """
    whisper_exe = config.models.whisper_bin
    model_path = config.models.whisper_model
    prompt = config.models.whisper_initial_prompt

    start_time = time.perf_counter()

    # Check if local whisper binary and model exist
    if not (whisper_exe.exists() and model_path.exists()):
        raise FileNotFoundError(
            f"Local Whisper binary ({whisper_exe}) or model ({model_path}) not found. "
            "Please ensure bin/whisper-cli.exe and models/ exist."
        )

    # Force Tagalog language head for Taglish medical dictation
    active_language = "tl" if (language in ["auto", "tl", None, ""]) else language

    # Build command line for whisper-cli with beam search
    cmd = [
        str(whisper_exe),
        "-m", str(model_path),
        "-f", str(wav_path),
        "-l", active_language,
        "--prompt", prompt,
        "-bs", "4",
        "-nt",
    ]

    try:
        proc = subprocess.run(
            cmd,
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            text=True,
            encoding="utf-8",
            errors="replace",
            timeout=60,
            check=True,
        )
        elapsed = int((time.perf_counter() - start_time) * 1000)
        raw_text = proc.stdout.strip()

        # Clean output text
        clean_text = " ".join(line.strip() for line in raw_text.splitlines() if line.strip())

        return TranscriptionResult(
            transcript=clean_text or raw_text,
            elapsed_ms=elapsed,
            language=language,
            is_sample_fallback=False,
            details={"returncode": proc.returncode},
        )
    except subprocess.TimeoutExpired:
        raise TimeoutError("Whisper transcription timed out after 60 seconds.")
    except subprocess.CalledProcessError as e:
        raise RuntimeError(f"whisper-cli failed (exit code {e.returncode}): {e.stderr}")
    finally:
        # Privacy guardrail: delete audio unless keep_audio is True
        if not config.storage.keep_audio and wav_path.exists():
            try:
                wav_path.unlink()
            except Exception:
                pass
