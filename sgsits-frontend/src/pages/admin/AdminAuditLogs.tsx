import React, { useState, useEffect, useCallback, useMemo } from 'react'
import {
  Search, Filter, Download, AlertTriangle, Shield, Clock,
  RefreshCw, X, CheckCircle, XCircle, Monitor, Smartphone,
  Tablet, Globe, ChevronDown, ChevronRight, Eye, LayoutList,
  Activity, User, Hash,
} from 'lucide-react'
import {
  auditService,
  type AuditLog,
  type AuditFilters,
  type AuditFilterOptions,
  type AuditStats,
} from '../../services/auditService'
import { SkeletonTable } from '../../components/ui/Skeleton'
import { formatInIST, formatDateOnlyIST, formatTimeShort } from '../../utils/timezone'

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
  low:      { label: 'Low',      cls: 'bg-slate-100 text-slate-500',  dotCls: 'bg-slate-400',  Icon: null },
  medium:   { label: 'Medium',   cls: 'bg-blue-50 text-blue-600',     dotCls: 'bg-blue-400',   Icon: null },
  high:     { label: 'High',     cls: 'bg-amber-50 text-amber-700',   dotCls: 'bg-amber-400',  Icon: AlertTriangle },
  critical: { label: 'Critical', cls: 'bg-red-50 text-red-700',       dotCls: 'bg-red-500',    Icon: Shield },
}

const STATUS_CONFIG = {
  success: { label: 'Success', cls: 'bg-emerald-50 text-emerald-700 border-emerald-200', Icon: CheckCircle },
  failure: { label: 'Failed',  cls: 'bg-red-50 text-red-600 border-red-200',             Icon: XCircle   },
}

function roleBadgeCls(role: string): string {
  const map: Record<string, string> = {
    CENTRAL_ADMIN:     'bg-primary/10 text-primary',
    HOD:               'bg-accent/15 text-accent',
    TEACHER:           'bg-slate-100 text-slate-600',
    EXAM_CONTROLLER:   'bg-purple-50 text-purple-700',
    PLACEMENT_OFFICER: 'bg-teal-50 text-teal-700',
  }
  return map[role] ?? 'bg-slate-100 text-slate-500'
}

function DeviceIcon({ device }: { device: string | null }) {
  if (device === 'Mobile')  return <Smartphone size={12} className="shrink-0" />
  if (device === 'Tablet')  return <Tablet     size={12} className="shrink-0" />
  return <Monitor size={12} className="shrink-0" />
}

// ── Group logs by calendar date in IST ────────────────────────────────────────

function groupByDate(logs: AuditLog[]): { date: string; entries: AuditLog[] }[] {
  const map = new Map<string, AuditLog[]>()
  for (const log of logs) {
    const key = formatDateOnlyIST(log.created_at)
    if (!map.has(key)) map.set(key, [])
    map.get(key)!.push(log)
  }
  return Array.from(map.entries()).map(([date, entries]) => ({ date, entries }))
}

// ── Detail Modal ──────────────────────────────────────────────────────────────

