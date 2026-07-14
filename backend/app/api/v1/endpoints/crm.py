from typing import Any, List
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.api import deps
from app.schemas.crm import ContactCreate, ContactUpdate, Contact, ReferralCreate, Referral
from app.services.crm_service import CRMService
from app.models.user import User

router = APIRouter()

@router.post("/contacts", response_model=Contact)
def create_contact(
    *,
    db: Session = Depends(deps.get_db),
    contact_in: ContactCreate,
    current_user: User = Depends(deps.get_current_active_user),
) -> Any:
    """
    Create a new networking contact.
    """
    crm_service = CRMService(db)
    return crm_service.create_contact(contact_in=contact_in, user_id=current_user.id)

@router.get("/contacts/{id}", response_model=Contact)
def read_contact(
    *,
    db: Session = Depends(deps.get_db),
    id: int,
    current_user: User = Depends(deps.get_current_active_user),
) -> Any:
    """
    Get contact by ID.
    """
    crm_service = CRMService(db)
    return crm_service.get_contact(contact_id=id, user_id=current_user.id)

@router.post("/referrals", response_model=Referral)
def create_referral(
    *,
    db: Session = Depends(deps.get_db),
    referral_in: ReferralCreate,
    current_user: User = Depends(deps.get_current_active_user),
) -> Any:
    """
    Create a new referral tracking entry.
    """
    crm_service = CRMService(db)
    return crm_service.create_referral(referral_in=referral_in, user_id=current_user.id)
