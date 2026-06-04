import { Sk } from '../../components/ui/Skeleton'
import React, { useState, useEffect, useCallback } from 'react'
import { PageHeader, PortalCard, PortalModal, Badge } from '../../components/layout/PortalLayout'
import { Plus, Search, Trash2, FileText, RefreshCw, X, CheckCircle } from 'lucide-react'
import AttachmentUpload from '../../components/admin/AttachmentUpload'
import type { AttachmentRecord } from '../../api/index'
import { apiClient } from '../../api/client'

interface ToastProps { message: string; onClose: () => void }
const Toast: React.FC<ToastProps> = ({ message, onClose }) => {
  useEffect(() => { const t = setTimeout(onClose, 3000); return () => clearTimeout(t) }, [onClose])
  return (
    <div className="fixed bottom-4 right-4 z-50 bg-primary text-white px-5 py-3 rounded-lg shadow-lg flex items-center gap-3 text-sm font-medium">
      {message}
      <button onClick={onClose} className="hover:text-slate-300"><X size={14} /></button>
    </div>
  )
}

interface CalendarDoc {
  id: number
  title: string
  description: string | null
  file_url: string
  original_name: string
  publish_date: string | null
  created_at: string
  status: string
}

const ExamAcademicCalendar: React.FC = () => {
  const [docs, setDocs]           = useState<CalendarDoc[]>([])
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
      const res = await apiClient.get('/v1/exam/academic-calendar', { params: { pageSize: 100 } })
      setDocs(res.data?.data?.documents ?? [])
    } catch {
      setToast('Failed to load academic calendars.')
    } finally {
      setLoading(false)
    }
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
    if (!title.trim() || !fileId) {
      setToast('Please provide a title and attach a calendar file.')
      return
    }
    setSaving(true)
    try {
      await apiClient.post('/v1/exam/documents', {
        title: title.trim(),
        document_type: 'ACADEMIC_CALENDAR',
        description: description.trim() || null,
        file_id: fileId,
        publish_date: publishDate || null,
      })
      setToast('Academic calendar uploaded successfully.')
      setShowModal(false)
      load()
    } catch {
      setToast('Failed to save calendar.')
    } finally {
      setSaving(false)
    }
  }

  const handleSetActive = async (id: number, isCurrentlyActive: boolean) => {
    try {
      await apiClient.patch(`/v1/exam/documents/${id}/status`, {
        status: isCurrentlyActive ? 'INACTIVE' : 'ACTIVE',
      })
      setToast('Status updated.')
      load()
    } catch {
      setToast('Failed to update status.')
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this calendar?')) return
    try {
      await apiClient.delete(`/v1/exam/documents/${id}`)
      setToast('Calendar deleted successfully.')
      load()
    } catch {
      setToast('Failed to delete calendar.')
    }
  }

  const filtered = docs.filter(d =>
    d.title.toLowerCase().includes(search.toLowerCase()) ||
    (d.description ?? '').toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="space-y-5">
      <PageHeader
        title="Academic Calendar"
        subtitle="Publish and manage annual academic schedules and teaching calendars"
        action={
          <div className="flex items-center gap-2">
            <button
              onClick={load}
              className="p-2 border border-slate-200 rounded-lg text-slate-500 hover:text-primary hover:bg-slate-50 transition-colors"
              title="Refresh"
            >
              <RefreshCw size={15} />
            </button>
            <button
              onClick={handleOpenAdd}
              className="bg-primary hover:bg-primary/95 text-white text-sm font-semibold px-4 py-2 rounded-lg flex items-center gap-2 transition-colors shadow-sm"
            >
              <Plus size={15} />
              <span>Upload Calendar</span>
            </button>
          </div>
        }
      />

      <div className="flex items-center gap-3 bg-white p-3 border border-slate-200 rounded-xl shadow-sm">
        <Search className="text-slate-400 shrink-0" size={18} />
        <input
          type="text"
          placeholder="Search calendars by title or description..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full text-sm text-slate-700 bg-transparent focus:outline-none"
        />
      </div>

      <PortalCard>
        {loading ? (
          <div className="space-y-3 p-4">
            {Array.from({length: 3}).map((_, i) => <Sk key={i} className="h-10 rounded" />)}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200">
                  <th className="text-left px-4 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">Calendar Title</th>
                  <th className="text-left px-4 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">Description</th>
                  <th className="text-left px-4 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">Published</th>
                  <th className="text-center px-4 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                  <th className="text-center px-4 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="text-center py-8 text-slate-400 text-xs">
                      {docs.length === 0 ? 'No academic calendars uploaded yet.' : 'No calendars match your search.'}
                    </td>
                  </tr>
                ) : (
                  filtered.map(doc => (
                    <tr key={doc.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-4 py-3">
                        <a
                          href={doc.file_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-semibold text-slate-800 hover:text-primary hover:underline block"
                        >
                          {doc.title}
                        </a>
                        <span className="text-xs text-slate-400">{doc.original_name}</span>
                      </td>
                      <td className="px-4 py-3 text-slate-500 text-xs">{doc.description ?? '—'}</td>
                      <td className="px-4 py-3 text-slate-500 text-xs font-semibold whitespace-nowrap">
                        {doc.publish_date ?? doc.created_at?.slice(0, 10)}
                      </td>
                      <td className="px-4 py-3 text-center">
                        <Badge
                          label={doc.status === 'ACTIVE' ? 'Active' : 'Inactive'}
                          variant={doc.status === 'ACTIVE' ? 'success' : 'default'}
                        />
                      </td>
                      <td className="px-4 py-3 text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          <button
                            onClick={() => handleSetActive(doc.id, doc.status === 'ACTIVE')}
                            className={`p-1.5 rounded transition-colors ${
                              doc.status === 'ACTIVE'
                                ? 'text-slate-400 hover:text-slate-600 hover:bg-slate-100'
                                : 'text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50'
                            }`}
                            title={doc.status === 'ACTIVE' ? 'Deactivate' : 'Activate'}
                          >
                            <CheckCircle size={13} />
                          </button>
                          <a
                            href={doc.file_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1.5 text-slate-500 hover:text-primary hover:bg-slate-100 rounded transition-colors"
                            title="Open Calendar PDF"
                          >
                            <FileText size={13} />
                          </a>
                          <button
                            onClick={() => handleDelete(doc.id)}
                            className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                            title="Delete"
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
        )}
      </PortalCard>

      <PortalModal isOpen={showModal} title="Upload Academic Calendar" onClose={() => setShowModal(false)}>
        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-600 uppercase tracking-wide mb-1">Calendar Title</label>
            <input
              type="text"
              required
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="e.g. Academic Calendar UG Even Semester 2026-27"
              className="w-full border border-slate-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-primary"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-600 uppercase tracking-wide mb-1">Description (Optional)</label>
            <input
              type="text"
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="e.g. Academic Session 2026-27, Semester I"
              className="w-full border border-slate-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-primary"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-600 uppercase tracking-wide mb-1">Publish Date</label>
            <input
              type="date"
              value={publishDate}
              onChange={e => setPublishDate(e.target.value)}
              className="w-full border border-slate-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-primary"
            />
          </div>

          <AttachmentUpload
            usage="exam"
            label="Calendar PDF *"
            required
            onAttached={(record) => { setAttachmentRecord(record); setFileId(record.id) }}
            onClear={() => { setAttachmentRecord(null); setFileId(null) }}
            initialValue={attachmentRecord}
          />

          <div className="flex items-center gap-3 pt-3 border-t border-slate-100">
            <button type="button" onClick={() => setShowModal(false)}
              className="flex-1 py-2 border border-slate-200 text-slate-700 rounded font-semibold text-sm hover:bg-slate-50 transition-colors">
              Cancel
            </button>
            <button type="submit" disabled={saving}
              className="flex-1 py-2 bg-primary text-white rounded font-semibold text-sm hover:bg-primary/95 transition-colors disabled:opacity-60">
              {saving ? 'Saving…' : 'Upload Calendar'}
            </button>
          </div>
        </form>
      </PortalModal>

      {toast && <Toast message={toast} onClose={() => setToast('')} />}
    </div>
  )
}

export default ExamAcademicCalendar
