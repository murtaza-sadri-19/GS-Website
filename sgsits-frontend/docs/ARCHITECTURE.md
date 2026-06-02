# Frontend Architecture

## Overview

The SGSITS frontend is a single-page application with two distinct surfaces sharing one codebase:

```
Browser
  └── React SPA (Vite)
        ├── Public website      ← MainLayout  ← 180+ lazy-loaded pages
        └── Staff dashboards    ← Role layouts ← 46+ lazy-loaded pages
```

All pages are lazy-loaded via `React.lazy` and wrapped in `<Suspense fallback={<SkeletonPage />}>` inside `src/routes/routes.tsx`. There is no code splitting configuration needed — Vite handles it automatically per `import()`.

---

## Entry Points

| File | Purpose |
|------|---------|
| `index.html` | HTML shell — sets fallback `<title>`, links favicon |
| `src/main.tsx` | Mounts `<App />` to `#root` |
| `src/App.tsx` | Wraps router with `QueryClientProvider`, renders `<Preloader />` |
| `src/routes/routes.tsx` | Complete route tree — every route, layout, guard, lazy import |

---

## Routing Architecture

```
routes.tsx
├── MainLayout                          (public wrapper)
│   ├── /                               Home
│   ├── /about/*                        About section (12 pages)
│   ├── /academics/*                    Academics (12 pages)
│   ├── /departments/:slug              Department detail
│   ├── /placement/*                    Placements (6 pages)
│   ├── /campus-life/*                  Campus Life (6 pages)
│   ├── /facilities/*                   Facilities (8 pages)
│   ├── /explore/*                      Gallery, video tour, map, anthem
│   ├── /policy/*                       Legal/policy pages (10 pages)
│   ├── /contact                        Contact Us
│   └── ...
├── SidebarLayout                       (department sidebar)
│   └── /departments/:slug/...
├── AdminLayout + AdminProtectedRoute
│   └── /dashboard/central-admin/*      Admin CRUD pages (20+)
├── HodLayout + HodProtectedRoute
│   └── /dashboard/hod/*               HOD pages (20+)
├── FacultyLayout + FacultyProtectedRoute
│   └── /dashboard/teacher/*           Teacher pages (13+)
├── ExamLayout + ExamProtectedRoute
│   └── /dashboard/exam/*              Exam Controller pages (9+)
└── PlacementLayout + PlacementProtectedRoute
    └── /dashboard/placement/*         Placement Officer pages (6+)
```

Route metadata is attached via `handle: { breadcrumb: 'Label' }` for `<Breadcrumbs />` to consume.

---

## Layout System

### MainLayout (`src/components/layout/MainLayout.tsx`)

The public layout. Composes four sub-components internally:

```
MainLayout
  ├── TopBar          — helpline, quick links, ERP portal, login button
  ├── LogoBanner      — institute logo + name + tagline + mobile hamburger
  ├── StickyNav       — horizontal desktop nav + full-screen mobile drawer
  │     • Hides on scroll down, reveals on scroll up (IntersectionObserver)
  │     • Changes bg from white → brand-navy when stuck (scrolled past banner)
  ├── Announcements marquee  — live alerts from /api/v1/alerts
  ├── <Outlet />      — page content
  ├── CampusRevealBanner  — parallax image (homepage only)
  └── Footer          — links, departments grid, social, copyright
```

On mount, `MainLayout` fires **nine parallel API calls** via `Promise.all`:
`getSiteSettings`, `getTopBarData`, `getNavItems`, `getFooterData`, `getAlerts`, `getBranding`, `getUiLabels`, `getQuickLinks`, `getDepartments`.

All calls have synchronous defaults so the layout renders immediately without waiting.

### Dashboard Layouts

Each role has its own layout file:

| Layout | Sidebar source | Route |
|--------|---------------|-------|
| `AdminLayout` | Hard-coded admin nav | `/dashboard/central-admin` |
| `HodLayout` | Dynamic HOD nav | `/dashboard/hod` |
| `FacultyLayout` | Dynamic teacher nav | `/dashboard/teacher` |
| `ExamLayout` | Exam controller nav | `/dashboard/exam` |
| `PlacementLayout` | Placement officer nav | `/dashboard/placement` |

All dashboard layouts use `<LeftSidebar>` + `<Outlet>` pattern.

---

## State Management

### Zustand Stores

| Store | File | Persisted | Purpose |
|-------|------|-----------|---------|
| `useAdminStore` | `store/adminStore.ts` | Yes (`localStorage`) | JWT token + authenticated user |
| `useUIStore` | `store/uiStore.ts` | No | Mobile menu, font size, contrast, page loading |
| `pageCacheStore` | `store/pageCacheStore.ts` | No | CMS page content cache |
| `previewStore` | `store/previewStore.ts` | No | Live CMS preview pane data |

### TanStack React Query

Configured globally in `App.tsx`:
- `staleTime`: 5 minutes
- `retry`: 1
- `refetchOnWindowFocus`: false

Used in pages that need cache-aware data fetching. Simple `useEffect` + `useState` is still used in many pages — both patterns are acceptable.

---

## Service Layer

Every domain has a dedicated service file in `src/services/`. Pages never import `apiClient` directly.

