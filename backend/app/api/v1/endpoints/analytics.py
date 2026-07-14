from typing import Any, List
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.api import deps
from app.schemas.analytics import DashboardMetrics, UpcomingEvent, RecentActivity
from app.services.analytics_service import AnalyticsService
from app.models.user import User

router = APIRouter()

@router.get("/dashboard", response_model=DashboardMetrics)
def get_dashboard_metrics(
    *,
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_active_user),
) -> Any:
    """
    Get pre-computed dashboard metrics (with Redis caching where available).
    """
    analytics_service = AnalyticsService(db)
    return analytics_service.get_dashboard_metrics(user_id=current_user.id)

@router.get("/upcoming-events", response_model=List[UpcomingEvent])
def get_upcoming_events(
    *,
    db: Session = Depends(deps.get_db),
    limit: int = 10,
    current_user: User = Depends(deps.get_current_active_user),
) -> Any:
    """
    Return upcoming interview rounds and assessments for the current user, sorted by date ascending.
    Only future-dated events are returned.
    """
    analytics_service = AnalyticsService(db)
    return analytics_service.get_upcoming_events(user_id=current_user.id, limit=limit)

@router.get("/recent-activities", response_model=List[RecentActivity])
def get_recent_activities(
    *,
    db: Session = Depends(deps.get_db),
    limit: int = 15,
    current_user: User = Depends(deps.get_current_active_user),
) -> Any:
    """
    Return the last N ApplicationHistory entries for the current user, with company and role context.
    """
    analytics_service = AnalyticsService(db)
    return analytics_service.get_recent_activities(user_id=current_user.id, limit=limit)
