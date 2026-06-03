import React, { useState, useEffect, useCallback } from 'react'
import {
  Search, Filter, Download, ChevronRight, ChevronDown,
  AlertTriangle, Shield, Info, Clock, User, Database,
  RefreshCw, X,
} from 'lucide-react'
import { auditService, type AuditLog, type AuditFilters, type AuditFilterOptions } from '../../services/auditService'
import { SkeletonTable } from '../../components/ui/Skeleton'

// ── Colour maps ───────────────────────────────────────────────────────────────
const ACTION_COLORS: Record<string, string> = {
  CREATE:                  'bg-emerald-50 text-emerald-700 border-emerald-200',
  UPDATE:                  'bg-blue-50 text-blue-700 border-blue-200',
  DELETE:                  'bg-red-50 text-red-700 border-red-200',
  LOGIN:                   'bg-slate-100 text-slate-600 border-slate-200',
  LOGOUT:                  'bg-slate-100 text-slate-500 border-slate-200',
  PUBLISH:                 'bg-violet-50 text-violet-700 border-violet-200',
  UNPUBLISH:               'bg-orange-50 text-orange-700 border-orange-200',
  UPLOAD:                  'bg-cyan-50 text-cyan-700 border-cyan-200',
  APPROVE:                 'bg-teal-50 text-teal-700 border-teal-200',
  REJECT:                  'bg-rose-50 text-rose-700 border-rose-200',
  PASSWORD_RESET_REQUEST:  'bg-yellow-50 text-yellow-700 border-yellow-200',
  PASSWORD_RESET_COMPLETE: 'bg-yellow-50 text-yellow-600 border-yellow-200',
  ROLE_CHANGE:             'bg-red-100 text-red-800 border-red-300',
}
const DEFAULT_ACTION_COLOR = 'bg-slate-100 text-slate-600 border-slate-200'

const SEVERITY_CONFIG = {
  low:      { label: 'Low',      cls: 'bg-slate-100 text-slate-500',  icon: null },
  medium:   { label: 'Medium',   cls: 'bg-blue-50 text-blue-600',     icon: null },
  high:     { label: 'High',     cls: 'bg-amber-50 text-amber-700',   icon: AlertTriangle },
  critical: { label: 'Critical', cls: 'bg-red-50 text-red-700',       icon: Shield },
}

// ── Helpers ───────────────────────────────────────────────────────────────────
function formatTs(ts: string) {
  const d = new Date(ts)
  return d.toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })
}

function roleBadge(role: string) {
  const map: Record<string, string> = {
    CENTRAL_ADMIN: 'bg-[#0b2545]/10 text-[#0b2545]',
    HOD:           'bg-[#bfa15f]/15 text-[#bfa15f]',
    TEACHER:       'bg-slate-100 text-slate-600',
    EXAM_CONTROLLER: 'bg-purple-50 text-purple-700',
    PLACEMENT_OFFICER: 'bg-teal-50 text-teal-700',
  }
  return map[role] ?? 'bg-slate-100 text-slate-500'
}

