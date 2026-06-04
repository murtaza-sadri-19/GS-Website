import React, { useState, useEffect } from 'react'
import { Pencil, Trash2, Plus, X, FileText, Link2, ExternalLink, Loader2 } from 'lucide-react'
import { placementAPI } from '../../api/index'
import AttachmentUpload from '../../components/admin/AttachmentUpload'
import type { AttachmentRecord } from '../../api/index'

const RECORD_TYPES = ['NOTICE', 'COMPANY_VISIT', 'PLACEMENT_RECORD', 'TRAINING_PROGRAM'] as const
type RecordType = typeof RECORD_TYPES[number]

interface LocalRecord {
  id: string
  title: string
  record_type: RecordType
  company_name: string
  academic_year: string
  description: string
  file_id: number | null
  file_url: string
  attachment_type: 'FILE' | 'EXTERNAL_LINK' | null
  original_name: string
  status: string
  created_at: string
}

function mapFromApi(r: Record<string, unknown>): LocalRecord {
  return {
    id:              String(r.id ?? ''),
    title:           String(r.title ?? ''),
    record_type:     (r.record_type as RecordType) || 'NOTICE',
    company_name:    String(r.company_name ?? ''),
    academic_year:   String(r.academic_year ?? ''),
    description:     String(r.description ?? ''),
    file_id:         r.file_id != null ? Number(r.file_id) : null,
    file_url:        String(r.file_url ?? ''),
    attachment_type: (r.attachment_type as 'FILE' | 'EXTERNAL_LINK') || null,
    original_name:   String(r.original_name ?? ''),
    status:          String(r.status ?? 'ACTIVE'),
    created_at:      String(r.created_at ?? '').slice(0, 10),
  }
}

const EMPTY: Omit<LocalRecord, 'id' | 'created_at'> = {
  title: '',
  record_type: 'COMPANY_VISIT',
  company_name: '',
  academic_year: '',
  description: '',
  file_id: null,
  file_url: '',
  attachment_type: null,
  original_name: '',
  status: 'ACTIVE',
}

const typeColors: Record<string, string> = {
  NOTICE:            'bg-slate-100 text-slate-700',
  COMPANY_VISIT:     'bg-primary/10 text-primary',
  PLACEMENT_RECORD:  'bg-accent/15 text-accent',
  TRAINING_PROGRAM:  'bg-accent/10 text-accent',
}

const typeLabels: Record<string, string> = {
  NOTICE:            'Notice',
  COMPANY_VISIT:     'Company Visit',
  PLACEMENT_RECORD:  'Placement Record',
  TRAINING_PROGRAM:  'Training Program',
}

function Toast({ message, onClose }: { message: string; onClose: () => void }) {
  useEffect(() => { const t = setTimeout(onClose, 3000); return () => clearTimeout(t) }, [onClose])
  return (
    <div className="fixed bottom-4 right-4 z-50 bg-accent text-white px-5 py-3 rounded-lg shadow-lg flex items-center gap-3 text-sm font-medium">
      {message}<button onClick={onClose}><X size={14} /></button>
    </div>
  )
}

