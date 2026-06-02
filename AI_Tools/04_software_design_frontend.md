# Software Design Document — Frontend
## StayEase — Hotel Booking & Management Platform

**Document Version:** v1.0.0
**Framework Reference:** Software_Design.md
**Scope:** React 18 / TypeScript Frontend SPA
**Status:** Approved — Frontend implementation may proceed
**Date:** 2025

---

## Phase 1: Architecture Review

| Check | Status |
|---|---|
| ✅ Architecture approved | Feature-based SPA (ADR-005, ADR-006) |
| ✅ System boundaries defined | Frontend is a standalone SPA consuming the backend REST API |
| ✅ API contracts defined | All endpoints specified in Backend Design Document Phase 6 |
| ✅ Auth strategy confirmed | JWT access + refresh tokens; Redux stores auth state |
| ✅ State management confirmed | Redux Toolkit (client/auth state) + React Query (server state) |

No architectural ambiguity. Design phase proceeds.

---

## Phase 2: Module Decomposition

### Module Catalog

| Module | Layer | Responsibility | Dependencies |
|---|---|---|---|
| `features/auth` | Feature | Registration form, login form, logout, token refresh, auth state | shared/ui, services/api, store/authSlice |
| `features/rooms` | Feature | Room browsing, search form, search results, room detail, availability display | shared/ui, services/api |
| `features/bookings` | Feature | Booking creation flow, booking list, booking detail, cancellation, special requests | shared/ui, services/api, features/rooms |
| `features/guest-dashboard` | Feature | Guest's booking history, profile view/edit | shared/ui, features/bookings, features/auth |
| `features/staff-dashboard` | Feature | Today's arrivals table, check-in/check-out actions, all reservations view | shared/ui, features/bookings |
| `features/admin` | Feature | Room management (create/edit/deactivate), user management, reporting dashboard | shared/ui, features/rooms, features/bookings |
| `shared/ui` | Shared | Design system: Button, Input, Select, DatePicker, Card, Modal, Table, Badge, Spinner, Pagination | None |
| `shared/layout` | Shared | Navbar, Sidebar, PageWrapper, AuthLayout, DashboardLayout | shared/ui, store/authSlice |
| `shared/hooks` | Shared | useAuth, useMediaQuery, useDebounce, useDocumentTitle | store/authSlice |
| `shared/utils` | Shared | formatDate, formatCurrency, formatNights, classNames | None |
| `shared/types` | Shared | Shared TypeScript types: User, Room, Booking, Role, BookingStatus, PaginatedResponse | None |
| `services/api` | Service | Axios instance with interceptors, typed API client functions per domain | None |
| `services/queryKeys` | Service | Centralised React Query key factory | None |
| `store/authSlice` | Store | Redux slice: user identity, access token, role, isAuthenticated | None |
| `store/uiSlice` | Store | Redux slice: global toasts/notifications, modal state | None |
| `router` | Routing | React Router v6 routes, protected route wrappers, role-based route guards | store/authSlice |
| `pages` | Pages | Page-level components that compose features — one per route | All features |

### Directory Structure

