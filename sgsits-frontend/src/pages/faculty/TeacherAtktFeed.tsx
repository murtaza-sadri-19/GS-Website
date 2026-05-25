import React, { useMemo, useState, useEffect } from 'react'
import { PageHeader, PortalCard, PortalTable } from '../../components/layout/PortalLayout'
import { getSubjects, getStudents, type Subject, type Student } from '../../services/examService'
import { useAdminStore } from '../../store/adminStore'
import { CURRENT_TEACHER_ID } from '../../data/mockTeacherContent'
import { Save, Send, CheckCircle2, Search, AlertCircle } from 'lucide-react'

interface AtktMarkRow {
  enrollment: string
  name: string
  theoryMarks: string
  practicalMarks: string
  isAbsent: boolean
}

const TeacherAtktFeed: React.FC = () => {
  const { user } = useAdminStore()
  const teacherId = user?.employeeId ?? CURRENT_TEACHER_ID

  const [allSubjects, setAllSubjects] = useState<Subject[]>([])
  const [allStudents, setAllStudents] = useState<Student[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([getSubjects(), getStudents()]).then(([subs, studs]) => {
      setAllSubjects(subs)
      setAllStudents(studs)
      setLoading(false)
    })
  }, [])

  const [selectedSubjectId, setSelectedSubjectId] = useState<string>('CS301')
  const [searchQuery, setSearchQuery] = useState('')
  const [toast, setToast] = useState('')
  const [submittedStatus, setSubmittedStatus] = useState<Record<string, 'draft' | 'submitted'>>({})

  // Fetch subjects taught by the teacher
  const mineSubjects = useMemo(() => allSubjects.filter(s => s.facultyId === teacherId), [allSubjects, teacherId])
  const selectedSubject = useMemo(() => mineSubjects.find(s => s.id === selectedSubjectId), [mineSubjects, selectedSubjectId])

  // Get ATKT-eligible students in this branch & semester
  const atktStudents = useMemo(() => {
    if (!selectedSubject) return []
    return allStudents.filter(
      s => s.branch_id === selectedSubject.branch_id && s.semester === selectedSubject.semester && s.hasATKT
    )
  }, [allStudents, selectedSubject])

  // Track ATKT marks state
  const [marksState, setMarksState] = useState<Record<string, Record<string, AtktMarkRow>>>({})

  const activeKey = selectedSubjectId

  const rows: AtktMarkRow[] = useMemo(() => {
    const existing = marksState[activeKey]
    if (existing) return Object.values(existing)

    const initialRows: Record<string, AtktMarkRow> = {}
    atktStudents.forEach(s => {
      initialRows[s.enrollment] = {
        enrollment: s.enrollment,
        name: s.name,
        theoryMarks: '',
        practicalMarks: '',
        isAbsent: false,
      }
    })
    return Object.values(initialRows)
  }, [atktStudents, activeKey, marksState])

  const visibleRows = useMemo(() => {
    return rows.filter(
      r =>
        r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.enrollment.toLowerCase().includes(searchQuery.toLowerCase())
    )
  }, [rows, searchQuery])

  const currentStatus = submittedStatus[activeKey] || 'draft'

  const showToast = (msg: string) => {
    setToast(msg)
    setTimeout(() => setToast(''), 2400)
  }

  const handleMarkChange = (enrollment: string, type: 'theory' | 'practical', val: string) => {
    if (val !== '' && isNaN(Number(val))) return
    const max = type === 'theory' ? 80 : 20
    if (Number(val) > max) return

    setMarksState(prev => {
      const currentGroup = prev[activeKey] || {}
      const targetRow = currentGroup[enrollment] || {
        enrollment,
        name: atktStudents.find(s => s.enrollment === enrollment)?.name ?? '',
        theoryMarks: '',
        practicalMarks: '',
        isAbsent: false,
      }
      return {
        ...prev,
        [activeKey]: {
          ...currentGroup,
          [enrollment]: {
            ...targetRow,
            [type === 'theory' ? 'theoryMarks' : 'practicalMarks']: val,
          },
        },
      }
    })
  }

  const handleAbsentToggle = (enrollment: string) => {
    setMarksState(prev => {
      const currentGroup = prev[activeKey] || {}
      const targetRow = currentGroup[enrollment] || {
        enrollment,
        name: atktStudents.find(s => s.enrollment === enrollment)?.name ?? '',
        theoryMarks: '',
        practicalMarks: '',
        isAbsent: false,
      }
      const isAbsent = !targetRow.isAbsent
      return {
        ...prev,
        [activeKey]: {
          ...currentGroup,
          [enrollment]: {
            ...targetRow,
            theoryMarks: isAbsent ? '' : targetRow.theoryMarks,
            practicalMarks: isAbsent ? '' : targetRow.practicalMarks,
            isAbsent,
          },
        },
      }
    })
  }

  const save = (submit: boolean) => {
    if (submit) {
      const incomplete = rows.some(
        r => !r.isAbsent && (r.theoryMarks === '' || (selectedSubject?.type === 'Practical' && r.practicalMarks === ''))
      )
      if (incomplete) {
        alert('Please enter marks for all students or mark them as absent before HOD submission.')
        return
      }
    }
    setSubmittedStatus(prev => ({ ...prev, [activeKey]: submit ? 'submitted' : 'draft' }))
    showToast(submit ? 'ATKT Marks submitted to HOD successfully.' : 'ATKT Marks draft saved.')
  }

  return (
    <div className="space-y-5">
      <PageHeader
        title="ATKT Marks Feed"
        subtitle="Submit back-paper / ATKT marks directly for eligible students"
      />

      <PortalCard>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wide mb-1">Select Subject</label>
            <select
              value={selectedSubjectId}
              onChange={e => setSelectedSubjectId(e.target.value)}
              className="w-full border border-slate-200 rounded px-3 py-2 text-sm bg-white focus:outline-none focus:border-[#0b2545]"
            >
              {mineSubjects.map(s => (
                <option key={s.id} value={s.id}>{s.id} — {s.name} ({s.type})</option>
              ))}
            </select>
          </div>
          <div className="flex items-end justify-end">
            {currentStatus !== 'submitted' ? (
              <div className="flex gap-2 w-full sm:w-auto">
                <button
                  onClick={() => save(false)}
                  className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-4 py-2 border border-slate-200 text-slate-700 text-xs font-bold rounded-md hover:bg-slate-50 transition-colors"
                >
                  <Save size={13} /> Save Draft
                </button>
                <button
                  onClick={() => save(true)}
                  className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-4 py-2 bg-[#0b2545] text-white text-xs font-bold rounded-md hover:bg-[#0b2545]/90 transition-colors"
                >
                  <Send size={13} /> Submit HOD
                </button>
              </div>
            ) : (
              <span className="inline-flex items-center gap-1 bg-[#bfa15f]/10 border border-[#bfa15f]/30 text-[#bfa15f] px-3 py-2 rounded text-xs font-bold uppercase tracking-wider">
                <CheckCircle2 size={13} /> Submitted to HOD
              </span>
            )}
          </div>
        </div>
      </PortalCard>

      {atktStudents.length > 0 ? (
        <PortalCard className="!p-0 overflow-hidden">
          <div className="p-3 border-b border-slate-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
            <div className="relative w-full sm:max-w-xs">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search students..."
                className="w-full pl-9 pr-3 py-1.5 text-sm border border-slate-200 rounded focus:outline-none focus:border-[#0b2545] bg-white"
              />
            </div>
            <div className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">
              Limits: Theory (Max 80) · Practical (Max 20)
            </div>
          </div>

          <PortalTable
            headers={['Roll Number', 'Student Name', 'Theory Marks', 'Practical Marks', 'Absent', 'Status']}
            rows={visibleRows}
            empty="No matching students found."
            renderRow={(row: AtktMarkRow) => {
              const isSubmitted = currentStatus === 'submitted'
              return (
                <tr key={row.enrollment} className="hover:bg-slate-50/60 transition-colors">
                  <td className="px-4 py-2.5 font-mono text-xs font-bold text-slate-800">{row.enrollment}</td>
                  <td className="px-4 py-2.5 text-sm font-semibold text-slate-700">{row.name}</td>
                  
                  <td className="px-4 py-2.5">
                    <input
                      type="text"
                      disabled={row.isAbsent || isSubmitted}
                      value={row.theoryMarks}
                      onChange={e => handleMarkChange(row.enrollment, 'theory', e.target.value)}
                      placeholder="0-80"
                      className={`w-16 border rounded text-center px-1 py-1 text-xs focus:outline-none transition-all ${
                        row.isAbsent
                          ? 'bg-slate-100 border-transparent text-slate-400 cursor-not-allowed'
                          : isSubmitted
                          ? 'bg-slate-50 border-transparent font-semibold text-slate-700'
                          : 'border-slate-200 bg-white focus:border-[#0b2545]'
                      }`}
                    />
                  </td>

                  <td className="px-4 py-2.5">
                    <input
                      type="text"
                      disabled={row.isAbsent || isSubmitted || selectedSubject?.type === 'Theory'}
                      value={selectedSubject?.type === 'Theory' ? 'N/A' : row.practicalMarks}
                      onChange={e => handleMarkChange(row.enrollment, 'practical', e.target.value)}
                      placeholder={selectedSubject?.type === 'Theory' ? '—' : '0-20'}
                      className={`w-16 border rounded text-center px-1 py-1 text-xs focus:outline-none transition-all ${
                        row.isAbsent || selectedSubject?.type === 'Theory'
                          ? 'bg-slate-100 border-transparent text-slate-400 cursor-not-allowed'
                          : isSubmitted
                          ? 'bg-slate-50 border-transparent font-semibold text-slate-700'
                          : 'border-slate-200 bg-white focus:border-[#0b2545]'
                      }`}
                    />
                  </td>

                  <td className="px-4 py-2.5">
                    <input
                      type="checkbox"
                      disabled={isSubmitted}
                      checked={row.isAbsent}
                      onChange={() => handleAbsentToggle(row.enrollment)}
                      className="rounded border-slate-350 text-[#0b2545] focus:ring-[#0b2545] w-3.5 h-3.5"
                    />
                  </td>

                  <td className="px-4 py-2.5 text-xs">
                    {row.isAbsent ? (
                      <span className="text-[#0b2545] bg-[#0b2545]/5 px-2 py-0.5 border border-[#0b2545]/15 rounded text-[10px] uppercase font-bold tracking-wide">
                        Absent
                      </span>
                    ) : isSubmitted ? (
                      <span className="text-[#bfa15f] font-semibold">Ready for Review</span>
                    ) : (
                      <span className="text-slate-400">In Progress</span>
                    )}
                  </td>
                </tr>
              )
            }}
          />
        </PortalCard>
      ) : (
        <PortalCard className="text-center py-12">
          <AlertCircle size={36} className="text-[#bfa15f] mx-auto mb-3" />
          <p className="text-sm font-semibold text-slate-700">No ATKT back-paper students enrolled for this subject.</p>
        </PortalCard>
      )}

      {toast && (
        <div className="fixed bottom-4 right-4 z-50 bg-[#bfa15f] text-white px-5 py-3 rounded-lg shadow-lg flex items-center gap-2 text-sm font-medium">
          <CheckCircle2 size={14} /> {toast}
        </div>
      )}
    </div>
  )
}

export default TeacherAtktFeed
