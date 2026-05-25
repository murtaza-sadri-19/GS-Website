import React, { useState, useEffect } from 'react'
import { Pencil, Trash2, Plus, X, Calendar, MapPin, Image as ImageIcon, Link2, Loader2 } from 'lucide-react'
import { eventsAPI } from '../../api/index'
import AttachmentUpload from '../../components/admin/AttachmentUpload'
import type { AttachmentRecord } from '../../api/index'

// ── Local shape used by the UI form ────────────────────────────────────────
interface LocalEventItem {
  id: string
  title: string
  description: string
  venue: string
  date: string
  time: string
  category: string
  // Cover image — either an uploaded file_id OR an external image URL
  cover_file_id: number | null
  cover_url: string
  cover_attachment_type: 'FILE' | 'EXTERNAL_LINK' | null
  cover_original_name: string
  registrationUrl: string
}

function mapFromApi(e: Record<string, unknown>): LocalEventItem {
  const rawDate = String(e.start_date ?? e.startDate ?? e.date ?? e.event_date ?? '')
  const [datePart, timePart] = rawDate.includes('T')
    ? [rawDate.slice(0, 10), rawDate.slice(11, 16)]
    : [rawDate.slice(0, 10), '']
  return {
    id:                    String(e.id ?? ''),
    title:                 String(e.title ?? ''),
    description:           String(e.description ?? ''),
    venue:                 String(e.venue ?? e.location ?? ''),
    date:                  datePart || new Date().toISOString().slice(0, 10),
    time:                  String(e.time ?? timePart ?? '10:00 AM'),
    category:              String(e.category ?? 'Academic'),
    cover_file_id:         e.cover_image_file_id != null ? Number(e.cover_image_file_id) : null,
    cover_url:             String(e.cover_image_url ?? e.image_url ?? e.imageUrl ?? e.image ?? ''),
    cover_attachment_type: (e.cover_attachment_type as 'FILE' | 'EXTERNAL_LINK') || null,
    cover_original_name:   String(e.cover_original_name ?? ''),
    registrationUrl:       String(e.registration_url ?? e.registrationUrl ?? ''),
  }
}

const EVENT_CATEGORIES = ['Technical', 'Academic', 'Cultural', 'Social', 'Placement', 'Workshop', 'Sports', 'Other']

const EMPTY: Omit<LocalEventItem, 'id'> = {
  title: '', description: '', venue: '',
  date:  new Date().toISOString().slice(0, 10),
  time:  '10:00 AM', category: 'Academic',
  cover_file_id: null, cover_url: '', cover_attachment_type: null, cover_original_name: '',
  registrationUrl: '',
}

const catColors: Record<string, string> = {
  Technical:  'bg-[#0b2545]/10 text-[#0b2545]',
  Academic:   'bg-[#0b2545]/15 text-[#0b2545]',
  Cultural:   'bg-[#bfa15f]/15 text-[#bfa15f]',
  Social:     'bg-[#bfa15f]/10 text-[#bfa15f]',
  Placement:  'bg-[#bfa15f]/20 text-[#bfa15f]',
  Workshop:   'bg-[#0b2545]/5 text-[#0b2545]',
  Sports:     'bg-slate-100 text-slate-600',
  Other:      'bg-slate-100 text-slate-700',
}

function Toast({ message, onClose }: { message: string; onClose: () => void }) {
  useEffect(() => { const t = setTimeout(onClose, 3000); return () => clearTimeout(t) }, [onClose])
  return (
    <div className="fixed bottom-4 right-4 z-50 bg-[#bfa15f] text-white px-5 py-3 rounded-lg shadow-lg flex items-center gap-3 text-sm font-medium">
      {message}<button onClick={onClose}><X size={14} /></button>
    </div>
  )
}

