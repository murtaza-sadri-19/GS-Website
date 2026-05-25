import React, { useState, useEffect } from 'react'
import { Pencil, Trash2, Plus, X, FileText, Link2, ExternalLink, Loader2 } from 'lucide-react'
import apiClient from '../../api/client'
import AttachmentUpload from '../../components/admin/AttachmentUpload'
import type { AttachmentRecord } from '../../api/index'

interface LocalTender {
  id: string
  title: string
  refNo: string
  publishDate: string
  dueDate: string
  status: 'Open' | 'Closed' | 'Extended'
  amount: string
  file_id: number | null
  file_url: string
  attachment_type: 'FILE' | 'EXTERNAL_LINK' | null
  original_name: string
}

function mapFromApi(t: Record<string, unknown>): LocalTender {
  return {
    id:              String(t.id ?? ''),
    title:           String(t.title ?? ''),
    refNo:           String(t.ref_no ?? t.refNo ?? ''),
    publishDate:     String(t.publish_date ?? t.publishDate ?? '').slice(0, 10),
    dueDate:         String(t.due_date ?? t.dueDate ?? '').slice(0, 10),
    status:          (t.status as 'Open' | 'Closed' | 'Extended') ?? 'Open',
    amount:          String(t.amount ?? ''),
    file_id:         t.file_id != null ? Number(t.file_id) : null,
    file_url:        String(t.file_url ?? ''),
    attachment_type: (t.attachment_type as 'FILE' | 'EXTERNAL_LINK') || null,
    original_name:   String(t.original_name ?? ''),
  }
}

const STATUSES: LocalTender['status'][] = ['Open', 'Closed', 'Extended']

const EMPTY: Omit<LocalTender, 'id'> = {
  title: '', refNo: '',
  publishDate: new Date().toISOString().slice(0, 10),
  dueDate: '', status: 'Open', amount: '',
  file_id: null, file_url: '', attachment_type: null, original_name: '',
}

const statusColor: Record<string, string> = {
  Open:     'bg-[#bfa15f]/15 text-[#bfa15f]',
  Closed:   'bg-slate-100 text-slate-600',
  Extended: 'bg-[#0b2545]/10 text-[#0b2545]',
}

function Toast({ message, onClose }: { message: string; onClose: () => void }) {
  useEffect(() => { const t = setTimeout(onClose, 3000); return () => clearTimeout(t) }, [onClose])
  return (
    <div className="fixed bottom-4 right-4 z-50 bg-[#bfa15f] text-white px-5 py-3 rounded-lg shadow-lg flex items-center gap-3 text-sm font-medium">
      {message}<button onClick={onClose}><X size={14} /></button>
    </div>
  )
}