// ── Expanded row detail ───────────────────────────────────────────────────────
const LogDetail: React.FC<{ log: AuditLog }> = ({ log }) => (
  <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 text-xs font-mono space-y-3">
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div>
        <p className="font-sans font-bold text-slate-500 uppercase tracking-wider mb-1 text-[10px]">User Details</p>
        <p className="font-sans"><span className="text-slate-400">Name:</span> {log.user_name}</p>
        <p className="font-sans"><span className="text-slate-400">Email:</span> {log.user_email}</p>
        <p className="font-sans"><span className="text-slate-400">Role:</span> {log.user_role}</p>
      </div>
      <div>
        <p className="font-sans font-bold text-slate-500 uppercase tracking-wider mb-1 text-[10px]">Request Info</p>
        <p className="font-sans"><span className="text-slate-400">IP:</span> {log.ip_address || '—'}</p>
        <p className="font-sans truncate"><span className="text-slate-400">Agent:</span> {log.user_agent ? log.user_agent.substring(0, 80) : '—'}</p>
        <p className="font-sans"><span className="text-slate-400">Record ID:</span> {log.record_id ?? '—'}</p>
      </div>
      <div>
        <p className="font-sans font-bold text-slate-500 uppercase tracking-wider mb-1 text-[10px]">Changed Fields</p>
        {log.changed_fields?.length ? (
          <div className="flex flex-wrap gap-1">
            {log.changed_fields.map(f => (
              <span key={f} className="px-1.5 py-0.5 bg-blue-50 text-blue-700 rounded border border-blue-100 font-sans text-[10px]">{f}</span>
            ))}
          </div>
        ) : <p className="text-slate-400 font-sans">—</p>}
      </div>
    </div>

    {(log.old_value || log.new_value) && (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
        {log.old_value && (
          <div>
            <p className="font-sans font-bold text-red-400 text-[10px] uppercase tracking-wider mb-1">Old Value</p>
            <pre className="bg-red-50 border border-red-100 rounded p-2 overflow-x-auto text-red-800 text-[11px]">
              {JSON.stringify(log.old_value, null, 2)}
            </pre>
          </div>
        )}
        {log.new_value && (
          <div>
            <p className="font-sans font-bold text-emerald-500 text-[10px] uppercase tracking-wider mb-1">New Value</p>
            <pre className="bg-emerald-50 border border-emerald-100 rounded p-2 overflow-x-auto text-emerald-800 text-[11px]">
              {JSON.stringify(log.new_value, null, 2)}
            </pre>
          </div>
        )}
      </div>
    )}
  </div>
)

