/**
 * MOCK: Site-wide Settings
 * Replace with: GET /api/settings
 *
 * This file is the single source of truth for all global institute
 * configuration. It is consumed ONLY through src/services/settingsService.ts —
 * never import this file directly from components.
 */

import type { SiteSettings } from '../../types'

export interface FooterColumnLink {
  label: string
  to?: string          // internal route
  href?: string        // external URL
  external?: boolean
}

export interface FooterColumn {
  heading: string
  links: FooterColumnLink[]
}

export interface FooterBottomLink {
  label: string
  to: string
}

export interface FooterData {
  institution: {
    shortCode: string         // "SG" badge initials
    name: string
    estYear: string
    tagline: string
    description: string
    address: string
    phone: string
    email: string
  }
  columns: FooterColumn[]
  portals: {
    heading: string
    links: FooterColumnLink[]
  }
  visitorStats: {
    label: string
    count: string
    note: string
  }
  bottomLinks: FooterBottomLink[]
  copyright: string
}

export interface TopBarData {
  helpline: string
  email: string
  instituteCode: string
  erpPortalLabel: string
  erpPortalUrl: string
}

// ─── Site Settings ──────────────────────────────────────────────────────────

export const mockSiteSettings: SiteSettings = {
  siteName:        'SGSITS Indore',
  tagline:         'An Institute of National Standing',
  directorName:    'Prof. Neetesh Purohit',
  directorPhoto:   '/director.jpeg',
  contactEmail:    'registrar@sgsits.ac.in',
  contactPhone:    '+91-731-2582100, 2582124',
  address:         '23, Park Road (Sir M. Visvesvaraya Marg), Indore, M.P. – 452003, India',
  marqueeEnabled:  true,
  maintenanceMode: false,
  socialLinks: {
    facebook:  'https://facebook.com/sgsitsindore',
    twitter:   'https://twitter.com/sgsitsindore',
    youtube:   'https://youtube.com/@sgsitsindore',
    linkedin:  'https://linkedin.com/school/sgsitsindore',
    instagram: 'https://instagram.com/sgsitsindore',
  },
}

// ─── Top Accessibility Bar Data ─────────────────────────────────────────────

export const mockTopBarData: TopBarData = {
  helpline:       '+91-731-2582100',
  email:          'registrar@sgsits.ac.in',
  instituteCode:  'SGSITS (0801)',
  erpPortalLabel: 'ERP Portal',
  erpPortalUrl:   'https://www.sgsits.ac.in',
}

// ─── Footer Data ─────────────────────────────────────────────────────────────

export const mockFooterData: FooterData = {
  institution: {
    shortCode:   'SG',
    name:        'SGSITS INDORE',
    estYear:     'Est. 1952',
    tagline:     'An Institute of National Standing',
    description: 'Shri G. S. Institute of Technology & Science, Indore is a prestigious autonomous engineering institution of national repute.',
    address:     '23, Park Road (Sir M. Visvesvaraya Marg), Indore, M.P. - 452003, India',
    phone:       '+91-731-2582100, 2582124',
    email:       'registrar@sgsits.ac.in',
  },
  columns: [
    {
      heading: 'Administration',
      links: [
        { label: 'About the Institute',      to: '/about/institute' },
        { label: "Director's Message",       to: '/about/director-message' },
        { label: 'Governing Body Board',     to: '/about/governing-body' },
        { label: 'Helpline & Directory',     to: '/about/telephone-directory' },
        { label: 'IQAC Quality Cell',        to: '/about/iqac' },
        { label: 'NBA & NAAC Status',        to: '/about/accreditation' },
      ],
    },
    {
      heading: 'Student Gateways',
      links: [
        { label: 'Academic Session Calendar',   to: '/academics/calendar' },
        { label: 'Exam Registration & Results', to: '/academics/exam-results' },
        { label: 'Government Scholarships',     to: '/students/scholarship/govt' },
        { label: 'Training & Placements (T&P)', to: '/placement/tnp-cell' },
        { label: 'Central Library & Catalog',   to: '/facilities/library' },
        { label: 'Incubation & Startup Cell',   to: '/startup-cell' },
      ],
    },
  ],
  portals: {
    heading: 'Portals & Resources',
    links: [
      { label: 'AICTE India',         href: 'https://www.aicte-india.org',   external: true },
      { label: 'DTE Madhya Pradesh',  href: 'https://www.mptechedu.org',     external: true },
      { label: 'RGPV Bhopal',         href: 'https://www.rgpv.ac.in',        external: true },
    ],
  },
  visitorStats: {
    label: 'Visitor Statistics',
    count: '02,485,391',
    note:  'Refreshed hourly • Institutional audit',
  },
  bottomLinks: [
    { label: 'Privacy Policy',         to: '/policy/privacy' },
    { label: 'Terms of Use',           to: '/policy/terms' },
    { label: 'Disclaimer',             to: '/policy/disclaimer' },
    { label: 'Accessibility Statement',to: '/policy/accessibility' },
    { label: 'Copyright Policy',       to: '/policy/copyright' },
    { label: 'Hyperlinking Policy',    to: '/policy/hyperlink' },
    { label: 'Sitemap',                to: '/policy/sitemap' },
    { label: 'Feedback & Help',        to: '/contact' },
  ],
  copyright: 'SGSITS Indore (M.P.), India. All rights reserved. Designed and developed as a responsive React single page application.',
}
