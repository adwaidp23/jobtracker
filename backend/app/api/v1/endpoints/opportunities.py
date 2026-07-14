from typing import Any, List
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.api import deps
from app.schemas.opportunity import OpportunityCreate, OpportunityUpdate, Opportunity
from app.services.opportunity_service import OpportunityService
from app.models.user import User

router = APIRouter()

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
