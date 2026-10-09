import time
from typing import Dict, Any, List
from pathlib import Path

def generate_checklist_text(visit_data: Dict[str, Any]) -> str:
    """
    Generates plain-text BHW action checklist (Talaan ng Gawain) from confirmed visit record.
    """
    patient = visit_data.get("patient_label", "Patient")
    location = visit_data.get("location", "Not specified")
    follow_up = visit_data.get("follow_up", [])
    referral = visit_data.get("referral")
    date_str = visit_data.get("saved_at", time.strftime("%Y-%m-%d"))

    lines = [
        "============================================================",
        " OFFLINEDOC: TALAAN NG GAWAIN (BHW FOLLOW-UP CHECKLIST)",
        "============================================================",
        f"Pasyente (Patient): {patient}",
        f"Lugar (Location)   : {location}",
        f"Petsa (Date)       : {date_str}",
        "------------------------------------------------------------",
        "MGA DAPAT BALIKAN (SCHEDULED FOLLOW-UP TASKS):",
    ]

    if not follow_up:
        lines.append("[ ] 1. Regular community health monitoring")
    else:
        for idx, item in enumerate(follow_up, 1):
            task = item.get("task", "Follow-up")
            due = item.get("due", "As scheduled")
            lines.append(f"[ ] {idx}. {task} (Target: {due})")

    if referral:
        facility = referral.get("facility", "Health Center")
        urgency = referral.get("urgency", "routine").upper()
        reason = referral.get("reason", "Medical evaluation")
        lines.extend([
            "------------------------------------------------------------",
            f"REFERRAL FOLLOW-UP [{urgency}]:",
            f"[ ] Verify attendance at {facility} for: {reason}",
        ])

    lines.extend([
        "------------------------------------------------------------",
        "Pangalan ng BHW (Health Worker Signature): ____________________",
        "Tandaan: 100% On-Device Record. Ligtas at Kumpidensyal.",
        "============================================================",
    ])

    return "\n".join(lines)
