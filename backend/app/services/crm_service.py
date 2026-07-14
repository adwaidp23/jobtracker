from sqlalchemy.orm import Session
from fastapi import HTTPException
from app.models.crm import Contact, Referral
from app.schemas.crm import ContactCreate, ContactUpdate, ReferralCreate, ReferralUpdate
from datetime import datetime

class CRMService:
    def __init__(self, db: Session):
        self.db = db

    def get_contact(self, contact_id: int, user_id: int) -> Contact:
        contact = self.db.query(Contact).filter(Contact.id == contact_id, Contact.user_id == user_id).first()
        if not contact:
            raise HTTPException(status_code=404, detail="Contact not found")
        return contact

    def create_contact(self, contact_in: ContactCreate, user_id: int) -> Contact:
        db_contact = Contact(
            **contact_in.model_dump(),
            user_id=user_id
        )
        self.db.add(db_contact)
        self.db.commit()
        self.db.refresh(db_contact)
        return db_contact

    def update_contact(self, contact_id: int, contact_in: ContactUpdate, user_id: int) -> Contact:
        db_contact = self.get_contact(contact_id, user_id)
        update_data = contact_in.model_dump(exclude_unset=True)
        for field, value in update_data.items():
            setattr(db_contact, field, value)
            
        self.db.commit()
        self.db.refresh(db_contact)
        return db_contact

    def get_referral(self, referral_id: int, user_id: int) -> Referral:
        referral = self.db.query(Referral).filter(Referral.id == referral_id, Referral.user_id == user_id).first()
        if not referral:
            raise HTTPException(status_code=404, detail="Referral not found")
        return referral

    def create_referral(self, referral_in: ReferralCreate, user_id: int) -> Referral:
        db_referral = Referral(
            **referral_in.model_dump(),
            user_id=user_id
        )
        self.db.add(db_referral)
        self.db.commit()
        self.db.refresh(db_referral)
        return db_referral
