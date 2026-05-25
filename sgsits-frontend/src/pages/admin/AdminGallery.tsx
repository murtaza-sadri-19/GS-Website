import React, { useState, useEffect } from 'react'
import { Pencil, Trash2, Plus, X, Image as ImageIcon, Link2, Loader2 } from 'lucide-react'
import { galleryAPI } from '../../api/index'
import AttachmentUpload from '../../components/admin/AttachmentUpload'
import type { AttachmentRecord } from '../../api/index'

const GALLERY_CATEGORIES = ['Technical Fest', 'Convocation', 'Sports', 'Cultural', 'Campus', 'Social', 'Academic', 'Other']

interface LocalAlbum {
  id: string
  title: string
  description: string
  date: string
  category: string
  // Cover image — dual attachment
  cover_file_id: number | null
  cover_url: string
  cover_attachment_type: 'FILE' | 'EXTERNAL_LINK' | null
  cover_original_name: string
  // Additional photos (URL list)
  photos: string[]
}

function mapFromApi(a: Record<string, unknown>): LocalAlbum {
  return {
    id:                    String(a.id ?? ''),
    title:                 String(a.title ?? ''),
    description:           String(a.description ?? ''),
    date:                  String(a.date ?? a.created_at ?? '').slice(0, 10),
    category:              String(a.category ?? a.album_type ?? 'Other'),
    cover_file_id:         a.file_id != null ? Number(a.file_id) : null,
    cover_url:             String(a.image_url ?? a.coverImage ?? a.cover_url ?? a.file_url ?? ''),
    cover_attachment_type: (a.cover_attachment_type as 'FILE' | 'EXTERNAL_LINK') || null,
    cover_original_name:   String(a.original_name ?? a.cover_original_name ?? ''),
    photos:                Array.isArray(a.photos) ? (a.photos as string[]) : [],
  }
}

const EMPTY: Omit<LocalAlbum, 'id'> = {
  title: '', description: '', date: new Date().toISOString().slice(0, 10),
  category: 'Other',
  cover_file_id: null, cover_url: '', cover_attachment_type: null, cover_original_name: '',
  photos: [],
}

function Toast({ message, onClose }: { message: string; onClose: () => void }) {
  useEffect(() => { const t = setTimeout(onClose, 3000); return () => clearTimeout(t) }, [onClose])
  return (
    <div className="fixed bottom-4 right-4 z-50 bg-[#bfa15f] text-white px-5 py-3 rounded-lg shadow-lg flex items-center gap-3 text-sm font-medium">
      {message}<button onClick={onClose}><X size={14} /></button>
    </div>
  )
}

