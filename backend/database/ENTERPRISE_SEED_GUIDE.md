# Enterprise Seed Data Guide — SGSITS ERP/CMS

## 1. Seed Data Structure

| File | Contents | Rows (approx) |
|------|----------|---------------|
| `seed_enterprise_01_users.sql` | Roles (7) + Users (57) | 64 |
| `seed_enterprise_02_departments.sql` | Departments (9) + FK patches | 9 |
| `seed_enterprise_03_faculty.sql` | Faculty profiles (27) + qualifications (35) + publications (15) + research (8) | 85 |
| `seed_enterprise_04_content.sql` | Files (20) + Notices (13) + News (8) + Events (8) + Downloads (10) + Alerts (3) + Tenders (3) + Pages (3) | 68 |
| `seed_enterprise_05_placement.sql` | Companies (18) + Drives (10) + Internships (12) + Year Stats (5) + Placement Records (5) | 50 |
| `seed_enterprise_06_exam.sql` | Sessions (3) + Courses (9) + Sections (9) + Subjects (18) + Faculty-Subject maps (18) + COs (7) + Test details (6) + Students (30) + Marks (30) + Exam Docs (4) | 134 |
| `seed_enterprise_07_gallery_labs.sql` | Albums (8) + Gallery items (6) + Labs (9) + Achievements (6) | 29 |
| `seed_enterprise_08_cms_global.sql` | Site settings (16) + CMS sections (11) + Navigation (17) + SEO (8) + Chatbot config (1) + Chatbot responses (30) | 83 |
| `seed_enterprise_09_analytics.sql` | Visitor total + 30-day stats + Audit logs (10) + Notifications (7) + Leaves (4) + Timetable + entries (20) + Contacts (4) | 80 |

**Total: ~600+ rows across all tables**

---

## 2. RBAC Seed Accounts

All passwords = `Admin@123` (bcrypt cost 10)

| Role | Email | Name | Department |
|------|-------|------|-----------|
| CENTRAL_ADMIN | admin@college.edu | Central Admin | — |
| SUPER_ADMIN | director@sgsits.ac.in | Prof. R.K. Pandey | — |
| CONTENT_EDITOR | priya.sharma@sgsits.ac.in | Priya Sharma | — |
| CONTENT_EDITOR | rahul.gupta@sgsits.ac.in | Rahul Gupta | — |
| EXAM_CONTROLLER | examcontroller@sgsits.ac.in | Dr. Suresh Malviya | — |
| PLACEMENT_OFFICER | placement@sgsits.ac.in | Mr. Vivek Tiwari | — |
| HOD | hod.ce@sgsits.ac.in | Dr. Ajay Khunteta | Computer Engineering |
| HOD | hod.it@sgsits.ac.in | Dr. Kapil Jain | Information Technology |
| HOD | hod.me@sgsits.ac.in | Dr. Pradeep Kasande | Mechanical Engineering |
| HOD | hod.civil@sgsits.ac.in | Dr. Y.K. Bajpai | Civil Engineering |
| HOD | hod.ee@sgsits.ac.in | Dr. Manoj Kumar Jain | Electrical Engineering |
| HOD | hod.ec@sgsits.ac.in | Dr. S.K. Singh | Electronics & TC |
| HOD | hod.ash@sgsits.ac.in | Dr. Rekha Pandey | Applied Sciences |
| HOD | hod.mca@sgsits.ac.in | Dr. Vandana Bhatt | MCA |
| HOD | hod.mba@sgsits.ac.in | Dr. Sanjay Sharma | MBA |
| TEACHER | nisha.thakur@sgsits.ac.in | Dr. Nisha Thakur | CE |
| TEACHER | amit.soni@sgsits.ac.in | Prof. Amit Soni | CE |
| TEACHER | seema.rathore@sgsits.ac.in | Dr. Seema Rathore | CE |
| TEACHER | kiran.patel.ce@sgsits.ac.in | Prof. Kiran Patel | CE |
| TEACHER | pooja.chouhan@sgsits.ac.in | Dr. Pooja Chouhan | IT |
| TEACHER | rajesh.verma.it@sgsits.ac.in | Prof. Rajesh Verma | IT |
| … (39 total TEACHER accounts) | | | |

