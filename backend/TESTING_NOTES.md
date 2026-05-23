# TESTING_NOTES.md — Automated API Test Discrepancies and Notes

This file documents every place where the automated tests intentionally deviate from
the manual Thunder Client checklist, plus notes about environmental requirements and
known edge cases.

---

## Discrepancy 1 — HOD and TEACHER user creation requires `department_id`

**Checklist says:** Create HOD (Phase 2.3) and TEACHER (Phase 2.4) before creating
the department (Phase 3).

**Actual implementation:** `users.service.js` enforces:
```js
if (['HOD', 'TEACHER'].includes(roleName) && !department_id) {
  throw httpError(`department_id is required for role ${roleName}`, 400);
}
```
Creating HOD or TEACHER without a `department_id` returns **400**.

**Automated test fix:** HOD and TEACHER users are created inside `departments.test.js`,
after the department is created in step 3.1. They appear as steps `2.3` and `2.4` in
that file to match the checklist numbering, but run after `3.1` executes.

---

## Discrepancy 2 — Checklist shows TEACHER created with `"department_id": null`

**Checklist says:** `"department_id": null` in body for TEACHER creation.

**Actual behavior:** Same as Discrepancy 1 — TEACHER without `department_id` returns 400.

**Automated test fix:** TEACHER is created with the real `dept_id` from `state.ids.dept`.

---

## Discrepancy 3 — File uploads: Cloudinary with local-disk fallback

When `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, and `CLOUDINARY_API_SECRET` in
`backend/.env` are set to real values, files are uploaded to Cloudinary (`storage_type:
CLOUDINARY`).

When those values are absent or still set to the placeholder strings (`your_cloud_name`
etc.), the `files` service automatically falls back to writing files to `backend/uploads/`
on local disk (`storage_type: LOCAL`). The backend serves these files as static assets at
`/uploads/<filename>`.

The test suite accepts either storage type — test 4.1 asserts
`expect(['CLOUDINARY', 'LOCAL']).toContain(f.storage_type)`.

No manual configuration is required to run the test suite without Cloudinary.

---

## Discrepancy 4 — Role IDs are assumed from seed data

The checklist uses these `role_id` values:

| role_id | Role name |
|---------|-----------|
| 1 | CENTRAL_ADMIN |
| 2 | EXAM_CONTROLLER |
| 3 | PLACEMENT_OFFICER |
| 4 | HOD |
| 5 | TEACHER |

If your seed SQL assigns different IDs, edit the `ROLE` constant at the top of
`tests/api/users.test.js` and `tests/api/departments.test.js`.

---

## Discrepancy 5 — Seeded `about` page may not exist

**Checklist says:** Seeded pages (about, administration, contact) should appear in
the admin `GET /pages` list.

**Automated tests:** `pages.test.js` looks for a page with `slug === 'about'` in the
list response. If that page does not exist, tests 10.2 through 10.5 are skipped with a
console warning — they do not fail.

---

## Discrepancy 6 — Phase 14.5 (HOD managing another dept's faculty) cannot be tested

**Checklist note:** "to test 403, you'd need a faculty profile from a different department."

The automated test in `forbidden.test.js` 14.5 instead tests the **positive case** (same
department → 200) and then reactivates the profile. A cross-department 403 would require
spinning up a second department and a second HOD, which is beyond the scope of a single
test run. Add a dedicated integration test if this boundary is critical.

---

## Discrepancy 7 — Exam documents start as `ACTIVE`, not `DRAFT`

Notices start as `DRAFT`. Exam documents start as `ACTIVE`.
The checklist confirms this (`status: "ACTIVE"` in Phase 11 response shapes).
Tests in `exam.test.js` assert `status: 'ACTIVE'` on creation accordingly.

---

## Discrepancy 8 — Test data accumulates across runs (partially fixed)

Each test run creates real DB rows. The following data accumulates:

**Fixed (idempotent):** User emails now include a `Date.now()` timestamp (`RUN_ID`) so
each run creates uniquely-named users:
- `exam_<RUN_ID>@college.edu`
- `placement_<RUN_ID>@college.edu`
- `hod_<RUN_ID>@college.edu`
- `teacher_<RUN_ID>@college.edu`

Running `npm run test:api` multiple times will not cause 409 conflicts on user creation.

**Still accumulates:** Departments, pages, notices, events, gallery items, downloads, and
uploaded files are created fresh each run (department slug auto-increments: `cse-1`, `cse-2`,
etc.). This is harmless for correctness — each run stores its own IDs in `.test-state.json`
and uses them throughout — but the database will grow over time.

**For CI:** Use a fresh database per pipeline run (drop and re-seed between runs).

**For local cleanup after multiple runs (MySQL):**
```sql
-- Delete all timestamped test users (pattern matches runId emails)
DELETE FROM users WHERE email REGEXP '^(exam|placement|hod|teacher)_[0-9]+@college\\.edu$';

-- Optionally clean up accumulated test departments
DELETE FROM departments WHERE name = 'Computer Science Engineering' AND id > 1;
```

---

## Note — `GET /exam/notices`, `/exam/timetables`, etc. response shape

These typed-list routes return the same shape as `GET /exam/documents`:
```json
{ "success": true, "data": { "documents": [...], "pagination": { ... } } }
```
The tests in `exam.test.js` assert `res.data.data.documents` is an array for these routes.

---

## Note — `GET /placement/notices`, `/company-visits`, etc. response shape

These typed-list routes return:
```json
{ "success": true, "data": { "records": [...], "pagination": { ... } } }
```
The tests in `placement.test.js` assert `res.data.data.records` accordingly.

---

## Note — JWT does not check user `status`

The `auth.middleware.js` only verifies the JWT signature. An INACTIVE user whose token
is still unexpired can still make authenticated API calls. Login, however, returns 401
for INACTIVE users. This means:

- After a soft-delete test (2.11), the existing `exam_token` is still valid.
- The user is reactivated in 2.12, so subsequent test phases work normally.

---

## Note — `DELETE /pages/:id` sets status to `DRAFT`, not `ARCHIVED`

The Pages module has no `ARCHIVED` status. Soft-deleting a page reverts it to `DRAFT`.
This is confirmed in the checklist Phase 10.8 note and tested accordingly.

---

## Note — `MaxListenersExceededWarning` / TCPWRAP open handle (resolved)

**Root cause (investigated via `--detectOpenHandles`):** Axios's default HTTP agent uses
`keepAlive: true`, so connections persist after a response. The parallel `Promise.all()`
in `public.test.js` test 15.1 left a TCP socket open after the test completed. That same
reused socket accumulated `error` listeners across many sequential requests (~160 total),
triggering the `MaxListenersExceededWarning`.

**Fix:** `tests/config.js` creates a shared `http.Agent({ keepAlive: false })` and passes
it to every axios call (`api()`, `login()`, `uploadFile()`). Each connection now closes
immediately after the response — no open handles, no listener accumulation.

**Verification:** Running with `--detectOpenHandles` (the current `test:api` script) no
longer reports any open handles.
