from sqlalchemy.orm import Session
from passlib.context import CryptContext
from jose import JWTError, jwt
from datetime import datetime, timedelta
from typing import Optional

from app.core.config import settings
from app.schemas.auth import UserCreate, Token
from app.models.user import User

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


class AuthService:
    def __init__(self, db: Session):
        self.db = db

    def verify_password(self, plain_password: str, hashed_password: str) -> bool:
        return pwd_context.verify(plain_password, hashed_password)

    def get_password_hash(self, password: str) -> str:
        return pwd_context.hash(password)

    def create_access_token(self, data: dict, expires_delta: Optional[timedelta] = None):
        to_encode = data.copy()
        if expires_delta:
            expire = datetime.utcnow() + expires_delta
        else:
            expire = datetime.utcnow() + timedelta(minutes=15)
        to_encode.update({"exp": expire})
        encoded_jwt = jwt.encode(to_encode, settings.SECRET_KEY, algorithm=settings.ALGORITHM)
        return encoded_jwt

    def register_user(self, user_data: UserCreate) -> Token:
        # Check if user already exists
        existing_user = self.db.query(User).filter(User.email == user_data.email).first()
        if existing_user:
            raise ValueError("User with this email already exists")

        # Create new user
        hashed_password = self.get_password_hash(user_data.password)
        db_user = User(
            email=user_data.email,
            first_name=user_data.first_name,
            last_name=user_data.last_name,
            hashed_password=hashed_password
        )
        
        self.db.add(db_user)
        self.db.commit()
        self.db.refresh(db_user)

        # Create access token
        access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
        access_token = self.create_access_token(
            data={"sub": db_user.email}, expires_delta=access_token_expires
        )

        return Token(
            access_token=access_token,
            token_type="bearer",
            user_id=db_user.id,
            email=db_user.email,
            name=f"{db_user.first_name} {db_user.last_name}"
        )

    def authenticate_user(self, email: str, password: str) -> Token:
        user = self.db.query(User).filter(User.email == email).first()
        if not user or not self.verify_password(password, user.hashed_password):
            raise ValueError("Incorrect email or password")

        # Create access token
        access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
        access_token = self.create_access_token(
            data={"sub": user.email}, expires_delta=access_token_expires
        )

        return Token(
            access_token=access_token,
            token_type="bearer",
            user_id=user.id,
            email=user.email,
            name=f"{user.first_name} {user.last_name}"
        )
