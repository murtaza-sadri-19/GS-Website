/**
 * LeftSidebar — Section navigation links panel.
 *
 * ALL data loaded through navigationService (never from constants directly):
 *  - Sidebar links per section  → GET /api/navigation/sidebar/:section
 *  - UI labels (section menu)   → GET /api/settings/ui-labels
 *
 * Admin can: add/remove/reorder links, change section label.
 */

import React, { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { navigationService, sidebarLinksDefaults, sectionBannersDefaults } from '../../services/navigationService'
import { uiLabelsService, uiLabelsDefaults } from '../../services/uiLabelsService'
import type { SidebarLink, SectionBanner } from '../../services/navigationService'

interface LeftSidebarProps {
  section: string
}

const LeftSidebar: React.FC<LeftSidebarProps> = ({ section }) => {
  const location = useLocation()

  // ── Links — loaded through service layer ──────────────────────────────────
  const [links, setLinks] = useState<SidebarLink[]>(sidebarLinksDefaults[section] || [])

  // ── Section banner (for sectionLabel) — loaded through service layer ──────
  const [banner, setBanner] = useState<SectionBanner>(
    sectionBannersDefaults[section] || { section, title: section, subtitle: '', iconName: 'BookOpen', sectionLabel: section }
  )

  // ── UI Labels — loaded through service layer ──────────────────────────────
  const [sectionMenuLabel, setSectionMenuLabel] = useState<string>(uiLabelsDefaults.sidebar.sectionMenuLabel)

  useEffect(() => {
    navigationService.getSidebarLinks(section).then(setLinks)
    navigationService.getSectionBanner(section).then(setBanner)
    uiLabelsService.getUiLabels().then(l => setSectionMenuLabel(l.sidebar.sectionMenuLabel))
  }, [section])

  if (links.length === 0) return null

  return (
    <aside className="w-full md:w-64 flex-shrink-0 bg-white rounded-md border border-slate-200 p-5">
      <div className="mb-4 pb-3 border-b border-gray-150">
        {/* "Section Menu" label — dynamic from uiLabelsService */}
        <span className="text-[10px] uppercase font-bold tracking-widest text-slate-400 block mb-1">
          {sectionMenuLabel}
        </span>
        {/* Section label — dynamic from navigationService (banner.sectionLabel) */}
        <h3 className="text-sm font-bold uppercase tracking-wider text-primary">
          {banner.sectionLabel}
        </h3>
      </div>
      <nav className="space-y-1">
        {links.map((link) => {
          const isActive = location.pathname === link.path || location.pathname.startsWith(link.path + '/')

          return (
            <Link
              key={link.path}
              to={link.path}
              state={{ fromSidebar: true }}
              className={`flex items-center px-4 py-2.5 rounded-md text-sm font-semibold transition-colors duration-200 border-l-4 ${
                isActive
                  ? 'bg-slate-50 text-primary border-accent font-bold'
                  : 'text-slate-600 hover:text-primary hover:bg-slate-50 border-transparent'
              }`}
            >
              <span className="truncate">{link.label}</span>
            </Link>
          )
        })}
      </nav>
    </aside>
  )
}

export default LeftSidebar
