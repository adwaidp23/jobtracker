from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Text, Float
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.db.base_class import Base

class Document(Base):
    __tablename__ = "documents"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    
    document_type = Column(String, nullable=False) # Resume, Cover Letter, Offer Letter, etc.
    title = Column(String, nullable=False)
    
    upload_date = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    user = relationship("User")
    resume_versions = relationship("ResumeVersion", back_populates="document", cascade="all, delete-orphan")

class ResumeVersion(Base):
    __tablename__ = "resume_versions"

    id = Column(Integer, primary_key=True, index=True)
    document_id = Column(Integer, ForeignKey("documents.id", ondelete="CASCADE"), nullable=False)
    
    version_number = Column(Integer, nullable=False)
    file_url = Column(String, nullable=False)
    changes_notes = Column(Text, nullable=True)
    
    # Analytics
    success_rate = Column(Float, default=0.0)
    interview_conversion_rate = Column(Float, default=0.0)
    
    upload_date = Column(DateTime(timezone=True), server_default=func.now())

    document = relationship("Document", back_populates="resume_versions")
