/**
 * MOCK: Sidebar Navigation Links & Section Banners
 * Replace with: GET /api/navigation/sidebar
 *
 * Consumed ONLY through src/services/navigationService.ts
 *
 * This file centralizes all sidebar section configuration:
 *  - Section banners (title, subtitle, iconName per section)
 *  - Sidebar navigation links (label, path per section)
 *  - Section title labels shown in LeftSidebar header
 *
 * Admin panel can:
 *  - Edit banner titles and subtitles per section
 *  - Add, remove, or reorder sidebar links
 *  - Change the icon for any section banner
 */

// ─── Types ────────────────────────────────────────────────────────────────────

export interface SidebarLink {
  label: string
  path: string
}

export interface SectionBanner {
  /** Section key that matches the URL first path segment */
  section: string
  /** Displayed title in the section banner header */
  title: string
  /** Subtitle / description in the section banner */
  subtitle: string
  /** Icon name — matched against an ICON_MAP in the component */
  iconName: string
  /** Short display label used in LeftSidebar header */
  sectionLabel: string
}

export interface SidebarSectionConfig {
  banner: SectionBanner
  links: SidebarLink[]
}

// ─── Section Banners ──────────────────────────────────────────────────────────

export const mockSectionBanners: Record<string, SectionBanner> = {
  about: {
    section: 'about',
    title: 'About the Institute',
    subtitle: 'Discover the heritage, autonomous status, and leadership of SGSITS Indore.',
    iconName: 'Info',
    sectionLabel: 'About Us',
  },
  academics: {
    section: 'academics',
    title: 'Academics at SGSITS',
    subtitle: 'Rigorous schemes, ordinances, and academic calendars designed for excellence.',
    iconName: 'GraduationCap',
    sectionLabel: 'Academics',
  },
  facilities: {
    section: 'facilities',
    title: 'Campus & Facilities',
    subtitle: 'State-of-the-art resources, research labs, hostel life, and sports complexes.',
    iconName: 'Building2',
    sectionLabel: 'Facilities',
  },
  admission: {
    section: 'admission',
    title: 'Admissions Portal',
    subtitle: 'Shape your future here. Find entry pathways, eligibility requirements, and guides.',
    iconName: 'FileCheck2',
    sectionLabel: 'Admissions',
  },
  placement: {
    section: 'placement',
    title: 'Training & Placements',
    subtitle: 'Bridging academia and top-tier global industries. View our exceptional stats.',
    iconName: 'Briefcase',
    sectionLabel: 'Placements',
  },
  explore: {
    section: 'explore',
    title: 'Explore SGSITS',
    subtitle: 'Browse photo albums, watch video tours, and discover our historical campus.',
    iconName: 'Compass',
    sectionLabel: 'Explore',
  },
  startup: {
    section: 'startup',
    title: 'Startup & Innovation Cell',
    subtitle: 'Nurturing student-led entrepreneurship, incubation, and technological research.',
    iconName: 'Lightbulb',
    sectionLabel: 'Startup Cell',
  },
  teqip: {
    section: 'teqip',
    title: 'TEQIP Initiatives',
    subtitle: 'Technical Education Quality Improvement Programme of the Government of India.',
    iconName: 'Award',
    sectionLabel: 'TEQIP III',
  },
  news: {
    section: 'news',
    title: 'Campus News & Stories',
    subtitle: 'Achievements, research breakthroughs, events, and stories from the SGSITS community.',
    iconName: 'BookOpen',
    sectionLabel: 'News',
  },
  notices: {
    section: 'notices',
    title: 'Official Notices',
    subtitle: 'Academic announcements, exam schedules, and administrative notifications.',
    iconName: 'Info',
    sectionLabel: 'Notices',
  },
  events: {
    section: 'events',
    title: 'Campus Events',
    subtitle: 'Conferences, technical festivals, sports events, and cultural programs at SGSITS.',
    iconName: 'Compass',
    sectionLabel: 'Events',
  },
  tenders: {
    section: 'tenders',
    title: 'Active Tenders',
    subtitle: 'Procurement notices, bids, and active contract opportunities of the institute.',
    iconName: 'FileCheck2',
    sectionLabel: 'Tenders',
  },
  students: {
    section: 'students',
    title: 'Student Life & Activities',
    subtitle: 'Scholarships, clubs, NCC, NSS, sports and vibrant campus life at SGSITS.',
    iconName: 'Users',
    sectionLabel: 'Students',
  },
}

// ─── Default Section Banner ───────────────────────────────────────────────────

export const mockDefaultSectionBanner: SectionBanner = {
  section: 'default',
  title: 'SGSITS Indore',
  subtitle: 'An Institute of National Standing — Established in 1952',
  iconName: 'BookOpen',
  sectionLabel: 'Navigation',
}

// ─── Sidebar Links ────────────────────────────────────────────────────────────

