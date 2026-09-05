# AEGIS-TWIN

AEGIS-TWIN is a full-stack project for simulating and analyzing network security states using a twin graph model.

## Structure
- `/backend`: FastAPI and NetworkX based backend for graph modeling.
- `/frontend`: React dashboard using D3.js for live graph rendering.

## Setup

### Backend
1. Install Python dependencies:
   ```bash
   cd backend
   pip install -r requirements.txt
   ```
2. Run the backend (defaults to port 8000):
   ```bash
   uvicorn main:app --reload
   ```

### Frontend
1. Install Node dependencies:
   ```bash
   cd frontend
   npm install
   ```
2. Run the development server (defaults to port 5173):
   ```bash
   npm run dev
   ```

Open your browser to the URL provided by Vite (usually `http://localhost:5173`) to view the interactive dashboard.
