import React, { useState, useEffect } from 'react'
import { PageHeader, PortalCard, Badge } from '../../components/layout/PortalLayout'
import { getSubjects, getBranches, getActiveSession, type Subject, type Branch, type Session } from '../../services/examService'
import { Upload, Download, FileText } from 'lucide-react'

const ExamSubjectUpload: React.FC = () => {
  const [subjects, setSubjects] = useState<Subject[]>([])
  const [branches, setBranches] = useState<Branch[]>([])
  const [activeSession, setActiveSession] = useState<Session | undefined>(undefined)
  const [loading, setLoading] = useState(true)
  const [filterBranch, setFilterBranch] = useState('ALL')
  const [filterSem, setFilterSem] = useState('ALL')
  const [uploading, setUploading] = useState(false)
  const [uploaded, setUploaded] = useState(false)
  const [file, setFile] = useState<File | null>(null)

  useEffect(() => {
    Promise.all([getSubjects(), getBranches(), getActiveSession()]).then(([s, b, ses]) => {
      setSubjects(s); setBranches(b); setActiveSession(ses); setLoading(false)
    })
  }, [])

  const filtered = subjects.filter(s =>
    (filterBranch === 'ALL' || s.branch_id === filterBranch) &&
    (filterSem === 'ALL' || s.semester === +filterSem)
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

  const semesters = Array.from(new Set(subjects.map(s => s.semester))).sort()

  return (
    <div className="space-y-5">
      <PageHeader
        title="Upload Subject Data"
        subtitle={`Session: ${activeSession?.label ?? '…'} · Upload subject master data via CSV`}
      />

      {/* Upload Box */}
      <PortalCard>
        <h3 className="text-sm font-bold text-slate-700 mb-4">Upload Subject CSV</h3>
        <div className="bg-[#0b2545]/5 border border-[#0b2545]/20 rounded-lg p-4 mb-4 text-xs text-[#0b2545]">
          <strong>CSV Format:</strong> subject_id, subject_name, subject_type (Theory/Practical/Elective), semester, branch_id, credits, faculty_id
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <label className="flex-1">
            <div className="border-2 border-dashed border-slate-300 rounded-lg p-6 text-center cursor-pointer hover:border-primary hover:bg-primary/5 transition-all">
              <FileText size={24} className="mx-auto text-slate-400 mb-2" />
              <p className="text-sm text-slate-600 font-medium">{file ? file.name : 'Click to select CSV file'}</p>
              <p className="text-xs text-slate-400 mt-1">Only .csv files accepted</p>
            </div>
            <input type="file" accept=".csv" className="hidden" onChange={e => setFile(e.target.files?.[0] ?? null)} />
          </label>

          <div className="flex flex-col gap-2 justify-center sm:w-40">
            <button
              onClick={handleUpload}
              disabled={!file || uploading}
              className="flex items-center justify-center gap-2 bg-primary text-white px-4 py-2.5 rounded-lg text-sm font-semibold hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <Upload size={15} />
              {uploading ? 'Uploading...' : uploaded ? '✓ Done!' : 'Upload'}
            </button>
            <button className="flex items-center justify-center gap-2 border border-slate-200 text-slate-700 px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-slate-50 transition-colors">
              <Download size={15} /> Template
            </button>
          </div>
        </div>

        {uploaded && (
          <div className="mt-3 bg-[#bfa15f]/10 border border-[#bfa15f]/30 text-[#bfa15f] rounded px-4 py-2.5 text-sm">
            ✓ Subject data uploaded successfully!
          </div>
        )}
      </PortalCard>

      {/* Existing Subjects Table */}
      <PortalCard>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4">
          <h3 className="text-sm font-bold text-slate-700">Current Subject Master ({filtered.length})</h3>
          <div className="flex gap-2 flex-wrap">
            <select value={filterBranch} onChange={e => setFilterBranch(e.target.value)}
              className="border border-slate-200 rounded px-3 py-1.5 text-xs focus:outline-none focus:border-primary">
              <option value="ALL">All Branches</option>
              {branches.map(b => <option key={b.id} value={b.id}>{b.shortName}</option>)}
            </select>
            <select value={filterSem} onChange={e => setFilterSem(e.target.value)}
              className="border border-slate-200 rounded px-3 py-1.5 text-xs focus:outline-none focus:border-primary">
              <option value="ALL">All Semesters</option>
              {semesters.map(s => <option key={s} value={s}>Sem {s}</option>)}
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                {['ID', 'Subject Name', 'Type', 'Sem', 'Branch', 'Credits', 'Faculty'].map(h => (
                  <th key={h} className="text-left px-4 py-3 text-[11px] font-bold text-slate-500 uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map(s => (
                <tr key={s.id} className="hover:bg-slate-50/60">
                  <td className="px-4 py-2.5"><span className="font-mono text-xs bg-slate-100 px-2 py-0.5 rounded font-bold text-slate-700">{s.id}</span></td>
                  <td className="px-4 py-2.5 font-medium text-slate-800">{s.name}</td>
                  <td className="px-4 py-2.5">
                    <Badge
                      label={s.type}
                      variant={s.type === 'Theory' ? 'info' : s.type === 'Practical' ? 'success' : 'warning'}
                    />
                  </td>
                  <td className="px-4 py-2.5 text-xs text-slate-600">Sem {s.semester}</td>
                  <td className="px-4 py-2.5 text-xs text-slate-600">{s.branch_id}</td>
                  <td className="px-4 py-2.5 text-xs text-slate-600">{s.credits}</td>
                  <td className="px-4 py-2.5 text-xs text-slate-500">{s.facultyName ?? '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </PortalCard>
    </div>
  )
}

export default ExamSubjectUpload
