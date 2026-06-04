import React, { useState, useEffect, useCallback } from 'react'
import { PageHeader, PortalCard, PortalModal } from '../../components/layout/PortalLayout'
import { Plus, Search, Trash2, X, RefreshCw, FileText } from 'lucide-react'
import AttachmentUpload from '../../components/admin/AttachmentUpload'
import type { AttachmentRecord } from '../../api/index'
import { apiClient } from '../../api/client'

interface ToastProps { message: string; onClose: () => void }
const Toast: React.FC<ToastProps> = ({ message, onClose }) => {
  useEffect(() => { const t = setTimeout(onClose, 3000); return () => clearTimeout(t) }, [onClose])
  return (
    <div className="fixed bottom-4 right-4 z-50 bg-primary text-white px-5 py-3 rounded-lg shadow-lg flex items-center gap-3 text-sm font-medium">
      {message}<button onClick={onClose} className="hover:text-slate-300"><X size={14} /></button>
    </div>
  )
}

interface Notice {
  id: number
  title: string
  description: string | null
  notice_type: string
  publish_date: string | null
  created_at: string
  status: string
  file_url: string | null
}

const PlacementNotices: React.FC = () => {
  const [notices, setNotices]     = useState<Notice[]>([])
  const [loading, setLoading]     = useState(true)
  const [search, setSearch]       = useState('')
  const [showModal, setShowModal] = useState(false)
  const [toast, setToast]         = useState('')
  const [saving, setSaving]       = useState(false)

  const [title, setTitle]                       = useState('')
  const [description, setDescription]           = useState('')
  const [publishDate, setPublishDate]           = useState(new Date().toISOString().slice(0, 10))
  const [fileId, setFileId]                     = useState<number | null>(null)
  const [attachmentRecord, setAttachmentRecord] = useState<AttachmentRecord | null>(null)

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const res = await apiClient.get('/v1/notices', { params: { notice_type: 'PLACEMENT', pageSize: 100 } })
      setNotices(res.data?.data?.notices ?? [])
    } catch { setToast('Failed to load notices.') }
    finally { setLoading(false) }
  }, [])

  useEffect(() => { load() }, [load])

  const handleOpenAdd = () => {
    setTitle(''); setDescription('')
    setPublishDate(new Date().toISOString().slice(0, 10))
    setFileId(null); setAttachmentRecord(null)
    setShowModal(true)
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim()) { setToast('Title is required.'); return }
    setSaving(true)
    try {
      await apiClient.post('/v1/notices', {
        title: title.trim(),
        description: description.trim() || null,
        notice_type: 'PLACEMENT',
        publish_date: publishDate || null,
        file_id: fileId || null,
        status: 'PUBLISHED',
      })
      setToast('Notice published.'); setShowModal(false); load()
    } catch { setToast('Failed to publish notice.') }
    finally { setSaving(false) }
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Archive this notice?')) return
    try {
      await apiClient.patch(`/v1/notices/${id}/status`, { status: 'ARCHIVED' })
      setToast('Notice archived.'); load()
    } catch { setToast('Failed to archive notice.') }
  }

  const filtered = notices.filter(n =>
    n.title.toLowerCase().includes(search.toLowerCase()) ||
    (n.description ?? '').toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="space-y-5">
      <PageHeader
        title="Placement Notices"
        subtitle="Publish job announcements, internship alerts, and training notices"
        action={
          <div className="flex items-center gap-2">
            <button onClick={load} className="p-2 border border-slate-200 rounded-lg text-slate-500 hover:text-primary hover:bg-slate-50 transition-colors" title="Refresh">
              <RefreshCw size={15} className={loading ? 'animate-spin' : ''} />
            </button>
            <button onClick={handleOpenAdd}
              className="bg-primary hover:bg-primary/95 text-white text-sm font-semibold px-4 py-2 rounded-lg flex items-center gap-2 transition-colors shadow-sm">
              <Plus size={15} /><span>New Notice</span>
            </button>
          </div>
        }
      />

      <div className="flex items-center gap-3 bg-white p-3 border border-slate-200 rounded-xl shadow-sm">
        <Search className="text-slate-400 shrink-0" size={18} />
        <input type="text" placeholder="Search notices..." value={search} onChange={e => setSearch(e.target.value)}
          className="w-full text-sm text-slate-700 bg-transparent focus:outline-none" />
      </div>

      <PortalCard>
        {loading ? (
          <div className="space-y-3">{[1,2,3].map(i => <div key={i} className="h-10 bg-slate-100 rounded animate-pulse" />)}</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200">
                  <th className="text-left px-4 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">Title</th>
                  <th className="text-left px-4 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">Published</th>
                  <th className="text-center px-4 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">File</th>
                  <th className="text-center px-4 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.length === 0 ? (
                  <tr><td colSpan={4} className="text-center py-8 text-slate-400 text-xs">
                    {notices.length === 0 ? 'No placement notices yet.' : 'No notices match your search.'}
                  </td></tr>
                ) : filtered.map(n => (
                  <tr key={n.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-4 py-3">
                      <p className="font-semibold text-slate-800">{n.title}</p>
                      {n.description && <p className="text-xs text-slate-400 mt-0.5 truncate max-w-sm">{n.description}</p>}
                    </td>
                    <td className="px-4 py-3 text-xs text-slate-500 whitespace-nowrap">{n.publish_date ?? n.created_at?.slice(0, 10)}</td>
                    <td className="px-4 py-3 text-center">
                      {n.file_url ? (
                        <a href={n.file_url} target="_blank" rel="noopener noreferrer"
                          className="p-1.5 text-primary hover:bg-slate-100 rounded transition-colors inline-flex items-center" title="Open File">
                          <FileText size={13} />
                        </a>
                      ) : <span className="text-slate-300 text-xs">—</span>}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <button onClick={() => handleDelete(n.id)}
                        className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors" title="Archive">
                        <Trash2 size={13} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </PortalCard>

      <PortalModal isOpen={showModal} title="Publish Placement Notice" onClose={() => setShowModal(false)}>
        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-600 uppercase tracking-wide mb-1">Title *</label>
            <input type="text" required value={title} onChange={e => setTitle(e.target.value)}
              placeholder="e.g. Microsoft Campus Recruitment Drive 2026"
              className="w-full border border-slate-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-primary" />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-600 uppercase tracking-wide mb-1">Description</label>
            <textarea value={description} onChange={e => setDescription(e.target.value)} rows={3}
              placeholder="Details about the notice..."
              className="w-full border border-slate-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-primary resize-none" />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-600 uppercase tracking-wide mb-1">Publish Date</label>
            <input type="date" value={publishDate} onChange={e => setPublishDate(e.target.value)}
              className="w-full border border-slate-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-primary" />
          </div>
          <AttachmentUpload usage="placement" label="Attachment (Optional)" required={false}
            onAttached={r => { setAttachmentRecord(r); setFileId(r.id) }}
            onClear={() => { setAttachmentRecord(null); setFileId(null) }}
            initialValue={attachmentRecord} />
          <div className="flex items-center gap-3 pt-3 border-t border-slate-100">
            <button type="button" onClick={() => setShowModal(false)}
              className="flex-1 py-2 border border-slate-200 text-slate-700 rounded font-semibold text-sm hover:bg-slate-50 transition-colors">Cancel</button>
            <button type="submit" disabled={saving}
              className="flex-1 py-2 bg-primary text-white rounded font-semibold text-sm hover:bg-primary/95 transition-colors disabled:opacity-60">
              {saving ? 'Publishing…' : 'Publish Notice'}
            </button>
          </div>
        </form>
      </PortalModal>

      {toast && <Toast message={toast} onClose={() => setToast('')} />}
    </div>
  )
}

export default PlacementNotices