```
frontend/
├── src/
│   ├── features/
│   │   ├── auth/
│   │   │   ├── components/
│   │   │   │   ├── LoginForm.tsx
│   │   │   │   ├── RegisterForm.tsx
│   │   │   │   └── LoginForm.test.tsx
│   │   │   ├── hooks/
│   │   │   │   └── useLoginMutation.ts
│   │   │   └── api/
│   │   │       └── authApi.ts
│   │   ├── rooms/
│   │   │   ├── components/
│   │   │   │   ├── RoomCard.tsx
│   │   │   │   ├── RoomCard.test.tsx
│   │   │   │   ├── RoomSearchForm.tsx
│   │   │   │   ├── RoomSearchForm.test.tsx
│   │   │   │   ├── RoomDetail.tsx
│   │   │   │   └── RoomFilters.tsx
│   │   │   ├── hooks/
│   │   │   │   ├── useRoomSearch.ts
│   │   │   │   └── useRoomDetail.ts
│   │   │   └── api/
│   │   │       └── roomsApi.ts
│   │   ├── bookings/
│   │   │   ├── components/
│   │   │   │   ├── BookingForm.tsx
│   │   │   │   ├── BookingForm.test.tsx
│   │   │   │   ├── BookingCard.tsx
│   │   │   │   ├── BookingDetail.tsx
│   │   │   │   └── BookingStatusBadge.tsx
│   │   │   ├── hooks/
│   │   │   │   ├── useCreateBooking.ts
│   │   │   │   ├── useCancelBooking.ts
│   │   │   │   └── useGuestBookings.ts
│   │   │   └── api/
│   │   │       └── bookingsApi.ts
│   │   ├── staff-dashboard/
│   │   │   └── components/
│   │   │       ├── ArrivalsTable.tsx
│   │   │       ├── ArrivalsTable.test.tsx
│   │   │       └── CheckInButton.tsx
│   │   └── admin/
│   │       ├── components/
│   │       │   ├── RoomManagementTable.tsx
│   │       │   ├── RoomForm.tsx
│   │       │   ├── UserManagementTable.tsx
│   │       │   └── DashboardStats.tsx
│   │       └── hooks/
│   │           ├── useAdminRooms.ts
│   │           └── useAdminReports.ts
│   ├── shared/
│   │   ├── ui/
│   │   │   ├── Button/
│   │   │   │   ├── Button.tsx
│   │   │   │   └── Button.test.tsx
│   │   │   ├── Input/
│   │   │   ├── Select/
│   │   │   ├── DatePicker/
│   │   │   ├── Card/
│   │   │   ├── Modal/
│   │   │   ├── Table/
│   │   │   ├── Badge/
│   │   │   ├── Spinner/
│   │   │   └── Pagination/
│   │   ├── layout/
│   │   │   ├── Navbar.tsx
│   │   │   ├── GuestLayout.tsx
│   │   │   ├── DashboardLayout.tsx
│   │   │   └── AuthLayout.tsx
│   │   ├── hooks/
│   │   │   ├── useAuth.ts
│   │   │   ├── useDebounce.ts
│   │   │   └── useMediaQuery.ts
│   │   ├── utils/
│   │   │   ├── formatDate.ts
│   │   │   ├── formatCurrency.ts
│   │   │   └── classNames.ts
│   │   └── types/
│   │       ├── booking.types.ts
│   │       ├── room.types.ts
│   │       └── user.types.ts
│   ├── services/
│   │   ├── api/
│   │   │   ├── client.ts        # Axios instance + interceptors
│   │   │   └── types.ts         # API response types
│   │   └── queryKeys.ts
│   ├── store/
│   │   ├── index.ts             # Redux store configuration
│   │   ├── authSlice.ts
│   │   └── uiSlice.ts
│   ├── router/
│   │   ├── index.tsx
│   │   ├── ProtectedRoute.tsx
│   │   └── RoleRoute.tsx
│   ├── pages/
│   │   ├── HomePage.tsx
│   │   ├── SearchResultsPage.tsx
│   │   ├── RoomDetailPage.tsx
│   │   ├── BookingPage.tsx
│   │   ├── BookingConfirmationPage.tsx
│   │   ├── LoginPage.tsx
│   │   ├── RegisterPage.tsx
│   │   ├── GuestDashboardPage.tsx
│   │   ├── StaffDashboardPage.tsx
│   │   └── AdminDashboardPage.tsx
│   ├── main.tsx
│   └── vite-env.d.ts
├── tests/
│   └── e2e/                     # Cypress
│       ├── booking.cy.ts
│       ├── auth.cy.ts
│       └── admin.cy.ts
├── contracts/                   # Pact consumer contracts
│   └── stayease-frontend.pact.json
├── index.html
├── vite.config.ts
├── tsconfig.json
├── tailwind.config.ts
└── package.json
```

---

## Phase 3: Interface Design

### 3.1 Public Component Interfaces (Props)

**RoomCard**
```typescript
interface RoomCardProps {
  room: RoomSummary;
  onSelect?: (roomId: string) => void;
  searchParams?: SearchParams; // Passed through to booking flow
}
```

