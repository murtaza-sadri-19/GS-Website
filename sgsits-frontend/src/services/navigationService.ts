/**
 * Navigation Service — wired to GS-Website backend
 *
 * Backend: GET  /api/v1/navigation  — fetch nav tree
 *          PUT  /api/v1/navigation  — replace nav tree (admin only)
 *
 * Section banners and sidebar links are stored in CMS sections:
 *   GET/PUT /api/v1/settings/cms/navigation.sidebar
 *   GET/PUT /api/v1/settings/cms/navigation.banners
 */

import apiClient from '../api/client'
import { getCmsSection, saveCmsSection } from './settingsService'

export interface SidebarLink {
  label: string
  to?: string
  path?: string
  url?: string
  icon?: string
  [key: string]: any
}

export interface SectionBanner {
  section: string
  title: string
  subtitle: string
  iconName: string
  sectionLabel: string
  imageUrl?: string
}

// ─── Sidebar Links ────────────────────────────────────────────────────────────

export const getAllSidebarLinks = async (): Promise<Record<string, SidebarLink[]>> => {
  const data = await getCmsSection<Record<string, SidebarLink[]>>('navigation.sidebar')
  return (data && typeof data === 'object') ? data : {}
}

export const getSidebarLinks = async (section: string): Promise<SidebarLink[]> => {
  const all = await getAllSidebarLinks()
  return all[section] ?? []
}

export const saveSidebarLinks = async (section: string, links: SidebarLink[]): Promise<void> => {
  const all = await getAllSidebarLinks()
  await saveCmsSection('navigation.sidebar', { ...all, [section]: links })
}

export const saveAllSidebarLinks = async (data: Record<string, SidebarLink[]>): Promise<void> => {
  await saveCmsSection('navigation.sidebar', data)
}

// ─── Section Banners ──────────────────────────────────────────────────────────

export const getAllSectionBanners = async (): Promise<Record<string, SectionBanner>> => {
  const data = await getCmsSection<Record<string, SectionBanner>>('navigation.banners')
  return (data && typeof data === 'object') ? data : {}
}

export const getSectionBanner = async (section: string): Promise<SectionBanner> => {
  const all = await getAllSectionBanners()
  return all[section] ?? {} as SectionBanner
}

export const saveSectionBanner = async (section: string, banner: SectionBanner): Promise<void> => {
  const all = await getAllSectionBanners()
  await saveCmsSection('navigation.banners', { ...all, [section]: banner })
}

// ─── Main Navigation Tree ────────────────────────────────────────────────────

export interface NavItem {
  id?: number | string
  label: string
  url?: string
  children?: NavItem[]
  is_external?: boolean
  display_order?: number
}

export const getNavTree = async (): Promise<NavItem[]> => {
  try {
    const res = await apiClient.get('/v1/navigation')
    const data = res.data?.data
    return Array.isArray(data) ? data : []
  } catch {
    return []
  }
}

export const saveNavTree = async (items: NavItem[]): Promise<void> => {
  await apiClient.put('/v1/navigation', { items })
}

// ─── Quick Links ──────────────────────────────────────────────────────────────

export const getQuickLinks = async (): Promise<{ label: string; to: string }[]> => {
  try {
    const data = await getCmsSection<{ topBarQuickLinks?: { label: string; to: string }[] }>(
      'navigation.quick_links'
    )
    return data?.topBarQuickLinks ?? []
  } catch {
    return []
  }
}

