from fastapi import APIRouter
from app.api.v1.endpoints import auth, applications, crm, interviews, analytics, opportunities, documents

api_router = APIRouter()
api_router.include_router(auth.router, prefix="/auth", tags=["auth"])
api_router.include_router(applications.router, prefix="/applications", tags=["applications"])
api_router.include_router(opportunities.router, prefix="/opportunities", tags=["opportunities"])
api_router.include_router(crm.router, prefix="/crm", tags=["crm"])
api_router.include_router(interviews.router, prefix="/interviews", tags=["interviews"])
api_router.include_router(analytics.router, prefix="/analytics", tags=["analytics"])
api_router.include_router(documents.router, prefix="/documents", tags=["documents"])
