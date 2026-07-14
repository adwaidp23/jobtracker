from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime
from app.models.application import ApplicationStatus

class ApplicationBase(BaseModel):
    status: ApplicationStatus = ApplicationStatus.SAVED

class ApplicationCreate(ApplicationBase):
    opportunity_id: int

class ApplicationUpdate(BaseModel):
    status: ApplicationStatus
    reason: Optional[str] = None # Reason for status change

class ApplicationHistoryBase(BaseModel):
    old_status: Optional[ApplicationStatus] = None
    new_status: ApplicationStatus
    reason: Optional[str] = None
    timestamp: datetime

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

class Application(ApplicationInDBBase):
    history: List[ApplicationHistoryBase] = []
