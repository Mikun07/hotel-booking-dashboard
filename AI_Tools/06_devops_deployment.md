# DevOps & Deployment Document
## StayEase — Hotel Booking & Management Platform

**Document Version:** v1.0.0
**Framework Reference:** DevOps___Deployment.md
**Status:** Approved — Production deployment planning may proceed
**Date:** 2025

---

## Phase 1: Operational Requirements Review

| Operational Requirement | Source | Target |
|---|---|---|
| Availability | NFR-004 | 99.5% uptime measured monthly |
| API Response Time | NFR-001 | P95 ≤ 500ms under 50 concurrent users |
| Search Response Time | NFR-002 | P95 ≤ 1000ms under load |
| Concurrent Users | NFR-012 | 50 minimum |
| Recovery Time Objective | Phase 11 | < 1 hour |
| Recovery Point Objective | Phase 11 | < 24 hours |
| Security | NFR-006–011 | HTTPS-only, secrets via env vars, no hardcoded credentials |
| Compliance | NFR-021 | GDPR-aware |
| Test Coverage Gates | NFR-016/017 | Backend ≥ 80%, Frontend ≥ 70% — enforced in CI |

---

## Phase 2: Environment Strategy

### Development Environment

**Purpose:** Local feature development, debugging, fast iteration.

**Infrastructure:**
- Docker Compose: `api` (port 8000), `frontend` (port 5173), `postgres` (port 5432), `mailhog` (ports 1025/8025)
- Hot-reload enabled (Uvicorn `--reload`, Vite HMR)
- Volume-mounted source code for live changes
- Local `.env` file (gitignored) provides configuration

**Access Controls:**
- Runs on developer's local machine only
- No internet-exposed ports

**Configuration:**
- `DATABASE_URL=postgresql+asyncpg://postgres:postgres@localhost:5432/stayease_dev`
- `MAILHOG_HOST=mailhog:1025`
- `JWT_SECRET=dev-secret-not-for-production`

---

### Staging Environment

**Purpose:** Pre-production validation, integration testing, release verification.

**Infrastructure:**
- Railway (or Render) environment named `staging`
- Separate managed PostgreSQL instance
- Backend deployed from `main` branch automatically
- Frontend deployed from `main` branch automatically

**Access Controls:**
- HTTP Basic Auth on staging frontend (prevents public access)
- Staging-only API keys for email service

**Configuration:**
- All secrets as Railway environment variables
- Separate `DATABASE_URL`, `JWT_SECRET` from production
- Uses Mailtrap or Mailhog in staging for safe email testing

**Deployment process:**
- Automatic on merge to `main` after all CI checks pass

---

### Production Environment

**Purpose:** Live operations serving real users.

**Infrastructure:**
- Railway (or Render) environment named `production`
- Managed PostgreSQL with automated backups enabled
- Backend: Docker container from `api/`
- Frontend: Static build hosted on Railway/Render or Netlify CDN

**Access Controls:**
- Environment secrets visible only to deployment service
- No direct database access from public internet
- Admin panel accessible only to authenticated ADMIN role users

**Configuration:**
- `JWT_SECRET`: 64-character random string generated at provisioning
- `DATABASE_URL`: Managed database connection string from Railway
- `ALLOWED_ORIGINS`: Frontend production URL only
- `SMTP_*`: SendGrid API key

**Deployment process:**
- Triggered manually from `production` branch or via GitHub Actions workflow dispatch after staging validation

---

## Phase 3: Containerisation Strategy

### Should Docker Be Used?

**Yes.** Docker eliminates "works on my machine" problems and ensures the development environment exactly matches the production runtime. All developers and CI runners use identical containers.

### Container Boundaries

| Service | Container | Base Image | Purpose |
|---|---|---|---|
| `api` | `backend` | `python:3.12-slim` | FastAPI application |
| `frontend` | `frontend` | `node:20-alpine` (build only) | Vite dev server (dev) / static build (prod) |
| `postgres` | `postgres` | `postgres:16-alpine` | PostgreSQL database |
| `mailhog` | `mailhog` | `mailhog/mailhog` | Fake SMTP server (dev only) |

### Backend Dockerfile

