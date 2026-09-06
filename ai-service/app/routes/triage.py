from fastapi import APIRouter, HTTPException, status
from app.models.schemas import TriageRequest, TriageResponse
from app.services.triage_engine import TriageEngine

router = APIRouter(prefix="/triage", tags=["Digital Triage & Urgency Scoring"])
engine = TriageEngine()

@router.post("/evaluate", response_model=TriageResponse, summary="Evaluate symptoms against clinical triage safety rules")
async def evaluate_symptoms(request: TriageRequest):
    """
    Evaluates patient symptoms against predetermined emergency and triage rules.
    Outputs priority (EMERGENCY, URGENT, ROUTINE), score, and safe routing guidance.
    """
    try:
        response = engine.evaluate(request)
        return response
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Triage evaluation error: {str(e)}"
        )

@router.get("/rules", summary="Retrieve active clinical triage rule catalog")
async def get_triage_rules():
    """
    Returns the metadata of all loaded emergency, urgent, and routine clinical rules.
    """
    return {
        "emergency_rules_count": len(engine.emergency_rules),
        "urgent_rules_count": len(engine.urgent_rules),
        "routine_rules_count": len(engine.routine_rules),
        "disclaimer": "All rules are guidance only and strictly non-diagnostic."
    }
