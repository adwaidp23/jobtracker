from sqlalchemy.orm import Session
from fastapi import HTTPException
from app.models.interview import InterviewRound, Assessment
from app.models.application import Application
from app.schemas.interview import InterviewRoundCreate, AssessmentCreate

class InterviewService:
    def __init__(self, db: Session):
        self.db = db

    def _verify_application_ownership(self, application_id: int, user_id: int):
        app = self.db.query(Application).filter(Application.id == application_id, Application.user_id == user_id).first()
        if not app:
            raise HTTPException(status_code=404, detail="Application not found or unauthorized")
        return app

    def create_interview_round(self, round_in: InterviewRoundCreate, user_id: int) -> InterviewRound:
        self._verify_application_ownership(round_in.application_id, user_id)
        
        db_round = InterviewRound(**round_in.model_dump())
        self.db.add(db_round)
        self.db.commit()
        self.db.refresh(db_round)
        return db_round

    def create_assessment(self, assessment_in: AssessmentCreate, user_id: int) -> Assessment:
        self._verify_application_ownership(assessment_in.application_id, user_id)
        
        db_assessment = Assessment(**assessment_in.model_dump())
        self.db.add(db_assessment)
        self.db.commit()
        self.db.refresh(db_assessment)
        return db_assessment
