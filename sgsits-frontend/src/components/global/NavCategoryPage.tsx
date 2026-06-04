/**
 * NavCategoryPage — University category landing page
 * Cards cycle through 3 brand themes: navy · gold · white
 * Each at 10-15% opacity tint.
 */

import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Search, ChevronRight, Home } from 'lucide-react'
import { SkeletonNavGrid } from '../ui/Skeleton'

export interface NavCard {
  icon: React.ReactNode
  title: string
  description: string
  path: string
  badge?: string
}

export interface NavCategoryPageProps {
  heroTitle: string
  heroSubtitle: string
  sectionLabel?: string
  breadcrumbs: { label: string; path?: string }[]
  cards: NavCard[]
}

// ── 3-theme brand cycle — uses CSS variables so admin theme changes apply live ─
const THEMES = [
  {
    bg:     'rgba(var(--color-primary-rgb), 0.08)',
    border: 'rgba(var(--color-primary-rgb), 0.19)',
    iconBg: 'rgba(var(--color-primary-rgb), 0.13)',
    color:  'var(--color-primary)',
  },
  {
    bg:     'rgba(var(--color-accent-rgb), 0.08)',
    border: 'rgba(var(--color-accent-rgb), 0.21)',
    iconBg: 'rgba(var(--color-accent-rgb), 0.13)',
    color:  'var(--color-accent)',
  },
  {
    bg:     '#ffffff',
    border: 'rgba(var(--color-primary-rgb), 0.13)',
    iconBg: 'rgba(var(--color-primary-rgb), 0.06)',
    color:  'var(--color-primary)',
  },
]

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] } },
}
const stagger = {
  hidden: {},
  show:   { transition: { staggerChildren: 0.055 } },
}

const NavCategoryPage: React.FC<NavCategoryPageProps> = ({
  heroTitle, heroSubtitle, sectionLabel, breadcrumbs, cards,
}) => {
  const [query, setQuery]   = useState('')
  const [ready, setReady]   = useState(false)

  // Brief skeleton while the component/chunk mounts after lazy-loading
  useEffect(() => {
    const t = setTimeout(() => setReady(true), 350)
    return () => clearTimeout(t)
  }, [])

  if (!ready) return <SkeletonNavGrid count={cards.length || 8} />

  const filtered = cards.filter(
    (c) =>
      c.title.toLowerCase().includes(query.toLowerCase()) ||
      c.description.toLowerCase().includes(query.toLowerCase())
  )

  return (
    <div className="max-w-[1400px] mx-auto px-4 lg:px-12 py-8">

      {/* ── Page Header ─────────────────────────────────────────────────── */}
      <motion.div className="border-b border-slate-200 pb-6 mb-8" initial="hidden" animate="show" variants={stagger}>
        <motion.nav variants={fadeUp} className="flex items-center gap-1 text-xs text-slate-400 font-medium mb-4 flex-wrap" aria-label="Breadcrumb">
          <Link to="/" className="flex items-center gap-1 hover:text-slate-600 transition-colors">
            <Home className="w-3 h-3" />Home
          </Link>
          {breadcrumbs.map((crumb, i) => (
            <React.Fragment key={i}>
              <ChevronRight className="w-3 h-3 text-slate-300" />
              {crumb.path && i < breadcrumbs.length - 1
                ? <Link to={crumb.path} className="hover:text-slate-600 transition-colors">{crumb.label}</Link>
                : <span className="text-slate-600">{crumb.label}</span>
              }
            </React.Fragment>
          ))}
        </motion.nav>
        <motion.span variants={fadeUp} className="text-xs uppercase font-bold tracking-widest text-accent block mb-1.5">
          {sectionLabel ?? 'SGSITS Portal'}
        </motion.span>
        <motion.h1 variants={fadeUp} className="text-2xl md:text-3xl font-display font-bold text-primary">{heroTitle}</motion.h1>
        <motion.p variants={fadeUp} className="text-sm text-slate-500 mt-1.5 font-medium max-w-2xl">{heroSubtitle}</motion.p>
      </motion.div>

      {/* ── Search ──────────────────────────────────────────────────────── */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.15 }} className="relative max-w-sm mb-8">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 pointer-events-none" />
        <input
          type="text" value={query} onChange={(e) => setQuery(e.target.value)}
          placeholder="Search sections…"
          className="w-full pl-9 pr-9 py-2.5 text-sm rounded border border-slate-200 bg-white text-slate-800 placeholder-slate-400 focus:outline-none focus:border-primary/40 focus:ring-1 focus:ring-primary/10 transition-all"
        />
        {query && (
          <button onClick={() => setQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs font-bold">✕</button>
        )}
      </motion.div>

      {filtered.length === 0 && (
        <div className="text-center py-16 text-slate-400">
          <Search className="w-8 h-8 mx-auto mb-2 opacity-30" />
          <p className="text-sm font-medium">No sections match "<span className="text-slate-600">{query}</span>"</p>
          <button onClick={() => setQuery('')} className="mt-2 text-xs font-semibold text-primary underline">Clear search</button>
        </div>
      )}

      {/* ── Cards ───────────────────────────────────────────────────────── */}
      <motion.div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4" variants={stagger} initial="hidden" animate="show">
        {filtered.map((card, idx) => {
          const theme = THEMES[idx % THEMES.length]
          return (
            <motion.div key={card.path} variants={fadeUp}>
              <Link
                to={card.path}
                className="rounded border p-5 hover:shadow-md transition-all duration-200 group flex flex-col h-full focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/30"
                style={{ background: theme.bg, borderColor: theme.border }}
              >
                {card.badge && (
                  <span className="self-start mb-3 text-xs font-bold px-1.5 py-0.5 rounded border uppercase tracking-wider"
                    style={{ background: theme.iconBg, color: theme.color, borderColor: theme.border }}>
                    {card.badge}
                  </span>
                )}
                <div
                  className="w-9 h-9 rounded-lg flex items-center justify-center mb-3 shrink-0 transition-transform duration-200 group-hover:scale-110"
                  style={{ background: theme.iconBg, border: `1px solid ${theme.border}` }}
                >
                  <span style={{ color: theme.color }}>{card.icon}</span>
                </div>
                <h3 className="font-bold text-sm text-primary leading-snug mb-1.5">{card.title}</h3>
                <p className="text-xs text-slate-600 font-medium leading-relaxed flex-1">{card.description}</p>
                <div className="mt-3 pt-3 flex justify-end" style={{ borderTop: `1px solid ${theme.border}` }}>
                  <ChevronRight className="w-4 h-4 opacity-50 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" style={{ color: theme.color }} />
                </div>
              </Link>
            </motion.div>
          )
        })}
      </motion.div>
    </div>
  )
}

export default NavCategoryPage
