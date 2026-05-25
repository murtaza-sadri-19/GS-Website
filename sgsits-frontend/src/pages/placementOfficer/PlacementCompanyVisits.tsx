import React, { useState, useEffect } from 'react'
import { PageHeader, PortalCard, PortalModal, Badge } from '../../components/layout/PortalLayout'
import { getBranches, type Branch } from '../../services/examService'
import { Plus, Search, Edit2, Trash2, Calendar, X } from 'lucide-react'

// Simple local Toast component
interface ToastProps {
  message: string
  onClose: () => void
}
const Toast: React.FC<ToastProps> = ({ message, onClose }) => {
  useEffect(() => {
    const t = setTimeout(onClose, 3000)
    return () => clearTimeout(t)
  }, [onClose])
  
  return (
    <div className="fixed bottom-4 right-4 z-50 bg-[#0b2545] text-white px-5 py-3 rounded-lg shadow-lg flex items-center gap-3 text-sm font-medium">
      {message}
      <button onClick={onClose} className="hover:text-slate-300">
        <X size={14} />
      </button>
    </div>
  )
}

interface CompanyVisit {
  id: string
  company: string
  role: string
  pkg: number
  date: string
  branches: string[]
  cgpaCutoff: number
  allowBacklogs: boolean
  status: 'Open' | 'Closed' | 'Scheduled'
}

const MOCK_VISITS: CompanyVisit[] = [
  {
    id: 'CV001',
    company: 'Infosys',
    role: 'System Engineer Trainee',
    date: '2026-06-04',
    pkg: 5.5,
    branches: ['CSE', 'IT', 'ECE'],
    cgpaCutoff: 6.5,
    allowBacklogs: false,
    status: 'Scheduled',
  },
  {
    id: 'CV002',
    company: 'TCS Digital',
    role: 'Digital Specialist',
    date: '2026-06-10',
    pkg: 9.0,
    branches: ['CSE', 'IT'],
    cgpaCutoff: 7.0,
    allowBacklogs: false,
    status: 'Open',
  },
  {
    id: 'CV003',
    company: 'Capgemini',
    role: 'Software Analyst',
    date: '2026-06-15',
    pkg: 6.5,
    branches: ['CSE', 'IT', 'ECE', 'EE'],
    cgpaCutoff: 6.0,
    allowBacklogs: true,
    status: 'Open',
  },
  {
    id: 'CV004',
    company: 'Microsoft IDC',
    role: 'Software Engineer',
    date: '2026-05-10',
    pkg: 42.0,
    branches: ['CSE', 'IT', 'ECE'],
    cgpaCutoff: 8.0,
    allowBacklogs: false,
    status: 'Closed',
  },
]

