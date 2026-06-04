import { Sk } from '../../components/ui/Skeleton'
import React, { useMemo, useState, useEffect, useCallback } from 'react'
import { PageHeader, PortalCard, PortalTable, PortalModal } from '../../components/layout/PortalLayout'
import { Search, Eye, Bell, AlertTriangle, RefreshCw } from 'lucide-react'
import { apiClient } from '../../api/client'

interface Notice {
  id: number
  title: string
  description: string
  notice_type: string
  publish_date: string | null
  created_at: string
  status: string
  department_name: string | null
}

const TYPE_LABEL: Record<string, string> = {
  GENERAL: 'General', DEPARTMENT: 'Academic', EXAM: 'Exam', PLACEMENT: 'Placement',
}

const TeacherNotices: React.FC = () => {
  const [notices, setNotices]           = useState<Notice[]>([])
  const [loading, setLoading]           = useState(true)
  const [search, setSearch]             = useState('')
  const [categoryFilter, setCategoryFilter] = useState<string>('all')
  const [viewingNotice, setViewingNotice]   = useState<Notice | null>(null)

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const res = await apiClient.get('/v1/notices', { params: { pageSize: 100 } })
      setNotices(res.data?.data?.notices ?? [])
    } catch {
      // silent — shows empty state
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { load() }, [load])

  const visible = useMemo(() => {
    return notices.filter(n => {
      if (categoryFilter !== 'all' && n.notice_type !== categoryFilter) return false
      if (search.trim()) {
        const q = search.toLowerCase()
        if (!n.title.toLowerCase().includes(q) && !(n.description ?? '').toLowerCase().includes(q)) return false
      }
      return true
    })
  }, [notices, search, categoryFilter])

  return (
    <div className="space-y-5">
      <PageHeader
        title="Department & Institute Notices"
        subtitle="Important announcements and circulars for faculty members"
        action={
          <button
            onClick={load}
            className="p-2 border border-slate-200 rounded-lg text-slate-500 hover:text-primary hover:bg-slate-50 transition-colors"
            title="Refresh"
          >
            <RefreshCw size={15} className={loading ? 'animate-spin' : ''} />
          </button>
        }
      />

      <PortalCard className="!p-3">
        <div className="flex flex-col sm:flex-row gap-2.5">
          <div className="relative flex-1 min-w-0">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search notices by keyword or title..."
              className="w-full pl-9 pr-3 py-2 text-sm border border-slate-200 rounded focus:outline-none focus:border-primary bg-white"
            />
          </div>
          <select
            value={categoryFilter}
            onChange={e => setCategoryFilter(e.target.value)}
            className="border border-slate-200 rounded px-3 py-2 text-sm bg-white focus:outline-none focus:border-primary"
          >
            <option value="all">All Types</option>
            <option value="GENERAL">General</option>
            <option value="DEPARTMENT">Academic / Dept.</option>
            <option value="EXAM">Exam</option>
            <option value="PLACEMENT">Placement</option>
          </select>
        </div>
      </PortalCard>

      {loading ? (
        <PortalCard>
          <div className="space-y-3">
            {Array.from({length: 3}).map((_, i) => <Sk key={i} className="h-10 rounded" />)}
          </div>
        </PortalCard>
      ) : (
        <PortalCard className="!p-0 overflow-hidden">
          <PortalTable
            headers={['Title', 'Type', 'Published', 'Department', 'Actions']}
            rows={visible}
            empty={notices.length === 0 ? 'No notices published yet.' : 'No notices match the selected filter.'}
            renderRow={(n: Notice) => (
              <tr key={n.id} className="hover:bg-slate-50/60 transition-colors">
                <td className="px-4 py-3 max-w-sm">
                  <div className="flex items-start gap-2">
                    <div className="shrink-0 mt-0.5">
                      {n.notice_type === 'EXAM' ? (
                        <AlertTriangle size={14} className="text-primary" />
                      ) : (
                        <Bell size={14} className="text-accent" />
                      )}
                    </div>
                    <p className="text-sm font-bold text-slate-700 truncate">{n.title}</p>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <span className={`text-xs font-bold px-2 py-0.5 rounded border uppercase tracking-wider ${
                    n.notice_type === 'EXAM'
                      ? 'bg-primary/10 text-primary border-primary/25'
                      : n.notice_type === 'DEPARTMENT'
                      ? 'bg-accent/15 text-accent border-accent/30'
                      : 'bg-slate-50 text-slate-600 border-slate-200'
                  }`}>
                    {TYPE_LABEL[n.notice_type] ?? n.notice_type}
                  </span>
                </td>
                <td className="px-4 py-3 text-xs text-slate-500 whitespace-nowrap">
                  {n.publish_date ?? n.created_at?.slice(0, 10)}
                </td>
                <td className="px-4 py-3 text-xs text-slate-500">{n.department_name ?? '—'}</td>
                <td className="px-4 py-3">
                  <button
                    onClick={() => setViewingNotice(n)}
                    className="p-1.5 rounded text-slate-500 hover:bg-slate-100 hover:text-primary transition-all inline-flex items-center gap-1 text-xs font-bold"
                  >
                    <Eye size={13} /> View
                  </button>
                </td>
              </tr>
            )}
          />
        </PortalCard>
      )}

      <PortalModal
        isOpen={!!viewingNotice}
        title={viewingNotice ? `Notice — ${viewingNotice.title}` : ''}
        onClose={() => setViewingNotice(null)}
        width="max-w-lg"
      >
        {viewingNotice && (
          <div className="space-y-4">
            <div className="border-b border-slate-100 pb-3 flex items-start gap-2.5">
              <div className="w-10 h-10 rounded bg-accent/15 flex items-center justify-center shrink-0">
                <Bell size={18} className="text-accent" />
              </div>
              <div className="min-w-0">
                <h3 className="font-bold text-slate-800 text-base leading-snug">{viewingNotice.title}</h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Published on {viewingNotice.publish_date ?? viewingNotice.created_at?.slice(0, 10)}
                  {viewingNotice.department_name && ` · ${viewingNotice.department_name}`}
                </p>
              </div>
            </div>

            <div className="text-sm text-slate-700 leading-relaxed bg-slate-50 border border-slate-100 rounded-xl p-4 whitespace-pre-wrap">
              {viewingNotice.description || 'No additional details provided.'}
            </div>

            <div className="pt-2 border-t border-slate-100 flex items-center justify-end">
              <button
                onClick={() => setViewingNotice(null)}
                className="px-4 py-1.5 bg-primary text-white text-xs font-bold rounded hover:bg-primary/90 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </PortalModal>
    </div>
  )
}

export default TeacherNotices
