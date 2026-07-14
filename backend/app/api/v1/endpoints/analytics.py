from typing import Any
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.api import deps
from app.schemas.analytics import DashboardMetrics
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
    Get optimized pre-computed dashboard metrics.
    """
    analytics_service = AnalyticsService(db)
    return analytics_service.get_dashboard_metrics(user_id=current_user.id)
