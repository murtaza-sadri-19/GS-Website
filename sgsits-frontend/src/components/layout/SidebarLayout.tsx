/**
 * SidebarLayout — Two-column docs-style layout.
 *
 * Desktop  : sticky left sidebar (no own scrollbar) + scrollable right content.
 * Mobile   : section banner, then mobile accordion (from LeftSidebar), then content.
 *
 * Sticky offset breakdown:
 *   md (768–1023px): LogoBanner is sticky top-0 (~104px). StickyNav is hidden.
 *                    → sidebar top = 108px
 *   lg+ (1024px+)  : LogoBanner is lg:static (scrolls away). StickyNav is sticky top-0 (~52px).
 *                    → sidebar top = 56px
 *
 * Data loaded via service layer — never hardcoded.
 */

import React, { useState, useEffect } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import LeftSidebar from './LeftSidebar'
import Breadcrumbs from '../global/Breadcrumbs'
import {
  navigationService,
  sidebarLinksDefaults,
  sectionBannersDefaults,
  defaultSectionBanner,
} from '../../services/navigationService'
import { uiLabelsService, uiLabelsDefaults } from '../../services/uiLabelsService'
import type { SectionBanner, SidebarLink } from '../../services/navigationService'

interface SidebarLayoutProps {
  section?: string
}

const SidebarLayout: React.FC<SidebarLayoutProps> = ({ section }) => {
  const location = useLocation()

  const activeSection = section || location.pathname.split('/').filter(Boolean)[0] || 'about'

  const [banner, setBanner] = useState<SectionBanner>(
    sectionBannersDefaults[activeSection] || defaultSectionBanner
  )
  const [portalSuffix, setPortalSuffix] = useState<string>(
    uiLabelsDefaults.sidebar?.portalSuffix ?? ''
  )
  const [sidebarLinks, setSidebarLinks] = useState<SidebarLink[]>(
    sidebarLinksDefaults[activeSection] || []
  )

  useEffect(() => {
    setBanner(sectionBannersDefaults[activeSection] || defaultSectionBanner)
    setSidebarLinks(sidebarLinksDefaults[activeSection] || [])

    navigationService.getSectionBanner(activeSection).then(fetched => {
      if (fetched?.sectionLabel) setBanner(fetched)
    })
    uiLabelsService.getUiLabels().then(l => {
      setPortalSuffix(l.sidebar?.portalSuffix ?? '')
    })
    navigationService.getSidebarLinks(activeSection).then(fetched => {
      if (fetched.length > 0) setSidebarLinks(fetched)
    })
  }, [activeSection])

  const hasSidebar = sidebarLinks.length > 0

  return (
    <div className="w-full flex flex-col">

      {/* ── Section banner ─────────────────────────────────────── */}
      <div className="w-full bg-slate-50 border-b-2 border-slate-200 py-8 px-4 lg:px-12">
        <div className="max-w-[1400px] mx-auto">
          <span className="text-primary font-bold text-[11px] uppercase tracking-widest block mb-2">
            {banner.sectionLabel}{portalSuffix}
          </span>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-slate-900 font-display">
            {banner.title}
          </h1>
          <p className="text-sm text-slate-500 mt-2 font-medium">{banner.subtitle}</p>
        </div>
      </div>

      {/* ── Two-column area ───────────────────────────────────── */}
      <div id="sidebar-content-area" className="w-full max-w-[1400px] mx-auto px-4 lg:px-12">
        <div className="flex flex-col md:flex-row md:gap-8 items-start">

          {/* LEFT SIDEBAR
              Desktop: sticky column pinned below the header.
                - height = 100vh minus sticky header so the element has
                  a defined size — this is required for position:sticky to
                  work reliably in flex layouts across all browsers.
                - overflow:hidden ensures no own scrollbar (sidebar content
                  is short enough to fit within the viewport).
              Mobile: accordion — rendered by LeftSidebar, stacks above content.

              top / height offsets per breakpoint:
                md  (768–1023px): LogoBanner is sticky-top-0 (~108px) → top 108px
                lg+ (1024px+)  : StickyNav is sticky-top-0  ( ~56px) → top  56px
          */}
          {hasSidebar && (
            <div className="w-full md:w-[300px] flex-shrink-0 py-6
                            md:sticky md:top-[108px] md:self-start
                            md:h-[calc(100vh-108px)] md:overflow-hidden
                            lg:top-[56px] lg:h-[calc(100vh-56px)]">

              {/* Breadcrumbs: desktop only — mobile renders inside content area */}
              <div className="hidden md:block mb-4">
                <Breadcrumbs />
              </div>

              <LeftSidebar section={activeSection} />
            </div>
          )}

          {/* RIGHT CONTENT — naturally scrollable, takes remaining width */}
          <div className="flex-1 min-w-0 py-8">
            {/* Mobile: breadcrumb always in content area (sidebar is accordion, not a column) */}
            <div className="md:hidden mb-4">
              <Breadcrumbs />
            </div>
            {/* Desktop: breadcrumb in content area only when there is no sidebar column */}
            {!hasSidebar && (
              <div className="hidden md:block mb-4">
                <Breadcrumbs />
              </div>
            )}

            <div className={hasSidebar
              ? 'bg-white rounded-md border border-slate-200 shadow-sm p-6 sm:p-8 min-h-[600px]'
              : 'min-h-[500px]'
            }>
              <Outlet />
            </div>
          </div>

        </div>
      </div>

    </div>
  )
}

export default SidebarLayout
