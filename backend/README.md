# LetterBuddy Backend Deployed on Railway

A simplified FastAPI backend for the LetterBuddy application.

## Structure

```
backend/
├── main.py              # Main FastAPI application
├── app/
│   └── routes/         # API route handlers
│       ├── auth.py     # Authentication endpoints
│       ├── letters.py  # Letter management endpoints
│       └── users.py    # User management endpoints
└── requirements.txt     # Python dependencies
```

## Getting Started

1. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

2. **Run the server:**
   ```bash
   python main.py
   ```
   
   Or with uvicorn directly:
   ```bash
   uvicorn main:app --reload
   ```

3. **Access the API:**
   - API: http://localhost:8000
   - Interactive docs: http://localhost:8000/docs
   - Alternative docs: http://localhost:8000/redoc

## API Endpoints

- **Authentication:** `/auth/register`, `/auth/login`
- **Letters:** `/letters/` (GET, POST), `/letters/{id}` (GET)
- **Users:** `/users/` (GET), `/users/{id}` (GET), `/users/me` (GET)

## Current Status

This is a **demo version** that returns mock data. No database is connected yet, making it perfect for learning FastAPI basics and testing your frontend integration.

## Next Steps

When you're ready to add a real database:
1. Add SQLAlchemy to requirements.txt
2. Create database models
3. Replace demo data with database queries
4. Add proper authentication with JWT tokens
