from pydantic import BaseModel
from typing import Optional
from datetime import datetime
from app.models.interview import InterviewOutcome, AssessmentStatus

# InterviewRound Schemas
class InterviewRoundBase(BaseModel):
    round_name: str
    interview_date: Optional[datetime] = None
    interviewer_names: Optional[str] = None
    preparation_notes: Optional[str] = None
    questions_asked: Optional[str] = None
    feedback: Optional[str] = None
    outcome: InterviewOutcome = InterviewOutcome.PENDING

class InterviewRoundCreate(InterviewRoundBase):
    application_id: int

class InterviewRoundUpdate(InterviewRoundBase):
    round_name: Optional[str] = None

class InterviewRoundInDBBase(InterviewRoundBase):
    id: int
    application_id: int
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True

class InterviewRound(InterviewRoundInDBBase):
    pass

# Assessment Schemas
class AssessmentBase(BaseModel):
    assessment_type: str
    due_date: Optional[datetime] = None
    completion_date: Optional[datetime] = None
    score: Optional[float] = None
    feedback: Optional[str] = None
    submission_link: Optional[str] = None
    status: AssessmentStatus = AssessmentStatus.PENDING

class AssessmentCreate(AssessmentBase):
    application_id: int

class AssessmentUpdate(AssessmentBase):
    assessment_type: Optional[str] = None

class AssessmentInDBBase(AssessmentBase):
    id: int
    application_id: int
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True

class Assessment(AssessmentInDBBase):
    pass
