/**
 * Content Service — Home page & static CMS content
 *
 * All CMS section reads go directly to the backend via getCmsSection.
 * Returns empty objects/arrays when the backend is unavailable.
 */

import { getCmsSection } from './settingsService'
import type { HeroConfig, HeroTileData } from '../cms/home/hero/types'
import type { AnnouncementItem } from '../cms/home/announcements/types'
import type { HomeFaqsConfig } from '../cms/home/faqs/types'

// ─── Generic section types ────────────────────────────────────────────────────

export type { HeroConfig, HeroTileData, AnnouncementItem }

export type AboutConfig             = Record<string, unknown>
export type HomeDirectorConfig      = Record<string, unknown>
export type HomeNewsConfig          = Record<string, unknown>
export type AcademicsSectionConfig  = Record<string, unknown>
export type HomeDepartmentsConfig   = Record<string, unknown>
export type HomeStatsConfig         = Record<string, unknown>
export type HomeCampusLifeConfig    = Record<string, unknown>
export type HomeGalleryConfig       = Record<string, unknown>
export type HomeSeoConfig           = Record<string, unknown>

export type {
  AboutConfig as AboutSection,
  HomeDirectorConfig as DirectorSection,
  HomeNewsConfig as NewsSectionConfig,
  AcademicsSectionConfig as AcademicProgramsSection,
  HomeDepartmentsConfig as DepartmentsSection,
  HomeStatsConfig as StatsSection,
  HomeCampusLifeConfig as CampusLifeSection,
  HomeFaqsConfig as FaqsSection,
  HomeGalleryConfig as GallerySection,
}

// ─── HomePageData ─────────────────────────────────────────────────────────────

export interface HomePageData {
  meta:               HomeSeoConfig
  sections:           Array<{ id: string; type: string; enabled: boolean; order: number }>
  hero:               HeroConfig
  heroTiles:          HeroTileData[]
  about:              AboutConfig
  director:           HomeDirectorConfig
  announcements:      AnnouncementItem[]
  newsSection:        HomeNewsConfig
  academicsSection:   AcademicsSectionConfig
  departmentsSection: HomeDepartmentsConfig
  statsSection:       HomeStatsConfig
  campusLifeSection:  HomeCampusLifeConfig
  faqsSection:        HomeFaqsConfig
  gallerySection:     HomeGalleryConfig
  preFooter?:         { imageUrl: string; label: string }
}

// ─── Section fetchers ─────────────────────────────────────────────────────────

const section = <T>(key: string): Promise<T> =>
  getCmsSection<T>(key).then(d => d ?? ({} as T))

export const getHeroConfig         = (): Promise<HeroConfig>            => section('home.hero')
export const getHeroTiles          = async (): Promise<HeroTileData[]>  => {
  const cfg = await getHeroConfig()
  return (cfg.tiles as HeroTileData[] | undefined) ?? []
}
export const getAboutConfig              = (): Promise<AboutConfig>             => section('home.about')
export const getHomeDirectorConfig       = (): Promise<HomeDirectorConfig>      => section('home.director')
export const getAnnouncements            = async (): Promise<AnnouncementItem[]> => {
  const d = await getCmsSection<AnnouncementItem[] | { items?: AnnouncementItem[] }>('home.announcements')
  if (Array.isArray(d)) return d
  if (d && 'items' in d && Array.isArray(d.items)) return d.items
  return []
}
export const getHomeNewsConfig           = (): Promise<HomeNewsConfig>          => section('home.news')
export const getAcademicsConfig          = (): Promise<AcademicsSectionConfig>  => section('home.academics')
export const getHomeDepartmentsConfig    = (): Promise<HomeDepartmentsConfig>   => section('home.departments')
export const getHomeStatsConfig          = (): Promise<HomeStatsConfig>         => section('home.stats')
export const getHomeCampusLifeConfig     = (): Promise<HomeCampusLifeConfig>    => section('home.campus_life')
export const getHomeFaqsConfig           = (): Promise<HomeFaqsConfig>          => section<HomeFaqsConfig>('home.faqs')
export const getHomeGalleryConfig        = (): Promise<HomeGalleryConfig>       => section('home.gallery')
export const getHomeSeoConfig            = (): Promise<HomeSeoConfig>           => section('home.seo')
export const getHomeSections             = async (): Promise<Array<{ id: string; type: string; enabled: boolean; order: number }>> => {
  const d = await getCmsSection<Array<{ id: string; type: string; enabled: boolean; order: number }>>('home.sections')
  return Array.isArray(d) && d.length > 0 ? d : []
}

// ─── Home page assembler ──────────────────────────────────────────────────────

export const getHomePage = async (): Promise<HomePageData> => {
  const [
    heroConfig, heroTiles, about, director, announcements, newsSection,
    academicsSection, departmentsSection, statsSection, campusLifeSection,
    faqsSection, gallerySection, seo, sections,
  ] = await Promise.all([
    getHeroConfig(), getHeroTiles(), getAboutConfig(), getHomeDirectorConfig(),
    getAnnouncements(), getHomeNewsConfig(), getAcademicsConfig(),
    getHomeDepartmentsConfig(), getHomeStatsConfig(), getHomeCampusLifeConfig(),
    getHomeFaqsConfig(), getHomeGalleryConfig(), getHomeSeoConfig(), getHomeSections(),
  ])

  return {
    meta:               seo,
    sections,
    hero:               heroConfig,
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
    preFooter: { imageUrl: '', label: '' },
  }
}

export const homePageDefaults: HomePageData = {
  meta:               {},
  sections:           [],
  hero:               {},
  heroTiles:          [],
  about:              {},
  director:           {},
  announcements:      [],
  newsSection:        {},
  academicsSection:   {},
  departmentsSection: {},
  statsSection:       {},
  campusLifeSection:  {},
  faqsSection:        { heading: '', subLabel: '', viewAllLink: '', items: [], enabled: true, order: 0 },
  gallerySection:     {},
  preFooter:          { imageUrl: '', label: '' },
}

export const contentService = {
  getHomePage,
  getHeroTiles,
  getAboutSection:            getAboutConfig,
  getDirectorSection:         getHomeDirectorConfig,
  getNewsSectionConfig:       getHomeNewsConfig,
  getAcademicPrograms:        getAcademicsConfig,
  getHomeDepartmentsSection:  getHomeDepartmentsConfig,
  getStatsSection:            getHomeStatsConfig,
  getCampusLifeSection:       getHomeCampusLifeConfig,
  getFaqsSection:             getHomeFaqsConfig,
  getGallerySection:          getHomeGalleryConfig,
}

export default contentService
