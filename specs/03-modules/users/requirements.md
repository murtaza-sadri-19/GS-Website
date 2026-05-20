# Users — Requirements

## Purpose

CENTRAL_ADMIN manages staff accounts (EXAM_CONTROLLER, PLACEMENT_OFFICER, HOD, TEACHER). No public surface.

## Actors

| Role | Can do |
| --- | --- |
| CENTRAL_ADMIN | List, view, create, update, activate/deactivate, soft-delete users |
| Other roles | Cannot access this module's APIs |

## Data this feature handles

- name, email, phone (optional)
- role_id (one of 5)
- department_id (required for HOD and TEACHER, NULL for the rest)
- status (ACTIVE/INACTIVE)
- password (only at creation or by /auth/change-password — never set via /users update)

## Acceptance criteria

- [ ] `GET /api/v1/users` returns paginated list (CENTRAL_ADMIN only).
- [ ] `GET /api/v1/users/:id` returns single user (no password_hash in response).
- [ ] `POST /api/v1/users` creates a user with a generated random initial password (returned ONCE in the response so admin can share it).
- [ ] HOD/TEACHER creation requires `department_id`. Missing → 400.
- [ ] Duplicate email → 409.
- [ ] `PUT /api/v1/users/:id` updates name/phone/department_id/role_id. NOT email (immutable) and NOT password.
- [ ] `PATCH /api/v1/users/:id/status` flips ACTIVE ↔ INACTIVE.
- [ ] `DELETE /api/v1/users/:id` sets status to INACTIVE (soft delete). No hard delete.
- [ ] Cannot deactivate the last ACTIVE CENTRAL_ADMIN → 409.
- [ ] Cannot deactivate self → 409.
- [ ] Audit log on create/update/status-change/delete.
- [ ] Any non-CENTRAL_ADMIN hitting these endpoints → 403.

## Out of scope

- Password reset for the user (admin re-creates? — defer; v1 just deactivates and re-creates)
- Bulk import (CSV)
- Per-user permission overrides (we have role-based only)
- Email notifications on account creation (admin shares password out-of-band)
