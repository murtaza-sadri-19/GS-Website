/**
 * Admissions Service — wired to backend CMS sections
 *
 * Backend: GET/PUT /api/v1/settings/cms/<key>
 * CMS keys:
 *   admissions.landing_cards  — array of card items
 *   admissions.landing_meta   — hero title / subtitle / section label
 */

import { getCmsSection, saveCmsSection } from './settingsService'

export interface AdmissionsLandingCard {
  iconName: string
  title: string
  description: string
  path: string
  badge?: string
}

export interface AdmissionsLandingMeta {
  sectionLabel?: string
  heroTitle?: string
  heroSubtitle?: string
}

const getArr = async <T>(key: string): Promise<T[]> => {
  const data = await getCmsSection<T[]>(key)
  return Array.isArray(data) ? data : []
}

export const getAdmissionsLandingCards = (): Promise<AdmissionsLandingCard[]> =>
  getArr('admissions.landing_cards')

export const getAdmissionsLandingMeta = async (): Promise<AdmissionsLandingMeta> => {
  const data = await getCmsSection<AdmissionsLandingMeta>('admissions.landing_meta')
  return data ?? {}
}

export const saveAdmissionsLandingCards = (data: AdmissionsLandingCard[]) =>
  saveCmsSection('admissions.landing_cards', data)

export const saveAdmissionsLandingMeta = (data: AdmissionsLandingMeta) =>
  saveCmsSection('admissions.landing_meta', data)

export const admissionsLandingCardsDefault: AdmissionsLandingCard[] = [
  { iconName: 'UserPlus',      title: 'UG Admissions',       description: 'Eligibility, selection process, and key dates for B.E. / B.Tech programmes.', path: '/admission/ug',         badge: 'JEE Mains'  },
  { iconName: 'GraduationCap', title: 'PG Admissions',       description: 'Admission process and eligibility for M.E. / M.Tech / MBA programmes.',       path: '/admission/pg',         badge: 'GATE / MAT' },
  { iconName: 'FlaskConical',  title: 'Ph.D. Admissions',    description: 'Doctoral research admissions, research areas, supervisors, and requirements.', path: '/admission/phd'                            },
  { iconName: 'Download',      title: 'Prospectus Download', description: 'Download the official institute prospectus with complete course and fee info.', path: '/admission/prospectus', badge: 'PDF'        },
]

export const admissionsLandingMetaDefault: AdmissionsLandingMeta = {
  sectionLabel: 'Admissions',
  heroTitle:    'Admissions at SGSITS',
  heroSubtitle: 'Find eligibility criteria, admission processes, important dates, and prospectus for all programmes.',
}
