# Tech Stack

Locked decisions. Don't change without team agreement + spec update.

| Area | Choice | Why |
| --- | --- | --- |
| Frontend | React (Vite) | Familiar, fast dev server |
| Routing | React Router v6 | Standard; supports nested + protected routes |
| HTTP | Axios | Interceptors for JWT attachment + 401 handling |
| State | React Context (`AuthContext`) | App is mostly CRUD — no need for Redux |
| Backend | Node.js + Express | Lightweight, well-known by all team members |
| DB | MySQL 8 | Required by the design doc |
| DB driver | `mysql2` (with promise wrapper) | Supports prepared statements natively |
| Auth | JWT (HS256) + bcrypt | Stateless tokens, hashed passwords |
| File upload | `multer` (parsing) + Cloudinary (images) + local disk (PDFs/docs) | Per doc section 12 |
| Validation | `joi` or `zod` (pick one and stick) | Schema-based input validation |
| Logging | `morgan` (HTTP) + simple `console` for app logs | Audit logs in DB cover the security trail |

## What we explicitly are NOT using

- TypeScript — JS only for v1 (revisit after MVP)
- ORMs (Prisma/Sequelize) — `mysql2` prepared queries + service layer
- Redis / cache layers — premature for current scale
- GraphQL — REST is enough
- Server-side rendering — pure SPA

## Runtime versions

- Node.js LTS (≥ 20)
- MySQL 8.x
- npm ≥ 10

## Environment variables (both apps)

Backend `.env`:

```
PORT=4000
DB_HOST=localhost
DB_PORT=3306
DB_USER=...
DB_PASSWORD=...
DB_NAME=college_website
JWT_SECRET=<long random string>
JWT_EXPIRES_IN=8h
CLOUDINARY_CLOUD_NAME=...
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...
UPLOAD_DIR=./uploads
```

Frontend `.env`:

```
VITE_API_BASE_URL=http://localhost:4000/api/v1
```

`.env` files are gitignored. Commit `.env.example` with placeholders instead.
