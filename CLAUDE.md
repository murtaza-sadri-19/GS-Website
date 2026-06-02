# Dynamic College Website — Project Context

This is a multi-role college website. Public visitors browse notices, departments, faculty, events, etc. Staff log in to role-based dashboards to manage content.

The single source of truth for the design is `specs/`. Always read the relevant spec before changing code.

## Stack

| Area               | Tech                          |
| ------------------ | ----------------------------- |
| Frontend           | React.js (Vite) + React Router + Axios |
| Backend            | Node.js + Express             |
| Database           | MySQL (via `mysql2`, prepared statements only) |
| Auth               | JWT (HS256), bcrypt for password hashing |
| File upload        | Multer + local disk (dynamic uploads/{usage}/ folders) |

## Repository layout

```
college-website/
├── .claude/        Claude Code config — settings, slash commands, agents
├── specs/          Spec-driven development source of truth (read before coding)
├── backend/        Express API (created in Phase 1)
└── frontend/       React app (created in Phase 1)
```

The full spec index lives in `specs/README.md`.

## Spec-driven workflow

Every feature follows: **requirements → design → tasks → implement**.

1. Read or create the spec under `specs/`. Use `/new-spec <path>` to scaffold one.
2. Fill in `requirements.md` (what & why, no code).
3. Fill in `design.md` (how, with API table + DB tables + service responsibilities).
4. Fill in `tasks.md` (atomic checkboxes in build order).
5. Run `/review-spec <path>` to check the spec is complete.
6. Run `/implement-spec <path>` to build it. Tick off checkboxes in `tasks.md` as you go.

Do not start coding a feature whose spec is incomplete. If the spec is missing something, update the spec first.

## Non-negotiable rules

These come from the design doc (sections 17 and 20) and apply to every change:

1. **Backend permission checks are strict.** Every dashboard route MUST go through `auth.middleware` + `role.middleware`. Frontend button-hiding is UX only, never security.
2. **Public APIs return only `ACTIVE` or `PUBLISHED` records.** Never leak DRAFT/INACTIVE/ARCHIVED to public endpoints.
3. **Use `mysql2` prepared statements** (`?` placeholders). Never concatenate user input into SQL.
4. **Use bcrypt** for password hashing (cost factor ≥ 10). Never store plain passwords; never log them.
5. **Soft delete** important records via status fields (`ACTIVE`, `INACTIVE`, `DRAFT`, `PUBLISHED`, `ARCHIVED`). Don't hard-delete.
6. **Audit-log every create/update/delete** in admin modules (see `specs/03-modules/audit-logs/`). Login is audit-logged too.
7. **File uploads always go through the `files` module.** Module tables store `file_id` only, never raw paths or URLs.
8. **Slugs for public URLs**: `/departments/electronics-communication`, `/events/annual-tech-fest-2026`, `/pages/about`.
9. **Department ownership rule (HOD):** `req.user.department_id === target.department_id`. Enforce in middleware or service, not just frontend.
10. **Teacher self-edit rule:** `req.user.id === facultyProfile.user_id`.
11. **JWT payload** is `{ user_id, role, department_id }` — never put password or PII in the token.
12. **JWT expiry + frontend logout.** Tokens expire per `JWT_EXPIRES_IN`. The backend has no token blacklist — logout is purely frontend (remove token from storage). Don't add server-side session state.
13. **Build one complete module first, then repeat.** Before fanning out to all 13 modules, finish one module end-to-end (e.g. `users` or `notices`) — backend CRUD, validation, audit, route protection, frontend list/create/edit, tests. The next 12 modules clone that exact pattern.

## Roles

`CENTRAL_ADMIN`, `EXAM_CONTROLLER`, `PLACEMENT_OFFICER`, `HOD`, `TEACHER`. Detailed responsibilities in `specs/00-foundation/user-roles.md`.

## API base URL

All backend routes are mounted under `/api/v1`.

## Coding conventions

See `specs/00-foundation/conventions.md` for naming, error handling, response shape, and file structure rules. Match the existing module pattern (`auth/` is the reference) — don't invent new patterns per module.

## When in doubt

- Ambiguity about behavior → read the spec.
- Spec doesn't cover it → ask the user, then update the spec, then code.
- Doc and spec disagree → the spec wins (specs are derived from the doc but kept current).
