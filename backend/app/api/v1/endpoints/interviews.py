from typing import Any
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.api import deps
from app.schemas.interview import InterviewRoundCreate, InterviewRound, AssessmentCreate, Assessment
from app.services.interview_service import InterviewService
from app.models.user import User

router = APIRouter()

@router.post("/rounds", response_model=InterviewRound)
def create_interview_round(
    *,
    db: Session = Depends(deps.get_db),
    round_in: InterviewRoundCreate,
    current_user: User = Depends(deps.get_current_active_user),
) -> Any:
    """
    Create a new interview round.
    """
    interview_service = InterviewService(db)
    return interview_service.create_interview_round(round_in=round_in, user_id=current_user.id)

@router.post("/assessments", response_model=Assessment)
def create_assessment(
    *,
    db: Session = Depends(deps.get_db),
    assessment_in: AssessmentCreate,
    current_user: User = Depends(deps.get_current_active_user),
) -> Any:
    """
    Create a new assessment.
    """
    interview_service = InterviewService(db)
    return interview_service.create_assessment(assessment_in=assessment_in, user_id=current_user.id)
