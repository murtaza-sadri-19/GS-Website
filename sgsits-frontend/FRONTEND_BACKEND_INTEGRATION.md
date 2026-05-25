# SGSITS — Frontend ↔ Backend Integration Master Document

> **Last updated:** 2026-05-24  
> **Frontend:** React + TypeScript + Vite (this repo)  
> **Backend:** Node.js + Express + MySQL (`../GS-Website/backend/`)  
> **Backend base URL:** `http://localhost:PORT/api/v1`

---

## Quick Status Legend

| Symbol | Meaning |
|--------|---------|
| ✅ | Backend endpoint exists AND is fully implemented |
| 🔌 | Exists in backend — frontend just needs to be wired (drop mock, call real API) |
| ❌ | **Missing from backend** — must be built before frontend can go live |
| ⚠️ | Exists but has a mismatch / caveat that must be resolved |
| 🚧 | Partially exists — needs extension |

---

## SECTION 1 — Complete API Wiring Map

Every `src/api/index.ts` and `src/services/*.ts` call mapped to its backend counterpart.

---

### 1.1 Authentication

| Frontend Call | Current (Mock) | Real Backend Endpoint | Status | Notes |
|---|---|---|---|---|
| `authAPI.adminLogin(email, pw)` | mock JWT | `POST /api/v1/auth/login` | 🔌 | Same endpoint for ALL roles — role is in the JWT payload |
| `authAPI.facultyLogin(empId, pw)` | mock JWT | `POST /api/v1/auth/login` | 🔌 | Frontend sends `email` not `employeeId` — **fix login form** |
| `authAPI.hodLogin(empId, pw)` | mock JWT | `POST /api/v1/auth/login` | 🔌 | Same — single login endpoint |
| `authAPI.examLogin(empId, pw)` | mock JWT | `POST /api/v1/auth/login` | 🔌 | Same |
| `authAPI.placementLogin(empId, pw)` | mock JWT | `POST /api/v1/auth/login` | 🔌 | Same |
| `authAPI.logout()` | no-op | `POST /api/v1/auth/logout` | 🔌 | Clear localStorage token client-side too |
| `GET /auth/me` | — | `GET /api/v1/auth/me` | 🔌 | Return current user from JWT |
| `POST /auth/change-password` | — | `POST /api/v1/auth/change-password` | 🔌 | `{ oldPassword, newPassword }` |

**⚠️ Mismatch:** Frontend `Login.tsx` uses role-specific login routes (`/api/auth/admin/login`, `/api/auth/faculty/login`, etc.). Backend has **one** endpoint. Fix: Use `POST /api/v1/auth/login` with `{ email, password }` for every role; read the returned `role` from JWT payload to redirect.

---

### 1.2 Notices

| Frontend Call | Mock | Real Endpoint | Status |
|---|---|---|---|
| `noticesAPI.getAll()` | mockStore | `GET /api/v1/notices` | 🔌 |
| `noticesAPI.create(data)` | mockStore | `POST /api/v1/notices` | 🔌 |
| `noticesAPI.update(id, data)` | mockStore | `PUT /api/v1/notices/:id` | 🔌 |
| `noticesAPI.delete(id)` | mockStore | `DELETE /api/v1/notices/:id` | 🔌 |
| — | — | `GET /api/v1/notices/:id` | ✅ |
| — | — | `PATCH /api/v1/notices/:id/status` | ✅ (use this for Draft→Published) |

**⚠️ Field mismatch:** Frontend `Notice` type has `category` (academic/administrative/exam/tender/general). Backend `notice_type` is GENERAL/DEPARTMENT/EXAM/PLACEMENT. Map on frontend before sending.

---

### 1.3 Events

| Frontend Call | Mock | Real Endpoint | Status |
|---|---|---|---|
| `eventsAPI.getAll()` | mockStore | `GET /api/v1/events` | 🔌 |
| `eventsAPI.create(data)` | mockStore | `POST /api/v1/events` | 🔌 |
| `eventsAPI.update(id, data)` | mockStore | `PUT /api/v1/events/:id` | 🔌 |
| `eventsAPI.delete(id)` | mockStore | `DELETE /api/v1/events/:id` | 🔌 |
| — | — | `GET /api/v1/events/:slug` | ✅ |
| — | — | `PATCH /api/v1/events/:id/status` | ✅ |

---

### 1.4 Faculty

| Frontend Call | Mock | Real Endpoint | Status |
|---|---|---|---|
| `facultyAPI.getAll()` | mockStore | `GET /api/v1/faculty` | 🔌 |
| `facultyAPI.create(data)` | mockStore | `POST /api/v1/faculty` | 🔌 |
| `facultyAPI.update(id, data)` | mockStore | `PUT /api/v1/faculty/:id` | 🔌 |
| `facultyAPI.delete(id)` | mockStore | `DELETE /api/v1/faculty/:id` | 🔌 |
| `GET /faculty/me` (teacher) | — | `GET /api/v1/faculty/me` | ✅ |
| `PUT /faculty/me` (teacher) | — | `PUT /api/v1/faculty/me` | ✅ |
| — | — | `PATCH /api/v1/faculty/:id/status` | ✅ |

---

### 1.5 Gallery

| Frontend Call | Mock | Real Endpoint | Status | Notes |
|---|---|---|---|---|
| `galleryAPI.getAlbums()` | mockStore | `GET /api/v1/gallery` | ⚠️ | Backend has no album concept — see §2.6 |
| `galleryAPI.createAlbum(data)` | mockStore | `POST /api/v1/gallery` | ⚠️ | Images are individual items, not albums |
| `galleryAPI.updateAlbum(id, data)` | mockStore | `PUT /api/v1/gallery/:id` | ⚠️ | |
| `galleryAPI.deleteAlbum(id)` | mockStore | `DELETE /api/v1/gallery/:id` | ⚠️ | |

