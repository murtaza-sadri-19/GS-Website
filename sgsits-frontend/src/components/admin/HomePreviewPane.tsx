import React, { useState, useEffect, useMemo, useCallback } from 'react'
import {
  X, Monitor, Tablet, Smartphone, RefreshCw, ExternalLink,
  Maximize2, ChevronLeft, ChevronRight, Calendar, Building,
  BookOpen, GraduationCap, Microscope, Users, FileText,
  FlaskConical, Rocket, Newspaper, Landmark,
} from 'lucide-react'
import { usePreviewStore, type PreviewDevice } from '../../store/previewStore'

// ── Colour constants (same as Home.tsx) ───────────────────────────────────────
const C = {
  navy:   '#0b2545',
  gold:   '#bfa15f',
  white:  '#ffffff',
  navy10: 'rgba(11,37,69,0.10)',
  navy15: 'rgba(11,37,69,0.15)',
  navy45: 'rgba(11,37,69,0.45)',
  navy55: 'rgba(11,37,69,0.55)',
  navy60: 'rgba(11,37,69,0.60)',
  navy70: 'rgba(11,37,69,0.70)',
  gold15: 'rgba(191,161,95,0.15)',
  gold20: 'rgba(191,161,95,0.20)',
  gold25: 'rgba(191,161,95,0.25)',
  white60: 'rgba(255,255,255,0.60)',
  white70: 'rgba(255,255,255,0.70)',
  white80: 'rgba(255,255,255,0.80)',
}

const ICON_MAP: Record<string, React.ComponentType<{ size?: number; strokeWidth?: number; style?: React.CSSProperties }>> = {
  FlaskConical, Rocket, Newspaper, Landmark,
  BookOpen, GraduationCap, Microscope, Users, Building, FileText,
}

// ── Device widths ─────────────────────────────────────────────────────────────
const DEVICE_WIDTH: Record<PreviewDevice, string> = {
  desktop: '100%',
  tablet:  '768px',
  mobile:  '375px',
}

// ── Label badge ───────────────────────────────────────────────────────────────
const Label: React.FC<{ text: string }> = ({ text }) => (
  <span className="text-[10px] uppercase font-bold tracking-widest block mb-1" style={{ color: C.gold }}>
    {text}
  </span>
)

// ── Section heading ───────────────────────────────────────────────────────────
const Heading: React.FC<{ text: string; accent?: string; size?: 'sm' | 'lg' }> = ({ text, accent, size = 'lg' }) => (
  <h2
    className={`font-display font-bold tracking-tight uppercase mb-2 ${size === 'lg' ? 'text-2xl md:text-3xl' : 'text-xl'}`}
    style={{ color: C.navy }}
  >
    {text}{' '}
    {accent && <span className="font-serif italic font-semibold">{accent}</span>}
  </h2>
)

// ── Gold divider ──────────────────────────────────────────────────────────────
const Divider: React.FC<{ wide?: boolean }> = ({ wide }) => (
  <div className={`${wide ? 'w-12' : 'w-8'} h-[2px] mb-4`} style={{ backgroundColor: C.gold }} />
)

// ═════════════════════════════════════════════════════════════════════════════
// SECTION RENDERERS
// ═════════════════════════════════════════════════════════════════════════════

