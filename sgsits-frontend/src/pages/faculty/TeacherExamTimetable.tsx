import React, { useEffect, useState } from 'react'
import { PageHeader, PortalCard } from '../../components/layout/PortalLayout'
import { useAdminStore } from '../../store/adminStore'
import apiClient from '../../api/client'
import { CalendarDays, FileText, Printer, Globe } from 'lucide-react'

interface ExamEntry {
  id: string; date: string; day: string; timeFrom: string; timeTo: string
  subject: string; branch: string; semester: number; venue: string; notes: string
}
interface PdfTimetable {
  id: string; title: string; branch_id: string; semester: number; type: string; dateAdded: string; fileUrl: string
}

const CMS_KEY = 'exam.schedule.active'

const TeacherExamTimetable: React.FC = () => {
  const { user } = useAdminStore()
  const deptBranch = user?.department_id ? String(user.department_id) : ''

  const [entries,         setEntries]         = useState<ExamEntry[]>([])
  const [pdfs,            setPdfs]            = useState<PdfTimetable[]>([])
  const [loading,         setLoading]         = useState(true)
  const [scheduleTitle,   setScheduleTitle]   = useState('Exam Schedule')
  const [scheduleSession, setScheduleSession] = useState('')
  const [published,       setPublished]       = useState(false)
  const [semFilter,       setSemFilter]       = useState<number | 'all'>('all')

  useEffect(() => {
    Promise.allSettled([
      apiClient.get(`/v1/settings/cms/${CMS_KEY}`),
      apiClient.get('/v1/exam/timetables'),
    ]).then(([schedRes, pdfRes]) => {
      if (schedRes.status === 'fulfilled') {
        const d = schedRes.value.data?.data
        if (d) {
          if (d.title)                setScheduleTitle(d.title)
          if (d.session)              setScheduleSession(d.session)
          if (Array.isArray(d.entries)) setEntries(d.entries)
          if (d.published)            setPublished(true)
        }
      }
      if (pdfRes.status === 'fulfilled') {
        const rows = pdfRes.value.data?.data ?? []
        if (Array.isArray(rows)) {
          setPdfs(rows.map((r: Record<string, unknown>) => ({
            id:        String(r.id),
            title:     String(r.title || ''),
            branch_id: String(r.branch_id || r.department_id || ''),
            semester:  Number(r.semester || 0),
            type:      String(r.doc_type || r.type || 'Regular'),
            dateAdded: String(r.created_at || '').slice(0, 10),
            fileUrl:   String(r.file_url || r.fileUrl || ''),
          })))
        }
      }
    }).finally(() => setLoading(false))
  }, [])

  const visibleEntries = entries.filter(e => {
    if (deptBranch && e.branch && e.branch !== deptBranch) return false
    if (semFilter !== 'all' && e.semester && e.semester !== semFilter) return false
    return true
  })

  const visiblePdfs = pdfs.filter(p => !deptBranch || !p.branch_id || p.branch_id === deptBranch)

  const printSchedule = () => {
    const rows = visibleEntries.map((e, i) => `
      <tr><td>${i+1}</td><td>${e.date}</td><td>${e.day}</td>
      <td>${e.timeFrom} – ${e.timeTo}</td><td><strong>${e.subject}</strong></td>
      <td>${e.semester ? `Sem ${e.semester}` : 'All'}</td><td>${e.venue || '—'}</td></tr>`).join('')

    const html = `<!DOCTYPE html><html><head><meta charset="UTF-8"/>
<title>${scheduleTitle}</title>
<style>
  body{font-family:Arial,sans-serif;font-size:11px;margin:20px}
  h2{text-align:center;color:#0b2545} p.sub{text-align:center;color:#666;font-size:10px;margin-bottom:14px}
  table{width:100%;border-collapse:collapse}
  th{background:#0b2545;color:#fff;padding:6px;text-align:left;font-size:10px}
  td{border:1px solid #ddd;padding:5px;font-size:10px}
  tr:nth-child(even) td{background:#f8fafc}
</style></head><body>
<h2>${scheduleTitle}</h2>
<p class="sub">Session: ${scheduleSession||'—'} | Faculty: ${user?.name||'—'} | Dept: ${user?.department||'—'} | ${new Date().toLocaleDateString('en-IN')}</p>
<table><thead><tr><th>#</th><th>Date</th><th>Day</th><th>Time</th><th>Subject</th><th>Semester</th><th>Venue</th></tr></thead>
<tbody>${rows}</tbody></table></body></html>`

    const w = window.open('', '_blank', 'width=900,height=700')
    if (w) { w.document.write(html); w.document.close(); w.focus(); w.print() }
  }

  return (
    <div className="space-y-5">
      <PageHeader
        title="Exam Timetable"
        subtitle="Published examination schedule for your department"
        action={
          visibleEntries.length > 0 && (
            <button onClick={printSchedule}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 border border-slate-200 text-slate-700 text-xs font-bold rounded hover:bg-slate-50 transition-colors">
              <Printer size={13} /> Print / PDF
            </button>
          )
        }
      />

      {!published && !loading && (
        <PortalCard className="!p-3 !bg-[#bfa15f]/10 !border-[#bfa15f]/30">
          <p className="text-xs text-[#bfa15f] font-bold">The exam schedule has not been published yet. Check back later or contact the Exam Department.</p>
        </PortalCard>
      )}

      <PortalCard className="!p-3">
        <div className="flex items-center gap-3">
          <label className="text-xs font-bold text-slate-600">Semester</label>
          <select value={String(semFilter)} onChange={e => setSemFilter(e.target.value === 'all' ? 'all' : Number(e.target.value))}
            className="border border-slate-200 rounded px-3 py-1.5 text-sm bg-white focus:outline-none focus:border-[#0b2545]">
            <option value="all">All Semesters</option>
            {[1,2,3,4,5,6,7,8].map(s => <option key={s} value={s}>Semester {s}</option>)}
          </select>
        </div>
      </PortalCard>

      <PortalCard className="!p-0 overflow-hidden">
        <div className="px-4 py-3 bg-slate-50 border-b border-slate-200 flex items-center gap-2">
          <CalendarDays size={14} className="text-[#0b2545]" />
          <h3 className="text-sm font-bold text-slate-700">{scheduleTitle}</h3>
          {scheduleSession && <span className="text-xs text-slate-500">— {scheduleSession}</span>}
          {published && <span className="ml-auto text-[10px] bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded font-bold uppercase">Published</span>}
        </div>

        {loading ? (
          <p className="text-center text-sm text-slate-400 py-12">Loading…</p>
        ) : visibleEntries.length === 0 ? (
          <div className="text-center py-14">
            <CalendarDays size={32} className="mx-auto text-slate-200 mb-3" />
            <p className="text-sm text-slate-400 font-semibold">No exam entries for your department yet</p>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100">
                {['#','Date','Day','Time','Subject / Paper','Semester','Venue','Notes'].map(h => (
                  <th key={h} className="text-left px-3 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {visibleEntries.map((e, i) => (
                <tr key={e.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-3 py-3 text-xs text-slate-400 font-bold">{i + 1}</td>
                  <td className="px-3 py-3 text-xs font-semibold text-slate-800 whitespace-nowrap">{e.date}</td>
                  <td className="px-3 py-3 text-xs text-slate-500">{e.day}</td>
                  <td className="px-3 py-3 text-xs text-slate-600 whitespace-nowrap">{e.timeFrom} – {e.timeTo}</td>
                  <td className="px-3 py-3 text-sm font-semibold text-[#0b2545]">{e.subject}</td>
                  <td className="px-3 py-3 text-xs text-slate-600 text-center">{e.semester ? `Sem ${e.semester}` : 'All'}</td>
                  <td className="px-3 py-3 text-xs text-slate-600">{e.venue || <span className="text-slate-400">—</span>}</td>
                  <td className="px-3 py-3 text-xs text-slate-400">{e.notes || '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </PortalCard>

      {visiblePdfs.length > 0 && (
        <PortalCard>
          <div className="flex items-center gap-2 mb-3">
            <FileText size={14} className="text-[#bfa15f]" />
            <h3 className="text-sm font-bold text-slate-700">PDF Timetables</h3>
          </div>
          <div className="space-y-2">
            {visiblePdfs.map(p => (
              <div key={p.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-100">
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-slate-800 truncate">{p.title}</p>
                  <p className="text-[11px] text-slate-500 mt-0.5">{p.branch_id} · Sem {p.semester} · {p.type} · {p.dateAdded}</p>
                </div>
                <a href={p.fileUrl} target="_blank" rel="noopener noreferrer"
                  className="ml-3 shrink-0 inline-flex items-center gap-1.5 px-3 py-1.5 border border-[#0b2545]/20 text-[#0b2545] text-xs font-bold rounded hover:bg-[#0b2545]/5 transition-colors">
                  <Globe size={12} /> View PDF
                </a>
              </div>
            ))}
          </div>
        </PortalCard>
      )}
    </div>
  )
}

export default TeacherExamTimetable
