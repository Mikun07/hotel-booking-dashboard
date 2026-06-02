# Software Design Document — Backend
## StayEase — Hotel Booking & Management Platform

**Document Version:** v1.0.0
**Framework Reference:** Software_Design.md
**Scope:** Python / FastAPI Backend Service
**Status:** Approved — Backend implementation may proceed
**Date:** 2025

---

## Phase 1: Architecture Review

| Check | Status |
|---|---|
| ✅ Architecture approved | Clean Architecture Modular Monolith (ADR-001) |
| ✅ System boundaries defined | API, Application, Domain, Infrastructure layers |
| ✅ Component responsibilities clear | Documented in Architecture document Phase 5 |
| ✅ Architectural risks understood | Race conditions, JWT rotation, migration failures documented |
| ✅ Data model approved | PostgreSQL schema with indexing strategy documented |

No architectural ambiguity detected. Design phase proceeds.

---

## Phase 2: Module Decomposition

### Module Catalog

| Module | Layer | Responsibility | Dependencies |
|---|---|---|---|
| `domain.booking` | Domain | Booking entity, DateRange value object, booking state machine, availability validation | None |
| `domain.room` | Domain | Room entity, RoomType value object, room status transitions | None |
| `domain.user` | Domain | User entity, Role enum, password validation rules | None |
| `domain.repositories` | Domain | Abstract repository interfaces (ports) | None |
| `application.auth` | Application | Register, login, logout, refresh token use cases | domain.user, domain.repositories, infrastructure.jwt, infrastructure.password |
| `application.bookings` | Application | CreateBooking, CancelBooking, GetBooking, ListGuestBookings, CheckIn, CheckOut use cases | domain.booking, domain.room, domain.repositories, infrastructure.notifications |
| `application.rooms` | Application | ListRooms, SearchAvailableRooms, GetRoom, CreateRoom, UpdateRoom, DeactivateRoom use cases | domain.room, domain.repositories |
| `application.users` | Application | GetProfile, UpdateProfile, ListUsers, ChangeUserRole, DeactivateUser use cases | domain.user, domain.repositories |
| `application.reporting` | Application | GetDashboardStats, GetRevenueByDateRange use cases | domain.repositories |
| `infrastructure.db` | Infrastructure | SQLAlchemy engine, session factory, Base model | None |
| `infrastructure.models` | Infrastructure | SQLAlchemy ORM models (UserModel, RoomModel, BookingModel, RefreshTokenModel) | infrastructure.db |
| `infrastructure.repositories` | Infrastructure | Concrete repository implementations using SQLAlchemy | domain.repositories, infrastructure.models |
| `infrastructure.jwt` | Infrastructure | JWT encode, decode, access token creation, refresh token creation | None |
| `infrastructure.password` | Infrastructure | bcrypt hash, bcrypt verify | None |
| `infrastructure.notifications` | Infrastructure | Send booking confirmation email, send cancellation email | None |
| `infrastructure.config` | Infrastructure | Pydantic BaseSettings loading from environment variables | None |
| `api.v1.auth` | API | `/auth/register`, `/auth/login`, `/auth/logout`, `/auth/refresh` routes | application.auth |
| `api.v1.rooms` | API | `/rooms`, `/rooms/{id}` routes | application.rooms |
| `api.v1.bookings` | API | `/bookings` routes (guest CRUD + cancellation) | application.bookings |
| `api.v1.staff` | API | `/staff/reservations`, `/staff/checkin`, `/staff/checkout` routes | application.bookings |
| `api.v1.admin` | API | `/admin/rooms`, `/admin/bookings`, `/admin/users`, `/admin/reports` routes | application.rooms, application.bookings, application.users, application.reporting |
| `api.v1.dependencies` | API | `get_current_user`, `require_staff_or_admin`, `require_admin` FastAPI dependencies | infrastructure.jwt |
| `api.middleware` | API | Request ID injection, logging middleware, CORS middleware | None |

### Directory Structure

