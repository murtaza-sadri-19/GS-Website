// ─────────────────────────────────────────────
//  SGSITS Frontend — Shared TypeScript Types
//  All API response shapes are defined here.
//  When backend is ready, these types should
//  match the actual JSON response schemas.
// ─────────────────────────────────────────────

// ── Auth ──────────────────────────────────────
export type UserRole =
  // ── Backend canonical role names (returned by JWT) ──────────────────────
  | 'CENTRAL_ADMIN'         // Full institute control — same as super_admin
  | 'HOD'                   // Head of Department — branch-scoped
  | 'TEACHER'               // Faculty role — own-profile, publications, subjects
  | 'EXAM_CONTROLLER'       // Exam dept — sessions, timetables, results, calendar
  | 'PLACEMENT_OFFICER'     // Placement cell — notices, company visits, records
  // ── Legacy / alias role names (kept for backwards compatibility) ─────────
  | 'super_admin'
  | 'central_admin'
  | 'editor'
  | 'hod'
  | 'faculty'
  | 'teacher'
  | 'exam_controller'
  | 'placement_officer'
  | 'student'               // ERP redirect target only

export interface AuthUser {
  id: string
  name: string
  email: string
  role: UserRole
  /** Numeric department/branch ID from the backend JWT payload */
  department_id?: number
  /** Legacy string alias kept for backwards compatibility */
  department?: string
  employeeId?: string
  avatarUrl?: string
}

export interface LoginResponse {
  token: string
  user: AuthUser
}

// ── Notices ───────────────────────────────────
export interface Notice {
  id: string
  title: string
  description: string
  category: string
  isNew: boolean
  attachmentUrl?: string
  publishedAt: string   // ISO date string
  expiresAt?: string
  publishedBy: string
  isActive: boolean
}

// ── News ──────────────────────────────────────
export interface NewsItem {
  id: string
  title: string
  summary: string
  content: string
  category: 'Research' | 'Achievement' | 'Event' | 'Industry' | 'General'
  imageUrl?: string
  publishedAt: string
  publishedBy: string
  isActive: boolean
  tags: string[]
}

// ── Events ────────────────────────────────────
export interface Event {
  id: string
  title: string
  description: string
  venue: string
  startDate: string
  endDate?: string
  category: 'Cultural' | 'Technical' | 'Sports' | 'Academic' | 'Workshop' | 'Seminar'
  organizer: string
  registrationUrl?: string
  imageUrl?: string
  isActive: boolean
}

// ── Tenders ───────────────────────────────────
export type TenderStatus = 'Open' | 'Closed' | 'Cancelled'

export interface Tender {
  id: string
  title: string
  refNo: string
  department: string
  status: TenderStatus
  publishedAt: string
  lastDate: string
  documentUrl?: string
  estimatedValue?: string
  description?: string
}

// ── Alerts (Marquee / Announcements) ──────────
export interface Alert {
  id: string
  text: string
  link?: string
  priority: 'low' | 'normal' | 'high' | 'urgent'
  isActive: boolean
  createdAt: string
  expiresAt?: string
}

// ── Faculty ───────────────────────────────────
export interface Faculty {
  id: string
  name: string
  designation: 'Professor & Head' | 'Professor' | 'Associate Professor' | 'Assistant Professor' | 'Lecturer' | 'Lab Assistant'
  department: string
  qualification: string
  specialization: string
  email: string
  phone?: string
  employeeId: string
  joiningDate: string
  photoUrl?: string
  isActive: boolean
  researchAreas?: string[]
  publications?: number
}

// ── Department ────────────────────────────────
export interface Department {
  id: string
  slug: string
  name: string
  shortName: string
  hodName: string
  hodEmail: string
  hodPhone?: string
  programsOffered: string[]
  facultyCount: number
  establishedYear?: number
  vision?: string
  mission?: string
  isActive: boolean
}

// ── Gallery ───────────────────────────────────
export interface GalleryAlbum {
  id: string
  title: string
  slug: string
  description: string
  coverImageUrl?: string
  photoCount: number
  createdAt: string
  isActive: boolean
}

export interface GalleryPhoto {
  id: string
  albumId: string
  caption: string
  imageUrl: string
  uploadedAt: string
  uploadedBy: string
}

