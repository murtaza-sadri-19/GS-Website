# Backend — SGSITS College Website

Express REST API. All routes mount under `/api/v1`. MySQL via `mysql2` prepared statements.

## Documentation

| Doc | Contents |
|-----|---------|
| [Architecture](docs/architecture.md) | Module pattern, middleware stack, auth flow, file system, RAG chat, error handling |
| [API Reference](docs/api-reference.md) | Every endpoint — method, path, auth, roles, request/response shape |
| [Database](docs/database.md) | All tables, columns, relationships, migration history, status enums |
| [Development](docs/development.md) | Local setup, adding a new module, conventions, production checklist |

---

## Quick Start

```bash
cd backend
npm install
```

Create `.env` (see [Development → Environment Variables](docs/development.md#environment-variables-reference) for all options):

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

JWT_SECRET=change_me_min_32_random_chars
JWT_EXPIRES_IN=7d
```

Set up the database:

```bash
mysql -u root -p < database/schema.sql
mysql -u root -p college_website < database/schema_additions.sql
npm run db:migrate
mysql -u root -p college_website < database/seed_enterprise_run_all.sql
```

Run:

```bash
npm run dev      # nodemon (auto-reload)
npm start        # production
```

Health check: `GET http://localhost:8000/api/v1/health`

---

## Stack

| Concern | Library |
|---------|---------|
| Framework | Express 5 |
| Database | MySQL 8 + mysql2 |
| Auth | JWT (HS256) + bcrypt |
| Validation | Zod |
| File uploads | Multer (in-memory) |
| Email | Nodemailer |
| AI / RAG | LangChain + Groq |
| Security | Helmet, express-rate-limit, sanitize-html |
| Logging | Morgan |
| Testing | Jest + Axios (integration, real DB) |

---

## Roles

| Role | Scope |
|------|-------|
| `CENTRAL_ADMIN` | Full access to all modules |
| `EXAM_CONTROLLER` | Exam documents, marks requests, correction approvals |
| `PLACEMENT_OFFICER` | Placement records, offers, companies |
| `HOD` | Own department — faculty, notices, leaves, timetables, labs, achievements |
| `TEACHER` | Own profile, marks entry, leave requests, correction requests |

---

## Modules (33)

`auth` · `users` · `departments` · `faculty` · `files` · `notices` · `downloads` · `events` · `gallery` · `pages` · `exam` · `placement` · `academic` · `marks` · `leaves` · `timetables` · `labs` · `achievements` · `registration` · `news` · `tenders` · `alerts` · `settings` · `navigation` · `seo` · `contact` · `analytics` · `notifications` · `chatbot` · `chat` · `search` · `audit`

Each module: `<name>.routes.js` → `<name>.controller.js` → `<name>.service.js` → MySQL pool.

---

## Testing

```bash
npm run test:api           # Run all integration tests
npm run test:api:verbose   # With output
npm run test:fixtures      # Seed test fixtures
```

Tests require a live DB. They run sequentially (`--runInBand`).
