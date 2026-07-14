from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime
from app.models.crm import ReferralStatus

# Contact Schemas
class ContactBase(BaseModel):
    name: str
    company: Optional[str] = None
    designation: Optional[str] = None
    email: Optional[EmailStr] = None
    linkedin_url: Optional[str] = None
    phone: Optional[str] = None
    notes: Optional[str] = None
    relationship_score: Optional[float] = 0.0

class ContactCreate(ContactBase):
    pass

class ContactUpdate(ContactBase):
    name: Optional[str] = None

class ContactInDBBase(ContactBase):
    id: int
    user_id: int
    last_contact_date: Optional[datetime] = None
    next_followup_date: Optional[datetime] = None
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True

class Contact(ContactInDBBase):
    pass

# Referral Schemas
class ReferralBase(BaseModel):
    status: ReferralStatus = ReferralStatus.PLANNED
    notes: Optional[str] = None

class ReferralCreate(ReferralBase):
    contact_id: Optional[int] = None
    application_id: Optional[int] = None

class ReferralUpdate(ReferralBase):
    status: Optional[ReferralStatus] = None

class ReferralInDBBase(ReferralBase):
    id: int
    user_id: int
    contact_id: Optional[int]
    application_id: Optional[int]
    request_date: Optional[datetime] = None
    completion_date: Optional[datetime] = None
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True

class Referral(ReferralInDBBase):
    pass
