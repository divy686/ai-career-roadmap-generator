# Career Roadmap Backend

A FastAPI-based backend service that generates personalized career roadmaps using AI.

## Features

- AI-powered career roadmap generation
- RESTful API endpoints
- Environment-based configuration
- CORS support for frontend integration

## Tech Stack

- **FastAPI** - Modern, fast web framework for building APIs
- **Uvicorn** - ASGI server for running FastAPI
- **Pydantic** - Data validation using Python type annotations
- **Groq** - AI model integration
- **Python-dotenv** - Environment variable management

## Setup

### Prerequisites

- Python 3.8+
- pip

### Installation

1. Navigate to the backend directory:
```bash
cd backend
```

2. Create a virtual environment:
```bash
python -m venv .venv
```

3. Activate the virtual environment:
```bash
# Windows
.venv\Scripts\activate

# macOS/Linux
source .venv/bin/activate
```

4. Install dependencies:
```bash
pip install -r requirement.txt
```

5. Create a `.env` file with your configuration:
```env
GROQ_API_KEY=your_groq_api_key_here
```

### Running the Server

```bash
uvicorn main:app --reload
```

The API will be available at `http://localhost:8000`

## API Documentation

Once the server is running, visit:
- Swagger UI: `http://localhost:8000/docs`
- ReDoc: `http://localhost:8000/redoc`

## Project Structure

```
backend/
├── main.py          # FastAPI application entry point
├── prompt.py        # AI prompt templates
├── requirement.txt  # Python dependencies
├── .env            # Environment variables (create this)
├── .gitignore      # Git ignore rules
└── README.md       # This file
```

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `GROQ_API_KEY` | API key for Groq AI service | Yes |

## Development

### Code Style

- Follow PEP 8 guidelines
- Use type hints where possible
- Keep functions focused and well-documented

### Testing

```bash
# Install test dependencies
pip install pytest pytest-asyncio httpx

# Run tests
pytest
```