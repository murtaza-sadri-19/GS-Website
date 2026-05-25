import React, { useState, useEffect } from 'react'
import { PageHeader, PortalCard, PortalModal } from '../../components/layout/PortalLayout'
import { getBranches, getActiveSession, type Branch, type Session } from '../../services/examService'
import { Plus, Trash2, Users } from 'lucide-react'

const ExamBranches: React.FC = () => {
  const [branches, setBranches] = useState<Branch[]>([])
  const [activeSession, setActiveSession] = useState<Session | undefined>(undefined)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([getBranches(), getActiveSession()]).then(([b, s]) => {
      setBranches(b); setActiveSession(s); setLoading(false)
    })
  }, [])
  const [isOpen, setIsOpen] = useState(false)
  const [form, setForm] = useState({ id: '', name: '', shortName: '', hodName: '', facultyCount: '0' })
  const [saving, setSaving] = useState(false)
  const [search, setSearch] = useState('')

  const filtered = branches.filter(b =>
    b.name.toLowerCase().includes(search.toLowerCase()) ||
    b.shortName.toLowerCase().includes(search.toLowerCase())
  )

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    await new Promise(r => setTimeout(r, 500))
    setBranches(prev => [...prev, {
      id: form.id.toUpperCase(),
      name: form.name,
      shortName: form.shortName,
      hodName: form.hodName,
      facultyCount: +form.facultyCount
    }])
    setSaving(false)
    setIsOpen(false)
    setForm({ id: '', name: '', shortName: '', hodName: '', facultyCount: '0' })
  }

  const deleteBranch = (id: string) => {
    if (confirm('Delete this branch? This action cannot be undone.')) {
      setBranches(prev => prev.filter(b => b.id !== id))
    }
  }

  return (
    <div className="space-y-5">
      <PageHeader
        title="Branch Management"
        subtitle={`Session: ${activeSession?.label ?? '…'} · ${branches.length} branches configured`}
        action={
          <button
            onClick={() => setIsOpen(true)}
            className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-primary/90 transition-colors"
          >
            <Plus size={15} /> Add Branch
          </button>
        }
      />

      <div className="flex items-center gap-3">
        <input
          type="text"
          placeholder="Search branches..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="border border-slate-200 rounded-lg px-4 py-2 text-sm w-full max-w-xs focus:outline-none focus:border-primary"
        />
        <span className="text-xs text-slate-500">{filtered.length} results</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
        {filtered.map(branch => (
          <PortalCard key={branch.id} className="relative group">
            <div className="flex items-start justify-between mb-3">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <span className="text-sm font-bold text-primary">{branch.shortName}</span>
              </div>
              <button
                onClick={() => deleteBranch(branch.id)}
                className="p-1.5 text-slate-300 hover:text-[#0b2545] hover:bg-slate-100 rounded opacity-0 group-hover:opacity-100 transition-all"
                title="Delete branch"
              >
                <Trash2 size={14} />
              </button>
            </div>
            <h3 className="font-bold text-slate-800 text-sm leading-snug">{branch.name}</h3>
            <p className="text-xs text-slate-500 mt-1">{branch.hodName}</p>
            <div className="flex items-center gap-1.5 mt-3 text-xs text-slate-500">
              <Users size={12} className="text-accent" />
              <span>{branch.facultyCount} faculty members</span>
            </div>
            <div className="mt-2 flex gap-2">
              <span className="text-[9px] bg-primary/10 text-primary px-2 py-0.5 rounded font-bold uppercase">{branch.shortName}</span>
              <span className="text-[9px] bg-slate-100 text-slate-500 px-2 py-0.5 rounded font-bold uppercase">B.E. / M.E.</span>
            </div>
          </PortalCard>
        ))}
      </div>

      <PortalModal isOpen={isOpen} title="Add Branch" onClose={() => setIsOpen(false)}>
        <form onSubmit={handleCreate} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-slate-600 uppercase tracking-wide block mb-1">Branch Code *</label>
              <input required placeholder="e.g. CSE" value={form.id} onChange={e => setForm(f => ({ ...f, id: e.target.value }))}
                className="w-full border border-slate-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-primary uppercase" />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-600 uppercase tracking-wide block mb-1">Short Name *</label>
              <input required placeholder="e.g. CSE" value={form.shortName} onChange={e => setForm(f => ({ ...f, shortName: e.target.value }))}
                className="w-full border border-slate-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-primary" />
            </div>
          </div>
          <div>
            <label className="text-xs font-bold text-slate-600 uppercase tracking-wide block mb-1">Full Branch Name *</label>
            <input required placeholder="Computer Science & Engineering" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
              className="w-full border border-slate-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-primary" />
          </div>
          <div>
            <label className="text-xs font-bold text-slate-600 uppercase tracking-wide block mb-1">HOD Name</label>
            <input placeholder="Prof. A. K. Sachan" value={form.hodName} onChange={e => setForm(f => ({ ...f, hodName: e.target.value }))}
              className="w-full border border-slate-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-primary" />
          </div>
          <div>
            <label className="text-xs font-bold text-slate-600 uppercase tracking-wide block mb-1">Faculty Count</label>
            <input type="number" min="0" value={form.facultyCount} onChange={e => setForm(f => ({ ...f, facultyCount: e.target.value }))}
              className="w-full border border-slate-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-primary" />
          </div>
          <div className="flex gap-3 pt-2 border-t border-slate-100">
            <button type="button" onClick={() => setIsOpen(false)} className="flex-1 py-2 border border-slate-200 text-slate-700 rounded font-semibold text-sm hover:bg-slate-50">Cancel</button>
            <button type="submit" disabled={saving} className="flex-1 py-2 bg-primary text-white rounded font-semibold text-sm hover:bg-primary/90 disabled:opacity-60">
              {saving ? '⏳ Adding...' : '+ Add Branch'}
            </button>
          </div>
        </form>
      </PortalModal>
    </div>
  )
}

export default ExamBranches