---

## 3. Department Seed Data

| Slug | Short Name | HOD | Established |
|------|-----------|-----|-------------|
| computer-engineering | CE | Dr. Ajay Khunteta | 1987 |
| information-technology | IT | Dr. Kapil Jain | 2001 |
| mechanical-engineering | ME | Dr. Pradeep Kasande | 1952 |
| civil-engineering | CVL | Dr. Y.K. Bajpai | 1952 |
| electrical-engineering | EE | Dr. Manoj Kumar Jain | 1952 |
| electronics-telecommunication | EC | Dr. S.K. Singh | 1970 |
| applied-sciences-humanities | ASH | Dr. Rekha Pandey | 1952 |
| master-computer-applications | MCA | Dr. Vandana Bhatt | 1995 |
| master-business-administration | MBA | Dr. Sanjay Sharma | 2000 |

---

## 4. Faculty Seed Data

- **27 faculty profiles** with full bio, designation, qualification, specialization, and subjects
- **35 qualification records** (B.E./M.Tech./Ph.D. with institution and year)
- **15 publications** in IEEE/Elsevier/ACM journals with DOI links and citation counts
- **8 research projects** with funding agency and amount (DST-SERB, ICAR, MNRE, ICMR)

---

## 5. Placement Seed Data

**Year Statistics (5 years):**
| Year | Total | Placed | Rate | Highest | Average | Companies |
|------|-------|--------|------|---------|---------|-----------|
| 2020-21 | 420 | 285 | 67.86% | 12 LPA | 4.20 LPA | 28 |
| 2021-22 | 435 | 320 | 73.56% | 14.50 LPA | 4.80 LPA | 35 |
| 2022-23 | 448 | 352 | 78.57% | 18 LPA | 5.20 LPA | 42 |
| 2023-24 | 460 | 384 | 83.48% | 22 LPA | 5.75 LPA | 48 |
| 2024-25 | 472 | 406 | **86.02%** | 28 LPA | 6.40 LPA | 55 |

**18 companies**, **10 active drives** (TCS, Infosys, Wipro, Accenture, Oracle, KPIT, etc.), **12 internship records**

---

## 6. Exam Seed Data

- **3 sessions** (July-Nov 2024, Jan-May 2025, July-Nov 2025 — active)
- **9 courses** (BE-CE, BE-IT, BE-ME, BE-CVL, BE-EE, BE-EC, MCA, MBA, ME-CSE)
- **9 sections** (CE-A, CE-B, IT-A, IT-B, ME-A, ME-B, CVL-A, EE-A, EC-A)
- **18 subjects** (CE/IT/ME Sem 5 complete)
- **18 faculty-subject assignments**
- **30 students** (CE Sem 5 Sec A, enrollment 0801CE211001–030)
- **30 marks records** (CE501 MST1 Q1 CO1, status: submitted)
- **4 exam documents** (date sheet, result, calendar, admit card notice)

---

## 7. Media / Gallery Seed Data

**8 Gallery Albums:**
- Technova 2025, Convocation 2025, Sports Meet 2025, TCS Drive 2025
- CE Department Labs, IT Department Labs, Campus Infrastructure, Fresher Orientation 2025

**6 Gallery items** linked to placeholder file records.

**9 Labs seeded** with description, incharge, and capacity:
- CE: Programming Lab I, Networks Lab, AI/ML Lab
- IT: Web Dev Studio, Data Science Lab
- ME: Heat Transfer Lab, CNC & Additive Manufacturing Lab
- EC: TI Innovation Lab
- EE: Power Systems & Smart Grid Lab

---

## 8. Chatbot Retrieval Data

**30 chatbot response entries** covering:
- Admissions (UG/PG/PhD)
- HOD for all 9 departments
- Placement statistics (exact figures)
- Exam (timetable, results, admit card)
- Fees and scholarships
- Syllabus (CE Sem 5, IT Sem 5)
- Academic calendar
- Facilities (hostel, library, sports, WiFi)
- Contact / directions
- Director details
- NAAC/NIRF/NBA rankings

