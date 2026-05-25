import React, { useMemo, useState } from 'react'
import { PageHeader, PortalCard, PortalModal } from '../../components/layout/PortalLayout'
import { HOD_GALLERY, type HodGalleryAlbum } from '../../data/mockHodContent'
import { Plus, Pencil, Trash2, Search, Image as ImageIcon, Send, Archive, X, Camera, UploadCloud } from 'lucide-react'

const CATEGORIES: HodGalleryAlbum['category'][] = ['Event', 'Lab', 'Convocation', 'Cultural', 'Industrial Visit', 'Other']
const STATUSES: HodGalleryAlbum['status'][] = ['draft', 'published', 'archived']

const EMPTY: Omit<HodGalleryAlbum, 'id'> = {
  title: '', description: '', cover_url: '', image_count: 0,
  created_on: new Date().toISOString().slice(0, 10), category: 'Event', status: 'draft',
}

const HodGallery: React.FC = () => {
  const [albums, setAlbums] = useState<HodGalleryAlbum[]>(HOD_GALLERY)
  const [search, setSearch] = useState('')
  const [catFilter, setCatFilter] = useState<'all' | HodGalleryAlbum['category']>('all')
  const [statusFilter, setStatusFilter] = useState<'all' | HodGalleryAlbum['status']>('all')
  const [editing, setEditing] = useState<HodGalleryAlbum | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState<Omit<HodGalleryAlbum, 'id'>>(EMPTY)
  const [deleteTarget, setDeleteTarget] = useState<HodGalleryAlbum | null>(null)
  const [uploading, setUploading] = useState<HodGalleryAlbum | null>(null)
  const [toast, setToast] = useState('')

  const visible = useMemo(() => albums.filter(a => {
    if (catFilter !== 'all' && a.category !== catFilter) return false
    if (statusFilter !== 'all' && a.status !== statusFilter) return false
    if (search.trim() && !a.title.toLowerCase().includes(search.toLowerCase())) return false
    return true
  }), [albums, catFilter, statusFilter, search])

  const stats = {
    albums: albums.length,
    images: albums.reduce((sum, a) => sum + a.image_count, 0),
    published: albums.filter(a => a.status === 'published').length,
    drafts: albums.filter(a => a.status === 'draft').length,
  }

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(''), 2400) }
  const openAdd = () => { setEditing(null); setForm(EMPTY); setShowForm(true) }
  const openEdit = (a: HodGalleryAlbum) => { setEditing(a); setForm(a); setShowForm(true) }

  const save = (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.title.trim()) return
    if (editing) {
      setAlbums(prev => prev.map(a => a.id === editing.id ? { ...editing, ...form } : a))
      showToast(`Album "${form.title}" updated.`)
    } else {
      const id = `GA${String(albums.length + 1).padStart(3, '0')}`
      setAlbums(prev => [{ id, ...form }, ...prev])
      showToast(`Album "${form.title}" created.`)
    }
    setShowForm(false); setEditing(null); setForm(EMPTY)
  }

  const publish = (id: string) => { setAlbums(prev => prev.map(a => a.id === id ? { ...a, status: 'published' } : a)); showToast('Album published.') }
  const archive = (id: string) => { setAlbums(prev => prev.map(a => a.id === id ? { ...a, status: 'archived' } : a)); showToast('Album archived.') }
  const handleDelete = () => { if (!deleteTarget) return; setAlbums(prev => prev.filter(a => a.id !== deleteTarget.id)); showToast(`Deleted album.`); setDeleteTarget(null) }

  const simulateUpload = () => {
    if (!uploading) return
    const added = Math.floor(Math.random() * 6) + 3
    setAlbums(prev => prev.map(a => a.id === uploading.id ? { ...a, image_count: a.image_count + added } : a))
    showToast(`${added} image${added !== 1 ? 's' : ''} added to "${uploading.title}".`)
    setUploading(null)
  }

  return (
    <div className="space-y-5">
      <PageHeader
        title="Department Gallery"
        subtitle="Manage photo albums from events, labs, convocations and visits"
        action={
          <button onClick={openAdd} className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-[#0b2545] text-white text-xs font-bold rounded-md hover:bg-[#0b2545]/90 transition-colors">
            <Plus size={14} /> New Album
          </button>
        }
      />

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <Stat label="Albums" value={stats.albums} accent="text-[#0b2545]" />
        <Stat label="Images" value={stats.images} accent="text-[#bfa15f]" />
        <Stat label="Published" value={stats.published} accent="text-[#bfa15f]" />
        <Stat label="Drafts" value={stats.drafts} accent="text-[#0b2545]" />
      </div>

      <PortalCard className="!p-3">
        <div className="flex flex-col sm:flex-row gap-2.5">
          <div className="relative flex-1 min-w-0">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search albums..." className="w-full pl-9 pr-3 py-2 text-sm border border-slate-200 rounded focus:outline-none focus:border-[#0b2545]" />
          </div>
          <select value={catFilter} onChange={(e) => setCatFilter(e.target.value as 'all' | HodGalleryAlbum['category'])} className="border border-slate-200 rounded px-3 py-2 text-sm bg-white focus:outline-none focus:border-[#0b2545]">
            <option value="all">All Categories</option>
            {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value as 'all' | HodGalleryAlbum['status'])} className="border border-slate-200 rounded px-3 py-2 text-sm bg-white focus:outline-none focus:border-[#0b2545]">
            <option value="all">All Statuses</option>
            {STATUSES.map(s => <option key={s} value={s}>{s[0].toUpperCase() + s.slice(1)}</option>)}
          </select>
        </div>
      </PortalCard>

      {visible.length === 0 ? (
        <PortalCard><p className="text-center text-sm text-slate-400 py-12">No albums match the filters.</p></PortalCard>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {visible.map(a => (
            <PortalCard key={a.id} className="!p-0 overflow-hidden group">
              <div className="relative aspect-[4/3] bg-slate-100 overflow-hidden">
                {a.cover_url ? (
                  <img src={a.cover_url} alt={a.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center"><ImageIcon size={36} className="text-slate-300" /></div>
                )}
                <div className="absolute top-2 right-2"><StatusPill status={a.status} light /></div>
                <div className="absolute bottom-2 left-2 flex items-center gap-1 bg-black/50 text-white text-[10px] font-bold px-2 py-0.5 rounded">
                  <Camera size={10} /> {a.image_count}
                </div>
              </div>
              <div className="p-3">
                <div className="flex items-start justify-between gap-2">
                  <h4 className="text-sm font-bold text-slate-800 line-clamp-1">{a.title}</h4>
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-[#0b2545]/5 text-[#0b2545] border border-[#0b2545]/15 shrink-0 uppercase tracking-wide">{a.category}</span>
                </div>
                <p className="text-[11px] text-slate-500 mt-1 line-clamp-2">{a.description}</p>
                <p className="text-[10px] text-slate-400 mt-1">{a.created_on}</p>
                <div className="flex items-center gap-1 mt-2 pt-2 border-t border-slate-100">
                  <IconBtn title="Add Photos" onClick={() => setUploading(a)}><UploadCloud size={12} /></IconBtn>
                  {a.status !== 'published' && <IconBtn title="Publish" onClick={() => publish(a.id)}><Send size={12} /></IconBtn>}
                  {a.status !== 'archived' && <IconBtn title="Archive" onClick={() => archive(a.id)}><Archive size={12} /></IconBtn>}
                  <IconBtn title="Edit" onClick={() => openEdit(a)}><Pencil size={12} /></IconBtn>
                  <IconBtn title="Delete" onClick={() => setDeleteTarget(a)}><Trash2 size={12} /></IconBtn>
                </div>
              </div>
            </PortalCard>
          ))}
        </div>
      )}

      <PortalModal isOpen={showForm} title={editing ? `Edit Album — ${editing.id}` : 'Create New Album'} onClose={() => { setShowForm(false); setEditing(null) }} width="max-w-lg">
        <form onSubmit={save} className="space-y-3">
          <FormField label="Title" required><input required type="text" value={form.title} onChange={(e) => setForm(f => ({ ...f, title: e.target.value }))} className={inputCls} /></FormField>
          <FormField label="Description"><textarea rows={2} value={form.description} onChange={(e) => setForm(f => ({ ...f, description: e.target.value }))} className={inputCls} /></FormField>
          <FormField label="Cover Image URL"><input type="text" value={form.cover_url} onChange={(e) => setForm(f => ({ ...f, cover_url: e.target.value }))} className={inputCls} placeholder="https://..." /></FormField>
          {form.cover_url && (
            <div className="aspect-[16/9] bg-slate-50 border border-slate-200 rounded-lg overflow-hidden">
              <img src={form.cover_url} alt="preview" className="w-full h-full object-cover" />
            </div>
          )}
          <div className="grid grid-cols-2 gap-3">
            <FormField label="Category">
              <select value={form.category} onChange={(e) => setForm(f => ({ ...f, category: e.target.value as HodGalleryAlbum['category'] }))} className={inputCls}>
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </FormField>
            <FormField label="Status">
              <select value={form.status} onChange={(e) => setForm(f => ({ ...f, status: e.target.value as HodGalleryAlbum['status'] }))} className={inputCls}>
                {STATUSES.map(s => <option key={s} value={s}>{s[0].toUpperCase() + s.slice(1)}</option>)}
              </select>
            </FormField>
          </div>
          <div className="flex gap-2.5 pt-2 border-t border-slate-100">
            <button type="button" onClick={() => { setShowForm(false); setEditing(null) }} className="flex-1 py-2 border border-slate-200 text-slate-700 text-sm font-semibold rounded hover:bg-slate-50">Cancel</button>
            <button type="submit" className="flex-1 py-2 bg-[#0b2545] text-white text-sm font-bold rounded hover:bg-[#0b2545]/90">{editing ? 'Update' : 'Create Album'}</button>
          </div>
        </form>
      </PortalModal>

      <PortalModal isOpen={!!uploading} title={`Upload Photos — ${uploading?.title}`} onClose={() => setUploading(null)} width="max-w-md">
        <div className="text-center py-4">
          <div className="border-2 border-dashed border-slate-200 rounded-lg p-8">
            <UploadCloud size={36} className="text-[#bfa15f] mx-auto mb-3" />
            <p className="text-sm font-semibold text-slate-700">Drop photos here or click to select</p>
            <p className="text-[11px] text-slate-400 mt-1">JPG / PNG / WebP up to 5 MB each</p>
            <button onClick={simulateUpload} className="mt-4 inline-flex items-center gap-1.5 px-4 py-2 bg-[#0b2545] text-white text-xs font-bold rounded-md hover:bg-[#0b2545]/90">
              Simulate Upload
            </button>
          </div>
          <p className="text-[11px] text-slate-400 mt-3">Currently {uploading?.image_count ?? 0} image{uploading?.image_count !== 1 ? 's' : ''} in this album.</p>
        </div>
      </PortalModal>

      <PortalModal isOpen={!!deleteTarget} title="Confirm Delete" onClose={() => setDeleteTarget(null)} width="max-w-sm">
        <div className="text-center">
          <div className="w-12 h-12 bg-[#0b2545]/10 rounded-full flex items-center justify-center mx-auto mb-3"><Trash2 size={20} className="text-[#0b2545]" /></div>
          <p className="text-sm text-slate-700">Delete album "<strong>{deleteTarget?.title}</strong>" and its {deleteTarget?.image_count ?? 0} image{deleteTarget?.image_count !== 1 ? 's' : ''}?</p>
          <div className="flex gap-2.5 mt-5">
            <button onClick={() => setDeleteTarget(null)} className="flex-1 py-2 border border-slate-200 text-slate-700 text-sm font-semibold rounded hover:bg-slate-50">Cancel</button>
            <button onClick={handleDelete} className="flex-1 py-2 bg-[#0b2545] text-white text-sm font-bold rounded hover:bg-[#0b2545]/90">Delete</button>
          </div>
        </div>
      </PortalModal>

      {toast && (
        <div className="fixed bottom-4 right-4 z-50 bg-[#bfa15f] text-white px-5 py-3 rounded-lg shadow-lg flex items-center gap-2 text-sm font-medium">
          <ImageIcon size={14} /> {toast}
          <button onClick={() => setToast('')} className="ml-1"><X size={13} /></button>
        </div>
      )}
    </div>
  )
}

const inputCls = 'w-full border border-slate-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#0b2545] bg-white'
const FormField: React.FC<{ label: string; required?: boolean; children: React.ReactNode }> = ({ label, required, children }) => (
  <label className="block"><span className="block text-[11px] font-bold text-slate-600 uppercase tracking-wide mb-1">{label} {required && <span className="text-[#bfa15f]">*</span>}</span>{children}</label>
)
const Stat: React.FC<{ label: string; value: number | string; accent: string }> = ({ label, value, accent }) => (
  <PortalCard className="!p-4"><p className="text-[11px] font-bold text-slate-500 uppercase tracking-wide">{label}</p><p className={`text-2xl font-bold mt-1 ${accent}`}>{value}</p></PortalCard>
)
const IconBtn: React.FC<{ title: string; onClick: () => void; children: React.ReactNode }> = ({ title, onClick, children }) => (
  <button onClick={onClick} title={title} className="p-1.5 rounded text-slate-500 hover:bg-slate-100 hover:text-[#0b2545] transition-colors">{children}</button>
)
const StatusPill: React.FC<{ status: HodGalleryAlbum['status']; light?: boolean }> = ({ status, light }) => {
  const cls = light
    ? 'bg-white/20 text-white border-white/30'
    : status === 'published' ? 'bg-[#bfa15f]/10 text-[#bfa15f] border-[#bfa15f]/30'
    : status === 'draft'     ? 'bg-[#0b2545]/10 text-[#0b2545] border-[#0b2545]/25'
    :                          'bg-slate-100 text-slate-500 border-slate-200'
  return <span className={`text-[10px] font-bold px-2 py-0.5 rounded border uppercase tracking-wide ${cls}`}>{status}</span>
}

export default HodGallery