```
backend/
├── src/
│   ├── domain/
│   │   ├── booking/
│   │   │   ├── __init__.py
│   │   │   ├── entities.py        # Booking entity
│   │   │   ├── value_objects.py   # DateRange, Money
│   │   │   └── exceptions.py      # BookingConflictError, InvalidTransitionError
│   │   ├── room/
│   │   │   ├── __init__.py
│   │   │   ├── entities.py        # Room entity
│   │   │   ├── value_objects.py   # RoomType
│   │   │   └── exceptions.py
│   │   ├── user/
│   │   │   ├── __init__.py
│   │   │   ├── entities.py        # User entity
│   │   │   └── enums.py           # Role enum
│   │   └── repositories/
│   │       └── interfaces.py      # IBookingRepository, IRoomRepository, IUserRepository
│   ├── application/
│   │   ├── auth/
│   │   │   ├── dtos.py
│   │   │   └── service.py
│   │   ├── bookings/
│   │   │   ├── dtos.py
│   │   │   └── service.py
│   │   ├── rooms/
│   │   │   ├── dtos.py
│   │   │   └── service.py
│   │   ├── users/
│   │   │   ├── dtos.py
│   │   │   └── service.py
│   │   └── reporting/
│   │       ├── dtos.py
│   │       └── service.py
│   ├── infrastructure/
│   │   ├── db/
│   │   │   ├── session.py
│   │   │   └── base.py
│   │   ├── models/
│   │   │   ├── user.py
│   │   │   ├── room.py
│   │   │   ├── booking.py
│   │   │   └── refresh_token.py
│   │   ├── repositories/
│   │   │   ├── booking_repository.py
│   │   │   ├── room_repository.py
│   │   │   └── user_repository.py
│   │   ├── services/
│   │   │   ├── jwt_service.py
│   │   │   ├── password_service.py
│   │   │   └── notification_service.py
│   │   └── config.py
│   └── api/
│       ├── middleware/
│       │   ├── logging.py
│       │   └── request_id.py
│       ├── v1/
│       │   ├── dependencies.py
│       │   ├── auth.py
│       │   ├── rooms.py
│       │   ├── bookings.py
│       │   ├── staff.py
│       │   └── admin.py
│       └── main.py
├── tests/
│   ├── unit/
│   │   ├── domain/
│   │   └── application/
│   ├── integration/
│   │   ├── api/
│   │   └── repositories/
│   └── conftest.py
├── migrations/          # Alembic
│   ├── env.py
│   └── versions/
├── Dockerfile
├── docker-compose.yml
├── pyproject.toml
├── .env.example
└── README.md
```

---

## Phase 3: Interface Design

### 3.1 Domain Repository Interfaces (Ports)

```python
# domain/repositories/interfaces.py

class IBookingRepository(Protocol):
    async def find_by_id(self, booking_id: UUID) -> Booking | None: ...
    async def find_by_user(self, user_id: UUID, skip: int, limit: int) -> list[Booking]: ...
    async def find_all(self, filters: BookingFilters, skip: int, limit: int) -> list[Booking]: ...
    async def find_todays_arrivals(self) -> list[Booking]: ...
    async def find_conflicting(self, room_id: UUID, date_range: DateRange) -> list[Booking]: ...  # Uses SELECT FOR UPDATE
    async def save(self, booking: Booking) -> Booking: ...
    async def update(self, booking: Booking) -> Booking: ...

class IRoomRepository(Protocol):
    async def find_by_id(self, room_id: UUID) -> Room | None: ...
    async def find_all(self, filters: RoomFilters) -> list[Room]: ...
    async def find_available(self, date_range: DateRange, guests_count: int, filters: RoomFilters) -> list[Room]: ...
    async def save(self, room: Room) -> Room: ...
    async def update(self, room: Room) -> Room: ...

class IUserRepository(Protocol):
    async def find_by_id(self, user_id: UUID) -> User | None: ...
    async def find_by_email(self, email: str) -> User | None: ...
    async def find_all(self, skip: int, limit: int) -> list[User]: ...
    async def save(self, user: User) -> User: ...
    async def update(self, user: User) -> User: ...

class IRefreshTokenRepository(Protocol):
    async def save(self, token: RefreshToken) -> RefreshToken: ...
    async def find_valid_by_hash(self, token_hash: str) -> RefreshToken | None: ...
    async def revoke(self, token_id: UUID) -> None: ...
    async def revoke_all_for_user(self, user_id: UUID) -> None: ...
```

