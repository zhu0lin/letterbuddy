from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey, Enum
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from app.core.database import Base
from app.schemas.letter import LetterType, LetterStatus


class Letter(Base):
    __tablename__ = "letters"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    content = Column(Text, nullable=False)
    recipient = Column(String, nullable=False)
    letter_type = Column(Enum(LetterType), nullable=False)
    status = Column(Enum(LetterStatus), default=LetterStatus.DRAFT)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    # Relationship
    user = relationship("User", back_populates="letters")
