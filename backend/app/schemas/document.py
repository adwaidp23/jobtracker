from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime

# ResumeVersion Schemas
class ResumeVersionBase(BaseModel):
    version_number: int
    file_url: str
    changes_notes: Optional[str] = None

class ResumeVersionCreate(ResumeVersionBase):
    pass

class ResumeVersionInDB(ResumeVersionBase):
    id: int
    document_id: int
    success_rate: float = 0.0
    interview_conversion_rate: float = 0.0
    upload_date: datetime

    class Config:
        from_attributes = True

class ResumeVersion(ResumeVersionInDB):
    pass

# Document Schemas
class DocumentBase(BaseModel):
    document_type: str  # Resume, Cover Letter, Offer Letter, etc.
    title: str

class DocumentCreate(DocumentBase):
    pass

class DocumentUpdate(BaseModel):
    title: Optional[str] = None
    document_type: Optional[str] = None

class DocumentInDB(DocumentBase):
    id: int
    user_id: int
    upload_date: datetime
    updated_at: Optional[datetime] = None
    resume_versions: List[ResumeVersion] = []

    class Config:
        from_attributes = True

class Document(DocumentInDB):
    pass
