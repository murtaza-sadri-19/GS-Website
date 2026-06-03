import React, { useState, useEffect, useMemo } from 'react'
import { usePageData } from '../hooks/usePageData'
import PageSeo from '../components/global/PageSeo'
import { homePageDefaults, contentService } from '../services/contentService'
import { noticesService }                    from '../services/noticesService'
import { newsService }                       from '../services/newsService'
import { mediaService }                      from '../services/mediaService'
import { uiLabelsService, uiLabelsDefaults } from '../services/uiLabelsService'
import { ICON_MAP }                          from '../components/homepage/homeConstants'
import { C }                                 from '../components/homepage/homeConstants'

import HeroSection, { type HeroTile }        from '../components/homepage/HeroSection'
import AboutSection                           from '../components/homepage/AboutSection'
import DirectorSection                        from '../components/homepage/DirectorSection'
import AnnouncementsPanel                     from '../components/homepage/AnnouncementsPanel'
import NewsSection                            from '../components/homepage/NewsSection'
import AcademicProgramsSection                from '../components/homepage/AcademicProgramsSection'
import DepartmentsSection                     from '../components/homepage/DepartmentsSection'
import StatsSection                           from '../components/homepage/StatsSection'
import CampusLifeSection                      from '../components/homepage/CampusLifeSection'
import FaqsSection                            from '../components/homepage/FaqsSection'
import GallerySection                         from '../components/homepage/GallerySection'

import type { HomePageData }                  from '../services/contentService'
import type { HeroTileData }                  from '../services/contentService'
import type { AnnouncementItem }              from '../cms/home/announcements/types'
import type { HomeNewsCard, FeaturedNewsCard } from '../services/newsService'
import type { GalleryThumbnail }              from '../services/mediaService'
import type { UiLabelsConfig }                from '../services/uiLabelsService'

interface HomeData {
  pageData:       HomePageData
  heroTiles:      HeroTileData[]
  announcements:  AnnouncementItem[]
  newsCards:      HomeNewsCard[]
  featuredCards:  FeaturedNewsCard[]
  thumbnails:     GalleryThumbnail[]
  labels:         UiLabelsConfig
}

const fetchHomeData = async (): Promise<HomeData> => {
  const [pageData, heroTiles, announcements, newsCards, featuredCards, thumbnails, labels] =
    await Promise.all([
      contentService.getHomePage(),
      contentService.getHeroTiles(),
      noticesService.getHomeAnnouncements(),
      newsService.getHomeNewsCards(),
      newsService.getFeaturedNewsCards(),
      mediaService.getHomeGalleryThumbnails(),
      uiLabelsService.getUiLabels(),
    ])
  return { pageData, heroTiles, announcements, newsCards, featuredCards, thumbnails, labels }
}

