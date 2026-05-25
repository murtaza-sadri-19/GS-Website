import React, { useState, useEffect } from 'react'
import { PageHeader, PortalCard, PortalModal, Badge } from '../../components/layout/PortalLayout'
import { getBranches, getCourses, type Branch, type Course } from '../../services/examService'
import { Plus, Search, Trash2, Globe, X } from 'lucide-react'

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

interface ResultItem {
  id: string
  title: string
  branch_id: string
  course_id: string
  semester: number
  type: 'Regular' | 'ATKT'
  releaseDate: string
  fileUrl: string
}

const MOCK_RESULTS: ResultItem[] = [
  {
    id: 'res1',
    title: 'BE CSE 4th Semester Regular Examination Results',
    branch_id: 'CSE',
    course_id: 'CSE-BE',
    semester: 4,
    type: 'Regular',
    releaseDate: '2026-05-20',
    fileUrl: 'https://sgsits.ac.in/exam/results/cse_4th_regular_res.pdf',
  },
  {
    id: 'res2',
    title: 'BE IT 5th Semester ATKT Examination Results',
    branch_id: 'IT',
    course_id: 'IT-BE',
    semester: 5,
    type: 'ATKT',
    releaseDate: '2026-05-18',
    fileUrl: 'https://sgsits.ac.in/exam/results/it_5th_atkt_res.pdf',
  },
  {
    id: 'res3',
    title: 'ME CSE 2nd Semester Regular Examination Results',
    branch_id: 'CSE',
    course_id: 'CSE-ME',
    semester: 2,
    type: 'Regular',
    releaseDate: '2026-03-10',
    fileUrl: 'https://sgsits.ac.in/exam/results/cse_me_2nd_res.pdf',
  },
]

