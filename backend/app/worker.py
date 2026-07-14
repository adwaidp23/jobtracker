from celery import Celery
from app.core.config import settings

celery_app = Celery(
    "worker",
    broker=settings.CELERY_BROKER_URL,
    backend=settings.CELERY_RESULT_BACKEND
)

celery_app.conf.task_routes = {
    "app.tasks.notifications.*": "main-queue",
    "app.tasks.analytics.*": "main-queue",
}

# Optional: configure periodic tasks (beat)
from celery.schedules import crontab

celery_app.conf.beat_schedule = {
    "scan-deadlines-every-morning": {
        "task": "app.tasks.notifications.scan_upcoming_deadlines_and_notify",
        "schedule": crontab(hour=8, minute=0), # Run daily at 8 AM
    },
    "precompute-analytics-hourly": {
        "task": "app.tasks.analytics.precompute_dashboard_metrics",
        "schedule": crontab(minute=0), # Run every hour
    },
}

celery_app.autodiscover_tasks(["app.tasks.notifications", "app.tasks.analytics"])
