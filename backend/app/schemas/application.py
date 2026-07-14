from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime
from decimal import Decimal
from app.models.application import ApplicationStatus

class ApplicationBase(BaseModel):
    status: ApplicationStatus = ApplicationStatus.SAVED

class ApplicationCreate(ApplicationBase):
    opportunity_id: int

class ApplicationUpdate(BaseModel):
    status: ApplicationStatus
    reason: Optional[str] = None  # Reason for status change

class ApplicationHistorySchema(BaseModel):
    old_status: Optional[ApplicationStatus] = None
    new_status: ApplicationStatus
    reason: Optional[str] = None
    timestamp: datetime

    class Config:
        from_attributes = True

# Inline opportunity data embedded in application responses
class OpportunityInline(BaseModel):
    id: int
    company_name: str
    role_name: str
    location: Optional[str] = None
    salary_range: Optional[str] = None
    source_platform: Optional[str] = None
    source_url: Optional[str] = None
    job_type: Optional[str] = None
    work_mode: Optional[str] = None
    priority: Optional[str] = None
    job_description: Optional[str] = None
    application_deadline: Optional[datetime] = None
    stipend: Optional[Decimal] = None

    class Config:
        from_attributes = True

# Inline interview round for detail view
class InterviewRoundInline(BaseModel):
    id: int
    round_name: str
    interview_date: Optional[datetime] = None
    interviewer_names: Optional[str] = None
    outcome: str
    feedback: Optional[str] = None

    class Config:
        from_attributes = True

# Inline assessment for detail view
class AssessmentInline(BaseModel):
    id: int
    assessment_type: str
    due_date: Optional[datetime] = None
    completion_date: Optional[datetime] = None
    status: str
    score: Optional[float] = None

    class Config:
        from_attributes = True

class ApplicationInDBBase(ApplicationBase):
    id: int
    opportunity_id: int
    user_id: int
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True

# Basic application response (for list views)
class Application(ApplicationInDBBase):
    history: List[ApplicationHistorySchema] = []
    opportunity: Optional[OpportunityInline] = None

# Full detail response (for detail page — same endpoint, richer schema)
class ApplicationDetail(ApplicationInDBBase):
    history: List[ApplicationHistorySchema] = []
    opportunity: Optional[OpportunityInline] = None
    interview_rounds: List[InterviewRoundInline] = []
    assessments: List[AssessmentInline] = []