**Chatbot can answer:**
- "Who is HOD of CSE?" → Dr. Ajay Khunteta
- "Placement stats 2024-25?" → 406 placed, 86%, 28 LPA highest
- "CE Sem 5 subjects?" → DAA, DBMS, OS, CN, ToC, AI
- "Hostel fee?" → Directs to downloads
- "Exam timetable December 2025?" → Date sheet released, link provided
- "Fee structure?" → Available at /downloads, contact accounts

---

## 9. PDF Metadata (File Records)

| Filename | Category | Department | Download Count |
|----------|----------|-----------|----------------|
| seed_ug_admission_2025.pdf | Admission | Global | 3421 |
| seed_placement_brochure_2526.pdf | Placement | Global | 2103 |
| seed_fee_structure_2526.pdf | Administrative | Global | 1204 |
| seed_academic_calendar_2526.pdf | Academic | Global | 892 |
| seed_pg_admission_2025.pdf | Admission | Global | 1876 |
| seed_ce_sem5_syllabus_2025.pdf | Syllabus | CE | 247 |
| seed_it_sem5_syllabus_2025.pdf | Syllabus | IT | 189 |
| seed_exam_circular_dec2025.pdf | Exam | Global | — |
| seed_hostel_fee_2025.pdf | Administrative | Global | 567 |
| seed_anti_ragging_policy_2025.pdf | Administrative | Global | 342 |

---

## 10. SEO Seed Structure

| Page Key | Title | Canonical |
|----------|-------|-----------|
| home | SGSITS Indore — Premier Engineering Institute | NAAC A Grade | / |
| about | About SGSITS Indore | History, Vision, Mission | /about |
| departments | Departments — SGSITS Indore | /departments |
| dept_ce | Computer Engineering — SGSITS Indore | /departments/computer-engineering |
| admission_ug | UG Admission 2025-26 — SGSITS Indore | /admission/ug |
| placements | Placements — 86% Rate | TCS Infosys Wipro Oracle | /placements |
| notices | Notices — Exam, Admission, Placement | /notices |
| contact | Contact SGSITS Indore | /contact |

All entries include `og_title`, `og_description`, `robots: index,follow`.

---

## 11. Navigation / Footer Seeds

**Navigation items (17):** Home, About, Academics, Departments, Admissions (+ 5 children), Examination, Placements, Research, Facilities, Notices, Gallery, Contact

**CMS sections (11):**
- `home_hero` — hero banner with 4 stats counters
- `home_about` — about section with 4 bullet points
- `home_stats` — 6-item stats bar (72+ years, 200+ faculty, etc.)
- `home_placement` — placement section with stats object + top recruiters
- `footer_about` — institute address and contact
- `footer_quick_links` — 8 quick links
- `footer_departments` — 8 department links
- `footer_social` — 5 social media URLs
- `admission_ug` — UG admission details with process steps
- `home_news_events` — heading/subheading for news section
- `chatbot_config_cms` — bot name, welcome message, 6 suggested questions

**Site settings (16 keys):** name, tagline, email, phone, address, fax, social media URLs, NAAC grade, NIRF rank, affiliation, approval

---

## 12. Analytics Seed Data

- **Visitor total:** 284,750
- **30-day visitor stats:** daily page_views (800–4200) and unique_visits (300–1400)
  - Peaks on weekdays, drops on weekends
  - Notable spike on 15 May 2025 (4123 views — result declaration day)
- **10 audit log entries** covering notice creation, CMS updates, placement data, exam session
- **7 user notifications** (unread/read mix)
- **4 contact form submissions** (admissions enquiry, M.Tech. enquiry, placement data request, recruiter partnership)

---

## 13. Vector Index Seed Strategy

For chatbot semantic search, the following data is pre-structured for chunked embedding:

