import React, { useMemo, useState, useEffect } from 'react'
import { PageHeader, PortalCard, PortalModal } from '../../components/layout/PortalLayout'
import { type Qualification } from '../../services/facultyService'
import { getQualifications, createQualification, updateQualification, deleteQualification } from '../../services/facultyService'
import { Plus, Pencil, Trash2, GraduationCap, X, Calendar, Loader2 } from 'lucide-react'
import type { ContentStatus } from '../../services/facultyService'

const STATUSES: ContentStatus[] = ['draft', 'published', 'archived']

const EMPTY: Omit<Qualification, 'id'> = {
  degree: '', institution: '', year: new Date().getFullYear(),
  specialization: '', grade: '', status: 'published',
}

const TeacherQualifications: React.FC = () => {
  const [items,        setItems]        = useState<Qualification[]>([])
  const [editing,      setEditing]      = useState<Qualification | null>(null)
  const [showForm,     setShowForm]     = useState(false)
  const [form,         setForm]         = useState<Omit<Qualification, 'id'>>(EMPTY)
  const [deleteTarget, setDeleteTarget] = useState<Qualification | null>(null)
  const [toast,        setToast]        = useState('')
  const [loading,      setLoading]      = useState(true)
  const [saving,       setSaving]       = useState(false)

  const load = () => getQualifications().then(setItems).catch(() => {}).finally(() => setLoading(false))
  useEffect(() => { load() }, [])

  const sorted = useMemo(() => [...items].sort((a, b) => b.year - a.year), [items])

  const stats = {
    total:   items.length,
    highest: items.find(i => i.degree.toLowerCase().includes('ph.d')) ? 'Ph.D.' : items[0]?.degree ?? '—',
  }

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(''), 2400) }
  const openAdd  = () => { setEditing(null); setForm(EMPTY); setShowForm(true) }
  const openEdit = (q: Qualification) => { setEditing(q); setForm(q); setShowForm(true) }

  const save = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.degree.trim()) return
    setSaving(true)
    try {
      if (editing) {
        await updateQualification(editing.id, form)
        showToast('Qualification updated.')
      } else {
        await createQualification(form)
        showToast('Qualification added.')
      }
      await load()
    } catch { showToast('Failed to save. Please try again.') }
    finally { setSaving(false); setShowForm(false); setEditing(null); setForm(EMPTY) }
  }

  const handleDelete = async () => {
    if (!deleteTarget) return
    try {
      await deleteQualification(deleteTarget.id)
      showToast('Deleted.')
      await load()
    } catch { showToast('Failed to delete.') }
    setDeleteTarget(null)
  }

  return (
    <div className="space-y-5">
      <PageHeader
        title="Qualifications"
        subtitle="Degrees, certifications and professional credentials"
        action={
          <button onClick={openAdd} className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-primary text-white text-xs font-bold rounded-md hover:bg-primary/90">
            <Plus size={14} /> Add Qualification
          </button>
        }
      />

      <div className="grid grid-cols-2 sm:grid-cols-2 gap-3">
        <Stat label="Total" value={stats.total} accent="text-primary" />
        <Stat label="Highest Degree" value={stats.highest} accent="text-accent" />
      </div>

      {loading ? (
        <PortalCard><div className="flex justify-center py-12"><Loader2 size={24} className="animate-spin text-slate-300" /></div></PortalCard>
      ) : sorted.length === 0
        ? <PortalCard><p className="text-center text-sm text-slate-400 py-12">No qualifications added.</p></PortalCard>
        : (
          <PortalCard>
            <div className="relative pl-8 space-y-4">
              <div className="absolute left-3 top-2 bottom-2 w-0.5 bg-accent/30" />
              {sorted.map(q => (
                <div key={q.id} className="relative">
                  <div className="absolute -left-7 top-1 w-5 h-5 rounded-full bg-white border-2 border-accent flex items-center justify-center">
                    <GraduationCap size={9} className="text-accent" />
                  </div>
                  <div className="bg-slate-50 border border-slate-100 rounded-lg p-4 hover:border-slate-300 transition-colors">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-xs font-bold px-2 py-0.5 rounded bg-primary/10 text-primary border border-primary/25 uppercase tracking-wide">{q.degree}</span>
                          <span className="text-xs text-slate-500 font-semibold inline-flex items-center gap-1"><Calendar size={10} className="text-accent" /> {q.year}</span>
                          <StatusPill status={q.status} />
                        </div>
                        <h4 className="text-sm font-bold text-slate-800 mt-1.5">{q.institution}</h4>
                        <p className="text-xs text-slate-600 mt-1">{q.specialization}</p>
                        <p className="text-xs text-accent font-bold mt-1">Grade: {q.grade}</p>
                      </div>
                      <div className="flex items-center gap-1 shrink-0">
                        <IconBtn title="Edit"   onClick={() => openEdit(q)}><Pencil size={12} /></IconBtn>
                        <IconBtn title="Delete" onClick={() => setDeleteTarget(q)}><Trash2 size={12} /></IconBtn>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </PortalCard>
        )
      }

      <PortalModal isOpen={showForm} title={editing ? `Edit Qualification — ${editing.id}` : 'Add Qualification'} onClose={() => { setShowForm(false); setEditing(null) }} width="max-w-md">
        <form onSubmit={save} className="space-y-3">
          <FormField label="Degree / Certification" required>
            <input required type="text" value={form.degree} onChange={(e) => setForm(f => ({ ...f, degree: e.target.value }))} className={inputCls} placeholder="e.g. Ph.D., M.Tech., NPTEL" />
          </FormField>
          <FormField label="Institution" required>
            <input required type="text" value={form.institution} onChange={(e) => setForm(f => ({ ...f, institution: e.target.value }))} className={inputCls} placeholder="e.g. IIT Bombay" />
          </FormField>
          <div className="grid grid-cols-2 gap-3">
            <FormField label="Year" required>
              <input required type="number" min={1950} max={2100} value={form.year} onChange={(e) => setForm(f => ({ ...f, year: Number(e.target.value) }))} className={inputCls} />
            </FormField>
            <FormField label="Status">
              <select value={form.status} onChange={(e) => setForm(f => ({ ...f, status: e.target.value as Qualification['status'] }))} className={inputCls}>
                {STATUSES.map(s => <option key={s} value={s}>{s[0].toUpperCase() + s.slice(1)}</option>)}
              </select>
            </FormField>
          </div>
          <FormField label="Specialization / Stream">
            <input type="text" value={form.specialization} onChange={(e) => setForm(f => ({ ...f, specialization: e.target.value }))} className={inputCls} />
          </FormField>
          <FormField label="Grade / Score">
            <input type="text" value={form.grade} onChange={(e) => setForm(f => ({ ...f, grade: e.target.value }))} className={inputCls} placeholder="e.g. 9.2 / 10.0 CGPA, First Class with Distinction" />
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
          <p className="text-sm text-slate-700">Delete "<strong>{deleteTarget?.degree}</strong>" from your record?</p>
          <div className="flex gap-2.5 mt-5">
            <button onClick={() => setDeleteTarget(null)} className="flex-1 py-2 border border-slate-200 text-slate-700 text-sm font-semibold rounded hover:bg-slate-50">Cancel</button>
            <button onClick={handleDelete} className="flex-1 py-2 bg-primary text-white text-sm font-bold rounded hover:bg-primary/90">Delete</button>
          </div>
        </div>
      </PortalModal>

      {toast && (
        <div className="fixed bottom-4 right-4 z-50 bg-accent text-white px-5 py-3 rounded-lg shadow-lg flex items-center gap-2 text-sm font-medium">
          <GraduationCap size={14} /> {toast}
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
const IconBtn: React.FC<{ title: string; onClick: () => void; children: React.ReactNode }> = ({ title, onClick, children }) => (
  <button onClick={onClick} title={title} className="p-1.5 rounded text-slate-500 hover:bg-slate-100 hover:text-primary transition-colors">{children}</button>
)
const StatusPill: React.FC<{ status: Qualification['status'] }> = ({ status }) => {
  const cls = status === 'published' ? 'bg-accent/10 text-accent border-accent/30' :
              status === 'draft'     ? 'bg-primary/10 text-primary border-primary/25' :
                                       'bg-slate-100 text-slate-500 border-slate-200'
  return <span className={`text-xs font-bold px-2 py-0.5 rounded border uppercase tracking-wide ${cls}`}>{status}</span>
}

export default TeacherQualifications