```
src/services/
  settingsService.ts    — site settings, CMS sections, top bar, alerts
  brandingService.ts    — logo, name, tagline
  navService.ts         — navigation items
  contentService.ts     — homepage content sections
  departmentService.ts  — department list + detail
  facultyService.ts     — faculty profiles
  noticesService.ts     — notices
  newsService.ts        — news articles
  eventsService.ts      — events
  placementService.ts   — placement records, companies
  examService.ts        — exam sessions, timetables, results
  hodService.ts         — HOD-specific APIs
  aboutService.ts       — about page content
  academicsService.ts   — academic content
  facilitiesService.ts  — facilities content
  policyService.ts      — policy page content
  contactService.ts     — contact info
  footerService.ts      — footer configuration
  seoService.ts         — per-page SEO meta
  mediaService.ts       — file/media upload
  uiLabelsService.ts    — all UI text strings (admin-editable)
  navigationService.ts  — quick links
  chatbotService.ts     — chatbot config
  studentsService.ts    — student-facing data
  livefeedService.ts    — live feed/ticker
  adminContentService.ts — admin content CRUD
```

### Service contract

Every service follows this pattern:

```typescript
// 1. Export typed defaults for immediate first-render use
export const myDefaults: MyType = { ... }

// 2. Async fetch — always catches and returns defaults on error
export const getData = async (): Promise<MyType> => {
  try {
    const res = await apiClient.get('/v1/my-endpoint')
    return res.data?.data ?? myDefaults
  } catch {
    return myDefaults
  }
}

// 3. Named service object for ergonomic imports
export const myService = { getData, saveData }
export default myService
```

---

## Component Hierarchy

```
src/components/
  admin/
    AdminProtectedRoute     — checks useAdminStore().isAuthenticated()
    HodProtectedRoute       — checks role = HOD
    FacultyProtectedRoute   — checks role = TEACHER
    ExamProtectedRoute      — checks role = EXAM_CONTROLLER
    PlacementProtectedRoute — checks role = PLACEMENT_OFFICER
    CrudPage                — generic list/create/edit/delete table page
    AdminPreviewPanel       — split-pane CMS live preview
    CmsLivePreviewPane      — iframe preview of public page
    AttachmentUpload        — file upload with preview
    MediaUrlInput           — URL-based media picker

  global/
    Header/
      Header.tsx            — sticky desktop nav + mobile drawer
      Logo.tsx              — institute logo + name (with skeleton)
      TopAccessibilityBar   — font-size and contrast controls
    Footer/
      Footer.tsx            — full footer composed from service data
    Breadcrumbs             — reads route handle.breadcrumb
    Chatbot                 — floating AI chatbot widget
    ErrorBoundary           — React error boundary wrapper
    NavCategoryPage         — generic landing page for nav sections
    PageSeo                 — sets document.title + meta tags dynamically
    PdfViewerModal          — iframe PDF viewer modal
    Preloader               — animated loading screen on first load

  layout/
    MainLayout              — public page shell (see above)
    SidebarLayout           — content + right sidebar layout
    AdminLayout             — admin dashboard shell
    HodLayout               — HOD dashboard shell
    FacultyLayout           — teacher dashboard shell
    ExamLayout              — exam controller shell
    PlacementLayout         — placement officer shell
    LeftSidebar             — collapsible sidebar used by dashboard layouts
    PortalLayout            — used for login page

  ui/
    Skeleton.tsx            — all shimmer/skeleton primitives
```

---

## API Client

`src/api/client.ts` — single Axios instance:
- `baseURL`: `import.meta.env.VITE_API_BASE_URL` (defaults to `http://localhost:5000/api`)
- Request interceptor: attaches `Authorization: Bearer <token>` from `adminStore`
- Response interceptor: on 401, calls `adminStore.clearAuth()` and redirects to `/login`

---

## SEO

`<PageSeo pageKey="..." />` is placed at the top of each public page. It:
1. Fetches per-page SEO config from `GET /api/v1/settings/cms/seo`
2. Sets `document.title` to `seo.title` (fallback: full institute name)
3. Sets `<meta name="description">`, Open Graph, and Twitter Card tags
4. Sets canonical URL

---

## Authentication Flow

```
User visits /dashboard/*
  → Protected route guard checks useAdminStore().isAuthenticated()
  → If false: redirect to /login
  → If true: render layout + page

User submits login form
  → POST /api/v1/auth/login
  → Response: { token, user }
  → adminStore.setAuth(token, user)  ← persisted to localStorage
  → Navigate to role-specific dashboard

Token expires / 401 received
  → Axios interceptor: adminStore.clearAuth()
  → window.location = '/login'
```

Roles mapped in `adminStore.isAdmin()` and `isFaculty()`:
- Admin roles: `super_admin`, `central_admin`, `editor`
- Faculty roles: `faculty`, `teacher`, `hod`

---

## Data Flow: Public Page

```
User navigates to /about/institute
  → routes.tsx: lazy-load AboutInstitute chunk
  → Suspense shows <SkeletonPage /> while chunk loads
  → Component mounts, useEffect fires
  → aboutService.getAboutInstitute() → GET /api/v1/settings/cms/about.institute
  → On success: setState(data) → re-render with real content
  → On error: setState(defaults) → show default content (no crash)
  → <PageSeo pageKey="about/institute" /> updates <head> tags
```

---

## Build

```bash
npm run build     # vite build → dist/
npm run preview   # serve dist/ locally
```

Output: `dist/` — standard Vite SPA build. Deploy by serving `dist/index.html` for all routes (SPA fallback required on the web server).

Environment variables (prefix `VITE_`):
- `VITE_API_BASE_URL` — backend base URL (e.g. `https://api.sgsits.ac.in`)
