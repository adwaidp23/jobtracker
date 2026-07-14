from typing import Any, List
from fastapi import APIRouter, Depends, Response, status
from sqlalchemy.orm import Session
from app.api import deps
from app.schemas.application import ApplicationCreate, ApplicationUpdate, Application, ApplicationDetail
from app.services.application_service import ApplicationService
from app.models.user import User

router = APIRouter()

@router.get("/", response_model=List[Application])
def list_applications(
    *,
    db: Session = Depends(deps.get_db),
    skip: int = 0,
    limit: int = 100,
    current_user: User = Depends(deps.get_current_active_user),
) -> Any:
    """
    List all applications for the current user, newest first. Includes embedded opportunity info.
    """
    app_service = ApplicationService(db)
    return app_service.list_applications(user_id=current_user.id, skip=skip, limit=limit)

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

@router.get("/{id}", response_model=ApplicationDetail)
def read_application(
    *,
    db: Session = Depends(deps.get_db),
    id: int,
    current_user: User = Depends(deps.get_current_active_user),
) -> Any:
    """
    Get full application detail by ID: includes opportunity, history, interview rounds, assessments.
    """
    app_service = ApplicationService(db)
    return app_service.get_application_detail(app_id=id, user_id=current_user.id)

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
    Uses a State Machine to validate transitions and automatically logs the change to ApplicationHistory.
    """
    app_service = ApplicationService(db)
    return app_service.update_application_status(app_id=id, app_in=app_in, user_id=current_user.id)

@router.delete("/{id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_application(
    *,
    db: Session = Depends(deps.get_db),
    id: int,
    current_user: User = Depends(deps.get_current_active_user),
) -> Response:
    """
    Delete an application and its history.
    Returns 404 if not found or does not belong to current user.
    """
    app_service = ApplicationService(db)
    app_service.delete_application(app_id=id, user_id=current_user.id)
    return Response(status_code=status.HTTP_204_NO_CONTENT)
