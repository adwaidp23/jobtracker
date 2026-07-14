from sqlalchemy.orm import Session
from app.repositories.user_repo import UserRepository
from app.schemas.user import UserCreate
from app.core.security import verify_password, create_access_token, create_refresh_token
from fastapi import HTTPException, status

class AuthService:
    def __init__(self, db: Session):
        self.user_repo = UserRepository(db)

    def register_user(self, user_in: UserCreate):
        user = self.user_repo.get_user_by_email(user_in.email)
        if user:
            raise HTTPException(
                status_code=400,
                detail="The user with this username already exists in the system.",
            )
        return self.user_repo.create_user(user_in)

    def authenticate_user(self, email: str, password: str):
        user = self.user_repo.get_user_by_email(email)
        if not user:
            return None
        if not verify_password(password, user.password_hash):
            return None
        return user

    def login_for_access_token(self, email: str, password: str):
        user = self.authenticate_user(email, password)
        if not user:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Incorrect email or password",
                headers={"WWW-Authenticate": "Bearer"},
            )
        elif not user.is_active:
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Inactive user")

        access_token = create_access_token(subject=user.id)
        refresh_token = create_refresh_token(subject=user.id)
        return {
            "access_token": access_token,
            "refresh_token": refresh_token,
            "token_type": "bearer",
        }

