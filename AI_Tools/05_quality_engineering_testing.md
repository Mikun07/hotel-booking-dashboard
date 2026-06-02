# Quality Engineering & Testing Document
## StayEase — Hotel Booking & Management Platform

**Document Version:** v1.0.0
**Framework Reference:** Quality_Engineering___Testing.md
**Status:** Approved — Implementation may proceed
**Date:** 2025

---

## Phase 1: Quality Attribute Review

Quality attributes are ranked by business importance derived from the requirements:

| Rank | Attribute | Source | Justification |
|---|---|---|---|
| 1 | **Correctness** | FR-032, NFR-005 | Double-booking prevention is a hard correctness requirement. A single failure destroys user trust. |
| 2 | **Security** | NFR-006 to NFR-011 | Authentication, authorisation, and data protection are non-negotiable. |
| 3 | **Reliability** | NFR-004 | 99.5% uptime expected. Booking confirmations must be durable. |
| 4 | **Maintainability** | NFR-016, NFR-017 | 80% backend and 70% frontend coverage are CI-enforced gates. |
| 5 | **Performance** | NFR-001, NFR-002, NFR-003 | Sub-500ms API, sub-1s search, Lighthouse ≥ 80. |
| 6 | **Accessibility** | NFR-013, NFR-014 | WCAG 2.1 AA — a quality requirement, not a nice-to-have. |
| 7 | **Usability** | User personas | Booking flow must be completable without assistance. |

---

## Phase 2: Quality Risk Analysis

### Business Risks

| Risk | Impact | Probability | Mitigation |
|---|---|---|---|
| Double booking occurs | Critical — revenue, guest trust, legal exposure | Medium | SELECT FOR UPDATE transaction; contract test verifies conflict response |
| Guest cannot complete booking | High — lost revenue | Low | E2E test covers full booking flow |
| Guest receives no confirmation email | Medium — confusion, support load | Medium | Integration test verifies email dispatch; failure logged, not silently swallowed |
| Admin sets wrong room price | Medium | Low | Input validation (> 0); admin can correct |

### Technical Risks

| Risk | Impact | Probability | Mitigation |
|---|---|---|---|
| Race condition under concurrent booking | High | Medium | Unit test with locked transaction; load test simulating concurrent requests |
| JWT secret exposed | Critical | Low | Secrets via env vars; mypy + ruff scan; secret scanning in CI (gitleaks) |
| Alembic migration breaks production schema | High | Low | Migration tested against staging before production; auto rollback strategy |
| React Query stale cache shows outdated availability | Medium | Medium | Explicit `invalidateQueries` after booking creation |
| Axios interceptor causes infinite 401 retry loop | Medium | Low | `_retry` flag on request config; unit test for interceptor |

### Security Risks

| Risk | Impact | Probability | Mitigation |
|---|---|---|---|
| Unauthorised admin access | Critical | Low | RBAC enforced at FastAPI dependency level; integration test verifies 403 response |
| Broken Object Level Authorisation (BOLA) | High | Medium | `booking.user_id == current_user.id` check; integration test with mismatched users |
| Brute-force login | Medium | Medium | Rate limiting on `/auth/login` (Phase 9); test rate limit behaviour |
| SQL injection | High | Low | SQLAlchemy ORM parameterised queries; no raw SQL with user input |

---

## Phase 3: Test Strategy Design

### What will be tested?
All business-critical logic, all API endpoints, all UI flows, all accessibility requirements, and the API contract between frontend and backend.

### Why will it be tested?
To give confidence that the system behaves correctly under normal conditions, edge cases, and concurrent load, and to catch regressions before they reach users.

### When will it be tested?
- Unit and integration tests: on every pull request (CI)
- E2E tests: on every pull request (CI, headless)
- Contract tests: on every pull request (CI)
- Performance tests: weekly and before every release
- Accessibility tests: on every pull request (automated via axe-core) + manual audit before v1.0.0

### Who is responsible?
The developer owns all test strategy, test writing, and CI enforcement.

### How will success be measured?
- ≥ 80% backend line coverage
- ≥ 70% frontend line coverage
- Zero failing unit, integration, contract, or E2E tests in CI
- Zero WCAG AA violations in automated scan
- API P95 response time ≤ 500ms under defined load
- Zero known critical security vulnerabilities

