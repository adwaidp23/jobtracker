from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey, Numeric
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.db.base_class import Base

class Opportunity(Base):
    __tablename__ = "opportunities"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    
    company_name = Column(String, index=True, nullable=False)
    role_name = Column(String, index=True, nullable=False)
    department = Column(String, nullable=True)
    industry = Column(String, index=True, nullable=True)
    
    job_type = Column(String, nullable=True) # Full-time, Part-time, Internship, Contract
    work_mode = Column(String, nullable=True) # Remote, Hybrid, On-site
    
    salary_range = Column(String, nullable=True)
    stipend = Column(Numeric(10, 2), nullable=True)
    location = Column(String, nullable=True)
    
    job_description = Column(Text, nullable=True)
    application_deadline = Column(DateTime(timezone=True), nullable=True)
    
    source_platform = Column(String, nullable=True) # LinkedIn, Indeed, Company Site
    source_url = Column(String, nullable=True)
    priority = Column(String, default="Medium") # High, Medium, Low
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    user = relationship("User")
    application = relationship("Application", back_populates="opportunity", uselist=False, cascade="all, delete-orphan")
