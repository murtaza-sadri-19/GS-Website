# API Testing Checklist — Thunder Client
**Base URL:** `http://localhost:5000/api/v1`

## Token Variables
Store these after each login for reuse:
| Variable | Description |
|---|---|
| `{{admin_token}}` | CENTRAL_ADMIN JWT |
| `{{exam_token}}` | EXAM_CONTROLLER JWT |
| `{{placement_token}}` | PLACEMENT_OFFICER JWT |
| `{{hod_token}}` | HOD JWT |
| `{{teacher_token}}` | TEACHER JWT |

---

## Phase 1 — Auth (Login as CENTRAL_ADMIN)

### 1.1 Login — CENTRAL_ADMIN
```
POST /auth/login
Body: { "email": "admin@college.edu", "password": "Admin@123" }
Expected: 200
Response shape: { success: true, data: { token: "...", user: { id, name, email, role, department_id } } }
Action: copy token → {{admin_token}}
```

### 1.2 Get Current User
```
GET /auth/me
Header: Authorization: Bearer {{admin_token}}
Expected: 200
Response shape: { success: true, data: { id, name, email, role, phone, status, department_id, created_at } }
```

### 1.3 Change Password (then change back)
```
POST /auth/change-password
Header: Authorization: Bearer {{admin_token}}
Body: { "oldPassword": "Admin@123", "newPassword": "Admin@456" }
Expected: 200

POST /auth/change-password
Header: Authorization: Bearer {{admin_token}}
Body: { "oldPassword": "Admin@456", "newPassword": "Admin@123" }
Expected: 200
```

### 1.4 Logout
```
POST /auth/logout
Header: Authorization: Bearer {{admin_token}}
Expected: 200
Note: token is not blacklisted — this is frontend-only logout confirmation
```

### 1.5 Login — Wrong Password
```
POST /auth/login
Body: { "email": "admin@college.edu", "password": "wrongpassword" }
Expected: 401
```

### 1.6 Login — No Token on Protected Route
```
GET /auth/me
(no Authorization header)
Expected: 401
```

---

## Phase 2 — Create Test Users (CENTRAL_ADMIN)

### 2.1 Create EXAM_CONTROLLER
```
POST /users
Header: Authorization: Bearer {{admin_token}}
Body:
{
  "name": "Exam Controller",
  "email": "exam@college.edu",
  "role_id": 2
}
Expected: 201
Response shape: { success: true, data: { user: { id, name, email, role, ... }, initial_password: "..." } }
Action: copy initial_password, note user id → {{exam_user_id}}
```

### 2.2 Create PLACEMENT_OFFICER
```
POST /users
Header: Authorization: Bearer {{admin_token}}
Body:
{
  "name": "Placement Officer",
  "email": "placement@college.edu",
  "role_id": 3
}
Expected: 201
Action: copy initial_password, note user id → {{placement_user_id}}
```

### 2.3 Create HOD (no department yet — will assign after department is created)
```
POST /users
Header: Authorization: Bearer {{admin_token}}
Body:
{
  "name": "HOD Test",
  "email": "hod@college.edu",
  "role_id": 4
}
Expected: 201
Action: copy initial_password, note user id → {{hod_user_id}}
```

### 2.4 Create TEACHER
```
POST /users
Header: Authorization: Bearer {{admin_token}}
Body:
{
  "name": "Teacher Test",
  "email": "teacher@college.edu",
  "role_id": 5,
  "department_id": null
}
Expected: 201
Action: copy initial_password, note user id → {{teacher_user_id}}
```

### 2.5 Login as EXAM_CONTROLLER
```
POST /auth/login
Body: { "email": "exam@college.edu", "password": "{{initial_password from 2.1}}" }
Expected: 200
Action: copy token → {{exam_token}}
```

### 2.6 Login as PLACEMENT_OFFICER
```
POST /auth/login
Body: { "email": "placement@college.edu", "password": "{{initial_password from 2.2}}" }
Expected: 200
Action: copy token → {{placement_token}}
```

### 2.7 Login as HOD
```
POST /auth/login
Body: { "email": "hod@college.edu", "password": "{{initial_password from 2.3}}" }
Expected: 200
Action: copy token → {{hod_token}}
```

### 2.8 Login as TEACHER
```
POST /auth/login
Body: { "email": "teacher@college.edu", "password": "{{initial_password from 2.4}}" }
Expected: 200
Action: copy token → {{teacher_token}}
```

### 2.9 List All Users
```
GET /users
Header: Authorization: Bearer {{admin_token}}
Expected: 200
Response shape: { success: true, data: { users: [...], pagination: { total, page, pageSize, totalPages } } }
```

### 2.10 List Users — Filter by Role
```
GET /users?role=TEACHER
Header: Authorization: Bearer {{admin_token}}
Expected: 200
```

### 2.11 Get Single User
```
GET /users/{{hod_user_id}}
Header: Authorization: Bearer {{admin_token}}
Expected: 200
```

### 2.12 Update User Phone
```
PUT /users/{{teacher_user_id}}
Header: Authorization: Bearer {{admin_token}}
Body: { "phone": "9876543210" }
Expected: 200
```

### 2.13 Deactivate User
```
PATCH /users/{{teacher_user_id}}/status
Header: Authorization: Bearer {{admin_token}}
Body: { "status": "INACTIVE" }
Expected: 200
```

