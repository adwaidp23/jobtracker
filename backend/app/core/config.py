import os
from pydantic_settings import BaseSettings

_INSECURE_DEFAULT_KEY = "supersecretkey_please_change_in_production"

class Settings(BaseSettings):
    API_V1_STR: str = "/api/v1"
    PROJECT_NAME: str = "CareerFlow"

    POSTGRES_USER: str = "postgres"
    POSTGRES_PASSWORD: str = ""  # Must be set via env in non-dev contexts
    POSTGRES_SERVER: str = "db"
    POSTGRES_PORT: str = "5432"
    POSTGRES_DB: str = "careerflow"

    DATABASE_URL: str | None = None
    REDIS_URL: str = "redis://localhost:6379/0"
    CELERY_BROKER_URL: str = "redis://localhost:6379/0"
    CELERY_RESULT_BACKEND: str = "redis://localhost:6379/0"

    @property
    def sync_database_url(self) -> str:
        if self.DATABASE_URL:
            if self.DATABASE_URL.startswith("postgres://"):
                return self.DATABASE_URL.replace("postgres://", "postgresql://", 1)
            return self.DATABASE_URL
        return f"postgresql://{self.POSTGRES_USER}:{self.POSTGRES_PASSWORD}@{self.POSTGRES_SERVER}:{self.POSTGRES_PORT}/{self.POSTGRES_DB}"

    SECRET_KEY: str = ""
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    REFRESH_TOKEN_EXPIRE_DAYS: int = 7

    # Dev-mode flag: set DEV_MODE=true to allow insecure defaults locally
    DEV_MODE: bool = False

    class Config:
        case_sensitive = True


def _validate_settings(s: Settings) -> None:
    """Fail fast at startup if secrets are missing or using known-insecure defaults (non-dev)."""
    if not s.DEV_MODE:
        if not s.SECRET_KEY or s.SECRET_KEY == _INSECURE_DEFAULT_KEY:
            raise ValueError(
                "SECRET_KEY is not set or is using the insecure default. "
                "Set a strong SECRET_KEY environment variable before starting the server. "
                "If running locally in dev, set DEV_MODE=true to bypass this check."
            )


settings = Settings()
_validate_settings(settings)

# In dev mode, fall back to insecure defaults so local `uvicorn` still works without .env
if settings.DEV_MODE and not settings.SECRET_KEY:
    object.__setattr__(settings, "SECRET_KEY", _INSECURE_DEFAULT_KEY)
