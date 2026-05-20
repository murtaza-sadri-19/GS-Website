# Module Specs

One folder per backend module. 13 modules total.

## Status

| Module | Status | Notes |
| --- | --- | --- |
| [`users/`](./users/) | ✅ Filled | CENTRAL_ADMIN-only CRUD over staff accounts |
| [`departments/`](./departments/) | 🟡 Stub | API + DB references from doc; expand before Phase 3 |
| [`faculty/`](./faculty/) | 🟡 Stub | Three-way write access (admin / hod / teacher self) |
| [`notices/`](./notices/) | ✅ Filled | Cross-role: admin/hod/exam/placement create different `notice_type`s |
| [`downloads/`](./downloads/) | 🟡 Stub | Admin + HOD-of-dept |
| [`exam/`](./exam/) | 🟡 Stub | EXAM_CONTROLLER only |
| [`placement/`](./placement/) | 🟡 Stub | PLACEMENT_OFFICER only |
| [`events/`](./events/) | 🟡 Stub | College-level (admin) + dept-level (HOD) |
| [`gallery/`](./gallery/) | 🟡 Stub | Admin + HOD-of-dept, Cloudinary-heavy |
| [`pages/`](./pages/) | 🟡 Stub | CENTRAL_ADMIN-only |
| [`files/`](./files/) | ✅ Filled | Storage primitive — everyone uses it |
| [`audit-logs/`](./audit-logs/) | 🟡 Stub | CENTRAL_ADMIN read-only |

## Expanding a stub

Stubs contain a single `spec.md` with the API table, role rules, and DB references from the design doc. To turn a stub into a full spec:

1. Invoke the `spec-author` subagent: ask Claude to "expand the spec for `<module>`". It will read foundation + the stub, then produce `requirements.md`, `design.md`, `tasks.md`.
2. Run `/review-spec 03-modules/<module>` to catch gaps.
3. Then `/implement-spec 03-modules/<module>`.

Don't skip the requirements/design step — even for "obvious" modules. The act of writing acceptance criteria reveals edge cases.

## Module pattern reference

`users/` is the simplest fully-fleshed example. Copy its structure when expanding stubs:

- **requirements.md** — purpose, actors, acceptance criteria
- **design.md** — DB tables touched, API table, service responsibilities, ownership rules, audit log entries
- **tasks.md** — atomic build order (backend → frontend → verification)

Cross-cutting modules (`files`, `audit-logs`) are referenced by every other module. Build them first.

## Build order

Driven by `../05-roadmap/phases.md`. Roughly:

1. `users`, `departments`, `files`, `audit-logs`, `pages` (Phase 3 — core admin)
2. `notices`, `downloads`, `events`, `gallery` (Phase 5 — content)
3. `exam`, `placement` (Phase 7)
4. `faculty` (Phase 4 — public profile; HOD-managed)
