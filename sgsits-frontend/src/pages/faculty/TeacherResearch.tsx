import React, { useMemo, useState, useEffect } from 'react'
import { PageHeader, PortalCard, PortalModal } from '../../components/layout/PortalLayout'
import { type ResearchProject, type ResearchStatus } from '../../services/facultyService'
import { getResearchProjects, createResearchProject, updateResearchProject, deleteResearchProject } from '../../services/facultyService'
import { Plus, Pencil, Trash2, Search, FlaskConical, IndianRupee, Calendar, X, Loader2, Users, Send, Archive } from 'lucide-react'
import type { ContentStatus } from '../../services/facultyService'

const STATUSES: ResearchStatus[] = ['Proposed', 'Ongoing', 'Completed', 'On Hold']
const PUBLISH_STATUSES: ContentStatus[] = ['draft', 'published', 'archived']

const EMPTY: Omit<ResearchProject, 'id'> = {
  research_title: '', research_area: '', description: '',
  start_year: new Date().getFullYear(),
  status: 'Proposed', funding_agency: '', funding_amount_lakh: 0,
  collaborators: [], publish_status: 'draft',
}

const TeacherResearch: React.FC = () => {
  const [items,        setItems]        = useState<ResearchProject[]>([])
  const [search,       setSearch]       = useState('')
  const [statusFilter, setStatusFilter] = useState<'all' | ResearchStatus>('all')
  const [editing,      setEditing]      = useState<ResearchProject | null>(null)
  const [showForm,     setShowForm]     = useState(false)
  const [form,         setForm]         = useState<Omit<ResearchProject, 'id'>>(EMPTY)
  const [collabText,   setCollabText]   = useState('')
  const [deleteTarget, setDeleteTarget] = useState<ResearchProject | null>(null)
  const [toast,        setToast]        = useState('')
  const [loading,      setLoading]      = useState(true)
  const [saving,       setSaving]       = useState(false)

  const load = () => getResearchProjects().then(setItems).catch(() => {}).finally(() => setLoading(false))
  useEffect(() => { load() }, [])

  const visible = useMemo(() => items.filter(r => {
    if (statusFilter !== 'all' && r.status !== statusFilter) return false
    if (search.trim()) {
      const q = search.toLowerCase()
      if (!r.research_title.toLowerCase().includes(q) && !r.research_area.toLowerCase().includes(q)) return false
    }
    return true
  }).sort((a, b) => b.start_year - a.start_year), [items, statusFilter, search])

  const stats = {
    ongoing:      items.filter(i => i.status === 'Ongoing').length,
    completed:    items.filter(i => i.status === 'Completed').length,
    proposed:     items.filter(i => i.status === 'Proposed').length,
    totalFunding: items.reduce((s, r) => s + (r.funding_amount_lakh ?? 0), 0),
  }

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(''), 2400) }
  const openAdd  = () => { setEditing(null); setForm(EMPTY); setCollabText(''); setShowForm(true) }
  const openEdit = (r: ResearchProject) => { setEditing(r); setForm(r); setCollabText(r.collaborators.join('\n')); setShowForm(true) }

  const save = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.research_title.trim()) return
    setSaving(true)
    const final = { ...form, collaborators: collabText.split('\n').map(x => x.trim()).filter(Boolean) }
    try {
      if (editing) {
        await updateResearchProject(editing.id, final)
        showToast('Research project updated.')
      } else {
        await createResearchProject(final)
        showToast('Research project added.')
      }
      await load()
    } catch { showToast('Failed to save. Please try again.') }
    finally { setSaving(false); setShowForm(false); setEditing(null); setForm(EMPTY); setCollabText('') }
  }

  const handleDelete = async () => {
    if (!deleteTarget) return
    try { await deleteResearchProject(deleteTarget.id); showToast('Deleted.'); await load() }
    catch { showToast('Failed to delete.') }
    setDeleteTarget(null)
  }

  const publish = async (id: string) => {
    try { await updateResearchProject(id, { publish_status: 'published' }); showToast('Published.'); await load() }
    catch { showToast('Failed to publish.') }
  }

  const archive = async (id: string) => {
    try { await updateResearchProject(id, { publish_status: 'archived' }); showToast('Archived.'); await load() }
    catch { showToast('Failed to archive.') }
  }

  return (
    <div className="space-y-5">
      <PageHeader
        title="Research Work"
        subtitle="Track ongoing, proposed and completed research projects"
        action={
          <button onClick={openAdd} className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-primary text-white text-xs font-bold rounded-md hover:bg-primary/90">
            <Plus size={14} /> Add Project
          </button>
        }
      />

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <Stat label="Ongoing" value={stats.ongoing} accent="text-accent" />
        <Stat label="Completed" value={stats.completed} accent="text-primary" />
        <Stat label="Proposed" value={stats.proposed} accent="text-accent" />
        <Stat label="Total Funding" value={`₹${stats.totalFunding}L`} accent="text-primary" />
      </div>

      <PortalCard className="!p-3">
        <div className="flex flex-col sm:flex-row gap-2.5">
          <div className="relative flex-1 min-w-0">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search by title or area..." className="w-full pl-9 pr-3 py-2 text-sm border border-slate-200 rounded focus:outline-none focus:border-primary" />
          </div>
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value as 'all' | ResearchStatus)} className="border border-slate-200 rounded px-3 py-2 text-sm bg-white focus:outline-none focus:border-primary">
            <option value="all">All Statuses</option>
            {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
      </PortalCard>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {visible.length === 0
          ? <PortalCard className="col-span-full"><p className="text-center text-sm text-slate-400 py-12">No research projects match.</p></PortalCard>
          : visible.map(r => (
            <PortalCard key={r.id}>
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-lg bg-accent/10 border border-accent/30 flex items-center justify-center shrink-0">
                  <FlaskConical size={16} className="text-accent" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <ProjectStatusPill status={r.status} />
                    <span className="text-xs font-bold px-2 py-0.5 rounded bg-primary/5 text-primary border border-primary/15 uppercase tracking-wide">{r.research_area}</span>
                  </div>
                  <h4 className="text-sm font-bold text-slate-800 mt-1.5">{r.research_title}</h4>
                  <p className="text-xs text-slate-500 mt-1 line-clamp-2">{r.description}</p>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2 mt-3">
                <Mini icon={Calendar} label="Duration">{r.start_year}{r.end_year ? ` – ${r.end_year}` : ' – ongoing'}</Mini>
                <Mini icon={IndianRupee} label="Funding">{r.funding_amount_lakh ? `₹${r.funding_amount_lakh}L` : '—'}</Mini>
                <Mini icon={Users} label="Collaborators">{r.collaborators.length}</Mini>
              </div>

              {r.funding_agency && (
                <p className="text-xs text-slate-500 mt-3 pt-3 border-t border-slate-100">
                  <strong className="text-slate-700">Funding agency:</strong> {r.funding_agency}
                </p>
              )}

              {r.collaborators.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {(r.collaborators ?? []).map((c, i) => (
                    <span key={i} className="text-xs bg-slate-50 border border-slate-200 text-slate-700 px-2 py-0.5 rounded">{c}</span>
                  ))}
                </div>
              )}

              <div className="flex items-center gap-1 mt-3 pt-3 border-t border-slate-100">
                <StatusPill status={r.publish_status} />
                <div className="ml-auto flex items-center gap-1">
                  {r.publish_status !== 'published' && <IconBtn title="Publish" onClick={() => publish(r.id)}><Send size={12} /></IconBtn>}
                  {r.publish_status !== 'archived' && <IconBtn title="Archive" onClick={() => archive(r.id)}><Archive size={12} /></IconBtn>}
                  <IconBtn title="Edit" onClick={() => openEdit(r)}><Pencil size={12} /></IconBtn>
                  <IconBtn title="Delete" onClick={() => setDeleteTarget(r)}><Trash2 size={12} /></IconBtn>
                </div>
              </div>
            </PortalCard>
          ))
        }
      </div>

      <PortalModal isOpen={showForm} title={editing ? `Edit Research — ${editing.id}` : 'Add Research Project'} onClose={() => { setShowForm(false); setEditing(null) }} width="max-w-xl">
        <form onSubmit={save} className="space-y-3">
          <FormField label="Project Title" required>
            <input required type="text" value={form.research_title} onChange={(e) => setForm(f => ({ ...f, research_title: e.target.value }))} className={inputCls} />
          </FormField>
          <div className="grid grid-cols-2 gap-3">
            <FormField label="Research Area" required>
              <input required type="text" value={form.research_area} onChange={(e) => setForm(f => ({ ...f, research_area: e.target.value }))} className={inputCls} placeholder="e.g. Edge Computing" />
            </FormField>
            <FormField label="Status">
              <select value={form.status} onChange={(e) => setForm(f => ({ ...f, status: e.target.value as ResearchStatus }))} className={inputCls}>
                {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </FormField>
          </div>
          <FormField label="Description"><textarea rows={3} value={form.description} onChange={(e) => setForm(f => ({ ...f, description: e.target.value }))} className={inputCls} /></FormField>
          <div className="grid grid-cols-2 gap-3">
            <FormField label="Start Year" required>
              <input required type="number" min={1990} max={2100} value={form.start_year} onChange={(e) => setForm(f => ({ ...f, start_year: Number(e.target.value) }))} className={inputCls} />
            </FormField>
            <FormField label="End Year (optional)">
              <input type="number" min={1990} max={2100} value={form.end_year ?? ''} onChange={(e) => setForm(f => ({ ...f, end_year: e.target.value ? Number(e.target.value) : undefined }))} className={inputCls} />
            </FormField>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <FormField label="Funding Agency"><input type="text" value={form.funding_agency ?? ''} onChange={(e) => setForm(f => ({ ...f, funding_agency: e.target.value }))} className={inputCls} placeholder="e.g. DST" /></FormField>
            <FormField label="Funding (in lakh ₹)">
              <input type="number" min={0} value={form.funding_amount_lakh ?? 0} onChange={(e) => setForm(f => ({ ...f, funding_amount_lakh: Number(e.target.value) }))} className={inputCls} />
            </FormField>
          </div>
          <FormField label="Collaborators (one per line)">
            <textarea rows={3} value={collabText} onChange={(e) => setCollabText(e.target.value)} className={`${inputCls} font-mono text-xs`} placeholder={'Dr. Priya Saxena (Co-PI)\nIIT Indore\n...'} />
          </FormField>
          <FormField label="Publish Status">
            <select value={form.publish_status} onChange={(e) => setForm(f => ({ ...f, publish_status: e.target.value as ResearchProject['publish_status'] }))} className={inputCls}>
              {PUBLISH_STATUSES.map(s => <option key={s} value={s}>{s[0].toUpperCase() + s.slice(1)}</option>)}
            </select>
          </FormField>
          <div className="flex gap-2.5 pt-2 border-t border-slate-100">
            <button type="button" onClick={() => { setShowForm(false); setEditing(null) }} className="flex-1 py-2 border border-slate-200 text-slate-700 text-sm font-semibold rounded hover:bg-slate-50">Cancel</button>
            <button type="submit" disabled={saving} className="flex-1 py-2 bg-primary text-white text-sm font-bold rounded hover:bg-primary/90 disabled:opacity-50 inline-flex items-center justify-center gap-1.5">
              {saving && <Loader2 size={13} className="animate-spin" />}{editing ? 'Update' : 'Add'}
            </button>
          </div>
        </form>
      </PortalModal>

      <PortalModal isOpen={!!deleteTarget} title="Confirm Delete" onClose={() => setDeleteTarget(null)} width="max-w-sm">
        <div className="text-center">
          <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3"><Trash2 size={20} className="text-primary" /></div>
          <p className="text-sm text-slate-700">Delete "<strong>{deleteTarget?.research_title}</strong>"?</p>
          <div className="flex gap-2.5 mt-5">
            <button onClick={() => setDeleteTarget(null)} className="flex-1 py-2 border border-slate-200 text-slate-700 text-sm font-semibold rounded hover:bg-slate-50">Cancel</button>
            <button onClick={handleDelete} className="flex-1 py-2 bg-primary text-white text-sm font-bold rounded hover:bg-primary/90">Delete</button>
          </div>
        </div>
      </PortalModal>

      {toast && (
        <div className="fixed bottom-4 right-4 z-50 bg-accent text-white px-5 py-3 rounded-lg shadow-lg flex items-center gap-2 text-sm font-medium">
          <FlaskConical size={14} /> {toast}
          <button onClick={() => setToast('')} className="ml-1"><X size={13} /></button>
        </div>
      )}
    </div>
  )
}

