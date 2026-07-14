import json
from datetime import datetime, timezone
from typing import List
from sqlalchemy.orm import Session, joinedload
from fastapi import HTTPException
from app.models.application import Application, ApplicationHistory, ApplicationStatus
from app.models.interview import InterviewRound, Assessment
from app.models.opportunity import Opportunity
from app.schemas.analytics import DashboardMetrics, UpcomingEvent, RecentActivity

# Safe Redis helper — not fatal if unavailable
def _get_redis():
    try:
        import redis
        from app.core.config import settings
        client = redis.Redis.from_url(settings.REDIS_URL or "redis://localhost:6379/0", socket_connect_timeout=1)
        client.ping()
        return client
    except Exception:
        return None


class AnalyticsService:
    def __init__(self, db: Session):
        self.db = db

    def get_dashboard_metrics(self, user_id: int) -> DashboardMetrics:
        cache_key = f"dashboard:metrics:{user_id}"
        redis_client = _get_redis()
        if redis_client:
            try:
                cached_data = redis_client.get(cache_key)
                if cached_data:
                    return DashboardMetrics(**json.loads(cached_data))
            except Exception:
                pass
        return self._compute_and_cache_metrics(user_id)

    def _compute_and_cache_metrics(self, user_id: int) -> DashboardMetrics:
        total_apps = self.db.query(Application).filter(Application.user_id == user_id).count()
        offers = self.db.query(Application).filter(
            Application.user_id == user_id, Application.status == ApplicationStatus.OFFER
        ).count()
        accepted = self.db.query(Application).filter(
            Application.user_id == user_id, Application.status == ApplicationStatus.ACCEPTED
        ).count()
        rejections = self.db.query(Application).filter(
            Application.user_id == user_id, Application.status == ApplicationStatus.REJECTED
        ).count()
        interviews = self.db.query(Application).filter(
            Application.user_id == user_id, Application.status == ApplicationStatus.INTERVIEW
        ).count()
        assessments = self.db.query(Application).filter(
            Application.user_id == user_id, Application.status == ApplicationStatus.ASSESSMENT
        ).count()
        applied = self.db.query(Application).filter(
            Application.user_id == user_id, Application.status == ApplicationStatus.APPLIED
        ).count()

        # Real platform aggregation
        from sqlalchemy import func
        platform_rows = (
            self.db.query(Opportunity.source_platform, func.count(Application.id))
            .join(Application, Application.opportunity_id == Opportunity.id)
            .filter(Application.user_id == user_id, Opportunity.source_platform.isnot(None))
            .group_by(Opportunity.source_platform)
            .all()
        )
        platform_success_rate = [{"name": row[0], "value": row[1]} for row in platform_rows]

        metrics = DashboardMetrics(
            total_applications=total_apps,
            interviews_scheduled=interviews,
            offers_received=offers + accepted,
            rejections=rejections,
            application_funnel={
                "Applied": applied,
                "Assessment": assessments,
                "Interview": interviews,
                "Offer": offers + accepted,
            },
            platform_success_rate=platform_success_rate,
            weekly_activity=[]
        )

        redis_client = _get_redis()
        if redis_client:
            try:
                redis_client.setex(cache_key := f"dashboard:metrics:{user_id}", 3600, json.dumps(metrics.model_dump()))
            except Exception:
                pass

        return metrics

    def get_upcoming_events(self, user_id: int, limit: int = 10) -> List[UpcomingEvent]:
        """
        Union upcoming InterviewRounds and Assessments for the current user, sorted by date ascending.
        Only returns events with a date in the future.
        """
        now = datetime.now(timezone.utc)

        # Upcoming interview rounds
        rounds = (
            self.db.query(InterviewRound)
            .join(Application, Application.id == InterviewRound.application_id)
            .join(Opportunity, Opportunity.id == Application.opportunity_id)
            .filter(Application.user_id == user_id, InterviewRound.interview_date > now)
            .options(joinedload(InterviewRound.application).joinedload(Application.opportunity))
            .order_by(InterviewRound.interview_date.asc())
            .limit(limit)
            .all()
        )

        # Upcoming assessments
        assessments = (
            self.db.query(Assessment)
            .join(Application, Application.id == Assessment.application_id)
            .join(Opportunity, Opportunity.id == Application.opportunity_id)
            .filter(Application.user_id == user_id, Assessment.due_date > now)
            .options(joinedload(Assessment.application).joinedload(Application.opportunity))
            .order_by(Assessment.due_date.asc())
            .limit(limit)
            .all()
        )

        events: List[UpcomingEvent] = []
        for r in rounds:
            opp = r.application.opportunity
            events.append(UpcomingEvent(
                id=r.id,
                event_type="interview",
                title=f"{opp.company_name} – {opp.role_name}",
                date=r.interview_date,
                label=r.round_name,
            ))
        for a in assessments:
            opp = a.application.opportunity
            events.append(UpcomingEvent(
                id=a.id,
                event_type="assessment",
                title=f"{opp.company_name} – {opp.role_name}",
                date=a.due_date,
                label=a.assessment_type,
            ))

        # Sort the combined list by date and return top `limit`
        events.sort(key=lambda e: e.date)
        return events[:limit]

    def get_recent_activities(self, user_id: int, limit: int = 15) -> List[RecentActivity]:
        """
        Return the last N ApplicationHistory entries for the current user, joined to opportunity.
        """
        history_rows = (
            self.db.query(ApplicationHistory)
            .join(Application, Application.id == ApplicationHistory.application_id)
            .join(Opportunity, Opportunity.id == Application.opportunity_id)
            .filter(Application.user_id == user_id)
            .options(
                joinedload(ApplicationHistory.application).joinedload(Application.opportunity)
            )
            .order_by(ApplicationHistory.timestamp.desc())
            .limit(limit)
            .all()
        )

        return [
            RecentActivity(
                application_id=h.application_id,
                company_name=h.application.opportunity.company_name,
                role_name=h.application.opportunity.role_name,
                old_status=h.old_status.value if h.old_status else None,
                new_status=h.new_status.value,
                reason=h.reason,
                timestamp=h.timestamp,
            )
            for h in history_rows
        ]
