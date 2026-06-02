# StayEase — Hotel Booking Dashboard

A premium hotel booking and management web application built with React 18, TypeScript, and Tailwind CSS.

## Overview

StayEase lets guests browse rooms, make bookings, and manage their stays while giving staff and admins dedicated dashboards to handle arrivals, room management, and reporting. The UI is built around a modern hotel aesthetic, using real hotel imagery and a consistent amber/blue-950 colour scheme.

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | React 18 + TypeScript (strict) |
| Build | Vite 4 |
| Styling | Tailwind CSS 3 |
| Routing | React Router v6 |
| State | Redux Toolkit + React Query v5 |
| Forms | React Hook Form + Zod |
| HTTP | Axios |
| Icons | Ionicons (CDN) |
| Notifications | React Hot Toast |

## Project Structure

```
src/
├── assets/img/          # Hotel images used across the UI
├── features/            # Domain-sliced feature modules
│   ├── auth/            # Login & register forms, API, hooks
│   ├── rooms/           # Room search, filters, room card, detail
│   ├── bookings/        # Booking form, card, status badge, hooks
│   ├── staff-dashboard/ # Arrivals table, staff API
│   └── admin/           # Stats, user management, room CRUD form
├── pages/               # Route-level page components
│   ├── HomePage.tsx
│   ├── SearchResultsPage.tsx
│   ├── RoomDetailPage.tsx
│   ├── BookingPage.tsx
│   ├── BookingConfirmationPage.tsx
│   ├── GuestDashboardPage.tsx
│   ├── StaffDashboardPage.tsx
│   ├── AdminDashboardPage.tsx
│   ├── LoginPage.tsx
│   └── RegisterPage.tsx
├── router/              # ProtectedRoute, RoleRoute guards
├── shared/
│   ├── hooks/           # useAuth, shared hooks
│   ├── layout/          # Navbar, Footer, DashboardLayout, AuthLayout
│   ├── types/           # Shared TypeScript types
│   ├── utils/           # formatCurrency, etc.
│   └── ui/              # Button, Input, Select, Badge, Spinner, Modal, Pagination
└── store/               # Redux slices (authSlice, uiSlice), hooks, index
```

## Pages & Routes

| Route | Page | Access |
|---|---|---|
| `/` | Home hero, search, destinations, featured rooms, testimonials | Public |
| `/rooms/search` | Room search with filters | Public |
| `/rooms/:id` | Room detail | Public |
| `/book/:id` | Booking form | Authenticated |
| `/booking-confirmation` | Booking success | Authenticated |
| `/dashboard` | Guest bookings dashboard | GUEST |
| `/staff` | Staff arrivals & management | STAFF, ADMIN |
| `/admin` | Admin dashboard stats, rooms, users | ADMIN |
| `/login` | Sign in | Guest only |
| `/register` | Create account | Guest only |

## Getting Started

### Prerequisites

- Node.js 18+
- A running backend API at `http://localhost:8000/api/v1`

### Install & Run

```bash
npm install
npm run dev
```

The app will be available at `http://localhost:5173`.

### Build

```bash
npm run build
npm run preview
```

## Key Features

- **Role-based access** — Guest, Staff, and Admin roles each get filtered nav links and route guards
- **Room search** — Filter by type, capacity, price range, and date availability
- **Booking flow** — Select room → fill booking form → confirmation page
- **Guest dashboard** — View, track, and cancel bookings
- **Staff dashboard** — Arrivals table with check-in/check-out management
- **Admin dashboard** — Occupancy stats, room CRUD, user management
- **Responsive** — Mobile drawer nav, fluid grids, touch-friendly controls

## Backend

The frontend expects a REST API at `http://localhost:8000/api/v1`. Endpoint contracts are defined in the feature API modules under `src/features/*/api/`. The backend is not included in this repository.
