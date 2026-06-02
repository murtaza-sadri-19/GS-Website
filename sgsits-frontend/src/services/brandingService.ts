import { getCmsSection, saveCmsSection } from './settingsService'
import type { BrandingConfig } from '../types'

const KEY = 'branding'

const EMPTY_BRANDING: BrandingConfig = {
  shortCode: '', shortName: '', fullName: '', establishedYear: '',
  subTagline: '', tagline: '', logoUrl: '', logoAlt: '', logoSuffix: '',
  mobileDrawerTitle: '', mobileDrawerFooter: '', mobileNavSectionLabel: '',
}

export const getBranding = async (): Promise<BrandingConfig> => {
  const data = await getCmsSection<BrandingConfig>(KEY)
  return data ? { ...EMPTY_BRANDING, ...data } : EMPTY_BRANDING
}

export const saveBranding = async (data: BrandingConfig): Promise<void> => {
  await saveCmsSection(KEY, data)
}

export const brandingDefaults: BrandingConfig = EMPTY_BRANDING

export type { BrandingConfig }

export const brandingService = { getBranding, saveBranding }
export default brandingService
