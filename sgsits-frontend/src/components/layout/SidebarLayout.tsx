/**
 * SidebarLayout — Two-column docs-style layout.
 *
 * Desktop  : sticky left nav-card stack (320 px) + normal-flow right content.
 * Mobile   : section banner, then mobile accordion (from LeftSidebar), then content.
 *
 * Scroll model (desktop):
 *   - The PAGE scrolls normally (window scroll — no overflow-y container tricks).
 *   - The LEFT sidebar uses position:sticky + align-self:flex-start.
 *     Once it reaches the sticky threshold it pins in place; the page continues scrolling.
 *   - The RIGHT panel is plain normal flow — no height cap, no overflow-y-auto.
 *     Content as long as needed scrolls with the page.
 *
 * Sticky top offset = sticky-header height + 20 px breathing room:
 *   md (768–1023px): LogoBanner sticky top-0 (~108 px) → sidebar top = 128 px
 *   lg+ (1024 px+) : StickyNav  sticky top-0  (~56 px) → sidebar top =  76 px
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

  const activeSection =
    section || location.pathname.split('/').filter(Boolean)[0] || 'about'

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

  const hasSidebar = false

  return (
    <div className="w-full flex flex-col">

      {/* ── Section banner ────────────────────────────────────────────────── */}
      <div className="w-full bg-slate-50 border-b-2 border-slate-200 py-8 px-4 lg:px-12">
        <div className="max-w-[1400px] mx-auto">
          <span className="text-primary font-bold text-xs uppercase tracking-widest block mb-2">
            {banner.sectionLabel}{portalSuffix}
          </span>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-slate-900 font-display">
            {banner.title}
          </h1>
          <p className="text-sm text-slate-500 mt-2 font-medium">{banner.subtitle}</p>
        </div>
      </div>

      {/* ── Two-column area ───────────────────────────────────────────────── */}
      <div
        id="sidebar-content-area"
        className="w-full max-w-[1400px] mx-auto px-4 lg:px-12"
      >
        <div className="flex flex-col md:flex-row md:gap-8">

          {/*
            LEFT SIDEBAR — sticky card stack.

            position:sticky + self-start keeps the entire column pinned while
            only the right panel scrolls. height is fit-content (all cards visible).

            top per breakpoint (navbarHeight + 20 px):
              md  (768–1023 px): LogoBanner sticky-top-0 (~108 px) → top 128 px
              lg+ (1024 px+)  : StickyNav  sticky-top-0  (~56 px)  → top  76 px
          */}
          {hasSidebar && (
            <div
              className={[
                'w-full flex-shrink-0 py-6',
                // Desktop: sticky, fits its own content — no explicit height, no overflow clipping.
                // height:fit-content keeps all nav cards visible; sticky+self-start keeps the
                // whole column pinned while only the right panel scrolls.
                'md:w-[320px]',
                'md:sticky md:top-[128px] md:self-start',
                'lg:top-[76px]',
              ].join(' ')}
            >
              {/* Breadcrumbs: desktop only — mobile renders inside content area */}
              <div className="hidden md:block mb-4">
                <Breadcrumbs />
              </div>

              <LeftSidebar section={activeSection} />
            </div>
          )}

          {/*
            RIGHT CONTENT — normal flow. Page scrolls; left sidebar sticks.
            No height cap, no overflow-y container. Content as long as needed.
          */}
          <div className="flex-1 min-w-0 py-8">
            {/* Mobile: breadcrumb in content area (sidebar is an accordion, not a column) */}
            <div className="md:hidden mb-4">
              <Breadcrumbs />
            </div>

            {/* Desktop: breadcrumb in content area only when there is no sidebar */}
            {!hasSidebar && (
              <div className="hidden md:block mb-4">
                <Breadcrumbs />
              </div>
            )}

            <div className="min-h-[500px] px-6 sm:px-10 py-8">
              <Outlet />
            </div>

            <div className="h-12" />
          </div>

        </div>
      </div>

    </div>
  )
}

export default SidebarLayout
