# Auth — Design

## Tables touched

- `users` — read (login) / update (change password)
- `audit_logs` — insert on LOGIN

## Endpoints

| Method | Path | Access | Purpose |
| --- | --- | --- | --- |
| POST | `/auth/login` | Public | Email + password → JWT |
| GET | `/auth/me` | Logged-in | Current user profile |
| POST | `/auth/change-password` | Logged-in | currentPassword + newPassword |
| POST | `/auth/logout` | Logged-in | Frontend token removal (server returns 200) |

### POST /auth/login

Request:
```json
{ "email": "...", "password": "..." }
```

Response (200):
```json
{ "ok": true, "data": {
  "token": "<JWT>",
  "user": { "id": 1, "name": "...", "email": "...", "role": "CENTRAL_ADMIN", "department_id": null }
}}
```

Errors:
- 400 if email/password missing
- 401 invalid credentials OR inactive account (same message: "Invalid credentials")

### JWT payload

```json
{
  "user_id": 5,
  "role": "HOD",
  "department_id": 2,
  "iat": 1716000000,
  "exp": 1716028800
}
```

Sign with HS256 using `JWT_SECRET`. Expire per `JWT_EXPIRES_IN` (default 8h).

Never include `email`, `name`, or `password_hash` in the token.

## Middleware

### `auth.middleware.js`

1. Read `Authorization: Bearer <token>` header.
2. Verify with `JWT_SECRET`. On failure → 401 `UNAUTHORIZED`.
3. Optionally re-fetch `users.status` (DB hit on every request — defer until needed; v1 trusts the token until expiry).
4. Attach `req.user = { id: payload.user_id, role: payload.role, department_id: payload.department_id }`.
5. Call `next()`.

### `role.middleware.js`

Exports a factory `allow(...roles)` that returns Express middleware:

```js
allow('CENTRAL_ADMIN', 'HOD')
// in route:
router.post('/notices', auth, allow('CENTRAL_ADMIN', 'HOD'), createNotice);
```

Behavior:
- If `req.user.role` ∈ allowed → `next()`.
- Else → 403 `FORBIDDEN`.

### Ownership checks

Ownership checks live in the **service layer**, not middleware (because they need to read the resource first). Pattern:

```js
async function updateNotice(id, dto, currentUser) {
  const notice = await loadNotice(id);
  if (!notice) throw new NotFoundError();
  if (currentUser.role === 'HOD' && notice.department_id !== currentUser.department_id) {
    throw new ForbiddenError();
  }
  // ... proceed
}
```

CENTRAL_ADMIN bypasses ownership checks by virtue of role.

## Backend middleware order

```
Request → auth.middleware → role.middleware → validate.middleware → controller → service (owns ownership)
```

## Route protection examples

From the design doc (section 13.4):

| Route | Allowed Role |
| --- | --- |
| `POST /users` | CENTRAL_ADMIN |
| `POST /exam/documents` | EXAM_CONTROLLER |
| `POST /placement/records` | PLACEMENT_OFFICER |
| `POST /departments/:id/notices` | HOD of that department |
| `PUT /faculty/:id` | CENTRAL_ADMIN, HOD of department, TEACHER self |

## Password handling

- Hash with bcrypt, cost factor 10.
- Compare with `bcrypt.compare(plain, hash)` — never decrypt.
- Never log the plaintext password (not in error messages, not in audit logs).
- Change password: verify current password via bcrypt before storing new hash.

## Frontend integration

- `AuthContext` stores `{token, user}`.
- Token in `localStorage` (v1; revisit for httpOnly cookies in v2).
- `axiosInstance` attaches `Authorization: Bearer <token>` on every request.
- 401 response interceptor → clear context → redirect to `/login?next=<current>`.

## Audit log entries

| Action | description |
| --- | --- |
| LOGIN | "User <email> logged in" |
| (failed login) | not logged in v1 |

## Edge cases

- **Inactive account login attempt** → 401 (same message as invalid creds, to avoid enumeration).
- **Expired token** → 401, frontend clears storage and redirects to /login.
- **Token tampered** → 401.
- **User deletes themselves** → not allowed via API in v1. CENTRAL_ADMIN can deactivate any user except themselves; deactivating the last CENTRAL_ADMIN is rejected with 409.