**BookingForm**
```typescript
interface BookingFormProps {
  room: RoomDetail;
  initialDates?: { checkIn: string; checkOut: string };
  onSuccess: (booking: BookingDetail) => void;
}
```

**BookingStatusBadge**
```typescript
interface BookingStatusBadgeProps {
  status: BookingStatus;
  size?: "sm" | "md";
}
```

**ArrivalsTable**
```typescript
interface ArrivalsTableProps {
  arrivals: ArrivalSummary[];
  onCheckIn: (bookingId: string) => void;
  isLoading: boolean;
}
```

**Pagination**
```typescript
interface PaginationProps {
  currentPage: number;
  totalItems: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
}
```

### 3.2 API Client Interface

All API calls go through typed functions in `services/api/`. No component imports Axios directly.

```typescript
// features/bookings/api/bookingsApi.ts
export const bookingsApi = {
  create: (data: CreateBookingRequest): Promise<BookingDetail> =>
    apiClient.post("/bookings", data).then(r => r.data),

  list: (params: PaginationParams): Promise<PaginatedResponse<BookingDetail>> =>
    apiClient.get("/bookings", { params }).then(r => r.data),

  getById: (id: string): Promise<BookingDetail> =>
    apiClient.get(`/bookings/${id}`).then(r => r.data),

  cancel: (id: string): Promise<BookingDetail> =>
    apiClient.patch(`/bookings/${id}/cancel`).then(r => r.data),
};
```

### 3.3 Redux Store Interface

```typescript
// store/authSlice.ts
interface AuthState {
  user: UserProfile | null;        // Name, email, role
  accessToken: string | null;      // Stored in memory only
  isAuthenticated: boolean;
  isLoading: boolean;
}
```

**Design decision:** The access token is stored in Redux state (in-memory), not in localStorage. This prevents XSS attacks from reading the token. The refresh token is sent via HTTP-only cookie.

---

## Phase 4: Design Pattern Analysis

### Custom Hooks — Separation of Data and UI

**Problem solved:** Components should not contain API call logic, loading state management, or error handling. This creates untestable, bloated components.

**Implementation:** Each feature has custom hooks wrapping React Query:

```typescript
// features/rooms/hooks/useRoomSearch.ts
export function useRoomSearch(params: SearchParams | null) {
  return useQuery({
    queryKey: queryKeys.rooms.search(params),
    queryFn: () => roomsApi.search(params!),
    enabled: params !== null,
    staleTime: 30_000, // 30 seconds — availability can change
  });
}
```

**Trade-off:** More files. Justified because components become pure presentation — they receive data and dispatch actions. Hook is independently testable.

---

### Container / Presentational Separation

**Problem solved:** Complex pages mix data fetching, business logic, and rendering — making them impossible to test.

**Implementation:**

- **Pages** (containers): Fetch data via hooks, handle routing, pass data down as props
- **Feature components** (semi-smart): Manage local UI state (form state, modal open/closed)
- **Shared UI components** (presentational): Accept only props, no direct store/API access

---

### Axios Interceptors — Token Refresh

**Problem solved:** Every API call must not manually check for 401 errors and trigger token refresh.

**Implementation:**

```typescript
// services/api/client.ts
apiClient.interceptors.response.use(
  response => response,
  async error => {
    if (error.response?.status === 401 && !error.config._retry) {
      error.config._retry = true;
      try {
        const newToken = await authApi.refresh(); // Uses HTTP-only cookie
        store.dispatch(setAccessToken(newToken));
        error.config.headers.Authorization = `Bearer ${newToken}`;
        return apiClient(error.config);
      } catch {
        store.dispatch(logout());
        window.location.replace("/login");
      }
    }
    return Promise.reject(error);
  }
);
```

---

## Phase 5: Page Specifications

### Route Map

