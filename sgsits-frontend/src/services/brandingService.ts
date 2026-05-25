/**
 * Branding Service — Institute identity & visual branding config
 *
 * Backend: GET/PUT /api/v1/settings/cms/branding
 * Falls back to mock defaults when backend unreachable.
 */

import { getCmsSection, saveCmsSection } from './settingsService'
import { mockBrandingConfig, type BrandingConfig } from '../mock/branding/brandingData'

const KEY = 'branding'

export const getBranding = async (): Promise<BrandingConfig> => {
  const data = await getCmsSection<BrandingConfig>(KEY, mockBrandingConfig)
  return { ...mockBrandingConfig, ...data }
}

export const saveBranding = async (data: BrandingConfig): Promise<void> => {
  await saveCmsSection(KEY, data)
}

/** Synchronous default — prevents flash on first render */
export const brandingDefaults: BrandingConfig = mockBrandingConfig

export type { BrandingConfig }

export const brandingService = {
  getBranding,
  saveBranding,
}

export default brandingService
