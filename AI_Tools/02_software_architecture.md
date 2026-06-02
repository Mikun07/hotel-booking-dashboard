# Software Architecture Document
## StayEase — Hotel Booking & Management Platform

**Document Version:** v1.0.0
**Framework Reference:** Software_Architecture.md
**Status:** Approved — Design phase may proceed
**Date:** 2025

---

## Phase 1: Architecture Drivers Analysis

Architecture decisions are driven by requirements. The following drivers are ranked by importance:

| Rank | Driver | Source Requirement | Justification |
|---|---|---|---|
| 1 | **Security** | NFR-006 to NFR-011 | Multi-role platform with sensitive booking and personal data. Auth must be robust and RBAC must be enforced at the infrastructure level. |
| 2 | **Correctness / Data Integrity** | FR-032, NFR-005 | Double-booking prevention is a hard requirement. The system must guarantee booking integrity under concurrent conditions. |
| 3 | **Maintainability** | NFR-016, NFR-017, NFR-018, NFR-019, NFR-020 | Portfolio project must demonstrate professional engineering discipline. High test coverage enforced in CI. |
| 4 | **Testability** | NFR-016, NFR-017 | 80% backend, 70% frontend coverage. Architecture must support independent testing at every layer. |
| 5 | **Reliability** | NFR-004, NFR-005 | 99.5% uptime. No data corruption. |
| 6 | **Performance** | NFR-001, NFR-002, NFR-003 | Sub-500ms API responses. Sub-1s search. Lighthouse ≥ 80. |
| 7 | **Accessibility** | NFR-013, NFR-014 | WCAG 2.1 AA — a non-negotiable quality attribute. |
| 8 | **Scalability** | NFR-012 | 50 concurrent users minimum. Growth potential. |

---

## Phase 2: Domain Decomposition

### Core Domains

**Booking Domain** — The heart of the business. Manages the creation, lifecycle, and integrity of reservations. Contains all rules about what constitutes a valid booking and how it transitions through states.

**Room Domain** — Manages the inventory of bookable rooms. Governs room availability, status, types, and pricing. The availability engine belongs here.

**User & Identity Domain** — Manages user accounts, authentication, and roles. Controls who can do what in the system.

### Supporting Domains

**Notification Domain** — Sends booking confirmation and cancellation emails. Does not contain business logic; it reacts to events from the Booking domain.

**Reporting Domain** — Aggregates booking data for admin dashboards and revenue reports. Read-only views over the core domains.

### Generic Domains

**Infrastructure Domain** — Database access, email service clients, JWT service, environment configuration. No business logic.

---

### Domain Interactions

```
User/Identity Domain
      │
      ├──► Booking Domain ──► Notification Domain
      │           │
      └──► Room Domain
                  │
                  └──► Reporting Domain (read)
```

---

## Phase 3: Architecture Style Selection

### Styles Evaluated

**Option A — Modular Monolith with Clean Architecture**

- Single deployable unit
- Domain, Application, Infrastructure, and API layers with strict dependency rules
- Advantages: Simple deployment, shared database transactions (critical for double-booking prevention), low operational overhead, easy to test
- Disadvantages: Cannot scale individual components independently
- Suitability: ✅ Excellent for this project scope

**Option B — Microservices**

- Separate services for bookings, rooms, auth, notifications
- Advantages: Independent scalability and deployment
- Disadvantages: Requires distributed transaction management (saga pattern) for booking integrity, adds complexity without benefit at this scale, requires service discovery, API gateway, inter-service communication
- Suitability: ❌ Over-engineered for a portfolio hotel platform. The double-booking prevention requirement (FR-032) is trivially solved with a database transaction in a monolith; it requires complex coordination in microservices.

**Option C — Layered Architecture (Traditional)**

- Presentation → Business → Data layers
- Advantages: Simple, widely understood
- Disadvantages: Typically leads to business logic in the service layer with tight coupling to the database layer, making unit testing harder
- Suitability: ⚠️ Acceptable but does not demonstrate Clean Architecture principles

