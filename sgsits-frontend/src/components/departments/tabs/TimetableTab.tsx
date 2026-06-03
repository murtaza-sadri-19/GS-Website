import React from 'react'
import { Eye } from 'lucide-react'

interface TimetableTabProps {
  onOpenPdf: (url: string, title: string) => void
}

const SCHEDULES = [
  { sem: 'B.Tech III / V Semester', slot: 'Class Lectures & Labs', url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf' },
  { sem: 'B.Tech VII Semester', slot: 'Project Work Schedule', url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf' },
  { sem: 'M.Tech / PG Modules', slot: 'Lecture Slots & Seminars', url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf' },
]

const TimetableTab: React.FC<TimetableTabProps> = ({ onOpenPdf }) => (
  <div className="space-y-6">
    <div className="pb-3 border-b border-slate-200">
      <h2 className="text-xl font-display font-bold text-slate-900">Academic Class Timetables</h2>
    </div>
    <p className="text-xs md:text-sm text-slate-655 leading-relaxed font-sans">
      Select your academic batch to download active schedules, lecture hour splits, and laboratory slot sheets.
    </p>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4">
      {SCHEDULES.map((s, idx) => (
        <div key={idx} className="p-4 bg-white border border-slate-200 rounded space-y-3 flex flex-col justify-between shadow-sm hover:border-slate-350 transition-colors">
          <div className="space-y-1">
            <h4 className="text-xs font-bold text-slate-800">{s.sem}</h4>
            <p className="text-[10px] text-slate-400 font-sans font-semibold">{s.slot}</p>
          </div>
          <button
            onClick={() => onOpenPdf(s.url, `${s.sem} Timetable`)}
            className="w-full py-1.5 bg-slate-50 border border-slate-200 hover:text-primary hover:bg-slate-100 hover:border-slate-350 text-slate-600 font-bold text-[10px] rounded flex items-center justify-center gap-1 shadow-sm transition-all duration-200"
          >
            <Eye className="w-3.5 h-3.5" />View Timetable
          </button>
        </div>
      ))}
    </div>
  </div>
)

export default TimetableTab
