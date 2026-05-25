import React, { useState, useEffect } from 'react'
import { Pencil, Trash2, Plus, X, FileText, Link2, ExternalLink, Loader2 } from 'lucide-react'
import apiClient from '../../api/client'
import AttachmentUpload from '../../components/admin/AttachmentUpload'
import type { AttachmentRecord } from '../../api/index'

interface LocalDownload {
  id: string
  title: string
  description: string
  category: string
  file_id: number | null
  file_url: string
  attachment_type: 'FILE' | 'EXTERNAL_LINK' | null
  original_name: string
  status: 'ACTIVE' | 'INACTIVE'
  created_at: string
}

function mapFromApi(d: Record<string, unknown>): LocalDownload {
  return {
    id:              String(d.id ?? ''),
    title:           String(d.title ?? ''),
    description:     String(d.description ?? ''),
    category:        String(d.category ?? 'General'),
    file_id:         d.file_id != null ? Number(d.file_id) : null,
    file_url:        String(d.file_url ?? ''),
    attachment_type: (d.attachment_type as 'FILE' | 'EXTERNAL_LINK') || null,
    original_name:   String(d.original_name ?? ''),
    status:          (d.status as 'ACTIVE' | 'INACTIVE') ?? 'ACTIVE',
    created_at:      String(d.created_at ?? '').slice(0, 10),
  }
}

const CATEGORIES = ['Forms', 'Ordinances', 'Brochures', 'Syllabus', 'Circulars', 'Results', 'General']

