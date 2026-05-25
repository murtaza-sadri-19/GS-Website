import React, { useState } from 'react'
import { PageHeader, PortalCard } from '../../components/layout/PortalLayout'
import { Calendar, Clock, MapPin, BookOpen, AlertCircle } from 'lucide-react'

interface LectureSlot {
  subjectId: string
  subjectName: string
  time: string
  room: string
  type: 'Theory' | 'Practical' | 'Tutorial'
}

type WeeklyTimetable = Record<string, LectureSlot[]>

const WEEKLY_SCHEDULE: WeeklyTimetable = {
  'Monday': [
    { subjectId: 'CS301', subjectName: 'Data Structures (Theory)', time: '09:30 AM - 10:30 AM', room: 'CSE Block Room 302', type: 'Theory' },
    { subjectId: 'CS401', subjectName: 'Algorithms & Complexity', time: '11:30 AM - 12:30 PM', room: 'CSE Seminar Hall', type: 'Theory' },
    { subjectId: 'CS303', subjectName: 'Data Structures Lab (Batch A)', time: '01:30 PM - 03:30 PM', room: 'CSE Computer Lab 2', type: 'Practical' },
  ],
  'Tuesday': [
    { subjectId: 'CS401', subjectName: 'Algorithms & Complexity', time: '09:30 AM - 10:30 AM', room: 'CSE Seminar Hall', type: 'Theory' },
    { subjectId: 'CS301', subjectName: 'Data Structures (Theory)', time: '10:30 AM - 11:30 AM', room: 'CSE Block Room 302', type: 'Theory' },
  ],
  'Wednesday': [
    { subjectId: 'CS301', subjectName: 'Data Structures (Theory)', time: '09:30 AM - 10:30 AM', room: 'CSE Block Room 302', type: 'Theory' },
    { subjectId: 'CS401', subjectName: 'Algorithms & Complexity (Tutorial)', time: '11:30 AM - 12:30 PM', room: 'CSE Tutorial Room 1', type: 'Tutorial' },
  ],
  'Thursday': [
    { subjectId: 'CS303', subjectName: 'Data Structures Lab (Batch B)', time: '01:30 PM - 03:30 PM', room: 'CSE Computer Lab 2', type: 'Practical' },
  ],
  'Friday': [
    { subjectId: 'CS401', subjectName: 'Algorithms & Complexity', time: '10:30 AM - 11:30 AM', room: 'CSE Seminar Hall', type: 'Theory' },
    { subjectId: 'CS301', subjectName: 'Data Structures (Theory)', time: '11:30 AM - 12:30 PM', room: 'CSE Block Room 302', type: 'Theory' },
  ]
}

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']

