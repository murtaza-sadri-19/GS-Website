/**
 * TEQIP Service — reads TEQIP-III content from CMS backend
 * Backend: GET /api/v1/settings/cms/teqip.*
 */

import { getCmsSection, saveCmsSection } from './settingsService'

export interface TeqipStat {
  iconName: string
  title: string
  value: string
  desc: string
  color: string
}

export interface TeqipMilestone {
  year: string
  event: string
  type: 'milestone' | 'funding' | 'infra' | 'academic'
}

export interface TeqipActivity {
  category: string
  items: string[]
}

export interface TeqipDownload {
  title: string
  size: string
  type: string
  url: string | null
}

export interface TeqipOverview {
  title: string
  subtitle: string
  about: string
  contactEmail: string
  contactPhone: string
}

const get = async <T>(key: string): Promise<T | null> => getCmsSection<T>(key)
const getArr = async <T>(key: string): Promise<T[]> => {
  const data = await getCmsSection<T[]>(key)
  return Array.isArray(data) ? data : []
}

export const getTeqipOverview   = (): Promise<TeqipOverview | null>   => get<TeqipOverview>('teqip.overview')
export const getTeqipStats      = (): Promise<TeqipStat[]>            => getArr<TeqipStat>('teqip.stats')
export const getTeqipMilestones = (): Promise<TeqipMilestone[]>       => getArr<TeqipMilestone>('teqip.milestones')
export const getTeqipActivities = (): Promise<TeqipActivity[]>        => getArr<TeqipActivity>('teqip.activities')
export const getTeqipDownloads  = (): Promise<TeqipDownload[]>        => getArr<TeqipDownload>('teqip.downloads')

export const saveTeqipOverview   = (data: TeqipOverview)   => saveCmsSection('teqip.overview', data)
export const saveTeqipStats      = (data: TeqipStat[])     => saveCmsSection('teqip.stats', data)
export const saveTeqipMilestones = (data: TeqipMilestone[]) => saveCmsSection('teqip.milestones', data)
export const saveTeqipActivities = (data: TeqipActivity[]) => saveCmsSection('teqip.activities', data)
export const saveTeqipDownloads  = (data: TeqipDownload[]) => saveCmsSection('teqip.downloads', data)

// ── Fallback defaults ──────────────────────────────────────────────────────────

export const teqipOverviewDefault: TeqipOverview = {
  title: 'TEQIP-III at SGSITS Indore',
  subtitle: 'Technical Education Quality Improvement Programme',
  about: 'SGSITS Indore was selected as a beneficiary institution under TEQIP-III, funded by the World Bank and the Government of India.',
  contactEmail: 'teqip@sgsits.ac.in',
  contactPhone: '0731-2431234 Extn. 210',
}

export const teqipStatsDefault: TeqipStat[] = []
export const teqipMilestonesDefault: TeqipMilestone[] = []
export const teqipActivitiesDefault: TeqipActivity[] = []
export const teqipDownloadsDefault: TeqipDownload[] = []

export const teqipService = {
  getTeqipOverview, saveTeqipOverview,
  getTeqipStats, saveTeqipStats,
  getTeqipMilestones, saveTeqipMilestones,
  getTeqipActivities, saveTeqipActivities,
  getTeqipDownloads, saveTeqipDownloads,
}

export default teqipService