const EMPTY: Omit<LocalDownload, 'id' | 'created_at'> = {
  title:           '',
  description:     '',
  category:        'General',
  file_id:         null,
  file_url:        '',
  attachment_type: null,
  original_name:   '',
  status:          'ACTIVE',
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

const AdminDownloads: React.FC = () => {
  const [downloads, setDownloads]       = useState<LocalDownload[]>([])
  const [isOpen, setIsOpen]             = useState(false)
  const [editing, setEditing]           = useState<LocalDownload | null>(null)
  const [form, setForm]                 = useState<Omit<LocalDownload, 'id' | 'created_at'>>(EMPTY)
  const [attachmentRecord, setAttachmentRecord] = useState<AttachmentRecord | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<LocalDownload | null>(null)
  const [saving, setSaving]             = useState(false)
  const [toast, setToast]               = useState('')

  const load = async () => {
    try {
      const res = await apiClient.get('/v1/downloads', { params: { pageSize: 100 } })
      const items: unknown[] = res.data?.data?.downloads ?? res.data?.data ?? []
      setDownloads(Array.isArray(items) ? items.map(i => mapFromApi(i as Record<string, unknown>)) : [])
    } catch {
      setDownloads([])
    }
  }

  useEffect(() => { load() }, [])

  const handleAdd = () => {
    setEditing(null)
    setForm(EMPTY)
    setAttachmentRecord(null)
    setIsOpen(true)
  }

  const handleEdit = (dl: LocalDownload) => {
    setEditing(dl)
    setForm({
      title:           dl.title,
      description:     dl.description,
      category:        dl.category,
      file_id:         dl.file_id,
      file_url:        dl.file_url,
      attachment_type: dl.attachment_type,
      original_name:   dl.original_name,
      status:          dl.status,
    })
    setAttachmentRecord(
      dl.file_id
        ? {
            id:               dl.file_id,
            attachment_type:  dl.attachment_type ?? 'FILE',
            original_name:    dl.original_name || 'Attached File',
            stored_name:      null,
            file_url:         dl.file_url,
            external_url:     dl.attachment_type === 'EXTERNAL_LINK' ? dl.file_url : null,
            thumbnail_url:    null,
            alt_text:         null,
            meta_title:       null,
            meta_description: null,
            file_type:        null,
            file_size:        null,
            storage_type:     dl.attachment_type === 'EXTERNAL_LINK' ? 'EXTERNAL' : 'LOCAL',
            uploaded_by:      0,
            uploader_name:    '',
            created_at:       '',
          }
        : null
    )
    setIsOpen(true)
  }

  const handleDelete = async () => {
    if (!deleteTarget) return
    try {
      await apiClient.delete(`/v1/downloads/${deleteTarget.id}`)
      setToast('Download deleted.')
      await load()
    } catch {
      setToast('Failed to delete.')
    }
    setDeleteTarget(null)
  }

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
    if (!form.file_id) {
      setToast('Please attach a file or external link.')
      return
    }
    setSaving(true)
    const payload = {
      title:       form.title,
      description: form.description,
      category:    form.category,
      file_id:     form.file_id,
      status:      form.status,
    }
    try {
      if (editing) {
        await apiClient.put(`/v1/downloads/${editing.id}`, payload)
        setToast('Download updated!')
      } else {
        await apiClient.post('/v1/downloads', payload)
        setToast('Download added!')
      }
      await load()
      setIsOpen(false)
    } catch {
      setToast('Failed to save. Please try again.')
    }
    setSaving(false)
  }

  return (
    <>
      {/* Header */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-display text-2xl font-bold text-primary">Downloads Management</h1>
            <p className="text-sm text-slate-500 mt-0.5">Upload documents or attach external links for public download</p>
          </div>
          <button
            onClick={handleAdd}
            className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-white text-sm font-semibold rounded-lg hover:bg-primary/90 transition-colors"
          >
            <Plus size={16} /> Add Download
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
                <th className="text-left px-4 py-3 font-semibold text-slate-600">Status</th>
                <th className="text-center px-4 py-3 font-semibold text-slate-600">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {downloads.map(dl => (
                <tr key={dl.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-4 py-3">
                    <p className="font-medium text-slate-800 line-clamp-1">{dl.title}</p>
                    {dl.description && <p className="text-xs text-slate-400 mt-0.5 line-clamp-1">{dl.description}</p>}
                  </td>
                  <td className="px-4 py-3 text-slate-600 text-xs">{dl.category}</td>
                  <td className="px-4 py-3">
                    {dl.file_id ? (
                      <div className="flex items-center gap-1.5">
                        {dl.attachment_type === 'EXTERNAL_LINK'
                          ? <Link2 size={12} className="text-[#0b2545]" />
                          : <FileText size={12} className="text-[#bfa15f]" />
                        }
                        <a
                          href={dl.file_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-[#0b2545] hover:underline flex items-center gap-0.5 truncate max-w-[180px]"
                        >
                          {dl.original_name || 'View'}
                          <ExternalLink size={10} />
                        </a>
                      </div>
                    ) : (
                      <span className="text-xs text-red-400 font-medium">No attachment</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded border uppercase tracking-wide ${
                      dl.status === 'ACTIVE'
                        ? 'bg-[#bfa15f]/10 text-[#bfa15f] border-[#bfa15f]/30'
                        : 'bg-slate-50 text-slate-500 border-slate-200'
                    }`}>
                      {dl.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <div className="inline-flex items-center gap-2">
                      <button
                        onClick={() => handleEdit(dl)}
                        className="p-1.5 rounded hover:bg-[#0b2545]/5 text-[#0b2545] transition-colors"
                        title="Edit"
                      >
                        <Pencil size={14} />
                      </button>
                      <button
                        onClick={() => setDeleteTarget(dl)}
                        className="p-1.5 rounded hover:bg-slate-100 text-slate-500 transition-colors"
                        title="Delete"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {downloads.length === 0 && (
            <div className="text-center py-12 text-slate-400">No downloads found. Add one to get started.</div>
          )}
        </div>
      </div>

      {/* Add/Edit Modal */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 sticky top-0 bg-white z-10">
              <h2 className="font-display text-lg font-bold text-primary">
                {editing ? `Edit Download` : 'Add Download'}
              </h2>
              <button onClick={() => setIsOpen(false)} className="p-1.5 rounded hover:bg-slate-100 text-slate-500">
                <X size={18} />
              </button>
            </div>
            <form onSubmit={handleSave} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">
                  Document Title <span className="text-[#bfa15f]">*</span>
                </label>
                <input
                  required
                  value={form.title}
                  onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                  placeholder="e.g. UG Syllabus 2026"
                  className="border border-slate-300 rounded px-3 py-2 w-full text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Description</label>
                <input
                  value={form.description}
                  onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                  placeholder="Brief description (optional)"
                  className="border border-slate-300 rounded px-3 py-2 w-full text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Category</label>
                  <select
                    value={form.category}
                    onChange={e => setForm(f => ({ ...f, category: e.target.value }))}
                    className="border border-slate-300 rounded px-3 py-2 w-full text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                  >
                    {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Status</label>
                  <select
                    value={form.status}
                    onChange={e => setForm(f => ({ ...f, status: e.target.value as 'ACTIVE' | 'INACTIVE' }))}
                    className="border border-slate-300 rounded px-3 py-2 w-full text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                  >
                    <option value="ACTIVE">Active</option>
                    <option value="INACTIVE">Inactive</option>
                  </select>
                </div>
              </div>

              {/* Dual attachment upload */}
              <AttachmentUpload
                usage="downloads"
                label="Document File *"
                required
                onAttached={handleAttached}
                onClear={handleAttachmentCleared}
                initialValue={attachmentRecord}
              />

              <div className="flex gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="flex-1 py-2 border border-slate-200 text-slate-700 rounded font-semibold text-sm hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 py-2 bg-primary text-white rounded font-semibold text-sm hover:bg-primary/90 disabled:opacity-60 flex items-center justify-center gap-2"
                >
                  {saving ? <><Loader2 size={14} className="animate-spin" /> Saving…</> : editing ? 'Update Document' : 'Add Document'}
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
            <h3 className="font-bold text-slate-800 text-lg mb-1">Delete Download?</h3>
            <p className="text-slate-500 text-sm mb-5">"{deleteTarget.title}"</p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteTarget(null)} className="flex-1 py-2 border border-slate-300 text-slate-700 rounded font-semibold text-sm hover:bg-slate-50">Cancel</button>
              <button onClick={handleDelete} className="flex-1 py-2 bg-[#0b2545] text-white rounded font-semibold text-sm hover:bg-[#0b2545]/90">Delete</button>
            </div>
          </div>
        </div>
      )}

      {toast && <Toast message={toast} onClose={() => setToast('')} />}
    </>
  )
}

export default AdminDownloads
