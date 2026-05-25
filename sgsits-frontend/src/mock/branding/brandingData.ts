/**
 * MOCK: Institute Branding & Identity Config
 * Replace with: GET /api/settings/branding
 *
 * Consumed ONLY through src/services/brandingService.ts
 *
 * Controls every visible piece of institution identity in the UI:
 * - Logo image URLs (header, mobile drawer, chatbot avatar)
 * - Full and short institute name
 * - Establishment year badge
 * - Sub-taglines in header and mobile drawer
 * - Mobile nav drawer title / footer text
 */

export interface BrandingConfig {
  /** Short code shown in footer box and fallback logo badge */
  shortCode: string
  /** Short display name — used in Header Logo primary label */
  shortName: string
  /** Full official institute name */
  fullName: string
  /** Establishment year — shown as badge in Logo and footer */
  establishedYear: string
  /** Sub-tagline displayed under the full name in LogoBanner */
  subTagline: string
  /** Tagline shown in the header accent box and footer */
  tagline: string
  /** Path or URL to the institute logo image */
  logoUrl: string
  /** Alt text for the logo image */
  logoAlt: string
  /** Suffix label used in Logo component e.g. "Autonomous Grant-in-Aid Institute" */
  logoSuffix: string
  /** Title shown in the mobile navigation drawer header */
  mobileDrawerTitle: string
  /** Footer text at the bottom of the mobile navigation drawer */
  mobileDrawerFooter: string
  /** Label shown at top of mobile menu section */
  mobileNavSectionLabel: string
  preloaderEnabled?: boolean
}

export const mockBrandingConfig: BrandingConfig = {
  shortCode: 'SG',
  shortName: 'SGSITS INDORE',
  fullName: 'Shri G. S. Institute of Technology & Science',
  establishedYear: '1952',
  subTagline: 'Govt. Aided Autonomous Institute, Indore (M.P.) - Estd. 1952',
  tagline: 'An Institute of National Standing',
  logoUrl: '/image.png',
  logoAlt: 'SGSITS Indore Logo',
  logoSuffix: 'Autonomous Grant-in-Aid Institute',
  mobileDrawerTitle: 'SGSITS NAVIGATION',
  mobileDrawerFooter: 'Shri G. S. Institute • Estd. 1952',
  mobileNavSectionLabel: 'Section Menu',
  preloaderEnabled: true,
}
