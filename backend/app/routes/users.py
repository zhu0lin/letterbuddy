from fastapi import APIRouter
from pydantic import BaseModel
from typing import List

router = APIRouter()

# Pydantic models
class UserResponse(BaseModel):
    id: int
    email: str
    first_name: str
    last_name: str
    is_active: bool

# Demo data
demo_users = [
    {
        "id": 1,
        "email": "demo@example.com",
        "first_name": "Demo",
        "last_name": "User",
        "is_active": True
    }
]

@router.get("/", response_model=List[UserResponse])
async def get_users():
    """Get all users (demo version)"""
    return demo_users

@router.get("/{user_id}", response_model=UserResponse)
async def get_user(user_id: int):
    """Get a specific user by ID (demo version)"""
    for user in demo_users:
        if user["id"] == user_id:
            return user
    return {"error": "User not found"}

@router.get("/me", response_model=UserResponse)
async def get_current_user():
    """Get current user info (demo version)"""
    return demo_users[0]  # Return first demo user
