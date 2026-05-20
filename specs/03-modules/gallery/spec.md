# Gallery — Spec Stub

> 🟡 **Stub.** Expand into requirements/design/tasks before implementing.

## Tables touched

- `gallery` ([schema](../../01-database/design.md#1010-gallery))
- `files` — every gallery item is an image
- `departments` — optional dept scope
- `audit_logs`

## Endpoints

| Method | Path | Access | Purpose |
| --- | --- | --- | --- |
| GET | `/gallery` | Public | ACTIVE images, paginated, filterable by dept |
| POST | `/gallery` | CENTRAL_ADMIN, HOD | Upload image |
| PUT | `/gallery/:id` | CENTRAL_ADMIN, HOD owner | Update title/description/status |
| DELETE | `/gallery/:id` | CENTRAL_ADMIN, HOD owner | Deactivate |

## Role / ownership

- CENTRAL_ADMIN: any. Can set `department_id` = NULL (college-wide) or any dept.
- HOD: own dept only.

## File usage

`file_id` required. Upload via files module with `usage=gallery` (Cloudinary, image only).

## Bulk upload

In v1 the dashboard supports uploading one image at a time. Bulk select is OK on the frontend if it loops sequential calls — but server-side it's still one request per file. Defer "true" multi-upload to v2.
