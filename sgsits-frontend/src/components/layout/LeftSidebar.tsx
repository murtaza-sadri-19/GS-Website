/**
 * LeftSidebar — Section navigation links panel.
 *
 * Desktop: sticky card with all links visible at once (no own scrollbar).
 * Mobile:  accordion — shows active page name, expands to full link list.
 *
 * Data sources (never hardcoded):
 *  - Sidebar links  → navigationService (falls back to sidebarLinksDefaults)
 *  - Section label  → navigationService banner (falls back to sectionBannersDefaults)
 *  - "Section Menu" → uiLabelsService
 */

import React, { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { ChevronDown } from 'lucide-react'
import { navigationService, sidebarLinksDefaults, sectionBannersDefaults } from '../../services/navigationService'
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
    sectionBannersDefaults[section] || { section, title: section, subtitle: '', iconName: 'BookOpen', sectionLabel: section }
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
    l => location.pathname === l.path || location.pathname.startsWith(l.path + '/')
  )

  const NavLinks = ({ onNavigate }: { onNavigate?: () => void }) => (
    <nav aria-label={`${banner.sectionLabel} navigation`}>
      {links.map((link) => {
        const isActive = location.pathname === link.path || location.pathname.startsWith(link.path + '/')
        return (
          <Link
            key={link.path}
            to={link.path}
            state={{ fromSidebar: true }}
            onClick={onNavigate}
            className={[
              'flex items-center px-3 py-2.5 text-sm transition-colors duration-150',
              'border-l-[3px] rounded-r-sm',
              isActive
                ? 'border-accent bg-accent/5 text-primary font-bold'
                : 'border-transparent text-slate-600 font-medium hover:text-primary hover:bg-slate-50 hover:border-slate-200',
            ].join(' ')}
          >
            <span className="truncate">{link.label}</span>
          </Link>
        )
      })}
    </nav>
  )

  return (
    <>
      {/* ── Mobile accordion (hidden on md+) ──────────────────── */}
      <div className="md:hidden w-full">
        <button
          type="button"
          onClick={() => setMobileOpen(o => !o)}
          aria-expanded={mobileOpen}
          className="w-full flex items-center justify-between gap-3 px-4 py-3 bg-white border border-slate-200 rounded-md text-left shadow-sm"
        >
          <div className="min-w-0">
            <span className="text-[10px] uppercase font-bold tracking-widest text-slate-400 block leading-none mb-1">
              {sectionMenuLabel} · {banner.sectionLabel}
            </span>
            <span className="text-sm font-bold text-primary truncate block">
              {activeLink?.label ?? 'Browse section'}
            </span>
          </div>
          <ChevronDown
            size={18}
            strokeWidth={2.5}
            className={`shrink-0 text-slate-500 transition-transform duration-200 ${mobileOpen ? 'rotate-180' : ''}`}
          />
        </button>

        {mobileOpen && (
          <div className="mt-1 bg-white border border-slate-200 rounded-md shadow-sm overflow-hidden">
            <div className="py-1">
              <NavLinks onNavigate={() => setMobileOpen(false)} />
            </div>
          </div>
        )}
      </div>

      {/* ── Desktop sidebar card (hidden below md) ────────────── */}
      <aside className="hidden md:block w-full bg-white rounded-md border border-slate-200 shadow-sm overflow-hidden">
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-100 bg-slate-50/60">
          <span className="text-[10px] uppercase font-bold tracking-widest text-slate-400 block mb-1">
            {sectionMenuLabel}
          </span>
          <h3 className="text-sm font-bold uppercase tracking-wider text-primary leading-tight">
            {banner.sectionLabel}
          </h3>
        </div>

        {/* Links */}
        <div className="py-2">
          <NavLinks />
        </div>
      </aside>
    </>
  )
}

export default LeftSidebar
