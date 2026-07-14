import os
import sys

# Add the backend directory to sys.path so 'app' is resolvable
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from sqlalchemy.orm import Session
from app.db.database import SessionLocal, engine
from app.db.base_class import Base

# Import ALL models so SQLAlchemy can build the relationships
from app.models.user import User
from app.models.opportunity import Opportunity
from app.models.application import Application, ApplicationStatus, ApplicationHistory
from app.models.interview import InterviewRound, InterviewOutcome, Assessment
from app.models.crm import Contact
from app.models.document import Document, ResumeVersion

from app.core.security import get_password_hash
from datetime import datetime, timedelta

def seed_db():
    print("Starting database seed...")
    db = SessionLocal()
    
    # Just to be completely safe, let's make sure tables are created
    Base.metadata.create_all(bind=engine)
    
    try:
        # Create a test user
        test_email = "testuser@example.com"
        user = db.query(User).filter(User.email == test_email).first()
        if not user:
            print(f"Creating user {test_email}...")
            user = User(
                email=test_email,
                password_hash=get_password_hash("password123"),
                first_name="Test",
                last_name="User",
                is_active=True
            )
            db.add(user)
            db.commit()
            db.refresh(user)
        else:
            print(f"User {test_email} already exists. Skipping user creation.")

        # Check if we already have applications for this user
        app_count = db.query(Application).filter(Application.user_id == user.id).count()
        if app_count == 0:
            print("Creating test opportunities and applications...")
            
            # Application 1: Google (Offer)
            opp1 = Opportunity(user_id=user.id, company_name="Google", role_name="Software Engineer", source_url="https://google.com/jobs", location="Remote", source_platform="LinkedIn")
            opp2 = Opportunity(user_id=user.id, company_name="Meta", role_name="Frontend Developer", source_url="https://meta.com/careers", location="New York, NY", source_platform="Referral")
            opp3 = Opportunity(user_id=user.id, company_name="Amazon", role_name="Full Stack Engineer", source_url="https://amazon.jobs", location="Seattle, WA", source_platform="Indeed")
            
            db.add_all([opp1, opp2, opp3])
            db.commit()
            db.refresh(opp1)
            db.refresh(opp2)
            db.refresh(opp3)

            app1 = Application(
                user_id=user.id,
                opportunity_id=opp1.id,
                status=ApplicationStatus.OFFER,
                created_at=datetime.utcnow() - timedelta(days=30)
            )
            
            app2 = Application(
                user_id=user.id,
                opportunity_id=opp2.id,
                status=ApplicationStatus.INTERVIEW,
                created_at=datetime.utcnow() - timedelta(days=15)
            )
            
            app3 = Application(
                user_id=user.id,
                opportunity_id=opp3.id,
                status=ApplicationStatus.REJECTED,
                created_at=datetime.utcnow() - timedelta(days=45)
            )
            
            db.add_all([app1, app2, app3])
            db.commit()
            db.refresh(app1)
            db.refresh(app2)

            print("Creating test interviews...")
            
            # Add an upcoming interview for Meta
            interview1 = InterviewRound(
                application_id=app2.id,
                round_name="Technical Screen",
                interview_date=datetime.utcnow() + timedelta(days=1),
                interviewer_names="John Doe",
                outcome=InterviewOutcome.PENDING
            )
            
            db.add(interview1)
            db.commit()
            print("Database seed completed successfully.")
        else:
            print("Applications already exist for test user. Skipping application seeding.")

    except Exception as e:
        print(f"An error occurred during seeding: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    seed_db()
