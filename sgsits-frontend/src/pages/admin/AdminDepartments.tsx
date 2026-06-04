import React, { useState, useEffect } from 'react'
import { Pencil, Trash2, Plus, X, Loader2, Building2 } from 'lucide-react'
import apiClient from '../../api/client'
import AttachmentUpload from '../../components/admin/AttachmentUpload'
import type { AttachmentRecord } from '../../api/index'
import { mediaUrl } from '../../utils/mediaUrl'

interface LocalDepartment {
  id: string
  name: string
  slug: string
  short_name: string
  description: string
  vision: string
  mission: string
  established_year: string
  contact_email: string
  contact_phone: string
  location: string
  hod_name: string
  hod_email: string
  image_file_id: number | null
  image_url: string
  status: string
}

function mapFromApi(d: Record<string, unknown>): LocalDepartment {
  return {
    id:               String(d.id ?? ''),
    name:             String(d.name ?? ''),
    slug:             String(d.slug ?? ''),
    short_name:       String(d.short_name ?? ''),
    description:      String(d.description ?? ''),
    vision:           String(d.vision ?? ''),
    mission:          String(d.mission ?? ''),
    established_year: String(d.established_year ?? ''),
    contact_email:    String(d.contact_email ?? ''),
    contact_phone:    String(d.contact_phone ?? ''),
    location:         String(d.location ?? ''),
    hod_name:         String(d.hod_name ?? ''),
    hod_email:        String(d.hod_email ?? ''),
    image_file_id:    d.image_file_id != null ? Number(d.image_file_id) : null,
    image_url:        mediaUrl(String(d.image_url ?? '')),
    status:           String(d.status ?? 'ACTIVE'),
  }
}

const EMPTY_FORM = {
  name: '',
  short_name: '',
  description: '',
  vision: '',
  mission: '',
  established_year: '',
  contact_email: '',
  contact_phone: '',
  location: '',
  image_file_id: null as number | null,
}

function Toast({ message, onClose }: { message: string; onClose: () => void }) {
  useEffect(() => { const t = setTimeout(onClose, 3000); return () => clearTimeout(t) }, [onClose])
  return (
    <div className="fixed bottom-4 right-4 z-50 bg-accent text-white px-5 py-3 rounded-lg shadow-lg flex items-center gap-3 text-sm font-medium">
      {message}<button onClick={onClose}><X size={14} /></button>
    </div>
  )
}

