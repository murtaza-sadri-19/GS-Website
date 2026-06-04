import React, { useState, useEffect, useRef } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { X, ChevronDown, LayoutDashboard, LogOut, User } from 'lucide-react'
import { useAdminStore } from '../../store/adminStore'
import type { BrandingConfig } from '../../services/brandingService'

const ROLE_DASHBOARD: Record<string, string> = {
  SUPER_ADMIN: '/dashboard/central-admin/dashboard', CENTRAL_ADMIN: '/dashboard/central-admin/dashboard',
  CONTENT_EDITOR: '/dashboard/central-admin/dashboard', super_admin: '/dashboard/central-admin/dashboard',
  central_admin: '/dashboard/central-admin/dashboard', editor: '/dashboard/central-admin/dashboard',
  HOD: '/dashboard/hod/dashboard', hod: '/dashboard/hod/dashboard',
  TEACHER: '/dashboard/teacher/dashboard', teacher: '/dashboard/teacher/dashboard', faculty: '/dashboard/teacher/dashboard',
  EXAM_CONTROLLER: '/dashboard/exam/dashboard', exam_controller: '/dashboard/exam/dashboard',
  PLACEMENT_OFFICER: '/dashboard/placement/dashboard', placement_officer: '/dashboard/placement/dashboard',
}

const ROLE_LABEL: Record<string, string> = {
  SUPER_ADMIN: 'Super Admin', CENTRAL_ADMIN: 'Central Admin', CONTENT_EDITOR: 'Content Editor',
  super_admin: 'Super Admin', central_admin: 'Central Admin', editor: 'Editor',
  HOD: 'Head of Department', hod: 'Head of Department',
  TEACHER: 'Faculty', teacher: 'Faculty', faculty: 'Faculty',
  EXAM_CONTROLLER: 'Exam Controller', exam_controller: 'Exam Controller',
  PLACEMENT_OFFICER: 'Placement Officer', placement_officer: 'Placement Officer',
  student: 'Student',
}

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

interface StickyNavProps {
  mobileOpen: boolean
  onMobileClose: () => void
  navItemsList: any[]
  branding: BrandingConfig
  quickLinks: { label: string; to: string }[]
  loginLabel: string
}

