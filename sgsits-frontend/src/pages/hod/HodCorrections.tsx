import React, { useMemo, useState, useEffect } from 'react'
import { PageHeader, PortalCard, PortalModal } from '../../components/layout/PortalLayout'
import { getCorrectionRequests, getFacultyMembers, type CorrectionRequest, type FacultyMember } from '../../services/examService'
import { useAdminStore } from '../../store/adminStore'
import { Search, Eye, ExternalLink, MessageSquare } from 'lucide-react'

const HOD_BRANCH = 'CSE'

const HodCorrections: React.FC = () => {
  const { user } = useAdminStore()
  const hodBranch = user?.department_id ? String(user.department_id) : HOD_BRANCH
  const [correctionRequests, setCorrectionRequests] = useState<CorrectionRequest[]>([])
  const [facultyMembers, setFacultyMembers] = useState<FacultyMember[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<'all' | CorrectionRequest['status']>('all')
  const [viewing, setViewing] = useState<CorrectionRequest | null>(null)

  useEffect(() => {
    Promise.all([getCorrectionRequests(), getFacultyMembers(hodBranch)]).then(([cr, fm]) => {
      setCorrectionRequests(cr); setFacultyMembers(fm); setLoading(false)
    })
  }, [hodBranch])

  const branchCorrections = useMemo(() => {
    const branchFacultyIds = new Set(facultyMembers.filter(f => f.branch_id === hodBranch).map(f => f.id))
    return correctionRequests.filter(c => branchFacultyIds.has(c.facultyId))
  }, [correctionRequests, facultyMembers, hodBranch])

  const visible = useMemo(() => branchCorrections.filter(c => {
    if (statusFilter !== 'all' && c.status !== statusFilter) return false
    if (search.trim()) {
      const q = search.toLowerCase()
      if (!c.subjectName.toLowerCase().includes(q) && !c.subjectId.toLowerCase().includes(q) && !c.reason.toLowerCase().includes(q)) return false
    }
    return true
  }), [branchCorrections, statusFilter, search])

  const stats = {
    total: branchCorrections.length,
    pending: branchCorrections.filter(c => c.status === 'pending').length,
    approved: branchCorrections.filter(c => c.status === 'approved').length,
    rejected: branchCorrections.filter(c => c.status === 'rejected').length,
  }

  const facName = (id: string) => facultyMembers.find(f => f.id === id)?.name ?? id

  return (
    <div className="space-y-5">
      <PageHeader
        title="Correction Requests (Visibility)"
        subtitle="Read-only view of faculty mark-correction requests in your branch. Exam Department approves them."
      />

      <PortalCard className="!p-3 bg-[#bfa15f]/5 border-[#bfa15f]/20">
        <div className="flex items-start gap-2.5">
          <MessageSquare size={14} className="text-[#bfa15f] mt-0.5 shrink-0" />
          <p className="text-[11px] text-[#0b2545]/80">
            Corrections raised by branch faculty are <strong>approved or rejected by the Exam Department</strong>, not the HOD.
            This screen lets you monitor patterns and follow up with faculty if needed.
          </p>
        </div>
      </PortalCard>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <Stat label="Total" value={stats.total} accent="text-[#0b2545]" />
        <Stat label="Pending" value={stats.pending} accent="text-[#bfa15f]" />
        <Stat label="Approved" value={stats.approved} accent="text-[#bfa15f]" />
        <Stat label="Rejected" value={stats.rejected} accent="text-[#0b2545]" />
      </div>

      <PortalCard className="!p-3">
        <div className="flex flex-col sm:flex-row gap-2.5">
          <div className="relative flex-1 min-w-0">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search by subject or reason..." className="w-full pl-9 pr-3 py-2 text-sm border border-slate-200 rounded focus:outline-none focus:border-[#0b2545]" />
          </div>
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value as 'all' | CorrectionRequest['status'])} className="border border-slate-200 rounded px-3 py-2 text-sm bg-white focus:outline-none focus:border-[#0b2545]">
            <option value="all">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
            <option value="draft">Draft</option>
          </select>
        </div>
      </PortalCard>

      <PortalCard className="!p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead><tr className="bg-slate-50 border-b border-slate-200">
              {['Subject', 'Component', 'Faculty', 'Students', 'Reason', 'Submitted', 'Status', 'Actions'].map(h => (
                <th key={h} className="text-left px-4 py-3 text-[11px] font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap">{h}</th>
              ))}
            </tr></thead>
            <tbody className="divide-y divide-slate-100">
              {visible.length === 0 ? <tr><td colSpan={8} className="px-4 py-8 text-center text-sm text-slate-400">No correction requests to show.</td></tr> :
                visible.map(c => (
                  <tr key={c.id} className="hover:bg-slate-50/60">
                    <td className="px-4 py-2.5">
                      <p className="text-xs font-mono font-bold text-[#0b2545]">{c.subjectId}</p>
                      <p className="text-[11px] text-slate-500">{c.subjectName}</p>
                    </td>
                    <td className="px-4 py-2.5 text-xs text-slate-600">{c.component} / {c.subComponent}</td>
                    <td className="px-4 py-2.5 text-xs text-slate-600">{facName(c.facultyId)}</td>
                    <td className="px-4 py-2.5 text-xs text-slate-600">{c.affectedEnrollments.length}</td>
                    <td className="px-4 py-2.5 text-xs text-slate-600 max-w-[260px] line-clamp-2">{c.reason}</td>
                    <td className="px-4 py-2.5 text-xs text-slate-600 whitespace-nowrap">{c.submittedOn}</td>
                    <td className="px-4 py-2.5">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded border uppercase tracking-wide ${
                        c.status === 'approved' ? 'bg-[#bfa15f]/10 text-[#bfa15f] border-[#bfa15f]/30' :
                        c.status === 'pending'  ? 'bg-[#bfa15f]/15 text-[#bfa15f] border-[#bfa15f]/40' :
                        c.status === 'rejected' ? 'bg-[#0b2545]/10 text-[#0b2545] border-[#0b2545]/25' :
                                                  'bg-slate-100 text-slate-500 border-slate-200'
                      }`}>{c.status}</span>
                    </td>
                    <td className="px-4 py-2.5">
                      <button onClick={() => setViewing(c)} title="View details" className="p-1.5 rounded text-slate-500 hover:bg-slate-100 hover:text-[#0b2545]">
                        <Eye size={13} />
                      </button>
                    </td>
                  </tr>
                ))
              }
            </tbody>
          </table>
        </div>
      </PortalCard>

      <PortalModal isOpen={!!viewing} title={viewing ? `Correction Request — ${viewing.id}` : ''} onClose={() => setViewing(null)} width="max-w-lg">
        {viewing && (
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <Detail label="Subject Code">{viewing.subjectId}</Detail>
              <Detail label="Subject Name">{viewing.subjectName}</Detail>
              <Detail label="Component">{viewing.component}</Detail>
              <Detail label="Sub-Component">{viewing.subComponent}</Detail>
              <Detail label="Faculty">{facName(viewing.facultyId)}</Detail>
              <Detail label="Submitted On">{viewing.submittedOn}</Detail>
            </div>
            <Detail label="Reason"><p className="text-sm text-slate-700">{viewing.reason}</p></Detail>
            <div>
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Affected Students ({viewing.affectedEnrollments.length})</p>
              <div className="flex flex-wrap gap-1.5">
                {viewing.affectedEnrollments.map(e => (
                  <span key={e} className="text-[10px] font-mono bg-[#0b2545]/5 text-[#0b2545] border border-[#0b2545]/15 px-2 py-0.5 rounded font-bold">{e}</span>
                ))}
              </div>
            </div>
            <div className="p-3 bg-[#bfa15f]/5 border border-[#bfa15f]/20 rounded-lg text-[11px] text-[#0b2545]/80 flex items-start gap-2">
              <ExternalLink size={12} className="mt-0.5 shrink-0 text-[#bfa15f]" />
              Approval / Rejection of this request is handled by the Exam Department portal.
            </div>
          </div>
        )}
      </PortalModal>
    </div>
  )
}

const Stat: React.FC<{ label: string; value: number; accent: string }> = ({ label, value, accent }) => (
  <PortalCard className="!p-4"><p className="text-[11px] font-bold text-slate-500 uppercase tracking-wide">{label}</p><p className={`text-2xl font-bold mt-1 ${accent}`}>{value}</p></PortalCard>
)
const Detail: React.FC<{ label: string; children: React.ReactNode }> = ({ label, children }) => (
  <div className="bg-slate-50 border border-slate-100 rounded p-2.5">
    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">{label}</p>
    <p className="text-sm font-semibold text-slate-800 mt-0.5">{children}</p>
  </div>
)

export default HodCorrections