### 3.2 Application Service Interfaces

**BookingService — Public Methods:**

| Method | Input | Output | Error Contracts |
|---|---|---|---|
| `create_booking` | `CreateBookingDTO` | `BookingResponseDTO` | `RoomNotFoundError`, `BookingConflictError`, `InvalidDateRangeError` |
| `cancel_booking` | `booking_id: UUID`, `user_id: UUID` | `BookingResponseDTO` | `BookingNotFoundError`, `ForbiddenError`, `InvalidTransitionError` |
| `get_booking` | `booking_id: UUID`, `user_id: UUID`, `role: Role` | `BookingResponseDTO` | `BookingNotFoundError`, `ForbiddenError` |
| `list_guest_bookings` | `user_id: UUID`, `skip: int`, `limit: int` | `list[BookingResponseDTO]` | None |
| `process_check_in` | `booking_id: UUID` | `BookingResponseDTO` | `BookingNotFoundError`, `InvalidTransitionError` |
| `process_check_out` | `booking_id: UUID` | `BookingResponseDTO` | `BookingNotFoundError`, `InvalidTransitionError` |

**RoomService — Public Methods:**

| Method | Input | Output | Error Contracts |
|---|---|---|---|
| `list_rooms` | `filters: RoomFilters` | `list[RoomResponseDTO]` | None |
| `search_available` | `SearchRoomsDTO` | `list[RoomResponseDTO]` | `InvalidDateRangeError` |
| `get_room` | `room_id: UUID` | `RoomResponseDTO` | `RoomNotFoundError` |
| `create_room` | `CreateRoomDTO` | `RoomResponseDTO` | `RoomNumberAlreadyExistsError` |
| `update_room` | `room_id: UUID`, `UpdateRoomDTO` | `RoomResponseDTO` | `RoomNotFoundError` |
| `deactivate_room` | `room_id: UUID` | `RoomResponseDTO` | `RoomNotFoundError` |

---

## Phase 4: Design Pattern Analysis

### Repository Pattern

**Problem solved:** Application layer use cases must not know about SQLAlchemy, SQL, or PostgreSQL. If the database changes, application code must not change.

**Implementation:** Repository interfaces defined in `domain/repositories/interfaces.py`. Concrete implementations live in `infrastructure/repositories/`. Application services receive repository instances via constructor injection.

**Trade-off:** Adds an abstraction layer. Justified because it makes application-layer unit tests fast — repositories are mocked without a real database.

---

### Dependency Injection (Constructor Injection)

**Problem solved:** Services must be testable. Hard-coded dependencies make unit testing impossible.

**Implementation:** FastAPI's `Depends()` system injects repositories and services into route handlers. Service constructors receive repository instances. Example:

```python
class BookingService:
    def __init__(
        self,
        booking_repo: IBookingRepository,
        room_repo: IRoomRepository,
        notification_service: INotificationService,
    ):
        self._booking_repo = booking_repo
        self._room_repo = room_repo
        self._notification_service = notification_service
```

In tests, mock repositories are passed instead of real ones.

---

### Strategy Pattern — Notification Service

**Problem solved:** Email provider may change (SMTP today, SendGrid later). Booking service must not depend on a specific email client.

**Implementation:** `INotificationService` interface with `send_booking_confirmation()` and `send_cancellation_notification()` methods. `SMTPNotificationService` and `SendGridNotificationService` are concrete strategies.

---

### Factory — Database Session

**Problem solved:** Each request needs a fresh, isolated database session that is committed on success and rolled back on error.

**Implementation:** FastAPI dependency provides a session context manager via SQLAlchemy's `async_sessionmaker`. Route handlers receive the session via `Depends(get_db_session)`.

---

## Phase 5: Domain Model Design

### Booking Entity

