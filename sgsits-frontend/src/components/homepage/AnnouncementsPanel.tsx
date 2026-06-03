import React from 'react'
import { Link } from 'react-router-dom'
import { Calendar, ChevronRight } from 'lucide-react'
import { C } from './homeConstants'
import { Sk } from '../ui/Skeleton'

interface AnnouncementItem {
  id?: string
  title?: string
  date?: string
  to?: string
  isNew?: boolean
  [key: string]: unknown
}

interface AnnouncementsPanelProps {
  announcements: AnnouncementItem[]
  heading: string
  badge: string
  viewAllLabel: string
  loading: boolean
}

const AnnouncementsPanel: React.FC<AnnouncementsPanelProps> = ({
  announcements,
  heading,
  badge,
  viewAllLabel,
  loading,
}) => (
  <div
    className="bg-white h-full flex flex-col shadow-sm rounded overflow-hidden border"
    style={{ borderColor: C.navy15 }}
  >
    <div
      className="px-5 py-4 flex items-center justify-between"
      style={{ backgroundColor: C.navy }}
    >
      <h3 className="font-sans font-bold text-sm tracking-widest uppercase flex items-center text-white">
        <Calendar size={16} className="mr-2" style={{ color: C.gold }} />
        {heading}
      </h3>
      <span
        className="text-[9px] uppercase font-bold px-2 py-0.5 rounded tracking-wider"
        style={{ backgroundColor: C.gold25, color: C.gold, border: `1px solid ${C.gold20}` }}
      >
        {badge}
      </span>
    </div>

    <div className="p-0 flex-1 overflow-y-auto max-h-[500px]">
      {loading ? (
        <div className="divide-y p-3 space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="py-3 space-y-2">
              <Sk className="h-3.5 w-full" />
              <Sk className="h-3.5 w-5/6" />
              <Sk className="h-3 w-16" />
            </div>
          ))}
        </div>
      ) : (
        <ul className="divide-y animate-fade-in" style={{ borderColor: C.navy10 }}>
          {announcements.map((item) => (
            <li key={item.id} style={{ borderColor: C.navy10 }}>
              <Link
                to={item.to ?? '/notices'}
                className="flex p-4 transition-colors group hover:opacity-90"
                style={{ borderLeft: '2px solid transparent' }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderLeftColor = C.gold }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderLeftColor = 'transparent' }}
              >
                <div className="flex space-x-3 w-full">
                  <div className="shrink-0 mt-0.5">
                    <ChevronRight
                      size={14}
                      className="group-hover:translate-x-0.5 transition-transform"
                      style={{ color: C.navy45 }}
                    />
                  </div>
                  <div>
                    <p
                      className="text-[13.5px] leading-snug font-medium font-sans"
                      style={{ color: C.navy }}
                    >
                      {item.title}
                    </p>
                    <div className="mt-1.5 flex items-center">
                      {item.isNew ? (
                        <span
                          className="text-[9px] font-bold px-1.5 py-0.5 rounded"
                          style={{ backgroundColor: C.gold15, color: C.gold, border: `1px solid ${C.gold25}` }}
                        >
                          New
                        </span>
                      ) : (
                        <span
                          className="text-[10px] font-semibold uppercase tracking-wider"
                          style={{ color: C.navy45 }}
                        >
                          {item.date}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>

    <div
      className="p-4 bg-white flex justify-center mt-auto border-t"
      style={{ borderColor: C.navy10 }}
    >
      <Link
        to="/notices"
        className="text-xs font-semibold hover:underline flex items-center tracking-wider uppercase"
        style={{ color: C.navy }}
      >
        {viewAllLabel} <ChevronRight size={12} className="ml-1" />
      </Link>
    </div>
  </div>
)

export default AnnouncementsPanel