// ── Hero ──────────────────────────────────────────────────────────────────────
const HeroSection: React.FC<{ hero: any; heroTiles: any[] }> = ({ hero, heroTiles }) => {
  const [slide, setSlide] = useState(0)

  const images = useMemo(() => {
    const arr = (hero?.images ?? []).filter(Boolean)
    if (arr.length) return arr
    return hero?.imageUrl ? [hero.imageUrl] : []
  }, [hero])

  useEffect(() => { setSlide(0) }, [images.length])

  useEffect(() => {
    if (images.length <= 1) return
    const id = setInterval(() => setSlide(i => (i + 1) % images.length), 5000)
    return () => clearInterval(id)
  }, [images.length])

  const enabledTiles = (heroTiles ?? []).filter((t: any) => t.enabled !== false).slice(0, 4)

  return (
    <div>
      {/* Hero image */}
      <div className="relative w-full h-[280px] overflow-hidden" style={{ backgroundColor: C.navy }}>
        {images.map((url: string, i: number) => (
          <div
            key={i}
            className="absolute inset-0 bg-cover bg-center transition-opacity duration-1000"
            style={{
              backgroundImage: `url(${url})`,
              backgroundPosition: hero?.imagePosition || 'center',
              filter: 'brightness(0.9)',
              opacity: i === slide ? 1 : 0,
            }}
          />
        ))}
        <div className="absolute inset-0" style={{ backgroundColor: C.navy45 }} />

        {/* Slider controls */}
        {images.length > 1 && (
          <>
            <button
              onClick={() => setSlide(i => (i - 1 + images.length) % images.length)}
              className="absolute left-3 top-1/2 -translate-y-1/2 z-10 w-7 h-7 flex items-center justify-center rounded-full"
              style={{ backgroundColor: 'rgba(0,0,0,0.3)' }}
            >
              <ChevronLeft size={14} color="#fff" />
            </button>
            <button
              onClick={() => setSlide(i => (i + 1) % images.length)}
              className="absolute right-3 top-1/2 -translate-y-1/2 z-10 w-7 h-7 flex items-center justify-center rounded-full"
              style={{ backgroundColor: 'rgba(0,0,0,0.3)' }}
            >
              <ChevronRight size={14} color="#fff" />
            </button>
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-10 flex gap-1.5">
              {images.map((_: string, i: number) => (
                <button
                  key={i}
                  onClick={() => setSlide(i)}
                  className="rounded-full transition-all"
                  style={{ width: i === slide ? 16 : 6, height: 6, backgroundColor: i === slide ? C.gold : 'rgba(255,255,255,0.5)' }}
                />
              ))}
            </div>
          </>
        )}

        {/* Text */}
        <div className="relative z-[2] h-full flex items-center justify-center px-4 text-center">
          <div className="max-w-xl">
            <p className="uppercase tracking-[0.18em] text-[9px] mb-2 font-semibold" style={{ color: C.white80 }}>
              {hero?.instituteName}
            </p>
            <h1 className="text-white uppercase font-display font-semibold text-xl leading-tight tracking-[0.04em] drop-shadow">
              {hero?.welcomeText}<br />
              <span className="font-bold italic" style={{ color: C.gold }}>{hero?.accentText}</span>
            </h1>
          </div>
        </div>
      </div>

      {/* Hero tiles */}
      {enabledTiles.length > 0 && (
        <div className="relative z-10 mt-[-36px] px-4">
          <div
            className="grid shadow-sm rounded overflow-hidden divide-x"
            style={{
              gridTemplateColumns: `repeat(${Math.min(enabledTiles.length, 4)}, 1fr)`,
              border: `1px solid ${C.navy15}`,
            }}
          >
            {enabledTiles.map((tile: any, i: number) => {
              const Icon = ICON_MAP[tile.iconName] ?? FlaskConical
              return (
                <div
                  key={tile.id || i}
                  className="h-[80px] flex flex-col items-center justify-center text-center px-2 py-3"
                  style={{ backgroundColor: tile.dark ? C.navy : C.white }}
                >
                  <p className="font-bold uppercase text-[8px] tracking-widest mb-1" style={{ color: tile.dark ? C.gold : C.navy }}>
                    {tile.title}
                  </p>
                  <Icon size={16} style={{ color: tile.dark ? C.gold : C.navy }} strokeWidth={1.75} className="mb-1" />
                  <p className="text-[8px] leading-tight max-w-[100px]" style={{ color: tile.dark ? C.white60 : C.navy60 }}>
                    {tile.subtitle}
                  </p>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}

// ── About + Announcements ─────────────────────────────────────────────────────
const AboutSection: React.FC<{ about: any; director: any; announcements: any[] }> = ({ about, director, announcements }) => (
  <section className="py-8 px-4" style={{ borderBottom: `1px solid ${C.navy10}` }}>
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

      {/* Left — About & Director */}
      <div className="lg:col-span-2 space-y-6">

        {/* About */}
        <div>
          <Label text={about?.label ?? 'About'} />
          <Heading text={about?.heading ?? ''} accent={about?.accentText} size="sm" />
          <Divider />
          <p className="text-xs leading-relaxed mb-4 text-justify font-sans" style={{ color: C.navy70 }}>
            {about?.body}
          </p>
          <div className="flex gap-2">
            {about?.primaryButton?.label && (
              <span className="px-3 py-1.5 text-[10px] font-semibold border rounded" style={{ borderColor: C.navy15, color: C.navy }}>
                {about.primaryButton.label}
              </span>
            )}
            {about?.secondaryButton?.label && (
              <span className="px-3 py-1.5 text-[10px] font-semibold rounded" style={{ backgroundColor: C.navy, color: C.white }}>
                {about.secondaryButton.label}
              </span>
            )}
          </div>
        </div>

        {/* Director */}
        {director?.name && (
          <div className="p-4 rounded shadow-sm border" style={{ borderColor: C.navy15 }}>
            <Label text={director?.label ?? 'Director'} />
            <Heading text={director?.heading ?? ''} accent={director?.accentText} size="sm" />
            <Divider />
            <div className="flex gap-4 items-start">
              {director?.photo && (
                <div className="w-20 h-24 shrink-0 rounded overflow-hidden border" style={{ borderColor: C.navy15 }}>
                  <img src={director.photo} alt={director.name} className="w-full h-full object-cover" />
                </div>
              )}
              <div>
                <p className="font-bold text-xs mb-1" style={{ color: C.navy }}>{director?.name}</p>
                <p className="text-[10px] leading-relaxed line-clamp-4" style={{ color: C.navy70 }}>{director?.bio}</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Right — Announcements */}
      <div className="lg:col-span-1">
        <div className="rounded overflow-hidden border shadow-sm h-full" style={{ borderColor: C.navy15 }}>
          <div className="px-3 py-2.5 flex items-center justify-between" style={{ backgroundColor: C.navy }}>
            <h3 className="font-bold text-[11px] tracking-widest uppercase text-white flex items-center">
              <Calendar size={12} className="mr-1.5" style={{ color: C.gold }} />
              Announcements
            </h3>
            <span className="text-[8px] font-bold px-1.5 py-0.5 rounded" style={{ backgroundColor: C.gold25, color: C.gold }}>Live</span>
          </div>
          <div className="overflow-y-auto max-h-[220px] divide-y" style={{ borderColor: C.navy10 }}>
            {(announcements ?? []).slice(0, 8).map((item: any) => (
              <div key={item.id} className="flex p-2.5 gap-2">
                <ChevronRight size={10} className="shrink-0 mt-0.5" style={{ color: C.navy45 }} />
                <div>
                  <p className="text-[10px] font-medium leading-snug" style={{ color: C.navy }}>{item.title}</p>
                  <span className={`text-[8px] font-bold ${item.isNew ? 'text-[#bfa15f]' : ''}`} style={{ color: item.isNew ? C.gold : C.navy45 }}>
                    {item.isNew ? 'New' : item.date}
                  </span>
                </div>
              </div>
            ))}
            {!(announcements ?? []).length && (
              <p className="text-[10px] text-slate-400 p-3 text-center">No announcements</p>
            )}
          </div>
        </div>
      </div>
    </div>
  </section>
)

// ── Stats Banner ──────────────────────────────────────────────────────────────
const StatsSection: React.FC<{ stats: any }> = ({ stats }) => (
  <section className="relative overflow-hidden" style={{ height: 120 }}>
    {stats?.backgroundImage && (
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `url(${stats.backgroundImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          filter: 'brightness(0.45)',
        }}
      />
    )}
    <div className="absolute inset-0" style={{ backgroundColor: C.navy55 }} />
    <div className="relative z-10 h-full flex items-center px-4">
      <div className="grid w-full text-center" style={{ gridTemplateColumns: `repeat(${Math.min((stats?.items ?? []).length, 4)}, 1fr)` }}>
        {(stats?.items ?? []).map((s: any, i: number, arr: any[]) => (
          <div
            key={s.label}
            className="px-2 py-2"
            style={{ borderRight: i < arr.length - 1 ? '1px solid rgba(255,255,255,0.12)' : 'none' }}
          >
            <div className="text-xl font-display font-extrabold" style={{ color: C.gold }}>{s.val}</div>
            <div className="text-[8px] font-bold uppercase tracking-wider mt-0.5" style={{ color: C.white70 }}>{s.label}</div>
          </div>
        ))}
      </div>
    </div>
  </section>
)

// ── Academic Programs ─────────────────────────────────────────────────────────
const AcademicsSection: React.FC<{ section: any }> = ({ section }) => (
  <section className="py-8 px-4" style={{ borderBottom: `1px solid ${C.navy10}` }}>
    <div className="text-center mb-5">
      <Label text={section?.label ?? 'Academics'} />
      <Heading text={section?.heading ?? ''} accent={section?.accentText} />
      <Divider wide />
      <p className="text-xs max-w-sm mx-auto" style={{ color: C.navy60 }}>{section?.description}</p>
    </div>
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      {(section?.programs ?? []).slice(0, 3).map((prog: any) => {
        const Icon = ICON_MAP[prog.iconName] ?? BookOpen
        return (
          <div key={prog.id} className="p-4 rounded border flex flex-col" style={{ borderColor: C.navy15 }}>
            <div className="w-8 h-8 flex items-center justify-center rounded mb-3 border" style={{ borderColor: C.navy15, color: C.navy }}>
              <Icon size={16} strokeWidth={1.5} />
            </div>
            <h3 className="text-sm font-display font-bold mb-1.5" style={{ color: C.navy }}>{prog.title}</h3>
            <p className="text-[10px] leading-relaxed line-clamp-3 mb-3" style={{ color: C.navy60 }}>{prog.description}</p>
            <p className="text-[9px] font-bold uppercase tracking-wider mt-auto" style={{ color: C.navy }}>
              {prog.ctaLabel} →
            </p>
          </div>
        )
      })}
    </div>
  </section>
)

// ── Departments ───────────────────────────────────────────────────────────────
const DepartmentsSection: React.FC<{ section: any }> = ({ section }) => (
  <section className="py-8 px-4" style={{ borderBottom: `1px solid ${C.navy10}` }}>
    <div className="flex items-end justify-between mb-5 pb-3 border-b" style={{ borderColor: C.navy10 }}>
      <div>
        <Label text={section?.label ?? 'Departments'} />
        <Heading text={section?.heading ?? ''} accent={section?.accentText} size="sm" />
      </div>
      <span className="text-[9px] font-semibold hidden md:block" style={{ color: C.navy }}>View All →</span>
    </div>
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2">
      {(section?.items ?? []).slice(0, 8).map((dept: any, idx: number) => (
        <div
          key={idx}
          className="p-2 rounded flex items-center border"
          style={{ borderColor: C.navy15 }}
        >
          <div className="w-6 h-6 rounded flex items-center justify-center mr-2 border shrink-0" style={{ borderColor: C.navy15, color: C.navy }}>
            <Building size={10} />
          </div>
          <span className="text-[9px] font-semibold" style={{ color: C.navy }}>{dept.name}</span>
        </div>
      ))}
    </div>
  </section>
)

// ── Campus Life ───────────────────────────────────────────────────────────────
const CampusLifeSection: React.FC<{ section: any }> = ({ section }) => (
  <section className="py-8 px-4" style={{ borderBottom: `1px solid ${C.navy10}` }}>
    <div className="text-center mb-5">
      <Label text={section?.label ?? 'Campus Life'} />
      <Heading text={section?.heading ?? ''} accent={section?.accentText} />
      <Divider wide />
      <p className="text-xs max-w-sm mx-auto" style={{ color: C.navy60 }}>{section?.description}</p>
    </div>
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      {(section?.facilities ?? []).slice(0, 3).map((fac: any) => {
        const Icon = ICON_MAP[fac.iconName] ?? Building
        return (
          <div key={fac.id} className="rounded overflow-hidden border flex flex-col" style={{ borderColor: C.navy15 }}>
            {fac.imageUrl && (
              <div className="h-28 overflow-hidden border-b" style={{ borderColor: C.navy10 }}>
                <img src={fac.imageUrl} alt={fac.title} className="w-full h-full object-cover" />
              </div>
            )}
            <div className="p-3">
              <h3 className="text-xs font-display font-bold mb-1 flex items-center" style={{ color: C.navy }}>
                <Icon size={11} className="mr-1.5 shrink-0" style={{ color: C.gold }} strokeWidth={1.75} />
                {fac.title}
              </h3>
              <p className="text-[9px] leading-relaxed line-clamp-2" style={{ color: C.navy60 }}>{fac.description}</p>
            </div>
          </div>
        )
      })}
    </div>
  </section>
)

// ── FAQs ──────────────────────────────────────────────────────────────────────
const FaqsGallerySection: React.FC<{ faqs: any; gallery: any }> = ({ faqs, gallery }) => (
  <section className="py-8 px-4">
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

      {/* FAQs */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <h2 className="text-base font-display font-bold uppercase" style={{ color: C.navy }}>{faqs?.heading}</h2>
        </div>
        <p className="text-[9px] uppercase font-bold tracking-widest mb-1" style={{ color: C.gold }}>{faqs?.subLabel}</p>
        <div className="w-6 h-[2px] mb-4" style={{ backgroundColor: C.gold }} />
        <div>
          {(faqs?.items ?? []).slice(0, 5).map((faq: any) => (
            <div key={faq.id} className="py-2 border-b" style={{ borderColor: C.navy10 }}>
              <div className="flex items-start gap-2">
                <span className="shrink-0 w-4 h-4 flex items-center justify-center text-white text-[9px] font-bold rounded-sm" style={{ backgroundColor: C.navy }}>+</span>
                <p className="text-[10px] font-semibold" style={{ color: C.navy }}>{faq.question}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Gallery */}
      <div>
        <div className="flex items-center justify-between mb-1">
          <h2 className="text-base font-display font-bold uppercase" style={{ color: C.navy }}>
            {gallery?.heading} <span style={{ color: C.gold }}>{gallery?.accentText}</span>
          </h2>
        </div>
        <p className="text-[9px] uppercase font-bold tracking-widest mb-1" style={{ color: C.gold }}>{gallery?.subLabel}</p>
        <div className="w-6 h-[2px] mb-4" style={{ backgroundColor: C.gold }} />
        <div className="p-8 rounded border border-dashed flex items-center justify-center" style={{ borderColor: C.navy15 }}>
          <p className="text-xs text-slate-400 text-center">Gallery images<br />loaded from media library</p>
        </div>
      </div>
    </div>
  </section>
)

// ═════════════════════════════════════════════════════════════════════════════
// DEVICE FRAME WRAPPER
// ═════════════════════════════════════════════════════════════════════════════
const DeviceFrame: React.FC<{ device: PreviewDevice; children: React.ReactNode }> = ({ device, children }) => {
  const isMobile  = device === 'mobile'
  const isTablet  = device === 'tablet'
  const isDesktop = device === 'desktop'

  if (isDesktop) {
    return <div className="w-full">{children}</div>
  }

  return (
    <div className="flex justify-center py-4 px-4">
      <div
        className={`relative bg-white shadow-2xl overflow-hidden ${isMobile ? 'rounded-[2rem] border-[6px]' : 'rounded-xl border-[4px]'}`}
        style={{
          width: DEVICE_WIDTH[device],
          borderColor: '#1e293b',
          maxWidth: '100%',
        }}
      >
        {/* Device notch / camera bar */}
        <div
          className="w-full flex items-center justify-center py-1.5"
          style={{ backgroundColor: '#0f172a' }}
        >
          <div className="w-16 h-1 rounded-full" style={{ backgroundColor: '#334155' }} />
        </div>
        <div className="overflow-y-auto" style={{ maxHeight: 'calc(100vh - 200px)' }}>
          {children}
        </div>
      </div>
    </div>
  )
}

// ═════════════════════════════════════════════════════════════════════════════
// MAIN PREVIEW PANE
// ═════════════════════════════════════════════════════════════════════════════
interface HomePreviewPaneProps {
  data: any
  onClose: () => void
}

const HomePreviewPane: React.FC<HomePreviewPaneProps> = ({ data, onClose }) => {
  const { device, setDevice } = usePreviewStore()
  const [fullscreen, setFullscreen] = useState(false)

  const openInNewTab = useCallback(() => {
    const key = `sgsits-cms-preview-${Date.now()}`
    try {
      sessionStorage.setItem(key, JSON.stringify(data))
    } catch { /* quota */ }
  }, [data])

  const deviceButtons: { id: PreviewDevice; Icon: typeof Monitor; label: string }[] = [
    { id: 'desktop', Icon: Monitor,    label: 'Desktop (1440px)' },
    { id: 'tablet',  Icon: Tablet,     label: 'Tablet (768px)'  },
    { id: 'mobile',  Icon: Smartphone, label: 'Mobile (375px)'  },
  ]

  if (!data) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center space-y-2">
          <RefreshCw size={24} className="animate-spin text-slate-400 mx-auto" />
          <p className="text-xs text-slate-500">Loading preview…</p>
        </div>
      </div>
    )
  }

  return (
    <div className={`flex flex-col ${fullscreen ? 'fixed inset-0 z-[200] bg-white' : 'h-full'}`}>

      {/* ── Toolbar ── */}
      <div
        className="shrink-0 flex items-center justify-between gap-3 px-4 py-2.5 border-b border-slate-200 bg-slate-50"
        style={{ minHeight: 48 }}
      >
        {/* Left: title */}
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
          <span className="text-xs font-bold text-slate-700 uppercase tracking-widest">Live Preview</span>
        </div>

        {/* Centre: device switcher */}
        <div className="flex items-center gap-1 bg-white border border-slate-200 rounded-lg p-0.5">
          {deviceButtons.map(({ id, Icon, label }) => (
            <button
              key={id}
              onClick={() => setDevice(id)}
              title={label}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-[10px] font-bold uppercase transition-all ${
                device === id
                  ? 'bg-[#0b2545] text-white shadow-sm'
                  : 'text-slate-500 hover:bg-slate-100'
              }`}
            >
              <Icon size={12} />
              <span className="hidden sm:inline">{id}</span>
            </button>
          ))}
        </div>

        {/* Right: actions */}
        <div className="flex items-center gap-1">
          <button
            onClick={() => setFullscreen(f => !f)}
            title={fullscreen ? 'Exit fullscreen' : 'Fullscreen'}
            className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded transition-colors"
          >
            <Maximize2 size={14} />
          </button>
          <button
            onClick={openInNewTab}
            title="Open in new tab"
            className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded transition-colors"
          >
            <ExternalLink size={14} />
          </button>
          <button
            onClick={onClose}
            title="Close preview"
            className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded transition-colors ml-1"
          >
            <X size={14} />
          </button>
        </div>
      </div>

      {/* ── Section tabs ── */}
      <div className="shrink-0 flex gap-1 px-3 py-1.5 overflow-x-auto border-b border-slate-100 bg-slate-50 scrollbar-thin">
        {[
          'Hero', 'About', 'Stats', 'Academics', 'Departments', 'Campus Life', 'FAQs & Gallery',
        ].map((label, i) => (
          <button
            key={label}
            onClick={() => {
              const el = document.getElementById(`preview-section-${i}`)
              el?.scrollIntoView({ behavior: 'smooth', block: 'start' })
            }}
            className="shrink-0 px-2.5 py-1 text-[9px] font-bold uppercase tracking-wide rounded border border-slate-200 bg-white text-slate-600 hover:bg-slate-100 transition-colors"
          >
            {label}
          </button>
        ))}
      </div>

      {/* ── Preview content ── */}
      <div className="flex-1 overflow-y-auto bg-slate-100">
        <DeviceFrame device={device}>
          <div className="bg-white" style={{ fontFamily: 'inherit' }}>

            <div id="preview-section-0">
              <HeroSection hero={data.hero} heroTiles={data.heroTiles} />
            </div>

            <div id="preview-section-1">
              <AboutSection
                about={data.about}
                director={data.director}
                announcements={data.announcements}
              />
            </div>

            <div id="preview-section-2">
              <StatsSection stats={data.statsSection} />
            </div>

            <div id="preview-section-3">
              <AcademicsSection section={data.academicsSection} />
            </div>

            <div id="preview-section-4">
              <DepartmentsSection section={data.departmentsSection} />
            </div>

            <div id="preview-section-5">
              <CampusLifeSection section={data.campusLifeSection} />
            </div>

            <div id="preview-section-6">
              <FaqsGallerySection faqs={data.faqsSection} gallery={data.gallerySection} />
            </div>

          </div>
        </DeviceFrame>
      </div>

      {/* ── Status bar ── */}
      <div className="shrink-0 flex items-center justify-between px-4 py-1.5 bg-slate-800 text-[9px] font-mono text-slate-400">
        <span>UNSAVED DRAFT · Updates every keystroke</span>
        <span className="text-green-400">● LIVE</span>
      </div>
    </div>
  )
}

export default HomePreviewPane
