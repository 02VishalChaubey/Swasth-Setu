"""
Swasth Setu AI Triage Engine - Urgent Rules
These represent conditions requiring evaluation within 12-24 hours at a Community Health Centre (CHC)
or District Hospital (Priority Score 50-89).
"""

URGENT_RULES = [
    {
        "id": "URG-001",
        "name": "Prolonged High Fever (>3 Days) / Suspected Dengue or Malaria",
        "keywords": ["high fever", "continuous fever", "chills and rigors", "shivering", "fever with rash", "joint pain severe"],
        "min_severity": 5,
        "action": "Visit nearest Primary or Community Health Centre today for NS1/Malaria rapid diagnostic test and complete blood count.",
        "route": "PHC_VISIT",
        "score": 75,
        "vital_triggers": lambda v: v.temperature is not None and v.temperature >= 102.5
    },
    {
        "id": "URG-002",
        "name": "Acute Abdominal Pain / Suspected Appendicitis or Cholecystitis",
        "keywords": ["stomach pain", "severe abdominal pain", "right lower quadrant pain", "vomiting with stomach pain"],
        "min_severity": 6,
        "action": "Avoid eating solid foods or taking strong analgesics without doctor order. Report to Community Health Centre.",
        "route": "HOSPITAL_EMERGENCY",
        "score": 70,
        "vital_triggers": None
    },
    {
        "id": "URG-003",
        "name": "Dehydration with Inability to Retain Fluids",
        "keywords": ["persistent vomiting", "loose motion severe", "diarrhea frequent", "sunken eyes", "extreme thirst", "no urination"],
        "min_severity": 5,
        "action": "Administer Oral Rehydration Solution (ORS) in sips. Transfer to PHC for IV fluid rehydration.",
        "route": "PHC_VISIT",
        "score": 65,
        "vital_triggers": None
    },
    {
        "id": "URG-004",
        "name": "Suspected Bone Fracture / Deep Laceration",
        "keywords": ["fracture", "broken bone", "bone deformed", "deep cut", "unable to walk", "heavy swelling"],
        "min_severity": 5,
        "action": "Splint the injured limb. Do not massage. Transfer to District Hospital for X-ray and orthopedic splinting.",
        "route": "HOSPITAL_EMERGENCY",
        "score": 68,
        "vital_triggers": None
    },
    {
        "id": "URG-005",
        "name": "Hypertensive Urgency / Blood Pressure Spike",
        "keywords": ["headache severe", "blurred vision", "dizziness severe", "high blood pressure"],
        "min_severity": 6,
        "action": "Visit nearest health centre for immediate BP evaluation and physician dose adjustment.",
        "route": "PHC_VISIT",
        "score": 72,
        "vital_triggers": lambda v: v.systolic_bp is not None and v.systolic_bp >= 170
    }
]