### Selected Architecture: Modular Monolith with Clean Architecture

**Justification:** The requirements do not justify microservices. A single team, single domain, and 50 concurrent user target make a modular monolith ideal. Clean Architecture is applied over a simple layered architecture because it enforces the dependency rule — domain logic has zero dependencies on frameworks or infrastructure — making it independently testable and genuinely demonstrating architectural thinking for interviews.

---

## Phase 4: Architecture Decision Records (ADR)

### ADR-001: Architecture Style — Clean Architecture Modular Monolith

**Context:** The system serves multiple user roles, requires transactional booking integrity, and must demonstrate professional engineering practices for portfolio purposes.

**Options Considered:**
1. Microservices
2. Traditional Layered Architecture
3. Clean Architecture Modular Monolith

**Decision:** Clean Architecture Modular Monolith.

**Consequences:**
- ✅ All booking consistency requirements can be satisfied with simple database transactions
- ✅ Domain layer is completely framework-free and unit-testable without a database
- ✅ Architecture is explainable and demonstrates engineering maturity
- ⚠️ Cannot scale booking service independently from room service (acceptable at this scale)

---

### ADR-002: Backend Technology — Python / FastAPI

**Context:** The developer has existing proficiency with Python/FastAPI from the ReqSmell thesis project.

**Options Considered:**
1. Python / FastAPI
2. Node.js / Express
3. Node.js / NestJS

**Decision:** Python / FastAPI.

**Consequences:**
- ✅ Leverages existing expertise — implementation is not blocked by language unfamiliarity
- ✅ FastAPI enforces Pydantic schemas — request/response validation is explicit
- ✅ Auto-generated OpenAPI documentation satisfies NFR-018
- ✅ Async support for future scalability
- ⚠️ Python ecosystem is less common for web APIs than Node.js in some organisations (acceptable trade-off given existing skill)

---

### ADR-003: Database — PostgreSQL with SQLAlchemy ORM + Alembic

**Context:** The system requires ACID transactions to prevent double bookings (FR-032). The data model is relational (users, rooms, bookings with foreign keys).

**Options Considered:**
1. PostgreSQL (relational, ACID)
2. MongoDB (document, eventual consistency)
3. SQLite (relational, no network — dev only)

**Decision:** PostgreSQL as the primary data store, SQLAlchemy as the ORM, Alembic for migrations.

**Consequences:**
- ✅ ACID transactions guarantee booking integrity under concurrent conditions
- ✅ Relational model matches the domain (bookings reference users and rooms with integrity constraints)
- ✅ Alembic provides traceable, versioned schema migrations
- ✅ Expands portfolio beyond MongoDB (previously demonstrated)
- ⚠️ Requires more schema design upfront than MongoDB

---

### ADR-004: Authentication — JWT with Refresh Token Rotation

**Context:** The system must support stateless API authentication for a SPA frontend while maintaining short-lived access token security (NFR-007).

**Options Considered:**
1. Session-based authentication (server-side sessions)
2. JWT with single long-lived token
3. JWT with short-lived access token + refresh token

**Decision:** JWT access tokens (15-min expiry) + refresh tokens (7-day expiry) stored as HTTP-only cookies or in memory (frontend).

**Consequences:**
- ✅ Stateless — no session store required, scales horizontally
- ✅ Short access token expiry reduces exposure window
- ✅ Refresh tokens allow users to stay logged in without re-authentication
- ⚠️ Token refresh logic must be implemented in the frontend
- ⚠️ Token invalidation requires a refresh token blocklist in the database

---

### ADR-005: Frontend Framework — React 18 with TypeScript

**Context:** The developer has deep React/TypeScript expertise. The SPA pattern is appropriate for a booking platform.

**Options Considered:**
1. React 18 + TypeScript
2. Next.js (SSR)
3. Angular

**Decision:** React 18 + TypeScript SPA with Vite.

**Consequences:**
- ✅ Leverages existing deep expertise
- ✅ SPA is appropriate for the dashboard-heavy admin/staff views
- ✅ TypeScript strict mode enforces correctness (NFR-019)
- ⚠️ No SSR — initial page load SEO is limited (acceptable for a platform requiring login)

