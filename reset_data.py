"""Delete all locally stored patients, visits and PDF exports (data/).

Usage:  python reset_data.py
Restart the server afterwards so the home screen reloads an empty directory.
Does not touch models/, bin/ or the Whisper cache.
"""
import shutil
from pathlib import Path

DATA_DIR = Path(__file__).parent / "data"

if __name__ == "__main__":
    removed = 0
    for sub in ["patients", "visits", "pdf_exports"]:
        d = DATA_DIR / sub
        if d.exists():
            removed += sum(1 for _ in d.iterdir())
            shutil.rmtree(d)
        d.mkdir(parents=True, exist_ok=True)
    print(f"[OfflineDoc] Cleared {removed} stored record(s) from {DATA_DIR}. Restart the server.")
