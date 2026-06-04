import React, { useMemo, useState, useEffect, useRef } from 'react'
import { PageHeader, PortalCard, PortalModal } from '../../components/layout/PortalLayout'
import { getElectiveSubjects, type ElectiveSubject } from '../../services/examService'
import { useAdminStore } from '../../store/adminStore'
import { UploadCloud, Search, Users, CheckCircle2, Clock, X, FileText, Download, AlertCircle, Loader2 } from 'lucide-react'
import apiClient from '../../api/client'

const HOD_BRANCH = 'CSE'

interface ElectiveEnrolment { enrollment: string; studentName: string; subjectId: string }

const HodElectiveData: React.FC = () => {
  const { user } = useAdminStore()
  const hodBranch = user?.department_id ? String(user.department_id) : HOD_BRANCH
  const [electives, setElectives] = useState<ElectiveSubject[]>([])
  const [loading, setLoading] = useState(true)
  const [enrolments, setEnrolments] = useState<ElectiveEnrolment[]>([])

  useEffect(() => {
    getElectiveSubjects(hodBranch).then(e => {
      setElectives(e)
      setLoading(false)
    }).catch(() => setLoading(false))
  }, [hodBranch])
  const [search, setSearch] = useState('')
  const [uploadTarget, setUploadTarget] = useState<ElectiveSubject | null>(null)
  const [viewing, setViewing] = useState<ElectiveSubject | null>(null)
  const [csvPreview, setCsvPreview] = useState<ElectiveEnrolment[]>([])
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)
  const [uploadError, setUploadError] = useState('')
  const [toast, setToast] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)

  const visible = useMemo(() => electives.filter(e => {
    if (search.trim()) {
      const q = search.toLowerCase()
      if (!e.id.toLowerCase().includes(q) && !e.name.toLowerCase().includes(q)) return false
    }
    return true
  }), [electives, search])

  const countFor = (id: string) => enrolments.filter(e => e.subjectId === id).length

  const stats = {
    total: electives.length,
    uploaded: electives.filter(e => e.uploadStatus === 'uploaded').length,
    pending: electives.filter(e => e.uploadStatus === 'pending').length,
    enrolments: enrolments.length,
  }

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(''), 2400) }

  const openUpload = (e: ElectiveSubject) => {
    setUploadTarget(e)
    setSelectedFile(null)
    setCsvPreview([])
    setUploadError('')
  }

  const handleFileSelect = (file: File) => {
    if (!file.name.endsWith('.csv')) {
      setUploadError('Please select a valid .csv file.')
      return
    }
    setSelectedFile(file)
    setUploadError('')
    // Parse CSV for preview
    const reader = new FileReader()
    reader.onload = (ev) => {
      const text = ev.target?.result as string
      const lines = text.trim().split('\n').slice(1) // skip header
      const rows: ElectiveEnrolment[] = lines.slice(0, 10).map(line => {
        const [enrollment, studentName, subjectId] = line.split(',').map(s => s.trim())
        return { enrollment: enrollment || '', studentName: studentName || '', subjectId: subjectId || uploadTarget?.id || '' }
      }).filter(r => r.enrollment)
      setCsvPreview(rows)
    }
    reader.readAsText(file)
  }

  const confirmUpload = async () => {
    if (!uploadTarget || !selectedFile || uploading) return
    setUploading(true)
    setUploadError('')
    try {
      const formData = new FormData()
      formData.append('file', selectedFile)
      formData.append('department_id', hodBranch)
      formData.append('subject_id', String(uploadTarget.db_id ?? uploadTarget.id))

      await apiClient.post('/v1/academic/electives/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })

      setEnrolments(prev => [...prev.filter(p => p.subjectId !== uploadTarget.id), ...csvPreview])
      setElectives(prev => prev.map(e =>
        e.id === uploadTarget.id ? { ...e, uploadStatus: 'uploaded', uploadedOn: new Date().toISOString().slice(0, 10) } : e
      ))
      showToast(`${csvPreview.length} enrolments uploaded for ${uploadTarget.id}.`)
      setUploadTarget(null)
      setSelectedFile(null)
      setCsvPreview([])
    } catch (err: any) {
      setUploadError(err?.response?.data?.message || 'Upload failed. Check your CSV format and try again.')
    } finally {
      setUploading(false)
    }
  }

  const downloadTemplate = () => {
    const head = 'enrollment_no,student_name,subject_id\n'
    const sample = '0901CS21001,Aarav Sharma,CS502\n0901CS21002,Priya Verma,CS502\n'
    const blob = new Blob([head + sample], { type: 'text/csv' })
    const a = document.createElement('a')
    a.href = URL.createObjectURL(blob)
    a.download = 'elective-enrolment-template.csv'
    a.click()
  }

  return (
    <div className="space-y-5">
      <PageHeader
        title="Elective Data Upload"
        subtitle="Upload the list of students opting for each elective subject"
        action={
          <button onClick={downloadTemplate} className="inline-flex items-center gap-1.5 px-3.5 py-2 border border-slate-200 text-slate-700 text-xs font-bold rounded-md hover:bg-slate-50 transition-colors">
            <Download size={13} /> CSV Template
          </button>
        }
      />

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <Stat label="Electives" value={stats.total} accent="text-primary" />
        <Stat label="Uploaded" value={stats.uploaded} accent="text-accent" />
        <Stat label="Pending" value={stats.pending} accent="text-accent" />
        <Stat label="Enrolments" value={stats.enrolments} accent="text-primary" />
      </div>

      <PortalCard className="!p-3">
        <div className="relative">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search electives..." className="w-full pl-9 pr-3 py-2 text-sm border border-slate-200 rounded focus:outline-none focus:border-primary" />
        </div>
      </PortalCard>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {visible.map(e => {
          const count = countFor(e.id)
          return (
            <PortalCard key={e.id}>
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3 min-w-0">
                  <div className="w-10 h-10 rounded-lg bg-accent/10 border border-accent/30 flex items-center justify-center shrink-0">
                    <FileText size={16} className="text-accent" />
                  </div>
                  <div className="min-w-0">
                    <h4 className="font-bold text-slate-800 text-sm">{e.name}</h4>
                    <p className="text-xs text-slate-500 mt-0.5">{e.id} · Sem {e.semester} · {e.type}</p>
                  </div>
                </div>
                {e.uploadStatus === 'uploaded'
                  ? <span className="text-xs font-bold px-2 py-0.5 rounded border bg-accent/10 text-accent border-accent/30 uppercase tracking-wide shrink-0 inline-flex items-center gap-1"><CheckCircle2 size={10} /> Uploaded</span>
                  : <span className="text-xs font-bold px-2 py-0.5 rounded border bg-primary/10 text-primary border-primary/25 uppercase tracking-wide shrink-0 inline-flex items-center gap-1"><Clock size={10} /> Pending</span>
                }
              </div>

              <div className="grid grid-cols-2 gap-2 mt-4">
                <Metric label="Students Enrolled" value={count} icon={Users} />
                <Metric label="Last Upload" value={e.uploadedOn ?? '—'} icon={UploadCloud} />
              </div>

              <div className="flex items-center gap-2 mt-3 pt-3 border-t border-slate-100">
                <button onClick={() => openUpload(e)} className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-1.5 bg-primary text-white text-xs font-bold rounded hover:bg-primary/90">
                  <UploadCloud size={12} /> {e.uploadStatus === 'uploaded' ? 'Re-upload' : 'Upload CSV'}
                </button>
                {count > 0 && (
                  <button onClick={() => setViewing(e)} className="px-3 py-1.5 border border-slate-200 text-slate-700 text-xs font-bold rounded hover:bg-slate-50">
                    View ({count})
                  </button>
                )}
              </div>
            </PortalCard>
          )
        })}
      </div>

      <PortalModal isOpen={!!uploadTarget} title={`Upload Enrolment — ${uploadTarget?.name ?? ''}`} onClose={() => { setUploadTarget(null); setSelectedFile(null); setCsvPreview([]); setUploadError('') }} width="max-w-lg">
        {uploadTarget && (
          <div className="space-y-3">
            {/* Real file input */}
            <div
              className="border-2 border-dashed border-slate-200 rounded-lg p-5 text-center hover:border-accent/50 transition-colors cursor-pointer"
              onClick={() => fileInputRef.current?.click()}
            >
              <UploadCloud size={28} className="text-accent mx-auto mb-2" />
              <p className="text-sm font-semibold text-slate-700">
                {selectedFile ? selectedFile.name : 'Click to select CSV file'}
              </p>
              <p className="text-xs text-slate-400 mt-1">Required columns: enrollment_no, student_name, subject_id</p>
              <input
                ref={fileInputRef}
                type="file"
                accept=".csv"
                className="hidden"
                onChange={e => { if (e.target.files?.[0]) handleFileSelect(e.target.files[0]) }}
              />
            </div>

            {uploadError && (
              <div className="flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded text-xs text-red-700">
                <AlertCircle size={13} className="mt-0.5 shrink-0" />
                {uploadError}
              </div>
            )}

            {csvPreview.length > 0 && (
              <div>
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Preview ({csvPreview.length} rows shown)</p>
                <div className="border border-slate-200 rounded overflow-hidden max-h-60 overflow-y-auto">
                  <table className="w-full text-xs">
                    <thead className="bg-slate-50 sticky top-0">
                      <tr>
                        <th className="text-left px-3 py-2 text-xs font-bold text-slate-500 uppercase tracking-wider">Enrolment</th>
                        <th className="text-left px-3 py-2 text-xs font-bold text-slate-500 uppercase tracking-wider">Name</th>
                        <th className="text-left px-3 py-2 text-xs font-bold text-slate-500 uppercase tracking-wider">Subject</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {csvPreview.map(e => (
                        <tr key={e.enrollment}>
                          <td className="px-3 py-1.5 font-mono text-xs text-primary">{e.enrollment}</td>
                          <td className="px-3 py-1.5">{e.studentName}</td>
                          <td className="px-3 py-1.5 font-mono text-xs">{e.subjectId}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            <div className="flex gap-2.5 pt-2 border-t border-slate-100">
              <button onClick={() => { setUploadTarget(null); setSelectedFile(null); setCsvPreview([]); setUploadError('') }} className="flex-1 py-2 border border-slate-200 text-slate-700 text-sm font-semibold rounded hover:bg-slate-50">Cancel</button>
              <button
                onClick={confirmUpload}
                disabled={!selectedFile || uploading}
                className="flex-1 py-2 bg-primary text-white text-sm font-bold rounded hover:bg-primary/90 disabled:opacity-60 inline-flex items-center justify-center gap-1.5"
              >
                {uploading && <Loader2 size={13} className="animate-spin" />}
                {uploading ? 'Uploading…' : 'Confirm Upload'}
              </button>
            </div>
          </div>
        )}
      </PortalModal>

      <PortalModal isOpen={!!viewing} title={`Enrolled Students — ${viewing?.name ?? ''}`} onClose={() => setViewing(null)} width="max-w-md">
        {viewing && (
          <div className="border border-slate-200 rounded overflow-hidden max-h-96 overflow-y-auto">
            <table className="w-full text-xs">
              <thead className="bg-slate-50 sticky top-0">
                <tr>
                  <th className="text-left px-3 py-2 text-xs font-bold text-slate-500 uppercase tracking-wider">Enrolment</th>
                  <th className="text-left px-3 py-2 text-xs font-bold text-slate-500 uppercase tracking-wider">Name</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {enrolments.filter(e => e.subjectId === viewing.id).map(e => (
                  <tr key={e.enrollment}>
                    <td className="px-3 py-1.5 font-mono text-xs text-primary">{e.enrollment}</td>
                    <td className="px-3 py-1.5">{e.studentName}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </PortalModal>

      {toast && (
        <div className="fixed bottom-4 right-4 z-50 bg-accent text-white px-5 py-3 rounded-lg shadow-lg flex items-center gap-2 text-sm font-medium">
          <UploadCloud size={14} /> {toast}
          <button onClick={() => setToast('')} className="ml-1"><X size={13} /></button>
        </div>
      )}
    </div>
  )
}

const Stat: React.FC<{ label: string; value: number; accent: string }> = ({ label, value, accent }) => (
  <PortalCard className="!p-4"><p className="text-xs font-bold text-slate-500 uppercase tracking-wide">{label}</p><p className={`text-2xl font-bold mt-1 ${accent}`}>{value}</p></PortalCard>
)
const Metric: React.FC<{ label: string; value: number | string; icon: React.ComponentType<{ size?: number; className?: string }> }> = ({ label, value, icon: Icon }) => (
  <div className="bg-slate-50 border border-slate-100 rounded p-2">
    <p className="flex items-center gap-1 text-xs font-bold text-slate-500 uppercase tracking-wider"><Icon size={10} className="text-accent" />{label}</p>
    <p className="text-sm font-bold text-slate-800 mt-0.5">{value}</p>
  </div>
)

export default HodElectiveData
