import logging
from datetime import datetime, timedelta
from app.worker import celery_app
from app.db.database import SessionLocal
from app.models.interview import InterviewRound

logger = logging.getLogger(__name__)

@celery_app.task(name="app.tasks.notifications.scan_upcoming_deadlines_and_notify")
def scan_upcoming_deadlines_and_notify():
    db = SessionLocal()
    try:
        now = datetime.utcnow()
        tomorrow = now + timedelta(days=1)
        
        # Find interviews scheduled for tomorrow
        upcoming_interviews = db.query(InterviewRound).filter(
            InterviewRound.interview_date >= now,
            InterviewRound.interview_date <= tomorrow
        ).all()
        
        for interview in upcoming_interviews:
            # Simulate sending an email/push notification
            logger.info(f"NOTIFICATION: Reminder for Interview ID {interview.id} scheduled at {interview.interview_date}.")
            
    except Exception as e:
        logger.error(f"Error scanning deadlines: {e}")
    finally:
        db.close()
