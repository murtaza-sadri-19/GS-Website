import React, { useMemo, useState, useEffect, useCallback } from 'react'
import { PageHeader, PortalCard, PortalTable, PortalModal } from '../../components/layout/PortalLayout'
import { Plus, Search, Send, CheckCircle2, Clock, AlertCircle, Loader2, RefreshCw, Paperclip } from 'lucide-react'
import {
  getLeaveTypes, getMyLeaveBalance, getMyLeaves, applyLeave,
  currentAcademicYear, daysBetween,
  type LeaveType, type LeaveBalance, type LeaveApplication,
} from '../../services/leaveService'

// ── Sub-components ────────────────────────────────────────────────────────────

const StatusBadge: React.FC<{ status: LeaveApplication['status'] }> = ({ status }) => {
  const map = {
    approved: { label: 'Approved',    cls: 'bg-accent/10 text-accent border-accent/30',       Icon: CheckCircle2 },
    pending:  { label: 'Pending HOD', cls: 'bg-primary/10 text-primary border-primary/25',    Icon: Clock },
    rejected: { label: 'Rejected',    cls: 'bg-red-50 text-red-600 border-red-200',            Icon: AlertCircle },
  }
  const { label, cls, Icon } = map[status] ?? map.pending
  return (
    <span className={`text-xs font-bold px-2 py-0.5 rounded border uppercase tracking-wide inline-flex items-center gap-1 ${cls}`}>
      <Icon size={10} /> {label}
    </span>
  )
}

// ── Balance Cards ─────────────────────────────────────────────────────────────

const BalanceCards: React.FC<{ balances: LeaveBalance[]; loading: boolean }> = ({ balances, loading }) => {
  if (loading) return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {[1, 2, 3].map(i => (
        <PortalCard key={i} className="animate-pulse">
          <div className="h-3 w-24 bg-slate-200 rounded mb-3" />
          <div className="h-8 w-16 bg-slate-200 rounded mb-2" />
          <div className="h-3 w-32 bg-slate-100 rounded" />
        </PortalCard>
      ))}
    </div>
  )

  if (balances.length === 0) return (
    <PortalCard>
      <p className="text-xs text-center text-slate-400 py-4">No leave policies configured for your role. Contact HOD.</p>
    </PortalCard>
  )

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {balances.map(b => {
        const pct = b.allocated > 0 ? Math.round((b.consumed / b.allocated) * 100) : 0
        const isLow = b.remaining <= 2
        return (
          <PortalCard key={b.leave_type_id} className="relative overflow-hidden">
            <div className="flex items-start justify-between mb-2">
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">{b.leave_type}</p>
              <span className="text-xs font-bold px-1.5 py-0.5 rounded border border-slate-200 bg-slate-50 text-slate-500">{b.code}</span>
            </div>
            <div className="flex items-baseline gap-2 mt-1">
              <span className={`text-3xl font-extrabold ${isLow ? 'text-red-500' : ''}`} style={!isLow ? { color: b.color } : undefined}>
                {b.remaining}
              </span>
              <span className="text-slate-400 text-xs">/ {b.allocated} days remaining</span>
            </div>
            <div className="mt-3 h-1.5 bg-slate-100 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all"
                style={{ width: `${pct}%`, backgroundColor: pct > 80 ? '#ef4444' : b.color }}
              />
            </div>
            <div className="mt-2 flex items-center justify-between text-xs text-slate-500 font-semibold">
              <span>Consumed: {b.consumed} days</span>
              <span className="uppercase tracking-wide">{b.academic_year}</span>
            </div>
            {b.requires_attachment && (
              <div className="mt-2 flex items-center gap-1 text-xs text-amber-600 font-medium">
                <Paperclip size={10} /> Certificate required
              </div>
            )}
          </PortalCard>
        )
      })}
    </div>
  )
}

// ── Main Component ────────────────────────────────────────────────────────────

