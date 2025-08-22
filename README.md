# LetterBuddy - AI-Powered Handwriting Improvement Assistant

A full-stack application with a Next.js frontend and Python FastAPI backend, designed to help users improve their handwriting through AI-powered photo analysis and personalized practice exercises.

## ✨ Features

### 🖋️ **Handwriting Analysis**
- **AI-Powered Photo Analysis**: Upload photos of your handwriting for instant feedback
- **Letter Detection**: Identifies specific letters that need improvement
- **Quality Assessment**: Provides scores and detailed feedback on spacing, consistency, and readability
- **Personalized Suggestions**: AI-generated improvement tips tailored to your writing

### 📚 **AI Practice System**
- **Smart Practice Sentences**: OpenAI-generated sentences with frequent target letter occurrences
- **Difficulty Levels**: Beginner, Intermediate, and Advanced practice content
- **Personalized Practice Plans**: Focus on letters that need the most improvement
- **Practice Tips**: AI-generated guidance for better handwriting

### 🔐 **User Management**
- **Secure Authentication**: JWT-based login system with Supabase
- **Progress Tracking**: Monitor your handwriting improvement over time
- **Sample History**: Keep track of all your uploaded handwriting samples

### 🎨 **Modern UI/UX**
- **Responsive Design**: Works perfectly on desktop, tablet, and mobile
- **Beautiful Interface**: Clean, modern design with smooth animations
- **Intuitive Navigation**: Easy-to-use dashboard and practice interface

## 🏗️ Project Structure

```
letterbuddy/
├── frontend/                 # Next.js 15 Frontend Application
│   ├── src/
│   │   ├── app/             # App Router pages
│   │   │   ├── (auth)/      # Authentication pages
│   │   │   ├── (dashboard)/ # Protected dashboard pages
│   │   │   └── upload/      # Handwriting upload
│   │   ├── components/      # Reusable UI components
│   │   ├── context/         # React context providers
│   │   ├── hooks/           # Custom React hooks
│   │   ├── lib/             # Utility functions and API
│   │   └── styles/          # Global styles and Tailwind CSS
│   ├── public/              # Static assets and favicon
│   ├── package.json         # Node.js dependencies
│   └── Dockerfile           # Frontend container
├── backend/                  # Python FastAPI Backend
│   ├── app/
│   │   ├── routes/          # API endpoints
│   │   │   ├── auth.py      # Authentication routes
│   │   │   ├── handwriting.py # Handwriting analysis & practice
│   │   │   ├── letters.py   # Letter management
│   │   │   └── users.py     # User management
│   │   └── __init__.py
│   ├── requirements.txt     # Python dependencies
│   ├── main.py             # FastAPI application
│   └── Dockerfile          # Backend container
├── docker-compose.yml       # Multi-service orchestration
└── README.md               # This file
```

## 🚀 Quick Start with Docker

### Prerequisites
- Docker Desktop
- Docker Compose

### 1. Clone and Navigate
```bash
git clone <repository-url>
cd letterbuddy
```

### 2. Set Environment Variables
Create a `.env` file in the root directory:
```bash
# OpenAI API Configuration
OPENAI_API_KEY=your_openai_api_key_here

# Database Configuration
DATABASE_URL=postgresql://letterbuddy:letterbuddy123@localhost:5432/letterbuddy

# Secret Key for JWT tokens
SECRET_KEY=your-secret-key-here-change-in-production

# Environment
ENVIRONMENT=development
```

### 3. Start All Services
```bash
# Load environment variables and start services
source .env && docker-compose up --build -d
```

This will start:
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8000
- **PostgreSQL**: localhost:5432

### 4. Access the Application
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

#### Root (.env)
```bash
# OpenAI API Configuration
OPENAI_API_KEY=your_openai_api_key_here

# Database Configuration
DATABASE_URL=postgresql://letterbuddy:letterbuddy123@localhost:5432/letterbuddy

# Secret Key for JWT tokens
SECRET_KEY=your-secret-key-here-change-in-production

# Environment
ENVIRONMENT=development
```

#### Frontend (Docker Environment)
```bash
NEXT_PUBLIC_API_URL=http://localhost:8000
```

## 📚 API Documentation

Once the backend is running, visit:
- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

### Available Endpoints

#### Authentication
- `POST /auth/register` - User registration
- `POST /auth/login` - User authentication

#### Handwriting Analysis
- `POST /handwriting/analyze` - Analyze handwriting from photo
- `POST /handwriting/practice-sentences` - Generate AI practice sentences
- `GET /handwriting/demo` - Get demo analysis response

#### User Management
- `GET /users/me` - Get current user info
- `PUT /users/me` - Update user profile

#### Letters
- `GET /letters` - Get user letters
- `POST /letters` - Create new letter

## 🗄️ Database

The application uses PostgreSQL with the following main tables:
- **users** - User accounts and authentication
- **user_uploads** - Handwriting samples and analysis results
- **user_letters_to_improve** - Letters that need practice
- **letters** - User-created letters

Database migrations are handled automatically on startup.

## 🐳 Docker Commands

### Development
```bash
# Start all services in background
docker-compose up -d

# Start with rebuild
docker-compose up --build -d

# View logs
docker-compose logs -f [service-name]

# Stop all services
docker-compose down

# Restart specific service
docker-compose restart [service-name]
```

### Service Management
```bash
# Check status
docker-compose ps

# View logs for specific service
docker logs letterbuddy-backend-1 -f
docker logs letterbuddy-frontend-1 -f
docker logs letterbuddy-postgres-1 -f
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

- JWT-based authentication with Supabase
- Password hashing with bcrypt
- CORS configuration for production domains
- Environment-based configuration
- Input validation with Pydantic
- Secure file upload handling

## 🌟 Key Technologies

### Frontend
- **Next.js 15** - React framework with App Router
- **Tailwind CSS** - Utility-first CSS framework
- **Supabase** - Authentication and database
- **React Context** - State management

### Backend
- **FastAPI** - Modern Python web framework
- **OpenAI GPT-4** - AI-powered content generation
- **PostgreSQL** - Reliable database
- **Pillow** - Image processing
- **Uvicorn** - ASGI server

### Infrastructure
- **Docker** - Containerization
- **Docker Compose** - Multi-service orchestration
- **PostgreSQL** - Database service

## 🚧 Development Roadmap

- [x] **AI-powered handwriting analysis** ✅
- [x] **Personalized practice sentences** ✅
- [x] **User authentication system** ✅
- [x] **Progress tracking** ✅
- [x] **Modern responsive UI** ✅
- [ ] **Letter templates**
- [ ] **Export functionality**
- [ ] **Mobile app**
- [ ] **Advanced analytics**
- [ ] **Social features**

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Add tests if applicable
5. Commit your changes (`git commit -m 'Add amazing feature'`)
6. Push to the branch (`git push origin feature/amazing-feature`)
7. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Check the API documentation at http://localhost:8000/docs
- Review the code examples in the source code

## 🎯 Getting Started with Handwriting Improvement

1. **Sign Up**: Create your LetterBuddy account
2. **Upload Sample**: Take a photo of your handwriting and upload it
3. **Get Analysis**: Receive AI-powered feedback on your writing
4. **Practice**: Use AI-generated sentences to improve specific letters
5. **Track Progress**: Monitor your improvement over time
6. **Upload Again**: Submit new samples to see your progress

Start your handwriting improvement journey today! 🚀
