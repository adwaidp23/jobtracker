from typing import Any, List
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.api import deps
from app.schemas.application import ApplicationCreate, ApplicationUpdate, Application
from app.services.application_service import ApplicationService
from app.models.user import User

router = APIRouter()

@router.post("/", response_model=Application)
def create_application(
    *,
    db: Session = Depends(deps.get_db),
    app_in: ApplicationCreate,
    current_user: User = Depends(deps.get_current_active_user),
) -> Any:
    """
    Create new application.
    """
    app_service = ApplicationService(db)
    return app_service.create_application(app_in=app_in, user_id=current_user.id)

@router.get("/{id}", response_model=Application)
def read_application(
    *,
    db: Session = Depends(deps.get_db),
    id: int,
    current_user: User = Depends(deps.get_current_active_user),
) -> Any:
    """
    Get application by ID.
    """
    app_service = ApplicationService(db)
    return app_service.get_application(app_id=id, user_id=current_user.id)

@router.put("/{id}/status", response_model=Application)
def update_application_status(
    *,
    db: Session = Depends(deps.get_db),
    id: int,
    app_in: ApplicationUpdate,
    current_user: User = Depends(deps.get_current_active_user),
) -> Any:
    """
    Update an application status.
    This uses a State Machine to validate transitions and automatically logs the change to ApplicationHistory.
    """
    app_service = ApplicationService(db)
    return app_service.update_application_status(app_id=id, app_in=app_in, user_id=current_user.id)
