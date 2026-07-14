from sqlalchemy.orm import Session
from app.models.user import User, UserProfile
from app.schemas.user import UserCreate
from app.core.security import get_password_hash

class UserRepository:
    def __init__(self, db: Session):
        self.db = db

    def get_user_by_email(self, email: str) -> User | None:
        return self.db.query(User).filter(User.email == email).first()

    def get_user_by_id(self, user_id: int) -> User | None:
        return self.db.query(User).filter(User.id == user_id).first()

    def create_user(self, user_in: UserCreate) -> User:
        db_user = User(
            email=user_in.email,
            first_name=user_in.first_name,
            last_name=user_in.last_name,
            password_hash=get_password_hash(user_in.password),
        )
        self.db.add(db_user)
        self.db.commit()
        self.db.refresh(db_user)
        
        # Create empty profile
        db_profile = UserProfile(user_id=db_user.id)
        self.db.add(db_profile)
        self.db.commit()
        
        return db_user
