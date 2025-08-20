from pydantic import BaseModel
from typing import Optional
from datetime import datetime
from enum import Enum


class LetterType(str, Enum):
    PERSONAL = "personal"
    BUSINESS = "business"
    FORMAL = "formal"
    INFORMAL = "informal"


class LetterStatus(str, Enum):
    DRAFT = "draft"
    SENT = "sent"
    ARCHIVED = "archived"


class LetterBase(BaseModel):
    title: str
    content: str
    recipient: str
    letter_type: LetterType
    status: LetterStatus = LetterStatus.DRAFT


class LetterCreate(LetterBase):
    pass


class LetterUpdate(BaseModel):
    title: Optional[str] = None
    content: Optional[str] = None
    recipient: Optional[str] = None
    letter_type: Optional[LetterType] = None
    status: Optional[LetterStatus] = None


class LetterResponse(LetterBase):
    id: int
    user_id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
