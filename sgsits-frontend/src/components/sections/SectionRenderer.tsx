/**
 * SectionRenderer — renders a PageSection from the CMS dynamically.
 *
 * section_type handlers:
 *   hero         → Page header with breadcrumb, title, subtitle, CTA buttons
 *   nav_children → Card grid auto-pulled from navigation.nav_tree children
 *   dynamic_data → Live stat counters from /api/v1/page-sections/live-stats
 *   stats        → Static stat grid from settings_json.items
 *   cards        → Manual card grid from settings_json.cards
 *   links        → Simple link list from settings_json.links
 *   cta          → Call-to-action band with link buttons
 *   html         → Rich HTML block (content field)
 *   announcements→ Placeholder (handled by parent page with live data)
 *   featured     → Text + aside card layout
 */

import React, { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, useInView } from 'framer-motion'
import { ChevronRight, Home, ArrowRight, ExternalLink } from 'lucide-react'
import { getNavItems, type NavItem } from '../../services/navService'
import { getLiveStats, type LiveStats, type PageSection } from '../../services/pageSectionsService'

// ── Brand theme cycle ─────────────────────────────────────────────────────────

const THEMES = [
  { bg: 'rgba(var(--color-primary-rgb),0.08)', border: 'rgba(var(--color-primary-rgb),0.19)', iconBg: 'rgba(var(--color-primary-rgb),0.13)', color: 'var(--color-primary)' },
  { bg: 'rgba(var(--color-accent-rgb),0.08)',  border: 'rgba(var(--color-accent-rgb),0.21)',  iconBg: 'rgba(var(--color-accent-rgb),0.13)',  color: 'var(--color-accent)'  },
  { bg: '#ffffff', border: 'rgba(var(--color-primary-rgb),0.13)', iconBg: 'rgba(var(--color-primary-rgb),0.06)', color: 'var(--color-primary)' },
]

const fadeUp = { hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] } } }
const stagger = (d = 0.055) => ({ hidden: {}, show: { transition: { staggerChildren: d } } })

// ── Counter animation hook ────────────────────────────────────────────────────

function useCountUp(end: number, inView: boolean, duration = 1.4) {
  const [v, setV] = useState(0)
  useEffect(() => {
    if (!inView || end === 0) return
    const s = performance.now()
    const tick = (now: number) => {
      const t = Math.min((now - s) / (duration * 1000), 1)
      setV(Math.floor((1 - Math.pow(1 - t, 3)) * end))
      if (t < 1) requestAnimationFrame(tick)
      else setV(end)
    }
    requestAnimationFrame(tick)
  }, [inView, end, duration])
  return v
}

// ── Section: Hero ─────────────────────────────────────────────────────────────

