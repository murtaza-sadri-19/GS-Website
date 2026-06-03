# Development Guide

## Prerequisites

| Requirement | Version |
|-------------|---------|
| Node.js | ≥ 18 |
| MySQL | ≥ 8.0 |
| npm | ≥ 9 |

---

## Local Setup

```bash
cd backend
npm install
```

Copy `.env` (or create from scratch):

```env
NODE_ENV=development
PORT=8000
APP_URL=http://localhost:8000
CORS_ORIGIN=http://localhost:5173

DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=yourpassword
DB_NAME=college_website

JWT_SECRET=change_me_min_32_random_chars_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
JWT_EXPIRES_IN=7d

SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=you@gmail.com
SMTP_PASS=app_password_here
SMTP_FROM=SGSITS Portal <no-reply@sgsits.ac.in>
FRONTEND_URL=http://localhost:5173

# Optional — AI chat (Sara). Leave blank to disable.
GROQ_API_KEY=
GROQ_MODEL=llama-3.3-70b-versatile
```

---

## Database Setup

```bash
# 1. Create the database and run base schema
mysql -u root -p < database/schema.sql

# 2. Run phase-2 additions (exam tables, news, tenders, settings, etc.)
mysql -u root -p college_website < database/schema_additions.sql

# 3. Run all migrations in order
npm run db:migrate

# 4. Seed with enterprise data
mysql -u root -p college_website < database/seed_enterprise_run_all.sql

# 5. Apply SGSITS-specific data (HODs, departments, real content)
#    Run seed_sgsits_10 through seed_sgsits_20 in numeric order.
```

**NPM shortcuts:**
```bash
npm run db:test      # Test DB connection
npm run db:migrate   # Run migrations via src/scripts/migrate.js
npm run db:reset     # Drop + recreate schema (WARNING: destroys all data)
npm run db:fresh     # Reset + seed with default data
npm run db:seed      # Seed enterprise fixtures only
```

---

## Running the Server

```bash
# Development — auto-reload on file changes (nodemon)
npm run dev

# Production
npm start
```

Health check: `GET http://localhost:8000/api/v1/health`

The server logs all HTTP requests via Morgan. In development, request logs use the `dev` format (coloured, concise). In production, logs use `combined` (Apache format, one line per request).

---

## Running Tests

Tests are integration tests that require a live MySQL database. They run against the DB defined in your `.env`.

```bash
# Run all integration tests (sequenced)
npm run test:api

# Verbose output
npm run test:api:verbose

# Load test fixtures (seed test data)
npm run test:fixtures
```

Tests live in `tests/api/<module>.test.js`. They run sequentially (Jest `--runInBand`) because they share database state.

**Test data lifecycle:**
1. `tests/globalSetup.js` initialises the DB before any tests run.
2. `tests/fixtures/create-fixtures.js` creates users, departments, and other base data.
3. Individual test files create and clean up their own records.

---

## Adding a New Module

Follow this sequence exactly. Every new module must follow the same pattern as `notices/` or `downloads/`.

### 1. Create the folder and files

```
src/modules/<name>/
├── <name>.routes.js
├── <name>.controller.js
├── <name>.service.js
└── <name>.schema.js      (only if the module has validated request bodies)
```

### 2. Write the service

- Import only `pool` from `../../config/db` and `writeAudit` from `../../utils/audit`.
- Every function that can fail throws an error: `const err = new Error('Not found'); err.statusCode = 404; throw err;`
- Pagination: use `parsePagination` from `../../utils/pagination`.
- Call `writeAudit` on every create/update/delete.
- Never touch `req`/`res` inside a service.
- Public list queries must filter by `status = 'ACTIVE'` or `status = 'PUBLISHED'`.