| Route | Page | Auth | Role Required |
|---|---|---|---|
| `/` | HomePage | None | None |
| `/rooms/search` | SearchResultsPage | None | None |
| `/rooms/:id` | RoomDetailPage | None | None |
| `/book/:roomId` | BookingPage | ✅ | Any authenticated |
| `/bookings/:id/confirmation` | BookingConfirmationPage | ✅ | Any authenticated |
| `/login` | LoginPage | None (redirect if authed) | None |
| `/register` | RegisterPage | None (redirect if authed) | None |
| `/dashboard` | GuestDashboardPage | ✅ | GUEST |
| `/staff` | StaffDashboardPage | ✅ | STAFF, ADMIN |
| `/admin` | AdminDashboardPage | ✅ | ADMIN |

### Page Designs

**HomePage**
- Hero section with search bar (check-in, check-out, guests)
- Featured rooms section (top 6 rooms from `GET /rooms?limit=6`)
- CTA section for registration

**SearchResultsPage**
- Filter sidebar: room type, price range
- Room grid with `RoomCard` components
- Pagination
- "No results" empty state
- Loading skeleton

**RoomDetailPage**
- Image gallery
- Room name, type, capacity, price
- Full amenity list
- Availability indicator for selected dates
- "Book Now" button → navigates to `/book/:roomId?checkIn=...&checkOut=...`

**BookingPage**
- Multi-step form:
  1. Confirm dates + guests count
  2. Review total price
  3. Add special requests (optional)
  4. Confirm booking → POST /bookings

**GuestDashboardPage**
- Tabs: "Upcoming Bookings", "Past Bookings"
- `BookingCard` list with status badges
- "Cancel" button on eligible bookings
- Profile tab: edit name, phone

**StaffDashboardPage**
- "Today's Arrivals" section with `ArrivalsTable`
- "Check In" button per arrival → PATCH /staff/bookings/{id}/check-in
- "All Reservations" section with status filter

**AdminDashboardPage**
- Tabs: Overview, Rooms, Users
- Overview tab: `DashboardStats` (total bookings, occupancy rate, revenue)
- Rooms tab: `RoomManagementTable` with add/edit/deactivate actions
- Users tab: `UserManagementTable` with role change/deactivate actions

---

## Phase 6: State Design

### Redux Store Shape

```typescript
{
  auth: {
    user: { id, firstName, lastName, email, role } | null,
    accessToken: string | null,
    isAuthenticated: boolean,
    isLoading: boolean,
  },
  ui: {
    toasts: Array<{ id, message, type: "success" | "error" | "info" }>,
    activeModal: string | null,
  }
}
```

**What goes in Redux vs React Query:**

| Data | Storage | Reason |
|---|---|---|
| Auth user identity + access token | Redux | Global, persistent across page, needed by Axios interceptor |
| Room search results | React Query | Server state — benefits from caching, background refetch |
| Booking list | React Query | Server state — paginated, benefits from cache invalidation |
| Form state (login, booking) | React Hook Form local state | Ephemeral, no global access needed |
| Modal open/closed | Redux `uiSlice` | Needed across components in same page |
| Toast notifications | Redux `uiSlice` | Triggered from mutations, displayed in layout |

### React Query Cache Invalidation Strategy

| Mutation | Invalidated Queries |
|---|---|
| `createBooking` | `queryKeys.bookings.list`, `queryKeys.rooms.search` (availability may change) |
| `cancelBooking` | `queryKeys.bookings.byId(id)`, `queryKeys.bookings.list` |
| `checkIn` | `queryKeys.staff.arrivals`, `queryKeys.bookings.byId(id)` |
| `createRoom` | `queryKeys.rooms.list`, `queryKeys.admin.rooms` |
| `updateRoom` | `queryKeys.rooms.byId(id)`, `queryKeys.rooms.list` |

---

## Phase 7: TypeScript Type Definitions

```typescript
// shared/types/booking.types.ts

export type BookingStatus =
  | "PENDING"
  | "CONFIRMED"
  | "CHECKED_IN"
  | "CHECKED_OUT"
  | "CANCELLED";

export interface BookingDetail {
  id: string;
  room: RoomSummary;
  checkInDate: string;   // ISO date string: "2025-07-10"
  checkOutDate: string;
  guestsCount: number;
  totalPrice: number;
  status: BookingStatus;
  specialRequests: string | null;
  createdAt: string;
}

export interface CreateBookingRequest {
  roomId: string;
  checkInDate: string;
  checkOutDate: string;
  guestsCount: number;
  specialRequests?: string;
}
```

