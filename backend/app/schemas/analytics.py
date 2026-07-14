from pydantic import BaseModel
from typing import Dict, List, Any, Optional
from datetime import datetime

class DashboardMetrics(BaseModel):
    total_applications: int
    interviews_scheduled: int
    offers_received: int
    rejections: int
    
    application_funnel: Dict[str, int] # e.g., {"Applied": 50, "Assessment": 20, "Interview": 5, "Offer": 2}
    platform_success_rate: List[Dict[str, Any]] # e.g., [{"name": "LinkedIn", "value": 45}, ...]
    weekly_activity: List[Dict[str, Any]] # e.g., [{"day": "Mon", "applications": 5}, ...]

class UpcomingEvent(BaseModel):
    id: int
    event_type: str           # "interview" | "assessment"
    title: str                # e.g. "Google – Technical Round"
    date: datetime
    label: Optional[str] = None  # e.g. round name or assessment type

class RecentActivity(BaseModel):
    application_id: int
    company_name: str
    role_name: str
    old_status: Optional[str] = None
    new_status: str
    reason: Optional[str] = None
    timestamp: datetime