```python
@dataclass
class Booking:
    id: UUID
    user_id: UUID
    room_id: UUID
    date_range: DateRange
    guests_count: int
    total_price: Decimal
    status: BookingStatus
    special_requests: str | None
    created_at: datetime
    updated_at: datetime

    def cancel(self) -> None:
        """Business rule: Only PENDING or CONFIRMED bookings may be cancelled."""
        if self.status not in (BookingStatus.PENDING, BookingStatus.CONFIRMED):
            raise InvalidTransitionError(
                f"A booking with status {self.status.value} cannot be cancelled."
            )
        self.status = BookingStatus.CANCELLED

    def check_in(self) -> None:
        """Business rule: Only CONFIRMED bookings may be checked in."""
        if self.status != BookingStatus.CONFIRMED:
            raise InvalidTransitionError(
                f"Check-in requires status CONFIRMED, not {self.status.value}."
            )
        self.status = BookingStatus.CHECKED_IN

    def check_out(self) -> None:
        """Business rule: Only CHECKED_IN bookings may be checked out."""
        if self.status != BookingStatus.CHECKED_IN:
            raise InvalidTransitionError(
                f"Check-out requires status CHECKED_IN, not {self.status.value}."
            )
        self.status = BookingStatus.CHECKED_OUT
```

### DateRange Value Object

```python
@dataclass(frozen=True)
class DateRange:
    check_in: date
    check_out: date

    def __post_init__(self) -> None:
        if self.check_out <= self.check_in:
            raise InvalidDateRangeError("Check-out date must be after check-in date.")

    @property
    def nights(self) -> int:
        return (self.check_out - self.check_in).days

    def overlaps(self, other: "DateRange") -> bool:
        return self.check_in < other.check_out and self.check_out > other.check_in
```

**Design decision:** `DateRange` is immutable (`frozen=True`). Business rules live inside the value object. The `overlaps()` method is the single source of truth for the availability check.

### Room Entity

```python
@dataclass
class Room:
    id: UUID
    room_number: str
    name: str
    description: str
    room_type: RoomType
    capacity: int
    price_per_night: Decimal
    floor: int
    amenities: list[str]
    images: list[str]
    status: RoomStatus

    def deactivate(self) -> None:
        self.status = RoomStatus.INACTIVE

    def set_maintenance(self) -> None:
        self.status = RoomStatus.MAINTENANCE

    def is_bookable(self) -> bool:
        return self.status == RoomStatus.AVAILABLE

    def calculate_total_price(self, date_range: DateRange) -> Decimal:
        return self.price_per_night * date_range.nights
```

### Business Rules Location

| Rule | Belongs In |
|---|---|
| Booking cannot overlap existing booking | `IBookingRepository.find_conflicting()` + `BookingService` |
| Booking cancellation only for PENDING/CONFIRMED | `Booking.cancel()` |
| Check-in only for CONFIRMED | `Booking.check_in()` |
| Room must be AVAILABLE to be booked | `Room.is_bookable()` |
| Total price = price_per_night × nights | `Room.calculate_total_price(DateRange)` |
| DateRange must have check_out > check_in | `DateRange.__post_init__()` |

**Key principle:** Business logic lives in the domain layer. The Application layer orchestrates; it does not make business decisions.

---

## Phase 6: API Design

### API Conventions

- Base path: `/api/v1/`
- All responses: `application/json`
- Authentication: `Authorization: Bearer <access_token>` header
- Pagination: `?skip=0&limit=20` query params
- Error format: `{ "detail": "...", "error_code": "...", "request_id": "..." }`
- HTTP status codes follow RFC 9110

### Endpoint Specifications

#### Authentication

**POST /api/v1/auth/register**
```
Request:  { first_name, last_name, email, password }
Response 201: { id, first_name, last_name, email, role }
Response 409: { detail: "Email address already in use" }
Response 422: Pydantic validation errors
```

**POST /api/v1/auth/login**
```
Request:  { email, password }
Response 200: { access_token, refresh_token, token_type: "bearer", expires_in: 900 }
Response 401: { detail: "Invalid credentials" }
```

**POST /api/v1/auth/refresh**
```
Request:  { refresh_token }
Response 200: { access_token, expires_in: 900 }
Response 401: { detail: "Invalid or expired refresh token" }
```

**POST /api/v1/auth/logout**
```
Auth: Required
Request:  { refresh_token }
Response 204: No content
```

#### Rooms

**GET /api/v1/rooms**
```
Auth: None (public)
Query params: ?room_type=DOUBLE&min_price=100&max_price=500
Response 200: { items: [RoomSummary], total: int }
```