```dockerfile
# backend/Dockerfile
FROM python:3.12-slim AS base

WORKDIR /app

# Install dependencies in a separate layer for cache efficiency
COPY pyproject.toml .
RUN pip install --no-cache-dir .

# Copy source — separate from dependencies to preserve cache
COPY src/ ./src/

# Non-root user for security
RUN adduser --disabled-password --gecos "" appuser
USER appuser

EXPOSE 8000

CMD ["uvicorn", "src.api.main:app", "--host", "0.0.0.0", "--port", "8000"]
```

### Docker Compose (Development)

```yaml
# docker-compose.yml
services:
  api:
    build: ./backend
    ports: ["8000:8000"]
    volumes: ["./backend/src:/app/src"]  # Hot reload
    environment:
      DATABASE_URL: postgresql+asyncpg://postgres:postgres@postgres:5432/stayease_dev
      JWT_SECRET: dev-secret
      SMTP_HOST: mailhog
      SMTP_PORT: 1025
    depends_on: [postgres]
    command: uvicorn src.api.main:app --host 0.0.0.0 --port 8000 --reload

  frontend:
    build: ./frontend
    ports: ["5173:5173"]
    volumes: ["./frontend/src:/app/src"]
    environment:
      VITE_API_URL: http://localhost:8000

  postgres:
    image: postgres:16-alpine
    ports: ["5432:5432"]
    environment:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres
      POSTGRES_DB: stayease_dev
    volumes: ["postgres_data:/var/lib/postgresql/data"]

  mailhog:
    image: mailhog/mailhog
    ports: ["1025:1025", "8025:8025"]

volumes:
  postgres_data:
```

### Trade-offs

| Pro | Con |
|---|---|
| Consistent environment across all machines | Slightly longer initial setup |
| Production parity — same image in CI and deployment | Docker Desktop required on developer machines |
| Isolated services — no global package conflicts | Volume mounts slightly slower on macOS |

---

## Phase 4: CI/CD Pipeline Design

### Continuous Integration

The CI pipeline runs on every pull request and on every push to `main`.

**GitHub Actions Workflow: `ci.yml`**

```
Trigger: pull_request, push to main

Jobs:
┌─────────────────────────────────────────────────────────┐
│ backend-ci                                              │
│  1. Checkout code                                       │
│  2. Set up Python 3.12                                  │
│  3. Install dependencies (pyproject.toml)               │
│  4. Run: mypy --strict src/                             │  ← Type check gate
│  5. Run: ruff check src/                               │  ← Lint gate
│  6. Start postgres service container                    │
│  7. Run: alembic upgrade head (test DB)                │
│  8. Run: pytest --cov=src --cov-fail-under=80          │  ← Coverage gate
│  9. Run: pip-audit                                      │  ← Security gate
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│ frontend-ci                                             │
│  1. Checkout code                                       │
│  2. Set up Node 20                                      │
│  3. npm ci (reproducible install)                       │
│  4. Run: tsc --noEmit                                   │  ← Type check gate
│  5. Run: eslint src/                                    │  ← Lint gate
│  6. Run: vitest --coverage --coverage.threshold=70      │  ← Coverage gate
│  7. Run: npm audit --audit-level=critical               │  ← Security gate
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│ contract-tests                                          │
│  needs: [backend-ci, frontend-ci]                       │
│  1. Start backend + postgres (Docker Compose)           │
│  2. Run: pytest tests/contract/                         │  ← Contract gate
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│ e2e-tests                                               │
│  needs: [contract-tests]                                │
│  1. Start full stack (Docker Compose)                   │
│  2. Seed test database                                  │
│  3. Run: cypress run --headless                         │  ← E2E gate
│  4. Upload artifacts on failure (screenshots, videos)  │
└─────────────────────────────────────────────────────────┘
```

All four jobs must pass before a PR can be merged.

---

### Continuous Delivery

**GitHub Actions Workflow: `deploy.yml`**

