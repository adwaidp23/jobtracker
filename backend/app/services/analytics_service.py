import json
import redis
from sqlalchemy.orm import Session
from app.models.application import Application, ApplicationStatus
from app.schemas.analytics import DashboardMetrics
from app.core.config import settings

redis_client = redis.Redis.from_url(settings.REDIS_URL or "redis://localhost:6379/0")

class AnalyticsService:
    def __init__(self, db: Session):
        self.db = db

    def get_dashboard_metrics(self, user_id: int) -> DashboardMetrics:
        # First try to get from Redis cache (sub-second response requirement)
        cache_key = f"dashboard:metrics:{user_id}"
        cached_data = redis_client.get(cache_key)
        
        if cached_data:
            return DashboardMetrics(**json.loads(cached_data))

        # Fallback to computing on the fly if not cached
        return self._compute_and_cache_metrics(user_id)

    def _compute_and_cache_metrics(self, user_id: int) -> DashboardMetrics:
        # 1. Total Applications
        total_apps = self.db.query(Application).filter(Application.user_id == user_id).count()
        
        # 2. Offers & Rejections
        offers = self.db.query(Application).filter(Application.user_id == user_id, Application.status == ApplicationStatus.OFFER).count()
        rejections = self.db.query(Application).filter(Application.user_id == user_id, Application.status == ApplicationStatus.REJECTED).count()
        
        # This is a simplified calculation. A true production system would run complex 
        # SQL aggregations (GROUP BY) or a Pandas dataframe processing job here.
        
        metrics = DashboardMetrics(
            total_applications=total_apps,
            interviews_scheduled=0, # Placeholder
            offers_received=offers,
            rejections=rejections,
            application_funnel={"Applied": total_apps, "Assessment": 0, "Interview": 0, "Offer": offers},
            platform_success_rate=[{"name": "LinkedIn", "value": 45}],
            weekly_activity=[]
        )
        
        # Store in cache for 1 hour
        redis_client.setex(f"dashboard:metrics:{user_id}", 3600, json.dumps(metrics.model_dump()))
        
        return metrics