export default function AdminDepartments() {
  const [depts, setDepts]               = useState<LocalDepartment[]>([])
  const [showModal, setShowModal]       = useState(false)
  const [editItem, setEditItem]         = useState<LocalDepartment | null>(null)
  const [form, setForm]                 = useState({ ...EMPTY_FORM })
  const [imageRecord, setImageRecord]   = useState<AttachmentRecord | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<LocalDepartment | null>(null)
  const [saving, setSaving]             = useState(false)
  const [toast, setToast]               = useState('')
  const [search, setSearch]             = useState('')

  const load = async () => {
    try {
      const res = await apiClient.get('/v1/departments')
      const data = res.data?.data
      const rows = Array.isArray(data?.departments) ? data.departments : Array.isArray(data) ? data : []
      setDepts(rows.map((d: Record<string, unknown>) => mapFromApi(d)))
    } catch { setDepts([]) }
  }

  useEffect(() => { load() }, [])

  const filtered = depts.filter(d =>
    d.name.toLowerCase().includes(search.toLowerCase()) ||
    d.short_name.toLowerCase().includes(search.toLowerCase())
  )

  const openAdd = () => {
    setEditItem(null)
    setForm({ ...EMPTY_FORM })
    setImageRecord(null)
    setShowModal(true)
  }

  const openEdit = (d: LocalDepartment) => {
    setEditItem(d)
    setForm({
      name:             d.name,
      short_name:       d.short_name,
      description:      d.description,
      vision:           d.vision,
      mission:          d.mission,
      established_year: d.established_year,
      contact_email:    d.contact_email,
      contact_phone:    d.contact_phone,
      location:         d.location,
      image_file_id:    d.image_file_id,
    })
    setImageRecord(
      d.image_file_id ? {
        id: d.image_file_id, attachment_type: 'FILE',
        original_name: 'Department Image', stored_name: null,
        file_url: d.image_url, external_url: null, thumbnail_url: d.image_url,
        alt_text: null, meta_title: null, meta_description: null,
        file_type: 'image/jpeg', file_size: null, storage_type: 'LOCAL',
        uploaded_by: 0, uploader_name: '', created_at: '',
      } : null
    )
    setShowModal(true)
  }

  const closeModal = () => { setShowModal(false); setEditItem(null); setImageRecord(null) }

  const handleImageAttached = (record: AttachmentRecord) => {
    setImageRecord(record)
    setForm(f => ({ ...f, image_file_id: record.id }))
  }

  const handleImageCleared = () => {
    setImageRecord(null)
    setForm(f => ({ ...f, image_file_id: null }))
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    const payload: Record<string, unknown> = {
      name:             form.name.trim(),
      short_name:       form.short_name || null,
      description:      form.description || null,
      vision:           form.vision || null,
      mission:          form.mission || null,
      established_year: form.established_year || null,
      contact_email:    form.contact_email || null,
      contact_phone:    form.contact_phone || null,
      location:         form.location || null,
    }
    if (form.image_file_id) payload.image_file_id = form.image_file_id

    try {
      if (editItem) {
        await apiClient.put(`/v1/departments/${editItem.id}`, payload)
        setToast('Department updated!')
      } else {
        await apiClient.post('/v1/departments', payload)
        setToast('Department created!')
      }
      await load()
      closeModal()
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } }; message?: string })
        ?.response?.data?.message || 'Failed to save department.'
      setToast(msg)
    }
    setSaving(false)
  }

  const handleDelete = async () => {
    if (!deleteTarget) return
    try {
      await apiClient.delete(`/v1/departments/${deleteTarget.id}`)
      setToast('Department removed.')
      await load()
    } catch {
      setToast('Failed to remove department.')
    }
    setDeleteTarget(null)
  }


  return (
    <div className="flex gap-0 h-full">
    <div className="flex-1 min-w-0 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-primary">Departments</h1>
          <p className="text-sm text-slate-500 mt-0.5">Manage department information, images, and contact details.</p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={openAdd} className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-white text-sm font-semibold rounded-lg hover:bg-primary/90 transition-colors">
            <Plus size={16} /> Add Department
          </button>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <input
          className="border border-slate-300 rounded-lg px-3 py-2 text-sm w-72 focus:outline-none focus:ring-2 focus:ring-primary/30"
          placeholder="Search departments..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <span className="text-sm text-slate-500">{filtered.length} department(s)</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map(d => (
          <div key={d.id} className="bg-white border border-slate-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
            <div className="relative h-32 bg-slate-100">
              {d.image_url && !d.image_url.includes('placeholder') ? (
                <img src={d.image_url} alt={d.name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <Building2 size={32} className="text-slate-300" />
                </div>
              )}
            </div>
            <div className="p-4">
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-slate-800 truncate">{d.name}</h3>
                  {d.short_name && <p className="text-xs text-primary font-medium">{d.short_name}</p>}
                  {d.hod_name && <p className="text-xs text-slate-500 mt-0.5">HOD: {d.hod_name}</p>}
                  {d.contact_email && <p className="text-xs text-slate-400 mt-0.5">{d.contact_email}</p>}
                </div>
                <div className="flex gap-1.5 flex-shrink-0">
                  <button onClick={() => openEdit(d)} className="p-1.5 rounded hover:bg-primary/5 text-primary transition-colors"><Pencil size={14} /></button>
                  <button onClick={() => setDeleteTarget(d)} className="p-1.5 rounded hover:bg-slate-100 text-slate-500 transition-colors"><Trash2 size={14} /></button>
                </div>
              </div>
            </div>
          </div>
        ))}
        {filtered.length === 0 && (
          <div className="col-span-3 text-center py-16 text-slate-400 bg-white border border-slate-200 rounded-lg">
            No departments found.
          </div>
        )}
      </div>

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 z-40 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 sticky top-0 bg-white z-10">
              <h2 className="font-display text-lg font-bold text-primary">
                {editItem ? `Edit: ${editItem.name}` : 'Add Department'}
              </h2>
              <button onClick={closeModal} className="p-1.5 rounded hover:bg-slate-100 text-slate-500"><X size={18} /></button>
            </div>
            <form onSubmit={handleSave} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Full Name <span className="text-accent">*</span></label>
                  <input required className="border border-slate-300 rounded px-3 py-2 w-full text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                    value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="e.g. Computer Engineering" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Short Name</label>
                  <input className="border border-slate-300 rounded px-3 py-2 w-full text-sm focus:outline-none"
                    value={form.short_name} onChange={e => setForm(f => ({ ...f, short_name: e.target.value }))} placeholder="e.g. CE" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Description</label>
                <textarea rows={2} className="border border-slate-300 rounded px-3 py-2 w-full text-sm focus:outline-none resize-none"
                  value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} placeholder="Department overview..." />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Established Year</label>
                  <input className="border border-slate-300 rounded px-3 py-2 w-full text-sm focus:outline-none"
                    value={form.established_year} onChange={e => setForm(f => ({ ...f, established_year: e.target.value }))} placeholder="e.g. 1952" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Contact Email</label>
                  <input type="email" className="border border-slate-300 rounded px-3 py-2 w-full text-sm focus:outline-none"
                    value={form.contact_email} onChange={e => setForm(f => ({ ...f, contact_email: e.target.value }))} placeholder="dept@sgsits.ac.in" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Physical Location</label>
                <input className="border border-slate-300 rounded px-3 py-2 w-full text-sm focus:outline-none"
                  value={form.location} onChange={e => setForm(f => ({ ...f, location: e.target.value }))} placeholder="e.g. SGSITS Campus, CSE Wing Block A, 23 Park Road, Indore - 452003" />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Vision</label>
                <textarea rows={2} className="border border-slate-300 rounded px-3 py-2 w-full text-sm focus:outline-none resize-none"
                  value={form.vision} onChange={e => setForm(f => ({ ...f, vision: e.target.value }))} placeholder="Department vision..." />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Mission</label>
                <textarea rows={2} className="border border-slate-300 rounded px-3 py-2 w-full text-sm focus:outline-none resize-none"
                  value={form.mission} onChange={e => setForm(f => ({ ...f, mission: e.target.value }))} placeholder="Department mission..." />
              </div>

              {/* Department Image */}
              <AttachmentUpload
                usage="departments"
                label="Department Image (optional)"
                onAttached={handleImageAttached}
                onClear={handleImageCleared}
                initialValue={imageRecord}
              />

              {imageRecord && (
                <img
                  src={mediaUrl(imageRecord.file_url)}
                  alt="Preview"
                  className="w-full h-28 object-cover rounded-lg border border-slate-200"
                  onError={e => { (e.target as HTMLImageElement).style.display = 'none' }}
                />
              )}

              <div className="flex gap-3 pt-2 border-t border-slate-100">
                <button type="button" onClick={closeModal} className="flex-1 py-2 border border-slate-300 text-slate-700 rounded font-semibold text-sm hover:bg-slate-50">Cancel</button>
                <button type="submit" disabled={saving} className="flex-1 py-2 bg-primary text-white rounded font-semibold text-sm hover:bg-primary/90 disabled:opacity-60 flex items-center justify-center gap-2">
                  {saving ? <><Loader2 size={14} className="animate-spin" /> Saving…</> : editItem ? '✓ Update' : '+ Create'}
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
            <h3 className="font-bold text-slate-800 text-lg mb-1">Remove Department?</h3>
            <p className="text-slate-500 text-sm mb-5">"{deleteTarget.name}"</p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteTarget(null)} className="flex-1 py-2 border border-slate-300 text-slate-700 rounded font-semibold text-sm hover:bg-slate-50">Cancel</button>
              <button onClick={handleDelete} className="flex-1 py-2 bg-primary text-white rounded font-semibold text-sm hover:bg-primary/90">Remove</button>
            </div>
          </div>
        </div>
      )}

      {toast && <Toast message={toast} onClose={() => setToast('')} />}
    </div>
    </div>
  )
}
