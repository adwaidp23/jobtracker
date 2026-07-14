# CareerFlow Production Readiness Checklist

Before deploying this application to production, ensure the following checklist is completed:

## Security
- [ ] Change `SECRET_KEY` in environment variables.
- [ ] Update `ALGORITHM` and `ACCESS_TOKEN_EXPIRE_MINUTES` as needed.
- [ ] Implement OAuth 2.0 Client IDs for Google and LinkedIn login.
- [ ] Configure `allow_origins` in `main.py` CORS middleware to restrict domains to your exact frontend URLs.
- [ ] Ensure database connections are using SSL in production.
- [ ] Store all sensitive credentials (DB passwords, Redis passwords, S3 keys) in a secure secret manager (e.g., AWS Secrets Manager, HashiCorp Vault).

## Infrastructure & Deployment
- [ ] Configure a robust reverse proxy (e.g., Nginx, Traefik) in front of the FastAPI application.
- [ ] Ensure Docker containers are running with non-root users.
- [ ] Set up persistent volumes securely for PostgreSQL and Redis.
- [ ] Set up external S3-compatible object storage for file uploads (Documents and Resumes).

## Background Processing (Celery)
- [ ] Run Celery workers in their own dedicated containers.
- [ ] Monitor Celery queues (e.g., using Flower).
- [ ] Implement robust error handling and retries for email/notification tasks.
- [ ] Schedule the `scan_and_notify_deadlines` task using `celery-beat`.

## Database
- [ ] Generate the initial Alembic migration (`alembic revision --autogenerate -m "Initial Schema"`) and apply it (`alembic upgrade head`).
- [ ] Configure PostgreSQL for production performance (tune shared buffers, work_mem, etc.).
- [ ] Setup automated database backups.

## Observability & Monitoring
- [ ] Integrate an APM tool (e.g., Datadog, New Relic) for performance monitoring.
- [ ] Set up centralized logging (e.g., ELK stack, CloudWatch).
- [ ] Configure alerts for 5xx errors and database connection failures.
