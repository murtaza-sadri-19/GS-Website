import React, { useState, useEffect, useMemo } from 'react'
import { usePageData } from '../hooks/usePageData'
import { Link } from 'react-router-dom'
import {
  Calendar,
  ChevronLeft,
  ChevronRight,
  BookOpen,
  GraduationCap,
  Microscope,
  Users,
  Building,
  FileText,
  FlaskConical,
  Rocket,
  Newspaper,
  Landmark,
} from 'lucide-react'

// ─── SEO ─────────────────────────────────────────────────────────────────────
import PageSeo from '../components/global/PageSeo'

// ─── Services — the ONLY way components access data ─────────────────────────
import { homePageDefaults, contentService }      from '../services/contentService'
import { noticesService }                         from '../services/noticesService'
import { newsService }                            from '../services/newsService'
import { mediaService }                           from '../services/mediaService'
import { uiLabelsService, uiLabelsDefaults }      from '../services/uiLabelsService'
import { SkeletonCard, Sk }                       from '../components/ui/Skeleton'
import type { HomePageData } from '../services/contentService'
import type { HeroTileData } from '../cms/home/hero/types'
import type { AnnouncementItem } from '../cms/home/announcements/types'
import type { FaqItem as FaqItemData } from '../cms/home/faqs/types'
import type { HomeNewsCard, FeaturedNewsCard }    from '../services/newsService'
import type { GalleryThumbnail }                  from '../services/mediaService'
import type { UiLabelsConfig }                    from '../services/uiLabelsService'

// ─── Palette constants — reference CSS variables so admin theme changes apply ─
const C = {
  navy:        'var(--color-primary)',
  gold:        'var(--color-accent)',
  white:       '#ffffff',
  navy10:      'rgba(var(--color-primary-rgb), 0.10)',
  navy15:      'rgba(var(--color-primary-rgb), 0.15)',
  navy40:      'rgba(var(--color-primary-rgb), 0.40)',
  navy45:      'rgba(var(--color-primary-rgb), 0.45)',
  navy55:      'rgba(var(--color-primary-rgb), 0.55)',
  navy60:      'rgba(var(--color-primary-rgb), 0.60)',
  navy70:      'rgba(var(--color-primary-rgb), 0.70)',
  navy75:      'rgba(var(--color-primary-rgb), 0.75)',
  gold15:      'rgba(var(--color-accent-rgb), 0.15)',
  gold20:      'rgba(var(--color-accent-rgb), 0.20)',
  gold25:      'rgba(var(--color-accent-rgb), 0.25)',
  white60:     'rgba(255,255,255,0.60)',
  white70:     'rgba(255,255,255,0.70)',
  white80:     'rgba(255,255,255,0.80)',
}

// ─── Icon registry ────────────────────────────────────────────────────────────
const ICON_MAP: Record<string, React.ComponentType<{ size?: number; style?: React.CSSProperties; strokeWidth?: number; className?: string }>> = {
  FlaskConical,
  Rocket,
  Newspaper,
  Landmark,
  BookOpen,
  GraduationCap,
  Microscope,
  Users,
  Building,
  FileText,
}

// ─── HeroTile with resolved icon ─────────────────────────────────────────────
interface HeroTile extends HeroTileData {
  icon: React.ComponentType<{ size?: number; style?: React.CSSProperties; strokeWidth?: number; className?: string }>
}

// ─── FAQ Accordion ───────────────────────────────────────────────────────────
interface FaqItemProps {
  question: string
  answer?: string | null
  contact?: { name: string; phone: string; email: string } | null
  defaultOpen?: boolean
}