**GET /api/v1/rooms/search**
```
Auth: None (public)
Query params: ?check_in=2025-07-10&check_out=2025-07-12&guests=2&room_type=DOUBLE
Response 200: { items: [RoomSummary], total: int }
Response 422: { detail: "Check-out date must be after check-in date" }
```

**GET /api/v1/rooms/{room_id}**
```
Auth: None (public)
Response 200: RoomDetail (full amenities, all images)
Response 404: { detail: "Room not found" }
```

#### Bookings (Guest)

**POST /api/v1/bookings**
```
Auth: Required (any role)
Request:  { room_id, check_in_date, check_out_date, guests_count, special_requests? }
Response 201: BookingDetail
Response 404: { detail: "Room not found" }
Response 409: { detail: "Room is not available for the selected dates" }
Response 422: Validation errors
```

**GET /api/v1/bookings**
```
Auth: Required (any role)
Query params: ?skip=0&limit=20
Response 200: { items: [BookingDetail], total: int }
Note: Returns only the authenticated user's bookings
```

**GET /api/v1/bookings/{booking_id}**
```
Auth: Required (any role)
Response 200: BookingDetail
Response 403: If booking belongs to another user
Response 404: If booking not found
```

**PATCH /api/v1/bookings/{booking_id}/cancel**
```
Auth: Required (any role)
Response 200: BookingDetail (status: CANCELLED)
Response 403: If booking belongs to another user
Response 422: If booking status is not cancellable
```

**PATCH /api/v1/bookings/{booking_id}/special-requests**
```
Auth: Required (any role)
Request:  { special_requests: string }
Response 200: BookingDetail
Response 403: If booking belongs to another user
Response 422: If booking is not in PENDING or CONFIRMED status
```

#### Staff

**GET /api/v1/staff/arrivals/today**
```
Auth: Required (STAFF or ADMIN)
Response 200: { items: [ArrivalSummary], total: int }
```

**PATCH /api/v1/staff/bookings/{booking_id}/check-in**
```
Auth: Required (STAFF or ADMIN)
Response 200: BookingDetail (status: CHECKED_IN)
Response 422: If booking is not in CONFIRMED status or check_in_date is in the future
```

**PATCH /api/v1/staff/bookings/{booking_id}/check-out**
```
Auth: Required (STAFF or ADMIN)
Response 200: BookingDetail (status: CHECKED_OUT)
Response 422: If booking is not in CHECKED_IN status
```

**GET /api/v1/staff/bookings**
```
Auth: Required (STAFF or ADMIN)
Query params: ?status=CONFIRMED&skip=0&limit=20
Response 200: { items: [BookingDetail], total: int }
```

#### Admin

**POST /api/v1/admin/rooms** — Create room
**PUT /api/v1/admin/rooms/{id}** — Update room
**PATCH /api/v1/admin/rooms/{id}/deactivate** — Deactivate room
**PATCH /api/v1/admin/rooms/{id}/maintenance** — Set maintenance
**GET /api/v1/admin/bookings** — All bookings with filters
**GET /api/v1/admin/users** — Paginated user list
**PATCH /api/v1/admin/users/{id}/role** — Change user role
**PATCH /api/v1/admin/users/{id}/deactivate** — Deactivate user
**GET /api/v1/admin/reports/dashboard** — Dashboard statistics
**GET /api/v1/admin/reports/revenue** — Revenue by date range

#### Health

**GET /api/v1/health**
```
Auth: None
Response 200: { status: "healthy", database: "connected", version: "1.0.0" }
Response 503: { status: "unhealthy", database: "disconnected" }
```

---

## Phase 7: Data Access Design

### Repository Implementations

**BookingRepository (Infrastructure)**

```python
class BookingRepository(IBookingRepository):
    def __init__(self, session: AsyncSession):
        self._session = session

    async def find_conflicting(
        self, room_id: UUID, date_range: DateRange
    ) -> list[BookingModel]:
        """Uses SELECT FOR UPDATE to prevent concurrent booking conflicts."""
        stmt = (
            select(BookingModel)
            .where(
                BookingModel.room_id == room_id,
                BookingModel.status.in_(["CONFIRMED", "CHECKED_IN"]),
                BookingModel.check_in_date < date_range.check_out,
                BookingModel.check_out_date > date_range.check_in,
            )
            .with_for_update()
        )
        result = await self._session.execute(stmt)
        return result.scalars().all()
```