const inputCls = 'w-full border border-slate-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-primary bg-white'
const FormField: React.FC<{ label: string; required?: boolean; children: React.ReactNode }> = ({ label, required, children }) => (
  <label className="block"><span className="block text-xs font-bold text-slate-600 uppercase tracking-wide mb-1">{label} {required && <span className="text-accent">*</span>}</span>{children}</label>
)
const Stat: React.FC<{ label: string; value: number | string; accent: string }> = ({ label, value, accent }) => (
  <PortalCard className="!p-4"><p className="text-xs font-bold text-slate-500 uppercase tracking-wide">{label}</p><p className={`text-2xl font-bold mt-1 ${accent}`}>{value}</p></PortalCard>
)
const Mini: React.FC<{ icon: React.ComponentType<{ size?: number; className?: string }>; label: string; children: React.ReactNode }> = ({ icon: Icon, label, children }) => (
  <div className="bg-slate-50 border border-slate-100 rounded p-2">
    <p className="flex items-center gap-1 text-xs font-bold text-slate-500 uppercase tracking-wider"><Icon size={10} className="text-accent" />{label}</p>
    <p className="text-xs font-bold text-slate-800 mt-0.5 truncate">{children}</p>
  </div>
)
const IconBtn: React.FC<{ title: string; onClick: () => void; children: React.ReactNode }> = ({ title, onClick, children }) => (
  <button onClick={onClick} title={title} className="p-1.5 rounded text-slate-500 hover:bg-slate-100 hover:text-primary transition-colors">{children}</button>
)
const ProjectStatusPill: React.FC<{ status: ResearchStatus }> = ({ status }) => {
  const cls = status === 'Ongoing'   ? 'bg-accent/15 text-accent border-accent/40' :
              status === 'Completed' ? 'bg-accent/10 text-accent border-accent/30' :
              status === 'Proposed'  ? 'bg-primary/10 text-primary border-primary/25' :
                                       'bg-slate-100 text-slate-500 border-slate-200'
  return <span className={`text-xs font-bold px-2 py-0.5 rounded border uppercase tracking-wide ${cls}`}>{status}</span>
}
const StatusPill: React.FC<{ status: ResearchProject['publish_status'] }> = ({ status }) => {
  const cls = status === 'published' ? 'bg-accent/10 text-accent border-accent/30' :
              status === 'draft'     ? 'bg-primary/10 text-primary border-primary/25' :
                                       'bg-slate-100 text-slate-500 border-slate-200'
  return <span className={`text-xs font-bold px-2 py-0.5 rounded border uppercase tracking-wide ${cls}`}>{status}</span>
}

export default TeacherResearch
