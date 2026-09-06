from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field

class VitalSignsInput(BaseModel):
    systolic_bp: Optional[int] = Field(None, description="Systolic Blood Pressure in mmHg")
    diastolic_bp: Optional[int] = Field(None, description="Diastolic Blood Pressure in mmHg")
    pulse_rate: Optional[int] = Field(None, description="Pulse in beats per minute")
    spo2: Optional[float] = Field(None, description="Oxygen Saturation percentage")
    temperature: Optional[float] = Field(None, description="Body Temperature in Fahrenheit")

class TriageRequest(BaseModel):
    symptoms: List[str] = Field(..., description="List of symptoms reported by the patient", example=["fever", "chest pain"])
    severity: int = Field(..., ge=1, le=10, description="Self-reported severity scale from 1 (mild) to 10 (unbearable)", example=8)
    duration: str = Field(..., description="Duration of symptom onset, e.g., '2 hours', '3 days'", example="2 hours")
    age: int = Field(..., ge=0, le=125, description="Patient age in years", example=45)
    vital_signs: Optional[VitalSignsInput] = None
    patient_id: Optional[str] = None

class TriageResponse(BaseModel):
    priority: str = Field(..., description="Triage category: EMERGENCY, URGENT, or ROUTINE", example="EMERGENCY")
    score: int = Field(..., ge=0, le=100, description="Calculated urgency score 0-100", example=95)
    recommended_action: str = Field(..., description="Actionable directive for the patient or health worker", example="Seek emergency medical care immediately")
    route: str = Field(..., description="Recommended care routing: '108', 'HOSPITAL_EMERGENCY', 'PHC_VISIT', 'HOME_CARE'", example="108")
    matched_rules: List[str] = Field(default_factory=list, description="List of medical safety rules matched during evaluation")
    disclaimer: str = Field(
        default="This is a triage aid and not a medical diagnosis. If you feel your life is in danger, dial 108 or proceed to the nearest hospital immediately.",
        description="Mandatory statutory medical safety disclaimer"
    )
    red_flag_alert: bool = Field(default=False, description="Flag indicating urgent life-threat requiring immediate dispatch")
