import React, { useState, useEffect } from 'react'
import { Pencil, Trash2, Plus, X, Star, FileText, Link2, ExternalLink } from 'lucide-react'
import apiClient from '../../api/client'
import AttachmentUpload from '../../components/admin/AttachmentUpload'
import type { AttachmentRecord } from '../../api/index'

// ── Local shape used by the UI form ────────────────────────────────────────
interface LocalNotice {
  id: string
  title: string
  category: string
  date: string
  highlight: boolean
  file_id: number | null
  // denormalised for display only:
  file_url: string
  attachment_type: 'FILE' | 'EXTERNAL_LINK' | null
  original_name: string
}

function mapFromApi(n: Record<string, unknown>): LocalNotice {
  return {
    id:              String(n.id ?? ''),
    title:           String(n.title ?? ''),
    category:        String(n.notice_type ?? n.category ?? 'GENERAL').toLowerCase(),
    date:            String(n.publish_date ?? n.published_at ?? '').slice(0, 10) ||
                     new Date().toISOString().slice(0, 10),
    highlight:       n.status === 'PUBLISHED',
    file_id:         n.file_id != null ? Number(n.file_id) : null,
    file_url:        String(n.file_url ?? n.attachment_url ?? ''),
    attachment_type: (n.attachment_type as 'FILE' | 'EXTERNAL_LINK') || null,
    original_name:   String(n.original_name ?? n.file_name ?? ''),
  }
}

const NOTICE_CATEGORIES = [
  { value: 'GENERAL',    label: 'General' },
  { value: 'DEPARTMENT', label: 'Department' },
  { value: 'EXAM',       label: 'Exam' },
  { value: 'PLACEMENT',  label: 'Placement' },
]

const EMPTY: Omit<LocalNotice, 'id'> = {
  title:           '',
  category:        'GENERAL',
  date:            new Date().toISOString().slice(0, 10),
  highlight:       false,
  file_id:         null,
  file_url:        '',
  attachment_type: null,
  original_name:   '',
}

const catColor: Record<string, string> = {
  general:    'bg-slate-100 text-slate-700',
  department: 'bg-[#0b2545]/10 text-[#0b2545]',
  exam:       'bg-[#bfa15f]/15 text-[#bfa15f]',
  placement:  'bg-[#bfa15f]/20 text-[#bfa15f]',
}

function Toast({ message, onClose }: { message: string; onClose: () => void }) {
  useEffect(() => {
    const t = setTimeout(onClose, 3000)
    return () => clearTimeout(t)
  }, [onClose])
  return (
    <div className="fixed bottom-4 right-4 z-50 bg-[#bfa15f] text-white px-5 py-3 rounded-lg shadow-lg flex items-center gap-3 text-sm font-medium">
      {message}
      <button onClick={onClose}><X size={14} /></button>
    </div>
  )
}

