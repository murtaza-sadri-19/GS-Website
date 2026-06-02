# Comprehensive Hardcoded Data Audit Report

## Executive Summary

A full scan of the SGSITS Frontend React codebase identified **81+ hardcoded data instances** across 35+ files, spanning navigation structures, mock data, service defaults, configuration values, and component-level content. 

**Key Findings:**
- **Landing Pages**: 8 files with 64+ navigation card definitions
- **Services**: 11 files with configuration defaults and mock data fallbacks
- **Public Pages**: 11 files with inline content, mock comments, and static text
- **Navigation**: 70+ menu items and sub-items hardcoded in a single constant
- **Configuration**: Institution details, chatbot settings, footer content, policy documents
- **Mock/Test Data**: 3 dedicated mock files with 100+ data objects for development

---

## Hardcoded Data by Category

### 1. Landing Pages & Navigation Cards (64 cards across 8 pages)

| File | Cards | Examples | Location |
|------|-------|----------|----------|
| **AboutLanding.tsx** | 11 | Institute, Vision, Director, Admin, Governing Body, Committees, Phone Directory, Infrastructure, Academic Council, Accreditation, IQAC | Lines 53-65 |
| **AcademicsLanding.tsx** | 12 | Calendar, UG, PG, PhD, PTDC, Online, First Year, Exams, Ordinances, Plagiarism, Code of Ethics, OBE/NEP | Lines 6-19 |
| **AdmissionsLanding.tsx** | 4 | UG, PG, PhD, Prospectus | Lines 6-11 |
| **PlacementsLanding.tsx** | 4 | T&P Cell, Companies, Records, Contact | Lines 6-11 |
| **CampusLifeLanding.tsx** | 6 | Activities, Govt Scholarships, Institute Scholarships, Sports, NCC, NSS | Lines 6-13 |
| **FacilitiesLanding.tsx** | 12 | Computer Center, Library, Workshop, Gymnasium, Dispensary, CIDI, Sports, Hostels, Staff Quarters, IDEA Lab | Lines 6-19 |
| **MoreLanding.tsx** | 7 | Startup Cell, TEQIP, Notices, News, Events, Tenders, Contact | Lines 6-14 |
| **PlacementRecord.tsx** | 8 | Sector config for IT, Product, Core, PSU, Consulting, Startup | Lines 11-18 |

**Impact**: Medium | **Priority**: Medium
> All navigation cards contain hardcoded titles, descriptions, paths, and badges. Should be replaced with CMS-driven configuration or backend API.

---

### 2. Service Configuration Defaults (11 services)

#### **footerService.ts** - Extensive Institution Details
```
Lines 137-221: 'D' object containing:
- Branding: shortCode='SG', instituteName='Shri G. S. Institute of Technology & Science', 
           shortName='SGSITS INDORE', logoUrl='/assets/image.png'
- Contact: address='23, Park Road, Indore (M.P.) - 452003', 
           phone='0731-2541370', email='info@sgsits.ac.in'
- Quick Links: 10+ hardcoded portal links (Portal, Library, Notices, etc.)
- Departments: 8+ department names
- External Links: 5+ external URLs
- Bottom Bar: copyrightText='© 2025 SGSITS Indore. All rights reserved.'
- SEO: title='SGSITS Indore — An Institute of National Standing'
- Layout: 10+ boolean flags for section visibility
```
**Impact**: High | **Priority**: Critical
> Institution branding and contact details should be centralized in a CMS or config service, not hardcoded.

#### **settingsService.ts** - Top Bar Configuration
```
Lines 89-95: topBarDefaults containing:
- helpline: '+91-731-2582100'
- email: 'registrar@sgsits.ac.in'
- instituteCode: '1752'
- erpPortalUrl: 'https://www.sgsits.ac.in'
- erpPortalLabel: 'ERP Portal'
```
**Impact**: High | **Priority**: Critical
> Contact information and portal URLs are institution-specific and should be configurable.

#### **chatbotService.ts** - Chatbot Configuration
```
Lines 48-62: chatbotDefaults with:
- botName: 'Sara'
- avatarUrl: '/assets/image.png'
- welcomeMessage: Multi-line formatted message
- inputPlaceholder: 'Ask Sara about admissions, exams, placements…'
- fallbackMessage: Fallback response with contact info
- quickPrompts: Array of 5 sample questions
```
**Impact**: Medium | **Priority**: Medium
> Chatbot configuration should be centralized and configurable without code changes.

#### **Other Service Defaults**
- **contentService.ts** (Line 119): `homePageDefaults` - empty structure
- **noticesService.ts** (Line 110): `noticesDefaults = []`
- **navigationService.ts** (Lines 110-113): Empty default structures
- **uiLabelsService.ts** (Lines 25-33): `uiLabelsDefaults` - empty label objects
- **brandingService.ts** (Lines 6-10): `EMPTY_BRANDING` - empty branding structure
- **aboutService.ts** (Lines 53-63): Empty default objects

