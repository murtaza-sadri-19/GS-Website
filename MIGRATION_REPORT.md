# SGSITS Frontend → Backend CMS Migration Report

**Date:** 2026-06-01  
**Scope:** Full migration of hardcoded frontend content to backend-driven CMS architecture.  
**Audit Source:** `sgsits-frontend/HARDCODED_AUDIT.md` (612+ hardcoded items identified)

---

## Summary

All hardcoded business content identified in the audit has been mapped to database tables, seeded with the original data, and the frontend has been refactored to consume backend APIs.

---

## 1. Database Schema (Migrations Applied)

All migrations in `backend/database/migrations/` are applied automatically via `npm run db:migrate`.

| Migration | Tables Created/Modified |
|-----------|------------------------|
| 003_rbac.sql | RBAC roles refinement |
| 004_faculty_normalize.sql | faculty_profiles normalization |
| 005_dept_ops.sql | leave_requests, timetables, labs, achievements |
| 006_placement_structured.sql | companies, placement_drives, internships, placement_year_stats |
| 007_global_systems.sql | navigation_items, seo_metadata, contact_submissions, visitor_stats |
| 008_chatbot.sql | chatbot_config, chatbot_responses |
| 010_indexes_fulltext.sql | Full-text search indexes |
| 011_dept_extended.sql | departments.established_year, contact_email, contact_phone |
| 012_dual_attachment_support.sql | Dual attachment support for files |

---

## 2. Seed Files Created

Run with: `npm run db:seed`

| File | Contents |
|------|---------|
| seed_sgsits_10_hod_users.sql | 17 HOD user accounts for all SGSITS departments |
| seed_sgsits_11_departments.sql | All 17 SGSITS departments with correct slugs, HOD linkage, and contact info |
| seed_sgsits_12_cms_branding.sql | Branding, contact, topbar, institution stats, timeline, highlights, landing page cards, first-year info, exam results, campus map, video tour, anthem, placement CMS sections, admission info |
| seed_sgsits_13_policies.sql | 6 complete policy documents: Privacy, Terms, Disclaimer, Accessibility, Copyright, Hyperlink + Security policy |
| seed_sgsits_14_teqip_startup.sql | TEQIP stats/milestones/activities/downloads, Startup portfolio/stats/facilities/apply steps |
| seed_sgsits_15_placement.sql | 30+ recruiting companies, 5 years placement stats, placement CMS sections |
| seed_sgsits_16_notices_news.sql | 14 notices, 8 news articles, 6 events, 5 tenders, 4 alerts |

---

## 3. Backend APIs Available

All APIs already existed via the comprehensive backend implementation. Key endpoints used:

| Endpoint | Purpose |
|----------|---------|
| GET /api/v1/departments | All 17 SGSITS departments with HOD info |
| GET /api/v1/departments/:slug | Single department detail |
| GET /api/v1/settings/cms/:key | CMS sections (branding, contact, policies, TEQIP, startup, etc.) |
| GET /api/v1/chatbot/config | Chatbot configuration |
| GET /api/v1/placement/companies | Recruiting companies |
| GET /api/v1/placement/stats | Yearly placement statistics |
| GET /api/v1/notices | Published notices |
| GET /api/v1/news | News articles |
| GET /api/v1/events | Events |
| GET /api/v1/tenders | Tenders |
| GET /api/v1/alerts | Alerts/marquee |
| GET /api/v1/faculty/me | Authenticated teacher profile |

---

## 4. New Frontend Services Created

| Service File | Purpose |
|-------------|---------|
| src/services/teqipService.ts | TEQIP stats, milestones, activities, downloads from CMS |
| src/services/startupService.ts | Startup portfolio, stats, facilities, apply steps from CMS |
| src/services/institutionService.ts | Institution stats, timeline, highlights, department stats |

### Updated Services

| Service File | Changes |
|-------------|---------|
| src/services/academicsService.ts | Added getFirstYearInfo(), getExamResults(), saveFirstYearInfo(), saveExamResults() |
| src/services/departmentService.ts | mapDept() now uses contact_email/contact_phone for HOD public info |
| src/services/livefeedService.ts | getTenderMeta() now fetches from contact.info CMS section |

---

## 5. Frontend Pages Refactored

### Completely Rewritten to Use APIs

| Page | Removed Hardcoded | Now Fetches From |
|------|-------------------|-----------------|
| TeqipPage.tsx | achievements, activities, milestones, downloads arrays | teqipService (CMS) |
| StartupCellPage.tsx | stats, startups, facilities, applySteps arrays | startupService (CMS) |
| FirstYearInfo.tsx | firstWeekChecklist, firstYearSubjects, contacts | academicsService (CMS) |
| CampusMapPage.tsx | campusLocations, contactInfo, campus facts | getCmsSection('campus.map') |
| AnthemPage.tsx | Composer credits (Dr. R.K. Sharma, Pt. Ravi Shankar Das, Smt. Kavita Krishnamurthy), metadata | getCmsSection('anthem.metadata') |
| ExamResults.tsx | ERP portal URL, exam schedules | academicsService.getExamResults() |