export default function AdminTenders() {
  const [tenders, setTenders]           = useState<LocalTender[]>([])
  const [showModal, setShowModal]       = useState(false)
  const [editItem, setEditItem]         = useState<LocalTender | null>(null)
  const [form, setForm]                 = useState<Omit<LocalTender, 'id'>>(EMPTY)
  const [attachmentRecord, setAttachmentRecord] = useState<AttachmentRecord | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<LocalTender | null>(null)
  const [saving, setSaving]             = useState(false)
  const [toast, setToast]               = useState('')

  const load = async () => {
    try {
      const res = await apiClient.get('/v1/tenders', { params: { pageSize: 100 } })
      const items: unknown[] = res.data?.data?.tenders ?? res.data?.data ?? []
      setTenders(Array.isArray(items) ? items.map(i => mapFromApi(i as Record<string, unknown>)) : [])
    } catch {
      setTenders([])
    }
  }

  useEffect(() => { load() }, [])

  const openAdd = () => { setEditItem(null); setForm(EMPTY); setAttachmentRecord(null); setShowModal(true) }

  const openEdit = (t: LocalTender) => {
    setEditItem(t)
    setForm({ title: t.title, refNo: t.refNo, publishDate: t.publishDate, dueDate: t.dueDate,
      status: t.status, amount: t.amount, file_id: t.file_id, file_url: t.file_url,
      attachment_type: t.attachment_type, original_name: t.original_name })
    setAttachmentRecord(
      t.file_id ? {
        id: t.file_id, attachment_type: t.attachment_type ?? 'FILE',
        original_name: t.original_name || 'Document', stored_name: null,
        file_url: t.file_url, external_url: t.attachment_type === 'EXTERNAL_LINK' ? t.file_url : null,
        thumbnail_url: null, alt_text: null, meta_title: null, meta_description: null,
        file_type: null, file_size: null,
        storage_type: t.attachment_type === 'EXTERNAL_LINK' ? 'EXTERNAL' : 'LOCAL',
        uploaded_by: 0, uploader_name: '', created_at: '',
      } : null
    )
    setShowModal(true)
  }

  const closeModal = () => { setShowModal(false); setEditItem(null); setAttachmentRecord(null) }

  const handleAttached = (record: AttachmentRecord) => {
    setAttachmentRecord(record)
    setForm(f => ({ ...f, file_id: record.id, file_url: record.file_url, attachment_type: record.attachment_type, original_name: record.original_name }))
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
      ref_no:       form.refNo,
      publish_date: form.publishDate,
      due_date:     form.dueDate,
      status:       form.status,
      amount:       form.amount || null,
    }
    if (form.file_id) payload.file_id = form.file_id
    try {
      if (editItem) {
        await apiClient.put(`/v1/tenders/${editItem.id}`, payload)
        setToast('Tender updated!')
      } else {
        await apiClient.post('/v1/tenders', payload)
        setToast('Tender added!')
      }
      await load()
      closeModal()
    } catch {
      setToast('Failed to save. Please try again.')
    }
    setSaving(false)
  }

  const handleDelete = async () => {
    if (!deleteTarget) return
    try {
      await apiClient.delete(`/v1/tenders/${deleteTarget.id}`)
      setToast('Tender deleted.')
      await load()
    } catch {
      setToast('Failed to delete.')
    }
    setDeleteTarget(null)
  }

  const f = (key: keyof Omit<LocalTender, 'id'>, val: string) =>
    setForm(prev => ({ ...prev, [key]: val }))

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-primary">Tenders Management</h1>
          <p className="text-sm text-slate-500 mt-0.5">Manage procurement tenders — upload documents or attach external links</p>
        </div>
        <button onClick={openAdd} className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-white text-sm font-semibold rounded-lg hover:bg-primary/90 transition-colors">
          <Plus size={16} /> Add Tender
        </button>
      </div>

      <div className="bg-white border border-slate-200 rounded-lg overflow-hidden shadow-sm">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="text-left px-4 py-3 font-semibold text-slate-600">Title / Ref No.</th>
              <th className="text-left px-4 py-3 font-semibold text-slate-600">Publish Date</th>
              <th className="text-left px-4 py-3 font-semibold text-slate-600">Due Date</th>
              <th className="text-left px-4 py-3 font-semibold text-slate-600">Status</th>
              <th className="text-left px-4 py-3 font-semibold text-slate-600">Attachment</th>
              <th className="text-center px-4 py-3 font-semibold text-slate-600">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {tenders.map(t => (
              <tr key={t.id} className="hover:bg-slate-50 transition-colors">
                <td className="px-4 py-3 max-w-xs">
                  <p className="font-medium text-slate-800 line-clamp-2">{t.title}</p>
                  <p className="text-xs text-slate-400 mt-0.5 flex items-center gap-1"><FileText size={10} />{t.refNo}</p>
                </td>
                <td className="px-4 py-3 text-xs text-slate-500 whitespace-nowrap">{t.publishDate}</td>
                <td className="px-4 py-3 text-xs font-medium text-slate-700 whitespace-nowrap">{t.dueDate}</td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${statusColor[t.status]}`}>{t.status}</span>
                </td>
                <td className="px-4 py-3">
                  {t.file_id ? (
                    <div className="flex items-center gap-1.5">
                      {t.attachment_type === 'EXTERNAL_LINK'
                        ? <Link2 size={11} className="text-[#0b2545]" />
                        : <FileText size={11} className="text-[#bfa15f]" />
                      }
                      <a href={t.file_url} target="_blank" rel="noopener noreferrer"
                        className="text-xs text-[#0b2545] hover:underline flex items-center gap-0.5 truncate max-w-[120px]">
                        {t.original_name || 'View'} <ExternalLink size={9} />
                      </a>
                    </div>
                  ) : <span className="text-xs text-slate-300">—</span>}
                </td>
                <td className="px-4 py-3 text-center">
                  <div className="inline-flex items-center gap-2">
                    <button onClick={() => openEdit(t)} className="p-1.5 rounded hover:bg-[#0b2545]/5 text-[#0b2545] transition-colors"><Pencil size={14} /></button>
                    <button onClick={() => setDeleteTarget(t)} className="p-1.5 rounded hover:bg-slate-100 text-slate-500 transition-colors"><Trash2 size={14} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {tenders.length === 0 && <div className="text-center py-12 text-slate-400">No tenders found.</div>}
      </div>

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 z-40 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 sticky top-0 bg-white">
              <h2 className="font-display text-lg font-bold text-primary">{editItem ? 'Edit Tender' : 'Add New Tender'}</h2>
              <button onClick={closeModal} className="p-1.5 rounded hover:bg-slate-100 text-slate-500"><X size={18} /></button>
            </div>
            <form onSubmit={handleSave} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Tender Title <span className="text-[#bfa15f]">*</span></label>
                <input required className="border border-slate-300 rounded px-3 py-2 w-full text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" value={form.title} onChange={e => f('title', e.target.value)} placeholder="Tender title" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Reference No. <span className="text-[#bfa15f]">*</span></label>
                  <input required className="border border-slate-300 rounded px-3 py-2 w-full text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" value={form.refNo} onChange={e => f('refNo', e.target.value)} placeholder="SGSITS/T/001/2025" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Status</label>
                  <select className="border border-slate-300 rounded px-3 py-2 w-full text-sm focus:outline-none" value={form.status} onChange={e => f('status', e.target.value as LocalTender['status'])}>
                    {STATUSES.map(s => <option key={s}>{s}</option>)}
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Publish Date <span className="text-[#bfa15f]">*</span></label>
                  <input type="date" required className="border border-slate-300 rounded px-3 py-2 w-full text-sm focus:outline-none" value={form.publishDate} onChange={e => f('publishDate', e.target.value)} />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Due Date <span className="text-[#bfa15f]">*</span></label>
                  <input type="date" required className="border border-slate-300 rounded px-3 py-2 w-full text-sm focus:outline-none" value={form.dueDate} onChange={e => f('dueDate', e.target.value)} />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Estimated Amount</label>
                <input className="border border-slate-300 rounded px-3 py-2 w-full text-sm focus:outline-none" value={form.amount} onChange={e => f('amount', e.target.value)} placeholder="₹12,50,000" />
              </div>

              {/* Dual attachment upload */}
              <AttachmentUpload
                usage="tenders"
                label="Tender Document (optional)"
                onAttached={handleAttached}
                onClear={handleAttachmentCleared}
                initialValue={attachmentRecord}
              />

              <div className="flex gap-3 pt-2 border-t border-slate-100">
                <button type="button" onClick={closeModal} className="flex-1 py-2 border border-slate-300 text-slate-700 rounded font-semibold text-sm hover:bg-slate-50">Cancel</button>
                <button type="submit" disabled={saving} className="flex-1 py-2 bg-primary text-white rounded font-semibold text-sm hover:bg-primary/90 disabled:opacity-60 flex items-center justify-center gap-2">
                  {saving ? <><Loader2 size={14} className="animate-spin" /> Saving…</> : editItem ? '✓ Update Tender' : '+ Add Tender'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {deleteTarget && (
        <div className="fixed inset-0 bg-black/50 z-40 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-sm p-6 text-center">
            <div className="w-12 h-12 bg-[#0b2545]/10 rounded-full flex items-center justify-center mx-auto mb-3"><Trash2 size={22} className="text-[#0b2545]" /></div>
            <h3 className="font-bold text-slate-800 text-lg mb-1">Delete Tender?</h3>
            <p className="text-slate-500 text-sm mb-5 line-clamp-2">"{deleteTarget.title}"</p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteTarget(null)} className="flex-1 py-2 border border-slate-300 text-slate-700 rounded font-semibold text-sm hover:bg-slate-50">Cancel</button>
              <button onClick={handleDelete} className="flex-1 py-2 bg-[#0b2545] text-white rounded font-semibold text-sm hover:bg-[#0b2545]/90">Delete</button>
            </div>
          </div>
        </div>
      )}

      {toast && <Toast message={toast} onClose={() => setToast('')} />}
    </div>
  )
}