### 2.14 Reactivate User
```
PATCH /users/{{teacher_user_id}}/status
Header: Authorization: Bearer {{admin_token}}
Body: { "status": "ACTIVE" }
Expected: 200
```

### 2.15 Delete (Soft) User
```
DELETE /users/{{teacher_user_id}}
Header: Authorization: Bearer {{admin_token}}
Expected: 200
Note: sets status = INACTIVE
```

### 2.16 Reactivate Teacher (for later tests)
```
PATCH /users/{{teacher_user_id}}/status
Header: Authorization: Bearer {{admin_token}}
Body: { "status": "ACTIVE" }
Expected: 200
```

---

## Phase 3 — Departments

### 3.1 List Departments (Public)
```
GET /departments
Expected: 200
Response shape: { success: true, data: [...] }
Note: returns only ACTIVE departments
```

### 3.2 Create Department
```
POST /departments
Header: Authorization: Bearer {{admin_token}}
Body:
{
  "name": "Computer Science Engineering",
  "short_name": "CSE",
  "description": "Department of Computer Science"
}
Expected: 201
Response shape: { success: true, data: { id, name, slug, short_name, description, status, ... } }
Action: note id → {{dept_id}}, note slug → {{dept_slug}}
```

### 3.3 Get Department by Slug (Public)
```
GET /departments/{{dept_slug}}
Expected: 200
```

### 3.4 Assign HOD
```
PATCH /departments/{{dept_id}}/hod
Header: Authorization: Bearer {{admin_token}}
Body: { "user_id": {{hod_user_id}} }
Expected: 200
Note: sets departments.hod_user_id and users.department_id for the HOD
```

### 3.5 Re-login HOD (to get updated token with department_id)
```
POST /auth/login
Body: { "email": "hod@college.edu", "password": "{{hod password}}" }
Expected: 200
Action: copy token → {{hod_token}}  (now includes department_id in payload)
```

### 3.6 Update Department as HOD
```
PUT /departments/{{dept_id}}
Header: Authorization: Bearer {{hod_token}}
Body: { "description": "Updated by HOD", "vision": "Excellence in CS education" }
Expected: 200
Note: HOD can only update description/vision/mission/image_file_id
```

### 3.7 HOD Cannot Change Department Name
```
PUT /departments/{{dept_id}}
Header: Authorization: Bearer {{hod_token}}
Body: { "name": "New Name" }
Expected: 403
```

### 3.8 Deactivate Department
```
PATCH /departments/{{dept_id}}/status
Header: Authorization: Bearer {{admin_token}}
Body: { "status": "INACTIVE" }
Expected: 200
```

### 3.9 Reactivate Department
```
PATCH /departments/{{dept_id}}/status
Header: Authorization: Bearer {{admin_token}}
Body: { "status": "ACTIVE" }
Expected: 200
```

---

## Phase 4 — Files

### 4.1 Upload Image File (as CENTRAL_ADMIN)
```
POST /files/upload
Header: Authorization: Bearer {{admin_token}}
Body: multipart/form-data
  file: [select a .jpg or .png image ≤ 2 MB]
  usage: gallery
Expected: 201
Response shape: { success: true, data: { id, original_name, file_url, file_type, file_size, storage_type, ... } }
Action: note id → {{image_file_id}}
```

### 4.2 Upload PDF File
```
POST /files/upload
Header: Authorization: Bearer {{admin_token}}
Body: multipart/form-data
  file: [select a .pdf ≤ 10 MB]
  usage: notices
Expected: 201
Action: note id → {{pdf_file_id}}
```

### 4.3 Upload ZIP File (downloads usage)
```
POST /files/upload
Header: Authorization: Bearer {{admin_token}}
Body: multipart/form-data
  file: [select a .pdf or .docx ≤ 25 MB]
  usage: downloads
Expected: 201
Action: note id → {{download_file_id}}
```

### 4.4 Upload Faculty Image
```
POST /files/upload
Header: Authorization: Bearer {{admin_token}}
Body: multipart/form-data
  file: [select a .jpg or .png image ≤ 2 MB]
  usage: faculty
Expected: 201
Action: note id → {{faculty_image_file_id}}
```

### 4.5 Upload Exam PDF
```
POST /files/upload
Header: Authorization: Bearer {{exam_token}}
Body: multipart/form-data
  file: [select a .pdf]
  usage: exam
Expected: 201
Action: note id → {{exam_file_id}}
```

### 4.6 Upload Placement PDF
```
POST /files/upload
Header: Authorization: Bearer {{placement_token}}
Body: multipart/form-data
  file: [select a .pdf]
  usage: placement
Expected: 201
Action: note id → {{placement_file_id}}
```

### 4.7 Upload Events Cover Image
```
POST /files/upload
Header: Authorization: Bearer {{admin_token}}
Body: multipart/form-data
  file: [select a .jpg or .png image ≤ 2 MB]
  usage: events
Expected: 201
Action: note id → {{events_file_id}}
```

### 4.8 List All Files (admin only)
```
GET /files
Header: Authorization: Bearer {{admin_token}}
Expected: 200
Response shape: { success: true, data: { files: [...], pagination: { total, page, pageSize, totalPages } } }
```