### Transaction Boundaries

Transaction boundaries are managed at the Application layer (service methods), not at the API layer.

```python
# application/bookings/service.py

async def create_booking(self, dto: CreateBookingDTO) -> BookingResponseDTO:
    async with self._session_factory() as session:
        async with session.begin():  # Transaction starts here
            conflicts = await self._booking_repo.find_conflicting(
                dto.room_id, dto.date_range
            )  # SELECT FOR UPDATE inside transaction
            if conflicts:
                raise BookingConflictError("Room is not available for the selected dates.")
            booking = Booking.create(...)
            saved = await self._booking_repo.save(booking)
        # Transaction commits here — email sent after commit to avoid delays inside transaction
    await self._notification_service.send_booking_confirmation(saved)
    return BookingResponseDTO.from_entity(saved)
```

**Design decision:** Email sending occurs after the transaction commits. An email failure must not roll back a successful booking. Email failures are logged and retried asynchronously.

---

## Phase 8: Dependency Analysis

```
API Layer
  └── depends on → Application Layer
        └── depends on → Domain Layer (interfaces)
              ↑
Infrastructure Layer
  └── implements → Domain Layer (interfaces)
```

**Dependency direction is strictly inward. No circular dependencies.**

High-risk dependencies:
- `BookingService` → `IBookingRepository` (mitigated by interface, mockable)
- `BookingService` → `INotificationService` (mitigated by interface, can be no-op mock in tests)
- `infrastructure.jwt` → `python-jose` library (low risk — standard library)

---

## Phase 9: Error Handling Design

### Domain Exceptions

| Exception | HTTP Status | When Raised |
|---|---|---|
| `BookingConflictError` | 409 Conflict | Room not available for requested dates |
| `InvalidTransitionError` | 422 Unprocessable | Invalid booking status transition |
| `InvalidDateRangeError` | 422 Unprocessable | check_out ≤ check_in |
| `RoomNotFoundError` | 404 Not Found | Room ID not in database |
| `BookingNotFoundError` | 404 Not Found | Booking ID not in database |
| `ForbiddenError` | 403 Forbidden | User accessing another user's resource |
| `AuthenticationError` | 401 Unauthorized | Invalid/expired token or bad credentials |
| `UserNotFoundError` | 404 Not Found | User ID not in database |

### Global Exception Handler

```python
# api/main.py
@app.exception_handler(DomainException)
async def domain_exception_handler(request: Request, exc: DomainException):
    return JSONResponse(
        status_code=exc.http_status,
        content={
            "detail": exc.message,
            "error_code": exc.__class__.__name__,
            "request_id": request.state.request_id,
        },
    )
```

**Principles:**
- All exceptions are intentional and typed — no bare `except Exception`
- Unhandled exceptions return 500 with request ID (for traceability) but without stack traces in production
- Validation errors (422) are handled by FastAPI/Pydantic automatically

---

## Phase 10: Security Design Review

| Concern | Design |
|---|---|
| Password storage | bcrypt with cost factor 12 minimum. Hashed at registration. Never stored plain. |
| Token security | Access tokens: 15-min expiry, signed with HS256. Refresh tokens: stored as bcrypt hash in DB, 7-day expiry. |
| RBAC enforcement | FastAPI `Depends(require_admin)` at route level — cannot be bypassed by application logic. |
| Resource ownership | `BookingService.get_booking()` checks `booking.user_id == current_user.id` unless role is STAFF/ADMIN. |
| Input validation | All inputs validated by Pydantic schemas before reaching application layer. |
| SQL injection | SQLAlchemy ORM with parameterised queries — no raw SQL with user input. |
| Sensitive data exposure | Password hash never included in any response DTO. |
| CORS | Configured to allow only the known frontend origin in production. |

---

## Phase 11: Testability Review

| Module | Test Strategy |
|---|---|
| `domain/booking/entities.py` | Pure unit tests — no mocks needed. Test state machine transitions, DateRange validation, total price calculation. |
| `domain/room/entities.py` | Pure unit tests — test is_bookable(), deactivate(), status transitions. |
| `application/bookings/service.py` | Unit tests with mocked `IBookingRepository` and `INotificationService`. Test conflict detection, permission checks, DTO mapping. |
| `infrastructure/repositories/` | Integration tests using a real PostgreSQL test database via pytest fixtures. |
| `api/v1/` | Integration tests using FastAPI `TestClient` + test database. Full HTTP request/response cycle. |

