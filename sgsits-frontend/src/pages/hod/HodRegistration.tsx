import React, { useMemo, useState, useEffect } from 'react'
import { PageHeader, PortalCard, PortalModal } from '../../components/layout/PortalLayout'
import { getRegistrationRequests, type RegistrationRequest } from '../../services/examService'
import { useAdminStore } from '../../store/adminStore'
import { Search, Check, X, UserPlus, Mail, Phone, BookOpen, Briefcase } from 'lucide-react'

const HOD_BRANCH = 'CSE'

const HodRegistration: React.FC = () => {
  const { user } = useAdminStore()
  const hodBranch = user?.department_id ? String(user.department_id) : HOD_BRANCH
  const [requests, setRequests] = useState<RegistrationRequest[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getRegistrationRequests(hodBranch).then(r => { setRequests(r); setLoading(false) })
  }, [hodBranch])
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<'all' | RegistrationRequest['status']>('all')
  const [reviewing, setReviewing] = useState<RegistrationRequest | null>(null)
  const [remark, setRemark] = useState('')
  const [toast, setToast] = useState('')

  const branchReqs = useMemo(() => requests.filter(r => r.branch_id === hodBranch), [requests, hodBranch])
  const visible = useMemo(() => branchReqs.filter(r => {
    if (statusFilter !== 'all' && r.status !== statusFilter) return false
    if (search.trim()) {
      const q = search.toLowerCase()
      if (!r.name.toLowerCase().includes(q) && !r.email.toLowerCase().includes(q) && !r.facultyId.toLowerCase().includes(q)) return false
    }
    return true
  }), [branchReqs, statusFilter, search])

  const stats = {
    pending: branchReqs.filter(r => r.status === 'pending').length,
    approved: branchReqs.filter(r => r.status === 'approved').length,
    rejected: branchReqs.filter(r => r.status === 'rejected').length,
  }

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(''), 2400) }

  const decide = (decision: 'approved' | 'rejected') => {
    if (!reviewing) return
    setRequests(prev => prev.map(r => r.id === reviewing.id ? { ...r, status: decision } : r))
    showToast(`Registration ${decision}.${remark ? ' Note recorded.' : ''}`)
    setReviewing(null); setRemark('')
  }

  return (
    <div className="space-y-5">
      <PageHeader
        title="Faculty Registration Requests"
        subtitle="Approve or reject teachers who self-registered for your branch"
      />

      <div className="grid grid-cols-3 gap-3">
        <Stat label="Pending" value={stats.pending} accent="text-[#bfa15f]" />
        <Stat label="Approved" value={stats.approved} accent="text-[#bfa15f]" />
        <Stat label="Rejected" value={stats.rejected} accent="text-[#0b2545]" />
      </div>

      <PortalCard className="!p-3">
        <div className="flex flex-col sm:flex-row gap-2.5">
          <div className="relative flex-1 min-w-0">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search by name / email / ID..." className="w-full pl-9 pr-3 py-2 text-sm border border-slate-200 rounded focus:outline-none focus:border-[#0b2545]" />
          </div>
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value as 'all' | RegistrationRequest['status'])} className="border border-slate-200 rounded px-3 py-2 text-sm bg-white focus:outline-none focus:border-[#0b2545]">
            <option value="all">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
      </PortalCard>

      {visible.length === 0 ? (
        <PortalCard><p className="text-center text-sm text-slate-400 py-12">No registration requests match.</p></PortalCard>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {visible.map(r => (
            <PortalCard key={r.id}>
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3 min-w-0">
                  <div className="w-11 h-11 rounded-full bg-[#0b2545]/10 border border-[#0b2545]/20 flex items-center justify-center shrink-0">
                    <UserPlus size={18} className="text-[#0b2545]" />
                  </div>
                  <div className="min-w-0">
                    <h4 className="font-bold text-slate-800 text-sm">{r.name}</h4>
                    <p className="text-[11px] text-slate-500 mt-0.5">{r.designation}</p>
                  </div>
                </div>
                <StatusPill status={r.status} />
              </div>

              <div className="space-y-1.5 mt-4">
                <Line icon={Mail}>{r.email}</Line>
                <Line icon={Phone}>{r.phone}</Line>
                <Line icon={BookOpen}>{r.specialization}</Line>
                <Line icon={Briefcase}>Faculty ID: <span className="font-mono">{r.facultyId}</span></Line>
              </div>

              <p className="text-[10px] text-slate-400 mt-3">Applied on {r.appliedOn}</p>

              {r.status === 'pending' && (
                <div className="flex gap-2 mt-3 pt-3 border-t border-slate-100">
                  <button onClick={() => { setReviewing(r); setRemark('') }} className="flex-1 py-1.5 bg-[#0b2545] text-white text-xs font-bold rounded hover:bg-[#0b2545]/90 inline-flex items-center justify-center gap-1.5">
                    <Check size={12} /> Review
                  </button>
                </div>
              )}
            </PortalCard>
          ))}
        </div>
      )}

      <PortalModal isOpen={!!reviewing} title={`Review Registration — ${reviewing?.name}`} onClose={() => { setReviewing(null); setRemark('') }} width="max-w-md">
        {reviewing && (
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-2.5">
              <Detail label="Faculty ID">{reviewing.facultyId}</Detail>
              <Detail label="Designation">{reviewing.designation}</Detail>
              <Detail label="Email">{reviewing.email}</Detail>
              <Detail label="Phone">{reviewing.phone}</Detail>
              <Detail label="Specialization"><span className="text-xs">{reviewing.specialization}</span></Detail>
              <Detail label="Branch">{reviewing.branch_id}</Detail>
            </div>
            <label className="block">
              <span className="block text-[11px] font-bold text-slate-600 uppercase tracking-wide mb-1">Remarks (optional)</span>
              <textarea rows={2} value={remark} onChange={(e) => setRemark(e.target.value)} className="w-full border border-slate-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#0b2545] bg-white" placeholder="Optional note attached to your decision" />
            </label>
            <div className="flex gap-2 pt-2 border-t border-slate-100">
              <button onClick={() => decide('rejected')} className="flex-1 py-2 border border-[#0b2545]/20 text-[#0b2545] text-sm font-bold rounded hover:bg-[#0b2545]/5 inline-flex items-center justify-center gap-1.5">
                <X size={13} /> Reject
              </button>
              <button onClick={() => decide('approved')} className="flex-1 py-2 bg-[#bfa15f] text-white text-sm font-bold rounded hover:bg-[#bfa15f]/90 inline-flex items-center justify-center gap-1.5">
                <Check size={13} /> Approve
              </button>
            </div>
          </div>
        )}
      </PortalModal>

      {toast && (
        <div className="fixed bottom-4 right-4 z-50 bg-[#bfa15f] text-white px-5 py-3 rounded-lg shadow-lg flex items-center gap-2 text-sm font-medium">
          <UserPlus size={14} /> {toast}
          <button onClick={() => setToast('')} className="ml-1"><X size={13} /></button>
        </div>
      )}
    </div>
  )
}

