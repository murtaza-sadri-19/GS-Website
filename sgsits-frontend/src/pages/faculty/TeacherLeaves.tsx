import React, { useMemo, useState } from 'react'
import { PageHeader, PortalCard, PortalTable, PortalModal } from '../../components/layout/PortalLayout'
import { Plus, Search, Send, CheckCircle2, Clock, AlertCircle } from 'lucide-react'

interface FacultyLeave {
  id: string
  leaveType: 'Casual Leave' | 'Medical Leave' | 'Duty Leave' | 'Earned Leave'
  fromDate: string
  toDate: string
  days: number
  reason: string
  status: 'pending' | 'approved' | 'rejected'
  appliedOn: string
  remarks?: string
}

const INITIAL_LEAVES: FacultyLeave[] = [
  { id: 'LV001', leaveType: 'Casual Leave', fromDate: '2026-05-10', toDate: '2026-05-11', days: 2, reason: 'Family function at home town.', status: 'approved', appliedOn: '2026-05-08', remarks: 'Enjoy your leave.' },
  { id: 'LV002', leaveType: 'Duty Leave',   fromDate: '2026-04-15', toDate: '2026-04-17', days: 3, reason: 'Attending IEEE Conference at IIT Indore as reviewer.', status: 'approved', appliedOn: '2026-04-10', remarks: 'Please submit conference attendance certificate post return.' },
  { id: 'LV003', leaveType: 'Medical Leave',fromDate: '2026-05-24', toDate: '2026-05-26', days: 3, reason: 'Severe viral fever and physician recommended rest.', status: 'pending', appliedOn: '2026-05-22' },
]

const LEAVE_BALANCES = {
  casual: { allotted: 12, consumed: 4, remaining: 8 },
  medical: { allotted: 10, consumed: 2, remaining: 8 },
  duty: { allotted: 15, consumed: 6, remaining: 9 },
}

const EMPTY_LEAVE = {
  leaveType: 'Casual Leave' as FacultyLeave['leaveType'],
  fromDate: '',
  toDate: '',
  reason: '',
}