---

### ADR-006: Frontend State Management — Redux Toolkit + React Query

**Context:** The application requires both server state (booking data, rooms) and client state (auth, UI). Using Redux for all state leads to excessive boilerplate for server data.

**Options Considered:**
1. Redux Toolkit only
2. React Query only
3. Redux Toolkit (client state) + React Query (server state)

**Decision:** Redux Toolkit for client/auth state + React Query for server state.

**Consequences:**
- ✅ React Query handles caching, background refetching, loading/error states automatically
- ✅ Redux handles auth token, user role, and global UI state
- ✅ Reduces boilerplate — no manual loading/error state management for API calls
- ⚠️ Two state libraries to maintain — justified by their different responsibilities

---

## Phase 5: Component Architecture

### Backend Components

```
┌─────────────────────────────────────────────────────────────┐
│                        API Layer                            │
│   FastAPI Routers: auth, rooms, bookings, users, admin      │
│   Middleware: CORS, Auth, Logging                           │
└───────────────────────┬─────────────────────────────────────┘
                        │ calls
┌───────────────────────▼─────────────────────────────────────┐
│                   Application Layer                         │
│   Use Cases / Services: BookingService, RoomService,        │
│   AuthService, UserService, ReportingService                │
│   DTOs: Request/Response models (Pydantic)                  │
└──────────┬────────────────────────────┬─────────────────────┘
           │ uses                       │ uses
┌──────────▼──────┐            ┌────────▼────────────────────┐
│  Domain Layer   │            │   Infrastructure Layer       │
│  Entities       │            │   Repositories (SQLAlchemy)  │
│  Value Objects  │            │   EmailService (SMTP/SendGrid)│
│  Domain Rules   │            │   JWTService                 │
│  Interfaces     │            │   PasswordHasher             │
│  (ports)        │            │   Database Session Factory   │
└─────────────────┘            └─────────────────────────────┘
```

**API Layer Responsibilities:**
- Receive HTTP requests
- Validate request schemas (Pydantic)
- Enforce authentication via JWT middleware
- Enforce RBAC via role dependency injection
- Call application layer use cases
- Return HTTP responses

**Application Layer Responsibilities:**
- Orchestrate domain logic
- Call repositories for persistence
- Call infrastructure services (email, JWT)
- Manage transaction boundaries
- Map between DTOs and domain entities
- Contains NO domain rules (those live in the domain)

**Domain Layer Responsibilities:**
- Define business entities (Room, Booking, User)
- Define value objects (DateRange, Money)
- Enforce invariants (booking cannot overlap)
- Define repository interfaces (ports)
- Contains ZERO framework imports (no FastAPI, no SQLAlchemy)

**Infrastructure Layer Responsibilities:**
- Implement repository interfaces using SQLAlchemy
- Provide database session management
- Implement email sending
- Implement JWT encode/decode
- Implement password hashing/verification

---

### Frontend Components

```
┌──────────────────────────────────────────────────────────────┐
│                         Pages Layer                          │
│  HomePage, SearchResultsPage, RoomDetailPage, BookingPage,   │
│  GuestDashboard, StaffDashboard, AdminDashboard             │
└──────────────────────────┬───────────────────────────────────┘
                           │ uses
┌──────────────────────────▼───────────────────────────────────┐
│                       Features Layer                         │
│  auth/ | rooms/ | bookings/ | admin/ | staff/               │
│  Each feature: components, hooks, api, types, slice         │
└──────────────────────────┬───────────────────────────────────┘
                           │ uses
┌──────────────────────────▼───────────────────────────────────┐
│                       Shared Layer                           │
│  UI components (Button, Input, Card, Modal, Table)           │
│  Layout components (Navbar, Sidebar, Footer)                 │
│  Hooks (useAuth, useMediaQuery)                              │
│  Utils (formatDate, formatCurrency)                          │
└──────────────────────────┬───────────────────────────────────┘
                           │ uses
┌──────────────────────────▼───────────────────────────────────┐
│                     Services Layer                           │
│  apiClient (Axios instance with interceptors)                │
│  Redux Store (authSlice, uiSlice)                            │
│  React Query Client                                          │
└──────────────────────────────────────────────────────────────┘
```

