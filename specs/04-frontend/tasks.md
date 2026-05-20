# Frontend — Setup Tasks

> Per-feature frontend tasks live inside each module spec under `03-modules/`. This file covers the one-time setup.

## Phase 1: Project setup

- [ ] `npm create vite@latest frontend -- --template react`
- [ ] Install: `react-router-dom`, `axios`
- [ ] Create folder structure per `../00-foundation/frontend-structure.md`
- [ ] Configure `vite.config.js` (port, proxy `/api` to backend if you want)
- [ ] `.env.example` with `VITE_API_BASE_URL=http://localhost:4000/api/v1`
- [ ] Add a simple ESLint + Prettier config (pick one and commit)

## Phase 1: Core infra

- [ ] `api/axiosInstance.js` with request + response interceptors
- [ ] `context/AuthContext.jsx`
- [ ] `hooks/useAuth.js`, `hooks/useRole.js`
- [ ] `utils/constants.js` with ROLES, ROLE_TO_PREFIX, STATUS
- [ ] `utils/permissions.js` (canEditDepartment, canEditFacultyProfile, ...)
- [ ] `utils/formatDate.js`

## Phase 1: Layouts & routing

- [ ] `layouts/PublicLayout.jsx`
- [ ] `layouts/DashboardLayout.jsx` with role-filtered sidebar
- [ ] `routes/PublicRoutes.jsx`
- [ ] `routes/PrivateRoutes.jsx`
- [ ] `routes/RoleBasedRoutes.jsx`
- [ ] `App.jsx` wiring it all

## Phase 1: Reusable components

These are MANDATORY before building any feature page (avoids per-module reinvention):

- [ ] `components/common/Button.jsx`
- [ ] `components/common/Modal.jsx`
- [ ] `components/common/ConfirmDialog.jsx`
- [ ] `components/common/DataTable.jsx` (columns, rows, pagination, sort, loading state)
- [ ] `components/common/FormShell.jsx` (header, form body, action buttons, error banner)
- [ ] `components/common/FileUploader.jsx` (per `../03-modules/files/`)
- [ ] `components/common/StatusBadge.jsx`
- [ ] `components/common/Toolbar.jsx` (search, filter, create button)
- [ ] `components/common/Pagination.jsx`

## Phase 2: Login

- [ ] `pages/public/Login.jsx`
- [ ] Wire to `authApi.login`
- [ ] Save token, redirect to role dashboard or `next`

## Phase 4: Public pages

Build in this order (rough): Home → Departments → Department Detail → Notices → Downloads → Faculty Profile → About → Contact → Events → Gallery → Examination → Training & Placement.

(Detailed per-page tasks live in each module spec.)

## Phase 6: Dashboard pages per role

Build in this order: CENTRAL_ADMIN → HOD → TEACHER → EXAM_CONTROLLER → PLACEMENT_OFFICER.

## Verification

- [ ] All routes mounted and reachable
- [ ] Logged-out user hitting /admin/* is bounced to login with `next` param
- [ ] After login, `next` honored if safe; falls back to role dashboard
- [ ] Each role lands on their own dashboard; cross-role URLs silently redirect
- [ ] Mobile layout (360px) is usable on the public site
- [ ] 401 interceptor clears token and redirects
