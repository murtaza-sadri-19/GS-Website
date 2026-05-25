import React, { useMemo, useState } from 'react'
import { PageHeader, PortalCard, PortalTable, PortalModal } from '../../components/layout/PortalLayout'
import { Search, Eye, Bell, AlertTriangle } from 'lucide-react'

interface Notice {
  id: string
  title: string
  content: string
  category: 'Academic' | 'Exam' | 'Placement' | 'General'
  publishedOn: string
  publishedBy: string
  isUrgent: boolean
}

const MOCK_NOTICES: Notice[] = [
  { id: 'NT001', title: 'Submission of Course Outcomes (CO) & Target Settings', content: 'All faculty members are requested to upload the CO and Target setting worksheets for the active Jan-June 2026 session latest by June 5th, 2026, to the HOD office.', category: 'Academic', publishedOn: '2026-05-22', publishedBy: 'HOD Office', isUrgent: true },
  { id: 'NT002', title: 'Semester Exams Rescheduled to April 30th', content: 'Please note that the upcoming undergraduate semester theory examinations originally scheduled from April 24th have been rescheduled to start from April 30th. Revised schedules are uploaded.', category: 'Exam', publishedOn: '2026-04-18', publishedBy: 'Controller of Exams', isUrgent: true },
  { id: 'NT003', title: 'Seed Grant Proposals Called for FY 2026-27', content: 'Applications are invited from faculty members for institute research seed grants (up to Rs. 5 Lakhs per project). Please submit proposals in the prescribed format by June 15th.', category: 'Academic', publishedOn: '2026-05-20', publishedBy: 'Dean R&D', isUrgent: false },
  { id: 'NT004', title: 'T&P Drive: TCS Digital recruitment scheduled on June 10th', content: 'Training & Placement cell has scheduled campus recruitment for TCS Digital on June 10th. All CSE/IT eligible students (above 7.5 CGPA) list has been sent to HOD offices.', category: 'Placement', publishedOn: '2026-05-18', publishedBy: 'T&P Officer', isUrgent: false },
  { id: 'NT005', title: 'Department Faculty Meeting on May 28th', content: 'There will be a mandatory department review meeting presided by HOD on May 28th, 03:00 PM, in the CSE Block Seminar Room to discuss syllabus completion status.', category: 'General', publishedOn: '2026-05-21', publishedBy: 'HOD Office', isUrgent: true },
]

