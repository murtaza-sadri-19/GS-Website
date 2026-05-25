import React, { useState, useEffect } from 'react'
import { PageHeader, PortalCard, Badge, SessionBanner } from '../../components/layout/PortalLayout'
import {
  getBranches, getCourses, getSubjects, getMarksRequests, getActiveSession,
  type Branch, type Course, type Subject, type MarksRequest, type Session,
} from '../../services/examService'
import { PlusCircle, X } from 'lucide-react'

// Simple local Toast component
interface ToastProps {
  message: string
  onClose: () => void
}
const Toast: React.FC<ToastProps> = ({ message, onClose }) => {
  useEffect(() => {
    const t = setTimeout(onClose, 3000)
    return () => clearTimeout(t)
  }, [onClose])
  
  return (
    <div className="fixed bottom-4 right-4 z-50 bg-[#0b2545] text-white px-5 py-3 rounded-lg shadow-lg flex items-center gap-3 text-sm font-medium">
      {message}
      <button onClick={onClose} className="hover:text-slate-300">
        <X size={14} />
      </button>
    </div>
  )
}

const componentMap: Record<string, string[]> = {
  Elective: ['CW', 'Theory'],
  Theory: ['CW', 'Theory'],
  Practical: ['SW', 'Practical'],
}

const subComponentMap: Record<string, string[]> = {
  CW: ['MST 1', 'MST 2', 'Assignment 1', 'Assignment 2'],
  Theory: ['Theory Exam'],
  SW: ['Viva 1', 'Viva 2'],
  Practical: ['External Viva', 'External Submission'],
}

