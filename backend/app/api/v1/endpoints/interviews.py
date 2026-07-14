from typing import Any, List
from fastapi import APIRouter, Depends, Response, status
from sqlalchemy.orm import Session
from app.api import deps
from app.schemas.interview import InterviewRoundCreate, InterviewRound, AssessmentCreate, Assessment
from app.services.interview_service import InterviewService
from app.models.user import User

router = APIRouter()

# --- Interview Rounds ---

@router.get("/rounds/", response_model=List[InterviewRound])
def list_interview_rounds(
    *,
    db: Session = Depends(deps.get_db),
    application_id: int,
    skip: int = 0,
    limit: int = 100,
    current_user: User = Depends(deps.get_current_active_user),
) -> Any:
    """List all interview rounds for a given application (owned by current user)."""
    interview_service = InterviewService(db)
    return interview_service.list_interview_rounds(
        application_id=application_id, user_id=current_user.id, skip=skip, limit=limit
    )

@router.post("/rounds/", response_model=InterviewRound)
def create_interview_round(
    *,
    db: Session = Depends(deps.get_db),
    round_in: InterviewRoundCreate,
    current_user: User = Depends(deps.get_current_active_user),
) -> Any:
    """Create a new interview round."""
    interview_service = InterviewService(db)
    return interview_service.create_interview_round(round_in=round_in, user_id=current_user.id)

@router.get("/rounds/{id}", response_model=InterviewRound)
def read_interview_round(
    *,
    db: Session = Depends(deps.get_db),
    id: int,
    current_user: User = Depends(deps.get_current_active_user),
) -> Any:
    """Get an interview round by ID."""
    interview_service = InterviewService(db)
    return interview_service.get_interview_round(round_id=id, user_id=current_user.id)

@router.delete("/rounds/{id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_interview_round(
    *,
    db: Session = Depends(deps.get_db),
    id: int,
    current_user: User = Depends(deps.get_current_active_user),
) -> Response:
    """Delete an interview round. Returns 404 if not found or not owned."""
    interview_service = InterviewService(db)
    interview_service.delete_interview_round(round_id=id, user_id=current_user.id)
    return Response(status_code=status.HTTP_204_NO_CONTENT)

# --- Assessments ---

@router.get("/assessments/", response_model=List[Assessment])
def list_assessments(
    *,
    db: Session = Depends(deps.get_db),
    application_id: int,
    skip: int = 0,
    limit: int = 100,
    current_user: User = Depends(deps.get_current_active_user),
) -> Any:
    """List all assessments for a given application (owned by current user)."""
    interview_service = InterviewService(db)
    return interview_service.list_assessments(
        application_id=application_id, user_id=current_user.id, skip=skip, limit=limit
    )

@router.post("/assessments/", response_model=Assessment)
def create_assessment(
    *,
    db: Session = Depends(deps.get_db),
    assessment_in: AssessmentCreate,
    current_user: User = Depends(deps.get_current_active_user),
) -> Any:
    """Create a new assessment."""
    interview_service = InterviewService(db)
    return interview_service.create_assessment(assessment_in=assessment_in, user_id=current_user.id)

@router.get("/assessments/{id}", response_model=Assessment)
def read_assessment(
    *,
    db: Session = Depends(deps.get_db),
    id: int,
    current_user: User = Depends(deps.get_current_active_user),
) -> Any:
    """Get an assessment by ID."""
    interview_service = InterviewService(db)
    return interview_service.get_assessment(assessment_id=id, user_id=current_user.id)

@router.delete("/assessments/{id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_assessment(
    *,
    db: Session = Depends(deps.get_db),
    id: int,
    current_user: User = Depends(deps.get_current_active_user),
) -> Response:
    """Delete an assessment. Returns 404 if not found or not owned."""
    interview_service = InterviewService(db)
    interview_service.delete_assessment(assessment_id=id, user_id=current_user.id)
    return Response(status_code=status.HTTP_204_NO_CONTENT)
