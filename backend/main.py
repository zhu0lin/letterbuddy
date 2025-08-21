from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes import auth, letters, users, handwriting
from dotenv import load_dotenv
import os

# Load environment variables from .env file
load_dotenv()

app = FastAPI(
    title="LetterBuddy API",
    description="Backend API for LetterBuddy - AI-powered letter writing assistant with handwriting analysis",
    version="1.0.0"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:3001"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routes directly
app.include_router(auth.router, prefix="/auth", tags=["authentication"])
app.include_router(letters.router, prefix="/letters", tags=["letters"])
app.include_router(users.router, prefix="/users", tags=["users"])
app.include_router(handwriting.router, prefix="/handwriting", tags=["handwriting analysis"])

@app.get("/")
async def root():
    return {"message": "Welcome to LetterBuddy API"}

@app.get("/health")
async def health_check():
    return {"status": "healthy"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