const ExamMarksRequest: React.FC = () => {
  const [requests, setRequests] = useState<MarksRequest[]>([])
  const [branches, setBranches] = useState<Branch[]>([])
  const [courses, setCourses] = useState<Course[]>([])
  const [subjects, setSubjects] = useState<Subject[]>([])
  const [activeSession, setActiveSession] = useState<Session | undefined>(undefined)
  const [loading, setLoading] = useState(true)
  const [selectedBranch, setSelectedBranch] = useState('')
  const [selectedCourse, setSelectedCourse] = useState('')
  const [selectedSubject, setSelectedSubject] = useState('')
  const [subjectType, setSubjectType] = useState('')
  const [component, setComponent] = useState('')
  const [subComponent, setSubComponent] = useState('')
  const [dueDate, setDueDate] = useState('')

  const [submitting, setSubmitting] = useState(false)
  const [toast, setToast] = useState('')

  useEffect(() => {
    Promise.all([getBranches(), getCourses(), getSubjects(), getMarksRequests(), getActiveSession()]).then(([b, c, s, mr, ses]) => {
      setBranches(b); setCourses(c); setSubjects(s); setRequests(mr); setActiveSession(ses); setLoading(false)
    })
  }, [])

  // Filter courses & subjects based on selected branch
  const filteredCourses = courses.filter(c => c.branch_id === selectedBranch)
  const filteredSubjects = subjects.filter(s => s.branch_id === selectedBranch)

  // Reset dependent fields when branch changes
  useEffect(() => {
    setSelectedCourse('')
    setSelectedSubject('')
  }, [selectedBranch])

  // Reset component/subComponent when subject type changes
  useEffect(() => {
    setComponent('')
    setSubComponent('')
  }, [subjectType])

  // Reset sub-component when component changes
  useEffect(() => {
    setSubComponent('')
  }, [component])

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedBranch || !selectedCourse || !selectedSubject || !subjectType || !component || !subComponent || !dueDate) {
      setToast('Please fill all form fields.')
      return
    }

    setSubmitting(true)

    // Simulate network latency
    await new Promise(resolve => setTimeout(resolve, 1000))

    const subjectObj = subjects.find(s => s.id === selectedSubject)
    const newReq: MarksRequest = {
      id: `MR0${requests.length + 1}`,
      subjectId: selectedSubject,
      subjectName: subjectObj ? subjectObj.name : 'Unknown Subject',
      branch_id: selectedBranch,
      semester: subjectObj ? subjectObj.semester : 1,
      section: 'A',
      component,
      subComponent,
      dueDate,
      status: 'pending',
      facultyId: subjectObj?.facultyId || 'F001',
      facultyName: subjectObj?.facultyName || 'Faculty Member'
    }

    setRequests(prev => [newReq, ...prev])
    setSubmitting(false)
    setToast(`Marks fill request generated successfully for ${selectedSubject}.`)

    // Reset some form fields
    setSelectedSubject('')
    setSubjectType('')
    setComponent('')
    setSubComponent('')
    setDueDate('')
  }

  return (
    <div className="space-y-5">
      <PageHeader
        title="Marks Fill Requests"
        subtitle="Instruct faculty members to submit marks for specific branches, courses, and components before a due date"
      />

      {activeSession && <SessionBanner session={activeSession.label} />}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Form Column */}
        <div className="lg:col-span-1">
          <PortalCard>
            <h3 className="font-bold text-slate-800 text-sm mb-4 border-b border-slate-100 pb-2">
              Generate Marks Fill Request
            </h3>
            <form onSubmit={handleGenerate} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase tracking-wide mb-1">
                  Branch
                </label>
                <select
                  value={selectedBranch}
                  onChange={e => setSelectedBranch(e.target.value)}
                  required
                  className="w-full border border-slate-200 rounded px-3 py-2 text-sm bg-white focus:outline-none focus:border-primary"
                >
                  <option value="">Select Branch</option>
                  {branches.map(b => (
                    <option key={b.id} value={b.id}>
                      {b.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase tracking-wide mb-1">
                  Course
                </label>
                <select
                  value={selectedCourse}
                  onChange={e => setSelectedCourse(e.target.value)}
                  disabled={!selectedBranch}
                  required
                  className="w-full border border-slate-200 rounded px-3 py-2 text-sm bg-white focus:outline-none focus:border-primary disabled:opacity-60 disabled:bg-slate-50"
                >
                  <option value="">Select Course</option>
                  {filteredCourses.map(c => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase tracking-wide mb-1">
                  Subject
                </label>
                <select
                  value={selectedSubject}
                  onChange={e => setSelectedSubject(e.target.value)}
                  disabled={!selectedBranch}
                  required
                  className="w-full border border-slate-200 rounded px-3 py-2 text-sm bg-white focus:outline-none focus:border-primary disabled:opacity-60 disabled:bg-slate-50"
                >
                  <option value="">Select Subject</option>
                  {filteredSubjects.map(s => (
                    <option key={s.id} value={s.id}>
                      {s.id} - {s.name} (Sem {s.semester})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase tracking-wide mb-1">
                  Subject Type
                </label>
                <select
                  value={subjectType}
                  onChange={e => setSubjectType(e.target.value)}
                  required
                  className="w-full border border-slate-200 rounded px-3 py-2 text-sm bg-white focus:outline-none focus:border-primary"
                >
                  <option value="">Select Subject Type</option>
                  <option value="Theory">Theory</option>
                  <option value="Practical">Practical</option>
                  <option value="Elective">Elective</option>
                </select>
              </div>

              {subjectType && (
                <div>
                  <label className="block text-xs font-bold text-slate-600 uppercase tracking-wide mb-1">
                    Component
                  </label>
                  <select
                    value={component}
                    onChange={e => setComponent(e.target.value)}
                    required
                    className="w-full border border-slate-200 rounded px-3 py-2 text-sm bg-white focus:outline-none focus:border-primary"
                  >
                    <option value="">Select Component</option>
                    {(componentMap[subjectType] || []).map(comp => (
                      <option key={comp} value={comp}>
                        {comp}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {component && (
                <div>
                  <label className="block text-xs font-bold text-slate-600 uppercase tracking-wide mb-1">
                    Sub-Component
                  </label>
                  <select
                    value={subComponent}
                    onChange={e => setSubComponent(e.target.value)}
                    required
                    className="w-full border border-slate-200 rounded px-3 py-2 text-sm bg-white focus:outline-none focus:border-primary"
                  >
                    <option value="">Select Sub-Component</option>
                    {(subComponentMap[component] || []).map(sub => (
                      <option key={sub} value={sub}>
                        {sub}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase tracking-wide mb-1">
                  Due Date
                </label>
                <div className="relative">
                  <input
                    type="date"
                    value={dueDate}
                    onChange={e => setDueDate(e.target.value)}
                    required
                    className="w-full border border-slate-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-primary"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-primary hover:bg-primary/95 text-white py-2 rounded font-semibold text-sm transition-colors flex items-center justify-center gap-2 disabled:opacity-60"
              >
                <PlusCircle size={15} />
                <span>{submitting ? 'Generating...' : 'Generate Request'}</span>
              </button>
            </form>
          </PortalCard>
        </div>

        {/* List Column */}
        <div className="lg:col-span-2">
          <PortalCard>
            <div className="flex items-center justify-between border-b border-slate-100 pb-2 mb-4">
              <h3 className="font-bold text-slate-800 text-sm">Active Marks Requests</h3>
              <Badge label={`${requests.length} Requests`} variant="info" />
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200">
                    <th className="text-left px-4 py-3 text-[11px] font-bold text-slate-500 uppercase tracking-wider">Req ID</th>
                    <th className="text-left px-4 py-3 text-[11px] font-bold text-slate-500 uppercase tracking-wider">Subject</th>
                    <th className="text-left px-4 py-3 text-[11px] font-bold text-slate-500 uppercase tracking-wider">Component</th>
                    <th className="text-left px-4 py-3 text-[11px] font-bold text-slate-500 uppercase tracking-wider">Assigned Faculty</th>
                    <th className="text-left px-4 py-3 text-[11px] font-bold text-slate-500 uppercase tracking-wider">Due Date</th>
                    <th className="text-center px-4 py-3 text-[11px] font-bold text-slate-500 uppercase tracking-wider">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {requests.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="text-center py-8 text-slate-400 text-xs">
                        No requests found. Generate one to get started.
                      </td>
                    </tr>
                  ) : (
                    requests.map(req => (
                      <tr key={req.id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="px-4 py-3 font-semibold text-slate-800">{req.id}</td>
                        <td className="px-4 py-3 text-slate-700 font-medium">
                          <div>{req.subjectName}</div>
                          <div className="text-[10px] text-slate-400 font-mono mt-0.5">{req.subjectId}</div>
                        </td>
                        <td className="px-4 py-3 text-slate-600 text-xs">
                          <span className="font-semibold text-slate-700">{req.component}</span>
                          <span className="mx-1 text-slate-300">/</span>
                          <span>{req.subComponent}</span>
                        </td>
                        <td className="px-4 py-3 text-slate-600 text-xs">
                          {req.facultyName || 'Unassigned'}
                        </td>
                        <td className="px-4 py-3 text-slate-500 text-xs font-medium whitespace-nowrap">
                          {req.dueDate}
                        </td>
                        <td className="px-4 py-3 text-center">
                          <Badge
                            label={req.status}
                            variant={
                              req.status === 'submitted'
                                ? 'success'
                                : req.status === 'pending'
                                ? 'warning'
                                : req.status === 'overdue'
                                ? 'error'
                                : 'default'
                            }
                          />
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </PortalCard>
        </div>
      </div>

      {toast && <Toast message={toast} onClose={() => setToast('')} />}
    </div>
  )
}

export default ExamMarksRequest
