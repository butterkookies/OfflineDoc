import math
import struct
import wave
from pathlib import Path
from dataclasses import dataclass
from typing import BinaryIO, Union

@dataclass
class AudioValidationResult:
    is_valid: bool
    duration_seconds: float
    sample_rate: int
    channels: int
    rms_volume: float
    message: str = "Valid audio recording"

def validate_wav_file(file_path: Union[str, Path], min_duration: float = 2.0, silence_threshold: float = 0.002) -> AudioValidationResult:
    """
    Validates a WAV audio file for:
    - Proper WAV structure and RIFF header
    - Minimum duration (>= 2 seconds)
    - Non-silent audio content (RMS volume threshold)
    """
    path = Path(file_path)
    if not path.exists():
        raise FileNotFoundError(f"Audio file not found: {path}")

    try:
        with wave.open(str(path), "rb") as wf:
            channels = wf.getnchannels()
            sample_rate = wf.getframerate()
            sample_width = wf.getsampwidth()
            num_frames = wf.getnframes()

            if sample_width != 2:
                # 16-bit PCM expected
                pass

            duration = num_frames / float(sample_rate) if sample_rate > 0 else 0.0

            if duration < min_duration:
                raise ValueError(
                    f"Recording is too short ({duration:.1f}s). Minimum required duration is {min_duration:.1f} seconds."
                )

            # Read frames to check RMS volume
            raw_frames = wf.readframes(min(num_frames, sample_rate * 5)) # sample first 5s
            if not raw_frames:
                raise ValueError("Audio recording contains no audio frames.")

            # Calculate RMS for 16-bit PCM
            count = len(raw_frames) // 2
            if count == 0:
                raise ValueError("Audio recording is empty.")

            format_str = f"<{count}h"
            samples = struct.unpack(format_str, raw_frames[:count * 2])
            sum_squares = sum(s * s for s in samples)
            rms = math.sqrt(sum_squares / count) / 32768.0

            if rms < silence_threshold:
                raise ValueError(
                    "Audio recording is completely silent. Please ensure microphone permissions are granted and speak clearly."
                )

            return AudioValidationResult(
                is_valid=True,
                duration_seconds=round(duration, 2),
                sample_rate=sample_rate,
                channels=channels,
                rms_volume=round(rms, 4),
                message="Valid audio recording",
            )

    except wave.Error as e:
        raise ValueError(f"Invalid WAV audio format: {str(e)}")
