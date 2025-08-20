from fastapi import APIRouter
from app.schemas.letter import LetterResponse, LetterCreate

router = APIRouter()


@router.get("/", response_model=list[LetterResponse])
async def get_letters():
    """Get all letters (demo version without database)"""
    # Demo data
    return [
        LetterResponse(
            id=1,
            title="Sample Letter",
            content="This is a sample letter content...",
            recipient="John Doe",
            letter_type="formal",
            status="draft",
            user_id=1,
            created_at="2024-01-01T00:00:00Z",
            updated_at="2024-01-01T00:00:00Z"
        )
    ]


@router.post("/", response_model=LetterResponse)
async def create_letter(letter_data: LetterCreate):
    """Create a new letter (demo version without database)"""
    # Demo implementation
    return LetterResponse(
        id=2,
        title=letter_data.title,
        content=letter_data.content,
        recipient=letter_data.recipient,
        letter_type=letter_data.letter_type,
        status=letter_data.status,
        user_id=1,
        created_at="2024-01-01T00:00:00Z",
        updated_at="2024-01-01T00:00:00Z"
    )


@router.get("/{letter_id}", response_model=LetterResponse)
async def get_letter(letter_id: int):
    """Get a specific letter (demo version without database)"""
    # Demo implementation
    return LetterResponse(
        id=letter_id,
        title="Sample Letter",
        content="This is a sample letter content...",
        recipient="John Doe",
        letter_type="formal",
        status="draft",
        user_id=1,
        created_at="2024-01-01T00:00:00Z",
        updated_at="2024-01-01T00:00:00Z"
    )
