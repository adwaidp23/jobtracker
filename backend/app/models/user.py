from sqlalchemy import Column, Integer, String, Boolean, DateTime, ForeignKey, Text
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.db.base_class import Base
import uuid

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    uuid = Column(String, unique=True, index=True, default=lambda: str(uuid.uuid4()))
    email = Column(String, unique=True, index=True, nullable=False)
    phone = Column(String, nullable=True)
    password_hash = Column(String, nullable=False)
    
    first_name = Column(String, nullable=False)
    last_name = Column(String, nullable=False)
    
    is_active = Column(Boolean, default=True)
    is_superuser = Column(Boolean, default=False)
    is_verified = Column(Boolean, default=False)

    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    last_login = Column(DateTime(timezone=True), nullable=True)

    profile = relationship("UserProfile", back_populates="user", uselist=False, cascade="all, delete-orphan")

class UserProfile(Base):
    __tablename__ = "user_profiles"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), unique=True)
    
    profile_photo = Column(String, nullable=True)
    headline = Column(String, nullable=True)
    education = Column(String, nullable=True)
    university = Column(String, nullable=True)
    graduation_year = Column(Integer, nullable=True)
    location = Column(String, nullable=True)
    
    linkedin_url = Column(String, nullable=True)
    github_url = Column(String, nullable=True)
    portfolio_url = Column(String, nullable=True)

    # Complex fields could be stored as JSON or in separate tables. Using Text/JSON for simplicity in core profile.
    skills = Column(Text, nullable=True) # Could be JSON encoded string
    career_preferences = Column(Text, nullable=True)

    user = relationship("User", back_populates="profile")
