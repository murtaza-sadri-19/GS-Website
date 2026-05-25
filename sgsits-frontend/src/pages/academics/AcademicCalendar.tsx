import React, { useState, useEffect } from 'react'
import PageSeo from '../../components/global/PageSeo'
import { Calendar, Download } from 'lucide-react'
import { academicsService, academicCalendarDefault } from '../../services/academicsService'
import type { AcademicCalendarEvent } from '../../services/academicsService'

const AcademicCalendar: React.FC = () => {
  const [calendarData, setCalendarData] = useState<AcademicCalendarEvent[]>(academicCalendarDefault)

  useEffect(() => {
    const fetchCalendar = async () => {
      try {
        const data = await academicsService.getAcademicCalendar()
        setCalendarData(data)
      } catch (error) {
        console.error('Failed to load academic calendar:', error)
      }
    }
    fetchCalendar()
  }, [])

  // Chronologically split the events into Odd Semester (up to winter break) and Even Semester (from even classes start)
  const evenStartIndex = calendarData.findIndex(
    (e) => e.category === 'Even Semester' || e.event.toLowerCase().includes('even semester')
  )

  const oddEvents = evenStartIndex !== -1 ? calendarData.slice(0, evenStartIndex) : calendarData
  const evenEvents = evenStartIndex !== -1 ? calendarData.slice(evenStartIndex) : []

  const semesters = [
    { name: 'Odd Semester', period: 'July – December', events: oddEvents },
    { name: 'Even Semester', period: 'January – June', events: evenEvents },
  ]

  return (
    <div className="space-y-8">
      <PageSeo pageKey="academics/calendar" />
      <div className="border-b border-gray-200 pb-4">
        <h2 className="text-2xl md:text-3xl font-bold font-display text-primary">Academic Calendar</h2>
        <p className="text-sm text-gray-500 mt-1 font-sans">Academic session 2025–2026</p>
      </div>

      <div className="flex items-center gap-3 p-4 rounded-md border-2" style={{ borderColor: 'var(--color-accent)', backgroundColor: 'rgba(212,175,55,0.05)' }}>
        <Download size={20} style={{ color: 'var(--color-accent)' }} />
        <div>
          <p className="font-semibold text-sm font-sans text-primary">Download Academic Calendar 2025–26 (PDF)</p>
          <p className="text-xs text-gray-500 font-sans">Detailed calendar with all important dates and events</p>
        </div>
      </div>

      {semesters.map((sem) => (
        <div key={sem.name}>
          <h3 className="text-xl font-bold mb-4 flex items-center gap-2 font-display text-primary">
            <Calendar size={20} style={{ color: 'var(--color-accent)' }} /> {sem.name}
            <span className="text-sm font-normal text-gray-500 ml-2 font-sans">({sem.period})</span>
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr style={{ backgroundColor: 'var(--color-primary)' }}>
                  <th className="text-left text-white px-4 py-3 font-semibold w-48">Date / Period</th>
                  <th className="text-left text-white px-4 py-3 font-semibold">Event / Activity</th>
                </tr>
              </thead>
              <tbody>
                {sem.events.map((e, i) => (
                  <tr key={i} className="bg-white hover:bg-slate-50 transition-colors duration-200">
                    <td className="px-4 py-3 border-b border-gray-100 font-semibold font-sans text-accent">{e.dates}</td>
                    <td className="px-4 py-3 border-b border-gray-100 text-gray-700 font-sans">{e.event}</td>
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
