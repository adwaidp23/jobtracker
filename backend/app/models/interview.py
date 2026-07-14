from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey, Enum, Float
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.db.base_class import Base
import enum

class InterviewOutcome(str, enum.Enum):
    PENDING = "Pending"
    PASSED = "Passed"
    FAILED = "Failed"
    CANCELLED = "Cancelled"

class AssessmentStatus(str, enum.Enum):
    PENDING = "Pending"
    COMPLETED = "Completed"
    EXPIRED = "Expired"

class InterviewRound(Base):
    __tablename__ = "interview_rounds"

    id = Column(Integer, primary_key=True, index=True)
    application_id = Column(Integer, ForeignKey("applications.id", ondelete="CASCADE"), nullable=False)
    
    round_name = Column(String, nullable=False) # e.g., "Technical Screen", "Onsite - System Design"
    interview_date = Column(DateTime(timezone=True), nullable=True)
    interviewer_names = Column(String, nullable=True)
    
    preparation_notes = Column(Text, nullable=True)
    questions_asked = Column(Text, nullable=True)
    feedback = Column(Text, nullable=True)
    
    outcome = Column(Enum(InterviewOutcome), default=InterviewOutcome.PENDING, nullable=False)
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    application = relationship("Application")

class Assessment(Base):
    __tablename__ = "assessments"

    id = Column(Integer, primary_key=True, index=True)
    application_id = Column(Integer, ForeignKey("applications.id", ondelete="CASCADE"), nullable=False)
    
    assessment_type = Column(String, nullable=False) # e.g., "HackerRank", "Take-home project"
    due_date = Column(DateTime(timezone=True), nullable=True)
    completion_date = Column(DateTime(timezone=True), nullable=True)
    
    score = Column(Float, nullable=True)
    feedback = Column(Text, nullable=True)
    submission_link = Column(String, nullable=True)
    
    status = Column(Enum(AssessmentStatus), default=AssessmentStatus.PENDING, nullable=False)
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    application = relationship("Application")
