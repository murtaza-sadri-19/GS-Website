# Backend API Handoff — SGSITS College Website

**Stack:** Node.js + Express 5 + MySQL 8 + Cloudinary  
**Written for:** Frontend team  
**Last updated:** See git log

---

## Table of Contents

1. [Base URL & Environment](#1-base-url--environment)
2. [Standard Response Format](#2-standard-response-format)
3. [Authentication Flow](#3-authentication-flow)
4. [Roles & Permissions](#4-roles--permissions)
5. [Module APIs](#5-module-apis)
   - [Auth](#51-auth)
   - [Users](#52-users)
   - [Departments](#53-departments)
   - [Files](#54-files)
   - [Faculty](#55-faculty)
   - [Notices](#56-notices)
   - [Downloads](#57-downloads)
   - [Events](#58-events)
   - [Gallery](#59-gallery)
   - [Pages](#510-pages)
   - [Exam Documents](#511-exam-documents)
   - [Placement Records](#512-placement-records)
   - [Audit Logs](#513-audit-logs)
6. [File Upload Guide](#6-file-upload-guide)
7. [Database Tables Reference](#7-database-tables-reference)
8. [Common Error Responses](#8-common-error-responses)
9. [Frontend Integration Notes](#9-frontend-integration-notes)
10. [Seeded Test Credentials](#10-seeded-test-credentials)
11. [Hard Rules](#11-hard-rules)

---

## 1. Base URL & Environment

```
Development:  http://localhost:5000/api/v1
Production:   https://<your-domain>/api/v1
```

All routes are prefixed with `/api/v1`. The health check endpoint:

```
GET /api/v1/health
→ 200 { success: true, message: "Backend is running", data: { status: "ok", timestamp: "..." } }
```

---

## 2. Standard Response Format

Every response — success or error — follows this shape:

### Success
```json
{
  "success": true,
  "message": "Human-readable message",
  "data": { ... }
}
```

### Error
```json
{
  "success": false,
  "message": "Human-readable error",
  "error": "Detail or null"
}
```

`data` is `null` for operations that return nothing (logout, soft-delete).  
`error` is `null` when there is no additional detail.

### Pagination wrapper (all list endpoints)
```json
{
  "success": true,
  "message": "...",
  "data": {
    "<resource>": [ ...items ],
    "pagination": {
      "total": 84,
      "page": 1,
      "pageSize": 20,
      "totalPages": 5
    }
  }
}
```

---

## 3. Authentication Flow

### Step 1 — Login
```
POST /auth/login
Body: { "email": "...", "password": "..." }
```

Response:
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": 1,
      "name": "Central Admin",
      "email": "admin@college.edu",
      "role": "CENTRAL_ADMIN",
      "department_id": null
    }
  }
}
```

### Step 2 — Store the token
Store `data.token` in `localStorage` or a React context/state store.

### Step 3 — Send token with every protected request
Add this header to every authenticated request:
```
Authorization: Bearer <token>
```

### Token payload (decoded)
```json
{
  "id": 1,
  "name": "Central Admin",
  "email": "admin@college.edu",
  "role": "CENTRAL_ADMIN",
  "department_id": null
}
```
Use `department_id` from the token to scope HOD dashboard views — it tells you which department this user manages.

### Token expiry
Controlled by `JWT_EXPIRES_IN` env variable (e.g. `7d`). No server-side blacklist — logout is purely client-side (delete the token from storage).

---

## 4. Roles & Permissions

| Role | ID | What they can do |
|---|---|---|
| `CENTRAL_ADMIN` | 1 | Everything — create users, manage all content across all modules |
| `EXAM_CONTROLLER` | 2 | CUD exam documents; create EXAM-type notices |
| `PLACEMENT_OFFICER` | 3 | CUD placement records; create PLACEMENT-type notices |
| `HOD` | 4 | Manage own department — faculty, events, gallery, downloads, notices (DEPARTMENT type only) |
| `TEACHER` | 5 | Read and update own faculty profile only |

### Module access matrix

| Module | PUBLIC | TEACHER | HOD | EXAM_CTRL | PLACEMENT | ADMIN |
|---|---|---|---|---|---|---|
| Auth | login | ✅ | ✅ | ✅ | ✅ | ✅ |
| Users | — | — | — | — | — | CRUD |
| Departments | GET | — | update own | — | — | CRUD |
| Files | — | upload/own | upload/own | upload/own | upload/own | all |
| Faculty | GET active | read+edit self | CRUD own dept | — | — | CRUD |
| Notices | GET published | — | DEPARTMENT own | EXAM type | PLACEMENT type | all types |
| Downloads | GET active | — | CRUD own dept | — | — | CRUD |
| Events | GET published | — | CRUD own dept | — | — | CRUD |
| Gallery | GET active | — | CRUD own dept | — | — | CRUD |
| Pages | GET published | — | — | — | — | CRUD |
| Exam docs | GET active | — | — | CRUD | — | — |
| Placement | GET active | — | — | — | CRUD | — |
| Audit logs | — | — | — | — | — | read |

---

## 5. Module APIs

---

### 5.1 Auth

Base: `/auth`

---

#### POST `/auth/login`
**Access:** Public

**Request body:**
```json
{ "email": "admin@college.edu", "password": "Admin@123" }
```

**Response `200`:**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "token": "<jwt>",
    "user": {
      "id": 1,
      "name": "Central Admin",
      "email": "admin@college.edu",
      "role": "CENTRAL_ADMIN",
      "department_id": null
    }
  }
}
```

**Status codes:** `200` success · `400` missing fields · `401` wrong credentials or inactive account

---

#### GET `/auth/me`
**Access:** Any authenticated user

**Headers:** `Authorization: Bearer <token>`

**Response `200`:**
```json
{
  "success": true,
  "message": "User profile fetched successfully",
  "data": {
    "id": 1,
    "name": "Central Admin",
    "email": "admin@college.edu",
    "phone": null,
    "status": "ACTIVE",
    "department_id": null,
    "role": "CENTRAL_ADMIN",
    "created_at": "2025-01-01T10:00:00.000Z"
  }
}
```

**Status codes:** `200` · `401` no/invalid token

---

#### POST `/auth/change-password`
**Access:** Any authenticated user

**Request body:**
```json
{ "oldPassword": "Admin@123", "newPassword": "NewPass@456" }
```

**Response `200`:**
```json
{ "success": true, "message": "Password changed successfully", "data": null }
```

**Status codes:** `200` · `400` wrong old password or too short · `401` unauthenticated

---

#### POST `/auth/logout`
**Access:** Any authenticated user

**Response `200`:**
```json
{ "success": true, "message": "Logged out successfully", "data": null }
```

> Logout is purely client-side — delete the token from storage on receipt of this 200.

---

### 5.2 Users

Base: `/users` — **CENTRAL_ADMIN only**

---

#### GET `/users`
**Query params:**

| Param | Type | Description |
|---|---|---|
| `q` | string | Search by name or email |
| `role` | string | Filter by role name e.g. `HOD` |
| `department_id` | number | Filter by department |
| `status` | string | `ACTIVE` or `INACTIVE` |
| `page` | number | Default `1` |
| `pageSize` | number | Default `20`, max `100` |

**Response `200`:**
```json
{
  "success": true,
  "message": "Users fetched successfully",
  "data": {
    "users": [
      {
        "id": 2,
        "name": "HOD Test",
        "email": "hod@college.edu",
        "phone": null,
        "status": "ACTIVE",
        "department_id": 1,
        "role": "HOD",
        "created_at": "2025-01-05T09:00:00.000Z",
        "updated_at": "2025-01-05T09:00:00.000Z"
      }
    ],
    "pagination": { "total": 5, "page": 1, "pageSize": 20, "totalPages": 1 }
  }
}
```

---

#### GET `/users/:id`
**Response `200`:** Single user object (same shape as list item).  
**Status codes:** `200` · `404` not found

---

#### POST `/users`
**Request body:**
```json
{
  "name": "Jane Smith",
  "email": "jane@college.edu",
  "role_id": 4,
  "department_id": 1,
  "phone": "9876543210"
}
```

> `role_id` values: 1=CENTRAL_ADMIN, 2=EXAM_CONTROLLER, 3=PLACEMENT_OFFICER, 4=HOD, 5=TEACHER  
> `department_id` required for HOD and TEACHER roles.

**Response `201`:**
```json
{
  "success": true,
  "message": "User created successfully",
  "data": {
    "user": { "id": 6, "name": "Jane Smith", "email": "jane@college.edu", "role": "HOD", ... },
    "initial_password": "Xk9#mP2$qLr7vNwZ8j"
  }
}
```

> `initial_password` is shown **once only** — store it or display it immediately.

**Status codes:** `201` · `400` validation · `409` email already exists

---

#### PUT `/users/:id`
**Request body** (all fields optional — only send what changes):
```json
{ "name": "Jane Doe", "phone": "9876543210", "role_id": 5, "department_id": 2 }
```

**Response `200`:** Updated user object.

---

#### PATCH `/users/:id/status`
**Request body:**
```json
{ "status": "INACTIVE" }
```

**Response `200`:** Updated user object.  
**Status codes:** `200` · `409` cannot deactivate yourself · `409` last CENTRAL_ADMIN

---

#### DELETE `/users/:id`
Soft delete — sets `status = INACTIVE`.  
**Response `200`:** `{ "data": null }`

---

### 5.3 Departments

Base: `/departments`

---

#### GET `/departments` — Public
Returns only `ACTIVE` departments.

**Response `200`:**
```json
{
  "success": true,
  "message": "Departments fetched successfully",
  "data": [
    {
      "id": 1,
      "name": "Computer Science Engineering",
      "slug": "computer-science-engineering",
      "short_name": "CSE",
      "description": "...",
      "vision": "...",
      "mission": "...",
      "hod_user_id": 2,
      "hod_name": "Jane Smith",
      "hod_email": "jane@college.edu",
      "image_file_id": null,
      "status": "ACTIVE",
      "created_at": "...",
      "updated_at": "..."
    }
  ]
}
```

---

#### GET `/departments/:slug` — Public
Returns a single ACTIVE department by slug.  
**Status codes:** `200` · `404` not found or INACTIVE

---

#### POST `/departments` — CENTRAL_ADMIN
**Request body:**
```json
{
  "name": "Electronics & Communication",
  "short_name": "EC",
  "description": "...",
  "vision": "...",
  "mission": "...",
  "image_file_id": 3
}
```

> `slug` is auto-generated from `name`. Only `name` is required.

**Response `201`:** Created department object.

---

#### PUT `/departments/:id` — CENTRAL_ADMIN or HOD (own dept)
**HOD restrictions:** HOD can only update `description`, `vision`, `mission`, `image_file_id`. Attempting `name`, `short_name`, `slug`, `hod_user_id`, or `status` returns `403`.

**Request body** (partial update — send only changed fields):
```json
{ "description": "Updated description.", "vision": "New vision." }
```

**Response `200`:** Updated department object.

---

#### PATCH `/departments/:id/status` — CENTRAL_ADMIN
```json
{ "status": "INACTIVE" }
```

---

#### DELETE `/departments/:id` — CENTRAL_ADMIN
Soft delete → `status = INACTIVE`.  
**Response `200`:** `{ "data": null }`

---

#### PATCH `/departments/:id/hod` — CENTRAL_ADMIN
Assigns a user as HOD. Automatically sets `users.department_id` for the new HOD and clears it from the previous HOD.

**Request body:**
```json
{ "user_id": 4 }
```

> Target user must have `role = HOD` and `status = ACTIVE`.

**Response `200`:** Updated department object (with new `hod_name`).  
**Status codes:** `200` · `400` user not found or not HOD/ACTIVE · `404` dept not found

---

### 5.4 Files

Base: `/files`

---

#### POST `/files/upload` — Any authenticated user

Send as `multipart/form-data`:

| Field | Type | Required | Notes |
|---|---|---|---|
| `file` | File | Yes | The file binary |
| `usage` | string | Yes | See usage table below |

**Usage → allowed types and size limits:**

| `usage` | Allowed MIME types | Max size |
|---|---|---|
| `gallery` | JPEG, PNG, WebP | 2 MB |
| `faculty` | JPEG, PNG, WebP | 2 MB |
| `events` | JPEG, PNG, WebP | 2 MB |
| `departments` | JPEG, PNG, WebP | 2 MB |
| `notices` | JPEG, PNG, WebP, PDF, DOC, DOCX | 10 MB |
| `exam` | PDF only | 10 MB |
| `placement` | PDF, DOC, DOCX | 10 MB |
| `downloads` | PDF, DOC, DOCX, ZIP | 25 MB |

**Response `201`:**
```json
{
  "success": true,
  "message": "File uploaded successfully",
  "data": {
    "id": 7,
    "original_name": "timetable.pdf",
    "stored_name": "college-website/exam/timetable",
    "file_url": "https://res.cloudinary.com/...",
    "file_type": "application/pdf",
    "file_size": 204800,
    "storage_type": "CLOUDINARY",
    "uploaded_by": 1,
    "uploader_name": "Central Admin",
    "created_at": "..."
  }
}
```

> **Always upload the file first, then use the returned `id` as `file_id` when creating records.**

**Status codes:** `201` · `400` wrong type for usage · `400` file too large · `401` unauthenticated

---

#### GET `/files` — CENTRAL_ADMIN only
Lists all uploaded files with pagination (`page`, `pageSize` query params).

---

#### GET `/files/:id` — Owner or CENTRAL_ADMIN
Returns file metadata.  
**Status codes:** `200` · `403` not owner · `404` not found

---

#### DELETE `/files/:id` — Owner or CENTRAL_ADMIN
Deletes the Cloudinary asset **and** the database row. Blocked if any module still references this file.

**Status codes:** `200` · `409` file still referenced (shows which tables reference it)

---

### 5.5 Faculty

Base: `/faculty`

---

#### GET `/faculty` — Public
Returns only `ACTIVE` profiles.

**Query params:**

| Param | Description |
|---|---|
| `department_id` | Filter by department |
| `q` | Search by teacher name |
| `page` | Default `1` |
| `pageSize` / `limit` | Default `20` |

**Response `200`:**
```json
{
  "success": true,
  "data": {
    "faculty": [
      {
        "id": 1,
        "user_id": 5,
        "department_id": 1,
        "designation": "Assistant Professor",
        "qualification": "M.Tech CS",
        "specialization": "Machine Learning",
        "experience": "5 years",
        "bio": "...",
        "publications": null,
        "research_work": null,
        "subjects": "DSA, OS",
        "profile_image_file_id": 3,
        "status": "ACTIVE",
        "teacher_name": "Teacher Test",
        "teacher_email": "teacher@college.edu",
        "department_name": "Computer Science Engineering",
        "department_slug": "computer-science-engineering",
        "created_at": "...",
        "updated_at": "..."
      }
    ],
    "pagination": { ... }
  }
}
```

---

#### GET `/faculty/:id` — Public
Single ACTIVE profile by numeric id.  
**Status codes:** `200` · `404` not found or INACTIVE

---

#### GET `/faculty/me` — TEACHER only
Returns the logged-in teacher's own profile (any status).

---

#### POST `/faculty` — CENTRAL_ADMIN or HOD
**Request body:**
```json
{
  "user_id": 5,
  "department_id": 1,
  "designation": "Assistant Professor",
  "qualification": "M.Tech Computer Science",
  "specialization": "Machine Learning",
  "experience": "5 years",
  "bio": "Passionate educator.",
  "subjects": "DSA, Algorithms",
  "profile_image_file_id": 3
}
```

> `user_id` must be a TEACHER with status ACTIVE and no existing profile.  
> HOD's `department_id` is always forced to their own department regardless of what is sent.

**Response `201`:** Created faculty profile object.  
**Status codes:** `201` · `409` profile already exists for this user

---

#### PUT `/faculty/:id` — CENTRAL_ADMIN, HOD (own dept), or TEACHER (self)
Partial update — send only fields to change.

> TEACHER can only update: `designation`, `qualification`, `specialization`, `experience`, `bio`, `publications`, `research_work`, `subjects`, `profile_image_file_id`.  
> TEACHER **cannot** change `department_id` or `user_id`.

---

#### PUT `/faculty/me` — TEACHER only
Same as PUT `/:id` but scoped to the logged-in teacher's own profile. Structural fields (`department_id`, `user_id`) are rejected.

---

#### PATCH `/faculty/:id/status` — CENTRAL_ADMIN or HOD (own dept)
```json
{ "status": "INACTIVE" }
```

---

#### DELETE `/faculty/:id` — CENTRAL_ADMIN or HOD (own dept)
Soft delete → `status = INACTIVE`.

---

### 5.6 Notices

Base: `/notices`

---

#### GET `/notices` — Public
Returns only `PUBLISHED` notices with `publish_date <= today`.

**Query params:**

| Param | Description |
|---|---|
| `notice_type` | `GENERAL`, `DEPARTMENT`, `EXAM`, or `PLACEMENT` |
| `department_id` | Filter by department (for DEPARTMENT type) |
| `q` | Search title and description |
| `page` | Default `1` |
| `pageSize` / `limit` | Default `20` |

**Response `200`:**
```json
{
  "success": true,
  "data": {
    "notices": [
      {
        "id": 1,
        "title": "Annual Day Announcement",
        "slug": "annual-day-announcement",
        "description": "...",
        "notice_type": "GENERAL",
        "department_id": null,
        "department_name": null,
        "file_id": null,
        "created_by": 1,
        "created_by_name": "Central Admin",
        "publish_date": "2025-01-01",
        "status": "PUBLISHED",
        "created_at": "...",
        "updated_at": "..."
      }
    ],
    "pagination": { ... }
  }
}
```

---

#### GET `/notices/:id` — Public
Returns single notice if `PUBLISHED` and `publish_date <= today`.  
**Status codes:** `200` · `404` not found, not published, or future-dated

---

#### POST `/notices` — CENTRAL_ADMIN, HOD, EXAM_CONTROLLER, PLACEMENT_OFFICER

**Role × notice_type rules (enforced server-side):**

| Role | Allowed `notice_type` | `department_id` |
|---|---|---|
| `CENTRAL_ADMIN` | any | any or null |
| `HOD` | `DEPARTMENT` only | forced to HOD's own department |
| `EXAM_CONTROLLER` | `EXAM` only | forced to null |
| `PLACEMENT_OFFICER` | `PLACEMENT` only | forced to null |

**Request body:**
```json
{
  "title": "Mid-Term Exam Schedule",
  "notice_type": "EXAM",
  "description": "Exams begin 20th February.",
  "publish_date": "2025-02-01",
  "file_id": 7
}
```

> Notice is created with `status = DRAFT`. Publish separately using PATCH status.  
> `file_id` is optional. `publish_date` is required.

**Response `201`:** Created notice object.

---

#### PUT `/notices/:id` — CENTRAL_ADMIN, HOD (own dept), EXAM_CONTROLLER (EXAM), PLACEMENT_OFFICER (PLACEMENT)

Partial update. `notice_type` **cannot be changed** after creation.

**Request body** (send only changed fields):
```json
{ "title": "Updated Title", "description": "Updated text.", "publish_date": "2025-03-01" }
```

---

#### PATCH `/notices/:id/status`
```json
{ "status": "PUBLISHED" }
```

Valid values: `DRAFT`, `PUBLISHED`, `ARCHIVED`.

---

#### DELETE `/notices/:id`
Archive → `status = ARCHIVED`. Not hard delete.  
**Response `200`:** `{ "data": null, "message": "Notice archived successfully" }`

---

### 5.7 Downloads

Base: `/downloads`

---

#### GET `/downloads` — Public
Returns only `ACTIVE` downloads.

**Query params:**

| Param | Description |
|---|---|
| `category` | `Form`, `Syllabus`, `Circular`, `Brochure`, `Document` |
| `department_id` | Filter by department |
| `q` | Search by title |
| `page` / `pageSize` / `limit` | Pagination |

**Response `200`:**
```json
{
  "success": true,
  "data": {
    "downloads": [
      {
        "id": 1,
        "title": "Admission Form 2025",
        "category": "Form",
        "department_id": null,
        "department_name": null,
        "file_id": 8,
        "file_url": "https://res.cloudinary.com/...",
        "original_name": "admission-form.pdf",
        "file_type": "application/pdf",
        "file_size": 102400,
        "uploaded_by": 1,
        "uploaded_by_name": "Central Admin",
        "download_count": 24,
        "status": "ACTIVE",
        "created_at": "...",
        "updated_at": "..."
      }
    ],
    "pagination": { ... }
  }
}
```

---

#### GET `/downloads/:id` — Public
Single ACTIVE download.

---

#### PATCH `/downloads/:id/increment-count` — Public (no auth)
Call this when a user downloads a file to increment the counter.

**Response `200`:** Updated download object with incremented `download_count`.

---

#### POST `/downloads` — CENTRAL_ADMIN or HOD

**Request body:**
```json
{
  "title": "CSE Syllabus 2025",
  "category": "Syllabus",
  "file_id": 8,
  "department_id": 1
}
```

> HOD's `department_id` is always forced to their own. HOD cannot create a download with `department_id = null`.  
> `file_id` is required.  
> Allowed categories: `Form`, `Syllabus`, `Circular`, `Brochure`, `Document`

**Response `201`:** Created download object.

---

#### PUT `/downloads/:id` — CENTRAL_ADMIN or HOD (own dept)
Partial update. Only CENTRAL_ADMIN can change `department_id`.  
`file_id` can be updated but cannot be set to null.

---

#### PATCH `/downloads/:id/status`
```json
{ "status": "INACTIVE" }
```

---

#### DELETE `/downloads/:id`
Soft delete → `status = INACTIVE`.

---

### 5.8 Events

Base: `/events`

---

#### GET `/events` — Public
Returns only `PUBLISHED` events, sorted `event_date DESC`.

**Query params:**

| Param | Description |
|---|---|
| `department_id` | Filter by department |
| `q` | Search title and description |
| `page` / `pageSize` / `limit` | Pagination |

**Response `200`:**
```json
{
  "success": true,
  "data": {
    "events": [
      {
        "id": 1,
        "title": "Annual Tech Fest 2025",
        "slug": "annual-tech-fest-2025",
        "description": "...",
        "event_date": "2025-03-15",
        "department_id": null,
        "department_name": null,
        "department_slug": null,
        "cover_image_file_id": 4,
        "cover_image_url": "https://res.cloudinary.com/...",
        "created_by": 1,
        "created_by_name": "Central Admin",
        "status": "PUBLISHED",
        "created_at": "...",
        "updated_at": "..."
      }
    ],
    "pagination": { ... }
  }
}
```

---

#### GET `/events/:slug` — Public
Returns single PUBLISHED event by slug.  
**Status codes:** `200` · `404` not found or not PUBLISHED

---

#### POST `/events` — CENTRAL_ADMIN or HOD

**Request body:**
```json
{
  "title": "Annual Tech Fest 2025",
  "description": "College-wide technology festival.",
  "event_date": "2025-03-15",
  "cover_image_file_id": 4,
  "department_id": null
}
```

> HOD's `department_id` is always forced to their own. HOD cannot create college-wide (`null`) events.  
> Event is created with `status = DRAFT`. Publish with PATCH status.  
> `cover_image_file_id` is optional.

**Response `201`:** Created event object with `slug`.

---

#### PUT `/events/:id` — CENTRAL_ADMIN or HOD (own dept)
Partial update. Only CENTRAL_ADMIN can change `department_id`.  
Slug is regenerated only if `title` changes.

---

#### PATCH `/events/:id/status`
```json
{ "status": "PUBLISHED" }
```
Valid: `DRAFT`, `PUBLISHED`, `ARCHIVED`.

---

#### DELETE `/events/:id`
Archive → `status = ARCHIVED`.

---

### 5.9 Gallery

Base: `/gallery`

---

#### GET `/gallery` — Public
Returns only `ACTIVE` gallery items.

**Query params:** `department_id`, `q`, `page`, `pageSize` / `limit`

**Response `200`:**
```json
{
  "success": true,
  "data": {
    "gallery": [
      {
        "id": 1,
        "title": "Annual Day 2024",
        "description": "...",
        "department_id": null,
        "department_name": null,
        "file_id": 5,
        "file_url": "https://res.cloudinary.com/...",
        "file_type": "image/jpeg",
        "file_size": 512000,
        "original_name": "annual-day.jpg",
        "uploaded_by": 1,
        "uploaded_by_name": "Central Admin",
        "status": "ACTIVE",
        "created_at": "..."
      }
    ],
    "pagination": { ... }
  }
}
```

> Note: `gallery` items have no `updated_at` column.

---

#### GET `/gallery/:id` — Public
Single ACTIVE gallery item.

---

#### POST `/gallery` — CENTRAL_ADMIN or HOD

**Request body:**
```json
{
  "title": "CSE Lab Photos",
  "description": "New equipment in CS lab.",
  "file_id": 5,
  "department_id": 1
}
```

> `file_id` is required and must reference an image file.

---

#### PUT `/gallery/:id` — CENTRAL_ADMIN or HOD (own dept)
Update `title`, `description`, `file_id`. Only CENTRAL_ADMIN can change `department_id`.

---

#### PATCH `/gallery/:id/status`
```json
{ "status": "INACTIVE" }
```

---

#### DELETE `/gallery/:id`
Soft delete → `status = INACTIVE`.

---

### 5.10 Pages

Base: `/pages`

---

#### GET `/pages/:slug` — Public
Returns single PUBLISHED page by slug.

**Response `200`:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "title": "About",
    "slug": "about",
    "content": "<h1>About SGSITS</h1><p>...</p>",
    "meta_title": "About — SGSITS",
    "meta_description": "Learn more about our college.",
    "updated_by": 1,
    "updated_by_name": "Central Admin",
    "status": "PUBLISHED",
    "created_at": "...",
    "updated_at": "..."
  }
}
```

**Seeded slugs (status=DRAFT until admin publishes):**

| Slug | Title |
|---|---|
| `about` | About |
| `administration` | Administration |
| `contact` | Contact |

---

#### GET `/pages` — CENTRAL_ADMIN only
Lists all pages (all statuses — for admin dashboard).

---

#### POST `/pages` — CENTRAL_ADMIN

**Request body:**
```json
{
  "title": "Facilities",
  "slug": "facilities",
  "content": "<p>World-class facilities at SGSITS.</p>",
  "meta_title": "Facilities — SGSITS",
  "meta_description": "Explore our facilities."
}
```

> If `slug` is omitted, it is auto-generated from `title`.  
> Page is created with `status = DRAFT`.

---

#### PUT `/pages/:id` — CENTRAL_ADMIN
Partial update. If `slug` is included it is updated (validated for uniqueness). If omitted, existing slug is kept.

---

#### PATCH `/pages/:id/status`
```json
{ "status": "PUBLISHED" }
```

Valid: `DRAFT` or `PUBLISHED` (no ARCHIVED in pages schema).

---

#### DELETE `/pages/:id`
Reverts to `DRAFT` (no ARCHIVED for pages). Does **not** hard delete.

---

### 5.11 Exam Documents

Base: `/exam`

---

#### Public GET routes (no auth)

| Endpoint | Returns |
|---|---|
| `GET /exam/documents` | All ACTIVE exam documents (supports `?document_type=` filter) |
| `GET /exam/notices` | document_type = NOTICE |
| `GET /exam/timetables` | document_type = TIMETABLE |
| `GET /exam/results` | document_type = RESULT |
| `GET /exam/academic-calendar` | document_type = ACADEMIC_CALENDAR |
| `GET /exam/documents/:id` | Single ACTIVE document |

**Query params (on all list routes):** `q`, `page`, `pageSize` / `limit`

**Response `200`:**
```json
{
  "success": true,
  "data": {
    "documents": [
      {
        "id": 1,
        "title": "Mid-Term Timetable Feb 2025",
        "document_type": "TIMETABLE",
        "description": null,
        "file_id": 9,
        "file_url": "https://res.cloudinary.com/...",
        "original_name": "timetable.pdf",
        "file_type": "application/pdf",
        "file_size": 204800,
        "uploaded_by": 2,
        "uploaded_by_name": "Exam Controller",
        "publish_date": "2025-02-01",
        "status": "ACTIVE",
        "created_at": "...",
        "updated_at": "..."
      }
    ],
    "pagination": { ... }
  }
}
```

---

#### POST `/exam/documents` — EXAM_CONTROLLER only

**Request body:**
```json
{
  "title": "Mid-Term Timetable Feb 2025",
  "document_type": "TIMETABLE",
  "description": "Schedule for all semesters.",
  "file_id": 9,
  "publish_date": "2025-02-01"
}
```

> `document_type` values: `NOTICE`, `TIMETABLE`, `RESULT`, `ACADEMIC_CALENDAR`  
> `file_id` is required.  
> Document is immediately `ACTIVE`.

**Status codes:** `201` · `400` invalid document_type · `400` file not found

---

#### PUT `/exam/documents/:id` — EXAM_CONTROLLER only
Partial update. `document_type` **cannot be changed** after creation.

---

#### PATCH `/exam/documents/:id/status` — EXAM_CONTROLLER only
```json
{ "status": "INACTIVE" }
```

---

#### DELETE `/exam/documents/:id` — EXAM_CONTROLLER only
Soft delete → `status = INACTIVE`.

---

### 5.12 Placement Records

Base: `/placement`

---

#### Public GET routes (no auth)

| Endpoint | Returns |
|---|---|
| `GET /placement/notices` | record_type = NOTICE |
| `GET /placement/company-visits` | record_type = COMPANY_VISIT |
| `GET /placement/records` | record_type = PLACEMENT_RECORD |
| `GET /placement/training-programs` | record_type = TRAINING_PROGRAM |
| `GET /placement/records/:id` | Single ACTIVE record |

**Query params (on all list routes):**

| Param | Description |
|---|---|
| `company_name` | Partial match filter (for company-visits) |
| `academic_year` | Exact match e.g. `2024-25` |
| `q` | Search title and description |
| `page` / `pageSize` / `limit` | Pagination |

**Response `200`:**
```json
{
  "success": true,
  "data": {
    "records": [
      {
        "id": 1,
        "title": "TCS Campus Visit",
        "record_type": "COMPANY_VISIT",
        "company_name": "Tata Consultancy Services",
        "academic_year": "2024-25",
        "description": "TCS hired 12 students.",
        "file_id": 10,
        "file_url": "https://res.cloudinary.com/...",
        "original_name": "tcs-report.pdf",
        "file_type": "application/pdf",
        "file_size": 153600,
        "uploaded_by": 3,
        "uploaded_by_name": "Placement Officer",
        "status": "ACTIVE",
        "created_at": "...",
        "updated_at": "..."
      }
    ],
    "pagination": { ... }
  }
}
```

---

#### POST `/placement/records` — PLACEMENT_OFFICER only

**Required fields per `record_type`:**

| `record_type` | Required extra fields |
|---|---|
| `NOTICE` | `description` |
| `COMPANY_VISIT` | `description`, `company_name`, `academic_year` |
| `PLACEMENT_RECORD` | `description`, `academic_year` |
| `TRAINING_PROGRAM` | `description` |

**Request body:**
```json
{
  "title": "TCS Campus Visit",
  "record_type": "COMPANY_VISIT",
  "company_name": "Tata Consultancy Services",
  "academic_year": "2024-25",
  "description": "Aptitude + interview rounds held.",
  "file_id": 10
}
```

> `file_id` is optional for all placement records.  
> Record is immediately `ACTIVE`.

---

#### PUT `/placement/records/:id` — PLACEMENT_OFFICER only
Partial update. `record_type` **cannot be changed** after creation.

---

#### PATCH `/placement/records/:id/status` — PLACEMENT_OFFICER only
```json
{ "status": "INACTIVE" }
```

---

#### DELETE `/placement/records/:id` — PLACEMENT_OFFICER only
Soft delete → `status = INACTIVE`.

---

### 5.13 Audit Logs

Base: `/audit-logs` — **CENTRAL_ADMIN only**

---

#### GET `/audit-logs`
Lists all audit log entries, latest first. 50 per page (max 200).

**Query params:**

| Param | Description |
|---|---|
| `user_id` | Filter by user id |
| `action` | `CREATE`, `UPDATE`, `DELETE`, `LOGIN` |
| `module_name` | `auth`, `users`, `departments`, `files`, `faculty`, `notices`, `downloads`, `events`, `gallery`, `pages`, `exam`, `placement` |
| `page` / `pageSize` / `limit` | Pagination |

**Response `200`:**
```json
{
  "success": true,
  "data": {
    "logs": [
      {
        "id": 42,
        "user_id": 1,
        "user_name": "Central Admin",
        "user_email": "admin@college.edu",
        "action": "CREATE",
        "module_name": "faculty",
        "record_id": 1,
        "description": "Created faculty profile for user id=5 in department id=1",
        "ip_address": "::1",
        "created_at": "2025-01-05T11:30:00.000Z"
      }
    ],
    "pagination": { ... }
  }
}
```

---

#### GET `/audit-logs/:id`
Single log entry.

---

#### GET `/audit-logs/user/:userId`
All logs for a specific user, plus user details in response.

**Response `200`:**
```json
{
  "success": true,
  "data": {
    "user": { "id": 2, "name": "HOD Test", "email": "hod@college.edu" },
    "logs": [ ... ],
    "pagination": { ... }
  }
}
```

---

## 6. File Upload Guide

### The two-step flow

Every module that accepts an image or document uses the same pattern:

```
1. POST /files/upload  (multipart/form-data: file + usage)
   → returns { id, file_url, ... }

2. POST /notices  (or /events, /faculty, /downloads, etc.)
   → body includes file_id: <id from step 1>
```

### Usage values by module

| Module | Field name | `usage` value |
|---|---|---|
| Faculty profile photo | `profile_image_file_id` | `faculty` |
| Department cover photo | `image_file_id` | `departments` |
| Event cover image | `cover_image_file_id` | `events` |
| Gallery image | `file_id` | `gallery` |
| Notice attachment | `file_id` | `notices` |
| Download file | `file_id` | `downloads` |
| Exam document | `file_id` | `exam` |
| Placement document | `file_id` | `placement` |

### Example — Axios multipart upload
```js
const formData = new FormData();
formData.append('file', selectedFile);     // File object from <input>
formData.append('usage', 'gallery');

const res = await axios.post('/api/v1/files/upload', formData, {
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'multipart/form-data',
  },
});

const fileId = res.data.data.id;           // use this as file_id
const fileUrl = res.data.data.file_url;    // direct Cloudinary URL
```

---

## 7. Database Tables Reference

| Table | Key columns | Notes |
|---|---|---|
| `roles` | `id`, `role_name` | Seeded: 1–5 |
| `users` | `id`, `role_id`, `department_id`, `name`, `email`, `status` | No `password_hash` in API responses |
| `departments` | `id`, `name`, `slug`, `hod_user_id`, `image_file_id`, `status` | HOD assigned via `/departments/:id/hod` |
| `files` | `id`, `file_url`, `file_type`, `file_size`, `storage_type` | Always `CLOUDINARY` in production |
| `faculty_profiles` | `id`, `user_id`, `department_id`, `designation`, `profile_image_file_id` | Unique per `user_id` |
| `notices` | `id`, `slug`, `notice_type`, `publish_date`, `status` | DRAFT/PUBLISHED/ARCHIVED |
| `downloads` | `id`, `category`, `file_id`, `download_count` | `file_id` required, not nullable |
| `events` | `id`, `slug`, `event_date`, `cover_image_file_id`, `status` | DRAFT/PUBLISHED/ARCHIVED |
| `gallery` | `id`, `file_id`, `status` | No `updated_at` column |
| `pages` | `id`, `slug`, `content`, `status` | Only DRAFT/PUBLISHED (no ARCHIVED) |
| `exam_documents` | `id`, `document_type`, `file_id`, `publish_date` | `file_id` required |
| `placement_records` | `id`, `record_type`, `company_name`, `academic_year` | `file_id` optional |
| `audit_logs` | `id`, `user_id`, `action`, `module_name`, `record_id` | Never written to via API |

---

## 8. Common Error Responses

| HTTP Status | When it happens |
|---|---|
| `400` | Validation failed — missing required field, wrong type, invalid value |
| `401` | No token / expired token / wrong credentials |
| `403` | Authenticated but wrong role, or ownership check failed (e.g. HOD accessing another dept) |
| `404` | Record not found, or found but not ACTIVE/PUBLISHED (public routes) |
| `409` | Conflict — duplicate email/slug, last admin deactivation, file still referenced |
| `500` | Unexpected server error |
| `502` | Cloudinary upload failed |

### Example error shapes

```json
// 400 — validation
{ "success": false, "message": "notice_type is required", "error": null }

// 401 — no token
{ "success": false, "message": "Authentication required", "error": "No token provided" }

// 403 — wrong role
{ "success": false, "message": "You do not have permission...", "error": "Role 'HOD' is not allowed" }

// 403 — ownership
{ "success": false, "message": "HOD can only create profiles for their own department", "error": null }

// 409 — file referenced
{ "success": false, "message": "File is still referenced by: faculty_profiles", "error": "..." }
```

---

## 9. Frontend Integration Notes

### Token handling
```js
// Store after login
localStorage.setItem('token', data.token);

// Read for requests
const token = localStorage.getItem('token');

// Clear on logout
localStorage.removeItem('token');
```

### Axios instance setup (recommended)
```js
import axios from 'axios';

const api = axios.create({ baseURL: 'http://localhost:5000/api/v1' });

api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  res => res,
  err => {
    if (err.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(err);
  }
);
```

### Using `department_id` from JWT
After login, decode the JWT or read `data.user.department_id` from the login response. For HOD dashboards, use this value to pre-scope department filters — the API enforces the same value server-side anyway.

### Slug vs ID
- **Departments:** Public page uses `GET /departments/:slug`
- **Events:** Public page uses `GET /events/:slug`
- **Pages:** Public page uses `GET /pages/:slug` (e.g. `/pages/about`)
- **Notices, faculty, gallery, downloads, exam, placement:** Use numeric `/:id`

### Draft/Publish workflow
All content modules (notices, events) are created as `DRAFT`. To make them visible publicly:
```
PATCH /notices/:id/status   → { "status": "PUBLISHED" }
PATCH /events/:id/status    → { "status": "PUBLISHED" }
PATCH /pages/:id/status     → { "status": "PUBLISHED" }
PATCH /exam/documents/:id/status  → { "status": "ACTIVE" }  (exam is created ACTIVE by default)
```

### HOD department scoping
When building HOD dashboards, use `req.user.department_id` (the value in the JWT) to pre-fill department_id in create forms. The server enforces this regardless, so mismatch just gets corrected silently.

### File URLs
`file_url` from Cloudinary is a direct public CDN URL. Use it in `<img src>` or `<a href>` directly — no backend proxy needed for reading.

---

## 10. Seeded Test Credentials

| Role | Email | Password |
|---|---|---|
| `CENTRAL_ADMIN` | `admin@college.edu` | `Admin@123` |

All other users are created via `POST /users`. The response includes `initial_password` shown **once only**.

---

## 11. Hard Rules

These are enforced server-side. Frontend can mirror them for UX, but the backend will reject violations regardless.

1. **HOD can only manage their own department.** `department_id` in the JWT is authoritative. An HOD cannot create, update, or delete content belonging to another department.

2. **HOD department_id is always forced on write.** Even if an HOD sends a different `department_id` in the request body, the server overwrites it with their own `department_id`.

3. **TEACHER can only update their own faculty profile.** `PUT /faculty/me` or `PUT /faculty/:id` — ownership verified via `profile.user_id === req.user.id`.

4. **TEACHER cannot change `department_id` or `user_id` on their profile.** These fields are rejected with `403`.

5. **Public GET APIs return only ACTIVE or PUBLISHED records.** DRAFT, INACTIVE, and ARCHIVED records are invisible to unauthenticated requests — they return 404 even if the id/slug is correct.

6. **Notices also require `publish_date <= today`** to appear in public lists. A PUBLISHED notice with a future date is scheduled, not yet visible.

7. **DELETE is always soft.** Every module sets a status field (`INACTIVE` or `ARCHIVED`) — no record is hard-deleted except via `DELETE /files/:id`, which additionally runs a reference check and removes the Cloudinary asset.

8. **`password_hash` is never returned** in any API response. It is read only internally during login and change-password.

9. **`notice_type` and `document_type` are immutable after creation.** Attempts to change them via PUT return `400`.

10. **File deletion is blocked if any module references the file.** The error message names the referencing tables.
