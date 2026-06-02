import React, { useState, useEffect, useCallback } from 'react'
import { PageHeader, PortalCard, PortalModal, Badge } from '../../components/layout/PortalLayout'
import { Plus, Search, Trash2, X, RefreshCw } from 'lucide-react'
import { apiClient } from '../../api/client'

interface ToastProps { message: string; onClose: () => void }
const Toast: React.FC<ToastProps> = ({ message, onClose }) => {
  useEffect(() => { const t = setTimeout(onClose, 3000); return () => clearTimeout(t) }, [onClose])
  return (
    <div className="fixed bottom-4 right-4 z-50 bg-[#0b2545] text-white px-5 py-3 rounded-lg shadow-lg flex items-center gap-3 text-sm font-medium">
      {message}<button onClick={onClose} className="hover:text-slate-300"><X size={14}/></button>
    </div>
  )
}

interface CompanyVisitRecord {
  id: number
  title: string
  company_name: string | null
  academic_year: string | null
  description: string | null
  created_at: string
  status: string
}

const PlacementCompanyVisits: React.FC = () => {
  const [visits, setVisits]       = useState<CompanyVisitRecord[]>([])
  const [loading, setLoading]     = useState(true)
  const [search, setSearch]       = useState('')
  const [showModal, setShowModal] = useState(false)
  const [toast, setToast]         = useState('')
  const [saving, setSaving]       = useState(false)

  const [title, setTitle]             = useState('')
  const [companyName, setCompanyName] = useState('')
  const [academicYear, setAcademicYear] = useState('2025-26')
  const [description, setDescription] = useState('')

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const res = await apiClient.get('/v1/placement/company-visits', { params: { pageSize: 100 } })
      setVisits(res.data?.data?.records ?? [])
    } catch { setToast('Failed to load company visits.') }
    finally { setLoading(false) }
  }, [])

  useEffect(() => { load() }, [load])

  const handleOpenAdd = () => {
    setTitle(''); setCompanyName(''); setAcademicYear('2025-26'); setDescription('')
    setShowModal(true)
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim()) { setToast('Title is required.'); return }
    setSaving(true)
    try {
      await apiClient.post('/v1/placement/records', {
        title: title.trim(),
        record_type: 'COMPANY_VISIT',
        company_name: companyName.trim() || null,
        academic_year: academicYear || null,
        description: description.trim() || null,
      })
      setToast('Company visit added.'); setShowModal(false); load()
    } catch { setToast('Failed to add company visit.') }
    finally { setSaving(false) }
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Delete this company visit record?')) return
    try {
      await apiClient.delete(`/v1/placement/records/${id}`)
      setToast('Record deleted.'); load()
    } catch { setToast('Failed to delete record.') }
  }

  const filtered = visits.filter(v =>
    v.title.toLowerCase().includes(search.toLowerCase()) ||
    (v.company_name ?? '').toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="space-y-5">
      <PageHeader
        title="Company Visits"
        subtitle="Manage scheduled campus recruitment drives and company visits"
        action={
          <div className="flex items-center gap-2">
            <button onClick={load} className="p-2 border border-slate-200 rounded-lg text-slate-500 hover:text-primary hover:bg-slate-50 transition-colors">
              <RefreshCw size={15} className={loading ? 'animate-spin' : ''} />
            </button>
            <button onClick={handleOpenAdd}
              className="bg-primary hover:bg-primary/95 text-white text-sm font-semibold px-4 py-2 rounded-lg flex items-center gap-2 transition-colors shadow-sm">
              <Plus size={15}/><span>Add Visit</span>
            </button>
          </div>
        }
      />

      <div className="flex items-center gap-3 bg-white p-3 border border-slate-200 rounded-xl shadow-sm">
        <Search className="text-slate-400 shrink-0" size={18}/>
        <input type="text" placeholder="Search by title or company..." value={search} onChange={e => setSearch(e.target.value)}
          className="w-full text-sm text-slate-700 bg-transparent focus:outline-none"/>
      </div>

      <PortalCard>
        {loading ? (
          <div className="space-y-3">{[1,2,3].map(i=><div key={i} className="h-10 bg-slate-100 rounded animate-pulse"/>)}</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead><tr className="bg-slate-50 border-b border-slate-200">
                <th className="text-left px-4 py-3 text-[11px] font-bold text-slate-500 uppercase tracking-wider">Title</th>
                <th className="text-left px-4 py-3 text-[11px] font-bold text-slate-500 uppercase tracking-wider">Company</th>
                <th className="text-left px-4 py-3 text-[11px] font-bold text-slate-500 uppercase tracking-wider">Session</th>
                <th className="text-left px-4 py-3 text-[11px] font-bold text-slate-500 uppercase tracking-wider">Added</th>
                <th className="text-center px-4 py-3 text-[11px] font-bold text-slate-500 uppercase tracking-wider">Actions</th>
              </tr></thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.length === 0 ? (
                  <tr><td colSpan={5} className="text-center py-8 text-slate-400 text-xs">
                    {visits.length === 0 ? 'No company visits recorded yet.' : 'No results match your search.'}
                  </td></tr>
                ) : filtered.map(v => (
                  <tr key={v.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-4 py-3">
                      <p className="font-semibold text-slate-800">{v.title}</p>
                      {v.description && <p className="text-xs text-slate-400 truncate max-w-xs">{v.description}</p>}
                    </td>
                    <td className="px-4 py-3 text-xs text-slate-600 font-semibold">{v.company_name ?? '—'}</td>
                    <td className="px-4 py-3 text-xs text-slate-500">{v.academic_year ?? '—'}</td>
                    <td className="px-4 py-3 text-xs text-slate-400 whitespace-nowrap">{v.created_at?.slice(0,10)}</td>
                    <td className="px-4 py-3 text-center">
                      <button onClick={() => handleDelete(v.id)} className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors" title="Delete">
                        <Trash2 size={13}/>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </PortalCard>

      <PortalModal isOpen={showModal} title="Add Company Visit" onClose={() => setShowModal(false)}>
        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-600 uppercase tracking-wide mb-1">Title *</label>
            <input type="text" required value={title} onChange={e => setTitle(e.target.value)}
              placeholder="e.g. Microsoft IDC Campus Recruitment Drive"
              className="w-full border border-slate-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-primary"/>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-600 uppercase tracking-wide mb-1">Company Name</label>
              <input type="text" value={companyName} onChange={e => setCompanyName(e.target.value)}
                placeholder="e.g. Microsoft IDC"
                className="w-full border border-slate-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-primary"/>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-600 uppercase tracking-wide mb-1">Academic Year</label>
              <select value={academicYear} onChange={e => setAcademicYear(e.target.value)}
                className="w-full border border-slate-200 rounded px-3 py-2 text-sm bg-white focus:outline-none focus:border-primary">
                {['2026-27','2025-26','2024-25','2023-24'].map(y => <option key={y} value={y}>{y}</option>)}
              </select>
            </div>
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-600 uppercase tracking-wide mb-1">Description</label>
            <textarea value={description} onChange={e => setDescription(e.target.value)} rows={2}
              placeholder="Job role, CTC, eligibility criteria..."
              className="w-full border border-slate-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-primary resize-none"/>
          </div>
          <div className="flex items-center gap-3 pt-3 border-t border-slate-100">
            <button type="button" onClick={() => setShowModal(false)}
              className="flex-1 py-2 border border-slate-200 text-slate-700 rounded font-semibold text-sm hover:bg-slate-50 transition-colors">Cancel</button>
            <button type="submit" disabled={saving}
              className="flex-1 py-2 bg-primary text-white rounded font-semibold text-sm hover:bg-primary/95 transition-colors disabled:opacity-60">
              {saving ? 'Saving…' : 'Add Visit'}
            </button>
          </div>
        </form>
      </PortalModal>

      {toast && <Toast message={toast} onClose={() => setToast('')}/>}
    </div>
  )
}

export default PlacementCompanyVisits
