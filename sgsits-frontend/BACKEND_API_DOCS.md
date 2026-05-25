# SGSITS Frontend — Backend API Documentation

> **Status:** Frontend is complete and ready for backend integration.  
> All API calls are currently mocked in `src/api/index.ts`.  
> When backend is ready, set `VITE_API_BASE_URL` in `.env.local` and replace mock functions.

---

## Table of Contents

1. [Environment Setup](#environment-setup)
2. [Authentication](#authentication)
3. [Data Models](#data-models)
4. [API Endpoints](#api-endpoints)
   - [Auth](#auth-endpoints)
   - [Notices](#notices-endpoints)
   - [News](#news-endpoints)
   - [Events](#events-endpoints)
   - [Tenders](#tenders-endpoints)
   - [Alerts (Marquee)](#alerts-endpoints)
   - [Faculty](#faculty-endpoints)
   - [Departments](#departments-endpoints)
   - [Gallery](#gallery-endpoints)
   - [Placement](#placement-endpoints)
   - [Settings](#settings-endpoints)
5. [Admin Panel Pages](#admin-panel-pages)
6. [Frontend Routes](#frontend-routes)
7. [Integration Checklist](#integration-checklist)

---

## Environment Setup

Create a `.env.local` file in the project root:

```env
# Backend base URL (no trailing slash)
VITE_API_BASE_URL=http://localhost:8000/api

# Optional: Override in production
# VITE_API_BASE_URL=https://api.sgsits.ac.in/api
```

The API client is configured in `src/api/client.ts`. It automatically:
- Attaches Bearer token from localStorage
- Redirects to `/admin/login` on 401
- Handles 15-second request timeout

---

## Authentication

### Token Flow

1. User logs in → receives `{ token, user }` from backend
2. Token stored in Zustand store (persisted in `localStorage` as `sgsits-admin-auth`)
3. Every subsequent API request includes `Authorization: Bearer <token>` header
4. On 401 response → auto logout + redirect to `/admin/login`

### User Roles

| Role | Access |
|------|--------|
| `super_admin` | Full admin panel access |
| `editor` | Admin panel (no Settings/Departments) |
| `faculty` | Faculty portal dashboard |
| `student` | Student ERP portal (external) |

---

## Data Models

All TypeScript interfaces are in `src/types/index.ts`.

### Notice
```typescript
{
  id: string
  title: string
  description: string
  category: 'Academic' | 'Examination' | 'Hostel' | 'Placement' | 'General' | 'Fee'
  isNew: boolean
  attachmentUrl?: string        // PDF link
  publishedAt: string           // YYYY-MM-DD
  expiresAt?: string            // YYYY-MM-DD (optional)
  publishedBy: string           // e.g. "Exam Cell"
  isActive: boolean
}
```

### NewsItem
```typescript
{
  id: string
  title: string
  summary: string               // Short 1-2 line summary for listings
  content: string               // Full article HTML/markdown
  category: 'Research' | 'Achievement' | 'Event' | 'Industry' | 'General'
  imageUrl?: string
  publishedAt: string           // YYYY-MM-DD
  publishedBy: string
  isActive: boolean
  tags: string[]
}
```

### Event
```typescript
{
  id: string
  title: string
  description: string
  venue: string
  startDate: string             // YYYY-MM-DD
  endDate?: string              // YYYY-MM-DD (optional, for multi-day events)
  category: 'Cultural' | 'Technical' | 'Sports' | 'Academic' | 'Workshop' | 'Seminar'
  organizer: string
  registrationUrl?: string
  imageUrl?: string
  isActive: boolean
}
```

### Tender
```typescript
{
  id: string
  title: string
  refNo: string                 // e.g. "SGSITS/Tender/2026/045"
  department: string
  status: 'Open' | 'Closed' | 'Cancelled'
  publishedAt: string           // YYYY-MM-DD
  lastDate: string              // YYYY-MM-DD
  documentUrl?: string          // PDF link
  estimatedValue?: string
  description?: string
}
```

### Alert (Marquee)
```typescript
{
  id: string
  text: string                  // Scrolling text content
  link?: string                 // Click URL
  priority: 'low' | 'normal' | 'high' | 'urgent'
  isActive: boolean
  createdAt: string             // YYYY-MM-DD
  expiresAt?: string            // YYYY-MM-DD
}
```

### Faculty
```typescript
{
  id: string
  name: string
  designation: 'Professor & Head' | 'Professor' | 'Associate Professor' | 'Assistant Professor' | 'Lecturer' | 'Lab Assistant'
  department: string            // Department full name
  qualification: string         // e.g. "Ph.D (IIT Bombay)"
  specialization: string        // e.g. "Machine Learning, IoT"
  email: string
  phone?: string
  employeeId: string            // e.g. "SGS-CE-001"
  joiningDate: string           // YYYY-MM-DD
  photoUrl?: string
  isActive: boolean
  researchAreas?: string[]
  publications?: number
}
```

### Department (for HOD updates)
```typescript
{
  slug: string                  // URL identifier e.g. "computer-engineering"
  hodName: string
  hodEmail: string
  hodPhone?: string
}
```

### GalleryAlbum
```typescript
{
  id: string
  title: string
  slug: string                  // URL slug e.g. "convocation-2025"
  description: string
  coverImageUrl?: string
  photoCount: number
  createdAt: string             // YYYY-MM-DD
  isActive: boolean
}
```

### PlacementRecord
```typescript
{
  id: string
  year: string                  // e.g. "2023-24"
  totalStudents: number
  studentsPlaced: number
  placementPercent: number      // 0-100
  highestPackage: string        // e.g. "₹50 LPA"
  averagePackage: string        // e.g. "₹12 LPA"
  recruiters: number
}
```

### SiteSettings
```typescript
{
  siteName: string
  tagline: string
  directorName: string
  directorPhoto?: string
  contactEmail: string
  contactPhone: string
  address: string
  marqueeEnabled: boolean
  maintenanceMode: boolean
  socialLinks: {
    facebook?: string
    twitter?: string
    youtube?: string
    linkedin?: string
    instagram?: string
  }
}
```

---

## API Endpoints

### Base URL
All endpoints relative to `VITE_API_BASE_URL` (default: `http://localhost:8000/api`)

### Auth Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| `POST` | `/auth/admin/login` | Admin login | No |
| `POST` | `/auth/faculty/login` | Faculty login | No |
| `POST` | `/auth/logout` | Logout (invalidate token) | Yes |
| `GET` | `/auth/me` | Get current user profile | Yes |

**POST `/auth/admin/login`**
```json
// Request body
{ "email": "admin@sgsits.ac.in", "password": "password123" }

// Response
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiJ9...",
    "user": {
      "id": "1",
      "name": "Administrator",
      "email": "admin@sgsits.ac.in",
      "role": "super_admin"
    }
  }
}
```

**POST `/auth/faculty/login`**
```json
// Request body
{ "employeeId": "SGS-CE-001", "password": "password123" }

// Response
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiJ9...",
    "user": {
      "id": "f1",
      "name": "Dr. Urjita Thakar",
      "email": "thakarurjita@gmail.com",
      "role": "faculty",
      "employeeId": "SGS-CE-001",
      "department": "Computer Engineering"
    }
  }
}
```

---

### Notices Endpoints

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| `GET` | `/notices` | Get all notices (public) | No |
| `GET` | `/notices?active=true` | Get only active notices | No |
| `GET` | `/notices/:id` | Get single notice | No |
| `POST` | `/notices` | Create notice | Yes (admin) |
| `PUT` | `/notices/:id` | Update notice | Yes (admin) |
| `DELETE` | `/notices/:id` | Delete notice | Yes (admin) |

**Response format (GET /notices):**
```json
{
  "success": true,
  "data": [Notice, Notice, ...],
  "total": 25,
  "page": 1,
  "limit": 50
}
```

**POST/PUT body:** Notice object (without `id` for POST)

---

### News Endpoints

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| `GET` | `/news` | Get all news | No |
| `GET` | `/news/:id` | Get single news item | No |
| `POST` | `/news` | Create news article | Yes (admin) |
| `PUT` | `/news/:id` | Update news | Yes (admin) |
| `DELETE` | `/news/:id` | Delete news | Yes (admin) |

---

### Events Endpoints

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| `GET` | `/events` | Get all events | No |
| `GET` | `/events?upcoming=true` | Get upcoming events | No |
| `POST` | `/events` | Create event | Yes (admin) |
| `PUT` | `/events/:id` | Update event | Yes (admin) |
| `DELETE` | `/events/:id` | Delete event | Yes (admin) |

---

### Tenders Endpoints

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| `GET` | `/tenders` | Get all tenders | No |
| `GET` | `/tenders?status=Open` | Get open tenders | No |
| `POST` | `/tenders` | Create tender | Yes (admin) |
| `PUT` | `/tenders/:id` | Update tender | Yes (admin) |
| `DELETE` | `/tenders/:id` | Delete tender | Yes (admin) |

---

### Alerts Endpoints

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| `GET` | `/alerts` | Get all alerts (admin) | Yes |
| `GET` | `/alerts/active` | Get active alerts (public, for marquee) | No |
| `POST` | `/alerts` | Create alert | Yes (admin) |
| `PUT` | `/alerts/:id` | Update alert | Yes (admin) |
| `DELETE` | `/alerts/:id` | Delete alert | Yes (admin) |

---

### Faculty Endpoints

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| `GET` | `/faculty` | Get all faculty | No |
| `GET` | `/faculty?department=computer-engineering` | Filter by department | No |
| `GET` | `/faculty/:id` | Get single faculty profile | No |
| `POST` | `/faculty` | Create faculty record | Yes (admin) |
| `PUT` | `/faculty/:id` | Update faculty | Yes (admin) |
| `DELETE` | `/faculty/:id` | Delete faculty | Yes (admin) |
| `GET` | `/faculty/me` | Get logged-in faculty profile | Yes (faculty) |

---

### Departments Endpoints

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| `GET` | `/departments` | Get all departments | No |
| `GET` | `/departments/:slug` | Get department by slug | No |
| `PATCH` | `/departments/:slug` | Update HOD details | Yes (admin) |

**PATCH `/departments/:slug` body:**
```json
{ "hodName": "Dr. New Name", "hodEmail": "new@sgsits.ac.in", "hodPhone": "0731-XXXXXXX" }
```

---

### Gallery Endpoints

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| `GET` | `/gallery/albums` | Get all albums | No |
| `GET` | `/gallery/albums/:id/photos` | Get photos in album | No |
| `POST` | `/gallery/albums` | Create album | Yes (admin) |
| `PUT` | `/gallery/albums/:id` | Update album | Yes (admin) |
| `DELETE` | `/gallery/albums/:id` | Delete album | Yes (admin) |
| `POST` | `/gallery/albums/:id/photos` | Upload photo to album | Yes (admin) |
| `DELETE` | `/gallery/photos/:photoId` | Delete a photo | Yes (admin) |

**Photo upload:** `multipart/form-data` with field `photo` (image file)

---

### Placement Endpoints

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| `GET` | `/placement/records` | Get all year-wise records | No |
| `POST` | `/placement/records` | Add year record | Yes (admin) |
| `PUT` | `/placement/records/:id` | Update year record | Yes (admin) |
| `DELETE` | `/placement/records/:id` | Delete record | Yes (admin) |

---

### Settings Endpoints

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| `GET` | `/settings` | Get site settings | No |
| `PUT` | `/settings` | Update site settings | Yes (super_admin only) |

---

## Admin Panel Pages

| URL | Page | API Calls |
|-----|------|-----------|
| `/admin/login` | Admin Login | `POST /auth/admin/login` |
| `/admin/dashboard` | Dashboard | `GET /notices`, `/news`, `/events`, `/tenders`, `/alerts`, `/faculty`, `/gallery/albums` |
| `/admin/notices` | Notices CRUD | `GET/POST/PUT/DELETE /notices` |
| `/admin/news` | News CRUD | `GET/POST/PUT/DELETE /news` |
| `/admin/events` | Events CRUD | `GET/POST/PUT/DELETE /events` |
| `/admin/tenders` | Tenders CRUD | `GET/POST/PUT/DELETE /tenders` |
| `/admin/alerts` | Alerts CRUD | `GET/POST/PUT/DELETE /alerts` |
| `/admin/faculty` | Faculty CRUD | `GET/POST/PUT/DELETE /faculty` |
| `/admin/departments` | Department HOD Update | `GET /departments`, `PATCH /departments/:slug` |
| `/admin/gallery` | Gallery Albums CRUD | `GET/POST/PUT/DELETE /gallery/albums` + photo upload |
| `/admin/placement` | Placement Records CRUD | `GET/POST/PUT/DELETE /placement/records` |
| `/admin/settings` | Site Settings | `GET/PUT /settings` |

---

## Frontend Routes

### Public Routes
```
/                           → Home page
/about/institute            → About SGSITS
/about/vision-mission       → Vision & Mission
/about/director-message     → Director's Message
/about/governing-body       → Governing Body
/about/administration       → Administration
/about/committees           → Committees
/about/telephone-directory  → Telephone Directory
/about/infrastructure       → Infrastructure
/about/iqac                 → IQAC
/about/academic-council     → Academic Council
/about/accreditation        → Accreditation

/academics/calendar         → Academic Calendar
/academics/courses/ug       → UG Courses
/academics/courses/pg       → PG Courses
/academics/courses/phd      → PhD Programs
/academics/courses/ptdc     → PTDC Courses
/academics/courses/online   → Online/MOOC Courses
/academics/first-year       → First Year Info
/academics/exam-results     → Exam & Results
/academics/ordinances       → Ordinances
/academics/plagiarism-policy→ Plagiarism Policy
/academics/code-of-conduct  → Code of Conduct
/academics/obe-nep-2020     → OBE & NEP 2020

/departments                → All Departments
/departments/:slug          → Department Detail page (tabs: about, obe, curriculum, faculty, etc.)

/faculty/:facultyId         → Faculty Profile
/institute-professors       → Distinguished Institute Professors

/students/activities        → Student Activities
/students/scholarship/govt  → Govt. Scholarships
/students/scholarship/institute → Institute Scholarships
/students/sss               → Sports Society (SSS)
/students/ncc               → NCC Wing
/students/nss               → NSS Wing

/facilities/computer-center → Computer Center
/facilities/library         → Central Library
/facilities/workshop        → Central Workshop
/facilities/gymnasium       → Gymnasium
/facilities/dispensary      → Dispensary
/facilities/cidi            → CIDI Center
/facilities/sports          → Games & Sports
/facilities/hostel/boys     → Boys Hostel
/facilities/hostel/girls    → Girls Hostel
/facilities/hostel/transit  → Transit Hostel
/facilities/hostel/staff    → Staff Quarters
/facilities/idea-lab        → AICTE IDEA Lab

/placement/tnp-cell         → T&P Cell
/placement/companies        → Leading Recruiters
/placement/record           → Placement Record
/placement/contact          → Placement Contacts

/admission/ug               → UG Admissions
/admission/pg               → PG Admissions
/admission/phd              → PhD Admissions
/admission/prospectus       → Prospectus Download

/explore/campus-map         → Campus Map (Google Maps embed)
/explore/gallery            → Photo Gallery (albums list)
/explore/gallery/:albumSlug → Album Photos
/explore/video-tour         → Video Tour (YouTube embeds)
/explore/anthem             → SGSITS Anthem

/startup-cell               → Startup & Incubation Cell
/teqip/:subpage             → TEQIP pages (about, objectives, etc.)

/notices                    → Notices listing
/news                       → News listing
/events                     → Events listing
/tenders                    → Tenders listing

/policy/privacy             → Privacy Policy
/policy/terms               → Terms of Use
/policy/disclaimer          → Disclaimer
/policy/accessibility       → Accessibility Statement
/policy/copyright           → Copyright Policy
/policy/hyperlink           → Hyperlinking Policy
/policy/security            → Security Policy
/policy/sitemap             → Site Map
/policy/web-info-manager    → Web Information Manager
/policy/help                → Help
/policy/feedback            → Feedback

/contact                    → Contact Us
```

### Auth & Portal Routes
```
/login                      → Student/Faculty/Admin Login (tabbed)
/faculty/dashboard          → Faculty Dashboard (requires faculty auth)
/admin/login                → Admin Login (dedicated page)
/admin/dashboard            → Admin Dashboard
/admin/notices              → Manage Notices
/admin/news                 → Manage News
/admin/events               → Manage Events
/admin/tenders              → Manage Tenders
/admin/alerts               → Manage Marquee Alerts
/admin/departments          → View/Update Departments
/admin/faculty              → Manage Faculty Directory
/admin/gallery              → Manage Gallery Albums
/admin/placement            → Manage Placement Records
/admin/settings             → Site Settings
```

---

## Integration Checklist

When your backend is ready, do the following:

### Step 1: Configure Environment
```bash
# .env.local
VITE_API_BASE_URL=http://your-backend-url/api
```

### Step 2: Replace Mock Functions

In `src/api/index.ts`, replace each mock function with the real API call.

**Example — replace notices.getAll:**
```typescript
// BEFORE (mock):
getAll: async (): Promise<Notice[]> => {
  await delay()
  return [...MOCK_NOTICES]
},

// AFTER (real backend):
getAll: async (): Promise<Notice[]> => {
  const res = await apiClient.get('/notices')
  return res.data.data
},
```

### Step 3: Update Auth Store

In `AdminLogin.tsx`, the `authAPI.adminLogin()` call is already structured to return `{ token, user }`. Make sure your backend returns exactly this shape.

### Step 4: Enable CORS on Backend

Your backend must allow requests from:
- `http://localhost:5173` (development)
- Your production frontend domain

### Step 5: Test Token Auth

Verify the `Authorization: Bearer <token>` header is accepted by your backend on all protected routes.

---

## Tech Stack Reference

| Item | Technology |
|------|-----------|
| Frontend Framework | React 19 + TypeScript |
| Build Tool | Vite 8 |
| Routing | React Router v7 |
| State Management | Zustand (with localStorage persistence) |
| HTTP Client | Axios (configured in `src/api/client.ts`) |
| Data Fetching | TanStack Query v5 (available, ready to use) |
| Styling | Tailwind CSS v4 |
| Icons | Lucide React |

---

*Documentation generated for SGSITS Frontend Project — May 2026*
