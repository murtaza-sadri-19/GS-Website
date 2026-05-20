# Database — Requirements

## Purpose

A normalized MySQL schema that supports: role-based logins, department-scoped content, file metadata, soft-deletable records, and audit trail.

## Actors and what they do with data

| Actor | Writes | Reads |
| --- | --- | --- |
| CENTRAL_ADMIN | All tables | All tables |
| EXAM_CONTROLLER | `exam_documents`, `files`, `audit_logs` | own + public reads |
| PLACEMENT_OFFICER | `placement_records`, `files`, `audit_logs` | own + public reads |
| HOD | `departments` (own), `faculty_profiles` (own dept), `notices` (own dept), `downloads`, `events`, `gallery` (own dept), `files`, `audit_logs` | own dept + public |
| TEACHER | `faculty_profiles` (own row only), `files`, `audit_logs` | own + public |
| Public visitor | (none) | Reads filtered by status ACTIVE/PUBLISHED |

## Data domains

13 tables grouped as:

- **Identity:** `roles`, `users`, `audit_logs`
- **Org structure:** `departments`, `faculty_profiles`
- **Content:** `notices`, `downloads`, `exam_documents`, `placement_records`, `events`, `gallery`, `pages`
- **Storage:** `files`

## Acceptance criteria

- [ ] All 13 tables created with the exact column names/types in `design.md`.
- [ ] Every FK has a name and ON DELETE behaviour explicitly chosen (RESTRICT for content, SET NULL for optional refs, CASCADE only for `audit_logs` user_id).
- [ ] `roles` table is pre-seeded with the 5 role names.
- [ ] First CENTRAL_ADMIN user is seeded with a known email and hashed password.
- [ ] No table allows hard delete via API — soft delete via `status` enum.
- [ ] Public read queries filter by status without needing a JOIN to a "visibility" table.
- [ ] `slug` columns on `departments`, `notices`, `events`, `pages` have unique indexes.
- [ ] `email` on `users` has a unique index.

## Out of scope

- Database replication / clustering
- Read replicas
- Stored procedures or triggers
- Full-text search indexes (add later if needed)