export const mockSidebarLinks: Record<string, SidebarLink[]> = {
  about: [
    { label: 'About Institute',            path: '/about/institute' },
    { label: 'Vision & Mission',           path: '/about/vision-mission' },
    { label: "Director's Message",         path: '/about/director-message' },
    { label: 'Governing Body',             path: '/about/governing-body' },
    { label: 'Administration',             path: '/about/administration' },
    { label: 'Administrative Committees',  path: '/about/committees' },
    { label: 'Telephone Directory',        path: '/about/telephone-directory' },
    { label: 'Infrastructure',             path: '/about/infrastructure' },
    { label: 'IQAC Cell',                  path: '/about/iqac' },
    { label: 'Academic Council',           path: '/about/academic-council' },
    { label: 'Accreditation (NBA/NAAC)',   path: '/about/accreditation' },
  ],
  academics: [
    { label: 'Academic Calendar',          path: '/academics/calendar' },
    { label: 'UG Courses',                 path: '/academics/courses/ug' },
    { label: 'PG Courses',                 path: '/academics/courses/pg' },
    { label: 'Ph.D. Programs',             path: '/academics/courses/phd' },
    { label: 'PTDC Courses',               path: '/academics/courses/ptdc' },
    { label: 'Online Courses (MOOC)',      path: '/academics/courses/online' },
    { label: 'First Year Info',            path: '/academics/first-year' },
    { label: 'Exam & Results',             path: '/academics/exam-results' },
    { label: 'Ordinances',                 path: '/academics/ordinances' },
    { label: 'Plagiarism Policy',          path: '/academics/plagiarism-policy' },
    { label: 'Code of Ethics',             path: '/academics/code-of-conduct' },
    { label: 'OBE & NEP 2020',             path: '/academics/obe-nep-2020' },
  ],
  admission: [
    { label: 'UG Admission',               path: '/admission/ug' },
    { label: 'PG Admission',               path: '/admission/pg' },
    { label: 'PhD Admission',              path: '/admission/phd' },
    { label: 'Prospectus Download',        path: '/admission/prospectus' },
  ],
  placement: [
    { label: 'T&P Cell Overview',          path: '/placement/tnp-cell' },
    { label: 'Leading Recruiters',         path: '/placement/companies' },
    { label: 'Placement Record',           path: '/placement/record' },
    { label: 'Placement Contacts',         path: '/placement/contact' },
  ],
  students: [
    { label: 'Student Activities',         path: '/students/activities' },
    { label: 'Govt. Scholarships',         path: '/students/scholarship/govt' },
    { label: 'Institute Scholarships',     path: '/students/scholarship/institute' },
    { label: 'Sports & Games (SSS)',       path: '/students/sss' },
    { label: 'NCC Wing',                   path: '/students/ncc' },
    { label: 'NSS Wing',                   path: '/students/nss' },
  ],
  facilities: [
    { label: 'Computer Center',            path: '/facilities/computer-center' },
    { label: 'Central Library',            path: '/facilities/library' },
    { label: 'Central Workshop',           path: '/facilities/workshop' },
    { label: 'Gymnasium',                  path: '/facilities/gymnasium' },
    { label: 'Dispensary',                 path: '/facilities/dispensary' },
    { label: 'CIDI Center',               path: '/facilities/cidi' },
    { label: 'Sports Complex',             path: '/facilities/sports' },
    { label: 'Boys Hostel',                path: '/facilities/hostel/boys' },
    { label: 'Girls Hostel',               path: '/facilities/hostel/girls' },
    { label: 'Transit Hostel',             path: '/facilities/hostel/transit' },
    { label: 'Staff Quarters',             path: '/facilities/hostel/staff' },
    { label: 'AICTE IDEA Lab',             path: '/facilities/idea-lab' },
  ],
  explore: [
    { label: 'Campus Map',                 path: '/explore/campus-map' },
    { label: 'Photo Gallery',              path: '/explore/gallery' },
    { label: 'Video Tour',                 path: '/explore/video-tour' },
    { label: 'SGSITS Anthem',             path: '/explore/anthem' },
  ],
  teqip: [
    { label: 'About TEQIP',               path: '/teqip/about' },
    { label: 'Objectives',                 path: '/teqip/objectives' },
    { label: 'Financial Allocation',       path: '/teqip/financial' },
    { label: 'Equity Action Plan',         path: '/teqip/equity' },
    { label: 'Board of Governors',         path: '/teqip/bog' },
    { label: 'Twinning Arrangement',       path: '/teqip/twinning' },
    { label: 'Expenditures List',          path: '/teqip/expenditures' },
    { label: 'Vouchers & Forms',           path: '/teqip/vouchers' },
  ],
  news: [
    { label: 'Campus News',               path: '/news' },
    { label: 'Latest Notices',            path: '/notices' },
    { label: 'Upcoming Events',           path: '/events' },
    { label: 'Active Tenders',            path: '/tenders' },
  ],
  notices: [
    { label: 'Campus News',               path: '/news' },
    { label: 'Latest Notices',            path: '/notices' },
    { label: 'Upcoming Events',           path: '/events' },
    { label: 'Active Tenders',            path: '/tenders' },
  ],
  events: [
    { label: 'Campus News',               path: '/news' },
    { label: 'Latest Notices',            path: '/notices' },
    { label: 'Upcoming Events',           path: '/events' },
    { label: 'Active Tenders',            path: '/tenders' },
  ],
  tenders: [
    { label: 'Campus News',               path: '/news' },
    { label: 'Latest Notices',            path: '/notices' },
    { label: 'Upcoming Events',           path: '/events' },
    { label: 'Active Tenders',            path: '/tenders' },
  ],
}
