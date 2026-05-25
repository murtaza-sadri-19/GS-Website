/**
 * SidebarLayout — Two-column layout with a sticky left sidebar and scrollable
 * content area. Also renders the section banner at the top.
 *
 * ALL banner data loaded through navigationService (never hardcoded):
 *  - Section banner (title, subtitle, sectionLabel) → GET /api/navigation/section-banner/:section
 *  - Sidebar links                                   → GET /api/navigation/sidebar/:section
 *  - UI labels (portal suffix)                       → GET /api/settings/ui-labels
 *
 * Admin can: edit any banner title/subtitle, change section labels, add/remove links.
 */

import React, { useState, useEffect } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import LeftSidebar from './LeftSidebar'
import Breadcrumbs from '../global/Breadcrumbs'
import { navigationService, sidebarLinksDefaults, sectionBannersDefaults, defaultSectionBanner } from '../../services/navigationService'
import { uiLabelsService, uiLabelsDefaults } from '../../services/uiLabelsService'
import type { SectionBanner } from '../../services/navigationService'

interface SidebarLayoutProps {
  section?: string
}

const SidebarLayout: React.FC<SidebarLayoutProps> = ({ section }) => {
  const location = useLocation()

  const getActiveSection = () => {
    if (section) return section
    const pathParts = location.pathname.split('/').filter(Boolean)
    return pathParts[0] || 'about'
  }

  const activeSection = getActiveSection()

  // ── Section banner — loaded through service layer ──────────────────────────
  const [banner, setBanner] = useState<SectionBanner>(
    sectionBannersDefaults[activeSection] || defaultSectionBanner
  )

  // ── Portal suffix label — loaded through service layer ────────────────────
  const [portalSuffix, setPortalSuffix] = useState<string>(uiLabelsDefaults.sidebar.portalSuffix)

  useEffect(() => {
    navigationService.getSectionBanner(activeSection).then(setBanner)
    uiLabelsService.getUiLabels().then(l => setPortalSuffix(l.sidebar.portalSuffix))
  }, [activeSection])

  // Determine if sidebar has links for this section (use synchronous defaults to avoid flash)
  const hasSidebar = (sidebarLinksDefaults[activeSection] || []).length > 0

  return (
    <div className="w-full flex flex-col min-h-screen">
      {/* Section Banner — all content from navigationService */}
      <div className="w-full bg-[#f7f8fa] text-slate-900 py-8 px-4 lg:px-12 relative border-b-2 border-slate-200">
        <div className="max-w-[1400px] mx-auto relative z-10">
          <div className="max-w-3xl">
            {/* Section label + portal suffix — both dynamic */}
            <span className="text-[#0b2545] font-semibold text-[11px] font-bold uppercase tracking-widest block mb-2">
              {banner.sectionLabel}{portalSuffix}
            </span>
            {/* Section title — dynamic from banner.title */}
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-slate-900 font-display">
              {banner.title}
            </h1>
            {/* Section subtitle — dynamic from banner.subtitle */}
            <p className="text-sm text-slate-500 mt-2 font-medium">
              {banner.subtitle}
            </p>
          </div>
        </div>
      </div>

      <div id="sidebar-content-area" className="w-full max-w-[1400px] mx-auto px-4 lg:px-12 flex-grow">
        <div className="flex flex-col md:flex-row gap-8 items-start">

          {/* LEFT SIDEBAR — sticky on desktop, stacks on mobile */}
          {hasSidebar && (
            <div className="w-full md:w-64 flex-shrink-0 md:sticky md:top-[72px] md:self-start">
              <div className="pt-8 pb-4">
                <Breadcrumbs />
              </div>
              <LeftSidebar section={activeSection} />
            </div>
          )}

          {/* RIGHT CONTENT — scrolls freely */}
          <div className={`flex-grow w-full py-8 ${
            hasSidebar
              ? 'bg-white rounded-md border border-slate-200 p-6 sm:p-8 mt-0 min-h-[600px]'
              : 'min-h-[500px]'
          }`}>
            {!hasSidebar && <div className="mb-4"><Breadcrumbs /></div>}
            <Outlet />
          </div>

        </div>
      </div>
    </div>
  )
}

export default SidebarLayout