// ─── Sync defaults ────────────────────────────────────────────────────────────
// These ship as fallbacks so the sidebar renders immediately on first paint.
// The backend (CMS navigation.sidebar) overrides them once fetched.
export const sidebarLinksDefaults: Record<string, SidebarLink[]> = {
  about: [
    { label: 'About Institute',          path: '/about/institute' },
    { label: 'Vision & Mission',         path: '/about/vision-mission' },
    { label: "Director's Message",       path: '/about/director-message' },
    { label: 'Governing Body',           path: '/about/governing-body' },
    { label: 'Administration',           path: '/about/administration' },
    { label: 'Administrative Committees', path: '/about/committees' },
    { label: 'Telephone Directory',      path: '/about/telephone-directory' },
    { label: 'Infrastructure',           path: '/about/infrastructure' },
    { label: 'IQAC',                     path: '/about/iqac' },
    { label: 'Academic Council',         path: '/about/academic-council' },
    { label: 'Accreditation',            path: '/about/accreditation' },
  ],
  academics: [
    { label: 'Academic Calendar',   path: '/academics/calendar' },
    { label: 'UG Courses',          path: '/academics/courses/ug' },
    { label: 'PG Courses',          path: '/academics/courses/pg' },
    { label: 'PhD Courses',         path: '/academics/courses/phd' },
    { label: 'PTDC Courses',        path: '/academics/courses/ptdc' },
    { label: 'Online Courses',      path: '/academics/courses/online' },
    { label: 'First Year Info',     path: '/academics/first-year' },
    { label: 'Exam & Results',      path: '/academics/exam-results' },
    { label: 'Ordinances',          path: '/academics/ordinances' },
    { label: 'Plagiarism Policy',   path: '/academics/plagiarism-policy' },
    { label: 'Code of Conduct',     path: '/academics/code-of-conduct' },
    { label: 'OBE & NEP 2020',      path: '/academics/obe-nep-2020' },
  ],
  students: [
    { label: 'Activities',              path: '/students/activities' },
    { label: 'Govt. Scholarship',       path: '/students/scholarship/govt' },
    { label: 'Institute Scholarship',   path: '/students/scholarship/institute' },
    { label: 'SSS',                     path: '/students/sss' },
    { label: 'NCC',                     path: '/students/ncc' },
    { label: 'NSS',                     path: '/students/nss' },
  ],
  facilities: [
    { label: 'Computer Center',  path: '/facilities/computer-center' },
    { label: 'Library',          path: '/facilities/library' },
    { label: 'Workshop',         path: '/facilities/workshop' },
    { label: 'Gymnasium',        path: '/facilities/gymnasium' },
    { label: 'Dispensary',       path: '/facilities/dispensary' },
    { label: 'CIDI',             path: '/facilities/cidi' },
    { label: 'Games & Sports',   path: '/facilities/sports' },
    { label: 'Boys Hostel',      path: '/facilities/hostel/boys' },
    { label: 'Girls Hostel',     path: '/facilities/hostel/girls' },
    { label: 'Transit Hostel',   path: '/facilities/hostel/transit' },
    { label: 'Staff Quarters',   path: '/facilities/hostel/staff' },
    { label: 'IDEA Lab',         path: '/facilities/idea-lab' },
  ],
  placement: [
    { label: 'T&P Cell',           path: '/placement/tnp-cell' },
    { label: 'Leading Companies',  path: '/placement/companies' },
    { label: 'Placement Record',   path: '/placement/record' },
    { label: 'Contact Person',     path: '/placement/contact' },
  ],
  admission: [
    { label: 'UG Admission',  path: '/admission/ug' },
    { label: 'PG Admission',  path: '/admission/pg' },
    { label: 'PhD Admission', path: '/admission/phd' },
    { label: 'Prospectus',    path: '/admission/prospectus' },
  ],
  explore: [
    { label: 'Photo Gallery', path: '/explore/gallery' },
    { label: 'Campus Map',    path: '/explore/campus-map' },
    { label: 'Video Tour',    path: '/explore/video-tour' },
    { label: 'SGSITS Anthem', path: '/explore/anthem' },
  ],
  policy: [
    { label: 'Privacy Policy',          path: '/policy/privacy' },
    { label: 'Terms of Use',            path: '/policy/terms' },
    { label: 'Disclaimer',              path: '/policy/disclaimer' },
    { label: 'Accessibility Statement', path: '/policy/accessibility' },
    { label: 'Copyright Policy',        path: '/policy/copyright' },
    { label: 'Hyperlink Policy',        path: '/policy/hyperlink' },
    { label: 'Security Policy',         path: '/policy/security' },
    { label: 'Site Map',                path: '/policy/sitemap' },
    { label: 'Web Info Manager',        path: '/policy/web-info-manager' },
    { label: 'Help',                    path: '/policy/help' },
    { label: 'Feedback',                path: '/policy/feedback' },
  ],
  teqip: [
    { label: 'About TEQIP',    path: '/teqip/about' },
    { label: 'Objectives',     path: '/teqip/objectives' },
    { label: 'Activities',     path: '/teqip/activities' },
    { label: 'Achievements',   path: '/teqip/achievements' },
    { label: 'Procurement',    path: '/teqip/procurement' },
    { label: 'Contact',        path: '/teqip/contact' },
  ],
}

