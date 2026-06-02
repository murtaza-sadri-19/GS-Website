# SGSITS Frontend — Hardcoded Content Audit Report

---

## Executive Summary

| Metric | Count |
|--------|-------|
| Total files analyzed | 87 |
| Total hardcoded items identified | 612+ |
| Critical severity | 89 |
| High severity | 241 |
| Medium severity | 198 |
| Low severity | 84 |
| Missing backend API endpoints | 48 |
| Missing admin panel controls | 23 |

---

## Critical Issues (Fix First)

| Issue | File | Line | Content | Action Required |
|-------|------|------|---------|-----------------|
| HOD names, emails, phones for all 17 departments | departmentsList.ts | 14–173 | Dr. Nitish Gupta, nitish.nidhi75@gmail.com, +91-731-2582181 (x17 departments) | Replace with GET /api/v1/departments/{slug} |
| Anti-ragging contact email hardcoded | FirstYearInfo.tsx | 56 | antiranging@sgsits.ac.in | Move to contact config table |
| Helpline number hardcoded | FirstYearInfo.tsx | 55 | 1800-180-5522 | Move to config service |
| Institution name hardcoded in component | FirstYearInfo.tsx | 41 | Shri G. S. Institute of Technology & Science | Pull from brandingService |
| Institution name hardcoded in component | AboutInstitute.tsx | 44 | Shri Govindram Seksaria Institute of Technology & Science, Indore | Pull from brandingService |
| Founding year, narrative, affiliation hardcoded | AboutLanding.tsx | 233–246 | Established in 1952, AICTE approved, RGPV affiliated, Director quote | Move to CMS section about.overview |
| Mission statement hardcoded | AboutLanding.tsx | 257–260 | To impart quality technical education... | Move to CMS |
| Teacher portal CURRENT_TEACHER_ID hardcoded | mockTeacherContent.ts | 12 | 'F001' | Replace with auth JWT user ID — portal is broken for multi-user |
| Placement email hardcoded in JSX | LeadingCompanies.tsx | 161 | tpo@sgsits.ac.in | Move to contactService |
| Tender contact email + phone hardcoded | TendersPage.tsx | 14–18 | purchase@sgsits.ac.in, 0731-2582115 | Move to contactService |
| Privacy policy DPO contact | PrivacyPolicy.tsx | 38 | privacy@sgsits.ac.in, Park Road, Indore – 452003 | Move to policyService backend endpoint |
| Institution address hardcoded in four policy pages | PrivacyPolicy, Disclaimer, AccessibilityStatement, CopyrightPolicy | 38/40/39/38 | Park Road, Indore – 452003, Madhya Pradesh | Centralise in contactService |
| Chatbot fallback contains live phone + email | chatbotService.ts | 53 | +91-731-2582100, registrar@sgsits.ac.in | Move to backend chatbot config |
| Institution helpline in settingsService hardcoded | settingsService.ts | 90–92 | +91-731-2582100, registrar@sgsits.ac.in, institute code 1752 | Move to backend settings table |
| Full privacy policy content hardcoded as JS fallback | policyService.ts | 40–158 | Six complete policy documents (privacy, terms, disclaimer, accessibility, copyright, hyperlink) | Extract to seeds/policies.json; load via CMS init script |
| TEQIP contact email + phone in JSX | TeqipPage.tsx | 330–334 | teqip@sgsits.ac.in, 0731-2431234 Extn. 210 | Move to contactService |
| Startup cell contact in JSX | StartupCellPage.tsx | 113, 308–310 | startup@sgsits.ac.in, +91-731-2431300 | Move to contactService |
| Campus map contact + address in JSX | CampusMapPage.tsx | 46–51 | +91-731-2431000, info@sgsits.ac.in, 23 Park Road Indore 452003 | Move to contactService |
| TEQIP stats and milestone data hardcoded | TeqipPage.tsx | 9–45, 90–101 | ₹3.8 Cr grants, +38% placements, 10 milestones (2017–2021) | Move to CMS/backend TEQIP module |
| Startup portfolio stats hardcoded | StartupCellPage.tsx | 9–65 | 15 startups, ₹12 Cr, 80+ jobs, 3 patents | Move to backend startup_portfolio table |
| Anthem composer credits hardcoded | AnthemPage.tsx | 152–154 | Dr. R.K. Sharma, Pt. Ravi Shankar Das, Smt. Kavita Krishnamurthy | Move to CMS anthem section |
| Department statistics hardcoded in UI | DepartmentLanding.tsx | 113–116 | "17", "200+", "3,000+", "70+ Years" | Pull from GET /api/v1/departments/stats |
| Faculty email addresses exposed in source | mockPortalData.ts | 106–112 | rkpandey@sgsits.ac.in, sgupta@sgsits.ac.in (7 emails) | Serve exclusively via authenticated API |
| ERP portal URL hardcoded in JSX | ExamResults.tsx | 89 | https://erp.sgsitsindore.in | Move to settingsService.erpPortalUrl |

---

## Section 1 — Navigation & Menu Structure

### navItems.ts — All Hardcoded Entries

