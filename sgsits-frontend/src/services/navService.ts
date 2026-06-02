/**
 * Nav Service — Site navigation / menu structure
 *
 * Backend: GET/PUT /api/v1/settings/cms/navigation.nav_tree
 * Falls back to the local constants/navItems when the CMS key is empty.
 */

import { getCmsSection, saveCmsSection } from './settingsService'
import { navItems as localNavItems } from '../constants/navItems'

export interface NavItem {
  id?: number | string
  label: string
  url?: string
  path?: string
  to?: string
  children?: NavItem[]
  is_external?: boolean
  display_order?: number
  [key: string]: any
}

const KEY = 'navigation.nav_tree'

export const getNavItems = async (): Promise<NavItem[]> => {
  const data = await getCmsSection<NavItem[]>(KEY)
  // Use backend data only when it's a non-empty array; otherwise fall back to
  // the hardcoded constants so the nav is never blank.
  return Array.isArray(data) && data.length > 0 ? data : localNavItems
}

export const saveNavItems = async (data: NavItem[]): Promise<void> => {
  await saveCmsSection(KEY, data)
}

// Exported default — now uses the real nav items so Header has content on first render
export const navItemsDefault: NavItem[] = localNavItems

export const navService = {
  getNavItems,
  saveNavItems,
}

export default navService
