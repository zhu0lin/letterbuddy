from fastapi import APIRouter, HTTPException, status
from app.schemas.auth import Token, UserCreate, UserLogin

router = APIRouter()


@router.post("/register", response_model=Token)
async def register(user_data: UserCreate):
    """Register a new user (demo version without database)"""
    # Demo implementation - just return a mock token
    return Token(
        access_token="demo_token_123",
        token_type="bearer",
        user={"id": 1, "email": user_data.email, "name": f"{user_data.first_name} {user_data.last_name}"}
    )


@router.post("/login", response_model=Token)
async def login(user_data: UserLogin):
    """Login user and return access token (demo version without database)"""
    # Demo implementation - accept any email/password
    return Token(
        access_token="demo_token_123",
        token_type="bearer",
        user={"id": 1, "email": user_data.email, "name": "Demo User"}
    )
