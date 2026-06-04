import React, { useState, useEffect, useCallback } from 'react'
import { PageHeader, PortalCard, Badge } from '../../components/layout/PortalLayout'
import { Plus, Search, Trash2, X, RefreshCw } from 'lucide-react'
import { apiClient } from '../../api/client'

interface ToastProps { message: string; onClose: () => void }
const Toast: React.FC<ToastProps> = ({ message, onClose }) => {
  useEffect(() => { const t = setTimeout(onClose, 3000); return () => clearTimeout(t) }, [onClose])
  return (
    <div className="fixed bottom-4 right-4 z-50 bg-primary text-white px-5 py-3 rounded-lg shadow-lg flex items-center gap-3 text-sm font-medium">
      {message}
      <button onClick={onClose} className="hover:text-slate-300"><X size={14} /></button>
    </div>
  )
}

interface PlacementOffer {
  id: number
  student_name: string
  enrollment_no: string
  branch: string | null
  company_name: string
  ctc_lpa: number | null
  academic_year: string | null
  offer_status: 'Placed' | 'Offered' | 'Declined'
  created_at: string
}

const YEARS = ['2026-27', '2025-26', '2024-25', '2023-24']

const PlacementRecords: React.FC = () => {
  const [records, setRecords]         = useState<PlacementOffer[]>([])
  const [loading, setLoading]         = useState(true)
  const [search, setSearch]           = useState('')
  const [selectedBranch, setSelectedBranch] = useState('')
  const [selectedYear, setSelectedYear]     = useState('')
  const [toast, setToast]             = useState('')
  const [saving, setSaving]           = useState(false)

  const [name, setName]               = useState('')
  const [enrollment, setEnrollment]   = useState('')
  const [branch, setBranch]           = useState('')
  const [company, setCompany]         = useState('')
  const [ctc, setCtc]                 = useState(4.5)
  const [year, setYear]               = useState('2025-26')
  const [status, setStatus]           = useState<'Placed' | 'Offered'>('Placed')

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const params: Record<string, string> = { pageSize: '200' }
      if (selectedBranch) params.branch = selectedBranch
      if (selectedYear) params.academic_year = selectedYear
      if (search.trim()) params.q = search.trim()
      const res = await apiClient.get('/v1/placement/offers', { params })
      setRecords(res.data?.data?.offers ?? [])
    } catch {
      setToast('Failed to load placement records.')
    } finally {
      setLoading(false)
    }
  }, [selectedBranch, selectedYear, search])

  useEffect(() => { load() }, [load])

  const handleManualAdd = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name || !enrollment || !company) {
      setToast('Please fill all required fields.')
      return
    }
    setSaving(true)
    try {
      await apiClient.post('/v1/placement/offers', {
        student_name: name.trim(),
        enrollment_no: enrollment.trim(),
        branch: branch || null,
        company_name: company.trim(),
        ctc_lpa: ctc,
        academic_year: year,
        offer_status: status,
      })
      setToast('Record added successfully.')
      setName(''); setEnrollment(''); setBranch(''); setCompany(''); setCtc(4.5)
      load()
    } catch {
      setToast('Failed to add record.')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this placement record?')) return
    try {
      await apiClient.delete(`/v1/placement/offers/${id}`)
      setToast('Record deleted.')
      load()
    } catch {
      setToast('Failed to delete record.')
    }
  }

  const BRANCHES = ['CSE', 'IT', 'ECE', 'EE', 'ME', 'CE', 'BME', 'IPE', 'MBA', 'MCA', 'Pharmacy']

  return (
    <div className="space-y-5">
      <PageHeader
        title="Placement Records"
        subtitle="Manage academic year-wise placed student records"
        action={
          <button
            onClick={load}
            className="p-2 border border-slate-200 rounded-lg text-slate-500 hover:text-primary hover:bg-slate-50 transition-colors"
            title="Refresh"
          >
            <RefreshCw size={15} className={loading ? 'animate-spin' : ''} />
          </button>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Manual Add Card */}
        <div className="lg:col-span-1">
          <PortalCard>
            <h3 className="font-bold text-slate-800 text-sm mb-4 border-b border-slate-100 pb-2 flex items-center gap-2">
              <Plus size={16} className="text-primary" />
              <span>Manual Entry</span>
            </h3>
            <form onSubmit={handleManualAdd} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1">Student Name *</label>
                <input type="text" required value={name} onChange={e => setName(e.target.value)}
                  placeholder="e.g. Vikramaditya Singh"
                  className="w-full border border-slate-200 rounded px-2.5 py-1.5 text-xs focus:outline-none focus:border-primary" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1">Enrollment No. *</label>
                <input type="text" required value={enrollment} onChange={e => setEnrollment(e.target.value)}
                  placeholder="0901CS21109"
                  className="w-full border border-slate-200 rounded px-2.5 py-1.5 text-xs focus:outline-none focus:border-primary" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1">Branch</label>
                  <select value={branch} onChange={e => setBranch(e.target.value)}
                    className="w-full border border-slate-200 rounded px-2.5 py-1.5 text-xs bg-white focus:outline-none">
                    <option value="">Branch</option>
                    {BRANCHES.map(b => <option key={b} value={b}>{b}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1">Company *</label>
                  <input type="text" required value={company} onChange={e => setCompany(e.target.value)}
                    placeholder="e.g. TCS"
                    className="w-full border border-slate-200 rounded px-2.5 py-1.5 text-xs focus:outline-none focus:border-primary" />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1">CTC (LPA)</label>
                  <input type="number" step="0.1" value={ctc} onChange={e => setCtc(Number(e.target.value))}
                    className="w-full border border-slate-200 rounded px-2.5 py-1.5 text-xs focus:outline-none focus:border-primary" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1">Year</label>
                  <select value={year} onChange={e => setYear(e.target.value)}
                    className="w-full border border-slate-200 rounded px-2.5 py-1.5 text-xs bg-white focus:outline-none">
                    {YEARS.map(y => <option key={y} value={y}>{y}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1">Status</label>
                  <select value={status} onChange={e => setStatus(e.target.value as 'Placed' | 'Offered')}
                    className="w-full border border-slate-200 rounded px-2.5 py-1.5 text-xs bg-white focus:outline-none">
                    <option value="Placed">Placed</option>
                    <option value="Offered">Offered</option>
                  </select>
                </div>
              </div>
              <button type="submit" disabled={saving}
                className="w-full bg-primary hover:bg-primary/95 text-white py-2 rounded font-semibold text-xs transition-colors mt-2 disabled:opacity-60">
                {saving ? 'Saving…' : 'Add Placement Offer'}
              </button>
            </form>
          </PortalCard>
        </div>

        {/* Records Table */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white p-3 border border-slate-200 rounded-xl shadow-sm grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="flex items-center gap-2 border border-slate-100 bg-slate-50 px-3 py-1.5 rounded-lg">
              <Search className="text-slate-400 shrink-0" size={14} />
              <input type="text" placeholder="Search name, roll, company..."
                value={search} onChange={e => setSearch(e.target.value)}
                className="w-full text-xs text-slate-700 bg-transparent focus:outline-none" />
            </div>
            <select value={selectedBranch} onChange={e => setSelectedBranch(e.target.value)}
              className="text-xs border border-slate-100 bg-slate-50 rounded-lg px-3 py-1.5">
              <option value="">All Branches</option>
              {BRANCHES.map(b => <option key={b} value={b}>{b}</option>)}
            </select>
            <select value={selectedYear} onChange={e => setSelectedYear(e.target.value)}
              className="text-xs border border-slate-100 bg-slate-50 rounded-lg px-3 py-1.5">
              <option value="">All Academic Years</option>
              {YEARS.map(y => <option key={y} value={y}>{y}</option>)}
            </select>
          </div>

          <PortalCard>
            {loading ? (
              <div className="space-y-3">
                {[1, 2, 3].map(i => <div key={i} className="h-10 bg-slate-100 rounded animate-pulse" />)}
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200">
                      <th className="text-left px-4 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">Student</th>
                      <th className="text-center px-4 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">Branch</th>
                      <th className="text-left px-4 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">Company</th>
                      <th className="text-center px-4 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">CTC</th>
                      <th className="text-center px-4 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">Year</th>
                      <th className="text-center px-4 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                      <th className="text-center px-4 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {records.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="text-center py-8 text-slate-400 text-xs">
                          No placement records found. Add the first one using the form.
                        </td>
                      </tr>
                    ) : (
                      records.map(rec => (
                        <tr key={rec.id} className="hover:bg-slate-50/50 transition-colors">
                          <td className="px-4 py-3">
                            <p className="font-semibold text-slate-800 text-xs">{rec.student_name}</p>
                            <p className="text-xs text-slate-400 font-mono mt-0.5">{rec.enrollment_no}</p>
                          </td>
                          <td className="px-4 py-3 text-center text-xs text-slate-700 font-medium">{rec.branch ?? '—'}</td>
                          <td className="px-4 py-3 text-slate-600 text-xs font-semibold">{rec.company_name}</td>
                          <td className="px-4 py-3 text-center text-xs text-accent font-bold whitespace-nowrap">
                            {rec.ctc_lpa ? `${rec.ctc_lpa} LPA` : '—'}
                          </td>
                          <td className="px-4 py-3 text-center text-slate-500 text-xs whitespace-nowrap">{rec.academic_year ?? '—'}</td>
                          <td className="px-4 py-3 text-center">
                            <Badge label={rec.offer_status} variant={rec.offer_status === 'Placed' ? 'success' : 'info'} />
                          </td>
                          <td className="px-4 py-3 text-center">
                            <button onClick={() => handleDelete(rec.id)}
                              className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                              title="Delete Record">
                              <Trash2 size={13} />
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </PortalCard>
        </div>
      </div>

      {toast && <Toast message={toast} onClose={() => setToast('')} />}
    </div>
  )
}

export default PlacementRecords
