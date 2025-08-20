from fastapi import APIRouter
from app.api.v1.endpoints import auth, letters, users

api_router = APIRouter()

# Include all endpoint routers
api_router.include_router(auth.router, prefix="/auth", tags=["authentication"])
api_router.include_router(letters.router, prefix="/letters", tags=["letters"])
api_router.include_router(users.router, prefix="/users", tags=["users"])
