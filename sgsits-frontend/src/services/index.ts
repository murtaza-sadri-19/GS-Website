/**
 * Services barrel export
 *
 * All components must import services from here (or the individual service file).
 * NEVER import from src/mock/ directly in components.
 *
 * Usage:
 *   import { contentService, noticesService } from '@/services'
 *   // or
 *   import contentService from '@/services/contentService'
 */

export { default as contentService, homePageDefaults } from './contentService'
export { default as settingsService, siteSettingsDefaults, footerDefaults, topBarDefaults } from './settingsService'
export { default as navService, navItemsDefault } from './navService'
export { default as noticesService, noticesDefaults } from './noticesService'
export { default as newsService } from './newsService'
export { default as eventsService } from './eventsService'
export { default as mediaService } from './mediaService'
export { default as departmentService, departmentsDefault } from './departmentService'
export { default as footerService, footerCmsDefaults } from './footerService'

// Re-export types used by components
export type { NavItem } from './navService'
export type { DepartmentSummary } from './departmentService'
export type { HomeNewsCard, FeaturedNewsCard } from './newsService'
export type { GalleryThumbnail } from './mediaService'