| Label | Path | Parent | Children | Why Dynamic | API Needed |
|-------|------|--------|----------|-------------|------------|
| Home | / | root | 0 | Route may change | No |
| About Us | — | root | 10 | Section may be renamed | No |
| About Institute | /about/institute | About Us | 0 | Content CMS-driven | GET /api/v1/pages/about-institute |
| Vision & Mission | /about/vision-mission | About Us | 0 | Content CMS-driven | GET /api/v1/pages/vision-mission |
| Director's Message | /about/director-message | About Us | 0 | Person changes | GET /api/v1/pages/director-message |
| Governing Body | /about/governing-body | About Us | 0 | Members change | GET /api/v1/pages/governing-body |
| Administration | /about/administration | About Us | 0 | Personnel changes | GET /api/v1/pages/administration |
| Administrative Committees | /about/committees | About Us | 0 | Composition changes | GET /api/v1/pages/administrative-committees |
| Telephone Directory | /about/telephone-directory | About Us | 0 | Numbers change frequently | GET /api/v1/pages/telephone-directory |
| Infrastructure | /about/infrastructure | About Us | 0 | Additions/updates | GET /api/v1/pages/infrastructure |
| IQAC Cell | /about/iqac | About Us | 0 | Reports/updates | GET /api/v1/pages/iqac |
| Academic Council | /about/academic-council | About Us | 0 | Members change | GET /api/v1/pages/academic-council |
| Accreditation (NBA/NAAC) | /about/accreditation | About Us | 0 | Cycle updates | GET /api/v1/pages/accreditation |
| Academics | — | root | 12 | Structure may change | No |
| Academic Calendar | /academics/calendar | Academics | 0 | Updated each session | GET /api/v1/academics/calendar |
| UG Courses | /academics/courses/ug | Academics | 0 | Programme additions | GET /api/v1/academics/courses?level=ug |
| PG Courses | /academics/courses/pg | Academics | 0 | Programme additions | GET /api/v1/academics/courses?level=pg |
| Ph.D. Programs | /academics/courses/phd | Academics | 0 | Research areas change | GET /api/v1/academics/courses?level=phd |
| PTDC Courses | /academics/courses/ptdc | Academics | 0 | Intake/eligibility changes | GET /api/v1/academics/courses?level=ptdc |
| Online Courses (MOOC) | /academics/courses/online | Academics | 0 | Platform partnerships change | GET /api/v1/academics/courses?level=online |
| First Year Info | /academics/first-year | Academics | 0 | Updated annually | GET /api/v1/academics/first-year |
| Exam & Results | /academics/exam-results | Academics | 0 | Schedule changes | GET /api/v1/academics/exam-results |
| Ordinances | /academics/ordinances | Academics | 0 | Regulatory updates | GET /api/v1/academics/ordinances |
| Plagiarism Policy | /academics/plagiarism-policy | Academics | 0 | Policy may update | GET /api/v1/pages/plagiarism-policy |
| Code of Ethics | /academics/code-of-conduct | Academics | 0 | Policy may update | GET /api/v1/pages/code-of-conduct |
| OBE & NEP 2020 | /academics/obe-nep-2020 | Academics | 0 | NEP implementation evolves | GET /api/v1/pages/obe-nep-2020 |
| Departments | — | root | 18 | Department count changes | No |
| All Departments | /departments | Departments | 0 | Dynamic listing | GET /api/v1/departments |
| Applied Chemistry & Chemical Technology | /departments/applied-chemistry | Departments | 0 | HOD/info changes | GET /api/v1/departments/applied-chemistry |
| Applied Mathematics | /departments/applied-mathematics | Departments | 0 | HOD/info changes | GET /api/v1/departments/applied-mathematics |
| Applied Physics | /departments/applied-physics | Departments | 0 | HOD/info changes | GET /api/v1/departments/applied-physics |
| Biomedical Engineering | /departments/biomedical | Departments | 0 | HOD/info changes | GET /api/v1/departments/biomedical |
| Civil Engineering | /departments/civil | Departments | 0 | HOD/info changes | GET /api/v1/departments/civil |
| Computer Engineering | /departments/computer | Departments | 0 | HOD/info changes | GET /api/v1/departments/computer |
| Computer Technology & Applications | /departments/cta | Departments | 0 | HOD/info changes | GET /api/v1/departments/cta |
| Electrical Engineering | /departments/electrical | Departments | 0 | HOD/info changes | GET /api/v1/departments/electrical |
| Electronics & Instrumentation | /departments/ei | Departments | 0 | HOD/info changes | GET /api/v1/departments/ei |
| Electronics & Telecommunication | /departments/et | Departments | 0 | HOD/info changes | GET /api/v1/departments/et |
| Humanities | /departments/humanities | Departments | 0 | HOD/info changes | GET /api/v1/departments/humanities |
| Industrial & Production Engineering | /departments/ipe | Departments | 0 | HOD/info changes | GET /api/v1/departments/ipe |
| Information Technology | /departments/it | Departments | 0 | HOD/info changes | GET /api/v1/departments/it |
| Management Studies | /departments/management | Departments | 0 | HOD/info changes | GET /api/v1/departments/management |
| Mechanical Engineering | /departments/mechanical | Departments | 0 | HOD/info changes | GET /api/v1/departments/mechanical |
| Pharmacy | /departments/pharmacy | Departments | 0 | HOD/info changes | GET /api/v1/departments/pharmacy |
| Centre of Excellence | /departments/coe | Departments | 0 | HOD/info changes | GET /api/v1/departments/coe |
| Admissions | — | root | 4 | Structure stable | No |
| UG Admissions | /admission/ug | Admissions | 0 | Intake/criteria change | GET /api/v1/admissions/ug |
| PG Admissions | /admission/pg | Admissions | 0 | Intake/criteria change | GET /api/v1/admissions/pg |
| Ph.D. Admissions | /admission/phd | Admissions | 0 | Intake/criteria change | GET /api/v1/admissions/phd |
| Prospectus Download | /admission/prospectus | Admissions | 0 | File changes yearly | GET /api/v1/admissions/prospectus |
| Placements | — | root | 4 | Structure stable | No |
| T&P Cell Overview | /placement/tnp-cell | Placements | 0 | Staff/data changes | GET /api/v1/placements/tnp-cell |
| Leading Recruiters | /placement/companies | Placements | 0 | Company list changes | GET /api/v1/placements/companies |
| Placement Record | /placement/record | Placements | 0 | Updated annually | GET /api/v1/placements/record |
| Placement Contacts | /placement/contact | Placements | 0 | Staff changes | GET /api/v1/placements/contacts |
| Campus Life | — | root | 6 | Structure stable | No |
| Student Activities | /students/activities | Campus Life | 0 | Events/clubs change | GET /api/v1/students/activities |
| Govt. Scholarships | /students/scholarship/govt | Campus Life | 0 | Schemes change | GET /api/v1/students/scholarship/govt |
| Institute Scholarships | /students/scholarship/institute | Campus Life | 0 | Amounts change | GET /api/v1/students/scholarship/institute |
| Sports & Games (SSS) | /students/sss | Campus Life | 0 | Events change | GET /api/v1/students/sss |
| NCC Wing | /students/ncc | Campus Life | 0 | Activities change | GET /api/v1/students/ncc |
| NSS Wing | /students/nss | Campus Life | 0 | Programmes change | GET /api/v1/students/nss |
| Facilities | — | root | 12 | Structure stable | No |
| Computer Center | /facilities/computer-center | Facilities | 0 | Specs change | GET /api/v1/facilities/computer-center |
| Central Library | /facilities/library | Facilities | 0 | Stats change | GET /api/v1/facilities/library |
| Central Workshop | /facilities/workshop | Facilities | 0 | Equipment changes | GET /api/v1/facilities/workshop |
| Gymnasium | /facilities/gymnasium | Facilities | 0 | Details change | GET /api/v1/facilities/gymnasium |
| Dispensary | /facilities/dispensary | Facilities | 0 | Details change | GET /api/v1/facilities/dispensary |
| CIDI Center | /facilities/cidi | Facilities | 0 | Programme changes | GET /api/v1/facilities/cidi |
| Sports Complex | /facilities/sports | Facilities | 0 | Facilities change | GET /api/v1/facilities/sports |
| Boys Hostel | /facilities/hostel/boys | Facilities | 0 | Capacity changes | GET /api/v1/facilities/hostel/boys |
| Girls Hostel | /facilities/hostel/girls | Facilities | 0 | Capacity changes | GET /api/v1/facilities/hostel/girls |
| Transit Hostel | /facilities/hostel/transit | Facilities | 0 | Availability changes | GET /api/v1/facilities/hostel/transit |
| Staff Quarters | /facilities/hostel/staff | Facilities | 0 | Availability changes | GET /api/v1/facilities/hostel/staff |
| AICTE IDEA Lab | /facilities/idea-lab | Facilities | 0 | Equipment/programmes change | GET /api/v1/facilities/idea-lab |
| More | — | root | 7 | Structure stable | No |
| Startup & Incubation Cell | /startup-cell | More | 0 | Portfolio changes | GET /api/v1/startup |
| TEQIP Portal | /teqip/about | More | 8 | Content updates | GET /api/v1/teqip/* |
| Latest Notices | /notices | More | 0 | Live feed | GET /api/v1/notices |
| Campus News | /news | More | 0 | Live feed | GET /api/v1/news |
| Upcoming Events | /events | More | 0 | Live feed | GET /api/v1/events |
| Procurement Tenders | /tenders | More | 0 | Live feed | GET /api/v1/tenders |
| Contact Us | /contact | More | 0 | Contact info changes | GET /api/v1/contact |

### sidebarLinks.ts — Structural Issues

| Key | Items | Notes | Issue |
|-----|-------|-------|-------|
| about | 11 labels | Matches navItems | Duplicate source of truth |
| academics | 12 labels | Matches navItems | Duplicate source of truth |
| admission | 4 labels | Matches navItems | Duplicate source of truth |
| placement | 4 labels | Matches navItems | Duplicate source of truth |
| students | 6 labels | Matches navItems | Duplicate source of truth |
| facilities | 12 labels | Matches navItems | Duplicate source of truth |
| explore | 4 labels | Campus Map, Photo Gallery, Video Tour, SGSITS Anthem | Not in navItems.ts — missing nav integration |
| teqip | 8 labels | TEQIP-specific pages | Not in navItems.ts |
| news | 4 labels | News/Notices/Events/Tenders | Matches navItems |
| notices | 4 labels | Identical array to 'news' key | Bug: duplicate, should be distinct |
| events | 4 labels | Identical array to 'news' key | Bug: duplicate, should be distinct |
| tenders | 4 labels | Identical array to 'news' key | Bug: duplicate, should be distinct |

### departmentsList.ts — Critical Hardcoded Institution Data

| Department | Slug | HOD Name | HOD Email | HOD Phone | Faculty Count | Priority |
|------------|------|----------|-----------|-----------|---------------|----------|
| Applied Chemistry & Chemical Technology | applied-chemistry | Dr. Nitish Gupta | nitish.nidhi75@gmail.com | +91-731-2582181 | 8 | CRITICAL |
| Applied Mathematics | applied-mathematics | Dr. Smita Verma | yvsmita@gmail.com | — | 10 | CRITICAL |
| Applied Physics | applied-physics | Dr. Joseph Thomas Andrews | jtandrews@gmail.com | — | 9 | CRITICAL |
| Biomedical Engineering | biomedical | Ms. Vibha Bhatnagar | vbhatnagar@sgsits.ac.in | — | 7 | CRITICAL |
| Civil Engineering | civil | Dr. R.K. Khare | rakeshkhare@hotmail.com | 9425053428 | 12 | CRITICAL |
| Computer Engineering | computer | Dr. Urjita Thakar | thakarurjita@gmail.com | 0731-2582401 | 15 | CRITICAL |
| Computer Technology & Applications | cta | Dr. Sunita Varma | svarma1@sgsits.ac.in | — | 8 | CRITICAL |
| Electrical Engineering | electrical | Dr. H.K. Verma | hverma@sgsits.ac.in | — | 11 | CRITICAL |
| Electronics & Instrumentation | ei | Dr. R.C. Gurjar | rcgurjar94@gmail.com | — | 9 | CRITICAL |
| Electronics & Telecommunication | et | Dr. Satish Jain | satishjain.jain@gmail.com | — | 13 | CRITICAL |
| Humanities | humanities | Dr. Neeraj Jain | Asaus343@gmail.com | — | 6 | CRITICAL |
| Industrial & Production Engineering | ipe | Dr. Girish Thakar | thakargirish@yahoo.com | — | 10 | CRITICAL |
| Information Technology | it | Dr. K.K. Sharma | kkssgs@gmail.com | 0731-2582260 | 14 | CRITICAL |
| Management Studies | management | Dr. R.C. Gupta | rcgupta.indore@gmail.com | — | 8 | CRITICAL |
| Mechanical Engineering | mechanical | Dr. B.R. Rawal | brrawal@gmail.com | — | 13 | CRITICAL |
| Pharmacy | pharmacy | Dr. Vineet Singh | vchauhan@sgsits.ac.in | — | 7 | CRITICAL |
| Centre of Excellence | coe | Dr. Neeraj Jain | Asaus343@gmail.com | — | 5 | CRITICAL |

---

## Section 2 — Landing Page Cards (All 7 Sections)

### AboutLanding.tsx — QUICK_CARDS (Lines 53–65)

| Card Title | Description | Path | Badge | File:Line | API Needed |
|------------|-------------|------|-------|-----------|------------|
| About Institute | — | /about/institute | — | AboutLanding.tsx:53 | GET /api/v1/pages/about-institute |
| Vision & Mission | — | /about/vision-mission | — | AboutLanding.tsx:53 | GET /api/v1/pages/vision-mission |
| Director's Message | — | /about/director-message | — | AboutLanding.tsx:53 | GET /api/v1/pages/director-message |
| Administration | — | /about/administration | — | AboutLanding.tsx:53 | GET /api/v1/pages/administration |
| Governing Body | — | /about/governing-body | — | AboutLanding.tsx:53 | GET /api/v1/pages/governing-body |
| Committees | — | /about/committees | — | AboutLanding.tsx:53 | GET /api/v1/pages/administrative-committees |
| Telephone Directory | — | /about/telephone-directory | — | AboutLanding.tsx:53 | GET /api/v1/pages/telephone-directory |
| Infrastructure | — | /about/infrastructure | — | AboutLanding.tsx:53 | GET /api/v1/pages/infrastructure |
| Academic Council | — | /about/academic-council | — | AboutLanding.tsx:53 | GET /api/v1/pages/academic-council |
| Accreditation (NBA/NAAC) | — | /about/accreditation | — | AboutLanding.tsx:53 | GET /api/v1/pages/accreditation |
| IQAC Cell | — | /about/iqac | — | AboutLanding.tsx:53 | GET /api/v1/pages/iqac |

### AboutLanding.tsx — STATS (Lines 68–73)

| Stat Value | Label | File:Line | Priority | API Needed |
|------------|-------|-----------|----------|------------|
| 70 | Years of Excellence | AboutLanding.tsx:68 | HIGH | GET /api/v1/institution/stats |
| 5000 | Students Enrolled | AboutLanding.tsx:68 | HIGH | GET /api/v1/institution/stats |
| 20 | Departments | AboutLanding.tsx:68 | HIGH | GET /api/v1/departments/count |
| 300 | Faculty & Staff | AboutLanding.tsx:68 | HIGH | GET /api/v1/institution/stats |

### AboutLanding.tsx — TIMELINE (Lines 75–82)

| Year | Title | Description | File:Line | Priority |
|------|-------|-------------|-----------|----------|
| 1952 | Institute Founded | SGSITS established as a premier technical institute in Indore, M.P. | AboutLanding.tsx:75 | CRITICAL |
| 1975 | Campus Expansion | — | AboutLanding.tsx:75 | HIGH |
| 1990 | Autonomous Status | — | AboutLanding.tsx:75 | HIGH |
| 2000 | NBA Accreditation | — | AboutLanding.tsx:75 | HIGH |
| 2015 | NAAC Grading | — | AboutLanding.tsx:75 | HIGH |
| 2024 | Innovation Center | — | AboutLanding.tsx:75 | HIGH |

### AboutLanding.tsx — HIGHLIGHTS (Lines 84–91)

| Title | Description | File:Line | Priority |
|-------|-------------|-----------|----------|
| Computer Laboratories | 1000+ workstations with high-speed internet | AboutLanding.tsx:84 | HIGH |
| Central Library | 80,000+ books, journals and digital resources | AboutLanding.tsx:84 | HIGH |
| Research Labs | Advanced facilities across all engineering disciplines | AboutLanding.tsx:84 | HIGH |
| Sports Complex | Indoor and outdoor sports facilities | AboutLanding.tsx:84 | HIGH |
| Auditorium | 2000-seat auditorium for events and seminars | AboutLanding.tsx:84 | HIGH |
| Innovation Hub | AICTE IDEA Lab with 3D printers and IoT kits | AboutLanding.tsx:84 | HIGH |

### AcademicsLanding.tsx — Cards (Lines 6–19)

| Card Title | Path | Badge | File:Line | API Needed |
|------------|------|-------|-----------|------------|
| Academic Calendar | /academics/calendar | — | AcademicsLanding.tsx:6 | GET /api/v1/academics/calendar |
| UG Courses | /academics/courses/ug | — | AcademicsLanding.tsx:6 | GET /api/v1/academics/courses?level=ug |
| PG Courses | /academics/courses/pg | — | AcademicsLanding.tsx:6 | GET /api/v1/academics/courses?level=pg |
| Ph.D. Programs | /academics/courses/phd | — | AcademicsLanding.tsx:6 | GET /api/v1/academics/courses?level=phd |
| PTDC Courses | /academics/courses/ptdc | — | AcademicsLanding.tsx:6 | GET /api/v1/academics/courses?level=ptdc |
| Online Courses (MOOC) | /academics/courses/online | — | AcademicsLanding.tsx:6 | GET /api/v1/academics/courses?level=online |
| First Year Info | /academics/first-year | New Students | AcademicsLanding.tsx:6 | GET /api/v1/academics/first-year |
| Exam & Results | /academics/exam-results | — | AcademicsLanding.tsx:6 | GET /api/v1/academics/exam-results |
| Ordinances | /academics/ordinances | — | AcademicsLanding.tsx:6 | GET /api/v1/academics/ordinances |
| Plagiarism Policy | /academics/plagiarism-policy | — | AcademicsLanding.tsx:6 | GET /api/v1/pages/plagiarism-policy |
| Code of Ethics | /academics/code-of-conduct | — | AcademicsLanding.tsx:6 | GET /api/v1/pages/code-of-conduct |
| OBE & NEP 2020 | /academics/obe-nep-2020 | — | AcademicsLanding.tsx:6 | GET /api/v1/pages/obe-nep-2020 |

### AdmissionsLanding.tsx — Cards (Lines 6–11)

| Card Title | Path | Badge | File:Line | API Needed |
|------------|------|-------|-----------|------------|
| UG Admissions | /admission/ug | JEE Mains | AdmissionsLanding.tsx:6 | GET /api/v1/admissions/ug |
| PG Admissions | /admission/pg | GATE / MAT | AdmissionsLanding.tsx:6 | GET /api/v1/admissions/pg |
| Ph.D. Admissions | /admission/phd | — | AdmissionsLanding.tsx:6 | GET /api/v1/admissions/phd |
| Prospectus Download | /admission/prospectus | PDF | AdmissionsLanding.tsx:6 | GET /api/v1/admissions/prospectus |

### PlacementsLanding.tsx — Cards (Lines 6–11)

| Card Title | Path | Badge | File:Line | API Needed |
|------------|------|-------|-----------|------------|
| T&P Cell Overview | /placement/tnp-cell | — | PlacementsLanding.tsx:6 | GET /api/v1/placements/tnp-cell |
| Leading Recruiters | /placement/companies | — | PlacementsLanding.tsx:6 | GET /api/v1/placements/companies |
| Placement Record | /placement/record | — | PlacementsLanding.tsx:6 | GET /api/v1/placements/record |
| Placement Contacts | /placement/contact | — | PlacementsLanding.tsx:6 | GET /api/v1/placements/contacts |

### CampusLifeLanding.tsx — Cards (Lines 7–12)

| Card Title | Description | Path | File:Line | API Needed |
|------------|-------------|------|-----------|------------|
| Student Activities | Clubs, technical fests, cultural events, and co-curricular activities. | /students/activities | CampusLifeLanding.tsx:7 | GET /api/v1/students/activities |
| Govt. Scholarships | Government scholarships, financial aid schemes, and eligibility criteria. | /students/scholarship/govt | CampusLifeLanding.tsx:8 | GET /api/v1/students/scholarship/govt |
| Institute Scholarships | Merit-based and need-based scholarships for enrolled SGSITS students. | /students/scholarship/institute | CampusLifeLanding.tsx:9 | GET /api/v1/students/scholarship/institute |
| Sports & Games (SSS) | Sports & Student Services facilities, teams, achievements and annual events. | /students/sss | CampusLifeLanding.tsx:10 | GET /api/v1/students/sss |
| NCC Wing | National Cadet Corps — develop leadership, discipline and patriotic values. | /students/ncc | CampusLifeLanding.tsx:11 | GET /api/v1/students/ncc |
| NSS Wing | Community service, health camps, and social initiatives through the NSS. | /students/nss | CampusLifeLanding.tsx:12 | GET /api/v1/students/nss |

### FacilitiesLanding.tsx — Cards (Lines 7–18)

| Card Title | Description | Path | Badge | File:Line | API Needed |
|------------|-------------|------|-------|-----------|------------|
| Computer Center | High-speed internet and modern workstations across campus labs. | /facilities/computer-center | — | FacilitiesLanding.tsx:7 | GET /api/v1/facilities/computer-center |
| Central Library | A vast collection of books, journals, e-resources and reading rooms. | /facilities/library | — | FacilitiesLanding.tsx:8 | GET /api/v1/facilities/library |
| Central Workshop | Practical training in machining, welding, and fabrication. | /facilities/workshop | — | FacilitiesLanding.tsx:9 | GET /api/v1/facilities/workshop |
| Gymnasium | Modern gymnasium with professional equipment for fitness and wellness. | /facilities/gymnasium | — | FacilitiesLanding.tsx:10 | GET /api/v1/facilities/gymnasium |
| Dispensary | On-campus health dispensary for first aid and basic medical care. | /facilities/dispensary | — | FacilitiesLanding.tsx:11 | GET /api/v1/facilities/dispensary |
| CIDI Center | Centre for Innovation, Design and Incubation fostering entrepreneurship. | /facilities/cidi | — | FacilitiesLanding.tsx:12 | GET /api/v1/facilities/cidi |
| Sports Complex | Outdoor and indoor sports facilities including courts, tracks and grounds. | /facilities/sports | — | FacilitiesLanding.tsx:13 | GET /api/v1/facilities/sports |
| Boys Hostel | Comfortable and secure hostel with mess facilities for male students. | /facilities/hostel/boys | — | FacilitiesLanding.tsx:14 | GET /api/v1/facilities/hostel/boys |
| Girls Hostel | Safe and well-equipped hostel with mess facilities for female students. | /facilities/hostel/girls | — | FacilitiesLanding.tsx:15 | GET /api/v1/facilities/hostel/girls |
| Transit Hostel | Short-stay accommodation for visiting faculty, guests, and candidates. | /facilities/hostel/transit | — | FacilitiesLanding.tsx:16 | GET /api/v1/facilities/hostel/transit |
| Staff Quarters | Residential quarters for faculty and non-teaching staff on campus. | /facilities/hostel/staff | — | FacilitiesLanding.tsx:17 | GET /api/v1/facilities/hostel/staff |
| AICTE IDEA Lab | Innovation lab with 3D printers, IoT kits and maker-space resources. | /facilities/idea-lab | AICTE | FacilitiesLanding.tsx:18 | GET /api/v1/facilities/idea-lab |

### MoreLanding.tsx — Cards (Lines 7–13)

| Card Title | Description | Path | Badge | File:Line | API Needed |
|------------|-------------|------|-------|-----------|------------|
| Startup & Incubation Cell | Startup ecosystem, incubation support and entrepreneurship programmes. | /startup-cell | — | MoreLanding.tsx:7 | GET /api/v1/startup |
| TEQIP Portal | Technical Education Quality Improvement Programme initiatives. | /teqip/about | — | MoreLanding.tsx:8 | GET /api/v1/teqip/about |
| Latest Notices | Official notices, circulars, and announcements from the institute. | /notices | Live | MoreLanding.tsx:9 | GET /api/v1/notices |
| Campus News | Latest news, achievements, awards, and events across the SGSITS campus. | /news | — | MoreLanding.tsx:10 | GET /api/v1/news |
| Upcoming Events | Seminars, workshops, technical fests and cultural programmes on campus. | /events | — | MoreLanding.tsx:11 | GET /api/v1/events |
| Procurement Tenders | Active procurement tenders and official vendor notices from the institute. | /tenders | — | MoreLanding.tsx:12 | GET /api/v1/tenders |
| Contact Us | Reach out via phone, email, or visit us at our campus in Indore, M.P. | /contact | — | MoreLanding.tsx:13 | GET /api/v1/contact |

---

## Section 3 — Service Defaults & Institution Configuration

### footerService.ts

| Variable | Content | File:Line | Priority | Backend Endpoint |
|----------|---------|-----------|----------|-----------------|
| shortCode | 'SG' | footerService.ts:139 | MEDIUM | GET /api/v1/settings/cms/branding |
| estYear | 'Est. 1952' | footerService.ts:140 | MEDIUM | GET /api/v1/settings/cms/branding |
| instituteName | 'Shri G. S. Institute of Technology & Science' | footerService.ts:141 | CRITICAL | GET /api/v1/settings/cms/branding |
| shortName | 'SGSITS INDORE' | footerService.ts:142 | HIGH | GET /api/v1/settings/cms/branding |
| tagline | 'An Institute of National Standing' | footerService.ts:143 | HIGH | GET /api/v1/settings/cms/branding |
| subTagline | 'Govt. Aided Autonomous Institute, Indore (M.P.) - Estd. 1952' | footerService.ts:144 | HIGH | GET /api/v1/settings/cms/branding |
| logoUrl | '/assets/image.png' | footerService.ts:146 | HIGH | GET /api/v1/settings/cms/branding |
| logoAlt | 'SGSITS Indore Logo' | footerService.ts:147 | HIGH | GET /api/v1/settings/cms/branding |
| address | '23, Park Road, Indore (M.P.) - 452003' | footerService.ts:151 | CRITICAL | GET /api/v1/contact |
| city | 'Indore' | footerService.ts:152 | MEDIUM | GET /api/v1/contact |
| phone | '0731-2541370' | footerService.ts:153 | CRITICAL | GET /api/v1/contact |
| fax | '0731-2541370' | footerService.ts:154 | CRITICAL | GET /api/v1/contact |
| email | 'info@sgsits.ac.in' | footerService.ts:155 | CRITICAL | GET /api/v1/contact |
| website | 'www.sgsits.ac.in' | footerService.ts:156 | CRITICAL | GET /api/v1/settings/cms/branding |
| copyrightText | '© 2025 SGSITS Indore. All rights reserved.' | footerService.ts:187 | HIGH | GET /api/v1/settings/cms/branding |
| title (SEO) | 'SGSITS Indore — An Institute of National Standing' | footerService.ts:204 | HIGH | GET /api/v1/settings/seo |

### settingsService.ts

| Variable | Content | File:Line | Priority | Backend Endpoint |
|----------|---------|-----------|----------|-----------------|
| helpline | '+91-731-2582100' | settingsService.ts:90 | CRITICAL | GET /api/v1/settings |
| email | 'registrar@sgsits.ac.in' | settingsService.ts:91 | CRITICAL | GET /api/v1/settings |
| instituteCode | '1752' | settingsService.ts:92 | CRITICAL | GET /api/v1/settings |
| erpPortalUrl | 'https://www.sgsits.ac.in' | settingsService.ts:93 | HIGH | GET /api/v1/settings |
| erpPortalLabel | 'ERP Portal' | settingsService.ts:94 | MEDIUM | GET /api/v1/settings |

### chatbotService.ts

| Variable | Content | File:Line | Priority | Backend Endpoint |
|----------|---------|-----------|----------|-----------------|
| botName | 'Sara' | chatbotService.ts:49 | HIGH | GET /api/v1/settings/cms/chatbot |
| avatarUrl | '/assets/image.png' | chatbotService.ts:50 | HIGH | GET /api/v1/settings/cms/chatbot |
| welcomeMessage | "Hello! I'm Sara, the University's Official AI Assistant..." | chatbotService.ts:51 | HIGH | GET /api/v1/settings/cms/chatbot |
| inputPlaceholder | 'Ask Sara about admissions, exams, placements...' | chatbotService.ts:52 | MEDIUM | GET /api/v1/settings/cms/chatbot |
| fallbackMessage | Contains +91-731-2582100 and registrar@sgsits.ac.in | chatbotService.ts:53 | CRITICAL | GET /api/v1/settings/cms/chatbot |
| quickPrompts[0] | 'How to apply for admission?' | chatbotService.ts:54 | MEDIUM | GET /api/v1/settings/cms/chatbot |
| quickPrompts[1] | 'Placement statistics?' | chatbotService.ts:55 | MEDIUM | GET /api/v1/settings/cms/chatbot |
| quickPrompts[2] | 'Exam schedule?' | chatbotService.ts:56 | MEDIUM | GET /api/v1/settings/cms/chatbot |
| quickPrompts[3] | 'Hostel facilities?' | chatbotService.ts:57 | MEDIUM | GET /api/v1/settings/cms/chatbot |
| quickPrompts[4] | 'Contact information?' | chatbotService.ts:58 | MEDIUM | GET /api/v1/settings/cms/chatbot |

### policyService.ts — Full Hardcoded Fallback Policies

| Policy | Lines | Contact Embedded | Dates Embedded | Priority |
|--------|-------|-----------------|----------------|----------|
| Privacy Policy | 41–80 | privacy@sgsits.ac.in | Jan 15 2025 / Feb 1 2025 | CRITICAL |
| Terms of Use | 82–97 | itcell@sgsits.ac.in | Jan 15 2025 / Feb 1 2025 | CRITICAL |
| Disclaimer | 99–112 | registrar@sgsits.ac.in | Jan 15 2025 | CRITICAL |
| Accessibility Statement | 114–127 | itcell@sgsits.ac.in | Jan 15 2025 | CRITICAL |
| Copyright Policy | 129–142 | registrar@sgsits.ac.in | Jan 15 2025 | CRITICAL |
| Hyperlink Policy | 144–157 | itcell@sgsits.ac.in | Jan 15 2025 | CRITICAL |

### Services Using Correct Empty-Default Pattern (No Action Needed)

| Service | Defaults | Status |
|---------|---------|--------|
| aboutService.ts | 10 empty defaults | Correct pattern |
| academicsService.ts | 5 empty defaults | Correct pattern |
| placementService.ts | 7 empty defaults | Correct pattern |
| studentsService.ts | 6 empty defaults | Correct pattern |
| facilitiesService.ts | 12 empty defaults | Correct pattern |
| navigationService.ts | 4 empty defaults | Correct pattern |
| contentService.ts | homePageDefaults with empty shape | Correct pattern |
| brandingService.ts | EMPTY_BRANDING with empty strings | Correct pattern |
| uiLabelsService.ts | uiLabelsDefaults with empty nested objects | Correct pattern |

---

## Section 4 — Mock Data Files

### mockPortalData.ts

| Data Structure | Item Count | Key Content | Pages Using It | DB Table Required | Urgency |
|----------------|-----------|-------------|----------------|------------------|---------|
| SESSIONS | 4 | Jan 2026–Jun 2026 (active), 3 prior sessions | examService.ts, all dashboards | sessions | HIGH |
| BRANCHES | 8 | CSE, IT, ECE, EE, ME, CE, CH, IPE with HOD names and faculty counts | exam/HOD portals | branches | CRITICAL |
| COURSES | 9 | CSE-BE, IT-BE, ECE-BE, etc. with semester ranges | exam portals | courses | HIGH |
| SUBJECTS | 10 | CS301–EC301, semester 3–7, faculty assignments | marks portal | subjects | HIGH |
| FACULTY_MEMBERS | 7 | Dr. Rajesh Kumar Pandey (rkpandey@sgsits.ac.in), etc. | all staff portals | faculty_members | CRITICAL |
| STUDENTS | 10 | Enrollment 0901CS21001–0901IT21002, names, emails | student portals | students | CRITICAL |
| REGISTRATION_REQUESTS | 4 | Dr. Neha Bajpai (pending), Prof. Saurabh Jain (approved), etc. | admin portal | registration_requests | MEDIUM |
| MARKS_REQUESTS | 5 | CS301 (pending), CS302 (submitted), CS401 (overdue) | exam portal | marks_requests | MEDIUM |
| CORRECTION_REQUESTS | 2 | CR001 (pending), CR002 (approved) | exam portal | correction_requests | MEDIUM |
| ELECTIVE_SUBJECTS | 4 | CS502 Machine Learning, CS503 Cloud Computing, etc. | HOD portal | elective_subjects | MEDIUM |

### mockHodData.ts

| Data Structure | Item Count | Key Content | Pages Using It | DB Table Required | Urgency |
|----------------|-----------|-------------|----------------|------------------|---------|
| LEAVE_APPLICATIONS | 5 | Prof. Sunita Gupta (Casual, pending), Dr. Priya Saxena (Medical, approved), etc. | hod/leaves | leave_applications | HIGH |
| TIMETABLE_SLOTS | 7 | TT001–TT007, Mon–Fri, periods 0–2, CSE Sem 3–5 | hod/timetable | timetable_slots | HIGH |
| DEPT_NOTICES | 5 | DN001 Exam Invigilation (pinned), DN002 Electives (pinned), etc. | hod/notices | department_notices | MEDIUM |
| ATTENDANCE_SUMMARY | 3 | CSE Sem 5A: 84%, Sem 5B: 82%, Sem 3A: 88% with defaulter lists | hod/attendance | attendance_summary | HIGH |
| DEPT_RESULT_SUMMARY | 3 | CSE Sem 4A: 93.5% pass, Sem 4B: 90% pass, Sem 2A: 95.3% pass | hod/results | dept_result_summary | MEDIUM |

### mockHodContent.ts

| Data Structure | Item Count | Key Content | Pages Using It | DB Table Required | Urgency |
|----------------|-----------|-------------|----------------|------------------|---------|
| DEPT_PROFILE | 1 | CSE, Established 1986, Prof. A.K. Sachan, hod.cse@sgsits.ac.in, +91 731 2582165 | HodProfile page | department_profiles | CRITICAL |
| HOD_NOTICES | 6 | HN001–HN006, exam invigilation, electives, FDP, syllabus, library, viva (draft) | HodNotices.tsx | hod_notices | MEDIUM |
| HOD_DOWNLOADS | 7 | DL001 Syllabus Sem V, DL002 OS Lab Manual, etc. | HodDownloads.tsx | hod_downloads | MEDIUM |
| HOD_EVENTS | 5 | EV001 FDP ML (Jun 10–14), EV003 Hackathon 2026 (Jul 12–13), etc. | HodEvents.tsx | hod_events | MEDIUM |
| HOD_GALLERY | 5 | GA001 TechFest Day 1 (48 images), GA002 AI Lab (22 images), etc. | HodGallery.tsx | hod_gallery + images | LOW |
| HOD_LABS | 6 | LAB001–LAB006: Programming Lab I, AI/ML (GPU), Cyber Security, etc. | HodLabs.tsx | hod_labs | MEDIUM |
| HOD_ACHIEVEMENTS | 7 | AC001 SIH 2025 winners, AC002 NAAC A+, AC005 DST grant ₹38L, etc. | HodAchievements.tsx | hod_achievements | LOW |

### mockTeacherContent.ts

| Data Structure | Item Count | Key Content | Pages Using It | DB Table Required | Urgency |
|----------------|-----------|-------------|----------------|------------------|---------|
| CURRENT_TEACHER_ID | 1 | 'F001' — BLOCKER for multi-user | All faculty pages | Use JWT auth user ID | CRITICAL |
| TEACHER_PROFILE | 1 | Dr. Rajesh Kumar Pandey, rkpandey@sgsits.ac.in, +91 98765 43210, CSE Block Room 302 | TeacherProfile.tsx | teacher_profiles | CRITICAL |
| TEACHER_PUBLICATIONS | 7 | PUB001–PUB007: IEEE papers, STOC conf, ACM Journal, Manning book, patents | TeacherPublications.tsx | teacher_publications | MEDIUM |
| TEACHER_RESEARCH | 5 | RES001–RES005: DST grant ₹38L (ongoing), SERB ₹12L (completed), etc. | TeacherResearch.tsx | teacher_research_projects | MEDIUM |
| TEACHER_QUALIFICATIONS | 5 | Ph.D. IIT Bombay 2009, M.Tech IIT Kanpur 2005, GATE 2003 AIR 142 | TeacherQualifications.tsx | teacher_qualifications | MEDIUM |
| SUBJECT_COS | 3 subjects | CS301 (4 COs), CS303 (3 COs), CS401 (4 COs) | TeacherSubjects.tsx | course_outcomes | MEDIUM |

### instituteProfessors.ts

| Data Structure | Item Count | Key Content | Pages Using It | DB Table Required | Urgency |
|----------------|-----------|-------------|----------------|------------------|---------|
| instituteProfessors | 4 | Junjhunwala Ashok (2014, EE), Pradeep T (2015, Chemistry), Murty B S (2016, Materials), Krishnakumar R (2017, Design) | Public faculty showcase | institute_notable_faculty | LOW |

### mockStore.ts — Seed Data Inventory

| Category | Seed Count | Notable Items | DB Table Required | Urgency |
|----------|-----------|---------------|------------------|---------|
| Notices | 14 | B.Tech 2025 admission, exam results, tenders, anti-ragging | notices | HIGH |
| News Articles | 8 | DST grant, ₹45L package, NIRF #1, Tata MOU | news_articles | HIGH |
| Events | 6 | Institute Day 2025, TechFest Invictus, Research Symposium | events | MEDIUM |
| Tenders | 5 | Lab equipment ₹12L, Mess catering ₹38L, Civil renovation ₹75L | tenders | MEDIUM |
| Alerts | 4 | Admissions, recruitment rolling ad, exam dates, TechFest | alerts | MEDIUM |
| Faculty Directory | 8 | Dr. Urjita Thakar, K.K. Sharma, H.K. Verma, etc. | faculty_directory | HIGH |
| Gallery Albums | 6 | Convocation 2024, TechFest, Sports Day, Campus views | gallery_albums + images | LOW |
| Placement Records | 5 years | 2023-24: 1820 placed, 245 companies, ₹45L highest, ₹6.8L avg | placement_records | MEDIUM |
| About Institute | 1 | Founded 1952, 200+ faculty, 3,00,000+ alumni, 17 departments, 52 acres, NAAC A | about_institute | CRITICAL |
| Site Config | Multiple | Branding, nav, footer, SEO, chatbot, UI labels | site_config | MEDIUM |

---

## Section 5 — Public Pages Hardcoded Content

| File | Element | Content | Line | Priority | Backend Source |
|------|---------|---------|------|----------|----------------|
| AboutInstitute.tsx | Institution name | "Shri Govindram Seksaria Institute of Technology & Science, Indore" | 44 | CRITICAL | GET /api/v1/settings/cms/branding |
| AboutInstitute.tsx | Section label | "Institute Overview" | 39 | MEDIUM | CMS |
| AboutInstitute.tsx | Section label | "Key Highlights" | 65 | MEDIUM | CMS |
| AboutInstitute.tsx | Section label | "Affiliations & Recognition" | 96 | MEDIUM | CMS |
| Committees.tsx | Section header | "Administrative Committees" | 46 | MEDIUM | CMS |
| Committees.tsx | Modal subtitle | "Committee Members List" | 85 | MEDIUM | CMS |
| CustomAboutPage.tsx | Color constant | #0b2545 (repeated 4x) | 58, 123, 137, 151 | MEDIUM | CSS variable |
| CustomAboutPage.tsx | Color constant | #bfa15f | 120 | MEDIUM | CSS variable |
| CustomAboutPage.tsx | Section label | "Institute Profile" | 77 | MEDIUM | CMS |
| CustomAboutPage.tsx | Section label | "Key Markers" | 108 | MEDIUM | CMS |
| FirstYearInfo.tsx | Checklist data | 8 hardcoded first-week activities | 6–14 | HIGH | GET /api/v1/academics/first-year |
| FirstYearInfo.tsx | Subjects data | 8 hardcoded first-year subjects with credit hours | 16–25 | HIGH | GET /api/v1/academics/first-year |
| FirstYearInfo.tsx | Institution name | "Shri G. S. Institute of Technology & Science" | 41 | CRITICAL | GET /api/v1/settings/cms/branding |
| FirstYearInfo.tsx | Anti-ragging helpline | 1800-180-5522 | 55 | CRITICAL | GET /api/v1/contact |
| FirstYearInfo.tsx | Anti-ragging email | antiranging@sgsits.ac.in | 56 | CRITICAL | GET /api/v1/contact |
| FirstYearInfo.tsx | Dean Student Welfare phone | 0731-2582105 | 123 | CRITICAL | GET /api/v1/contact |
| FirstYearInfo.tsx | Exam Cell phone | 0731-2582106 | 127 | CRITICAL | GET /api/v1/contact |
| FirstYearInfo.tsx | Hostel Administration phone | 0731-2582220 | 131 | CRITICAL | GET /api/v1/contact |
| FirstYearInfo.tsx | Dispensary phone | 0731-2582210 | 135 | CRITICAL | GET /api/v1/contact |
| OBENep2020.tsx | Policy content text | "SGSITS has adopted Outcome-Based Education (OBE) framework..." | 14–17 | MEDIUM | CMS |
| CodeOfConduct.tsx | Anti-ragging policy text | "SGSITS enforces a strict zero-tolerance policy towards ragging..." | 14 | CRITICAL | CMS |
| CodeOfConduct.tsx | Alert banner text | "Ragging in any form is a severe criminal offense under State and Central legislation..." | 53 | CRITICAL | CMS |
| CodeOfConduct.tsx | PDF link | href="#" (non-functional placeholder) | 96 | HIGH | Document storage URL |
| Ordinances.tsx | Grading system | 10-point CGPA scale (O=90-100, A+=80-89, etc.) | 6–14 | CRITICAL | Academic policy table |
| Ordinances.tsx | Document list | 4 ordinance PDFs with file sizes (1.8MB–2.8MB) | 16–21 | HIGH | Document storage |
| Ordinances.tsx | Attendance policy | 75% minimum mandatory | 50 | CRITICAL | Academic policy table |
| Ordinances.tsx | Attendance policy | 65–74%: allowed with penalty | 54 | CRITICAL | Academic policy table |
| Ordinances.tsx | Attendance policy | Below 65%: debarred | 58 | CRITICAL | Academic policy table |
| Ordinances.tsx | CGPA minimum | 4.0 required for B.Tech degree | 96 | CRITICAL | Academic policy table |
| PlagiarismPolicy.tsx | Turnitin threshold | 15% maximum similarity for M.Tech/Ph.D. | 15 | CRITICAL | Academic policy table |
| PlagiarismPolicy.tsx | Penalty levels | Level 0–3 with 10/40/60% thresholds | 16 | CRITICAL | Academic policy table |
| PTDCCourses.tsx | Course description | "...5 years, evenings and weekends..." | 34 | HIGH | CMS |
| PTDCCourses.tsx | Eligibility text | "Diploma + 2 years work experience..." | 37 | CRITICAL | CMS |
| OnlineCourses.tsx | NPTEL description | NPTEL Local Chapter description | 32 | HIGH | CMS |
| OnlineCourses.tsx | MOOC platforms | SWAYAM, NPTEL, Coursera, edX | 35 | HIGH | CMS |
| ExamResults.tsx | Exam schedules | 3 hardcoded entries: Mid-Sem (Sept/Feb), End-Sem (Nov-Dec/Apr-May), Supplementary (July/Aug) | 5–9 | HIGH | GET /api/v1/academics/exam-results |
| ExamResults.tsx | ERP URL | https://erp.sgsitsindore.in | 89 | CRITICAL | settingsService.erpPortalUrl |
| ExamResults.tsx | Re-evaluation deadline | "15 days of official result declaration" | 106 | HIGH | CMS |
| UGAdmission.tsx | Seat reservation note | "SC/ST/OBC reservations as per Government norms." | 118 | HIGH | CMS |
| UGAdmission.tsx | Fee note | "Fees as approved by the Fee Regulatory Committee, Govt. of Madhya Pradesh." | 143 | HIGH | CMS |
| Prospectus.tsx | Academic year | "2025–26" | 70 | MEDIUM | Config |
| Prospectus.tsx | Location | "Indore, M.P." | 71 | CRITICAL | contactService |
| TNPCell.tsx | Page subtitle | "Career Development & Campus Recruitment — SGSITS Indore" | 45 | HIGH | CMS |
| LeadingCompanies.tsx | Top package stat | "₹48 LPA" | 57 | HIGH | GET /api/v1/placements/stats |
| LeadingCompanies.tsx | Company count | "Over 180+ companies visit SGSITS campus annually" | 69 | HIGH | GET /api/v1/placements/stats |
| PlacementRecord.tsx | Example companies | "Amazon, Microsoft, TCS, Infosys, Cognizant, Wipro" | 227 | HIGH | GET /api/v1/placements/companies |
| StartupCellPage.tsx | Startup portfolio | 15 startups, ₹12 Cr, 80+ jobs, 3 patents, sector descriptions | 9–65 | CRITICAL | GET /api/v1/startup |
| TeqipPage.tsx | TEQIP achievements | Lab counts, faculty numbers, ₹3.8 Cr grants, +38% placement | 9–45 | CRITICAL | GET /api/v1/teqip/stats |
| TeqipPage.tsx | Milestones | 10 events with years 2017–2021, fund amounts | 90–101 | CRITICAL | GET /api/v1/teqip/milestones |
| TeqipPage.tsx | Document downloads | 6 PDFs with file sizes (2.4MB–5.1MB) | 103–110 | MEDIUM | Document storage |
| CampusMapPage.tsx | Campus buildings | 6 buildings with specs (80,000 books, 1,200+ students, etc.) | 7–44 | HIGH | GET /api/v1/facilities |
| CampusMapPage.tsx | Campus facts | "52 Acres", "1952", "15+ Academic Blocks", "7 Hostel Blocks" | 208–211 | HIGH | GET /api/v1/institution/stats |
| VideoTourPage.tsx | YouTube video ID | dQw4w9WgXcQ (rickroll placeholder) | 5 | HIGH | Config |
| VideoTourPage.tsx | Tour stop cards | 4 location cards with picsum.photos placeholders | 31–56 | HIGH | CMS |
| VideoTourPage.tsx | YouTube channel | https://www.youtube.com/@sgsitsindore | 203 | HIGH | Config |
| AnthemPage.tsx | Composer credits | Dr. R.K. Sharma (lyrics), Pt. Ravi Shankar Das (composition), Smt. Kavita Krishnamurthy (vocals) | 152–154 | CRITICAL | CMS |
| AnthemPage.tsx | Anthem metadata | "Composed in 2001", "Duration: 3:42", "Raga: Yaman Kalyan" | 63, 238 | MEDIUM | CMS |
| SiteMapPage.tsx | Navigation structure | 17 hardcoded route entries | 8–38 | HIGH | GET /api/v1/navigation |
| NewsDetailPage.tsx | Mock comments | Dr. Neha Gupta, Amit Patel with 2025-05-16 dates | 43–56 | MEDIUM | GET /api/v1/news/{id}/comments |
| NewsDetailPage.tsx | Read time | "3 min read" | 261 | LOW | Calculate from word count |
| NoticesPage.tsx | Category labels + colors | 6 categories with hex codes #0b2545, #bfa15f | 12–27 | HIGH | GET /api/v1/settings/cms/ui-config |
| EventsPage.tsx | Category color map | 5 categories with hex codes | 8–15 | HIGH | GET /api/v1/settings/cms/ui-config |
| PrivacyPolicy.tsx | Full policy content | 6 sections with dates Jan 15 2025 / Feb 1 2025 | 8–65 | CRITICAL | GET /api/v1/settings/cms/policy.privacy |
| TermsOfUse.tsx | Full ToU content | 8 sections including Indore jurisdiction | 8–65 | CRITICAL | GET /api/v1/settings/cms/policy.terms |
| Disclaimer.tsx | Full disclaimer | 4 sections | 8–65 | CRITICAL | GET /api/v1/settings/cms/policy.disclaimer |
| AccessibilityStatement.tsx | Full accessibility statement | 4 sections including WCAG 2.1 Level AA | 19–63 | CRITICAL | GET /api/v1/settings/cms/policy.accessibility |
| CopyrightPolicy.tsx | Full copyright policy | 4 sections including Copyright Act 1957 | 8–64 | CRITICAL | GET /api/v1/settings/cms/policy.copyright |
| SecurityPolicy.tsx | Security policy | IT Act 2000 reference, www.sgsits.ac.in, April 2026 date | 14–19 | CRITICAL | GET /api/v1/settings/cms/policy.security |
| DepartmentLanding.tsx | Engineering slugs | 9 hardcoded engineering department slugs | 18–22 | HIGH | GET /api/v1/departments?category=engineering |
| DepartmentLanding.tsx | Science slugs | 4 hardcoded science slugs | 23 | HIGH | GET /api/v1/departments?category=science |
| DepartmentLanding.tsx | Other slugs | 4 hardcoded other slugs | 24 | HIGH | GET /api/v1/departments?category=other |

---

## Section 6 — Contact Information Audit

Every phone number, email address, and physical address found across all files:

| Contact Value | Type | File | Line | Priority | Action |
|---------------|------|------|------|----------|--------|
| info@sgsits.ac.in | Email | footerService.ts | 155 | CRITICAL | Move to contact table |
| 0731-2541370 | Phone (main) | footerService.ts | 153 | CRITICAL | Move to contact table |
| 0731-2541370 | Fax | footerService.ts | 154 | CRITICAL | Move to contact table |
| 23, Park Road, Indore (M.P.) - 452003 | Address | footerService.ts | 151 | CRITICAL | Move to contact table |
| +91-731-2582100 | Helpline | settingsService.ts | 90 | CRITICAL | Move to settings table |
| registrar@sgsits.ac.in | Email | settingsService.ts | 91 | CRITICAL | Move to settings table |
| +91-731-2582100 | Phone | chatbotService.ts | 53 | CRITICAL | Pull from settingsService |
| registrar@sgsits.ac.in | Email | chatbotService.ts | 53 | CRITICAL | Pull from settingsService |
| privacy@sgsits.ac.in | Email (DPO) | policyService.ts / PrivacyPolicy.tsx | 38 / 38 | CRITICAL | Move to policy config |
| Park Road, Indore – 452003, Madhya Pradesh | Address | PrivacyPolicy.tsx | 38 | CRITICAL | Move to contact table |
| itcell@sgsits.ac.in | Email | policyService.ts / TermsOfUse.tsx | 97 / 40 | CRITICAL | Move to policy config |
| registrar@sgsits.ac.in | Email | Disclaimer.tsx | 40 | CRITICAL | Pull from settingsService |
| Park Road, Indore – 452003, Madhya Pradesh, India | Address | Disclaimer.tsx | 40 | CRITICAL | Pull from contact table |
| accessibility@sgsits.ac.in | Email | policyService.ts / AccessibilityStatement.tsx | 39 | CRITICAL | Move to policy config |
| +91-731-2570-5700 | Phone | AccessibilityStatement.tsx | 39 | CRITICAL | Move to contact table |
| Park Road, Indore – 452003, Madhya Pradesh | Address | AccessibilityStatement.tsx | 39 | CRITICAL | Pull from contact table |
| copyright@sgsits.ac.in | Email | CopyrightPolicy.tsx | 38 | CRITICAL | Move to policy config |
| Park Road, Indore – 452003, Madhya Pradesh | Address | CopyrightPolicy.tsx | 38 | CRITICAL | Pull from contact table |
| tpo@sgsits.ac.in | Email (placement) | LeadingCompanies.tsx | 161 | CRITICAL | Move to contactService |
| purchase@sgsits.ac.in | Email (tender) | TendersPage.tsx | 14 | CRITICAL | Move to contactService |
| 0731-2582115 | Phone (purchase) | TendersPage.tsx | 18 | CRITICAL | Move to contactService |
| teqip@sgsits.ac.in | Email | TeqipPage.tsx | 330 | CRITICAL | Move to contactService |
| 0731-2431234 Extn. 210 | Phone (TEQIP) | TeqipPage.tsx | 334 | CRITICAL | Move to contactService |
| startup@sgsits.ac.in | Email | StartupCellPage.tsx | 113 | CRITICAL | Move to contactService |
| +91-731-2431300 | Phone (startup) | StartupCellPage.tsx | 308 | CRITICAL | Move to contactService |
| +91-731-2431000 | Phone (main) | CampusMapPage.tsx | 47 | CRITICAL | Move to contactService |
| +91-731-2431234 | Phone | CampusMapPage.tsx | 48 | CRITICAL | Move to contactService |
| info@sgsits.ac.in | Email | CampusMapPage.tsx | 49 | CRITICAL | Pull from footerService |
| 23, Park Road, Indore 452003 | Address | CampusMapPage.tsx | 51 | CRITICAL | Pull from contact table |
| 1800-180-5522 | Helpline (anti-ragging) | FirstYearInfo.tsx | 55 | CRITICAL | Move to contactService |
| antiranging@sgsits.ac.in | Email | FirstYearInfo.tsx | 56 | CRITICAL | Move to contactService |
| 0731-2582105 | Phone (Dean SW) | FirstYearInfo.tsx | 123 | CRITICAL | Move to contactService |
| 0731-2582106 | Phone (Exam Cell) | FirstYearInfo.tsx | 127 | CRITICAL | Move to contactService |
| 0731-2582220 | Phone (Hostel) | FirstYearInfo.tsx | 131 | CRITICAL | Move to contactService |
| 0731-2582210 | Phone (Dispensary) | FirstYearInfo.tsx | 135 | CRITICAL | Move to contactService |
| hod.cse@sgsits.ac.in | Email (CSE HOD) | mockHodContent.ts | 44 | CRITICAL | department_profiles table |
| +91 731 2582165 | Phone (CSE HOD) | mockHodContent.ts | 44 | CRITICAL | department_profiles table |
| rkpandey@sgsits.ac.in | Email (faculty) | mockPortalData.ts | 106 | CRITICAL | faculty_members table, auth API only |
| sgupta@sgsits.ac.in | Email (faculty) | mockPortalData.ts | 107 | CRITICAL | faculty_members table, auth API only |
| nitish.nidhi75@gmail.com | Email (HOD) | departmentsList.ts | 18 | CRITICAL | departments table |
| rakeshkhare@hotmail.com | Email (HOD) | departmentsList.ts | 56 | CRITICAL | departments table |
| thakarurjita@gmail.com | Email (HOD) | departmentsList.ts | 65 | CRITICAL | departments table |
| Asaus343@gmail.com | Email (HOD) | departmentsList.ts | 111 | CRITICAL | departments table |
| kkssgs@gmail.com | Email (HOD) | departmentsList.ts | 131 | CRITICAL | departments table |
| 9425053428 | Phone (HOD) | departmentsList.ts | 57 | CRITICAL | departments table |
| webmaster@sgsits.ac.in | Email | TermsOfUse.tsx | 40 | CRITICAL | policy config table |

---

## Section 7 — Media, Images & Documents

| Asset Type | Value | File | Line | Priority | Action |
|------------|-------|------|------|----------|--------|
| Logo image | /assets/image.png | footerService.ts | 146 | HIGH | Serve via branding API |
| Logo image | /assets/image.png | chatbotService.ts | 50 | HIGH | Pull from brandingService |
| Professor photos (x4) | /assets/professors/*.svg | instituteProfessors.ts | 17,31,42,59 | LOW | Upload to media storage |
| HOD gallery images (x5) | https://images.unsplash.com/... | mockHodContent.ts | 135–140 | LOW | Replace with institute media |
| Event images | picsum.photos URLs | mockStore.ts | 341–346 | MEDIUM | Upload to media storage |
| YouTube video ID | dQw4w9WgXcQ (rickroll placeholder) | VideoTourPage.tsx | 5 | HIGH | Replace with real institute video |
| Tour stop images | https://picsum.photos/... | VideoTourPage.tsx | 31–56 | HIGH | Replace with real campus photos |
| YouTube channel URL | https://www.youtube.com/@sgsitsindore | VideoTourPage.tsx | 203 | HIGH | Move to settingsService config |
| Google Maps embed | iframe src maps.google.com (hardcoded coordinates) | CampusMapPage.tsx | 112–114 | MEDIUM | Move coordinates to config |
| Google Maps link | https://maps.google.com/?q=SGSITS+Indore | CampusMapPage.tsx | 104 | MEDIUM | Move to contactService |
| Comment avatars (x4) | https://images.unsplash.com/... | NewsDetailPage.tsx | 20–25 | MEDIUM | Replace with avatar service |
| Ordinance PDFs (x4) | Non-functional hrefs or # | Ordinances.tsx | 16–21 | HIGH | Upload to document storage |
| Code of Conduct PDF | href="#" (non-functional) | CodeOfConduct.tsx | 96 | HIGH | Upload to document storage |
| TEQIP documents (x6) | PDF paths with file sizes (2.4MB–5.1MB) | TeqipPage.tsx | 103–110 | MEDIUM | Upload to document storage |
| Prospectus PDF | /admission/prospectus (implied download) | AdmissionsLanding.tsx | 6 | HIGH | Serve via GET /api/v1/admissions/prospectus |
| External scheme URLs | startupindia.gov.in, mpstartupcell.mp.gov.in, aicte-india.org/ideahub | StartupCellPage.tsx | 286–288 | HIGH | Move to config/CMS |

---

## Section 8 — SEO & Metadata

| Page/File | Title/Description | Location | Priority | Action |
|-----------|------------------|----------|----------|--------|
| footerService.ts | 'SGSITS Indore — An Institute of National Standing' | Line 204 | HIGH | Move to seoService |
| seoService.ts | defaultSeoMeta: {} (empty default) | Line 40 | HIGH | Populate via GET /api/v1/settings/seo |
| seoService.ts | allSeoDefaults: {} (empty default) | Line 41 | HIGH | Populate via GET /api/v1/settings/seo |
| AcademicsLanding.tsx | heroTitle: "Academics at SGSITS" | Line 22 | MEDIUM | Move to CMS landing-page config |
| AcademicsLanding.tsx | heroSubtitle: "Explore academic programmes, calendars, examination policies..." | Line 23 | MEDIUM | Move to CMS |
| AdmissionsLanding.tsx | heroTitle: "Admissions at SGSITS" | Line 14 | MEDIUM | Move to CMS |
| AdmissionsLanding.tsx | heroSubtitle: "Find eligibility criteria, admission processes..." | Line 15 | MEDIUM | Move to CMS |
| PlacementsLanding.tsx | heroTitle: "Placements at SGSITS" | Line 14 | MEDIUM | Move to CMS |
| PlacementsLanding.tsx | heroSubtitle: "Explore placement records, leading recruiters..." | Line 15 | MEDIUM | Move to CMS |
| CampusLifeLanding.tsx | heroTitle: "Campus Life at SGSITS" | Line 16 | MEDIUM | Move to CMS |
| CampusLifeLanding.tsx | heroSubtitle: "Experience a vibrant campus with student activities..." | Line 17 | MEDIUM | Move to CMS |
| FacilitiesLanding.tsx | heroTitle: "Campus Facilities" | Line 22 | MEDIUM | Move to CMS |
| FacilitiesLanding.tsx | heroSubtitle: "Explore world-class facilities including labs, library, hostels..." | Line 23 | MEDIUM | Move to CMS |
| MoreLanding.tsx | heroTitle: "More from SGSITS" | Line 17 | MEDIUM | Move to CMS |
| MoreLanding.tsx | heroSubtitle: "Access notices, news, events, tenders, the startup cell..." | Line 18 | MEDIUM | Move to CMS |
| AboutLanding.tsx | Section label "About SGSITS" | Line 147 | MEDIUM | Move to CMS |
| AboutLanding.tsx | Page heading "About the Institute" | Line 148 | MEDIUM | Move to CMS |
| AboutLanding.tsx | Subtitle "Explore the institute's history, leadership, governance..." | Line 150 | MEDIUM | Move to CMS |
| DepartmentLanding.tsx | Heading "Departments at SGSITS" | Line 126 | MEDIUM | Move to CMS |
| SiteMapPage.tsx | Subtitle "Complete navigation map of the SGSITS website" | Line 38 | HIGH | Move to CMS |

---

## Section 9 — Loading States Audit

| File | Has Skeleton | Has Circular Spinner | Recommendation |
|------|-------------|---------------------|----------------|
| AboutLanding.tsx | Yes (animate-pulse) | No | Acceptable pattern |
| AcademicsLanding.tsx | Yes (animate-pulse) | No | Acceptable pattern |
| AdmissionsLanding.tsx | Yes (animate-pulse) | No | Acceptable pattern |
| PlacementsLanding.tsx | Yes (animate-pulse) | No | Acceptable pattern |
| CampusLifeLanding.tsx | Yes (animate-pulse) | No | Acceptable pattern |
| FacilitiesLanding.tsx | Yes (animate-pulse) | No | Acceptable pattern |
| MoreLanding.tsx | Yes (animate-pulse) | No | Acceptable pattern |
| DepartmentLanding.tsx | Yes (SkeletonDeptGrid) | No | Acceptable pattern |
| AboutInstitute.tsx | Yes (animate-pulse, lines 23–30) | No | Acceptable pattern |
| Committees.tsx | Yes (animate-pulse, lines 30–39) | No | Acceptable pattern |
| CustomAboutPage.tsx | Yes (animate-pulse, lines 31–38) | No | Acceptable pattern |
| FirstYearInfo.tsx | No | No | Add skeleton loader — static page with planned API migration |
| OBENep2020.tsx | No | No | Add skeleton loader — content will be CMS-driven |
| UGAdmission.tsx | Yes (animate-pulse) | No | Acceptable pattern |
| PGAdmission.tsx | Yes (animate-pulse) | No | Acceptable pattern |
| PhDAdmission.tsx | Yes (animate-pulse) | No | Acceptable pattern |
| Prospectus.tsx | Yes (animate-pulse) | No | Acceptable pattern |
| TNPCell.tsx | No (default state, no skeleton) | No | Add skeleton loader — renders defaults immediately without visual loading state |
| LeadingCompanies.tsx | No (default state, no skeleton) | No | Add skeleton loader — renders defaults immediately |
| PlacementRecord.tsx | No (default state, no skeleton) | No | Add skeleton loader — renders defaults immediately |
| PlacementContact.tsx | No (default state, no skeleton) | No | Add skeleton loader — renders defaults immediately |
| CustomPlacementPage.tsx | Yes (animate-pulse, widths [100,90,95,80,85]) | No | Acceptable pattern |
| CustomCampusLifePage.tsx | Yes (animate-pulse, widths [100,90,95,80,85]) | No | Acceptable pattern |
| StartupCellPage.tsx | No | No | Add skeleton loader before API migration |
| TeqipPage.tsx | No | No | Add skeleton loader before API migration |
| CampusMapPage.tsx | No | No | Static content — skeleton optional, add if API-backed |
| VideoTourPage.tsx | No | No | Add skeleton for video embed load |
| AnthemPage.tsx | No | No | Static content — low priority |
| NewsDetailPage.tsx | Partial | No | Ensure comments section has skeleton |
| NoticesPage.tsx | Not confirmed | No | Verify skeleton exists for list |
| EventsPage.tsx | Not confirmed | No | Verify skeleton exists for list |
| TendersPage.tsx | Not confirmed | No | Verify skeleton exists for list |

---

## Section 10 — Missing Backend APIs

| API Endpoint | Method | Purpose | Files Needing It | DB Table | Admin Module | Priority |
|---|---|---|---|---|---|---|
| /api/v1/departments | GET | Full department listing with HOD info | navItems.ts, departmentsList.ts, DepartmentLanding.tsx | departments | Department Admin | CRITICAL |
| /api/v1/departments/{slug} | GET | Single department detail | All department pages | departments | Department Admin | CRITICAL |
| /api/v1/departments/stats | GET | Count, faculty total, student total | DepartmentLanding.tsx, AboutLanding.tsx | departments | Read-only | HIGH |
| /api/v1/departments?category={type} | GET | Filtered by engineering/science/other | DepartmentLanding.tsx | departments | Department Admin | HIGH |
| /api/v1/institution/stats | GET | Years, students, faculty, departments | AboutLanding.tsx, DepartmentLanding.tsx, mockStore.ts | institution_config | Settings Admin | HIGH |
| /api/v1/settings/cms/branding | GET/PUT | Logo, name, tagline, color tokens | footerService.ts, brandingService.ts, all pages | site_config | Branding Admin | HIGH |
| /api/v1/settings/seo | GET/PUT | Page titles, descriptions, OG tags | seoService.ts, all pages | seo_config | SEO Admin | HIGH |
| /api/v1/settings/cms/chatbot | GET/PUT | Bot name, welcome message, quick prompts | chatbotService.ts | site_config | Chatbot Admin | HIGH |
| /api/v1/settings/cms/policy.{key} | GET/PUT | Six policy documents | policyService.ts, all policy pages | policy_content | Policy Admin | CRITICAL |
| /api/v1/contact | GET/PUT | All contact info, offices, helplines | contactService.ts, ContactUs.tsx, 10+ pages | contact_info | Contact Admin | CRITICAL |
| /api/v1/navigation | GET/PUT | Full nav tree | navigationService.ts, navService.ts | navigation | Navigation Admin | HIGH |
| /api/v1/navigation/sidebar | GET/PUT | Sidebar link sets | navigationService.ts, sidebarLinks.ts | navigation_sidebar | Navigation Admin | HIGH |
| /api/v1/academics/calendar | GET/PUT | Academic calendar data | AcademicsLanding.tsx, academicsService.ts | academic_calendar | Academics Admin | HIGH |
| /api/v1/academics/courses | GET/PUT | Courses by level (ug/pg/phd/ptdc/online) | AcademicsLanding.tsx, all course pages | academic_programs | Academics Admin | HIGH |
| /api/v1/academics/first-year | GET/PUT | First year checklist, subjects, contacts | FirstYearInfo.tsx | academics_config | Academics Admin | HIGH |
| /api/v1/academics/exam-results | GET/PUT | Exam schedules, ERP link | ExamResults.tsx | exam_config | Exam Admin | HIGH |
| /api/v1/academics/ordinances | GET/PUT | Ordinance documents, grading scale | Ordinances.tsx | ordinances | Academics Admin | HIGH |
| /api/v1/admissions/{type} | GET/PUT | UG/PG/PhD admission info | AdmissionsLanding.tsx, all admission pages | admissions_info | Admissions Admin | HIGH |
| /api/v1/admissions/prospectus | GET/PUT | Prospectus file URL, year | Prospectus.tsx | admissions_info | Admissions Admin | HIGH |
| /api/v1/placements/tnp-cell | GET/PUT | TNP cell overview, team | TNPCell.tsx | placement_config | Placement Admin | HIGH |
| /api/v1/placements/companies | GET/PUT | Recruiting companies, sector stats | LeadingCompanies.tsx | placement_companies | Placement Admin | HIGH |
| /api/v1/placements/record | GET/PUT | Year-wise placement records | PlacementRecord.tsx, mockStore.ts | placement_records | Placement Admin | HIGH |
| /api/v1/placements/contacts | GET/PUT | T&P office contact persons | PlacementContact.tsx | contact_info | Placement Admin | HIGH |
| /api/v1/placements/stats | GET | Aggregate stats (₹48L, 180+ companies) | LeadingCompanies.tsx | placement_records | Read-only | HIGH |
| /api/v1/students/activities | GET/PUT | Student activities, clubs | CampusLifeLanding.tsx | campus_life_config | Student Admin | MEDIUM |
| /api/v1/students/ncc | GET/PUT | NCC wing content | CampusLifeLanding.tsx | campus_life_config | Student Admin | MEDIUM |
| /api/v1/students/nss | GET/PUT | NSS wing content | CampusLifeLanding.tsx | campus_life_config | Student Admin | MEDIUM |
| /api/v1/students/sss | GET/PUT | Sports and Student Services | CampusLifeLanding.tsx | campus_life_config | Student Admin | MEDIUM |
| /api/v1/students/scholarship/{type} | GET/PUT | Scholarship info | CampusLifeLanding.tsx | campus_life_config | Student Admin | MEDIUM |
| /api/v1/facilities/{slug} | GET/PUT | Individual facility detail | All facility pages | facilities_config | Facilities Admin | MEDIUM |
| /api/v1/notices | GET/POST | Live notices feed | NoticesPage.tsx, MoreLanding.tsx, mockStore.ts | notices | Notice Admin | HIGH |
| /api/v1/news | GET/POST | News articles | NewsDetailPage.tsx, mockStore.ts | news_articles | News Admin | HIGH |
| /api/v1/news/{id}/comments | GET/POST | Article comments | NewsDetailPage.tsx | comments | Moderation Admin | MEDIUM |
| /api/v1/events | GET/POST | Campus events | EventsPage.tsx, mockStore.ts | events | Events Admin | MEDIUM |
| /api/v1/tenders | GET/POST | Procurement tenders | TendersPage.tsx, mockStore.ts | tenders | Tender Admin | MEDIUM |
| /api/v1/startup | GET/PUT | Startup portfolio, stats | StartupCellPage.tsx | startup_portfolio | Startup Admin | HIGH |
| /api/v1/teqip/about | GET/PUT | TEQIP overview | TeqipPage.tsx | teqip_config | TEQIP Admin | HIGH |
| /api/v1/teqip/milestones | GET/PUT | TEQIP milestones timeline | TeqipPage.tsx | teqip_milestones | TEQIP Admin | HIGH |
| /api/v1/teqip/stats | GET/PUT | TEQIP achievement statistics | TeqipPage.tsx | teqip_config | TEQIP Admin | HIGH |
| /api/v1/pages/{slug} | GET/PUT | CMS custom pages (about subpages) | CustomAboutPage.tsx, AboutInstitute.tsx | custom_pages | Page Builder | HIGH |
| /api/v1/faculty/notable | GET/PUT | Distinguished faculty list | instituteProfessors.ts | institute_notable_faculty | Faculty Admin | LOW |
| /api/v1/portal/sessions | GET | Academic sessions | mockPortalData.ts | sessions | Registrar | HIGH |
| /api/v1/portal/branches | GET | Branch list with HOD | mockPortalData.ts, mockHodContent.ts | branches | Department Admin | CRITICAL |
| /api/v1/portal/faculty | GET | Faculty members (authenticated) | mockPortalData.ts | faculty_members | HR Admin | CRITICAL |
| /api/v1/portal/students | GET | Students (authenticated) | mockPortalData.ts | students | Registrar | CRITICAL |
| /api/v1/portal/marks-requests | GET/POST | Marks entry requests | mockPortalData.ts | marks_requests | Exam Admin | MEDIUM |
| /api/v1/portal/leaves | GET/POST/PATCH | Leave applications | mockHodData.ts | leave_applications | HR Admin | HIGH |
| /api/v1/portal/timetable | GET/PUT | Timetable slots | mockHodData.ts | timetable_slots | Timetable Admin | HIGH |
| /api/v1/portal/teacher-profile | GET/PUT | Teacher own profile (JWT-scoped) | mockTeacherContent.ts | teacher_profiles | Self-service | CRITICAL |

---

## Section 11 — Missing Admin Panel Controls

| Content Area | Current State | Admin Module Needed | Priority |
|---|---|---|---|
| Department HOD info (17 departments) | Hardcoded in departmentsList.ts | Department Profile Editor — edit HOD name, email, phone, faculty count per department | CRITICAL |
| Institution branding (name, tagline, logo) | Hardcoded in footerService.ts defaults | Branding Settings — upload logo, edit name/tagline/shortcode | HIGH |
| Contact information | Scattered across 15+ files | Contact Manager — edit all office phones, emails, addresses, helplines | CRITICAL |
| Policy documents (6 policies) | Hardcoded in policyService.ts | Policy Editor — rich-text editor per policy with last-updated date field | CRITICAL |
| Chatbot configuration | Hardcoded in chatbotService.ts | Chatbot Settings — edit bot name, welcome message, quick prompts | HIGH |
| Navigation tree | Hardcoded in navItems.ts, sidebarLinks.ts | Navigation Builder — drag-and-drop nav tree with label/path/visibility per item | HIGH |
| Landing page cards (7 sections) | Hardcoded in 7 Landing tsx files | Landing Page CMS — edit card titles, descriptions, paths, badges per section | HIGH |
| About page content (timeline, stats, highlights) | Hardcoded in AboutLanding.tsx | About CMS — edit stats, timeline events, highlights, accreditation badges | HIGH |
| Placement statistics | Hardcoded in LeadingCompanies.tsx, PlacementRecord.tsx | Placement Dashboard — annual upload of package stats, companies count | HIGH |
| TEQIP content (milestones, stats, documents) | Hardcoded in TeqipPage.tsx | TEQIP CMS — edit achievements, milestones, upload PDFs | HIGH |
| Startup portfolio | Hardcoded in StartupCellPage.tsx | Startup Admin — CRUD for startup profiles, funding stats, sector data | HIGH |
| Academic first-year info (checklist, subjects) | Hardcoded in FirstYearInfo.tsx | Academics CMS — edit checklist, subjects, freshers contact numbers | HIGH |
| Exam schedules | Hardcoded in ExamResults.tsx | Exam Admin — manage exam schedule entries by type and semester | HIGH |
| Ordinance documents and grading scale | Hardcoded in Ordinances.tsx | Policy Documents Admin — upload ordinance PDFs, edit grading table | HIGH |
| Video tour configuration | Hardcoded YouTube ID + placeholder images | Media Settings — set YouTube video ID, tour stop images and descriptions | HIGH |
| Campus map configuration | Hardcoded coordinates + building info | Campus Admin — update building names, descriptions, capacity figures, map coordinates | MEDIUM |
| SEO metadata per page | Empty defaults in seoService.ts | SEO Manager — per-page title, description, keywords, OG image | HIGH |
| Notice/News/Event/Tender feeds | Seeded in mockStore.ts (localStorage) | Live Content Admin — post notices, news, events, tenders with scheduling | HIGH |
| Faculty portal sessions | Hardcoded in mockPortalData.ts | Academic Calendar Admin — manage session periods, set active session | HIGH |
| Teacher profiles (self-service) | Hardcoded in mockTeacherContent.ts | Teacher Self-Service Portal — edit own profile, publications, research, qualifications | CRITICAL |
| HOD department profile | Hardcoded in mockHodContent.ts | HOD Self-Service Portal — edit dept profile, notices, downloads, events, labs, achievements | CRITICAL |
| Anthem metadata | Hardcoded in AnthemPage.tsx | Culture/Branding CMS — edit anthem metadata, composer credits, audio URL | LOW |
| ERP portal URL | Hardcoded in ExamResults.tsx and settingsService.ts | Settings Admin — configurable ERP URL field | HIGH |

---

## Section 12 — Refactoring Roadmap

| Week | Area | Files | Action | Effort |
|------|------|-------|--------|--------|
| 1 | BLOCKER: Teacher portal auth | mockTeacherContent.ts | Replace CURRENT_TEACHER_ID ('F001') with authenticated JWT user ID across all teacher portal pages | S |
| 1 | Contact table | footerService.ts, settingsService.ts | Create contacts DB table; migrate all phone/email/address defaults; expose GET /api/v1/contact | M |
| 1 | Contact consumers | FirstYearInfo.tsx, LeadingCompanies.tsx, TendersPage.tsx, TeqipPage.tsx, StartupCellPage.tsx, CampusMapPage.tsx, chatbotService.ts, all policy pages | Replace all inline contact literals with contactService calls | M |
| 2 | Department data | departmentsList.ts, navItems.ts, DepartmentLanding.tsx | Create departments DB table; implement GET /api/v1/departments and GET /api/v1/departments/{slug}; remove departmentsList.ts | L |
| 2 | Policy documents | policyService.ts, PrivacyPolicy.tsx, TermsOfUse.tsx, Disclaimer.tsx, AccessibilityStatement.tsx, CopyrightPolicy.tsx, SecurityPolicy.tsx | Extract hardcoded policy bodies to seeds/policies.json; seed via CMS init; ensure GET /api/v1/settings/cms/policy.{key} is wired | M |
| 2 | Portal foundations | mockPortalData.ts | Implement GET /api/v1/portal/sessions, /branches, /faculty (auth-gated), /students; retire mock file | L |
| 3 | Institution stats & branding | footerService.ts, AboutLanding.tsx, DepartmentLanding.tsx, mockStore.ts | Populate institution_config table; implement GET /api/v1/institution/stats and GET /api/v1/settings/cms/branding; remove hardcoded stats | M |
| 3 | Navigation dynamic | navItems.ts, sidebarLinks.ts | Implement GET /api/v1/navigation; replace local imports with navService fetch; fix sidebarLinks duplicate-key bug for notices/events/tenders | M |
| 3 | Chatbot config | chatbotService.ts | Implement chatbot settings in site_config table; wire GET /api/v1/settings/cms/chatbot; remove hardcoded bot name/message/prompts | S |
| 4 | Academic pages | FirstYearInfo.tsx, Ordinances.tsx, ExamResults.tsx, PTDCCourses.tsx, OnlineCourses.tsx, PlagiarismPolicy.tsx, CodeOfConduct.tsx, OBENep2020.tsx | Move all academic policy text to CMS; implement GET /api/v1/academics/* endpoints; add skeleton loaders to static pages | L |
| 4 | HOD portal | mockHodData.ts, mockHodContent.ts | Implement /api/v1/portal/leaves, /timetable, /dept-profile, /dept-notices; retire mock files | L |
| 4 | Placement pages loading states | TNPCell.tsx, LeadingCompanies.tsx, PlacementRecord.tsx, PlacementContact.tsx | Add skeleton loaders to all 4 placement pages; these currently render default data immediately without loading UI | S |
| 5 | TEQIP & Startup | TeqipPage.tsx, StartupCellPage.tsx | Create teqip_config and startup_portfolio tables; implement GET /api/v1/teqip/* and GET /api/v1/startup; build admin modules | M |
| 5 | SEO infrastructure | seoService.ts, all Landing pages | Populate seo_config table; implement GET /api/v1/settings/seo; wire PageSeo component to use service; remove hardcoded hero titles | M |
| 5 | Media & documents | Ordinances.tsx, CodeOfConduct.tsx, TeqipPage.tsx, VideoTourPage.tsx | Upload all PDFs to document storage; replace # hrefs with real URLs from storage API; replace YouTube placeholder ID with real video | M |
| 6 | Live feeds | mockStore.ts, NoticesPage.tsx, EventsPage.tsx, TendersPage.tsx, NewsDetailPage.tsx | Fully decouple mockStore from localStorage; ensure all feeds use real /api/v1/notices, /news, /events, /tenders endpoints; wire comments API; implement read-time calculation | L |
| 6 | Admin panel | All admin-missing areas | Build/connect admin modules: Navigation Builder, Contact Manager, Policy Editor, Placement Dashboard, Landing Page CMS, Branding Settings | XL |
| 6 | Cleanup & deduplication | navItems.ts vs sidebarLinks.ts, category color constants | Merge navItems and sidebarLinks into single source of truth; deduplicate CATEGORY_CLASS between NoticesPage and EventsPage into shared config | S |

Effort key: S = 1–2 days, M = 3–4 days, L = 5–7 days, XL = 2+ weeks

---

## Section 13 — Files Analyzed

| # | File Path (relative to src/) | Agent |
|---|------------------------------|-------|
| 1 | constants/navItems.ts | Agent 1 |
| 2 | constants/sidebarLinks.ts | Agent 1 |
| 3 | constants/departmentsList.ts | Agent 1 |
| 4 | pages/about/AboutLanding.tsx | Agent 2 |
| 5 | pages/academics/AcademicsLanding.tsx | Agent 2 |
| 6 | pages/admission/AdmissionsLanding.tsx | Agent 2 |
| 7 | pages/placement/PlacementsLanding.tsx | Agent 2 |
| 8 | pages/students/CampusLifeLanding.tsx | Agent 3 |
| 9 | pages/facilities/FacilitiesLanding.tsx | Agent 3 |
| 10 | pages/more/MoreLanding.tsx | Agent 3 |
| 11 | pages/departments/DepartmentLanding.tsx | Agent 3 |
| 12 | services/footerService.ts | Agent 4 |
| 13 | services/settingsService.ts | Agent 4 |
| 14 | services/chatbotService.ts | Agent 4 |
| 15 | services/brandingService.ts | Agent 4 |
| 16 | services/uiLabelsService.ts | Agent 4 |
| 17 | services/aboutService.ts | Agent 5 |
| 18 | services/academicsService.ts | Agent 5 |
| 19 | services/placementService.ts | Agent 5 |
| 20 | services/studentsService.ts | Agent 5 |
| 21 | services/facilitiesService.ts | Agent 5 |
| 22 | services/navigationService.ts | Agent 5 |
| 23 | services/contentService.ts | Agent 5 |
| 24 | services/policyService.ts | Agent 5 |
| 25 | mocks/mockPortalData.ts | Agent 6 |
| 26 | mocks/mockHodData.ts | Agent 6 |
| 27 | mocks/mockHodContent.ts | Agent 6 |
| 28 | mocks/mockTeacherContent.ts | Agent 6 |
| 29 | mocks/instituteProfessors.ts | Agent 6 |
| 30 | mocks/mockStore.ts | Agent 6 |
| 31 | pages/about/AboutInstitute.tsx | Agent 7 |
| 32 | pages/about/Administration.tsx | Agent 7 |
| 33 | pages/about/Committees.tsx | Agent 7 |
| 34 | pages/about/CustomAboutPage.tsx | Agent 7 |
| 35 | pages/academics/FirstYearInfo.tsx | Agent 7 |
| 36 | pages/academics/OBENep2020.tsx | Agent 7 |
| 37 | pages/admission/UGAdmission.tsx | Agent 8 |
| 38 | pages/admission/PGAdmission.tsx | Agent 8 |
| 39 | pages/admission/PhDAdmission.tsx | Agent 8 |
| 40 | pages/admission/Prospectus.tsx | Agent 8 |
| 41 | pages/placement/TNPCell.tsx | Agent 8 |
| 42 | pages/placement/LeadingCompanies.tsx | Agent 8 |
| 43 | pages/placement/PlacementRecord.tsx | Agent 8 |
| 44 | pages/placement/PlacementContact.tsx | Agent 8 |
| 45 | pages/livefeed/NewsDetailPage.tsx | Agent 9 |
| 46 | pages/livefeed/NoticesPage.tsx | Agent 9 |
| 47 | pages/livefeed/EventsPage.tsx | Agent 9 |
| 48 | pages/livefeed/TendersPage.tsx | Agent 9 |
| 49 | pages/policies/PrivacyPolicy.tsx | Agent 10 |
| 50 | pages/policies/TermsOfUse.tsx | Agent 10 |
| 51 | pages/policies/Disclaimer.tsx | Agent 10 |
| 52 | pages/policies/AccessibilityStatement.tsx | Agent 10 |
| 53 | pages/policies/CopyrightPolicy.tsx | Agent 10 |
| 54 | pages/policies/SecurityPolicy.tsx | Agent 10 |
| 55 | pages/misc/SiteMapPage.tsx | Agent 10 |
| 56 | pages/misc/ContactUs.tsx | Agent 10 |
| 57 | components/Footer.tsx | Agent 11 |
| 58 | pages/NavCategoryPage.tsx | Agent 11 |
| 59 | services/seoService.ts | Agent 11 |
| 60 | services/navService.ts | Agent 11 |
| 61 | pages/misc/StartupCellPage.tsx | Agent 11 |
| 62 | pages/misc/TeqipPage.tsx | Agent 11 |
| 63 | pages/misc/CampusMapPage.tsx | Agent 11 |
| 64 | pages/misc/VideoTourPage.tsx | Agent 11 |
| 65 | pages/misc/AnthemPage.tsx | Agent 11 |
| 66 | pages/academics/CodeOfConduct.tsx | Agent 12 |
| 67 | pages/academics/Ordinances.tsx | Agent 12 |
| 68 | pages/academics/PlagiarismPolicy.tsx | Agent 12 |
| 69 | pages/academics/PTDCCourses.tsx | Agent 12 |
| 70 | pages/academics/OnlineCourses.tsx | Agent 12 |
| 71 | pages/academics/ExamResults.tsx | Agent 12 |
| 72 | pages/placement/CustomPlacementPage.tsx | Agent 12 |
| 73 | pages/students/CustomCampusLifePage.tsx | Agent 12 |
| 74 | pages/hod/HodNotices.tsx | Agent 6 (import reference) |
| 75 | pages/hod/HodDownloads.tsx | Agent 6 (import reference) |
| 76 | pages/hod/HodEvents.tsx | Agent 6 (import reference) |
| 77 | pages/hod/HodGallery.tsx | Agent 6 (import reference) |
| 78 | pages/hod/HodLabs.tsx | Agent 6 (import reference) |
| 79 | pages/hod/HodAchievements.tsx | Agent 6 (import reference) |
| 80 | pages/faculty/TeacherProfile.tsx | Agent 6 (import reference) |
| 81 | pages/faculty/TeacherPublications.tsx | Agent 6 (import reference) |
| 82 | pages/faculty/TeacherResearch.tsx | Agent 6 (import reference) |
| 83 | pages/faculty/TeacherQualifications.tsx | Agent 6 (import reference) |
| 84 | pages/faculty/TeacherSubjects.tsx | Agent 6 (import reference) |
| 85 | services/examService.ts | Agent 6 (import reference) |
| 86 | services/hodService.ts | Agent 6 (import reference) |
| 87 | services/facultyService.ts | Agent 6 (import reference) |
