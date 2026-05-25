/**
 * MOCK: Navigation / Menu Items
 * Replace with: GET /api/navigation
 *
 * Controls the entire site navigation structure.
 * Consumed ONLY through src/services/navService.ts.
 */

export interface NavChild {
  label: string
  path: string
}

export interface NavItem {
  id?: string
  label: string
  path?: string          // if present → direct link, no dropdown
  children?: NavChild[]
}

export const mockNavItems: NavItem[] = [
  {
    label: 'Home',
    path: '/',
  },
  {
    id: 'about',
    label: 'About Us',
    children: [
      { label: 'About Institute',             path: '/about/institute' },
      { label: 'Vision & Mission',            path: '/about/vision-mission' },
      { label: "Director's Message",          path: '/about/director-message' },
      { label: 'Governing Body',              path: '/about/governing-body' },
      { label: 'Administration',              path: '/about/administration' },
      { label: 'Administrative Committees',   path: '/about/committees' },
      { label: 'Telephone Directory',         path: '/about/telephone-directory' },
      { label: 'Infrastructure',              path: '/about/infrastructure' },
      { label: 'IQAC Cell',                   path: '/about/iqac' },
      { label: 'Academic Council',            path: '/about/academic-council' },
      { label: 'Accreditation (NBA/NAAC)',    path: '/about/accreditation' },
    ],
  },
  {
    label: 'Academics',
    children: [
      { label: 'Academic Calendar',       path: '/academics/calendar' },
      { label: 'UG Courses',              path: '/academics/courses/ug' },
      { label: 'PG Courses',              path: '/academics/courses/pg' },
      { label: 'Ph.D. Programs',          path: '/academics/courses/phd' },
      { label: 'PTDC Courses',            path: '/academics/courses/ptdc' },
      { label: 'Online Courses (MOOC)',   path: '/academics/courses/online' },
      { label: 'First Year Info',         path: '/academics/first-year' },
      { label: 'Exam & Results',          path: '/academics/exam-results' },
      { label: 'Ordinances',              path: '/academics/ordinances' },
      { label: 'Plagiarism Policy',       path: '/academics/plagiarism-policy' },
      { label: 'Code of Ethics',          path: '/academics/code-of-conduct' },
      { label: 'OBE & NEP 2020',          path: '/academics/obe-nep-2020' },
    ],
  },
  {
    label: 'Departments',
    children: [
      { label: 'All Departments',                  path: '/departments' },
      { label: 'Applied Chemistry',                path: '/departments/applied-chemistry' },
      { label: 'Applied Mathematics',              path: '/departments/applied-mathematics' },
      { label: 'Applied Physics',                  path: '/departments/applied-physics' },
      { label: 'Biomedical Engineering',           path: '/departments/biomedical-engineering' },
      { label: 'Civil Engineering',                path: '/departments/civil-engineering' },
      { label: 'Computer Engineering',             path: '/departments/computer-engineering' },
      { label: 'Computer Tech & Apps (CTA)',        path: '/departments/computer-technology' },
      { label: 'Electrical Engineering',           path: '/departments/electrical-engineering' },
      { label: 'Electronics & Instrumentation',    path: '/departments/electronics-instrumentation' },
      { label: 'Electronics & Telecomm',           path: '/departments/electronics-telecommunication' },
      { label: 'Humanities & Social Sciences',     path: '/departments/humanities' },
      { label: 'Industrial & Production',          path: '/departments/industrial-production' },
      { label: 'Information Technology',           path: '/departments/information-technology' },
      { label: 'Management Studies (MBA)',          path: '/departments/management-studies' },
      { label: 'Mechanical Engineering',           path: '/departments/mechanical-engineering' },
      { label: 'Pharmacy',                         path: '/departments/pharmacy' },
      { label: 'Centre of Excellence (CoE)',       path: '/departments/coebg' },
    ],
  },
  {
    id: 'admission',
    label: 'Admissions',
    children: [
      { label: 'UG Admissions',          path: '/admission/ug' },
      { label: 'PG Admissions',          path: '/admission/pg' },
      { label: 'PhD Admissions',         path: '/admission/phd' },
      { label: 'Prospectus Download',    path: '/admission/prospectus' },
    ],
  },
  {
    id: 'placement',
    label: 'Placements',
    children: [
      { label: 'T&P Cell Overview',     path: '/placement/tnp-cell' },
      { label: 'Leading Recruiters',    path: '/placement/companies' },
      { label: 'Placement Record',      path: '/placement/record' },
      { label: 'Placement Contacts',    path: '/placement/contact' },
    ],
  },
  {
    id: 'campus-life',
    label: 'Campus Life',
    children: [
      { label: 'Student Activities',             path: '/students/activities' },
      { label: 'Govt. Scholarships',             path: '/students/scholarship/govt' },
      { label: 'Institute Scholarships',         path: '/students/scholarship/institute' },
      { label: 'Sports & Games (SSS)',            path: '/students/sss' },
      { label: 'NCC Wing',                       path: '/students/ncc' },
      { label: 'NSS Wing',                       path: '/students/nss' },
    ],
  },
  {
    label: 'Facilities',
    children: [
      { label: 'Computer Center',    path: '/facilities/computer-center' },
      { label: 'Central Library',    path: '/facilities/library' },
      { label: 'Central Workshop',   path: '/facilities/workshop' },
      { label: 'Gymnasium',          path: '/facilities/gymnasium' },
      { label: 'Dispensary',         path: '/facilities/dispensary' },
      { label: 'CIDI Center',        path: '/facilities/cidi' },
      { label: 'Sports Complex',     path: '/facilities/sports' },
      { label: 'Boys Hostel',        path: '/facilities/hostel/boys' },
      { label: 'Girls Hostel',       path: '/facilities/hostel/girls' },
      { label: 'Transit Hostel',     path: '/facilities/hostel/transit' },
      { label: 'Staff Quarters',     path: '/facilities/hostel/staff' },
      { label: 'AICTE IDEA Lab',     path: '/facilities/idea-lab' },
    ],
  },
  {
    label: 'More',
    children: [
      { label: 'Startup & Incubation Cell',  path: '/startup-cell' },
      { label: 'TEQIP Portal',               path: '/teqip/about' },
      { label: 'Latest Notices',             path: '/notices' },
      { label: 'Campus News',               path: '/news' },
      { label: 'Upcoming Events',           path: '/events' },
      { label: 'Procurement Tenders',       path: '/tenders' },
      { label: 'Contact Us',               path: '/contact' },
    ],
  },
]