```
Trigger: push to main (after CI passes)

Jobs:
┌─────────────────────────────────────────────────────────┐
│ deploy-staging                                          │
│  1. Build Docker image for backend                      │
│  2. Push image to Railway registry (or Docker Hub)     │
│  3. Deploy backend to Railway staging environment       │
│  4. Run: alembic upgrade head (staging DB)             │
│  5. Deploy frontend static build to staging             │
│  6. Run smoke test: GET /api/v1/health → expect 200    │
└─────────────────────────────────────────────────────────┘
```

**Production deployment** is triggered manually via workflow dispatch:
```
Trigger: workflow_dispatch (manual)

Requires: Manual approval from repository owner

Jobs:
┌─────────────────────────────────────────────────────────┐
│ deploy-production                                       │
│  1. Build Docker image (same SHA as staging)           │
│  2. Deploy backend to Railway production                │
│  3. Run: alembic upgrade head (production DB)          │
│  4. Deploy frontend to production                       │
│  5. Run smoke test: GET /api/v1/health → expect 200    │
└─────────────────────────────────────────────────────────┘
```

### Rollback Procedure

If the production health check fails after deployment:
1. Railway deploys the previous image version via `railway rollback`
2. If a migration was applied: run `alembic downgrade -1` manually
3. Monitor health endpoint for 5 minutes after rollback
4. File a postmortem issue on GitHub

---

### Continuous Deployment Decision

**Manual approval is required for production deployment.** Justification: This is a production system handling real bookings. An automated deploy that introduces a bug after a Friday merge could disrupt weekend guests. The manual step costs 30 seconds and prevents potentially expensive incidents. Staging is automatically deployed on merge to `main`.

---

## Phase 5: Infrastructure Design

### Compute

| Service | Resource | Notes |
|---|---|---|
| Backend API | Railway Starter (512MB RAM, shared CPU) | Scaled vertically if load increases |
| Frontend | Netlify CDN / Railway static | Global CDN distribution |

### Storage

| Resource | Provider | Notes |
|---|---|---|
| PostgreSQL database | Railway managed PostgreSQL | Automated daily backups enabled |
| Room images | Cloudinary (external) or public URL | Image URLs stored as strings in DB; images not served by this API |

### Networking

| Component | Configuration |
|---|---|
| HTTPS | Platform-managed TLS (Railway/Netlify) — automatic, always on |
| CORS | Backend allows only `VITE_APP_URL` in production |
| Domain | Custom domain configured in Railway/Netlify DNS settings |
| Health check | `/api/v1/health` — Railway monitors every 30 seconds |

---

## Phase 6: Configuration Management

### Environment Variables

**Backend:**

| Variable | Example | Sensitivity |
|---|---|---|
| `DATABASE_URL` | `postgresql+asyncpg://user:pass@host/db` | Secret |
| `JWT_SECRET` | 64-char random string | Secret |
| `JWT_ACCESS_EXPIRE_MINUTES` | `15` | Non-secret |
| `JWT_REFRESH_EXPIRE_DAYS` | `7` | Non-secret |
| `SMTP_HOST` | `smtp.sendgrid.net` | Non-secret |
| `SMTP_PORT` | `587` | Non-secret |
| `SMTP_USERNAME` | `apikey` | Non-secret |
| `SMTP_PASSWORD` | SendGrid API key | Secret |
| `ALLOWED_ORIGINS` | `https://stayease.app` | Non-secret |
| `ENVIRONMENT` | `production` | Non-secret |

**Frontend:**

| Variable | Example | Sensitivity |
|---|---|---|
| `VITE_API_URL` | `https://api.stayease.app` | Non-secret |

### Secrets Management

All secrets are stored as Railway environment variables (or Render environment config). Never committed to the repository. `.env.example` is committed with placeholder values to document required variables:

```dotenv
# .env.example (safe to commit — no real values)
DATABASE_URL=postgresql+asyncpg://user:password@host:5432/stayease
JWT_SECRET=your-64-char-secret-here
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_USERNAME=apikey
SMTP_PASSWORD=your-sendgrid-api-key
ALLOWED_ORIGINS=http://localhost:5173
```

**Secret rotation procedure:** Generate new value → update in Railway → redeploy (zero-downtime, Railway rolls instances). For `JWT_SECRET` rotation: all active sessions are invalidated — users must log in again. Documented in runbook.

---