const TeacherLeaves: React.FC = () => {
  const [leaveTypes,  setLeaveTypes]  = useState<LeaveType[]>([])
  const [balances,    setBalances]    = useState<LeaveBalance[]>([])
  const [leaves,      setLeaves]      = useState<LeaveApplication[]>([])
  const [loadingBal,  setLoadingBal]  = useState(true)
  const [loadingList, setLoadingList] = useState(true)

  const [search,       setSearch]       = useState('')
  const [statusFilter, setStatusFilter] = useState<'all' | LeaveApplication['status']>('all')
  const [showApply,    setShowApply]    = useState(false)
  const [viewing,      setViewing]      = useState<LeaveApplication | null>(null)
  const [toast,        setToast]        = useState('')
  const [saving,       setSaving]       = useState(false)

  const [form, setForm] = useState({
    leave_type_id: 0,
    from_date: '',
    to_date: '',
    reason: '',
  })

  const academicYear = currentAcademicYear()

  const loadAll = useCallback(async () => {
    setLoadingBal(true)
    setLoadingList(true)
    const [types, bals, apps] = await Promise.all([
      getLeaveTypes(),
      getMyLeaveBalance(academicYear),
      getMyLeaves(),
    ])
    setLeaveTypes(types.filter(t => t.is_active))
    setBalances(bals)
    setLeaves(apps)
    setLoadingBal(false)
    setLoadingList(false)
  }, [academicYear])

  useEffect(() => { loadAll() }, [loadAll])

  // Pre-select first leave type when types load
  useEffect(() => {
    if (leaveTypes.length > 0 && form.leave_type_id === 0) {
      setForm(f => ({ ...f, leave_type_id: leaveTypes[0].id }))
    }
  }, [leaveTypes])

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(''), 2800) }

  const computedDays = useMemo(() => daysBetween(form.from_date, form.to_date), [form.from_date, form.to_date])

  // Balance for selected leave type
  const selectedBalance = useMemo(
    () => balances.find(b => b.leave_type_id === form.leave_type_id),
    [balances, form.leave_type_id]
  )

  const selectedType = useMemo(
    () => leaveTypes.find(t => t.id === form.leave_type_id),
    [leaveTypes, form.leave_type_id]
  )

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.leave_type_id || !form.from_date || !form.to_date || !form.reason.trim()) {
      showToast('Please fill all required fields.')
      return
    }
    if (computedDays <= 0) { showToast('"From" date must be on or before "To" date.'); return }
    if (selectedBalance && computedDays > selectedBalance.remaining) {
      showToast(`Only ${selectedBalance.remaining} ${selectedType?.name ?? 'leave'} day(s) remaining.`)
      return
    }
    setSaving(true)
    try {
      await applyLeave({
        leave_type_id: form.leave_type_id,
        from_date:     form.from_date,
        to_date:       form.to_date,
        reason:        form.reason,
      })
      showToast('Leave application submitted for HOD review.')
      setShowApply(false)
      setForm({ leave_type_id: leaveTypes[0]?.id || 0, from_date: '', to_date: '', reason: '' })
      await loadAll()
    } catch (err: any) {
      showToast(err?.response?.data?.message || 'Failed to submit leave. Please try again.')
    } finally { setSaving(false) }
  }

  const visible = useMemo(() => leaves.filter(l => {
    if (statusFilter !== 'all' && l.status !== statusFilter) return false
    if (search.trim()) {
      const q = search.toLowerCase()
      if (!l.leave_type.toLowerCase().includes(q) && !l.reason.toLowerCase().includes(q)) return false
    }
    return true
  }), [leaves, search, statusFilter])

  return (
    <div className="space-y-5">
      <PageHeader
        title="Leave Applications"
        subtitle={`Apply for leave and track approvals — ${academicYear} academic year`}
        action={
          <div className="flex gap-2">
            <button onClick={loadAll} className="inline-flex items-center gap-1.5 px-3 py-2 border border-slate-200 text-slate-600 text-xs font-bold rounded-md hover:bg-slate-50">
              <RefreshCw size={12} className={loadingBal ? 'animate-spin' : ''} />
            </button>
            <button
              onClick={() => setShowApply(true)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-primary text-white text-xs font-bold rounded-md hover:bg-primary/90"
            >
              <Plus size={14} /> Apply Leave
            </button>
          </div>
        }
      />

      {/* Balance cards — dynamic from API */}
      <BalanceCards balances={balances} loading={loadingBal} />

      {/* Filters */}
      <PortalCard className="!p-3">
        <div className="flex flex-col sm:flex-row gap-2.5">
          <div className="relative flex-1 min-w-0">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search by leave type or reason..."
              className="w-full pl-9 pr-3 py-2 text-sm border border-slate-200 rounded focus:outline-none focus:border-primary"
            />
          </div>
          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value as any)}
            className="border border-slate-200 rounded px-3 py-2 text-sm bg-white focus:outline-none focus:border-primary"
          >
            <option value="all">All Statuses</option>
            <option value="pending">Pending HOD</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
      </PortalCard>

      {/* Applications table */}
      <PortalCard className="!p-0 overflow-hidden">
        {loadingList ? (
          <div className="flex items-center justify-center py-12 text-slate-400">
            <Loader2 size={20} className="animate-spin mr-2" /><span className="text-sm">Loading applications…</span>
          </div>
        ) : (
          <PortalTable
            headers={['Leave Type', 'Period', 'Days', 'Applied On', 'Status', 'Actions']}
            rows={visible}
            empty="No leave applications matching the filters."
            renderRow={(l: LeaveApplication) => (
              <tr key={l.id} className="hover:bg-slate-50/60 transition-colors">
                <td className="px-4 py-3 font-semibold text-slate-800 text-sm">{l.leave_type}</td>
                <td className="px-4 py-3 text-xs text-slate-600 font-medium whitespace-nowrap">
                  {l.from_date} <span className="text-slate-400 mx-1">→</span> {l.to_date}
                </td>
                <td className="px-4 py-3 text-sm font-bold text-slate-700">{l.days_count}d</td>
                <td className="px-4 py-3 text-xs text-slate-500 whitespace-nowrap">
                  {l.applied_at?.slice(0, 10)}
                </td>
                <td className="px-4 py-3"><StatusBadge status={l.status} /></td>
                <td className="px-4 py-3">
                  <button
                    onClick={() => setViewing(l)}
                    className="text-xs font-bold text-primary hover:underline"
                  >
                    View
                  </button>
                </td>
              </tr>
            )}
          />
        )}
      </PortalCard>

      {/* Apply Leave Modal */}
      <PortalModal
        isOpen={showApply}
        title="Apply for Leave"
        onClose={() => { setShowApply(false) }}
        width="max-w-md"
      >
        <form onSubmit={submit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-600 uppercase tracking-wide mb-1">Leave Type *</label>
            <select
              value={form.leave_type_id}
              onChange={e => setForm(f => ({ ...f, leave_type_id: Number(e.target.value) }))}
              className="w-full border border-slate-200 bg-white rounded px-3 py-2 text-sm focus:outline-none focus:border-primary"
              required
            >
              <option value={0} disabled>— Select leave type —</option>
              {leaveTypes.map(t => {
                const bal = balances.find(b => b.leave_type_id === t.id)
                return (
                  <option key={t.id} value={t.id}>
                    {t.name}{bal ? ` (${bal.remaining}/${bal.allocated} remaining)` : ''}
                  </option>
                )
              })}
            </select>
            {selectedBalance && (
              <p className="text-xs mt-1 font-semibold" style={{ color: selectedBalance.color }}>
                Balance: {selectedBalance.remaining} day(s) remaining this year
                {selectedBalance.requires_attachment && ' · Supporting document required'}
              </p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-600 uppercase tracking-wide mb-1">From Date *</label>
              <input
                type="date"
                required
                value={form.from_date}
                onChange={e => setForm(f => ({ ...f, from_date: e.target.value }))}
                min={new Date().toISOString().slice(0, 10)}
                className="w-full border border-slate-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-primary"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-600 uppercase tracking-wide mb-1">To Date *</label>
              <input
                type="date"
                required
                value={form.to_date}
                onChange={e => setForm(f => ({ ...f, to_date: e.target.value }))}
                min={form.from_date || new Date().toISOString().slice(0, 10)}
                className="w-full border border-slate-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-primary"
              />
            </div>
          </div>

          {computedDays > 0 && (
            <div className={`px-3 py-2 rounded text-xs flex items-center justify-between font-semibold border ${
              selectedBalance && computedDays > selectedBalance.remaining
                ? 'bg-red-50 border-red-200 text-red-600'
                : 'bg-slate-50 border-slate-100 text-slate-600'
            }`}>
              <span>Duration: <strong>{computedDays} day{computedDays > 1 ? 's' : ''}</strong></span>
              {selectedBalance && computedDays > selectedBalance.remaining && (
                <span>⚠ Exceeds balance ({selectedBalance.remaining} remaining)</span>
              )}
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-slate-600 uppercase tracking-wide mb-1">Reason *</label>
            <textarea
              required
              value={form.reason}
              onChange={e => setForm(f => ({ ...f, reason: e.target.value }))}
              rows={3}
              placeholder="Provide a reason for HOD consideration..."
              className="w-full border border-slate-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-primary resize-none"
            />
          </div>

          {selectedBalance?.requires_attachment && (
            <div className="p-2.5 bg-amber-50 border border-amber-200 rounded text-xs text-amber-700 font-medium flex items-start gap-1.5">
              <Paperclip size={12} className="shrink-0 mt-0.5" />
              A supporting document (e.g. medical certificate) is required for {selectedType?.name}. Please submit it to the HOD office separately.
            </div>
          )}

          <div className="flex gap-2.5 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setShowApply(false)}
              className="flex-1 py-2 border border-slate-200 text-slate-700 text-sm font-semibold rounded hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving || (!!selectedBalance && computedDays > selectedBalance.remaining)}
              className="flex-1 py-2 bg-primary text-white text-sm font-bold rounded hover:bg-primary/90 disabled:opacity-50 inline-flex items-center justify-center gap-1.5"
            >
              {saving ? <><Loader2 size={13} className="animate-spin" />Submitting…</> : 'Submit Application'}
            </button>
          </div>
        </form>
      </PortalModal>

      {/* Details View Modal */}
      <PortalModal
        isOpen={!!viewing}
        title="Leave Application"
        onClose={() => setViewing(null)}
        width="max-w-md"
      >
        {viewing && (
          <div className="space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <h4 className="font-bold text-slate-800 text-base">{viewing.leave_type}</h4>
                <p className="text-xs text-slate-500">Applied {viewing.applied_at?.slice(0, 10)}</p>
              </div>
              <StatusBadge status={viewing.status} />
            </div>
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="bg-slate-50 rounded p-2.5">
                <p className="font-bold text-slate-400 uppercase tracking-wide">Duration</p>
                <p className="font-bold text-slate-800 mt-0.5">{viewing.from_date} → {viewing.to_date}</p>
              </div>
              <div className="bg-slate-50 rounded p-2.5">
                <p className="font-bold text-slate-400 uppercase tracking-wide">Total Days</p>
                <p className="font-bold text-slate-800 mt-0.5">{viewing.days_count} day{viewing.days_count > 1 ? 's' : ''}</p>
              </div>
            </div>
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-1">Reason</p>
              <p className="text-sm text-slate-700 leading-relaxed bg-slate-50 border border-slate-100 rounded p-3 italic">"{viewing.reason}"</p>
            </div>
            {viewing.review_remarks && (
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-1">HOD Remarks</p>
                <p className="text-sm text-slate-700 leading-relaxed bg-accent/5 border border-accent/15 rounded p-3 font-medium">{viewing.review_remarks}</p>
              </div>
            )}
            <button onClick={() => setViewing(null)} className="w-full py-2 bg-slate-100 text-slate-700 text-sm font-semibold rounded hover:bg-slate-200">
              Close
            </button>
          </div>
        )}
      </PortalModal>

      {toast && (
        <div className="fixed bottom-4 right-4 z-50 bg-primary text-white px-5 py-3 rounded-lg shadow-lg flex items-center gap-2 text-sm font-medium">
          <Send size={14} /> {toast}
        </div>
      )}
    </div>
  )
}

export default TeacherLeaves