function HeroSection({ section }: { section: PageSection }) {
  const s = section.settings_json ?? {}
  const breadcrumbs: { label: string; path?: string }[] = s.breadcrumbs ?? []
  const primaryCta:  { label: string; path?: string; anchor?: string } | null = s.primaryCta ?? null
  const secondaryCta:{ label: string; path?: string } | null = s.secondaryCta ?? null

  return (
    <motion.div
      className="max-w-[1400px] mx-auto px-4 lg:px-12 pt-8 pb-6 border-b border-slate-200"
      initial="hidden" animate="show" variants={stagger(0.08)}
    >
      <motion.nav variants={fadeUp} className="flex items-center gap-1 text-xs text-slate-400 font-medium mb-4 flex-wrap">
        <Link to="/" className="flex items-center gap-1 hover:text-slate-600 transition-colors">
          <Home className="w-3 h-3" /> Home
        </Link>
        {breadcrumbs.map((crumb, i) => (
          <React.Fragment key={i}>
            <ChevronRight className="w-3 h-3 text-slate-300" />
            {crumb.path && i < breadcrumbs.length - 1
              ? <Link to={crumb.path} className="hover:text-slate-600 transition-colors">{crumb.label}</Link>
              : <span className="text-slate-600">{crumb.label}</span>}
          </React.Fragment>
        ))}
      </motion.nav>

      {section.title && (
        <motion.h1 variants={fadeUp} className="text-2xl md:text-3xl font-display font-bold text-primary">
          {section.title}
        </motion.h1>
      )}
      {section.subtitle && (
        <motion.p variants={fadeUp} className="text-sm text-slate-500 mt-1.5 font-medium max-w-2xl">
          {section.subtitle}
        </motion.p>
      )}

      {(primaryCta || secondaryCta) && (
        <motion.div variants={fadeUp} className="mt-5 flex flex-wrap gap-3">
          {primaryCta && (
            primaryCta.anchor
              ? <a href={primaryCta.anchor} className="inline-flex items-center gap-1.5 px-4 py-2 rounded text-sm font-semibold text-white bg-primary hover:bg-primary/90 transition-colors">
                  {primaryCta.label} <ChevronRight className="w-3.5 h-3.5" />
                </a>
              : <Link to={primaryCta.path ?? '#'} className="inline-flex items-center gap-1.5 px-4 py-2 rounded text-sm font-semibold text-white bg-primary hover:bg-primary/90 transition-colors">
                  {primaryCta.label} <ChevronRight className="w-3.5 h-3.5" />
                </Link>
          )}
          {secondaryCta && (
            <Link to={secondaryCta.path ?? '#'} className="inline-flex items-center gap-1.5 px-4 py-2 rounded text-sm font-semibold text-primary border border-slate-200 hover:border-primary/40 hover:bg-slate-50 transition-all">
              {secondaryCta.label} <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          )}
        </motion.div>
      )}
    </motion.div>
  )
}

// ── Section: Dynamic stat counters ────────────────────────────────────────────

interface StatItem { label: string; metric: keyof LiveStats; suffix?: string }

function StatCounter({ item, stats, inView }: { item: StatItem; stats: LiveStats; inView: boolean; idx: number }) {
  const raw = stats[item.metric] ?? 0
  const count = useCountUp(raw, inView)
  const t = THEMES[0]
  return (
    <div className="rounded border p-4 text-center shadow-sm" style={{ background: t.bg, borderColor: t.border }}>
      <p className="text-2xl font-display font-bold" style={{ color: t.color }}>
        {count}{item.suffix ?? '+'}
      </p>
      <p className="text-xs text-slate-600 font-bold uppercase tracking-wider mt-1">{item.label}</p>
    </div>
  )
}

function DynamicDataSection({ section }: { section: PageSection }) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })
  const [stats, setStats] = useState<LiveStats | null>(null)
  const items: StatItem[] = section.settings_json?.items ?? []

  useEffect(() => { getLiveStats().then(setStats) }, [])

  if (!stats || items.length === 0) return null

  return (
    <div className="max-w-[1400px] mx-auto px-4 lg:px-12 py-8" ref={ref}>
      {section.title && (
        <h2 className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-5">{section.title}</h2>
      )}
      <div className={`grid gap-4 grid-cols-2 sm:grid-cols-${Math.min(items.length, 4)}`}>
        {items.map((item, idx) => (
          <StatCounter key={item.label} item={item} stats={stats} inView={inView} idx={idx} />
        ))}
      </div>
    </div>
  )
}

// ── Section: Nav children card grid ──────────────────────────────────────────

