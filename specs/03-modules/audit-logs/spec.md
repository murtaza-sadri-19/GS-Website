# Audit Logs — Spec Stub

> 🟡 **Stub.** Expand into requirements/design/tasks before implementing.

## Tables touched

- `audit_logs` ([schema](../../01-database/design.md#1013-audit_logs))
- `users` — join for actor name in list responses

## Endpoints

| Method | Path | Access | Purpose |
| --- | --- | --- | --- |
| GET | `/audit-logs` | CENTRAL_ADMIN | List, paginated, filterable |
| GET | `/audit-logs/user/:userId` | CENTRAL_ADMIN | Logs for a specific user |

No POST/PUT/DELETE. Logs are write-once via the internal `utils/audit.js` helper.

## Filters

`?action=LOGIN&module_name=notices&user_id=5&from=2026-01-01&to=2026-01-31&page=1&pageSize=50`

Default sort: `created_at DESC`.

## Internal helper (NOT an endpoint)

`backend/src/utils/audit.js`:

```js
async function audit({ userId, action, module, recordId, description, ipAddress }) {
  // INSERT INTO audit_logs (...)
  // Best-effort: log error but don't throw — never break the user's request because audit failed.
}
```

Every other module imports this and calls it on CREATE/UPDATE/DELETE/LOGIN. The list of actions is in [`../../00-foundation/conventions.md#audit-logging`](../../00-foundation/conventions.md#audit-logging).

## Required audit-log entries (from doc section 17.3)

At minimum, the following 8 events MUST be audit-logged. Each module's spec must include the relevant entries in its `design.md`.

| # | Event | module_name | action | Logged by |
| --- | --- | --- | --- | --- |
| 1 | Login | `auth` | `LOGIN` | auth.service |
| 2 | User creation, update, deactivation | `users` | `CREATE` / `UPDATE` / `DELETE` | users.service |
| 3 | Notice creation, update, delete (archive) | `notices` | `CREATE` / `UPDATE` / `DELETE` | notices.service |
| 4 | File upload | `files` | `CREATE` | files.service |
| 5 | File delete | `files` | `DELETE` | files.service |
| 6 | Department update | `departments` | `UPDATE` | departments.service |
| 7 | Page update | `pages` | `UPDATE` | pages.service |
| 8 | Exam document upload | `exam` | `CREATE` | exam.service |
| 9 | Placement record update | `placement` | `UPDATE` | placement.service |

(Doc lists 8; the file split into upload/delete makes it 9 in implementation.)

Other create/update/delete actions across modules (downloads, events, gallery, faculty) are also audit-logged per the conventions rule, but the above 8 are the doc-mandated minimum.

## Retention

No automatic deletion in v1. Manual archive process documented separately when DB grows past ~1 GB.
