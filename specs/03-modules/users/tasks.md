# Users — Tasks

Blocked by: auth module complete, `audit-logs/` util available.

## Backend

- [ ] `utils/password.js`: `generateInitialPassword()`, `validatePasswordStrength()`
- [ ] `modules/users/users.service.js`:
  - [ ] `listUsers({ q, role, departmentId, status, page, pageSize })`
  - [ ] `getUser(id)`
  - [ ] `createUser(dto, currentUser)`
  - [ ] `updateUser(id, dto, currentUser)` (transaction for HOD/TEACHER dept sync)
  - [ ] `setStatus(id, status, currentUser)` (with last-admin and self-deactivate checks)
  - [ ] `softDelete(id, currentUser)`
- [ ] `modules/users/users.controller.js`
- [ ] `modules/users/users.validators.js`: joi/zod schemas for create + update
- [ ] `modules/users/users.routes.js` with `auth + allow('CENTRAL_ADMIN')` on every route
- [ ] Mount at `/api/v1/users` in `app.js`
- [ ] Tests:
  - [ ] Non-admin → 403 on every endpoint
  - [ ] Create HOD without department → 400
  - [ ] Create duplicate email → 409
  - [ ] Create returns plaintext password (assert presence + length)
  - [ ] Deactivate self → 409
  - [ ] Deactivate last active CENTRAL_ADMIN → 409
  - [ ] Soft delete sets status INACTIVE, row remains
  - [ ] audit_logs row written for each action

## Frontend

- [ ] `api/userApi.js`: `listUsers`, `getUser`, `createUser`, `updateUser`, `setStatus`, `deleteUser`
- [ ] `pages/dashboard/centralAdmin/Users.jsx` — list with filters + pagination + status toggle
- [ ] `pages/dashboard/centralAdmin/UserCreate.jsx` — form with role-dependent department field
- [ ] After successful create: modal showing initial password with copy button, "I've saved it" confirm before close
- [ ] `pages/dashboard/centralAdmin/UserEdit.jsx`
- [ ] Hide nav entry for non-CENTRAL_ADMIN via `useRole`

## Verification

- [ ] Login as CENTRAL_ADMIN, create one of each role (EXAM, PLACEMENT, HOD, TEACHER), copy initial passwords
- [ ] Login as each new role, confirm they reach their own dashboard, get 403 on /users
- [ ] Deactivate the seeded admin via another admin → confirm last-admin block when only one remains
- [ ] Run npm test
