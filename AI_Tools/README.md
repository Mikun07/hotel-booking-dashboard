# StayEase — Hotel Booking & Management Platform
## Project Documentation Index

**Portfolio Value Score:** 8.4 / 10
**Status:** Pre-implementation All documentation complete ✅

---

## What Is This Project?

StayEase is a full-stack hotel booking and management platform. Guests can search and book rooms. Hotel staff manage check-ins and check-outs. Admins manage inventory, pricing, and view operational reports.

**Tech stack:**
- **Frontend:** React 18, TypeScript (strict), Redux Toolkit, React Query, Tailwind CSS, Shadcn UI
- **Backend:** Python 3.12, FastAPI, SQLAlchemy (async), Alembic, Pydantic v2
- **Database:** PostgreSQL 16
- **Testing:** pytest, Vitest, Cypress, Pact (contract testing)
- **DevOps:** Docker Compose, GitHub Actions, Railway

---

## Why This Project Exists

This project directly addresses the most critical gaps in the portfolio:

| Gap Filled | Demonstration |
|---|---|
| Full backend ownership | Complete Python/FastAPI backend with Clean Architecture |
| Database design | PostgreSQL schema design, indexing, Alembic migrations |
| Authentication & RBAC | JWT with refresh tokens; role-based access control |
| Multi-role system | Guest, Staff, and Admin roles with separate interfaces |
| Clean Architecture | Dependency rule enforced across all layers |
| Contract testing | Pact consumer-driven contracts between frontend and backend |
| Admin systems | Room management, user management, reporting dashboard |

---

## Document Index

All documents follow the engineering frameworks defined in the project specification. No implementation may begin until all documents are complete.

| # | Document | Framework | Status |
|---|---|---|---|
| 00 | [Portfolio Analysis](./00_portfolio_analysis.md) | Instructions.md | ✅ Complete |
| 01 | [Requirements Engineering](./01_requirements_engineering.md) | Requirements_Engineering.md | ✅ Complete |
| 02 | [Software Architecture](./02_software_architecture.md) | Software_Architecture.md | ✅ Complete |
| 03 | [Software Design — Backend](./03_software_design_backend.md) | Software_Design.md | ✅ Complete |
| 04 | [Software Design — Frontend](./04_software_design_frontend.md) | Software_Design.md | ✅ Complete |
| 05 | [Quality Engineering & Testing](./05_quality_engineering_testing.md) | Quality_Engineering___Testing.md | ✅ Complete |
| 06 | [DevOps & Deployment](./06_devops_deployment.md) | DevOps___Deployment.md | ✅ Complete |
| 07 | [Version Control & Documentation](./07_version_control_documentation.md) | Version_Control___Documentation.md | ✅ Complete |

---

## Key Numbers

| Metric | Value |
|---|---|
| Functional Requirements | 32 (FR-001 to FR-032) |
| Non-Functional Requirements | 22 (NFR-001 to NFR-022) |
| User Stories | 23 |
| Architecture Decision Records | 6 (ADR-001 to ADR-006) |
| Backend Design Decision Records | 3 (DDR-001 to DDR-003) |
| Frontend Design Decision Records | 2 (DDR-F001 to DDR-F002) |
| Backend test coverage target | ≥ 80% |
| Frontend test coverage target | ≥ 70% |
| CI quality gates | 11 enforced gates |
| New concepts learned | Clean Architecture, DDD Fundamentals, Contract Testing, GitHub Actions CI/CD, SOLID Principles |

---

## Implementation Order

When implementation begins, follow this order:

1. Backend: Domain layer (entities, value objects, exceptions)
2. Backend: Infrastructure layer (models, repositories, JWT, password, notifications)
3. Backend: Application layer (services, DTOs)
4. Backend: API layer (routes, dependencies, middleware)
5. Backend: Alembic migrations + Docker Compose
6. Backend: Unit + integration tests
7. Frontend: Project scaffold (Vite, TypeScript, Redux, React Query)
8. Frontend: Shared UI components
9. Frontend: Feature modules (auth → rooms → bookings → dashboards → admin)
10. Frontend: Unit tests per component
11. Contract tests (Pact)
12. E2E tests (Cypress)
13. GitHub Actions CI pipeline
14. Staging deployment
15. Performance testing (k6)
16. Production deployment

---

*All documentation complete. Implementation may begin.*
