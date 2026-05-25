import React, { useState, useEffect } from 'react'
import { PageHeader, PortalCard, Badge } from '../../components/layout/PortalLayout'
import { getStudents, getBranches, getActiveSession, type Student, type Branch, type Session } from '../../services/examService'
import { Upload, Download, FileText } from 'lucide-react'

const ExamStudentUpload: React.FC = () => {
  const [students, setStudents] = useState<Student[]>([])
  const [branches, setBranches] = useState<Branch[]>([])
  const [activeSession, setActiveSession] = useState<Session | undefined>(undefined)
  const [loading, setLoading] = useState(true)
  const [filterBranch, setFilterBranch] = useState('ALL')
  const [filterSem, setFilterSem] = useState('ALL')
  const [search, setSearch] = useState('')
  const [uploading, setUploading] = useState(false)
  const [uploaded, setUploaded] = useState(false)
  const [file, setFile] = useState<File | null>(null)

  useEffect(() => {
    Promise.all([getStudents(), getBranches(), getActiveSession()]).then(([st, b, s]) => {
      setStudents(st); setBranches(b); setActiveSession(s); setLoading(false)
    })
  }, [])

  const filtered = students.filter(s =>
    (filterBranch === 'ALL' || s.branch_id === filterBranch) &&
    (filterSem === 'ALL' || s.semester === +filterSem) &&
    (s.student_name.toLowerCase().includes(search.toLowerCase()) || s.enrollment_no.includes(search))
  )

  const handleUpload = async () => {
    if (!file) return
    setUploading(true)
    await new Promise(r => setTimeout(r, 1200))
    setUploading(false)
    setUploaded(true)
    setTimeout(() => setUploaded(false), 3000)
    setFile(null)
  }

  const semesters = Array.from(new Set(students.map(s => s.semester))).sort()

  return (
    <div className="space-y-5">
      <PageHeader
        title="Student Data Upload"
        subtitle={`Session: ${activeSession?.label ?? '…'} · Upload student enrollment data via CSV`}
      />

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: 'Total Students', value: students.length, icon: '👥' },
          { label: 'CSE Branch', value: students.filter(s => s.branch_id === 'CSE').length, icon: '💻' },
          { label: 'IT Branch', value: students.filter(s => s.branch_id === 'IT').length, icon: '🌐' },
          { label: 'With ATKT', value: students.filter(s => s.hasATKT).length, icon: '⚠️' },
        ].map(stat => (
          <PortalCard key={stat.label} className="text-center !p-4">
            <p className="text-2xl mb-1">{stat.icon}</p>
            <p className="text-2xl font-bold text-primary">{stat.value}</p>
            <p className="text-[11px] text-slate-500 font-semibold uppercase tracking-wide mt-1">{stat.label}</p>
          </PortalCard>
        ))}
      </div>

      {/* Upload Box */}
      <PortalCard>
        <h3 className="text-sm font-bold text-slate-700 mb-4">Upload Student CSV</h3>
        <div className="bg-[#0b2545]/5 border border-[#0b2545]/20 rounded-lg p-4 mb-4 text-xs text-[#0b2545]">
          <strong>CSV Format:</strong> enrollment_no, student_name, branch_id, semester, section, email
        </div>
        <div className="flex flex-col sm:flex-row gap-3">
          <label className="flex-1 cursor-pointer">
            <div className="border-2 border-dashed border-slate-300 rounded-lg p-5 text-center hover:border-primary hover:bg-primary/5 transition-all">
              <FileText size={20} className="mx-auto text-slate-400 mb-2" />
              <p className="text-sm text-slate-600 font-medium">{file ? file.name : 'Select CSV file'}</p>
              <p className="text-xs text-slate-400 mt-1">Maximum 5000 student records per file</p>
            </div>
            <input type="file" accept=".csv" className="hidden" onChange={e => setFile(e.target.files?.[0] ?? null)} />
          </label>
          <div className="flex flex-col gap-2 justify-center sm:w-40">
            <button onClick={handleUpload} disabled={!file || uploading}
              className="flex items-center justify-center gap-2 bg-primary text-white px-4 py-2.5 rounded-lg text-sm font-semibold hover:bg-primary/90 disabled:opacity-50 transition-colors">
              <Upload size={15} /> {uploading ? 'Uploading...' : uploaded ? '✓ Done!' : 'Upload'}
            </button>
            <button className="flex items-center justify-center gap-2 border border-slate-200 text-slate-700 px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-slate-50 transition-colors">
              <Download size={15} /> Template
            </button>
          </div>
        </div>
        {uploaded && <div className="mt-3 bg-[#bfa15f]/10 border border-[#bfa15f]/30 text-[#bfa15f] rounded px-4 py-2.5 text-sm">✓ Student data uploaded successfully!</div>}
      </PortalCard>

      {/* Student Table */}
      <PortalCard>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4">
          <h3 className="text-sm font-bold text-slate-700">Enrolled Students ({filtered.length})</h3>
          <div className="flex gap-2 flex-wrap">
            <input type="text" placeholder="Search by name or enrollment..." value={search} onChange={e => setSearch(e.target.value)}
              className="border border-slate-200 rounded px-3 py-1.5 text-xs focus:outline-none focus:border-primary w-52" />
            <select value={filterBranch} onChange={e => setFilterBranch(e.target.value)}
              className="border border-slate-200 rounded px-3 py-1.5 text-xs focus:outline-none focus:border-primary">
              <option value="ALL">All Branches</option>
              {branches.map(b => <option key={b.id} value={b.id}>{b.shortName}</option>)}
            </select>
            <select value={filterSem} onChange={e => setFilterSem(e.target.value)}
              className="border border-slate-200 rounded px-3 py-1.5 text-xs focus:outline-none focus:border-primary">
              <option value="ALL">All Sems</option>
              {semesters.map(s => <option key={s} value={s}>Sem {s}</option>)}
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                {['Enrollment No.', 'Student Name', 'Branch', 'Sem', 'Section', 'Email', 'ATKT'].map(h => (
                  <th key={h} className="text-left px-4 py-3 text-[11px] font-bold text-slate-500 uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map(s => (
                <tr key={s.enrollment_no} className="hover:bg-slate-50/60">
                  <td className="px-4 py-2.5"><span className="font-mono text-xs font-bold text-slate-700">{s.enrollment_no}</span></td>
                  <td className="px-4 py-2.5 font-medium text-slate-800">{s.student_name}</td>
                  <td className="px-4 py-2.5"><Badge label={s.branch_id} variant="info" /></td>
                  <td className="px-4 py-2.5 text-xs text-slate-600">Sem {s.semester}</td>
                  <td className="px-4 py-2.5 text-xs text-slate-600">Section {s.section ?? '—'}</td>
                  <td className="px-4 py-2.5 text-xs text-slate-500">—</td>
                  <td className="px-4 py-2.5"><Badge label={s.hasATKT ? 'Yes' : 'No'} variant={s.hasATKT ? 'warning' : 'default'} /></td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={7} className="px-4 py-8 text-center text-sm text-slate-400">No students found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </PortalCard>
    </div>
  )
}

export default ExamStudentUpload
