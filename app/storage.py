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
    Supports creating new or updating existing visit_id in place.
    """
    if not visit_id:
        visit_id = visit_data.get("visit_id")

    if not visit_id:
        timestamp_str = time.strftime("%Y%m%d_%H%M%S")
        short_id = uuid.uuid4().hex[:6]
        visit_id = f"visit_{timestamp_str}_{short_id}"

    record = dict(visit_data)
    record["visit_id"] = visit_id
    if "saved_at" not in record or not record["saved_at"]:
        record["saved_at"] = time.strftime("%Y-%m-%dT%H:%M:%S")
    else:
        record["updated_at"] = time.strftime("%Y-%m-%dT%H:%M:%S")

    file_path = config.storage.data_dir / f"{visit_id}.json"
    with open(file_path, "w", encoding="utf-8") as f:
        json.dump(record, f, indent=2, ensure_ascii=False)

    return visit_id

def get_visit(visit_id: str) -> Optional[Dict[str, Any]]:
    """
    Loads a visit JSON file by its visit_id or filename stem.
    """
    clean_id = visit_id.replace(".json", "").strip()
    file_path = config.storage.data_dir / f"{clean_id}.json"
    if file_path.exists():
        with open(file_path, "r", encoding="utf-8") as f:
            return json.load(f)

    # Search in visits folder if exact path not found
    for p in config.storage.data_dir.glob("*.json"):
        if p.stem == clean_id:
            with open(p, "r", encoding="utf-8") as f:
                return json.load(f)

    return None

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
                has_photo = bool(data.get("image_attachment"))
                triage_level = data.get("triage_level") or ("urgent" if has_ref else "routine")
                alerts = data.get("alerts") or []
                pdf_url = f"/api/export/{vid}.pdf"
                visits.append({
                    "visit_id": vid,
                    "patient_label": data.get("patient_label") or "Hindi pinangalanan",
                    "saved_at": data.get("saved_at", ""),
                    "location": data.get("location") or "",
                    "chief_complaint": data.get("chief_complaint") or "",
                    "symptoms": data.get("symptoms") or [],
                    "bp": data.get("vitals", {}).get("bp"),
                    "temp_c": data.get("vitals", {}).get("temp_c"),
                    "pulse_bpm": data.get("vitals", {}).get("pulse_bpm"),
                    "medications_given": data.get("medications_given") or [],
                    "advice_given": data.get("advice_given") or [],
                    "triage_level": triage_level,
                    "alerts": alerts,
                    "has_referral": has_ref,
                    "referral": data.get("referral"),
                    "referral_facility": data.get("referral", {}).get("facility") if has_ref else None,
                    "has_photo": has_photo,
                    "image_caption": data.get("image_caption"),
                    "follow_up": data.get("follow_up", []),
                    "pdf_url": pdf_url,
                    "visit_pdf": pdf_url,
                    "referral_pdf": pdf_url if has_ref else None,
                })
        except Exception:
            continue
    return visits
