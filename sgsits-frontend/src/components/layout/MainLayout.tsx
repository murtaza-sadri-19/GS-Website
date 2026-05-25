import React, { useState, useEffect, useRef } from 'react'
import { Link, Outlet, useLocation } from 'react-router-dom'
import {
  Search,
  Accessibility,
  Menu,
  X,
  ChevronDown,
  Cloud
} from 'lucide-react'
import Chatbot from '../global/Chatbot'
import { settingsService, siteSettingsDefaults, topBarDefaults, footerDefaults } from '../../services/settingsService'
import { brandingService, brandingDefaults } from '../../services/brandingService'
import { contentService } from '../../services/contentService'
import { navigationService, quickLinksDefaults } from '../../services/navigationService'
import { uiLabelsService, uiLabelsDefaults } from '../../services/uiLabelsService'
import type { FooterData, TopBarData } from '../../mock/settings/settingsData'
import type { SiteSettings } from '../../types'
import type { BrandingConfig } from '../../services/brandingService'
import type { UiLabelsConfig } from '../../services/uiLabelsService'
import { navService, navItemsDefault } from '../../services/navService'
import { departmentService } from '../../services/departmentService'
import type { DepartmentSummary } from '../../services/departmentService'

// --- TOP BAR COMPONENT ---
interface TopBarProps {
  topBar: TopBarData
  quickLinks: { label: string; to: string }[]
  loginLabel: string
}

const TopBar: React.FC<TopBarProps> = ({ topBar, quickLinks, loginLabel }) => {
  return (
    <div className="bg-primary text-white/80 text-xs md:text-sm py-2 border-b border-white/10 w-full relative z-30 font-sans font-medium">
      <div className="w-full px-4 lg:px-12 flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:justify-between sm:items-center">
        {/* Dynamic quick links — admin-controlled via uiLabels.topBarQuickLinks */}
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 md:gap-x-6">
          {quickLinks.map((ql) => (
            <Link key={ql.to} to={ql.to} className="hover:text-white transition-colors">
              {ql.label}
            </Link>
          ))}
          {topBar.helpline && (
            <span className="hidden lg:inline text-white/50">| Helpline: {topBar.helpline}</span>
          )}
        </div>
        <div className="flex items-center justify-between gap-2 sm:justify-end sm:gap-4">
          <div className="flex items-center gap-3 sm:gap-4">
            <button className="flex items-center hover:text-white transition-colors">
              <Search size={14} className="sm:mr-1 text-white/50" />
              <span className="hidden sm:inline">Search</span>
            </button>
            <button className="flex items-center hover:text-white transition-colors">
              <Accessibility size={14} className="sm:mr-1 text-white/50" />
              <span className="hidden sm:inline">A- / A / A+</span>
            </button>
          </div>
          <a
            href={topBar.erpPortalUrl}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1.5 bg-transparent hover:bg-white/10 border border-accent text-accent px-3 py-1.5 rounded-full font-semibold text-xs transition-all shrink-0"
          >
            <span>{topBar.erpPortalLabel}</span>
          </a>
          <Link
            to="/login"
            className="flex items-center gap-1.5 bg-transparent hover:bg-white/10 border border-accent text-accent px-3 py-1.5 rounded-full font-semibold text-xs transition-all shrink-0"
          >
            <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 3h4a2 2 0 012 2v14a2 2 0 01-2 2h-4M10 17l5-5-5-5M15 12H3" />
            </svg>
            <span>{loginLabel}</span>
          </Link>
        </div>
      </div>
    </div>
  )
}

// --- LOGO BANNER COMPONENT ---
interface LogoBannerProps {
  onMobileToggle: () => void
  mobileOpen: boolean
  settings: SiteSettings
  branding: BrandingConfig
  mobileMenuOpenLabel: string
  mobileMenuCloseLabel: string
}