// ── Main page ─────────────────────────────────────────────────────────────────
const AdminAuditLogs: React.FC = () => {
  const [logs,    setLogs]    = useState<AuditLog[]>([])
  const [total,   setTotal]   = useState(0)
  const [pages,   setPages]   = useState(1)
  const [loading, setLoading] = useState(true)
  const [expanded, setExpanded] = useState<number | null>(null)
  const [filterOpts, setFilterOpts] = useState<AuditFilterOptions>({ actions: [], modules: [], severities: [] })

  const [filters, setFilters] = useState<AuditFilters>({ page: 1, pageSize: 50 })
  const [search,  setSearch]  = useState('')
  const [showFilters, setShowFilters] = useState(false)

  const load = useCallback(async (f: AuditFilters) => {
    setLoading(true)
    try {
      const result = await auditService.getLogs(f)
      setLogs(result.logs)
      setTotal(result.pagination.total)
      setPages(result.pagination.totalPages)
    } catch { /* silent */ }
    finally  { setLoading(false) }
  }, [])

  useEffect(() => {
    auditService.getFilterOptions().then(setFilterOpts).catch(() => {})
  }, [])

  useEffect(() => {
    load(filters)
  }, [filters, load])

  // Debounced search
  useEffect(() => {
    const t = setTimeout(() => setFilters(f => ({ ...f, search: search || undefined, page: 1 })), 400)
    return () => clearTimeout(t)
  }, [search])

  const setFilter = (key: keyof AuditFilters, val: string) =>
    setFilters(f => ({ ...f, [key]: val || undefined, page: 1 }))

  const clearFilters = () => {
    setSearch('')
    setFilters({ page: 1, pageSize: 50 })
  }

  const activeFilterCount = Object.keys(filters).filter(
    k => !['page','pageSize'].includes(k) && (filters as any)[k]
  ).length + (search ? 1 : 0)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h2 className="font-display text-2xl font-bold text-slate-800">Activity Logs</h2>
          <p className="text-sm text-slate-500 mt-0.5">
            Complete audit trail — every action by every user, permanently stored.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => load(filters)}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
          >
            <RefreshCw size={13} /> Refresh
          </button>
          <button
            onClick={() => auditService.exportCsv(filters)}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold bg-primary text-white rounded-lg hover:opacity-90 transition-opacity"
          >
            <Download size={13} /> Export CSV
          </button>
        </div>
      </div>

      {/* Stats strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'Total Logs',  value: total.toLocaleString(), color: 'text-primary'   },
          { label: 'This Page',   value: logs.length,             color: 'text-slate-700' },
          { label: 'Critical',    value: logs.filter(l => l.severity === 'critical').length, color: 'text-red-600' },
          { label: 'Deletions',   value: logs.filter(l => l.action === 'DELETE').length,     color: 'text-red-500' },
        ].map(s => (
          <div key={s.label} className="bg-white border border-slate-200 rounded-lg px-4 py-3 text-center">
            <p className={`text-xl font-display font-bold ${s.color}`}>{s.value}</p>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Search + Filters */}
      <div className="bg-white border border-slate-200 rounded-lg p-4 space-y-3">
        <div className="flex gap-3">
          <div className="relative flex-grow">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search description, entity, user name or email…"
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-8 pr-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:border-primary/50"
            />
          </div>
          <button
            onClick={() => setShowFilters(v => !v)}
            className={`flex items-center gap-1.5 px-3 py-2 text-xs font-semibold border rounded-lg transition-colors ${
              showFilters ? 'bg-primary/10 border-primary/30 text-primary' : 'border-slate-200 hover:bg-slate-50'
            }`}
          >
            <Filter size={13} />
            Filters
            {activeFilterCount > 0 && (
              <span className="bg-primary text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                {activeFilterCount}
              </span>
            )}
          </button>
          {activeFilterCount > 0 && (
            <button
              onClick={clearFilters}
              className="flex items-center gap-1 px-3 py-2 text-xs font-semibold text-red-500 border border-red-200 rounded-lg hover:bg-red-50"
            >
              <X size={13} /> Clear
            </button>
          )}
        </div>

        {showFilters && (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 pt-2 border-t border-slate-100">
            {[
              { key: 'action',      label: 'Action',   opts: filterOpts.actions   },
              { key: 'module_name', label: 'Module',   opts: filterOpts.modules   },
              { key: 'severity',    label: 'Severity', opts: filterOpts.severities },
            ].map(({ key, label, opts }) => (
              <select
                key={key}
                value={(filters as any)[key] || ''}
                onChange={e => setFilter(key as keyof AuditFilters, e.target.value)}
                className="text-xs border border-slate-200 rounded-lg px-2 py-1.5 focus:outline-none focus:border-primary/50 bg-white"
              >
                <option value="">All {label}s</option>
                {opts.map(o => <option key={o} value={o}>{o}</option>)}
              </select>
            ))}
            <input
              type="date"
              value={(filters.date_from as string) || ''}
              onChange={e => setFilter('date_from', e.target.value)}
              className="text-xs border border-slate-200 rounded-lg px-2 py-1.5 focus:outline-none col-span-1"
              placeholder="From"
            />
            <input
              type="date"
              value={(filters.date_to as string) || ''}
              onChange={e => setFilter('date_to', e.target.value)}
              className="text-xs border border-slate-200 rounded-lg px-2 py-1.5 focus:outline-none col-span-1"
              placeholder="To"
            />
            <select
              value={filters.pageSize || 50}
              onChange={e => setFilters(f => ({ ...f, pageSize: Number(e.target.value), page: 1 }))}
              className="text-xs border border-slate-200 rounded-lg px-2 py-1.5 focus:outline-none bg-white"
            >
              {[25, 50, 100, 200].map(n => <option key={n} value={n}>{n} per page</option>)}
            </select>
          </div>
        )}
      </div>

      {/* Table */}
      <div className="bg-white border border-slate-200 rounded-lg overflow-hidden">
        {loading ? (
          <SkeletonTable />
        ) : logs.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-slate-400">
            <Database size={36} className="mb-3 opacity-30" />
            <p className="font-medium text-sm">No logs match the current filters</p>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50">
                <th className="text-left px-4 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider w-36">Timestamp</th>
                <th className="text-left px-4 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider">User</th>
                <th className="text-left px-4 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider w-28">Action</th>
                <th className="text-left px-4 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider w-28">Module</th>
                <th className="text-left px-4 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Description</th>
                <th className="text-left px-4 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider w-20">Severity</th>
                <th className="w-8" />
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {logs.map(log => {
                const isOpen = expanded === log.id
                const sev    = SEVERITY_CONFIG[log.severity] ?? SEVERITY_CONFIG.low
                const SevIcon = sev.icon
                return (
                  <React.Fragment key={log.id}>
                    <tr
                      className={`hover:bg-slate-50 cursor-pointer transition-colors ${
                        log.severity === 'critical' ? 'bg-red-50/40' :
                        log.severity === 'high'     ? 'bg-amber-50/30' : ''
                      }`}
                      onClick={() => setExpanded(isOpen ? null : log.id)}
                    >
                      <td className="px-4 py-3 text-xs text-slate-500 whitespace-nowrap">
                        <div className="flex items-center gap-1">
                          <Clock size={11} className="text-slate-300 shrink-0" />
                          {formatTs(log.created_at)}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-full bg-primary/10 text-primary flex items-center justify-center text-[10px] font-bold shrink-0">
                            {log.user_name.charAt(0).toUpperCase()}
                          </div>
                          <div className="min-w-0">
                            <p className="font-semibold text-slate-800 text-xs truncate">{log.user_name}</p>
                            <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${roleBadge(log.user_role)}`}>
                              {log.user_role.replace('_', ' ')}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded border uppercase tracking-wide ${ACTION_COLORS[log.action] ?? DEFAULT_ACTION_COLOR}`}>
                          {log.action.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div>
                          <p className="text-xs font-semibold text-primary capitalize">{log.module_name}</p>
                          {log.entity_name && <p className="text-[10px] text-slate-400 truncate max-w-[100px]">{log.entity_name}</p>}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-xs text-slate-600 max-w-xs">
                        <p className="truncate">{log.description}</p>
                      </td>
                      <td className="px-4 py-3">
                        <div className={`flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded ${sev.cls}`}>
                          {SevIcon && <SevIcon size={10} />}
                          {sev.label}
                        </div>
                      </td>
                      <td className="px-3 py-3 text-slate-300">
                        {isOpen ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                      </td>
                    </tr>
                    {isOpen && (
                      <tr>
                        <td colSpan={7} className="p-0">
                          <LogDetail log={log} />
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                )
              })}
            </tbody>
          </table>
        )}
      </div>

      {/* Pagination */}
      {pages > 1 && (
        <div className="flex items-center justify-between text-xs text-slate-500">
          <span>Page {filters.page} of {pages} · {total.toLocaleString()} total entries</span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setFilters(f => ({ ...f, page: Math.max(1, (f.page ?? 1) - 1) }))}
              disabled={(filters.page ?? 1) <= 1}
              className="px-3 py-1.5 border border-slate-200 rounded font-semibold hover:bg-slate-50 disabled:opacity-40"
            >
              Previous
            </button>
            {Array.from({ length: Math.min(7, pages) }).map((_, i) => {
              const p = i + 1
              return (
                <button
                  key={p}
                  onClick={() => setFilters(f => ({ ...f, page: p }))}
                  className={`px-3 py-1.5 rounded font-semibold ${
                    filters.page === p ? 'bg-primary text-white' : 'border border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  {p}
                </button>
              )
            })}
            {pages > 7 && <span>…</span>}
            <button
              onClick={() => setFilters(f => ({ ...f, page: Math.min(pages, (f.page ?? 1) + 1) }))}
              disabled={(filters.page ?? 1) >= pages}
              className="px-3 py-1.5 border border-slate-200 rounded font-semibold hover:bg-slate-50 disabled:opacity-40"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default AdminAuditLogs
