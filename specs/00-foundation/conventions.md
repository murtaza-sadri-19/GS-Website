# Conventions

Hard rules. Don't deviate without a spec update.

## File and folder naming

- Backend modules: lowercase, plural (`users`, `departments`). Internal files use `<module>.<layer>.js` (e.g. `users.service.js`).
- Frontend components: PascalCase files for components (`NoticeCard.jsx`), camelCase for hooks/api/utils (`useAuth.js`, `noticeApi.js`).
- DB tables: lowercase, plural, snake_case (`audit_logs`, `faculty_profiles`).
- DB columns: snake_case (`created_at`, `department_id`).
- URL paths: lowercase, kebab-case (`/training-placement`, `/audit-logs`).
- Slugs: lowercase, hyphenated, ASCII only.

## API response shape

Every JSON response uses one of two shapes. Implement in `utils/response.js`.

Success:
```json
{ "ok": true, "data": <object|array>, "meta": { ... optional ... } }
```

Error:
```json
{ "ok": false, "error": { "code": "FORBIDDEN", "message": "Human readable" } }
```

HTTP status codes:
- `200` OK reads/updates
- `201` Created
- `204` No Content on successful delete
- `400` validation failure
- `401` no/invalid JWT
- `403` valid JWT, wrong role or wrong owner
- `404` resource not found
- `409` conflict (duplicate slug, duplicate email)
- `500` server error (only for unexpected — never use for handled cases)

## Error codes (string enum)

`UNAUTHORIZED`, `FORBIDDEN`, `NOT_FOUND`, `VALIDATION_FAILED`, `CONFLICT`, `INTERNAL_ERROR`. Add new codes only when truly distinct.

## SQL

- **Always** prepared statements: `pool.execute('SELECT ... WHERE id = ?', [id])`.
- Never string concat / template literal SQL.
- Never `SELECT *` in production paths — list columns explicitly.
- Soft delete via `status` enum. Don't add `is_deleted` columns.
- Timestamps: `created_at DATETIME DEFAULT CURRENT_TIMESTAMP`, `updated_at DATETIME ON UPDATE CURRENT_TIMESTAMP`.

## JS style

- ES modules only (`import`/`export`). No CommonJS new files. Existing CommonJS in legacy code, if any, gets migrated.
- `async`/`await`. No `.then()` chains.
- Errors flow via `next(err)` — controllers never call `res.status(500)` directly.
- One default export per file is fine; named exports preferred for utilities.

## React

- Functional components only.
- Hooks at the top. No conditional hook calls.
- Co-locate one component per file. Big pages can have a sibling `components/` folder.
- Forms: controlled inputs, validate on submit. Show field errors inline.

## Audit logging

Every create/update/delete and every login MUST call `utils/audit.js`:

```js
await audit({
  userId: req.user.id,
  action: 'CREATE' | 'UPDATE' | 'DELETE' | 'LOGIN',
  module: 'notices',
  recordId: notice.id,
  description: `Created notice "${title}"`,
  ipAddress: req.ip,
});
```

If the audit write fails, log the failure but don't fail the user's request.

## File uploads

- Always via `POST /api/v1/files/upload` — never accept files at module routes.
- Frontend uploads first, gets `file_id`, then submits the form referencing that `file_id`.
- See [`../03-modules/files/`](../03-modules/files/) for type/size limits.

## Commits

- Short imperative subject: `add notice list endpoint`, not `Added notice list endpoint`.
- One concern per commit. Spec update + code change can be one commit if tightly related.
- Reference the spec in commit body when non-obvious: `Spec: specs/03-modules/notices`.

## Branches

- `main` is protected.
- Feature branches: `feat/<module>-<short>`, fixes: `fix/<short>`.
- PR description includes the spec path being implemented + which checkboxes were ticked.

## Reviews

- No self-merge.
- Reviewer's job: verify the code matches the spec, not redesign the spec.
- If the code reveals a spec gap, reviewer comments "update spec first" and the PR is split.
