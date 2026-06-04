import React, { useState, useEffect } from 'react'
import PageSeo from '../../components/global/PageSeo'
import { Calendar, Download } from 'lucide-react'
import { academicsService, academicCalendarDefault } from '../../services/academicsService'
import { getCmsSection } from '../../services/settingsService'
import type { AcademicCalendarEvent } from '../../services/academicsService'

interface CalendarMeta {
  academicYear?: string
  downloadLabel?: string
  downloadUrl?: string
  semesters?: { name: string; period: string; category?: string }[]
}

const AcademicCalendar: React.FC = () => {
  const [calendarData, setCalendarData] = useState<AcademicCalendarEvent[]>(academicCalendarDefault)
  const [meta, setMeta] = useState<CalendarMeta>({})

  useEffect(() => {
    academicsService.getAcademicCalendar().then(setCalendarData).catch(() => {})
    getCmsSection<CalendarMeta>('academics.calendar_meta').then(d => { if (d) setMeta(d) }).catch(() => {})
  }, [])

  const { academicYear, downloadLabel, downloadUrl, semesters: cmsSemesters = [] } = meta

  let semesters: { name: string; period: string; events: AcademicCalendarEvent[] }[]

  if (cmsSemesters.length > 0) {
    semesters = cmsSemesters.map(sem => ({
      name: sem.name,
      period: sem.period,
      events: sem.category
        ? calendarData.filter(e => (e as any).category === sem.category || e.event?.toLowerCase().includes(sem.name.toLowerCase().split(' ')[0]))
        : calendarData,
    }))
  } else {
    const evenStartIndex = calendarData.findIndex(
      (e) => (e as any).category === 'Even Semester' || e.event?.toLowerCase().includes('even semester')
    )
    const oddEvents = evenStartIndex !== -1 ? calendarData.slice(0, evenStartIndex) : calendarData
    const evenEvents = evenStartIndex !== -1 ? calendarData.slice(evenStartIndex) : []
    semesters = [
      { name: 'Odd Semester', period: 'July – December', events: oddEvents },
      { name: 'Even Semester', period: 'January – June', events: evenEvents },
    ]
  }

  return (
    <div className="space-y-8">
      <PageSeo pageKey="academics/calendar" />
      <div className="border-b border-slate-200 pb-5">
        <h2 className="text-2xl md:text-3xl font-bold font-display text-primary">Academic Calendar</h2>
        {academicYear && <p className="text-sm text-slate-500 mt-1 font-medium">Academic session {academicYear}</p>}
      </div>

      {(downloadLabel || downloadUrl) && (
        <div className="flex items-center gap-3 p-4 rounded-md border-2" style={{ borderColor: 'var(--color-accent)', backgroundColor: 'rgba(212,175,55,0.05)' }}>
          <Download size={20} className="text-accent" />
          <div className="flex-1">
            <p className="font-semibold text-sm font-sans text-primary">{downloadLabel || 'Download Academic Calendar (PDF)'}</p>
            <p className="text-xs text-slate-500 font-sans">Detailed calendar with all important dates and events</p>
          </div>
          {downloadUrl && (
            <a href={downloadUrl} target="_blank" rel="noreferrer" className="text-xs font-bold text-primary border border-primary/20 bg-primary/5 px-3 py-1.5 rounded hover:bg-primary hover:text-white transition-colors shrink-0 flex items-center gap-1">
              <Download size={12} /> Download
            </a>
          )}
        </div>
      )}

      {semesters.map((sem) => (
        <div key={sem.name}>
          <h3 className="text-xl font-bold mb-4 flex items-center gap-2 font-display text-primary">
            <Calendar size={20} className="text-accent" /> {sem.name}
            <span className="text-sm font-normal text-slate-500 ml-2 font-sans">({sem.period})</span>
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-primary">
                  <th className="text-left text-white px-4 py-3 font-semibold w-48">Date / Period</th>
                  <th className="text-left text-white px-4 py-3 font-semibold">Event / Activity</th>
                </tr>
              </thead>
              <tbody>
                {(sem.events ?? []).map((e, i) => (
                  <tr key={i} className="bg-white hover:bg-slate-50 transition-colors duration-200">
                    <td className="px-4 py-3 border-b border-slate-100 font-semibold font-sans text-accent">{e.dates}</td>
                    <td className="px-4 py-3 border-b border-slate-100 text-slate-700 font-sans">{e.event}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ))}
    </div>
  )
}

export default AcademicCalendar
