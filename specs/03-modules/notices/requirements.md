# Notices — Requirements

## Purpose

Publish announcements visible on the public site. Used by college admin, HODs (department), exam controller (exam), and placement officer (placement).

## Actors

| Role | Can do |
| --- | --- |
| CENTRAL_ADMIN | Create any notice_type, edit/delete any notice |
| HOD | Create/edit/delete DEPARTMENT notices only for own department |
| EXAM_CONTROLLER | Create/edit/delete EXAM notices |
| PLACEMENT_OFFICER | Create/edit/delete PLACEMENT notices |
| TEACHER | Cannot use this module |
| Public visitor | Read notices where status = 'PUBLISHED' AND publish_date <= today |

## Data this feature handles

- title, slug, description
- notice_type (GENERAL / DEPARTMENT / EXAM / PLACEMENT)
- optional department_id
- optional attached file
- publish_date (effective public date)
- status (DRAFT / PUBLISHED / ARCHIVED)

## Acceptance criteria

- [ ] `GET /api/v1/notices` (public) returns only PUBLISHED notices with publish_date <= today.
- [ ] `GET /api/v1/notices/:slug` (public) returns a notice if PUBLISHED + on/after publish_date; else 404.
- [ ] `POST /api/v1/notices` requires `notice_type`. Validates that creator's role matches the type (HOD can only create DEPARTMENT for own dept, EXAM only EXAM, etc.; admin can create any).
- [ ] Slug auto-generated from title; collisions get `-2`, `-3` suffix.
- [ ] `PUT /api/v1/notices/:id` enforces same role/ownership rules as create.
- [ ] `DELETE /api/v1/notices/:id` archives instead of hard delete: status → ARCHIVED.
- [ ] HOD attempting to edit a notice with `department_id !== req.user.department_id` → 403.
- [ ] Filtering: `?notice_type=DEPARTMENT&department_id=3` on the public list works.
- [ ] Public response NEVER includes notices with status DRAFT or ARCHIVED.
- [ ] Audit log on create/update/archive.

## Out of scope

- Rich-text editor — store plain text/markdown for v1
- Email/push notifications when published
- Per-user read tracking
- Pinning / sticky notices (just sort by publish_date DESC)
