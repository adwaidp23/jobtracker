from typing import Any, List
from fastapi import APIRouter, Depends, Response, status
from sqlalchemy.orm import Session
from app.api import deps
from app.schemas.opportunity import OpportunityCreate, OpportunityUpdate, Opportunity
from app.services.opportunity_service import OpportunityService
from app.models.user import User

router = APIRouter()

@router.get("/", response_model=List[Opportunity])
def list_opportunities(
    *,
    db: Session = Depends(deps.get_db),
    skip: int = 0,
    limit: int = 100,
    current_user: User = Depends(deps.get_current_active_user),
) -> Any:
    """
    List all opportunities for the current user, newest first.
    """
    opp_service = OpportunityService(db)
    return opp_service.list_opportunities(user_id=current_user.id, skip=skip, limit=limit)

@router.post("/", response_model=Opportunity)
def create_opportunity(
    *,
    db: Session = Depends(deps.get_db),
    opp_in: OpportunityCreate,
    current_user: User = Depends(deps.get_current_active_user),
) -> Any:
    """
    Create new opportunity.
    """
    opp_service = OpportunityService(db)
    return opp_service.create_opportunity(opp_in=opp_in, user_id=current_user.id)

@router.get("/{id}", response_model=Opportunity)
def read_opportunity(
    *,
    db: Session = Depends(deps.get_db),
    id: int,
    current_user: User = Depends(deps.get_current_active_user),
) -> Any:
    """
    Get opportunity by ID.
    """
    opp_service = OpportunityService(db)
    return opp_service.get_opportunity(opp_id=id, user_id=current_user.id)

@router.put("/{id}", response_model=Opportunity)
def update_opportunity(
    *,
    db: Session = Depends(deps.get_db),
    id: int,
    opp_in: OpportunityUpdate,
    current_user: User = Depends(deps.get_current_active_user),
) -> Any:
    """
    Update an opportunity.
    """
    opp_service = OpportunityService(db)
    return opp_service.update_opportunity(opp_id=id, opp_in=opp_in, user_id=current_user.id)

@router.delete("/{id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_opportunity(
    *,
    db: Session = Depends(deps.get_db),
    id: int,
    current_user: User = Depends(deps.get_current_active_user),
) -> Response:
    """
    Hard-delete an opportunity and its linked application + history (DB cascade).
    Returns 404 if not found or does not belong to current user.
    """
    opp_service = OpportunityService(db)
    opp_service.delete_opportunity(opp_id=id, user_id=current_user.id)
    return Response(status_code=status.HTTP_204_NO_CONTENT)
