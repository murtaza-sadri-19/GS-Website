import React, { useMemo, useState, useEffect } from 'react'
import { PageHeader, PortalCard, PortalTable } from '../../components/layout/PortalLayout'
import { getSubjects, getStudents, getMarksRequests, type Subject, type Student, type MarksRequest } from '../../services/examService'
import { useAdminStore } from '../../store/adminStore'
import { CURRENT_TEACHER_ID, SUBJECT_COS, type CourseOutcome } from '../../data/mockTeacherContent'
import { Save, Send, AlertTriangle, CheckCircle2, Search, ClipboardList } from 'lucide-react'

interface StudentMarkRow {
  enrollment: string
  name: string
  co_marks: Record<string, string> // Store string inputs for ease of editing
  isAbsent: boolean
}

const TeacherMarksFeed: React.FC = () => {
  const { user } = useAdminStore()
  const teacherId = user?.employeeId ?? CURRENT_TEACHER_ID

  const [allSubjects, setAllSubjects] = useState<Subject[]>([])
  const [allStudents, setAllStudents] = useState<Student[]>([])
  const [allMarksRequests, setAllMarksRequests] = useState<MarksRequest[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([getSubjects(), getStudents(), getMarksRequests()]).then(([subs, studs, mrs]) => {
      setAllSubjects(subs)
      setAllStudents(studs)
      setAllMarksRequests(mrs)
      setLoading(false)
    })
  }, [])

  const [selectedSubjectId, setSelectedSubjectId] = useState<string>('CS301')
  const [selectedSection, setSelectedSection] = useState<string>('A')
  const [selectedComponentId, setSelectedComponentId] = useState<string>('MR001') // MARKS_REQUESTS id
  const [searchQuery, setSearchQuery] = useState('')
  const [toast, setToast] = useState('')

  // Get subjects taught by this teacher
  const mineSubjects = useMemo(() => allSubjects.filter(s => s.facultyId === teacherId), [allSubjects, teacherId])
  const selectedSubject = useMemo(() => mineSubjects.find(s => s.id === selectedSubjectId), [mineSubjects, selectedSubjectId])

  // Get marks requests for selected subject
  const marksRequests = useMemo(() => {
    return allMarksRequests.filter(r => r.subjectId === selectedSubjectId && r.facultyId === teacherId)
  }, [allMarksRequests, selectedSubjectId, teacherId])

  const selectedRequest = useMemo(() => {
    return marksRequests.find(r => r.id === selectedComponentId) ?? marksRequests[0]
  }, [marksRequests, selectedComponentId])

  // Get COs for this subject
  const cos: CourseOutcome[] = useMemo(() => SUBJECT_COS[selectedSubjectId] ?? [], [selectedSubjectId])

  // Find students in this subject's branch, semester, and section
  const relevantStudents = useMemo(() => {
    if (!selectedSubject) return []
    return allStudents.filter(
      s => s.branch_id === selectedSubject.branch_id && s.semester === selectedSubject.semester && s.section === selectedSection
    )
  }, [allStudents, selectedSubject, selectedSection])

  // Track page-level state of marks rows (initialized when subject/section/request changes)
  const [marksState, setMarksState] = useState<Record<string, Record<string, StudentMarkRow>>>({})

  const activeKey = `${selectedSubjectId}-${selectedSection}-${selectedRequest?.id ?? 'default'}`

  const rows: StudentMarkRow[] = useMemo(() => {
    const existing = marksState[activeKey]
    if (existing) return Object.values(existing)

    // Otherwise, generate initial rows
    const initialRows: Record<string, StudentMarkRow> = {}
    relevantStudents.forEach(s => {
      const co_marks: Record<string, string> = {}
      cos.forEach(co => {
        // Mock some pre-filled marks if the request status is submitted
        if (selectedRequest?.status === 'submitted') {
          co_marks[co.co_name] = String(Math.floor(Math.random() * (co.max_marks + 1)))
        } else {
          co_marks[co.co_name] = ''
        }
      })
      initialRows[s.enrollment] = {
        enrollment: s.enrollment,
        name: s.name,
        co_marks,
        isAbsent: selectedRequest?.status === 'submitted' ? Math.random() < 0.05 : false,
      }
    })
    return Object.values(initialRows)
  }, [relevantStudents, cos, activeKey, selectedRequest, marksState])

  // Filter rows by search
  const visibleRows = useMemo(() => {
    return rows.filter(
      r =>
        r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.enrollment.toLowerCase().includes(searchQuery.toLowerCase())
    )
  }, [rows, searchQuery])

  const showToast = (msg: string) => {
    setToast(msg)
    setTimeout(() => setToast(''), 2400)
  }

  const handleMarkChange = (enrollment: string, co_name: string, val: string) => {
    // Basic validation for numbers
    if (val !== '' && isNaN(Number(val))) return
    
    // Check max marks
    const max = cos.find(c => c.co_name === co_name)?.max_marks ?? 99
    if (Number(val) > max) return

    setMarksState(prev => {
      const currentGroup = prev[activeKey] || {}
      const targetRow = currentGroup[enrollment] || {
        enrollment,
        name: relevantStudents.find(s => s.enrollment === enrollment)?.name ?? '',
        co_marks: {},
        isAbsent: false,
      }
      return {
        ...prev,
        [activeKey]: {
          ...currentGroup,
          [enrollment]: {
            ...targetRow,
            co_marks: {
              ...targetRow.co_marks,
              [co_name]: val,
            },
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
        name: relevantStudents.find(s => s.enrollment === enrollment)?.name ?? '',
        co_marks: {},
        isAbsent: false,
      }
      const isAbsent = !targetRow.isAbsent
      const clearedMarks = { ...targetRow.co_marks }
      if (isAbsent) {
        cos.forEach(co => { clearedMarks[co.co_name] = '' })
      }
      return {
        ...prev,
        [activeKey]: {
          ...currentGroup,
          [enrollment]: {
            ...targetRow,
            co_marks: clearedMarks,
            isAbsent,
          },
        },
      }
    })
  }

  const save = (submit: boolean) => {
    // Validate that all marks are filled for non-absent students
    if (submit) {
      const incomplete = rows.some(r => !r.isAbsent && cos.some(co => r.co_marks[co.co_name] === ''))
      if (incomplete) {
        alert('Cannot submit. Please fill in marks for all students or check "Absent".')
        return
      }
    }

    if (selectedRequest) {
      selectedRequest.status = submit ? 'submitted' : 'pending'
    }
    showToast(submit ? 'Marks submitted to HOD successfully.' : 'Draft saved locally.')
  }

  return (
    <div className="space-y-5">
      <PageHeader
        title="Marks Entry Panel"
        subtitle="Record course-outcome-wise marks for regular subjects"
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Selection panel */}
        <PortalCard className="md:col-span-3">
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
            <div className="block">
              <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wide mb-1">Subject</label>
              <select
                value={selectedSubjectId}
                onChange={e => {
                  setSelectedSubjectId(e.target.value)
                  const subReqs = allMarksRequests.filter(r => r.subjectId === e.target.value && r.facultyId === teacherId)
                  setSelectedComponentId(subReqs[0]?.id ?? '')
                }}
                className="w-full border border-slate-200 rounded px-3 py-2 text-sm bg-white focus:outline-none focus:border-[#0b2545]"
              >
                {mineSubjects.map(s => (
                  <option key={s.id} value={s.id}>{s.id} — {s.name}</option>
                ))}
              </select>
            </div>

            <div className="block">
              <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wide mb-1">Section</label>
              <select
                value={selectedSection}
                onChange={e => setSelectedSection(e.target.value)}
                className="w-full border border-slate-200 rounded px-3 py-2 text-sm bg-white focus:outline-none focus:border-[#0b2545]"
              >
                <option value="A">Section A</option>
                <option value="B">Section B</option>
              </select>
            </div>

            <div className="block sm:col-span-2">
              <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wide mb-1">Component / Test</label>
              <select
                value={selectedComponentId}
                onChange={e => setSelectedComponentId(e.target.value)}
                className="w-full border border-slate-200 rounded px-3 py-2 text-sm bg-white focus:outline-none focus:border-[#0b2545]"
              >
                {marksRequests.map(r => (
                  <option key={r.id} value={r.id}>
                    [{r.component}] {r.subComponent} (Due: {r.dueDate})
                  </option>
                ))}
                {marksRequests.length === 0 && (
                  <option value="">No components requested</option>
                )}
              </select>
            </div>
          </div>
        </PortalCard>
      </div>

      {selectedRequest ? (
        <div className="space-y-4">
          {/* Status info bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded bg-[#bfa15f]/10 flex items-center justify-center">
                <ClipboardList size={15} className="text-[#bfa15f]" />
              </div>
              <div>
                <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Status of active component</p>
                <p className="text-sm font-bold text-slate-800">
                  {selectedRequest.component} — {selectedRequest.subComponent}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className={`text-xs font-bold px-2.5 py-1 rounded border uppercase tracking-wider ${
                selectedRequest.status === 'submitted'
                  ? 'bg-[#bfa15f]/10 text-[#bfa15f] border-[#bfa15f]/30'
                  : selectedRequest.status === 'overdue'
                  ? 'bg-[#0b2545]/10 text-[#0b2545] border-[#0b2545]/25 animate-pulse'
                  : 'bg-[#bfa15f]/20 text-[#bfa15f] border-[#bfa15f]/40'
              }`}>
                {selectedRequest.status === 'submitted' ? 'Submitted' : selectedRequest.status === 'overdue' ? 'Overdue' : 'Draft / Pending'}
              </span>

              {selectedRequest.status !== 'submitted' && (
                <div className="flex gap-2">
                  <button
                    onClick={() => save(false)}
                    className="inline-flex items-center gap-1 text-xs font-bold text-[#0b2545] hover:bg-[#0b2545]/5 border border-[#0b2545]/20 px-3 py-1.5 rounded transition-all"
                  >
                    <Save size={13} /> Save Draft
                  </button>
                  <button
                    onClick={() => save(true)}
                    className="inline-flex items-center gap-1 text-xs font-bold text-white bg-[#0b2545] hover:bg-[#0b2545]/90 px-3 py-1.5 rounded transition-all"
                  >
                    <Send size={13} /> Submit HOD
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Search table bar */}
          <PortalCard className="!p-0 overflow-hidden">
            <div className="p-3 border-b border-slate-100 flex items-center">
              <div className="relative flex-1 max-w-md">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder="Search students by roll number or name..."
                  className="w-full pl-9 pr-3 py-1.5 text-sm border border-slate-200 rounded focus:outline-none focus:border-[#0b2545] bg-white"
                />
              </div>
              <div className="ml-auto text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                Max Marks per CO:{' '}
                {cos.map((co, idx) => (
                  <span key={co.co_name} className="text-[#bfa15f] ml-1.5">
                    {co.co_name} ({co.max_marks}){idx < cos.length - 1 ? ',' : ''}
                  </span>
                ))}
              </div>
            </div>

            <PortalTable
              headers={['Roll Number', 'Student Name', ...cos.map(co => co.co_name), 'Absent', 'Total Marks']}
              rows={visibleRows}
              empty="No students allocated for this criteria."
              renderRow={(row: StudentMarkRow) => {
                const total = cos.reduce((sum, co) => {
                  const val = row.co_marks[co.co_name]
                  return sum + (val ? Number(val) : 0)
                }, 0)

                const isSubmitted = selectedRequest.status === 'submitted'

                return (
                  <tr key={row.enrollment} className="hover:bg-slate-50/60 transition-colors">
                    <td className="px-4 py-2.5 font-mono text-xs font-bold text-slate-800">{row.enrollment}</td>
                    <td className="px-4 py-2.5 text-sm font-semibold text-slate-700">{row.name}</td>
                    
                    {/* Render inputs for COs */}
                    {cos.map(co => (
                      <td key={co.co_name} className="px-4 py-2.5">
                        <input
                          type="text"
                          disabled={row.isAbsent || isSubmitted}
                          value={row.co_marks[co.co_name] ?? ''}
                          onChange={e => handleMarkChange(row.enrollment, co.co_name, e.target.value)}
                          placeholder={`0-${co.max_marks}`}
                          className={`w-16 border rounded text-center px-1 py-1 text-xs focus:outline-none transition-all ${
                            row.isAbsent
                              ? 'bg-slate-100 border-transparent text-slate-450 cursor-not-allowed'
                              : isSubmitted
                              ? 'bg-slate-50 border-transparent font-semibold text-slate-700'
                              : 'border-slate-200 bg-white focus:border-[#0b2545]'
                          }`}
                        />
                      </td>
                    ))}

                    <td className="px-4 py-2.5">
                      <input
                        type="checkbox"
                        disabled={isSubmitted}
                        checked={row.isAbsent}
                        onChange={() => handleAbsentToggle(row.enrollment)}
                        className="rounded border-slate-350 text-[#0b2545] focus:ring-[#0b2545] w-3.5 h-3.5"
                      />
                    </td>

                    <td className="px-4 py-2.5 font-bold text-slate-800 text-sm">
                      {row.isAbsent ? (
                        <span className="text-[#0b2545] bg-[#0b2545]/5 px-2 py-0.5 border border-[#0b2545]/15 rounded text-[10px] uppercase tracking-wide">
                          Absent
                        </span>
                      ) : (
                        `${total} / ${cos.reduce((sum, c) => sum + c.max_marks, 0)}`
                      )}
                    </td>
                  </tr>
                )
              }}
            />
          </PortalCard>
        </div>
      ) : (
        <PortalCard className="text-center py-12">
          <AlertTriangle size={36} className="text-[#bfa15f] mx-auto mb-3" />
          <p className="text-sm font-semibold text-slate-700">No active marks entry requests from HOD / Exam Cell.</p>
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

export default TeacherMarksFeed
