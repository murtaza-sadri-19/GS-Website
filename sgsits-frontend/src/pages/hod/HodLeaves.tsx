import React, { useEffect, useMemo, useState } from 'react'
import { PageHeader, PortalCard, PortalTable, PortalModal, Badge } from '../../components/layout/PortalLayout'
import { type LeaveApplication } from '../../services/hodService'
import {
  getLeaveApplications,
  approveLeave,
  rejectLeave,
} from '../../services/hodService'
import { useAdminStore } from '../../store/adminStore'
import { Search, Check, X, FileCheck2 } from 'lucide-react'

const HodLeaves: React.FC = () => {
  const { user } = useAdminStore()
  const [leaves, setLeaves] = useState<LeaveApplication[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<'all' | LeaveApplication['status']>('all')
  const [reviewing, setReviewing] = useState<LeaveApplication | null>(null)
  const [remark, setRemark] = useState('')
  const [toast, setToast] = useState('')
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    let alive = true
    setLoading(true)
    getLeaveApplications(user?.department_id).then(data => {
      if (alive) { setLeaves(data); setLoading(false) }
    }).catch(() => { if (alive) setLoading(false) })
    return () => { alive = false }
  }, [user?.department_id])

  const visible = useMemo(() => {
    return leaves.filter(l => {
      if (statusFilter !== 'all' && l.status !== statusFilter) return false
      if (search.trim()) {
        const q = search.toLowerCase()
        if (!l.facultyName.toLowerCase().includes(q) && !l.facultyId.toLowerCase().includes(q)) return false
      }
      return true
    })
  }, [leaves, search, statusFilter])

  const stats = {
    pending:  leaves.filter(l => l.status === 'pending').length,
    approved: leaves.filter(l => l.status === 'approved').length,
    rejected: leaves.filter(l => l.status === 'rejected').length,
  }

  const showToast = (msg: string) => {
    setToast(msg)
    setTimeout(() => setToast(''), 2400)
  }

  const decide = async (decision: 'approved' | 'rejected') => {
    if (!reviewing || submitting) return
    setSubmitting(true)
    try {
      if (decision === 'approved') {
        await approveLeave(reviewing.id)
      } else {
        await rejectLeave(reviewing.id, remark || undefined)
      }
      setLeaves(prev => prev.map(l =>
        l.id === reviewing.id ? { ...l, status: decision, remarks: remark || undefined } : l
      ))
      showToast(`Leave ${reviewing.id} ${decision}.`)
      setReviewing(null)
      setRemark('')
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message
      showToast(msg || `Failed to ${decision} leave. Please try again.`)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="space-y-5">
      <PageHeader
        title="Leave Approvals"
        subtitle="Review and decide faculty leave applications"
      />

      <div className="grid grid-cols-3 gap-3">
        <PortalCard className="!p-4">
          <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wide">Pending</p>
          <p className="text-2xl font-bold text-[#bfa15f] mt-1">{stats.pending}</p>
        </PortalCard>
        <PortalCard className="!p-4">
          <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wide">Approved</p>
          <p className="text-2xl font-bold text-[#0b2545] mt-1">{stats.approved}</p>
        </PortalCard>
        <PortalCard className="!p-4">
          <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wide">Rejected</p>
          <p className="text-2xl font-bold text-slate-600 mt-1">{stats.rejected}</p>
        </PortalCard>
      </div>

      <PortalCard className="!p-3">
        <div className="flex flex-col sm:flex-row gap-2.5">
          <div className="relative flex-1 min-w-0">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by faculty name or ID..."
              className="w-full pl-9 pr-3 py-2 text-sm border border-slate-200 rounded focus:outline-none focus:border-[#0b2545] bg-white"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as 'all' | LeaveApplication['status'])}
            className="border border-slate-200 rounded px-3 py-2 text-sm bg-white focus:outline-none focus:border-[#0b2545]"
          >
            <option value="all">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
      </PortalCard>

      <PortalCard className="!p-0 overflow-hidden">
        {loading ? (
          <div className="py-12 text-center text-sm text-slate-500">Loading leave applications…</div>
        ) : (
          <PortalTable
            headers={['Faculty', 'Type', 'Period', 'Days', 'Applied On', 'Status', 'Actions']}
            rows={visible}
            empty="No leave applications."
            renderRow={(l) => (
              <tr key={l.id} className="hover:bg-slate-50/60 transition-colors">
                <td className="px-4 py-3">
                  <p className="text-sm font-semibold text-slate-800">{l.facultyName}</p>
                  <p className="text-[11px] text-slate-500">{l.designation}</p>
                </td>
                <td className="px-4 py-3 text-xs text-slate-600">{l.leaveType}</td>
                <td className="px-4 py-3 text-xs text-slate-600">
                  <span className="font-medium">{l.fromDate}</span>
                  <span className="text-slate-400 mx-1">→</span>
                  <span className="font-medium">{l.toDate}</span>
                </td>
                <td className="px-4 py-3 text-sm font-bold text-slate-700">{l.days}</td>
                <td className="px-4 py-3 text-xs text-slate-500">{l.appliedOn}</td>
                <td className="px-4 py-3">
                  {l.status === 'pending'  && <Badge label="Pending"  variant="warning" />}
                  {l.status === 'approved' && <Badge label="Approved" variant="success" />}
                  {l.status === 'rejected' && <Badge label="Rejected" variant="error" />}
                </td>
                <td className="px-4 py-3">
                  <button
                    onClick={() => { setReviewing(l); setRemark(l.remarks ?? '') }}
                    className="inline-flex items-center gap-1 text-[11px] font-bold text-[#0b2545] hover:bg-[#0b2545]/5 border border-[#0b2545]/20 px-2.5 py-1 rounded transition-colors"
                  >
                    <FileCheck2 size={12} /> Review
                  </button>
                </td>
              </tr>
            )}
          />
        )}
      </PortalCard>

      {/* Review Modal */}
      <PortalModal
        isOpen={!!reviewing}
        title={`Review Leave — ${reviewing?.id ?? ''}`}
        onClose={() => { setReviewing(null); setRemark('') }}
      >
        {reviewing && (
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="bg-slate-50 rounded p-3 border border-slate-100">
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">Faculty</p>
                <p className="text-sm font-bold text-slate-800 mt-0.5">{reviewing.facultyName}</p>
                <p className="text-[11px] text-slate-500">{reviewing.designation}</p>
              </div>
              <div className="bg-slate-50 rounded p-3 border border-slate-100">
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">Leave Type</p>
                <p className="text-sm font-bold text-slate-800 mt-0.5">{reviewing.leaveType}</p>
                <p className="text-[11px] text-slate-500">{reviewing.days} day{reviewing.days > 1 ? 's' : ''}</p>
              </div>
              <div className="bg-slate-50 rounded p-3 border border-slate-100">
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">From</p>
                <p className="text-sm font-bold text-slate-800 mt-0.5">{reviewing.fromDate}</p>
              </div>
              <div className="bg-slate-50 rounded p-3 border border-slate-100">
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">To</p>
                <p className="text-sm font-bold text-slate-800 mt-0.5">{reviewing.toDate}</p>
              </div>
            </div>

            <div>
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wide mb-1">Reason</p>
              <p className="text-sm text-slate-700 bg-slate-50 border border-slate-100 rounded p-3">{reviewing.reason}</p>
            </div>

            <div>
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wide mb-1 block">
                Remarks (optional)
              </label>
              <textarea
                value={remark}
                onChange={(e) => setRemark(e.target.value)}
                rows={3}
                placeholder="Add a note for the faculty member..."
                className="w-full border border-slate-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#0b2545] bg-white resize-none"
              />
            </div>

            <div className="flex gap-2.5 pt-2 border-t border-slate-100">
              <button
                onClick={() => { setReviewing(null); setRemark('') }}
                disabled={submitting}
                className="flex-1 py-2 border border-slate-200 text-slate-700 text-sm font-semibold rounded hover:bg-slate-50 transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={() => decide('rejected')}
                disabled={reviewing.status === 'rejected' || submitting}
                className="flex-1 py-2 border border-[#0b2545]/30 text-[#0b2545] text-sm font-bold rounded hover:bg-[#0b2545]/5 transition-colors disabled:opacity-50 inline-flex items-center justify-center gap-1.5"
              >
                <X size={14} /> {submitting ? '…' : 'Reject'}
              </button>
              <button
                onClick={() => decide('approved')}
                disabled={reviewing.status === 'approved' || submitting}
                className="flex-1 py-2 bg-[#0b2545] text-white text-sm font-bold rounded hover:bg-[#0b2545]/90 transition-colors disabled:opacity-50 inline-flex items-center justify-center gap-1.5"
              >
                <Check size={14} /> {submitting ? '…' : 'Approve'}
              </button>
            </div>
          </div>
        )}
      </PortalModal>

      {toast && (
        <div className="fixed bottom-4 right-4 z-50 bg-[#bfa15f] text-white px-5 py-3 rounded-lg shadow-lg text-sm font-medium">
          {toast}
        </div>
      )}
    </div>
  )
}

export default HodLeaves
