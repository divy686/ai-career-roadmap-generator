# Career Roadmap Generator

An AI-powered application that generates personalized career roadmaps to help professionals transition between roles and advance their careers.

## Overview

This full-stack application combines a FastAPI backend with a React frontend to create comprehensive, actionable career roadmaps based on user input including current role, skills, target role, and time commitment.

## Features

- **Personalized Roadmaps**: AI-generated career paths tailored to individual profiles
- **Skill Gap Analysis**: Detailed comparison of current vs target role requirements
- **Learning Resources**: Curated courses, books, and certification recommendations
- **Portfolio Projects**: Hands-on project suggestions with real-world applications
- **Timeline Planning**: Monthly milestones and measurable goals
- **Market Insights**: Salary expectations and industry trends

## Tech Stack

### Backend
- FastAPI (Python web framework)
- Groq AI (Language model integration)
- Uvicorn (ASGI server)
- Pydantic (Data validation)

### Frontend
- React 18 (UI framework)
- Vite (Build tool)
- Modern CSS3 (Styling)

## Quick Start

### Prerequisites
- Python 3.8+
- Node.js 16+
- Groq API key

### Backend Setup
```bash
cd backend
python -m venv .venv
.venv\Scripts\activate  # Windows
source .venv/bin/activate  # macOS/Linux
pip install -r requirement.txt
```

Create `.env` file:
```env
GROQ_API_KEY=your_api_key_here
```

Start backend:
```bash
uvicorn main:app --reload
```

### Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

## Project Structure

```
career-roadmap/
├── backend/
│   ├── main.py          # FastAPI application
│   ├── prompt.py        # AI prompt templates
│   ├── requirement.txt  # Python dependencies
│   ├── .env            # Environment variables
│   └── README.md       # Backend documentation
├── frontend/
│   ├── src/            # React source code
│   ├── public/         # Static assets
│   ├── package.json    # Node.js dependencies
│   └── README.md       # Frontend documentation
├── .gitignore          # Git ignore rules
└── README.md           # This file
```

## API Endpoints

- `GET /` - Health check
- `POST /generate-roadmap` - Generate career roadmap

## Development

### Backend Development
- API documentation: `http://localhost:8000/docs`
- Follow PEP 8 guidelines
- Use type hints

### Frontend Development
- Development server: `http://localhost:5173`
- Follow React best practices
- Use functional components with hooks

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For questions or issues, please open a GitHub issue or contact the development team.