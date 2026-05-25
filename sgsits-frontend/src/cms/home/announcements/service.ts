/**
 * Announcements CMS Service — Backend-driven
 * Reads/writes via GET/PUT /api/v1/settings/cms/home.announcements
 */
import { getCmsSection, saveCmsSection } from '../../../services/settingsService'
import type { AnnouncementItem, AnnouncementsConfig } from './types'
import { defaultAnnouncements } from './mock'

const KEY = 'home.announcements'

const defaultConfig: AnnouncementsConfig = {
  enabled: true,
  order: 2,
  items: defaultAnnouncements,
}

export const getAnnouncementsConfig = async (): Promise<AnnouncementsConfig> => {
  const data = await getCmsSection<AnnouncementsConfig>(KEY, defaultConfig)
  return {
    ...defaultConfig,
    ...data,
    items: Array.isArray(data?.items) && data.items.length > 0 ? data.items : defaultAnnouncements,
  }
}

export const getAnnouncements = async (): Promise<AnnouncementItem[]> => {
  const config = await getAnnouncementsConfig()
  return config.items
}

export const saveAnnouncements = async (items: AnnouncementItem[]): Promise<void> => {
  const current = await getAnnouncementsConfig()
  await saveCmsSection(KEY, { ...current, items })
}

export const announcementsService = { getAnnouncementsConfig, getAnnouncements, saveAnnouncements }
export default announcementsService
