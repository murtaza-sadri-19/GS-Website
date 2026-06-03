# Backend Architecture

## Stack

| Layer | Technology |
|-------|-----------|
| Runtime | Node.js ≥ 18 (CommonJS) |
| Framework | Express 5 |
| Database | MySQL 8 via `mysql2` (connection pool, prepared statements) |
| Auth | JWT HS256 + bcrypt (cost factor 10) |
| Validation | Zod |
| File uploads | Multer (in-memory buffer) |
| Email | Nodemailer (SMTP) |
| AI / RAG | LangChain Core + Groq (`llama-3.3-70b-versatile`) |
| Security | Helmet, express-rate-limit, sanitize-html |
| Logging | Morgan |
| Testing | Jest + Axios (integration tests, real DB) |

---

## Folder Structure

```
backend/
├── src/
│   ├── server.js            Boot — create HTTP server, attach app, listen
│   ├── app.js               Express app — middleware stack + route mounting
│   ├── config/
│   │   ├── db.js            MySQL connection pool (singleton)
│   │   └── env.js           Validated env vars with defaults
│   ├── middlewares/         Request pipeline (see Middleware Stack below)
│   ├── utils/               Pure helpers shared across modules
│   └── modules/             One folder per domain (33 modules)
├── database/
│   ├── schema.sql           Core 14-table schema
│   ├── schema_additions.sql Phase-2 tables (exam, news, tenders, settings…)
│   ├── migrations/          Incremental schema changes (numbered 003–015)
│   └── seed_*.sql           Seed data by domain
├── tests/
│   ├── api/                 Integration tests per module
│   ├── fixtures/            Test data helpers
│   └── globalSetup.js       DB setup before test run
└── uploads/                 Local file storage fallback
```

---

## Module Pattern

Every domain module follows an identical structure:

```
modules/<name>/
├── <name>.routes.js      Express Router — wires middleware + controller
├── <name>.controller.js  Handles req/res, delegates to service, calls next(err)
├── <name>.service.js     Business logic + SQL queries via pool
└── <name>.schema.js      Zod schemas for request body validation (if needed)
```

**Data flows one direction:** routes → controller → service → pool.

Controllers never access the pool directly. Services never touch `req`/`res`.

---

## Middleware Stack

Applied in this order by `app.js`:

```
Request
  │
  ├─ Helmet           (security headers; frameguard + CSP disabled)
  ├─ CORS             (configurable origin, credentials: true)
  ├─ Morgan           (HTTP access logging)
  ├─ express.json()   (body parsing)
  ├─ cookieParser()
  ├─ apiLimiter       (1 000 req / 15 min globally)
  │
  ├─ /uploads static  (Cross-Origin-Resource-Policy: cross-origin)
  │
  └─ Route handlers
       │
       ├─ authMiddleware      (verify JWT, attach req.user)
       ├─ allow(...roles)     (RBAC — role check)
       ├─ validate(schema)    (Zod validation → 422 on failure)
       ├─ uploadSingle/Array  (Multer — memory storage)
       │
       └─ Controller function
            │
            └─ next(err) → errorMiddleware (last handler)
```

### Rate limiters

| Limiter | Window | Limit | Applied to |
|---------|--------|-------|------------|
| `apiLimiter` | 15 min | 1 000 req | All `/api/` routes |
| `authLimiter` | 15 min | 10 req | `/auth/login`, `/auth/forgot-password`, `/auth/reset-password`, `/auth/change-password` |
| `publicWriteLimiter` | 1 min | 20 req | `/contact`, page-view beacons |

All limiters are effectively disabled in `development` (limit set to 999 999).

---

## Authentication Flow

```
POST /api/v1/auth/login
  │
  ├─ Zod validate (email, password)
  ├─ SELECT user WHERE email = ? (prepared)
  ├─ bcrypt.compare(password, hash)
  ├─ Check user.status = 'ACTIVE'
  ├─ writeAudit(LOGIN)
  └─ signToken({ id, name, email, role, department_id })
     └─ Returns: { token, user }

Subsequent requests:
  Authorization: Bearer <token>
  │
  └─ authMiddleware: verifyToken → req.user = { id, name, email, role, department_id }
```

**Logout is client-side only** — the client discards the token. There is no server-side token blacklist. Tokens expire per `JWT_EXPIRES_IN` (default `7d`).

---

## RBAC Model

Permission is enforced in two layers:

**Layer 1 — Role middleware** (`allow(...roles)`):
```js
router.post('/', authMiddleware, allow('CENTRAL_ADMIN', 'HOD'), controller.create);
```
Checks `req.user.role`. `SUPER_ADMIN` bypasses all role checks.

**Layer 2 — Service-level ownership checks** (enforced in service, not frontend):
- HOD can only manage resources in their own `department_id`
- TEACHER can only edit their own `faculty_profiles` row
- EXAM_CONTROLLER restricted to exam-type notices/documents
- PLACEMENT_OFFICER restricted to placement-type records

