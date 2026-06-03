import React, { useState, useEffect } from 'react'
import { Link, Outlet, useLocation } from 'react-router-dom'
import Chatbot from '../global/Chatbot'
import TopBar from './TopBar'
import LogoBanner from './LogoBanner'
import StickyNav from './StickyNav'
import CampusRevealBanner from './CampusRevealBanner'
import Footer from './Footer'
import { settingsService, siteSettingsDefaults, topBarDefaults, footerDefaults } from '../../services/settingsService'
import { brandingService, brandingDefaults } from '../../services/brandingService'
import { navigationService, quickLinksDefaults } from '../../services/navigationService'
import { uiLabelsService, uiLabelsDefaults } from '../../services/uiLabelsService'
import { navService, navItemsDefault } from '../../services/navService'
import { departmentService } from '../../services/departmentService'
import type { FooterData, TopBarData } from '../../services/settingsService'
import type { SiteSettings } from '../../types'
import type { BrandingConfig } from '../../services/brandingService'
import type { UiLabelsConfig } from '../../services/uiLabelsService'
import type { DepartmentSummary } from '../../services/departmentService'

const MainLayout: React.FC = () => {
  const location = useLocation()
  const { pathname } = location
  const [mobileOpen, setMobileOpen] = useState(false)

  const [settings, setSettings]       = useState<SiteSettings>(siteSettingsDefaults)
  const [topBar, setTopBar]           = useState<TopBarData>(topBarDefaults)
  const [navItemsList, setNavItemsList] = useState<any[]>(navItemsDefault)
  const [footerData, setFooterData]   = useState<FooterData>(footerDefaults)
  const [footerDepts, setFooterDepts] = useState<DepartmentSummary[]>([])
  const [alerts, setAlerts]           = useState<any[]>([])
  const [branding, setBranding]       = useState<BrandingConfig>(brandingDefaults)
  const [labels, setLabels]           = useState<UiLabelsConfig>(uiLabelsDefaults)
  const [quickLinks, setQuickLinks]   = useState<{ label: string; to: string }[]>(quickLinksDefaults)

  useEffect(() => {
    const load = async () => {
      try {
        const [
          loadedSettings, loadedTopBar, loadedNav, loadedFooter, loadedAlerts,
          loadedBranding, loadedLabels, loadedQuickLinks, loadedDepts,
        ] = await Promise.all([
          settingsService.getSiteSettings(),
          settingsService.getTopBarData(),
          navService.getNavItems(),
          settingsService.getFooterData(),
          settingsService.getAlerts(),
          brandingService.getBranding(),
          uiLabelsService.getUiLabels(),
          navigationService.getQuickLinks(),
          departmentService.getDepartments(),
        ])
        setSettings(loadedSettings)
        setTopBar(loadedTopBar)
        setNavItemsList(loadedNav)
        setFooterData(loadedFooter)
        setAlerts(loadedAlerts)
        setBranding(loadedBranding)
        setLabels(loadedLabels)
        setQuickLinks(loadedQuickLinks)
        setFooterDepts(loadedDepts)
      } catch (error) {
        console.error('Failed to load layout config:', error)
      }
    }
    load()
  }, [])

  // Scroll: sidebar nav → scroll to content area, other nav → scroll to top
  useEffect(() => {
    const fromSidebar = location.state?.fromSidebar
    if (fromSidebar) {
      const timer = setTimeout(() => {
        const el = document.getElementById('sidebar-content-area')
        if (el) {
          const offset = 80
          window.scrollTo({ top: el.getBoundingClientRect().top + window.pageYOffset - offset, behavior: 'smooth' })
        }
      }, 50)
      return () => clearTimeout(timer)
    } else {
      window.scrollTo(0, 0)
    }
  }, [pathname, location.state])

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [mobileOpen])

  const activeAlerts = alerts
    .filter((a: any) => a.isActive)
    .sort((a: any, b: any) => {
      const pA = typeof a.priority === 'number' ? a.priority : 100
      const pB = typeof b.priority === 'number' ? b.priority : 100
      return pA - pB
    })

  return (
    <div className="min-h-screen flex flex-col font-sans text-slate-800 bg-brand-light transition-colors duration-300 w-full max-w-full overflow-x-clip">
      <TopBar topBar={topBar} quickLinks={quickLinks} loginLabel={labels.header.loginLabel} />

      <LogoBanner
        onMobileToggle={() => setMobileOpen(o => !o)}
        mobileOpen={mobileOpen}
        settings={settings}
        branding={branding}
        mobileMenuOpenLabel={labels.header.mobileMenuOpenLabel}
        mobileMenuCloseLabel={labels.header.mobileMenuCloseLabel}
      />

      <StickyNav
        mobileOpen={mobileOpen}
        onMobileClose={() => setMobileOpen(false)}
        navItemsList={navItemsList}
        branding={branding}
        quickLinks={quickLinks}
        loginLabel={labels.header.loginLabel}
      />

      {/* Announcements marquee */}
      <div className="relative w-full bg-black text-slate-100 flex items-center border-t border-b border-zinc-800">
        <div className="bg-primary text-white px-4 lg:px-8 py-2.5 font-bold text-[11px] sm:text-[13px] uppercase tracking-wider shrink-0 flex items-center sm:relative absolute inset-y-0 left-0 z-10 border-r-2 border-accent">
          {labels.homepage.announcementsHeading}
        </div>
        <div className="flex-1 overflow-hidden sm:ml-0 ml-[135px] py-2 flex items-center">
          {React.createElement('marquee', {
            scrollamount: '4',
            className: 'text-[13px] sm:text-[14px] font-medium leading-none m-0 pt-[1px] w-full block text-slate-200'
          } as any, (
            <>
              {activeAlerts.length > 0 ? (
                activeAlerts.map((alert, idx) => (
                  <React.Fragment key={alert.id || idx}>
                    {idx > 0 && <span className="text-accent/30 mx-3">|</span>}
                    {alert.link ? (
                      <Link to={alert.link} className={`mr-8 font-semibold hover:underline ${idx === 0 ? 'text-accent' : 'text-slate-100'}`}>
                        {alert.text}
                      </Link>
                    ) : (
                      <span className={`mr-8 font-semibold ${idx === 0 ? 'text-accent' : 'text-slate-100'}`}>
                        {alert.text}
                      </span>
                    )}
                  </React.Fragment>
                ))
              ) : (
                <span className="text-slate-400 font-medium">No active announcements at the moment.</span>
              )}
            </>
          ))}
        </div>
      </div>

      <main className="flex-grow">
        <Outlet />
      </main>

      {pathname === '/' && <CampusRevealBanner />}

      <Footer footerData={footerData} settings={settings} depts={footerDepts} />
      {!mobileOpen && <Chatbot />}
    </div>
  )
}

export default MainLayout