**⚠️ Gallery album concept is missing from backend.** See §2.6 for what must be added.

---

### 1.6 Departments

| Frontend Call | Mock | Real Endpoint | Status |
|---|---|---|---|
| `departmentService.getDepartments()` | mockStore | `GET /api/v1/departments` | 🔌 |
| `departmentService.getDepartmentBySlug(slug)` | mockStore | `GET /api/v1/departments/:slug` | 🔌 |
| `departmentService.saveDepartments(depts)` | mockStore | bulk — use `PUT /api/v1/departments/:id` per item | ⚠️ |
| Admin: create dept | mockStore | `POST /api/v1/departments` | 🔌 |
| Admin: delete dept | mockStore | `DELETE /api/v1/departments/:id` | 🔌 |
| Admin: assign HOD | — | `PATCH /api/v1/departments/:id/hod` | ✅ |

---

### 1.7 Downloads

| Frontend Call | Mock | Real Endpoint | Status |
|---|---|---|---|
| `GET downloads` (public) | mockStore | `GET /api/v1/downloads` | 🔌 |
| Admin CRUD | mockStore | `POST/PUT/DELETE /api/v1/downloads/:id` | 🔌 |
| Increment counter | — | `PATCH /api/v1/downloads/:id/increment-count` | ✅ |

---

### 1.8 File Upload

| Frontend Call | Mock | Real Endpoint | Status |
|---|---|---|---|
| Upload file for any resource | mock URL | `POST /api/v1/files/upload` (multipart) | 🔌 |
| Delete file | — | `DELETE /api/v1/files/:id` | ✅ |
| List files (admin) | — | `GET /api/v1/files` | ✅ |

**Implementation:** upload file first → get back `file_id` → pass `file_id` in resource create/update body.

---

### 1.9 Placement

| Frontend Call | Mock | Real Endpoint | Status |
|---|---|---|---|
| `placementAPI.getRecords()` | mockStore | `GET /api/v1/placement/records` | 🔌 |
| `GET /placement/notices` | — | `GET /api/v1/placement/notices` | ✅ |
| `GET /placement/company-visits` | — | `GET /api/v1/placement/company-visits` | ✅ |
| `GET /placement/training-programs` | — | `GET /api/v1/placement/training-programs` | ✅ |
| Admin CRUD | mockStore | `POST/PUT/DELETE /api/v1/placement/records` | 🔌 |

---

### 1.10 Exam Documents

| Frontend Call | Mock | Real Endpoint | Status |
|---|---|---|---|
| Exam notices | mockStore | `GET /api/v1/exam/notices` | 🔌 |
| Timetables | mockStore | `GET /api/v1/exam/timetables` | 🔌 |
| Results | mockStore | `GET /api/v1/exam/results` | 🔌 |
| Academic Calendar | mockStore | `GET /api/v1/exam/academic-calendar` | 🔌 |
| Admin upload doc | mockStore | `POST /api/v1/exam/documents` | 🔌 |
| Admin CRUD | mockStore | `PUT/DELETE /api/v1/exam/documents/:id` | 🔌 |

---

### 1.11 Users (Admin Panel)

| Frontend Call | Mock | Real Endpoint | Status |
|---|---|---|---|
| `GET /users` (admin list) | mockStore | `GET /api/v1/users` | 🔌 |
| `POST /users` (create) | mockStore | `POST /api/v1/users` | 🔌 |
| `PUT /users/:id` | mockStore | `PUT /api/v1/users/:id` | 🔌 |
| `DELETE /users/:id` | mockStore | `DELETE /api/v1/users/:id` | 🔌 |
| Toggle user active/inactive | — | `PATCH /api/v1/users/:id/status` | ✅ |

---

### 1.12 Site Settings (Admin)

| Frontend Call | Mock | Real Endpoint | Status |
|---|---|---|---|
| `settingsAPI.get()` | mockStore | ❌ **MISSING** | ❌ |
| `settingsAPI.update(data)` | mockStore | ❌ **MISSING** | ❌ |

---

### 1.13 Alerts / Marquee

| Frontend Call | Mock | Real Endpoint | Status |
|---|---|---|---|
| `alertsAPI.getAll()` | mockStore | ❌ **MISSING** | ❌ |
| `alertsAPI.create(data)` | mockStore | ❌ **MISSING** | ❌ |
| `alertsAPI.update(id, data)` | mockStore | ❌ **MISSING** | ❌ |
| `alertsAPI.delete(id)` | mockStore | ❌ **MISSING** | ❌ |

---

### 1.14 News (Campus News)

| Frontend Call | Mock | Real Endpoint | Status |
|---|---|---|---|
| `newsAPI.getAll()` | mockStore | ❌ **MISSING** | ❌ |
| `newsAPI.create(data)` | mockStore | ❌ **MISSING** | ❌ |
| `newsAPI.update(id, data)` | mockStore | ❌ **MISSING** | ❌ |
| `newsAPI.delete(id)` | mockStore | ❌ **MISSING** | ❌ |

---

### 1.15 Tenders

| Frontend Call | Mock | Real Endpoint | Status |
|---|---|---|---|
| `tendersAPI.getAll()` | mockStore | ❌ **MISSING** | ❌ |
| `tendersAPI.create(data)` | mockStore | ❌ **MISSING** | ❌ |
| `tendersAPI.update(id, data)` | mockStore | ❌ **MISSING** | ❌ |
| `tendersAPI.delete(id)` | mockStore | ❌ **MISSING** | ❌ |

---

### 1.16 Footer CMS (12 sections)

