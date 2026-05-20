# Team Division (3 members)

Split designed so the three members can work in parallel with minimal blocking.

## Member 1 — Backend + Database Lead

**Owns:**
- MySQL schema (`../01-database/`)
- Database connection (`backend/src/config/db.js`)
- Auth (`../02-auth/`)
- JWT + role middleware
- Users module (`../03-modules/users/`)
- Departments module (`../03-modules/departments/`)
- Audit logs utility (`../03-modules/audit-logs/`)

**Deliverables:**
- Working backend base structure
- Schema + seeds running
- Login system end-to-end
- Role-based access control
- Users + departments APIs

**Unblocks:** Member 2 (auth + audit util) and Member 3 (auth APIs).

## Member 2 — Backend Modules + File Upload Lead

**Owns:**
- File upload (`../03-modules/files/`) — multer + Cloudinary
- Notices (`../03-modules/notices/`)
- Downloads (`../03-modules/downloads/`)
- Events (`../03-modules/events/`)
- Gallery (`../03-modules/gallery/`)
- Exam (`../03-modules/exam/`)
- Placement (`../03-modules/placement/`)
- Pages (`../03-modules/pages/`)
- Faculty (`../03-modules/faculty/`)

**Deliverables:**
- All content-management APIs
- File upload flow (with Cloudinary integration)
- Public APIs for notices, downloads, events, gallery
- Exam + placement APIs

**Blocked by:** Member 1's auth + audit utilities (needs them in Phase 3).

## Member 3 — Frontend Lead

**Owns:**
- React app setup + Vite config
- Public website UI (`../04-frontend/public-pages.md`)
- Dashboard layout (`../04-frontend/dashboards.md`)
- Login page
- Role-based routing (`../04-frontend/routing-rbac.md`)
- Forms + tables for dashboard modules
- Axios integration
- Reusable component library

**Deliverables:**
- Complete public website pages
- Role-based dashboards
- Admin forms + list pages
- Responsive UI

**Blocked by:**
- Auth API (Member 1) before login page works
- Per-module APIs (Member 2) for content pages — can mock data in the meantime

## Coordination protocol

1. Every endpoint and table change must be reflected in the relevant spec BEFORE coding.
2. Members 1 and 2 must mock-publish their API shapes (request/response JSON) by filling the design.md so Member 3 can build against the contract.
3. Daily 10-minute standup: what got merged, what's blocked, what spec needs updating.
4. PRs reference the spec being implemented: `Spec: specs/03-modules/notices`.
5. Reviewer checks code against the spec, not against personal preference. If the spec is wrong, fix the spec.

## When work spills over a boundary

The owner doesn't need to do everything alone — pairing is encouraged, especially:
- Member 1 + 3 on JWT integration debugging
- Member 2 + 3 on file upload form UX
- All three on the public homepage (it pulls from many modules)

The "owner" is responsible for the spec, the merge, and the bugfix queue. They don't have to write every line.
