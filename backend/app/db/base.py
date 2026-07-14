# Import all the models, so that Base has them before being
# imported by Alembic
from app.db.base_class import Base
from app.models.user import User, UserProfile
from app.models.opportunity import Opportunity
from app.models.application import Application, ApplicationHistory
from app.models.document import Document, ResumeVersion
from app.models.crm import Contact, Referral
from app.models.interview import InterviewRound, Assessment
