# CareerFlow (JobTracker)

A full-stack application to track job applications, interviews, and career progress.

## Tech Stack

### Frontend
- **Framework**: React with Vite
- **Styling**: Vanilla CSS / Custom Components
- **Hosting**: Netlify
- **Routing**: React Router

### Backend
- **Framework**: FastAPI (Python)
- **Database**: PostgreSQL (managed via SQLAlchemy and Alembic)
- **Background Tasks**: Celery with Redis broker
- **Hosting**: Render

## Project Structure

- `/src`: Frontend React source code.
- `/public`: Static frontend assets and Netlify configurations (`_redirects`).
- `/backend`: FastAPI backend source code, Alembic database migrations, and Celery worker configurations.
- `docker-compose.yml`: Local development setup for PostgreSQL and Redis.
- `render.yaml`: Render Infrastructure-as-Code for deploying the backend services.

## Local Development

1. **Start the Databases**
   Make sure Docker is running, then spin up the local PostgreSQL and Redis instances:
   ```bash
   docker-compose up -d db redis
   ```

2. **Start the Backend**
   Open a terminal, navigate to the `backend` folder, install dependencies, and run the FastAPI server:
   ```bash
   cd backend
   python -m venv .venv
   .venv\Scripts\activate  # On Windows
   pip install -r requirements.txt
   
   # Run database migrations
   alembic upgrade head
   
   # Start the server
   python -m uvicorn app.main:app --reload
   ```

3. **Start the Frontend**
   Open a new terminal at the root of the project, install dependencies, and run the Vite dev server:
   ```bash
   npm install
   npm run dev
   ```

## Deployment

- **Frontend**: Automatically deployed to Netlify on every push to the `main` branch.
- **Backend**: Automatically deployed to Render on every push to the `main` branch via the configuration in `render.yaml`. The Render deployment consists of an API Web Service, a Celery Worker, a Redis instance, and a PostgreSQL database.
