from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from app.models.application import Application, ApplicationHistory, ApplicationStatus
from app.schemas.application import ApplicationCreate, ApplicationUpdate

# Define valid state transitions (State Machine)
VALID_TRANSITIONS = {
    ApplicationStatus.SAVED: [ApplicationStatus.PREPARING, ApplicationStatus.APPLIED, ApplicationStatus.ARCHIVED],
    ApplicationStatus.PREPARING: [ApplicationStatus.APPLIED, ApplicationStatus.ARCHIVED],
    ApplicationStatus.APPLIED: [ApplicationStatus.ASSESSMENT, ApplicationStatus.INTERVIEW, ApplicationStatus.REJECTED, ApplicationStatus.WITHDRAWN],
    ApplicationStatus.ASSESSMENT: [ApplicationStatus.INTERVIEW, ApplicationStatus.REJECTED, ApplicationStatus.WITHDRAWN],
    ApplicationStatus.INTERVIEW: [ApplicationStatus.OFFER, ApplicationStatus.REJECTED, ApplicationStatus.WITHDRAWN],
    ApplicationStatus.OFFER: [ApplicationStatus.ACCEPTED, ApplicationStatus.REJECTED, ApplicationStatus.WITHDRAWN],
    ApplicationStatus.ACCEPTED: [ApplicationStatus.WITHDRAWN],
    ApplicationStatus.REJECTED: [], # Terminal state
    ApplicationStatus.WITHDRAWN: [], # Terminal state
    ApplicationStatus.ARCHIVED: [ApplicationStatus.SAVED], # Unarchive
}

class ApplicationService:
    def __init__(self, db: Session):
        self.db = db

    def get_application(self, app_id: int, user_id: int) -> Application:
        app = self.db.query(Application).filter(Application.id == app_id, Application.user_id == user_id).first()
        if not app:
            raise HTTPException(status_code=404, detail="Application not found")
        return app

    def create_application(self, app_in: ApplicationCreate, user_id: int) -> Application:
        # Create application
        db_app = Application(
            opportunity_id=app_in.opportunity_id,
            user_id=user_id,
            status=app_in.status
        )
        self.db.add(db_app)
        self.db.flush() # Get ID without committing

        # Create initial history log
        history = ApplicationHistory(
            application_id=db_app.id,
            old_status=None,
            new_status=app_in.status,
            reason="Initial application created",
            user_id=user_id
        )
        self.db.add(history)
        self.db.commit()
        self.db.refresh(db_app)
        
        # Invalidate dashboard metrics cache for this user
        import redis
        from app.core.config import settings
        redis_client = redis.Redis.from_url(settings.REDIS_URL or "redis://localhost:6379/0")
        redis_client.delete(f"dashboard:metrics:{user_id}")
        
        return db_app

    def update_application_status(self, app_id: int, app_in: ApplicationUpdate, user_id: int) -> Application:
        db_app = self.get_application(app_id, user_id)
        
        old_status = db_app.status
        new_status = app_in.status

        # Validate state transition
        if old_status != new_status:
            allowed_next_states = VALID_TRANSITIONS.get(old_status, [])
            if new_status not in allowed_next_states:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST, 
                    detail=f"Invalid state transition from {old_status.value} to {new_status.value}"
                )

            db_app.status = new_status
            
            # Log the change
            history = ApplicationHistory(
                application_id=db_app.id,
                old_status=old_status,
                new_status=new_status,
                reason=app_in.reason,
                user_id=user_id
            )
            self.db.add(history)
            
        self.db.commit()
        self.db.refresh(db_app)
        
        # Invalidate dashboard metrics cache for this user
        import redis
        from app.core.config import settings
        redis_client = redis.Redis.from_url(settings.REDIS_URL or "redis://localhost:6379/0")
        redis_client.delete(f"dashboard:metrics:{user_id}")
        
        return db_app