---

## Phase 6: Data Architecture

### 6.1 Entity-Relationship Diagram

```
users
  id (PK, UUID)
  email (UNIQUE, NOT NULL)
  password_hash (NOT NULL)
  first_name (NOT NULL)
  last_name (NOT NULL)
  phone (nullable)
  role (ENUM: GUEST, STAFF, ADMIN)
  is_active (BOOLEAN, DEFAULT TRUE)
  created_at
  updated_at

room_types
  id (PK, SERIAL)
  name (UNIQUE: Single, Double, Suite, Penthouse)
  description

rooms
  id (PK, UUID)
  room_number (UNIQUE, NOT NULL)
  name (NOT NULL)
  description
  room_type_id (FK → room_types.id)
  capacity (NOT NULL, > 0)
  price_per_night (DECIMAL(10,2), NOT NULL, > 0)
  floor (NOT NULL)
  amenities (JSONB)
  images (JSONB — list of URLs)
  status (ENUM: AVAILABLE, MAINTENANCE, INACTIVE, DEFAULT: AVAILABLE)
  created_at
  updated_at

bookings
  id (PK, UUID)
  user_id (FK → users.id, NOT NULL)
  room_id (FK → rooms.id, NOT NULL)
  check_in_date (DATE, NOT NULL)
  check_out_date (DATE, NOT NULL)
  guests_count (NOT NULL, > 0)
  total_price (DECIMAL(10,2), NOT NULL)
  status (ENUM: PENDING, CONFIRMED, CHECKED_IN, CHECKED_OUT, CANCELLED)
  special_requests (TEXT, nullable)
  created_at
  updated_at

  CONSTRAINT no_overlapping_bookings — enforced at application layer with SELECT FOR UPDATE

refresh_tokens
  id (PK, UUID)
  user_id (FK → users.id, NOT NULL)
  token_hash (NOT NULL)
  expires_at (NOT NULL)
  is_revoked (BOOLEAN, DEFAULT FALSE)
  created_at
```

### 6.2 Booking State Machine

```
PENDING ──► CONFIRMED ──► CHECKED_IN ──► CHECKED_OUT
    │             │
    └─────────────┴──► CANCELLED
```

Valid transitions:
- PENDING → CONFIRMED (automatic at creation, v1)
- CONFIRMED → CHECKED_IN (staff action, FR-020)
- CHECKED_IN → CHECKED_OUT (staff action, FR-021)
- PENDING → CANCELLED (guest action, FR-015)
- CONFIRMED → CANCELLED (guest action, FR-015)

Invalid transitions (rejected with 422):
- CHECKED_IN → CANCELLED
- CHECKED_OUT → any
- CANCELLED → any

### 6.3 Database Indexing Strategy

| Table | Index | Purpose |
|---|---|---|
| bookings | (room_id, check_in_date, check_out_date) | Availability queries |
| bookings | (user_id, created_at DESC) | Guest booking history |
| bookings | (status, check_in_date) | Staff today's arrivals |
| rooms | (status, room_type_id, capacity) | Room search filtering |
| users | (email) | Login lookups (already UNIQUE) |
| refresh_tokens | (user_id, is_revoked) | Token lookup on refresh |

### 6.4 Double Booking Prevention

The availability query uses a PostgreSQL `SELECT ... FOR UPDATE` within a transaction:

```sql
BEGIN;
  SELECT id FROM bookings
  WHERE room_id = :room_id
    AND status IN ('CONFIRMED', 'CHECKED_IN')
    AND check_in_date < :check_out_date
    AND check_out_date > :check_in_date
  FOR UPDATE;
  -- If no rows returned, INSERT booking
  -- If rows returned, ROLLBACK and raise conflict error
COMMIT;
```