### Test Pyramid

```
        ┌────────────────────┐
        │     E2E Tests      │  ← Few, slow, high confidence
        │  (Cypress)         │
        ├────────────────────┤
        │  Contract Tests    │  ← Medium count, fast
        │  (Pact)            │
        ├────────────────────┤
        │ Integration Tests  │  ← Medium count, moderate speed
        │ (pytest, RTL)      │
        ├────────────────────┤
        │   Unit Tests       │  ← Many, fast, high isolation
        │ (pytest, Vitest)   │
        └────────────────────┘
```

---

## Phase 4: Unit Testing Strategy

### Backend Unit Tests

**Framework:** pytest with pytest-asyncio

**Scope — what is unit tested:**

| Module | Tests | Examples |
|---|---|---|
| `domain/booking/entities.py` | Booking state machine transitions | `test_cancel_confirmed_booking_succeeds`, `test_cancel_checked_in_booking_raises` |
| `domain/booking/value_objects.py` | DateRange validation | `test_checkout_before_checkin_raises`, `test_nights_calculated_correctly`, `test_overlapping_ranges_detected` |
| `domain/room/entities.py` | Room entity methods | `test_deactivate_room_sets_status`, `test_is_bookable_returns_false_for_maintenance` |
| `application/bookings/service.py` | Use case logic | `test_create_booking_calls_repo_with_correct_args`, `test_create_booking_raises_on_conflict`, `test_cancel_booking_forbidden_for_wrong_user` |
| `application/auth/service.py` | Auth use cases | `test_login_returns_tokens_for_valid_credentials`, `test_login_raises_for_wrong_password` |
| `infrastructure/jwt_service.py` | Token encode/decode | `test_expired_token_raises`, `test_decoded_payload_matches_input` |

