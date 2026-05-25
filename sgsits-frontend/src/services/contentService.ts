/**
 * Content Service — Home page & static CMS content
 *
 * ╔══════════════════════════════════════════════════════════╗
 * ║  MOCK MODE — Returns mock data instantly.               ║
 * ║  When backend is ready:                                  ║
 * ║    replace the return statement with an apiClient call   ║
 * ║    e.g. return apiClient.get('/content/home').then(r => r.data.data) ║
 * ╚══════════════════════════════════════════════════════════╝
 *
 * Components MUST call this service — never import mock data directly.
 */

import { getHeroConfig, getHeroTiles } from '../cms/home/hero/service'
import { getAboutConfig } from '../cms/home/about/service'
import { getHomeDirectorConfig } from '../cms/home/director/service'
import { getAnnouncements } from '../cms/home/announcements/service'
import { getHomeNewsConfig } from '../cms/home/news/service'
import { getAcademicsConfig } from '../cms/home/academics/service'
import { getHomeDepartmentsConfig } from '../cms/home/departments/service'
import { getHomeStatsConfig } from '../cms/home/stats/service'
import { getHomeCampusLifeConfig } from '../cms/home/campus_life/service'
import { getHomeFaqsConfig } from '../cms/home/faqs/service'
import { getHomeGalleryConfig } from '../cms/home/gallery/service'
import { getHomeSeoConfig } from '../cms/home/seo/service'

import {
  mockHomePageData,
  type HomePageData,
  type HeroTileData,
  type AboutSection,
  type DirectorSection,
  type NewsSectionConfig,
  type AcademicProgramsSection,
  type DepartmentsSection,
  type StatsSection,
  type CampusLifeSection,
  type FaqsSection,
  type GallerySection,
} from '../mock/home/homeData'

// ─── Home Page ────────────────────────────────────────────────────────────────

export const getHomePage = async (): Promise<HomePageData> => {
  const [
    heroConfig,
    heroTiles,
    about,
    director,
    announcements,
    newsSection,
    academicsSection,
    departmentsSection,
    statsSection,
    campusLifeSection,
    faqsSection,
    gallerySection,
    seo,
  ] = await Promise.all([
    getHeroConfig(),
    getHeroTiles(),
    getAboutConfig(),
    getHomeDirectorConfig(),
    getAnnouncements(),
    getHomeNewsConfig(),
    getAcademicsConfig(),
    getHomeDepartmentsConfig(),
    getHomeStatsConfig(),
    getHomeCampusLifeConfig(),
    getHomeFaqsConfig(),
    getHomeGalleryConfig(),
    getHomeSeoConfig(),
  ])

  return {
    meta: seo,
    sections: [
      { id: 'hero', type: 'hero', enabled: heroConfig.enabled, order: heroConfig.order },
      { id: 'about', type: 'about', enabled: about.enabled, order: about.order },
      { id: 'news', type: 'news', enabled: newsSection.enabled, order: newsSection.order },
      { id: 'academics', type: 'academics', enabled: academicsSection.enabled, order: academicsSection.order },
      { id: 'departments', type: 'departments', enabled: departmentsSection.enabled, order: departmentsSection.order },
      { id: 'stats', type: 'stats', enabled: statsSection.enabled, order: statsSection.order },
      { id: 'campus_life', type: 'campus_life', enabled: campusLifeSection.enabled, order: campusLifeSection.order },
      { id: 'faqs_gallery', type: 'faqs_gallery', enabled: faqsSection.enabled, order: faqsSection.order },
    ].sort((a, b) => a.order - b.order),
    hero: {
      instituteName: heroConfig.instituteName,
      welcomeText: heroConfig.welcomeText,
      accentText: heroConfig.accentText,
      imageUrl: heroConfig.imageUrl,
      imagePosition: heroConfig.imagePosition,
    },
    heroTiles,
    about: {
      label: about.label,
      heading: about.heading,
      accentText: about.accentText,
      body: about.body,
      primaryButton: about.primaryButton,
      secondaryButton: about.secondaryButton,
    },
    director: {
      label: director.label,
      heading: director.heading,
      accentText: director.accentText,
      name: director.name,
      photo: director.photo,
      bio: director.bio,
      readMoreLabel: director.readMoreLabel,
      readMoreTo: director.readMoreTo,
    },
    announcements,
    newsSection: {
      label: newsSection.label,
      heading: newsSection.heading,
      accentText: newsSection.accentText,
      description: newsSection.description,
    },
    academicsSection: {
      label: academicsSection.label,
      heading: academicsSection.heading,
      accentText: academicsSection.accentText,
      description: academicsSection.description,
      programs: academicsSection.programs,
    },
    departmentsSection: {
      label: departmentsSection.label,
      heading: departmentsSection.heading,
      accentText: departmentsSection.accentText,
      showAllLink: departmentsSection.showAllLink,
      items: departmentsSection.items,
    },
    statsSection: {
      backgroundImage: statsSection.backgroundImage,
      fallbackImage: statsSection.fallbackImage,
      items: statsSection.items,
    },
    campusLifeSection: {
      label: campusLifeSection.label,
      heading: campusLifeSection.heading,
      accentText: campusLifeSection.accentText,
      description: campusLifeSection.description,
      facilities: campusLifeSection.facilities,
    },
    faqsSection: {
      heading: faqsSection.heading,
      subLabel: faqsSection.subLabel,
      viewAllLink: faqsSection.viewAllLink,
      items: faqsSection.items,
    },
    gallerySection: {
      heading: gallerySection.heading,
      accentText: gallerySection.accentText,
      subLabel: gallerySection.subLabel,
      viewAllLink: gallerySection.viewAllLink,
    },
    preFooter: mockHomePageData.preFooter || {
      imageUrl: '/assets/campus-panorama.png',
      label: 'SGSITS Campus Sunset Panorama',
    },
  }
}

