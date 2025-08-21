from fastapi import APIRouter, HTTPException, status
from pydantic import BaseModel

router = APIRouter()

# Pydantic models for request/response
class UserCreate(BaseModel):
    email: str
    first_name: str
    last_name: str
    password: str

class UserLogin(BaseModel):
    email: str
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str
    user: dict

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