const LogoBanner: React.FC<LogoBannerProps> = ({
  onMobileToggle,
  mobileOpen,
  settings,
  branding,
  mobileMenuOpenLabel,
  mobileMenuCloseLabel,
}) => {
  return (
    <div className="w-full border-b sticky top-0 z-50 lg:static lg:z-20 bg-white border-slate-100 shadow-sm">
      <div className="w-full px-4 lg:px-12 py-3 flex items-center justify-between gap-3 sm:gap-4">
        <div className="flex min-w-0 items-center gap-3 sm:gap-5">
          {/* Logo image — dynamic from brandingService */}
          <div className="shrink-0 rounded-full flex items-center justify-center w-[58px] h-[58px] sm:w-[80px] sm:h-[80px]">
            <img src={branding.logoUrl} alt={branding.logoAlt} className="w-full h-full object-contain" />
          </div>
          <div className="min-w-0">
            {/* Institution name — dynamic from brandingService */}
            <h1 className="font-bold text-[13px] leading-[1.2] tracking-tight sm:text-[22px] lg:text-[25px] text-primary font-display">
              {branding.fullName.includes('Technology') ? (
                <>
                  {branding.fullName.split('Technology')[0]}Technology
                  <span className="block sm:inline"> & Science</span>
                </>
              ) : (
                branding.fullName
              )}
            </h1>
            {/* Sub-tagline — dynamic from brandingService */}
            <p className="font-bold text-[10px] sm:text-xs mt-1 uppercase tracking-[0.03em] hidden md:block text-slate-500">
              {branding.subTagline}
            </p>
          </div>
        </div>
        <div className="hidden lg:flex items-center space-x-6 shrink-0">
          {/* Tagline accent box — from settingsService */}
          <div className="border border-accent/30 px-4 py-1.5 text-accent font-bold text-[12px] bg-accent/5 hidden xl:block uppercase tracking-wider rounded-sm">
            {settings.tagline}
          </div>
        </div>
        <button
          className="lg:hidden p-2 rounded transition-colors shrink-0 text-primary hover:bg-gray-100"
          onClick={onMobileToggle}
          aria-label={mobileOpen ? mobileMenuCloseLabel : mobileMenuOpenLabel}
        >
          {mobileOpen ? <X size={24} strokeWidth={2.5} /> : <Menu size={24} strokeWidth={2.5} />}
        </button>
      </div>
    </div>
  )
}

// --- STICKY NAV COMPONENT ---
interface StickyNavProps {
  mobileOpen: boolean
  onMobileClose: () => void
  navItemsList: any[]
  branding: BrandingConfig
  quickLinks: { label: string; to: string }[]
  loginLabel: string
}

