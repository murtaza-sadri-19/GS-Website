import React, { useMemo, useState } from 'react'
import { PageHeader, PortalCard, PortalModal } from '../../components/layout/PortalLayout'
import { HOD_ACHIEVEMENTS, type HodAchievement } from '../../data/mockHodContent'
import { Plus, Pencil, Trash2, Search, Award, X, Send, Archive, ExternalLink, Trophy } from 'lucide-react'

const CATEGORIES: HodAchievement['category'][] = ['Student', 'Faculty', 'Department', 'Alumni', 'Research']
const STATUSES: HodAchievement['status'][] = ['draft', 'published', 'archived']

const EMPTY: Omit<HodAchievement, 'id'> = {
  title: '', description: '', achievement_date: new Date().toISOString().slice(0, 10),
  category: 'Student', image_url: '', link_url: '', status: 'draft',
}

const HodAchievements: React.FC = () => {
  const [items, setItems] = useState<HodAchievement[]>(HOD_ACHIEVEMENTS)
  const [search, setSearch] = useState('')
  const [catFilter, setCatFilter] = useState<'all' | HodAchievement['category']>('all')
  const [statusFilter, setStatusFilter] = useState<'all' | HodAchievement['status']>('all')
  const [editing, setEditing] = useState<HodAchievement | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState<Omit<HodAchievement, 'id'>>(EMPTY)
  const [deleteTarget, setDeleteTarget] = useState<HodAchievement | null>(null)
  const [toast, setToast] = useState('')

  const visible = useMemo(() => items.filter(a => {
    if (catFilter !== 'all' && a.category !== catFilter) return false
    if (statusFilter !== 'all' && a.status !== statusFilter) return false
    if (search.trim() && !a.title.toLowerCase().includes(search.toLowerCase())) return false
    return true
  }).sort((a, b) => b.achievement_date.localeCompare(a.achievement_date)), [items, catFilter, statusFilter, search])

  const stats = {
    total: items.length,
    published: items.filter(i => i.status === 'published').length,
    student: items.filter(i => i.category === 'Student').length,
    faculty: items.filter(i => i.category === 'Faculty').length,
  }

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(''), 2400) }
  const openAdd = () => { setEditing(null); setForm(EMPTY); setShowForm(true) }
  const openEdit = (a: HodAchievement) => { setEditing(a); setForm(a); setShowForm(true) }

  const save = (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.title.trim()) return
    if (editing) {
      setItems(prev => prev.map(a => a.id === editing.id ? { ...editing, ...form } : a))
      showToast(`Achievement updated.`)
    } else {
      const id = `AC${String(items.length + 1).padStart(3, '0')}`
      setItems(prev => [{ id, ...form }, ...prev])
      showToast(`Achievement added.`)
    }
    setShowForm(false); setEditing(null); setForm(EMPTY)
  }
  const publish = (id: string) => { setItems(prev => prev.map(a => a.id === id ? { ...a, status: 'published' } : a)); showToast('Achievement published.') }
  const archive = (id: string) => { setItems(prev => prev.map(a => a.id === id ? { ...a, status: 'archived' } : a)); showToast('Achievement archived.') }
  const handleDelete = () => { if (!deleteTarget) return; setItems(prev => prev.filter(a => a.id !== deleteTarget.id)); showToast('Deleted.'); setDeleteTarget(null) }

  const catBadge = (c: HodAchievement['category']) => {
    const m: Record<HodAchievement['category'], string> = {
      Student:    'bg-[#bfa15f]/15 text-[#bfa15f] border-[#bfa15f]/30',
      Faculty:    'bg-[#0b2545]/10 text-[#0b2545] border-[#0b2545]/25',
      Department: 'bg-[#bfa15f]/10 text-[#bfa15f] border-[#bfa15f]/30',
      Alumni:     'bg-[#0b2545]/15 text-[#0b2545] border-[#0b2545]/30',
      Research:   'bg-[#0b2545]/5 text-[#0b2545] border-[#0b2545]/15',
    }
    return m[c]
  }

  return (
    <div className="space-y-5">
      <PageHeader
        title="Department Achievements"
        subtitle="Highlight student, faculty, research and alumni accomplishments"
        action={
          <button onClick={openAdd} className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-[#0b2545] text-white text-xs font-bold rounded-md hover:bg-[#0b2545]/90 transition-colors">
            <Plus size={14} /> Add Achievement
          </button>
        }
      />

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <Stat label="Total" value={stats.total} accent="text-[#0b2545]" />
        <Stat label="Published" value={stats.published} accent="text-[#bfa15f]" />
        <Stat label="Student" value={stats.student} accent="text-[#bfa15f]" />
        <Stat label="Faculty" value={stats.faculty} accent="text-[#0b2545]" />
      </div>

      <PortalCard className="!p-3">
        <div className="flex flex-col sm:flex-row gap-2.5">
          <div className="relative flex-1 min-w-0">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search achievements..." className="w-full pl-9 pr-3 py-2 text-sm border border-slate-200 rounded focus:outline-none focus:border-[#0b2545]" />
          </div>
          <select value={catFilter} onChange={(e) => setCatFilter(e.target.value as 'all' | HodAchievement['category'])} className="border border-slate-200 rounded px-3 py-2 text-sm bg-white focus:outline-none focus:border-[#0b2545]">
            <option value="all">All Categories</option>
            {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value as 'all' | HodAchievement['status'])} className="border border-slate-200 rounded px-3 py-2 text-sm bg-white focus:outline-none focus:border-[#0b2545]">
            <option value="all">All Statuses</option>
            {STATUSES.map(s => <option key={s} value={s}>{s[0].toUpperCase() + s.slice(1)}</option>)}
          </select>
        </div>
      </PortalCard>

      {visible.length === 0 ? (
        <PortalCard><p className="text-center text-sm text-slate-400 py-12">No achievements match the filters.</p></PortalCard>
      ) : (
        <PortalCard>
          <div className="relative pl-8 space-y-5">
            <div className="absolute left-3 top-2 bottom-2 w-0.5 bg-[#bfa15f]/30" />
            {visible.map(a => (
              <div key={a.id} className="relative">
                <div className="absolute -left-7 top-1 w-5 h-5 rounded-full bg-white border-2 border-[#bfa15f] flex items-center justify-center">
                  <Trophy size={9} className="text-[#bfa15f]" />
                </div>
                <div className="bg-slate-50 border border-slate-100 rounded-lg p-4 hover:border-slate-300 transition-colors">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded border uppercase tracking-wide ${catBadge(a.category)}`}>{a.category}</span>
                        <span className="text-[11px] text-slate-500 font-medium">{a.achievement_date}</span>
                        <StatusPill status={a.status} />
                      </div>
                      <h4 className="text-sm font-bold text-slate-800 mt-2">{a.title}</h4>
                      <p className="text-xs text-slate-600 mt-1 leading-relaxed">{a.description}</p>
                      {a.link_url && (
                        <a href={a.link_url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-[11px] text-[#0b2545] font-bold hover:underline mt-2">
                          Reference link <ExternalLink size={10} />
                        </a>
                      )}
                    </div>
                    <div className="flex items-center gap-1 shrink-0">
                      {a.status !== 'published' && <IconBtn title="Publish" onClick={() => publish(a.id)}><Send size={12} /></IconBtn>}
                      {a.status !== 'archived' && <IconBtn title="Archive" onClick={() => archive(a.id)}><Archive size={12} /></IconBtn>}
                      <IconBtn title="Edit" onClick={() => openEdit(a)}><Pencil size={12} /></IconBtn>
                      <IconBtn title="Delete" onClick={() => setDeleteTarget(a)}><Trash2 size={12} /></IconBtn>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </PortalCard>
      )}

      <PortalModal isOpen={showForm} title={editing ? `Edit Achievement — ${editing.id}` : 'Add Achievement'} onClose={() => { setShowForm(false); setEditing(null) }} width="max-w-lg">
        <form onSubmit={save} className="space-y-3">
          <FormField label="Title" required>
            <input required type="text" value={form.title} onChange={(e) => setForm(f => ({ ...f, title: e.target.value }))} className={inputCls} />
          </FormField>
          <FormField label="Description"><textarea rows={3} value={form.description} onChange={(e) => setForm(f => ({ ...f, description: e.target.value }))} className={inputCls} /></FormField>
          <div className="grid grid-cols-2 gap-3">
            <FormField label="Category">
              <select value={form.category} onChange={(e) => setForm(f => ({ ...f, category: e.target.value as HodAchievement['category'] }))} className={inputCls}>
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </FormField>
            <FormField label="Achievement Date" required>
              <input required type="date" value={form.achievement_date} onChange={(e) => setForm(f => ({ ...f, achievement_date: e.target.value }))} className={inputCls} />
            </FormField>
          </div>
          <FormField label="Image URL (optional)"><input type="text" value={form.image_url ?? ''} onChange={(e) => setForm(f => ({ ...f, image_url: e.target.value }))} className={inputCls} /></FormField>
          <FormField label="Reference Link (optional)"><input type="text" value={form.link_url ?? ''} onChange={(e) => setForm(f => ({ ...f, link_url: e.target.value }))} className={inputCls} placeholder="https://..." /></FormField>
          <FormField label="Status">
            <select value={form.status} onChange={(e) => setForm(f => ({ ...f, status: e.target.value as HodAchievement['status'] }))} className={inputCls}>
              {STATUSES.map(s => <option key={s} value={s}>{s[0].toUpperCase() + s.slice(1)}</option>)}
            </select>
          </FormField>
          <div className="flex gap-2.5 pt-2 border-t border-slate-100">
            <button type="button" onClick={() => { setShowForm(false); setEditing(null) }} className="flex-1 py-2 border border-slate-200 text-slate-700 text-sm font-semibold rounded hover:bg-slate-50">Cancel</button>
            <button type="submit" className="flex-1 py-2 bg-[#0b2545] text-white text-sm font-bold rounded hover:bg-[#0b2545]/90">{editing ? 'Update' : 'Add'}</button>
          </div>
        </form>
      </PortalModal>

      <PortalModal isOpen={!!deleteTarget} title="Confirm Delete" onClose={() => setDeleteTarget(null)} width="max-w-sm">
        <div className="text-center">
          <div className="w-12 h-12 bg-[#0b2545]/10 rounded-full flex items-center justify-center mx-auto mb-3"><Trash2 size={20} className="text-[#0b2545]" /></div>
          <p className="text-sm text-slate-700">Delete "<strong>{deleteTarget?.title}</strong>"?</p>
          <div className="flex gap-2.5 mt-5">
            <button onClick={() => setDeleteTarget(null)} className="flex-1 py-2 border border-slate-200 text-slate-700 text-sm font-semibold rounded hover:bg-slate-50">Cancel</button>
            <button onClick={handleDelete} className="flex-1 py-2 bg-[#0b2545] text-white text-sm font-bold rounded hover:bg-[#0b2545]/90">Delete</button>
          </div>
        </div>
      </PortalModal>

      {toast && (
        <div className="fixed bottom-4 right-4 z-50 bg-[#bfa15f] text-white px-5 py-3 rounded-lg shadow-lg flex items-center gap-2 text-sm font-medium">
          <Award size={14} /> {toast}
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
const Stat: React.FC<{ label: string; value: number; accent: string }> = ({ label, value, accent }) => (
  <PortalCard className="!p-4"><p className="text-[11px] font-bold text-slate-500 uppercase tracking-wide">{label}</p><p className={`text-2xl font-bold mt-1 ${accent}`}>{value}</p></PortalCard>
)
const IconBtn: React.FC<{ title: string; onClick: () => void; children: React.ReactNode }> = ({ title, onClick, children }) => (
  <button onClick={onClick} title={title} className="p-1.5 rounded text-slate-500 hover:bg-slate-100 hover:text-[#0b2545] transition-colors">{children}</button>
)
const StatusPill: React.FC<{ status: HodAchievement['status'] }> = ({ status }) => {
  const cls = status === 'published' ? 'bg-[#bfa15f]/10 text-[#bfa15f] border-[#bfa15f]/30' :
              status === 'draft'     ? 'bg-[#0b2545]/10 text-[#0b2545] border-[#0b2545]/25' :
                                       'bg-slate-100 text-slate-500 border-slate-200'
  return <span className={`text-[10px] font-bold px-2 py-0.5 rounded border uppercase tracking-wide ${cls}`}>{status}</span>
}

export default HodAchievements
