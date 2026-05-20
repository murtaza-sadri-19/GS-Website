# Events — Spec Stub

> 🟡 **Stub.** Expand into requirements/design/tasks before implementing.

## Tables touched

- `events` ([schema](../../01-database/design.md#109-events))
- `files` — cover image
- `departments` — optional dept scope
- `audit_logs`

## Endpoints

| Method | Path | Access | Purpose |
| --- | --- | --- | --- |
| GET | `/events` | Public | PUBLISHED events |
| GET | `/events/:slug` | Public | Event detail |
| POST | `/events` | CENTRAL_ADMIN, HOD | Create (HOD forced to own dept) |
| PUT | `/events/:id` | CENTRAL_ADMIN, HOD owner | Update |
| DELETE | `/events/:id` | CENTRAL_ADMIN, HOD owner | Archive |

## Role / ownership

- CENTRAL_ADMIN: any event. Can set `department_id = NULL` (college-wide) or any dept.
- HOD: only events where `department_id = req.user.department_id`. Cannot create college-wide events.

## Slug

Auto-generate from title (see `utils/slug.js`).

## Status & sorting

- Status: DRAFT / PUBLISHED / ARCHIVED.
- Public list filters `status = PUBLISHED`. No `event_date` filter — past events stay listed (history).
- Sort: `event_date DESC`.

## File usage

`cover_image_file_id` optional. Upload via files module with `usage=events` (Cloudinary).
