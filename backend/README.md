# Backend — SGSITS College Website

Express REST API for the SGSITS dynamic college website. All routes are mounted under `/api/v1`.

## Stack

| Concern        | Library / Tool                              |
| -------------- | ------------------------------------------- |
| Framework      | Node.js + Express 5                         |
| Database       | MySQL (via `mysql2`, prepared statements)   |
| Auth           | JWT (HS256) + bcrypt (cost ≥ 10)            |
| Validation     | Zod                                         |
| File uploads   | Multer (local) + Cloudinary (images)        |
| Security       | Helmet, express-rate-limit, sanitize-html   |
| Logging        | Morgan                                      |
| AI / Chatbot   | LangChain + Groq (RAG pipeline)             |
| Testing        | Jest + Axios (integration tests)            |

## Prerequisites

- Node.js ≥ 18
- MySQL 8+
- (Optional) Cloudinary account for image hosting

## Setup

```bash
cd backend
npm install
```

Create a `.env` file in this folder:

```env
PORT=5000
NODE_ENV=development

DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=yourpassword
DB_NAME=sgsits_db

JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=7d

CORS_ORIGIN=http://localhost:5173

# Optional — file uploads fall back to local /uploads if not set
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=

# Optional — chatbot RAG
GROQ_API_KEY=
```

### Database

```bash
# Test the connection
npm run db:test

# Run all migrations
npm run db:migrate
```

Seed files live in `database/` — run them in order (`seed_enterprise_01_users.sql` → ... → `seed_enterprise_09_analytics.sql`) or use `seed_enterprise_run_all.sql`.

## Running

```bash
# Development (auto-reload via nodemon)
npm run dev

# Production
npm start
```

Health check: `GET /api/v1/health`

## Project structure

```
backend/
├── src/
│   ├── server.js          # HTTP server entry point
│   ├── app.js             # Express app, middleware setup, route mounting
│   ├── config/
│   │   ├── db.js          # MySQL pool
│   │   ├── env.js         # Validated env vars
│   │   └── cloudinary.js  # Cloudinary SDK init
│   ├── middlewares/
│   │   ├── auth.middleware.js       # Verify JWT
│   │   ├── role.middleware.js       # Role-based access control
│   │   ├── permission.middleware.js # Fine-grained permission checks
│   │   ├── validate.middleware.js   # Zod request validation
│   │   ├── upload.middleware.js     # Multer config
│   │   ├── rateLimit.middleware.js  # Rate limiters
│   │   └── error.middleware.js      # Global error handler
│   ├── utils/
│   │   ├── response.js    # Uniform { success, data, message } shape
│   │   ├── jwt.js         # Sign / verify helpers
│   │   ├── hash.js        # bcrypt wrappers
│   │   ├── password.js    # Password generation
│   │   ├── slug.js        # URL-safe slug generator
│   │   ├── pagination.js  # Offset pagination helper
│   │   ├── audit.js       # Audit-log writer
│   │   ├── sanitize.js    # HTML sanitisation
│   │   ├── urlValidator.js
│   │   └── cloudinaryUpload.js
│   ├── modules/           # One folder per feature domain
│   │   ├── auth/
│   │   ├── users/
│   │   ├── departments/
│   │   ├── faculty/
│   │   ├── files/
│   │   ├── notices/
│   │   ├── events/
│   │   ├── news/
│   │   ├── downloads/
│   │   ├── tenders/
│   │   ├── alerts/
│   │   ├── gallery/
│   │   ├── pages/
│   │   ├── exam/
│   │   ├── placement/
│   │   ├── academic/
│   │   ├── marks/
│   │   ├── leaves/
│   │   ├── timetables/
│   │   ├── labs/
│   │   ├── achievements/
│   │   ├── registration/
│   │   ├── navigation/
│   │   ├── seo/
│   │   ├── contact/
│   │   ├── analytics/
│   │   ├── notifications/
│   │   ├── settings/
│   │   ├── search/
│   │   ├── chatbot/
│   │   ├── chat/          # LangChain + Groq RAG
│   │   └── audit/
│   └── scripts/
│       ├── migrate.js         # Run DB migrations
│       └── testDbConnection.js
├── database/
│   ├── schema.sql             # Full schema
│   ├── migrations/            # Incremental migration files
│   └── seed_enterprise_*.sql  # Seed data by domain
├── tests/
│   ├── api/                   # Integration tests per module
│   ├── fixtures/              # Test data helpers
│   └── globalSetup.js
└── uploads/                   # Local file storage fallback
```

Each module follows the same internal pattern:

```
modules/<name>/
├── <name>.routes.js     # Express Router
├── <name>.controller.js # req/res handling, calls service
├── <name>.service.js    # Business logic + DB queries
└── <name>.schema.js     # Zod validation schemas
```

## API conventions

- All responses use `{ success, message, data }` — see `utils/response.js`.
- Pagination via `?page=1&limit=20`; response includes `{ data, pagination }`.
- Public endpoints return only `ACTIVE` / `PUBLISHED` records.
- Every create/update/delete in admin modules is audit-logged.

## Testing

```bash
# Run all integration tests (requires a running DB and .env)
npm run test:api

# Verbose output
npm run test:api:verbose

# Create test fixtures
npm run test:fixtures
```

## Roles

| Role               | Scope                                      |
| ------------------ | ------------------------------------------ |
| `CENTRAL_ADMIN`    | Full access to all modules                 |
| `EXAM_CONTROLLER`  | Exam, marks, results                       |
| `PLACEMENT_OFFICER`| Placement drives and records               |
| `HOD`              | Own department — faculty, leaves, timetable|
| `TEACHER`          | Own profile, marks entry, leaves           |

JWT payload: `{ user_id, role, department_id }`. Tokens expire per `JWT_EXPIRES_IN`; logout is client-side (no server-side blacklist).
