"""
Swasth Setu AI Triage Engine - Routine Rules
Mild conditions suitable for scheduled Primary Health Centre outpatient consultation,
teleconsultation, or ASHA worker home review (Priority Score 10-49).
"""

ROUTINE_RULES = [
    {
        "id": "ROUT-001",
        "name": "Mild Upper Respiratory Tract Infection / Seasonal Cold",
        "keywords": ["cold", "cough", "runny nose", "sneezing", "mild sore throat", "nasal congestion"],
        "min_severity": 1,
        "action": "Rest, maintain adequate warm fluid intake, steam inhalation. Book outpatient appointment at local PHC if symptoms persist >5 days.",
        "route": "PHC_VISIT",
        "score": 25,
        "vital_triggers": None
    },
    {
        "id": "ROUT-002",
        "name": "Mild Musculoskeletal Strain / Backache",
        "keywords": ["body pain", "back pain", "muscle ache", "shoulder ache", "joint stiffness"],
        "min_severity": 1,
        "action": "Warm compress, ergonomic rest, and scheduled consultation with PHC General Physician.",
        "route": "PHC_VISIT",
        "score": 30,
        "vital_triggers": None
    },
    {
        "id": "ROUT-003",
        "name": "Superficial Skin Rash / Minor Allergy",
        "keywords": ["skin rash", "itching", "pruritus", "minor boil", "fungal infection"],
        "min_severity": 1,
        "action": "Keep area clean and dry. Schedule visit with PHC doctor or consult local ASHA worker.",
        "route": "PHC_VISIT",
        "score": 20,
        "vital_triggers": None
    },
    {
        "id": "ROUT-004",
        "name": "Routine Follow-up / Prescription Refill",
        "keywords": ["medicine refill", "routine checkup", "bp check", "sugar check", "hypertension check"],
        "min_severity": 1,
        "action": "Schedule a routine visit at your village sub-centre or primary health centre.",
        "route": "PHC_VISIT",
        "score": 15,
        "vital_triggers": None
    }
]