const StickyNav: React.FC<StickyNavProps> = ({
  mobileOpen,
  onMobileClose,
  navItemsList,
  branding,
  quickLinks,
  loginLabel,
}) => {
  const navigate = useNavigate()
  const [isStuck,       setIsStuck]       = useState(false)
  const [expandedMobile, setExpandedMobile] = useState<string | null>(null)
  const sentinelRef = useRef<HTMLDivElement>(null)
  const { pathname } = useLocation()

  // Auth state
  const token     = useAdminStore((s) => s.token)
  const user      = useAdminStore((s) => s.user)
  const clearAuth = useAdminStore((s) => s.clearAuth)
  const isAuthenticated = !!token

  const dashboardPath = (user?.role && ROLE_DASHBOARD[user.role]) ?? '/dashboard/central-admin/dashboard'
  const dashboardBase = dashboardPath.substring(0, dashboardPath.lastIndexOf('/'))
  const roleLabel     = (user?.role && ROLE_LABEL[user.role]) ?? 'Staff'
  const userInitials  = user?.name
    ? user.name.split(' ').map((n) => n[0]).slice(0, 2).join('').toUpperCase()
    : 'U'

  const handleMobileLogout = () => {
    onMobileClose()
    clearAuth()
    navigate('/', { replace: true })
  }

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

  const isItemActive = (item: { path?: string; children?: { path: string }[] }) => {
    if (item.path && pathname === item.path) return true
    if (item.children) {
      return item.children.some((child) => {
        if (child.path === '/') return pathname === '/'
        return pathname.startsWith(child.path)
      })
    }
    return false
  }

  return (
    <>
      <div ref={sentinelRef} className="h-[1px] w-full" aria-hidden="true" />

      {/* Desktop nav */}
      <div
        className="hidden lg:block border-t sticky top-0 left-0 right-0 z-[60] w-full transition-all duration-300 ease-in-out"
        style={{
          backgroundColor: isStuck ? 'var(--color-primary)' : '#ffffff',
          borderTopColor: isStuck ? 'rgba(255,255,255,0.08)' : '#e2e8f0',
          boxShadow: isStuck ? '0 4px 20px -2px rgba(var(--color-primary-rgb), 0.35)' : 'none',
          transition: 'background-color 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease',
        }}
      >
        <nav className="w-full px-4 lg:px-12 flex flex-wrap justify-center gap-x-2 text-[15.5px] font-semibold tracking-wide">
          {navItemsList.map((item) => {
            const isActive = isItemActive(item)
            const navPath =
              item.path ??
              SECTION_PATHS[item.label] ??
              item.children?.[0]?.path ??
              '/'

            return (
              <Link
                key={item.label}
                to={navPath}
                className={`flex items-center py-3 px-4 transition-colors border-b-[3px] hover:border-accent ${
                  isActive ? 'border-accent' : 'border-transparent'
                } ${
                  isStuck
                    ? (isActive ? 'text-accent' : 'text-white/80 hover:text-white')
                    : (isActive ? 'text-accent' : 'text-slate-800 hover:text-primary')
                }`}
              >
                {item.label}
              </Link>
            )
          })}
        </nav>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-[120] bg-white">
          <div className="flex h-full flex-col overflow-y-auto">
            {/* Header */}
            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-100 bg-white px-4 py-4 text-slate-900 shadow-sm">
              <div className="flex min-w-0 items-center gap-3 pr-3">
                <div className="h-10 w-10 shrink-0 rounded-full bg-slate-50 p-1 border border-slate-200">
                  {branding.logoUrl && (
                    <img src={branding.logoUrl} alt={branding.logoAlt} className="h-full w-full object-contain" />
                  )}
                </div>
                <p className="text-sm font-bold leading-tight text-primary sm:text-base">
                  {branding.fullName}
                </p>
              </div>
              <button
                className="rounded-full border border-slate-200 p-2 text-slate-600 transition-colors hover:bg-slate-100"
                onClick={onMobileClose}
                aria-label="Close navigation menu"
              >
                <X size={22} strokeWidth={2.5} />
              </button>
            </div>

            {/* Nav links */}
            <nav className="flex-1 px-4 py-3 text-slate-800 bg-white">
              {navItemsList.map((item) => (
                <div key={item.label} className="border-b border-slate-200 last:border-0">
                  {item.children ? (
                    <>
                      <div className="flex items-center justify-between">
                        {item.path ? (
                          <Link
                            to={item.path}
                            onClick={onMobileClose}
                            className="flex-1 px-1 py-4 text-base font-semibold tracking-wide"
                          >
                            {item.label}
                          </Link>
                        ) : (
                          <span className="flex-1 px-1 py-4 text-base font-semibold tracking-wide">
                            {item.label}
                          </span>
                        )}
                        <button
                          onClick={() => setExpandedMobile(expandedMobile === item.label ? null : item.label)}
                          className="p-3 text-slate-500"
                          aria-label={`Expand ${item.label}`}
                        >
                          <ChevronDown
                            size={18}
                            className={`transition-transform duration-200 ${expandedMobile === item.label ? 'rotate-180' : ''}`}
                          />
                        </button>
                      </div>
                      {expandedMobile === item.label && (
                        <div className="pb-3 pl-4 space-y-0.5">
                          {item.children.map((child: any) => (
                            <Link
                              key={child.path}
                              to={child.path}
                              onClick={onMobileClose}
                              className="block px-3 py-2.5 text-sm text-slate-600 hover:text-primary rounded-lg hover:bg-slate-50 transition-colors"
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

            {/* Footer: quick links + auth */}
            <div className="border-t border-slate-200 bg-white px-4 py-5">
              {quickLinks.length > 0 && (
                <div className="grid grid-cols-2 gap-3 text-sm font-medium mb-4">
                  {quickLinks.map((ql) => (
                    <Link
                      key={ql.to}
                      to={ql.to}
                      onClick={onMobileClose}
                      className="rounded-xl border border-slate-200 bg-white px-4 py-3 transition-colors hover:bg-slate-50 text-center text-slate-700"
                    >
                      {ql.label}
                    </Link>
                  ))}
                </div>
              )}

              {/* ── Auth section ─────────────────────────────────────── */}
              {isAuthenticated ? (
                <div className="space-y-2">
                  {/* User identity strip */}
                  <div className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl bg-slate-50 border border-slate-100">
                    {user?.avatarUrl ? (
                      <img
                        src={user.avatarUrl}
                        alt={user.name}
                        className="w-9 h-9 rounded-full object-cover shrink-0"
                      />
                    ) : (
                      <div className="w-9 h-9 rounded-full bg-primary text-white text-sm font-bold flex items-center justify-center shrink-0 select-none">
                        {userInitials}
                      </div>
                    )}
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-slate-800 truncate">{user?.name ?? 'User'}</p>
                      <p className="text-xs text-slate-500 truncate">{roleLabel}</p>
                    </div>
                  </div>

                  <Link
                    to={dashboardPath}
                    onClick={onMobileClose}
                    className="flex items-center justify-center gap-2 w-full rounded-full bg-primary px-4 py-3 text-sm font-semibold text-white transition-colors hover:opacity-90"
                  >
                    <LayoutDashboard size={16} />
                    Dashboard
                  </Link>

                  <Link
                    to={`${dashboardBase}/profile`}
                    onClick={onMobileClose}
                    className="flex items-center justify-center gap-2 w-full rounded-full border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50"
                  >
                    <User size={16} className="text-slate-400" />
                    Profile
                  </Link>

                  <button
                    onClick={handleMobileLogout}
                    className="flex items-center justify-center gap-2 w-full rounded-full border border-red-200 px-4 py-3 text-sm font-semibold text-red-600 transition-colors hover:bg-red-50"
                  >
                    <LogOut size={16} />
                    Logout
                  </button>
                </div>
              ) : (
                <Link
                  to="/login"
                  onClick={onMobileClose}
                  className="flex items-center justify-center gap-2 w-full rounded-full bg-primary px-4 py-3 text-sm font-semibold text-white transition-colors hover:opacity-90"
                >
                  <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 3h4a2 2 0 012 2v14a2 2 0 01-2 2h-4M10 17l5-5-5-5M15 12H3" />
                  </svg>
                  {loginLabel}
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default StickyNav