function NavChildrenSection({ section }: { section: PageSection }) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })
  const [cards, setCards] = useState<{ title: string; desc: string; path: string }[]>([])
  const [ready, setReady] = useState(false)

  const s = section.settings_json ?? {}
  const navLabel: string = s.navLabel ?? ''
  const descs: Record<string, string> = s.descriptions ?? {}

  useEffect(() => {
    getNavItems().then(tree => {
      const parent = tree.find((n: NavItem) => n.label === navLabel)
      const children = parent?.children ?? []
      setCards(children.map((c: NavItem) => ({
        title: c.label,
        desc:  descs[c.label] ?? '',
        path:  c.path ?? c.url ?? '#',
      })))
      setReady(true)
    })
  }, [navLabel])

  return (
    <div id="sections" className="bg-brand-light py-10 px-4 lg:px-12" ref={ref}>
      <div className="max-w-[1400px] mx-auto">
        {section.title && (
          <div className="flex items-center gap-3 mb-6">
            <h2 className="text-sm font-bold text-slate-500 uppercase tracking-widest whitespace-nowrap">{section.title}</h2>
            <div className="flex-grow h-px bg-slate-200" />
          </div>
        )}
        {!ready ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="rounded border border-slate-200 bg-white p-5 h-32 animate-pulse" />
            ))}
          </div>
        ) : (
          <motion.div
            className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
            variants={stagger()} initial="hidden" animate={inView ? 'show' : 'hidden'}
          >
            {cards.map((card, idx) => {
              const t = THEMES[idx % THEMES.length]
              return (
                <motion.div key={card.path} variants={fadeUp}>
                  <Link
                    to={card.path}
                    className="rounded border p-5 hover:shadow-md transition-all duration-200 group flex flex-col h-full"
                    style={{ background: t.bg, borderColor: t.border }}
                  >
                    <h3 className="font-bold text-sm text-primary leading-snug mb-1.5">{card.title}</h3>
                    {card.desc && (
                      <p className="text-xs text-slate-600 font-medium leading-relaxed flex-1">{card.desc}</p>
                    )}
                    <div className="mt-3 pt-3 flex justify-end" style={{ borderTop: `1px solid ${t.border}` }}>
                      <ChevronRight className="w-4 h-4 opacity-50 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" style={{ color: t.color }} />
                    </div>
                  </Link>
                </motion.div>
              )
            })}
          </motion.div>
        )}
      </div>
    </div>
  )
}

// ── Section: CTA band ─────────────────────────────────────────────────────────