// ── Placement ─────────────────────────────────
export interface PlacementRecord {
  id: string
  year: string             // e.g. "2023-24"
  totalStudents: number
  studentsPlaced: number
  placementPercent: number
  highestPackage: string   // e.g. "₹50 LPA"
  averagePackage: string
  recruiters: number
}

export interface PlacementCompany {
  id: string
  name: string
  sector: 'IT/Software' | 'Core Engineering' | 'Finance' | 'Consulting' | 'PSU' | 'Startup' | 'Other'
  logoUrl?: string
  visitYear: string
  offersExtended: number
}

// ── Settings ──────────────────────────────────
export interface SiteSettings {
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

// ── Branding & Identity ────────────────────────
export interface BrandingConfig {
  shortCode: string
  shortName: string
  fullName: string
  establishedYear: string
  subTagline: string
  tagline: string
  logoUrl: string
  logoAlt: string
  logoSuffix: string
  mobileDrawerTitle: string
  mobileDrawerFooter: string
  mobileNavSectionLabel: string
  preloaderEnabled?: boolean
}

// ── Navigation: Sidebar & Quick Links ──────────
export interface SidebarNavLink {
  label: string
  path: string
}

export interface SectionBanner {
  section: string
  title: string
  subtitle: string
  iconName: string
  sectionLabel: string
}

export interface QuickLink {
  label: string
  to: string
}

// ── SEO ────────────────────────────────────────
export interface SeoMeta {
  pageKey: string
  pageTitle: string
  metaDescription: string
  ogTitle?: string
  ogDescription?: string
  ogImage?: string
  canonicalUrl?: string
  twitterCard?: 'summary' | 'summary_large_image'
  keywords?: string
}

// ── Chatbot ────────────────────────────────────
export interface ChatbotResponseItem {
  id: string
  category: string
  keywords: string[]
  reply: string
}

export interface ChatbotConfig {
  botName: string
  avatarUrl: string
  welcomeMessage: string
  inputPlaceholder: string
  fallbackMessage: string
  quickPrompts: string[]
  responses: ChatbotResponseItem[]
}

// ── UI Labels ──────────────────────────────────
export interface UiLabelsConfig {
  accessibility: {
    skipToContent: string
    textSizeLabel: string
    textSizeSmall: string
    textSizeNormal: string
    textSizeLarge: string
    highContrast: string
    normalContrast: string
    lightMode: string
    darkMode: string
  }
  homepage: {
    announcementsHeading: string
    announcementsBadge: string
    viewAllNoticesLabel: string
    viewAllDepartmentsLabel: string
    viewAllFaqsLabel: string
    viewAllGalleryLabel: string
  }
  header: {
    searchPlaceholder: string
    searchButtonLabel: string
    loginLabel: string
    erpPortalFallbackLabel: string
    mobileMenuOpenLabel: string
    mobileMenuCloseLabel: string
  }
  sidebar: {
    sectionMenuLabel: string
    portalSuffix: string
  }
  footer: {
    copyrightPrefix: string
  }
  breadcrumbs: {
    homeLabel: string
  }
  notFound: {
    heading: string
    subheading: string
    backLabel: string
    homeLabel: string
  }
  portal: {
    loadingLabel: string
    errorLabel: string
    saveLabel: string
    cancelLabel: string
    editLabel: string
    deleteLabel: string
    addLabel: string
    confirmDeleteLabel: string
    searchPlaceholder: string
  }
  topBarQuickLinks: QuickLink[]
}

// ── Homepage Section Config ────────────────────
export type HomeSectionId =
  | 'hero'
  | 'hero_tiles'
  | 'about_director'
  | 'campus_news'
  | 'academics'
  | 'departments'
  | 'stats'
  | 'campus_life'
  | 'faqs_gallery'

export interface HomeSectionConfig {
  id: HomeSectionId
  enabled: boolean
  order: number
}

// ── API Generic Wrappers ───────────────────────
export interface ApiResponse<T> {
  success: boolean
  data: T
  message?: string
}

export interface PaginatedResponse<T> {
  success: boolean
  data: T[]
  total: number
  page: number
  limit: number
}