---

### 3. Navigation Structure (70+ menu items)

**File**: `src/constants/navItems.ts`

**Type**: Hardcoded navigation tree with 9 main items and 70+ sub-items

```
Main Menu Items:
1. Home (/)
2. About Us (/about) - 11 children
3. Academics (/academics) - 12 children
4. Departments (/departments) - 18 children
5. Admissions (/admission) - 4 children
6. Placements (/placement) - 4 children
7. Campus Life (/campus-life) - 6 children
8. Facilities (/facilities) - 12 children
9. More (/more) - 7 children
```

**Impact**: High | **Priority**: Critical
> Main navigation is critical business logic. CMS-driven menu would allow institutional control without deployments.

---

### 4. Mock/Test Data (3 dedicated files, 100+ objects)

#### **mockPortalData.ts** - Portal Development Data
```
Lines 17-22: SESSIONS - 4 session objects
Lines 33-42: BRANCHES - 8 branch objects (CSE, IT, ECE, EE, ME, CE, CH, IPE)
Lines 53-63: COURSES - 9 course objects
Lines 77-88: SUBJECTS - 10 subject objects
Lines 105-113: FACULTY_MEMBERS - 7 faculty profiles
Lines 126-137: STUDENTS - 10 student objects
Lines 153-158: REGISTRATION_REQUESTS - 4 objects
Lines 176-182: MARKS_REQUESTS - 5 objects
Lines 198-201: CORRECTION_REQUESTS - 2 objects
Lines 214-219: ELECTIVE_SUBJECTS - 4 objects
Line 244: MONTH_NAMES - Array of month names
```

#### **mockTeacherContent.ts** - Teacher Portal Data
```
Line 12: CURRENT_TEACHER_ID = 'F001'
Lines 40-61: TEACHER_PROFILE - Dr. Rajesh Kumar Pandey profile
Lines 77-85: TEACHER_PUBLICATIONS - 7 publication objects
Additional objects: Research projects, qualifications, course outcomes
```

#### **mockHodData.ts** - HOD Portal Data
```
Lines 24-30: LEAVE_APPLICATIONS - 5 objects
Line 34: TIMETABLE_DAYS - Week days array
Lines 35-42: TIMETABLE_PERIODS - 6 time slots
Lines 58-66: TIMETABLE_SLOTS - 7 timetable objects
Lines 80-86: DEPT_NOTICES - 5 notice objects
Line 99+: ATTENDANCE_SUMMARY - Attendance data
```

**Impact**: Low | **Priority**: Low
> Mock data is acceptable for development/testing but should be isolated and not imported in production code.

---

### 5. Public Page Hardcoded Content (11 files)

#### **NewsDetailPage.tsx** - Mock Comments & Avatars
```
Lines 20-57: Sample comment data with:
- AVATAR_OPTIONS: 4 Unsplash image URLs
- Mock comments from "Dr. Neha Gupta" and "Amit Patel"
- Hardcoded comment text and timestamps
```
**Impact**: High | **Priority**: Critical
> Mock comments and sample data left in production code; should be removed or API-driven.

#### **TendersPage.tsx** - Contact Configuration
```
Lines 14-18: DEFAULT_META with:
- Contact email: 'purchase@sgsits.ac.in'
- Contact phone: '0731-2582115'
- Default submission note text
```
**Impact**: High | **Priority**: High
> Contact information should be centralized and configurable.

#### **EventsPage.tsx** - Style Configuration
```
Lines 8-15: CATEGORY_CLASS object with:
- Color mappings: Academic, Cultural, Technical, Sports, Placement
```
**Impact**: Medium | **Priority**: Medium
> Color values should use CSS variables or theme configuration.

#### **NoticesPage.tsx** - UI Configuration
```
Lines 12-29: categoryLabels and categoryColors objects
Line 29: ITEMS_PER_PAGE = 10 (pagination magic number)
```
**Impact**: Medium | **Priority**: Medium
> Magic numbers and color definitions should be configurable.

#### **Other Public Pages**
- **NewsPage.tsx** (Line 12): `CATEGORY_COLORS` - hardcoded color mapping
- **ContactUs.tsx** (Lines 30-40): Institute contact info embedded
- **GalleryPage.tsx** (Lines 15-20): Gallery category configuration
- **CustomPages** (4 files): Fallback UI text for unpublished content pages

---

### 6. Component-Level Hardcoded Content

#### **HomePreviewPane.tsx** (in admin)
```
Lines 350-400: Sample gallery images and metadata
Lines 420-450: Default carousel content structure
```