```typescript
// shared/types/room.types.ts

export type RoomType = "SINGLE" | "DOUBLE" | "SUITE" | "PENTHOUSE";
export type RoomStatus = "AVAILABLE" | "MAINTENANCE" | "INACTIVE";

export interface RoomSummary {
  id: string;
  roomNumber: string;
  name: string;
  type: RoomType;
  capacity: number;
  pricePerNight: number;
  primaryImage: string;
  amenities: string[];
}

export interface RoomDetail extends RoomSummary {
  description: string;
  floor: number;
  images: string[];
  status: RoomStatus;
}

export interface SearchParams {
  checkIn: string;
  checkOut: string;
  guests: number;
  roomType?: RoomType;
  minPrice?: number;
  maxPrice?: number;
}
```

---

## Phase 8: Dependency Analysis

```
pages → features → shared/ui (one-way only)
pages → store (read auth, dispatch UI actions)
features/hooks → services/api
services/api → store (Axios interceptor dispatches logout)
shared/ui → nothing
```

**No circular dependencies.**

High-risk dependency: `services/api/client.ts` imports from the Redux store directly (for token refresh). This is the single allowed coupling between the service layer and state layer, justified by the interceptor pattern.

---

## Phase 9: Error Handling Design

### Categories and Handling

| Error Category | Component Responsibility | Global Handling |
|---|---|---|
| **Form validation** | React Hook Form inline errors | None needed |
| **API 422 / validation** | Mutation `onError` → display field errors | None |
| **API 409 / conflict** | Mutation `onError` → toast "Room no longer available" | None |
| **API 401 / expired token** | Axios interceptor → refresh → retry | Redirect to login on refresh failure |
| **API 403 / forbidden** | Error boundary → "Access Denied" page | None |
| **API 404 / not found** | Page-level empty state component | None |
| **API 500 / server error** | Mutation `onError` → generic toast | None |
| **Network error** | Mutation `onError` → "Check your connection" toast | None |

### Error Boundary

A React Error Boundary wraps the entire router. If a page-level rendering error occurs, it renders a fallback UI with a "Return to Home" link.

### Toasts

All mutation results display toasts via the `uiSlice`:

```typescript
// In booking creation mutation:
onSuccess: (booking) => {
  dispatch(showToast({ message: `Booking ${booking.id.slice(0, 8)} confirmed!`, type: "success" }));
  navigate(`/bookings/${booking.id}/confirmation`);
},
onError: (error) => {
  dispatch(showToast({ message: getErrorMessage(error), type: "error" }));
},
```

---

## Phase 10: Security Design Review

| Concern | Design |
|---|---|
| Access token storage | Redux in-memory only — never localStorage/sessionStorage (XSS-resistant) |
| Refresh token storage | HTTP-only cookie — inaccessible to JavaScript |
| Route protection | `ProtectedRoute` component checks `isAuthenticated`. `RoleRoute` checks user role. |
| Sensitive data | No passwords or tokens rendered in DOM. React DevTools can inspect Redux state — acceptable for development. |
| Input sanitisation | React escapes all string interpolations by default. No dangerouslySetInnerHTML. |
| CORS | Configured on backend to accept only the known frontend origin |

---

## Phase 11: Accessibility Design

| Requirement | Implementation |
|---|---|
| WCAG 2.1 AA | Shadcn UI components are ARIA-compliant by default |
| Keyboard navigation | All interactive elements are focusable; `Tab` order is logical |
| Focus management | Modal: focus trapped inside; on close, focus returns to trigger element |
| Colour contrast | Tailwind CSS theme colours chosen to meet 4.5:1 contrast ratio for text |
| Screen readers | All images have `alt` text; form inputs have associated `<label>` elements |
| Error announcements | Form errors are linked via `aria-describedby`; status changes use `aria-live` regions |
| Skip link | "Skip to main content" link at top of page for keyboard users |

---

## Phase 12: Testability Review

