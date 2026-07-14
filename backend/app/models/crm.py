from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey, Enum, Float
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.db.base_class import Base
import enum

class ReferralStatus(str, enum.Enum):
    PLANNED = "Planned"
    REQUESTED = "Requested"
    ACCEPTED = "Accepted"
    SUBMITTED = "Submitted"
    REJECTED = "Rejected"
    COMPLETED = "Completed"

class Contact(Base):
    __tablename__ = "contacts"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    
    name = Column(String, index=True, nullable=False)
    company = Column(String, index=True, nullable=True)
    designation = Column(String, nullable=True)
    email = Column(String, nullable=True)
    linkedin_url = Column(String, nullable=True)
    phone = Column(String, nullable=True)
    notes = Column(Text, nullable=True)
    
    relationship_score = Column(Float, default=0.0) # E.g., 0 to 10
    last_contact_date = Column(DateTime(timezone=True), nullable=True)
    next_followup_date = Column(DateTime(timezone=True), nullable=True)
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    user = relationship("User")
    referrals = relationship("Referral", back_populates="contact", cascade="all, delete-orphan")

class Referral(Base):
    __tablename__ = "referrals"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    contact_id = Column(Integer, ForeignKey("contacts.id", ondelete="SET NULL"), nullable=True)
    application_id = Column(Integer, ForeignKey("applications.id", ondelete="CASCADE"), nullable=True)
    
    status = Column(Enum(ReferralStatus), default=ReferralStatus.PLANNED, nullable=False)
    notes = Column(Text, nullable=True)
    
    request_date = Column(DateTime(timezone=True), nullable=True)
    completion_date = Column(DateTime(timezone=True), nullable=True)
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    user = relationship("User")
    contact = relationship("Contact", back_populates="referrals")
    application = relationship("Application")