export default function AdminNotices() {
  const [notices, setNotices]         = useState<LocalNotice[]>([])
  const [showModal, setShowModal]     = useState(false)
  const [editItem, setEditItem]       = useState<LocalNotice | null>(null)
  const [form, setForm]               = useState<Omit<LocalNotice, 'id'>>(EMPTY)
  const [deleteTarget, setDeleteTarget] = useState<LocalNotice | null>(null)
  const [toast, setToast]             = useState('')
  const [saving, setSaving]           = useState(false)
  // Track the AttachmentRecord so we can pass it back to the component in edit mode
  const [attachmentRecord, setAttachmentRecord] = useState<AttachmentRecord | null>(null)

  const load = async () => {
    try {
      const res = await apiClient.get('/v1/notices', { params: { pageSize: 100 } })
      const items: unknown[] = res.data?.data?.notices ?? res.data?.data ?? []
      setNotices(Array.isArray(items) ? items.map(i => mapFromApi(i as Record<string, unknown>)) : [])
    } catch {
      setNotices([])
    }
  }

  useEffect(() => { load() }, [])

  const showToast = (msg: string) => setToast(msg)

  const openAdd = () => {
    setEditItem(null)
    setForm(EMPTY)
    setAttachmentRecord(null)
    setShowModal(true)
  }

  const openEdit = (n: LocalNotice) => {
    setEditItem(n)
    setForm({
      title:           n.title,
      category:        n.category.toUpperCase(),
      date:            n.date,
      highlight:       n.highlight,
      file_id:         n.file_id,
      file_url:        n.file_url,
      attachment_type: n.attachment_type,
      original_name:   n.original_name,
    })
    // Reconstruct a minimal AttachmentRecord for the upload component to show current state
    setAttachmentRecord(
      n.file_id
        ? {
            id:              n.file_id,
            attachment_type: n.attachment_type ?? 'FILE',
            original_name:   n.original_name || 'Attached File',
            stored_name:     null,
            file_url:        n.file_url,
            external_url:    n.attachment_type === 'EXTERNAL_LINK' ? n.file_url : null,
            thumbnail_url:   null,
            alt_text:        null,
            meta_title:      null,
            meta_description: null,
            file_type:       null,
            file_size:       null,
            storage_type:    n.attachment_type === 'EXTERNAL_LINK' ? 'EXTERNAL' : 'LOCAL',
            uploaded_by:     0,
            uploader_name:   '',
            created_at:      '',
          }
        : null
    )
    setShowModal(true)
  }

  const closeModal = () => { setShowModal(false); setEditItem(null); setAttachmentRecord(null) }

  const handleAttached = (record: AttachmentRecord) => {
    setAttachmentRecord(record)
    setForm(f => ({
      ...f,
      file_id:         record.id,
      file_url:        record.file_url,
      attachment_type: record.attachment_type,
      original_name:   record.original_name,
    }))
  }

  const handleAttachmentCleared = () => {
    setAttachmentRecord(null)
    setForm(f => ({ ...f, file_id: null, file_url: '', attachment_type: null, original_name: '' }))
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    const payload: Record<string, unknown> = {
      title:        form.title,
      description:  form.title,
      notice_type:  form.category.toUpperCase(),
      status:       form.highlight ? 'PUBLISHED' : 'DRAFT',
      publish_date: form.date,
    }
    if (form.file_id) payload.file_id = form.file_id

    try {
      if (editItem) {
        await apiClient.put(`/v1/notices/${editItem.id}`, payload)
        showToast('Notice updated successfully!')
      } else {
        await apiClient.post('/v1/notices', payload)
        showToast('Notice added successfully!')
      }
      await load()
    } catch {
      showToast('Failed to save notice. Please try again.')
    }
    setSaving(false)
    closeModal()
  }

  const handleDelete = async () => {
    if (!deleteTarget) return
    try {
      await apiClient.delete(`/v1/notices/${deleteTarget.id}`)
      showToast('Notice deleted.')
      await load()
    } catch {
      showToast('Failed to delete notice.')
    }
    setDeleteTarget(null)
  }

  const f = (key: keyof Omit<LocalNotice, 'id'>, val: unknown) =>
    setForm(prev => ({ ...prev, [key]: val }))

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-primary">Notices Management</h1>
          <p className="text-sm text-slate-500 mt-0.5">Add, edit and manage official notices. Attach uploaded files or external links.</p>
        </div>
        <button onClick={openAdd} className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-white text-sm font-semibold rounded-lg hover:bg-primary/90 transition-colors">
          <Plus size={16} /> Add New Notice
        </button>
      </div>

      {/* Table */}
      <div className="bg-white border border-slate-200 rounded-lg overflow-hidden shadow-sm">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="text-left px-4 py-3 font-semibold text-slate-600">Title</th>
              <th className="text-left px-4 py-3 font-semibold text-slate-600">Category</th>
              <th className="text-left px-4 py-3 font-semibold text-slate-600">Attachment</th>
              <th className="text-left px-4 py-3 font-semibold text-slate-600">Date</th>
              <th className="text-center px-4 py-3 font-semibold text-slate-600">Published</th>
              <th className="text-center px-4 py-3 font-semibold text-slate-600">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {notices.map(n => (
              <tr key={n.id} className="hover:bg-slate-50 transition-colors">
                <td className="px-4 py-3 max-w-xs">
                  <p className="font-medium text-slate-800 line-clamp-2">{n.title}</p>
                </td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium capitalize ${catColor[n.category] ?? 'bg-slate-100 text-slate-700'}`}>
                    {n.category}
                  </span>
                </td>
                <td className="px-4 py-3">
                  {n.file_id ? (
                    <div className="flex items-center gap-1.5">
                      {n.attachment_type === 'EXTERNAL_LINK'
                        ? <Link2 size={12} className="text-[#0b2545]" />
                        : <FileText size={12} className="text-[#bfa15f]" />
                      }
                      {n.file_url
                        ? <a href={n.file_url} target="_blank" rel="noopener noreferrer" className="text-xs text-[#0b2545] hover:underline flex items-center gap-0.5 truncate max-w-[140px]">
                            {n.original_name || (n.attachment_type === 'EXTERNAL_LINK' ? 'Link' : 'File')}
                            <ExternalLink size={10} />
                          </a>
                        : <span className="text-xs text-slate-400">Attached</span>
                      }
                    </div>
                  ) : (
                    <span className="text-xs text-slate-300">—</span>
                  )}
                </td>
                <td className="px-4 py-3 text-slate-500 text-xs whitespace-nowrap">{n.date}</td>
                <td className="px-4 py-3 text-center">
                  {n.highlight ? <Star size={16} className="text-[#bfa15f] inline fill-[#bfa15f]" /> : <span className="text-slate-300">—</span>}
                </td>
                <td className="px-4 py-3 text-center">
                  <div className="inline-flex items-center gap-2">
                    <button onClick={() => openEdit(n)} className="p-1.5 rounded hover:bg-[#0b2545]/5 text-[#0b2545] transition-colors" title="Edit">
                      <Pencil size={14} />
                    </button>
                    <button onClick={() => setDeleteTarget(n)} className="p-1.5 rounded hover:bg-slate-100 text-slate-500 transition-colors" title="Delete">
                      <Trash2 size={14} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {notices.length === 0 && (
          <div className="text-center py-12 text-slate-400">No notices found. Add one to get started.</div>
        )}
      </div>

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 z-40 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 sticky top-0 bg-white z-10">
              <h2 className="font-display text-lg font-bold text-primary">
                {editItem ? 'Edit Notice' : 'Add New Notice'}
              </h2>
              <button onClick={closeModal} className="p-1.5 rounded hover:bg-slate-100 text-slate-500">
                <X size={18} />
              </button>
            </div>
            <form onSubmit={handleSave} className="p-6 space-y-4">
              {/* Title */}
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">
                  Title <span className="text-[#bfa15f]">*</span>
                </label>
                <input
                  required
                  className="border border-slate-300 rounded px-3 py-2 w-full text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                  value={form.title}
                  onChange={e => f('title', e.target.value)}
                  placeholder="Notice title"
                />
              </div>

              {/* Category + Date */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">
                    Category <span className="text-[#bfa15f]">*</span>
                  </label>
                  <select
                    className="border border-slate-300 rounded px-3 py-2 w-full text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                    value={form.category}
                    onChange={e => f('category', e.target.value)}
                  >
                    {NOTICE_CATEGORIES.map(c => (
                      <option key={c.value} value={c.value}>{c.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">
                    Publish Date <span className="text-[#bfa15f]">*</span>
                  </label>
                  <input
                    type="date"
                    required
                    className="border border-slate-300 rounded px-3 py-2 w-full text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                    value={form.date}
                    onChange={e => f('date', e.target.value)}
                  />
                </div>
              </div>

              {/* Attachment — dual upload component */}
              <AttachmentUpload
                usage="notices"
                label="Attachment (optional)"
                onAttached={handleAttached}
                onClear={handleAttachmentCleared}
                initialValue={attachmentRecord}
              />

              {/* Published toggle */}
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.highlight}
                  onChange={e => f('highlight', e.target.checked)}
                  className="w-4 h-4 accent-[#bfa15f]"
                />
                <span className="text-sm font-medium text-slate-700">Mark as Published</span>
              </label>

              {/* Buttons */}
              <div className="flex gap-3 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={closeModal}
                  className="flex-1 py-2 border border-slate-300 text-slate-700 rounded font-semibold text-sm hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 py-2 bg-primary text-white rounded font-semibold text-sm hover:bg-primary/90 disabled:opacity-60"
                >
                  {saving ? 'Saving…' : editItem ? '✓ Update Notice' : '+ Add Notice'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirm */}
      {deleteTarget && (
        <div className="fixed inset-0 bg-black/50 z-40 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-sm p-6 text-center">
            <div className="w-12 h-12 bg-[#0b2545]/10 rounded-full flex items-center justify-center mx-auto mb-3">
              <Trash2 size={22} className="text-[#0b2545]" />
            </div>
            <h3 className="font-bold text-slate-800 text-lg mb-1">Delete Notice?</h3>
            <p className="text-slate-500 text-sm mb-5 line-clamp-2">"{deleteTarget.title}"</p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteTarget(null)}
                className="flex-1 py-2 border border-slate-300 text-slate-700 rounded font-semibold text-sm hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="flex-1 py-2 bg-[#0b2545] text-white rounded font-semibold text-sm hover:bg-[#0b2545]/90"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {toast && <Toast message={toast} onClose={() => setToast('')} />}
    </div>
  )
}