**Primary chunk sources (indexed by `page_key` / entity type):**
1. Department descriptions + HOD details (9 chunks)
2. Faculty bios + specialization (27 chunks)
3. Chatbot responses (30 pre-written QA pairs — direct keyword match)
4. News articles excerpts (8 chunks)
5. Notice descriptions (13 chunks)
6. Placement stats by year (5 chunks)
7. Page CMS content (about, contact, administration — 3 chunks)
8. Syllabus subjects by semester (3 branch × 6 subjects = 18 chunks)
9. Lab descriptions (9 chunks)
10. Achievement records (6 chunks)

**Recommended embedding fields per chunk:**
```json
{
  "id": "dept_ce_profile",
  "type": "department",
  "text": "[Department name + HOD + description + contact]",
  "metadata": { "dept_slug": "computer-engineering", "hod": "Dr. Ajay Khunteta" }
}
```

---

## 14. Seeder Execution Order

```
schema.sql
schema_additions.sql
migrations/003_rbac.sql
migrations/004_faculty_normalize.sql
migrations/005_dept_ops.sql
migrations/006_placement_structured.sql
migrations/007_global_systems.sql
migrations/008_chatbot.sql
migrations/010_indexes_fulltext.sql
migrations/011_dept_extended.sql
seed.sql                          ← original (creates admin@college.edu)
seed_enterprise_01_users.sql
seed_enterprise_02_departments.sql
seed_enterprise_03_faculty.sql
seed_enterprise_04_content.sql
seed_enterprise_05_placement.sql
seed_enterprise_06_exam.sql
seed_enterprise_07_gallery_labs.sql
seed_enterprise_08_cms_global.sql
seed_enterprise_09_analytics.sql
```

**One-liner (from repo root):**
```bash
mysql -u root -p college_website < database/seed_enterprise_run_all.sql
```

---

## 15. Production Seeding Notes

1. **Passwords:** All test accounts use `Admin@123`. In production, force password reset on first login or generate per-user random passwords and communicate via email.

2. **File records:** The 20 seeded `files` rows use `storage_type=LOCAL` with placeholder paths (`/uploads/seed_*.pdf`). These files do not physically exist. The records exist only to satisfy FK constraints for notices, downloads, and events. Replace with real Cloudinary URLs when uploading actual documents.

3. **Bcrypt hash consistency:** The hash `$2b$10$UCUt4jzQmwHyCSC7aeojZuFUIEr9fROuyL2fgWMJpADyx4DxvKgjC` was generated with bcrypt cost 10 for `Admin@123`. Verify with the running backend's `bcrypt.compare()` before demo.

4. **Idempotency:** All inserts use `ON DUPLICATE KEY UPDATE`, so the seed scripts are safe to re-run without creating duplicates. The exception is `audit_logs` and `timetable_entries` which use plain `INSERT` (safe for first run; re-running appends).

5. **department_id patching:** Part 02 uses `UPDATE users SET department_id=...` statements. If users already have department_id set from a previous seed run, these will safely overwrite with the correct values.

6. **Exam section IDs:** Part 06 uses `SET @sec_ce_a = (SELECT id FROM exam_sections ...)` variables. MySQL user variables are session-scoped so they work correctly within a single session execution.

7. **Chatbot integration:** The `chatbot_responses` table uses comma-separated `keywords` text. The backend's chatbot service should split on comma and do `LIKE %keyword%` matching. For semantic/vector search, feed the `reply` text into your embedding pipeline keyed by `category + display_order`.

8. **Analytics baseline:** The 30-day visitor stats and totals give dashboards real-looking graphs from day one. Update `visitor_total` via the `/api/v1/analytics` endpoint as real traffic accumulates.

9. **RGPV enrollment format:** Student enrollment numbers follow the RGPV pattern: `0801CE211001` = `08` (institute code) + `01` (branch code) + `CE` (branch) + `21` (joining year) + `1001` (serial).

10. **Removing seed data for production launch:** Run `DELETE FROM table WHERE created_at < '2025-06-01'` pattern selectively, or tag seed rows with a `is_seed=1` flag if the schema supports it. Alternatively keep the data as it forms a useful historical baseline.
