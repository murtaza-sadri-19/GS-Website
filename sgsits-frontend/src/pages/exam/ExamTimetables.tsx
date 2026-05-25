import React, { useState, useEffect, useCallback } from 'react'
import { PageHeader, PortalCard, PortalModal, Badge } from '../../components/layout/PortalLayout'
import { getBranches, getCourses, getSubjects, type Branch, type Course, type Subject } from '../../services/examService'
import { Plus, Search, Trash2, Globe, X, CalendarDays, FileText, Printer, Send, Pencil } from 'lucide-react'
import apiClient from '../../api/client'

// ─── Types ────────────────────────────────────────────────────────────────────

interface ExamEntry {
  id:       string
  date:     string   // YYYY-MM-DD
  day:      string
  timeFrom: string   // HH:MM
  timeTo:   string
  subject:  string
  branch:   string
  semester: number
  venue:    string
  notes:    string
}

interface UploadedTimetable {
  id:        string
  title:     string
  branch_id: string
  course_id: string
  semester:  number
  type:      'Regular' | 'ATKT'
  dateAdded: string
  fileUrl:   string
}

const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
const CMS_KEY = 'exam.schedule.active'

function dayOfWeek(dateStr: string): string {
  if (!dateStr) return ''
  return DAYS[new Date(dateStr).getDay()] ?? ''
}

// Simple toast
const Toast: React.FC<{ message: string; onClose: () => void }> = ({ message, onClose }) => {
  useEffect(() => { const t = setTimeout(onClose, 3000); return () => clearTimeout(t) }, [onClose])
  return (
    <div className="fixed bottom-4 right-4 z-50 bg-[#0b2545] text-white px-5 py-3 rounded-lg shadow-lg flex items-center gap-3 text-sm font-medium">
      {message}<button onClick={onClose}><X size={14} /></button>
    </div>
  )
}

// ─── Main Component ───────────────────────────────────────────────────────────