const TeacherTimetable: React.FC = () => {
  const [activeDay, setActiveDay] = useState<string>('Monday')

  return (
    <div className="space-y-5">
      <PageHeader
        title="My Teaching Schedule"
        subtitle="Your weekly lecture and lab assignments for the current semester"
      />

      {/* Day tabs */}
      <div className="flex border-b border-slate-200 overflow-x-auto gap-2">
        {DAYS.map(day => (
          <button
            key={day}
            onClick={() => setActiveDay(day)}
            className={`py-2.5 px-5 text-sm font-semibold tracking-wide border-b-2 transition-all whitespace-nowrap ${
              activeDay === day
                ? 'border-[#0b2545] text-[#0b2545] font-bold'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            {day}
          </button>
        ))}
      </div>

      {/* Grid of lectures for the selected day */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {(WEEKLY_SCHEDULE[activeDay] ?? []).map((lecture, idx) => (
          <PortalCard key={idx} className="hover:shadow-md transition-all">
            <div className="flex items-start justify-between">
              <div className="w-10 h-10 rounded-lg bg-[#0b2545]/10 border border-[#0b2545]/20 flex items-center justify-center shrink-0">
                <BookOpen size={16} className="text-[#0b2545]" />
              </div>
              <span className={`text-[9px] font-bold px-2 py-0.5 rounded border uppercase tracking-wider ${
                lecture.type === 'Practical'
                  ? 'bg-amber-50 text-amber-700 border-amber-250'
                  : lecture.type === 'Tutorial'
                  ? 'bg-blue-50 text-blue-700 border-blue-200'
                  : 'bg-[#bfa15f]/15 text-[#bfa15f] border-[#bfa15f]/40'
              }`}>
                {lecture.type}
              </span>
            </div>

            <div className="mt-3">
              <span className="text-[10px] font-bold font-mono text-[#bfa15f] tracking-wide uppercase">{lecture.subjectId}</span>
              <h4 className="text-base font-bold text-slate-800 leading-tight mt-0.5">{lecture.subjectName}</h4>
            </div>

            <div className="space-y-2 mt-4 pt-3 border-t border-slate-100 text-xs text-slate-650">
              <div className="flex items-center gap-2">
                <Clock size={13} className="text-slate-400" />
                <span>{lecture.time}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin size={13} className="text-slate-400" />
                <span>{lecture.room}</span>
              </div>
            </div>
          </PortalCard>
        ))}

        {(WEEKLY_SCHEDULE[activeDay] ?? []).length === 0 && (
          <div className="col-span-full py-16 text-center">
            <AlertCircle size={32} className="text-slate-305 mx-auto mb-2" />
            <p className="text-sm font-semibold text-slate-500">No scheduled lectures or labs for {activeDay}.</p>
          </div>
        )}
      </div>

      {/* Weekly Grid (Large Screens Only) */}
      <PortalCard className="hidden xl:block">
        <h3 className="text-sm font-bold text-slate-700 mb-4 flex items-center gap-1.5">
          <Calendar size={15} className="text-[#bfa15f]" />
          Weekly Matrix View
        </h3>
        <div className="overflow-x-auto border border-slate-200 rounded-lg">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="px-4 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider border-r border-slate-200 w-32">Day</th>
                <th className="px-4 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider border-r border-slate-200">09:30 AM - 10:30 AM</th>
                <th className="px-4 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider border-r border-slate-200">10:30 AM - 11:30 AM</th>
                <th className="px-4 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider border-r border-slate-200">11:30 AM - 12:30 PM</th>
                <th className="px-4 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider border-r border-slate-200">12:30 PM - 01:30 PM</th>
                <th className="px-4 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">01:30 PM - 03:30 PM</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 font-medium">
              {DAYS.map(day => {
                const dayLectures = WEEKLY_SCHEDULE[day] || []
                const getSlot = (timeStart: string) => {
                  return dayLectures.find(l => l.time.startsWith(timeStart))
                }
                const l1 = getSlot('09:30')
                const l2 = getSlot('10:30')
                const l3 = getSlot('11:30')
                const lab = getSlot('01:30')

                return (
                  <tr key={day} className="hover:bg-slate-50/40">
                    <td className="px-4 py-4 text-xs font-bold text-slate-800 border-r border-slate-200 bg-slate-50/60 uppercase tracking-wider">{day}</td>
                    
                    <td className="px-4 py-4 border-r border-slate-200">
                      {l1 ? (
                        <div>
                          <p className="font-bold text-slate-700 text-xs">{l1.subjectId} ({l1.type})</p>
                          <p className="text-[10px] text-slate-400 mt-0.5">{l1.room}</p>
                        </div>
                      ) : (
                        <span className="text-slate-300 text-xs">—</span>
                      )}
                    </td>

                    <td className="px-4 py-4 border-r border-slate-200">
                      {l2 ? (
                        <div>
                          <p className="font-bold text-slate-700 text-xs">{l2.subjectId} ({l2.type})</p>
                          <p className="text-[10px] text-slate-400 mt-0.5">{l2.room}</p>
                        </div>
                      ) : (
                        <span className="text-slate-300 text-xs">—</span>
                      )}
                    </td>

                    <td className="px-4 py-4 border-r border-slate-200">
                      {l3 ? (
                        <div>
                          <p className="font-bold text-slate-700 text-xs">{l3.subjectId} ({l3.type})</p>
                          <p className="text-[10px] text-slate-400 mt-0.5">{l3.room}</p>
                        </div>
                      ) : (
                        <span className="text-slate-300 text-xs">—</span>
                      )}
                    </td>

                    <td className="px-4 py-4 text-center border-r border-slate-200 bg-slate-100 text-slate-400 text-[10px] uppercase font-bold tracking-widest">
                      Lunch Break
                    </td>

                    <td className="px-4 py-4">
                      {lab ? (
                        <div>
                          <p className="font-bold text-slate-700 text-xs">{lab.subjectId} ({lab.type})</p>
                          <p className="text-[10px] text-slate-400 mt-0.5">{lab.room}</p>
                        </div>
                      ) : (
                        <span className="text-slate-300 text-xs">—</span>
                      )}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </PortalCard>
    </div>
  )
}

export default TeacherTimetable