## Phase 7: Monitoring Strategy

### System Monitoring

| Metric | Collection | Threshold | Alert |
|---|---|---|---|
| CPU usage | Railway dashboard | > 80% sustained | Manual review |
| Memory usage | Railway dashboard | > 80% | Manual review |
| Disk usage (database) | Railway PostgreSQL dashboard | > 70% | Manual review |

### Application Monitoring

| Metric | Collection | Threshold | Alert |
|---|---|---|---|
| API response time (P95) | Logging middleware → log aggregator | > 500ms | Email notification |
| Request error rate | Logging middleware (5xx count / total) | > 1% | Email notification |
| Health check status | Railway health monitor | Failure | Immediate email |

### Business Monitoring

| Metric | Collection | Frequency |
|---|---|---|
| Total bookings today | Admin dashboard (FR-030) | Real-time |
| Current occupancy rate | Admin dashboard (FR-030) | Real-time |
| Monthly revenue | Admin dashboard (FR-030) | Real-time |

---

## Phase 8: Logging Strategy

### Structured Logging

All logs are structured JSON, emitted to stdout (collected by Railway's log aggregator).

**Log format:**
```json
{
  "timestamp": "2025-07-10T14:32:01.123Z",
  "level": "INFO",
  "request_id": "a3f2b1c4",
  "method": "POST",
  "path": "/api/v1/bookings",
  "status_code": 201,
  "duration_ms": 87,
  "user_id": "uuid-here",
  "message": "Booking created successfully"
}
```

**Request ID:** Generated by middleware on every request (UUID4 shortened). Injected into all log entries for the request. Returned in all error responses so support can trace a specific request in logs.

**Log levels:**

| Level | Used For |
|---|---|
| DEBUG | Request/response bodies (dev only) |
| INFO | Normal operations: request completed, booking created, user registered |
| WARNING | Recoverable issues: email send failed, retry attempted |
| ERROR | Unhandled exceptions, database errors, authentication failures |

**What is NEVER logged:**
- Passwords (any field named `password`, `password_hash`)
- JWT tokens (full token string)
- Credit card numbers (not applicable v1)

### Log Retention

- Railway log retention: 7 days (free tier)
- For production: export to Papertrail or Logtail for 30-day retention (optional upgrade)

### Log Analysis

- Error logs searchable by `request_id` to trace a specific failing request
- Filter by `status_code: 5XX` to find backend errors
- Filter by `user_id` to trace a specific user's actions during an incident

---

## Phase 9: Observability Architecture

### Three Pillars

**Metrics:** System and application metrics collected via Railway dashboard + request logging middleware. K6 reports produce P95 response time metrics pre-release.

**Logs:** Structured JSON logs from all backend requests, errors, and business events. Searchable in Railway log viewer by request ID, user ID, or path.

**Traces:** Not implemented in v1.0.0. Each request has a `request_id` providing correlation. OpenTelemetry traces are the v2 improvement (noted in risk register).

### Health Check

`GET /api/v1/health` returns:
```json
{
  "status": "healthy",
  "database": "connected",
  "version": "1.0.0",
  "environment": "production"
}
```

If the database connection check fails, returns `503 Service Unavailable`. Railway monitors this every 30 seconds and alerts on failure.

---

## Phase 10: Security Operations Review

| Domain | Control | Implementation |
|---|---|---|
| Secrets management | Railway env vars; never in code | `.env.example` documents required vars |
| Deployment security | Only CI/CD pipeline can deploy | GitHub Actions + Railway deploy token |
| Access control | RBAC at API layer | `require_admin`, `require_staff_or_admin` FastAPI deps |
| Infrastructure security | Non-root Docker user | `USER appuser` in Dockerfile |
| Dependency security | CI scans on every PR | `pip-audit`, `npm audit` |
| CORS | Allowlist of trusted origins | Backend `ALLOWED_ORIGINS` env var |
| HTTPS | Enforced at platform level | Railway/Netlify TLS |
| Secret rotation | Documented procedure | Runbook in repository `/docs/runbooks/` |
| Token expiry | Short-lived access tokens | 15-minute access, 7-day refresh |

---

## Phase 11: Backup & Disaster Recovery

### Backup Strategy

| Resource | Frequency | Retention | Method |
|---|---|---|---|
| PostgreSQL database | Daily automated | 7 days | Railway managed backup |
| Source code | Continuous | Indefinite | GitHub repository |
| Docker images | Per deployment | Last 5 builds | Railway image registry |

**Manual backup procedure (pre-release):**
```bash
pg_dump $DATABASE_URL > backup_$(date +%Y%m%d).sql
```

### Recovery Objectives

| Objective | Target |
|---|---|
| RTO (Recovery Time Objective) | < 1 hour |
| RPO (Recovery Point Objective) | < 24 hours (last daily backup) |

### Data Restoration Procedure

1. Identify backup timestamp to restore from Railway dashboard
2. Railway: restore database from backup point
3. Verify integrity: `SELECT COUNT(*) FROM bookings`
4. Redeploy API service
5. Verify health check passes
6. Notify affected users of data loss window (if any)

### Failover Strategy

Railway provides automatic restart on container crash. If the Railway region is unavailable: manually redeploy to Render as a hot-standby option (documented in runbook). Estimated time: 20–30 minutes.

---

## Phase 12: Incident Management

### Incident Detection

| Source | Signal | Action |
|---|---|---|
| Railway health monitor | `/health` endpoint fails | Automatic email alert |
| Railway dashboard | CPU/memory anomaly | Manual triage |
| User report | "Cannot book a room" | Triage via logs |
| CI pipeline | Deploy fails | GitHub Actions notification |

### Incident Classification

| Severity | Definition | Example |
|---|---|---|
| P1 — Critical | System unavailable; data corruption | API returns 500 on all requests; double booking detected |
| P2 — High | Core feature broken | Booking creation fails; login fails |
| P3 — Medium | Feature degraded, workaround exists | Email notifications not sending |
| P4 — Low | Minor issue | UI cosmetic bug |

### Escalation Procedure

1. Detect incident via monitoring
2. Check `GET /api/v1/health` status
3. Check Railway logs filtered by `level: ERROR`
4. Identify `request_id` from error
5. Search logs for full trace of that request
6. Reproduce locally if possible
7. Apply fix → push to `main` → automatic staging deploy → manual production deploy
8. Verify health check passes

### Root Cause Analysis

For P1/P2 incidents: After resolution, write a postmortem issue in GitHub within 48 hours:
- Timeline of events
- Root cause
- How it was detected
- What resolved it
- What prevents recurrence (new test? new monitoring?)

---

## Phase 13: Scalability Review

### Current Capacity

Railway Starter tier supports the target of 50 concurrent users. PostgreSQL connection pooling via `asyncpg` handles concurrent requests efficiently.

### Growth Expectations

For a portfolio project, 50 concurrent users is the defined target. The following scaling options exist if requirements grow:

**Horizontal scaling:** Railway supports multiple backend instances behind a load balancer. Stateless JWT authentication means any instance can handle any request. No session affinity required.

**Vertical scaling:** Upgrade Railway plan for more CPU/RAM — simple configuration change.

**Database scaling:** Add connection pooling (PgBouncer) if connections become a bottleneck under heavy load.

**Caching:** Redis cache for room search results (30-second TTL) would reduce database load significantly under high read traffic. Not needed for v1 target.

### Database Scaling

Current indexing strategy (documented in Architecture document Phase 6.3) supports the query patterns. For significantly higher load: query-specific composite indexes can be added via Alembic migrations without downtime (using `CREATE INDEX CONCURRENTLY`).

---

## Phase 14: Cost Analysis

### Development (Local) — £0/month
Docker Desktop (free), local PostgreSQL via Docker.

### Staging (Railway Hobby Plan) — ~£5/month
- API service: Railway Hobby tier
- PostgreSQL: Railway managed (500MB included)
- Frontend: Netlify free tier (100GB bandwidth)

### Production (Railway Hobby Plan) — ~£10–15/month
- API service: Railway Hobby ($5/month)
- PostgreSQL managed: Railway ($5/month for 1GB)
- Frontend: Netlify free tier
- Email: SendGrid free tier (100 emails/day)

**Total production cost estimate: ~£10–15/month**

### Cost vs Reliability

The managed PostgreSQL cost is justified by automated backups satisfying the RPO target. Self-hosting PostgreSQL would save cost but adds operational burden (manual backups, updates).

### Cost Optimisation Opportunities

- Room images hosted on Cloudinary free tier (25GB storage, no backend serving cost)
- SendGrid free tier sufficient for portfolio-scale email volume
- Railway scales to zero during inactivity on dev/staging environments

---

## Phase 15: Operational Readiness Review

| Check | Status |
|---|---|
| ✅ CI/CD pipeline defined | GitHub Actions with 4 stages: backend, frontend, contract, E2E |
| ✅ Infrastructure defined | Railway (API + DB) + Netlify (frontend) |
| ✅ Monitoring defined | Health check, request logging, Railway dashboard metrics |
| ✅ Logging defined | Structured JSON with request IDs, sensitive data excluded |
| ✅ Security reviewed | Secrets management, RBAC, HTTPS, dependency scanning |
| ✅ Recovery strategy defined | Daily backups, RTO < 1h, RPO < 24h, rollback procedure |
| ✅ Incident management defined | P1-P4 classification, escalation procedure, postmortem template |
| ✅ Scalability reviewed | Horizontal scaling path documented; current capacity meets requirements |

**Operational Readiness: APPROVED.**

---

## Phase 16: Learning Concept — GitHub Actions CI/CD

**1. What is GitHub Actions?**

GitHub Actions is a platform for automating software workflows directly within a GitHub repository. Workflows are defined as YAML files in `.github/workflows/` and triggered by repository events (pull requests, pushes, manual dispatch). Each workflow contains jobs, which contain steps (shell commands or reusable Actions from the GitHub Marketplace).

**2. Why was it selected?**

It is already integrated into the GitHub repository — no additional tooling needed. The developer has existing experience with it from ReqSmell (80% coverage gate, mypy, TypeScript strict). Extending that knowledge to include multi-job pipelines, Docker Compose service containers, and deployment workflows is a natural and high-value progression.

**3. How it improves operations:**

Every pull request automatically runs type checking, linting, unit tests, integration tests, contract tests, and E2E tests before any merge. A developer cannot merge code that breaks the build, reduces coverage below the threshold, or introduces a security vulnerability. This means the `main` branch is always deployable.

**4. Trade-offs:**

| Pro | Con |
|---|---|
| Free for public repositories; generous free tier for private | YAML syntax can be verbose |
| Native GitHub integration — no extra accounts | Debugging failing jobs requires reading logs carefully |
| Secrets management built-in | Complex matrix builds can be slow |
| Marketplace of 10,000+ reusable Actions | Vendor lock-in vs Jenkins/GitLab CI |

**5. Interview discussion:**

"Every pull request to StayEase goes through a four-stage CI pipeline in GitHub Actions: backend checks (mypy, ruff, pytest with 80% coverage gate), frontend checks (tsc, ESLint, Vitest with 70% coverage gate), Pact contract verification, and finally Cypress E2E tests against a full Docker Compose stack. No job can be skipped. If any stage fails, the PR cannot be merged. This means the main branch is always in a releasable state, which is the definition of Continuous Integration. I designed it this way because in a two-service system, the most dangerous bugs are the ones that look fine in isolation but break the integration."

---

## Phase 17: Interview Readiness Review

| Question | Documented Answer |
|---|---|
| Why Railway/Render instead of AWS? | Operational simplicity at portfolio scale; AWS overhead unjustified for 50 concurrent users |
| Why manual production deploy? | Phase 4 — production hosts real bookings; the 30-second approval prevents Friday-night incidents |
| How do you handle secrets? | Phase 6 — Railway environment variables; `.env.example` documents without exposing |
| What is your rollback procedure? | Phase 4 — Railway rollback + `alembic downgrade -1`; documented runbook |
| How do you know if the system is unhealthy? | Phase 7+9 — Railway health monitor on `/api/v1/health` every 30 seconds |
| What happens if the database fails? | Phase 11 — Daily backups; RTO < 1h; documented restoration procedure |

**DevOps Status: APPROVED.**
