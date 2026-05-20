---
description: Review a spec for completeness and consistency with the foundation specs
argument-hint: <spec-path> (e.g. 03-modules/notices)
---

Review the spec at `specs/$ARGUMENTS` for quality.

Check each:

**requirements.md**
- States the user-facing purpose in 1-3 sentences
- Lists every actor (role) involved and what they can do
- Lists every data point the module reads/writes
- States acceptance criteria as testable bullets (e.g. "HOD cannot edit another department's notice")
- No implementation details (no JS, no SQL, no file paths)

**design.md**
- References the exact DB tables it touches (from `specs/01-database/design.md`)
- Lists every API endpoint with method, path, role access (cross-check `specs/02-auth/`)
- Describes service-layer responsibilities (no controller code)
- Notes any file-upload integration (cross-check `specs/03-modules/files/`)
- Calls out edge cases: soft delete, audit logging, ownership checks

**tasks.md**
- Atomic checkboxes, each one PR-sized
- Ordered: DB migration → service → controller → routes → tests → frontend wiring (if applicable)
- Includes "add audit log entry" for create/update/delete actions
- Includes a verification/test step at the end

Output a numbered list of issues found, grouped by file. If the spec passes, say "Spec is ready to implement" and list nothing else.

Do not modify any files. This is a review-only command.