**Coverage target:** 80% line coverage enforced by `pytest-cov` in CI.

---

## Phase 12: Maintainability Review

| Factor | Assessment |
|---|---|
| Coupling | Low — layers communicate via interfaces |
| Cohesion | High — each module has one responsibility |
| Extensibility | New use cases added as new service methods; domain entities extended without changing API |
| Technical Debt Risk | JSONB amenities field — unqueryable. Should be normalised in v2. |
| Refactoring Opportunity | Reporting service can become a separate read model (CQRS) if query complexity grows |

---

## Phase 13: Design Decision Records (DDR)

### DDR-001: Domain Entities as Pure Python Dataclasses

**Context:** Entities need to carry business rules. Must be testable without a database.

**Alternatives considered:**
1. SQLAlchemy models as domain entities (Active Record pattern)
2. Pure dataclasses (chosen)
3. Pydantic models as entities

**Selected solution:** Pure Python `@dataclass` for domain entities. SQLAlchemy models live only in the infrastructure layer.

**Consequences:** Mapping between domain entities and SQLAlchemy models required. Justified by testability and Clean Architecture compliance.

---

### DDR-002: Async All the Way

**Context:** FastAPI supports both sync and async. PostgreSQL queries are I/O-bound.

**Decision:** All database operations use `asyncpg` and `SQLAlchemy` async sessions. All service methods are `async def`.

**Consequences:** `pytest-asyncio` required for tests. All repository methods must be awaited. Justified by scalability under concurrent load.

---

### DDR-003: Email Sent After Transaction Commit

**Context:** Sending an email inside a database transaction introduces latency and makes email failures roll back the booking.

**Decision:** Commit booking transaction first. Send email after commit. Use try/except around email send to log failure without propagating.

**Consequences:** Small window where booking exists but email has not been sent. Acceptable trade-off — booking integrity is more critical than email delivery timing.

---

## Phase 14: Learning Concept — SOLID Principles

**1. What is it?**

SOLID is five object-oriented design principles: Single Responsibility, Open/Closed, Liskov Substitution, Interface Segregation, Dependency Inversion.

**2. Why was it chosen?**

The backend explicitly applies:
- **Single Responsibility:** Each service (BookingService, RoomService) has one domain responsibility. The notification concern is extracted to a separate service.
- **Open/Closed:** Adding a new notification channel (SMS) requires implementing `INotificationService`, not modifying `BookingService`.
- **Liskov Substitution:** `SMTPNotificationService` and `SendGridNotificationService` are substitutable.
- **Dependency Inversion:** `BookingService` depends on `IBookingRepository` (abstraction), not `SQLAlchemyBookingRepository` (concrete).

**3. How it improves the design:**

If the email provider changes, zero application-layer code changes. If the database changes, zero domain-layer code changes.

**4. Trade-offs:**

More files, more interfaces. Justified for a project that must demonstrate engineering principles.

**5. Interview discussion:**

"The Dependency Inversion Principle is visible throughout the backend. BookingService receives an IBookingRepository in its constructor — in tests, I inject a mock that returns predictable data. This means I can test all booking business logic without a running PostgreSQL instance. Every booking unit test runs in under 5ms."

---

## Phase 15: Interview Readiness Review

| Question | Documented Answer |
|---|---|
| Why are domain entities pure Python with no framework imports? | Clean Architecture — testability, framework independence (ADR-001, DDR-001) |
| How does the system prevent concurrent double bookings? | SELECT FOR UPDATE in a serialised transaction (Phase 7) |
| Where does business logic live? | Domain layer entities and value objects — not in routers or repositories |
| Why is email sent after the transaction? | DDR-003 — email failure must not roll back a valid booking |
| How is RBAC enforced? | FastAPI dependency injection at the route level (Phase 3.2, Phase 10) |
| How are repositories tested? | Integration tests with a real test PostgreSQL database (Phase 11) |

**Backend Design Status: APPROVED. Implementation may begin.**
