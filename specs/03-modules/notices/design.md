# Notices — Design

## Tables

- `notices` (see [`../../01-database/design.md`](../../01-database/design.md#105-notices))
- `files` — read only via file_id (uploads go through `../files/`)
- `departments` — validate department_id exists + ACTIVE
- `audit_logs` — write on CUD

## Endpoints

Base: `/api/v1/notices`

| Method | Path | Access | Purpose |
| --- | --- | --- | --- |
| GET | `/` | Public | Published notices, paginated; `?notice_type=&department_id=&q=&page=&pageSize=` |
| GET | `/:slug` | Public | Single notice by slug |
| POST | `/` | CENTRAL_ADMIN, HOD, EXAM_CONTROLLER, PLACEMENT_OFFICER | Create |
| PUT | `/:id` | Creator-role (with ownership) or CENTRAL_ADMIN | Update |
| DELETE | `/:id` | Creator-role (with ownership) or CENTRAL_ADMIN | Archive |

### Role × notice_type matrix

| Role creating | Allowed notice_type | Notes |
| --- | --- | --- |
| CENTRAL_ADMIN | GENERAL, DEPARTMENT, EXAM, PLACEMENT | Can specify any department for DEPARTMENT notices |
| HOD | DEPARTMENT only | `department_id` forced to `req.user.department_id`; ignore client value |
| EXAM_CONTROLLER | EXAM only | `department_id` MUST be NULL |
| PLACEMENT_OFFICER | PLACEMENT only | `department_id` MUST be NULL |

Enforce in service. Don't trust the client.

### Editing rules

- CENTRAL_ADMIN can edit any notice
- HOD can edit only notices where `notice_type = DEPARTMENT AND department_id = req.user.department_id`
- EXAM_CONTROLLER can edit only `notice_type = EXAM` notices
- PLACEMENT_OFFICER can edit only `notice_type = PLACEMENT` notices

A creator cannot change `notice_type` after creation (would let HOD pivot the notice into another scope).

## Service responsibilities (`notices.service.js`)

- `listPublicNotices(filters)` — `WHERE status='PUBLISHED' AND publish_date <= CURDATE()`
- `getPublicNotice(slug)` — same filter
- `listDashboardNotices(currentUser, filters)` — admin sees all; others see only what they can edit
- `createNotice(dto, currentUser)` — applies role/type rules, generates slug, audit log
- `updateNotice(id, dto, currentUser)` — ownership check, no type change, audit log
- `archiveNotice(id, currentUser)` — sets status ARCHIVED, audit log

## Slug generation

`utils/slug.js`:
- lowercase, replace whitespace with `-`, strip non-`[a-z0-9-]`, trim leading/trailing `-`
- `ensureUnique(slug, tableName, column)` appends `-2`, `-3` until unique

## Public filtering

`SELECT id, title, slug, description, notice_type, department_id, file_id, publish_date FROM notices WHERE status='PUBLISHED' AND publish_date <= CURDATE() AND (? IS NULL OR notice_type = ?) AND (? IS NULL OR department_id = ?) ORDER BY publish_date DESC LIMIT ? OFFSET ?`

Use prepared params for every `?`.

## Audit log entries

| Action | description |
| --- | --- |
| CREATE | `Created notice "<title>" (type=<type>, dept=<id|null>)` |
| UPDATE | `Updated notice id=<id>: fields [<changed>]` |
| DELETE | `Archived notice id=<id>` |

## Edge cases

- **Future publish_date** — accepted; just not returned by public queries until the date.
- **HOD changes department mid-edit** (admin transferred them) — they lose ability to edit notices of their old department; old notices remain owned by their original `department_id`.
- **Attached file deleted via files module** — blocked because notice still references it (FK is SET NULL on `notices.file_id` per DB design, so technically the column is just nulled — but the files module's reference check should prevent deletion of a referenced file).
- **Slug clash on rename** — regenerate with -2 suffix; old slug is lost (acceptable; URLs change rarely).
