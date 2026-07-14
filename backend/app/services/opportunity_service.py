from typing import List
from sqlalchemy.orm import Session
from fastapi import HTTPException
from app.models.opportunity import Opportunity
from app.schemas.opportunity import OpportunityCreate, OpportunityUpdate

class OpportunityService:
    def __init__(self, db: Session):
        self.db = db

    def get_opportunity(self, opp_id: int, user_id: int) -> Opportunity:
        opp = self.db.query(Opportunity).filter(Opportunity.id == opp_id, Opportunity.user_id == user_id).first()
        if not opp:
            raise HTTPException(status_code=404, detail="Opportunity not found")
        return opp

    def list_opportunities(self, user_id: int, skip: int = 0, limit: int = 100) -> List[Opportunity]:
        return (
            self.db.query(Opportunity)
            .filter(Opportunity.user_id == user_id)
            .order_by(Opportunity.created_at.desc())
            .offset(skip)
            .limit(limit)
            .all()
        )

    def create_opportunity(self, opp_in: OpportunityCreate, user_id: int) -> Opportunity:
        db_opp = Opportunity(
            **opp_in.model_dump(exclude_unset=True),
            user_id=user_id
        )
        self.db.add(db_opp)
        self.db.commit()
        self.db.refresh(db_opp)
        return db_opp

    def update_opportunity(self, opp_id: int, opp_in: OpportunityUpdate, user_id: int) -> Opportunity:
        db_opp = self.get_opportunity(opp_id, user_id)
        update_data = opp_in.model_dump(exclude_unset=True)
        for field, value in update_data.items():
            setattr(db_opp, field, value)
        self.db.commit()
        self.db.refresh(db_opp)
        return db_opp

    def delete_opportunity(self, opp_id: int, user_id: int) -> None:
        db_opp = self.get_opportunity(opp_id, user_id)  # raises 404 if not found/not owned
        self.db.delete(db_opp)
        self.db.commit()
