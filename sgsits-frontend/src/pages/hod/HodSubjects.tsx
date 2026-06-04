/**
 * HOD Subjects Management
 *
 * Fully independent from the Exam Controller's academic/subjects system.
 * HOD has full CRUD on dept_subjects for their own department.
 *
 * API: GET/POST/PUT/DELETE /v1/dept-subjects
 */

import React, { useMemo, useState, useEffect, useCallback } from 'react'
import { PageHeader, PortalCard, PortalModal } from '../../components/layout/PortalLayout'
import { useAdminStore } from '../../store/adminStore'
import {
  Plus, Pencil, Trash2, Search, BookOpen, Loader2,
  RefreshCw, CheckCircle2, X, Users,
} from 'lucide-react'
import apiClient from '../../api/client'

// ── Types ─────────────────────────────────────────────────────────────────────

interface DeptSubject {
  id:              number
  department_id:   number
  department_name: string
  subject_code:    string
  subject_name:    string
  subject_type:    'Theory' | 'Practical' | 'Lab' | 'Elective' | 'Project' | 'Seminar'
  semester:        number
  credits:         number
  program:         string
  academic_year:   string
  description:     string | null
  faculty_user_id: number | null
  faculty_name:    string | null
  faculty_email:   string | null
  is_active:       0 | 1
}

interface FacultyOption {
  user_id:       number
  name:          string
  email:         string
  designation:   string | null
  specialization: string | null
}

// ── Constants ─────────────────────────────────────────────────────────────────

const TYPES = ['Theory', 'Practical', 'Lab', 'Elective', 'Project', 'Seminar'] as const
const PROGRAMS = ['B.Tech', 'M.Tech', 'MBA', 'MCA', 'B.Pharm', 'M.Pharm', 'PTDC', 'Ph.D']
const SEMESTERS = [1, 2, 3, 4, 5, 6, 7, 8]

function currentAcademicYear(): string {
  const y = new Date().getFullYear()
  const m = new Date().getMonth() + 1
  const s = m >= 7 ? y : y - 1
  return `${s}-${String(s + 1).slice(-2)}`
}

const EMPTY_FORM = {
  subject_code:    '',
  subject_name:    '',
  subject_type:    'Theory' as DeptSubject['subject_type'],
  semester:        1,
  credits:         3,
  program:         'B.Tech',
  academic_year:   currentAcademicYear(),
  description:     '',
  faculty_user_id: '' as '' | number,
}

const inputCls = 'w-full border border-slate-200 rounded px-3 py-2 text-sm bg-white focus:outline-none focus:border-primary'

// ── API helpers ───────────────────────────────────────────────────────────────

async function fetchSubjects(departmentId: number, params: Record<string, string> = {}): Promise<DeptSubject[]> {
  const res = await apiClient.get('/v1/dept-subjects', { params: { department_id: departmentId, ...params } })
  const data = res.data?.data ?? []
  return Array.isArray(data) ? data : []
}

async function fetchFaculty(departmentId: number): Promise<FacultyOption[]> {
  const res = await apiClient.get('/v1/dept-subjects/faculty', { params: { department_id: departmentId } })
  const data = res.data?.data ?? []
  return Array.isArray(data) ? data : []
}

// ── Main Component ────────────────────────────────────────────────────────────