This ensures serialised access when concurrent requests target the same room and date range.

---

## Phase 7: Cross-Cutting Concerns

### Authentication

- JWT middleware applied globally to all protected routes
- Public routes: `GET /api/v1/rooms`, `GET /api/v1/rooms/{id}`, `POST /api/v1/auth/login`, `POST /api/v1/auth/register`, `POST /api/v1/auth/refresh`
- FastAPI dependency injection provides the decoded current user to all route handlers

### Authorisation

- Role dependency injected into route handlers: `Depends(require_admin)`, `Depends(require_staff_or_admin)`, `Depends(get_current_user)`
- Resource ownership checks in the Application layer (a guest cannot view another guest's booking)

### Logging

- Structured JSON logging via Python's `logging` module configured with `python-json-logger`
- Request ID generated per request and injected into all log entries
- Log levels: DEBUG (dev), INFO (prod), WARNING/ERROR (always)
- Sensitive data (passwords, tokens) never logged

### Error Handling

- Global FastAPI exception handler converts domain exceptions to HTTP responses
- Domain exceptions: `BookingConflictError`, `InvalidBookingTransitionError`, `RoomNotFoundError`, `AuthenticationError`
- All errors return consistent JSON: `{ "error": "...", "message": "...", "request_id": "..." }`

### Configuration Management

- All configuration loaded from environment variables via Pydantic `BaseSettings`
- No hardcoded configuration values
- `.env.example` committed to repository; `.env` gitignored

### Observability

- Health check endpoint: `GET /api/v1/health` returns service status and database connectivity
- Request logging middleware logs method, path, status code, and duration for every request

---

## Phase 8: Deployment Architecture

### Local Development Environment

```
docker-compose.yml
├── api (Python/FastAPI) — port 8000
├── frontend (React/Vite) — port 5173
├── postgres — port 5432
└── mailhog (fake SMTP) — port 1025 / 8025 (web UI)
```

- Hot reload enabled for both frontend and backend
- Volume mounts for code changes
- Environment variables from `.env.local`

### Staging / Production Environment

```
Railway (or Render)
├── API Service (Docker container from api/)
├── Frontend Service (static build from frontend/)
└── PostgreSQL (managed database)
```

- Environment secrets configured as Railway environment variables
- CI/CD deploys to production on merge to `main`
- HTTPS enforced via platform-managed TLS

### CI/CD Pipeline (GitHub Actions)

```
Pull Request:
  ├── Backend: mypy --strict, ruff lint, pytest (80% coverage gate)
  ├── Frontend: tsc --noEmit, ESLint, Vitest (70% coverage gate)
  └── Contract Tests: consumer contracts verified against backend

Merge to main:
  ├── All PR checks pass
  └── Deploy to Railway (backend + frontend)
```

---

## Phase 9: Quality Attribute Analysis

| Attribute | Architectural Support |
|---|---|
| **Security** | JWT middleware, RBAC dependencies, bcrypt hashing, HTTPS-only, secrets via env vars, refresh token blocklist |
| **Correctness** | SELECT FOR UPDATE in booking transaction, state machine validation in domain layer |
| **Maintainability** | Clean Architecture layers, TypeScript strict, mypy strict, 80%/70% coverage gates |
| **Testability** | Domain layer has zero framework deps — unit-testable with pure Python. Repos are behind interfaces — mockable in application tests |
| **Performance** | PostgreSQL indexes on booking/room queries, React Query caching, Lighthouse budget enforced in CI |
| **Accessibility** | WCAG 2.1 AA audit in CI via axe-core, Shadcn UI accessible components |
| **Reliability** | Health check endpoint, structured error handling, no silent failures, retry logic on email sends |

---

## Phase 10: Testability Assessment

| Test Type | Supported By Architecture |
|---|---|
| Unit — Domain | ✅ Domain layer has zero imports from framework. Pure Python entities. |
| Unit — Application | ✅ Repositories injected as interfaces — can be mocked with `unittest.mock` |
| Integration — Backend | ✅ TestClient + test PostgreSQL database via `pytest-asyncio` + `SQLAlchemy` |
| Contract | ✅ Pact consumer contract defined in frontend; backend provider verification in CI |
| E2E | ✅ Cypress against Docker Compose environment |
| Frontend Unit | ✅ Vitest + React Testing Library for component and hook tests |
| Accessibility | ✅ axe-core integration in Cypress for automated WCAG checks |

---

## Phase 11: Maintainability Assessment

| Factor | Assessment |
|---|---|
| Coupling | Low — layers communicate only through interfaces/DTOs |
| Cohesion | High — each module has a single responsibility |
| Complexity | Low-medium — no distributed systems, no message queues, no event sourcing |
| Extensibility | High — new features (payment, reviews) can be added as new use cases without modifying existing domain |
| Technical Debt Risks | Foreign key cascade behaviour must be documented; JSONB amenities field should be normalised in v2 |

---

## Phase 12: Risk Assessment

| Risk | Probability | Impact | Mitigation |
|---|---|---|---|
| Race condition on concurrent bookings | Medium | High | SELECT FOR UPDATE transaction strategy (FR-032, ADR-003) |
| JWT secret rotation breaking active sessions | Low | High | Document rotation procedure; short access token expiry limits exposure window |
| PostgreSQL migration error in production | Low | High | Alembic migration review in CI; tested against staging before production |
| Email delivery failure | Medium | Low | Async email sending; email failure does not fail booking creation |
| React Query stale cache showing wrong availability | Medium | Medium | Invalidate room query on booking success; explicit refetch on search submit |

---

## Phase 13: Learning Concept — Clean Architecture

**1. What is Clean Architecture?**

Clean Architecture (Robert C. Martin, 2012) organises code into concentric layers with a single rule: source code dependencies may only point inward. The outermost layer (HTTP, database) depends on inner layers. The innermost layer (domain) depends on nothing external.

**Layers (outside → inside):**
- Infrastructure (FastAPI routes, SQLAlchemy models, email client)
- Application (use cases, DTOs)
- Domain (entities, value objects, business rules, repository interfaces)

**2. Why was it chosen?**

The booking domain has complex business rules (availability checks, state machine, date validation) that must be independently testable. With Clean Architecture, the `BookingEntity.validate_cancellable()` method can be unit-tested in pure Python with no database, no HTTP server, and no mock objects.

**3. Trade-offs:**

| Pro | Con |
|---|---|
| Domain logic testable without infrastructure | More files and layers than a simple script |
| Framework changes don't affect domain | Requires discipline to maintain dependency rule |
| Business logic is co-located in one place | Initial setup takes longer |

**4. How it improves the system:**

When the email service provider changes, only the infrastructure layer changes. When a business rule changes (e.g. cancellations only allowed 24h before check-in), only the domain entity changes. No ripple effects through the codebase.

**5. Interview discussion:**

"I applied Clean Architecture to the backend specifically because booking integrity is a non-trivial domain rule. By placing the availability check and state machine in the domain layer — which has zero imports from FastAPI or SQLAlchemy — I can write pure unit tests for those rules in milliseconds. The architecture also meant that when I switched the email provider, I only changed one infrastructure class. The application layer use cases were untouched."

---

## Phase 14: Interview Readiness Review

| Question | Documented Answer |
|---|---|
| Why Clean Architecture over a simple layered architecture? | ADR-001, Learning Concept section |
| Why not microservices? | ADR-001 — double-booking prevention is trivially solved in a monolith |
| Why PostgreSQL over MongoDB? | ADR-003 — ACID transactions, relational model |
| Why JWT with refresh tokens? | ADR-004 — stateless, short-lived access tokens |
| Why React Query alongside Redux? | ADR-006 — separate responsibilities for server vs client state |
| What trade-offs were made? | Risk Assessment, each ADR Consequences section |
| How does the system prevent double bookings? | Phase 6.4 — SELECT FOR UPDATE |
| How is RBAC enforced? | Phase 7 — Role dependency injection in FastAPI |

**Architecture Status: APPROVED. Design phase may begin.**
