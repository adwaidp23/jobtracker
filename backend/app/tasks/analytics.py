import logging
from app.worker import celery_app
from app.db.database import SessionLocal
from app.models.user import User
from app.services.analytics_service import AnalyticsService

logger = logging.getLogger(__name__)

@celery_app.task(name="app.tasks.analytics.precompute_dashboard_metrics")
def precompute_dashboard_metrics():
    db = SessionLocal()
    try:
        # Pre-compute metrics for all active users
        users = db.query(User).filter(User.is_active == True).all()
        analytics_service = AnalyticsService(db)
        
        for user in users:
            logger.info(f"Pre-computing metrics for User ID {user.id}")
            analytics_service._compute_and_cache_metrics(user.id)
            
    except Exception as e:
        logger.error(f"Error pre-computing analytics: {e}")
    finally:
        db.close()
