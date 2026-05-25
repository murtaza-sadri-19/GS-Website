/**
 * MOCK: Comprehensive Footer CMS Data
 * Replace with: GET /api/cms/footer
 *
 * Consumed ONLY through src/services/footerService.ts
 * Never import this file directly from components.
 */

// ─── Types ────────────────────────────────────────────────────────────────────

export interface FooterBranding {
  shortCode: string
  instituteName: string
  shortName: string
  tagline: string
  subTagline: string
  description: string
  logoUrl: string
  logoAlt: string
  estYear: string
}

export interface FooterContact {
  address: string
  phone: string
  email: string
  mapEmbedUrl: string
  visible: boolean
}

export interface FooterLink {
  id: string
  label: string
  to?: string       // internal React Router path
  href?: string     // external URL
  external?: boolean
  order: number
  visible: boolean
}

export interface FooterSection {
  id: string
  heading: string
  headingVisible: boolean
  visible: boolean
  links: FooterLink[]
}

export interface FooterDepartmentConfig {
  visible: boolean
  heading: string
  autoSync: boolean
  maxVisible: number
  /** slugs to show in footer; empty = all active departments */
  visibleSlugs: string[]
}

export interface FooterPolicyLink {
  id: string
  label: string
  to: string
  order: number
  visible: boolean
}

export interface FooterBottomBar {
  poweredBy: string
  developerCredit: string
  copyrightOwner: string
  showCopyrightYear: boolean
  visible: boolean
}

export interface FooterVisitorStats {
  enabled: boolean
  label: string
  count: string
  note: string
}

export interface FooterSocialLink {
  id: string
  platform: 'facebook' | 'twitter' | 'youtube' | 'linkedin' | 'instagram' | 'github' | 'other'
  label: string
  url: string
  order: number
  visible: boolean
}

export interface FooterSocialMedia {
  enabled: boolean
  heading: string
  links: FooterSocialLink[]
}

export interface FooterSeoMeta {
  schemaOrgEnabled: boolean
  openGraphEnabled: boolean
  footerMetaDescription: string
}

export interface FooterLayoutConfig {
  showBrandingColumn: boolean
  showQuickLinks: boolean
  showStudentLinks: boolean
  showDepartmentLinks: boolean
  showExternalLinks: boolean
  showVisitorStats: boolean
  showSocialMedia: boolean
  showPolicyBar: boolean
  showBottomBar: boolean
}

export interface FooterCmsData {
  branding: FooterBranding
  contact: FooterContact
  quickLinks: FooterSection
  studentLinks: FooterSection
  departments: FooterDepartmentConfig
  externalLinks: FooterSection
  policyLinks: FooterPolicyLink[]
  bottomBar: FooterBottomBar
  visitorStats: FooterVisitorStats
  socialMedia: FooterSocialMedia
  seo: FooterSeoMeta
  layout: FooterLayoutConfig
}

// ─── Seed Mock Data ───────────────────────────────────────────────────────────