export const sectionBannersDefaults: Record<string, SectionBanner> = {
  about: {
    section: 'about',
    title: 'About the Institute',
    subtitle: 'Discover the heritage, autonomous status, and leadership of SGSITS Indore.',
    iconName: 'Building2',
    sectionLabel: 'About Us',
  },
  academics: {
    section: 'academics',
    title: 'Academics',
    subtitle: 'Courses, calendar, results, and academic policies at SGSITS.',
    iconName: 'BookOpen',
    sectionLabel: 'Academics',
  },
  students: {
    section: 'students',
    title: 'Campus Life',
    subtitle: 'Activities, scholarships, NCC, NSS, and student services.',
    iconName: 'Users',
    sectionLabel: 'Campus Life',
  },
  facilities: {
    section: 'facilities',
    title: 'Facilities',
    subtitle: 'World-class infrastructure and amenities at SGSITS.',
    iconName: 'Landmark',
    sectionLabel: 'Facilities',
  },
  placement: {
    section: 'placement',
    title: 'Placements',
    subtitle: 'Training & placement cell, records, and leading recruiters.',
    iconName: 'Briefcase',
    sectionLabel: 'Placements',
  },
  admission: {
    section: 'admission',
    title: 'Admissions',
    subtitle: 'UG, PG, and PhD admission information at SGSITS.',
    iconName: 'ClipboardList',
    sectionLabel: 'Admissions',
  },
  explore: {
    section: 'explore',
    title: 'Explore SGSITS',
    subtitle: 'Gallery, campus map, video tour, and the institute anthem.',
    iconName: 'Compass',
    sectionLabel: 'Explore',
  },
  policy: {
    section: 'policy',
    title: 'Policies & Information',
    subtitle: 'Privacy, copyright, accessibility, and institutional policies at SGSITS.',
    iconName: 'Shield',
    sectionLabel: 'Policies',
  },
  teqip: {
    section: 'teqip',
    title: 'TEQIP',
    subtitle: 'Technical Education Quality Improvement Programme at SGSITS Indore.',
    iconName: 'Award',
    sectionLabel: 'TEQIP',
  },
  startup: {
    section: 'startup',
    title: 'Startup Cell',
    subtitle: 'Fostering entrepreneurship and innovation at SGSITS.',
    iconName: 'Lightbulb',
    sectionLabel: 'Startup Cell',
  },
  news: {
    section: 'news',
    title: 'News',
    subtitle: 'Latest news and updates from SGSITS Indore.',
    iconName: 'Newspaper',
    sectionLabel: 'News',
  },
  notices: {
    section: 'notices',
    title: 'Notices',
    subtitle: 'Official notices, circulars, and announcements from SGSITS.',
    iconName: 'Bell',
    sectionLabel: 'Notices',
  },
  events: {
    section: 'events',
    title: 'Events',
    subtitle: 'Upcoming and past events, seminars, and workshops at SGSITS.',
    iconName: 'Calendar',
    sectionLabel: 'Events',
  },
  tenders: {
    section: 'tenders',
    title: 'Tenders',
    subtitle: 'Active and closed procurement tenders from SGSITS Indore.',
    iconName: 'FileText',
    sectionLabel: 'Tenders',
  },
  departments: {
    section: 'departments',
    title: 'Departments',
    subtitle: 'Academic departments, faculty, and research at SGSITS.',
    iconName: 'Building2',
    sectionLabel: 'Departments',
  },
}
export const defaultSectionBanner: SectionBanner = {
  section: '',
  title: '',
  subtitle: '',
  iconName: 'BookOpen',
  sectionLabel: '',
}
export const quickLinksDefaults: { label: string; to: string }[] = []

export const navigationService = {
  getSidebarLinks,
  getAllSidebarLinks,
  saveSidebarLinks,
  saveAllSidebarLinks,
  getSectionBanner,
  getAllSectionBanners,
  saveSectionBanner,
  getNavTree,
  saveNavTree,
  getQuickLinks,
}

export default navigationService
