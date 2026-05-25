/**
 * MOCK: Central re-export barrel
 *
 * This file re-exports every mock data module.
 * Only the service layer (src/services/) should import from here.
 * Components must NEVER import from src/mock/ directly.
 */

export * from './home/homeData'
export * from './navbar/navData'
export * from './settings/settingsData'
export * from './notices/noticesData'
export * from './news/newsData'
export * from './events/eventsData'
export * from './gallery/galleryData'
export * from './departments/departmentsData'
export * from './users/usersData'
