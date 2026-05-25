import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import {
  Calendar,
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
import type {
  HomePageData,
  HeroTileData,
  AnnouncementItem,
  FaqItem as FaqItemData,
} from '../mock/home/homeData'
import type { HomeNewsCard, FeaturedNewsCard }    from '../services/newsService'
import type { GalleryThumbnail }                  from '../services/mediaService'
import type { UiLabelsConfig }                    from '../services/uiLabelsService'

// ─── Palette constants — only these three colours are used anywhere in this file ───
const C = {
  navy:        '#0b2545',
  gold:        '#bfa15f',
  white:       '#ffffff',
  // opacity helpers (still derived from the same three)
  navy10:      'rgba(11,37,69,0.10)',
  navy15:      'rgba(11,37,69,0.15)',
  navy45:      'rgba(11,37,69,0.45)',
  navy55:      'rgba(11,37,69,0.55)',
  navy60:      'rgba(11,37,69,0.60)',
  navy70:      'rgba(11,37,69,0.70)',
  navy75:      'rgba(11,37,69,0.75)',
  gold15:      'rgba(191,161,95,0.15)',
  gold20:      'rgba(191,161,95,0.20)',
  gold25:      'rgba(191,161,95,0.25)',
  white60:     'rgba(255,255,255,0.60)',
  white70:     'rgba(255,255,255,0.70)',
  white80:     'rgba(255,255,255,0.80)',
}

// ─── Icon registry — maps icon name strings (from CMS data) to Lucide components ──
// Only the component knows about React icons; the data layer just stores string names.
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
                <a
                  href={`mailto:${contact.email}`}
                  className="underline"
                  style={{ color: C.gold }}
                >
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

// ─── Home ────────────────────────────────────────────────────────────────────
const Home: React.FC = () => {

  // ── State — initialized with synchronous defaults so there is zero loading flash ──
  const [pageData, setPageData]             = useState<HomePageData>(homePageDefaults)
  const [heroTiles, setHeroTiles]           = useState<HeroTile[]>([])
  const [announcements, setAnnouncements]   = useState<AnnouncementItem[]>(homePageDefaults.announcements)
  const [newsCards, setNewsCards]           = useState<HomeNewsCard[]>([])
  const [featuredCards, setFeaturedCards]   = useState<FeaturedNewsCard[]>([])
  const [thumbnails, setThumbnails]         = useState<GalleryThumbnail[]>([])
  // ── UI labels — small strings all backend-controllable ───────────────────
  const [labels, setLabels]                 = useState<UiLabelsConfig>(uiLabelsDefaults)

  // ── Resolve icon names → React components from the raw tile data ─────────
  const resolveIcons = (tiles: HeroTileData[]): HeroTile[] =>
    tiles.map(t => ({ ...t, icon: ICON_MAP[t.iconName] ?? FlaskConical }))

  // ── Load all data through the service layer on mount ─────────────────────
  useEffect(() => {
    const load = async () => {
      const [
        home,
        rawTiles,
        homeAnnouncements,
        cards,
        featured,
        thumbs,
        loadedLabels,
      ] = await Promise.all([
        contentService.getHomePage(),
        contentService.getHeroTiles(),
        noticesService.getHomeAnnouncements(),
        newsService.getHomeNewsCards(),
        newsService.getFeaturedNewsCards(),
        mediaService.getHomeGalleryThumbnails(),
        uiLabelsService.getUiLabels(),
      ])

      setPageData(home)
      setHeroTiles(resolveIcons(rawTiles))
      setAnnouncements(homeAnnouncements)
      setNewsCards(cards)
      setFeaturedCards(featured)
      setThumbnails(thumbs)
      setLabels(loadedLabels)
    }

    load()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Pre-resolve icons for default data on first render
  useEffect(() => {
    setHeroTiles(resolveIcons(homePageDefaults.heroTiles))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // ── Derive section-specific data from pageData ───────────────────────────
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

  // ── Section Config Rendering Engine ──────────────────────────────────────
  // pageData.sections[] drives which sections appear and in which order.
  // Admin can enable/disable any section from the CMS without code changes.
  //
  // NOTE: 'hero' renders both the hero banner AND hero tiles (visually coupled).
  //       'faqs_gallery' renders FAQs + Gallery in a 2-col grid (same <section>).
  //
  // Full dynamic reordering would require each section to be a named render
  // function fed into a SECTION_RENDERERS map — currently ordered sections are
  // rendered inline below in the JSX. The ordering engine is preserved in the
  // sections data ready for a future render-function refactor.
  //
  // Future API: PUT /api/content/home/sections/reorder

  /** Returns true if this section type is enabled in the CMS config */
  const isSectionEnabled = (type: string): boolean =>
    pageData.sections.some(s => s.type === type && s.enabled)

  return (
    <div className="flex flex-col bg-white">
      {/* SEO — page title, meta tags, OG, canonical (from seoService) */}
      <PageSeo pageKey="home" />

      {/* ══════ HERO + HERO TILES ══════ — enabled/disabled as one unit (visually coupled) */}
      {isSectionEnabled('hero') && (
        <>
          <div className="sticky top-0 w-full h-[320px] sm:h-[400px] md:h-[500px] z-0">
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{
                backgroundImage: hero.imageUrl,
                backgroundPosition: hero.imagePosition,
                filter: 'brightness(0.9) contrast(1.02) saturate(0.95)',
              }}
            />
            {/* Navy overlay — uses palette colour */}
            <div className="absolute inset-0" style={{ backgroundColor: C.navy45 }} />
            <div className="relative z-10 h-full flex items-center justify-center px-4 text-center">
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
          </div>

          {/* ══════ HERO TILES — all clickable ══════ */}
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
        </>
      )}

      {/* ══════ ABOUT + DIRECTOR + ANNOUNCEMENTS ══════ */}
      {isSectionEnabled('about') && <section
        className="bg-white py-10 md:py-14 relative z-10"
        style={{ borderBottom: `1px solid ${C.navy10}` }}
      >
        <div className="max-w-[1400px] mx-auto px-4 lg:px-12 grid grid-cols-1 lg:grid-cols-3 gap-10">

          {/* Left — About & Director */}
          <div className="lg:col-span-2 flex flex-col space-y-12">

            {/* About */}
            <div>
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
                <Link
                  to={about.primaryButton.to}
                  className="px-4 py-2 text-xs font-semibold border rounded transition-colors hover:opacity-80"
                  style={{ borderColor: C.navy15, color: C.navy, backgroundColor: C.white }}
                >
                  {about.primaryButton.label}
                </Link>
                <Link
                  to={about.secondaryButton.to}
                  className="px-4 py-2 text-xs font-semibold rounded shadow-sm transition-opacity hover:opacity-90"
                  style={{ backgroundColor: C.navy, color: C.white }}
                >
                  {about.secondaryButton.label}
                </Link>
              </div>
            </div>

            {/* Director's Corner */}
            <div
              className="bg-white p-6 lg:p-7 rounded shadow-sm relative border"
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
                    src={director.photo}
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
                  <Link
                    to={director.readMoreTo}
                    className="px-3.5 py-1.5 border rounded inline-block text-xs font-semibold font-sans transition-colors hover:opacity-80"
                    style={{ borderColor: C.navy15, color: C.navy, backgroundColor: C.white }}
                  >
                    {director.readMoreLabel}
                  </Link>
                </div>
              </div>
            </div>
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
                  {/* Heading — from uiLabelsService (homepage.announcementsHeading) */}
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
                  {/* Badge — from uiLabelsService (homepage.announcementsBadge) */}
                  {labels.homepage.announcementsBadge}
                </span>
              </div>

              {/* List — every item links to the notice's target */}
              <div className="p-0 flex-1 overflow-y-auto max-h-[500px]">
                <ul className="divide-y" style={{ borderColor: C.navy10 }}>
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
                                // "New" badge — gold palette only, no red
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
              </div>

              {/* Footer */}
              <div
                className="p-4 bg-white flex justify-center mt-auto border-t"
                style={{ borderColor: C.navy10 }}
              >
                {/* "View All Notices" — from uiLabelsService (homepage.viewAllNoticesLabel) */}
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
      }

      {/* ══════ CAMPUS NEWS ══════ */}
      {isSectionEnabled('news') && <section
        className="bg-white py-16 relative z-10"
        style={{ borderBottom: `1px solid ${C.navy10}` }}
      >
        <div className="max-w-[1400px] mx-auto px-4 lg:px-12">
          <div className="text-center mb-12">
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

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">

            {/* First featured card */}
            {featuredCards[0] && (
              <Link
                to={featuredCards[0].to}
                className="md:col-span-2 relative overflow-hidden rounded flex flex-col justify-end min-h-[380px] group border"
                style={{ borderColor: C.navy15, backgroundColor: C.white }}
              >
                <img
                  src={featuredCards[0].imageUrl}
                  alt="Research at SGSITS"
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  style={{ filter: 'saturate(0.85) contrast(1.02)' }}
                />
                {/* Gradient using palette navy */}
                <div
                  className="absolute inset-0"
                  style={{ background: `linear-gradient(to top, ${C.navy} 0%, rgba(11,37,69,0.4) 60%, transparent 100%)` }}
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
                    src={card.imageUrl}
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
                  src={featuredCards[1].imageUrl}
                  alt="Engineering Laboratory"
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  style={{ filter: 'saturate(0.85) contrast(1.02)' }}
                />
                <div
                  className="absolute inset-0"
                  style={{ background: `linear-gradient(to top, ${C.navy} 0%, rgba(11,37,69,0.4) 60%, transparent 100%)` }}
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
        </div>
      </section>
      }

      {/* ══════ ACADEMIC PROGRAMS ══════ */}
      {isSectionEnabled('academics') && <section
        className="bg-white py-14 relative z-10"
        style={{ borderBottom: `1px solid ${C.navy10}` }}
      >
        <div className="max-w-[1400px] mx-auto px-4 lg:px-12">
          <div className="text-center mb-12">
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

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {academicsSection.programs.map((prog) => {
              const Icon = ICON_MAP[prog.iconName] ?? BookOpen
              return (
                <div
                  key={prog.id}
                  className="p-6 bg-white rounded flex flex-col group hover:shadow-md transition-all duration-200 border"
                  style={{ borderColor: C.navy15 }}
                >
                  {/* Icon box — navy bg on hover */}
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
                    to={prog.to}
                    className="font-bold text-[11px] uppercase tracking-wider mt-auto flex items-center hover:underline"
                    style={{ color: C.navy }}
                  >
                    {prog.ctaLabel} <ChevronRight size={12} className="ml-1" />
                  </Link>
                </div>
              )
            })}
          </div>
        </div>
      </section>
      }

      {/* ══════ DEPARTMENTS ══════ */}
      {isSectionEnabled('departments') && <section
        className="py-16 bg-white relative z-10"
        style={{ borderBottom: `1px solid ${C.navy10}` }}
      >
        <div className="max-w-[1400px] mx-auto px-4 lg:px-12">
          <div
            className="flex justify-between items-end mb-10 pb-4 border-b"
            style={{ borderColor: C.navy10 }}
          >
            <div>
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
            {/* "View All Departments →" — from uiLabelsService (homepage.viewAllDepartmentsLabel) */}
            <Link
              to={departmentsSection.showAllLink}
              className="font-semibold hover:underline text-xs tracking-wider uppercase hidden md:block"
              style={{ color: C.navy }}
            >
              {labels.homepage.viewAllDepartmentsLabel}
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {departmentsSection.items.map((dept, idx) => (
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
        </div>
      </section>
      }

      {/* ══════ STATS BANNER (parallax) ══════ */}
      {isSectionEnabled('stats') && <section className="relative z-10 overflow-hidden" style={{ height: '280px' }}>
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
        {/* Navy tint overlay */}
        <div className="absolute inset-0" style={{ backgroundColor: C.navy55 }} />

        <div className="relative z-10 h-full flex items-center justify-center">
          <div className="max-w-[1400px] w-full mx-auto px-4 lg:px-12">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-0 text-center">
              {statsSection.items.map((s, i, arr) => (
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
      }

      {/* ══════ CAMPUS LIFE ══════ */}
      {isSectionEnabled('campus_life') && <section className="py-16 bg-white relative z-10">
        <div className="max-w-[1400px] mx-auto px-4 lg:px-12">
          <div className="text-center mb-12">
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

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {campusLifeSection.facilities.map((facility) => {
              const FacIcon = ICON_MAP[facility.iconName] ?? Building
              return (
                <Link
                  key={facility.id}
                  to={facility.to}
                  className="bg-white rounded overflow-hidden group hover:shadow-md transition-all duration-200 flex flex-col border"
                  style={{ borderColor: C.navy15 }}
                >
                  <div
                    className="h-48 overflow-hidden relative border-b"
                    style={{ borderColor: C.navy10 }}
                  >
                    <img
                      src={facility.imageUrl}
                      alt={facility.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    {/* Subtle navy overlay that fades on hover */}
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
                      {/* Icon uses gold accent */}
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
        </div>
      </section>
      }

      {/* ══════ FAQs + GALLERY ══════ */}
      {isSectionEnabled('faqs_gallery') && <section
        className="relative z-10"
        style={{ backgroundColor: C.white, borderTop: `1px solid ${C.navy10}` }}
      >
        <div className="max-w-[1400px] mx-auto px-4 lg:px-12 py-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">

            {/* LEFT — FAQs */}
            <div>
              <div className="flex items-center gap-3 mb-1">
                <h2
                  className="text-xl md:text-2xl font-display font-bold uppercase tracking-tight"
                  style={{ color: C.navy }}
                >
                  {faqsSection.heading}
                </h2>
                {/* "View all" FAQs — from uiLabelsService (homepage.viewAllFaqsLabel) */}
                <Link
                  to={faqsSection.viewAllLink}
                  className="text-xs font-bold border rounded px-2 py-0.5 hover:opacity-80 transition-opacity"
                  style={{ borderColor: C.navy, color: C.navy }}
                >
                  {labels.homepage.viewAllFaqsLabel}
                </Link>
              </div>
              <p
                className="text-[10px] uppercase font-bold tracking-widest mb-1"
                style={{ color: C.gold }}
              >
                {faqsSection.subLabel}
              </p>
              <div className="w-8 h-[2px] mb-6" style={{ backgroundColor: C.gold }} />

              <div>
                {faqsSection.items.map((faq: FaqItemData) => (
                  <FaqItem
                    key={faq.id}
                    question={faq.question}
                    answer={faq.answer}
                    contact={faq.contact}
                    defaultOpen={faq.defaultOpen}
                  />
                ))}
              </div>
            </div>

            {/* RIGHT — Photo Gallery */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-3">
                  <h2
                    className="text-xl md:text-2xl font-display font-bold uppercase tracking-tight"
                    style={{ color: C.navy }}
                  >
                    {gallerySection.heading}{' '}
                    <span style={{ color: C.gold }}>{gallerySection.accentText}</span>
                  </h2>
                </div>
                {/* "View All" Gallery — from uiLabelsService (homepage.viewAllGalleryLabel) */}
                <Link
                  to={gallerySection.viewAllLink}
                  className="text-xs font-bold border rounded px-2 py-0.5 hover:opacity-80 transition-opacity"
                  style={{ borderColor: C.navy, color: C.navy }}
                >
                  {labels.homepage.viewAllGalleryLabel}
                </Link>
              </div>
              <p
                className="text-[10px] uppercase font-bold tracking-widest mb-1"
                style={{ color: C.gold }}
              >
                {gallerySection.subLabel}
              </p>
              <div className="w-8 h-[2px] mb-6" style={{ backgroundColor: C.gold }} />

              <div className="grid grid-cols-4 gap-1.5">
                {thumbnails.map((thumb, idx) => (
                  // Each thumbnail is now a real Link
                  <Link
                    key={idx}
                    to={thumb.to}
                    className="aspect-square overflow-hidden rounded-sm group block"
                    style={{ border: `1px solid ${C.navy10}` }}
                  >
                    <img
                      src={thumb.imageUrl}
                      alt={thumb.alt}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  </Link>
                ))}
              </div>
            </div>

          </div>
        </div>
      </section>
      }
    </div>
  )
}

export default Home
