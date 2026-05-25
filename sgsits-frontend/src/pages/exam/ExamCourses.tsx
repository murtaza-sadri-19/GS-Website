import React, { useState, useEffect } from 'react'
import { PageHeader, PortalCard, PortalModal, Badge } from '../../components/layout/PortalLayout'
import { getCourses, getBranches, getActiveSession, type Course, type Branch, type Session } from '../../services/examService'
import { Plus, Trash2 } from 'lucide-react'

const ExamCourses: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>([])
  const [branches, setBranches] = useState<Branch[]>([])
  const [activeSession, setActiveSession] = useState<Session | undefined>(undefined)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([getCourses(), getBranches(), getActiveSession()]).then(([c, b, s]) => {
      setCourses(c); setBranches(b); setActiveSession(s); setLoading(false)
    })
  }, [])
  const [isOpen, setIsOpen] = useState(false)
  const [form, setForm] = useState({ id: '', name: '', branch_id: 'CSE', specialization: '', semesters: '8' })
  const [saving, setSaving] = useState(false)
  const [filterBranch, setFilterBranch] = useState('ALL')

  const filtered = filterBranch === 'ALL' ? courses : courses.filter(c => c.branch_id === filterBranch)

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    await new Promise(r => setTimeout(r, 500))
    setCourses(prev => [...prev, { ...form, semesters: +form.semesters }])
    setSaving(false)
    setIsOpen(false)
    setForm({ id: '', name: '', branch_id: 'CSE', specialization: '', semesters: '8' })
  }

  const deleteCourse = (id: string) => setCourses(prev => prev.filter(c => c.id !== id))

  return (
    <div className="space-y-5">
      <PageHeader
        title="Course Management"
        subtitle={`Session: ${activeSession?.label ?? '…'} · ${courses.length} courses`}
        action={
          <button onClick={() => setIsOpen(true)}
            className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-primary/90 transition-colors">
            <Plus size={15} /> Add Course
          </button>
        }
      />

      <div className="flex flex-wrap items-center gap-2">
        {['ALL', ...branches.map(b => b.id)].map(id => (
          <button
            key={id}
            onClick={() => setFilterBranch(id)}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${
              filterBranch === id ? 'bg-primary text-white border-primary' : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'
            }`}
          >
            {id === 'ALL' ? 'All Branches' : id}
          </button>
        ))}
      </div>

      <PortalCard>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                {['Course ID', 'Name', 'Branch', 'Specialization', 'Semesters', ''].map(h => (
                  <th key={h} className="text-left px-4 py-3 text-[11px] font-bold text-slate-500 uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map(c => (
                <tr key={c.id} className="hover:bg-slate-50/60 transition-colors">
                  <td className="px-4 py-3">
                    <span className="font-mono text-xs bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-bold">{c.id}</span>
                  </td>
                  <td className="px-4 py-3 font-semibold text-slate-800">{c.name}</td>
                  <td className="px-4 py-3">
                    <Badge label={c.branch_id} variant="info" />
                  </td>
                  <td className="px-4 py-3 text-xs text-slate-500">{c.specialization || '—'}</td>
                  <td className="px-4 py-3 text-sm text-slate-700 font-medium">{c.semesters}</td>
                  <td className="px-4 py-3">
                    <button onClick={() => deleteCourse(c.id)}
                      className="p-1.5 text-slate-400 hover:text-[#0b2545] hover:bg-slate-100 rounded transition-colors">
                      <Trash2 size={14} />
                    </button>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={6} className="px-4 py-8 text-center text-sm text-slate-400">No courses for selected branch.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </PortalCard>

      <PortalModal isOpen={isOpen} title="Add Course" onClose={() => setIsOpen(false)}>
        <form onSubmit={handleCreate} className="space-y-4">
          <div>
            <label className="text-xs font-bold text-slate-600 uppercase tracking-wide block mb-1">Course ID *</label>
            <input required placeholder="e.g. CSE-BE" value={form.id} onChange={e => setForm(f => ({ ...f, id: e.target.value }))}
              className="w-full border border-slate-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-primary" />
          </div>
          <div>
            <label className="text-xs font-bold text-slate-600 uppercase tracking-wide block mb-1">Course Name *</label>
            <input required placeholder="e.g. B.E. Computer Science & Engineering" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
              className="w-full border border-slate-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-primary" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-slate-600 uppercase tracking-wide block mb-1">Branch *</label>
              <select value={form.branch_id} onChange={e => setForm(f => ({ ...f, branch_id: e.target.value }))}
                className="w-full border border-slate-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-primary">
                {branches.map(b => <option key={b.id} value={b.id}>{b.shortName} – {b.name}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs font-bold text-slate-600 uppercase tracking-wide block mb-1">Semesters *</label>
              <input type="number" min="2" max="12" required value={form.semesters} onChange={e => setForm(f => ({ ...f, semesters: e.target.value }))}
                className="w-full border border-slate-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-primary" />
            </div>
          </div>
          <div>
            <label className="text-xs font-bold text-slate-600 uppercase tracking-wide block mb-1">Specialization</label>
            <input placeholder="e.g. Software Engineering (optional)" value={form.specialization} onChange={e => setForm(f => ({ ...f, specialization: e.target.value }))}
              className="w-full border border-slate-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-primary" />
          </div>
          <div className="flex gap-3 pt-2 border-t border-slate-100">
            <button type="button" onClick={() => setIsOpen(false)} className="flex-1 py-2 border border-slate-200 text-slate-700 rounded font-semibold text-sm hover:bg-slate-50">Cancel</button>
            <button type="submit" disabled={saving} className="flex-1 py-2 bg-primary text-white rounded font-semibold text-sm hover:bg-primary/90 disabled:opacity-60">
              {saving ? '⏳ Adding...' : '+ Add Course'}
            </button>
          </div>
        </form>
      </PortalModal>
    </div>
  )
}

export default ExamCourses