export default function AdminPlacement() {
  const [records, setRecords]           = useState<LocalRecord[]>([])
  const [showModal, setShowModal]       = useState(false)
  const [editItem, setEditItem]         = useState<LocalRecord | null>(null)
  const [form, setForm]                 = useState<Omit<LocalRecord, 'id' | 'created_at'>>(EMPTY)
  const [attachmentRecord, setAttachmentRecord] = useState<AttachmentRecord | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<LocalRecord | null>(null)
  const [saving, setSaving]             = useState(false)
  const [toast, setToast]               = useState('')

  const load = async () => {
    try {
      const items = await placementAPI.getRecords()
      setRecords((items as unknown as Record<string, unknown>[]).map(mapFromApi))
    } catch { setRecords([]) }
  }

  useEffect(() => { load() }, [])

  const openAdd = () => {
    setEditItem(null)
    setForm({ ...EMPTY })
    setAttachmentRecord(null)
    setShowModal(true)
  }

  const openEdit = (r: LocalRecord) => {
    setEditItem(r)
    setForm({
      title:           r.title,
      record_type:     r.record_type,
      company_name:    r.company_name,
      academic_year:   r.academic_year,
      description:     r.description,
      file_id:         r.file_id,
      file_url:        r.file_url,
      attachment_type: r.attachment_type,
      original_name:   r.original_name,
      status:          r.status,
    })
    setAttachmentRecord(
      r.file_id ? {
        id: r.file_id, attachment_type: r.attachment_type ?? 'FILE',
        original_name: r.original_name || 'Attachment', stored_name: null,
        file_url: r.file_url, external_url: r.attachment_type === 'EXTERNAL_LINK' ? r.file_url : null,
        thumbnail_url: null, alt_text: null, meta_title: null, meta_description: null,
        file_type: null, file_size: null,
        storage_type: r.attachment_type === 'EXTERNAL_LINK' ? 'EXTERNAL' : 'LOCAL',
        uploaded_by: 0, uploader_name: '', created_at: '',
      } : null
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
      title:         form.title,
      record_type:   form.record_type,
      company_name:  form.company_name || null,
      academic_year: form.academic_year || null,
      description:   form.description,
      status:        form.status,
    }
    if (form.file_id) payload.file_id = form.file_id

    try {
      if (editItem) {
        await placementAPI.updateRecord(editItem.id, payload as never)
        setToast('Record updated!')
      } else {
        await placementAPI.createRecord(payload as never)
        setToast('Record added!')
      }
      await load()
      closeModal()
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } }; message?: string })
        ?.response?.data?.message || 'Failed to save record.'
      setToast(msg)
    }
    setSaving(false)
  }

  const handleDelete = async () => {
    if (!deleteTarget) return
    try {
      await placementAPI.deleteRecord(deleteTarget.id)
      setToast('Record deleted.')
      await load()
    } catch { setToast('Failed to delete record.') }
    setDeleteTarget(null)
  }

  const f = (key: keyof Omit<LocalRecord, 'id' | 'created_at'>, val: unknown) =>
    setForm(prev => ({ ...prev, [key]: val }))

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-primary">Placement Records</h1>
          <p className="text-sm text-slate-500 mt-0.5">Manage placement notices, company visits, records, and training programs.</p>
        </div>
        <button onClick={openAdd} className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-white text-sm font-semibold rounded-lg hover:bg-primary/90 transition-colors">
          <Plus size={16} /> Add Record
        </button>
      </div>

      <div className="bg-white border border-slate-200 rounded-lg overflow-hidden shadow-sm">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="text-left px-4 py-3 font-semibold text-slate-600">Title</th>
              <th className="text-left px-4 py-3 font-semibold text-slate-600">Type</th>
              <th className="text-left px-4 py-3 font-semibold text-slate-600">Company / Year</th>
              <th className="text-left px-4 py-3 font-semibold text-slate-600">Attachment</th>
              <th className="text-left px-4 py-3 font-semibold text-slate-600">Date</th>
              <th className="text-center px-4 py-3 font-semibold text-slate-600">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {records.map(r => (
              <tr key={r.id} className="hover:bg-slate-50 transition-colors">
                <td className="px-4 py-3 max-w-xs">
                  <p className="font-medium text-slate-800 line-clamp-2">{r.title}</p>
                </td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${typeColors[r.record_type] ?? 'bg-slate-100 text-slate-700'}`}>
                    {typeLabels[r.record_type] ?? r.record_type}
                  </span>
                </td>
                <td className="px-4 py-3 text-slate-500 text-xs">
                  {r.company_name && <div className="font-medium text-slate-700">{r.company_name}</div>}
                  {r.academic_year && <div>{r.academic_year}</div>}
                </td>
                <td className="px-4 py-3">
                  {r.file_id ? (
                    <div className="flex items-center gap-1.5">
                      {r.attachment_type === 'EXTERNAL_LINK'
                        ? <Link2 size={12} className="text-primary" />
                        : <FileText size={12} className="text-accent" />
                      }
                      {r.file_url
                        ? <a href={r.file_url} target="_blank" rel="noopener noreferrer" className="text-xs text-primary hover:underline flex items-center gap-0.5 truncate max-w-[120px]">
                            {r.original_name || 'View'}<ExternalLink size={10} />
                          </a>
                        : <span className="text-xs text-slate-400">Attached</span>
                      }
                    </div>
                  ) : <span className="text-xs text-slate-300">—</span>}
                </td>
                <td className="px-4 py-3 text-slate-400 text-xs whitespace-nowrap">{r.created_at}</td>
                <td className="px-4 py-3 text-center">
                  <div className="inline-flex items-center gap-2">
                    <button onClick={() => openEdit(r)} className="p-1.5 rounded hover:bg-primary/5 text-primary transition-colors"><Pencil size={14} /></button>
                    <button onClick={() => setDeleteTarget(r)} className="p-1.5 rounded hover:bg-slate-100 text-slate-500 transition-colors"><Trash2 size={14} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {records.length === 0 && (
          <div className="text-center py-12 text-slate-400">No placement records found.</div>
        )}
      </div>

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 z-40 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 sticky top-0 bg-white z-10">
              <h2 className="font-display text-lg font-bold text-primary">
                {editItem ? 'Edit Record' : 'Add Placement Record'}
              </h2>
              <button onClick={closeModal} className="p-1.5 rounded hover:bg-slate-100 text-slate-500"><X size={18} /></button>
            </div>
            <form onSubmit={handleSave} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Title <span className="text-accent">*</span></label>
                <input required className="border border-slate-300 rounded px-3 py-2 w-full text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                  value={form.title} onChange={e => f('title', e.target.value)} placeholder="Record title" />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Record Type <span className="text-accent">*</span></label>
                <select className="border border-slate-300 rounded px-3 py-2 w-full text-sm focus:outline-none"
                  value={form.record_type} onChange={e => f('record_type', e.target.value)}>
                  {RECORD_TYPES.map(t => <option key={t} value={t}>{typeLabels[t]}</option>)}
                </select>
              </div>

              {(form.record_type === 'COMPANY_VISIT' || form.record_type === 'PLACEMENT_RECORD') && (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1">Company Name</label>
                    <input className="border border-slate-300 rounded px-3 py-2 w-full text-sm focus:outline-none"
                      value={form.company_name} onChange={e => f('company_name', e.target.value)} placeholder="e.g. Google, TCS" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1">Academic Year</label>
                    <input className="border border-slate-300 rounded px-3 py-2 w-full text-sm focus:outline-none"
                      value={form.academic_year} onChange={e => f('academic_year', e.target.value)} placeholder="e.g. 2024-25" />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Description <span className="text-accent">*</span></label>
                <textarea required rows={3} className="border border-slate-300 rounded px-3 py-2 w-full text-sm focus:outline-none resize-none"
                  value={form.description} onChange={e => f('description', e.target.value)} placeholder="Record details..." />
              </div>

              <AttachmentUpload
                usage="placement"
                label="Document Attachment (optional)"
                onAttached={handleAttached}
                onClear={handleAttachmentCleared}
                initialValue={attachmentRecord}
              />

              <div className="flex gap-3 pt-2 border-t border-slate-100">
                <button type="button" onClick={closeModal} className="flex-1 py-2 border border-slate-300 text-slate-700 rounded font-semibold text-sm hover:bg-slate-50">Cancel</button>
                <button type="submit" disabled={saving} className="flex-1 py-2 bg-primary text-white rounded font-semibold text-sm hover:bg-primary/90 disabled:opacity-60 flex items-center justify-center gap-2">
                  {saving ? <><Loader2 size={14} className="animate-spin" /> Saving…</> : editItem ? '✓ Update Record' : '+ Add Record'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {deleteTarget && (
        <div className="fixed inset-0 bg-black/50 z-40 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-sm p-6 text-center">
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3"><Trash2 size={22} className="text-primary" /></div>
            <h3 className="font-bold text-slate-800 text-lg mb-1">Delete Record?</h3>
            <p className="text-slate-500 text-sm mb-5 line-clamp-2">"{deleteTarget.title}"</p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteTarget(null)} className="flex-1 py-2 border border-slate-300 text-slate-700 rounded font-semibold text-sm hover:bg-slate-50">Cancel</button>
              <button onClick={handleDelete} className="flex-1 py-2 bg-primary text-white rounded font-semibold text-sm hover:bg-primary/90">Delete</button>
            </div>
          </div>
        </div>
      )}

      {toast && <Toast message={toast} onClose={() => setToast('')} />}
    </div>
  )
}
