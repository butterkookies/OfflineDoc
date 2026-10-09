from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field

class Vitals(BaseModel):
    bp: Optional[str] = Field(None, description="Blood pressure string e.g. '120/80' or null if unmentioned")
    temp_c: Optional[float] = Field(None, description="Body temperature in Celsius e.g. 37.5 or null")
    pulse_bpm: Optional[int] = Field(None, description="Pulse / heart rate in beats per minute or null")
    resp_rate: Optional[int] = Field(None, description="Respiratory rate breaths per minute or null")
    weight_kg: Optional[float] = Field(None, description="Weight in kilograms or null")

class FollowUpItem(BaseModel):
    task: str = Field(..., description="Actionable follow-up task e.g. 'Re-check blood pressure'")
    due: Optional[str] = Field(None, description="Timeframe or day e.g. 'Friday' or '2 days'")

class ReferralInfo(BaseModel):
    facility: Optional[str] = Field(None, description="Target healthcare facility e.g. 'Rural Health Unit', 'RHU Doctor'")
    reason: Optional[str] = Field(None, description="Clinical reason for referral e.g. 'Hypertension triage'")
    urgency: Optional[str] = Field(None, description="'routine', 'urgent', or 'immediate'")

class ClinicalVisitRecord(BaseModel):
    patient_label: Optional[str] = Field(None, description="Patient name, alias, or initials")
    visit_date: Optional[str] = Field(None, description="ISO date YYYY-MM-DD or null")
    location: Optional[str] = Field(None, description="Barangay, sitio, or purok")
    age_years: Optional[int] = Field(None, description="Patient age in years")
    sex: Optional[str] = Field(None, description="'female', 'male', or null")
    chief_complaint: Optional[str] = Field(None, description="Standardized English clinical complaint")
    symptoms: List[str] = Field(default_factory=list, description="List of standardized symptoms")
    vitals: Vitals = Field(default_factory=Vitals)
    medications_given: List[str] = Field(default_factory=list, description="Medications given or verified")
    advice_given: List[str] = Field(default_factory=list, description="Self-care advice or lifestyle instructions")
    follow_up: List[FollowUpItem] = Field(default_factory=list, description="Scheduled follow-up checklist items")
    referral: Optional[ReferralInfo] = Field(None, description="Referral details if patient referred to RHU/physician")
    evidence: Dict[str, Optional[str]] = Field(
        default_factory=dict,
        description="Map of field name to exact verbatim Taglish quote from transcript"
    )

def get_visit_json_schema() -> Dict[str, Any]:
    """
    Returns the JSON Schema dictionary suitable for llama-server response_format.
    """
    return ClinicalVisitRecord.model_json_schema()
