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

interface Internship {
  id: number
  company_id: number | null
  company_name?: string
  student_name: string
  student_enrollment_no: string
  title: string
  duration_months: number | null
  stipend: number | null
  start_date: string | null
  end_date: string | null
  status: string
  created_at: string
}

const PlacementInternships: React.FC = () => {
  const [internships, setInternships] = useState<Internship[]>([])
  const [loading, setLoading]     = useState(true)
  const [search, setSearch]       = useState('')
  const [showModal, setShowModal] = useState(false)
  const [toast, setToast]         = useState('')
  const [saving, setSaving]       = useState(false)

  const [studentName, setStudentName]       = useState('')
  const [enrollment, setEnrollment]         = useState('')
  const [title, setTitle]                   = useState('')
  const [companyName, setCompanyName]       = useState('')
  const [durationMonths, setDurationMonths] = useState(2)
  const [stipend, setStipend]               = useState('')
  const [startDate, setStartDate]           = useState('')
  const [endDate, setEndDate]               = useState('')

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const res = await apiClient.get('/v1/placement/internships', { params: { pageSize: 100 } })
      setInternships(res.data?.data?.internships ?? [])
    } catch { setToast('Failed to load internships.') }
    finally { setLoading(false) }
  }, [])

  useEffect(() => { load() }, [load])

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!studentName.trim() || !enrollment.trim() || !title.trim()) {
      setToast('Student name, enrollment, and title are required.')
      return
    }
    setSaving(true)
    try {
      await apiClient.post('/v1/placement/internships', {
        student_name: studentName.trim(),
        student_enrollment_no: enrollment.trim(),
        title: title.trim(),
        duration_months: durationMonths || null,
        stipend: stipend ? parseFloat(stipend) : null,
        start_date: startDate || null,
        end_date: endDate || null,
        status: 'ongoing',
      })
      setToast('Internship added.'); setShowModal(false); load()
    } catch { setToast('Failed to add internship.') }
    finally { setSaving(false) }
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Delete this internship record?')) return
    try {
      await apiClient.delete(`/v1/placement/internships/${id}`)
      setToast('Deleted.'); load()
    } catch { setToast('Failed to delete.') }
  }

  const filtered = internships.filter(i =>
    i.student_name.toLowerCase().includes(search.toLowerCase()) ||
    i.title.toLowerCase().includes(search.toLowerCase()) ||
    i.student_enrollment_no.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="space-y-5">
      <PageHeader
        title="Internships"
        subtitle="Manage student internship records"
        action={
          <div className="flex items-center gap-2">
            <button onClick={load} className="p-2 border border-slate-200 rounded-lg text-slate-500 hover:text-primary hover:bg-slate-50 transition-colors">
              <RefreshCw size={15} className={loading ? 'animate-spin' : ''} />
            </button>
            <button onClick={() => { setStudentName(''); setEnrollment(''); setTitle(''); setCompanyName(''); setDurationMonths(2); setStipend(''); setStartDate(''); setEndDate(''); setShowModal(true) }}
              className="bg-primary hover:bg-primary/95 text-white text-sm font-semibold px-4 py-2 rounded-lg flex items-center gap-2 transition-colors shadow-sm">
              <Plus size={15}/><span>Add Internship</span>
            </button>
          </div>
        }
      />

      <div className="flex items-center gap-3 bg-white p-3 border border-slate-200 rounded-xl shadow-sm">
        <Search className="text-slate-400 shrink-0" size={18}/>
        <input type="text" placeholder="Search by student, enrollment, or title..." value={search} onChange={e => setSearch(e.target.value)}
          className="w-full text-sm text-slate-700 bg-transparent focus:outline-none"/>
      </div>

      <PortalCard>
        {loading ? (
          <div className="space-y-3">{[1,2,3].map(i=><div key={i} className="h-10 bg-slate-100 rounded animate-pulse"/>)}</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead><tr className="bg-slate-50 border-b border-slate-200">
                <th className="text-left px-4 py-3 text-[11px] font-bold text-slate-500 uppercase tracking-wider">Student</th>
                <th className="text-left px-4 py-3 text-[11px] font-bold text-slate-500 uppercase tracking-wider">Title</th>
                <th className="text-left px-4 py-3 text-[11px] font-bold text-slate-500 uppercase tracking-wider">Duration</th>
                <th className="text-center px-4 py-3 text-[11px] font-bold text-slate-500 uppercase tracking-wider">Status</th>
                <th className="text-center px-4 py-3 text-[11px] font-bold text-slate-500 uppercase tracking-wider">Actions</th>
              </tr></thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.length === 0 ? (
                  <tr><td colSpan={5} className="text-center py-8 text-slate-400 text-xs">
                    {internships.length === 0 ? 'No internship records yet.' : 'No results match your search.'}
                  </td></tr>
                ) : filtered.map(i => (
                  <tr key={i.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-4 py-3">
                      <p className="font-semibold text-slate-800 text-xs">{i.student_name}</p>
                      <p className="text-[10px] text-slate-400 font-mono">{i.student_enrollment_no}</p>
                    </td>
                    <td className="px-4 py-3 text-xs text-slate-600">{i.title}</td>
                    <td className="px-4 py-3 text-xs text-slate-500">
                      {i.duration_months ? `${i.duration_months} month${i.duration_months > 1 ? 's' : ''}` : '—'}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <Badge label={i.status ?? 'ongoing'} variant={i.status === 'completed' ? 'success' : 'info'} />
                    </td>
                    <td className="px-4 py-3 text-center">
                      <button onClick={() => handleDelete(i.id)} className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors" title="Delete">
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

      <PortalModal isOpen={showModal} title="Add Internship Record" onClose={() => setShowModal(false)}>
        <form onSubmit={handleSave} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-600 uppercase tracking-wide mb-1">Student Name *</label>
              <input type="text" required value={studentName} onChange={e => setStudentName(e.target.value)}
                placeholder="e.g. Priya Sharma" className="w-full border border-slate-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-primary"/>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-600 uppercase tracking-wide mb-1">Enrollment No. *</label>
              <input type="text" required value={enrollment} onChange={e => setEnrollment(e.target.value)}
                placeholder="0901CS22101" className="w-full border border-slate-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-primary"/>
            </div>
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-600 uppercase tracking-wide mb-1">Role / Title *</label>
            <input type="text" required value={title} onChange={e => setTitle(e.target.value)}
              placeholder="e.g. Summer Analyst Intern" className="w-full border border-slate-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-primary"/>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-600 uppercase tracking-wide mb-1">Duration (months)</label>
              <input type="number" value={durationMonths} onChange={e => setDurationMonths(Number(e.target.value))} min={1}
                className="w-full border border-slate-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-primary"/>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-600 uppercase tracking-wide mb-1">Stipend (₹/month)</label>
              <input type="number" value={stipend} onChange={e => setStipend(e.target.value)}
                placeholder="e.g. 25000" className="w-full border border-slate-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-primary"/>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-600 uppercase tracking-wide mb-1">Start Date</label>
              <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)}
                className="w-full border border-slate-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-primary"/>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-600 uppercase tracking-wide mb-1">End Date</label>
              <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)}
                className="w-full border border-slate-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-primary"/>
            </div>
          </div>
          <div className="flex items-center gap-3 pt-3 border-t border-slate-100">
            <button type="button" onClick={() => setShowModal(false)}
              className="flex-1 py-2 border border-slate-200 text-slate-700 rounded font-semibold text-sm hover:bg-slate-50 transition-colors">Cancel</button>
            <button type="submit" disabled={saving}
              className="flex-1 py-2 bg-primary text-white rounded font-semibold text-sm hover:bg-primary/95 transition-colors disabled:opacity-60">
              {saving ? 'Saving…' : 'Add Internship'}
            </button>
          </div>
        </form>
      </PortalModal>

      {toast && <Toast message={toast} onClose={() => setToast('')}/>}
    </div>
  )
}

export default PlacementInternships
