# First Implementation Checklist

> Mirrors doc section 16 ("Recommended First Implementation Checklist"). Tick each ☐ as you go. This is the **ordered prove-it-works** list — do every box, in order, before declaring the foundation done. Don't skip ahead.

This sits on top of `phases.md`. Phases 1-2 of the roadmap deliver these checkboxes.

## Backend Checklist

- [ ] Create Express app (`backend/src/app.js`, `server.js`)
- [ ] Connect MySQL using `mysql2` (pool, prepared statements)
- [ ] Create `roles` table
- [ ] Create `users` table
- [ ] Seed CENTRAL_ADMIN (`scripts/seed.js`)
- [ ] Implement login API (`POST /api/v1/auth/login`)
- [ ] Implement JWT middleware (`middlewares/auth.middleware.js`)
- [ ] Implement role middleware (`middlewares/role.middleware.js`)
- [ ] Implement users CRUD (`/api/v1/users` — CENTRAL_ADMIN only)
- [ ] Implement departments CRUD (`/api/v1/departments`)

## Frontend Checklist

- [ ] Create React app (Vite)
- [ ] Setup React Router (`react-router-dom`)
- [ ] Setup Axios instance (`api/axiosInstance.js` with JWT interceptor)
- [ ] Create `PublicLayout`
- [ ] Create `DashboardLayout`
- [ ] Create Login page (`pages/public/Login.jsx`)
- [ ] Create `AuthContext` (`context/AuthContext.jsx`)
- [ ] Create protected route wrapper (`routes/PrivateRoutes.jsx`)
- [ ] Create role-based dashboard redirection (`routes/RoleBasedRoutes.jsx`)

## When this checklist is fully ticked

You have the **foundation**: working auth, role-based routing, two CRUD modules, and the layouts. Now:

1. Run `/spec-status` to see which module specs are filled vs stubs.
2. Pick the next module from `priorities.md` (high-priority first).
3. Use `/implement-spec 03-modules/<module>` to build it end-to-end (backend + frontend + tests).
4. Repeat for each remaining module per the build order in `phases.md`.

> **Build one complete module first, then repeat the same pattern** — this is doc rule 20.10. After the first module is end-to-end clean, the remaining 12 are essentially "copy this pattern, change names, change validators". Don't fan out before the pattern is proven.
