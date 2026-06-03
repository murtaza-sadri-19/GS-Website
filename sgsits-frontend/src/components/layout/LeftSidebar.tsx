/**
 * LeftSidebar — Section navigation as a stack of individual cards.
 *
 * Desktop: each nav item is its own card (white bg, border, shadow, hover/active states).
 *          Cards are stacked vertically with a small gap. No wrapper card.
 * Mobile:  accordion — a pill shows the current page; tapping expands the full card stack.
 *
 * Active card:   accent left border (3 px) + accent-tinted background + stronger shadow.
 * Inactive card: slate border + white background + subtle shadow + hover lift.
 *
 * Data is never hardcoded — pulled from navigationService (falls back to sidebarLinksDefaults).
 */

import React, { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { ChevronDown, ChevronRight } from 'lucide-react'
import {
  navigationService,
  sidebarLinksDefaults,
  sectionBannersDefaults,
} from '../../services/navigationService'
import { uiLabelsService } from '../../services/uiLabelsService'
import type { SidebarLink, SectionBanner } from '../../services/navigationService'

interface LeftSidebarProps {
  section: string
}

const LeftSidebar: React.FC<LeftSidebarProps> = ({ section }) => {
  const location = useLocation()
  const [mobileOpen, setMobileOpen] = useState(false)

  const [links, setLinks] = useState<SidebarLink[]>(sidebarLinksDefaults[section] || [])
  const [banner, setBanner] = useState<SectionBanner>(
    sectionBannersDefaults[section] || {
      section,
      title: section,
      subtitle: '',
      iconName: 'BookOpen',
      sectionLabel: section,
    }
  )
  const [sectionMenuLabel, setSectionMenuLabel] = useState('Section Menu')

  useEffect(() => {
    setMobileOpen(false)
    navigationService.getSidebarLinks(section).then(fetched => {
      if (fetched.length > 0) setLinks(fetched)
    })
    navigationService.getSectionBanner(section).then(fetched => {
      if (fetched?.sectionLabel) setBanner(fetched)
    })
    uiLabelsService.getUiLabels().then(l => {
      if (l.sidebar?.sectionMenuLabel) setSectionMenuLabel(l.sidebar.sectionMenuLabel)
    })
  }, [section])

  if (links.length === 0) return null

  const activeLink = links.find(
    l => location.pathname === l.path || location.pathname.startsWith((l.path ?? '') + '/')
  )

  // ── Individual nav card ──────────────────────────────────────────────────────
  const NavCard: React.FC<{ link: SidebarLink; onNavigate?: () => void }> = ({
    link,
    onNavigate,
  }) => {
    const isActive =
      location.pathname === link.path ||
      location.pathname.startsWith((link.path ?? '') + '/')

    return (
      <Link
        to={link.path ?? link.to ?? link.url ?? '/'}
        state={{ fromSidebar: true }}
        onClick={onNavigate}
        aria-current={isActive ? 'page' : undefined}
        className={[
          // Base — layout, shape, typography
          'flex items-center justify-between gap-3 w-full',
          'px-4 py-3 rounded-lg text-sm',
          // Border: left is always 3 px wide; its colour drives the active indicator.
          // Other sides stay at 1 px. Using explicit sides avoids the shorthand
          // overriding our left-border width on hover.
          'border-t border-r border-b border-l-[3px]',
          // Smooth transitions on shadow, bg, and border colour
          'transition-all duration-200 group',
          isActive
            ? [
                // Active state
                'border-t-slate-200 border-r-slate-200 border-b-slate-200',
                'border-l-accent',
                'bg-accent/10 shadow-md',
                'text-primary font-bold',
              ].join(' ')
            : [
                // Inactive state
                'border-t-slate-200 border-r-slate-200 border-b-slate-200',
                'border-l-transparent',
                'bg-white shadow-sm',
                'text-slate-700 font-medium',
                // Hover
                'hover:border-t-slate-300 hover:border-r-slate-300 hover:border-b-slate-300',
                'hover:border-l-accent/40',
                'hover:bg-slate-50 hover:shadow-md',
                'hover:text-primary',
              ].join(' '),
        ].join(' ')}
      >
        <span className="truncate leading-snug">{link.label}</span>
        <ChevronRight
          size={14}
          strokeWidth={2.5}
          className={[
            'shrink-0 transition-all duration-200',
            isActive
              ? 'text-accent'
              : 'text-slate-300 group-hover:text-accent/60 group-hover:translate-x-0.5',
          ].join(' ')}
        />
      </Link>
    )
  }

  // ── Card stack (shared between desktop and mobile) ───────────────────────────
  const CardStack: React.FC<{ onNavigate?: () => void }> = ({ onNavigate }) => (
    <nav
      aria-label={`${banner.sectionLabel} navigation`}
      className="flex flex-col gap-2"
    >
      {links.map(link => (
        <NavCard key={link.path ?? link.label} link={link} onNavigate={onNavigate} />
      ))}
    </nav>
  )

  // ── Render ───────────────────────────────────────────────────────────────────
  return (
    <>
      {/* ── Mobile accordion (hidden on md+) ──────────────────────────────── */}
      <div className="md:hidden w-full">
        {/* Trigger — shows current page name */}
        <button
          type="button"
          onClick={() => setMobileOpen(o => !o)}
          aria-expanded={mobileOpen}
          className={[
            'w-full flex items-center justify-between gap-3',
            'px-4 py-3 rounded-lg text-left',
            'bg-white border border-slate-200 shadow-sm',
            'transition-all duration-200',
            mobileOpen ? 'shadow-md border-slate-300' : '',
          ].join(' ')}
        >
          <div className="min-w-0">
            <span className="text-xs uppercase font-bold tracking-widest text-slate-400 block leading-none mb-1">
              {sectionMenuLabel} · {banner.sectionLabel}
            </span>
            <span className="text-sm font-bold text-primary truncate block">
              {activeLink?.label ?? 'Browse section'}
            </span>
          </div>
          <ChevronDown
            size={18}
            strokeWidth={2.5}
            className={`shrink-0 text-slate-500 transition-transform duration-200 ${
              mobileOpen ? 'rotate-180' : ''
            }`}
          />
        </button>

        {/* Expanded card stack */}
        {mobileOpen && (
          <div className="mt-2">
            <CardStack onNavigate={() => setMobileOpen(false)} />
          </div>
        )}
      </div>

      {/* ── Desktop card stack (hidden below md) ──────────────────────────── */}
      <aside
        aria-label={`${banner.sectionLabel} section navigation`}
        className="hidden md:block w-full"
      >
        <CardStack />
      </aside>
    </>
  )
}

export default LeftSidebar
