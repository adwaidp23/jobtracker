from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey, Enum
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.db.base_class import Base
import enum

class ApplicationStatus(str, enum.Enum):
    SAVED = "Saved"
    PREPARING = "Preparing"
    APPLIED = "Applied"
    ASSESSMENT = "Assessment"
    INTERVIEW = "Interview"
    OFFER = "Offer"
    ACCEPTED = "Accepted"
    REJECTED = "Rejected"
    WITHDRAWN = "Withdrawn"
    ARCHIVED = "Archived"

class Application(Base):
    __tablename__ = "applications"

    id = Column(Integer, primary_key=True, index=True)
    opportunity_id = Column(Integer, ForeignKey("opportunities.id", ondelete="CASCADE"), unique=True, nullable=False)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    
    status = Column(Enum(ApplicationStatus), default=ApplicationStatus.SAVED, nullable=False)
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    opportunity = relationship("Opportunity", back_populates="application")
    history = relationship("ApplicationHistory", back_populates="application", cascade="all, delete-orphan", order_by="desc(ApplicationHistory.timestamp)")

class ApplicationHistory(Base):
    __tablename__ = "application_history"

    id = Column(Integer, primary_key=True, index=True)
    application_id = Column(Integer, ForeignKey("applications.id", ondelete="CASCADE"), nullable=False)
    
    old_status = Column(Enum(ApplicationStatus), nullable=True)
    new_status = Column(Enum(ApplicationStatus), nullable=False)
    
    reason = Column(Text, nullable=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False) # User who made the change
    
    timestamp = Column(DateTime(timezone=True), server_default=func.now())

    application = relationship("Application", back_populates="history")
