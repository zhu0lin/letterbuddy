# LetterBuddy - AI-Powered Letter Writing Assistant

A full-stack application with a Next.js frontend and Python FastAPI backend, designed to help users create beautiful, personalized letters with AI assistance.

## 🏗️ Project Structure

```
letterbuddy/
├── frontend/                 # Next.js Frontend Application
│   ├── src/                  # Source code
│   ├── public/               # Static assets
│   ├── package.json          # Node.js dependencies
│   ├── Dockerfile            # Frontend container
│   └── ...
├── backend/                  # Python FastAPI Backend
│   ├── app/                  # Application code
│   │   ├── api/             # API endpoints
│   │   ├── core/            # Configuration & database
│   │   ├── models/          # SQLAlchemy models
│   │   ├── schemas/         # Pydantic schemas
│   │   └── services/        # Business logic
│   ├── requirements.txt      # Python dependencies
│   ├── main.py              # FastAPI application
│   └── Dockerfile           # Backend container
├── docker-compose.yml        # Multi-service orchestration
└── README.md                 # This file
```

## 🚀 Quick Start with Docker

### Prerequisites
- Docker
- Docker Compose

### 1. Clone and Navigate
```bash
git clone <repository-url>
cd letterbuddy
```

### 2. Start All Services
```bash
docker-compose up --build
```

This will start:
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8000
- **PostgreSQL**: localhost:5432

### 3. Access the Application
- Open http://localhost:3000 in your browser
- API documentation available at http://localhost:8000/docs

## 🛠️ Development Setup

### Frontend Development
```bash
cd frontend
npm install
npm run dev
```

### Backend Development
```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --reload
```

## 🔧 Configuration

### Environment Variables

#### Backend (.env)
```bash
DATABASE_URL=postgresql://user:password@localhost/letterbuddy
SECRET_KEY=your-secret-key-here
ENVIRONMENT=development
DEBUG=true
```

#### Frontend (.env.local)
```bash
NEXT_PUBLIC_API_URL=http://localhost:8000
```

## 📚 API Documentation

Once the backend is running, visit:
- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

### Available Endpoints
- `POST /api/v1/auth/register` - User registration
- `POST /api/v1/auth/login` - User authentication
- `GET /api/v1/letters` - Get user letters
- `POST /api/v1/letters` - Create new letter
- `GET /api/v1/users/me` - Get current user info

## 🗄️ Database

The application uses PostgreSQL with the following main tables:
- **users** - User accounts and authentication
- **letters** - User-created letters

Database migrations are handled automatically on startup.

## 🐳 Docker Commands

### Development
```bash
# Start all services
docker-compose up

# Start in background
docker-compose up -d

# View logs
docker-compose logs -f

# Stop all services
docker-compose down
```

### Production Build
```bash
# Build production images
docker-compose -f docker-compose.prod.yml up --build
```

## 🧪 Testing

### Backend Tests
```bash
cd backend
pytest
```

### Frontend Tests
```bash
cd frontend
npm test
```

## 📦 Deployment

### Production Docker Compose
```bash
docker-compose -f docker-compose.prod.yml up -d
```

### Individual Services
```bash
# Backend only
docker-compose up backend

# Frontend only
docker-compose up frontend
```

## 🔒 Security Features

- JWT-based authentication
- Password hashing with bcrypt
- CORS configuration
- Environment-based configuration
- Input validation with Pydantic

## 🚧 Development Roadmap

- [ ] AI-powered letter suggestions
- [ ] Letter templates
- [ ] User preferences
- [ ] Letter sharing
- [ ] Export functionality
- [ ] Mobile app

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Check the API documentation at `/docs`
- Review the code examples in the `examples/` directory
