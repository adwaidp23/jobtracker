from pydantic import BaseModel
from typing import Optional
from datetime import datetime
from decimal import Decimal

class OpportunityBase(BaseModel):
    company_name: str
    role_name: str
    department: Optional[str] = None
    industry: Optional[str] = None
    job_type: Optional[str] = None
    work_mode: Optional[str] = None
    salary_range: Optional[str] = None
    stipend: Optional[Decimal] = None
    location: Optional[str] = None
    job_description: Optional[str] = None
    application_deadline: Optional[datetime] = None
    source_platform: Optional[str] = None
    source_url: Optional[str] = None
    priority: Optional[str] = "Medium"

class OpportunityCreate(OpportunityBase):
    pass

class OpportunityUpdate(OpportunityBase):
    company_name: Optional[str] = None
    role_name: Optional[str] = None

class OpportunityInDBBase(OpportunityBase):
    id: int
    user_id: int
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True

class Opportunity(OpportunityInDBBase):
    pass
