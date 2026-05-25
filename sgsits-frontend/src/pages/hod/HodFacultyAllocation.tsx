import React, { useEffect, useMemo, useState } from 'react'
import { PageHeader, PortalCard, PortalModal } from '../../components/layout/PortalLayout'
import { Search, Users, X, Save, BookOpen, AlertCircle } from 'lucide-react'
import { useAdminStore } from '../../store/adminStore'
import {
  getSubjects, getFacultyMembers, assignFacultyToSubject,
  type Subject, type FacultyMember,
} from '../../services/examService'

interface Allocation {
  subjectId: string
  primary?: string         // faculty id
  secondary?: string       // faculty id
  section?: 'A' | 'B' | 'all'
}

const HodFacultyAllocation: React.FC = () => {
  const { user } = useAdminStore()
  const deptId = user?.department_id ? String(user.department_id) : undefined

  const [branchSubjects, setBranchSubjects] = useState<Subject[]>([])
  const [branchFaculty,  setBranchFaculty]  = useState<FacultyMember[]>([])

  // Load subjects and faculty from backend on mount
  useEffect(() => {
    let alive = true
    Promise.all([
      getSubjects(deptId),
      getFacultyMembers(deptId),
    ]).then(([subs, fac]) => {
      if (!alive) return
      setBranchSubjects(subs)
      setBranchFaculty(fac)
      // Seed allocations from loaded subjects
      setAllocations(prev => {
        const next = { ...prev }
        subs.forEach(s => {
          if (!next[s.id]) next[s.id] = { subjectId: s.id, section: 'all' }
        })
        return next
      })
    }).catch(console.error)
    return () => { alive = false }
  }, [deptId])

  const [allocations, setAllocations] = useState<Record<string, Allocation>>({})
  const [search, setSearch] = useState('')
  const [semFilter, setSemFilter] = useState<'all' | number>('all')
  const [editing, setEditing] = useState<Subject | null>(null)
  const [form, setForm] = useState<Allocation>({ subjectId: '' })
  const [toast, setToast] = useState('')

  const visible = useMemo(() => branchSubjects.filter(s => {
    if (semFilter !== 'all' && s.semester !== semFilter) return false
    if (search.trim()) {
      const q = search.toLowerCase()
      if (!s.id.toLowerCase().includes(q) && !s.name.toLowerCase().includes(q)) return false
    }
    return true
  }), [branchSubjects, semFilter, search])

  const stats = {
    total: branchSubjects.length,
    allocated: Object.values(allocations).filter(a => a.primary).length,
    fullyAllocated: Object.values(allocations).filter(a => a.primary && a.secondary).length,
    unassigned: branchSubjects.length - Object.values(allocations).filter(a => a.primary).length,
  }

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(''), 2400) }

  const openEdit = (s: Subject) => {
    setEditing(s)
    setForm(allocations[s.id] ?? { subjectId: s.id })
  }

  const save = async () => {
    if (!editing) return
    if (form.primary && form.secondary && form.primary === form.secondary) {
      showToast('Primary and secondary faculty must differ.')
      return
    }
    // Optimistically update local state
    setAllocations(prev => ({ ...prev, [editing.id]: { ...form, subjectId: editing.id } }))

    // Persist to backend via examService
    try {
      const facultyIds = [
        ...(form.primary   ? [Number(form.primary)]   : []),
        ...(form.secondary ? [Number(form.secondary)] : []),
      ]
      if (facultyIds.length > 0) {
        await assignFacultyToSubject(
          editing.id,
          facultyIds,
          { sectionId: form.section !== 'all' ? form.section : undefined }
        )
      }
      showToast(`Allocation saved for ${editing.id}.`)
    } catch {
      showToast(`Saved locally — backend sync pending.`)
    }
    setEditing(null)
  }

  const fname = (id?: string) => id ? branchFaculty.find(f => f.id === id)?.name ?? '—' : '—'

  return (
    <div className="space-y-5">
      <PageHeader
        title="Faculty Allocation"
        subtitle="Assign primary and secondary faculty to subjects (per session)"
      />

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <Stat label="Subjects" value={stats.total} accent="text-[#0b2545]" />
        <Stat label="Allocated" value={stats.allocated} accent="text-[#bfa15f]" />
        <Stat label="With Backup" value={stats.fullyAllocated} accent="text-[#bfa15f]" />
        <Stat label="Unassigned" value={stats.unassigned} accent="text-[#0b2545]" />
      </div>

      <PortalCard className="!p-3">
        <div className="flex flex-col sm:flex-row gap-2.5">
          <div className="relative flex-1 min-w-0">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search by subject code or name..." className="w-full pl-9 pr-3 py-2 text-sm border border-slate-200 rounded focus:outline-none focus:border-[#0b2545]" />
          </div>
          <select value={String(semFilter)} onChange={(e) => setSemFilter(e.target.value === 'all' ? 'all' : Number(e.target.value))} className="border border-slate-200 rounded px-3 py-2 text-sm bg-white focus:outline-none focus:border-[#0b2545]">
            <option value="all">All Semesters</option>
            {[1, 2, 3, 4, 5, 6, 7, 8].map(s => <option key={s} value={s}>Semester {s}</option>)}
          </select>
        </div>
      </PortalCard>

      <PortalCard className="!p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead><tr className="bg-slate-50 border-b border-slate-200">
              {['Subject', 'Type', 'Sem', 'Primary Faculty', 'Secondary Faculty', 'Section', 'Action'].map(h => (
                <th key={h} className="text-left px-4 py-3 text-[11px] font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap">{h}</th>
              ))}
            </tr></thead>
            <tbody className="divide-y divide-slate-100">
              {visible.length === 0 ? <tr><td colSpan={7} className="px-4 py-8 text-center text-sm text-slate-400">No subjects match.</td></tr> :
                visible.map(s => {
                  const a = allocations[s.id]
                  return (
                    <tr key={s.id} className="hover:bg-slate-50/60">
                      <td className="px-4 py-2.5">
                        <p className="text-xs font-mono font-bold text-[#0b2545]">{s.id}</p>
                        <p className="text-[11px] text-slate-500">{s.name}</p>
                      </td>
                      <td className="px-4 py-2.5"><span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[#0b2545]/5 text-[#0b2545] border border-[#0b2545]/15 uppercase tracking-wide">{s.type}</span></td>
                      <td className="px-4 py-2.5 text-xs text-slate-600">Sem {s.semester}</td>
                      <td className="px-4 py-2.5 text-xs">
                        {a?.primary
                          ? <span className="text-slate-800 font-semibold">{fname(a.primary)}</span>
                          : <span className="text-slate-400 italic">Unassigned</span>}
                      </td>
                      <td className="px-4 py-2.5 text-xs">
                        {a?.secondary
                          ? <span className="text-slate-600">{fname(a.secondary)}</span>
                          : <span className="text-slate-400">—</span>}
                      </td>
                      <td className="px-4 py-2.5 text-xs text-slate-600">{a?.section === 'all' ? 'All' : (a?.section ?? 'All')}</td>
                      <td className="px-4 py-2.5">
                        <button onClick={() => openEdit(s)} className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#0b2545] text-white text-[11px] font-bold rounded hover:bg-[#0b2545]/90">
                          <Users size={11} /> Allocate
                        </button>
                      </td>
                    </tr>
                  )
                })
              }
            </tbody>
          </table>
        </div>
      </PortalCard>

      <PortalModal isOpen={!!editing} title={editing ? `Allocate Faculty — ${editing.id}` : ''} onClose={() => setEditing(null)} width="max-w-md">
        {editing && (
          <div className="space-y-3">
            <div className="bg-slate-50 border border-slate-100 rounded p-3 flex items-center gap-2">
              <BookOpen size={14} className="text-[#bfa15f] shrink-0" />
              <div className="min-w-0">
                <p className="text-sm font-semibold text-slate-800">{editing.name}</p>
                <p className="text-[11px] text-slate-500">{editing.id} · {editing.type} · Sem {editing.semester} · {editing.credits} credits</p>
              </div>
            </div>

            <Field label="Primary Faculty">
              <select value={form.primary ?? ''} onChange={(e) => setForm(f => ({ ...f, primary: e.target.value || undefined }))} className={inputCls}>
                <option value="">— Unassigned —</option>
                {branchFaculty.map(f => <option key={f.id} value={f.id}>{f.name} ({f.designation})</option>)}
              </select>
            </Field>

            <Field label="Secondary Faculty (optional backup)">
              <select value={form.secondary ?? ''} onChange={(e) => setForm(f => ({ ...f, secondary: e.target.value || undefined }))} className={inputCls}>
                <option value="">— None —</option>
                {branchFaculty.filter(f => f.id !== form.primary).map(f => <option key={f.id} value={f.id}>{f.name} ({f.designation})</option>)}
              </select>
            </Field>

            <Field label="Section">
              <select value={form.section ?? 'all'} onChange={(e) => setForm(f => ({ ...f, section: e.target.value as Allocation['section'] }))} className={inputCls}>
                <option value="all">All Sections</option>
                <option value="A">Section A</option>
                <option value="B">Section B</option>
              </select>
            </Field>

            {form.primary && form.secondary && form.primary === form.secondary && (
              <div className="flex items-center gap-2 p-2.5 bg-[#0b2545]/5 border border-[#0b2545]/20 rounded">
                <AlertCircle size={13} className="text-[#0b2545] shrink-0" />
                <p className="text-[11px] text-[#0b2545]">Primary and secondary faculty must differ.</p>
              </div>
            )}

            <div className="flex gap-2.5 pt-2 border-t border-slate-100">
              <button onClick={() => setEditing(null)} className="flex-1 py-2 border border-slate-200 text-slate-700 text-sm font-semibold rounded hover:bg-slate-50">Cancel</button>
              <button onClick={save} className="flex-1 py-2 bg-[#0b2545] text-white text-sm font-bold rounded hover:bg-[#0b2545]/90 inline-flex items-center justify-center gap-1.5">
                <Save size={13} /> Save
              </button>
            </div>
          </div>
        )}
      </PortalModal>

      {toast && (
        <div className="fixed bottom-4 right-4 z-50 bg-[#bfa15f] text-white px-5 py-3 rounded-lg shadow-lg flex items-center gap-2 text-sm font-medium">
          <Users size={14} /> {toast}
          <button onClick={() => setToast('')} className="ml-1"><X size={13} /></button>
        </div>
      )}
    </div>
  )
}

const inputCls = 'w-full border border-slate-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#0b2545] bg-white'
const Field: React.FC<{ label: string; children: React.ReactNode }> = ({ label, children }) => (
  <label className="block"><span className="block text-[11px] font-bold text-slate-600 uppercase tracking-wide mb-1">{label}</span>{children}</label>
)
const Stat: React.FC<{ label: string; value: number; accent: string }> = ({ label, value, accent }) => (
  <PortalCard className="!p-4"><p className="text-[11px] font-bold text-slate-500 uppercase tracking-wide">{label}</p><p className={`text-2xl font-bold mt-1 ${accent}`}>{value}</p></PortalCard>
)

export default HodFacultyAllocation
