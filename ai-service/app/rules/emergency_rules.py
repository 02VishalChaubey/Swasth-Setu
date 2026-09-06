"""
Swasth Setu AI Triage Engine - Emergency Red Flag Rules
These represent life-threatening criteria that immediately trigger EMERGENCY (Priority Score 90-100)
and route to Ambulance '108' or Hospital Emergency Department.
"""

EMERGENCY_RULES = [
    {
        "id": "EMERG-001",
        "name": "Severe Chest Pain / Acute Coronary Syndrome",
        "keywords": ["chest pain", "angina", "pressure on chest", "left arm pain", "heart attack", "crushing chest"],
        "min_severity": 6,
        "action": "Call Ambulance 108 immediately. Keep patient seated upright and resting. Do not attempt self-drive.",
        "route": "108",
        "score": 95,
        "vital_triggers": lambda v: (v.spo2 is not None and v.spo2 < 90) or (v.pulse_rate is not None and (v.pulse_rate > 140 or v.pulse_rate < 40))
    },
    {
        "id": "EMERG-002",
        "name": "Acute Respiratory Distress / Hypoxia",
        "keywords": ["difficulty breathing", "severe shortness of breath", "can't breathe", "choking", "gasping", "cyanosis", "blue lips"],
        "min_severity": 7,
        "action": "Immediate emergency oxygenation required. Call 108 or transfer to nearest District Hospital ICU.",
        "route": "108",
        "score": 95,
        "vital_triggers": lambda v: v.spo2 is not None and v.spo2 < 92
    },
    {
        "id": "EMERG-003",
        "name": "Stroke-Like Symptoms (FAST protocol)",
        "keywords": ["facial droop", "slurred speech", "arm weakness", "sudden paralysis", "stroke", "numbness one side", "loss of vision sudden"],
        "min_severity": 5,
        "action": "Potential acute ischemic stroke. Rapid transit within 3-hour window critical. Dial 108.",
        "route": "108",
        "score": 98,
        "vital_triggers": lambda v: v.systolic_bp is not None and v.systolic_bp > 200
    },
    {
        "id": "EMERG-004",
        "name": "Venomous Snake Bite",
        "keywords": ["snake bite", "snakebite", "fang marks", "cobra", "viper", "krait"],
        "min_severity": 1, # Any snake bite is emergency in rural India
        "action": "Immobilize limb at heart level. Do not cut or apply tourniquet. Proceed to PHC with Anti-Snake Venom (ASV).",
        "route": "108",
        "score": 95,
        "vital_triggers": None
    },
    {
        "id": "EMERG-005",
        "name": "Severe Uncontrolled Bleeding / Hemorrhage",
        "keywords": ["severe bleeding", "arterial bleeding", "hemorrhage", "vomiting blood", "coughing blood", "blood in vomit"],
        "min_severity": 6,
        "action": "Apply direct firm pressure with sterile gauze. Call 108 or nearest emergency trauma post.",
        "route": "108",
        "score": 92,
        "vital_triggers": lambda v: v.systolic_bp is not None and v.systolic_bp < 80
    },
    {
        "id": "EMERG-006",
        "name": "Altered Mental Status / Coma / Seizure Ongoing",
        "keywords": ["unconscious", "unresponsive", "fainting", "syncope", "active seizure", "convulsions"],
        "min_severity": 7,
        "action": "Turn into recovery position to protect airway. Do not put anything in mouth. Call 108.",
        "route": "108",
        "score": 96,
        "vital_triggers": None
    },
    {
        "id": "EMERG-007",
        "name": "Severe Anaphylaxis / Allergic Airway Occlusion",
        "keywords": ["anaphylaxis", "throat swelling", "tongue swelling", "can't swallow", "severe bee sting"],
        "min_severity": 7,
        "action": "Use epinephrine auto-injector if available. Immediate 108 ambulance transfer.",
        "route": "108",
        "score": 95,
        "vital_triggers": None
    }
]
