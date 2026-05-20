# Backend Folder Structure

```
backend/
├── src/
│   ├── config/
│   │   ├── db.js              mysql2 pool, prepared-statement helpers
│   │   ├── cloudinary.js      Cloudinary SDK init
│   │   └── env.js             dotenv loader + validated config object
│   │
│   ├── middlewares/
│   │   ├── auth.middleware.js     verify JWT, attach req.user
│   │   ├── role.middleware.js     allow(...roles) factory
│   │   ├── upload.middleware.js   multer config (type/size limits)
│   │   ├── error.middleware.js    centralized error handler
│   │   └── validate.middleware.js joi/zod schema validator
│   │
│   ├── modules/                   one folder per feature
│   │   ├── auth/
│   │   │   ├── auth.routes.js
│   │   │   ├── auth.controller.js
│   │   │   └── auth.service.js
│   │   ├── users/
│   │   ├── departments/
│   │   ├── faculty/
│   │   ├── notices/
│   │   ├── downloads/
│   │   ├── exam/
│   │   ├── placement/
│   │   ├── events/
│   │   ├── gallery/
│   │   ├── pages/
│   │   ├── files/
│   │   └── auditLogs/
│   │
│   ├── utils/
│   │   ├── response.js        success() / error() response shapers
│   │   ├── slug.js            slugify + ensure-unique
│   │   └── audit.js           writeAudit({ userId, action, module, recordId, description })
│   │
│   ├── scripts/
│   │   └── seed.js            create first CENTRAL_ADMIN + role rows
│   │
│   ├── app.js                 express app: middleware chain, mount routes
│   └── server.js              app.listen(...), graceful shutdown
│
├── uploads/                   local file uploads (gitignored)
├── tests/                     mirrors src/modules structure
├── .env                       gitignored
├── .env.example               committed
├── package.json
└── README.md
```

## Module file responsibilities

Every module follows the same three-file pattern (using `notices` as the example):

**`notices.routes.js`** — Express Router. Mounts middleware (`auth`, `role`, `validate`, `upload`) and binds paths to controller methods. No logic.

**`notices.controller.js`** — HTTP layer. Reads `req`, calls service, shapes response via `utils/response.js`. Catches errors and forwards via `next(err)`. No business logic, no SQL.

**`notices.service.js`** — Business logic. Talks to `mysql2` pool via prepared statements. Enforces ownership rules. Calls `utils/audit.js` for create/update/delete.

## Mounting modules

In `app.js`:

```js
app.use('/api/v1/auth', require('./modules/auth/auth.routes'));
app.use('/api/v1/users', require('./modules/users/users.routes'));
// ... one line per module
```

Order matters only for `error.middleware.js` — it must be last.

## Standard middleware chain

```
helmet → cors → morgan → express.json → routes → 404 handler → error.middleware
```

## Don't do

- No DB calls outside `*.service.js`
- No `req`/`res` inside service files
- No business logic inside route files
- No new top-level folders inside `src/` without a spec update
