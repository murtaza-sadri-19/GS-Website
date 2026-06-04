import React, { useState, useEffect, useRef } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useUIStore } from '../../../store/uiStore'
import { navService, navItemsDefault } from '../../../services/navService'
import type { NavItem } from '../../../services/navService'
import { brandingService, brandingDefaults } from '../../../services/brandingService'
import { uiLabelsService, uiLabelsDefaults } from '../../../services/uiLabelsService'
import type { BrandingConfig } from '../../../services/brandingService'
import type { UiLabelsConfig } from '../../../services/uiLabelsService'
import { useAdminStore } from '../../../store/adminStore'
import TopAccessibilityBar from './TopAccessibilityBar'
import Logo from './Logo'
import SearchBar from './SearchBar'
import {
  Menu, X, ChevronDown, Bell, User, LogOut,
  LayoutDashboard, Settings, Activity,
} from 'lucide-react'

// ── Role → dashboard route mapping ───────────────────────────────────────────
const ROLE_DASHBOARD: Record<string, string> = {
  SUPER_ADMIN:       '/dashboard/central-admin/dashboard',
  CENTRAL_ADMIN:     '/dashboard/central-admin/dashboard',
  CONTENT_EDITOR:    '/dashboard/central-admin/dashboard',
  super_admin:       '/dashboard/central-admin/dashboard',
  central_admin:     '/dashboard/central-admin/dashboard',
  editor:            '/dashboard/central-admin/dashboard',
  HOD:               '/dashboard/hod/dashboard',
  hod:               '/dashboard/hod/dashboard',
  TEACHER:           '/dashboard/teacher/dashboard',
  teacher:           '/dashboard/teacher/dashboard',
  faculty:           '/dashboard/teacher/dashboard',
  EXAM_CONTROLLER:   '/dashboard/exam/dashboard',
  exam_controller:   '/dashboard/exam/dashboard',
  PLACEMENT_OFFICER: '/dashboard/placement/dashboard',
  placement_officer: '/dashboard/placement/dashboard',
}

const ROLE_LABEL: Record<string, string> = {
  SUPER_ADMIN:       'Super Admin',
  CENTRAL_ADMIN:     'Central Admin',
  CONTENT_EDITOR:    'Content Editor',
  super_admin:       'Super Admin',
  central_admin:     'Central Admin',
  editor:            'Editor',
  HOD:               'Head of Department',
  hod:               'Head of Department',
  TEACHER:           'Faculty',
  teacher:           'Faculty',
  faculty:           'Faculty',
  EXAM_CONTROLLER:   'Exam Controller',
  exam_controller:   'Exam Controller',
  PLACEMENT_OFFICER: 'Placement Officer',
  placement_officer: 'Placement Officer',
  student:           'Student',
}

function getDashboardPath(role?: string | null): string {
  return (role && ROLE_DASHBOARD[role]) ?? '/dashboard/central-admin/dashboard'
}

function getRoleLabel(role?: string | null): string {
  return (role && ROLE_LABEL[role]) ?? 'Staff'
}

// ─────────────────────────────────────────────────────────────────────────────

const SECTION_PATHS: Record<string, string> = {
  'Home':        '/',
  'About Us':    '/about',
  'Academics':   '/academics',
  'Departments': '/departments',
  'Admissions':  '/admission',
  'Placements':  '/placement',
  'Campus Life': '/campus-life',
  'Facilities':  '/facilities',
  'More':        '/more',
}

// ─────────────────────────────────────────────────────────────────────────────

