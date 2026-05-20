# Exam — Spec Stub

> 🟡 **Stub.** Expand into requirements/design/tasks before implementing.

## Tables touched

- `exam_documents` ([schema](../../01-database/design.md#107-exam_documents))
- `files` — every doc has a file
- `audit_logs`

## Endpoints

| Method | Path | Access | Purpose |
| --- | --- | --- | --- |
| GET | `/exam/documents` | Public | All ACTIVE exam documents |
| GET | `/exam/notices` | Public | document_type = NOTICE |
| GET | `/exam/timetables` | Public | document_type = TIMETABLE |
| GET | `/exam/results` | Public | document_type = RESULT |
| GET | `/exam/academic-calendar` | Public | document_type = ACADEMIC_CALENDAR |
| POST | `/exam/documents` | EXAM_CONTROLLER | Upload doc |
| PUT | `/exam/documents/:id` | EXAM_CONTROLLER | Update |
| DELETE | `/exam/documents/:id` | EXAM_CONTROLLER | Deactivate |

> The four `/exam/*` GET endpoints are sugar over `/exam/documents?document_type=X`. Implement once in service, call from four controller methods (or one with optional path-derived type).

## Role / ownership

- EXAM_CONTROLLER: all CUD.
- CENTRAL_ADMIN: also CUD (per design doc section 13.4 — implicit override).
- No department scoping. No ownership beyond role.

## File usage

`file_id` required. Upload via files module with `usage=exam` (PDF recommended; PDF/image allowed).

## Notice cross-module

EXAM_CONTROLLER also has authority to create notices of `notice_type=EXAM` — see `../notices/`. The exam module is for the actual document files; the notices module is for announcements.