#### **DepartmentLanding.tsx**
```
Lines 18-24: ENGINEERING_SLUGS, SCIENCE_SLUGS, OTHER_SLUGS
- 9 engineering department slugs
- 4 science department slugs
- 4 other department slugs
```
**Impact**: Medium | **Priority**: Medium
> Department categorization is configuration that should be data-driven or admin-configurable.

---

## Migration Priority Matrix

### 🔴 Critical (Do First)
| Item | Location | Impact | Action |
|------|----------|--------|--------|
| Institution branding & contact | footerService, settingsService | High - affects footer, header, email | Create `settings` API endpoint |
| Navigation structure (70+ items) | navItems.ts | High - affects all navigation | Create `menu` API endpoint |
| News detail mock comments | NewsDetailPage.tsx | High - fake data in prod | Remove or fetch from API |

### 🟠 High (Next Sprint)
| Item | Location | Impact | Action |
|------|----------|--------|--------|
| Landing page card content | 8 landing page files (64 cards) | Medium - affects UX for navigation | Create CMS endpoint or config API |
| Department categorization | DepartmentLanding.tsx | Medium - hardcoded dept grouping | Make dept categories data-driven |
| Chat bot config | chatbotService.ts | Medium - Sara hardcoded | Create chatbot configuration API |
| Color/category mappings | EventsPage, NoticesPage | Medium - styling should use theme | Extract to CSS variables or theme config |

### 🟡 Medium (Nice to Have)
| Item | Location | Impact | Action |
|------|----------|--------|--------|
| Pagination constants | Multiple pages | Low-Medium - affects UX pagination | Extract to shared constants or API |
| Mock data imports | Portal pages | Low if isolated - only for dev | Ensure never imported in prod build |
| Contact info in pages | TendersPage, ContactUs | Medium - support contact info | Centralize in settings API |

---

## Recommended Migration Path

### Phase 1: Core Configuration (Week 1-2)
1. **Create Settings Service API** - Institution branding, contact info, chatbot config
2. **Create Navigation API** - Menu items (9 main, 70+ children)
3. Update FooterService, HeaderService, ChatbotService to fetch from API instead of hardcoding

### Phase 2: Content Management (Week 3-4)
4. **Create Landing Page Cards API** - Store card data for About, Academics, Admissions, etc.
5. **Create Department Categories API** - Move ENGINEERING_SLUGS, SCIENCE_SLUGS to backend
6. Update all 8 landing page components to fetch cards from API

### Phase 3: Data-Driven Styling (Week 5)
7. **Create Theme/Configuration API** - Color mappings, category labels, UI constants
8. **Extract CSS Magic Numbers** - ITEMS_PER_PAGE, card grids, spacing into theme config

### Phase 4: Cleanup (Week 6)
9. Remove mock data from production imports
10. Audit for any remaining hardcoded values
11. Document configuration schema for future admins

---

## Implementation Checklist

- [ ] Create `/api/v1/settings` endpoint (institution config)
- [ ] Create `/api/v1/menu` endpoint (navigation tree)
- [ ] Create `/api/v1/landing-cards/{section}` endpoint (card data)
- [ ] Update footerService to fetch instead of hardcode
- [ ] Update chatbotService to fetch instead of hardcode
- [ ] Update navItems.ts to fetch instead of hardcode
- [ ] Remove mock comments from NewsDetailPage
- [ ] Update all 8 landing pages to be data-driven
- [ ] Extract color/category config to theme API
- [ ] Add migration guide to CLAUDE.md

---

## Files with Hardcoded Data (Complete List)

**Services** (11 files):
- footerService.ts, settingsService.ts, chatbotService.ts, contentService.ts
- noticesService.ts, navigationService.ts, uiLabelsService.ts, brandingService.ts
- aboutService.ts, departmentService.ts, studentService.ts

**Landing Pages** (8 files):
- AboutLanding.tsx, AcademicsLanding.tsx, AdmissionsLanding.tsx, PlacementsLanding.tsx
- CampusLifeLanding.tsx, FacilitiesLanding.tsx, MoreLanding.tsx, PlacementRecord.tsx

**Public Pages** (11 files):
- NewsDetailPage.tsx, TendersPage.tsx, EventsPage.tsx, NoticesPage.tsx, NewsPage.tsx
- ContactUs.tsx, GalleryPage.tsx, CustomAdmissionPage.tsx, CustomAboutPage.tsx
- CustomPlacementPage.tsx, CustomCampusLifePage.tsx

**Components & Config** (6 files):
- navItems.ts, DepartmentLanding.tsx, HomePreviewPane.tsx
- mockPortalData.ts, mockTeacherContent.ts, mockHodData.ts

---

**Report Generated**: Via parallel agent audit  
**Scan Depth**: Full codebase (35+ files)  
**Total Hardcoded Instances**: 81+
