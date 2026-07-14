from typing import Any
from fastapi import APIRouter, Depends
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from app.api import deps
from app.schemas.user import UserCreate, User
from app.schemas.token import Token
from app.services.auth_service import AuthService

router = APIRouter()

@router.post("/login", response_model=Token)
def login_access_token(
    db: Session = Depends(deps.get_db),
    form_data: OAuth2PasswordRequestForm = Depends()
) -> Any:
    """
    OAuth2 compatible token login, get an access token for future requests
    """
    auth_service = AuthService(db)
    return auth_service.login_for_access_token(form_data.username, form_data.password)

@router.post("/register", response_model=User)
def register_user(
    *,
    db: Session = Depends(deps.get_db),
    user_in: UserCreate,
) -> Any:
    """
    Register a new user.
    """
    auth_service = AuthService(db)
    return auth_service.register_user(user_in)

@router.get("/me", response_model=User)
def read_current_user(
    current_user: User = Depends(deps.get_current_active_user),
) -> Any:
    """
    Get current user.
    """
    return current_user