```js
const pool       = require('../../config/db');
const writeAudit = require('../../utils/audit');
const { parsePagination } = require('../../utils/pagination');

const httpError = (msg, code) => { const e = new Error(msg); e.statusCode = code; return e; };

async function list({ page, pageSize, q } = {}) {
  const { page: p, pageSize: ps, offset } = parsePagination({ page, pageSize });

  const conditions = ["status = 'ACTIVE'"];
  const params = [];

  if (q) {
    conditions.push('title LIKE ?');
    params.push(`%${q}%`);
  }

  const where = `WHERE ${conditions.join(' AND ')}`;

  const [[rows], [countRows]] = await Promise.all([
    pool.execute(`SELECT * FROM <name> ${where} ORDER BY created_at DESC LIMIT ${ps} OFFSET ${offset}`, params),
    pool.execute(`SELECT COUNT(*) AS total FROM <name> ${where}`, params),
  ]);

  return {
    items: rows,
    pagination: { total: countRows[0].total, page: p, pageSize: ps, totalPages: Math.ceil(countRows[0].total / ps) },
  };
}

module.exports = { list };
```

### 3. Write the controller

- Each handler: `async function name(req, res, next) { try { ... return success(res, '...', data); } catch (err) { next(err); } }`
- Parse IDs: `parseInt(req.params.id)`.
- Never return raw errors directly from the controller — always `next(err)`.

```js
const service = require('./<name>.service');
const { success } = require('../../utils/response');

async function list(req, res, next) {
  try {
    const result = await service.list(req.query);
    return success(res, 'Records fetched', result);
  } catch (err) { next(err); }
}

module.exports = { list };
```

### 4. Write the routes

```js
const { Router } = require('express');
const controller = require('./<name>.controller');
const auth       = require('../../middlewares/auth.middleware');
const { allow }  = require('../../middlewares/role.middleware');
const { validate } = require('../../middlewares/validate.middleware');
const { createSchema } = require('./<name>.schema');

const router = Router();

router.get('/',    controller.list);
router.get('/:id', controller.getOne);
router.post('/',   auth, allow('CENTRAL_ADMIN'), validate(createSchema), controller.create);
router.put('/:id', auth, allow('CENTRAL_ADMIN'), controller.update);
router.delete('/:id', auth, allow('CENTRAL_ADMIN'), controller.remove);

module.exports = router;
```

### 5. Mount the router in `app.js`

```js
app.use('/api/v1/<name>', require('./modules/<name>/<name>.routes'));
```

### 6. Add a migration if the module needs a new table

Name it `database/migrations/016_<name>.sql` (next sequential number). Add it to `src/scripts/migrate.js`'s file list.

### 7. Write integration tests

Add `tests/api/<name>.test.js`. Test: list, get one, create (with auth), update, delete, and at least one permission-violation test.

---

## Environment Variables Reference

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `NODE_ENV` | No | `development` | Controls Morgan format, rate limit leniency |
| `PORT` | No | `8000` | HTTP listen port |
| `APP_URL` | Yes | — | Base URL used in `file_url` construction |
| `CORS_ORIGIN` | Yes | — | Frontend origin for CORS |
| `DB_HOST` | Yes | — | MySQL host |
| `DB_PORT` | No | `3306` | MySQL port |
| `DB_USER` | Yes | — | MySQL user |
| `DB_PASSWORD` | Yes | — | MySQL password |
| `DB_NAME` | Yes | — | Database name |
| `JWT_SECRET` | Yes | — | HMAC-SHA256 signing key, min 32 chars |
| `JWT_EXPIRES_IN` | No | `7d` | Token lifetime (e.g. `7d`, `24h`) |
| `SMTP_HOST` | No | — | Mailer host. If absent, emails log to console |
| `SMTP_PORT` | No | `587` | |
| `SMTP_USER` | No | — | |
| `SMTP_PASS` | No | — | |
| `SMTP_FROM` | No | — | Sender name + address |
| `FRONTEND_URL` | No | — | Used in password reset email links |
| `GROQ_API_KEY` | No | — | Enables AI chat (Sara). Leave blank to disable |
| `GROQ_MODEL` | No | `llama-3.3-70b-versatile` | Groq model ID |

