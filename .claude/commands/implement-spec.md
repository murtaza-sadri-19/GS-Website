---
description: Implement code for a specific spec, strictly following its tasks.md
argument-hint: <spec-path> (e.g. 03-modules/users)
---

You are implementing the spec at `specs/$ARGUMENTS`.

Rules — do NOT skip these:

1. Read all three files in order: `requirements.md`, `design.md`, `tasks.md`. If any is empty or still contains `<TODO>`, STOP and tell the user the spec is incomplete.
2. Re-read `CLAUDE.md` and `specs/00-foundation/conventions.md` before editing code. Follow them.
3. Work tasks **in order** from `tasks.md`. Mark each checkbox `- [x]` in `tasks.md` as you finish it. Commit the tasks.md update alongside the code change.
4. Do not invent scope beyond the spec. If you find something missing in the spec, stop and ask the user whether to update the spec first.
5. Do not edit other modules' code unless the spec explicitly requires it.
6. After the last task is checked, run the test/build commands listed in the spec's `tasks.md`, then summarize what changed in 3 lines.

If the spec is for a backend module:
- Create files under `backend/src/modules/<module>/` matching the structure in `specs/00-foundation/backend-structure.md`.
- Routes file mounts under `/api/v1/<module>`.
- Add the module to `backend/src/app.js`.

If the spec is for a frontend feature:
- Match the structure in `specs/00-foundation/frontend-structure.md`.
- API client goes in `frontend/src/api/<feature>Api.js`.

Never bypass auth/role middleware. Public APIs return only ACTIVE/PUBLISHED records.
