# <spec-name> — Tasks

> Each task is atomic and PR-sized (~30-90 min). Tick `- [x]` as you go.

## Backend

- [ ] DB: <TODO: add table/columns/migrations>
- [ ] Service: <TODO: implement create/read/update/delete with ownership checks>
- [ ] Service: write audit log entries on create/update/delete
- [ ] Controller: thin HTTP layer using `utils/response.js`
- [ ] Routes: mount at `/api/v1/<module>` with `auth.middleware` + `role.middleware`
- [ ] Wire module into `backend/src/app.js`
- [ ] Validation: input schema (joi/zod) in `validate.middleware.js` config
- [ ] Tests: happy path + 403 on wrong role + 403 on cross-department access

## Frontend

- [ ] API client: `frontend/src/api/<feature>Api.js`
- [ ] Dashboard page: list + create + edit + delete
- [ ] Public page (if applicable): list + detail
- [ ] Route entry in `RoleBasedRoutes.jsx` with correct allowed roles
- [ ] Hide UI elements the role isn't allowed to use (UX only — backend still enforces)

## Verification

- [ ] Login as each affected role and confirm allowed actions work
- [ ] Try forbidden actions as each role and confirm 403
- [ ] Confirm public endpoint only returns PUBLISHED/ACTIVE
- [ ] Confirm audit_logs has entries for create/update/delete
- [ ] Run `npm test` in both `backend/` and `frontend/`

## Done when

- [ ] All boxes above checked
- [ ] Spec's acceptance criteria all pass manual test
- [ ] Code review by another team member
