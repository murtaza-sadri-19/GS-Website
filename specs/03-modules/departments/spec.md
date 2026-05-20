# Departments — Spec Stub

> 🟡 **Stub.** Expand into `requirements.md` / `design.md` / `tasks.md` before implementing. Ask the `spec-author` subagent to "expand the spec for departments".

## Tables touched

- `departments` ([schema](../../01-database/design.md#103-departments))
- `users.department_id` references it
- `files.id` referenced by `image_file_id`
- `audit_logs`

## Endpoints

| Method | Path | Access | Purpose |
| --- | --- | --- | --- |
| GET | `/departments` | Public | Active departments |
| GET | `/departments/:slug` | Public | Department detail (includes faculty count, recent notices, gallery) |
| POST | `/departments` | CENTRAL_ADMIN | Add department |
| PUT | `/departments/:id` | CENTRAL_ADMIN, HOD owner | Update department |
| DELETE | `/departments/:id` | CENTRAL_ADMIN | Deactivate (soft) |

## Role / ownership notes

- HOD can only update `description`, `vision`, `mission`, `image_file_id` of own department (`department.hod_user_id = req.user.id` OR `req.user.department_id = department.id`).
- HOD cannot change `name`, `slug`, `short_name`, `hod_user_id`, or `status` — admin only.

## Acceptance teaser (move into requirements.md when expanding)

- Public list excludes `status = INACTIVE`.
- Slug is unique + auto-generated from name.
- Assigning a new HOD: clears old HOD's `department_id` if set, sets new HOD's `department_id`.

## File usage

`image_file_id` → image uploaded via files module with `usage=departments` (Cloudinary).