const Home: React.FC = () => {
  const { data: homeData, loading: homeLoading } = usePageData<HomeData>('home', fetchHomeData)

  const pageData      = homeData?.pageData      ?? homePageDefaults
  const announcements = homeData?.announcements ?? []
  const newsCards     = homeData?.newsCards     ?? []
  const featuredCards = homeData?.featuredCards ?? []
  const thumbnails    = homeData?.thumbnails    ?? []
  const labels        = homeData?.labels        ?? uiLabelsDefaults

  const heroTiles = useMemo((): HeroTile[] =>
    (homeData?.heroTiles ?? homePageDefaults.heroTiles).map(t => ({
      ...t,
      icon: ICON_MAP[t.iconName] ?? ICON_MAP['FlaskConical']!,
    })),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [homeData?.heroTiles],
  )

  const heroImages = useMemo(() => {
    const hero = pageData.hero as Record<string, any>
    const arr = (hero.images ?? []).filter((u: string) => !!u)
    if (arr.length > 0) return arr
    return hero.imageUrl ? [hero.imageUrl] : []
  }, [pageData.hero])

  const [slideIndex, setSlideIndex] = useState(0)

  useEffect(() => { setSlideIndex(0) }, [heroImages.length])

  useEffect(() => {
    if (heroImages.length <= 1) return
    const id = setInterval(() => setSlideIndex(i => (i + 1) % heroImages.length), 5000)
    return () => clearInterval(id)
  }, [heroImages.length])

  const isSectionEnabled = (type: string): boolean => {
    if (!pageData.sections || pageData.sections.length === 0) return true
    return pageData.sections.some(s => s.type === type && s.enabled)
  }

  const {
    hero,
    about,
    director,
    newsSection,
    academicsSection,
    departmentsSection,
    statsSection,
    campusLifeSection,
    faqsSection,
    gallerySection,
  } = pageData

  return (
    <div className="flex flex-col bg-white">
      <PageSeo pageKey="home" />

      {isSectionEnabled('hero') && (
        <HeroSection
          hero={hero as Record<string, any>}
          heroTiles={heroTiles}
          heroImages={heroImages}
          slideIndex={slideIndex}
          onPrev={() => setSlideIndex(i => (i - 1 + heroImages.length) % heroImages.length)}
          onNext={() => setSlideIndex(i => (i + 1) % heroImages.length)}
          onGoTo={setSlideIndex}
          loading={homeLoading}
        />
      )}

      {isSectionEnabled('about') && (
        <section
          className="bg-white py-10 md:py-14 relative z-10"
          style={{ borderBottom: `1px solid ${C.navy10}` }}
        >
          <div className="max-w-[1400px] mx-auto px-4 lg:px-12 grid grid-cols-1 lg:grid-cols-3 gap-10">
            <div className="lg:col-span-2 flex flex-col space-y-12">
              <AboutSection about={about as Record<string, any>} loading={homeLoading} />
              <DirectorSection director={director as Record<string, any>} loading={homeLoading} />
            </div>
            <div className="lg:col-span-1">
              <AnnouncementsPanel
                announcements={announcements as any[]}
                heading={labels.homepage.announcementsHeading}
                badge={labels.homepage.announcementsBadge}
                viewAllLabel={labels.homepage.viewAllNoticesLabel}
                loading={homeLoading}
              />
            </div>
          </div>
        </section>
      )}

      {isSectionEnabled('news') && (
        <NewsSection
          section={newsSection as Record<string, any>}
          newsCards={newsCards}
          featuredCards={featuredCards}
          loading={homeLoading}
        />
      )}

      {isSectionEnabled('academics') && (
        <AcademicProgramsSection
          section={academicsSection as Record<string, any>}
          loading={homeLoading}
        />
      )}

      {isSectionEnabled('departments') && (
        <DepartmentsSection
          section={departmentsSection as Record<string, any>}
          viewAllLabel={labels.homepage.viewAllDepartmentsLabel}
          loading={homeLoading}
        />
      )}

      {isSectionEnabled('stats') && (
        <StatsSection
          section={statsSection as Record<string, any>}
          loading={homeLoading}
        />
      )}

      {isSectionEnabled('campus_life') && (
        <CampusLifeSection
          section={campusLifeSection as Record<string, any>}
          loading={homeLoading}
        />
      )}

      {isSectionEnabled('faqs_gallery') && (
        <section
          className="relative z-10"
          style={{ backgroundColor: C.white, borderTop: `1px solid ${C.navy10}` }}
        >
          <div className="max-w-[1400px] mx-auto px-4 lg:px-12 py-16">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
              <FaqsSection
                section={faqsSection as Record<string, any>}
                viewAllLabel={labels.homepage.viewAllFaqsLabel}
                loading={homeLoading}
              />
              <GallerySection
                section={gallerySection as Record<string, any>}
                thumbnails={thumbnails}
                viewAllLabel={labels.homepage.viewAllGalleryLabel}
                loading={homeLoading}
              />
            </div>
          </div>
        </section>
      )}
    </div>
  )
}

export default Home