### 4.9 Get Single File
```
GET /files/{{image_file_id}}
Header: Authorization: Bearer {{admin_token}}
Expected: 200
```

### 4.10 Get File as Different User (should 403)
```
GET /files/{{image_file_id}}
Header: Authorization: Bearer {{exam_token}}
Expected: 403
Note: file was uploaded by admin, exam_controller is not the owner
```

### 4.11 Upload Wrong Type for Usage
```
POST /files/upload
Header: Authorization: Bearer {{admin_token}}
Body: multipart/form-data
  file: [select a .jpg image]
  usage: exam
Expected: 400
Note: exam usage only allows application/pdf
```

---

## Phase 5 — Faculty

### 5.1 Update Teacher's department_id first
```
PUT /users/{{teacher_user_id}}
Header: Authorization: Bearer {{admin_token}}
Body: { "department_id": {{dept_id}} }
Expected: 200
```

### 5.2 Create Faculty Profile (as CENTRAL_ADMIN)
```
POST /faculty
Header: Authorization: Bearer {{admin_token}}
Body:
{
  "user_id": {{teacher_user_id}},
  "department_id": {{dept_id}},
  "designation": "Assistant Professor",
  "qualification": "M.Tech Computer Science",
  "specialization": "Machine Learning",
  "experience": "5 years",
  "bio": "Passionate educator.",
  "subjects": "Data Structures, Algorithms",
  "profile_image_file_id": {{faculty_image_file_id}}
}
Expected: 201
Response shape: { success: true, data: { id, user_id, department_id, designation, teacher_name, teacher_email, ... } }
Action: note id → {{faculty_profile_id}}
```

### 5.3 List Faculty (Public)
```
GET /faculty
Expected: 200
Response shape: { success: true, data: { faculty: [...], pagination: {...} } }
Note: only ACTIVE profiles
```

### 5.4 Filter Faculty by Department (Public)
```
GET /faculty?department_id={{dept_id}}
Expected: 200
```

### 5.5 Get Faculty Profile (Public)
```
GET /faculty/{{faculty_profile_id}}
Expected: 200
```

### 5.6 Get Own Profile as TEACHER
```
GET /faculty/me
Header: Authorization: Bearer {{teacher_token}}
Expected: 200
```

### 5.7 Update Own Profile as TEACHER
```
PUT /faculty/me
Header: Authorization: Bearer {{teacher_token}}
Body: { "bio": "Updated bio by teacher.", "subjects": "DSA, OS, Networks" }
Expected: 200
```

### 5.8 TEACHER Cannot Change department_id
```
PUT /faculty/me
Header: Authorization: Bearer {{teacher_token}}
Body: { "department_id": 999 }
Expected: 403
```

### 5.9 Update Faculty Profile as HOD
```
PUT /faculty/{{faculty_profile_id}}
Header: Authorization: Bearer {{hod_token}}
Body: { "designation": "Senior Assistant Professor" }
Expected: 200
```

### 5.10 Deactivate Faculty Profile
```
PATCH /faculty/{{faculty_profile_id}}/status
Header: Authorization: Bearer {{admin_token}}
Body: { "status": "INACTIVE" }
Expected: 200
Note: profile no longer visible in public GET
```

### 5.11 Reactivate Faculty Profile
```
PATCH /faculty/{{faculty_profile_id}}/status
Header: Authorization: Bearer {{admin_token}}
Body: { "status": "ACTIVE" }
Expected: 200
```

### 5.12 Duplicate Profile (should 409)
```
POST /faculty
Header: Authorization: Bearer {{admin_token}}
Body:
{
  "user_id": {{teacher_user_id}},
  "department_id": {{dept_id}},
  "designation": "Professor"
}
Expected: 409
```

---

## Phase 6 — Notices

### 6.1 Create GENERAL Notice (CENTRAL_ADMIN)
```
POST /notices
Header: Authorization: Bearer {{admin_token}}
Body:
{
  "title": "Annual Day Announcement",
  "notice_type": "GENERAL",
  "description": "Annual day will be held on 15th March.",
  "publish_date": "2025-01-01"
}
Expected: 201
Response shape: { success: true, data: { id, title, slug, notice_type, status: "DRAFT", ... } }
Action: note id → {{general_notice_id}}
```

### 6.2 Create DEPARTMENT Notice (HOD)
```
POST /notices
Header: Authorization: Bearer {{hod_token}}
Body:
{
  "title": "CSE Department Meeting",
  "notice_type": "DEPARTMENT",
  "description": "Mandatory meeting for all CSE faculty.",
  "publish_date": "2025-01-01"
}
Expected: 201
Note: department_id is forced to HOD's department — any value in body is ignored
Action: note id → {{dept_notice_id}}
```

### 6.3 HOD Cannot Create GENERAL Notice
```
POST /notices
Header: Authorization: Bearer {{hod_token}}
Body:
{
  "title": "Test",
  "notice_type": "GENERAL",
  "publish_date": "2025-01-01"
}
Expected: 403
```

### 6.4 Create EXAM Notice (EXAM_CONTROLLER)
```
POST /notices
Header: Authorization: Bearer {{exam_token}}
Body:
{
  "title": "Mid-Term Exam Schedule",
  "notice_type": "EXAM",
  "description": "Mid-term exams begin 20th Feb.",
  "publish_date": "2025-01-01"
}
Expected: 201
Action: note id → {{exam_notice_id}}
```