const LogDetailModal: React.FC<{ log: AuditLog; onClose: () => void }> = ({ log, onClose }) => {
  const sev    = SEVERITY_CONFIG[log.severity]    ?? SEVERITY_CONFIG.low
  const status = STATUS_CONFIG[log.status]        ?? STATUS_CONFIG.success
  const SevIcon    = sev.Icon
  const StatusIcon = status.Icon

  // Compute field-level diff when changed_fields is present
  const diffRows = useMemo(() => {
    if (!log.changed_fields?.length) return null
    return log.changed_fields.map(field => ({
      field,
      before: log.old_value ? (log.old_value as any)[field] : undefined,
      after:  log.new_value ? (log.new_value as any)[field] : undefined,
    }))
  }, [log])

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
      onClick={e => { if (e.target === e.currentTarget) onClose() }}
    >
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        {/* Modal header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 sticky top-0 bg-white z-10">
          <div className="flex items-center gap-3">
            <span className={`text-xs font-bold px-2.5 py-1 rounded border uppercase tracking-wide ${ACTION_COLORS[log.action] ?? DEFAULT_ACTION_COLOR}`}>
              {log.action.replace(/_/g, ' ')}
            </span>
            <span className={`flex items-center gap-1 text-xs font-bold px-2 py-0.5 rounded ${sev.cls}`}>
              {SevIcon && <SevIcon size={11} />} {sev.label}
            </span>
            <span className={`flex items-center gap-1 text-xs font-bold px-2 py-0.5 rounded border ${status.cls}`}>
              <StatusIcon size={11} /> {status.label}
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Top grid: User | Action | Request */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* User */}
            <div className="space-y-2">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">User</p>
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-full bg-primary/10 text-primary flex items-center justify-center text-sm font-bold shrink-0">
                  {log.user_name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-800">{log.user_name}</p>
                  <p className="text-xs text-slate-500">{log.user_email}</p>
                </div>
              </div>
              <span className={`inline-block text-xs font-bold px-2 py-0.5 rounded ${roleBadgeCls(log.user_role)}`}>
                {log.user_role.replace(/_/g, ' ')}
              </span>
            </div>

            {/* Action */}
            <div className="space-y-1.5">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Action Details</p>
              <Row label="Module"   value={log.module_name} />
              {log.entity_name && <Row label="Entity"   value={log.entity_name} />}
              {log.record_id   && <Row label="Record ID" value={`#${log.record_id}`} />}
              {log.request_method && log.request_url && (
                <Row label="Request" value={`${log.request_method} ${log.request_url}`} mono />
              )}
            </div>

            {/* Request context */}
            <div className="space-y-1.5">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Request Info</p>
              <Row label="Timestamp" value={formatInIST(log.created_at)} />
              {log.ip_address  && <Row label="IP Address" value={log.ip_address} mono />}
              {log.browser     && <Row label="Browser"    value={log.browser} />}
              {log.os          && <Row label="OS"          value={log.os} />}
              {log.device      && <Row label="Device"      value={log.device} />}
              {log.session_id  && <Row label="Session ID"  value={log.session_id} mono truncate />}
            </div>
          </div>

          {/* Description */}
          <div className="bg-slate-50 rounded-lg px-4 py-3">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Description</p>
            <p className="text-sm text-slate-700">{log.description}</p>
          </div>

          {/* Field-level diff */}
          {diffRows && diffRows.length > 0 && (
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Changed Fields</p>
              <div className="flex flex-wrap gap-1.5 mb-3">
                {diffRows.map(r => (
                  <span key={r.field} className="text-xs px-2 py-0.5 bg-blue-50 text-blue-700 rounded border border-blue-100 font-mono">
                    {r.field}
                  </span>
                ))}
              </div>
              <div className="space-y-2">
                {diffRows.map(r => (
                  <div key={r.field} className="grid grid-cols-2 gap-3">
                    <div>
                      <p className="text-xs font-bold text-red-400 uppercase tracking-wider mb-1">
                        {r.field} — Before
                      </p>
                      <pre className="bg-red-50 border border-red-100 rounded p-2 text-xs text-red-800 overflow-x-auto whitespace-pre-wrap break-words">
                        {r.before === undefined ? '—' : JSON.stringify(r.before, null, 2)}
                      </pre>
                    </div>
                    <div>
                      <p className="text-xs font-bold text-emerald-500 uppercase tracking-wider mb-1">
                        {r.field} — After
                      </p>
                      <pre className="bg-emerald-50 border border-emerald-100 rounded p-2 text-xs text-emerald-800 overflow-x-auto whitespace-pre-wrap break-words">
                        {r.after === undefined ? '—' : JSON.stringify(r.after, null, 2)}
                      </pre>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Full JSON diff when no changed_fields */}
          {!diffRows && (log.old_value || log.new_value) && (
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Value Changes</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {log.old_value && (
                  <div>
                    <p className="text-xs font-bold text-red-400 uppercase tracking-wider mb-1">Before</p>
                    <pre className="bg-red-50 border border-red-100 rounded p-2 text-xs text-red-800 overflow-x-auto">
                      {JSON.stringify(log.old_value, null, 2)}
                    </pre>
                  </div>
                )}
                {log.new_value && (
                  <div>
                    <p className="text-xs font-bold text-emerald-500 uppercase tracking-wider mb-1">After</p>
                    <pre className="bg-emerald-50 border border-emerald-100 rounded p-2 text-xs text-emerald-800 overflow-x-auto">
                      {JSON.stringify(log.new_value, null, 2)}
                    </pre>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// Small helper for detail rows
const Row: React.FC<{ label: string; value: string; mono?: boolean; truncate?: boolean }> = ({ label, value, mono, truncate }) => (
  <div className="flex gap-2 items-baseline text-xs">
    <span className="text-slate-400 shrink-0">{label}:</span>
    <span className={`text-slate-700 ${mono ? 'font-mono' : ''} ${truncate ? 'truncate max-w-[140px]' : ''}`}>{value}</span>
  </div>
)

// ── Timeline entry ─────────────────────────────────────────────────────────────

const TimelineEntry: React.FC<{ log: AuditLog; onViewDetails: (l: AuditLog) => void }> = ({ log, onViewDetails }) => {
  const sev    = SEVERITY_CONFIG[log.severity] ?? SEVERITY_CONFIG.low
  const status = STATUS_CONFIG[log.status]     ?? STATUS_CONFIG.success
  const StatusIcon = status.Icon

  return (
    <div className="flex gap-4 group">
      {/* Time column */}
      <div className="w-20 shrink-0 text-right">
        <span className="text-xs text-slate-400 tabular-nums">{formatTimeShort(log.created_at)}</span>
      </div>

      {/* Connector */}
      <div className="flex flex-col items-center shrink-0">
        <div className={`w-2.5 h-2.5 rounded-full mt-0.5 ring-2 ring-white ${sev.dotCls}`} />
        <div className="w-px flex-grow bg-slate-200 mt-1" />
      </div>

      {/* Content */}
      <div className={`flex-grow pb-4 rounded-lg px-3 py-2 mb-1 transition-colors ${
        log.severity === 'critical' ? 'bg-red-50/60' :
        log.severity === 'high'     ? 'bg-amber-50/40' : 'bg-white'
      } border border-slate-100 group-hover:border-slate-200`}>
        {/* Row 1: user + action + entity */}
        <div className="flex items-center flex-wrap gap-2">
          <div className="flex items-center gap-1.5">
            <div className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-bold shrink-0">
              {log.user_name.charAt(0).toUpperCase()}
            </div>
            <span className="text-sm font-semibold text-slate-800">{log.user_name}</span>
          </div>
          <span className={`text-xs font-bold px-1.5 py-0.5 rounded ${roleBadgeCls(log.user_role)}`}>
            {log.user_role.replace(/_/g, ' ')}
          </span>
          <span className={`text-xs font-bold px-2 py-0.5 rounded border uppercase tracking-wide ${ACTION_COLORS[log.action] ?? DEFAULT_ACTION_COLOR}`}>
            {log.action.replace(/_/g, ' ')}
          </span>
          <span className="text-xs font-semibold text-primary capitalize">{log.module_name}</span>
          {log.entity_name && (
            <span className="text-xs text-slate-500 truncate max-w-[200px]">{log.entity_name}</span>
          )}
          <span className={`flex items-center gap-0.5 text-xs font-semibold ${status.cls.split(' ').slice(1).join(' ')}`}>
            <StatusIcon size={11} /> {status.label}
          </span>
        </div>

        {/* Row 2: technical details */}
        <div className="flex flex-wrap items-center gap-x-3 gap-y-0.5 mt-1.5 text-xs text-slate-400">
          {(log.browser || log.os) && (
            <span className="flex items-center gap-1">
              <DeviceIcon device={log.device} />
              {[log.browser, log.os].filter(Boolean).join(' · ')}
            </span>
          )}
          {log.ip_address && (
            <span className="flex items-center gap-1">
              <Globe size={11} /> {log.ip_address}
            </span>
          )}
          {log.changed_fields?.length ? (
            <span className="flex items-center gap-1 text-blue-500">
              <Hash size={11} /> {log.changed_fields.length} field{log.changed_fields.length !== 1 ? 's' : ''} changed
            </span>
          ) : null}
        </div>

        {/* View details */}
        <button
          onClick={() => onViewDetails(log)}
          className="mt-1.5 flex items-center gap-1 text-xs font-semibold text-primary hover:underline"
        >
          <Eye size={11} /> View Details
        </button>
      </div>
    </div>
  )
}

// ── Table row ─────────────────────────────────────────────────────────────────

const TableRow: React.FC<{
  log: AuditLog
  isOpen: boolean
  onToggle: () => void
  onViewDetails: (l: AuditLog) => void
}> = ({ log, isOpen, onToggle, onViewDetails }) => {
  const sev    = SEVERITY_CONFIG[log.severity] ?? SEVERITY_CONFIG.low
  const status = STATUS_CONFIG[log.status]     ?? STATUS_CONFIG.success
  const SevIcon    = sev.Icon
  const StatusIcon = status.Icon

  return (
    <React.Fragment>
      <tr
        className={`hover:bg-slate-50 cursor-pointer transition-colors ${
          log.severity === 'critical' ? 'bg-red-50/40' :
          log.severity === 'high'     ? 'bg-amber-50/30' : ''
        }`}
        onClick={onToggle}
      >
        <td className="px-4 py-3 text-xs text-slate-500 whitespace-nowrap">
          <div className="flex items-center gap-1">
            <Clock size={11} className="text-slate-300 shrink-0" />
            {formatInIST(log.created_at)}
          </div>
        </td>
        <td className="px-4 py-3">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-bold shrink-0">
              {log.user_name.charAt(0).toUpperCase()}
            </div>
            <div className="min-w-0">
              <p className="font-semibold text-slate-800 text-xs truncate">{log.user_name}</p>
              <span className={`text-xs font-bold px-1.5 py-0.5 rounded ${roleBadgeCls(log.user_role)}`}>
                {log.user_role.replace(/_/g, ' ')}
              </span>
            </div>
          </div>
        </td>
        <td className="px-4 py-3">
          <span className={`text-xs font-bold px-2 py-0.5 rounded border uppercase tracking-wide ${ACTION_COLORS[log.action] ?? DEFAULT_ACTION_COLOR}`}>
            {log.action.replace(/_/g, ' ')}
          </span>
        </td>
        <td className="px-4 py-3">
          <p className="text-xs font-semibold text-primary capitalize">{log.module_name}</p>
          {log.entity_name && <p className="text-xs text-slate-400 truncate max-w-[100px]">{log.entity_name}</p>}
        </td>
        <td className="px-4 py-3 text-xs text-slate-500">
          <div className="flex items-center gap-1">
            <StatusIcon size={11} />
            <span className={status.cls.split(' ').slice(1).join(' ')}>{status.label}</span>
          </div>
        </td>
        <td className="px-4 py-3 text-xs text-slate-500">
          {log.browser && <p>{log.browser}</p>}
          {log.os      && <p className="text-slate-400">{log.os}</p>}
        </td>
        <td className="px-4 py-3">
          <div className={`flex items-center gap-1 text-xs font-bold px-2 py-0.5 rounded ${sev.cls}`}>
            {SevIcon && <SevIcon size={10} />} {sev.label}
          </div>
        </td>
        <td className="px-3 py-3 text-slate-300">
          {isOpen ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
        </td>
      </tr>

      {isOpen && (
        <tr>
          <td colSpan={8} className="p-0">
            <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 text-xs space-y-3">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-1">
                  <p className="font-bold text-slate-400 uppercase tracking-wider text-xs mb-1">User Details</p>
                  <Row label="Name"  value={log.user_name} />
                  <Row label="Email" value={log.user_email} />
                  <Row label="Role"  value={log.user_role} />
                </div>
                <div className="space-y-1">
                  <p className="font-bold text-slate-400 uppercase tracking-wider text-xs mb-1">Request Info</p>
                  <Row label="IP"        value={log.ip_address  || '—'} mono />
                  <Row label="Browser"   value={log.browser     || '—'} />
                  <Row label="OS"        value={log.os          || '—'} />
                  <Row label="Device"    value={log.device      || '—'} />
                  <Row label="Session"   value={log.session_id  || '—'} mono truncate />
                </div>
                <div className="space-y-1">
                  <p className="font-bold text-slate-400 uppercase tracking-wider text-xs mb-1">Changed Fields</p>
                  {log.changed_fields?.length ? (
                    <div className="flex flex-wrap gap-1">
                      {log.changed_fields.map(f => (
                        <span key={f} className="px-1.5 py-0.5 bg-blue-50 text-blue-700 rounded border border-blue-100 font-mono text-xs">{f}</span>
                      ))}
                    </div>
                  ) : <p className="text-slate-400">—</p>}
                  <button
                    onClick={() => onViewDetails(log)}
                    className="mt-2 flex items-center gap-1 text-xs font-semibold text-primary hover:underline"
                  >
                    <Eye size={11} /> Full Details
                  </button>
                </div>
              </div>
            </div>
          </td>
        </tr>
      )}
    </React.Fragment>
  )
}

// ── Main page ─────────────────────────────────────────────────────────────────

const AdminAuditLogs: React.FC = () => {
  const [logs,        setLogs]        = useState<AuditLog[]>([])
  const [total,       setTotal]       = useState(0)
  const [pages,       setPages]       = useState(1)
  const [loading,     setLoading]     = useState(true)
  const [stats,       setStats]       = useState<AuditStats | null>(null)
  const [filterOpts,  setFilterOpts]  = useState<AuditFilterOptions>({ actions: [], modules: [], severities: [], statuses: [], roles: [] })
  const [selectedLog, setSelectedLog] = useState<AuditLog | null>(null)
  const [expandedId,  setExpandedId]  = useState<number | null>(null)
  const [viewMode,    setViewMode]    = useState<'timeline' | 'table'>('timeline')
  const [showFilters, setShowFilters] = useState(false)

  const [filters, setFilters] = useState<AuditFilters>({ page: 1, pageSize: 50 })
  const [search,  setSearch]  = useState('')

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
    auditService.getStats().then(setStats).catch(() => {})
  }, [])

  useEffect(() => { load(filters) }, [filters, load])

  useEffect(() => {
    const t = setTimeout(() => setFilters(f => ({ ...f, search: search || undefined, page: 1 })), 400)
    return () => clearTimeout(t)
  }, [search])

  const setFilter = (key: keyof AuditFilters, val: string) =>
    setFilters(f => ({ ...f, [key]: val || undefined, page: 1 }))

  const clearFilters = () => { setSearch(''); setFilters({ page: 1, pageSize: 50 }) }

  const activeFilterCount = Object.keys(filters).filter(
    k => !['page', 'pageSize'].includes(k) && (filters as any)[k]
  ).length + (search ? 1 : 0)

  const grouped = useMemo(() => groupByDate(logs), [logs])

  const statCards = [
    { label: 'Total Logs',    value: stats?.total      ?? total, color: 'text-primary'    },
    { label: 'Last 24 Hours', value: stats?.last24h    ?? '—',  color: 'text-blue-600'   },
    { label: 'Critical',      value: stats?.critical   ?? logs.filter(l => l.severity === 'critical').length, color: 'text-red-600' },
    { label: 'Failed Logins', value: stats?.failedLogins ?? logs.filter(l => l.action === 'LOGIN' && l.status === 'failure').length, color: 'text-amber-600' },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h2 className="font-display text-2xl font-bold text-slate-800">Activity Logs</h2>
          <p className="text-sm text-slate-500 mt-0.5">
            Complete audit trail — every action, who, what, when, where. All times in IST.
          </p>
        </div>
        <div className="flex items-center gap-2">
          {/* View toggle */}
          <div className="flex border border-slate-200 rounded-lg overflow-hidden text-xs font-semibold">
            <button
              onClick={() => setViewMode('timeline')}
              className={`flex items-center gap-1.5 px-3 py-2 transition-colors ${viewMode === 'timeline' ? 'bg-primary text-white' : 'hover:bg-slate-50 text-slate-600'}`}
            >
              <Activity size={12} /> Timeline
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`flex items-center gap-1.5 px-3 py-2 transition-colors ${viewMode === 'table' ? 'bg-primary text-white' : 'hover:bg-slate-50 text-slate-600'}`}
            >
              <LayoutList size={12} /> Table
            </button>
          </div>
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
        {statCards.map(s => (
          <div key={s.label} className="bg-white border border-slate-200 rounded-lg px-4 py-3 text-center">
            <p className={`text-xl font-display font-bold ${s.color}`}>
              {typeof s.value === 'number' ? s.value.toLocaleString() : s.value}
            </p>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mt-0.5">{s.label}</p>
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
              placeholder="Search user, email, entity, description, IP address…"
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
              <span className="bg-primary text-white text-xs font-bold w-4 h-4 rounded-full flex items-center justify-center">
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
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2 pt-2 border-t border-slate-100">
            {[
              { key: 'action',      label: 'Action',   opts: filterOpts.actions   },
              { key: 'module_name', label: 'Module',   opts: filterOpts.modules   },
              { key: 'severity',    label: 'Severity', opts: filterOpts.severities },
              { key: 'status',      label: 'Status',   opts: filterOpts.statuses  },
              { key: 'role',        label: 'Role',     opts: filterOpts.roles     },
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
              type="text"
              placeholder="IP Address"
              value={filters.ip_address || ''}
              onChange={e => setFilter('ip_address', e.target.value)}
              className="text-xs border border-slate-200 rounded-lg px-2 py-1.5 focus:outline-none font-mono"
            />
            <input
              type="date"
              value={(filters.date_from as string) || ''}
              onChange={e => setFilter('date_from', e.target.value)}
              className="text-xs border border-slate-200 rounded-lg px-2 py-1.5 focus:outline-none"
            />
            <input
              type="date"
              value={(filters.date_to as string) || ''}
              onChange={e => setFilter('date_to', e.target.value)}
              className="text-xs border border-slate-200 rounded-lg px-2 py-1.5 focus:outline-none"
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

      {/* Content */}
      {loading ? (
        <SkeletonTable />
      ) : logs.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-lg flex flex-col items-center justify-center py-16 text-slate-400">
          <User size={36} className="mb-3 opacity-30" />
          <p className="font-medium text-sm">No logs match the current filters</p>
        </div>
      ) : viewMode === 'timeline' ? (
        /* ── Timeline View ── */
        <div className="space-y-6">
          {grouped.map(({ date, entries }) => (
            <div key={date}>
              {/* Date separator */}
              <div className="flex items-center gap-3 mb-4">
                <div className="h-px flex-grow bg-slate-200" />
                <span className="text-xs font-bold text-slate-500 px-3 py-1 bg-slate-100 rounded-full">{date}</span>
                <div className="h-px flex-grow bg-slate-200" />
              </div>

              {/* Entries */}
              <div className="space-y-0">
                {entries.map(log => (
                  <TimelineEntry
                    key={log.id}
                    log={log}
                    onViewDetails={setSelectedLog}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* ── Table View ── */
        <div className="bg-white border border-slate-200 rounded-lg overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50">
                <th className="text-left px-4 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider w-44">Timestamp (IST)</th>
                <th className="text-left px-4 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">User</th>
                <th className="text-left px-4 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider w-28">Action</th>
                <th className="text-left px-4 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider w-28">Module</th>
                <th className="text-left px-4 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider w-20">Status</th>
                <th className="text-left px-4 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider w-28">Browser / OS</th>
                <th className="text-left px-4 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider w-20">Severity</th>
                <th className="w-8" />
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {logs.map(log => (
                <TableRow
                  key={log.id}
                  log={log}
                  isOpen={expandedId === log.id}
                  onToggle={() => setExpandedId(expandedId === log.id ? null : log.id)}
                  onViewDetails={setSelectedLog}
                />
              ))}
            </tbody>
          </table>
        </div>
      )}

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

      {/* Detail modal */}
      {selectedLog && (
        <LogDetailModal log={selectedLog} onClose={() => setSelectedLog(null)} />
      )}
    </div>
  )
}

export default AdminAuditLogs
