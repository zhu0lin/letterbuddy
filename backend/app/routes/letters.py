from fastapi import APIRouter
from pydantic import BaseModel
from typing import List, Optional
from enum import Enum

router = APIRouter()

# Enums
class LetterType(str, Enum):
    PERSONAL = "personal"
    BUSINESS = "business"
    THANK_YOU = "thank_you"
    APOLOGY = "apology"

class LetterStatus(str, Enum):
    DRAFT = "draft"
    SENT = "sent"
    ARCHIVED = "archived"

# Pydantic models
class LetterCreate(BaseModel):
    title: str
    content: str
    recipient: str
    letter_type: LetterType

class LetterResponse(BaseModel):
    id: int
    title: str
    content: str
    recipient: str
    letter_type: LetterType
    status: LetterStatus
    user_id: int

# Demo data
demo_letters = [
    {
        "id": 1,
        "title": "Thank You Letter",
        "content": "Dear John, Thank you for your help...",
        "recipient": "John Doe",
        "letter_type": LetterType.THANK_YOU,
        "status": LetterStatus.SENT,
        "user_id": 1
    }
]

@router.get("/", response_model=List[LetterResponse])
async def get_letters():
    """Get all letters for the current user (demo version)"""
    return demo_letters

@router.post("/", response_model=LetterResponse)
async def create_letter(letter: LetterCreate):
    """Create a new letter (demo version)"""
    new_letter = {
        "id": len(demo_letters) + 1,
        **letter.dict(),
        "status": LetterStatus.DRAFT,
        "user_id": 1  # Demo user ID
    }
    demo_letters.append(new_letter)
    return new_letter

@router.get("/{letter_id}", response_model=LetterResponse)
async def get_letter(letter_id: int):
    """Get a specific letter by ID (demo version)"""
    for letter in demo_letters:
        if letter["id"] == letter_id:
            return letter
    return {"error": "Letter not found"}