### 6.5 Create PLACEMENT Notice (PLACEMENT_OFFICER)
```
POST /notices
Header: Authorization: Bearer {{placement_token}}
Body:
{
  "title": "Campus Recruitment Drive",
  "notice_type": "PLACEMENT",
  "description": "TCS and Infosys visiting campus.",
  "publish_date": "2025-01-01"
}
Expected: 201
Action: note id → {{placement_notice_id}}
```

### 6.6 Publish Notice
```
PATCH /notices/{{general_notice_id}}/status
Header: Authorization: Bearer {{admin_token}}
Body: { "status": "PUBLISHED" }
Expected: 200
```

### 6.7 List Notices (Public — only PUBLISHED)
```
GET /notices
Expected: 200
Response shape: { success: true, data: { notices: [...], pagination: {...} } }
Note: DRAFT notices not returned
```

### 6.8 Filter Notices by Type (Public)
```
GET /notices?notice_type=GENERAL
Expected: 200
```

### 6.9 Search Notices (Public)
```
GET /notices?q=Annual
Expected: 200
```

### 6.10 Get Single Notice (Public)
```
GET /notices/{{general_notice_id}}
Expected: 200
Note: 404 if not PUBLISHED or future-dated
```

### 6.11 Update Notice
```
PUT /notices/{{general_notice_id}}
Header: Authorization: Bearer {{admin_token}}
Body: { "description": "Updated description." }
Expected: 200
```

### 6.12 Cannot Change notice_type
```
PUT /notices/{{general_notice_id}}
Header: Authorization: Bearer {{admin_token}}
Body: { "notice_type": "EXAM" }
Expected: 400
```

### 6.13 HOD Cannot Update GENERAL Notice
```
PUT /notices/{{general_notice_id}}
Header: Authorization: Bearer {{hod_token}}
Body: { "description": "HOD trying to update general notice." }
Expected: 403
```

### 6.14 Archive Notice (DELETE)
```
DELETE /notices/{{exam_notice_id}}
Header: Authorization: Bearer {{exam_token}}
Expected: 200
Note: sets status = ARCHIVED, not hard delete
```

---

## Phase 7 — Downloads

### 7.1 Create Download (CENTRAL_ADMIN — global)
```
POST /downloads
Header: Authorization: Bearer {{admin_token}}
Body:
{
  "title": "Admission Form 2025",
  "category": "Form",
  "file_id": {{download_file_id}}
}
Expected: 201
Response shape: { success: true, data: { id, title, category, file_url, download_count: 0, ... } }
Action: note id → {{global_download_id}}
```

### 7.2 Create Download (HOD — own department)
```
POST /downloads
Header: Authorization: Bearer {{hod_token}}
Body:
{
  "title": "CSE Syllabus 2025",
  "category": "Syllabus",
  "file_id": {{download_file_id}}
}
Expected: 201
Note: department_id forced to HOD's department
Action: note id → {{dept_download_id}}
```

### 7.3 List Downloads (Public)
```
GET /downloads
Expected: 200
Response shape: { success: true, data: { downloads: [...], pagination: {...} } }
```

### 7.4 Filter by Category (Public)
```
GET /downloads?category=Form
Expected: 200
```

### 7.5 Filter by Department (Public)
```
GET /downloads?department_id={{dept_id}}
Expected: 200
```

### 7.6 Get Single Download (Public)
```
GET /downloads/{{global_download_id}}
Expected: 200
Response includes: file_url, original_name, file_type, file_size, download_count
```

### 7.7 Increment Download Count (Public)
```
PATCH /downloads/{{global_download_id}}/increment-count
(no auth required)
Expected: 200
Response: download_count should be 1
```

### 7.8 Increment Again
```
PATCH /downloads/{{global_download_id}}/increment-count
Expected: 200
Response: download_count should be 2
```

### 7.9 Update Download
```
PUT /downloads/{{global_download_id}}
Header: Authorization: Bearer {{admin_token}}
Body: { "title": "Admission Form 2025 (Updated)" }
Expected: 200
```

### 7.10 HOD Cannot Update Global Download
```
PUT /downloads/{{global_download_id}}
Header: Authorization: Bearer {{hod_token}}
Body: { "title": "Trying to update global" }
Expected: 403
Note: global_download has department_id = NULL, HOD cannot manage it
```

### 7.11 Deactivate Download
```
PATCH /downloads/{{dept_download_id}}/status
Header: Authorization: Bearer {{hod_token}}
Body: { "status": "INACTIVE" }
Expected: 200
```

### 7.12 Reactivate Download
```
PATCH /downloads/{{dept_download_id}}/status
Header: Authorization: Bearer {{hod_token}}
Body: { "status": "ACTIVE" }
Expected: 200
```

### 7.13 Delete Download (Soft)
```
DELETE /downloads/{{dept_download_id}}
Header: Authorization: Bearer {{hod_token}}
Expected: 200
Note: sets status = INACTIVE
```

---

## Phase 8 — Events