export const mockFooterCmsData: FooterCmsData = {
  branding: {
    shortCode:     'SG',
    instituteName: 'Shri G. S. Institute of Technology & Science',
    shortName:     'SGSITS INDORE',
    tagline:       'An Institute of National Standing',
    subTagline:    'Govt. Aided Autonomous Institute, Indore (M.P.) - Estd. 1952',
    description:   'Shri G. S. Institute of Technology & Science, Indore is a prestigious autonomous engineering institution of national repute.',
    logoUrl:       '/assets/image.png',
    logoAlt:       'SGSITS Indore Logo',
    estYear:       'Est. 1952',
  },

  contact: {
    address:     '23, Park Road (Sir M. Visvesvaraya Marg), Indore, M.P. - 452003, India',
    phone:       '+91-731-2582100, 2582124',
    email:       'registrar@sgsits.ac.in',
    mapEmbedUrl: '',
    visible:     true,
  },

  quickLinks: {
    id:             'quick-links',
    heading:        'Administration',
    headingVisible: true,
    visible:        true,
    links: [
      { id: 'ql-1', label: 'About the Institute',   to: '/about/institute',           order: 1, visible: true },
      { id: 'ql-2', label: "Director's Message",    to: '/about/director-message',    order: 2, visible: true },
      { id: 'ql-3', label: 'Governing Body Board',  to: '/about/governing-body',      order: 3, visible: true },
      { id: 'ql-4', label: 'Helpline & Directory',  to: '/about/telephone-directory', order: 4, visible: true },
      { id: 'ql-5', label: 'IQAC Quality Cell',     to: '/about/iqac',                order: 5, visible: true },
      { id: 'ql-6', label: 'NBA & NAAC Status',     to: '/about/accreditation',       order: 6, visible: true },
    ],
  },

  studentLinks: {
    id:             'student-links',
    heading:        'Student Gateways',
    headingVisible: true,
    visible:        true,
    links: [
      { id: 'sl-1', label: 'Academic Session Calendar',   to: '/academics/calendar',        order: 1, visible: true },
      { id: 'sl-2', label: 'Exam Registration & Results', to: '/academics/exam-results',    order: 2, visible: true },
      { id: 'sl-3', label: 'Government Scholarships',     to: '/students/scholarship/govt', order: 3, visible: true },
      { id: 'sl-4', label: 'Training & Placements (T&P)', to: '/placement/tnp-cell',        order: 4, visible: true },
      { id: 'sl-5', label: 'Central Library & Catalog',   to: '/facilities/library',        order: 5, visible: true },
      { id: 'sl-6', label: 'Incubation & Startup Cell',   to: '/startup-cell',              order: 6, visible: true },
    ],
  },

  departments: {
    visible:      false,
    heading:      'Departments',
    autoSync:     true,
    maxVisible:   12,
    visibleSlugs: [],
  },

  externalLinks: {
    id:             'external-links',
    heading:        'Portals & Resources',
    headingVisible: true,
    visible:        true,
    links: [
      { id: 'el-1', label: 'AICTE India',        href: 'https://www.aicte-india.org', external: true, order: 1, visible: true },
      { id: 'el-2', label: 'DTE Madhya Pradesh', href: 'https://www.mptechedu.org',   external: true, order: 2, visible: true },
      { id: 'el-3', label: 'RGPV Bhopal',        href: 'https://www.rgpv.ac.in',      external: true, order: 3, visible: true },
    ],
  },

  policyLinks: [
    { id: 'pl-1', label: 'Privacy Policy',          to: '/policy/privacy',       order: 1, visible: true },
    { id: 'pl-2', label: 'Terms of Use',            to: '/policy/terms',         order: 2, visible: true },
    { id: 'pl-3', label: 'Disclaimer',              to: '/policy/disclaimer',    order: 3, visible: true },
    { id: 'pl-4', label: 'Accessibility Statement', to: '/policy/accessibility', order: 4, visible: true },
    { id: 'pl-5', label: 'Copyright Policy',        to: '/policy/copyright',     order: 5, visible: true },
    { id: 'pl-6', label: 'Hyperlinking Policy',     to: '/policy/hyperlink',     order: 6, visible: true },
    { id: 'pl-7', label: 'Sitemap',                 to: '/policy/sitemap',       order: 7, visible: true },
    { id: 'pl-8', label: 'Feedback & Help',         to: '/contact',              order: 8, visible: true },
  ],

  bottomBar: {
    poweredBy:         'SGSITS Web Cell',
    developerCredit:   'Designed and developed as a responsive React single page application.',
    copyrightOwner:    'SGSITS Indore (M.P.), India. All rights reserved.',
    showCopyrightYear: true,
    visible:           true,
  },

  visitorStats: {
    enabled: true,
    label:   'Visitor Statistics',
    count:   '02,485,391',
    note:    'Refreshed hourly • Institutional audit',
  },

  socialMedia: {
    enabled: false,
    heading: 'Follow Us',
    links: [
      { id: 'sm-1', platform: 'facebook',  label: 'Facebook',  url: 'https://facebook.com/sgsitsindore',        order: 1, visible: true },
      { id: 'sm-2', platform: 'twitter',   label: 'Twitter',   url: 'https://twitter.com/sgsitsindore',         order: 2, visible: true },
      { id: 'sm-3', platform: 'youtube',   label: 'YouTube',   url: 'https://youtube.com/@sgsitsindore',        order: 3, visible: true },
      { id: 'sm-4', platform: 'linkedin',  label: 'LinkedIn',  url: 'https://linkedin.com/school/sgsitsindore', order: 4, visible: true },
      { id: 'sm-5', platform: 'instagram', label: 'Instagram', url: 'https://instagram.com/sgsitsindore',       order: 5, visible: false },
    ],
  },

  seo: {
    schemaOrgEnabled:      true,
    openGraphEnabled:      false,
    footerMetaDescription: 'SGSITS Indore — Shri G. S. Institute of Technology & Science, a premier autonomous engineering institution in Indore, Madhya Pradesh.',
  },

  layout: {
    showBrandingColumn:  true,
    showQuickLinks:      true,
    showStudentLinks:    true,
    showDepartmentLinks: false,
    showExternalLinks:   true,
    showVisitorStats:    true,
    showSocialMedia:     false,
    showPolicyBar:       true,
    showBottomBar:       true,
  },
}