export const getHeroTilesAsync = async (): Promise<HeroTileData[]> => {
  return getHeroTiles()
}

export const getAboutSectionAsync = async (): Promise<AboutSection> => {
  return getAboutConfig()
}

export const getDirectorSectionAsync = async (): Promise<DirectorSection> => {
  return getHomeDirectorConfig()
}

export const getNewsSectionConfigAsync = async (): Promise<NewsSectionConfig> => {
  return getHomeNewsConfig()
}

export const getAcademicProgramsAsync = async (): Promise<AcademicProgramsSection> => {
  return getAcademicsConfig()
}

export const getHomeDepartmentsSectionAsync = async (): Promise<DepartmentsSection> => {
  return getHomeDepartmentsConfig()
}

export const getStatsSectionAsync = async (): Promise<StatsSection> => {
  return getHomeStatsConfig()
}

export const getCampusLifeSectionAsync = async (): Promise<CampusLifeSection> => {
  return getHomeCampusLifeConfig()
}

export const getFaqsSectionAsync = async (): Promise<FaqsSection> => {
  return getHomeFaqsConfig()
}

export const getGallerySectionAsync = async (): Promise<GallerySection> => {
  return getHomeGalleryConfig()
}

export const homePageDefaults: HomePageData = mockHomePageData

export const contentService = {
  getHomePage,
  getHeroTiles: getHeroTilesAsync,
  getAboutSection: getAboutSectionAsync,
  getDirectorSection: getDirectorSectionAsync,
  getNewsSectionConfig: getNewsSectionConfigAsync,
  getAcademicPrograms: getAcademicProgramsAsync,
  getHomeDepartmentsSection: getHomeDepartmentsSectionAsync,
  getStatsSection: getStatsSectionAsync,
  getCampusLifeSection: getCampusLifeSectionAsync,
  getFaqsSection: getFaqsSectionAsync,
  getGallerySection: getGallerySectionAsync,
}

export default contentService
