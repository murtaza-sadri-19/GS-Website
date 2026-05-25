import React, { useState, useEffect } from 'react'
import { PageHeader, PortalCard, PortalModal, Badge } from '../../components/layout/PortalLayout'

import apiClient from '../../api/client'
import AttachmentUpload from '../../components/admin/AttachmentUpload'
import type { AttachmentRecord } from '../../api/index'
import { Plus, Search, Edit2, Trash2, Globe, Link2, X } from 'lucide-react'

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

const ExamNotices: React.FC = () => {
  const [notices, setNotices] = useState<Notice[]>([])
  const [search, setSearch] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [editNotice, setEditNotice] = useState<Notice | null>(null)
  const [toast, setToast] = useState('')

  // Form State
  const [title, setTitle] = useState('')
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10))
  const [fileId, setFileId] = useState<number | null>(null)
  const [fileUrl, setFileUrl] = useState('')
  const [attachmentRecord, setAttachmentRecord] = useState<AttachmentRecord | null>(null)
  const [highlight, setHighlight] = useState(false)

  const loadNotices = () => {
    // Exam controller focuses on EXAM type notices
    apiClient.get('/v1/notices', { params: { notice_type: 'EXAM', pageSize: 100 } })
      .then(res => {
        const list = res.data?.data?.notices ?? res.data?.data ?? []
        setNotices(list.map((n: any) => ({
          id:       String(n.id),
          title:    n.title,
          category: 'exam',
          date:     n.publish_date || n.created_at || '',
          fileUrl:  n.file_url,
          highlight: false,
        })))
      })
      .catch(() => setNotices([]))
  }

  useEffect(() => {
    loadNotices()
  }, [])

  const handleOpenAdd = () => {
    setEditNotice(null)
    setTitle('')
    setDate(new Date().toISOString().slice(0, 10))
    setFileId(null)
    setFileUrl('')
    setAttachmentRecord(null)
    setHighlight(false)
    setShowModal(true)
  }

  const handleOpenEdit = (notice: any) => {
    setEditNotice(notice)
    setTitle(notice.title)
    setDate(notice.date)
    setFileId(notice.file_id ?? null)
    setFileUrl(notice.fileUrl || '')
    setAttachmentRecord(
      notice.file_id ? {
        id: notice.file_id, attachment_type: notice.attachment_type ?? 'FILE',
        original_name: notice.original_name || 'Attachment', stored_name: null,
        file_url: notice.fileUrl || '', external_url: notice.attachment_type === 'EXTERNAL_LINK' ? notice.fileUrl : null,
        thumbnail_url: null, alt_text: null, meta_title: null, meta_description: null,
        file_type: null, file_size: null,
        storage_type: notice.attachment_type === 'EXTERNAL_LINK' ? 'EXTERNAL' : 'LOCAL',
        uploaded_by: 0, uploader_name: '', created_at: '',
      } : null
    )
    setHighlight(notice.highlight)
    setShowModal(true)
  }

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault()
    if (!title) return

    const payload: Record<string, unknown> = {
      title,
      notice_type: 'EXAM',
      publish_date: date,
      status: 'PUBLISHED',
    }
    if (fileId) payload.file_id = fileId

    if (editNotice) {
      apiClient.put(`/v1/notices/${editNotice.id}`, payload)
      setToast('Notice updated successfully.')
    } else {
      apiClient.post('/v1/notices', payload)
      setToast('Notice published successfully.')
    }
    loadNotices()
    setShowModal(false)
  }

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this notice?')) {
      apiClient.delete(`/v1/notices/${id}`).then(() => loadNotices())
      setToast('Notice deleted successfully.')
      loadNotices()
    }
  }

  const filteredNotices = notices.filter(n =>
    n.title.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="space-y-5">
      <PageHeader
        title="Exam Notices"
        subtitle="Publish and manage notifications, schedules, and official notices for examinations"
        action={
          <button
            onClick={handleOpenAdd}
            className="bg-primary hover:bg-primary/95 text-white text-sm font-semibold px-4 py-2 rounded-lg flex items-center gap-2 transition-colors shadow-sm"
          >
            <Plus size={15} />
            <span>Publish Notice</span>
          </button>
        }
      />

      <div className="flex items-center gap-3 bg-white p-3 border border-slate-200 rounded-xl shadow-sm">
        <Search className="text-slate-400 shrink-0" size={18} />
        <input
          type="text"
          placeholder="Search notices by title..."
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
                <th className="text-left px-4 py-3 text-[11px] font-bold text-slate-500 uppercase tracking-wider">Title</th>
                <th className="text-left px-4 py-3 text-[11px] font-bold text-slate-500 uppercase tracking-wider">Date</th>
                <th className="text-center px-4 py-3 text-[11px] font-bold text-slate-500 uppercase tracking-wider">Attachment</th>
                <th className="text-center px-4 py-3 text-[11px] font-bold text-slate-500 uppercase tracking-wider">Highlight</th>
                <th className="text-center px-4 py-3 text-[11px] font-bold text-slate-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredNotices.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-8 text-slate-400 text-xs">
                    No exam notices found. Publish one to get started.
                  </td>
                </tr>
              ) : (
                filteredNotices.map(notice => (
                  <tr key={notice.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-4 py-3 text-slate-800 font-medium max-w-md">
                      <p className="line-clamp-2">{notice.title}</p>
                    </td>
                    <td className="px-4 py-3 text-slate-500 text-xs font-semibold whitespace-nowrap">
                      {notice.date}
                    </td>
                    <td className="px-4 py-3 text-center">
                      {notice.fileUrl ? (
                        <a
                          href={notice.fileUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline"
                        >
                          {notice.attachment_type === 'EXTERNAL_LINK'
                            ? <Link2 size={12} />
                            : <Globe size={12} />
                          }
                          <span>{notice.attachment_type === 'EXTERNAL_LINK' ? 'Link' : 'View PDF'}</span>
                        </a>
                      ) : (
                        <span className="text-slate-300 text-xs">—</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-center">
                      {notice.highlight ? (
                        <Badge label="HIGH" variant="warning" />
                      ) : (
                        <Badge label="NORMAL" variant="default" />
                      )}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          onClick={() => handleOpenEdit(notice)}
                          className="p-1.5 text-slate-500 hover:text-primary hover:bg-slate-100 rounded transition-colors"
                          title="Edit Notice"
                        >
                          <Edit2 size={13} />
                        </button>
                        <button
                          onClick={() => handleDelete(notice.id)}
                          className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                          title="Delete Notice"
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

      {/* Add / Edit Modal */}
      <PortalModal
        isOpen={showModal}
        title={editNotice ? 'Edit Notice Details' : 'Publish New Notice'}
        onClose={() => setShowModal(false)}
      >
        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-600 uppercase tracking-wide mb-1">
              Notice Title
            </label>
            <textarea
              required
              rows={3}
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="e.g. End Semester Exam Timetable for BE Nov-Dec 2026"
              className="w-full border border-slate-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-primary resize-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-600 uppercase tracking-wide mb-1">
                Category
              </label>
              <input
                type="text"
                disabled
                value="Exam"
                className="w-full border border-slate-200 rounded px-3 py-2 text-sm bg-slate-50 text-slate-500 cursor-not-allowed font-semibold"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-600 uppercase tracking-wide mb-1">
                Publish Date
              </label>
              <input
                type="date"
                required
                value={date}
                onChange={e => setDate(e.target.value)}
                className="w-full border border-slate-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-primary"
              />
            </div>
          </div>

          <AttachmentUpload
            usage="exam"
            label="File Attachment (optional)"
            onAttached={(record) => {
              setAttachmentRecord(record)
              setFileId(record.id)
              setFileUrl(record.file_url)
            }}
            onClear={() => {
              setAttachmentRecord(null)
              setFileId(null)
              setFileUrl('')
            }}
            initialValue={attachmentRecord}
          />

          <label className="flex items-center gap-2 cursor-pointer pt-1">
            <input
              type="checkbox"
              checked={highlight}
              onChange={e => setHighlight(e.target.checked)}
              className="w-4 h-4 accent-primary rounded"
            />
            <span className="text-sm font-semibold text-slate-700 select-none">
              Highlight on home page notices feed
            </span>
          </label>

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
              {editNotice ? 'Save Changes' : 'Publish Notice'}
            </button>
          </div>
        </form>
      </PortalModal>

      {toast && <Toast message={toast} onClose={() => setToast('')} />}
    </div>
  )
}

export default ExamNotices
