# Users — Design

## Tables

- `users` (see [`../../01-database/design.md`](../../01-database/design.md#102-users))
- `roles` (read for role_id lookup)
- `departments` (read for validation)
- `audit_logs` (insert)

## Endpoints

Base: `/api/v1/users`. All require CENTRAL_ADMIN.

| Method | Path | Purpose |
| --- | --- | --- |
| GET | `/` | Paginated list with `?q=&role=&department_id=&status=&page=&pageSize=` |
| GET | `/:id` | Single user |
| POST | `/` | Create user; returns one-time initial password |
| PUT | `/:id` | Update name, phone, role_id, department_id |
| PATCH | `/:id/status` | Toggle ACTIVE/INACTIVE |
| DELETE | `/:id` | Soft delete (= set INACTIVE) |

### POST / response

```json
{ "ok": true, "data": {
  "user": { "id": 12, "name": "...", "email": "...", "role": "HOD", "department_id": 3, "status": "ACTIVE" },
  "initial_password": "Xx7-pQ3k!"
}}
```

The `initial_password` field is returned **only on creation**. Never re-fetchable. UI must show it prominently with a "copy" button and a warning that it's shown once.

### Validation rules

- `email` — RFC-ish format; lowercase before storing; UNIQUE.
- `role_id` — must exist in `roles`.
- `department_id` — required when role is HOD or TEACHER; must be ACTIVE department.
- `name` — 2-150 chars, no leading/trailing whitespace.
- `phone` — optional; 7-20 chars.

### Constraints enforced in service

```js
// Cannot deactivate self
if (currentUser.id === targetId && newStatus === 'INACTIVE')
  throw new ConflictError('Cannot deactivate your own account');

// Cannot deactivate last active CENTRAL_ADMIN
if (targetUser.role === 'CENTRAL_ADMIN' && newStatus === 'INACTIVE') {
  const activeAdmins = await countActiveCentralAdmins();
  if (activeAdmins <= 1) throw new ConflictError('At least one CENTRAL_ADMIN must remain active');
}
```

## Service responsibilities (`users.service.js`)

- `listUsers(filters)` — paginated SELECT with explicit columns (NO `password_hash`)
- `getUser(id)` — single row, no password_hash
- `createUser(dto, createdBy)`:
  - validate role/dept invariants
  - generate strong random initial password
  - bcrypt-hash with cost 10
  - insert row with status ACTIVE
  - audit log
  - return user + plaintext password
- `updateUser(id, dto, currentUser)` — no email change, no password change
- `setStatus(id, status, currentUser)` — applies the two constraints above
- `softDelete(id, currentUser)` — calls setStatus(id, 'INACTIVE')

## Initial password generation

```
20 chars from [A-Z][a-z][0-9] plus a symbol from "!@#$%^&*-_+=" (at least one of each)
```

Implement in `utils/password.js` so /auth/change-password can validate against the same complexity.

## Ownership / role rules

This module is CENTRAL_ADMIN-only. No HOD/TEACHER paths. Enforced at route level via `allow('CENTRAL_ADMIN')`.

## Audit log entries

| Action | description |
| --- | --- |
| CREATE | `Created user <email> with role <ROLE>` |
| UPDATE | `Updated user <email>: changed fields [name, phone, ...]` |
| UPDATE | `Changed status of user <email> to ACTIVE/INACTIVE` (action stays UPDATE; description differentiates) |
| DELETE | `Soft-deleted user <email>` |

## Edge cases

- **Race on last admin** — if two admins are simultaneously deactivating each other, the second request reads stale count. Acceptable in v1; revisit with row-level lock if it bites.
- **Changing a TEACHER's department** — must keep `faculty_profiles.department_id` in sync. Service does this in a transaction.
- **Changing a HOD's department** — `departments.hod_user_id` of the old department should be set to NULL. Do this in the same transaction.
