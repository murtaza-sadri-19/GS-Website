import React, { useMemo, useState, useEffect } from 'react'
import { PageHeader, PortalCard, PortalTable, PortalModal, Badge } from '../../components/layout/PortalLayout'
import { getFacultyMembers, getSubjects, type FacultyMember, type Subject } from '../../services/examService'
import { useAdminStore } from '../../store/adminStore'
import { Search, BookPlus, Mail, Phone, X } from 'lucide-react'

const HOD_BRANCH = 'CSE'

const HodFaculty: React.FC = () => {
  const { user } = useAdminStore()
  const hodBranch = user?.department_id ? String(user.department_id) : HOD_BRANCH
  const [faculty, setFaculty] = useState<FacultyMember[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getFacultyMembers(hodBranch).then(fm => { setFaculty(fm); setLoading(false) })
  }, [hodBranch])
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'on_leave'>('all')
  const [allocating, setAllocating] = useState<FacultyMember | null>(null)
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>([])
  const [toast, setToast] = useState('')

  const [allSubjects, setAllSubjects] = useState<Subject[]>([])
  useEffect(() => {
    getSubjects(hodBranch).then(setAllSubjects)
  }, [hodBranch])
  const branchSubjects = useMemo(
    () => allSubjects.filter(s => s.branch_id === hodBranch),
    [allSubjects, hodBranch]
  )

  const visible = useMemo(() => {
    return faculty.filter(f => {
      if (statusFilter !== 'all' && f.status !== statusFilter) return false
      if (search.trim()) {
        const q = search.toLowerCase()
        if (!f.name.toLowerCase().includes(q) && !f.employeeId.toLowerCase().includes(q)) return false
      }
      return true
    })
  }, [faculty, search, statusFilter])

  const openAllocate = (f: FacultyMember) => {
    setAllocating(f)
    setSelectedSubjects(f.subjects)
  }

  const toggleSubject = (subjectId: string) => {
    setSelectedSubjects(prev =>
      prev.includes(subjectId)
        ? prev.filter(s => s !== subjectId)
        : [...prev, subjectId]
    )
  }

  const saveAllocation = () => {
    if (!allocating) return
    setFaculty(prev => prev.map(f =>
      f.id === allocating.id ? { ...f, subjects: selectedSubjects } : f
    ))
    setToast(`Subjects updated for ${allocating.name}.`)
    setTimeout(() => setToast(''), 2400)
    setAllocating(null)
  }

  return (
    <div className="space-y-5">
      <PageHeader
        title="Department Faculty"
        subtitle="Roster and subject allocation"
      />

      <PortalCard className="!p-3">
        <div className="flex flex-col sm:flex-row gap-2.5">
          <div className="relative flex-1 min-w-0">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name or employee ID..."
              className="w-full pl-9 pr-3 py-2 text-sm border border-slate-200 rounded focus:outline-none focus:border-[#0b2545] bg-white"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as 'all' | 'active' | 'on_leave')}
            className="border border-slate-200 rounded px-3 py-2 text-sm bg-white focus:outline-none focus:border-[#0b2545]"
          >
            <option value="all">All Statuses</option>
            <option value="active">Active</option>
            <option value="on_leave">On Leave</option>
          </select>
        </div>
      </PortalCard>

      <PortalCard className="!p-0 overflow-hidden">
        <PortalTable
          headers={['Faculty', 'Employee ID', 'Designation', 'Specialization', 'Allotted Subjects', 'Status', 'Actions']}
          rows={visible}
          empty="No faculty members match the filters."
          renderRow={(f) => (
            <tr key={f.id} className="hover:bg-slate-50/60 transition-colors">
              <td className="px-4 py-3">
                <p className="text-sm font-semibold text-slate-800">{f.name}</p>
                <div className="flex items-center gap-2 text-[11px] text-slate-500 mt-1">
                  <Mail size={11} /><span>{f.email}</span>
                  <span className="text-slate-300">·</span>
                  <Phone size={11} /><span>{f.phone}</span>
                </div>
              </td>
              <td className="px-4 py-3 text-xs font-mono text-slate-700">{f.employeeId}</td>
              <td className="px-4 py-3 text-xs text-slate-600">{f.designation}</td>
              <td className="px-4 py-3 text-xs text-slate-600">{f.specialization}</td>
              <td className="px-4 py-3">
                {f.subjects.length === 0 ? (
                  <span className="text-xs text-slate-400 italic">None allotted</span>
                ) : (
                  <div className="flex flex-wrap gap-1">
                    {f.subjects.map(sid => (
                      <span key={sid} className="text-[10px] font-mono font-bold bg-[#0b2545]/10 text-[#0b2545] border border-[#0b2545]/20 px-1.5 py-0.5 rounded">
                        {sid}
                      </span>
                    ))}
                  </div>
                )}
              </td>
              <td className="px-4 py-3">
                {f.status === 'active'
                  ? <Badge label="Active" variant="success" />
                  : <Badge label="On Leave" variant="warning" />
                }
              </td>
              <td className="px-4 py-3">
                <button
                  onClick={() => openAllocate(f)}
                  className="inline-flex items-center gap-1 text-[11px] font-bold text-[#0b2545] hover:bg-[#0b2545]/5 border border-[#0b2545]/20 px-2.5 py-1 rounded transition-colors"
                >
                  <BookPlus size={12} /> Allot Subjects
                </button>
              </td>
            </tr>
          )}
        />
      </PortalCard>

      {/* Allocation Modal */}
      <PortalModal
        isOpen={!!allocating}
        title={`Allot Subjects — ${allocating?.name ?? ''}`}
        onClose={() => setAllocating(null)}
        width="max-w-xl"
      >
        <div className="space-y-3">
          <p className="text-xs text-slate-500">
            Select subjects to allot. Allocations are reflected in the faculty profile and timetable.
          </p>

          {selectedSubjects.length > 0 && (
            <div className="bg-slate-50 border border-slate-100 rounded-lg p-3">
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wide mb-1.5">Selected</p>
              <div className="flex flex-wrap gap-1.5">
                {selectedSubjects.map(sid => (
                  <span
                    key={sid}
                    className="inline-flex items-center gap-1 text-[11px] font-mono font-bold bg-[#0b2545] text-white px-2 py-0.5 rounded"
                  >
                    {sid}
                    <button onClick={() => toggleSubject(sid)} className="hover:opacity-70">
                      <X size={11} />
                    </button>
                  </span>
                ))}
              </div>
            </div>
          )}

          <div className="space-y-1.5 max-h-72 overflow-y-auto pr-1">
            {[1, 2, 3, 4, 5, 6, 7, 8].map(sem => {
              const semSubs = branchSubjects.filter(s => s.semester === sem)
              if (semSubs.length === 0) return null
              return (
                <div key={sem}>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-2 mb-1">Semester {sem}</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                    {semSubs.map((s: Subject) => {
                      const checked = selectedSubjects.includes(s.id)
                      return (
                        <label
                          key={s.id}
                          className={`flex items-start gap-2 p-2 rounded border cursor-pointer transition-all ${
                            checked
                              ? 'border-[#0b2545]/40 bg-[#0b2545]/5'
                              : 'border-slate-200 hover:border-slate-300'
                          }`}
                        >
                          <input
                            type="checkbox"
                            checked={checked}
                            onChange={() => toggleSubject(s.id)}
                            className="mt-0.5 accent-[#0b2545]"
                          />
                          <div className="min-w-0">
                            <p className="text-[11px] font-mono font-bold text-[#0b2545]">{s.id}</p>
                            <p className="text-xs text-slate-700 truncate">{s.name}</p>
                            <p className="text-[10px] text-slate-400">{s.type} · {s.credits} cr</p>
                          </div>
                        </label>
                      )
                    })}
                  </div>
                </div>
              )
            })}
          </div>

          <div className="flex gap-2.5 pt-2 border-t border-slate-100">
            <button
              onClick={() => setAllocating(null)}
              className="flex-1 py-2 border border-slate-200 text-slate-700 text-sm font-semibold rounded hover:bg-slate-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={saveAllocation}
              className="flex-1 py-2 bg-[#0b2545] text-white text-sm font-bold rounded hover:bg-[#0b2545]/90 transition-colors"
            >
              Save Allocation ({selectedSubjects.length})
            </button>
          </div>
        </div>
      </PortalModal>

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-4 right-4 z-50 bg-[#bfa15f] text-white px-5 py-3 rounded-lg shadow-lg text-sm font-medium">
          {toast}
        </div>
      )}
    </div>
  )
}

export default HodFaculty