export default function AdminEvents() {
  const [events, setEvents]             = useState<LocalEventItem[]>([])
  const [showModal, setShowModal]       = useState(false)
  const [editItem, setEditItem]         = useState<LocalEventItem | null>(null)
  const [form, setForm]                 = useState<Omit<LocalEventItem, 'id'>>(EMPTY)
  const [coverRecord, setCoverRecord]   = useState<AttachmentRecord | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<LocalEventItem | null>(null)
  const [saving, setSaving]             = useState(false)
  const [toast, setToast]               = useState('')

  const load = async () => {
    try {
      const items = await eventsAPI.getAll()
      setEvents(items.map(i => mapFromApi(i as unknown as Record<string, unknown>)))
    } catch {
      setEvents([])
    }
  }

  useEffect(() => { load() }, [])

  const openAdd = () => {
    setEditItem(null); setForm(EMPTY); setCoverRecord(null); setShowModal(true)
  }

  const openEdit = (ev: LocalEventItem) => {
    setEditItem(ev)
    setForm({ ...ev })
    setCoverRecord(
      ev.cover_file_id ? {
        id: ev.cover_file_id, attachment_type: ev.cover_attachment_type ?? 'FILE',
        original_name: ev.cover_original_name || 'Cover Image', stored_name: null,
        file_url: ev.cover_url, external_url: ev.cover_attachment_type === 'EXTERNAL_LINK' ? ev.cover_url : null,
        thumbnail_url: ev.cover_url, alt_text: null, meta_title: null, meta_description: null,
        file_type: 'image/jpeg', file_size: null,
        storage_type: ev.cover_attachment_type === 'EXTERNAL_LINK' ? 'EXTERNAL' : 'LOCAL',
        uploaded_by: 0, uploader_name: '', created_at: '',
      } : null
    )
    setShowModal(true)
  }

  const closeModal = () => { setShowModal(false); setEditItem(null); setCoverRecord(null) }

  const handleCoverAttached = (record: AttachmentRecord) => {
    setCoverRecord(record)
    setForm(f => ({
      ...f,
      cover_file_id:         record.id,
      cover_url:             record.file_url,
      cover_attachment_type: record.attachment_type,
      cover_original_name:   record.original_name,
    }))
  }

  const handleCoverCleared = () => {
    setCoverRecord(null)
    setForm(f => ({ ...f, cover_file_id: null, cover_url: '', cover_attachment_type: null, cover_original_name: '' }))
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    const payload: Record<string, unknown> = {
      title:            form.title,
      description:      form.description,
      venue:            form.venue,
      start_date:       form.date,
      event_date:       form.date,
      time:             form.time,
      category:         form.category,
      registration_url: form.registrationUrl || null,
      status:           'PUBLISHED',
    }
    // Pass cover image as file_id (preferred) OR fallback to direct URL
    if (form.cover_file_id) {
      payload.cover_image_file_id = form.cover_file_id
    } else if (form.cover_url) {
      payload.image_url = form.cover_url
    }

    try {
      if (editItem) {
        await eventsAPI.update(editItem.id, payload as never)
        setToast('Event updated!')
      } else {
        await eventsAPI.create(payload as never)
        setToast('Event added!')
      }
      await load()
    } catch {
      setToast('Failed to save event.')
    }
    setSaving(false)
    closeModal()
  }

  const handleDelete = async () => {
    if (!deleteTarget) return
    try {
      await eventsAPI.delete(deleteTarget.id)
      setToast('Event deleted.')
      await load()
    } catch {
      setToast('Failed to delete event.')
    }
    setDeleteTarget(null)
  }

  const f = (key: keyof Omit<LocalEventItem, 'id'>, val: string) =>
    setForm(prev => ({ ...prev, [key]: val }))

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-primary">Events Management</h1>
          <p className="text-sm text-slate-500 mt-0.5">Manage upcoming events, workshops and programs. Upload cover images or use external URLs.</p>
        </div>
        <button onClick={openAdd} className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-white text-sm font-semibold rounded-lg hover:bg-primary/90 transition-colors">
          <Plus size={16} /> Add New Event
        </button>
      </div>

      <div className="bg-white border border-slate-200 rounded-lg overflow-hidden shadow-sm">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="text-left px-4 py-3 font-semibold text-slate-600">Title</th>
              <th className="text-left px-4 py-3 font-semibold text-slate-600">Venue</th>
              <th className="text-left px-4 py-3 font-semibold text-slate-600">Date & Time</th>
              <th className="text-left px-4 py-3 font-semibold text-slate-600">Category</th>
              <th className="text-left px-4 py-3 font-semibold text-slate-600">Cover</th>
              <th className="text-center px-4 py-3 font-semibold text-slate-600">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {events.map(ev => (
              <tr key={ev.id} className="hover:bg-slate-50 transition-colors">
                <td className="px-4 py-3 max-w-xs">
                  <p className="font-medium text-slate-800 line-clamp-2">{ev.title}</p>
                </td>
                <td className="px-4 py-3 text-slate-500 text-xs">
                  <div className="flex items-center gap-1"><MapPin size={11} />{ev.venue}</div>
                </td>
                <td className="px-4 py-3 text-slate-500 text-xs whitespace-nowrap">
                  <div className="flex items-center gap-1"><Calendar size={11} />{ev.date}</div>
                  <div className="text-slate-400 mt-0.5">{ev.time}</div>
                </td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${catColors[ev.category] ?? 'bg-slate-100 text-slate-700'}`}>{ev.category}</span>
                </td>
                <td className="px-4 py-3">
                  {ev.cover_url ? (
                    ev.cover_attachment_type === 'EXTERNAL_LINK' || !ev.cover_file_id
                      ? <div className="flex items-center gap-1 text-xs text-[#0b2545]"><Link2 size={11} /> Link</div>
                      : <img src={ev.cover_url} alt="" className="w-10 h-8 rounded object-cover" />
                  ) : <span className="text-slate-300 text-xs">—</span>}
                </td>
                <td className="px-4 py-3 text-center">
                  <div className="inline-flex items-center gap-2">
                    <button onClick={() => openEdit(ev)} className="p-1.5 rounded hover:bg-[#0b2545]/5 text-[#0b2545] transition-colors"><Pencil size={14} /></button>
                    <button onClick={() => setDeleteTarget(ev)} className="p-1.5 rounded hover:bg-slate-100 text-slate-500 transition-colors"><Trash2 size={14} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {events.length === 0 && <div className="text-center py-12 text-slate-400">No events found.</div>}
      </div>

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 z-40 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 sticky top-0 bg-white z-10">
              <h2 className="font-display text-lg font-bold text-primary">{editItem ? 'Edit Event' : 'Add New Event'}</h2>
              <button onClick={closeModal} className="p-1.5 rounded hover:bg-slate-100 text-slate-500"><X size={18} /></button>
            </div>
            <form onSubmit={handleSave} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Title <span className="text-[#bfa15f]">*</span></label>
                <input required className="border border-slate-300 rounded px-3 py-2 w-full text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" value={form.title} onChange={e => f('title', e.target.value)} placeholder="Event title" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Description <span className="text-[#bfa15f]">*</span></label>
                <textarea required rows={3} className="border border-slate-300 rounded px-3 py-2 w-full text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none" value={form.description} onChange={e => f('description', e.target.value)} placeholder="Event description..." />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Venue <span className="text-[#bfa15f]">*</span></label>
                <input required className="border border-slate-300 rounded px-3 py-2 w-full text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" value={form.venue} onChange={e => f('venue', e.target.value)} placeholder="e.g. Auditorium, SGSITS" />
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Date <span className="text-[#bfa15f]">*</span></label>
                  <input type="date" required className="border border-slate-300 rounded px-3 py-2 w-full text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" value={form.date} onChange={e => f('date', e.target.value)} />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Time <span className="text-[#bfa15f]">*</span></label>
                  <input required className="border border-slate-300 rounded px-3 py-2 w-full text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" value={form.time} onChange={e => f('time', e.target.value)} placeholder="10:00 AM" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Category <span className="text-[#bfa15f]">*</span></label>
                  <select required className="border border-slate-300 rounded px-3 py-2 w-full text-sm focus:outline-none" value={form.category} onChange={e => f('category', e.target.value)}>
                    {EVENT_CATEGORIES.map(c => <option key={c}>{c}</option>)}
                  </select>
                </div>
              </div>

              {/* Cover Image — dual attachment */}
              <AttachmentUpload
                usage="events"
                label={<span className="flex items-center gap-1"><ImageIcon size={11} /> Cover Image (optional)</span> as unknown as string}
                onAttached={handleCoverAttached}
                onClear={handleCoverCleared}
                initialValue={coverRecord}
              />

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Registration URL</label>
                <input className="border border-slate-300 rounded px-3 py-2 w-full text-sm focus:outline-none" value={form.registrationUrl} onChange={e => f('registrationUrl', e.target.value)} placeholder="https://forms.google.com/..." />
              </div>

              <div className="flex gap-3 pt-2 border-t border-slate-100">
                <button type="button" onClick={closeModal} className="flex-1 py-2 border border-slate-300 text-slate-700 rounded font-semibold text-sm hover:bg-slate-50">Cancel</button>
                <button type="submit" disabled={saving} className="flex-1 py-2 bg-primary text-white rounded font-semibold text-sm hover:bg-primary/90 disabled:opacity-60 flex items-center justify-center gap-2">
                  {saving ? <><Loader2 size={14} className="animate-spin" /> Saving…</> : editItem ? '✓ Update Event' : '+ Add Event'}
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
            <h3 className="font-bold text-slate-800 text-lg mb-1">Delete Event?</h3>
            <p className="text-slate-500 text-sm mb-5">"{deleteTarget.title}"</p>
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
