import json
import time
import uuid
from pathlib import Path
from typing import Dict, Any, Optional, List

from app.config import config

def save_visit(visit_data: Dict[str, Any], visit_id: Optional[str] = None) -> str:
    """
    Persists a confirmed clinical visit record as a single JSON file in data/visits/.
    Zero database. Completely offline and file-based.
    """
    if not visit_id:
        timestamp_str = time.strftime("%Y%m%d_%H%M%S")
        short_id = uuid.uuid4().hex[:6]
        visit_id = f"visit_{timestamp_str}_{short_id}"

    record = dict(visit_data)
    record["visit_id"] = visit_id
    record["saved_at"] = time.strftime("%Y-%m-%dT%H:%M:%S")

    file_path = config.storage.data_dir / f"{visit_id}.json"
    with open(file_path, "w", encoding="utf-8") as f:
        json.dump(record, f, indent=2, ensure_ascii=False)

    return visit_id

def get_visit(visit_id: str) -> Optional[Dict[str, Any]]:
    """
    Loads a visit JSON file by its visit_id.
    """
    file_path = config.storage.data_dir / f"{visit_id}.json"
    if not file_path.exists():
        return None

    with open(file_path, "r", encoding="utf-8") as f:
        return json.load(f)

def list_visits() -> List[Dict[str, Any]]:
    """
    Lists recent visits for the BHW digital logbook and follow-up tracking.
    """
    visits = []
    for p in sorted(config.storage.data_dir.glob("*.json"), reverse=True):
        try:
            with open(p, "r", encoding="utf-8") as f:
                data = json.load(f)
                vid = data.get("visit_id", p.stem)
                has_ref = data.get("referral") is not None
                visits.append({
                    "visit_id": vid,
                    "patient_label": data.get("patient_label") or "Hindi pinangalanan",
                    "saved_at": data.get("saved_at", ""),
                    "location": data.get("location") or "",
                    "chief_complaint": data.get("chief_complaint") or "",
                    "bp": data.get("vitals", {}).get("bp"),
                    "temp_c": data.get("vitals", {}).get("temp_c"),
                    "has_referral": has_ref,
                    "referral_facility": data.get("referral", {}).get("facility") if has_ref else None,
                    "follow_up": data.get("follow_up", []),
                    "visit_pdf": f"/api/export/{vid}_visit.pdf",
                    "referral_pdf": f"/api/export/{vid}_referral.pdf" if has_ref else None,
                    "checklist_txt": f"/api/export/{vid}_checklist.txt",
                })
        except Exception:
            continue
    return visits