const FaqItem: React.FC<FaqItemProps> = ({ question, answer, contact, defaultOpen = false }) => {
  const [open, setOpen] = useState(defaultOpen)
  return (
    <div
      className="py-3 cursor-pointer select-none border-b"
      style={{ borderColor: C.navy10 }}
      onClick={() => setOpen(!open)}
    >
      <div className="flex items-start gap-3">
        <span
          className="shrink-0 w-5 h-5 flex items-center justify-center text-white text-xs font-bold mt-0.5 transition-colors"
          style={{ backgroundColor: open ? C.gold : C.navy }}
        >
          {open ? '−' : '+'}
        </span>
        <p className="text-sm font-semibold leading-snug" style={{ color: C.navy }}>{question}</p>
      </div>
      {open && (
        <div className="ml-8 mt-2 space-y-1">
          {answer && (
            <p className="text-sm leading-relaxed" style={{ color: C.navy70 }}>{answer}</p>
          )}
          {contact && (
            <div className="text-sm space-y-0.5" style={{ color: C.navy75 }}>
              <p className="font-semibold" style={{ color: C.navy }}>{contact.name}</p>
              <p>📞 {contact.phone}</p>
              <p>
                ✉{' '}
                <a href={`mailto:${contact.email}`} className="underline" style={{ color: C.gold }}>
                  {contact.email}
                </a>
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

// ─── Skeleton helpers scoped to Home ─────────────────────────────────────────

/** Shimmer block for use on dark (navy) backgrounds */
const SkDark: React.FC<{ className?: string }> = ({ className = '' }) => (
  <div aria-hidden="true" className={`animate-pulse rounded skeleton-shimmer bg-white/20 ${className}`} />
)

/** Full hero + tiles skeleton — preserves the exact sticky/height/grid structure */
const SkeletonHero: React.FC = () => (
  <>
    <div
      className="sticky top-0 w-full h-[320px] sm:h-[400px] md:h-[500px] z-0"
      style={{ backgroundColor: C.navy }}
    >
      <div className="absolute inset-0" style={{ backgroundColor: C.navy55 }} />
      <div className="relative z-10 h-full flex items-center justify-center px-4 text-center">
        <div className="max-w-5xl w-full space-y-5">
          <SkDark className="h-3 w-40 mx-auto" />
          <SkDark className="h-9 sm:h-12 md:h-14 w-64 sm:w-[420px] mx-auto" />
          <SkDark className="h-7 sm:h-9 w-44 sm:w-56 mx-auto bg-white/30" />
        </div>
      </div>
    </div>
    {/* Hero tiles skeleton */}
    <div className="relative z-10 mt-[-48px] sm:mt-[-80px] md:mt-[-100px] pb-0 bg-transparent">
      <div className="relative mx-auto max-w-[1400px] px-4 lg:px-12">
        <div
          className="grid grid-cols-2 lg:grid-cols-4 shadow-sm rounded overflow-hidden divide-x"
          style={{ border: `1px solid ${C.navy15}` } as React.CSSProperties}
        >
          {([true, false, false, true] as boolean[]).map((dark, i) => (
            <div
              key={i}
              className="min-h-[100px] sm:h-[110px] md:h-[120px] flex flex-col items-center justify-center text-center px-3 py-4 animate-pulse"
              style={{ backgroundColor: dark ? C.navy : C.white }}
            >
              <div aria-hidden="true" className={`h-2.5 w-20 rounded mb-2 skeleton-shimmer ${dark ? 'bg-white/20' : 'bg-slate-200'}`} />
              <div aria-hidden="true" className={`h-6 w-6 rounded mb-2 skeleton-shimmer ${dark ? 'bg-white/20' : 'bg-slate-200'}`} />
              <div aria-hidden="true" className={`h-2 w-24 rounded skeleton-shimmer ${dark ? 'bg-white/15' : 'bg-slate-200'}`} />
            </div>
          ))}
        </div>
      </div>
    </div>
  </>
)

/** About text block skeleton */
const SkeletonAboutText: React.FC = () => (
  <div aria-hidden="true">
    <Sk className="h-2.5 w-24 mb-2 rounded" />
    <Sk className="h-6 w-72 mb-1 rounded" />
    <Sk className="h-6 w-52 mb-2 rounded" />
    <div className="w-12 h-[2px] mb-5 bg-slate-200 rounded" />
    <div className="space-y-2 mb-6">
      <Sk className="h-3.5 w-full rounded" />
      <Sk className="h-3.5 w-full rounded" />
      <Sk className="h-3.5 w-5/6 rounded" />
      <Sk className="h-3.5 w-4/5 rounded" />
      <Sk className="h-3.5 w-full rounded" />
      <Sk className="h-3.5 w-3/4 rounded" />
    </div>
    <div className="flex gap-3">
      <Sk className="h-8 w-32 rounded" />
      <Sk className="h-8 w-36 rounded" />
    </div>
  </div>
)

/** Director card skeleton */
const SkeletonDirector: React.FC = () => (
  <div className="bg-white p-6 lg:p-7 rounded shadow-sm border" style={{ borderColor: C.navy15 }} aria-hidden="true">
    <Sk className="h-2.5 w-28 mb-2 rounded" />
    <Sk className="h-6 w-64 mb-1 rounded" />
    <Sk className="h-6 w-44 mb-2 rounded" />
    <div className="w-12 h-[2px] mb-5 bg-slate-200 rounded" />
    <div className="flex flex-col sm:flex-row gap-6 items-start">
      <Sk className="w-64 sm:w-80 h-[150px] sm:h-[190px] shrink-0 rounded" />
      <div className="flex-grow space-y-2 w-full">
        <Sk className="h-4 w-48 rounded" />
        <div className="space-y-1.5 mt-2">
          <Sk className="h-3 w-full rounded" />
          <Sk className="h-3 w-full rounded" />
          <Sk className="h-3 w-5/6 rounded" />
          <Sk className="h-3 w-4/5 rounded" />
          <Sk className="h-3 w-full rounded" />
          <Sk className="h-3 w-3/4 rounded" />
        </div>
        <Sk className="h-7 w-28 mt-3 rounded" />
      </div>
    </div>
  </div>
)

/** Academic programs grid skeleton — 3 cards */
const SkeletonAcademics: React.FC = () => (
  <div className="grid grid-cols-1 md:grid-cols-3 gap-8" aria-hidden="true">
    {Array.from({ length: 3 }).map((_, i) => (
      <div key={i} className="p-6 bg-white rounded flex flex-col border" style={{ borderColor: C.navy15 }}>
        <Sk className="w-10 h-10 rounded mb-6" />
        <Sk className="h-5 w-3/4 rounded mb-3" />
        <div className="space-y-1.5 mb-6">
          <Sk className="h-3 w-full rounded" />
          <Sk className="h-3 w-5/6 rounded" />
          <Sk className="h-3 w-4/6 rounded" />
        </div>
        <Sk className="h-3 w-28 rounded mt-auto" />
      </div>
    ))}
  </div>
)

/** Department items grid skeleton — 9 cards (4-col) */
const SkeletonDepartments: React.FC = () => (
  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4" aria-hidden="true">
    {Array.from({ length: 9 }).map((_, i) => (
      <div
        key={i}
        className="p-3 bg-white rounded flex items-center border"
        style={{ borderColor: C.navy15 }}
      >
        <Sk className="w-8 h-8 rounded shrink-0 mr-3" />
        <Sk className="h-3 w-36 rounded flex-1" />
      </div>
    ))}
  </div>
)

/** Stats banner skeleton — preserves dark parallax bg + 4-col grid */
const SkeletonStats: React.FC<{ backgroundImage: string; fallbackImage: string }> = ({
  backgroundImage,
  fallbackImage,
}) => (
  <div className="relative z-10 overflow-hidden" style={{ height: '280px' }}>
    <div
      className="absolute inset-0 w-full h-full"
      style={{
        backgroundImage: `url(${backgroundImage}), url(${fallbackImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center 40%',
        backgroundAttachment: 'fixed',
        filter: 'brightness(0.45)',
      }}
    />
    <div className="absolute inset-0" style={{ backgroundColor: C.navy55 }} />
    <div className="relative z-10 h-full flex items-center justify-center">
      <div className="max-w-[1400px] w-full mx-auto px-4 lg:px-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-0 text-center">
          {Array.from({ length: 4 }).map((_, i, arr) => (
            <div
              key={i}
              className="px-4 py-4 flex flex-col items-center gap-3 animate-pulse"
              style={{ borderRight: i < arr.length - 1 ? `1px solid rgba(255,255,255,0.12)` : 'none' }}
            >
              <SkDark className="h-10 md:h-14 w-28 bg-white/25" />
              <SkDark className="h-3 w-24" />
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
)

/** Campus life facilities grid skeleton — 3 cards */
const SkeletonCampusLife: React.FC = () => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6" aria-hidden="true">
    {Array.from({ length: 3 }).map((_, i) => (
      <div key={i} className="bg-white rounded overflow-hidden flex flex-col border" style={{ borderColor: C.navy15 }}>
        <Sk className="h-48 w-full rounded-none" />
        <div className="p-5 flex flex-col grow space-y-2">
          <div className="flex items-center gap-2">
            <Sk className="w-4 h-4 rounded shrink-0" />
            <Sk className="h-4 w-40 rounded" />
          </div>
          <Sk className="h-3 w-full rounded" />
          <Sk className="h-3 w-5/6 rounded" />
          <Sk className="h-3 w-4/6 rounded" />
        </div>
      </div>
    ))}
  </div>
)

/** FAQ items skeleton — 6 accordion rows */
const SkeletonFaqs: React.FC = () => (
  <div aria-hidden="true">
    {Array.from({ length: 6 }).map((_, i) => (
      <div
        key={i}
        className="py-3 border-b flex items-start gap-3"
        style={{ borderColor: C.navy10 }}
      >
        <Sk className="shrink-0 w-5 h-5 rounded" />
        <div className="flex-grow space-y-1.5">
          <Sk className="h-3.5 w-4/5 rounded" />
          <Sk className="h-3.5 w-3/5 rounded" />
        </div>
      </div>
    ))}
  </div>
)

/** Gallery thumbnail grid skeleton — 4×3 */
const SkeletonGallery: React.FC = () => (
  <div className="grid grid-cols-4 gap-1.5" aria-hidden="true">
    {Array.from({ length: 12 }).map((_, i) => (
      <Sk key={i} className="aspect-square rounded-sm" />
    ))}
  </div>
)

// ─── Home data type + stable fetcher (outside component → never recreated) ───
interface HomeData {
  pageData: HomePageData
  heroTiles: HeroTileData[]
  announcements: AnnouncementItem[]
  newsCards: HomeNewsCard[]
  featuredCards: FeaturedNewsCard[]
  thumbnails: GalleryThumbnail[]
  labels: UiLabelsConfig
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

// ─── Home ────────────────────────────────────────────────────────────────────
const Home: React.FC = () => {

  // ── Cached data — fetches once, returns instantly on every subsequent visit ──
  const { data: homeData, loading: homeLoading } = usePageData<HomeData>('home', fetchHomeData)

  const pageData      = homeData?.pageData      ?? homePageDefaults
  const announcements = homeData?.announcements ?? homePageDefaults.announcements
  const newsCards     = homeData?.newsCards     ?? []
  const featuredCards = homeData?.featuredCards ?? []
  const thumbnails    = homeData?.thumbnails    ?? []
  const labels        = homeData?.labels        ?? uiLabelsDefaults

  const resolveIcons = (tiles: HeroTileData[]): HeroTile[] =>
    tiles.map(t => ({ ...t, icon: ICON_MAP[t.iconName] ?? FlaskConical }))

  const heroTiles = useMemo(
    () => resolveIcons(homeData?.heroTiles ?? homePageDefaults.heroTiles),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [homeData?.heroTiles],
  )

  const [slideIndex, setSlideIndex] = useState(0)

  // Resolve slider images: prefer the images[] array, fall back to single imageUrl
  const heroImages = useMemo(() => {
    const hero = pageData.hero
    const arr = (hero.images ?? []).filter((u: string) => !!u)
    if (arr.length > 0) return arr
    return hero.imageUrl ? [hero.imageUrl] : []
  }, [pageData.hero])

  // Auto-advance slider every 5 s; reset to 0 when image set changes
  useEffect(() => {
    setSlideIndex(0)
  }, [heroImages.length])

  useEffect(() => {
    if (heroImages.length <= 1) return
    const id = setInterval(() => setSlideIndex(i => (i + 1) % heroImages.length), 5000)
    return () => clearInterval(id)
  }, [heroImages.length])

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

  // No sections config (empty array) means CMS hasn't set up ordering yet —
  // treat as "all enabled" so the page renders by default.
  const isSectionEnabled = (type: string): boolean => {
    if (!pageData.sections || pageData.sections.length === 0) return true
    return pageData.sections.some(s => s.type === type && s.enabled)
  }

  return (
    <div className="flex flex-col bg-white">
      <PageSeo pageKey="home" />

      {/* ══════ HERO + HERO TILES ══════ */}
      {isSectionEnabled('hero') && (
        homeLoading ? (
          <SkeletonHero />
        ) : (
          <div className="animate-fade-in">
            <div className="sticky top-0 w-full h-[320px] sm:h-[400px] md:h-[500px] z-0 overflow-hidden">

              {/* ── Crossfade slides ── */}
              {heroImages.length > 0 ? heroImages.map((imgUrl, i) => (
                <div
                  key={i}
                  className="absolute inset-0 bg-cover bg-center"
                  style={{
                    backgroundImage: `url(${imgUrl})`,
                    backgroundPosition: hero.imagePosition || 'center',
                    filter: 'brightness(0.9) contrast(1.02) saturate(0.95)',
                    opacity: i === slideIndex ? 1 : 0,
                    transition: 'opacity 1s ease-in-out',
                  }}
                />
              )) : (
                <div className="absolute inset-0" style={{ backgroundColor: C.navy }} />
              )}

              {/* Navy overlay */}
              <div className="absolute inset-0 z-[1]" style={{ backgroundColor: C.navy45 }} />

              {/* Text */}
              <div className="relative z-[2] h-full flex items-center justify-center px-4 text-center">
                <div className="max-w-5xl">
                  <p
                    className="uppercase tracking-[0.18em] text-[10px] sm:text-xs mb-3 font-semibold font-sans"
                    style={{ color: C.white80 }}
                  >
                    {hero.instituteName}
                  </p>
                  <h1 className="text-white uppercase font-display font-semibold text-2xl sm:text-4xl md:text-5xl leading-[1.1] tracking-[0.04em] drop-shadow-[0_4px_12px_rgba(0,0,0,0.35)]">
                    {hero.welcomeText}<br />
                    <span className="font-display font-bold italic" style={{ color: C.gold }}>{hero.accentText}</span>
                  </h1>
                </div>
              </div>

              {/* ── Slider controls (only when >1 image) ── */}
              {heroImages.length > 1 && (
                <>
                  {/* Prev arrow */}
                  <button
                    onClick={() => setSlideIndex(i => (i - 1 + heroImages.length) % heroImages.length)}
                    aria-label="Previous slide"
                    className="absolute left-3 sm:left-5 top-1/2 -translate-y-1/2 z-[3] w-9 h-9 flex items-center justify-center rounded-full transition-colors"
                    style={{ backgroundColor: 'rgba(0,0,0,0.25)' }}
                    onMouseEnter={e => { (e.currentTarget as HTMLElement).style.backgroundColor = 'rgba(0,0,0,0.50)' }}
                    onMouseLeave={e => { (e.currentTarget as HTMLElement).style.backgroundColor = 'rgba(0,0,0,0.25)' }}
                  >
                    <ChevronLeft size={20} color="#fff" strokeWidth={2.5} />
                  </button>

                  {/* Next arrow */}
                  <button
                    onClick={() => setSlideIndex(i => (i + 1) % heroImages.length)}
                    aria-label="Next slide"
                    className="absolute right-3 sm:right-5 top-1/2 -translate-y-1/2 z-[3] w-9 h-9 flex items-center justify-center rounded-full transition-colors"
                    style={{ backgroundColor: 'rgba(0,0,0,0.25)' }}
                    onMouseEnter={e => { (e.currentTarget as HTMLElement).style.backgroundColor = 'rgba(0,0,0,0.50)' }}
                    onMouseLeave={e => { (e.currentTarget as HTMLElement).style.backgroundColor = 'rgba(0,0,0,0.25)' }}
                  >
                    <ChevronRight size={20} color="#fff" strokeWidth={2.5} />
                  </button>

                  {/* Dot indicators */}
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-[3] flex items-center gap-2">
                    {heroImages.map((_, i) => (
                      <button
                        key={i}
                        onClick={() => setSlideIndex(i)}
                        aria-label={`Go to slide ${i + 1}`}
                        className="rounded-full transition-all duration-300"
                        style={{
                          width:  i === slideIndex ? '20px' : '8px',
                          height: '8px',
                          backgroundColor: i === slideIndex ? C.gold : 'rgba(255,255,255,0.55)',
                        }}
                      />
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* ══════ HERO TILES ══════ */}
            <div className="relative z-10 mt-[-48px] sm:mt-[-80px] md:mt-[-100px] pb-0 bg-transparent">
              <div className="relative mx-auto max-w-[1400px] px-4 lg:px-12">
                <div
                  className="grid grid-cols-2 lg:grid-cols-4 shadow-sm rounded overflow-hidden divide-x"
                  style={{ border: `1px solid ${C.navy15}`, divideColor: C.navy10 } as React.CSSProperties}
                >
                  {heroTiles.map((tile) => {
                    const Icon = tile.icon
                    const iconColor = tile.dark ? C.gold : C.navy
                    return (
                      <Link
                        key={tile.title}
                        to={tile.path}
                        className="min-h-[100px] sm:h-[110px] md:h-[120px] flex flex-col items-center justify-center text-center px-3 py-4 sm:px-4 transition-opacity duration-200 hover:opacity-85"
                        style={{ backgroundColor: tile.dark ? C.navy : C.white }}
                      >
                        <p
                          className="font-sans font-bold uppercase text-[10px] sm:text-xs tracking-[0.15em] mb-1.5"
                          style={{ color: tile.dark ? C.gold : C.navy }}
                        >
                          {tile.title}
                        </p>
                        <Icon size={24} style={{ color: iconColor }} strokeWidth={1.75} className="mb-2" />
                        <p
                          className="text-[10px] sm:text-xs leading-normal max-w-[210px] font-medium"
                          style={{ color: tile.dark ? C.white60 : C.navy55 }}
                        >
                          {tile.subtitle}
                        </p>
                      </Link>
                    )
                  })}
                </div>
              </div>
            </div>
          </div>
        )
      )}

      {/* ══════ ABOUT + DIRECTOR + ANNOUNCEMENTS ══════ */}
      {isSectionEnabled('about') && (
        <section
          className="bg-white py-10 md:py-14 relative z-10"
          style={{ borderBottom: `1px solid ${C.navy10}` }}
        >
          <div className="max-w-[1400px] mx-auto px-4 lg:px-12 grid grid-cols-1 lg:grid-cols-3 gap-10">

            {/* Left — About & Director */}
            <div className="lg:col-span-2 flex flex-col space-y-12">

              {/* About */}
              {homeLoading ? (
                <SkeletonAboutText />
              ) : (
                <div className="animate-fade-in">
                  <span
                    className="text-[10px] uppercase font-bold tracking-widest block mb-1"
                    style={{ color: C.gold }}
                  >
                    {about.label}
                  </span>
                  <h2
                    className="text-lg md:text-xl font-display font-bold tracking-tight uppercase mb-2"
                    style={{ color: C.navy }}
                  >
                    {about.heading}{' '}
                    <span className="font-serif italic font-semibold" style={{ color: C.navy }}>
                      {about.accentText}
                    </span>
                  </h2>
                  <div className="w-12 h-[2px] mb-5" style={{ backgroundColor: C.gold }} />

                  <p
                    className="leading-relaxed text-sm mb-6 text-justify font-sans"
                    style={{ color: C.navy70 }}
                  >
                    {about.body}
                  </p>

                  <div className="flex flex-wrap gap-3">
                    {about.primaryButton?.to && (
                      <Link
                        to={about.primaryButton.to}
                        className="px-4 py-2 text-xs font-semibold border rounded transition-colors hover:opacity-80"
                        style={{ borderColor: C.navy15, color: C.navy, backgroundColor: C.white }}
                      >
                        {about.primaryButton.label}
                      </Link>
                    )}
                    {about.secondaryButton?.to && (
                      <Link
                        to={about.secondaryButton.to}
                        className="px-4 py-2 text-xs font-semibold rounded shadow-sm transition-opacity hover:opacity-90"
                        style={{ backgroundColor: C.navy, color: C.white }}
                      >
                        {about.secondaryButton.label}
                      </Link>
                    )}
                  </div>
                </div>
              )}

              {/* Director's Corner */}
              {homeLoading ? (
                <SkeletonDirector />
              ) : (
                <div
                  className="bg-white p-6 lg:p-7 rounded shadow-sm relative border animate-fade-in"
                  style={{ borderColor: C.navy15 }}
                >
                  <span
                    className="text-[10px] uppercase font-bold tracking-widest block mb-1"
                    style={{ color: C.gold }}
                  >
                    {director.label}
                  </span>
                  <h2
                    className="text-lg md:text-xl font-display font-bold tracking-tight uppercase mb-2"
                    style={{ color: C.navy }}
                  >
                    {director.heading}{' '}
                    <span className="font-serif italic font-semibold" style={{ color: C.navy }}>
                      {director.accentText}
                    </span>
                  </h2>
                  <div className="w-12 h-[2px] mb-5" style={{ backgroundColor: C.gold }} />

                  <div className="flex flex-col sm:flex-row gap-6 items-start">
                    <div
                      className="w-64 sm:w-80 h-[150px] sm:h-[190px] shrink-0 bg-white rounded overflow-hidden shadow-sm border"
                      style={{ borderColor: C.navy15 }}
                    >
                      <img
                        src={director.photo || undefined}
                        alt={`Director ${director.name}`}
                        className="w-full h-full object-cover object-center"
                      />
                    </div>
                    <div className="text-sm leading-relaxed font-serif" style={{ color: C.navy70 }}>
                      <h3 className="font-sans font-bold text-base mb-1.5" style={{ color: C.navy }}>
                        {director.name}
                      </h3>
                      <p className="mb-4 text-justify leading-relaxed">
                        {director.bio}
                      </p>
                      {director.readMoreTo && (
                        <Link
                          to={director.readMoreTo}
                          className="px-3.5 py-1.5 border rounded inline-block text-xs font-semibold font-sans transition-colors hover:opacity-80"
                          style={{ borderColor: C.navy15, color: C.navy, backgroundColor: C.white }}
                        >
                          {director.readMoreLabel}
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Right — Announcements */}
            <div className="lg:col-span-1">
              <div
                className="bg-white h-full flex flex-col shadow-sm rounded overflow-hidden border"
                style={{ borderColor: C.navy15 }}
              >
                {/* Header */}
                <div
                  className="px-5 py-4 flex items-center justify-between"
                  style={{ backgroundColor: C.navy }}
                >
                  <h3 className="font-sans font-bold text-sm tracking-widest uppercase flex items-center text-white">
                    <Calendar size={16} className="mr-2" style={{ color: C.gold }} />
                    {labels.homepage.announcementsHeading}
                  </h3>
                  <span
                    className="text-[9px] uppercase font-bold px-2 py-0.5 rounded tracking-wider"
                    style={{
                      backgroundColor: C.gold25,
                      color: C.gold,
                      border: `1px solid ${C.gold20}`,
                    }}
                  >
                    {labels.homepage.announcementsBadge}
                  </span>
                </div>

                {/* List */}
                <div className="p-0 flex-1 overflow-y-auto max-h-[500px]">
                  {homeLoading ? (
                    <div className="divide-y p-3 space-y-3">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <div key={i} className="py-3 space-y-2">
                          <Sk className="h-3.5 w-full" />
                          <Sk className="h-3.5 w-5/6" />
                          <Sk className="h-3 w-16" />
                        </div>
                      ))}
                    </div>
                  ) : (
                    <ul className="divide-y animate-fade-in" style={{ borderColor: C.navy10 }}>
                      {announcements.map((item) => (
                        <li key={item.id} style={{ borderColor: C.navy10 }}>
                          <Link
                            to={item.to}
                            className="flex p-4 transition-colors group hover:opacity-90"
                            style={{ borderLeft: `2px solid transparent` }}
                            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderLeftColor = C.gold }}
                            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderLeftColor = 'transparent' }}
                          >
                            <div className="flex space-x-3 w-full">
                              <div className="shrink-0 mt-0.5">
                                <ChevronRight
                                  size={14}
                                  className="group-hover:translate-x-0.5 transition-transform"
                                  style={{ color: C.navy45 }}
                                />
                              </div>
                              <div>
                                <p
                                  className="text-[13.5px] leading-snug font-medium font-sans"
                                  style={{ color: C.navy }}
                                >
                                  {item.title}
                                </p>
                                <div className="mt-1.5 flex items-center">
                                  {item.isNew ? (
                                    <span
                                      className="text-[9px] font-bold px-1.5 py-0.5 rounded"
                                      style={{
                                        backgroundColor: C.gold15,
                                        color: C.gold,
                                        border: `1px solid ${C.gold25}`,
                                      }}
                                    >
                                      New
                                    </span>
                                  ) : (
                                    <span
                                      className="text-[10px] font-semibold uppercase tracking-wider"
                                      style={{ color: C.navy45 }}
                                    >
                                      {item.date}
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>

                {/* Footer */}
                <div
                  className="p-4 bg-white flex justify-center mt-auto border-t"
                  style={{ borderColor: C.navy10 }}
                >
                  <Link
                    to="/notices"
                    className="text-xs font-semibold hover:underline flex items-center tracking-wider uppercase"
                    style={{ color: C.navy }}
                  >
                    {labels.homepage.viewAllNoticesLabel} <ChevronRight size={12} className="ml-1" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ══════ CAMPUS NEWS ══════ */}
      {isSectionEnabled('news') && (
        <section
          className="bg-white py-16 relative z-10"
          style={{ borderBottom: `1px solid ${C.navy10}` }}
        >
          <div className="max-w-[1400px] mx-auto px-4 lg:px-12">
            <div className="text-center mb-12">
              {homeLoading ? (
                <div className="space-y-3" aria-hidden="true">
                  <Sk className="h-2.5 w-24 mx-auto rounded" />
                  <Sk className="h-8 w-64 mx-auto rounded" />
                  <div className="w-12 h-[2px] mx-auto bg-slate-200 rounded" />
                  <Sk className="h-3.5 w-80 mx-auto rounded" />
                </div>
              ) : (
                <div className="animate-fade-in">
                  <span
                    className="text-[10px] uppercase font-bold tracking-widest block mb-1"
                    style={{ color: C.gold }}
                  >
                    {newsSection.label}
                  </span>
                  <h2
                    className="text-2xl md:text-3xl font-display font-bold tracking-tight uppercase mb-2"
                    style={{ color: C.navy }}
                  >
                    {newsSection.heading}{' '}
                    <span className="font-serif italic font-semibold" style={{ color: C.navy }}>
                      {newsSection.accentText}
                    </span>
                  </h2>
                  <div className="w-12 h-[2px] mx-auto mb-4" style={{ backgroundColor: C.gold }} />
                  <p className="text-sm max-w-xl mx-auto font-sans" style={{ color: C.navy60 }}>
                    {newsSection.description}
                  </p>
                </div>
              )}
            </div>

            {homeLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="md:col-span-2"><SkeletonCard className="min-h-[380px]" /></div>
                <SkeletonCard className="min-h-[380px]" />
                <SkeletonCard className="min-h-[380px]" />
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 animate-fade-in">

                {/* First featured card */}
                {featuredCards[0] && (
                  <Link
                    to={featuredCards[0].to}
                    className="md:col-span-2 relative overflow-hidden rounded flex flex-col justify-end min-h-[380px] group border"
                    style={{ borderColor: C.navy15, backgroundColor: C.white }}
                  >
                    <img
                      src={featuredCards[0].imageUrl || undefined}
                      alt="Research at SGSITS"
                      className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      style={{ filter: 'saturate(0.85) contrast(1.02)' }}
                    />
                    <div
                      className="absolute inset-0"
                      style={{ background: `linear-gradient(to top, ${C.navy} 0%, ${C.navy40} 60%, transparent 100%)` }}
                    />
                    <div className="relative p-6 md:p-8 z-10">
                      <span
                        className="text-[10px] font-bold tracking-widest uppercase mb-2 block"
                        style={{ color: C.gold }}
                      >
                        {featuredCards[0].label}
                      </span>
                      <h3 className="text-white text-2xl md:text-3xl font-display font-bold leading-tight">
                        {featuredCards[0].title}
                      </h3>
                      <p
                        className="text-xs mt-3 font-sans font-medium max-w-xl"
                        style={{ color: C.white80 }}
                      >
                        {featuredCards[0].description}
                      </p>
                    </div>
                  </Link>
                )}

                {/* Regular news cards */}
                {newsCards.map((card) => (
                  <Link
                    key={card.id}
                    to={card.to}
                    className="bg-white rounded flex flex-col min-h-[380px] group hover:shadow-md transition-all duration-200 border"
                    style={{ borderColor: C.navy15 }}
                  >
                    <div className="h-44 overflow-hidden shrink-0 border-b" style={{ borderColor: C.navy10 }}>
                      <img
                        src={card.imageUrl || undefined}
                        alt={card.category}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <div className="p-5 flex flex-col grow">
                      <span
                        className="text-[9px] font-bold tracking-widest uppercase mb-1.5"
                        style={{ color: C.gold }}
                      >
                        {card.category}
                      </span>
                      <h3
                        className="font-display font-bold text-base leading-snug group-hover:underline"
                        style={{ color: C.navy }}
                      >
                        {card.title}
                      </h3>
                      <p
                        className="text-xs mt-2 line-clamp-3 font-sans font-medium"
                        style={{ color: C.navy60 }}
                      >
                        {card.description}
                      </p>
                    </div>
                  </Link>
                ))}

                {/* Second featured card */}
                {featuredCards[1] && (
                  <Link
                    to={featuredCards[1].to}
                    className="md:col-span-2 relative overflow-hidden rounded flex flex-col justify-end min-h-[380px] group border"
                    style={{ borderColor: C.navy15, backgroundColor: C.white }}
                  >
                    <img
                      src={featuredCards[1].imageUrl || undefined}
                      alt="Engineering Laboratory"
                      className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      style={{ filter: 'saturate(0.85) contrast(1.02)' }}
                    />
                    <div
                      className="absolute inset-0"
                      style={{ background: `linear-gradient(to top, ${C.navy} 0%, ${C.navy40} 60%, transparent 100%)` }}
                    />
                    <div className="relative p-6 md:p-8 z-10">
                      <span
                        className="text-[10px] font-bold tracking-widest uppercase mb-2 block"
                        style={{ color: C.gold }}
                      >
                        {featuredCards[1].label}
                      </span>
                      <h3 className="text-white text-2xl md:text-3xl font-display font-bold leading-tight">
                        {featuredCards[1].title}
                      </h3>
                      <p
                        className="text-xs mt-3 font-sans font-medium max-w-xl"
                        style={{ color: C.white80 }}
                      >
                        {featuredCards[1].description}
                      </p>
                    </div>
                  </Link>
                )}
              </div>
            )}
          </div>
        </section>
      )}

      {/* ══════ ACADEMIC PROGRAMS ══════ */}
      {isSectionEnabled('academics') && (
        <section
          className="bg-white py-14 relative z-10"
          style={{ borderBottom: `1px solid ${C.navy10}` }}
        >
          <div className="max-w-[1400px] mx-auto px-4 lg:px-12">
            <div className="text-center mb-12">
              {homeLoading ? (
                <div className="space-y-3" aria-hidden="true">
                  <Sk className="h-2.5 w-28 mx-auto rounded" />
                  <Sk className="h-8 w-72 mx-auto rounded" />
                  <div className="w-12 h-[2px] mx-auto bg-slate-200 rounded" />
                  <Sk className="h-3.5 w-80 mx-auto rounded" />
                </div>
              ) : (
                <div className="animate-fade-in">
                  <span
                    className="text-[10px] uppercase font-bold tracking-widest block mb-1"
                    style={{ color: C.gold }}
                  >
                    {academicsSection.label}
                  </span>
                  <h2
                    className="text-2xl md:text-3xl font-display font-bold tracking-tight uppercase mb-2"
                    style={{ color: C.navy }}
                  >
                    {academicsSection.heading}{' '}
                    <span className="font-serif italic font-semibold" style={{ color: C.navy }}>
                      {academicsSection.accentText}
                    </span>
                  </h2>
                  <div className="w-12 h-[2px] mx-auto mb-4" style={{ backgroundColor: C.gold }} />
                  <p className="text-sm max-w-xl mx-auto font-sans" style={{ color: C.navy60 }}>
                    {academicsSection.description}
                  </p>
                </div>
              )}
            </div>

            {homeLoading ? (
              <SkeletonAcademics />
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 animate-fade-in">
                {(academicsSection.programs ?? []).map((prog) => {
                  const Icon = ICON_MAP[prog.iconName] ?? BookOpen
                  return (
                    <div
                      key={prog.id}
                      className="p-6 bg-white rounded flex flex-col group hover:shadow-md transition-all duration-200 border"
                      style={{ borderColor: C.navy15 }}
                    >
                      <div
                        className="w-10 h-10 flex items-center justify-center rounded mb-6 transition-colors duration-200 border"
                        style={{ backgroundColor: C.white, borderColor: C.navy15, color: C.navy }}
                        onMouseEnter={e => {
                          const el = e.currentTarget as HTMLElement
                          el.style.backgroundColor = C.navy
                          el.style.borderColor = C.navy
                          el.style.color = C.white
                        }}
                        onMouseLeave={e => {
                          const el = e.currentTarget as HTMLElement
                          el.style.backgroundColor = C.white
                          el.style.borderColor = C.navy15
                          el.style.color = C.navy
                        }}
                      >
                        <Icon size={20} strokeWidth={1.5} />
                      </div>
                      <h3
                        className="text-lg font-display font-bold mb-3 group-hover:underline"
                        style={{ color: C.navy }}
                      >
                        {prog.title}
                      </h3>
                      <p className="text-xs leading-relaxed mb-6 font-sans font-medium" style={{ color: C.navy60 }}>
                        {prog.description}
                      </p>
                      <Link
                        to={prog.to ?? '#'}
                        className="font-bold text-[11px] uppercase tracking-wider mt-auto flex items-center hover:underline"
                        style={{ color: C.navy }}
                      >
                        {prog.ctaLabel} <ChevronRight size={12} className="ml-1" />
                      </Link>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        </section>
      )}

      {/* ══════ DEPARTMENTS ══════ */}
      {isSectionEnabled('departments') && (
        <section
          className="py-16 bg-white relative z-10"
          style={{ borderBottom: `1px solid ${C.navy10}` }}
        >
          <div className="max-w-[1400px] mx-auto px-4 lg:px-12">
            <div
              className="flex justify-between items-end mb-10 pb-4 border-b"
              style={{ borderColor: C.navy10 }}
            >
              <div>
                {homeLoading ? (
                  <div className="space-y-2" aria-hidden="true">
                    <Sk className="h-2.5 w-24 rounded" />
                    <Sk className="h-7 w-56 rounded" />
                  </div>
                ) : (
                  <div className="animate-fade-in">
                    <span
                      className="text-[10px] uppercase font-bold tracking-widest block mb-1"
                      style={{ color: C.gold }}
                    >
                      {departmentsSection.label}
                    </span>
                    <h2
                      className="text-xl md:text-2xl font-display font-bold tracking-tight uppercase"
                      style={{ color: C.navy }}
                    >
                      {departmentsSection.heading}{' '}
                      <span className="font-serif italic font-semibold" style={{ color: C.navy }}>
                        {departmentsSection.accentText}
                      </span>
                    </h2>
                  </div>
                )}
              </div>
              <Link
                to={departmentsSection.showAllLink ?? '#'}
                className="font-semibold hover:underline text-xs tracking-wider uppercase hidden md:block"
                style={{ color: C.navy }}
              >
                {labels.homepage.viewAllDepartmentsLabel}
              </Link>
            </div>

            {homeLoading ? (
              <SkeletonDepartments />
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 animate-fade-in">
                {(departmentsSection.items ?? []).map((dept, idx) => (
                  <Link
                    key={idx}
                    to={`/departments/${dept.slug}`}
                    className="p-3 bg-white rounded flex items-center transition-all duration-200 group border hover:shadow-sm"
                    style={{ borderColor: C.navy15 }}
                    onMouseEnter={e => {
                      (e.currentTarget as HTMLElement).style.borderColor = C.navy
                    }}
                    onMouseLeave={e => {
                      (e.currentTarget as HTMLElement).style.borderColor = C.navy15
                    }}
                  >
                    <div
                      className="w-8 h-8 rounded flex items-center justify-center mr-3 shrink-0 transition-all duration-200 border"
                      style={{ backgroundColor: C.white, borderColor: C.navy15, color: C.navy55 }}
                      onMouseEnter={e => {
                        const el = e.currentTarget as HTMLElement
                        el.style.backgroundColor = C.navy
                        el.style.color = C.white
                        el.style.borderColor = C.navy
                      }}
                      onMouseLeave={e => {
                        const el = e.currentTarget as HTMLElement
                        el.style.backgroundColor = C.white
                        el.style.color = C.navy55
                        el.style.borderColor = C.navy15
                      }}
                    >
                      <Building size={14} />
                    </div>
                    <span
                      className="font-sans font-semibold text-xs group-hover:underline"
                      style={{ color: C.navy }}
                    >
                      {dept.name}
                    </span>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </section>
      )}

      {/* ══════ STATS BANNER (parallax) ══════ */}
      {isSectionEnabled('stats') && (
        homeLoading ? (
          <SkeletonStats
            backgroundImage={statsSection.backgroundImage}
            fallbackImage={statsSection.fallbackImage}
          />
        ) : (
          <section className="relative z-10 overflow-hidden animate-fade-in" style={{ height: '280px' }}>
            <div
              className="absolute inset-0 w-full h-full"
              style={{
                backgroundImage: `url(${statsSection.backgroundImage}), url(${statsSection.fallbackImage})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center 40%',
                backgroundAttachment: 'fixed',
                filter: 'brightness(0.45)',
              }}
            />
            <div className="absolute inset-0" style={{ backgroundColor: C.navy55 }} />

            <div className="relative z-10 h-full flex items-center justify-center">
              <div className="max-w-[1400px] w-full mx-auto px-4 lg:px-12">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-0 text-center">
                  {(statsSection.items ?? []).map((s, i, arr) => (
                    <div
                      key={s.label}
                      className="px-4 py-4"
                      style={{ borderRight: i < arr.length - 1 ? `1px solid rgba(255,255,255,0.12)` : 'none' }}
                    >
                      <div
                        className="text-3xl md:text-5xl font-display font-extrabold tracking-tight"
                        style={{ color: C.gold }}
                      >
                        {s.val}
                      </div>
                      <div
                        className="text-[10px] sm:text-xs font-sans font-bold uppercase tracking-[0.2em] mt-2"
                        style={{ color: C.white70 }}
                      >
                        {s.label}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>
        )
      )}

      {/* ══════ CAMPUS LIFE ══════ */}
      {isSectionEnabled('campus_life') && (
        <section className="py-16 bg-white relative z-10">
          <div className="max-w-[1400px] mx-auto px-4 lg:px-12">
            <div className="text-center mb-12">
              {homeLoading ? (
                <div className="space-y-3" aria-hidden="true">
                  <Sk className="h-2.5 w-28 mx-auto rounded" />
                  <Sk className="h-8 w-72 mx-auto rounded" />
                  <div className="w-12 h-[2px] mx-auto bg-slate-200 rounded" />
                  <Sk className="h-3.5 w-80 mx-auto rounded" />
                </div>
              ) : (
                <div className="animate-fade-in">
                  <span
                    className="text-[10px] uppercase font-bold tracking-widest block mb-1"
                    style={{ color: C.gold }}
                  >
                    {campusLifeSection.label}
                  </span>
                  <h2
                    className="text-2xl md:text-3xl font-display font-bold tracking-tight uppercase mb-2"
                    style={{ color: C.navy }}
                  >
                    {campusLifeSection.heading}{' '}
                    <span className="font-serif italic font-semibold" style={{ color: C.navy }}>
                      {campusLifeSection.accentText}
                    </span>
                  </h2>
                  <div className="w-12 h-[2px] mx-auto mb-4" style={{ backgroundColor: C.gold }} />
                  <p className="text-sm max-w-xl mx-auto font-sans" style={{ color: C.navy60 }}>
                    {campusLifeSection.description}
                  </p>
                </div>
              )}
            </div>

            {homeLoading ? (
              <SkeletonCampusLife />
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in">
                {(campusLifeSection.facilities ?? []).map((facility) => {
                  const FacIcon = ICON_MAP[facility.iconName] ?? Building
                  return (
                    <Link
                      key={facility.id}
                      to={facility.to ?? '#'}
                      className="bg-white rounded overflow-hidden group hover:shadow-md transition-all duration-200 flex flex-col border"
                      style={{ borderColor: C.navy15 }}
                    >
                      <div
                        className="h-48 overflow-hidden relative border-b"
                        style={{ borderColor: C.navy10 }}
                      >
                        <img
                          src={facility.imageUrl || undefined}
                          alt={facility.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div
                          className="absolute inset-0 transition-all duration-300 group-hover:opacity-0"
                          style={{ backgroundColor: C.navy15 }}
                        />
                      </div>
                      <div className="p-5 flex flex-col grow">
                        <h3
                          className="text-base font-display font-bold mb-2 flex items-center group-hover:underline"
                          style={{ color: C.navy }}
                        >
                          <FacIcon
                            size={16}
                            className="mr-2 shrink-0"
                            style={{ color: C.gold }}
                            strokeWidth={1.75}
                          />
                          {facility.title}
                        </h3>
                        <p className="text-xs leading-relaxed font-sans font-medium" style={{ color: C.navy60 }}>
                          {facility.description}
                        </p>
                      </div>
                    </Link>
                  )
                })}
              </div>
            )}
          </div>
        </section>
      )}

      {/* ══════ FAQs + GALLERY ══════ */}
      {isSectionEnabled('faqs_gallery') && (
        <section
          className="relative z-10"
          style={{ backgroundColor: C.white, borderTop: `1px solid ${C.navy10}` }}
        >
          <div className="max-w-[1400px] mx-auto px-4 lg:px-12 py-16">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">

              {/* LEFT — FAQs */}
              <div>
                <div className="flex items-center gap-3 mb-1">
                  {homeLoading ? (
                    <div className="flex items-center gap-3 w-full" aria-hidden="true">
                      <Sk className="h-7 w-48 rounded" />
                      <Sk className="h-6 w-16 rounded" />
                    </div>
                  ) : (
                    <div className="flex items-center gap-3 animate-fade-in">
                      <h2
                        className="text-xl md:text-2xl font-display font-bold uppercase tracking-tight"
                        style={{ color: C.navy }}
                      >
                        {faqsSection.heading}
                      </h2>
                      <Link
                        to={faqsSection.viewAllLink ?? '#'}
                        className="text-xs font-bold border rounded px-2 py-0.5 hover:opacity-80 transition-opacity"
                        style={{ borderColor: C.navy, color: C.navy }}
                      >
                        {labels.homepage.viewAllFaqsLabel}
                      </Link>
                    </div>
                  )}
                </div>
                {homeLoading ? (
                  <div className="space-y-2 mb-6" aria-hidden="true">
                    <Sk className="h-2.5 w-36 rounded" />
                    <div className="w-8 h-[2px] bg-slate-200 rounded" />
                  </div>
                ) : (
                  <div className="animate-fade-in">
                    <p
                      className="text-[10px] uppercase font-bold tracking-widest mb-1"
                      style={{ color: C.gold }}
                    >
                      {faqsSection.subLabel}
                    </p>
                    <div className="w-8 h-[2px] mb-6" style={{ backgroundColor: C.gold }} />
                  </div>
                )}

                <div>
                  {homeLoading ? (
                    <SkeletonFaqs />
                  ) : (
                    <div className="animate-fade-in">
                      {(faqsSection.items ?? []).map((faq: FaqItemData) => (
                        <FaqItem
                          key={faq.id}
                          question={faq.question}
                          answer={faq.answer}
                          contact={faq.contact}
                          defaultOpen={faq.defaultOpen}
                        />
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* RIGHT — Photo Gallery */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  {homeLoading ? (
                    <div className="flex items-center justify-between w-full" aria-hidden="true">
                      <div className="flex items-center gap-3">
                        <Sk className="h-7 w-44 rounded" />
                      </div>
                      <Sk className="h-6 w-16 rounded" />
                    </div>
                  ) : (
                    <div className="flex items-center justify-between w-full animate-fade-in">
                      <div className="flex items-center gap-3">
                        <h2
                          className="text-xl md:text-2xl font-display font-bold uppercase tracking-tight"
                          style={{ color: C.navy }}
                        >
                          {gallerySection.heading}{' '}
                          <span style={{ color: C.gold }}>{gallerySection.accentText}</span>
                        </h2>
                      </div>
                      <Link
                        to={gallerySection.viewAllLink ?? '#'}
                        className="text-xs font-bold border rounded px-2 py-0.5 hover:opacity-80 transition-opacity"
                        style={{ borderColor: C.navy, color: C.navy }}
                      >
                        {labels.homepage.viewAllGalleryLabel}
                      </Link>
                    </div>
                  )}
                </div>
                {homeLoading ? (
                  <div className="space-y-2 mb-6" aria-hidden="true">
                    <Sk className="h-2.5 w-32 rounded" />
                    <div className="w-8 h-[2px] bg-slate-200 rounded" />
                  </div>
                ) : (
                  <div className="animate-fade-in">
                    <p
                      className="text-[10px] uppercase font-bold tracking-widest mb-1"
                      style={{ color: C.gold }}
                    >
                      {gallerySection.subLabel}
                    </p>
                    <div className="w-8 h-[2px] mb-6" style={{ backgroundColor: C.gold }} />
                  </div>
                )}

                {homeLoading ? (
                  <SkeletonGallery />
                ) : (
                  <div className="grid grid-cols-4 gap-1.5 animate-fade-in">
                    {thumbnails.map((thumb, idx) => (
                      <Link
                        key={idx}
                        to={thumb.to}
                        className="aspect-square overflow-hidden rounded-sm group block"
                        style={{ border: `1px solid ${C.navy10}` }}
                      >
                        <img
                          src={thumb.imageUrl || undefined}
                          alt={thumb.alt}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                      </Link>
                    ))}
                  </div>
                )}
              </div>

            </div>
          </div>
        </section>
      )}
    </div>
  )
}

export default Home