const Header: React.FC = () => {
  const location  = useLocation()
  const navigate  = useNavigate()
  const { mobileMenuOpen, toggleMobileMenu } = useUIStore()

  const [expandedMobileItem, setExpandedMobileItem] = useState<string | null>(null)
  const [userDropdownOpen,   setUserDropdownOpen]   = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // ── Auth state — sourced from Zustand persist (survives page refresh) ──────
  const token     = useAdminStore((s) => s.token)
  const user      = useAdminStore((s) => s.user)
  const clearAuth = useAdminStore((s) => s.clearAuth)
  const isAuthenticated = !!token

  const dashboardPath = getDashboardPath(user?.role)
  // e.g. '/dashboard/central-admin/dashboard' → base '/dashboard/central-admin'
  const dashboardBase = dashboardPath.substring(0, dashboardPath.lastIndexOf('/'))

  const userInitials = user?.name
    ? user.name.split(' ').map((n) => n[0]).slice(0, 2).join('').toUpperCase()
    : 'U'

  // Close dropdown when clicking outside
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setUserDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  // Close dropdown on route change
  useEffect(() => { setUserDropdownOpen(false) }, [location.pathname])

  const handleLogout = () => {
    clearAuth()
    setUserDropdownOpen(false)
    navigate('/', { replace: true })
  }

  const handleMobileLogout = () => {
    toggleMobileMenu()
    clearAuth()
    navigate('/', { replace: true })
  }

  // ── Service-driven data ───────────────────────────────────────────────────
  const [navItems,   setNavItems]   = useState<NavItem[]>(navItemsDefault)
  const [branding,   setBranding]   = useState<BrandingConfig>(brandingDefaults)
  const [labels,     setLabels]     = useState<UiLabelsConfig>(uiLabelsDefaults)
  const [navLoading, setNavLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      navService.getNavItems(),
      brandingService.getBranding(),
      uiLabelsService.getUiLabels(),
    ]).then(([nav, brand, lbl]) => {
      setNavItems(nav)
      setBranding(brand)
      setLabels(lbl)
      setNavLoading(false)
    })
  }, [])

  // ─────────────────────────────────────────────────────────────────────────
  return (
    <header className="w-full z-50 relative">
      <TopAccessibilityBar />

      {/* Main sticky nav bar */}
      <div className="w-full bg-white sticky top-0 border-b border-slate-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.05)] transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 py-3.5 flex items-center justify-between">
          <Logo />

          {/* Desktop nav links */}
          {navLoading ? (
            <div className="hidden lg:flex items-center gap-2">
              {[64, 80, 96, 104, 84, 92, 88, 60].map((w, i) => (
                <div key={i} className="h-7 rounded-md bg-slate-100 animate-pulse" style={{ width: w }} />
              ))}
              <div className="ml-2 h-7 w-20 rounded-md bg-slate-200 animate-pulse" />
            </div>
          ) : (
            <nav className="hidden lg:flex items-center gap-1">
              {navItems.map((item) => {
                const navPath =
                  item.path ??
                  SECTION_PATHS[item.label] ??
                  item.children?.[0]?.path ??
                  '/'
                const isActive =
                  navPath === '/'
                    ? location.pathname === '/'
                    : location.pathname.startsWith(navPath) ||
                      item.children?.some((child) => location.pathname === child.path)

                return (
                  <div key={item.label} className="relative py-2">
                    <Link
                      to={navPath}
                      className={`px-3 py-1.5 rounded-md text-sm font-medium tracking-wide transition-colors duration-200 flex items-center ${
                        isActive
                          ? 'text-brand-burgundy font-semibold'
                          : 'text-slate-700 hover:text-brand-burgundy hover:bg-slate-50'
                      }`}
                    >
                      {item.label}
                    </Link>
                    <span
                      className={`absolute bottom-0 left-1/2 -translate-x-1/2 h-0.5 rounded-full bg-brand-burgundy transition-all duration-300 ${
                        isActive ? 'w-3/4 opacity-100' : 'w-0 opacity-0'
                      }`}
                    />
                  </div>
                )
              })}
            </nav>
          )}

          {/* Right-side actions */}
          <div className="flex items-center gap-2">
            <SearchBar />
            <span className="lg:hidden"><SearchBar dark /></span>

            {/* ── Desktop auth section ──────────────────────────────────── */}
            {isAuthenticated ? (
              <div className="hidden lg:flex items-center gap-1">
                {/* Dashboard button */}
                <Link
                  to={dashboardPath}
                  className="flex items-center gap-1.5 px-4 py-1.5 rounded-md bg-brand-burgundy text-white text-sm font-semibold hover:opacity-90 transition-opacity"
                >
                  <LayoutDashboard className="w-4 h-4" />
                  Dashboard
                </Link>

                {/* Notification bell */}
                <button
                  className="p-2 rounded-xl text-slate-500 hover:text-brand-burgundy hover:bg-slate-50 transition-colors"
                  title="Notifications"
                  aria-label="Notifications"
                >
                  <Bell className="w-5 h-5" />
                </button>

                {/* Avatar + dropdown */}
                <div className="relative" ref={dropdownRef}>
                  <button
                    onClick={() => setUserDropdownOpen((o) => !o)}
                    className="flex items-center gap-1 p-1 rounded-xl hover:bg-slate-50 transition-colors"
                    aria-label="Account menu"
                    aria-expanded={userDropdownOpen}
                  >
                    {user?.avatarUrl ? (
                      <img
                        src={user.avatarUrl}
                        alt={user.name}
                        className="w-8 h-8 rounded-full object-cover border-2 border-brand-burgundy/20"
                      />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-brand-burgundy text-white text-xs font-bold flex items-center justify-center select-none">
                        {userInitials}
                      </div>
                    )}
                    <ChevronDown
                      className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 ${userDropdownOpen ? 'rotate-180' : ''}`}
                    />
                  </button>

                  {userDropdownOpen && (
                    <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-xl border border-slate-200 shadow-lg py-1 z-50">
                      {/* Identity header */}
                      <div className="px-4 py-3 border-b border-slate-100">
                        <div className="flex items-center gap-2.5">
                          {user?.avatarUrl ? (
                            <img
                              src={user.avatarUrl}
                              alt={user.name}
                              className="w-9 h-9 rounded-full object-cover border-2 border-brand-burgundy/20 shrink-0"
                            />
                          ) : (
                            <div className="w-9 h-9 rounded-full bg-brand-burgundy text-white text-sm font-bold flex items-center justify-center shrink-0 select-none">
                              {userInitials}
                            </div>
                          )}
                          <div className="min-w-0">
                            <p className="text-sm font-semibold text-slate-800 truncate">{user?.name ?? 'User'}</p>
                            <p className="text-xs text-slate-500 truncate">{getRoleLabel(user?.role)}</p>
                          </div>
                        </div>
                      </div>

                      {/* Menu items */}
                      <div className="py-1">
                        <Link
                          to={dashboardPath}
                          className="flex items-center gap-2.5 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 hover:text-brand-burgundy transition-colors"
                        >
                          <LayoutDashboard className="w-4 h-4 text-slate-400" />
                          Dashboard
                        </Link>
                        <Link
                          to={`${dashboardBase}/settings`}
                          className="flex items-center gap-2.5 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 hover:text-brand-burgundy transition-colors"
                        >
                          <Settings className="w-4 h-4 text-slate-400" />
                          Settings
                        </Link>
                        <Link
                          to={`${dashboardBase}/activity`}
                          className="flex items-center gap-2.5 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 hover:text-brand-burgundy transition-colors"
                        >
                          <Activity className="w-4 h-4 text-slate-400" />
                          Activity
                        </Link>
                      </div>

                      <div className="border-t border-slate-100 py-1">
                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center gap-2.5 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                        >
                          <LogOut className="w-4 h-4" />
                          Logout
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <Link
                to="/login"
                className="hidden lg:flex items-center gap-1.5 px-4 py-1.5 rounded-md border border-brand-burgundy text-brand-burgundy text-sm font-semibold hover:bg-brand-burgundy hover:text-white transition-colors"
              >
                {labels.header.loginLabel || 'Login'}
              </Link>
            )}

            {/* Mobile hamburger */}
            <button
              onClick={toggleMobileMenu}
              className="lg:hidden p-2 rounded-xl text-slate-500 hover:text-brand-burgundy hover:bg-slate-50 transition-colors"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* ── Mobile drawer ──────────────────────────────────────────────────── */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-40 flex">
          <div
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm"
            onClick={toggleMobileMenu}
          />

          <div className="relative w-80 max-w-[85vw] ml-auto h-full bg-white dark:bg-slate-900 shadow-2xl flex flex-col z-50 animate-slide-in-right transition-colors duration-300">
            {/* Drawer header */}
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

            {/* Nav links */}
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
                          <ChevronDown
                            className={`w-4 h-4 transition-transform duration-200 ${
                              isExpanded ? 'rotate-180 text-brand-burgundy dark:text-brand-gold' : ''
                            }`}
                          />
                        </button>

                        {isExpanded && (
                          <div className="mt-1 ml-3 pl-3 border-l-2 border-slate-100 dark:border-slate-800 space-y-1 py-1">
                            {item.children?.map((child) => {
                              const childPath = child.path ?? '/'
                              const isChildActive = location.pathname === childPath
                              return (
                                <Link
                                  key={child.label}
                                  to={childPath}
                                  onClick={toggleMobileMenu}
                                  className={`block py-1.5 px-3 rounded-lg text-xs font-semibold ${
                                    isChildActive
                                      ? 'text-brand-burgundy dark:text-brand-gold bg-brand-burgundy/5 dark:bg-brand-gold/5'
                                      : 'text-slate-500 hover:text-brand-burgundy dark:text-slate-400 dark:hover:text-brand-gold'
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

            {/* ── Drawer footer — auth actions ─────────────────────────── */}
            <div className="p-4 border-t border-slate-200/80 dark:border-slate-800 space-y-2">
              {isAuthenticated ? (
                <>
                  {/* User identity strip */}
                  <div className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg bg-slate-50 dark:bg-slate-800">
                    {user?.avatarUrl ? (
                      <img
                        src={user.avatarUrl}
                        alt={user.name}
                        className="w-8 h-8 rounded-full object-cover border-2 border-brand-burgundy/20 shrink-0"
                      />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-brand-burgundy text-white text-xs font-bold flex items-center justify-center shrink-0 select-none">
                        {userInitials}
                      </div>
                    )}
                    <div className="min-w-0">
                      <p className="text-xs font-semibold text-slate-800 dark:text-white truncate">{user?.name ?? 'User'}</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{getRoleLabel(user?.role)}</p>
                    </div>
                  </div>

                  <Link
                    to={dashboardPath}
                    onClick={toggleMobileMenu}
                    className="flex items-center gap-2.5 w-full px-3 py-2.5 rounded-lg bg-brand-burgundy text-white text-sm font-semibold hover:opacity-90 transition-opacity"
                  >
                    <LayoutDashboard className="w-4 h-4" />
                    Dashboard
                  </Link>

                  <button
                    onClick={handleMobileLogout}
                    className="flex items-center gap-2.5 w-full px-3 py-2 rounded-lg text-red-600 text-sm font-medium hover:bg-red-50 transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    Logout
                  </button>
                </>
              ) : (
                <Link
                  to="/login"
                  onClick={toggleMobileMenu}
                  className="flex items-center justify-center gap-2 w-full px-4 py-2.5 rounded-lg bg-brand-burgundy text-white text-sm font-bold hover:opacity-90 transition-opacity"
                >
                  {labels.header.loginLabel || 'Login'}
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  )
}

export default Header