const Stat: React.FC<{ label: string; value: number; accent: string }> = ({ label, value, accent }) => (
  <PortalCard className="!p-4"><p className="text-[11px] font-bold text-slate-500 uppercase tracking-wide">{label}</p><p className={`text-2xl font-bold mt-1 ${accent}`}>{value}</p></PortalCard>
)
const Line: React.FC<{ icon: React.ComponentType<{ size?: number; className?: string }>; children: React.ReactNode }> = ({ icon: Icon, children }) => (
  <p className="flex items-center gap-2 text-[11px] text-slate-600"><Icon size={11} className="text-[#bfa15f] shrink-0" />{children}</p>
)
const Detail: React.FC<{ label: string; children: React.ReactNode }> = ({ label, children }) => (
  <div className="bg-slate-50 border border-slate-100 rounded p-2">
    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">{label}</p>
    <p className="text-sm font-semibold text-slate-800 mt-0.5 truncate">{children}</p>
  </div>
)
const StatusPill: React.FC<{ status: RegistrationRequest['status'] }> = ({ status }) => {
  const cls = status === 'approved' ? 'bg-[#bfa15f]/10 text-[#bfa15f] border-[#bfa15f]/30' :
              status === 'pending'  ? 'bg-[#bfa15f]/15 text-[#bfa15f] border-[#bfa15f]/40' :
                                      'bg-[#0b2545]/10 text-[#0b2545] border-[#0b2545]/25'
  return <span className={`text-[10px] font-bold px-2 py-0.5 rounded border uppercase tracking-wide ${cls} shrink-0`}>{status}</span>
}

export default HodRegistration
