from fastapi import APIRouter
from app.schemas.user import UserResponse, UserUpdate

router = APIRouter()


@router.get("/me", response_model=UserResponse)
async def get_current_user_info():
    """Get current user info (demo version without database)"""
    # Demo implementation
    return UserResponse(
        id=1,
        email="demo@example.com",
        first_name="Demo",
        last_name="User",
        is_active=True,
        created_at="2024-01-01T00:00:00Z",
        updated_at="2024-01-01T00:00:00Z"
    )


@router.put("/me", response_model=UserResponse)
async def update_current_user(user_data: UserUpdate):
    """Update current user (demo version without database)"""
    # Demo implementation
    return UserResponse(
        id=1,
        email="demo@example.com",
        first_name=user_data.first_name or "Demo",
        last_name=user_data.last_name or "User",
        is_active=True,
        created_at="2024-01-01T00:00:00Z",
        updated_at="2024-01-01T00:00:00Z"
    )
