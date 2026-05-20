# Frontend Folder Structure

```
frontend/
├── src/
│   ├── api/                            one file per module
│   │   ├── axiosInstance.js            base URL + JWT interceptor + 401 handler
│   │   ├── authApi.js
│   │   ├── userApi.js
│   │   ├── departmentApi.js
│   │   ├── noticeApi.js
│   │   ├── examApi.js
│   │   ├── placementApi.js
│   │   └── fileApi.js
│   │
│   ├── assets/                         images, fonts, logo
│   │
│   ├── components/
│   │   ├── common/                     Button, Modal, ConfirmDialog, FileUploader, Table
│   │   ├── public/                     Hero, NoticeCard, DepartmentCard, EventCard
│   │   └── dashboard/                  DataTable, Toolbar, FormShell, AuditLogRow
│   │
│   ├── layouts/
│   │   ├── PublicLayout.jsx            navbar + footer for public site
│   │   └── DashboardLayout.jsx         sidebar + topbar for staff
│   │
│   ├── pages/
│   │   ├── public/                     Home, About, Departments, Faculty, etc.
│   │   └── dashboard/
│   │       ├── centralAdmin/
│   │       ├── examController/
│   │       ├── placementOfficer/
│   │       ├── hod/
│   │       └── teacher/
│   │
│   ├── routes/
│   │   ├── PublicRoutes.jsx            wraps PublicLayout
│   │   ├── PrivateRoutes.jsx           checks JWT presence
│   │   └── RoleBasedRoutes.jsx         routes a user to their role's pages
│   │
│   ├── context/
│   │   └── AuthContext.jsx             user, token, login(), logout()
│   │
│   ├── hooks/
│   │   ├── useAuth.js
│   │   └── useRole.js                  hasRole(...allowed)
│   │
│   ├── utils/
│   │   ├── constants.js                ROLES, STATUSES, FILE_LIMITS
│   │   ├── permissions.js              canEditDepartment(user, deptId), etc.
│   │   └── formatDate.js
│   │
│   ├── App.jsx
│   └── main.jsx
│
├── public/
├── .env                                gitignored
├── .env.example                        committed
├── index.html
├── vite.config.js
├── package.json
└── README.md
```

## Module patterns

**API file (`api/<feature>Api.js`)** — exports named functions wrapping `axiosInstance` calls. No React inside. Example: `listNotices(params)`, `createNotice(payload)`, `deleteNotice(id)`.

**Dashboard page** — uses the API file + a `useAuth` hook + role guard. List/create/edit/delete pages live under `pages/dashboard/<role>/`.

**Public page** — uses the API file for read-only calls. No JWT attached for purely public endpoints.

## Routing strategy

`App.jsx` mounts:

```
<PublicRoutes>       /, /about, /departments, /notices, ...
<PrivateRoutes>      requires token; child is RoleBasedRoutes
  <RoleBasedRoutes>  reads role from JWT, mounts the matching dashboard tree
```

A logged-out user hitting `/admin/users` is redirected to `/login?next=/admin/users`. A logged-in EXAM_CONTROLLER hitting `/admin/users` gets `/exam/dashboard` (no 403 page — silent redirect, since the link shouldn't be visible to them anyway).

## Reusable component rules

Build once, reuse everywhere. Mandatory shared components:

- `<DataTable>` — every list page
- `<FormShell>` — every create/edit page
- `<ConfirmDialog>` — every destructive action
- `<FileUploader>` — every file field; uses `fileApi.upload()` and returns `file_id`
- `<StatusBadge>` — renders DRAFT/PUBLISHED/ACTIVE/INACTIVE/ARCHIVED consistently

Don't ship a feature without these. New feature with bespoke list UI = rejected in review.

## Don't do

- No direct `fetch` calls — always through `api/`
- No JWT decoding outside `AuthContext` / `useAuth`
- No role-string comparisons sprinkled across components — use `useRole().hasRole(...)`
- No inline styles for layout — use the existing component library / CSS modules
