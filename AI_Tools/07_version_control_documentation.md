# Version Control & Documentation Governance
## StayEase — Hotel Booking & Management Platform

**Document Version:** v1.0.0
**Framework Reference:** Version_Control___Documentation.md
**Date:** 2025

---

## Version Classification

StayEase follows Semantic Versioning (SemVer): `vMAJOR.MINOR.PATCH`

---

### Major Version (vX.0.0)

Represents: Architectural changes, major requirement changes, significant domain changes.

**Planned major versions:**

| Version | Description |
|---|---|
| v1.0.0 | Initial release — guest booking, staff operations, admin management |
| v2.0.0 | Payment gateway integration (Stripe) — architectural addition |

**Required documentation for each major release:**
- Updated Requirements document
- Updated Architecture document (new ADRs if applicable)
- Migration Notes (database schema changes, breaking API changes)
- Release Notes

---

### Minor Version (vX.Y.0)

Represents: New features, new modules, new workflows, enhanced capabilities.

**Planned minor versions:**

| Version | Description | New Documentation Required |
|---|---|---|
| v1.1.0 | Profile management + email notifications | Updated user stories, updated acceptance criteria |
| v1.2.0 | Maintenance room status + revenue reports | Feature spec, updated FR-026/FR-031 |
| v1.3.0 | GDPR data deletion endpoint | Security design update, NFR-021 implementation |

**Required documentation for each minor release:**
- Feature Specification
- Updated User Stories
- Updated Acceptance Criteria
- Testing Updates (new test cases)

---

### Patch Version (vX.Y.Z)

Represents: Bug fixes, refactoring, dependency updates, documentation corrections.

**Required documentation:**
- Patch Notes (what was fixed and why)
- Impact Assessment (what components were affected)

---

## Traceability Requirement

Every change must be traceable from requirement to release:

```
Requirement (FR-012)
  → Architecture Decision (ADR-001, ADR-003)
    → Design Decision (DDR-001)
      → Implementation (src/application/bookings/service.py)
        → Test (tests/unit/application/test_booking_service.py)
          → Release (v1.0.0 CHANGELOG)
```

**Enforcement:** Pull request descriptions must reference the requirement ID being addressed.

**PR template:**

```markdown
## Description
Brief description of the change.

## Requirement Reference
FR-XXX / NFR-XXX (link to requirements document section)

## Type of Change
- [ ] Bug fix (patch)
- [ ] New feature (minor)
- [ ] Breaking change (major)
- [ ] Documentation

## Testing
- [ ] Unit tests added/updated
- [ ] Integration tests added/updated
- [ ] Manual testing completed

## Checklist
- [ ] mypy passes
- [ ] ruff passes
- [ ] All CI checks pass
- [ ] CHANGELOG updated
- [ ] Documentation updated (if applicable)
```

---

## Branching Strategy

```
main                ← Always deployable; protected branch
  ↑
  └── feature/FR-012-create-booking      ← One branch per feature
  └── feature/FR-019-staff-arrivals
  └── fix/booking-total-price-off-by-one ← Hotfixes
  └── docs/update-architecture-diagram
```

**Rules:**
- No direct commits to `main`
- All changes via pull requests
- PRs require CI to pass before merge
- PRs require at least one descriptive commit message referencing the requirement

---

## Commit Message Convention

Format: `<type>(<scope>): <description> [FR-XXX]`

| Type | Used For |
|---|---|
| `feat` | New feature |
| `fix` | Bug fix |
| `test` | Adding or updating tests |
| `refactor` | Code change without feature or fix |
| `docs` | Documentation only |
| `chore` | Dependency updates, CI changes |
| `perf` | Performance improvement |

Examples:
```
feat(bookings): add create booking endpoint [FR-012]
fix(auth): prevent infinite refresh loop on 401
test(domain): add state machine transition tests for Booking entity
docs(architecture): add ADR-006 for Redux + React Query decision
chore(deps): upgrade FastAPI to 0.115.0
```