**Mocking strategy:**
- Repository interfaces mocked with `unittest.mock.AsyncMock`
- Notification service mocked with `AsyncMock` (assert called, never actually sends)
- JWT service tested with real encode/decode (no mocks — it's pure logic)

**What is NOT unit tested:**
- SQLAlchemy model mappings (covered by integration tests)
- FastAPI routing (covered by integration tests)

**Coverage target:** ≥ 80% lines.

---

### Frontend Unit Tests

**Framework:** Vitest + React Testing Library (RTL) + jsdom

**Scope:**

| Module | Tests | Examples |
|---|---|---|
| `authSlice.ts` | Reducer logic | `test_login_sets_user_and_token`, `test_logout_clears_state` |
| `LoginForm.tsx` | Form rendering and submission | `test_submit_disabled_until_fields_valid`, `test_calls_mutation_on_valid_submit` |
| `RoomCard.tsx` | Rendering and interaction | `test_renders_room_name_and_price`, `test_select_callback_fires_with_room_id` |
| `BookingForm.tsx` | Booking logic | `test_total_price_calculated_correctly`, `test_submit_disabled_for_invalid_dates` |
| `BookingStatusBadge.tsx` | Visual rendering | `test_confirmed_renders_green_badge`, `test_cancelled_renders_grey_badge` |
| `useRoomSearch.ts` | Hook logic | `test_query_disabled_when_params_null`, `test_correct_query_key_used` |
| `useCancelBooking.ts` | Mutation hook | `test_invalidates_booking_list_on_success` |

**Mocking strategy:**
- `services/api/client.ts` mocked with `vi.mock()`
- React Query wrapped in `QueryClientProvider` with fresh client per test
- Redux wrapped in `Provider` with a test store

**Coverage target:** ≥ 70% lines.

---

## Phase 5: Integration Testing Strategy

### Backend Integration Tests

**Framework:** pytest + FastAPI `TestClient` + real PostgreSQL test database

**Database strategy:**
- Separate `stayease_test` database created in Docker Compose
- Each test function uses a transactional fixture that rolls back after the test
- Alembic migrations applied once before the test suite

**Scope:**

| Scenario | Test |
|---|---|
| Full auth flow | `test_register_then_login_returns_valid_tokens` |
| Room search with real DB | `test_search_returns_only_available_rooms_for_date_range` |
| Booking creation | `test_create_booking_persists_correctly` |
| Double booking prevention | `test_concurrent_booking_only_one_succeeds` (uses `asyncio.gather`) |
| RBAC enforcement | `test_guest_cannot_access_admin_create_room` (expects 403) |
| BOLA protection | `test_guest_cannot_view_another_guests_booking` (expects 403) |
| Check-in flow | `test_staff_can_checkin_confirmed_booking` |
| Invalid transition | `test_cannot_checkin_already_checkedin_booking` |

**Example fixture:**

```python
@pytest.fixture
async def db_session(postgres_engine):
    async with AsyncSession(postgres_engine) as session:
        async with session.begin():
            yield session
            await session.rollback()
```

---

### Frontend Integration Tests

**Scope:** Components that integrate with the Redux store and React Query client.

| Scenario | Test |
|---|---|
| GuestDashboardPage renders bookings | Mock API returns 2 bookings; assert both BookingCards render |
| Cancel booking updates UI | Mock mutation succeeds; assert status badge updates to CANCELLED |
| Login redirects on success | Mock auth API; assert navigation to `/dashboard` |

---

## Phase 6: Contract Testing Strategy

### Overview

Contract testing verifies that the API contract between the frontend (consumer) and backend (provider) is never silently broken. A failing contract test in CI blocks a PR before integration testing catches the issue.

**Tool:** Pact (consumer-driven contract testing)

### Consumer (Frontend) — Contract Definition

The frontend defines what it expects from the backend. Contracts are generated by running Pact tests locally and committed to `/contracts/` in the repository.

**Example contract — GET /api/v1/rooms/search:**

```typescript
// contracts/rooms.pact.test.ts
describe("RoomsApi", () => {
  it("returns available rooms for a valid search", async () => {
    await provider.addInteraction({
      state: "rooms exist and room-1 is available on 2025-07-10 to 2025-07-12",
      uponReceiving: "a room search request",
      withRequest: {
        method: "GET",
        path: "/api/v1/rooms/search",
        query: { check_in: "2025-07-10", check_out: "2025-07-12", guests: "2" },
      },
      willRespondWith: {
        status: 200,
        body: {
          items: eachLike({
            id: like("uuid"),
            name: like("Deluxe Double"),
            pricePerNight: like(150.00),
            type: like("DOUBLE"),
            capacity: like(2),
          }),
          total: like(1),
        },
      },
    });
    const result = await roomsApi.search({ checkIn: "2025-07-10", checkOut: "2025-07-12", guests: 2 });
    expect(result.items).toHaveLength(1);
  });
});
```

**Contracts defined for:**
- `GET /api/v1/rooms` (room listing)
- `GET /api/v1/rooms/search` (availability search)
- `GET /api/v1/rooms/{id}` (room detail)
- `POST /api/v1/auth/login` (login response shape)
- `POST /api/v1/bookings` (booking creation success and conflict)
- `PATCH /api/v1/bookings/{id}/cancel` (cancellation)
- `GET /api/v1/bookings` (guest booking list)
- `GET /api/v1/staff/arrivals/today` (arrivals)

### Provider (Backend) — Contract Verification

The backend verifies it satisfies all consumer contracts on every pull request:

```
# In CI (GitHub Actions):
- name: Run Pact Provider Verification
  run: pytest tests/contract/test_provider_verification.py
```

### Breaking Change Detection

If a backend developer changes the response shape of `GET /api/v1/rooms` (e.g., renames `pricePerNight` to `price`), the contract verification step fails in CI, blocking the PR. The developer is notified before any frontend breakage occurs.

---

## Phase 7: End-to-End Testing Strategy

**Framework:** Cypress 13

**Environment:** Docker Compose test environment (backend + frontend + postgres + mailhog)

### Critical User Journeys

**Journey 1: Guest Books a Room (Happy Path)**
```
Preconditions: At least one available room exists in the database
Steps:
  1. Navigate to /
  2. Fill search form (valid dates, 2 guests)
  3. Click "Search"
  4. Assert search results page with at least one room
  5. Click first room's "View Details"
  6. Assert room detail page renders correctly
  7. Click "Book Now"
  8. Assert redirect to login (unauthenticated)
  9. Log in with guest credentials
  10. Assert redirect back to booking page
  11. Confirm booking details
  12. Submit booking
  13. Assert booking confirmation page with booking reference
  14. Navigate to /dashboard
  15. Assert new booking appears in "Upcoming Bookings"
Expected: Booking created with status CONFIRMED
```

**Journey 2: Guest Cancels a Booking**
```
Preconditions: Guest has a CONFIRMED booking
Steps:
  1. Log in as guest
  2. Navigate to /dashboard
  3. Click "Cancel" on a CONFIRMED booking
  4. Confirm cancellation in modal
  5. Assert booking status updates to CANCELLED
  6. Assert "Cancel" button no longer visible
Expected: Booking status is CANCELLED
```

**Journey 3: Staff Checks In a Guest**
```
Preconditions: A CONFIRMED booking exists with check-in date today
Steps:
  1. Log in as staff
  2. Navigate to /staff
  3. Assert guest appears in "Today's Arrivals" table
  4. Click "Check In"
  5. Assert booking row updates to show "Checked In" status
Expected: Booking status is CHECKED_IN
```

**Journey 4: Admin Creates a Room**
```
Preconditions: Logged in as admin
Steps:
  1. Navigate to /admin
  2. Click "Rooms" tab
  3. Click "Add Room"
  4. Fill in all room details
  5. Submit
  6. Assert new room appears in the rooms table
Expected: Room created with status AVAILABLE
```

**Journey 5: Unauthenticated User Cannot Access Dashboard**
```
Steps:
  1. Navigate directly to /dashboard (no session)
  2. Assert redirect to /login
  3. Navigate directly to /admin
  4. Assert redirect to /login
```

**Journey 6: WCAG Accessibility Scan**
```
Steps:
  1. Visit each key page: /, /rooms/search, /rooms/{id}, /login, /register
  2. Run cy.checkA11y() (axe-core) on each page
Expected: Zero critical or serious WCAG AA violations
```

---

## Phase 8: Performance Testing Strategy

**Framework:** k6 (load testing)

### Performance Goals (from NFR-001, NFR-002)

| Endpoint | Target (P95) | Under Load |
|---|---|---|
| `GET /api/v1/rooms` | ≤ 500ms | 50 concurrent users |
| `GET /api/v1/rooms/search` | ≤ 1000ms | 50 concurrent users |
| `POST /api/v1/bookings` | ≤ 500ms | 50 concurrent users |
| `POST /api/v1/auth/login` | ≤ 500ms | 50 concurrent users |

### Load Test Design

```javascript
// tests/performance/booking_load_test.js
import http from "k6/http";
import { check, sleep } from "k6";
import { Rate } from "k6/metrics";

const errorRate = new Rate("errors");

export const options = {
  stages: [
    { duration: "1m", target: 25 },   // Ramp up
    { duration: "3m", target: 50 },   // Sustain 50 users
    { duration: "1m", target: 0 },    // Ramp down
  ],
  thresholds: {
    http_req_duration: ["p(95)<500"],  // 95% of requests under 500ms
    errors: ["rate<0.01"],             // Error rate under 1%
  },
};

export default function () {
  const res = http.get(`${BASE_URL}/api/v1/rooms/search?check_in=2025-07-10&check_out=2025-07-12&guests=2`);
  check(res, { "status is 200": (r) => r.status === 200 });
  errorRate.add(res.status !== 200);
  sleep(1);
}
```

### Concurrency Test — Double Booking

A dedicated k6 script simulates 10 concurrent requests to book the same room for the same dates. Success criteria: exactly 1 booking created, 9 `409 Conflict` responses.

---

## Phase 9: Security Testing Strategy

### Authentication Tests

| Test | Expected Outcome |
|---|---|
| Login with correct credentials | 200 with tokens |
| Login with wrong password | 401, generic message (no info leakage) |
| Login with non-existent email | 401, same generic message |
| Access protected endpoint with no token | 401 |
| Access protected endpoint with expired token | 401 |
| Access protected endpoint with tampered token | 401 |

### Authorisation Tests (RBAC + BOLA)

| Test | Expected Outcome |
|---|---|
| Guest accesses `POST /admin/rooms` | 403 Forbidden |
| Staff accesses `POST /admin/rooms` | 403 Forbidden |
| Admin accesses all endpoints | 200/201 |
| Guest A views Guest B's booking | 403 Forbidden |
| Guest cancels another guest's booking | 403 Forbidden |

### Input Validation Tests

| Test | Expected Outcome |
|---|---|
| Register with SQL injection in email field | 422 Validation Error (Pydantic rejects non-email format) |
| Book with check_out before check_in | 422 Validation Error |
| Create room with negative price | 422 Validation Error |
| Submit XSS payload in special_requests field | Stored as plain text, rendered escaped in React |

### Dependency Security

- `pip-audit` runs in CI to detect known CVEs in Python dependencies
- `npm audit` runs in CI to detect known CVEs in JavaScript dependencies
- Both checks are CI quality gates — critical CVEs block the pipeline

---

## Phase 10: Accessibility Testing Strategy

### Automated Testing (CI)

**Tool:** axe-core integrated with Cypress (`cypress-axe`)

**Pages scanned:**

| Page | Standard | Target |
|---|---|---|
| HomePage | WCAG 2.1 AA | Zero critical/serious violations |
| SearchResultsPage | WCAG 2.1 AA | Zero critical/serious violations |
| RoomDetailPage | WCAG 2.1 AA | Zero critical/serious violations |
| LoginPage | WCAG 2.1 AA | Zero critical/serious violations |
| RegisterPage | WCAG 2.1 AA | Zero critical/serious violations |
| GuestDashboardPage | WCAG 2.1 AA | Zero critical/serious violations |

### Manual Testing Checklist (Pre-release)

| Check | Method |
|---|---|
| Tab order logical | Manual keyboard navigation through all pages |
| Focus visible at all times | Visual inspection |
| All images have alt text | React code review |
| All form inputs have labels | React code review + Cypress |
| Screen reader announces booking confirmation | Test with NVDA or VoiceOver |
| Colour contrast passes 4.5:1 | Figma / browser inspector |

---

## Phase 11: Quality Gates

All quality gates are enforced by GitHub Actions. A failing gate blocks merge.

| Gate | Tool | Threshold | Blocks Merge? |
|---|---|---|---|
| **Backend type check** | mypy --strict | Zero errors | ✅ Yes |
| **Backend linting** | ruff | Zero violations | ✅ Yes |
| **Backend tests** | pytest + pytest-cov | ≥ 80% line coverage | ✅ Yes |
| **Backend security scan** | pip-audit | Zero critical CVEs | ✅ Yes |
| **Frontend type check** | tsc --noEmit | Zero type errors | ✅ Yes |
| **Frontend linting** | ESLint | Zero errors | ✅ Yes |
| **Frontend tests** | Vitest + coverage | ≥ 70% line coverage | ✅ Yes |
| **Frontend security scan** | npm audit | Zero critical CVEs | ✅ Yes |
| **Contract tests** | Pact | All contracts satisfied | ✅ Yes |
| **E2E tests** | Cypress (headless) | All tests pass | ✅ Yes |
| **Accessibility scan** | axe-core/Cypress | Zero AA violations | ✅ Yes |

---

## Phase 12: Test Data Strategy

### Test Data Creation

- **Unit tests:** Inline test data using factory functions:
  ```python
  def make_booking(**kwargs) -> Booking:
      defaults = { "id": uuid4(), "status": BookingStatus.CONFIRMED, ... }
      return Booking(**{**defaults, **kwargs})
  ```

- **Integration tests:** pytest fixtures using the factory pattern with the test database:
  ```python
  @pytest.fixture
  async def confirmed_booking(db_session, guest_user, available_room):
      booking = BookingFactory.build(user_id=guest_user.id, room_id=available_room.id)
      db_session.add(BookingModel.from_entity(booking))
      await db_session.flush()
      return booking
  ```

- **E2E tests:** Cypress seeds the test database via a dedicated `POST /test/seed` endpoint (disabled in production via environment flag).

### Test Data Isolation

- All integration tests roll back their transactions after each test (see Phase 5)
- E2E tests reset the database to a known seed state before each spec file using a Cypress `beforeAll` hook
- No shared mutable state between tests

### Synthetic Data

Faker is used to generate realistic names, emails, and addresses in fixtures. Never uses real user data.

---

## Phase 13: Defect Management Strategy

### Defect Classification

| Severity | Definition | Target Resolution |
|---|---|---|
| **Critical** | System unavailable; data corruption; double booking occurs | Fix before any deployment |
| **High** | Core flow broken (cannot book, cannot log in); security vulnerability | Fix in current sprint |
| **Medium** | Feature broken but workaround exists; accessibility violation | Fix in next sprint |
| **Low** | Visual glitch, minor UX issue | Backlog |

### Defect Detection

- Automated: CI quality gates catch regressions before merge
- Manual: exploratory testing of new features before release

### Root Cause Analysis

For every Critical or High defect:
1. Identify what failed (unit test gap? integration test gap? race condition?)
2. Write a failing test that reproduces the defect
3. Fix the defect
4. Verify the test passes
5. Document the root cause in the commit message

This ensures defects cannot regress silently.

---

## Phase 14: Quality Metrics

| Metric | Target | Collection Method | Review Frequency |
|---|---|---|---|
| Backend line coverage | ≥ 80% | pytest-cov → CI report | Every PR |
| Frontend line coverage | ≥ 70% | Vitest coverage → CI report | Every PR |
| Build success rate | ≥ 95% | GitHub Actions dashboard | Weekly |
| Flaky test rate | ≤ 5% | Track failed reruns in CI | Weekly |
| Contract violations | 0 | Pact CI report | Every PR |
| WCAG violations | 0 | axe-core CI report | Every PR |
| Critical CVEs | 0 | pip-audit + npm audit CI | Every PR |
| P95 API response time | ≤ 500ms | k6 load test report | Pre-release |

---

## Phase 15: Testability Assessment

| Component | Testability | Notes |
|---|---|---|
| Domain entities | Excellent — pure Python | Zero mocking required |
| Application services | Good — injected interfaces | Mocked repositories |
| Infrastructure repositories | Good — real DB via fixtures | Slightly slower but accurate |
| API routes | Good — FastAPI TestClient | Fast, no real HTTP |
| Frontend components | Good — RTL | Mock API client |
| E2E flows | Good — Docker Compose | Slower but realistic |

No redesign required. All components are independently testable as designed.

---

## Phase 16: Learning Concept — Contract Testing

**1. What is Contract Testing?**

Contract testing is a technique where the consumer of an API (the frontend) defines a "contract" specifying the exact request it will make and the minimum response shape it requires. The provider (the backend) then verifies it satisfies that contract in isolation — without the consumer running.

This is different from integration testing, where both services must be deployed and running together. Contract tests are fast (milliseconds), do not require a network, and pinpoint exactly which API call broke.

**2. Why was it selected?**

In a two-service system (React frontend + FastAPI backend), backend developers can silently break the frontend by renaming a field, changing a status code, or reordering a list. Without contract tests, this only surfaces in E2E tests or in production. Contract tests catch the breakage at the PR level, in the backend's own CI pipeline.

**3. How it improves quality:**

When a backend developer renames `pricePerNight` to `price_per_night` in the rooms response, the Pact provider verification fails immediately. The developer sees the failure, updates the contract or reverts the change, and the frontend is never broken.

**4. Trade-offs:**

| Pro | Con |
|---|---|
| Fast feedback — no running services needed | Requires maintaining contract files |
| Catches breaking changes before integration | Pact setup has initial learning curve |
| Documents API expectations explicitly | Does not replace integration or E2E tests |

**5. Interview discussion:**

"I used Pact for contract testing because in a SPA + API architecture, the biggest silent risk is an API change that breaks the frontend without any error being thrown. The frontend just renders wrong data. Pact gave me a way to encode exactly what the frontend expects from every endpoint, and have the backend verify it satisfies those expectations on every pull request. It's the fastest possible feedback loop for API compatibility."

---

## Phase 17: Interview Readiness Review

| Question | Documented Answer |
|---|---|
| Why contract testing and not just integration testing? | Phase 6 + Learning Concept — faster, no running services, catches API breakage at PR level |
| How do you prevent double bookings? | FR-032, Phase 2, Architecture document Phase 6.4 |
| How is RBAC tested? | Phase 9 — dedicated integration tests for every forbidden role combination |
| Why 80% backend and 70% frontend? | Balances confidence with diminishing returns; domain layer targets 100% |
| How do you test accessibility? | Automated axe-core in Cypress + manual keyboard/screen reader testing |
| How do you handle flaky tests? | Documented detection metric; E2E tests use explicit waits, not sleep() |

**Quality Engineering Status: APPROVED. Implementation may proceed.**
