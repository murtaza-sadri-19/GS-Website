import React, { useState, useEffect, useRef } from 'react'
import { Link, NavLink, Outlet, useNavigate, useLocation } from 'react-router-dom'
import { useAdminStore } from '../../store/adminStore'
import { LayoutDashboard, Menu, X, LogOut, Home, ChevronRight } from 'lucide-react'

export interface PortalNavItem {
  label: string
  path: string
  icon: React.ComponentType<{ size?: number; className?: string }>
}

interface PortalLayoutProps {
  title: string
  subtitle: string
  navItems: PortalNavItem[]
  accentClass?: string   // e.g. 'bg-[#0b2545]' for exam dept
}

const PortalLayout: React.FC<PortalLayoutProps> = ({
  title,
  subtitle,
  navItems,
  accentClass = 'bg-primary',
}) => {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const { user, clearAuth } = useAdminStore()
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const mainRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (mainRef.current) {
      mainRef.current.scrollTop = 0
    }
  }, [pathname])

  const handleLogout = () => {
    clearAuth()
    navigate('/login', { replace: true })
  }

  const initials = (user?.name ?? 'U')
    .split(' ')
    .slice(0, 2)
    .map(w => w[0])
    .join('')
    .toUpperCase()

  return (
    <div className="h-screen flex flex-col bg-slate-50 font-sans overflow-hidden">
      {/* Top Header */}
      <header className={`${accentClass} text-white h-14 flex items-center px-4 gap-4 shadow-lg shrink-0 z-40 relative`}>
        {/* Mobile hamburger */}
        <button
          className="lg:hidden p-2 rounded hover:bg-white/10 transition-colors"
          onClick={() => setSidebarOpen(o => !o)}
        >
          {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
        </button>

        {/* Logo + Title */}
        <Link to="/" className="flex items-center gap-2.5 shrink-0">
          <img src="/assets/image.png" alt="SGSITS" className="w-8 h-8 object-contain bg-white rounded-full p-0.5" />
          <div className="hidden sm:block">
            <p className="text-sm font-bold leading-none">SGSITS Indore</p>
            <p className="text-[10px] text-white/60 leading-none mt-0.5">{subtitle}</p>
          </div>
        </Link>

        <div className="hidden lg:flex items-center gap-1 text-white/40 text-sm ml-2">
          <ChevronRight size={14} />
          <span className="text-white/80 font-semibold">{title}</span>
        </div>

        {/* Right side */}
        <div className="ml-auto flex items-center gap-3">
          <Link to="/" className="hidden sm:flex items-center gap-1.5 text-white/60 hover:text-white text-xs transition-colors">
            <Home size={13} />
            <span>Main Site</span>
          </Link>
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center text-xs font-bold">
              {initials}
            </div>
            <div className="hidden md:block text-right">
              <p className="text-xs font-semibold leading-none">{user?.name ?? 'User'}</p>
              <p className="text-[10px] text-white/50 leading-none mt-0.5 capitalize">{user?.role?.replace('_', ' ')}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-1.5 text-white/60 hover:text-white hover:bg-white/10 px-2.5 py-1.5 rounded text-xs font-medium transition-all"
            title="Logout"
          >
            <LogOut size={14} />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden min-h-0">
        {/* Overlay for mobile */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black/40 z-30 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Sidebar */}
        <aside
          className={`
            fixed lg:static inset-y-0 left-0 z-40 lg:z-auto
            w-60 bg-white border-r border-slate-200 shadow-sm
            flex flex-col transition-transform duration-300 ease-out
            ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
            top-14 lg:top-auto h-[calc(100vh-3.5rem)] lg:h-full
          `}
        >
          <div className="p-4 border-b border-slate-100 shrink-0">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{title}</p>
          </div>
          <nav className="flex-1 overflow-y-auto py-2">
            {navItems.map((item) => {
              const Icon = item.icon
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={() => setSidebarOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-4 py-2.5 text-sm font-medium transition-all mx-2 rounded-lg mb-0.5 ${
                      isActive
                        ? 'bg-primary/10 text-primary font-semibold'
                        : 'text-slate-600 hover:bg-slate-50 hover:text-slate-800'
                    }`
                  }
                >
                  <Icon size={16} className="shrink-0" />
                  <span>{item.label}</span>
                </NavLink>
              )
            })}
          </nav>

          <div className="p-3 border-t border-slate-100 shrink-0">
            <div className="bg-slate-50 rounded-lg px-3 py-2.5">
              <p className="text-[10px] text-slate-500 font-medium">Logged in as</p>
              <p className="text-xs font-bold text-slate-700 truncate mt-0.5">{user?.name ?? 'User'}</p>
              <p className="text-[10px] text-slate-400 truncate">{user?.email ?? ''}</p>
            </div>
          </div>
        </aside>

        {/* Main content */}
        <main ref={mainRef} className="flex-1 overflow-y-auto">
          <div className="p-4 lg:p-6 max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  )
}

// ── Portal Page Header ──────────────────────────────────────────────────
interface PageHeaderProps {
  title: string
  subtitle?: string
  action?: React.ReactNode
}
export const PageHeader: React.FC<PageHeaderProps> = ({ title, subtitle, action }) => (
  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-4 mb-6 border-b border-slate-200">
    <div>
      <h2 className="text-xl font-bold text-slate-800">{title}</h2>
      {subtitle && <p className="text-xs text-slate-500 mt-0.5">{subtitle}</p>}
    </div>
    {action && <div className="shrink-0">{action}</div>}
  </div>
)

// ── Portal Card ──────────────────────────────────────────────────────────
interface PortalCardProps {
  children: React.ReactNode
  className?: string
}
export const PortalCard: React.FC<PortalCardProps> = ({ children, className = '' }) => (
  <div className={`bg-white border border-slate-200 rounded-xl shadow-sm p-5 ${className}`}>
    {children}
  </div>
)

// ── Status Badge ─────────────────────────────────────────────────────────
interface BadgeProps { label: string; variant: 'success' | 'warning' | 'error' | 'info' | 'default' }
export const Badge: React.FC<BadgeProps> = ({ label, variant }) => {
  const cls = {
    success: 'bg-[#bfa15f]/10 text-[#bfa15f] border-[#bfa15f]/30',
    warning: 'bg-[#bfa15f]/15 text-[#bfa15f] border-[#bfa15f]/40',
    error:   'bg-[#0b2545]/5 text-[#0b2545] border-[#0b2545]/20',
    info:    'bg-[#0b2545]/10 text-[#0b2545] border-[#0b2545]/25',
    default: 'bg-slate-50 text-slate-600 border-slate-200',
  }[variant]
  return (
    <span className={`text-[10px] font-bold px-2 py-0.5 rounded border uppercase tracking-wide ${cls}`}>
      {label}
    </span>
  )
}

// ── Inline Table ─────────────────────────────────────────────────────────
interface TableProps<T> {
  headers: string[]
  rows: T[]
  renderRow: (row: T, idx: number) => React.ReactNode
  empty?: string
}
export function PortalTable<T>({ headers, rows, renderRow, empty = 'No data available.' }: TableProps<T>) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-slate-50 border-b border-slate-200">
            {headers.map(h => (
              <th key={h} className="text-left px-4 py-3 text-[11px] font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {rows.length === 0 ? (
            <tr>
              <td colSpan={headers.length} className="px-4 py-8 text-center text-sm text-slate-400">
                {empty}
              </td>
            </tr>
          ) : (
            rows.map((row, idx) => renderRow(row, idx))
          )}
        </tbody>
      </table>
    </div>
  )
}

// ── Portal Modal ─────────────────────────────────────────────────────────
interface ModalProps { isOpen: boolean; title: string; onClose: () => void; children: React.ReactNode; width?: string }
export const PortalModal: React.FC<ModalProps> = ({ isOpen, title, onClose, children, width = 'max-w-lg' }) => {
  if (!isOpen) return null
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className={`relative bg-white rounded-xl shadow-xl w-full ${width} max-h-[90vh] overflow-y-auto`}>
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-200">
          <h3 className="font-bold text-slate-800">{title}</h3>
          <button onClick={onClose} className="p-1 rounded hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors">
            <X size={18} />
          </button>
        </div>
        <div className="p-5">{children}</div>
      </div>
    </div>
  )
}

// ── Session Info Banner ───────────────────────────────────────────────────
export const SessionBanner: React.FC<{ session: string }> = ({ session }) => (
  <div className="mb-5 flex items-center gap-2 bg-primary/5 border border-primary/20 rounded-lg px-4 py-2.5">
    <LayoutDashboard size={14} className="text-primary shrink-0" />
    <span className="text-xs font-semibold text-primary">Current Session: {session}</span>
  </div>
)

export default PortalLayout
