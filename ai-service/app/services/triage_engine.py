from typing import List, Tuple
from app.models.schemas import TriageRequest, TriageResponse
from app.rules.emergency_rules import EMERGENCY_RULES
from app.rules.urgent_rules import URGENT_RULES
from app.rules.routine_rules import ROUTINE_RULES

class TriageEngine:
    """
    Deterministic rule-based clinical triage engine for Swasth Setu.
    Classifies patient urgency into EMERGENCY, URGENT, or ROUTINE.
    Does NOT diagnose medical conditions.
    """

    def __init__(self):
        self.emergency_rules = EMERGENCY_RULES
        self.urgent_rules = URGENT_RULES
        self.routine_rules = ROUTINE_RULES

    def _normalize_symptoms(self, symptoms: List[str]) -> str:
        return " ".join([s.strip().lower() for s in symptoms])

    def evaluate(self, request: TriageRequest) -> TriageResponse:
        symptom_text = self._normalize_symptoms(request.symptoms)
        severity = request.severity
        vitals = request.vital_signs

        matched_rules = []
        highest_priority = "ROUTINE"
        max_score = 15
        recommended_action = "Visit your nearest Primary Health Centre (PHC) for a general medical examination."
        care_route = "PHC_VISIT"
        is_red_flag = False

        # 1. Evaluate EMERGENCY Rules first (Priority: 90-100)
        for rule in self.emergency_rules:
            keyword_match = any(kw in symptom_text for kw in rule["keywords"])
            vital_match = rule["vital_triggers"](vitals) if (rule["vital_triggers"] and vitals) else False

            # Emergency triggered if keywords matched and severity >= threshold OR vital emergency trigger fired
            if (keyword_match and severity >= rule["min_severity"]) or vital_match:
                matched_rules.append(f"EMERGENCY: {rule['name']}")
                highest_priority = "EMERGENCY"
                max_score = max(max_score, rule["score"])
                recommended_action = rule["action"]
                care_route = rule["route"]
                is_red_flag = True
                break

        # 2. If not emergency, evaluate URGENT Rules (Priority: 50-89)
        if highest_priority != "EMERGENCY":
            for rule in self.urgent_rules:
                keyword_match = any(kw in symptom_text for kw in rule["keywords"])
                vital_match = rule["vital_triggers"](vitals) if (rule["vital_triggers"] and vitals) else False

                if (keyword_match and severity >= rule["min_severity"]) or vital_match:
                    matched_rules.append(f"URGENT: {rule['name']}")
                    highest_priority = "URGENT"
                    max_score = max(max_score, rule["score"])
                    recommended_action = rule["action"]
                    care_route = rule["route"]
                    break

        # 3. If neither, evaluate ROUTINE Rules or high self-reported severity override
        if highest_priority not in ["EMERGENCY", "URGENT"]:
            for rule in self.routine_rules:
                if any(kw in symptom_text for kw in rule["keywords"]):
                    matched_rules.append(f"ROUTINE: {rule['name']}")
                    max_score = max(max_score, rule["score"])
                    recommended_action = rule["action"]
                    care_route = rule["route"]
                    break

            # If user entered an uncatalogued symptom but reported high severity (8-10), escalate to URGENT
            if severity >= 8:
                highest_priority = "URGENT"
                max_score = max(max_score, 70)
                recommended_action = "Severe discomfort reported. Please visit your nearest health facility for an urgent evaluation."
                care_route = "PHC_VISIT"
                matched_rules.append("ESCALATION: High self-reported severity rating")
            elif not matched_rules:
                matched_rules.append("STANDARD: General outpatient evaluation")
                max_score = 30

        # Adjust score slightly based on age vulnerability (infants <2 yrs, seniors >65 yrs)
        if request.age < 2 or request.age > 65:
            max_score = min(100, max_score + 5)

        return TriageResponse(
            priority=highest_priority,
            score=max_score,
            recommended_action=recommended_action,
            route=care_route,
            matched_rules=matched_rules,
            disclaimer="This is a triage aid and not a medical diagnosis. If you feel your life is in danger, dial 108 or proceed to the nearest hospital immediately.",
            red_flag_alert=is_red_flag
        )