const ExamTimetables: React.FC = () => {
  const [tab, setTab]             = useState<'designer' | 'pdfs'>('designer')
  const [branches, setBranches]   = useState<Branch[]>([])
  const [courses,  setCourses]    = useState<Course[]>([])
  const [subjects, setSubjects]   = useState<Subject[]>([])
  const [toast,    setToast]      = useState('')
  const [loading,  setLoading]    = useState(true)
  const [saving,   setSaving]     = useState(false)
  const [published, setPublished] = useState(false)

  // ── Designer state ──────────────────────────────────────────────────────────
  const [entries, setEntries]       = useState<ExamEntry[]>([])
  const [scheduleTitle, setScheduleTitle] = useState('End Semester Examination Schedule')
  const [scheduleSession, setScheduleSession] = useState('')
  const [editEntry, setEditEntry]   = useState<ExamEntry | null>(null)
  const [showEditModal, setShowEditModal] = useState(false)

  // ── PDF Library state ───────────────────────────────────────────────────────
  const [pdfs,    setPdfs]       = useState<UploadedTimetable[]>([])
  const [search,  setSearch]     = useState('')
  const [showPdfModal, setShowPdfModal] = useState(false)
  const [pdfTitle,     setPdfTitle]    = useState('')
  const [pdfBranch,    setPdfBranch]   = useState('')
  const [pdfCourse,    setPdfCourse]   = useState('')
  const [pdfSemester,  setPdfSemester] = useState(1)
  const [pdfType,      setPdfType]     = useState<'Regular' | 'ATKT'>('Regular')
  const [pdfFileUrl,   setPdfFileUrl]  = useState('')
  const [pdfSaving,    setPdfSaving]   = useState(false)

  useEffect(() => {
    Promise.all([getBranches(), getCourses(), getSubjects()])
      .then(([b, c, s]) => { setBranches(b); setCourses(c); setSubjects(s) })
      .catch(console.error)

    // Load saved schedule from CMS
    apiClient.get(`/v1/settings/cms/${CMS_KEY}`)
      .then(res => {
        const d = res.data?.data
        if (d) {
          if (d.title)    setScheduleTitle(d.title)
          if (d.session)  setScheduleSession(d.session)
          if (Array.isArray(d.entries)) setEntries(d.entries)
          if (d.published) setPublished(true)
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false))

    // Load PDF timetables from exam module
    apiClient.get('/v1/exam/timetables')
      .then(res => {
        const rows = res.data?.data ?? []
        if (Array.isArray(rows)) {
          setPdfs(rows.map((r: Record<string, unknown>) => ({
            id:        String(r.id),
            title:     String(r.title || ''),
            branch_id: String(r.branch_id || r.department_id || ''),
            course_id: String(r.course_id || ''),
            semester:  Number(r.semester || 0),
            type:      (r.doc_type || r.type || 'Regular') as 'Regular' | 'ATKT',
            dateAdded: String(r.created_at || r.dateAdded || '').slice(0, 10),
            fileUrl:   String(r.file_url || r.fileUrl || ''),
          })))
        }
      })
      .catch(() => {})
  }, [])

  // ── Save schedule to CMS ────────────────────────────────────────────────────
  const saveSchedule = useCallback(async (entriesToSave = entries) => {
    setSaving(true)
    try {
      await apiClient.put(`/v1/settings/cms/${CMS_KEY}`, {
        title:     scheduleTitle,
        session:   scheduleSession,
        entries:   entriesToSave,
        published: false,
        updatedAt: new Date().toISOString(),
      })
    } catch { /* silent */ }
    finally { setSaving(false) }
  }, [entries, scheduleTitle, scheduleSession])

  const publishSchedule = async () => {
    setSaving(true)
    try {
      await apiClient.put(`/v1/settings/cms/${CMS_KEY}`, {
        title:     scheduleTitle,
        session:   scheduleSession,
        entries,
        published: true,
        updatedAt: new Date().toISOString(),
      })
      setPublished(true)
      setToast('Exam schedule published! HOD and Faculty can now view it.')
    } catch {
      setToast('Failed to publish. Please try again.')
    } finally { setSaving(false) }
  }

  // ── Entry CRUD ──────────────────────────────────────────────────────────────
  const blankEntry = (): ExamEntry => ({
    id:       `e-${Date.now()}`,
    date:     '',
    day:      '',
    timeFrom: '09:00',
    timeTo:   '12:00',
    subject:  '',
    branch:   '',
    semester: 1,
    venue:    '',
    notes:    '',
  })

  const handleAddEntry = () => {
    setEditEntry(blankEntry())
    setShowEditModal(true)
  }

  const handleEditEntry = (entry: ExamEntry) => {
    setEditEntry({ ...entry })
    setShowEditModal(true)
  }

  const handleSaveEntry = () => {
    if (!editEntry) return
    if (!editEntry.date || !editEntry.subject) {
      setToast('Date and Subject are required.')
      return
    }
    const entry = { ...editEntry, day: dayOfWeek(editEntry.date) }
    const exists = entries.findIndex(e => e.id === entry.id)
    const updated = exists > -1
      ? entries.map(e => e.id === entry.id ? entry : e)
      : [...entries, entry]
    const sorted = [...updated].sort((a, b) => a.date.localeCompare(b.date) || a.timeFrom.localeCompare(b.timeFrom))
    setEntries(sorted)
    void saveSchedule(sorted)
    setShowEditModal(false)
    setEditEntry(null)
    setPublished(false)
  }

  const handleDeleteEntry = (id: string) => {
    const updated = entries.filter(e => e.id !== id)
    setEntries(updated)
    void saveSchedule(updated)
    setPublished(false)
  }

  // ── Print / PDF ─────────────────────────────────────────────────────────────
  const printSchedule = () => {
    const rows = entries.map((e, i) => `
      <tr>
        <td>${i + 1}</td>
        <td>${e.date}</td>
        <td>${e.day}</td>
        <td>${e.timeFrom} – ${e.timeTo}</td>
        <td><strong>${e.subject}</strong></td>
        <td>${e.branch || 'All'}</td>
        <td>${e.semester ? `Sem ${e.semester}` : 'All'}</td>
        <td>${e.venue || '—'}</td>
        <td>${e.notes || '—'}</td>
      </tr>`).join('')

    const html = `<!DOCTYPE html><html><head><meta charset="UTF-8"/>
<title>${scheduleTitle}</title>
<style>
  body { font-family: Arial, sans-serif; font-size: 11px; margin: 20px; }
  h2 { text-align: center; color: #0b2545; margin-bottom: 2px; }
  p.sub { text-align: center; color: #666; font-size: 10px; margin-bottom: 14px; }
  table { width: 100%; border-collapse: collapse; }
  th { background: #0b2545; color: #fff; padding: 6px 5px; text-align: left; font-size: 10px; }
  td { border: 1px solid #ddd; padding: 5px; vertical-align: top; font-size: 10px; }
  tr:nth-child(even) td { background: #f8fafc; }
  strong { color: #0b2545; }
  @media print { body { margin: 8px; } }
</style></head><body>
<h2>SGSITS — ${scheduleTitle}</h2>
<p class="sub">Session: ${scheduleSession || '—'} | Printed: ${new Date().toLocaleDateString('en-IN')}</p>
<table>
<thead><tr><th>#</th><th>Date</th><th>Day</th><th>Time</th><th>Subject</th><th>Branch</th><th>Semester</th><th>Venue</th><th>Notes</th></tr></thead>
<tbody>${rows}</tbody>
</table>
</body></html>`

    const w = window.open('', '_blank', 'width=1000,height=700')
    if (w) { w.document.write(html); w.document.close(); w.focus(); w.print() }
  }

  // ── PDF Library handlers ────────────────────────────────────────────────────
  const handleUploadPdf = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!pdfTitle || !pdfBranch || !pdfFileUrl) { setToast('Please fill all required fields.'); return }
    setPdfSaving(true)
    try {
      const res = await apiClient.post('/v1/exam/documents', {
        title:       pdfTitle,
        doc_type:    pdfType,
        branch_id:   pdfBranch,
        course_id:   pdfCourse,
        semester:    pdfSemester,
        file_url:    pdfFileUrl,
        status:      'PUBLISHED',
        category:    'timetable',
      })
      const created = res.data?.data as Record<string, unknown>
      if (created) {
        const newPdf: UploadedTimetable = {
          id:        String(created.id || Date.now()),
          title:     pdfTitle,
          branch_id: pdfBranch,
          course_id: pdfCourse,
          semester:  pdfSemester,
          type:      pdfType,
          dateAdded: new Date().toISOString().slice(0, 10),
          fileUrl:   pdfFileUrl,
        }
        setPdfs(prev => [newPdf, ...prev])
      }
      setToast('Timetable PDF published successfully.')
      setShowPdfModal(false)
      setPdfTitle(''); setPdfBranch(''); setPdfCourse(''); setPdfFileUrl('')
    } catch {
      setToast('Failed to save. Please try again.')
    } finally { setPdfSaving(false) }
  }

  const handleDeletePdf = async (id: string) => {
    if (!confirm('Delete this timetable PDF?')) return
    try {
      await apiClient.delete(`/v1/exam/documents/${id}`)
      setPdfs(prev => prev.filter(p => p.id !== id))
      setToast('Deleted.')
    } catch { setToast('Delete failed.') }
  }

  const filteredPdfs = pdfs.filter(p =>
    p.title.toLowerCase().includes(search.toLowerCase()) ||
    p.branch_id.toLowerCase().includes(search.toLowerCase())
  )

  // ── Render ──────────────────────────────────────────────────────────────────
  return (
    <div className="space-y-5">
      <PageHeader
        title="Exam Timetables"
        subtitle="Design, publish, and manage examination schedules"
        action={
          <div className="flex items-center gap-2">
            {tab === 'designer' && (
              <>
                <button onClick={printSchedule} disabled={entries.length === 0}
                  className="inline-flex items-center gap-1.5 px-3 py-2 border border-slate-200 text-slate-700 text-xs font-bold rounded hover:bg-slate-50 transition-colors disabled:opacity-40">
                  <Printer size={13} /> Print / PDF
                </button>
                <button onClick={publishSchedule} disabled={saving || entries.length === 0}
                  className={`inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold rounded transition-colors shadow-sm ${
                    published ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-[#0b2545] text-white hover:bg-[#0b2545]/90 disabled:opacity-50'
                  }`}>
                  <Send size={13} /> {saving ? 'Saving…' : published ? 'Published ✓' : 'Publish Schedule'}
                </button>
              </>
            )}
            {tab === 'pdfs' && (
              <button onClick={() => setShowPdfModal(true)}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-[#0b2545] text-white text-xs font-bold rounded hover:bg-[#0b2545]/90 transition-colors shadow-sm">
                <Plus size={13} /> Upload PDF
              </button>
            )}
          </div>
        }
      />

      {/* Tab switcher */}
      <div className="flex gap-1 bg-slate-100 rounded-xl p-1 w-fit">
        {(['designer', 'pdfs'] as const).map(t => (
          <button key={t} onClick={() => setTab(t)}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
              tab === t ? 'bg-white text-[#0b2545] shadow-sm' : 'text-slate-500 hover:text-slate-700'
            }`}>
            {t === 'designer' ? <><CalendarDays size={13} className="inline mr-1.5" />Schedule Designer</> : <><FileText size={13} className="inline mr-1.5" />PDF Library</>}
          </button>
        ))}
      </div>

      {/* ── DESIGNER TAB ── */}
      {tab === 'designer' && (
        <div className="space-y-4">
          {/* Schedule metadata */}
          <PortalCard className="!p-4">
            <div className="flex flex-wrap gap-3 items-end">
              <div className="flex-1 min-w-[200px]">
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wide mb-1">Schedule Title</label>
                <input
                  value={scheduleTitle}
                  onChange={e => setScheduleTitle(e.target.value)}
                  className="w-full border border-slate-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#0b2545] bg-white font-semibold"
                />
              </div>
              <div className="w-48">
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wide mb-1">Session / Year</label>
                <input
                  value={scheduleSession}
                  onChange={e => setScheduleSession(e.target.value)}
                  placeholder="e.g. May 2026"
                  className="w-full border border-slate-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#0b2545] bg-white"
                />
              </div>
              <button onClick={handleAddEntry}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 border border-[#bfa15f]/50 text-[#bfa15f] text-xs font-bold rounded hover:bg-[#bfa15f]/5 transition-colors">
                <Plus size={13} /> Add Exam Entry
              </button>
            </div>
          </PortalCard>

          {/* Entries table */}
          <PortalCard className="!p-0 overflow-hidden">
            {loading ? (
              <p className="text-center text-sm text-slate-400 py-12">Loading…</p>
            ) : entries.length === 0 ? (
              <div className="text-center py-16">
                <CalendarDays size={36} className="mx-auto text-slate-200 mb-3" />
                <p className="text-sm text-slate-400 font-semibold">No exam entries yet</p>
                <p className="text-xs text-slate-400 mt-1">Click "Add Exam Entry" to start building the schedule.</p>
              </div>
            ) : (
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200">
                    {['#','Date','Day','Time','Subject','Branch','Sem','Venue','Notes',''].map(h => (
                      <th key={h} className="text-left px-3 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {entries.map((e, i) => (
                    <tr key={e.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-3 py-2.5 text-xs text-slate-400 font-bold">{i + 1}</td>
                      <td className="px-3 py-2.5 text-xs font-semibold text-slate-800 whitespace-nowrap">{e.date}</td>
                      <td className="px-3 py-2.5 text-xs text-slate-500">{e.day}</td>
                      <td className="px-3 py-2.5 text-xs text-slate-600 whitespace-nowrap">{e.timeFrom} – {e.timeTo}</td>
                      <td className="px-3 py-2.5 text-sm font-semibold text-[#0b2545]">{e.subject}</td>
                      <td className="px-3 py-2.5 text-xs text-slate-600">{e.branch || <span className="text-slate-400">All</span>}</td>
                      <td className="px-3 py-2.5 text-xs text-slate-600 text-center">{e.semester || <span className="text-slate-400">—</span>}</td>
                      <td className="px-3 py-2.5 text-xs text-slate-600">{e.venue || <span className="text-slate-400">—</span>}</td>
                      <td className="px-3 py-2.5 text-xs text-slate-400 max-w-[150px] truncate">{e.notes || '—'}</td>
                      <td className="px-3 py-2.5">
                        <div className="flex items-center gap-1">
                          <button onClick={() => handleEditEntry(e)} className="p-1.5 text-slate-400 hover:text-[#0b2545] hover:bg-slate-100 rounded transition-colors"><Pencil size={12} /></button>
                          <button onClick={() => handleDeleteEntry(e.id)} className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"><Trash2 size={12} /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </PortalCard>
        </div>
      )}

      {/* ── PDF LIBRARY TAB ── */}
      {tab === 'pdfs' && (
        <div className="space-y-4">
          <div className="flex items-center gap-3 bg-white p-3 border border-slate-200 rounded-xl shadow-sm">
            <Search className="text-slate-400 shrink-0" size={16} />
            <input type="text" placeholder="Search timetables by title, branch…" value={search} onChange={e => setSearch(e.target.value)}
              className="w-full text-sm text-slate-700 bg-transparent focus:outline-none" />
          </div>

          <PortalCard className="!p-0 overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200">
                  {['Title','Course / Branch','Sem','Type','Uploaded On',''].map(h => (
                    <th key={h} className="text-left px-4 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredPdfs.length === 0 ? (
                  <tr><td colSpan={6} className="text-center py-8 text-slate-400 text-xs">No PDF timetables found. Upload one above.</td></tr>
                ) : filteredPdfs.map(tt => (
                  <tr key={tt.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-4 py-3">
                      <a href={tt.fileUrl} target="_blank" rel="noopener noreferrer"
                        className="font-semibold text-slate-800 hover:text-[#0b2545] hover:underline block">{tt.title}</a>
                    </td>
                    <td className="px-4 py-3 text-slate-600 text-xs font-semibold">
                      {courses.find(c => c.id === tt.course_id)?.name || tt.course_id} ({tt.branch_id})
                    </td>
                    <td className="px-4 py-3 text-center text-slate-600 text-xs font-bold">{tt.semester}</td>
                    <td className="px-4 py-3 text-center">
                      <Badge label={tt.type} variant={tt.type === 'Regular' ? 'info' : 'warning'} />
                    </td>
                    <td className="px-4 py-3 text-slate-500 text-xs">{tt.dateAdded}</td>
                    <td className="px-4 py-3 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        <a href={tt.fileUrl} target="_blank" rel="noopener noreferrer"
                          className="p-1.5 text-slate-500 hover:text-[#0b2545] hover:bg-slate-100 rounded transition-colors"><Globe size={13} /></a>
                        <button onClick={() => handleDeletePdf(tt.id)}
                          className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"><Trash2 size={13} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </PortalCard>
        </div>
      )}

      {/* ── Entry Edit Modal ── */}
      <PortalModal isOpen={showEditModal} title={editEntry?.id.startsWith('e-') && !entries.find(e => e.id === editEntry?.id) ? 'Add Exam Entry' : 'Edit Exam Entry'}
        onClose={() => { setShowEditModal(false); setEditEntry(null) }}>
        {editEntry && (
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wide mb-1">Date <span className="text-[#bfa15f]">*</span></label>
                <input type="date" value={editEntry.date} onChange={e => setEditEntry({ ...editEntry, date: e.target.value, day: dayOfWeek(e.target.value) })}
                  required className="w-full border border-slate-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#0b2545]" />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wide mb-1">Day</label>
                <input type="text" value={editEntry.day} readOnly className="w-full border border-slate-200 rounded px-3 py-2 text-sm bg-slate-50 text-slate-500" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wide mb-1">From</label>
                <input type="time" value={editEntry.timeFrom} onChange={e => setEditEntry({ ...editEntry, timeFrom: e.target.value })}
                  className="w-full border border-slate-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#0b2545]" />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wide mb-1">To</label>
                <input type="time" value={editEntry.timeTo} onChange={e => setEditEntry({ ...editEntry, timeTo: e.target.value })}
                  className="w-full border border-slate-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#0b2545]" />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wide mb-1">Subject / Paper <span className="text-[#bfa15f]">*</span></label>
              <input type="text" list="subjectList" value={editEntry.subject}
                onChange={e => setEditEntry({ ...editEntry, subject: e.target.value })}
                placeholder="e.g. Engineering Mathematics III"
                className="w-full border border-slate-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#0b2545]" />
              <datalist id="subjectList">{subjects.map(s => <option key={s.id} value={s.name} />)}</datalist>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wide mb-1">Branch</label>
                <select value={editEntry.branch} onChange={e => setEditEntry({ ...editEntry, branch: e.target.value })}
                  className="w-full border border-slate-200 rounded px-3 py-2 text-sm bg-white focus:outline-none focus:border-[#0b2545]">
                  <option value="">All Branches</option>
                  {branches.map(b => <option key={b.id} value={b.id}>{b.shortName}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wide mb-1">Semester</label>
                <select value={editEntry.semester} onChange={e => setEditEntry({ ...editEntry, semester: Number(e.target.value) })}
                  className="w-full border border-slate-200 rounded px-3 py-2 text-sm bg-white focus:outline-none focus:border-[#0b2545]">
                  <option value={0}>All Semesters</option>
                  {[1,2,3,4,5,6,7,8].map(s => <option key={s} value={s}>Semester {s}</option>)}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wide mb-1">Venue / Room</label>
              <input type="text" value={editEntry.venue} onChange={e => setEditEntry({ ...editEntry, venue: e.target.value })}
                placeholder="e.g. Exam Hall A, Room 301"
                className="w-full border border-slate-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#0b2545]" />
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wide mb-1">Notes</label>
              <input type="text" value={editEntry.notes} onChange={e => setEditEntry({ ...editEntry, notes: e.target.value })}
                placeholder="e.g. Open book, bring calculator"
                className="w-full border border-slate-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#0b2545]" />
            </div>

            <div className="flex gap-2.5 pt-3 border-t border-slate-100">
              <button type="button" onClick={() => { setShowEditModal(false); setEditEntry(null) }}
                className="flex-1 py-2 border border-slate-200 text-slate-700 text-sm font-semibold rounded hover:bg-slate-50 transition-colors">
                Cancel
              </button>
              <button type="button" onClick={handleSaveEntry}
                className="flex-1 py-2 bg-[#0b2545] text-white text-sm font-bold rounded hover:bg-[#0b2545]/90 transition-colors">
                Save Entry
              </button>
            </div>
          </div>
        )}
      </PortalModal>

      {/* ── Upload PDF Modal ── */}
      <PortalModal isOpen={showPdfModal} title="Upload Exam Timetable PDF" onClose={() => setShowPdfModal(false)}>
        <form onSubmit={handleUploadPdf} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-600 uppercase tracking-wide mb-1">Title</label>
            <input type="text" required value={pdfTitle} onChange={e => setPdfTitle(e.target.value)}
              placeholder="e.g. BE V Sem CSE Regular Exam Timetable"
              className="w-full border border-slate-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#0b2545]" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-600 uppercase tracking-wide mb-1">Branch</label>
              <select value={pdfBranch} onChange={e => setPdfBranch(e.target.value)} required
                className="w-full border border-slate-200 rounded px-3 py-2 text-sm bg-white focus:outline-none focus:border-[#0b2545]">
                <option value="">Select Branch</option>
                {branches.map(b => <option key={b.id} value={b.id}>{b.shortName}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-600 uppercase tracking-wide mb-1">Course</label>
              <select value={pdfCourse} onChange={e => setPdfCourse(e.target.value)}
                className="w-full border border-slate-200 rounded px-3 py-2 text-sm bg-white focus:outline-none focus:border-[#0b2545]">
                <option value="">Select Course</option>
                {courses.filter(c => !pdfBranch || c.branch_id === pdfBranch).map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-600 uppercase tracking-wide mb-1">Semester</label>
              <select value={pdfSemester} onChange={e => setPdfSemester(Number(e.target.value))}
                className="w-full border border-slate-200 rounded px-3 py-2 text-sm bg-white focus:outline-none focus:border-[#0b2545]">
                {[1,2,3,4,5,6,7,8].map(s => <option key={s} value={s}>Semester {s}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-600 uppercase tracking-wide mb-1">Type</label>
              <select value={pdfType} onChange={e => setPdfType(e.target.value as 'Regular' | 'ATKT')}
                className="w-full border border-slate-200 rounded px-3 py-2 text-sm bg-white focus:outline-none focus:border-[#0b2545]">
                <option value="Regular">Regular</option>
                <option value="ATKT">ATKT</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-600 uppercase tracking-wide mb-1">File URL</label>
            <input type="url" required value={pdfFileUrl} onChange={e => setPdfFileUrl(e.target.value)}
              placeholder="https://example.com/timetable.pdf"
              className="w-full border border-slate-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#0b2545]" />
          </div>
          <div className="flex gap-3 pt-3 border-t border-slate-100">
            <button type="button" onClick={() => setShowPdfModal(false)}
              className="flex-1 py-2 border border-slate-200 text-slate-700 rounded font-semibold text-sm hover:bg-slate-50 transition-colors">
              Cancel
            </button>
            <button type="submit" disabled={pdfSaving}
              className="flex-1 py-2 bg-[#0b2545] text-white rounded font-semibold text-sm hover:bg-[#0b2545]/95 transition-colors disabled:opacity-50">
              {pdfSaving ? 'Uploading…' : 'Upload'}
            </button>
          </div>
        </form>
      </PortalModal>

      {toast && <Toast message={toast} onClose={() => setToast('')} />}
    </div>
  )
}

export default ExamTimetables
