import React, { useMemo, useState } from 'react'
import { PageHeader, PortalCard, PortalTable, PortalModal } from '../../components/layout/PortalLayout'
import { HOD_DOWNLOADS, type HodDownload } from '../../data/mockHodContent'
import { Pencil, Trash2, Search, Download, UploadCloud, FileText, Send, Archive, X } from 'lucide-react'

const CATEGORIES: HodDownload['category'][] = ['Syllabus', 'Lab Manual', 'Assignment', 'Question Paper', 'Reference', 'Form']
const STATUSES: HodDownload['status'][] = ['draft', 'published', 'archived']

const EMPTY: Omit<HodDownload, 'id'> = {
  title: '', description: '', category: 'Syllabus', semester: undefined,
  file_url: '', file_size_kb: 0,
  uploaded_on: new Date().toISOString().slice(0, 10), uploaded_by: 'HOD Office', status: 'draft',
}

const HodDownloads: React.FC = () => {
  const [downloads, setDownloads] = useState<HodDownload[]>(HOD_DOWNLOADS)
  const [search, setSearch] = useState('')
  const [catFilter, setCatFilter] = useState<'all' | HodDownload['category']>('all')
  const [semFilter, setSemFilter] = useState<'all' | number>('all')
  const [statusFilter, setStatusFilter] = useState<'all' | HodDownload['status']>('all')
  const [editing, setEditing] = useState<HodDownload | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState<Omit<HodDownload, 'id'>>(EMPTY)
  const [deleteTarget, setDeleteTarget] = useState<HodDownload | null>(null)
  const [toast, setToast] = useState('')

  const visible = useMemo(() => downloads.filter(d => {
    if (catFilter !== 'all' && d.category !== catFilter) return false
    if (semFilter !== 'all' && d.semester !== semFilter) return false
    if (statusFilter !== 'all' && d.status !== statusFilter) return false
    if (search.trim() && !d.title.toLowerCase().includes(search.toLowerCase())) return false
    return true
  }), [downloads, catFilter, semFilter, statusFilter, search])

  const stats = {
    total: downloads.length,
    published: downloads.filter(d => d.status === 'published').length,
    drafts: downloads.filter(d => d.status === 'draft').length,
    sizeMb: (downloads.reduce((sum, d) => sum + d.file_size_kb, 0) / 1024).toFixed(2),
  }

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(''), 2400) }
  const openAdd = () => { setEditing(null); setForm(EMPTY); setShowForm(true) }
  const openEdit = (d: HodDownload) => { setEditing(d); setForm(d); setShowForm(true) }

  const save = (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.title.trim() || !form.file_url.trim()) return
    if (editing) {
      setDownloads(prev => prev.map(d => d.id === editing.id ? { ...editing, ...form } : d))
      showToast(`Download "${form.title}" updated.`)
    } else {
      const id = `DL${String(downloads.length + 1).padStart(3, '0')}`
      setDownloads(prev => [{ id, ...form }, ...prev])
      showToast(`Download "${form.title}" uploaded.`)
    }
    setShowForm(false); setEditing(null); setForm(EMPTY)
  }

  const publish = (id: string) => { setDownloads(prev => prev.map(d => d.id === id ? { ...d, status: 'published' } : d)); showToast('Download published.') }
  const archive = (id: string) => { setDownloads(prev => prev.map(d => d.id === id ? { ...d, status: 'archived' } : d)); showToast('Download archived.') }
  const handleDelete = () => {
    if (!deleteTarget) return
    setDownloads(prev => prev.filter(d => d.id !== deleteTarget.id))
    showToast(`Deleted "${deleteTarget.title}".`)
    setDeleteTarget(null)
  }

  return (
    <div className="space-y-5">
      <PageHeader
        title="Department Downloads"
        subtitle="Upload syllabi, manuals, assignments, papers and forms"
        action={
          <button onClick={openAdd} className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-[#0b2545] text-white text-xs font-bold rounded-md hover:bg-[#0b2545]/90 transition-colors">
            <UploadCloud size={14} /> Upload Download
          </button>
        }
      />

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <Stat label="Total" value={stats.total} accent="text-[#0b2545]" />
        <Stat label="Published" value={stats.published} accent="text-[#bfa15f]" />
        <Stat label="Drafts" value={stats.drafts} accent="text-[#0b2545]" />
        <Stat label="Storage" value={`${stats.sizeMb} MB`} accent="text-slate-700" />
      </div>

      <PortalCard className="!p-3">
        <div className="flex flex-col sm:flex-row gap-2.5">
          <div className="relative flex-1 min-w-0">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search by title..." className="w-full pl-9 pr-3 py-2 text-sm border border-slate-200 rounded focus:outline-none focus:border-[#0b2545]" />
          </div>
          <select value={catFilter} onChange={(e) => setCatFilter(e.target.value as 'all' | HodDownload['category'])} className="border border-slate-200 rounded px-3 py-2 text-sm bg-white focus:outline-none focus:border-[#0b2545]">
            <option value="all">All Categories</option>
            {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
          <select value={String(semFilter)} onChange={(e) => setSemFilter(e.target.value === 'all' ? 'all' : Number(e.target.value))} className="border border-slate-200 rounded px-3 py-2 text-sm bg-white focus:outline-none focus:border-[#0b2545]">
            <option value="all">All Semesters</option>
            {[1, 2, 3, 4, 5, 6, 7, 8].map(s => <option key={s} value={s}>Semester {s}</option>)}
          </select>
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value as 'all' | HodDownload['status'])} className="border border-slate-200 rounded px-3 py-2 text-sm bg-white focus:outline-none focus:border-[#0b2545]">
            <option value="all">All Statuses</option>
            {STATUSES.map(s => <option key={s} value={s}>{s[0].toUpperCase() + s.slice(1)}</option>)}
          </select>
        </div>
      </PortalCard>

      <PortalCard className="!p-0 overflow-hidden">
        <PortalTable
          headers={['File', 'Category', 'Sem', 'Size', 'Uploaded', 'By', 'Status', 'Actions']}
          rows={visible}
          empty="No downloads match the filters."
          renderRow={(d) => (
            <tr key={d.id} className="hover:bg-slate-50/60 transition-colors">
              <td className="px-4 py-2.5">
                <div className="flex items-start gap-2">
                  <FileText size={14} className="text-[#bfa15f] mt-0.5 shrink-0" />
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-slate-800 truncate">{d.title}</p>
                    <p className="text-[11px] text-slate-500 truncate">{d.description}</p>
                  </div>
                </div>
              </td>
              <td className="px-4 py-2.5">
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[#0b2545]/5 text-[#0b2545] border border-[#0b2545]/15 uppercase tracking-wide">
                  {d.category}
                </span>
              </td>
              <td className="px-4 py-2.5 text-xs text-slate-600">{d.semester ? `Sem ${d.semester}` : '—'}</td>
              <td className="px-4 py-2.5 text-xs text-slate-600">{(d.file_size_kb / 1024).toFixed(2)} MB</td>
              <td className="px-4 py-2.5 text-xs text-slate-600">{d.uploaded_on}</td>
              <td className="px-4 py-2.5 text-xs text-slate-600 truncate max-w-[140px]">{d.uploaded_by}</td>
              <td className="px-4 py-2.5"><StatusPill status={d.status} /></td>
              <td className="px-4 py-2.5">
                <div className="flex items-center gap-1">
                  <a href={d.file_url} target="_blank" rel="noreferrer" title="Download" className="p-1.5 rounded text-slate-500 hover:bg-slate-100 hover:text-[#0b2545]"><Download size={13} /></a>
                  {d.status !== 'published' && <IconBtn title="Publish" onClick={() => publish(d.id)}><Send size={13} /></IconBtn>}
                  {d.status !== 'archived' && <IconBtn title="Archive" onClick={() => archive(d.id)}><Archive size={13} /></IconBtn>}
                  <IconBtn title="Edit" onClick={() => openEdit(d)}><Pencil size={13} /></IconBtn>
                  <IconBtn title="Delete" onClick={() => setDeleteTarget(d)}><Trash2 size={13} /></IconBtn>
                </div>
              </td>
            </tr>
          )}
        />
      </PortalCard>

      <PortalModal isOpen={showForm} title={editing ? `Edit Download — ${editing.id}` : 'Upload Department Download'} onClose={() => { setShowForm(false); setEditing(null) }} width="max-w-xl">
        <form onSubmit={save} className="space-y-3">
          <FormField label="Title" required>
            <input required type="text" value={form.title} onChange={(e) => setForm(f => ({ ...f, title: e.target.value }))} className={inputCls} />
          </FormField>
          <FormField label="Description">
            <textarea rows={2} value={form.description} onChange={(e) => setForm(f => ({ ...f, description: e.target.value }))} className={inputCls} />
          </FormField>
          <div className="grid grid-cols-2 gap-3">
            <FormField label="Category">
              <select value={form.category} onChange={(e) => setForm(f => ({ ...f, category: e.target.value as HodDownload['category'] }))} className={inputCls}>
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </FormField>
            <FormField label="Semester (optional)">
              <select value={form.semester ?? ''} onChange={(e) => setForm(f => ({ ...f, semester: e.target.value ? Number(e.target.value) : undefined }))} className={inputCls}>
                <option value="">—</option>
                {[1, 2, 3, 4, 5, 6, 7, 8].map(s => <option key={s} value={s}>Semester {s}</option>)}
              </select>
            </FormField>
          </div>
          <FormField label="File URL" required>
            <input required type="text" value={form.file_url} onChange={(e) => setForm(f => ({ ...f, file_url: e.target.value }))} className={inputCls} placeholder="/files/syllabus.pdf" />
          </FormField>
          <div className="grid grid-cols-2 gap-3">
            <FormField label="Size (KB)">
              <input type="number" min={0} value={form.file_size_kb} onChange={(e) => setForm(f => ({ ...f, file_size_kb: Number(e.target.value) }))} className={inputCls} />
            </FormField>
            <FormField label="Status">
              <select value={form.status} onChange={(e) => setForm(f => ({ ...f, status: e.target.value as HodDownload['status'] }))} className={inputCls}>
                {STATUSES.map(s => <option key={s} value={s}>{s[0].toUpperCase() + s.slice(1)}</option>)}
              </select>
            </FormField>
          </div>
          <div className="flex gap-2.5 pt-2 border-t border-slate-100">
            <button type="button" onClick={() => { setShowForm(false); setEditing(null) }} className="flex-1 py-2 border border-slate-200 text-slate-700 text-sm font-semibold rounded hover:bg-slate-50">Cancel</button>
            <button type="submit" className="flex-1 py-2 bg-[#0b2545] text-white text-sm font-bold rounded hover:bg-[#0b2545]/90">{editing ? 'Update' : 'Upload'}</button>
          </div>
        </form>
      </PortalModal>

      <PortalModal isOpen={!!deleteTarget} title="Confirm Delete" onClose={() => setDeleteTarget(null)} width="max-w-sm">
        <div className="text-center">
          <div className="w-12 h-12 bg-[#0b2545]/10 rounded-full flex items-center justify-center mx-auto mb-3">
            <Trash2 size={20} className="text-[#0b2545]" />
          </div>
          <p className="text-sm text-slate-700">Delete "<strong>{deleteTarget?.title}</strong>"?</p>
          <div className="flex gap-2.5 mt-5">
            <button onClick={() => setDeleteTarget(null)} className="flex-1 py-2 border border-slate-200 text-slate-700 text-sm font-semibold rounded hover:bg-slate-50">Cancel</button>
            <button onClick={handleDelete} className="flex-1 py-2 bg-[#0b2545] text-white text-sm font-bold rounded hover:bg-[#0b2545]/90">Delete</button>
          </div>
        </div>
      </PortalModal>

      {toast && (
        <div className="fixed bottom-4 right-4 z-50 bg-[#bfa15f] text-white px-5 py-3 rounded-lg shadow-lg flex items-center gap-2 text-sm font-medium">
          <Download size={14} /> {toast}
          <button onClick={() => setToast('')} className="ml-1"><X size={13} /></button>
        </div>
      )}
    </div>
  )
}

const inputCls = 'w-full border border-slate-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#0b2545] bg-white'
const FormField: React.FC<{ label: string; required?: boolean; children: React.ReactNode }> = ({ label, required, children }) => (
  <label className="block">
    <span className="block text-[11px] font-bold text-slate-600 uppercase tracking-wide mb-1">{label} {required && <span className="text-[#bfa15f]">*</span>}</span>
    {children}
  </label>
)
const Stat: React.FC<{ label: string; value: number | string; accent: string }> = ({ label, value, accent }) => (
  <PortalCard className="!p-4">
    <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wide">{label}</p>
    <p className={`text-2xl font-bold mt-1 ${accent}`}>{value}</p>
  </PortalCard>
)
const IconBtn: React.FC<{ title: string; onClick: () => void; children: React.ReactNode }> = ({ title, onClick, children }) => (
  <button onClick={onClick} title={title} className="p-1.5 rounded text-slate-500 hover:bg-slate-100 hover:text-[#0b2545] transition-colors">{children}</button>
)
const StatusPill: React.FC<{ status: HodDownload['status'] }> = ({ status }) => {
  const cls = status === 'published' ? 'bg-[#bfa15f]/10 text-[#bfa15f] border-[#bfa15f]/30' :
              status === 'draft'     ? 'bg-[#0b2545]/10 text-[#0b2545] border-[#0b2545]/25' :
                                       'bg-slate-100 text-slate-500 border-slate-200'
  return <span className={`text-[10px] font-bold px-2 py-0.5 rounded border uppercase tracking-wide ${cls}`}>{status}</span>
}

export default HodDownloads
