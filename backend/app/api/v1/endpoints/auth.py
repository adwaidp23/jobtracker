from typing import Any
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from jose import jwt, JWTError
from sqlalchemy.orm import Session
from app.api import deps
from app.schemas.user import UserCreate, User
from app.schemas.token import Token
from app.services.auth_service import AuthService
from app.core.config import settings
from app.core.security import create_access_token, REFRESH_TOKEN_TYPE
from app.repositories.user_repo import UserRepository
from app.db.database import get_db

router = APIRouter()

@router.post("/login", response_model=Token)
def login_access_token(
    db: Session = Depends(get_db),
    form_data: OAuth2PasswordRequestForm = Depends()
) -> Any:
    """
    OAuth2 compatible token login. Returns both an access token (30 min) and a refresh token (7 days).
    """
    auth_service = AuthService(db)
    return auth_service.login_for_access_token(form_data.username, form_data.password)

@router.post("/register", response_model=User)
def register_user(
    *,
    db: Session = Depends(get_db),
    user_in: UserCreate,
) -> Any:
    """Register a new user."""
    auth_service = AuthService(db)
    return auth_service.register_user(user_in)

@router.get("/me", response_model=User)
def read_current_user(
    current_user: User = Depends(deps.get_current_active_user),
) -> Any:
    """
    Get the currently authenticated user. The frontend calls this on page load to
    validate the stored token (instead of blindly trusting localStorage).
    """
    return current_user

@router.post("/refresh", response_model=Token)
def refresh_access_token(
    *,
    db: Session = Depends(get_db),
    refresh_token: str,
) -> Any:
    """
    Exchange a valid refresh token for a new access token.
    The refresh token is passed in the request body as a plain string field.
    """
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Invalid or expired refresh token",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(refresh_token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        if payload.get("type") != REFRESH_TOKEN_TYPE:
            raise credentials_exception
        user_id: str = payload.get("sub")
        if user_id is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception

    user_repo = UserRepository(db)
    user = user_repo.get_user_by_id(int(user_id))
    if not user or not user.is_active:
        raise credentials_exception

    from app.core.security import create_refresh_token
    new_access_token = create_access_token(subject=user.id)
    new_refresh_token = create_refresh_token(subject=user.id)
    return {
        "access_token": new_access_token,
        "refresh_token": new_refresh_token,
        "token_type": "bearer",
    }