| Frontend Section | Mock | Real Endpoint | Status |
|---|---|---|---|
| Branding | footerService | ❌ **MISSING** | ❌ |
| Contact Info | footerService | ❌ **MISSING** | ❌ |
| Quick Links | footerService | ❌ **MISSING** | ❌ |
| Student Links | footerService | ❌ **MISSING** | ❌ |
| Department Links | footerService | ❌ **MISSING** | ❌ |
| External Links | footerService | ❌ **MISSING** | ❌ |
| Policy Links | footerService | ❌ **MISSING** | ❌ |
| Bottom Bar | footerService | ❌ **MISSING** | ❌ |
| Visitor Stats | footerService | ❌ **MISSING** | ❌ |
| Social Media | footerService | ❌ **MISSING** | ❌ |
| SEO Metadata | footerService | ❌ **MISSING** | ❌ |
| Layout & Visibility | footerService | ❌ **MISSING** | ❌ |

---

### 1.17 CMS Static Content (Admin → Public Pages)

All sections below are managed through `adminContentService.ts` and rendered by public pages.
None have backend endpoints.

| Section | Admin Service Call | Real Endpoint | Status |
|---|---|---|---|
| Home → Hero/Slider | `getHomePageData()` | ❌ **MISSING** | ❌ |
| Home → About SGSITS | `getHomePageData()` | ❌ **MISSING** | ❌ |
| Home → Director's Message | `getHomePageData()` | ❌ **MISSING** | ❌ |
| Home → Key Stats | `getHomePageData()` | ❌ **MISSING** | ❌ |
| Home → Announcements | `getHomePageData()` | ❌ **MISSING** | ❌ |
| Home → Campus Life | `getHomePageData()` | ❌ **MISSING** | ❌ |
| Home → FAQs | `getHomePageData()` | ❌ **MISSING** | ❌ |
| Home → Gallery Preview | `getHomePageData()` | ❌ **MISSING** | ❌ |
| About → Institute Overview | `getAboutInstitute()` | ❌ **MISSING** | ❌ |
| About → Vision & Mission | `getVisionMission()` | ❌ **MISSING** | ❌ |
| About → Director Message | `getDirectorMessage()` | ❌ **MISSING** | ❌ |
| About → Governing Body | `getGoverningBody()` | ❌ **MISSING** | ❌ |
| About → Academic Council | `getAcademicCouncil()` | ❌ **MISSING** | ❌ |
| About → Administration | `getAdministration()` | ❌ **MISSING** | ❌ |
| About → Telephone Directory | `getTelephoneDirectory()` | ❌ **MISSING** | ❌ |
| About → IQAC | `getIQAC()` | ❌ **MISSING** | ❌ |
| About → Committees | `getCommittees()` | ❌ **MISSING** | ❌ |
| About → Accreditation (NBA/NAAC) | `getAccreditation()` | ❌ **MISSING** | ❌ |
| About → Infrastructure | `getInfrastructure()` | ❌ **MISSING** | ❌ |
| Academics → UG Courses | `getUGCourses()` | ❌ **MISSING** | ❌ |
| Academics → PG Courses | `getPGCourses()` | ❌ **MISSING** | ❌ |
| Academics → PhD Programs | `getPhDCourses()` | ❌ **MISSING** | ❌ |
| Academics → PTDC Courses | `getPTDCCourses()` | ❌ **MISSING** | ❌ |
| Academics → Online Courses | `getOnlineCourses()` | ❌ **MISSING** | ❌ |
| Academics → Academic Calendar | `getAcademicCalendar()` | ❌ / 🚧 | Backend has exam academic-calendar docs only |
| Admission → UG Info | `getUGAdmission()` | ❌ **MISSING** | ❌ |
| Admission → PG Info | `getPGAdmission()` | ❌ **MISSING** | ❌ |
| Admission → PhD Info | `getPhDAdmission()` | ❌ **MISSING** | ❌ |
| Admission → Prospectus | `getProspectus()` | ❌ **MISSING** | ❌ |
| Placement → TNP Cell Info | `getPlacementInfo()` | ❌ **MISSING** | ❌ |
| Placement → Process | `getPlacementProcess()` | ❌ **MISSING** | ❌ |
| Placement → Contacts | `getPlacementContacts()` | ❌ **MISSING** | ❌ |
| Students → Activities | `getActivities()` | ❌ **MISSING** | ❌ |
| Students → NCC | `getNCC()` | ❌ **MISSING** | ❌ |
| Students → NSS | `getNSS()` | ❌ **MISSING** | ❌ |
| Students → Scholarships (Govt) | `getScholarshipGovt()` | ❌ **MISSING** | ❌ |
| Students → Scholarships (Inst.) | `getScholarshipInstitute()` | ❌ **MISSING** | ❌ |
| Facilities → Library | `getLibrary()` | ❌ **MISSING** | ❌ |
| Facilities → Hostels (Boys/Girls) | `getBoysHostel() etc.` | ❌ **MISSING** | ❌ |
| Facilities → Computer Center | `getComputerCenter()` | ❌ **MISSING** | ❌ |
| Facilities → Other Facilities | `getGymnasium() etc.` | ❌ **MISSING** | ❌ |
| Navigation / Menu Items | `getNavItems()` | ❌ **MISSING** | ❌ |
| Custom Pages (about/*, etc.) | `getCustomPages()` | 🚧 Backend has pages module | ⚠️ |
| Branding / Identity | brandingService | ❌ **MISSING** | ❌ |
| SEO per-page metadata | seoService | ❌ **MISSING** | ❌ |
| UI Labels (CMS text strings) | uiLabelsService | ❌ **MISSING** | ❌ |
| Contact form submission | contactService | ❌ **MISSING** | ❌ |
| Chatbot config/responses | chatbotService | ❌ **MISSING** | ❌ |
| Visitor statistics | footerService.visitorStats | ❌ **MISSING** | ❌ |

---

### 1.18 Audit Logs (Admin)

| Frontend Call | Real Endpoint | Status |
|---|---|---|
| View audit trail | `GET /api/v1/audit-logs` | ✅ (not yet wired in frontend) |
| Logs by user | `GET /api/v1/audit-logs/user/:userId` | ✅ |

---

## SECTION 2 — What Is Missing From The Backend

### PRIORITY 1 — Must-Have Before Launch (Core CMS features)

---

#### 2.1 News Module ❌

**Frontend uses:** `newsAPI`, `newsService`, `AdminNews.tsx`, `NewsPage.tsx`, `NewsDetailPage.tsx`

```sql
CREATE TABLE news (
  id              INT AUTO_INCREMENT PRIMARY KEY,
  title           VARCHAR(500) NOT NULL,
  slug            VARCHAR(600) UNIQUE NOT NULL,
  category        ENUM('campus','academic','achievement','event','general') DEFAULT 'general',
  excerpt         TEXT,
  content         LONGTEXT NOT NULL,
  cover_image_file_id INT REFERENCES files(id),
  author          VARCHAR(255),
  publish_date    DATE,
  created_by      INT NOT NULL REFERENCES users(id),
  status          ENUM('DRAFT','PUBLISHED','ARCHIVED') DEFAULT 'DRAFT',
  created_at      DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at      DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_news_status_date (status, publish_date),
  INDEX idx_news_category (category)
);
```

**Required routes:** `GET /api/v1/news` (public), `GET /api/v1/news/:slug` (public), `POST /api/v1/news` (CENTRAL_ADMIN), `PUT /api/v1/news/:id`, `PATCH /api/v1/news/:id/status`, `DELETE /api/v1/news/:id`

---

#### 2.2 Tenders Module ❌

**Frontend uses:** `tendersAPI`, `AdminTenders.tsx`, `TendersPage.tsx`

```sql
CREATE TABLE tenders (
  id              INT AUTO_INCREMENT PRIMARY KEY,
  title           VARCHAR(500) NOT NULL,
  ref_no          VARCHAR(100),
  description     TEXT,
  publish_date    DATE NOT NULL,
  due_date        DATE NOT NULL,
  amount          VARCHAR(100),
  file_id         INT REFERENCES files(id),
  created_by      INT NOT NULL REFERENCES users(id),
  status          ENUM('OPEN','CLOSED','EXTENDED') DEFAULT 'OPEN',
  created_at      DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at      DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_tenders_status (status)
);
```

**Required routes:** `GET /api/v1/tenders` (public), `GET /api/v1/tenders/:id` (public), `POST /api/v1/tenders` (CENTRAL_ADMIN), `PUT /api/v1/tenders/:id`, `PATCH /api/v1/tenders/:id/status`, `DELETE /api/v1/tenders/:id`

---

#### 2.3 Alerts / Marquee Module ❌

**Frontend uses:** `alertsAPI`, `AdminAlerts.tsx`, marquee bar in `MainLayout.tsx`

```sql
CREATE TABLE alerts (
  id          INT AUTO_INCREMENT PRIMARY KEY,
  text        TEXT NOT NULL,
  link        VARCHAR(1000),
  is_active   BOOLEAN DEFAULT TRUE,
  priority    INT DEFAULT 1,
  created_by  INT NOT NULL REFERENCES users(id),
  created_at  DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at  DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_alerts_active (is_active, priority)
);
```

**Required routes:** `GET /api/v1/alerts` (public, only `is_active=true`), `POST /api/v1/alerts` (CENTRAL_ADMIN), `PUT /api/v1/alerts/:id`, `PATCH /api/v1/alerts/:id/status`, `DELETE /api/v1/alerts/:id`

---

#### 2.4 Site Settings Module ❌

**Frontend uses:** `settingsAPI`, `AdminSettings.tsx`

```sql
CREATE TABLE site_settings (
  setting_key   VARCHAR(100) PRIMARY KEY,
  setting_value LONGTEXT,
  updated_by    INT REFERENCES users(id),
  updated_at    DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

**Initial seed keys:** `site_name`, `tagline`, `director_name`, `director_photo_file_id`, `contact_email`, `contact_phone`, `address`, `marquee_enabled`, `maintenance_mode`, `social_facebook`, `social_twitter`, `social_youtube`, `social_linkedin`, `social_instagram`

**Required routes:**
- `GET /api/v1/settings` (public, returns merged settings object)
- `PUT /api/v1/settings` (CENTRAL_ADMIN, upsert multiple keys at once)

---

### PRIORITY 2 — CMS Modules for Admin-Editable Content

---

#### 2.5 CMS Content Module (Generic) ❌

Many public pages (About, Academics, Admission, Facilities, Students, Placement info pages) are currently served from mockStore. These are **rich structured JSON blobs** that admin edits via `AdminStaticPages.tsx`.

**Recommended approach:** Extend the existing `pages` table with a `content_json` column, OR add a dedicated `cms_sections` table:

```sql
CREATE TABLE cms_sections (
  id            INT AUTO_INCREMENT PRIMARY KEY,
  section_key   VARCHAR(200) UNIQUE NOT NULL,  -- e.g. 'about.vision_mission', 'home.hero'
  section_label VARCHAR(300),
  content_json  LONGTEXT NOT NULL,             -- JSON blob
  updated_by    INT REFERENCES users(id),
  updated_at    DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_cms_key (section_key)
);
```

**Section keys to seed (one row per section):**

| section_key | Covers |
|---|---|
| `home.hero` | Hero slider tiles, CTA buttons |
| `home.about` | About the institute widget on homepage |
| `home.director` | Director's message on homepage |
| `home.stats` | Key statistics (students, faculty, years, etc.) |
| `home.announcements` | Announcement widget config |
| `home.campus_life` | Campus life photos/tiles |
| `home.faqs` | FAQs section |
| `home.gallery` | Gallery preview config |
| `home.seo` | Homepage SEO title/description |
| `about.overview` | About Institute full text |
| `about.vision_mission` | Vision, mission, objectives |
| `about.director_message` | Director's full message |
| `about.governing_body` | Governing body member list |
| `about.academic_council` | Academic council list |
| `about.administration` | Administration officials |
| `about.telephone_directory` | Staff directory |
| `about.iqac` | IQAC committee, activities, objectives |
| `about.committees` | Administrative committees |
| `about.accreditation` | NBA/NAAC accreditation data |
| `about.infrastructure` | Buildings, labs, campus photos |
| `academics.ug_courses` | UG course list + details |
| `academics.pg_courses` | PG course list + details |
| `academics.phd_courses` | PhD programs |
| `academics.ptdc_courses` | PTDC courses |
| `academics.online_courses` | MOOC/online courses |
| `academics.academic_calendar` | Calendar PDF link + dates |
| `admission.ug` | UG admission details + process |
| `admission.pg` | PG admission details |
| `admission.phd` | PhD admission details |
| `admission.prospectus` | Prospectus download link |
| `placement.tnp_cell` | T&P cell overview |
| `placement.process` | Placement process steps |
| `placement.contacts` | Placement contact persons |
| `students.activities` | Student activities list |
| `students.ncc` | NCC wing details |
| `students.nss` | NSS wing details |
| `students.scholarship_govt` | Government scholarships |
| `students.scholarship_institute` | Institute scholarships |
| `students.sss` | Sports & recreation |
| `facilities.library` | Library details |
| `facilities.computer_center` | Computer center details |
| `facilities.hostel_boys` | Boys hostel info |
| `facilities.hostel_girls` | Girls hostel info |
| `facilities.hostel_transit` | Transit hostel |
| `facilities.hostel_staff` | Staff quarters |
| `facilities.gymnasium` | Gymnasium |
| `facilities.dispensary` | Dispensary |
| `facilities.workshop` | Central workshop |
| `facilities.cidi` | CIDI center |
| `facilities.sports` | Sports complex |
| `facilities.idea_lab` | IDEA lab |
| `nav.menu_items` | Full navigation menu JSON |
| `branding.config` | Logo URL, institute name, short name, tagline |
| `footer.cms_data` | All 12 footer sections JSON |
| `topbar.config` | Top accessibility bar data |
| `seo.global` | Global SEO defaults |
| `seo.pages.*` | Per-page SEO overrides |
| `ui_labels` | CMS-controlled UI string labels |
| `chatbot.config` | Chatbot FAQ responses |

**Required routes:**
```
GET  /api/v1/cms/sections/:key      — Public, get section by key
GET  /api/v1/cms/sections           — CENTRAL_ADMIN, list all sections
PUT  /api/v1/cms/sections/:key      — CENTRAL_ADMIN, update section JSON
POST /api/v1/cms/sections           — CENTRAL_ADMIN, create new section key
```

---

#### 2.6 Gallery Albums Extension ❌

**Problem:** Backend `gallery` table stores individual images. Frontend `GalleryPage` expects **albums** (a group of images with a title, date, cover photo, and array of photo URLs).

**Required addition:**

```sql
CREATE TABLE gallery_albums (
  id              INT AUTO_INCREMENT PRIMARY KEY,
  title           VARCHAR(500) NOT NULL,
  slug            VARCHAR(600) UNIQUE NOT NULL,
  description     TEXT,
  cover_file_id   INT REFERENCES files(id),
  department_id   INT REFERENCES departments(id),
  event_date      DATE,
  created_by      INT NOT NULL REFERENCES users(id),
  status          ENUM('ACTIVE','INACTIVE') DEFAULT 'ACTIVE',
  created_at      DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Gallery images now belong to albums
ALTER TABLE gallery ADD COLUMN album_id INT REFERENCES gallery_albums(id);
```

**Required routes:**
- `GET /api/v1/gallery/albums` — Public, list ACTIVE albums
- `GET /api/v1/gallery/albums/:slug` — Public, get album with all images
- `POST /api/v1/gallery/albums` — CENTRAL_ADMIN or HOD
- `PUT /api/v1/gallery/albums/:id` — CENTRAL_ADMIN or HOD
- `PATCH /api/v1/gallery/albums/:id/status`
- `DELETE /api/v1/gallery/albums/:id`
- Existing `POST /api/v1/gallery` — Add `album_id` param
- Existing `GET /api/v1/gallery` — Add `album_id` filter

---

#### 2.7 Visitor Statistics ❌

**Frontend uses:** `footerService.getVisitorStats()`, footer widget

```sql
CREATE TABLE visitor_stats (
  id          INT AUTO_INCREMENT PRIMARY KEY,
  stat_date   DATE UNIQUE NOT NULL,
  page_views  BIGINT DEFAULT 0,
  unique_visits BIGINT DEFAULT 0,
  created_at  DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at  DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE visitor_total (
  id           INT AUTO_INCREMENT PRIMARY KEY,
  total_count  BIGINT DEFAULT 0,
  last_updated DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

**Required routes:**
- `GET /api/v1/analytics/visitor-count` — Public, returns `{ count, lastUpdated }`
- `POST /api/v1/analytics/page-view` — Public, increment counter (debounced/rate-limited)

---

#### 2.8 Contact Form ❌

**Frontend uses:** `contactService`, `ContactUs.tsx`

```sql
CREATE TABLE contact_submissions (
  id          INT AUTO_INCREMENT PRIMARY KEY,
  name        VARCHAR(255) NOT NULL,
  email       VARCHAR(255) NOT NULL,
  phone       VARCHAR(30),
  subject     VARCHAR(500),
  message     TEXT NOT NULL,
  ip_address  VARCHAR(45),
  is_read     BOOLEAN DEFAULT FALSE,
  created_at  DATETIME DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_contact_read (is_read)
);
```

**Required routes:**
- `POST /api/v1/contact` — Public, submit contact form
- `GET /api/v1/contact/submissions` — CENTRAL_ADMIN, list submissions
- `PATCH /api/v1/contact/submissions/:id/read` — CENTRAL_ADMIN, mark as read
- `DELETE /api/v1/contact/submissions/:id` — CENTRAL_ADMIN

---

### PRIORITY 3 — Nice-to-Have (Can ship without these)

#### 2.9 Password Reset Flow ❌
**Currently:** No forgot-password or reset-password endpoint exists.  
**Requires:** Email SMTP integration (nodemailer), reset token table.

#### 2.10 Email Notifications ❌
**Currently:** No transactional emails.  
**Requires:** SMTP setup, email templates for: new user welcome (initial password), password reset, notice publication alerts.

#### 2.11 Chatbot Backend ❌
**Frontend:** `chatbotService` reads from `mockChatbotConfig`.  
**Needs:** Either integrate in `cms_sections` table (key: `chatbot.config`) or leave as frontend-only JSON for now.

---

## SECTION 3 — Frontend Wiring Guide

For each 🔌 service, this is exactly what to change in the frontend code.

### Step 1 — Update `VITE_API_BASE_URL`

```env
# .env.local
VITE_API_BASE_URL=http://localhost:3000/api/v1
```

### Step 2 — Wire Authentication (`src/api/index.ts` + `src/pages/Login.tsx`)

**Replace** the mock `authAPI.adminLogin()` with:

```typescript
adminLogin: async (email: string, password: string): Promise<LoginResponse> => {
  const res = await apiClient.post('/auth/login', { email, password })
  // res.data = { token, user: { id, name, email, role, department_id } }
  return res.data
},
```

**In `Login.tsx`** — use a single form for all roles. After login, read `user.role` from the response and redirect:

```typescript
const roleRedirects: Record<string, string> = {
  CENTRAL_ADMIN:      '/dashboard/central-admin/dashboard',
  EXAM_CONTROLLER:    '/dashboard/exam/dashboard',
  PLACEMENT_OFFICER:  '/dashboard/placement/dashboard',
  HOD:                '/dashboard/hod/dashboard',
  TEACHER:            '/dashboard/teacher/dashboard',
}
// redirect to roleRedirects[user.role]
```

### Step 3 — Wire Notices (`src/api/index.ts`)

```typescript
export const noticesAPI = {
  getAll: async () => apiClient.get('/notices').then(r => r.data.data),
  create: async (data) => apiClient.post('/notices', data).then(r => r.data.data),
  update: async (id, data) => apiClient.put(`/notices/${id}`, data).then(r => r.data.data),
  delete: async (id) => apiClient.delete(`/notices/${id}`),
  setStatus: async (id, status) => apiClient.patch(`/notices/${id}/status`, { status }),
}
```

**Field mapping** (frontend → backend):
```typescript
// Map frontend Notice fields to backend on create/update
const toBackend = (notice: Notice) => ({
  title:        notice.title,
  description:  notice.description ?? '',
  notice_type:  mapCategory(notice.category),  // see below
  department_id: notice.departmentId ?? null,
  file_id:      notice.fileId ?? null,
  publish_date: notice.date,
})

const mapCategory = (cat: string) => ({
  academic:       'GENERAL',
  administrative: 'GENERAL',
  exam:           'EXAM',
  tender:         'GENERAL',
  general:        'GENERAL',
}[cat] ?? 'GENERAL')
```

### Step 4 — Wire Events

```typescript
export const eventsAPI = {
  getAll: async () => apiClient.get('/events').then(r => r.data.data),
  create: async (data) => apiClient.post('/events', data).then(r => r.data.data),
  update: async (id, data) => apiClient.put(`/events/${id}`, data).then(r => r.data.data),
  delete: async (id) => apiClient.delete(`/events/${id}`),
}
```

### Step 5 — Wire Faculty

```typescript
export const facultyAPI = {
  getAll: async (deptId?: string) =>
    apiClient.get('/faculty', { params: { department_id: deptId } }).then(r => r.data.data),
  create: async (data) => apiClient.post('/faculty', data).then(r => r.data.data),
  update: async (id, data) => apiClient.put(`/faculty/${id}`, data).then(r => r.data.data),
  delete: async (id) => apiClient.delete(`/faculty/${id}`),
  getMe:  async () => apiClient.get('/faculty/me').then(r => r.data.data),
  updateMe: async (data) => apiClient.put('/faculty/me', data).then(r => r.data.data),
}
```

### Step 6 — Wire File Upload

```typescript
// Replace all mock upload helpers with:
export const uploadFile = async (file: File, usage: string): Promise<{ id: number; url: string }> => {
  const form = new FormData()
  form.append('file', file)
  form.append('usage', usage)  // 'gallery'|'faculty'|'events'|'notices'|'downloads'|'exam'|'placement'
  const res = await apiClient.post('/files/upload', form, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
  return { id: res.data.data.id, url: res.data.data.file_url }
}
```

### Step 7 — Wire Departments

```typescript
// departmentService.ts — replace mockStore calls with:
export const getDepartments = async () =>
  apiClient.get('/departments').then(r => r.data.data)

export const getDepartmentBySlug = async (slug: string) =>
  apiClient.get(`/departments/${slug}`).then(r => r.data.data)
```

### Step 8 — Wire Downloads

```typescript
export const downloadsAPI = {
  getAll: async (params?) => apiClient.get('/downloads', { params }).then(r => r.data.data),
  create: async (data) => apiClient.post('/downloads', data).then(r => r.data.data),
  update: async (id, data) => apiClient.put(`/downloads/${id}`, data).then(r => r.data.data),
  delete: async (id) => apiClient.delete(`/downloads/${id}`),
  incrementCount: async (id) => apiClient.patch(`/downloads/${id}/increment-count`),
}
```

### Step 9 — Wire Exam Documents

```typescript
export const examAPI = {
  getNotices:          async () => apiClient.get('/exam/notices').then(r => r.data.data),
  getTimetables:       async () => apiClient.get('/exam/timetables').then(r => r.data.data),
  getResults:          async () => apiClient.get('/exam/results').then(r => r.data.data),
  getAcademicCalendar: async () => apiClient.get('/exam/academic-calendar').then(r => r.data.data),
  createDocument:      async (data) => apiClient.post('/exam/documents', data).then(r => r.data.data),
  updateDocument:      async (id, data) => apiClient.put(`/exam/documents/${id}`, data).then(r => r.data.data),
  deleteDocument:      async (id) => apiClient.delete(`/exam/documents/${id}`),
  setStatus:           async (id, status) => apiClient.patch(`/exam/documents/${id}/status`, { status }),
}
```

### Step 10 — Wire Placement Records

```typescript
export const placementAPI = {
  getNotices:        async () => apiClient.get('/placement/notices').then(r => r.data.data),
  getCompanyVisits:  async () => apiClient.get('/placement/company-visits').then(r => r.data.data),
  getRecords:        async () => apiClient.get('/placement/records').then(r => r.data.data),
  getTrainingPrograms: async () => apiClient.get('/placement/training-programs').then(r => r.data.data),
  createRecord:      async (data) => apiClient.post('/placement/records', data).then(r => r.data.data),
  updateRecord:      async (id, data) => apiClient.put(`/placement/records/${id}`, data).then(r => r.data.data),
  deleteRecord:      async (id) => apiClient.delete(`/placement/records/${id}`),
}
```

### Step 11 — Wire CMS Sections (after backend builds §2.5)

When the `cms_sections` table and routes are live:

```typescript
// Generic CMS content fetcher — replaces all mockStore.get*() calls
export const cmsAPI = {
  getSection: async (key: string) =>
    apiClient.get(`/cms/sections/${key}`).then(r => JSON.parse(r.data.data.content_json)),
  updateSection: async (key: string, data: unknown) =>
    apiClient.put(`/cms/sections/${key}`, { content_json: JSON.stringify(data) }),
}

// Example: replace mockStore.getAboutInstitute() with
export const getAboutInstitute = () => cmsAPI.getSection('about.overview')
export const getVisionMission  = () => cmsAPI.getSection('about.vision_mission')
export const getHomePage       = () => cmsAPI.getSection('home.hero')
// etc.
```

### Step 12 — Wire Footer CMS (after backend builds §2.5)

```typescript
// In footerService.ts — replace localStorage with:
export const getFooterCmsData = () => cmsAPI.getSection('footer.cms_data')
export const saveBranding = (data) => cmsAPI.updateSection('footer.cms_data', /* merge branding */)
// OR: dedicated /cms/footer/{section} routes if built separately
```

### Step 13 — Wire News (after backend builds §2.1)

```typescript
export const newsAPI = {
  getAll: async () => apiClient.get('/news').then(r => r.data.data),
  getBySlug: async (slug) => apiClient.get(`/news/${slug}`).then(r => r.data.data),
  create: async (data) => apiClient.post('/news', data).then(r => r.data.data),
  update: async (id, data) => apiClient.put(`/news/${id}`, data).then(r => r.data.data),
  delete: async (id) => apiClient.delete(`/news/${id}`),
}
```

### Step 14 — Wire Tenders (after backend builds §2.2)

```typescript
export const tendersAPI = {
  getAll: async () => apiClient.get('/tenders').then(r => r.data.data),
  create: async (data) => apiClient.post('/tenders', data).then(r => r.data.data),
  update: async (id, data) => apiClient.put(`/tenders/${id}`, data).then(r => r.data.data),
  delete: async (id) => apiClient.delete(`/tenders/${id}`),
}
```

### Step 15 — Wire Alerts (after backend builds §2.3)

```typescript
export const alertsAPI = {
  getAll:  async () => apiClient.get('/alerts').then(r => r.data.data),
  create:  async (data) => apiClient.post('/alerts', data).then(r => r.data.data),
  update:  async (id, data) => apiClient.put(`/alerts/${id}`, data).then(r => r.data.data),
  delete:  async (id) => apiClient.delete(`/alerts/${id}`),
}
```

### Step 16 — Wire Settings (after backend builds §2.4)

```typescript
export const settingsAPI = {
  get:    async () => apiClient.get('/settings').then(r => r.data.data),
  update: async (data) => apiClient.put('/settings', data).then(r => r.data.data),
}
```

---

## SECTION 4 — Backend Build Checklist (For Backend Developer)

Items marked ❌ in this document must be built. Here is the full ordered checklist:

### Phase 1 — Immediate Wire-Up (No new backend code needed)

These already exist in backend — just wire the frontend to call the real API:

- [ ] Wire `POST /api/v1/auth/login` in `src/api/index.ts`
- [ ] Update `Login.tsx` to use single endpoint + role-based redirect
- [ ] Wire `GET/POST/PUT/DELETE /api/v1/notices`
- [ ] Wire `GET/POST/PUT/DELETE /api/v1/events`
- [ ] Wire `GET/POST/PUT/DELETE /api/v1/faculty`
- [ ] Wire `GET/POST/PUT/DELETE /api/v1/downloads`
- [ ] Wire `GET/POST/PUT/DELETE /api/v1/departments`
- [ ] Wire `POST /api/v1/files/upload` for all admin file uploads
- [ ] Wire `GET/POST/PUT/DELETE /api/v1/exam/documents`
- [ ] Wire `GET/POST/PUT/DELETE /api/v1/placement/records`
- [ ] Wire `GET/POST/PUT/DELETE /api/v1/users` in AdminUsers.tsx

### Phase 2 — New Backend Modules (Build these first)

- [ ] **News module:** Table + routes (`/api/v1/news/*`) — §2.1
- [ ] **Tenders module:** Table + routes (`/api/v1/tenders/*`) — §2.2
- [ ] **Alerts module:** Table + routes (`/api/v1/alerts/*`) — §2.3
- [ ] **Site Settings:** `site_settings` table + `GET/PUT /api/v1/settings` — §2.4

### Phase 3 — CMS Sections (Main CMS content)

- [ ] **cms_sections table** — §2.5
- [ ] `GET /api/v1/cms/sections/:key` (public)
- [ ] `GET /api/v1/cms/sections` (admin list)
- [ ] `PUT /api/v1/cms/sections/:key` (admin update)
- [ ] Seed all 50+ section keys with existing mock data as initial JSON
- [ ] Wire frontend `adminContentService.ts` to use `/cms/sections/:key`

### Phase 4 — Gallery Albums

- [ ] `gallery_albums` table — §2.6
- [ ] `GET /api/v1/gallery/albums` (public)
- [ ] `GET /api/v1/gallery/albums/:slug` (public, with images)
- [ ] `POST/PUT/DELETE /api/v1/gallery/albums` (admin)
- [ ] Update `gallery` table with `album_id` FK
- [ ] Wire `AdminGallery.tsx` and `PhotoGalleryPage.tsx`

### Phase 5 — Analytics & Contact

- [ ] **Visitor stats:** `visitor_stats` + `visitor_total` tables — §2.7
- [ ] `GET /api/v1/analytics/visitor-count` (public)
- [ ] `POST /api/v1/analytics/page-view` (public, rate-limited)
- [ ] **Contact form:** `contact_submissions` table — §2.8
- [ ] `POST /api/v1/contact` (public)
- [ ] `GET /api/v1/contact/submissions` (CENTRAL_ADMIN)
- [ ] `PATCH /api/v1/contact/submissions/:id/read`

### Phase 6 — Optional (After everything above)

- [ ] Password reset flow (email OTP or token)
- [ ] Email notifications (new user, published notice)
- [ ] Rate limiting middleware (express-rate-limit)
- [ ] Input sanitization for HTML fields (DOMPurify or similar)
- [ ] Database migration system (dbmate or flyway)

---

## SECTION 5 — Response Format Contract

The backend uses this consistent envelope:

```json
{
  "success": true,
  "data": { ... },
  "message": "Optional message"
}
```

**Error responses:**
```json
{
  "success": false,
  "error": "Human-readable error message",
  "code": "ERROR_CODE"
}
```

**Paginated list responses:**
```json
{
  "success": true,
  "data": [...],
  "pagination": {
    "total": 100,
    "page": 1,
    "pageSize": 20,
    "totalPages": 5
  }
}
```

**Frontend must:** check `res.data.success`, read data from `res.data.data`, handle errors from `res.data.error`.

---

## SECTION 6 — Auth Token Usage

Every protected frontend request must send:

```
Authorization: Bearer <jwt_token>
```

The frontend's `src/api/client.ts` already has this interceptor — it reads from `localStorage.getItem('sgsits-admin-auth')`.

**Backend JWT payload shape:**
```json
{
  "id": 1,
  "name": "Admin Name",
  "email": "admin@sgsits.ac.in",
  "role": "CENTRAL_ADMIN",
  "department_id": null
}
```

**Frontend role mapping:**

| Backend role | Frontend role (adminStore) |
|---|---|
| `CENTRAL_ADMIN` | `super_admin` |
| `EXAM_CONTROLLER` | `exam_controller` |
| `PLACEMENT_OFFICER` | `placement_officer` |
| `HOD` | `hod` |
| `TEACHER` | `faculty` |

Update `src/store/adminStore.ts` to use backend role names after wiring login.

---

## SECTION 7 — Known Mismatches To Fix

| # | Issue | Location | Fix |
|---|---|---|---|
| 1 | Frontend has 5 separate login functions; backend has 1 | `src/api/index.ts` | Single `authAPI.login()`, redirect by `user.role` |
| 2 | Frontend Notice `category` ≠ backend `notice_type` enum | `src/api/index.ts` | Add field mapping function (see §3.2) |
| 3 | Frontend uses `Event.id` to fetch; backend uses `slug` | `eventsService.ts` | Switch to slug-based fetching |
| 4 | Frontend Gallery has album concept; backend has individual images | `AdminGallery.tsx` | Add albums table (§2.6) |
| 5 | Frontend `NewsItem` has rich `content` field; no backend news table | `newsAPI` | Build news module (§2.1) |
| 6 | Frontend `Tender` has `refNo`, `dueDate`, `amount`; no backend tenders table | `tendersAPI` | Build tenders module (§2.2) |
| 7 | Frontend Alert has `isActive`, `priority`, `link`; no backend alerts table | `alertsAPI` | Build alerts module (§2.3) |
| 8 | Backend v1 prefix in URL; some frontend mock comments say `/api/...` | Various | Always use `/api/v1/...` |
| 9 | Frontend placementAPI uses year as ID; backend uses integer id | `placementAPI.ts` | Switch to `id`-based CRUD |
| 10 | Frontend `SiteSettings` type has many fields; no backend settings table | `settingsAPI` | Build site_settings table (§2.4) |

---

## SECTION 8 — Environment Variables

```env
# Frontend .env.local
VITE_API_BASE_URL=http://localhost:3000/api/v1

# Backend .env
PORT=3000
DB_HOST=localhost
DB_PORT=3306
DB_NAME=sgsits_db
DB_USER=root
DB_PASSWORD=your_password
JWT_SECRET=your-very-secret-key-min-32-chars
JWT_EXPIRES_IN=7d
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
CLIENT_ORIGIN=http://localhost:5173
```

---

## SECTION 9 — Summary Counts

| Category | Count |
|---|---|
| Backend endpoints **already built** (✅) | **94** |
| Frontend API calls **ready to wire** immediately (🔌) | **47** |
| Backend endpoints **missing** (❌) that must be built | **~60** |
| New database tables required | **9** |
| Frontend type/field mismatches to fix | **10** |
| **Total effort** | **Phase 1 (wiring) can go live in days; Phase 2-3 requires new backend work** |

---

*This document is the single source of truth for backend–frontend integration. Update it as endpoints are implemented.*