const ExamResults: React.FC = () => {
  const [results, setResults] = useState<ResultItem[]>(MOCK_RESULTS)
  const [branches, setBranches] = useState<Branch[]>([])
  const [courses, setCourses] = useState<Course[]>([])
  const [search, setSearch] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [toast, setToast] = useState('')

  useEffect(() => {
    Promise.all([getBranches(), getCourses()]).then(([b, c]) => {
      setBranches(b); setCourses(c)
    })
  }, [])

  // Form State
  const [title, setTitle] = useState('')
  const [branch, setBranch] = useState('')
  const [course, setCourse] = useState('')
  const [semester, setSemester] = useState(1)
  const [type, setType] = useState<'Regular' | 'ATKT'>('Regular')
  const [releaseDate, setReleaseDate] = useState(new Date().toISOString().slice(0, 10))
  const [fileUrl, setFileUrl] = useState('')

  const handleOpenAdd = () => {
    setTitle('')
    setBranch('')
    setCourse('')
    setSemester(1)
    setType('Regular')
    setReleaseDate(new Date().toISOString().slice(0, 10))
    setFileUrl('')
    setShowModal(true)
  }

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault()
    if (!title || !branch || !course || !fileUrl) {
      setToast('Please fill all fields.')
      return
    }

    const newItem: ResultItem = {
      id: `res${Date.now()}`,
      title,
      branch_id: branch,
      course_id: course,
      semester: Number(semester),
      type,
      releaseDate,
      fileUrl,
    }

    setResults(prev => [newItem, ...prev])
    setToast('Result sheet uploaded successfully.')
    setShowModal(false)
  }

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this result sheet?')) {
      setResults(prev => prev.filter(r => r.id !== id))
      setToast('Result sheet deleted successfully.')
    }
  }

  const filteredResults = results.filter(r =>
    r.title.toLowerCase().includes(search.toLowerCase()) ||
    r.branch_id.toLowerCase().includes(search.toLowerCase())
  )

  const filteredCourses = courses.filter(c => c.branch_id === branch)

  return (
    <div className="space-y-5">
      <PageHeader
        title="Exam Results"
        subtitle="Upload and manage results lists per Course, Branch, Semester, and Examination Session"
        action={
          <button
            onClick={handleOpenAdd}
            className="bg-primary hover:bg-primary/95 text-white text-sm font-semibold px-4 py-2 rounded-lg flex items-center gap-2 transition-colors shadow-sm"
          >
            <Plus size={15} />
            <span>Upload Result PDF</span>
          </button>
        }
      />

      <div className="flex items-center gap-3 bg-white p-3 border border-slate-200 rounded-xl shadow-sm">
        <Search className="text-slate-400 shrink-0" size={18} />
        <input
          type="text"
          placeholder="Search results by title, course, branch..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full text-sm text-slate-700 bg-transparent focus:outline-none"
        />
      </div>

      <PortalCard>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="text-left px-4 py-3 text-[11px] font-bold text-slate-500 uppercase tracking-wider">Title</th>
                <th className="text-left px-4 py-3 text-[11px] font-bold text-slate-500 uppercase tracking-wider">Course / Branch</th>
                <th className="text-center px-4 py-3 text-[11px] font-bold text-slate-500 uppercase tracking-wider">Sem</th>
                <th className="text-center px-4 py-3 text-[11px] font-bold text-slate-500 uppercase tracking-wider">Type</th>
                <th className="text-left px-4 py-3 text-[11px] font-bold text-slate-500 uppercase tracking-wider">Declared Date</th>
                <th className="text-center px-4 py-3 text-[11px] font-bold text-slate-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredResults.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-8 text-slate-400 text-xs">
                    No results found. Upload one to get started.
                  </td>
                </tr>
              ) : (
                filteredResults.map(res => (
                  <tr key={res.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-4 py-3">
                      <a
                        href={res.fileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-semibold text-slate-800 hover:text-primary hover:underline block"
                      >
                        {res.title}
                      </a>
                    </td>
                    <td className="px-4 py-3 text-slate-600 text-xs font-semibold">
                      {courses.find(c => c.id === res.course_id)?.name || res.course_id} ({res.branch_id})
                    </td>
                    <td className="px-4 py-3 text-center text-slate-600 text-xs font-bold">
                      {res.semester}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <Badge
                        label={res.type}
                        variant={res.type === 'Regular' ? 'info' : 'warning'}
                      />
                    </td>
                    <td className="px-4 py-3 text-slate-500 text-xs font-semibold whitespace-nowrap">
                      {res.releaseDate}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        <a
                          href={res.fileUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-1.5 text-slate-500 hover:text-primary hover:bg-slate-100 rounded transition-colors"
                          title="Open PDF File"
                        >
                          <Globe size={13} />
                        </a>
                        <button
                          onClick={() => handleDelete(res.id)}
                          className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                          title="Delete Result"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </PortalCard>

      {/* Add Modal */}
      <PortalModal isOpen={showModal} title="Upload Examination Results PDF" onClose={() => setShowModal(false)}>
        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-600 uppercase tracking-wide mb-1">
              Result Sheet Title
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="e.g. BE IV Sem CSE Regular Exam Results June 2026"
              className="w-full border border-slate-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-primary"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-600 uppercase tracking-wide mb-1">
                Branch
              </label>
              <select
                value={branch}
                onChange={e => setBranch(e.target.value)}
                required
                className="w-full border border-slate-200 rounded px-3 py-2 text-sm bg-white focus:outline-none focus:border-primary"
              >
                <option value="">Select Branch</option>
                {branches.map(b => (
                  <option key={b.id} value={b.id}>
                    {b.shortName}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-600 uppercase tracking-wide mb-1">
                Course
              </label>
              <select
                value={course}
                onChange={e => setCourse(e.target.value)}
                disabled={!branch}
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
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="col-span-1">
              <label className="block text-xs font-bold text-slate-600 uppercase tracking-wide mb-1">
                Semester
              </label>
              <select
                value={semester}
                onChange={e => setSemester(Number(e.target.value))}
                required
                className="w-full border border-slate-200 rounded px-3 py-2 text-sm bg-white focus:outline-none focus:border-primary"
              >
                {[1, 2, 3, 4, 5, 6, 7, 8].map(sem => (
                  <option key={sem} value={sem}>
                    Sem {sem}
                  </option>
                ))}
              </select>
            </div>
            <div className="col-span-1">
              <label className="block text-xs font-bold text-slate-600 uppercase tracking-wide mb-1">
                Exam Type
              </label>
              <select
                value={type}
                onChange={e => setType(e.target.value as 'Regular' | 'ATKT')}
                required
                className="w-full border border-slate-200 rounded px-3 py-2 text-sm bg-white focus:outline-none focus:border-primary"
              >
                <option value="Regular">Regular</option>
                <option value="ATKT">ATKT</option>
              </select>
            </div>
            <div className="col-span-1">
              <label className="block text-xs font-bold text-slate-600 uppercase tracking-wide mb-1">
                Declared On
              </label>
              <input
                type="date"
                required
                value={releaseDate}
                onChange={e => setReleaseDate(e.target.value)}
                className="w-full border border-slate-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-primary"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-600 uppercase tracking-wide mb-1">
              Results Sheet PDF Link
            </label>
            <input
              type="url"
              required
              value={fileUrl}
              onChange={e => setFileUrl(e.target.value)}
              placeholder="https://example.com/exam/results/results.pdf"
              className="w-full border border-slate-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-primary"
            />
          </div>

          <div className="flex items-center gap-3 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setShowModal(false)}
              className="flex-1 py-2 border border-slate-200 text-slate-700 rounded font-semibold text-sm hover:bg-slate-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 py-2 bg-primary text-white rounded font-semibold text-sm hover:bg-primary/95 transition-colors"
            >
              Upload Results PDF
            </button>
          </div>
        </form>
      </PortalModal>

      {toast && <Toast message={toast} onClose={() => setToast('')} />}
    </div>
  )
}

export default ExamResults