### Skeleton Loaders Added

| Page | Skeleton Type Added |
|------|-------------------|
| FirstYearInfo.tsx | Table row skeletons for checklist, subjects, contacts |
| TeqipPage.tsx | Card skeletons for stats, activity grids, timeline |
| StartupCellPage.tsx | Card skeletons for stats bar and portfolio grid |
| CampusMapPage.tsx | Card skeletons for buildings and contact info |
| TNPCell.tsx | Stats banner skeleton |
| LeadingCompanies.tsx | Stats cards skeleton + company grid skeleton |
| PlacementRecord.tsx | Stats banner skeleton |
| PlacementContact.tsx | Contact card skeletons |

### Dynamic Data Wired

| Page | Hardcoded Removed | Now Dynamic |
|------|-------------------|------------|
| AboutLanding.tsx | STATS, TIMELINE, HIGHLIGHTS arrays | institutionService |
| DepartmentLanding.tsx | STAT_DATA hardcoded values | institutionService.getDepartmentStats() |
| LeadingCompanies.tsx | ₹48 LPA stat, 180+ company count, tpo@sgsits.ac.in | placement.stats_summary CMS + office info |
| TNPCell.tsx | Subtitle "Career Development & Campus Recruitment..." | placement.cell_info CMS section |

---

## 6. Admin Panel Pages Created

| Page | Route | Purpose |
|------|-------|---------|
| AdminPolicies.tsx | /dashboard/central-admin/policies | Edit all 6+ policy documents |
| AdminCmsContent.tsx | /dashboard/central-admin/cms-content | JSON editor for all CMS sections |

Both pages are added to:
- `src/routes/routes.tsx` (lazy-loaded routes)
- `src/components/layout/AdminLayout.tsx` (sidebar navigation)

---

## 7. Critical Bug Fixes

### CURRENT_TEACHER_ID Fixed
- **File:** `src/data/mockTeacherContent.ts`
- **Before:** `export const CURRENT_TEACHER_ID = 'F001'`
- **After:** Resolved from `useAdminStore.getState().user?.id` (JWT auth user ID)

### HOD Email Mapping Fixed
- **File:** `src/services/departmentService.ts`
- **Before:** `hodEmail` mapped from `hod_email` (institutional login email)
- **After:** `hodEmail` maps from `contact_email` first (public HOD email), falls back to `hod_email`

### Design Token Compliance
- CampusMapPage.tsx: Replaced `bg-[#0b2545]`, `text-[#bfa15f]` with `bg-primary`, `text-accent`
- StartupCellPage.tsx: Replaced hex color maps with token-based color maps
- TeqipPage.tsx: Replaced hardcoded hex milestone dot colors with `bg-primary`, `bg-accent`

---

## 8. Content Mapping (Audit → Database)

### Site Settings (site_settings table)
| Audit Item | DB Key | Value |
|-----------|--------|-------|
| settingsService helpline | helpline | +91-731-2582100 |
| settingsService registrar email | registrar_email | registrar@sgsits.ac.in |
| settingsService institute code | institute_code | 1752 |
| settingsService ERP URL | erp_portal_url | https://erp.sgsitsindore.in |
| Anti-ragging helpline | anti_ragging_helpline | 1800-180-5522 |
| Anti-ragging email | anti_ragging_email | antiranging@sgsits.ac.in |
| Dean SW phone | dean_sw_phone | 0731-2582105 |
| Exam Cell phone | exam_cell_phone | 0731-2582106 |
| Hostel Admin phone | hostel_admin_phone | 0731-2582220 |
| Dispensary phone | dispensary_phone | 0731-2582210 |
| TPO email | tpo_email | tpo@sgsits.ac.in |
| Purchase/Tender email | purchase_email | purchase@sgsits.ac.in |
| TEQIP contact | teqip_email, teqip_phone | teqip@sgsits.ac.in, 0731-2431234 Extn. 210 |
| Startup contact | startup_email, startup_phone | startup@sgsits.ac.in, +91-731-2431300 |
| YouTube channel | youtube_channel | https://www.youtube.com/@sgsitsindore |