const TeacherNotices: React.FC = () => {
  const [search, setSearch] = useState('')
  const [categoryFilter, setCategoryFilter] = useState<'all' | Notice['category']>('all')
  const [viewingNotice, setViewingNotice] = useState<Notice | null>(null)

  const visible = useMemo(() => {
    return MOCK_NOTICES.filter(n => {
      if (categoryFilter !== 'all' && n.category !== categoryFilter) return false
      if (search.trim()) {
        const q = search.toLowerCase()
        if (
          !n.title.toLowerCase().includes(q) &&
          !n.content.toLowerCase().includes(q) &&
          !n.publishedBy.toLowerCase().includes(q)
        )
          return false
      }
      return true
    })
  }, [search, categoryFilter])

  return (
    <div className="space-y-5">
      <PageHeader
        title="Department & Institute Notices"
        subtitle="Important announcements and circulars for faculty members"
      />

      <PortalCard className="!p-3">
        <div className="flex flex-col sm:flex-row gap-2.5">
          <div className="relative flex-1 min-w-0">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search notices by keyword, title or publisher..."
              className="w-full pl-9 pr-3 py-2 text-sm border border-slate-200 rounded focus:outline-none focus:border-[#0b2545] bg-white"
            />
          </div>
          <select
            value={categoryFilter}
            onChange={e => setCategoryFilter(e.target.value as 'all' | Notice['category'])}
            className="border border-slate-200 rounded px-3 py-2 text-sm bg-white focus:outline-none focus:border-[#0b2545]"
          >
            <option value="all">All Categories</option>
            <option value="Academic">Academic</option>
            <option value="Exam">Exam</option>
            <option value="Placement">Placement</option>
            <option value="General">General</option>
          </select>
        </div>
      </PortalCard>

      <PortalCard className="!p-0 overflow-hidden">
        <PortalTable
          headers={['Notice ID', 'Announcement', 'Category', 'Published On', 'By', 'Actions']}
          rows={visible}
          empty="No notices match the selected filter criteria."
          renderRow={(n: Notice) => (
            <tr key={n.id} className="hover:bg-slate-50/60 transition-colors">
              <td className="px-4 py-3 font-mono text-xs font-bold text-slate-800">{n.id}</td>
              <td className="px-4 py-3 max-w-md">
                <div className="flex items-start gap-2">
                  <div className="shrink-0 mt-0.5">
                    {n.isUrgent ? (
                      <span title="Urgent Notice">
                        <AlertTriangle size={14} className="text-[#0b2545]" />
                      </span>
                    ) : (
                      <Bell size={14} className="text-[#bfa15f]" />
                    )}
                  </div>
                  <div className="min-w-0">
                    <p className={`text-sm font-bold ${n.isUrgent ? 'text-slate-850 font-extrabold' : 'text-slate-700'}`}>{n.title}</p>
                    <p className="text-[11px] text-slate-500 truncate mt-0.5">{n.content}</p>
                  </div>
                </div>
              </td>
              <td className="px-4 py-3">
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded border uppercase tracking-wider ${
                  n.category === 'Exam'
                    ? 'bg-[#0b2545]/10 text-[#0b2545] border-[#0b2545]/25'
                    : n.category === 'Academic'
                    ? 'bg-[#bfa15f]/15 text-[#bfa15f] border-[#bfa15f]/30'
                    : 'bg-slate-50 text-slate-600 border-slate-205'
                }`}>
                  {n.category}
                </span>
              </td>
              <td className="px-4 py-3 text-xs text-slate-500">{n.publishedOn}</td>
              <td className="px-4 py-3 text-xs font-semibold text-slate-600">{n.publishedBy}</td>
              <td className="px-4 py-3">
                <button
                  onClick={() => setViewingNotice(n)}
                  className="p-1.5 rounded text-slate-550 hover:bg-slate-100 hover:text-[#0b2545] transition-all inline-flex items-center gap-1 text-[11px] font-bold"
                >
                  <Eye size={13} /> View notice
                </button>
              </td>
            </tr>
          )}
        />
      </PortalCard>

      {/* Viewing Notice Modal */}
      <PortalModal
        isOpen={!!viewingNotice}
        title={viewingNotice ? `Notice Details — ${viewingNotice.id}` : ''}
        onClose={() => setViewingNotice(null)}
        width="max-w-lg"
      >
        {viewingNotice && (
          <div className="space-y-4">
            <div className="border-b border-slate-100 pb-3 flex items-start gap-2.5">
              <div className="w-10 h-10 rounded bg-[#bfa15f]/15 flex items-center justify-center shrink-0">
                <Bell size={18} className="text-[#bfa15f]" />
              </div>
              <div className="min-w-0">
                <h3 className="font-bold text-slate-800 text-base leading-snug">{viewingNotice.title}</h3>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Published by <span className="font-bold text-slate-600">{viewingNotice.publishedBy}</span> on {viewingNotice.publishedOn}
                </p>
              </div>
            </div>

            <div className="text-sm text-slate-700 leading-relaxed bg-slate-50 border border-slate-100 rounded-xl p-4 whitespace-pre-wrap">
              {viewingNotice.content}
            </div>

            <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded border uppercase tracking-wider ${
                viewingNotice.isUrgent ? 'bg-[#0b2545]/15 text-[#0b2545] border-[#0b2545]/30' : 'bg-slate-50 text-slate-600 border-slate-200'
              }`}>
                {viewingNotice.isUrgent ? 'Urgent Circular' : 'Standard Announcement'}
              </span>
              <button
                onClick={() => setViewingNotice(null)}
                className="px-4 py-1.5 bg-[#0b2545] text-white text-xs font-bold rounded hover:bg-[#0b2545]/90 transition-colors"
              >
                Close Notice
              </button>
            </div>
          </div>
        )}
      </PortalModal>
    </div>
  )
}

export default TeacherNotices