| Component / Hook | Test Approach |
|---|---|
| `LoginForm` | Vitest + RTL: render form, fill inputs, submit, assert API mock called |
| `RoomCard` | Vitest + RTL: snapshot test, click handler called with correct room id |
| `BookingForm` | Vitest + RTL: date validation, disabled submit until dates valid, success callback |
| `useRoomSearch` | Vitest: mock React Query, assert correct query key and params |
| `authSlice` | Vitest: pure Redux reducer tests, no rendering needed |
| `ArrivalsTable` | Vitest + RTL: renders arrivals, check-in button calls handler |
| E2E — Booking Flow | Cypress: full booking flow from search → room detail → book → confirmation |
| E2E — Auth Flow | Cypress: register, login, protected route redirect |
| Accessibility | Cypress + axe-core: scan all key pages for WCAG violations |

---

## Phase 13: Maintainability Review

| Factor | Assessment |
|---|---|
| Coupling | Low — features do not import from each other; all share via `shared/` |
| Cohesion | High — each feature folder owns its components, hooks, API calls, and types |
| Extensibility | New feature → new folder in `features/`, new route in `router/` |
| Technical Debt Risk | Refresh token in HTTP-only cookie requires CORS credentials config; must be documented |
| Refactoring opportunity | `BookingPage` multi-step flow could grow complex — extract step components early |

---

## Phase 14: Design Decision Records (DDR)

### DDR-F001: Access Token in Memory (Redux), Refresh Token in HTTP-only Cookie

**Context:** Tokens stored in localStorage are vulnerable to XSS. HTTP-only cookies prevent JavaScript access.

**Decision:** Access token → Redux in-memory. Refresh token → HTTP-only cookie (set by backend on `/auth/login`).

**Consequences:** Token lost on page refresh → Axios interceptor automatically calls `/auth/refresh` on startup (silent refresh pattern). Slightly more complex initial auth flow. Justified by significantly improved security posture.

---

### DDR-F002: React Query for Server State, Redux for Client State

**Context:** Using Redux for all state (including API responses) leads to boilerplate reducers for loading/error states. Using React Query for all state means auth state is not globally available to the Axios interceptor.

**Decision:** React Query for all remote data (rooms, bookings). Redux for auth state and UI state (toasts, modals).

**Consequences:** Developers must understand which state tool to use when. Documented in Phase 6.

---

## Phase 15: Learning Concept — SOLID Applied to Frontend (Interface Segregation + Dependency Inversion)

**1. What is it?**

Interface Segregation: Components should not depend on props they do not use. Keep prop interfaces small and focused.

Dependency Inversion (Frontend): Components depend on hooks (abstractions), not on Axios directly.

**2. Why was it chosen?**

`RoomCard` does not need to know whether data comes from a REST API, a GraphQL query, or a mock. It receives a `RoomSummary` prop. The hook is the abstraction layer.

**3. How it improves the design:**

Testing `RoomCard` requires zero API mocking — just pass a `RoomSummary` object. Testing `useRoomSearch` requires zero component rendering — just mock the API function.

**4. Trade-offs:**

More files. Justified by testability and single responsibility.

**5. Interview discussion:**

"I kept components dumb by design — they receive typed props and call typed callbacks. Data fetching logic lives in custom hooks, which are independently testable. This means I can test my BookingForm by rendering it with mock props and never touching the network. It also means if we switch from REST to GraphQL, only the hooks change, not the components."

---

## Phase 16: Interview Readiness Review

| Question | Documented Answer |
|---|---|
| Why feature-based architecture over component-based? | Scales by domain, not by file type; co-located tests and types |
| Why React Query + Redux instead of just Redux? | ADR-006 — different responsibilities for server vs client state |
| Why is the access token in memory? | DDR-F001 — XSS resistance |
| How does token refresh work transparently? | Axios response interceptor (Phase 4) |
| How do you test components without hitting the API? | Dependency via hooks; hooks mock API client in tests |
| How is RBAC enforced on the frontend? | `RoleRoute` wrapper; always re-validated by backend |

**Frontend Design Status: APPROVED. Implementation may begin.**
