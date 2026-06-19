# Career Roadmap Frontend

A modern React application for generating personalized career roadmaps with AI assistance.

## Features

- Interactive career roadmap generation
- Modern React with Vite for fast development
- Responsive design
- Real-time API integration with backend

## Tech Stack

- **React 18** - Modern React with hooks
- **Vite** - Fast build tool and dev server
- **ESLint** - Code linting and formatting
- **CSS3** - Modern styling

## Setup

### Prerequisites

- Node.js 16+
- npm or yarn

### Installation

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:5173`

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Project Structure

```
frontend/
├── public/
│   └── vite.svg
├── src/
│   ├── assets/
│   │   └── react.svg
│   ├── App.css
│   ├── App.jsx
│   ├── index.css
│   └── main.jsx
├── index.html
├── package.json
├── vite.config.js
├── eslint.config.js
└── README.md
```

## Development

### Code Style

- Follow React best practices
- Use functional components with hooks
- Keep components focused and reusable
- Use meaningful variable and function names

### Building for Production

```bash
npm run build
```

The build artifacts will be stored in the `dist/` directory.

## API Integration

The frontend communicates with the FastAPI backend running on `http://localhost:8000`. Make sure the backend server is running when developing.

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