---

## Coding Conventions

These are enforced by the existing codebase. New code must match.

### SQL
- Always use `pool.execute(sql, params)` with `?` placeholders for user values.
- `LIMIT` / `OFFSET` may be embedded as integer literals (a known mysql2 limitation — `LIMIT ?` is not supported in prepared-statement mode). Always validate they are integers before embedding.
- Never concatenate user-supplied strings into SQL.
- Use transactions (`pool.getConnection()` + `conn.beginTransaction()`) whenever writing to more than one table.

### Errors
- Services throw: `const err = new Error('msg'); err.statusCode = 4xx; throw err;`
- Controllers catch with `next(err)`.
- Never call `error(res, ...)` inside a controller for service errors — let the error middleware handle it.
- Input validation that should return 422 goes through Zod schema middleware, not manual `if` checks.

### Responses
- `success(res, message, data, statusCode?)` — 200 by default, 201 for create
- `error(res, message, detail?, statusCode?)` — only for known controller-level issues (e.g. missing required query param that isn't in a Zod schema)

### Naming
- Files: `<module>.<layer>.js` — e.g. `notices.service.js`, `notices.routes.js`
- Functions: camelCase verbs — `listNotices`, `createRecord`, `softDelete`, `setStatus`
- DB columns: snake_case throughout
- Route paths: kebab-case — `/registration-requests`, `/audit-logs`

### Audit
- Call `writeAudit` on every create, update, delete, and status change.
- Include `recordId` for all record-level operations.
- `writeAudit` is fire-and-forget — it never throws.

### File uploads
- All uploads go through `POST /api/v1/files/upload` first.
- Store the returned `file_id` in your module's table — never a raw path or URL.
- Pass the correct `usage` query parameter so MIME/size limits apply.

---

## Production Checklist

Before deploying:

- [ ] `NODE_ENV=production`
- [ ] `JWT_SECRET` is ≥ 32 random characters (not the dev placeholder)
- [ ] `DB_PASSWORD` is a strong password for a dedicated MySQL user (not root)
- [ ] `CORS_ORIGIN` is set to the production frontend domain only
- [ ] `APP_URL` is the production API domain (used in `file_url`)
- [ ] `FRONTEND_URL` is the production frontend domain (used in reset email links)
- [ ] SMTP credentials are valid and tested
- [ ] Rate limits are not bypassed (dev shortcut sets limit to 999 999)
- [ ] `uploads/` directory is persistent (survives deploys)
- [ ] MySQL connection pool size (`connectionLimit: 10`) matches server resources
- [ ] `GROQ_API_KEY` is set and within quota if AI chat is enabled

---

## Known Issues and Workarounds

### `academic/students/upload` and `academic/electives/upload` may be broken

The `academic.routes.js` registers these upload routes with a **disk-storage** multer instance (`multer({ dest: os.tmpdir() })`). The controller reads `req.file.path`.

The global upload middleware uses **memory storage** (no `path` property). The academic routes correctly define their own local multer instance with `dest`, so these routes do work — but only if the local multer instance is the one Multer sees (not a global override). Verify this is working in your environment before deploying.

### `LIMIT` / `OFFSET` as template literals

All list queries embed pagination as `LIMIT ${pageSize} OFFSET ${offset}`. This is intentional — `mysql2`'s `pool.execute()` (prepared-statement mode) does not support `LIMIT ?`. The values are always computed integers, not user input, so there is no injection risk. Changing this would require switching to `pool.query()` for list queries.

### `news.cover_img_url` bypasses the files module

The `news` table stores a raw image URL instead of a `file_id`. This means news cover images are not tracked in the `files` registry and cannot be audited, safe-deleted, or managed through the media manager. This is a known schema inconsistency.
