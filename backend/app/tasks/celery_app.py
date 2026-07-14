import os
from celery import Celery

# Read redis URL from environment or use default
REDIS_URL = os.getenv("REDIS_URL", "redis://localhost:6379/0")

celery_app = Celery(
    "careerflow_worker",
    broker=REDIS_URL,
    backend=REDIS_URL
)

celery_app.conf.task_routes = {
    "app.tasks.notifications.*": "notifications-queue",
    "app.tasks.analytics.*": "analytics-queue",
}

celery_app.conf.update(
    task_serializer="json",
    accept_content=["json"],
    result_serializer="json",
    timezone="UTC",
    enable_utc=True,
)
