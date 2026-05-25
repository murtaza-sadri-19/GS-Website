import React, { useMemo, useState, useEffect } from 'react'
import {
  PageHeader, PortalCard, PortalTable, PortalModal,
} from '../../components/layout/PortalLayout'
import { getSubjects, getFacultyMembers, type Subject, type FacultyMember } from '../../services/examService'
import { useAdminStore } from '../../store/adminStore'
import { Plus, Pencil, Trash2, Search, BookOpen } from 'lucide-react'

const HOD_BRANCH = 'CSE'

type SubjectType = Subject['type']
const SUBJECT_TYPES: SubjectType[] = ['Theory', 'Practical', 'Elective']

interface SubjectForm {
  id: string
  name: string
  type: SubjectType
  semester: number
  credits: number
  facultyId: string
}

const EMPTY_FORM: SubjectForm = {
  id: '', name: '', type: 'Theory', semester: 1, credits: 3, facultyId: '',
}

const HodSubjects: React.FC = () => {
  const { user } = useAdminStore()
  const hodBranch = user?.department_id ? String(user.department_id) : HOD_BRANCH
  const [subjects, setSubjects] = useState<Subject[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getSubjects(hodBranch).then(s => { setSubjects(s.filter(sub => sub.branch_id === hodBranch)); setLoading(false) })
  }, [hodBranch])
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState<Subject | null>(null)
  const [form, setForm] = useState<SubjectForm>(EMPTY_FORM)
  const [search, setSearch] = useState('')
  const [filterSem, setFilterSem] = useState<'all' | number>('all')
  const [filterType, setFilterType] = useState<'all' | SubjectType>('all')
  const [deleteTarget, setDeleteTarget] = useState<Subject | null>(null)
  const [toast, setToast] = useState('')

  const [facultyList, setFacultyList] = useState<FacultyMember[]>([])
  useEffect(() => {
    getFacultyMembers(hodBranch).then(setFacultyList)
  }, [hodBranch])
  const facultyOptions = useMemo(
    () => facultyList.filter(f => f.branch_id === hodBranch),
    [facultyList, hodBranch]
  )

  const visible = useMemo(() => {
    return subjects.filter(s => {
      if (filterSem !== 'all' && s.semester !== filterSem) return false
      if (filterType !== 'all' && s.type !== filterType) return false
      if (search.trim()) {
        const q = search.toLowerCase()
        if (!s.id.toLowerCase().includes(q) && !s.name.toLowerCase().includes(q)) return false
      }
      return true
    })
  }, [subjects, search, filterSem, filterType])

  const openAdd = () => {
    setEditing(null)
    setForm(EMPTY_FORM)
    setShowForm(true)
  }
  const openEdit = (s: Subject) => {
    setEditing(s)
    setForm({
      id: s.id, name: s.name, type: s.type, semester: s.semester,
      credits: s.credits, facultyId: s.facultyId ?? '',
    })
    setShowForm(true)
  }

  const showToast = (msg: string) => {
    setToast(msg)
    setTimeout(() => setToast(''), 2400)
  }

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.id.trim() || !form.name.trim()) return

    const fac = facultyOptions.find(f => f.id === form.facultyId)
    const next: Subject = {
      id: form.id.trim().toUpperCase(),
      name: form.name.trim(),
      type: form.type,
      semester: form.semester,
      branch_id: hodBranch,
      credits: form.credits,
      facultyId: fac?.id,
      facultyName: fac?.name,
    }

    if (editing) {
      setSubjects(prev => prev.map(s => (s.id === editing.id ? next : s)))
      showToast(`Subject ${next.id} updated.`)
    } else {
      if (subjects.some(s => s.id === next.id)) {
        showToast(`Subject code ${next.id} already exists.`)
        return
      }
      setSubjects(prev => [next, ...prev])
      showToast(`Subject ${next.id} added.`)
    }

    setShowForm(false)
    setEditing(null)
    setForm(EMPTY_FORM)
  }

  const handleDelete = () => {
    if (!deleteTarget) return
    setSubjects(prev => prev.filter(s => s.id !== deleteTarget.id))
    showToast(`Subject ${deleteTarget.id} deleted.`)
    setDeleteTarget(null)
  }

  return (
    <div className="space-y-5">
      <PageHeader
        title="Subjects"
        subtitle="Manage department subjects and faculty allocation"
        action={
          <button
            onClick={openAdd}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-[#0b2545] text-white text-xs font-bold rounded-md hover:bg-[#0b2545]/90 transition-colors"
          >
            <Plus size={14} /> Add Subject
          </button>
        }
      />

      <PortalCard className="!p-3">
        <div className="flex flex-col sm:flex-row gap-2.5">
          <div className="relative flex-1 min-w-0">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by subject code or name..."
              className="w-full pl-9 pr-3 py-2 text-sm border border-slate-200 rounded focus:outline-none focus:border-[#0b2545] bg-white"
            />
          </div>
          <select
            value={String(filterSem)}
            onChange={(e) => setFilterSem(e.target.value === 'all' ? 'all' : Number(e.target.value))}
            className="border border-slate-200 rounded px-3 py-2 text-sm bg-white focus:outline-none focus:border-[#0b2545]"
          >
            <option value="all">All Semesters</option>
            {[1, 2, 3, 4, 5, 6, 7, 8].map(s => <option key={s} value={s}>Semester {s}</option>)}
          </select>
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value as 'all' | SubjectType)}
            className="border border-slate-200 rounded px-3 py-2 text-sm bg-white focus:outline-none focus:border-[#0b2545]"
          >
            <option value="all">All Types</option>
            {SUBJECT_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>
      </PortalCard>

      <PortalCard className="!p-0 overflow-hidden">
        <PortalTable
          headers={['Code', 'Subject', 'Type', 'Sem', 'Credits', 'Allotted Faculty', 'Actions']}
          rows={visible}
          empty="No subjects match the filters. Add a new subject to get started."
          renderRow={(s) => (
            <tr key={s.id} className="hover:bg-slate-50/60 transition-colors">
              <td className="px-4 py-2.5 text-xs font-mono font-bold text-[#0b2545]">{s.id}</td>
              <td className="px-4 py-2.5">
                <div className="flex items-start gap-2">
                  <BookOpen size={13} className="text-slate-400 mt-0.5 shrink-0" />
                  <span className="text-sm font-medium text-slate-800">{s.name}</span>
                </div>
              </td>
              <td className="px-4 py-2.5">
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[#0b2545]/5 text-[#0b2545] border border-[#0b2545]/15 uppercase tracking-wide">
                  {s.type}
                </span>
              </td>
              <td className="px-4 py-2.5 text-sm text-slate-600">Sem {s.semester}</td>
              <td className="px-4 py-2.5 text-sm font-semibold text-slate-700">{s.credits}</td>
              <td className="px-4 py-2.5 text-sm text-slate-600">
                {s.facultyName ?? <span className="text-slate-400 italic text-xs">Unassigned</span>}
              </td>
              <td className="px-4 py-2.5">
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => openEdit(s)}
                    className="p-1.5 rounded text-[#0b2545] hover:bg-[#0b2545]/5 transition-colors"
                    title="Edit"
                  >
                    <Pencil size={13} />
                  </button>
                  <button
                    onClick={() => setDeleteTarget(s)}
                    className="p-1.5 rounded text-slate-500 hover:bg-slate-100 transition-colors"
                    title="Delete"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              </td>
            </tr>
          )}
        />
      </PortalCard>

      {/* Add / Edit Modal */}
      <PortalModal
        isOpen={showForm}
        title={editing ? `Edit Subject — ${editing.id}` : 'Add New Subject'}
        onClose={() => { setShowForm(false); setEditing(null) }}
      >
        <form onSubmit={handleSave} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wide mb-1">
                Subject Code <span className="text-[#bfa15f]">*</span>
              </label>
              <input
                type="text"
                required
                disabled={!!editing}
                value={form.id}
                onChange={(e) => setForm(f => ({ ...f, id: e.target.value.toUpperCase() }))}
                placeholder="e.g. CS601"
                className="w-full border border-slate-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#0b2545] bg-white font-mono uppercase disabled:bg-slate-50 disabled:text-slate-400"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wide mb-1">
                Type <span className="text-[#bfa15f]">*</span>
              </label>
              <select
                value={form.type}
                onChange={(e) => setForm(f => ({ ...f, type: e.target.value as SubjectType }))}
                className="w-full border border-slate-200 rounded px-3 py-2 text-sm bg-white focus:outline-none focus:border-[#0b2545]"
              >
                {SUBJECT_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wide mb-1">
              Subject Name <span className="text-[#bfa15f]">*</span>
            </label>
            <input
              type="text"
              required
              value={form.name}
              onChange={(e) => setForm(f => ({ ...f, name: e.target.value }))}
              placeholder="e.g. Compiler Design"
              className="w-full border border-slate-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#0b2545] bg-white"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wide mb-1">
                Semester <span className="text-[#bfa15f]">*</span>
              </label>
              <select
                value={form.semester}
                onChange={(e) => setForm(f => ({ ...f, semester: Number(e.target.value) }))}
                className="w-full border border-slate-200 rounded px-3 py-2 text-sm bg-white focus:outline-none focus:border-[#0b2545]"
              >
                {[1, 2, 3, 4, 5, 6, 7, 8].map(s => <option key={s} value={s}>Semester {s}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wide mb-1">
                Credits <span className="text-[#bfa15f]">*</span>
              </label>
              <input
                type="number"
                min={1}
                max={6}
                required
                value={form.credits}
                onChange={(e) => setForm(f => ({ ...f, credits: Number(e.target.value) }))}
                className="w-full border border-slate-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#0b2545] bg-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wide mb-1">
              Allot Faculty
            </label>
            <select
              value={form.facultyId}
              onChange={(e) => setForm(f => ({ ...f, facultyId: e.target.value }))}
              className="w-full border border-slate-200 rounded px-3 py-2 text-sm bg-white focus:outline-none focus:border-[#0b2545]"
            >
              <option value="">— Unassigned —</option>
              {facultyOptions.map(f => (
                <option key={f.id} value={f.id}>{f.name} ({f.designation})</option>
              ))}
            </select>
            <p className="text-[11px] text-slate-400 mt-1">Faculty can be assigned later from the Faculty page.</p>
          </div>

          <div className="flex gap-2.5 pt-2 border-t border-slate-100">
            <button
              type="button"
              onClick={() => { setShowForm(false); setEditing(null) }}
              className="flex-1 py-2 border border-slate-200 text-slate-700 text-sm font-semibold rounded hover:bg-slate-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 py-2 bg-[#0b2545] text-white text-sm font-bold rounded hover:bg-[#0b2545]/90 transition-colors"
            >
              {editing ? 'Update Subject' : 'Add Subject'}
            </button>
          </div>
        </form>
      </PortalModal>

      {/* Delete Confirmation */}
      <PortalModal
        isOpen={!!deleteTarget}
        title="Confirm Delete"
        onClose={() => setDeleteTarget(null)}
        width="max-w-sm"
      >
        <div className="text-center">
          <div className="w-12 h-12 bg-[#0b2545]/10 rounded-full flex items-center justify-center mx-auto mb-3">
            <Trash2 size={20} className="text-[#0b2545]" />
          </div>
          <p className="text-sm text-slate-700">
            Are you sure you want to delete <strong className="text-slate-900">{deleteTarget?.id}</strong> — {deleteTarget?.name}?
          </p>
          <p className="text-[11px] text-slate-500 mt-1">This action cannot be undone.</p>
          <div className="flex gap-2.5 mt-5">
            <button
              onClick={() => setDeleteTarget(null)}
              className="flex-1 py-2 border border-slate-200 text-slate-700 text-sm font-semibold rounded hover:bg-slate-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleDelete}
              className="flex-1 py-2 bg-[#0b2545] text-white text-sm font-bold rounded hover:bg-[#0b2545]/90 transition-colors"
            >
              Delete
            </button>
          </div>
        </div>
      </PortalModal>

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-4 right-4 z-50 bg-[#bfa15f] text-white px-5 py-3 rounded-lg shadow-lg text-sm font-medium">
          {toast}
        </div>
      )}
    </div>
  )
}

export default HodSubjects