const TeacherLeaves: React.FC = () => {
  const [leaves, setLeaves] = useState<FacultyLeave[]>(INITIAL_LEAVES)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<'all' | FacultyLeave['status']>('all')
  const [showApplyModal, setShowApplyModal] = useState(false)
  const [form, setForm] = useState(EMPTY_LEAVE)
  const [viewingLeave, setViewingLeave] = useState<FacultyLeave | null>(null)
  const [toast, setToast] = useState('')

  const visible = useMemo(() => {
    return leaves.filter(l => {
      if (statusFilter !== 'all' && l.status !== statusFilter) return false
      if (search.trim()) {
        const q = search.toLowerCase()
        if (
          !l.leaveType.toLowerCase().includes(q) &&
          !l.reason.toLowerCase().includes(q)
        )
          return false
      }
      return true
    })
  }, [leaves, search, statusFilter])

  const showToast = (msg: string) => {
    setToast(msg)
    setTimeout(() => setToast(''), 2400)
  }

  // Calculate days count between two date strings
  const getDaysCount = (from: string, to: string) => {
    if (!from || !to) return 0
    const start = new Date(from)
    const end = new Date(to)
    const timeDiff = end.getTime() - start.getTime()
    if (timeDiff < 0) return 0
    return Math.ceil(timeDiff / (1000 * 3600 * 24)) + 1
  }

  const computedDays = useMemo(() => getDaysCount(form.fromDate, form.toDate), [form.fromDate, form.toDate])

  const applyLeave = (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.fromDate || !form.toDate || !form.reason.trim() || computedDays <= 0) {
      alert('Please fill out all fields correctly. "From" date must be earlier than or equal to "To" date.')
      return
    }

    const newLeave: FacultyLeave = {
      id: `LV${String(leaves.length + 1).padStart(3, '0')}`,
      leaveType: form.leaveType,
      fromDate: form.fromDate,
      toDate: form.toDate,
      days: computedDays,
      reason: form.reason,
      status: 'pending',
      appliedOn: new Date().toISOString().slice(0, 10),
    }

    setLeaves(prev => [newLeave, ...prev])
    setShowApplyModal(false)
    setForm(EMPTY_LEAVE)
    showToast('Leave application submitted for HOD review.')
  }

  const getStatusBadge = (status: FacultyLeave['status']) => {
    switch (status) {
      case 'approved':
        return { label: 'Approved', style: 'bg-[#bfa15f]/10 text-[#bfa15f] border-[#bfa15f]/30', Icon: CheckCircle2 }
      case 'pending':
        return { label: 'Pending HOD', style: 'bg-[#0b2545]/10 text-[#0b2545] border-[#0b2545]/25', Icon: Clock }
      default:
        return { label: 'Rejected', style: 'bg-red-50 text-red-650 border-red-200', Icon: AlertCircle }
    }
  }

  return (
    <div className="space-y-5">
      <PageHeader
        title="Leave Applications"
        subtitle="Apply for casual, medical or duty leaves and track their HOD approvals"
        action={
          <button
            onClick={() => setShowApplyModal(true)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-[#0b2545] text-white text-xs font-bold rounded-md hover:bg-[#0b2545]/90 transition-colors"
          >
            <Plus size={14} /> Apply Leave
          </button>
        }
      />

      {/* Leave Balances */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <PortalCard className="relative overflow-hidden">
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Casual Leave</p>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-3xl font-extrabold text-[#0b2545]">{LEAVE_BALANCES.casual.remaining}</span>
            <span className="text-slate-400 text-xs">/ {LEAVE_BALANCES.casual.allotted} remaining</span>
          </div>
          <div className="mt-3 text-[10px] text-slate-500 font-semibold uppercase tracking-wide">Consumed: {LEAVE_BALANCES.casual.consumed} days</div>
        </PortalCard>

        <PortalCard className="relative overflow-hidden">
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Medical Leave</p>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-3xl font-extrabold text-[#bfa15f]">{LEAVE_BALANCES.medical.remaining}</span>
            <span className="text-slate-400 text-xs">/ {LEAVE_BALANCES.medical.allotted} remaining</span>
          </div>
          <div className="mt-3 text-[10px] text-slate-500 font-semibold uppercase tracking-wide">Consumed: {LEAVE_BALANCES.medical.consumed} days</div>
        </PortalCard>

        <PortalCard className="relative overflow-hidden">
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Duty Leave</p>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-3xl font-extrabold text-slate-700">{LEAVE_BALANCES.duty.remaining}</span>
            <span className="text-slate-400 text-xs">/ {LEAVE_BALANCES.duty.allotted} remaining</span>
          </div>
          <div className="mt-3 text-[10px] text-slate-500 font-semibold uppercase tracking-wide">Consumed: {LEAVE_BALANCES.duty.consumed} days</div>
        </PortalCard>
      </div>

      <PortalCard className="!p-3">
        <div className="flex flex-col sm:flex-row gap-2.5">
          <div className="relative flex-1 min-w-0">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search by leave type or reason..."
              className="w-full pl-9 pr-3 py-2 text-sm border border-slate-200 rounded focus:outline-none focus:border-[#0b2545] bg-white"
            />
          </div>
          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value as 'all' | FacultyLeave['status'])}
            className="border border-slate-200 rounded px-3 py-2 text-sm bg-white focus:outline-none focus:border-[#0b2545]"
          >
            <option value="all">All Statuses</option>
            <option value="pending">Pending HOD</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
      </PortalCard>

      <PortalCard className="!p-0 overflow-hidden">
        <PortalTable
          headers={['Leave Type', 'Period', 'Days', 'Applied On', 'Status', 'Actions']}
          rows={visible}
          empty="No leave applications matching the filters."
          renderRow={(l: FacultyLeave) => {
            const badge = getStatusBadge(l.status)
            const BadgeIcon = badge.Icon
            return (
              <tr key={l.id} className="hover:bg-slate-50/60 transition-colors">
                <td className="px-4 py-3 font-semibold text-slate-800">{l.leaveType}</td>
                <td className="px-4 py-3 text-xs text-slate-650 font-medium">
                  {l.fromDate} <span className="text-slate-400 mx-1">→</span> {l.toDate}
                </td>
                <td className="px-4 py-3 text-sm font-bold text-slate-700">{l.days} day{l.days > 1 ? 's' : ''}</td>
                <td className="px-4 py-3 text-xs text-slate-500">{l.appliedOn}</td>
                <td className="px-4 py-3">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded border uppercase tracking-wide inline-flex items-center gap-1 ${badge.style}`}>
                    <BadgeIcon size={10} /> {badge.label}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <button
                    onClick={() => setViewingLeave(l)}
                    className="p-1.5 rounded text-slate-550 hover:bg-slate-100 hover:text-[#0b2545] transition-all inline-flex items-center gap-1 text-[11px] font-bold"
                  >
                    View details
                  </button>
                </td>
              </tr>
            )
          }}
        />
      </PortalCard>

      {/* Apply Leave Modal */}
      <PortalModal
        isOpen={showApplyModal}
        title="Apply for Leave"
        onClose={() => {
          setShowApplyModal(false)
          setForm(EMPTY_LEAVE)
        }}
        width="max-w-md"
      >
        <form onSubmit={applyLeave} className="space-y-4">
          <div>
            <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wide mb-1">Leave Type</label>
            <select
              value={form.leaveType}
              onChange={e => setForm(f => ({ ...f, leaveType: e.target.value as FacultyLeave['leaveType'] }))}
              className="w-full border border-slate-200 bg-white rounded px-3 py-2 text-sm focus:outline-none focus:border-[#0b2545]"
            >
              <option value="Casual Leave">Casual Leave</option>
              <option value="Medical Leave">Medical Leave</option>
              <option value="Duty Leave">Duty Leave</option>
              <option value="Earned Leave">Earned Leave</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wide mb-1">From Date</label>
              <input
                type="date"
                required
                value={form.fromDate}
                onChange={e => setForm(f => ({ ...f, fromDate: e.target.value }))}
                className="w-full border border-slate-200 bg-white rounded px-3 py-2 text-sm focus:outline-none focus:border-[#0b2545]"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wide mb-1">To Date</label>
              <input
                type="date"
                required
                value={form.toDate}
                onChange={e => setForm(f => ({ ...f, toDate: e.target.value }))}
                className="w-full border border-slate-200 bg-white rounded px-3 py-2 text-sm focus:outline-none focus:border-[#0b2545]"
              />
            </div>
          </div>

          {computedDays > 0 && (
            <div className="bg-slate-50 border border-slate-100 rounded px-3 py-2 flex items-center justify-between text-xs">
              <span className="font-semibold text-slate-600">Calculated duration:</span>
              <span className="font-bold text-[#0b2545]">{computedDays} day{computedDays > 1 ? 's' : ''}</span>
            </div>
          )}

          <div>
            <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wide mb-1">Reason for Leave</label>
            <textarea
              required
              value={form.reason}
              onChange={e => setForm(f => ({ ...f, reason: e.target.value }))}
              rows={3}
              placeholder="Provide a reason for HOD consideration..."
              className="w-full border border-slate-200 bg-white rounded px-3 py-2 text-sm focus:outline-none focus:border-[#0b2545] resize-none"
            />
          </div>

          <div className="flex gap-2.5 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={() => {
                setShowApplyModal(false)
                setForm(EMPTY_LEAVE)
              }}
              className="flex-1 py-2 border border-slate-200 text-slate-700 text-sm font-semibold rounded hover:bg-slate-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 py-2 bg-[#0b2545] text-white text-sm font-bold rounded hover:bg-[#0b2545]/90 transition-colors"
            >
              Submit Application
            </button>
          </div>
        </form>
      </PortalModal>

      {/* Details View Modal */}
      <PortalModal
        isOpen={!!viewingLeave}
        title={`Leave Application Details`}
        onClose={() => setViewingLeave(null)}
        width="max-w-md"
      >
        {viewingLeave && (
          <div className="space-y-4">
            <div className="border-b border-slate-100 pb-2">
              <h4 className="font-bold text-slate-800 text-base">{viewingLeave.leaveType}</h4>
              <p className="text-xs text-slate-500 font-medium">Applied on {viewingLeave.appliedOn}</p>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs text-slate-600">
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Duration</p>
                <p className="font-bold text-slate-800 mt-0.5">
                  {viewingLeave.fromDate} <span className="text-slate-400 font-medium mx-1">→</span> {viewingLeave.toDate}
                </p>
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Total Days</p>
                <p className="font-bold text-slate-800 mt-0.5">{viewingLeave.days} day{viewingLeave.days > 1 ? 's' : ''}</p>
              </div>
            </div>

            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wide mb-1">Reason</p>
              <p className="text-sm text-slate-700 leading-relaxed bg-slate-50 border border-slate-100 rounded p-3 italic">
                "{viewingLeave.reason}"
              </p>
            </div>

            {viewingLeave.remarks && (
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wide mb-1">HOD Remarks</p>
                <p className="text-sm text-slate-700 leading-relaxed bg-[#bfa15f]/5 border border-[#bfa15f]/15 rounded p-3 font-medium">
                  {viewingLeave.remarks}
                </p>
              </div>
            )}

            <div className="pt-2 border-t border-slate-100">
              <button
                onClick={() => setViewingLeave(null)}
                className="w-full py-2 bg-slate-100 text-slate-750 text-sm font-semibold rounded hover:bg-slate-200 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </PortalModal>

      {toast && (
        <div className="fixed bottom-4 right-4 z-50 bg-[#bfa15f] text-white px-5 py-3 rounded-lg shadow-lg flex items-center gap-2 text-sm font-medium">
          <Send size={14} /> {toast}
        </div>
      )}
    </div>
  )
}

export default TeacherLeaves