export default function AdminGallery() {
  const [albums, setAlbums]             = useState<LocalAlbum[]>([])
  const [showModal, setShowModal]       = useState(false)
  const [editItem, setEditItem]         = useState<LocalAlbum | null>(null)
  const [form, setForm]                 = useState<Omit<LocalAlbum, 'id'>>(EMPTY)
  const [coverRecord, setCoverRecord]   = useState<AttachmentRecord | null>(null)
  const [photosText, setPhotosText]     = useState('')
  const [deleteTarget, setDeleteTarget] = useState<LocalAlbum | null>(null)
  const [saving, setSaving]             = useState(false)
  const [toast, setToast]               = useState('')

  const load = async () => {
    try {
      const items = await galleryAPI.getAlbums()
      setAlbums(items.map(i => mapFromApi(i as unknown as Record<string, unknown>)))
    } catch {
      setAlbums([])
    }
  }

  useEffect(() => { load() }, [])

  const openAdd = () => {
    setEditItem(null); setForm(EMPTY); setCoverRecord(null); setPhotosText(''); setShowModal(true)
  }

  const openEdit = (a: LocalAlbum) => {
    setEditItem(a)
    setForm({ ...a })
    setPhotosText(a.photos.join('\n'))
    setCoverRecord(
      a.cover_file_id ? {
        id: a.cover_file_id, attachment_type: a.cover_attachment_type ?? 'FILE',
        original_name: a.cover_original_name || 'Cover Image', stored_name: null,
        file_url: a.cover_url, external_url: a.cover_attachment_type === 'EXTERNAL_LINK' ? a.cover_url : null,
        thumbnail_url: a.cover_url, alt_text: null, meta_title: null, meta_description: null,
        file_type: 'image/jpeg', file_size: null,
        storage_type: a.cover_attachment_type === 'EXTERNAL_LINK' ? 'EXTERNAL' : 'LOCAL',
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
    const photosArr = photosText.split('\n').map(s => s.trim()).filter(Boolean)
    const payload: Record<string, unknown> = {
      title:       form.title,
      description: form.description,
      date:        form.date,
      category:    form.category,
      photos:      photosArr,
    }
    if (form.cover_file_id) payload.file_id = form.cover_file_id
    else if (form.cover_url) payload.image_url = form.cover_url

    try {
      if (editItem) {
        await galleryAPI.updateAlbum(editItem.id, payload as never)
        setToast('Album updated!')
      } else {
        await galleryAPI.createAlbum(payload as never)
        setToast('Album added!')
      }
      await load()
      closeModal()
    } catch {
      setToast('Failed to save album.')
    }
    setSaving(false)
  }

  const handleDelete = async () => {
    if (!deleteTarget) return
    try {
      await galleryAPI.deleteAlbum(deleteTarget.id)
      setToast('Album deleted.')
      await load()
    } catch {
      setToast('Failed to delete album.')
    }
    setDeleteTarget(null)
  }

  const f = (key: keyof Omit<LocalAlbum, 'id'>, val: string) =>
    setForm(prev => ({ ...prev, [key]: val }))

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-primary">Gallery Management</h1>
          <p className="text-sm text-slate-500 mt-0.5">Manage photo albums. Upload cover images directly or link to external URLs.</p>
        </div>
        <button onClick={openAdd} className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-white text-sm font-semibold rounded-lg hover:bg-primary/90 transition-colors">
          <Plus size={16} /> Add Album
        </button>
      </div>

      {/* Album Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {albums.map(album => (
          <div key={album.id} className="bg-white border border-slate-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
            <div className="relative h-40 bg-slate-100">
              {album.cover_url ? (
                <img src={album.cover_url} alt={album.title} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <ImageIcon size={32} className="text-slate-300" />
                </div>
              )}
              {album.cover_attachment_type === 'EXTERNAL_LINK' && (
                <div className="absolute top-2 left-2 bg-black/60 text-white text-[9px] px-1.5 py-0.5 rounded flex items-center gap-1">
                  <Link2 size={9} /> External
                </div>
              )}
              <span className="absolute top-2 right-2 bg-black/60 text-white text-xs px-2 py-0.5 rounded-full">
                {album.photos.length} photos
              </span>
            </div>
            <div className="p-4">
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-slate-800 truncate">{album.title}</h3>
                  <p className="text-xs text-slate-400 mt-0.5">{album.date} · <span className="text-primary/80">{album.category}</span></p>
                  <p className="text-xs text-slate-500 mt-1 line-clamp-2">{album.description}</p>
                </div>
                <div className="flex gap-1.5 flex-shrink-0">
                  <button onClick={() => openEdit(album)} className="p-1.5 rounded hover:bg-[#0b2545]/5 text-[#0b2545] transition-colors"><Pencil size={14} /></button>
                  <button onClick={() => setDeleteTarget(album)} className="p-1.5 rounded hover:bg-slate-100 text-slate-500 transition-colors"><Trash2 size={14} /></button>
                </div>
              </div>
            </div>
          </div>
        ))}
        {albums.length === 0 && (
          <div className="col-span-3 text-center py-16 text-slate-400 bg-white border border-slate-200 rounded-lg">
            No albums found. Add your first album.
          </div>
        )}
      </div>

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 z-40 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 sticky top-0 bg-white z-10">
              <h2 className="font-display text-lg font-bold text-primary">{editItem ? 'Edit Album' : 'Add New Album'}</h2>
              <button onClick={closeModal} className="p-1.5 rounded hover:bg-slate-100 text-slate-500"><X size={18} /></button>
            </div>
            <form onSubmit={handleSave} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Album Title <span className="text-[#bfa15f]">*</span></label>
                <input required className="border border-slate-300 rounded px-3 py-2 w-full text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" value={form.title} onChange={e => f('title', e.target.value)} placeholder="e.g. Technovanza 2025" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Description</label>
                <textarea rows={2} className="border border-slate-300 rounded px-3 py-2 w-full text-sm focus:outline-none resize-none" value={form.description} onChange={e => f('description', e.target.value)} placeholder="Brief album description..." />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Date <span className="text-[#bfa15f]">*</span></label>
                  <input type="date" required className="border border-slate-300 rounded px-3 py-2 w-full text-sm focus:outline-none" value={form.date} onChange={e => f('date', e.target.value)} />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Category</label>
                  <select className="border border-slate-300 rounded px-3 py-2 w-full text-sm focus:outline-none" value={form.category} onChange={e => f('category', e.target.value)}>
                    {GALLERY_CATEGORIES.map(c => <option key={c}>{c}</option>)}
                  </select>
                </div>
              </div>

              {/* Cover image — dual attachment */}
              <AttachmentUpload
                usage="gallery"
                label="Cover Image (optional)"
                onAttached={handleCoverAttached}
                onClear={handleCoverCleared}
                initialValue={coverRecord}
              />

              {/* Preview if attached */}
              {form.cover_url && (
                <img src={form.cover_url} alt="Cover preview" className="w-full h-28 object-cover rounded-lg border border-slate-200" />
              )}

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">
                  Photo URLs <span className="text-slate-400">(one per line, optional)</span>
                </label>
                <textarea rows={4} className="border border-slate-300 rounded px-3 py-2 w-full text-sm focus:outline-none resize-y font-mono" value={photosText} onChange={e => setPhotosText(e.target.value)} placeholder={"https://example.com/photo1.jpg\nhttps://example.com/photo2.jpg"} />
                <p className="text-xs text-slate-400 mt-1">{photosText.split('\n').filter(s => s.trim()).length} photo(s) entered</p>
              </div>

              <div className="flex gap-3 pt-2 border-t border-slate-100">
                <button type="button" onClick={closeModal} className="flex-1 py-2 border border-slate-300 text-slate-700 rounded font-semibold text-sm hover:bg-slate-50">Cancel</button>
                <button type="submit" disabled={saving} className="flex-1 py-2 bg-primary text-white rounded font-semibold text-sm hover:bg-primary/90 disabled:opacity-60 flex items-center justify-center gap-2">
                  {saving ? <><Loader2 size={14} className="animate-spin" /> Saving…</> : editItem ? '✓ Update Album' : '+ Add Album'}
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
            <h3 className="font-bold text-slate-800 text-lg mb-1">Delete Album?</h3>
            <p className="text-slate-500 text-sm mb-5">"{deleteTarget.title}" ({deleteTarget.photos.length} photos)</p>
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