---

## CHANGELOG Structure

The `CHANGELOG.md` file in the repository root follows the [Keep a Changelog](https://keepachangelog.com) format.

```markdown
# Changelog

## [Unreleased]
### Added
- FR-016: Guest can add special requests to a booking

## [1.0.0] - 2025-09-01
### Added
- FR-001–FR-006: Authentication and user management
- FR-007–FR-011: Room discovery and search
- FR-012–FR-016: Guest booking management
- FR-019–FR-022: Staff check-in/check-out operations
- FR-023–FR-025: Admin room management
- FR-030: Admin reporting dashboard
- FR-032: Double-booking prevention with SELECT FOR UPDATE

### Security
- NFR-006: bcrypt password hashing (cost factor 12)
- NFR-007: JWT access tokens (15 min) + refresh tokens (7 days)
- NFR-009: RBAC enforced at API layer

## [0.1.0] - 2025-07-01
### Added
- Initial project scaffold
- Docker Compose development environment
- GitHub Actions CI pipeline skeleton
```

---

## Documentation Index

All project documentation lives in the repository under `/docs/`:

```
/docs/
├── 00_portfolio_analysis.md
├── 01_requirements_engineering.md
├── 02_software_architecture.md
├── 03_software_design_backend.md
├── 04_software_design_frontend.md
├── 05_quality_engineering_testing.md
├── 06_devops_deployment.md
├── 07_version_control_documentation.md
├── adr/
│   ├── ADR-001-architecture-style.md
│   ├── ADR-002-python-fastapi.md
│   ├── ADR-003-postgresql.md
│   ├── ADR-004-jwt-auth.md
│   ├── ADR-005-react-typescript.md
│   └── ADR-006-redux-react-query.md
└── runbooks/
    ├── deployment.md
    ├── rollback.md
    ├── secret-rotation.md
    └── incident-response.md
```

---

## Release Readiness Checklist

Before tagging any release:

| Check | Requirement |
|---|---|
| ✅ Requirements Updated | All implemented FRs/NFRs marked in requirements document |
| ✅ Architecture Updated | Any new ADRs added; component diagrams reflect final state |
| ✅ Design Updated | Any design changes reflected in backend/frontend design docs |
| ✅ Tests Updated | New features have new tests; coverage gates pass in CI |
| ✅ Documentation Updated | README accurate; API docs up to date |
| ✅ CHANGELOG Updated | All changes listed under correct version |
| ✅ Lessons Learned Recorded | GitHub Discussion or document in `/docs/lessons/` |

---

## Knowledge Transfer Standard

The documentation must enable a new developer to:

| Task | Document |
|---|---|
| Understand the problem being solved | `01_requirements_engineering.md` — Problem Statement |
| Understand why the architecture was chosen | `02_software_architecture.md` — ADRs |
| Set up the local development environment | `README.md` — Getting Started section |
| Run all tests | `README.md` — Testing section |
| Add a new API endpoint | `03_software_design_backend.md` — Module Catalog, API Design |
| Add a new frontend feature | `04_software_design_frontend.md` — Directory Structure, Module Catalog |
| Deploy to staging | `/docs/runbooks/deployment.md` |
| Understand a past decision | `docs/adr/` directory |

**Validation:** If a hypothetical new developer cannot understand what changed, why it changed, and how to extend it using only the `/docs/` directory and `CHANGELOG.md`, the documentation is incomplete.

---

## Lessons Learned (v1.0.0)

*To be completed during the development phase. Recorded in `/docs/lessons/v1.0.0.md`.*

Template:
```markdown
# Lessons Learned — v1.0.0

## What went well
- ...

## What was harder than expected
- ...

## What would be done differently
- ...

## Concepts learned
- Clean Architecture — applied for the first time in a full project
- Contract testing with Pact — new skill
- SQLAlchemy async + Alembic — new combination
```
