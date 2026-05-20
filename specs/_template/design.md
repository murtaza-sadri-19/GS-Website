# <spec-name> — Design

> How to build it. Reference exact table/column names and role rules — don't invent them. Cross-link to other specs instead of duplicating.

## Database

Tables this feature reads/writes (see [`../../01-database/design.md`](../../01-database/design.md) for full schemas):

| Table | Used for |
| --- | --- |
| <TODO: e.g., notices> | <TODO: primary table> |
| <TODO: e.g., files> | <TODO: optional attachment> |

New columns or tables required: <TODO: none / list them>.

## API endpoints

Base URL: `/api/v1`. Auth and role rules cross-checked against [`../../02-auth/design.md`](../../02-auth/design.md).

| Method | Path | Access | Purpose |
| --- | --- | --- | --- |
| <TODO> | <TODO> | <TODO> | <TODO> |

### Request / response shapes

<TODO: for non-trivial endpoints, give JSON shape>

## Service layer

`<module>.service.js` is responsible for:

- <TODO: e.g., enforcing ownership (HOD can only touch own department)>
- <TODO: e.g., writing audit log entries>
- <TODO: e.g., filtering by status for public queries>

The controller is a thin layer that calls the service and shapes the response. No business logic in controllers.

## Ownership & access rules

- <TODO: e.g., HOD: req.user.department_id === target.department_id>
- <TODO: e.g., TEACHER self-edit: req.user.id === target.user_id>

## File upload integration

<TODO: which fields take a file? Cross-link to `../files/`. All uploads go via the `files` module; this module stores `file_id` only.>

## Audit log entries

| Action | module_name | description |
| --- | --- | --- |
| <TODO: CREATE> | <TODO: notices> | <TODO: Created notice "<title>" (id=<id>)> |

## Edge cases

- <TODO: e.g., department deleted while a notice references it — soft-delete only>
- <TODO: e.g., file deletion when notice is deleted — keep file metadata, mark notice ARCHIVED>
- <TODO: e.g., publish_date in the future — return as DRAFT until date>

## What we explicitly defer

<TODO: e.g., notice scheduling UI — out of scope for v1>
