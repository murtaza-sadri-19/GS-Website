import React, { useState, useEffect } from 'react'
import { PageHeader, PortalCard, PortalModal, Badge } from '../../components/layout/PortalLayout'
import { Plus, Search, Trash2, Globe, Check, X } from 'lucide-react'

// Simple local Toast component
interface ToastProps {
  message: string
  onClose: () => void
}
const Toast: React.FC<ToastProps> = ({ message, onClose }) => {
  useEffect(() => {
    const t = setTimeout(onClose, 3000)
    return () => clearTimeout(t)
  }, [onClose])
  
  return (
    <div className="fixed bottom-4 right-4 z-50 bg-[#0b2545] text-white px-5 py-3 rounded-lg shadow-lg flex items-center gap-3 text-sm font-medium">
      {message}
      <button onClick={onClose} className="hover:text-slate-300">
        <X size={14} />
      </button>
    </div>
  )
}

interface CalendarItem {
  id: string
  title: string
  level: 'UG' | 'PG' | 'All'
  session: string
  releaseDate: string
  fileUrl: string
  isActive: boolean
}

const MOCK_CALENDARS: CalendarItem[] = [
  {
    id: 'cal1',
    title: 'Academic Calendar for UG Programs — Even Semester',
    level: 'UG',
    session: '2025-2026',
    releaseDate: '2025-12-15',
    fileUrl: 'https://sgsits.ac.in/academic/calendars/ug_even_sem_2025_26.pdf',
    isActive: true,
  },
  {
    id: 'cal2',
    title: 'Academic Calendar for PG Programs — Even Semester',
    level: 'PG',
    session: '2025-2026',
    releaseDate: '2025-12-18',
    fileUrl: 'https://sgsits.ac.in/academic/calendars/pg_even_sem_2025_26.pdf',
    isActive: true,
  },
  {
    id: 'cal3',
    title: 'Annual Academic Calendar for PhD Programs',
    level: 'All',
    session: '2025-2026',
    releaseDate: '2025-07-10',
    fileUrl: 'https://sgsits.ac.in/academic/calendars/phd_annual_2025_26.pdf',
    isActive: false,
  },
]