const StickyNav: React.FC<StickyNavProps> = ({ mobileOpen, onMobileClose, navItemsList, branding, quickLinks, loginLabel }) => {
  const [navVisible, setNavVisible] = useState(true)
  const [lastScrollY, setLastScrollY] = useState(0)
  const [isStuck, setIsStuck] = useState(false)
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null)
  const sentinelRef = useRef<HTMLDivElement>(null)
  const { pathname } = useLocation()

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY
      if (currentScrollY > lastScrollY && currentScrollY > 120) {
        setNavVisible(false)
      } else if (currentScrollY < lastScrollY) {
        setNavVisible(true)
      }
      setLastScrollY(currentScrollY)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [lastScrollY])

  useEffect(() => {
    const sentinel = sentinelRef.current
    if (!sentinel) return
    const observer = new IntersectionObserver(
      ([entry]) => setIsStuck(!entry.isIntersecting),
      { threshold: 0, rootMargin: '0px 0px 0px 0px' }
    )
    observer.observe(sentinel)
    return () => observer.disconnect()
  }, [])

  const [expandedMobile, setExpandedMobile] = useState<string | null>(null)

  const isItemActive = (item: { path?: string; children?: { path: string }[] }) => {
    if (item.path && pathname === item.path) return true
    if (item.children) {
      return item.children.some(child => {
        if (child.path === '/') return pathname === '/'
        return pathname.startsWith(child.path)
      })
    }
    return false
  }

  return (
    <>
      <div ref={sentinelRef} className="h-[1px] w-full" aria-hidden="true" />

      <div
        className={`hidden lg:block border-t sticky top-0 left-0 right-0 z-[60] w-full transition-all duration-300 ease-in-out ${
          navVisible ? 'translate-y-0' : '-translate-y-full'
        }`}
        style={{
          backgroundColor: isStuck ? '#0b2545' : '#ffffff',
          borderTopColor: isStuck ? 'rgba(255,255,255,0.08)' : '#e2e8f0',
          boxShadow: isStuck ? '0 4px 20px -2px rgba(11,37,69,0.35)' : 'none',
          transition: 'background-color 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease',
        }}
      >
        <nav className="w-full px-4 lg:px-12 flex flex-wrap justify-center gap-x-2 text-[15.5px] font-semibold tracking-wide">
          {navItemsList.map((item) => {
            const isActive = isItemActive(item)
            return (
              <div
                key={item.label}
                className="relative cursor-pointer"
                onMouseEnter={() => item.children && setActiveDropdown(item.label)}
                onMouseLeave={() => setActiveDropdown(null)}
              >
                {item.path && !item.children ? (
                  <Link
                    to={item.path}
                    className={`flex items-center py-3 px-4 transition-colors border-b-[3px] hover:border-accent ${
                      isActive ? 'border-accent' : 'border-transparent'
                    } ${
                      isStuck
                        ? (isActive ? 'text-accent' : 'text-white/80 hover:text-white')
                        : (isActive ? 'text-accent' : 'text-slate-850 hover:text-primary')
                    }`}
                  >
                    {item.label}
                  </Link>
                ) : (
                  <Link
                    to={item.children && item.children.length > 0 ? item.children[0].path : '#'}
                    onClick={() => setActiveDropdown(null)}
                    className={`flex items-center py-3 px-4 transition-colors border-b-[3px] hover:border-accent ${
                      isActive ? 'border-accent' : 'border-transparent'
                    } ${
                      isStuck
                        ? (isActive ? 'text-accent' : 'text-white/80 hover:text-white')
                        : (isActive ? 'text-accent' : 'text-slate-850 hover:text-primary')
                    }`}
                  >
                    {item.label}
                    {item.children && <ChevronDown size={14} className="ml-1.5 opacity-60 hover:opacity-100 transition-opacity" />}
                  </Link>
                )}
                {item.children && (
                  <div
                    className={`absolute top-[100%] left-0 w-64 bg-white border border-primary/10 shadow-[0_10px_25px_rgba(11,37,69,0.12)] transition-all duration-200 z-[100] rounded-sm ${
                      activeDropdown === item.label
                        ? 'opacity-100 visible translate-y-0'
                        : 'opacity-0 invisible translate-y-2 pointer-events-none'
                    }`}
                  >
                    <div className="h-[3px] bg-accent w-full"></div>
                    <ul className="py-2 text-[14px] text-primary font-medium tracking-normal max-h-[70vh] overflow-y-auto">
                      {item.children.map((child: any) => {
                        const isChildActive = pathname === child.path
                        return (
                          <li key={child.path}>
                            <Link
                              to={child.path}
                              onClick={() => setActiveDropdown(null)}
                              className={`block px-5 py-2.5 hover:bg-primary/5 hover:text-primary transition-all border-b border-primary/5 last:border-0 hover:pl-6 ${
                                isChildActive ? 'text-accent font-semibold' : ''
                              }`}
                            >
                              {child.label}
                            </Link>
                          </li>
                        )
                      })}
                    </ul>
                  </div>
                )}
              </div>
            )
          })}

        </nav>
      </div>

      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-[120] bg-white">
          <div className="flex h-full flex-col overflow-y-auto">
            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-100 bg-white px-4 py-4 text-slate-900 shadow-sm">
              <div className="flex min-w-0 items-center gap-3 pr-3">
                <div className="h-10 w-10 shrink-0 rounded-full bg-slate-50 p-1 border border-slate-200">
                  {/* Logo — dynamic from brandingService */}
                  <img src={branding.logoUrl} alt={branding.logoAlt} className="h-full w-full object-contain" />
                </div>
                <div className="min-w-0">
                  {/* Institution name — dynamic from brandingService */}
                  <p className="text-sm font-bold leading-tight text-primary sm:text-base">
                    {branding.fullName}
                  </p>
                </div>
              </div>
              <button
                className="rounded-full border border-slate-250 p-2 text-slate-600 transition-colors hover:bg-slate-100"
                onClick={onMobileClose}
                aria-label="Close navigation menu"
              >
                <X size={22} strokeWidth={2.5} />
              </button>
            </div>

            <nav className="flex-1 px-4 py-3 text-slate-850 bg-white">
              {navItemsList.map((item) => (
                <div key={item.label} className="border-b border-gray-200 last:border-0">
                  {item.children ? (
                    <>
                      <button
                        onClick={() => setExpandedMobile(expandedMobile === item.label ? null : item.label)}
                        className="flex items-center justify-between w-full px-1 py-4 text-base font-semibold tracking-wide text-left"
                      >
                        <span>{item.label}</span>
                        <ChevronDown size={18} className={`text-gray-500 transition-transform duration-200 ${expandedMobile === item.label ? 'rotate-180' : ''}`} />
                      </button>
                      {expandedMobile === item.label && (
                        <div className="pb-3 pl-4 space-y-0.5 animate-in slide-in-from-top-1 duration-200">
                          {item.children.map((child: any) => (
                            <Link
                              key={child.path}
                              to={child.path}
                              onClick={onMobileClose}
                              className="block px-3 py-2.5 text-sm text-slate-600 hover:text-primary rounded-lg hover:bg-gray-50 transition-colors"
                            >
                              {child.label}
                            </Link>
                          ))}
                        </div>
                      )}
                    </>
                  ) : item.path ? (
                    <Link
                      to={item.path}
                      onClick={onMobileClose}
                      className="flex items-center justify-between px-1 py-4 text-base font-semibold tracking-wide"
                    >
                      <span>{item.label}</span>
                    </Link>
                  ) : (
                    <div className="flex items-center justify-between px-1 py-4 text-base font-semibold tracking-wide">
                      <span>{item.label}</span>
                    </div>
                  )}
                </div>
              ))}

            </nav>

            <div className="border-t border-gray-200 bg-white px-4 py-5 text-slate-850">
              {/* Quick links grid — dynamic from navigationService.getQuickLinks() */}
              <div className="grid grid-cols-2 gap-3 text-sm font-medium">
                {quickLinks.map((ql) => (
                  <Link
                    key={ql.to}
                    to={ql.to}
                    onClick={onMobileClose}
                    className="rounded-xl border border-gray-200 bg-white px-4 py-3 transition-colors hover:bg-gray-50 text-center"
                  >
                    {ql.label}
                  </Link>
                ))}
              </div>

              {/* Login button — label from uiLabelsService */}
              <Link
                to="/login"
                onClick={onMobileClose}
                className="mt-4 flex items-center justify-center gap-2 rounded-full bg-primary px-4 py-3 text-sm font-semibold text-white transition-colors hover:opacity-90"
              >
                <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 3h4a2 2 0 012 2v14a2 2 0 01-2 2h-4M10 17l5-5-5-5M15 12H3" />
                </svg>
                {loginLabel}
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  )
}