### 8.1 Create College-Wide Event (CENTRAL_ADMIN)
```
POST /events
Header: Authorization: Bearer {{admin_token}}
Body:
{
  "title": "Annual Tech Fest 2025",
  "description": "College-wide technology festival.",
  "event_date": "2025-03-15",
  "cover_image_file_id": {{events_file_id}}
}
Expected: 201
Response shape: { success: true, data: { id, title, slug, event_date, status: "DRAFT", cover_image_url, ... } }
Action: note slug → {{event_slug}}, note id → {{event_id}}
```

### 8.2 Create Department Event (HOD)
```
POST /events
Header: Authorization: Bearer {{hod_token}}
Body:
{
  "title": "CSE Workshop on AI",
  "description": "Workshop for CSE students.",
  "event_date": "2025-02-20"
}
Expected: 201
Note: department_id forced to HOD's department
Action: note id → {{dept_event_id}}
```

### 8.3 HOD Cannot Create College-Wide Event
```
POST /events
Header: Authorization: Bearer {{hod_token}}
Body:
{
  "title": "College Fest",
  "event_date": "2025-04-01"
}
Expected: 201 but department_id will be HOD's dept (cannot send null dept)
Note: HOD department_id is always forced — HOD physically cannot create a null-dept event
```

### 8.4 Publish Event
```
PATCH /events/{{event_id}}/status
Header: Authorization: Bearer {{admin_token}}
Body: { "status": "PUBLISHED" }
Expected: 200
```

### 8.5 List Events (Public — only PUBLISHED)
```
GET /events
Expected: 200
Response shape: { success: true, data: { events: [...], pagination: {...} } }
```

### 8.6 Filter Events by Department (Public)
```
GET /events?department_id={{dept_id}}
Expected: 200
```

### 8.7 Get Event by Slug (Public)
```
GET /events/{{event_slug}}
Expected: 200
Note: 404 if not PUBLISHED
```

### 8.8 Update Event
```
PUT /events/{{event_id}}
Header: Authorization: Bearer {{admin_token}}
Body: { "description": "Updated description for Annual Tech Fest." }
Expected: 200
```

### 8.9 Archive Event (DELETE)
```
DELETE /events/{{dept_event_id}}
Header: Authorization: Bearer {{hod_token}}
Expected: 200
Note: sets status = ARCHIVED
```

---

## Phase 9 — Gallery

### 9.1 Create Gallery Item (CENTRAL_ADMIN)
```
POST /gallery
Header: Authorization: Bearer {{admin_token}}
Body:
{
  "title": "Annual Day 2024",
  "description": "Highlights from annual day.",
  "file_id": {{image_file_id}}
}
Expected: 201
Response shape: { success: true, data: { id, title, file_url, file_type, file_size, ... } }
Action: note id → {{gallery_id}}
```

### 9.2 Create Gallery Item (HOD — own dept)
```
POST /gallery
Header: Authorization: Bearer {{hod_token}}
Body:
{
  "title": "CSE Lab Photos",
  "file_id": {{image_file_id}}
}
Expected: 201
Action: note id → {{dept_gallery_id}}
```

### 9.3 List Gallery (Public)
```
GET /gallery
Expected: 200
Response shape: { success: true, data: { gallery: [...], pagination: {...} } }
```

### 9.4 Filter Gallery by Department (Public)
```
GET /gallery?department_id={{dept_id}}
Expected: 200
```

### 9.5 Search Gallery (Public)
```
GET /gallery?q=Annual
Expected: 200
```

### 9.6 Get Single Gallery Item (Public)
```
GET /gallery/{{gallery_id}}
Expected: 200
```

### 9.7 Update Gallery Item
```
PUT /gallery/{{gallery_id}}
Header: Authorization: Bearer {{admin_token}}
Body: { "title": "Annual Day 2024 — Updated", "description": "Best moments." }
Expected: 200
```

### 9.8 Deactivate Gallery Item
```
PATCH /gallery/{{gallery_id}}/status
Header: Authorization: Bearer {{admin_token}}
Body: { "status": "INACTIVE" }
Expected: 200
```

### 9.9 Delete Gallery Item (Soft)
```
DELETE /gallery/{{dept_gallery_id}}
Header: Authorization: Bearer {{hod_token}}
Expected: 200
```

---

## Phase 10 — Pages

### 10.1 List Pages (Admin — all statuses)
```
GET /pages
Header: Authorization: Bearer {{admin_token}}
Expected: 200
Response shape: { success: true, data: [{ id, title, slug, status: "DRAFT", ... }] }
Note: seeded pages (about, administration, contact) should appear
```

### 10.2 Get About Page (Public — should 404 because status is DRAFT)
```
GET /pages/about
(no auth)
Expected: 404
Note: page is DRAFT — public cannot see it
```

### 10.3 Update Page Content
```
PUT /pages/1
Header: Authorization: Bearer {{admin_token}}
Body:
{
  "content": "<h1>About SGSITS</h1><p>Premier engineering college.</p>",
  "meta_title": "About — SGSITS",
  "meta_description": "Learn more about SGSITS college."
}
Expected: 200
Note: replace 1 with the actual id of the about page from Phase 10.1
```

### 10.4 Publish Page
```
PATCH /pages/1/status
Header: Authorization: Bearer {{admin_token}}
Body: { "status": "PUBLISHED" }
Expected: 200
```