const PlacementCompanyVisits: React.FC = () => {
  const [branches, setBranches] = useState<Branch[]>([])
  useEffect(() => {
    getBranches().then(setBranches)
  }, [])

  const [visits, setVisits] = useState<CompanyVisit[]>(MOCK_VISITS)
  const [search, setSearch] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [editVisit, setEditVisit] = useState<CompanyVisit | null>(null)
  const [toast, setToast] = useState('')

  // Form State
  const [company, setCompany] = useState('')
  const [role, setRole] = useState('')
  const [pkg, setPkg] = useState(0)
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10))
  const [selectedBranches, setSelectedBranches] = useState<string[]>([])
  const [cgpaCutoff, setCgpaCutoff] = useState(6.0)
  const [allowBacklogs, setAllowBacklogs] = useState(false)
  const [status, setStatus] = useState<CompanyVisit['status']>('Scheduled')

  const handleOpenAdd = () => {
    setEditVisit(null)
    setCompany('')
    setRole('')
    setPkg(4.5)
    setDate(new Date().toISOString().slice(0, 10))
    setSelectedBranches([])
    setCgpaCutoff(6.0)
    setAllowBacklogs(false)
    setStatus('Scheduled')
    setShowModal(true)
  }

  const handleOpenEdit = (v: CompanyVisit) => {
    setEditVisit(v)
    setCompany(v.company)
    setRole(v.role)
    setPkg(v.pkg)
    setDate(v.date)
    setSelectedBranches(v.branches)
    setCgpaCutoff(v.cgpaCutoff)
    setAllowBacklogs(v.allowBacklogs)
    setStatus(v.status)
    setShowModal(true)
  }

  const handleBranchCheckbox = (branchId: string) => {
    setSelectedBranches(prev =>
      prev.includes(branchId) ? prev.filter(b => b !== branchId) : [...prev, branchId]
    )
  }

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault()
    if (!company || !role || selectedBranches.length === 0) {
      setToast('Please complete all form fields.')
      return
    }

    if (editVisit) {
      setVisits(prev =>
        prev.map(v =>
          v.id === editVisit.id
            ? {
                ...v,
                company,
                role,
                pkg: Number(pkg),
                date,
                branches: selectedBranches,
                cgpaCutoff: Number(cgpaCutoff),
                allowBacklogs,
                status,
              }
            : v
        )
      )
      setToast('Drive details updated successfully.')
    } else {
      const newVisit: CompanyVisit = {
        id: `CV0${visits.length + 1}`,
        company,
        role,
        pkg: Number(pkg),
        date,
        branches: selectedBranches,
        cgpaCutoff: Number(cgpaCutoff),
        allowBacklogs,
        status,
      }
      setVisits(prev => [newVisit, ...prev])
      setToast('Company visit drive scheduled successfully.')
    }
    setShowModal(false)
  }

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this company drive?')) {
      setVisits(prev => prev.filter(v => v.id !== id))
      setToast('Drive schedule deleted.')
    }
  }

  const filteredVisits = visits.filter(v =>
    v.company.toLowerCase().includes(search.toLowerCase()) ||
    v.role.toLowerCase().includes(search.toLowerCase())
  )

  const getStatusBadgeVariant = (s: CompanyVisit['status']) => {
    switch (s) {
      case 'Open': return 'success'
      case 'Scheduled': return 'info'
      case 'Closed': return 'error'
      default: return 'default'
    }
  }

  return (
    <div className="space-y-5">
      <PageHeader
        title="Company Recruitment Visits"
        subtitle="Schedule recruiter visits, set eligible criteria/branches, and track drive statuses"
        action={
          <button
            onClick={handleOpenAdd}
            className="bg-primary hover:bg-primary/95 text-white text-sm font-semibold px-4 py-2 rounded-lg flex items-center gap-2 transition-colors shadow-sm"
          >
            <Plus size={15} />
            <span>Schedule Drive</span>
          </button>
        }
      />

      <div className="flex items-center gap-3 bg-white p-3 border border-slate-200 rounded-xl shadow-sm">
        <Search className="text-slate-400 shrink-0" size={18} />
        <input
          type="text"
          placeholder="Search drives by recruiter name, role..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full text-sm text-slate-700 bg-transparent focus:outline-none"
        />
      </div>

      <PortalCard>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="text-left px-4 py-3 text-[11px] font-bold text-slate-500 uppercase tracking-wider">Recruiter & Role</th>
                <th className="text-center px-4 py-3 text-[11px] font-bold text-slate-500 uppercase tracking-wider">CTC Package</th>
                <th className="text-left px-4 py-3 text-[11px] font-bold text-slate-500 uppercase tracking-wider">Eligible Branches</th>
                <th className="text-center px-4 py-3 text-[11px] font-bold text-slate-500 uppercase tracking-wider">Cutoff</th>
                <th className="text-left px-4 py-3 text-[11px] font-bold text-slate-500 uppercase tracking-wider">Drive Date</th>
                <th className="text-center px-4 py-3 text-[11px] font-bold text-slate-500 uppercase tracking-wider">Status</th>
                <th className="text-center px-4 py-3 text-[11px] font-bold text-slate-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredVisits.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-8 text-slate-400 text-xs">
                    No recruitment visits scheduled. Schedule one to start.
                  </td>
                </tr>
              ) : (
                filteredVisits.map(v => (
                  <tr key={v.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-4 py-3">
                      <p className="font-semibold text-slate-800">{v.company}</p>
                      <p className="text-xs text-slate-500 mt-0.5">{v.role}</p>
                    </td>
                    <td className="px-4 py-3 text-center text-slate-700 font-bold whitespace-nowrap">
                      {v.pkg} LPA
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap gap-1">
                        {v.branches.map(b => (
                          <span key={b} className="text-[10px] bg-slate-100 text-[#0b2545] border border-slate-200 px-1.5 py-0.5 rounded font-medium">
                            {b}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-center text-xs text-slate-600 font-medium">
                      <div>CGPA &ge; {v.cgpaCutoff}</div>
                      <div className="text-[10px] text-slate-400 mt-0.5">
                        {v.allowBacklogs ? 'Backlogs allowed' : 'No backlogs'}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-slate-500 text-xs font-semibold whitespace-nowrap">
                      <span className="flex items-center gap-1">
                        <Calendar size={12} className="text-slate-400" />
                        <span>{v.date}</span>
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <Badge
                        label={v.status}
                        variant={getStatusBadgeVariant(v.status)}
                      />
                    </td>
                    <td className="px-4 py-3 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          onClick={() => handleOpenEdit(v)}
                          className="p-1.5 text-slate-500 hover:text-primary hover:bg-slate-100 rounded transition-colors"
                          title="Edit Drive Details"
                        >
                          <Edit2 size={13} />
                        </button>
                        <button
                          onClick={() => handleDelete(v.id)}
                          className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                          title="Delete Drive"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </PortalCard>

      {/* Add / Edit Modal */}
      <PortalModal
        isOpen={showModal}
        title={editVisit ? 'Edit Drive Schedule' : 'Schedule New Recruiter Visit'}
        onClose={() => setShowModal(false)}
      >
        <form onSubmit={handleSave} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-600 uppercase tracking-wide mb-1">
                Company Name
              </label>
              <input
                type="text"
                required
                value={company}
                onChange={e => setCompany(e.target.value)}
                placeholder="e.g. Amazon"
                className="w-full border border-slate-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-primary"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-600 uppercase tracking-wide mb-1">
                Job Role / Title
              </label>
              <input
                type="text"
                required
                value={role}
                onChange={e => setRole(e.target.value)}
                placeholder="e.g. Software Development Engineer"
                className="w-full border border-slate-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-primary"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-600 uppercase tracking-wide mb-1">
                CTC Package (LPA)
              </label>
              <input
                type="number"
                step="0.1"
                required
                value={pkg}
                onChange={e => setPkg(Number(e.target.value))}
                className="w-full border border-slate-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-primary"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-600 uppercase tracking-wide mb-1">
                CGPA Threshold
              </label>
              <input
                type="number"
                step="0.01"
                required
                value={cgpaCutoff}
                onChange={e => setCgpaCutoff(Number(e.target.value))}
                className="w-full border border-slate-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-primary"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-600 uppercase tracking-wide mb-1">
                Drive Date
              </label>
              <input
                type="date"
                required
                value={date}
                onChange={e => setDate(e.target.value)}
                className="w-full border border-slate-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-primary"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-600 uppercase tracking-wide mb-1">
              Eligible Branches
            </label>
            <div className="grid grid-cols-3 gap-2 bg-slate-50 p-3 rounded-lg border border-slate-100 max-h-32 overflow-y-auto">
              {branches.map(b => (
                <label key={b.id} className="flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={selectedBranches.includes(b.id)}
                    onChange={() => handleBranchCheckbox(b.id)}
                    className="w-3.5 h-3.5 rounded accent-primary"
                  />
                  <span className="text-xs text-slate-700 font-semibold select-none">{b.shortName}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-600 uppercase tracking-wide mb-1">
                Active Backlogs Allowed
              </label>
              <select
                value={allowBacklogs ? 'yes' : 'no'}
                onChange={e => setAllowBacklogs(e.target.value === 'yes')}
                className="w-full border border-slate-200 rounded px-3 py-2 text-sm bg-white focus:outline-none focus:border-primary"
              >
                <option value="no">No active backlogs allowed</option>
                <option value="yes">Yes, allowed</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-600 uppercase tracking-wide mb-1">
                Drive Status
              </label>
              <select
                value={status}
                onChange={e => setStatus(e.target.value as CompanyVisit['status'])}
                className="w-full border border-slate-200 rounded px-3 py-2 text-sm bg-white focus:outline-none focus:border-primary"
              >
                <option value="Scheduled">Scheduled</option>
                <option value="Open">Open (Applications Accepting)</option>
                <option value="Closed">Closed</option>
              </select>
            </div>
          </div>

          <div className="flex items-center gap-3 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setShowModal(false)}
              className="flex-1 py-2 border border-slate-200 text-slate-700 rounded font-semibold text-sm hover:bg-slate-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 py-2 bg-primary text-white rounded font-semibold text-sm hover:bg-primary/95 transition-colors"
            >
              {editVisit ? 'Save Changes' : 'Schedule Drive'}
            </button>
          </div>
        </form>
      </PortalModal>

      {toast && <Toast message={toast} onClose={() => setToast('')} />}
    </div>
  )
}

export default PlacementCompanyVisits