const ExamAcademicCalendar: React.FC = () => {
  const [calendars, setCalendars] = useState<CalendarItem[]>(MOCK_CALENDARS)
  const [search, setSearch] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [toast, setToast] = useState('')

  // Form State
  const [title, setTitle] = useState('')
  const [level, setLevel] = useState<'UG' | 'PG' | 'All'>('UG')
  const [session, setSession] = useState('2026-2027')
  const [releaseDate, setReleaseDate] = useState(new Date().toISOString().slice(0, 10))
  const [fileUrl, setFileUrl] = useState('')

  const handleOpenAdd = () => {
    setTitle('')
    setLevel('UG')
    setSession('2026-2027')
    setReleaseDate(new Date().toISOString().slice(0, 10))
    setFileUrl('')
    setShowModal(true)
  }

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault()
    if (!title || !session || !fileUrl) {
      setToast('Please fill all fields.')
      return
    }

    const newItem: CalendarItem = {
      id: `cal${Date.now()}`,
      title,
      level,
      session,
      releaseDate,
      fileUrl,
      isActive: false,
    }

    setCalendars(prev => [newItem, ...prev])
    setToast('Academic calendar uploaded successfully.')
    setShowModal(false)
  }

  const handleToggleActive = (id: string) => {
    setCalendars(prev =>
      prev.map(c => (c.id === id ? { ...c, isActive: !c.isActive } : c))
    )
    const target = calendars.find(c => c.id === id)
    if (target) {
      setToast(`Calendar status toggled for "${target.title}".`)
    }
  }

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this calendar?')) {
      setCalendars(prev => prev.filter(c => c.id !== id))
      setToast('Academic calendar deleted successfully.')
    }
  }

  const filteredCalendars = calendars.filter(c =>
    c.title.toLowerCase().includes(search.toLowerCase()) ||
    c.session.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="space-y-5">
      <PageHeader
        title="Academic Calendar"
        subtitle="Publish and manage annual academic schedules, timelines, and teaching calendars"
        action={
          <button
            onClick={handleOpenAdd}
            className="bg-primary hover:bg-primary/95 text-white text-sm font-semibold px-4 py-2 rounded-lg flex items-center gap-2 transition-colors shadow-sm"
          >
            <Plus size={15} />
            <span>Upload Calendar</span>
          </button>
        }
      />

      <div className="flex items-center gap-3 bg-white p-3 border border-slate-200 rounded-xl shadow-sm">
        <Search className="text-slate-400 shrink-0" size={18} />
        <input
          type="text"
          placeholder="Search calendars by title, academic session..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full text-sm text-slate-700 bg-transparent focus:outline-none"
        />
      </div>

      <PortalCard>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="text-left px-4 py-3 text-[11px] font-bold text-slate-500 uppercase tracking-wider">Calendar Title</th>
                <th className="text-center px-4 py-3 text-[11px] font-bold text-slate-500 uppercase tracking-wider">Level</th>
                <th className="text-center px-4 py-3 text-[11px] font-bold text-slate-500 uppercase tracking-wider">Session</th>
                <th className="text-left px-4 py-3 text-[11px] font-bold text-slate-500 uppercase tracking-wider">Release Date</th>
                <th className="text-center px-4 py-3 text-[11px] font-bold text-slate-500 uppercase tracking-wider">Status</th>
                <th className="text-center px-4 py-3 text-[11px] font-bold text-slate-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredCalendars.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-8 text-slate-400 text-xs">
                    No academic calendars found. Upload one to get started.
                  </td>
                </tr>
              ) : (
                filteredCalendars.map(cal => (
                  <tr key={cal.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-4 py-3">
                      <a
                        href={cal.fileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-semibold text-slate-800 hover:text-primary hover:underline block"
                      >
                        {cal.title}
                      </a>
                    </td>
                    <td className="px-4 py-3 text-center text-slate-600 text-xs font-bold">
                      {cal.level}
                    </td>
                    <td className="px-4 py-3 text-center text-slate-600 text-xs font-semibold whitespace-nowrap">
                      Session {cal.session}
                    </td>
                    <td className="px-4 py-3 text-slate-500 text-xs font-semibold whitespace-nowrap">
                      {cal.releaseDate}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <Badge
                        label={cal.isActive ? 'Active' : 'Archived'}
                        variant={cal.isActive ? 'success' : 'default'}
                      />
                    </td>
                    <td className="px-4 py-3 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          onClick={() => handleToggleActive(cal.id)}
                          className={`p-1.5 rounded transition-colors ${
                            cal.isActive
                              ? 'text-slate-400 hover:text-slate-600 hover:bg-slate-100'
                              : 'text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50'
                          }`}
                          title={cal.isActive ? 'Mark Archived' : 'Mark Active'}
                        >
                          <Check size={13} />
                        </button>
                        <a
                          href={cal.fileUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-1.5 text-slate-500 hover:text-primary hover:bg-slate-100 rounded transition-colors"
                          title="Open Calendar PDF"
                        >
                          <Globe size={13} />
                        </a>
                        <button
                          onClick={() => handleDelete(cal.id)}
                          className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                          title="Delete Calendar"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </PortalCard>

      {/* Add Modal */}
      <PortalModal isOpen={showModal} title="Upload Academic Calendar" onClose={() => setShowModal(false)}>
        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-600 uppercase tracking-wide mb-1">
              Calendar Title
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="e.g. Revised Academic Calendar for UG & PG classes 2026-27"
              className="w-full border border-slate-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-primary"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-600 uppercase tracking-wide mb-1">
                Course Level
              </label>
              <select
                value={level}
                onChange={e => setLevel(e.target.value as 'UG' | 'PG' | 'All')}
                required
                className="w-full border border-slate-200 rounded px-3 py-2 text-sm bg-white focus:outline-none focus:border-primary"
              >
                <option value="UG">UG (Undergraduate)</option>
                <option value="PG">PG (Postgraduate)</option>
                <option value="All">All (UG, PG, PhD)</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-600 uppercase tracking-wide mb-1">
                Academic Session
              </label>
              <input
                type="text"
                required
                value={session}
                onChange={e => setSession(e.target.value)}
                placeholder="e.g. 2026-2027"
                className="w-full border border-slate-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-primary"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-600 uppercase tracking-wide mb-1">
              Release Date
            </label>
            <input
              type="date"
              required
              value={releaseDate}
              onChange={e => setReleaseDate(e.target.value)}
              className="w-full border border-slate-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-primary"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-600 uppercase tracking-wide mb-1">
              Calendar PDF Link
            </label>
            <input
              type="url"
              required
              value={fileUrl}
              onChange={e => setFileUrl(e.target.value)}
              placeholder="https://example.com/exam/calendars/calendar.pdf"
              className="w-full border border-slate-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-primary"
            />
          </div>

          <div className="flex items-center gap-3 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setShowModal(false)}
              className="flex-1 py-2 border border-slate-200 text-slate-700 rounded font-semibold text-sm hover:bg-slate-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 py-2 bg-primary text-white rounded font-semibold text-sm hover:bg-primary/95 transition-colors"
            >
              Upload Calendar
            </button>
          </div>
        </form>
      </PortalModal>

      {toast && <Toast message={toast} onClose={() => setToast('')} />}
    </div>
  )
}

export default ExamAcademicCalendar