### 10.5 Get About Page (Public — now PUBLISHED)
```
GET /pages/about
(no auth)
Expected: 200
Response shape: { success: true, data: { id, title, slug, content, meta_title, meta_description, ... } }
```

### 10.6 Create Custom Page
```
POST /pages
Header: Authorization: Bearer {{admin_token}}
Body:
{
  "title": "Facilities",
  "slug": "facilities",
  "content": "<p>World-class facilities at SGSITS.</p>"
}
Expected: 201
Action: note id → {{facilities_page_id}}
```

### 10.7 Create Page Without Slug (auto-generate)
```
POST /pages
Header: Authorization: Bearer {{admin_token}}
Body:
{
  "title": "Student Life at College"
}
Expected: 201
Note: slug auto-generated as "student-life-at-college"
```

### 10.8 Delete Page (Reverts to DRAFT)
```
DELETE /pages/{{facilities_page_id}}
Header: Authorization: Bearer {{admin_token}}
Expected: 200
Note: sets status = DRAFT (no ARCHIVED in pages schema)
```

### 10.9 Non-Admin Cannot Access Page List
```
GET /pages
Header: Authorization: Bearer {{hod_token}}
Expected: 403
```

---

## Phase 11 — Exam Documents

### 11.1 Create Exam Document — NOTICE
```
POST /exam/documents
Header: Authorization: Bearer {{exam_token}}
Body:
{
  "title": "Mid-Term Exam Notification",
  "document_type": "NOTICE",
  "description": "Mid-term exams will be held from 20th Feb.",
  "file_id": {{exam_file_id}},
  "publish_date": "2025-02-01"
}
Expected: 201
Response shape: { success: true, data: { id, title, document_type, file_url, status: "ACTIVE", ... } }
Action: note id → {{exam_notice_doc_id}}
```

### 11.2 Create Exam Document — TIMETABLE
```
POST /exam/documents
Header: Authorization: Bearer {{exam_token}}
Body:
{
  "title": "Mid-Term Timetable Feb 2025",
  "document_type": "TIMETABLE",
  "file_id": {{exam_file_id}}
}
Expected: 201
Action: note id → {{timetable_id}}
```

### 11.3 Create Exam Document — RESULT
```
POST /exam/documents
Header: Authorization: Bearer {{exam_token}}
Body:
{
  "title": "Semester 3 Results",
  "document_type": "RESULT",
  "file_id": {{exam_file_id}}
}
Expected: 201
Action: note id → {{result_id}}
```

### 11.4 Create Exam Document — ACADEMIC_CALENDAR
```
POST /exam/documents
Header: Authorization: Bearer {{exam_token}}
Body:
{
  "title": "Academic Calendar 2025-26",
  "document_type": "ACADEMIC_CALENDAR",
  "file_id": {{exam_file_id}}
}
Expected: 201
```

### 11.5 List All Exam Documents (Public)
```
GET /exam/documents
Expected: 200
Response shape: { success: true, data: { documents: [...], pagination: {...} } }
```

### 11.6 List by Type — Notices (Public)
```
GET /exam/notices
Expected: 200
Note: only NOTICE type documents returned
```

### 11.7 List by Type — Timetables (Public)
```
GET /exam/timetables
Expected: 200
```

### 11.8 List by Type — Results (Public)
```
GET /exam/results
Expected: 200
```

### 11.9 List by Type — Academic Calendar (Public)
```
GET /exam/academic-calendar
Expected: 200
```

### 11.10 Get Single Document (Public)
```
GET /exam/documents/{{timetable_id}}
Expected: 200
```

### 11.11 Update Document
```
PUT /exam/documents/{{timetable_id}}
Header: Authorization: Bearer {{exam_token}}
Body: { "title": "Mid-Term Timetable Feb 2025 (Revised)" }
Expected: 200
```

### 11.12 Cannot Change document_type
```
PUT /exam/documents/{{timetable_id}}
Header: Authorization: Bearer {{exam_token}}
Body: { "document_type": "RESULT" }
Expected: 400
```

### 11.13 Deactivate Document
```
PATCH /exam/documents/{{result_id}}/status
Header: Authorization: Bearer {{exam_token}}
Body: { "status": "INACTIVE" }
Expected: 200
```

### 11.14 Delete Document (Soft)
```
DELETE /exam/documents/{{exam_notice_doc_id}}
Header: Authorization: Bearer {{exam_token}}
Expected: 200
Note: sets status = INACTIVE
```

### 11.15 Non-EXAM_CONTROLLER Cannot Create
```
POST /exam/documents
Header: Authorization: Bearer {{admin_token}}
Body: { "title": "Test", "document_type": "NOTICE", "file_id": {{exam_file_id}} }
Expected: 403
```

---

## Phase 12 — Placement

### 12.1 Create Placement Record — NOTICE
```
POST /placement/records
Header: Authorization: Bearer {{placement_token}}
Body:
{
  "title": "Campus Recruitment 2025",
  "record_type": "NOTICE",
  "description": "Major companies visiting campus this semester."
}
Expected: 201
Response shape: { success: true, data: { id, title, record_type, status: "ACTIVE", ... } }
Action: note id → {{placement_notice_id}}
```

