from pydantic import BaseModel
from typing import Dict, List, Any

class DashboardMetrics(BaseModel):
    total_applications: int
    interviews_scheduled: int
    offers_received: int
    rejections: int
    
    application_funnel: Dict[str, int] # e.g., {"Applied": 50, "Assessment": 20, "Interview": 5, "Offer": 2}
    platform_success_rate: List[Dict[str, Any]] # e.g., [{"name": "LinkedIn", "value": 45}, ...]
    weekly_activity: List[Dict[str, Any]] # e.g., [{"day": "Mon", "applications": 5}, ...]
