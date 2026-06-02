/**
 * Startup Cell Service — reads startup portfolio content from CMS backend
 * Backend: GET /api/v1/settings/cms/startup.*
 */

import { getCmsSection, saveCmsSection } from './settingsService'

export interface StartupStat {
  value: string
  label: string
  iconName: string
}

export interface StartupPortfolioItem {
  name: string
  sector: string
  year: string
  funding: string
  stage: string
  founders: string
  description: string
  iconName: string
}

export interface StartupFacility {
  iconName: string
  title: string
  desc: string
}

export interface StartupApplyStep {
  step: string
  title: string
  desc: string
}

export interface StartupOverview {
  title: string
  subtitle: string
  description: string
  contactEmail: string
  contactPhone: string
  applicationUrl: string
  externalLinks: { label: string; url: string }[]
}

const get = async <T>(key: string): Promise<T | null> => getCmsSection<T>(key)
const getArr = async <T>(key: string): Promise<T[]> => {
  const data = await getCmsSection<T[]>(key)
  return Array.isArray(data) ? data : []
}

export const getStartupOverview   = (): Promise<StartupOverview | null>          => get<StartupOverview>('startup.overview')
export const getStartupStats      = (): Promise<StartupStat[]>                   => getArr<StartupStat>('startup.stats')
export const getStartupPortfolio  = (): Promise<StartupPortfolioItem[]>          => getArr<StartupPortfolioItem>('startup.portfolio')
export const getStartupFacilities = (): Promise<StartupFacility[]>               => getArr<StartupFacility>('startup.facilities')
export const getStartupApplySteps = (): Promise<StartupApplyStep[]>              => getArr<StartupApplyStep>('startup.apply_steps')

export const saveStartupOverview   = (d: StartupOverview)        => saveCmsSection('startup.overview', d)
export const saveStartupStats      = (d: StartupStat[])          => saveCmsSection('startup.stats', d)
export const saveStartupPortfolio  = (d: StartupPortfolioItem[]) => saveCmsSection('startup.portfolio', d)
export const saveStartupFacilities = (d: StartupFacility[])      => saveCmsSection('startup.facilities', d)
export const saveStartupApplySteps = (d: StartupApplyStep[])     => saveCmsSection('startup.apply_steps', d)

// ── Fallback defaults ──────────────────────────────────────────────────────────

export const startupOverviewDefault: StartupOverview = {
  title: 'SGSITS Startup & Innovation Cell',
  subtitle: 'Entrepreneurship & Innovation',
  description: 'Recognized under Startup India and Startup MP initiatives, we fuel student entrepreneurs from idea to market.',
  contactEmail: 'startup@sgsits.ac.in',
  contactPhone: '+91-731-2431300',
  applicationUrl: 'startup.sgsits.ac.in',
  externalLinks: [],
}

export const startupStatsDefault: StartupStat[] = []
export const startupPortfolioDefault: StartupPortfolioItem[] = []
export const startupFacilitiesDefault: StartupFacility[] = []
export const startupApplyStepsDefault: StartupApplyStep[] = []

export const startupService = {
  getStartupOverview, saveStartupOverview,
  getStartupStats, saveStartupStats,
  getStartupPortfolio, saveStartupPortfolio,
  getStartupFacilities, saveStartupFacilities,
  getStartupApplySteps, saveStartupApplySteps,
}

export default startupService
