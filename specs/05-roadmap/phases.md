# Development Phases

Eight phases. Don't jump ahead — each phase depends on the previous.

> For the explicit doc-section-16 prove-it-works checklist that spans Phases 1-2, see [`first-implementation-checklist.md`](./first-implementation-checklist.md). Tick every box there before considering the foundation done.

## Phase 1 — Project Setup

- [ ] Create GitHub repository, push initial scaffold
- [ ] `backend/` Express app: `npm init`, install `express morgan cors helmet dotenv mysql2 bcrypt jsonwebtoken`, basic `app.js`/`server.js`
- [ ] `frontend/` React app: `npm create vite@latest`
- [ ] MySQL 8 installed, db `college_website` created
- [ ] `.env` files for both, `.env.example` committed
- [ ] Folder structures per `../00-foundation/{backend,frontend}-structure.md`

## Phase 2 — Database and Authentication

Implements `../01-database/` and `../02-auth/`.

- [ ] All 13 tables created via `schema.sql`
- [ ] Seed script: roles + first CENTRAL_ADMIN
- [ ] Login API + JWT middleware + role middleware
- [ ] Frontend login page + AuthContext + PrivateRoutes + RoleBasedRoutes
- [ ] Each role can log in and reach their dashboard placeholder

## Phase 3 — Core Admin Modules

Implements `../03-modules/{users,departments,files,pages,audit-logs}/`.

- [ ] Files module (everything else depends on it) — full spec, build first
- [ ] Audit-logs util (`utils/audit.js`)
- [ ] Users module
- [ ] Departments module
- [ ] Pages module

> Build reusable frontend components (`Phase 1 components` in `../04-frontend/tasks.md`) before the first dashboard page.

## Phase 4 — Public Website Basic Pages

- [ ] Home (latest notices placeholder, hero, quick links)
- [ ] About (from `pages` table)
- [ ] Administration (from `pages`)
- [ ] Departments list + detail
- [ ] Faculty profile (single-teacher detail page)
- [ ] Contact (from `pages`)

## Phase 5 — Content Modules

Implements `../03-modules/{notices,downloads,events,gallery}/`. Each module includes both the dashboard pages AND the public surface.

- [ ] Notices (cross-role complexity — review spec carefully)
- [ ] Downloads
- [ ] Events
- [ ] Gallery

## Phase 6 — Role Dashboards

Polish per-role dashboards now that the backend modules exist.

- [ ] CENTRAL_ADMIN dashboard (overview cards: counts of users, depts, notices)
- [ ] HOD dashboard (own dept summary)
- [ ] TEACHER dashboard (link to My Profile)
- [ ] EXAM_CONTROLLER dashboard
- [ ] PLACEMENT_OFFICER dashboard

## Phase 7 — Exam and Placement Modules

Implements `../03-modules/{exam,placement}/`. Each module covers all 4 document/record types.

## Phase 8 — Testing and Deployment

- [ ] Test public pages on real devices (Android phone, desktop)
- [ ] Test each role login end-to-end
- [ ] Test create/update/delete permissions across roles (positive + negative cases)
- [ ] Test file upload + delete
- [ ] Test mobile responsiveness
- [ ] Check broken links
- [ ] Database backup script (`mysqldump`) + restore test
- [ ] Deploy: backend (any Node host), frontend (any static host), MySQL (managed or VM)
- [ ] Final smoke test on production URL