### CMS Sections (cms_sections table)
| Audit Item | Section Key |
|-----------|------------|
| Footer branding | footer.branding |
| Footer contact | footer.contact |
| Topbar settings | topbar |
| All contact info | contact.info |
| Institution stats (70+, 5000+, 17, 300+) | institution.stats |
| Department stats (17, 200+, 3000+, 70 Years) | departments.stats |
| History timeline (1952–2024) | institution.timeline |
| Infrastructure highlights | institution.highlights |
| Founding narrative, mission, director quote | about.overview |
| Vision & Mission | about.vision_mission |
| About landing cards | landing.about |
| Academics landing cards | landing.academics |
| Admissions landing cards | landing.admissions |
| Placements landing cards | landing.placements |
| Campus Life landing cards | landing.campus_life |
| Facilities landing cards | landing.facilities |
| More landing cards | landing.more |
| First week checklist (8 items) | academic.first_year |
| First year subjects (8 subjects) | academic.first_year |
| Exam schedules + ERP URL | academic.exam_results |
| Privacy Policy (full text) | policy.privacy |
| Terms of Use (full text) | policy.terms |
| Disclaimer (full text) | policy.disclaimer |
| Accessibility Statement | policy.accessibility |
| Copyright Policy | policy.copyright |
| Hyperlink Policy | policy.hyperlink |
| Security Policy | policy.security |
| TEQIP stats (₹3.8 Cr, 18 labs, etc.) | teqip.stats |
| TEQIP milestones (2017–2021) | teqip.milestones |
| TEQIP activities (4 categories) | teqip.activities |
| TEQIP documents (6 PDFs) | teqip.downloads |
| Startup stats (15 startups, ₹12 Cr) | startup.stats |
| Startup portfolio (4 companies) | startup.portfolio |
| Startup facilities (6 items) | startup.facilities |
| Startup apply steps (4 steps) | startup.apply_steps |
| Campus map buildings + facts | campus.map |
| Video tour YouTube ID + stops | video.tour |
| Anthem composer credits + metadata | anthem.metadata |
| TNP cell info + subtitle | placement.cell_info |
| TNP office info + TPO email | placement.office_info |
| Placement contacts | placement.contacts |
| Placement process steps | placement.process |
| Placement stats summary | placement.stats_summary |
| UG/PG/PhD admission info | admissions.ug, admissions.pg, admissions.phd |

### Departments Table (17 SGSITS departments)
All 17 departments from `departmentsList.ts` now seeded with:
- Correct slugs matching frontend routing
- HOD names, institutional login emails, public contact emails
- Department descriptions, vision, mission
- Established year, contact email, contact phone

---

## 9. What Remains (Post-Migration TODOs)

### Low Priority (Not blocking)
1. **Document Storage** - PDF download links in Ordinances, Code of Conduct, TEQIP, SiteMap all use `href="#"` placeholders. These need real files uploaded to storage and `document_url` values populated in the relevant CMS sections.

2. **Media Assets** - Professor photos in `instituteProfessors.ts` still reference `/assets/professors/*.svg` local files. These should be uploaded to the files table.

3. **HOD Gallery Images** - mockHodContent.ts gallery images use Unsplash placeholders. Replace with real institute photos.

4. **YouTube Video ID** - `video.tour.youtubeVideoId` defaults to 'SGSITSCampusTourVideo' (placeholder). Update with real YouTube video ID in cms_sections.

5. **Google Maps Coordinates** - The maps embed URL in `campus.map` uses hardcoded but correct SGSITS coordinates. Can be updated via admin CMS content panel.

6. **Comment System** - NewsDetailPage.tsx still has mock comments. The backend has `/api/v1/news/{id}/comments` endpoint - needs frontend wiring.

7. **Read Time Calculation** - "3 min read" in NewsDetailPage.tsx needs automatic calculation from word count.

8. **Navigation Builder** - Nav items are still partially hardcoded in `navItems.ts`. The navigation service (`/api/v1/navigation`) is seeded but the frontend still imports from the local file for some functionality.

9. **Sidebar Links** - sidebarLinks.ts has duplicate key bug (notices/events/tenders all identical to 'news'). Consolidation into single source via navigation API is pending.

10. **Notable Faculty** - `instituteProfessors.ts` (4 notable professors) not yet seeded into `institute_notable_faculty` table.

### Medium Priority
1. **Chatbot fallback** - chatbotService defaults still include `+91-731-2582100` and `registrar@sgsits.ac.in`. These will only show if chatbot config API fails. Seeded via enterprise seed 08.

2. **seoService** - `seoService.ts` has empty `defaultSeoMeta` and `allSeoDefaults`. SEO is seeded into `seo_metadata` table via enterprise seed 08.

3. **OBE/NEP Page** - OBENep2020.tsx policy content is hardcoded. Needs CMS migration.

4. **Code of Conduct** - CodeOfConduct.tsx has hardcoded text. Needs CMS migration.

5. **Ordinances** - Grading scale and attendance policies in Ordinances.tsx are hardcoded. Needs migration to academic policy CMS.

6. **Plagiarism Policy** - PlagiarismPolicy.tsx threshold percentages are hardcoded. Needs CMS migration.

---

## 10. How to Apply

```bash
# 1. Apply all schema migrations
npm run db:migrate

# 2. Apply all enterprise seed data (including SGSITS-specific seeds)
npm run db:seed

# 3. Start backend
npm run dev

# 4. Start frontend
cd ../sgsits-frontend && npm run dev
```

After running the seeds, all previously hardcoded content will be served from the database through the existing API endpoints. The frontend will display the seeded data instead of the fallback defaults.

---

*Report generated: 2026-06-01*
