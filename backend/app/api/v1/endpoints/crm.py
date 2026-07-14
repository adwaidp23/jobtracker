from typing import Any, List
from fastapi import APIRouter, Depends, Response, status
from sqlalchemy.orm import Session
from app.api import deps
from app.schemas.crm import ContactCreate, ContactUpdate, Contact, ReferralCreate, Referral
from app.services.crm_service import CRMService
from app.models.user import User

router = APIRouter()

# --- Contacts ---

@router.get("/contacts/", response_model=List[Contact])
def list_contacts(
    *,
    db: Session = Depends(deps.get_db),
    skip: int = 0,
    limit: int = 100,
    current_user: User = Depends(deps.get_current_active_user),
) -> Any:
    """List all contacts for the current user, newest first."""
    crm_service = CRMService(db)
    return crm_service.list_contacts(user_id=current_user.id, skip=skip, limit=limit)

@router.post("/contacts/", response_model=Contact)
def create_contact(
    *,
    db: Session = Depends(deps.get_db),
    contact_in: ContactCreate,
    current_user: User = Depends(deps.get_current_active_user),
) -> Any:
    """Create a new networking contact."""
    crm_service = CRMService(db)
    return crm_service.create_contact(contact_in=contact_in, user_id=current_user.id)

@router.get("/contacts/{id}", response_model=Contact)
def read_contact(
    *,
    db: Session = Depends(deps.get_db),
    id: int,
    current_user: User = Depends(deps.get_current_active_user),
) -> Any:
    """Get contact by ID."""
    crm_service = CRMService(db)
    return crm_service.get_contact(contact_id=id, user_id=current_user.id)

@router.put("/contacts/{id}", response_model=Contact)
def update_contact(
    *,
    db: Session = Depends(deps.get_db),
    id: int,
    contact_in: ContactUpdate,
    current_user: User = Depends(deps.get_current_active_user),
) -> Any:
    """Update a contact."""
    crm_service = CRMService(db)
    return crm_service.update_contact(contact_id=id, contact_in=contact_in, user_id=current_user.id)

@router.delete("/contacts/{id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_contact(
    *,
    db: Session = Depends(deps.get_db),
    id: int,
    current_user: User = Depends(deps.get_current_active_user),
) -> Response:
    """Delete a contact. Returns 404 if not found or not owned."""
    crm_service = CRMService(db)
    crm_service.delete_contact(contact_id=id, user_id=current_user.id)
    return Response(status_code=status.HTTP_204_NO_CONTENT)

# --- Referrals ---

@router.get("/referrals/", response_model=List[Referral])
def list_referrals(
    *,
    db: Session = Depends(deps.get_db),
    skip: int = 0,
    limit: int = 100,
    current_user: User = Depends(deps.get_current_active_user),
) -> Any:
    """List all referrals for the current user, newest first."""
    crm_service = CRMService(db)
    return crm_service.list_referrals(user_id=current_user.id, skip=skip, limit=limit)

@router.post("/referrals/", response_model=Referral)
def create_referral(
    *,
    db: Session = Depends(deps.get_db),
    referral_in: ReferralCreate,
    current_user: User = Depends(deps.get_current_active_user),
) -> Any:
    """Create a new referral tracking entry."""
    crm_service = CRMService(db)
    return crm_service.create_referral(referral_in=referral_in, user_id=current_user.id)

@router.delete("/referrals/{id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_referral(
    *,
    db: Session = Depends(deps.get_db),
    id: int,
    current_user: User = Depends(deps.get_current_active_user),
) -> Response:
    """Delete a referral. Returns 404 if not found or not owned."""
    crm_service = CRMService(db)
    crm_service.delete_referral(referral_id=id, user_id=current_user.id)
    return Response(status_code=status.HTTP_204_NO_CONTENT)