### 12.2 Create COMPANY_VISIT (requires company_name + academic_year)
```
POST /placement/records
Header: Authorization: Bearer {{placement_token}}
Body:
{
  "title": "TCS Campus Visit",
  "record_type": "COMPANY_VISIT",
  "company_name": "Tata Consultancy Services",
  "academic_year": "2024-25",
  "description": "TCS conducted aptitude test and interviews.",
  "file_id": {{placement_file_id}}
}
Expected: 201
Action: note id → {{company_visit_id}}
```

### 12.3 COMPANY_VISIT Without company_name (should 400)
```
POST /placement/records
Header: Authorization: Bearer {{placement_token}}
Body:
{
  "title": "Mystery Visit",
  "record_type": "COMPANY_VISIT",
  "academic_year": "2024-25",
  "description": "Missing company name."
}
Expected: 400
```

### 12.4 Create PLACEMENT_RECORD (requires academic_year)
```
POST /placement/records
Header: Authorization: Bearer {{placement_token}}
Body:
{
  "title": "Placement Statistics 2024-25",
  "record_type": "PLACEMENT_RECORD",
  "academic_year": "2024-25",
  "description": "180 students placed with avg package 6.5 LPA.",
  "file_id": {{placement_file_id}}
}
Expected: 201
Action: note id → {{placement_record_id}}
```

### 12.5 Create TRAINING_PROGRAM
```
POST /placement/records
Header: Authorization: Bearer {{placement_token}}
Body:
{
  "title": "Pre-Placement Training — Aptitude",
  "record_type": "TRAINING_PROGRAM",
  "description": "30-day aptitude and reasoning training."
}
Expected: 201
```

### 12.6 List Placement Notices (Public)
```
GET /placement/notices
Expected: 200
Response shape: { success: true, data: { records: [...], pagination: {...} } }
```

### 12.7 List Company Visits (Public)
```
GET /placement/company-visits
Expected: 200
```

### 12.8 List Placement Records (Public)
```
GET /placement/records
Expected: 200
```

### 12.9 List Training Programs (Public)
```
GET /placement/training-programs
Expected: 200
```

### 12.10 Filter by Academic Year (Public)
```
GET /placement/company-visits?academic_year=2024-25
Expected: 200
```

### 12.11 Filter by Company Name (Public)
```
GET /placement/company-visits?company_name=TCS
Expected: 200
Note: partial match
```

### 12.12 Get Single Record (Public)
```
GET /placement/records/{{company_visit_id}}
Expected: 200
```

### 12.13 Update Record
```
PUT /placement/records/{{company_visit_id}}
Header: Authorization: Bearer {{placement_token}}
Body: { "description": "TCS hired 12 students from our campus." }
Expected: 200
```

### 12.14 Deactivate Record
```
PATCH /placement/records/{{placement_notice_id}}/status
Header: Authorization: Bearer {{placement_token}}
Body: { "status": "INACTIVE" }
Expected: 200
```

### 12.15 Delete Record (Soft)
```
DELETE /placement/records/{{placement_record_id}}
Header: Authorization: Bearer {{placement_token}}
Expected: 200
```

### 12.16 Non-PLACEMENT_OFFICER Cannot Create
```
POST /placement/records
Header: Authorization: Bearer {{admin_token}}
Body: { "title": "Test", "record_type": "NOTICE", "description": "Test" }
Expected: 403
```

---

## Phase 13 — Audit Logs

### 13.1 List All Audit Logs
```
GET /audit-logs
Header: Authorization: Bearer {{admin_token}}
Expected: 200
Response shape: { success: true, data: { logs: [{ id, user_id, action, module_name, record_id, description, user_name, user_email, created_at }], pagination: {...} } }
Note: 50 per page by default, latest first
```

### 13.2 Filter by User
```
GET /audit-logs?user_id={{hod_user_id}}
Header: Authorization: Bearer {{admin_token}}
Expected: 200
```

### 13.3 Filter by Action
```
GET /audit-logs?action=LOGIN
Header: Authorization: Bearer {{admin_token}}
Expected: 200
```

### 13.4 Filter by Module
```
GET /audit-logs?module_name=faculty
Header: Authorization: Bearer {{admin_token}}
Expected: 200
```

### 13.5 Combined Filters
```
GET /audit-logs?action=CREATE&module_name=notices
Header: Authorization: Bearer {{admin_token}}
Expected: 200
```

### 13.6 Get Single Audit Entry
```
GET /audit-logs/1
Header: Authorization: Bearer {{admin_token}}
Expected: 200
```

### 13.7 Get All Logs for a Specific User
```
GET /audit-logs/user/{{hod_user_id}}
Header: Authorization: Bearer {{admin_token}}
Expected: 200
Response shape: { success: true, data: { user: { id, name, email }, logs: [...], pagination: {...} } }
```

### 13.8 Non-Admin Cannot Access Audit Logs
```
GET /audit-logs
Header: Authorization: Bearer {{hod_token}}
Expected: 403
```

---

## Phase 14 — Forbidden Access Cases

### 14.1 TEACHER Cannot Create Notice
```
POST /notices
Header: Authorization: Bearer {{teacher_token}}
Body: { "title": "Test", "notice_type": "GENERAL", "publish_date": "2025-01-01" }
Expected: 403
```

### 14.2 TEACHER Cannot Access User List
```
GET /users
Header: Authorization: Bearer {{teacher_token}}
Expected: 403
```

