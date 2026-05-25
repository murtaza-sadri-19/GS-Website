import React, { useMemo, useState, useEffect } from 'react'
import { PageHeader, PortalCard, PortalTable, PortalModal } from '../../components/layout/PortalLayout'
import { getSubjects, getCorrectionRequests, type Subject, type CorrectionRequest } from '../../services/examService'
import { useAdminStore } from '../../store/adminStore'
import { CURRENT_TEACHER_ID } from '../../data/mockTeacherContent'
import { Plus, Search, FileText, AlertCircle, CheckCircle2, Clock, Trash2, Eye } from 'lucide-react'

const COMPONENTS = ['CW', 'Theory Exam', 'Practical Exam', 'Viva Voce']

const EMPTY: Omit<CorrectionRequest, 'id' | 'submittedOn' | 'facultyId'> = {
  subjectId: 'CS301',
  subjectName: 'Data Structures',
  component: 'CW',
  subComponent: 'MST 1',
  reason: '',
  affectedEnrollments: [],
  status: 'draft',
}

const TeacherCorrections: React.FC = () => {
  const { user } = useAdminStore()
  const teacherId = user?.employeeId ?? CURRENT_TEACHER_ID

  const [allSubjects, setAllSubjects] = useState<Subject[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([getSubjects(), getCorrectionRequests()]).then(([subs, corrections]) => {
      setAllSubjects(subs)
      setRequests(corrections.filter(r => r.facultyId === teacherId))
      setLoading(false)
    })
  }, [teacherId])

  const [requests, setRequests] = useState<CorrectionRequest[]>([])
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<'all' | CorrectionRequest['status']>('all')
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState<CorrectionRequest | null>(null)
  const [form, setForm] = useState(EMPTY)
  const [enrollmentsStr, setEnrollmentsStr] = useState('')
  const [viewingDetail, setViewingDetail] = useState<CorrectionRequest | null>(null)
  const [toast, setToast] = useState('')

  // Fetch subjects taught by the teacher
  const mineSubjects = useMemo(() => allSubjects.filter(s => s.facultyId === teacherId), [allSubjects, teacherId])

  const visible = useMemo(() => {
    return requests.filter(r => {
      if (statusFilter !== 'all' && r.status !== statusFilter) return false
      if (search.trim()) {
        const q = search.toLowerCase()
        if (
          !r.subjectId.toLowerCase().includes(q) &&
          !r.subjectName.toLowerCase().includes(q) &&
          !r.reason.toLowerCase().includes(q)
        )
          return false
      }
      return true
    })
  }, [requests, search, statusFilter])

  const showToast = (msg: string) => {
    setToast(msg)
    setTimeout(() => setToast(''), 2400)
  }

  const openAdd = () => {
    setEditing(null)
    setForm({
      ...EMPTY,
      subjectId: mineSubjects[0]?.id ?? 'CS301',
      subjectName: mineSubjects[0]?.name ?? 'Data Structures',
    })
    setEnrollmentsStr('')
    setShowForm(true)
  }

  const save = (e: React.FormEvent, submit: boolean) => {
    e.preventDefault()
    if (!form.reason.trim() || !enrollmentsStr.trim()) return

    const studentList = enrollmentsStr
      .split(',')
      .map(s => s.trim())
      .filter(s => s.length > 0)

    const subjectObj = mineSubjects.find(s => s.id === form.subjectId)

    const requestData: CorrectionRequest = {
      id: editing?.id ?? `CR${String(requests.length + 1).padStart(3, '0')}`,
      subjectId: form.subjectId,
      subjectName: subjectObj?.name ?? form.subjectName,
      component: form.component,
      subComponent: form.subComponent,
      reason: form.reason,
      affectedEnrollments: studentList,
      status: submit ? 'pending' : 'draft',
      submittedOn: editing?.submittedOn ?? new Date().toISOString().slice(0, 10),
      facultyId: CURRENT_TEACHER_ID,
    }

    if (editing) {
      setRequests(prev => prev.map(r => (r.id === editing.id ? requestData : r)))
      showToast(submit ? 'Correction request submitted.' : 'Draft updated.')
    } else {
      setRequests(prev => [requestData, ...prev])
      showToast(submit ? 'Correction request submitted.' : 'Draft saved.')
    }

    setShowForm(false)
    setEditing(null)
  }

  const withdraw = (id: string) => {
    setRequests(prev => prev.filter(r => r.id !== id))
    showToast('Correction request withdrawn.')
  }

  const getStatusBadge = (status: CorrectionRequest['status']) => {
    switch (status) {
      case 'approved':
        return { label: 'Approved', style: 'bg-[#bfa15f]/10 text-[#bfa15f] border-[#bfa15f]/30', Icon: CheckCircle2 }
      case 'pending':
        return { label: 'Pending HOD', style: 'bg-[#0b2545]/10 text-[#0b2545] border-[#0b2545]/25', Icon: Clock }
      case 'rejected':
        return { label: 'Rejected', style: 'bg-red-50 text-red-650 border-red-200', Icon: AlertCircle }
      default:
        return { label: 'Draft', style: 'bg-slate-100 text-slate-600 border-slate-200', Icon: FileText }
    }
  }

  return (
    <div className="space-y-5">
      <PageHeader
        title="Marks Correction Requests"
        subtitle="Submit requests to HOD and Exam Cell to edit already submitted marks"
        action={
          <button
            onClick={openAdd}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-[#0b2545] text-white text-xs font-bold rounded-md hover:bg-[#0b2545]/90 transition-colors"
          >
            <Plus size={14} /> New Request
          </button>
        }
      />

      <PortalCard className="!p-3">
        <div className="flex flex-col sm:flex-row gap-2.5">
          <div className="relative flex-1 min-w-0">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search by code, subject name, or reason..."
              className="w-full pl-9 pr-3 py-2 text-sm border border-slate-200 rounded focus:outline-none focus:border-[#0b2545] bg-white"
            />
          </div>
          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value as 'all' | CorrectionRequest['status'])}
            className="border border-slate-200 rounded px-3 py-2 text-sm bg-white focus:outline-none focus:border-[#0b2545]"
          >
            <option value="all">All Statuses</option>
            <option value="draft">Draft</option>
            <option value="pending">Pending HOD</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
      </PortalCard>

      <PortalCard className="!p-0 overflow-hidden">
        <PortalTable
          headers={['Request ID', 'Subject', 'Component', 'Submitted On', 'Status', 'Actions']}
          rows={visible}
          empty="No correction requests submitted yet."
          renderRow={(r: CorrectionRequest) => {
            const badge = getStatusBadge(r.status)
            const BadgeIcon = badge.Icon
            return (
              <tr key={r.id} className="hover:bg-slate-50/60 transition-colors">
                <td className="px-4 py-3 font-mono text-xs font-bold text-slate-800">{r.id}</td>
                <td className="px-4 py-3">
                  <p className="text-sm font-bold text-slate-800">{r.subjectName}</p>
                  <p className="text-[11px] font-mono text-slate-500">{r.subjectId}</p>
                </td>
                <td className="px-4 py-3 text-xs text-slate-600">
                  {r.component} — <span className="font-semibold">{r.subComponent}</span>
                </td>
                <td className="px-4 py-3 text-xs text-slate-500">{r.submittedOn}</td>
                <td className="px-4 py-3">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded border uppercase tracking-wide inline-flex items-center gap-1 ${badge.style}`}>
                    <BadgeIcon size={10} /> {badge.label}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => setViewingDetail(r)}
                      title="View Details"
                      className="p-1.5 rounded text-slate-500 hover:bg-slate-100 hover:text-[#0b2545] transition-all"
                    >
                      <Eye size={14} />
                    </button>
                    {r.status === 'draft' && (
                      <button
                        onClick={() => {
                          setEditing(r)
                          setForm({
                            subjectId: r.subjectId,
                            subjectName: r.subjectName,
                            component: r.component,
                            subComponent: r.subComponent,
                            reason: r.reason,
                            affectedEnrollments: r.affectedEnrollments,
                            status: 'draft',
                          })
                          setEnrollmentsStr(r.affectedEnrollments.join(', '))
                          setShowForm(true)
                        }}
                        title="Edit Request"
                        className="inline-flex items-center gap-1 text-[11px] font-bold text-[#0b2545] hover:bg-[#0b2545]/5 px-2 py-1 border border-[#0b2545]/20 rounded"
                      >
                        Edit
                      </button>
                    )}
                    {r.status !== 'approved' && (
                      <button
                        onClick={() => withdraw(r.id)}
                        title="Withdraw"
                        className="p-1.5 rounded text-slate-550 hover:bg-red-50 hover:text-red-600 transition-all"
                      >
                        <Trash2 size={14} />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            )
          }}
        />
      </PortalCard>

      {/* New / Edit Request Modal */}
      <PortalModal
        isOpen={showForm}
        title={editing ? `Edit Correction Request — ${editing.id}` : 'Raise Marks Correction Request'}
        onClose={() => {
          setShowForm(false)
          setEditing(null)
        }}
        width="max-w-lg"
      >
        <form className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wide mb-1">Subject</label>
              <select
                value={form.subjectId}
                onChange={e => {
                  const subObj = mineSubjects.find(s => s.id === e.target.value)
                  setForm(f => ({ ...f, subjectId: e.target.value, subjectName: subObj?.name ?? '' }))
                }}
                className="w-full border border-slate-200 bg-white rounded px-3 py-2 text-sm focus:outline-none focus:border-[#0b2545]"
              >
                {mineSubjects.map(s => (
                  <option key={s.id} value={s.id}>{s.id} — {s.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wide mb-1">Component</label>
              <select
                value={form.component}
                onChange={e => setForm(f => ({ ...f, component: e.target.value }))}
                className="w-full border border-slate-200 bg-white rounded px-3 py-2 text-sm focus:outline-none focus:border-[#0b2545]"
              >
                {COMPONENTS.map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wide mb-1">Sub Component / Test</label>
            <input
              type="text"
              required
              value={form.subComponent}
              onChange={e => setForm(f => ({ ...f, subComponent: e.target.value }))}
              placeholder="e.g. MST 1, Lab Notebook, Theory Exam"
              className="w-full border border-slate-200 bg-white rounded px-3 py-2 text-sm focus:outline-none focus:border-[#0b2545]"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wide mb-1">
              Affected Enrollment Numbers (Comma-separated)
            </label>
            <input
              type="text"
              required
              value={enrollmentsStr}
              onChange={e => setEnrollmentsStr(e.target.value)}
              placeholder="e.g. 0901CS21003, 0901CS21005"
              className="w-full border border-slate-200 bg-white rounded px-3 py-2 text-sm focus:outline-none focus:border-[#0b2545]"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wide mb-1">Reason for correction</label>
            <textarea
              required
              value={form.reason}
              onChange={e => setForm(f => ({ ...f, reason: e.target.value }))}
              rows={4}
              placeholder="Explain the reason for marks correction in detail (e.g. addition error in answer sheet, incorrect input key)..."
              className="w-full border border-slate-200 bg-white rounded px-3 py-2 text-sm focus:outline-none focus:border-[#0b2545] resize-none"
            />
          </div>

          <div className="flex gap-2.5 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={() => {
                setShowForm(false)
                setEditing(null)
              }}
              className="flex-1 py-2 border border-slate-200 text-slate-700 text-sm font-semibold rounded hover:bg-slate-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={e => save(e, false)}
              className="flex-1 py-2 border border-[#0b2545]/20 text-[#0b2545] text-sm font-bold rounded hover:bg-[#0b2545]/5 transition-colors"
            >
              Save Draft
            </button>
            <button
              onClick={e => save(e, true)}
              className="flex-1 py-2 bg-[#0b2545] text-white text-sm font-bold rounded hover:bg-[#0b2545]/90 transition-colors"
            >
              Submit HOD
            </button>
          </div>
        </form>
      </PortalModal>

      {/* Details View Modal */}
      <PortalModal
        isOpen={!!viewingDetail}
        title={`Request Details — ${viewingDetail?.id}`}
        onClose={() => setViewingDetail(null)}
        width="max-w-md"
      >
        {viewingDetail && (
          <div className="space-y-4">
            <div className="border-b border-slate-100 pb-2">
              <h4 className="font-bold text-slate-800">{viewingDetail.subjectName}</h4>
              <p className="text-xs text-slate-500 font-mono">{viewingDetail.subjectId}</p>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs text-slate-600">
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Component</p>
                <p className="font-semibold text-slate-800 mt-0.5">{viewingDetail.component}</p>
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Sub Component</p>
                <p className="font-semibold text-slate-800 mt-0.5">{viewingDetail.subComponent}</p>
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Submitted On</p>
                <p className="font-semibold text-slate-800 mt-0.5">{viewingDetail.submittedOn}</p>
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Status</p>
                <p className="font-semibold text-slate-800 mt-0.5 uppercase">{viewingDetail.status}</p>
              </div>
            </div>

            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wide mb-1">Affected Students</p>
              <div className="flex flex-wrap gap-1.5">
                {viewingDetail.affectedEnrollments.map(roll => (
                  <span
                    key={roll}
                    className="text-xs font-mono font-semibold bg-slate-100 text-slate-700 border border-slate-200 px-2 py-0.5 rounded"
                  >
                    {roll}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wide mb-1">Reason</p>
              <p className="text-sm text-slate-700 leading-relaxed bg-slate-50 border border-slate-100 rounded p-3 italic">
                "{viewingDetail.reason}"
              </p>
            </div>

            <div className="pt-2 border-t border-slate-100">
              <button
                onClick={() => setViewingDetail(null)}
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
          <CheckCircle2 size={14} /> {toast}
        </div>
      )}
    </div>
  )
}

export default TeacherCorrections