| Role | Scope |
|------|-------|
| `SUPER_ADMIN` | Bypasses all role/permission checks |
| `CENTRAL_ADMIN` | Full access to all modules |
| `EXAM_CONTROLLER` | Exam documents, marks fill requests, correction request approval |
| `PLACEMENT_OFFICER` | Placement records, offers, companies, drives |
| `HOD` | Own department — faculty, leaves, timetables, labs, achievements, DEPARTMENT notices |
| `TEACHER` | Own profile, marks entry, leave requests, correction requests |

---

## File Upload System

All uploads go through the `files` module. Other modules store only a `file_id` FK — never a raw path or URL.

```
POST /api/v1/files/upload  (multipart/form-data)
  │
  ├─ Multer: buffer in memory (no temp disk file)
  ├─ Validate MIME type + file size against USAGE_CONFIG[usage]
  ├─ Write buffer to  uploads/{usage}/{name}_{timestamp}{ext}
  ├─ INSERT INTO files (...)
  ├─ If PDF: setImmediate → indexPDF (non-blocking, search index)
  ├─ writeAudit(CREATE)
  └─ Returns: { id, file_url, original_name, file_type, file_size }
```

**Usage-based validation limits:**

| Usage | Allowed types | Max size |
|-------|-------------|---------|
| `gallery`, `faculty`, `events`, `departments`, `users` | JPEG, PNG, WebP | 2 MB |
| `settings`, `homepage` | JPEG, PNG, WebP | 5 MB |
| `notices`, `pages`, `labs`, `achievements`, `cms`, `admission` | Images + PDF/Word | 10 MB |
| `exam`, `tenders`, `placement` | PDF/Word | 10 MB |
| `downloads`, `research`, `chatbot` | PDF/Word/ZIP | 25 MB |

**External links** can also be registered as file records (attachment_type = `EXTERNAL_LINK`) — useful for YouTube embeds, external document links.

---

## AI Chat (RAG Pipeline)

```
POST /api/v1/chat
  │
  ├─ sanitize-html on question
  ├─ Zod validate (question, history[])
  │
  ├─ chat.retriever.js — parallel MySQL queries:
  │    notices, pages, faculty, events, departments,
  │    academic_calendars, exam_documents, etc.
  │    → Context bundle ≤ 12–16 KB of relevant text
  │
  ├─ LangChain ChatGroq
  │    System: "You are Sara, SGSITS Assistant.
  │             Use ONLY the context provided."
  │    User:   question
  │    → AI answer
  │
  └─ Returns: { answer, has_context, latency_ms }
```

The pipeline is stateless. Conversation history is passed in each request body and injected into the LangChain message chain. No server-side session state.

---

## Error Handling

All errors propagate to the centralized error middleware (`middlewares/error.middleware.js`) via `next(err)`.

Services signal errors by throwing:
```js
const err = new Error('Not found');
err.statusCode = 404;
throw err;
```

The error middleware:
- Reads `err.statusCode` (defaults to 500)
- In production: strips internal details for 500-class errors
- Logs the full error with request context
- Returns: `{ success: false, message: "...", detail: "..." }`

**Response shape** (all endpoints):
```json
{ "success": true,  "message": "...", "data": {...} }
{ "success": false, "message": "...", "detail": "..." }
```

---

## Audit Logging

Every create/update/delete in admin modules calls `writeAudit()`:
```js
await writeAudit({
  userId:      actor.id,
  action:      'CREATE',   // CREATE | UPDATE | DELETE | LOGIN | PASSWORD_RESET_REQUEST | ...
  module:      'notices',
  recordId:    newId,
  description: 'Created notice "..." (type=GENERAL)',
  ipAddress:   req.ip,     // optional
});
```

`writeAudit` is fire-and-forget on failure — a logging error never bubbles up to the caller.

Records land in the `audit_logs` table and are readable via `GET /api/v1/audit-logs`.

---

## Search System

`GET /api/v1/search?q=term` runs 12 parallel `LIKE %term%` queries across:
`alerts`, `notices`, `news`, `events`, `downloads`, `tenders`, `exam_documents`, `faculty_profiles`, `departments`, `pages`, `placement_records`, `search_index` (PDF text).

Results are scored client-side in JS and grouped by type:
- title exact match: +100
- title starts-with: +80
- title contains: +60
- filename contains: +50
- description: +30
- content: +10
- word-boundary bonus: +20

PDF files are indexed into `search_index` at upload time (non-blocking, via `setImmediate`).

---

## Database Connection

A single `mysql2` connection pool is shared across the entire app (`config/db.js`):

```js
pool = mysql2.createPool({
  host, port, user, password, database,
  waitForConnections: true,
  connectionLimit: 10,
  timezone: '+00:00',
  charset: 'utf8mb4',
})
```

All queries use `pool.execute(sql, params)` which uses server-side prepared statements. `LIMIT`/`OFFSET` values are embedded as integer literals (a known mysql2 limitation — `LIMIT ?` is not supported in prepared mode) — they are always validated integers before embedding.
