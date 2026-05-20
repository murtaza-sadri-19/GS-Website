# Downloads — Spec Stub

> 🟡 **Stub.** Expand into requirements/design/tasks before implementing.

## Tables touched

- `downloads` ([schema](../../01-database/design.md#106-downloads))
- `files` — every download has a file (ON DELETE RESTRICT)
- `departments` — optional dept scope
- `audit_logs`

## Endpoints

| Method | Path | Access | Purpose |
| --- | --- | --- | --- |
| GET | `/downloads` | Public | ACTIVE downloads (filter by `?category=&department_id=`) |
| POST | `/downloads` | CENTRAL_ADMIN, HOD | Add download |
| PUT | `/downloads/:id` | CENTRAL_ADMIN, HOD owner | Update |
| DELETE | `/downloads/:id` | CENTRAL_ADMIN, HOD owner | Deactivate |

## Role / ownership

- CENTRAL_ADMIN: any download.
- HOD: only downloads where `department_id = req.user.department_id`. HOD-created downloads always carry the HOD's `department_id`.
- HOD cannot create a download with `department_id = NULL` (that's a college-wide download — admin only).

## Categories

Common values (string, not enum — flexibility for v1): `Form`, `Syllabus`, `Circular`, `Brochure`, `Document`. Validate via VALIDATION schema set, not DB enum.

## File usage

`file_id` is required. Upload via files module with `usage=downloads` (PDF/DOC/DOCX/ZIP, max 25 MB for ZIP).