function CtaSection({ section }: { section: PageSection }) {
  const links: { label: string; path: string }[] = section.settings_json?.links ?? []
  return (
    <div className="bg-primary/5 border-y border-primary/10 py-8 px-4 lg:px-12">
      <div className="max-w-[1400px] mx-auto flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-8">
        <div className="flex-1">
          {section.title && <h3 className="font-display font-bold text-primary text-base">{section.title}</h3>}
          {section.subtitle && <p className="text-sm text-slate-500 mt-0.5">{section.subtitle}</p>}
        </div>
        <div className="flex flex-wrap gap-2 shrink-0">
          {links.map(link => (
            <Link key={link.path} to={link.path}
              className="inline-flex items-center gap-1 px-4 py-2 rounded text-sm font-semibold text-primary border border-primary/20 hover:bg-primary hover:text-white hover:border-primary transition-all">
              {link.label} <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}

// ── Section: Links list ───────────────────────────────────────────────────────

function LinksSection({ section }: { section: PageSection }) {
  const links: { label: string; path: string; external?: boolean }[] = section.settings_json?.links ?? []
  return (
    <div className="max-w-[1400px] mx-auto px-4 lg:px-12 py-8">
      {section.title && <h2 className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-4">{section.title}</h2>}
      <ul className="space-y-2">
        {links.map(link => (
          <li key={link.path}>
            {link.external
              ? <a href={link.path} target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-2 text-sm font-medium text-primary hover:underline">
                  <ExternalLink className="w-3.5 h-3.5 text-accent shrink-0" /> {link.label}
                </a>
              : <Link to={link.path} className="flex items-center gap-2 text-sm font-medium text-primary hover:underline">
                  <ChevronRight className="w-3.5 h-3.5 text-accent shrink-0" /> {link.label}
                </Link>
            }
          </li>
        ))}
      </ul>
    </div>
  )
}

// ── Section: HTML content ─────────────────────────────────────────────────────

function HtmlSection({ section }: { section: PageSection }) {
  if (!section.content && !section.title && !section.subtitle) return null
  return (
    <div className="max-w-[1400px] mx-auto px-4 lg:px-12 py-8">
      {section.title && <h2 className="font-display text-xl font-bold text-primary mb-2">{section.title}</h2>}
      {section.subtitle && <p className="text-sm text-slate-500 mb-4">{section.subtitle}</p>}
      {section.content && (
        <div
          className="prose prose-sm max-w-none text-slate-600"
          dangerouslySetInnerHTML={{ __html: section.content }}
        />
      )}
    </div>
  )
}

// ── Section: Manual cards ─────────────────────────────────────────────────────

function CardsSection({ section }: { section: PageSection }) {
  const cards: { title: string; desc: string; path: string; badge?: string }[] =
    section.settings_json?.cards ?? []
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })

  if (cards.length === 0) return null

  return (
    <div className="py-10 px-4 lg:px-12" ref={ref}>
      <div className="max-w-[1400px] mx-auto">
        {section.title && (
          <div className="flex items-center gap-3 mb-6">
            <h2 className="text-sm font-bold text-slate-500 uppercase tracking-widest">{section.title}</h2>
            <div className="flex-grow h-px bg-slate-200" />
          </div>
        )}
        <motion.div
          className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
          variants={stagger()} initial="hidden" animate={inView ? 'show' : 'hidden'}
        >
          {cards.map((card, idx) => {
            const t = THEMES[idx % THEMES.length]
            return (
              <motion.div key={card.path ?? idx} variants={fadeUp}>
                <Link to={card.path ?? '#'}
                  className="rounded border p-5 hover:shadow-md transition-all group flex flex-col h-full"
                  style={{ background: t.bg, borderColor: t.border }}>
                  {card.badge && (
                    <span className="self-start mb-2 text-xs font-bold px-1.5 py-0.5 rounded border uppercase tracking-wider"
                      style={{ background: t.iconBg, color: t.color, borderColor: t.border }}>{card.badge}</span>
                  )}
                  <h3 className="font-bold text-sm text-primary mb-1.5">{card.title}</h3>
                  <p className="text-xs text-slate-600 font-medium leading-relaxed flex-1">{card.desc}</p>
                  <div className="mt-3 pt-3 flex justify-end" style={{ borderTop: `1px solid ${t.border}` }}>
                    <ChevronRight className="w-4 h-4 opacity-50 group-hover:opacity-100 transition-all" style={{ color: t.color }} />
                  </div>
                </Link>
              </motion.div>
            )
          })}
        </motion.div>
      </div>
    </div>
  )
}

// ── Main renderer ─────────────────────────────────────────────────────────────

interface SectionRendererProps {
  section: PageSection
}

const SectionRenderer: React.FC<SectionRendererProps> = ({ section }) => {
  if (!section.is_active) return null

  switch (section.section_type) {
    case 'hero':         return <HeroSection section={section} />
    case 'dynamic_data': return <DynamicDataSection section={section} />
    case 'nav_children': return <NavChildrenSection section={section} />
    case 'cta':          return <CtaSection section={section} />
    case 'links':        return <LinksSection section={section} />
    case 'html':         return <HtmlSection section={section} />
    case 'cards':        return <CardsSection section={section} />
    // announcements, gallery, faq, downloads, featured, stats:
    // rendered by parent page component with their own data hooks
    default:             return null
  }
}

export default SectionRenderer

// ── Hook: load page sections ──────────────────────────────────────────────────

export function usePageSections(pageKey: string) {
  const [sections, setSections] = useState<PageSection[]>([])
  const [loading, setLoading]   = useState(true)

  useEffect(() => {
    import('../../services/pageSectionsService')
      .then(m => m.getPageSections(pageKey))
      .then(data => { setSections(data); setLoading(false) })
      .catch(() => setLoading(false))
  }, [pageKey])

  return { sections, loading }
}