// --- CAMPUS REVEAL BANNER COMPONENT ---
const CampusRevealBanner: React.FC = () => {
  const [isRevealed, setIsRevealed] = useState(false)
  const [preFooter, setPreFooter] = useState({
    imageUrl: '/assets/campus-panorama.png',
    label: 'SGSITS Campus Sunset Panorama'
  })
  const elementRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    contentService.getHomePage()
      .then(home => {
        if (home.preFooter) {
          setPreFooter(home.preFooter)
        }
      })
      .catch(err => console.error("Failed to load pre-footer reveal image:", err))
  }, [])

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsRevealed(entry.isIntersecting)
      },
      {
        threshold: 0.15,
      }
    )

    if (elementRef.current) {
      observer.observe(elementRef.current)
    }

    return () => {
      observer.disconnect()
    }
  }, [])

  return (
    <div
      ref={elementRef}
      className="relative w-full h-[180px] sm:h-[240px] md:h-[300px] lg:h-[360px] overflow-hidden border-t border-slate-200"
      style={{
        filter: isRevealed ? 'brightness(1)' : 'brightness(0.85)',
        transition: 'filter 1.2s cubic-bezier(0.4, 0, 0.2, 1)',
      }}
    >
      <img
        src={preFooter.imageUrl}
        alt={preFooter.label}
        className="w-full h-full object-cover transition-transform duration-[2000ms] ease-out"
        style={{
          transform: isRevealed ? 'scale(1)' : 'scale(1.05)',
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-[#f7f8fa]/20 via-transparent to-[#ffffff]/20 pointer-events-none" />
      <div className="absolute bottom-4 left-4 lg:left-12 bg-black/40 backdrop-blur-xs text-white px-3 py-1.5 rounded text-xs sm:text-sm font-semibold tracking-wide font-sans select-none pointer-events-none border border-white/10">
        {preFooter.label}
      </div>
    </div>
  )
}

// --- FOOTER COMPONENT ---
interface FooterProps {
  footerData: FooterData
  settings: SiteSettings
  depts: DepartmentSummary[]
}

const Footer: React.FC<FooterProps> = ({ footerData, settings, depts }) => {
  return (
    <>
      {/* Weather & Social Bar */}
      <div className="bg-white py-3 lg:px-12 px-4 shadow-sm border-t border-gray-250 border-b relative z-10 font-sans">
        <div className="max-w-[1400px] mx-auto flex flex-col md:flex-row justify-between items-center text-sm">
          <div className="flex items-center text-slate-800 font-bold mb-3 md:mb-0">
            <span className="mr-2">On Campus:</span>
            <Cloud size={20} className="mx-2 text-slate-600" />
            <span>35°C | Scattered clouds</span>
          </div>
          <div className="flex space-x-5 text-slate-600">
            {settings.socialLinks?.facebook && (
              <a href={settings.socialLinks.facebook} target="_blank" rel="noreferrer" className="hover:text-accent text-primary transition-colors"><svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" /></svg></a>
            )}
            {settings.socialLinks?.linkedin && (
              <a href={settings.socialLinks.linkedin} target="_blank" rel="noreferrer" className="hover:text-accent text-primary transition-colors"><svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" /><rect x="2" y="9" width="4" height="12" /><circle cx="4" cy="4" r="2" /></svg></a>
            )}
            {settings.socialLinks?.twitter && (
              <a href={settings.socialLinks.twitter} target="_blank" rel="noreferrer" className="hover:text-accent text-primary transition-colors"><svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24"><path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z" /></svg></a>
            )}
            {settings.socialLinks?.instagram && (
              <a href={settings.socialLinks.instagram} target="_blank" rel="noreferrer" className="hover:text-accent text-primary transition-colors"><svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><rect x="2" y="2" width="20" height="20" rx="5" ry="5" /><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" /><line x1="17.5" y1="6.5" x2="17.51" y2="6.5" /></svg></a>
            )}
            {settings.socialLinks?.youtube && (
              <a href={settings.socialLinks.youtube} target="_blank" rel="noreferrer" className="hover:text-accent text-primary transition-colors"><svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z" /><polygon fill="white" points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02" /></svg></a>
            )}
          </div>
        </div>
      </div>

      <footer className="bg-primary text-slate-300 pt-8 pb-6 relative z-10 font-sans border-t-4 border-accent">
        <div className="max-w-[1400px] mx-auto px-4 lg:px-12">
          {/* Section 1: Top Links */}
          <div className="flex flex-wrap gap-x-8 gap-y-3 font-semibold pb-5 border-b border-white/10 text-sm">
            {footerData.columns[0]?.links.map((link, idx) => (
              link.to ? (
                <Link key={idx} to={link.to} className="hover:text-white transition-colors">
                  {link.label}
                </Link>
              ) : (
                <a key={idx} href={link.href} target={link.external ? "_blank" : undefined} rel={link.external ? "noreferrer" : undefined} className="hover:text-white transition-colors">
                  {link.label}
                </a>
              )
            ))}
          </div>

          {/* Section 2: Categories */}
          <div className="flex flex-wrap gap-x-8 gap-y-3 font-semibold py-5 border-b border-white/10 text-sm">
            {footerData.columns[1]?.links.map((link, idx) => (
              link.to ? (
                <Link key={idx} to={link.to} className="flex items-center hover:text-white transition-colors">
                  {link.label}
                </Link>
              ) : (
                <a key={idx} href={link.href} target={link.external ? "_blank" : undefined} rel={link.external ? "noreferrer" : undefined} className="flex items-center hover:text-white transition-colors">
                  {link.label}
                </a>
              )
            ))}
          </div>

          {/* Section 3: Departments — loaded dynamically from departmentService */}
          <div className="py-8 border-b border-white/10">
            <h3 className="font-bold text-white text-lg mb-6 tracking-wide">Departments</h3>
            <div className="grid grid-cols-2 lg:grid-cols-4 md:grid-cols-3 gap-y-5 gap-x-6 text-sm font-medium">
              {depts.map((dept) => (
                <Link key={dept.slug} to={`/departments/${dept.slug}`} className="hover:text-white transition-colors">
                  {dept.shortName}
                </Link>
              ))}
            </div>
          </div>

          {/* Section 4: Policies / Reports */}
          <div className="flex flex-wrap gap-x-8 gap-y-3 font-bold text-white py-6 border-b border-white/10 text-sm">
            {footerData.portals.links.map((link, idx) => (
              <a key={idx} href={link.href} target="_blank" rel="noreferrer" className="hover:text-gray-300 transition-colors">
                {link.label}
              </a>
            ))}
            {footerData.visitorStats && (
              <span className="ml-auto text-xs text-slate-400 font-normal">
                {footerData.visitorStats.label}: <strong className="text-white font-bold">{footerData.visitorStats.count}</strong> ({footerData.visitorStats.note})
              </span>
            )}
          </div>

          {/* Section 5: Brand Identity */}
          <div className="py-6 border-b border-white/10 flex items-center">
            <div className="w-[60px] h-[60px] bg-white rounded-full p-1.5 shrink-0 mr-4 flex items-center justify-center border border-slate-200">
              <img src="/assets/image.png" alt="SGSITS Logo" className="w-full h-full object-contain" />
            </div>
            <div className="font-sans">
              <h2 className="text-white font-bold text-lg leading-tight">
                श्री गोविंदराम सेकसरिया प्रौद्योगिकी एवं विज्ञान संस्थान
              </h2>
              <p className="text-white font-medium text-xs mt-0.5 tracking-wide">
                {footerData.institution.name}
              </p>
            </div>
          </div>

          {/* Section 6: Base Footer */}
          <div className="pt-6 pb-2 flex flex-col md:flex-row justify-between items-start text-xs text-slate-400 space-y-4 md:space-y-0 relative">
            <div>
              <div className="space-x-2 mb-1.5">
                {footerData.bottomLinks.map((link, idx) => (
                  <React.Fragment key={idx}>
                    <Link to={link.to} className="hover:text-white transition-colors">{link.label}</Link>
                    {idx < footerData.bottomLinks.length - 1 && ' | '}
                  </React.Fragment>
                ))}
              </div>
              <p>© {new Date().getFullYear()} {footerData.institution.shortCode}SITS - All rights reserved</p>
            </div>
            <div className="text-left md:text-right">
              <p className="mb-0">Powered by<br className="hidden md:block" /> <span className="text-white font-medium">SGSITS Developers</span></p>
              <p className="mt-1">Website last updated on: 2026-04-10 20:00:02 PM</p>
            </div>
          </div>
        </div>
      </footer>
    </>
  )
}

// --- MAIN LAYOUT (DESKTOP LAYOUT) ---
const MainLayout: React.FC = () => {
  const location = useLocation()
  const { pathname } = location
  const [mobileOpen, setMobileOpen] = useState(false)

  // Dynamic States
  const [settings, setSettings] = useState<SiteSettings>(siteSettingsDefaults)
  const [topBar, setTopBar] = useState<TopBarData>(topBarDefaults)
  const [navItemsList, setNavItemsList] = useState<any[]>(navItemsDefault)
  const [footerData, setFooterData] = useState<FooterData>(footerDefaults)
  const [footerDepts, setFooterDepts] = useState<DepartmentSummary[]>([])
  const [alerts, setAlerts] = useState<any[]>([])
  // Branding, UI labels, and quick links — all backend-controlled
  const [branding, setBranding] = useState<BrandingConfig>(brandingDefaults)
  const [labels, setLabels] = useState<UiLabelsConfig>(uiLabelsDefaults)
  const [quickLinks, setQuickLinks] = useState<{ label: string; to: string }[]>(quickLinksDefaults)

  // Load configuration on mount
  useEffect(() => {
    const fetchLayoutConfig = async () => {
      try {
        const [
          loadedSettings,
          loadedTopBar,
          loadedNav,
          loadedFooter,
          loadedAlerts,
          loadedBranding,
          loadedLabels,
          loadedQuickLinks,
          loadedDepts,
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
        console.error('Failed to load layout CMS settings:', error)
      }
    }
    fetchLayoutConfig()
  }, [])

  // Scroll to content container if navigated from LeftSidebar, otherwise scroll to absolute top (e.g. from navbar tabs)
  useEffect(() => {
    const fromSidebar = location.state?.fromSidebar

    if (fromSidebar) {
      const timer = setTimeout(() => {
        const element = document.getElementById('sidebar-content-area')
        if (element) {
          const offset = 80 // height of sticky nav
          const elementPosition = element.getBoundingClientRect().top + window.pageYOffset
          window.scrollTo({
            top: elementPosition - offset,
            behavior: 'smooth'
          })
        }
      }, 50)
      return () => clearTimeout(timer)
    } else {
      window.scrollTo(0, 0)
    }
  }, [pathname, location.state])

  // Prevent scroll when mobile menu is open
  useEffect(() => {
    if (!mobileOpen) {
      document.body.style.overflow = ''
      return
    }
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = ''
    }
  }, [mobileOpen])

  // Filter and sort active alerts for announcements marquee
  const activeAlerts = alerts
    .filter((a: any) => a.isActive)
    .sort((a: any, b: any) => {
      const pA = typeof a.priority === 'number' ? a.priority : 100
      const pB = typeof b.priority === 'number' ? b.priority : 100
      return pA - pB
    })

  return (
    <div className="min-h-screen flex flex-col font-sans text-slate-800 bg-[#f7f8fa] transition-colors duration-300 w-full max-w-full overflow-x-hidden">
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

      {/* Announcements Marquee */}
      <div className="relative w-full bg-black text-slate-100 flex items-center border-t border-b border-zinc-800">
        {/* Label — dynamic from uiLabelsService (homepage.announcementsHeading) */}
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
