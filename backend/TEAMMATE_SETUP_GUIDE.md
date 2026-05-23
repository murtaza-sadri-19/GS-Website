# Teammate Setup & Development Guide
### Dynamic College Website — Backend

---

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [Required Software Installation](#2-required-software-installation)
3. [Clone Project from GitHub](#3-clone-project-from-github)
4. [Install Dependencies](#4-install-dependencies)
5. [MySQL Setup](#5-mysql-setup)
6. [Environment Variable Setup](#6-environment-variable-setup)
7. [Run the Backend](#7-run-the-backend)
8. [Setup Claude in VS Code](#8-setup-claude-in-vs-code)
9. [How to Use ChatGPT Together with Claude](#9-how-to-use-chatgpt-together-with-claude)
10. [API Testing Workflow](#10-api-testing-workflow)
11. [Team Collaboration Rules](#11-team-collaboration-rules)
12. [GitHub Workflow](#12-github-workflow)
13. [Backend Architecture Explanation](#13-backend-architecture-explanation)
14. [Common Errors and Fixes](#14-common-errors-and-fixes)
15. [Development Workflow Followed in This Project](#15-development-workflow-followed-in-this-project)
16. [Final Notes](#16-final-notes)

---

## 1. Project Overview

### What Is This?

A full-stack **Dynamic College Website** for SGSITS with a role-based admin dashboard. Public visitors browse notices, faculty, events, and downloads. Staff log in to manage content based on their role.

### Tech Stack

| Area | Tech |
|------|------|
| Backend Runtime | Node.js v22+ |
| Backend Framework | Express.js v5 |
| Database | MySQL 8 |
| DB Driver | mysql2 v3 (prepared statements) |
| Auth | JWT (HS256) + bcrypt |
| File Upload | Multer → Cloudinary |
| Frontend | React.js (Vite) — separate repo/folder |

### Roles in the System

| Role | What They Can Do |
|------|-----------------|
| `CENTRAL_ADMIN` | Full access to everything |
| `HOD` | Manage their own department's content |
| `EXAM_CONTROLLER` | Manage exam documents only |
| `PLACEMENT_OFFICER` | Manage placement records only |
| `TEACHER` | Edit their own faculty profile only |

### Backend API Modules (13 total)

`auth` → `users` → `departments` → `files` → `faculty` → `notices` → `downloads` → `events` → `gallery` → `pages` → `exam` → `placement` → `audit-logs`

All routes are mounted under `/api/v1`.

---

## 2. Required Software Installation

Install these before anything else.

### VS Code
Download from: https://code.visualstudio.com/

**Recommended Extensions:**
- Thunder Client (API testing — search in Extensions tab)
- Claude for VS Code (AI assistant — search "Claude" by Anthropic)
- MySQL (by cweijan — DB viewer inside VS Code)
- GitLens (better git history)
- Prettier (code formatting)

### Node.js
Download v22 LTS from: https://nodejs.org/

Verify:
```bash
node -v   # should say v22.x.x
npm -v    # should say 10.x.x or higher
```

### MySQL
Download MySQL Community Server 8.0 from: https://dev.mysql.com/downloads/mysql/

During install:
- Set root password (remember it — you'll need it for `.env`)
- Keep default port: 3306
- Start MySQL service automatically

Verify:
```bash
mysql -u root -p
# type your password — if you see mysql> prompt, it works
```

### Git
Download from: https://git-scm.com/

Verify:
```bash
git --version
```

### Thunder Client (VS Code Extension)
- Open VS Code → Extensions tab (Ctrl+Shift+X)
- Search: `Thunder Client`
- Install by Ranga Vadhineni
- It shows up as a lightning bolt icon in the sidebar

---

## 3. Clone Project from GitHub

### Step 1 — Clone the repo

```bash
git clone https://github.com/YOUR_ORG/college-website.git
cd college-website
```

> Replace the URL with the actual GitHub link your team uses.

### Step 2 — Check existing branches

```bash
git branch -a
```

### Step 3 — Create your own branch before touching anything

```bash
git checkout -b your-name/feature-name
# Example: git checkout -b pratyush/frontend-auth
```

**Never work directly on `main`.** Always create a branch.

### Folder Structure

```
college-website/
├── backend/                    ← You are working here
│   ├── src/
│   │   ├── app.js              ← Express app setup, all routes mounted here
│   │   ├── server.js           ← Entry point (starts the server)
│   │   ├── config/
│   │   │   ├── env.js          ← Reads all .env variables
│   │   │   ├── db.js           ← MySQL connection pool
│   │   │   └── cloudinary.js   ← Cloudinary setup
│   │   ├── middlewares/
│   │   │   ├── auth.middleware.js    ← JWT verification
│   │   │   ├── role.middleware.js    ← Role-based access
│   │   │   ├── upload.middleware.js  ← Multer config
│   │   │   └── error.middleware.js   ← Global error handler
│   │   ├── utils/
│   │   │   ├── response.js     ← success() and error() helpers
│   │   │   ├── jwt.js          ← sign/verify token
│   │   │   ├── hash.js         ← bcrypt hash/compare
│   │   │   ├── audit.js        ← writeAudit() utility
│   │   │   ├── slug.js         ← slug generation
│   │   │   └── password.js     ← password validation
│   │   ├── scripts/
│   │   │   └── testDbConnection.js   ← Run with npm run db:test
│   │   └── modules/
│   │       ├── auth/
│   │       ├── users/
│   │       ├── departments/
│   │       ├── files/
│   │       ├── faculty/
│   │       ├── notices/
│   │       ├── downloads/
│   │       ├── events/
│   │       ├── gallery/
│   │       ├── pages/
│   │       ├── exam/
│   │       ├── placement/
│   │       └── audit/
│   ├── database/
│   │   ├── schema.sql          ← All table CREATE statements
│   │   └── seed.sql            ← Initial test data
│   ├── package.json
│   ├── .env                    ← You create this (NOT in git)
│   ├── CLAUDE.md               ← Context file for Claude AI
│   ├── API_HANDOFF.md          ← Full API reference for frontend team
│   └── API_TESTING.md          ← Testing checklist
├── frontend/                   ← React app (separate work)
├── specs/                      ← Design specs (read-only reference)
└── CLAUDE.md                   ← Project-level context for Claude
```

Each module folder follows the same pattern:
```
modules/auth/
├── auth.routes.js      ← URL paths + middleware chain
├── auth.controller.js  ← Parse req, call service, send res
└── auth.service.js     ← Business logic + SQL queries
```

---

## 4. Install Dependencies

```bash
cd college-website/backend
npm install
```

This installs everything in `package.json`:

| Package | Purpose |
|---------|---------|
| `express` | Web framework |
| `mysql2` | MySQL driver (promise-based) |
| `bcrypt` | Password hashing |
| `jsonwebtoken` | JWT sign/verify |
| `multer` | File upload handling |
| `cloudinary` | Cloud file storage |
| `dotenv` | Load `.env` file |
| `helmet` | Security headers |
| `cors` | Cross-origin requests |
| `morgan` | HTTP request logging |
| `cookie-parser` | Parse cookies |
| `nodemon` | Auto-restart on file change (dev only) |

### Common npm install issues

| Error | Fix |
|-------|-----|
| `EACCES: permission denied` | Run terminal as Administrator |
| `node-gyp rebuild failed` (bcrypt) | Install Python 3 + VS Build Tools, or run `npm install --ignore-scripts` |
| `npm ERR! code ERESOLVE` | Run `npm install --legacy-peer-deps` |
| Slow or hangs | Run `npm install --prefer-offline` or check your internet |

---

## 5. MySQL Setup

### Step 1 — Start MySQL service

**Windows:**
```
Search → "Services" → Find "MySQL80" → Right-click → Start
```
Or via command prompt (as Administrator):
```bash
net start MySQL80
```

**Mac:**
```bash
brew services start mysql
```

### Step 2 — Login to MySQL

```bash
mysql -u root -p
# Enter your password when prompted
```

You should see the `mysql>` prompt.

### Step 3 — Create the database

```sql
CREATE DATABASE college_website;
USE college_website;
```

Type `exit` to leave the mysql prompt.

### Step 4 — Import the schema

```bash
# From the backend/ folder
mysql -u root -p college_website < database/schema.sql
```

This creates all 13 tables: `users`, `departments`, `files`, `faculty_profiles`, `notices`, `downloads`, `events`, `gallery`, `pages`, `exam_documents`, `placement_records`, `audit_logs`, `roles`.

### Step 5 — Import the seed data

```bash
mysql -u root -p college_website < database/seed.sql
```

This inserts:
- Departments (CSE, ECE, ME, Civil, etc.)
- Admin user: `admin@college.edu` / `Admin@123`
- Sample roles
- Sample pages (about, administration, contact)

### Step 6 — Test the connection

```bash
npm run db:test
```

Expected output:
```
Testing database connection...
Connected to MySQL as: root@localhost
Database: college_website
Tables found (13): audit_logs, departments, downloads, events, ...
All 13 tables found. Database is ready.
Connection released.
```

If it fails, double-check your `.env` file (Step 6 below).

---

## 6. Environment Variable Setup

Create a file called `.env` in the `backend/` folder:

```bash
# From the backend/ folder
# Windows: create manually via VS Code (File > New File > name it .env)
```

Paste this template and fill in your values:

```env
# Server
NODE_ENV=development
PORT=5000

# CORS — frontend URL (Vite default is 5173)
CORS_ORIGIN=http://localhost:5173

# MySQL
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_mysql_root_password
DB_NAME=college_website

# JWT
JWT_SECRET=pick_any_long_random_string_here_make_it_32_chars_minimum
JWT_EXPIRES_IN=7d

# Cloudinary (for file uploads)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

### Every variable explained

| Variable | What it does | Example |
|----------|-------------|---------|
| `NODE_ENV` | Sets environment mode. Use `development` locally | `development` |
| `PORT` | Port the backend server listens on | `5000` |
| `CORS_ORIGIN` | Which frontend URL is allowed to call the API | `http://localhost:5173` |
| `DB_HOST` | MySQL server address | `localhost` |
| `DB_PORT` | MySQL port (default 3306) | `3306` |
| `DB_USER` | MySQL username | `root` |
| `DB_PASSWORD` | MySQL password you set during install | `YourPassword123` |
| `DB_NAME` | Database name (must match what you created) | `college_website` |
| `JWT_SECRET` | Secret key used to sign JWTs — keep this private | `mySecretKey_abc123!@#` |
| `JWT_EXPIRES_IN` | How long a token is valid | `7d` or `24h` |
| `CLOUDINARY_CLOUD_NAME` | Your Cloudinary account name | `dxyz1234` |
| `CLOUDINARY_API_KEY` | From Cloudinary dashboard | `123456789012345` |
| `CLOUDINARY_API_SECRET` | From Cloudinary dashboard — keep secret | `abcDEF_xyz...` |

### How to get Cloudinary credentials

1. Go to https://cloudinary.com/ → Sign up free
2. Dashboard → top right shows your Cloud Name, API Key, API Secret
3. Copy all three into `.env`

> The `.env` file is in `.gitignore` — it will NOT be pushed to GitHub. Each teammate sets up their own `.env`.

---

## 7. Run the Backend

```bash
cd college-website/backend
npm run dev
```

Expected output:
```
[nodemon] 3.1.14
[nodemon] watching path(s): *.*
[nodemon] starting `node src/server.js`
Server running on port 5000 [development]
```

### Verify it's working

Open Thunder Client or browser and hit:
```
GET http://localhost:5000/api/v1/health
```

Expected response:
```json
{
  "success": true,
  "message": "Backend is running",
  "data": {
    "status": "ok",
    "timestamp": "2026-01-01T10:00:00.000Z"
  }
}
```

### Common startup issues

| Error | Cause | Fix |
|-------|-------|-----|
| `Port 5000 is already in use` | Another process is running on 5000 | Kill it: `npx kill-port 5000`, or change `PORT` in `.env` |
| `Access denied for user 'root'@'localhost'` | Wrong DB password | Fix `DB_PASSWORD` in `.env` |
| `Unknown database 'college_website'` | Database not created yet | Run Step 3 in MySQL Setup |
| `Cannot find module './modules/...'` | Missing file | Check the file exists in `src/modules/` |
| `nodemon: command not found` | nodemon not installed | Run `npm install` again |
| Server starts but crashes immediately | `.env` missing or malformed | Double-check all values in `.env` |

---

## 8. Setup Claude in VS Code

Claude is the AI assistant used to build this project. It has full awareness of the codebase when you open the right folder.

### Step 1 — Install Claude extension

1. Open VS Code
2. Press `Ctrl+Shift+X` (Extensions)
3. Search: **Claude**
4. Install the one by **Anthropic**
5. Sign in with your Anthropic account

### Step 2 — Open the correct folder

This is critical. Open the **backend folder** specifically, not the whole college-website root:

```
File → Open Folder → navigate to college-website/backend
```

When you open the backend folder, Claude automatically reads `CLAUDE.md` which gives it full project context (tech stack, rules, module patterns, non-negotiable constraints).

### Step 3 — Understand the CLAUDE.md file

`backend/CLAUDE.md` tells Claude:
- The tech stack
- All 13 modules
- Response format rules
- RBAC rules
- Audit log requirement
- Soft delete rules
- Prepared statement rules

You should also read it yourself — it's your project contract.

### Step 4 — How to give prompts to Claude

**Bad prompt (too vague):**
> "Add a new API"

**Good prompt (specific, with context):**
> "Create a new module called `testimonials`. Files needed: `src/modules/testimonials/testimonials.routes.js`, `testimonials.controller.js`, `testimonials.service.js`. Mount at `/api/v1/testimonials`. POST is CENTRAL_ADMIN only. GET is public. Use the same pattern as the notices module. Use mysql2 prepared statements. Add audit logs for create/update/delete."

### Step 5 — How to ask Claude to fix bugs

When you hit an error, paste the **exact error message** + the **file and function** where it happened:

```
I'm getting this error when calling POST /api/v1/faculty:

TypeError: Cannot read properties of undefined (reading 'department_id')
    at createProfile (src/modules/faculty/faculty.service.js:87:30)

Here is the relevant function:
[paste the function code]

The request body I'm sending is:
[paste the JSON]

Fix the bug.
```

### Step 6 — Best Claude prompting practices

| Do | Don't |
|----|-------|
| Paste the exact error + stack trace | Say "it's not working" |
| Mention the file path | Say "the faculty thing" |
| Say which role is being used when testing | Say "the API fails" |
| Specify what the expected behavior is | Expect Claude to guess |
| Tell Claude which module to NOT touch | Let it edit unrelated files |
| Ask one thing at a time | Mix 5 unrelated tasks |
| Say "Keep CommonJS, no ES modules" | Let it switch module systems |

---

## 9. How to Use ChatGPT Together with Claude

Claude and ChatGPT have different strengths. Use both.

### When to use Claude

- Writing new modules or files
- Making changes across multiple files
- Understanding the current codebase
- Debugging with full file context
- Refactoring existing code
- Anything that requires reading existing project files

### When to use ChatGPT

- Understanding SQL concepts or MySQL syntax
- Explaining why an error happens (conceptual)
- Architecture questions ("should I use middleware or service layer?")
- Understanding JWT, bcrypt, or Cloudinary docs
- Generating test data or dummy JSON
- Quick one-off scripts you don't need in the project
- When Claude gives a confusing answer — get a second opinion

### Recommended Workflow

```
1. Claude generates the module
        ↓
2. You test it manually in Thunder Client
        ↓
3. Error appears
        ↓
4. Ask ChatGPT: "Why does this happen? [paste error + relevant code]"
        → ChatGPT explains the root cause
        ↓
5. Return to Claude: "The issue is [explanation from ChatGPT]. Fix it in [file]."
        ↓
6. Claude makes the targeted fix
        ↓
7. Re-test
```

### Practical example

**You:** Test `POST /api/v1/notices` → get `Incorrect arguments to mysqld_stmt_execute`

**ChatGPT:** "This is a mysql2 v3 issue. Prepared statements don't accept integer bind params for LIMIT/OFFSET. Use string interpolation with validated integers instead."

**Claude:** "In `notices.service.js`, the LIMIT/OFFSET in `listNotices()` is using `?` placeholders. Change to `LIMIT ${pageSize} OFFSET ${offset}` where both are already validated integers."

---

## 10. API Testing Workflow

### Install Thunder Client

Already covered in Section 2. It appears as a lightning bolt (⚡) in the VS Code sidebar.

### Basic Setup

1. Click the ⚡ icon in the sidebar
2. Click **New Request**
3. Set the base URL to `http://localhost:5000`

### Step 1 — Always test login first

```
POST http://localhost:5000/api/v1/auth/login

Body (JSON):
{
  "email": "admin@college.edu",
  "password": "Admin@123"
}
```

Copy the `token` from the response. You'll need it for all protected routes.

### Step 2 — Set Bearer token

For any protected route:
1. Go to the **Auth** tab in Thunder Client
2. Select **Bearer Token**
3. Paste your token

### Step 3 — Recommended testing order

```
1. GET  /api/v1/health                    → verify server is running
2. POST /api/v1/auth/login                → get token
3. GET  /api/v1/auth/me                   → verify token works
4. GET  /api/v1/departments               → public, no token needed
5. GET  /api/v1/users                     → needs CENTRAL_ADMIN token
6. POST /api/v1/faculty                   → create faculty profile
7. GET  /api/v1/faculty                   → public list
8. POST /api/v1/notices                   → create a notice
9. GET  /api/v1/notices                   → public list
10. POST /api/v1/files/upload             → upload a file (multipart/form-data)
```

### Common request patterns

**GET with query params:**
```
GET http://localhost:5000/api/v1/notices?notice_type=GENERAL&page=1&limit=10
```

**POST with JSON body:**
```
POST http://localhost:5000/api/v1/notices
Headers: Authorization: Bearer <your_token>
Body: { "title": "...", "notice_type": "GENERAL", "content": "..." }
```

**File upload (multipart):**
```
POST http://localhost:5000/api/v1/files/upload
Headers: Authorization: Bearer <your_token>
Body: Form → file → attach file
```

> Refer to `API_TESTING.md` for the complete 16-phase testing checklist and `API_HANDOFF.md` for all endpoints with request/response examples.

---

## 11. Team Collaboration Rules

These rules prevent merge conflicts and lost work.

### Before you start working

```bash
git checkout main
git pull origin main
git checkout -b your-name/what-you-are-doing
```

### Naming your branch

```
format: name/short-description

Examples:
pratyush/fix-auth-token
rahul/frontend-notices-page
aman/gallery-module
```

### Never do these

- Never commit directly to `main`
- Never force-push (`git push --force`) to `main`
- Never edit the same module file as someone else without coordinating first
- Never commit `.env` file
- Never commit `node_modules/`

### Before pushing

1. Pull latest main and rebase:
   ```bash
   git fetch origin
   git rebase origin/main
   ```
2. Run the backend and test your change
3. Make sure `npm run dev` still starts without errors
4. Then push your branch

### Commit naming rules

```
format: type: short description

Types:
feat:    new feature
fix:     bug fix
chore:   config/setup change
docs:    documentation
refactor: code cleanup (no behavior change)

Examples:
feat: add placement officer role to exam routes
fix: correct LIMIT/OFFSET in notices pagination
docs: update API_HANDOFF with gallery endpoints
chore: add download_count column to schema.sql
```

### Merge workflow

1. Push your branch to GitHub
2. Open a Pull Request on GitHub → target branch: `main`
3. Ask a teammate to review it
4. Merge only after review
5. Delete the branch after merge

---

## 12. GitHub Workflow

### Daily workflow

```bash
# Start of day — get latest changes
git checkout main
git pull origin main

# Create your working branch
git checkout -b yourname/your-task

# ... do your work ...

# Stage your changes
git add src/modules/notices/notices.service.js
# (add specific files, not git add . blindly)

# Commit
git commit -m "fix: resolve notices pagination LIMIT issue"

# Push your branch
git push origin yourname/your-task

# Open Pull Request on GitHub
```

### Pulling latest changes into your branch

```bash
git fetch origin
git rebase origin/main
# If conflicts appear — resolve them, then:
git add .
git rebase --continue
```

### Resolving merge conflicts

When you see conflict markers in a file:

```
<<<<<<< HEAD
  your code here
=======
  their code here
>>>>>>> origin/main
```

1. Decide which version to keep (or combine both)
2. Delete the `<<<<<<<`, `=======`, `>>>>>>>` lines
3. Save the file
4. `git add <file>`
5. `git rebase --continue`

If you're confused about a conflict — do NOT guess. Ask your teammate what their change was doing before resolving.

### Useful git commands

```bash
git status                    # see what's changed
git diff                      # see exact changes
git log --oneline -10         # last 10 commits
git stash                     # save your changes temporarily
git stash pop                 # restore stashed changes
git branch -d branch-name     # delete local branch after merge
```

---

## 13. Backend Architecture Explanation

Here's how a single API request flows through the system.

### Full flow: `POST /api/v1/notices`

```
Client request
    ↓
Helmet middleware       (sets security headers)
    ↓
CORS middleware         (checks if origin is allowed)
    ↓
Morgan middleware       (logs the request to console)
    ↓
express.json()          (parses JSON body)
    ↓
app.use('/api/v1/notices', noticesRouter)
    ↓
authMiddleware          (reads Authorization header, verifies JWT, sets req.user)
    ↓
allow('CENTRAL_ADMIN')  (checks req.user.role)
    ↓
noticesController.create(req, res, next)
    ↓
noticesService.createNotice(req.user, dto)
    ↓
MySQL query (INSERT INTO notices ...)
    ↓
writeAudit(...)         (INSERT INTO audit_logs — non-fatal)
    ↓
success(res, 'Notice created', { id, ...notice })
    ↓
Client receives JSON response
```

### Routes (`*.routes.js`)

- Define URL paths
- Attach middleware (auth, role checks)
- Point to controller functions
- No business logic here

```js
// Example from notices.routes.js
router.post('/', authMiddleware, allow('CENTRAL_ADMIN', 'HOD', 'EXAM_CONTROLLER', 'PLACEMENT_OFFICER'), noticesController.create);
```

### Controllers (`*.controller.js`)

- Receive `req`, `res`, `next`
- Extract data from `req.body`, `req.params`, `req.query`
- Call the service
- Send back the response
- No SQL here

```js
async function create(req, res, next) {
  try {
    const notice = await noticesService.createNotice(req.user, req.body);
    return success(res, 'Notice created successfully', notice);
  } catch (err) {
    next(err);
  }
}
```

### Services (`*.service.js`)

- All business logic lives here
- All SQL queries live here
- Validates input
- Enforces access rules (department checks, role×type matrices)
- Calls `writeAudit()` for create/update/delete
- Returns plain JS objects (not responses)

### Middlewares

| Middleware | What it does |
|-----------|-------------|
| `auth.middleware.js` | Reads `Authorization: Bearer <token>`, verifies JWT, sets `req.user = { id, name, email, role, department_id }` |
| `role.middleware.js` | `allow('ROLE1', 'ROLE2')` — checks `req.user.role` against allowed list |
| `upload.middleware.js` | Multer config — parses `multipart/form-data`, stores file in memory |
| `error.middleware.js` | Global error handler — catches anything passed to `next(err)` |

### Utils

| Util | What it does |
|------|-------------|
| `response.js` | `success(res, msg, data)` and `error(res, msg, detail, statusCode)` |
| `jwt.js` | `signToken(payload)` and `verifyToken(token)` |
| `hash.js` | `hashPassword(plain)` and `comparePassword(plain, hash)` |
| `audit.js` | `writeAudit(userId, action, module, entityId, changes)` — non-fatal, never throws |
| `slug.js` | `generateSlug(title)` — converts "Annual Tech Fest 2026" to "annual-tech-fest-2026" |

### Auth Flow

```
1. POST /api/v1/auth/login  { email, password }
2. Find user in DB by email
3. bcrypt.compare(password, user.password_hash)
4. If match → jwt.sign({ id, name, email, role, department_id })
5. Return token to client
6. Client stores token (localStorage or cookie)
7. Client sends token in: Authorization: Bearer <token>
8. authMiddleware verifies on every protected request
```

### RBAC Flow

```
1. authMiddleware sets req.user
2. role.middleware allow('CENTRAL_ADMIN', 'HOD') checks req.user.role
3. If role not in allowed list → 403 Forbidden
4. Inside the service, department-level checks happen:
   - HOD: req.user.department_id === target.department_id
   - TEACHER: req.user.id === facultyProfile.user_id
```

### Response Format

Every response from this API follows the same shape:

**Success:**
```json
{
  "success": true,
  "message": "Notice created successfully",
  "data": { ... }
}
```

**Error:**
```json
{
  "success": false,
  "message": "You do not have permission to perform this action",
  "error": "Role 'TEACHER' is not allowed"
}
```

---

## 14. Common Errors and Fixes

### MySQL Connection Errors

| Error | Fix |
|-------|-----|
| `Access denied for user 'root'@'localhost'` | Wrong `DB_PASSWORD` in `.env`. Verify your MySQL root password. |
| `ECONNREFUSED 127.0.0.1:3306` | MySQL service not running. Start it via Services or `net start MySQL80`. |
| `Unknown database 'college_website'` | Run `CREATE DATABASE college_website;` in MySQL first. |
| `Table 'college_website.notices' doesn't exist` | You haven't imported `schema.sql` yet. |

### Port Issues

| Error | Fix |
|-------|-----|
| `Port 5000 is already in use` | Run `npx kill-port 5000` or change `PORT=5001` in `.env` |
| Backend starts on wrong port | Check your `.env` PORT value |

### JWT Errors

| Error | Fix |
|-------|-----|
| `JsonWebTokenError: invalid signature` | Token was signed with a different `JWT_SECRET`. Make sure everyone uses the same secret (or generate a fresh token). |
| `TokenExpiredError` | Token is older than `JWT_EXPIRES_IN`. Login again to get a new token. |
| `No token provided` | You forgot to add `Authorization: Bearer <token>` header. |
| `Role 'X' is not allowed` | You're using a token for a role that doesn't have access to that route. Login as the correct role. |

### Cloudinary Issues

| Error | Fix |
|-------|-----|
| `Must supply api_key` | Missing `CLOUDINARY_API_KEY` in `.env` |
| `Invalid cloud name` | `CLOUDINARY_CLOUD_NAME` is wrong — check Cloudinary dashboard |
| `Error: Input buffer contains unsupported image format` | You're uploading a PDF/doc to an image-only upload. The API uses `resource_type: 'raw'` for non-images automatically. |
| File upload works but URL is empty | `CLOUDINARY_API_SECRET` is wrong — upload fails silently |

### Multer Issues

| Error | Fix |
|-------|-----|
| `MulterError: Unexpected field` | The form field name doesn't match. File uploads expect the field name `file`. |
| `Cannot read properties of undefined (reading 'mimetype')` | You sent JSON body instead of multipart/form-data for a file upload route. |
| File too large error | Files over the configured limit are rejected. |

### npm / Node Issues

| Error | Fix |
|-------|-----|
| `Cannot find module 'bcrypt'` | Run `npm install` — a dependency is missing |
| `Cannot find module '../config/env'` | You're running the server from the wrong folder. Make sure you're in `backend/`. |
| `SyntaxError: Cannot use import statement in a module` | This project uses CommonJS. Don't use `import`/`export`. Use `require`/`module.exports`. |
| `nodemon: not found` | Run `npm install` — nodemon is in devDependencies |

### nodemon Issues

| Error | Fix |
|-------|-----|
| Server restarts in a loop | A file is being written by another process (e.g. a log file). Add it to `.nodemonignore`. |
| Changes not detected | Delete `node_modules/.cache` and restart |

---

## 15. Development Workflow Followed in This Project

This is exactly how each of the 13 modules was built. Follow this same workflow when adding new features.

### Phase 1 — Understand the spec

Before writing a single line of code, read:
- `specs/` folder for the relevant module
- Existing similar modules (e.g. if adding a module similar to notices, read `notices.service.js`)

### Phase 2 — Create three files

Every module needs exactly three files:

```
src/modules/mymodule/
├── mymodule.routes.js      ← Step 1
├── mymodule.controller.js  ← Step 2
└── mymodule.service.js     ← Step 3
```

### Phase 3 — Mount in app.js

Add one line to `src/app.js`:
```js
app.use('/api/v1/mymodule', require('./modules/mymodule/mymodule.routes'));
```

### Phase 4 — Implement in order

```
1. service.js — write all SQL queries and business logic
2. controller.js — wire req/res to service calls
3. routes.js — define paths + middleware chain
4. app.js — mount the router
```

### Phase 5 — Test immediately

Don't implement all routes and test at the end. Test after each route:

```
Implement GET / → test GET /
Implement POST / → test POST /
Implement GET /:id → test GET /:id
...
```

### Phase 6 — Fix and move on

When a bug appears:
1. Read the exact error message
2. Identify which file/function
3. Fix in that file
4. Re-test that specific route
5. Check that other routes still work (don't break what worked before)

### Phase 7 — Audit logs

Every create, update, and delete action must log to audit_logs via:
```js
await writeAudit(actorId, 'CREATE', 'MODULE_NAME', newRecord.id, { title: dto.title });
```

`writeAudit` never throws — even if it fails internally, it won't break the request.

### Phase 8 — Commit

```bash
git add src/modules/mymodule/
git commit -m "feat: implement mymodule CRUD"
```

### Patterns to strictly follow

**Pagination response** — every list endpoint returns:
```json
{
  "data": {
    "items": [...],
    "pagination": {
      "total": 42,
      "page": 1,
      "pageSize": 10,
      "totalPages": 5
    }
  }
}
```

**LIMIT/OFFSET in SQL** — never use `?` placeholders for LIMIT/OFFSET with mysql2 v3:
```js
// WRONG — causes "Incorrect arguments to mysqld_stmt_execute"
pool.execute(`SELECT * FROM notices LIMIT ? OFFSET ?`, [pageSize, offset]);

// CORRECT — pageSize and offset are always server-validated integers
pool.execute(`SELECT * FROM notices LIMIT ${pageSize} OFFSET ${offset}`, otherParams);
```

**Soft delete** — never use `DELETE FROM` for content tables:
```js
// WRONG
await pool.execute(`DELETE FROM notices WHERE id = ?`, [id]);

// CORRECT
await pool.execute(`UPDATE notices SET status = 'ARCHIVED' WHERE id = ?`, [id]);
```

---

## 16. Final Notes

### The backend is modular — don't be afraid of it

Each module is self-contained. Breaking `events.service.js` doesn't affect `notices.service.js`. Read the module you need to change, make your edit, test that module.

### Always follow the existing response format

```js
// At the top of every controller
const { success, error } = require('../../utils/response');

// Use these helpers — never res.json() directly
return success(res, 'Message here', data);
return error(res, 'Something failed', detail, 404);
```

### Never return password_hash

If you write a query that fetches user data, explicitly list your columns. Never do `SELECT *` on the `users` table. `password_hash` must never appear in any API response.

```js
// WRONG
SELECT * FROM users WHERE id = ?

// CORRECT
SELECT id, name, email, role, department_id, status, created_at FROM users WHERE id = ?
```

### Write audit logs for every admin action

Any time an admin creates, updates, or deletes something:
```js
await writeAudit(req.user.id, 'UPDATE', 'NOTICES', notice.id, { title: dto.title });
```

### Maintain RBAC checks in the service layer

Role checks in routes are the first gate. But the service layer enforces department-level and ownership-level checks that routes can't handle:

- **HOD**: always verify `req.user.department_id === target.department_id`
- **TEACHER**: always verify `req.user.id === facultyProfile.user_id`

### Test before pushing

Minimum checklist before any `git push`:
- [ ] `npm run dev` starts without errors
- [ ] Health check returns 200
- [ ] The feature you built works end-to-end
- [ ] You haven't broken any existing routes you depend on
- [ ] No `console.log` left in the code (use only for debugging, remove before commit)

### Where to find everything

| What | Where |
|------|-------|
| Full API reference | `API_HANDOFF.md` |
| Testing checklist | `API_TESTING.md` |
| Project rules for Claude | `CLAUDE.md` |
| DB tables | `database/schema.sql` |
| Test data / seeded users | `database/seed.sql` |
| Design specs | `specs/` folder |

---

*Made for the SGSITS College Website project team. Keep this guide updated if anything changes.*
