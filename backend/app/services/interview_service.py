from typing import List
from sqlalchemy.orm import Session
from fastapi import HTTPException
from app.models.interview import InterviewRound, Assessment
from app.models.application import Application
from app.schemas.interview import InterviewRoundCreate, InterviewRoundUpdate, AssessmentCreate, AssessmentUpdate

class InterviewService:
    def __init__(self, db: Session):
        self.db = db

    def _verify_application_ownership(self, application_id: int, user_id: int) -> Application:
        app = self.db.query(Application).filter(Application.id == application_id, Application.user_id == user_id).first()
        if not app:
            raise HTTPException(status_code=404, detail="Application not found or unauthorized")
        return app

    # --- InterviewRound ---

    def get_interview_round(self, round_id: int, user_id: int) -> InterviewRound:
        db_round = self.db.query(InterviewRound).filter(InterviewRound.id == round_id).first()
        if not db_round:
            raise HTTPException(status_code=404, detail="Interview round not found")
        # Verify ownership through the linked application
        self._verify_application_ownership(db_round.application_id, user_id)
        return db_round

    def list_interview_rounds(self, application_id: int, user_id: int, skip: int = 0, limit: int = 100) -> List[InterviewRound]:
        self._verify_application_ownership(application_id, user_id)
        return (
            self.db.query(InterviewRound)
            .filter(InterviewRound.application_id == application_id)
            .order_by(InterviewRound.created_at.asc())
            .offset(skip)
            .limit(limit)
            .all()
        )

    def create_interview_round(self, round_in: InterviewRoundCreate, user_id: int) -> InterviewRound:
        self._verify_application_ownership(round_in.application_id, user_id)
        db_round = InterviewRound(**round_in.model_dump())
        self.db.add(db_round)
        self.db.commit()
        self.db.refresh(db_round)
        return db_round

    def delete_interview_round(self, round_id: int, user_id: int) -> None:
        db_round = self.get_interview_round(round_id, user_id)  # raises 404 and verifies ownership
        self.db.delete(db_round)
        self.db.commit()

    # --- Assessment ---

    def get_assessment(self, assessment_id: int, user_id: int) -> Assessment:
        db_assessment = self.db.query(Assessment).filter(Assessment.id == assessment_id).first()
        if not db_assessment:
            raise HTTPException(status_code=404, detail="Assessment not found")
        self._verify_application_ownership(db_assessment.application_id, user_id)
        return db_assessment

    def list_assessments(self, application_id: int, user_id: int, skip: int = 0, limit: int = 100) -> List[Assessment]:
        self._verify_application_ownership(application_id, user_id)
        return (
            self.db.query(Assessment)
            .filter(Assessment.application_id == application_id)
            .order_by(Assessment.created_at.asc())
            .offset(skip)
            .limit(limit)
            .all()
        )

    def create_assessment(self, assessment_in: AssessmentCreate, user_id: int) -> Assessment:
        self._verify_application_ownership(assessment_in.application_id, user_id)
        db_assessment = Assessment(**assessment_in.model_dump())
        self.db.add(db_assessment)
        self.db.commit()
        self.db.refresh(db_assessment)
        return db_assessment

    def delete_assessment(self, assessment_id: int, user_id: int) -> None:
        db_assessment = self.get_assessment(assessment_id, user_id)  # raises 404 and verifies ownership
        self.db.delete(db_assessment)
        self.db.commit()

