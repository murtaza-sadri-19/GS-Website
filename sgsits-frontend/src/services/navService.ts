/**
 * Nav Service — Site navigation / menu structure
 *
 * Backend: GET/PUT /api/v1/settings/cms/navigation.nav_tree
 * Falls back to mock defaults when backend unreachable.
 */

import { getCmsSection, saveCmsSection } from './settingsService'
import { mockNavItems, type NavItem } from '../mock/navbar/navData'

const KEY = 'navigation.nav_tree'

export const getNavItems = async (): Promise<NavItem[]> => {
  const data = await getCmsSection<NavItem[]>(KEY, mockNavItems)
  return Array.isArray(data) ? data : mockNavItems
}

export const saveNavItems = async (data: NavItem[]): Promise<void> => {
  await saveCmsSection(KEY, data)
}

/** Synchronous default — used as useState initial value to avoid flash */
export const navItemsDefault: NavItem[] = mockNavItems

export type { NavItem }

export const navService = {
  getNavItems,
  saveNavItems,
}

export default navService
