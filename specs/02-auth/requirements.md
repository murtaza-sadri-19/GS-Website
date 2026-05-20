# Auth — Requirements

## Purpose

Authenticate staff and authorize actions by role and (where applicable) department/user ownership. The public website needs no auth.

## Actors

| Actor | What they do |
| --- | --- |
| Any staff role | Logs in with email/password, receives JWT, calls protected APIs |
| CENTRAL_ADMIN | Same as above; additionally creates other users |
| Public visitor | Calls only public endpoints; no token |

## Acceptance criteria

- [ ] `POST /api/v1/auth/login` with valid credentials returns a JWT containing `{user_id, role, department_id}`.
- [ ] Login is rejected with 401 if email doesn't exist OR password doesn't match. Same error message either way (no user enumeration).
- [ ] Login is rejected with 403 if `users.status = 'INACTIVE'`.
- [ ] `GET /api/v1/auth/me` returns the current user's profile (id, name, email, role, department).
- [ ] `POST /api/v1/auth/change-password` requires the current password and updates `password_hash`.
- [ ] `POST /api/v1/auth/logout` returns 200; actual invalidation is frontend-side (token removed from storage).
- [ ] Token expires per `JWT_EXPIRES_IN`; expired tokens get 401.
- [ ] Successful login writes an `audit_logs` entry with action `LOGIN`.
- [ ] Failed login attempts are NOT audit-logged in v1 (revisit if rate-limit policy adds it).
- [ ] Role middleware blocks wrong roles with 403.
- [ ] HOD ownership: any write to department-scoped resource where `target.department_id !== req.user.department_id` returns 403.
- [ ] TEACHER self-edit: any write to faculty profile where `profile.user_id !== req.user.id` returns 403 (CENTRAL_ADMIN and HOD-of-same-dept can bypass per the access matrix).

## Out of scope

- Password reset via email (manual reset by CENTRAL_ADMIN for v1)
- 2FA
- OAuth / SSO
- Rate limiting on /login (revisit before production)
- Refresh tokens (single short-lived token, re-login when expired)