const HodSubjects: React.FC = () => {
  const { user } = useAdminStore()
  const deptId   = user?.department_id ? Number(user.department_id) : 0

  const [subjects,  setSubjects]  = useState<DeptSubject[]>([])
  const [faculty,   setFaculty]   = useState<FacultyOption[]>([])
  const [loading,   setLoading]   = useState(true)

  const [search,      setSearch]      = useState('')
  const [filterSem,   setFilterSem]   = useState<'all' | number>('all')
  const [filterType,  setFilterType]  = useState<'all' | string>('all')
  const [filterYear,  setFilterYear]  = useState(currentAcademicYear())

  const [showForm,   setShowForm]   = useState(false)
  const [editing,    setEditing]    = useState<DeptSubject | null>(null)
  const [form,       setForm]       = useState({ ...EMPTY_FORM })
  const [saving,     setSaving]     = useState(false)
  const [deleteTarget, setDeleteTarget] = useState<DeptSubject | null>(null)
  const [toast,      setToast]      = useState('')

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(''), 3000) }

  const load = useCallback(async () => {
    if (!deptId) return
    setLoading(true)
    try {
      const [subs, fac] = await Promise.all([
        fetchSubjects(deptId, { academic_year: filterYear }),
        fetchFaculty(deptId),
      ])
      setSubjects(subs)
      setFaculty(fac)
    } catch { showToast('Failed to load subjects.') }
    finally { setLoading(false) }
  }, [deptId, filterYear])

  useEffect(() => { load() }, [load])

  const availableSems = useMemo(
    () => [...new Set(subjects.map(s => s.semester))].sort((a, b) => a - b),
    [subjects]
  )

  const visible = useMemo(() => subjects.filter(s => {
    if (filterSem !== 'all' && s.semester !== filterSem) return false
    if (filterType !== 'all' && s.subject_type !== filterType) return false
    if (search.trim()) {
      const q = search.toLowerCase()
      if (!s.subject_code.toLowerCase().includes(q) && !s.subject_name.toLowerCase().includes(q)) return false
    }
    return true
  }), [subjects, filterSem, filterType, search])

  // ── CRUD actions ─────────────────────────────────────────────────────────────

  const openAdd = () => {
    setEditing(null)
    setForm({ ...EMPTY_FORM, academic_year: filterYear })
    setShowForm(true)
  }

  const openEdit = (s: DeptSubject) => {
    setEditing(s)
    setForm({
      subject_code:    s.subject_code,
      subject_name:    s.subject_name,
      subject_type:    s.subject_type,
      semester:        s.semester,
      credits:         s.credits,
      program:         s.program,
      academic_year:   s.academic_year,
      description:     s.description ?? '',
      faculty_user_id: s.faculty_user_id ?? '',
    })
    setShowForm(true)
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.subject_code.trim() || !form.subject_name.trim()) return

    setSaving(true)
    try {
      const payload = {
        ...form,
        department_id:   deptId,
        subject_code:    form.subject_code.trim().toUpperCase(),
        subject_name:    form.subject_name.trim(),
        faculty_user_id: form.faculty_user_id || null,
        description:     form.description || null,
      }

      if (editing) {
        await apiClient.put(`/v1/dept-subjects/${editing.id}`, payload)
        showToast(`Subject ${editing.subject_code} updated.`)
      } else {
        await apiClient.post('/v1/dept-subjects', payload)
        showToast(`Subject ${form.subject_code.toUpperCase()} added.`)
      }

      setShowForm(false)
      setEditing(null)
      await load()
    } catch (err: any) {
      showToast(err?.response?.data?.message || 'Failed to save subject. Please try again.')
    } finally { setSaving(false) }
  }

  const handleDelete = async () => {
    if (!deleteTarget) return
    try {
      await apiClient.delete(`/v1/dept-subjects/${deleteTarget.id}`)
      showToast(`Subject ${deleteTarget.subject_code} deleted.`)
      setDeleteTarget(null)
      await load()
    } catch (err: any) {
      showToast(err?.response?.data?.message || 'Failed to delete subject.')
      setDeleteTarget(null)
    }
  }

  const set = <K extends keyof typeof EMPTY_FORM>(k: K, v: (typeof EMPTY_FORM)[K]) =>
    setForm(p => ({ ...p, [k]: v }))

  // ── Stats ─────────────────────────────────────────────────────────────────────

  const stats = useMemo(() => ({
    total:      subjects.length,
    theory:     subjects.filter(s => s.subject_type === 'Theory').length,
    practical:  subjects.filter(s => ['Practical', 'Lab'].includes(s.subject_type)).length,
    unassigned: subjects.filter(s => !s.faculty_user_id).length,
  }), [subjects])

  // ── Render ────────────────────────────────────────────────────────────────────

  return (
    <div className="space-y-5">
      <PageHeader
        title="Department Subjects"
        subtitle="Manage curriculum subjects, semester allocation, and faculty assignment"
        action={
          <div className="flex gap-2">
            <button
              onClick={load}
              disabled={loading}
              className="inline-flex items-center gap-1.5 px-3 py-2 border border-slate-200 text-slate-600 text-xs font-bold rounded-md hover:bg-slate-50"
            >
              <RefreshCw size={12} className={loading ? 'animate-spin' : ''} />
            </button>
            <button
              onClick={openAdd}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-primary text-white text-xs font-bold rounded-md hover:bg-primary/90"
            >
              <Plus size={14} /> Add Subject
            </button>
          </div>
        }
      />

      {/* Stats row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'Total Subjects',       value: stats.total,      color: 'text-primary' },
          { label: 'Theory',               value: stats.theory,     color: 'text-accent' },
          { label: 'Practical / Lab',      value: stats.practical,  color: 'text-slate-700' },
          { label: 'Unassigned Faculty',   value: stats.unassigned, color: stats.unassigned > 0 ? 'text-amber-600' : 'text-green-600' },
        ].map(s => (
          <PortalCard key={s.label} className="!p-4">
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">{s.label}</p>
            <p className={`text-2xl font-bold mt-1 ${s.color}`}>{s.value}</p>
          </PortalCard>
        ))}
      </div>

      {/* Filters */}
      <PortalCard className="!p-3">
        <div className="flex flex-col sm:flex-row gap-2.5 flex-wrap">
          <div className="relative flex-1 min-w-[200px]">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search code or name…"
              className="w-full pl-9 pr-3 py-2 text-sm border border-slate-200 rounded focus:outline-none focus:border-primary"
            />
          </div>
          <select
            value={filterYear}
            onChange={e => setFilterYear(e.target.value)}
            className="border border-slate-200 rounded px-3 py-2 text-sm bg-white focus:outline-none focus:border-primary"
          >
            {['2024-25', '2025-26', '2026-27', '2027-28'].map(y => (
              <option key={y} value={y}>{y}</option>
            ))}
          </select>
          <select
            value={String(filterSem)}
            onChange={e => setFilterSem(e.target.value === 'all' ? 'all' : Number(e.target.value))}
            className="border border-slate-200 rounded px-3 py-2 text-sm bg-white focus:outline-none focus:border-primary"
          >
            <option value="all">All Semesters</option>
            {availableSems.map(s => <option key={s} value={s}>Semester {s}</option>)}
          </select>
          <select
            value={filterType}
            onChange={e => setFilterType(e.target.value)}
            className="border border-slate-200 rounded px-3 py-2 text-sm bg-white focus:outline-none focus:border-primary"
          >
            <option value="all">All Types</option>
            {TYPES.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>
      </PortalCard>

      {/* Table */}
      <PortalCard className="!p-0 overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-12 text-slate-400">
            <Loader2 size={20} className="animate-spin mr-2" /><span className="text-sm">Loading…</span>
          </div>
        ) : visible.length === 0 ? (
          <div className="text-center py-16">
            <BookOpen size={32} className="mx-auto text-slate-200 mb-3" />
            <p className="text-sm font-semibold text-slate-600">No subjects found</p>
            <p className="text-xs text-slate-400 mt-1">Use "Add Subject" to start building the curriculum.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200">
                  {['Code', 'Subject', 'Type', 'Sem', 'Credits', 'Program', 'Faculty', 'Actions'].map(h => (
                    <th key={h} className="text-left px-4 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {visible.map(s => (
                  <tr key={s.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="px-4 py-3 font-mono font-bold text-primary text-xs">{s.subject_code}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-start gap-2">
                        <BookOpen size={13} className="text-slate-300 mt-0.5 shrink-0" />
                        <div>
                          <p className="font-semibold text-slate-800">{s.subject_name}</p>
                          {s.description && <p className="text-xs text-slate-400 line-clamp-1">{s.description}</p>}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`text-xs font-bold px-2 py-0.5 rounded border uppercase tracking-wide ${
                        s.subject_type === 'Theory'    ? 'bg-primary/5 text-primary border-primary/15' :
                        s.subject_type === 'Elective'  ? 'bg-accent/10 text-accent border-accent/30' :
                        'bg-slate-100 text-slate-600 border-slate-200'
                      }`}>{s.subject_type}</span>
                    </td>
                    <td className="px-4 py-3 text-slate-600 text-center font-bold">{s.semester}</td>
                    <td className="px-4 py-3 text-slate-700 font-semibold text-center">{s.credits}</td>
                    <td className="px-4 py-3 text-xs text-slate-500">{s.program}</td>
                    <td className="px-4 py-3">
                      {s.faculty_name
                        ? <div>
                            <p className="text-xs font-semibold text-slate-700">{s.faculty_name}</p>
                            <p className="text-xs text-slate-400">{s.faculty_email}</p>
                          </div>
                        : <span className="text-xs text-amber-500 font-medium flex items-center gap-1">
                            <Users size={11} />Unassigned
                          </span>
                      }
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        <button onClick={() => openEdit(s)} className="p-1.5 rounded text-primary hover:bg-primary/5" title="Edit">
                          <Pencil size={13} />
                        </button>
                        <button onClick={() => setDeleteTarget(s)} className="p-1.5 rounded text-slate-400 hover:bg-slate-100 hover:text-red-500" title="Delete">
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </PortalCard>

      {/* Add / Edit Modal */}
      <PortalModal
        isOpen={showForm}
        title={editing ? `Edit — ${editing.subject_code}` : 'Add New Subject'}
        onClose={() => { setShowForm(false); setEditing(null) }}
        width="max-w-lg"
      >
        <form onSubmit={handleSave} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-600 uppercase tracking-wide mb-1">
                Subject Code <span className="text-accent">*</span>
              </label>
              <input
                type="text"
                required
                disabled={!!editing}
                value={form.subject_code}
                onChange={e => set('subject_code', e.target.value.toUpperCase())}
                placeholder="e.g. CS601"
                className={`${inputCls} font-mono uppercase ${editing ? 'bg-slate-50 text-slate-400' : ''}`}
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-600 uppercase tracking-wide mb-1">
                Type <span className="text-accent">*</span>
              </label>
              <select value={form.subject_type} onChange={e => set('subject_type', e.target.value as any)} className={inputCls}>
                {TYPES.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-600 uppercase tracking-wide mb-1">
              Subject Name <span className="text-accent">*</span>
            </label>
            <input
              type="text"
              required
              value={form.subject_name}
              onChange={e => set('subject_name', e.target.value)}
              placeholder="e.g. Compiler Design"
              className={inputCls}
            />
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-600 uppercase tracking-wide mb-1">Semester *</label>
              <select value={form.semester} onChange={e => set('semester', Number(e.target.value))} className={inputCls}>
                {SEMESTERS.map(s => <option key={s} value={s}>Sem {s}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-600 uppercase tracking-wide mb-1">Credits *</label>
              <input
                type="number" min={1} max={6} required
                value={form.credits}
                onChange={e => set('credits', Number(e.target.value))}
                className={inputCls}
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-600 uppercase tracking-wide mb-1">Academic Year</label>
              <select value={form.academic_year} onChange={e => set('academic_year', e.target.value)} className={inputCls}>
                {['2024-25', '2025-26', '2026-27', '2027-28'].map(y => <option key={y} value={y}>{y}</option>)}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-600 uppercase tracking-wide mb-1">Program</label>
            <select value={form.program} onChange={e => set('program', e.target.value)} className={inputCls}>
              {PROGRAMS.map(p => <option key={p} value={p}>{p}</option>)}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-600 uppercase tracking-wide mb-1">
              Assign Faculty <span className="text-slate-400 font-normal normal-case">(optional)</span>
            </label>
            <select
              value={form.faculty_user_id}
              onChange={e => set('faculty_user_id', e.target.value ? Number(e.target.value) : '')}
              className={inputCls}
            >
              <option value="">— Unassigned —</option>
              {faculty.map(f => (
                <option key={f.user_id} value={f.user_id}>
                  {f.name}{f.designation ? ` (${f.designation})` : ''}
                </option>
              ))}
            </select>
            {faculty.length === 0 && (
              <p className="text-xs text-amber-600 mt-1">No faculty profiles found for this department. Add faculty first.</p>
            )}
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-600 uppercase tracking-wide mb-1">Description (optional)</label>
            <textarea
              value={form.description}
              onChange={e => set('description', e.target.value)}
              rows={2}
              placeholder="Brief description of the subject content…"
              className={`${inputCls} resize-none`}
            />
          </div>

          <div className="flex gap-2.5 pt-2 border-t border-slate-100">
            <button
              type="button"
              onClick={() => { setShowForm(false); setEditing(null) }}
              className="flex-1 py-2 border border-slate-200 text-slate-700 text-sm font-semibold rounded hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex-1 py-2 bg-primary text-white text-sm font-bold rounded hover:bg-primary/90 disabled:opacity-60 inline-flex items-center justify-center gap-1.5"
            >
              {saving ? <><Loader2 size={13} className="animate-spin" />Saving…</> : (editing ? 'Update Subject' : 'Add Subject')}
            </button>
          </div>
        </form>
      </PortalModal>

      {/* Delete Confirm */}
      <PortalModal isOpen={!!deleteTarget} title="Delete Subject" onClose={() => setDeleteTarget(null)} width="max-w-sm">
        {deleteTarget && (
          <div className="text-center space-y-4">
            <div className="w-12 h-12 bg-red-50 rounded-full flex items-center justify-center mx-auto">
              <Trash2 size={20} className="text-red-500" />
            </div>
            <div>
              <p className="text-sm font-bold text-slate-800">{deleteTarget.subject_code}</p>
              <p className="text-sm text-slate-600">{deleteTarget.subject_name}</p>
              <p className="text-xs text-slate-400 mt-1">This action cannot be undone.</p>
            </div>
            <div className="flex gap-2.5">
              <button onClick={() => setDeleteTarget(null)} className="flex-1 py-2 border border-slate-200 text-slate-700 text-sm font-semibold rounded hover:bg-slate-50">Cancel</button>
              <button onClick={handleDelete} className="flex-1 py-2 bg-red-500 text-white text-sm font-bold rounded hover:bg-red-600">Delete</button>
            </div>
          </div>
        )}
      </PortalModal>

      {toast && (
        <div className="fixed bottom-4 right-4 z-50 bg-primary text-white px-5 py-3 rounded-lg shadow-lg flex items-center gap-2 text-sm font-medium">
          <CheckCircle2 size={14} /> {toast}
          <button onClick={() => setToast('')}><X size={13} /></button>
        </div>
      )}
    </div>
  )
}

export default HodSubjects
