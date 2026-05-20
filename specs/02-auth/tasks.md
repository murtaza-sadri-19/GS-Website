# Auth — Tasks

## Backend

- [ ] Install: `bcrypt`, `jsonwebtoken`
- [ ] `config/env.js`: validate `JWT_SECRET` and `JWT_EXPIRES_IN` are set (fail boot if missing)
- [ ] `middlewares/auth.middleware.js`: verify JWT, set `req.user`
- [ ] `middlewares/role.middleware.js`: export `allow(...roles)` factory
- [ ] `modules/auth/auth.service.js`:
  - [ ] `login(email, password)` → loads user, bcrypt compares, signs JWT, writes audit
  - [ ] `getMe(userId)` → returns user profile (no password_hash)
  - [ ] `changePassword(userId, current, next)` → verify current, hash new
- [ ] `modules/auth/auth.controller.js`: thin wrappers, error handling via `next(err)`
- [ ] `modules/auth/auth.routes.js`: POST /login (public), GET /me (auth), POST /change-password (auth), POST /logout (auth)
- [ ] Mount router at `/api/v1/auth` in `app.js`
- [ ] Tests: login happy, wrong password, inactive user, valid me, expired token, change password flow

## Frontend

- [ ] Install: `axios`, `react-router-dom`
- [ ] `api/axiosInstance.js`: baseURL from `VITE_API_BASE_URL`, request interceptor attaches token, response interceptor handles 401
- [ ] `api/authApi.js`: `login`, `me`, `changePassword`, `logout`
- [ ] `context/AuthContext.jsx`: state, `login()`, `logout()`, `loadFromStorage()` on mount
- [ ] `hooks/useAuth.js`: returns `{user, token, login, logout}`
- [ ] `hooks/useRole.js`: returns `{role, hasRole(...allowed)}`
- [ ] `routes/PrivateRoutes.jsx`: redirects unauth users to `/login?next=...`
- [ ] `routes/RoleBasedRoutes.jsx`: maps role → dashboard tree
- [ ] `pages/public/Login.jsx`: form, error display, redirect on success based on role
- [ ] Manual test: login as seeded CENTRAL_ADMIN end-to-end

## Verification

- [ ] Wrong password → 401, frontend shows generic "Invalid credentials"
- [ ] Inactive user → 401
- [ ] Token in localStorage persists across reload
- [ ] Expired token (set JWT_EXPIRES_IN=10s) → 401 on next request, redirected to login
- [ ] `audit_logs` row appears for each successful login
