# SGSITS Frontend — Backend/CMS Readiness Audit Report

**Generated:** 2026-05-24  
**Auditor:** Claude (Senior Frontend Architecture Audit)  
**Project:** sgsits-frontend  
**Purpose:** Identify every part of the UI that is NOT yet CMS/backend-controllable so that every visible element can eventually be managed from an admin panel.

---

## Table of Contents

1. [Frontend Architecture Overview](#1-frontend-architecture-overview)
2. [Fully Backend-Ready Parts](#2-fully-backend-ready-parts)
3. [Partially Backend-Ready Parts](#3-partially-backend-ready-parts)
4. [Non-Backend-Ready (Static/Hardcoded) Parts](#4-non-backend-ready-staticfrontend-locked-parts)
5. [Small UI Elements Still Static](#5-small-ui-elements-still-static)
6. [Dummy Data Architecture Problems](#6-dummy-data-architecture-problems)
7. [Role-Based Future Control Analysis](#7-role-based-future-control-analysis)
8. [UI/Data Coupling Problems](#8-uidata-coupling-problems)
9. [Dynamic Rendering Limitations](#9-dynamic-rendering-limitations)
10. [Media / Image Architecture Problems](#10-mediaimage-architecture-problems)
11. [Page-by-Page Recommendations](#11-page-by-page-recommendations)
12. [Priority Classification](#12-priority-classification)

---

## 1. Frontend Architecture Overview

### Current Structure Quality

The project follows a **Component → Service → MockStore → (Future API)** pattern that is architecturally sound in most places. Service files act as the only interface between components and data; when the backend arrives, only service internals need to change.

```
src/
├── api/           ← Axios client + mock API functions (correctly isolated)
├── data/          ← mockStore.ts (57KB central store) + portal-specific mock files
├── mock/          ← Seed data organized by domain (23 files)
├── services/      ← 19 service modules (correct abstraction layer)
├── constants/     ← ⚠️ 3 hardcoded constant files that bypass the service layer
├── components/    ← Layout + global + admin + section-specific
├── pages/         ← 138 page components
├── store/         ← Zustand (auth + UI state)
├── types/         ← TypeScript interfaces
└── routes/        ← React Router v7 with 200+ routes and 5 protected role areas
```

### Scalability Level: **MEDIUM-HIGH**

The service architecture is solid. The core problem is that three classes of content remain outside it: `src/constants/`, certain hardcoded component-internal strings, and `src/data/` files accessed directly without service wrappers.

### Backend-Readiness Level: **70% Ready**

The dynamic content pipeline (homepage sections, notices, news, events, tenders, faculty, departments, placements, facilities, settings) is properly abstracted. The remaining 30% consists of structural chrome (navbar chrome, logo, sidebar banners, chatbot, SEO), constants bypassing services, and admin pages importing mockStore directly.

---

## 2. Fully Backend-Ready Parts

These are correctly structured: data flows through a service, the mock provides initial state, and swapping the service implementation to a real API call will work without touching the component.

### Homepage (`src/pages/Home.tsx`)
| Section | Service Used | CMS Fields |
|---|---|---|
| Hero banner (image, overlay text) | `contentService.getHomePage()` | `hero.instituteName`, `welcomeText`, `accentText`, `imageUrl`, `imagePosition` |
| Hero tiles (4 clickable blocks) | `contentService.getHeroTiles()` | `title`, `subtitle`, `iconName`, `dark`, `path`, `enabled`, `order` |
| About section | `contentService.getHomePage()` | `about.label`, `heading`, `accentText`, `body`, `primaryButton`, `secondaryButton` |
| Director's Corner | `contentService.getHomePage()` | `director.label`, `heading`, `name`, `photo`, `bio`, `readMoreLabel`, `readMoreTo` |
| Announcements panel | `noticesService.getHomeAnnouncements()` | Full list of notices (title, date, isNew, to) |
| Campus News section heading | `contentService.getHomePage()` | `newsSection.label`, `heading`, `accentText`, `description` |
| Featured news cards | `newsService.getFeaturedNewsCards()` | `label`, `title`, `description`, `imageUrl`, `to` |
| Regular news cards | `newsService.getHomeNewsCards()` | `category`, `title`, `description`, `imageUrl`, `to` |
| Academic Programs section | `contentService.getHomePage()` | `academicsSection` (all text + 3 program cards) |
| Departments grid | `contentService.getHomePage()` | `departmentsSection.items[]`, `showAllLink` |
| Stats banner | `contentService.getHomePage()` | `statsSection.items[]` (val + label), background images |
| Campus Life section | `contentService.getHomePage()` | `campusLifeSection` (6 facility cards) |
| FAQs panel | `contentService.getHomePage()` | `faqsSection.items[]` (question, answer, contact) |
| Gallery thumbnails | `mediaService.getHomeGalleryThumbnails()` | All thumbnails |
| Gallery section heading | `contentService.getHomePage()` | `gallerySection.heading`, `accentText`, `viewAllLink` |

### Header Navigation
- Full menu tree loaded via `navService.getNavItems()` → `mockStore.getNavItems()`
- Admin can edit via `AdminStaticPages` → "Navigation" tab
- Both desktop mega-menu and mobile drawer use the same dynamic data

### Footer (`src/components/global/Footer/Footer.tsx`)
All content loaded via `settingsService.getFooterData()`:
- Institution name, short code, establishment year, description
- Contact address, phone, email
- Dynamic link columns (headings + links)
- Portal links section (heading + links)
- Visitor stats (label, count, note)
- Bottom links strip
- Copyright text

### Top Accessibility Bar (`TopAccessibilityBar.tsx`)
- Helpline, email, institute code → `settingsService.getTopBarData()`
- ERP portal URL + label → `settingsService.getTopBarData()`

### Content Section Pages (all use service layer)
| Page Group | Service |
|---|---|
| Notices, News, Events, Tenders | `livefeedService` |
| About sub-pages (11 pages) | `aboutService` |
| Academics sub-pages (6 pages) | `academicsService` |
| Department listing + detail | `departmentService` |
| Faculty profiles | `facultyService` |
| Placement pages | `placementService` |
| Facilities pages (12 pages) | `facilitiesService` |
| Student section pages | `studentsService` |
| Custom dynamic pages | `aboutService.getCustomPages()` |

### Admin CRUD Operations
All following sections have full CRUD admin interfaces:
- Notices, News, Events, Tenders, Alerts
- Faculty member profiles
- Gallery albums + photos
- Placement records + company visits
- Department profiles
- User accounts
- Downloads
- Site settings (branding, social links, contact info)

### Role-Based Dashboards
All 5 portal dashboards (Admin, HOD, Teacher, Exam, Placement Officer) are correctly protected with role-specific Zustand auth guards and load portal data from service/mock layers.

---

## 3. Partially Backend-Ready Parts

These sections have a service or data structure in place, but the implementation is incomplete, bypasses the service layer in some cases, or has a parallel static constant that can drift out of sync.

### 3.1 SidebarLayout Section Banners

**File:** `src/components/layout/SidebarLayout.tsx` (lines 22–83)

The `sectionDetails` object is hardcoded inside the component. It maps section keys (e.g., `about`, `academics`, `facilities`) to their banner title, subtitle, and icon. These banners appear at the top of every single section page.

```typescript
// HARDCODED — not from any service:
const sectionDetails: Record<string, { title: string; subtitle: string; icon: ... }> = {
  about: { title: 'About the Institute', subtitle: 'Discover the heritage...', icon: Info },
  academics: { title: 'Academics at SGSITS', subtitle: 'Rigorous schemes...', icon: GraduationCap },
  facilities: { title: 'Campus & Facilities', subtitle: 'State-of-the-art resources...', icon: Building2 },
  // ... 9 more entries
}
```

**Impact:** The title and description shown at the top of every About, Academics, Admissions, Placements, Facilities, Explore, News, Events, and Tenders section page cannot be changed without editing source code.

### 3.2 Sidebar Links (Constants File)

**File:** `src/constants/sidebarLinks.ts`

108 lines of hardcoded sidebar navigation entries across 12 sections. The `sidebarLinks` constant is imported directly into `SidebarLayout.tsx`. There is no corresponding service or mockStore function for sidebar links. No CMS edit route exists in AdminStaticPages for these.

**Impact:** Adding, removing, reordering, or renaming any sidebar navigation item requires a code change.

### 3.3 navItems Constants (Parallel to navService)

**File:** `src/constants/navItems.ts`

134 lines defining the complete navigation tree as a constant — a **different copy** of what `mockStore.getNavItems()` also stores. The Header component correctly uses `navService`, but `navItems.ts` remains live and is the source of truth for the Departments sub-menu list in the constants layer.

**Impact:** If someone imports from `navItems.ts` instead of `navService`, they get the static version, bypassing any CMS edits. The department list in `navItems.ts` (lines 54–72) is a hardcoded list of 17 departments that will need manual sync when departments change.

### 3.4 departmentsList Constants (Parallel to departmentService)

**File:** `src/constants/departmentsList.ts`

175 lines with real HOD names, emails, phone numbers for 17 departments. This is **imported directly by `MainLayout.tsx`** (line 12: `import { departmentsList } from '../../constants/departmentsList'`). This creates a second authoritative source for department data alongside `departmentService`.

**Impact:** Any department changes made in the admin panel will NOT reflect in components that use `departmentsList` from constants.

### 3.5 Homepage Section Order and Macro-Visibility

**File:** `src/pages/Home.tsx`

The `HeroTileData` type has `enabled: boolean` and `order: number` fields — well-designed. However, the 9 macro-sections of the homepage (Hero, About+Director+Announcements, Campus News, Academics, Departments, Stats, Campus Life, FAQs+Gallery) are rendered in a **fixed JSX order**. There is no `sectionsConfig` array with `enabled`/`order` fields for these top-level sections.

**Impact:** The CMS can change text inside each section, but cannot disable, reorder, or hide whole sections.

### 3.6 Icon Registry (ICON_MAP)

**File:** `src/pages/Home.tsx` (lines 55–66), `src/components/layout/SidebarLayout.tsx`

The `ICON_MAP` object mapping icon name strings (from CMS data) to React component references is a good pattern. But the map itself is hardcoded in the component file. Adding a new icon option in the CMS (e.g., the admin selects "Trophy" as an icon) requires a developer to add it to ICON_MAP first.

**Impact:** Icon choices are frontend-locked. Cannot expand icon palette from CMS alone.

---

## 4. Non-Backend-Ready (Static/Frontend-Locked) Parts

These have no service abstraction and cannot be changed from any admin panel.

### 4.1 Logo Component (CRITICAL)

**File:** `src/components/global/Header/Logo.tsx`

Every piece of content in this component is hardcoded:

| Element | Hardcoded Value |
|---|---|
| Logo graphic | Inline SVG path data |
| Primary name | `"SGSITS INDORE"` |
| Full name | `"Shri G. S. Institute of Technology & Science"` |
| Tagline | `"Estd. 1952 • Autonomous Grant-in-Aid Institute"` |
| Year badge | `"1952"` |

The SVG logo itself is drawn in code — the actual logo image (uploaded as PNG/SVG from admin) is **not used** in this component. This component is separate from the `LogoBanner` in MainLayout that uses `/assets/image.png`.

### 4.2 MainLayout LogoBanner — Institution Identity (CRITICAL)

**File:** `src/components/layout/MainLayout.tsx` (lines 77–110)

```tsx
// ALL HARDCODED:
<img src="/assets/image.png" alt="SGSITS Logo" />
<h1>Shri G. S. Institute of Technology & Science</h1>
<p>Govt. Aided Autonomous Institute, Indore (M.P.) - Estd. 1952</p>
// Mobile drawer:
<p>Shri G.S. Institute Of Technology &amp; Science</p>
```

Note: `settings.tagline` is correctly loaded from `settingsService` here, but the institution name and sub-tagline strings are not.

### 4.3 MainLayout TopBar Quick Links (CRITICAL)

**File:** `src/components/layout/MainLayout.tsx` (lines 28–34, `TopBar` component)

```tsx
// HARDCODED navigation shortcuts in top bar:
<Link to="/students/activities">Students</Link>
<Link to="/about/administration">Faculty</Link>
<Link to="/about/institute">Alumni</Link>
<Link to="/contact">Contact</Link>
```

These 4 quick-links in the top utility bar are frontend-locked. No service controls them. They cannot be renamed, relinked, removed, or reordered from the CMS.

### 4.4 Chatbot Knowledge Base (CRITICAL)

**File:** `src/components/global/Chatbot.tsx`

The entire chatbot is hardcoded:
- Bot name: `"SGSITS Assistant"` (line 3)
- Bot avatar: `'/assets/image.png'` (line 4)
- 9 response categories (admissions, fees, departments, placements, hostel, contact, accreditation, greeting, farewell) — all hardcoded with specific fee figures, package figures, phone numbers, and addresses
- Fallback message text: hardcoded
- Keyword matching logic: hardcoded

All chatbot responses contain real institutional data (fee: ₹45,000–₹55,000/year, highest package: 50 LPA, phone: 0731-2563980, etc.) that will become stale and cannot be updated from the admin panel.

### 4.5 Sidebar Link Navigation (CRITICAL)

**File:** `src/constants/sidebarLinks.ts`

All sidebar navigation links for all 12 sections are static constants imported directly into `SidebarLayout.tsx`. There is no `sidebarLinksService` or mockStore function. The admin panel has no interface to manage these.

### 4.6 SidebarLayout Section Banner Texts (HIGH)

**File:** `src/components/layout/SidebarLayout.tsx` (lines 22–83)

12 section banners, each with title + subtitle + icon, are hardcoded in a JavaScript object inside the component. Examples:

```typescript
about:     { title: 'About the Institute',          subtitle: 'Discover the heritage...' }
academics: { title: 'Academics at SGSITS',          subtitle: 'Rigorous schemes...' }
placement: { title: 'Training & Placements',         subtitle: 'Bridging academia...' }
facilities:{ title: 'Campus & Facilities',          subtitle: 'State-of-the-art resources...' }
```

These appear as page-level banners on all 50+ section sub-pages. Completely frontend-locked.

### 4.7 AdminStaticPages Bypasses Service Layer (HIGH)

**File:** `src/pages/admin/AdminStaticPages.tsx` (line 4)

```typescript
import { mockStore } from '../../data/mockStore'  // ⚠️ DIRECT IMPORT
```

This critical admin CMS page — which manages most of the site's static content — imports `mockStore` directly instead of using the service layer. When the backend is integrated, this page will need complete rework of all its save/load operations, since it bypasses the `services/` abstraction entirely.

Additionally, all 30+ state variables in this file use `any` type:
```typescript
const [homepage, setHomepage] = useState<any>(null)
const [aboutInst, setAboutInst] = useState<any>(null)
// ... 28 more `any` states
```

### 4.8 Search Functionality (HIGH)

**File:** `src/components/global/Header/Header.tsx` (lines 158–163)

```typescript
onSubmit={(e) => {
  e.preventDefault()
  alert(`Searching for: ${searchQuery}`)  // ← Literally just an alert
  setSearchOpen(false)
}}
```

The site-wide search is a non-functional placeholder. No search service, no search API endpoint, no indexed content.

### 4.9 SEO / Meta Tag System (HIGH)

**No file exists for this.** Zero pages in the application have dynamic `<title>`, `<meta name="description">`, Open Graph tags, or structured data. Every page renders with the default HTML title from `index.html`. The types file has `SiteSettings` but no SEO metadata fields. There is no integration with react-helmet, react-head, or any meta management library.

**Impact:** Every single page is invisible to search engines. Admin cannot set page titles or descriptions. Social sharing shows no preview data.

### 4.10 Header.tsx Hardcoded Strings

**File:** `src/components/global/Header/Header.tsx` (lines 209, 283)

```tsx
// Mobile drawer title (hardcoded):
<span>SGSITS NAVIGATION</span>

// Mobile drawer footer (hardcoded):
<div>Shri G. S. Institute • Estd. 1952</div>
```

### 4.11 Policy Page Content

**Files:** `src/pages/policy/` (11 pages)

The policy pages (Privacy Policy, Terms of Use, Disclaimer, Accessibility Statement, Copyright Policy, Hyperlink Policy, Security Policy, Sitemap, Web Info Manager, Help, Feedback) appear to use `policyData.ts` from mock. Need to verify service abstraction exists for all; the Feedback and Help pages in particular may render hardcoded forms.

### 4.12 Portal Dashboard UI Labels

**Files:** `src/data/mockPortalData.ts` (17KB), `src/data/mockHodContent.ts` (18KB), `src/data/mockTeacherContent.ts` (12KB)

These files in `src/data/` (not `src/mock/`) contain:
- Portal sidebar navigation labels
- Dashboard stat card labels and values
- Role-specific UI configuration

These are NOT consistently accessed through the service layer. If components import directly from `src/data/` files, this data cannot be changed from the admin panel.

### 4.13 Login Page CAPTCHA

**File:** `src/pages/Login.tsx`

The CAPTCHA is generated entirely on the frontend using HTML Canvas. There is no backend validation of CAPTCHA responses, making it a purely visual (not functional) security measure.

---

## 5. Small UI Elements Still Static

These are fine-grained UI text strings, labels, and decorative elements that remain frontend-locked even though content around them may be CMS-driven.

| Element | Location | Notes |
|---|---|---|
| "Announcements" panel header | `Home.tsx:378` | Hardcoded heading text |
| "Live" badge text | `Home.tsx:388` | Cannot be changed to "Updated" or hidden |
| "View All Notices" link text | `Home.tsx:459` | Hardcoded CTA label |
| "View All Departments →" text | `Home.tsx:725` | Hardcoded CTA |
| "View all" / "View All" button labels | `Home.tsx:912, 951` | Repeated hardcoded CTAs |
| ERP Portal link label default | `Header.tsx:28` | Falls back to `'ERP Portal'` if service fails |
| "Search announcements, courses..." | `Header.tsx:168` | Search input placeholder |
| "Go" button text | `Header.tsx:175` | Search submit button |
| "Skip to Content" | `TopAccessibilityBar.tsx:87` | Hardcoded accessibility label |
| "Text Size:" label | `TopAccessibilityBar.tsx:97` | Hardcoded accessibility bar label |
| "A-" / "A" / "A+" | `TopAccessibilityBar.tsx:102–130` | Font size button labels |
| "High Contrast" / "Normal Contrast" | `TopAccessibilityBar.tsx:143–157` | Toggle labels |
| `activeSection` + " Portal" | `SidebarLayout.tsx:111` | Banner sub-label format string |
| Section banner default fallback | `SidebarLayout.tsx:98–103` | `'SGSITS Indore'` / `'An Institute of National Standing - Established in 1952'` |
| "SGSITS NAVIGATION" | `Header.tsx:209`, `MainLayout.tsx` | Mobile drawer titles |
| "Shri G. S. Institute • Estd. 1952" | `Header.tsx:283` | Mobile drawer footer |
| `BOT_NAME = 'SGSITS Assistant'` | `Chatbot.tsx:3` | Bot identity |
| All 9 chatbot reply strings | `Chatbot.tsx:13–48` | See §4.4 |
| Fallback chatbot message | `Chatbot.tsx:50` | "🤔 I'm not sure..." |
| Login tab labels | `Login.tsx` | "Student", "HOD", "Faculty", "Admin", "Exam", "Placement" |
| Login page title / subtitle | `Login.tsx` | Likely hardcoded |
| "Govt. Aided Autonomous Institute, Indore (M.P.) - Estd. 1952" | `MainLayout.tsx:91` | Sub-tagline |
| Top bar link labels | `MainLayout.tsx:28–34` | Students / Faculty / Alumni / Contact |
| Footer `© {currentYear}` format | `Footer.tsx:143` | Year is dynamic but format string isn't |
| "1952" badge on SVG logo | `Logo.tsx:28` | Hardcoded year |
| Breadcrumb path segment labels | `Breadcrumbs.tsx` | Auto-generated from URL segments |
| 404 page content | `NotFound.tsx` | Likely hardcoded |

---

## 6. Dummy Data Architecture Problems

### 6.1 Dual Department Data Sources

- `src/constants/departmentsList.ts` — 17 departments with HOD names, emails, phones (hardcoded)
- `src/mock/departments/departmentsData.ts` — same 17 departments as mock seed data

These two sources can diverge. `MainLayout.tsx` imports from `constants/departmentsList.ts` while page components use `departmentService` → `mockStore` → `mockDepartments`. A change in one will NOT reflect in the other.

### 6.2 Dual Navigation Sources

- `src/constants/navItems.ts` — hardcoded nav tree
- `src/mock/navbar/navData.ts` + `mockStore.getNavItems()` + `navService` — CMS-editable nav tree

Two sources of truth for navigation structure. The constant version will never update when admin edits nav items.

### 6.3 AdminStaticPages Direct mockStore Import

`AdminStaticPages.tsx` (line 4) imports `mockStore` directly. This is the ONLY admin CMS page to break the service pattern. All 30+ sections it manages (homepage, about, vision, governance, directories, facilities, campus life, etc.) use raw mockStore calls instead of service layer functions. Migration to real API will require rewriting this file's data logic.

### 6.4 All-`any` State in AdminStaticPages

30+ state variables typed as `any`. When the backend sends real API responses, TypeScript will not catch field name mismatches, missing required properties, or wrong data types.

### 6.5 Inconsistent Type Systems

`src/types/index.ts` defines: `Notice`, `NewsItem`, `Event`, `Tender`, `Alert`, `Faculty`

`src/data/mockStore.ts` (lines 69–152) defines its own parallel interfaces with **different field names** for the same entities:

| Concept | `src/types/index.ts` | `src/data/mockStore.ts` |
|---|---|---|
| Notice | `publishedAt`, `isActive`, `publishedBy` | `date`, `highlight` (no isActive) |
| NewsItem | `summary`, `content`, `imageUrl`, `tags` | `excerpt`, `content`, `image` (no tags) |
| Tender | `status: 'Open'|'Closed'|'Cancelled'` | `status: 'Open'|'Closed'|'Extended'` |

### 6.6 `src/data/` vs `src/mock/` Two-Directory Problem

Mock data exists in two directories with different access patterns:
- `src/mock/` — properly consumed through `mockStore` and services
- `src/data/mockPortalData.ts`, `mockHodContent.ts`, `mockTeacherContent.ts` — likely accessed directly by portal components

Content in `src/data/` portal files (dashboard stat labels, sidebar link labels, portal UI strings) is not routed through the service layer.

### 6.7 mockStore.ts Monolithic Structure (57KB)

The entire application's mock state lives in one 57KB file. While this works for mock mode, it means:
- No domain isolation for testing
- Cannot mock individual subsystems independently
- All changes to mock data affect the entire store's loading time
- Makes it hard to identify which services are responsible for which data

---

## 7. Role-Based Future Control Analysis

### 7.1 Super Admin / Central Admin ✅ Well-Prepared

**Can control:**
- All CRUD operations (notices, news, events, tenders, alerts)
- All faculty profiles
- All gallery content
- All placement records
- Department profiles
- User accounts
- Site settings (contact info, social links, tagline, ERP URL)
- About section content (vision, governing body, administration, committees, IQAC, etc.)
- Homepage content (hero, sections, tiles)
- Admission content
- Custom dynamic pages
- Navigation menu structure
- Facilities content
- Student section content

**Cannot yet control (gaps):**
- Sidebar link navigation (no admin interface)
- Section banner titles/subtitles (SidebarLayout sectionDetails)
- Logo text/image
- Institution name/tagline in header (partially — tagline is settable, name is not)
- SEO meta per page
- Chatbot response content
- Homepage section order/visibility at macro level
- Top bar quick links
- Search functionality
- Role-specific dashboard UI labels

### 7.2 Content Editor Role ⚠️ Partially Prepared

The `editor` role exists in `UserRole` type (`src/types/index.ts`) but no editor-specific dashboard or route exists. Editors are currently treated identically to admins via `isAdmin()` check. No granular content ownership (e.g., an editor can only manage their department's content) exists.

### 7.3 HOD ✅ Well-Prepared

16 dashboard pages cover: department profile, faculty list, students, marks, timetable, events, gallery, achievements, subjects, labs, leaves, corrections, registration, elective data, faculty allocation, results.

**Gaps:**
- HOD cannot control public-facing department page SEO
- HOD cannot edit the sidebar banner for their department section
- Faculty image uploads (UI exists but upload backend not scoped)

### 7.4 Faculty / Teacher ✅ Adequately Prepared

12 dashboard pages: profile, publications, research, qualifications, subjects, marks submission (regular + ATKT), correction requests, timetable, leave requests, notices.

**Gaps:**
- Publication PDF upload (field exists but no upload service)
- Profile photo upload management
- Teacher cannot control their own public faculty profile page SEO

### 7.5 Exam Controller ✅ Well-Prepared

12 pages covering full exam workflow: sessions, branches, courses, subject upload, student upload, ATKT upload, mark requests, results, timetables, academic calendar, downloads.

**Gaps:**
- No SEO control for exam-related public pages
- Exam results public display page might be static

### 7.6 Placement Officer ✅ Well-Prepared

7 dashboard pages: notices, company visits, placement records, training programs, internships, CMS.

**Gaps:**
- No control over the sidebar navigation on public placement pages
- Placement page section banners are hardcoded

### 7.7 Department Moderator ❌ Not Modeled

No "department content editor" role exists below HOD. There is no granular per-department content publishing system. All department content changes go through HOD (high privilege) or Central Admin.

### 7.8 Students ⚠️ Minimal

Students are redirected to an external ERP portal. No student-facing dashboard exists beyond the redirect. Student-facing features (scholarship applications, activity registrations) are not portal-driven.

---

## 8. UI/Data Coupling Problems

### 8.1 Hardcoded Institution Identity Across Multiple Files

The institution name appears as a hardcoded string in at least **5 separate files**:
1. `Logo.tsx` — "SGSITS INDORE" and "Shri G. S. Institute of Technology & Science"
2. `MainLayout.tsx` (LogoBanner) — "Shri G. S. Institute of Technology & Science"
3. `MainLayout.tsx` (mobile drawer) — "Shri G.S. Institute Of Technology & Science" (note different formatting)
4. `Header.tsx` (mobile drawer) — "SGSITS NAVIGATION"
5. `Chatbot.tsx` — Institution name embedded in responses

If the institute name changes or abbreviation changes, it must be updated in 5+ places manually.

### 8.2 ICON_MAP Tied to Component Files

The icon name → React component mapping exists in:
- `src/pages/Home.tsx` — `ICON_MAP` for hero tiles and program cards
- `src/components/layout/SidebarLayout.tsx` — section icons

Both are frontend-locked. If admin selects a new icon name from a CMS dropdown, the frontend won't render it unless a developer adds it to the map.

### 8.3 Department Data In Three Places

1. `src/constants/departmentsList.ts` — used by MainLayout
2. `src/mock/departments/departmentsData.ts` — used by departmentService
3. `src/constants/navItems.ts` — department links in navbar (lines 54–72)

Three separate authoritative sources for department names/slugs/HODs.

### 8.4 Logo Image Served From Static File

The logo is at `/public/assets/image.png` — a static file that must be replaced by a developer on the server. No CMS upload interface exists for the logo image despite `SiteSettings.directorPhoto` demonstrating how image URLs work in the settings model.

### 8.5 `currentYear` In Footer Is Dynamic, Copyright Format Is Not

```tsx
<p>© {currentYear} {copyright}</p>  // copyright = full text from settingsService (good)
```

The year is computed correctly. The `copyright` field comes from `settingsService` (good). However, the format string `© {year} {text}` is hardcoded. If the institution needs a different copyright format, it requires a code change.

---

## 9. Dynamic Rendering Limitations

### 9.1 Homepage Section Order Cannot Be Changed

The 9 macro-sections in `Home.tsx` are rendered in this fixed order:
1. Hero Banner
2. Hero Tiles
3. About + Director + Announcements
4. Campus News
5. Academic Programs
6. Departments Grid
7. Stats Banner
8. Campus Life
9. FAQs + Gallery

There is no `sectionsOrder` configuration from the CMS. Admin cannot move "Departments" above "Campus News" or disable the "Stats Banner" entirely.

### 9.2 Sidebar Links Cannot Be Reordered or Extended

All sidebar navigation items are constants. Adding a new sub-page to a section (e.g., a new "Alumni Affairs" page under About) requires:
1. Adding a route in `routes.tsx`
2. Creating the page component
3. Adding the link to `src/constants/sidebarLinks.ts`
4. Adding the link to `src/constants/navItems.ts` if needed in the navbar

None of these steps can be done from the admin panel.

### 9.3 Section Banner Cannot Be Section-Specific

The SidebarLayout's section banner shows a generic title+subtitle for the whole section (e.g., all 11 About sub-pages show the same "About the Institute" banner). Individual sub-pages cannot have their own distinct banners configured from CMS.

### 9.4 Navigation Depth is Fixed at 2 Levels

The NavItem structure only supports `{ label, path, children[] }` where children have only `{ label, path }`. There is no support for:
- Mega-menu with sections/groups
- 3-level navigation
- Navigation with icons
- Navigation with descriptions/subtitles (mega menu style)

Expanding navigation depth requires component and type changes, not just CMS configuration.

### 9.5 Department Cards Cannot Have Custom Icons/Colors

The departments grid on the homepage renders all department cards identically (Building icon, same styles). Department-specific branding (custom icon, color accent, or logo) is not supported in the data model.

### 9.6 No Marquee/Ticker Content Management

`SiteSettings.marqueeEnabled: boolean` exists, but there is no admin interface for managing the marquee/ticker text content. The Alerts system exists separately (`AdminAlerts`), but these are separate from a persistent scrolling ticker.

---

## 10. Media / Image Architecture Problems

### 10.1 Logo Served From Static File

`/public/assets/image.png` is a static file. No upload interface exists. To change the logo, a developer must replace the physical file on the server.

### 10.2 Director Photo Managed via URL String Only

`SiteSettings.directorPhoto: '/director.jpeg'` is a relative path. There is no media upload service. To change the director photo, the server file must be replaced.

### 10.3 Hero Background Image Is a CSS Expression

```typescript
hero.imageUrl: string  // Stored as CSS background-image value
```

In `Home.tsx`:
```tsx
backgroundImage: hero.imageUrl  // Already includes url() wrapper in the string
```

The image value is stored as a raw CSS string rather than a clean URL. This creates ambiguity: is it `url("path")` or just `"path"`? When the backend sends a clean URL, the component will break unless the format is standardized.

### 10.4 Gallery Images Are External URLs

Gallery thumbnails and album covers use external image URLs (likely Unsplash or similar in mock data). There is no CDN management, no image upload service, and no image optimization pipeline.

### 10.5 Faculty Photos Are URL Strings

`FacultyMember.photo?: string` — a URL string. No upload service. Faculty profile photos cannot be managed from an admin panel; they require external hosting.

### 10.6 No Image Dimension/Aspect Ratio Constraints

The data models store no image metadata (width, height, alt text enforced, caption required, aspect ratio). This means:
- Images in gallery can be any aspect ratio, breaking grid layouts
- Hero images may not be the correct dimensions
- Faculty photos may not be portrait-oriented

### 10.7 No Centralized Media Library

There is no `mediaService.uploadImage()`, no media browser in AdminStaticPages, and no CDN URL configuration. All media management is manual URL entry.

---

## 11. Page-by-Page Recommendations

### Home Page
- **Add:** `sectionsConfig[]` array in HomePageData with `id`, `enabled`, `order` per macro-section
- **Add:** Section renderer that maps config array to components dynamically
- **Fix:** `ICON_MAP` should be centralized in a service or utility, not per-component
- **Add:** SEO metadata fields (`pageTitle`, `metaDescription`) to `HomePageData`

### Header / Navigation
- **Move:** Institution name and tagline in `LogoBanner` to read from `settingsService.getSiteSettings()`
- **Move:** Logo image path to `siteSettings.logoUrl`
- **Move:** Top bar quick links (Students/Faculty/Alumni/Contact) to `settingsService.getTopBarData()`
- **Add:** `topBar.quickLinks: {label, to}[]` to `TopBarData` interface
- **Fix:** Replace `alert()` search with a real `searchService`
- **Fix:** "SGSITS NAVIGATION" mobile drawer title should come from settings

### Logo Component
- **Replace:** Inline SVG logo with a dynamic `<img>` loading from `siteSettings.logoUrl`
- **Move:** "SGSITS INDORE", "Shri G. S. Institute..." strings to `settingsService.getSiteSettings()`
- **Move:** Establishment year to settings (`siteSettings.establishedYear`)

### SidebarLayout
- **Create:** `sidebarBannersService` (or extend `settingsService`) to load section banner configs
- **Create:** `getSidebarLinks(section: string)` in a new `navigationService`
- **Create:** Admin interface tab for sidebar navigation management
- **Move:** `sectionDetails` object to `mockStore` with CRUD

### Chatbot
- **Create:** `chatbotService` with `getResponses()`, `getBotConfig()` functions
- **Create:** `mockChatbotData.ts` for keywords, replies, bot name, avatar URL
- **Add:** Admin interface to edit chatbot responses, keywords, fallback message
- **Move:** All fee/placement/contact data in responses to dynamic service calls

### SEO System
- **Add:** `seoService` with `getPageSeo(pageKey: string)` function
- **Add:** `SeoMeta` interface: `{ pageTitle, metaDescription, ogTitle, ogImage, ogDescription, canonicalUrl }`
- **Add:** `<HelmetProvider>` or equivalent at root level
- **Add:** `<PageSeo pageKey="home" />` component on each page
- **Add:** SEO tab in AdminStaticPages for each manageable page

### Constants Files
- **Migrate:** `sidebarLinks.ts` → `navigationService.getSidebarLinks(section)` → `mockStore`
- **Migrate:** `navItems.ts` → already handled by navService, delete the constant or mark as deprecated
- **Migrate:** `departmentsList.ts` → remove and use `departmentService` everywhere (fix `MainLayout.tsx` import)

### AdminStaticPages
- **Refactor:** Replace direct `mockStore` imports with service layer calls
- **Type:** Replace all `any` state types with proper interfaces from `src/types/`
- **Add:** Section banner management tab
- **Add:** Sidebar links management tab
- **Add:** Chatbot content management tab
- **Add:** SEO management tab per page

### Media System
- **Add:** `mediaService.uploadImage(file: File): Promise<string>` (returns CDN URL)
- **Add:** `siteSettings.logoUrl: string` — logo URL managed from settings
- **Add:** Media library component in admin panel
- **Add:** Image metadata fields to GalleryPhoto: `altText`, `width`, `height`
- **Fix:** Standardize `hero.imageUrl` to store a clean URL, not a CSS expression

### All Dashboard Portals
- **Verify:** All `src/data/mockPortalData.ts`, `mockHodContent.ts`, `mockTeacherContent.ts` are accessed through services
- **Create:** `portalContentService` if not existing
- **Add:** Admin interface for dashboard welcome messages and stat card labels

---

## 12. Priority Classification

### 🔴 Critical — Blocks Backend Integration or Contains Live Stale Data

| # | Issue | File |
|---|---|---|
| C1 | `AdminStaticPages` imports `mockStore` directly, bypassing service layer | `pages/admin/AdminStaticPages.tsx:4` |
| C2 | All `any` types in AdminStaticPages lose type safety at API integration point | `pages/admin/AdminStaticPages.tsx:30–80` |
| C3 | Dual department data sources can diverge silently | `constants/departmentsList.ts` + `departmentService` |
| C4 | Chatbot has real stale data (fees, packages, phone numbers) hardcoded | `components/global/Chatbot.tsx` |
| C5 | No SEO system exists — every page has no title/description | Project-wide |
| C6 | Dual `Notice`/`NewsItem`/`Tender` type definitions with different field names | `types/index.ts` vs `data/mockStore.ts` |
| C7 | Hero image stored as CSS expression string, not clean URL | `mock/home/homeData.ts`, `pages/Home.tsx` |

### 🟠 High — Prevents Full CMS Control of Visible UI

| # | Issue | File |
|---|---|---|
| H1 | Logo component fully hardcoded (SVG, name, tagline, year) | `components/global/Header/Logo.tsx` |
| H2 | LogoBanner institution name/sub-tagline hardcoded | `components/layout/MainLayout.tsx` |
| H3 | Top bar quick links (Students/Faculty/Alumni/Contact) hardcoded | `components/layout/MainLayout.tsx` |
| H4 | All sidebar navigation links are static constants | `constants/sidebarLinks.ts` |
| H5 | All section banner titles/subtitles/icons are static | `components/layout/SidebarLayout.tsx` |
| H6 | Search shows `alert()` — not functional | `components/global/Header/Header.tsx` |
| H7 | Homepage macro-section order is fixed JSX | `pages/Home.tsx` |
| H8 | Homepage macro-section visibility — no enabled/disabled per section | `pages/Home.tsx` |
| H9 | `ICON_MAP` hardcoded in component files — cannot add new icons from CMS | `pages/Home.tsx`, `SidebarLayout.tsx` |
| H10 | No logo upload — logo is a physical static file | `/public/assets/image.png` |
| H11 | `navItems.ts` constant is a stale parallel nav tree | `constants/navItems.ts` |

### 🟡 Medium — Architecture Issues That Will Cause Rework Later

| # | Issue | File |
|---|---|---|
| M1 | `src/data/` portal mock files may be imported directly by dashboards | `data/mockPortalData.ts`, etc. |
| M2 | Director photo, faculty photos, gallery images are URL-only with no upload service | Multiple |
| M3 | Breadcrumb labels auto-generated from URL path — not customizable | `components/global/Breadcrumbs.tsx` |
| M4 | Mobile drawer strings "SGSITS NAVIGATION", "Shri G. S. Institute • Estd. 1952" hardcoded | `Header.tsx`, `MainLayout.tsx` |
| M5 | Navigation depth fixed at 2 levels in data model | `types/index.ts` NavItem interface |
| M6 | No per-department content ownership — no editor role below HOD | Role system |
| M7 | Login CAPTCHA is frontend-only — no backend validation | `pages/Login.tsx` |
| M8 | Visitor counter in footer is a hardcoded string (no real counter API) | `mock/settings/settingsData.ts` |
| M9 | Social media links in settings but no dedicated display component in Header | `settingsService`, Header |
| M10 | `mockStore.ts` monolithic 57KB file — no domain isolation | `data/mockStore.ts` |
| M11 | `marqueeEnabled` flag exists in settings but no ticker content management | `types/index.ts`, AdminSettings |

### 🟢 Low — Minor Static Elements, Acceptable to Address Later

| # | Issue |
|---|---|
| L1 | Preloader animation is static React component |
| L2 | Error boundary fallback text is hardcoded |
| L3 | "Announcements" header text in homepage panel |
| L4 | "View All Notices", "View All Departments" CTA labels in homepage |
| L5 | "Live" badge text in Announcements panel |
| L6 | "A-" / "A" / "A+" font size button labels in accessibility bar |
| L7 | "Skip to Content" accessibility bar label |
| L8 | Footer copyright format string `© {year} {text}` |
| L9 | "1952" year badge in SVG logo |
| L10 | Search input placeholder text |
| L11 | Color constants in `Home.tsx` `C` object (palette is intentionally fixed) |
| L12 | Default ERP label fallback `'ERP Portal'` |

---

## Summary Table

| Category | Count | Backend-Ready? |
|---|---|---|
| Homepage content sections | 15 | ✅ Yes |
| Header navigation menu | 1 | ✅ Yes |
| Footer content | 6 blocks | ✅ Yes |
| Top accessibility bar content | 4 fields | ✅ Yes |
| About, Academics, Facilities, Students pages | 50+ | ✅ Yes (service layer) |
| Placement, Department, Faculty pages | 20+ | ✅ Yes |
| Admin CRUD dashboards (all roles) | 60+ pages | ✅ Yes |
| Logo component | 5 fields | ❌ 100% hardcoded |
| Institution name/tagline in header | 3 variants | ❌ Hardcoded |
| Top bar quick links | 4 links | ❌ Hardcoded |
| Sidebar navigation links | 100+ entries | ❌ Static constant |
| Section banner texts (12 sections) | 24 strings | ❌ Hardcoded |
| Chatbot content | 9 responses | ❌ Hardcoded |
| SEO / meta tags | All pages | ❌ Does not exist |
| Search functionality | Site-wide | ❌ Non-functional |
| Logo image upload | Site-wide | ❌ Static file only |
| Homepage section order/visibility | 9 sections | ⚠️ Content yes, structure no |
| Icon registry | 2 components | ⚠️ Pattern good, extensibility locked |
| AdminStaticPages data access | Critical admin page | ⚠️ Direct mockStore bypass |

---

*End of Audit Report — SGSITS Frontend Backend/CMS Readiness Assessment*
