# Product Overview

A dynamic college website with two surfaces:

1. **Public website** — anyone can view notices, departments, faculty, events, gallery, downloads, exam updates, placement info. No login required. Only PUBLISHED/ACTIVE content is shown.
2. **Dashboard** — staff log in to manage content scoped to their role.

## Public flows

| Page | Shows |
| --- | --- |
| Home | Latest notices, events, gallery highlights, important links |
| Department detail | Profile, faculty, labs, achievements, events, notices, downloads |
| Examination | Exam notices, timetables, results, academic calendar |
| Training & Placement | Placement notices, company visits, records, training programs |

Architecture: React frontend → calls public `/api/v1/*` endpoints → Express → MySQL → JSON back to React → render.

## Dashboard flow

1. Staff opens `/login`.
2. POST `/api/v1/auth/login` → backend verifies bcrypt hash → returns JWT containing `{user_id, role, department_id}`.
3. Frontend stores JWT, redirects to role-specific dashboard (`/admin/...`, `/hod/...`, etc.).
4. Every dashboard action calls a protected API. `auth.middleware` → `role.middleware` → ownership check (where applicable) → controller.
5. Create/update/delete writes an entry to `audit_logs`.

## Why this design

- **Spec-driven** because three team members are building in parallel — written specs are the contract.
- **Single base URL `/api/v1`** keeps versioning simple.
- **Role-based modules instead of per-user permissions** — the college has 5 stable role categories, finer-grained ACL is unnecessary.
- **Soft delete via status enums** — accidents recoverable, audit trail intact.

## Minimum viable build

Phase 1-3 from `../05-roadmap/phases.md`. The "v1 ship list" is in [`../05-roadmap/priorities.md`](../05-roadmap/priorities.md).
