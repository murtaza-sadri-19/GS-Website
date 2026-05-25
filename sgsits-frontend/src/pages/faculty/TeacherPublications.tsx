import React, { useMemo, useState } from 'react'
import { PageHeader, PortalCard, PortalModal } from '../../components/layout/PortalLayout'
import { TEACHER_PUBLICATIONS, type Publication } from '../../data/mockTeacherContent'
import { Plus, Pencil, Trash2, Search, FileText, X, ExternalLink, Send, Archive, Eye } from 'lucide-react'

const TYPES: Publication['venue_type'][] = ['Journal', 'Conference', 'Book Chapter', 'Patent']
const STATUSES: Publication['status'][] = ['draft', 'published', 'archived']

const EMPTY: Omit<Publication, 'id'> = {
  title: '', journal_name: '', publication_year: new Date().getFullYear(),
  authors: '', publication_link: '', description: '',
  citation_count: 0, venue_type: 'Journal', status: 'draft',
}

const TeacherPublications: React.FC = () => {
  const [items, setItems] = useState<Publication[]>(TEACHER_PUBLICATIONS)
  const [search, setSearch] = useState('')
  const [typeFilter, setTypeFilter] = useState<'all' | Publication['venue_type']>('all')
  const [yearFilter, setYearFilter] = useState<'all' | number>('all')
  const [statusFilter, setStatusFilter] = useState<'all' | Publication['status']>('all')
  const [editing, setEditing] = useState<Publication | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [viewing, setViewing] = useState<Publication | null>(null)
  const [form, setForm] = useState<Omit<Publication, 'id'>>(EMPTY)
  const [deleteTarget, setDeleteTarget] = useState<Publication | null>(null)
  const [toast, setToast] = useState('')

  const years = useMemo(() => Array.from(new Set(items.map(i => i.publication_year))).sort((a, b) => b - a), [items])

  const visible = useMemo(() => items.filter(p => {
    if (typeFilter !== 'all' && p.venue_type !== typeFilter) return false
    if (yearFilter !== 'all' && p.publication_year !== yearFilter) return false
    if (statusFilter !== 'all' && p.status !== statusFilter) return false
    if (search.trim() && !p.title.toLowerCase().includes(search.toLowerCase()) && !p.journal_name.toLowerCase().includes(search.toLowerCase())) return false
    return true
  }).sort((a, b) => b.publication_year - a.publication_year), [items, typeFilter, yearFilter, statusFilter, search])

  const stats = {
    total: items.length,
    published: items.filter(i => i.status === 'published').length,
    citations: items.reduce((s, p) => s + p.citation_count, 0),
    hIndex: computeHIndex(items.map(p => p.citation_count)),
  }

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(''), 2400) }
  const openAdd = () => { setEditing(null); setForm(EMPTY); setShowForm(true) }
  const openEdit = (p: Publication) => { setEditing(p); setForm(p); setShowForm(true) }

  const save = (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.title.trim()) return
    if (editing) {
      setItems(prev => prev.map(p => p.id === editing.id ? { ...editing, ...form } : p))
      showToast(`Publication updated.`)
    } else {
      const id = `PUB${String(items.length + 1).padStart(3, '0')}`
      setItems(prev => [{ id, ...form }, ...prev])
      showToast(`Publication added.`)
    }
    setShowForm(false); setEditing(null); setForm(EMPTY)
  }
  const publish = (id: string) => { setItems(prev => prev.map(p => p.id === id ? { ...p, status: 'published' } : p)); showToast('Publication published.') }
  const archive = (id: string) => { setItems(prev => prev.map(p => p.id === id ? { ...p, status: 'archived' } : p)); showToast('Publication archived.') }
  const handleDelete = () => { if (!deleteTarget) return; setItems(prev => prev.filter(p => p.id !== deleteTarget.id)); showToast('Deleted.'); setDeleteTarget(null) }

  return (
    <div className="space-y-5">
      <PageHeader
        title="Publications"
        subtitle="Journal articles, conference papers, book chapters and patents"
        action={
          <button onClick={openAdd} className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-[#0b2545] text-white text-xs font-bold rounded-md hover:bg-[#0b2545]/90">
            <Plus size={14} /> Add Publication
          </button>
        }
      />

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <Stat label="Total" value={stats.total} accent="text-[#0b2545]" />
        <Stat label="Published" value={stats.published} accent="text-[#bfa15f]" />
        <Stat label="Total Citations" value={stats.citations} accent="text-[#bfa15f]" />
        <Stat label="h-index" value={stats.hIndex} accent="text-[#0b2545]" />
      </div>

      <PortalCard className="!p-3">
        <div className="flex flex-col sm:flex-row gap-2.5">
          <div className="relative flex-1 min-w-0">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search by title or venue..." className="w-full pl-9 pr-3 py-2 text-sm border border-slate-200 rounded focus:outline-none focus:border-[#0b2545]" />
          </div>
          <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value as 'all' | Publication['venue_type'])} className="border border-slate-200 rounded px-3 py-2 text-sm bg-white focus:outline-none focus:border-[#0b2545]">
            <option value="all">All Types</option>
            {TYPES.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
          <select value={String(yearFilter)} onChange={(e) => setYearFilter(e.target.value === 'all' ? 'all' : Number(e.target.value))} className="border border-slate-200 rounded px-3 py-2 text-sm bg-white focus:outline-none focus:border-[#0b2545]">
            <option value="all">All Years</option>
            {years.map(y => <option key={y} value={y}>{y}</option>)}
          </select>
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value as 'all' | Publication['status'])} className="border border-slate-200 rounded px-3 py-2 text-sm bg-white focus:outline-none focus:border-[#0b2545]">
            <option value="all">All Statuses</option>
            {STATUSES.map(s => <option key={s} value={s}>{s[0].toUpperCase() + s.slice(1)}</option>)}
          </select>
        </div>
      </PortalCard>

      <div className="space-y-3">
        {visible.length === 0
          ? <PortalCard><p className="text-center text-sm text-slate-400 py-12">No publications match.</p></PortalCard>
          : visible.map(p => (
            <PortalCard key={p.id}>
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[#0b2545]/5 text-[#0b2545] border border-[#0b2545]/15 uppercase tracking-wide">{p.venue_type}</span>
                    <span className="text-[11px] text-slate-500 font-bold">{p.publication_year}</span>
                    <StatusPill status={p.status} />
                    {p.citation_count > 0 && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[#bfa15f]/10 text-[#bfa15f] border border-[#bfa15f]/30 uppercase tracking-wide">{p.citation_count} cites</span>
                    )}
                  </div>
                  <h4 className="text-sm font-bold text-slate-800 mt-1.5 line-clamp-2">{p.title}</h4>
                  <p className="text-[11px] text-slate-500 mt-1"><strong className="text-slate-700">{p.authors}</strong></p>
                  <p className="text-[11px] text-slate-500 italic">{p.journal_name}</p>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <IconBtn title="View" onClick={() => setViewing(p)}><Eye size={13} /></IconBtn>
                  {p.publication_link && <a href={p.publication_link} target="_blank" rel="noreferrer" title="Open link" className="p-1.5 rounded text-slate-500 hover:bg-slate-100 hover:text-[#0b2545]"><ExternalLink size={13} /></a>}
                  {p.status !== 'published' && <IconBtn title="Publish" onClick={() => publish(p.id)}><Send size={13} /></IconBtn>}
                  {p.status !== 'archived' && <IconBtn title="Archive" onClick={() => archive(p.id)}><Archive size={13} /></IconBtn>}
                  <IconBtn title="Edit" onClick={() => openEdit(p)}><Pencil size={13} /></IconBtn>
                  <IconBtn title="Delete" onClick={() => setDeleteTarget(p)}><Trash2 size={13} /></IconBtn>
                </div>
              </div>
            </PortalCard>
          ))
        }
      </div>

      <PortalModal isOpen={showForm} title={editing ? `Edit Publication — ${editing.id}` : 'Add Publication'} onClose={() => { setShowForm(false); setEditing(null) }} width="max-w-xl">
        <form onSubmit={save} className="space-y-3">
          <FormField label="Title" required><input required type="text" value={form.title} onChange={(e) => setForm(f => ({ ...f, title: e.target.value }))} className={inputCls} /></FormField>
          <FormField label="Authors (comma-separated)" required><input required type="text" value={form.authors} onChange={(e) => setForm(f => ({ ...f, authors: e.target.value }))} className={inputCls} placeholder="R. K. Pandey, P. Saxena, ..." /></FormField>
          <FormField label="Journal / Conference / Publisher"><input type="text" value={form.journal_name} onChange={(e) => setForm(f => ({ ...f, journal_name: e.target.value }))} className={inputCls} /></FormField>
          <div className="grid grid-cols-3 gap-3">
            <FormField label="Year" required>
              <input required type="number" min={1950} max={2100} value={form.publication_year} onChange={(e) => setForm(f => ({ ...f, publication_year: Number(e.target.value) }))} className={inputCls} />
            </FormField>
            <FormField label="Type">
              <select value={form.venue_type} onChange={(e) => setForm(f => ({ ...f, venue_type: e.target.value as Publication['venue_type'] }))} className={inputCls}>
                {TYPES.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </FormField>
            <FormField label="Citations">
              <input type="number" min={0} value={form.citation_count} onChange={(e) => setForm(f => ({ ...f, citation_count: Number(e.target.value) }))} className={inputCls} />
            </FormField>
          </div>
          <FormField label="Publication Link"><input type="text" value={form.publication_link} onChange={(e) => setForm(f => ({ ...f, publication_link: e.target.value }))} className={inputCls} placeholder="https://doi.org/..." /></FormField>
          <FormField label="Short Description"><textarea rows={2} value={form.description} onChange={(e) => setForm(f => ({ ...f, description: e.target.value }))} className={inputCls} /></FormField>
          <FormField label="Status">
            <select value={form.status} onChange={(e) => setForm(f => ({ ...f, status: e.target.value as Publication['status'] }))} className={inputCls}>
              {STATUSES.map(s => <option key={s} value={s}>{s[0].toUpperCase() + s.slice(1)}</option>)}
            </select>
          </FormField>
          <div className="flex gap-2.5 pt-2 border-t border-slate-100">
            <button type="button" onClick={() => { setShowForm(false); setEditing(null) }} className="flex-1 py-2 border border-slate-200 text-slate-700 text-sm font-semibold rounded hover:bg-slate-50">Cancel</button>
            <button type="submit" className="flex-1 py-2 bg-[#0b2545] text-white text-sm font-bold rounded hover:bg-[#0b2545]/90">{editing ? 'Update' : 'Add'}</button>
          </div>
        </form>
      </PortalModal>

      <PortalModal isOpen={!!viewing} title={viewing?.title ?? ''} onClose={() => setViewing(null)} width="max-w-lg">
        {viewing && (
          <div className="space-y-3">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[#0b2545]/5 text-[#0b2545] border border-[#0b2545]/15 uppercase tracking-wide">{viewing.venue_type}</span>
              <span className="text-[11px] text-slate-600 font-semibold">{viewing.publication_year}</span>
              <StatusPill status={viewing.status} />
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[#bfa15f]/10 text-[#bfa15f] border border-[#bfa15f]/30">{viewing.citation_count} cites</span>
            </div>
            <Detail label="Authors">{viewing.authors}</Detail>
            <Detail label="Venue">{viewing.journal_name}</Detail>
            <Detail label="Description"><p className="text-sm">{viewing.description}</p></Detail>
            {viewing.publication_link && (
              <a href={viewing.publication_link} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 text-xs font-bold text-[#0b2545] hover:underline">
                Open external link <ExternalLink size={12} />
              </a>
            )}
          </div>
        )}
      </PortalModal>

      <PortalModal isOpen={!!deleteTarget} title="Confirm Delete" onClose={() => setDeleteTarget(null)} width="max-w-sm">
        <div className="text-center">
          <div className="w-12 h-12 bg-[#0b2545]/10 rounded-full flex items-center justify-center mx-auto mb-3"><Trash2 size={20} className="text-[#0b2545]" /></div>
          <p className="text-sm text-slate-700">Delete this publication?</p>
          <div className="flex gap-2.5 mt-5">
            <button onClick={() => setDeleteTarget(null)} className="flex-1 py-2 border border-slate-200 text-slate-700 text-sm font-semibold rounded hover:bg-slate-50">Cancel</button>
            <button onClick={handleDelete} className="flex-1 py-2 bg-[#0b2545] text-white text-sm font-bold rounded hover:bg-[#0b2545]/90">Delete</button>
          </div>
        </div>
      </PortalModal>

      {toast && (
        <div className="fixed bottom-4 right-4 z-50 bg-[#bfa15f] text-white px-5 py-3 rounded-lg shadow-lg flex items-center gap-2 text-sm font-medium">
          <FileText size={14} /> {toast}
          <button onClick={() => setToast('')} className="ml-1"><X size={13} /></button>
        </div>
      )}
    </div>
  )
}

const computeHIndex = (cs: number[]) => {
  const sorted = [...cs].sort((a, b) => b - a)
  let h = 0
  for (let i = 0; i < sorted.length; i++) if (sorted[i] >= i + 1) h = i + 1
  return h
}

const inputCls = 'w-full border border-slate-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#0b2545] bg-white'
const FormField: React.FC<{ label: string; required?: boolean; children: React.ReactNode }> = ({ label, required, children }) => (
  <label className="block"><span className="block text-[11px] font-bold text-slate-600 uppercase tracking-wide mb-1">{label} {required && <span className="text-[#bfa15f]">*</span>}</span>{children}</label>
)
const Stat: React.FC<{ label: string; value: number; accent: string }> = ({ label, value, accent }) => (
  <PortalCard className="!p-4"><p className="text-[11px] font-bold text-slate-500 uppercase tracking-wide">{label}</p><p className={`text-2xl font-bold mt-1 ${accent}`}>{value}</p></PortalCard>
)
const IconBtn: React.FC<{ title: string; onClick: () => void; children: React.ReactNode }> = ({ title, onClick, children }) => (
  <button onClick={onClick} title={title} className="p-1.5 rounded text-slate-500 hover:bg-slate-100 hover:text-[#0b2545] transition-colors">{children}</button>
)
const Detail: React.FC<{ label: string; children: React.ReactNode }> = ({ label, children }) => (
  <div className="bg-slate-50 border border-slate-100 rounded p-2.5">
    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">{label}</p>
    <div className="text-sm font-semibold text-slate-800 mt-0.5">{children}</div>
  </div>
)
const StatusPill: React.FC<{ status: Publication['status'] }> = ({ status }) => {
  const cls = status === 'published' ? 'bg-[#bfa15f]/10 text-[#bfa15f] border-[#bfa15f]/30' :
              status === 'draft'     ? 'bg-[#0b2545]/10 text-[#0b2545] border-[#0b2545]/25' :
                                       'bg-slate-100 text-slate-500 border-slate-200'
  return <span className={`text-[10px] font-bold px-2 py-0.5 rounded border uppercase tracking-wide ${cls}`}>{status}</span>
}
export default TeacherPublications
