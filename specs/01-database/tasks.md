# Database — Tasks

Execute in order. One commit per checkbox.

## Setup

- [ ] Install MySQL 8 locally (or via Docker: `mysql:8`)
- [ ] Create database: `CREATE DATABASE college_website CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;`
- [ ] Create app DB user with privileges restricted to this DB
- [ ] Add `DB_*` vars to `backend/.env`

## Schema creation

Create a single SQL file `backend/src/scripts/schema.sql` that creates all tables in dependency order (parents before children). Order:

- [ ] `roles`
- [ ] `files`
- [ ] `departments` (references files via image_file_id — see below)
- [ ] `users` (references roles, departments)
- [ ] `faculty_profiles` (references users, departments, files)
- [ ] `notices` (references departments, files, users)
- [ ] `downloads` (references departments, files, users)
- [ ] `exam_documents` (references files, users)
- [ ] `placement_records` (references files, users)
- [ ] `events` (references departments, files, users)
- [ ] `gallery` (references departments, files, users)
- [ ] `pages` (references users)
- [ ] `audit_logs` (references users)

> Note: `departments.image_file_id` and `users.department_id` create a circular dependency at first creation if we strictly enforce both FKs from the start. Two options:
> 1. Create tables without those two FKs, then `ALTER TABLE ... ADD CONSTRAINT` afterwards. (Recommended)
> 2. Drop the FK on `departments.image_file_id` (it can stay logical-only).
>
> Pick option 1 and document it at the top of `schema.sql`.

## Indexes

- [ ] Add all indexes listed in `design.md`
- [ ] Verify with `SHOW INDEX FROM <table>`

## Seed data

`backend/src/scripts/seed.js`:

- [ ] Insert 5 rows into `roles` (CENTRAL_ADMIN, EXAM_CONTROLLER, PLACEMENT_OFFICER, HOD, TEACHER)
- [ ] Insert one CENTRAL_ADMIN user with bcrypt-hashed password from `SEED_ADMIN_PASSWORD` env var (fail loudly if not set)
- [ ] Print the admin email and remind operator to change password after first login
- [ ] Make the script idempotent (skip insert if row already exists)

## Verification

- [ ] `mysql ... -e "SHOW TABLES"` lists all 13 tables
- [ ] `SELECT * FROM roles` returns 5 rows
- [ ] Can log in as the seeded CENTRAL_ADMIN once auth is built

## Done when

- [ ] `npm run db:reset` (in backend) drops the DB, recreates it, runs schema.sql, runs seed.js, finishes cleanly
- [ ] README documents the reset command and warns it is destructive
