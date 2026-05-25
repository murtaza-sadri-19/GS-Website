import React, { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useUIStore } from '../../../store/uiStore'
// ─── Service layer — the ONLY data source ────────────────────────────────────
import { navService, navItemsDefault } from '../../../services/navService'
import type { NavItem } from '../../../services/navService'
import { brandingService, brandingDefaults } from '../../../services/brandingService'
import { uiLabelsService, uiLabelsDefaults } from '../../../services/uiLabelsService'
import type { BrandingConfig } from '../../../services/brandingService'
import type { UiLabelsConfig } from '../../../services/uiLabelsService'
import TopAccessibilityBar from './TopAccessibilityBar'
import Logo from './Logo'
import { Menu, X, ChevronDown, Search, ArrowRight } from 'lucide-react'

const Header: React.FC = () => {
  const location = useLocation()
  const { mobileMenuOpen, toggleMobileMenu } = useUIStore()
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null)
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [expandedMobileItem, setExpandedMobileItem] = useState<string | null>(null)

  // ── Navigation items — loaded through the service layer ───────────────────
  const [navItems, setNavItems] = useState<NavItem[]>(navItemsDefault)

  // ── Branding — loaded through branding service ────────────────────────────
  const [branding, setBranding] = useState<BrandingConfig>(brandingDefaults)

  // ── UI Labels — loaded through uiLabels service ───────────────────────────
  const [labels, setLabels] = useState<UiLabelsConfig>(uiLabelsDefaults)

  useEffect(() => {
    navService.getNavItems().then(setNavItems)
    brandingService.getBranding().then(setBranding)
    uiLabelsService.getUiLabels().then(setLabels)
  }, [])

  // ── ERP Portal link — loaded through top-bar settings ────────────────────
  const [erpUrl, setErpUrl] = useState<string>('https://www.sgsits.ac.in')
  const [erpLabel, setErpLabel] = useState<string>(uiLabelsDefaults.header.erpPortalFallbackLabel)

  useEffect(() => {
    import('../../../services/settingsService').then(({ settingsService: svc }) => {
      svc.getTopBarData().then(d => {
        setErpUrl(d.erpPortalUrl)
        setErpLabel(d.erpPortalLabel)
      })
    })
  }, [])

  return (
    <header className="w-full z-50 relative">
      {/* Top Accessibility and Utility Bar */}
      <TopAccessibilityBar />

      {/* Main Branding & Navigation Container */}
      <div className="w-full bg-white sticky top-0 border-b border-slate-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.05)] transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 py-3.5 flex items-center justify-between">
          {/* Logo Brand */}
          <Logo />

          {/* Desktop Navigation Link Menu */}
          <nav className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => {
              const hasChildren = !!item.children
              const isActive =
                item.path === '/'
                  ? location.pathname === '/'
                  : location.pathname.startsWith(item.path || '$_') ||
                    item.children?.some((child) => location.pathname === child.path)

              return (
                <div
                  key={item.label}
                  className="relative group py-2"
                  onMouseEnter={() => hasChildren && setActiveDropdown(item.label)}
                  onMouseLeave={() => setActiveDropdown(null)}
                >
                  {item.path ? (
                    <Link
                      to={item.path}
                      className={`px-3 py-1.5 rounded-md text-[13.5px] font-medium tracking-wide transition-colors duration-200 flex items-center gap-1 ${
                        isActive
                          ? 'text-brand-burgundy font-semibold'
                          : 'text-slate-700 hover:text-brand-burgundy hover:bg-slate-50'
                      }`}
                    >
                      {item.label}
                    </Link>
                  ) : (
                    <button
                      className={`px-3 py-1.5 rounded-md text-[13.5px] font-medium tracking-wide transition-colors duration-200 flex items-center gap-1 cursor-pointer focus:outline-none ${
                        isActive
                          ? 'text-brand-burgundy font-semibold'
                          : 'text-slate-700 hover:text-brand-burgundy hover:bg-slate-50'
                      }`}
                    >
                      {item.label}
                      <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${activeDropdown === item.label ? 'rotate-180 text-brand-burgundy' : 'text-slate-400'}`} />
                    </button>
                  )}

                  {/* Centered active tab underline indicator */}
                  <span
                    className={`absolute bottom-0 left-1/2 -translate-x-1/2 h-0.5 rounded-full bg-brand-burgundy transition-all duration-300 ${
                      isActive ? 'w-3/4 opacity-100' : 'w-0 opacity-0'
                    }`}
                  />

                  {/* Desktop Mega Dropdown Overlay */}
                  {hasChildren && activeDropdown === item.label && (
                    <div className="absolute top-full left-1/2 -translate-x-1/2 pt-1 w-[500px] z-50 animate-in fade-in slide-in-from-top-1 duration-150">
                      <div className="bg-white rounded-lg border border-slate-200 p-5 shadow-lg grid grid-cols-2 gap-3">
                        <div className="col-span-2 pb-1.5 mb-0.5 border-b border-slate-100">
                          <h4 className="font-display font-bold text-xs text-brand-burgundy tracking-widest uppercase">
                            {item.label}
                          </h4>
                        </div>
                        {item.children?.map((child) => {
                          const isChildActive = location.pathname === child.path
                          return (
                            <Link
                              key={child.label}
                              to={child.path}
                              onClick={() => setActiveDropdown(null)}
                              className={`flex items-center justify-between py-2 px-3 rounded-md text-xs font-medium tracking-wide transition-colors duration-150 ${
                                isChildActive
                                  ? 'bg-slate-100 text-brand-burgundy font-semibold border-l-2 border-brand-burgundy pl-2.5'
                                  : 'text-slate-600 hover:text-brand-burgundy hover:bg-slate-50'
                              }`}
                            >
                              <span>{child.label}</span>
                              <ArrowRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
                            </Link>
                          )
                        })}
                      </div>
                    </div>
                  )}
                </div>
              )
            })}

            {/* Quick Portal Access button */}
            <a
              href={erpUrl}
              target="_blank"
              rel="noreferrer"
              className="ml-2 px-3.5 py-1.5 text-xs font-semibold text-white bg-brand-burgundy hover:bg-brand-burgundy/90 active:scale-98 border border-brand-burgundy rounded-md shadow-sm transition-all duration-150"
            >
              {erpLabel}
            </a>
          </nav>

          {/* Search Icon & Hamburger menu for mobile */}
          <div className="flex items-center gap-2">
            {/* Search toggler */}
            <div className="relative">
              <button
                onClick={() => setSearchOpen(!searchOpen)}
                className="p-2 rounded-xl text-slate-500 hover:text-brand-burgundy hover:bg-slate-50 transition-colors"
                title="Search Site"
              >
                <Search className="w-5 h-5" />
              </button>

              {searchOpen && (
                <div className="absolute right-0 top-full mt-2 w-72 bg-white rounded-lg border border-slate-200 p-3 shadow-lg z-50">
                  <form
                    onSubmit={(e) => {
                      e.preventDefault()
                      alert(`Searching for: ${searchQuery}`)
                      setSearchOpen(false)
                    }}
                    className="flex gap-2"
                  >
                    <input
                      type="text"
                      placeholder={labels.header.searchPlaceholder}
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full px-3 py-1.5 rounded-md border border-slate-200 bg-white text-xs focus:outline-none focus:border-brand-burgundy focus:ring-1 focus:ring-brand-burgundy text-slate-800"
                      autoFocus
                    />
                    <button
                      type="submit"
                      className="px-3 py-1.5 bg-brand-burgundy text-white rounded-md text-xs font-bold"
                    >
                      {labels.header.searchButtonLabel}
                    </button>
                  </form>
                </div>
              )}
            </div>

            {/* Mobile Hamburger toggle */}
            <button
              onClick={toggleMobileMenu}
              className="lg:hidden p-2 rounded-xl text-slate-500 hover:text-brand-burgundy hover:bg-slate-50 transition-colors"
              title="Toggle Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Slide-out Mobile Navigation Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-40 flex">
          {/* Overlay mask */}
          <div
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
            onClick={toggleMobileMenu}
          />

          {/* Drawer content body */}
          <div className="relative w-80 max-w-[85vw] ml-auto h-full bg-white dark:bg-slate-900 shadow-2xl flex flex-col z-50 animate-slide-in-right transition-colors duration-300">
            {/* Drawer top branding */}
            <div className="p-4 border-b border-slate-200/80 dark:border-slate-800 flex items-center justify-between bg-white dark:bg-slate-900/50">
              <span className="font-display font-extrabold text-sm text-brand-burgundy dark:text-brand-gold tracking-wide uppercase">
                {branding.mobileDrawerTitle}
              </span>
              <button
                onClick={toggleMobileMenu}
                className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 dark:text-slate-500"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Nav list container scrollable */}
            <div className="flex-1 overflow-y-auto p-4 space-y-2">
              {navItems.map((item) => {
                const isActive =
                  item.path === '/'
                    ? location.pathname === '/'
                    : location.pathname.startsWith(item.path || '$_')
                const isExpanded = expandedMobileItem === item.label

                return (
                  <div key={item.label} className="border-b border-slate-100 dark:border-slate-800/60 pb-2">
                    {item.path ? (
                      <Link
                        to={item.path}
                        onClick={toggleMobileMenu}
                        className={`flex items-center py-2 px-3 rounded-lg text-sm font-bold ${
                          isActive
                            ? 'text-brand-burgundy dark:text-brand-gold bg-brand-burgundy/5 dark:bg-brand-gold/5'
                            : 'text-slate-700 dark:text-slate-200'
                        }`}
                      >
                        {item.label}
                      </Link>
                    ) : (
                      <div>
                        <button
                          onClick={() => setExpandedMobileItem(isExpanded ? null : item.label)}
                          className="w-full flex items-center justify-between py-2 px-3 rounded-lg text-sm font-bold text-slate-700 dark:text-slate-200 cursor-pointer focus:outline-none"
                        >
                          <span>{item.label}</span>
                          <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isExpanded ? 'rotate-180 text-brand-burgundy dark:text-brand-gold' : ''}`} />
                        </button>

                        {isExpanded && (
                          <div className="mt-1 ml-3 pl-3 border-l-2 border-slate-150 dark:border-slate-800 space-y-1 py-1">
                            {item.children?.map((child) => {
                              const isChildActive = location.pathname === child.path
                              return (
                                <Link
                                  key={child.label}
                                  to={child.path}
                                  onClick={toggleMobileMenu}
                                  className={`block py-1.5 px-3 rounded-lg text-xs font-semibold ${
                                    isChildActive
                                      ? 'text-brand-burgundy dark:text-brand-gold bg-brand-burgundy/5 dark:bg-brand-gold/5'
                                      : 'text-slate-500 hover:text-brand-burgundy dark:text-slate-450 dark:hover:text-brand-gold'
                                  }`}
                                >
                                  {child.label}
                                </Link>
                              )
                            })}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )
              })}
            </div>

            {/* Drawer bottom info */}
            <div className="p-4 bg-white dark:bg-slate-900/50 border-t border-slate-200/80 dark:border-slate-800 text-[10px] text-center text-slate-400 dark:text-slate-500">
              {branding.mobileDrawerFooter}
            </div>
          </div>
        </div>
      )}
    </header>
  )
}

export default Header