### 14.3 EXAM_CONTROLLER Cannot Create Downloads
```
POST /downloads
Header: Authorization: Bearer {{exam_token}}
Body: { "title": "Test", "category": "Form", "file_id": {{download_file_id}} }
Expected: 403
```

### 14.4 PLACEMENT_OFFICER Cannot Create Events
```
POST /events
Header: Authorization: Bearer {{placement_token}}
Body: { "title": "Test Event", "event_date": "2025-05-01" }
Expected: 403
```

### 14.5 HOD Cannot Manage Another Department's Faculty
```
PATCH /faculty/{{faculty_profile_id}}/status
Header: Authorization: Bearer {{hod_token}}
Body: { "status": "INACTIVE" }
Expected: 200 (same dept — this should succeed)
Note: to test 403, you'd need a faculty profile from a different department
```

### 14.6 No Token on Protected Route
```
POST /notices
(no Authorization header)
Body: { "title": "Test" }
Expected: 401
```

### 14.7 Invalid Token
```
GET /users
Header: Authorization: Bearer invalid.token.here
Expected: 401
```

### 14.8 EXAM_CONTROLLER Cannot Access Placement Routes
```
POST /placement/records
Header: Authorization: Bearer {{exam_token}}
Body: { "title": "Test", "record_type": "NOTICE", "description": "Test" }
Expected: 403
```

### 14.9 PLACEMENT_OFFICER Cannot Access Exam Routes
```
POST /exam/documents
Header: Authorization: Bearer {{placement_token}}
Body: { "title": "Test", "document_type": "NOTICE", "file_id": {{exam_file_id}} }
Expected: 403
```

---

## Phase 15 — Public Route Verification

### 15.1 All Public GETs Return Only Active/Published Records
```
GET /departments          → only ACTIVE departments
GET /faculty              → only ACTIVE faculty profiles
GET /notices              → only PUBLISHED + publish_date <= today
GET /downloads            → only ACTIVE downloads
GET /events               → only PUBLISHED events
GET /gallery              → only ACTIVE gallery items
GET /pages/about          → only if PUBLISHED
GET /exam/documents       → only ACTIVE exam documents
GET /placement/records    → only ACTIVE placement records
```

### 15.2 Verify Soft-Deleted Records Disappear from Public
```
1. Note id of any ACTIVE gallery item
2. DELETE /gallery/{{id}} as HOD (sets INACTIVE)
3. GET /gallery/{{id}} — Expected: 404
4. GET /gallery — item no longer appears
```

### 15.3 Verify Draft Notice Not Visible Publicly
```
1. GET /notices — create_notice POST returns status=DRAFT
2. DRAFT notice id should not appear in this public list
3. PATCH status to PUBLISHED — it should then appear
```

### 15.4 Future-Dated Notice Not Visible
```
POST /notices (admin)
Body: { "title": "Future Notice", "notice_type": "GENERAL", "publish_date": "2099-12-31" }
PATCH /notices/:id/status → { "status": "PUBLISHED" }
GET /notices — this notice should NOT appear (future date)
GET /notices/:id — Expected: 404
```

---

## Phase 16 — File Deletion Safety Check

### 16.1 Try Deleting a Referenced File (should 409)
```
DELETE /files/{{image_file_id}}
Header: Authorization: Bearer {{admin_token}}
Expected: 409
Reason: file is referenced by faculty_profiles.profile_image_file_id
```

### 16.2 Try Deleting an Unreferenced File
```
POST /files/upload → upload a throwaway image → note id → {{throwaway_id}}
DELETE /files/{{throwaway_id}}
Header: Authorization: Bearer {{admin_token}}
Expected: 200
Note: removes DB row AND Cloudinary asset
```

---

## Quick Reference — Roles and Their Module Access

| Module | CENTRAL_ADMIN | HOD | EXAM_CONTROLLER | PLACEMENT_OFFICER | TEACHER | Public |
|---|---|---|---|---|---|---|
| Auth | ✅ | ✅ | ✅ | ✅ | ✅ | login only |
| Users | CRUD | ❌ | ❌ | ❌ | ❌ | ❌ |
| Departments | CRUD | update own | ❌ | ❌ | ❌ | GET |
| Files | upload/read/delete | upload/read own | upload/read own | upload/read own | upload/read own | ❌ |
| Faculty | CRUD | CRUD own dept | ❌ | ❌ | read/update self | GET ACTIVE |
| Notices | CRUD all types | DEPARTMENT own dept | EXAM type | PLACEMENT type | ❌ | PUBLISHED |
| Downloads | CRUD all | CRUD own dept | ❌ | ❌ | ❌ | ACTIVE |
| Events | CRUD all | CRUD own dept | ❌ | ❌ | ❌ | PUBLISHED |
| Gallery | CRUD all | CRUD own dept | ❌ | ❌ | ❌ | ACTIVE |
| Pages | CRUD | ❌ | ❌ | ❌ | ❌ | PUBLISHED |
| Exam | ❌ | ❌ | CRUD | ❌ | ❌ | ACTIVE |
| Placement | ❌ | ❌ | ❌ | CRUD | ❌ | ACTIVE |
| Audit Logs | read | ❌ | ❌ | ❌ | ❌ | ❌ |
