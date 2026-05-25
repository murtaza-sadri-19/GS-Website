import React, { useState, useEffect } from 'react'
import { PageHeader, PortalCard, PortalModal, Badge } from '../../components/layout/PortalLayout'
import { Plus, Search, Calendar, Edit2, Trash2, Globe, X } from 'lucide-react'

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

interface InternshipPost {
  id: string
  company: string
  role: string
  stipend: string
  duration: number
  batch: string
  deadline: string
  applyUrl: string
  status: 'Open' | 'Closed'
}

const MOCK_INTERNSHIPS: InternshipPost[] = [
  {
    id: 'IP001',
    company: 'Goldman Sachs',
    role: 'Summer Analyst Intern',
    stipend: '₹75,000 / month',
    duration: 2,
    batch: 'Batch 2027 (Pre-final Year)',
    deadline: '2026-06-15',
    applyUrl: 'https://goldmansachs.com/careers/analysts.html',
    status: 'Open',
  },
  {
    id: 'IP002',
    company: 'Amazon India',
    role: 'Software Development Engineer Intern',
    stipend: '₹80,000 / month',
    duration: 6,
    batch: 'Batch 2026 (Final Year - Dec Grad)',
    deadline: '2026-06-08',
    applyUrl: 'https://amazon.jobs/jobs/sde-intern.html',
    status: 'Open',
  },
  {
    id: 'IP003',
    company: 'Intel Technology',
    role: 'Hardware Validation Intern',
    stipend: '₹40,000 / month',
    duration: 6,
    batch: 'ME/MTech (ECE/VLSI)',
    deadline: '2026-05-01',
    applyUrl: 'https://intel.com/careers/hardware-intern.html',
    status: 'Closed',
  },
]

const PlacementInternships: React.FC = () => {
  const [internships, setInternships] = useState<InternshipPost[]>(MOCK_INTERNSHIPS)
  const [search, setSearch] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [editPost, setEditPost] = useState<InternshipPost | null>(null)
  const [toast, setToast] = useState('')

  // Form State
  const [company, setCompany] = useState('')
  const [role, setRole] = useState('')
  const [stipend, setStipend] = useState('₹40,000 / month')
  const [duration, setDuration] = useState(2)
  const [batch, setBatch] = useState('')
  const [deadline, setDeadline] = useState('')
  const [applyUrl, setApplyUrl] = useState('')
  const [status, setStatus] = useState<InternshipPost['status']>('Open')

  const handleOpenAdd = () => {
    setEditPost(null)
    setCompany('')
    setRole('')
    setStipend('₹40,000 / month')
    setDuration(2)
    setBatch('Batch 2027 (Pre-final Year)')
    setDeadline(new Date().toISOString().slice(0, 10))
    setApplyUrl('')
    setStatus('Open')
    setShowModal(true)
  }

  const handleOpenEdit = (ip: InternshipPost) => {
    setEditPost(ip)
    setCompany(ip.company)
    setRole(ip.role)
    setStipend(ip.stipend)
    setDuration(ip.duration)
    setBatch(ip.batch)
    setDeadline(ip.deadline)
    setApplyUrl(ip.applyUrl)
    setStatus(ip.status)
    setShowModal(true)
  }

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault()
    if (!company || !role || !batch || !applyUrl) {
      setToast('Please fill all required fields.')
      return
    }

    if (editPost) {
      setInternships(prev =>
        prev.map(ip =>
          ip.id === editPost.id
            ? {
                ...ip,
                company,
                role,
                stipend,
                duration: Number(duration),
                batch,
                deadline,
                applyUrl,
                status,
              }
            : ip
        )
      )
      setToast('Internship details updated.')
    } else {
      const newPost: InternshipPost = {
        id: `IP0${internships.length + 1}`,
        company,
        role,
        stipend,
        duration: Number(duration),
        batch,
        deadline,
        applyUrl,
        status,
      }
      setInternships(prev => [newPost, ...prev])
      setToast('Internship post published successfully.')
    }
    setShowModal(false)
  }

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this internship posting?')) {
      setInternships(prev => prev.filter(ip => ip.id !== id))
      setToast('Internship post deleted.')
    }
  }

  const filteredInternships = internships.filter(ip =>
    ip.company.toLowerCase().includes(search.toLowerCase()) ||
    ip.role.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="space-y-5">
      <PageHeader
        title="Internship Postings"
        subtitle="Publish and manage summer or winter internship listings, stipends, and deadlines for students"
        action={
          <button
            onClick={handleOpenAdd}
            className="bg-primary hover:bg-primary/95 text-white text-sm font-semibold px-4 py-2 rounded-lg flex items-center gap-2 transition-colors shadow-sm"
          >
            <Plus size={15} />
            <span>Publish Internship</span>
          </button>
        }
      />

      <div className="flex items-center gap-3 bg-white p-3 border border-slate-200 rounded-xl shadow-sm">
        <Search className="text-slate-400 shrink-0" size={18} />
        <input
          type="text"
          placeholder="Search internships by company, role..."
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
                <th className="text-left px-4 py-3 text-[11px] font-bold text-slate-500 uppercase tracking-wider">Company & Role</th>
                <th className="text-left px-4 py-3 text-[11px] font-bold text-slate-500 uppercase tracking-wider">Target Batch</th>
                <th className="text-center px-4 py-3 text-[11px] font-bold text-slate-500 uppercase tracking-wider">Duration</th>
                <th className="text-left px-4 py-3 text-[11px] font-bold text-slate-500 uppercase tracking-wider">Stipend</th>
                <th className="text-left px-4 py-3 text-[11px] font-bold text-slate-500 uppercase tracking-wider">Deadline</th>
                <th className="text-center px-4 py-3 text-[11px] font-bold text-slate-500 uppercase tracking-wider">Status</th>
                <th className="text-center px-4 py-3 text-[11px] font-bold text-slate-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredInternships.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-8 text-slate-400 text-xs">
                    No internship postings published.
                  </td>
                </tr>
              ) : (
                filteredInternships.map(ip => (
                  <tr key={ip.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-4 py-3">
                      <p className="font-semibold text-slate-800 text-sm">{ip.company}</p>
                      <p className="text-xs text-slate-500 mt-0.5">{ip.role}</p>
                    </td>
                    <td className="px-4 py-3 text-xs text-slate-600 font-semibold whitespace-nowrap">
                      {ip.batch}
                    </td>
                    <td className="px-4 py-3 text-center text-xs text-slate-600 font-bold whitespace-nowrap">
                      {ip.duration} Months
                    </td>
                    <td className="px-4 py-3 text-xs text-slate-700 font-medium whitespace-nowrap">
                      {ip.stipend}
                    </td>
                    <td className="px-4 py-3 text-slate-500 text-xs font-semibold whitespace-nowrap">
                      <span className="flex items-center gap-1">
                        <Calendar size={12} className="text-slate-400" />
                        <span>{ip.deadline}</span>
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <Badge
                        label={ip.status}
                        variant={ip.status === 'Open' ? 'success' : 'error'}
                      />
                    </td>
                    <td className="px-4 py-3 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        <a
                          href={ip.applyUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-1.5 text-slate-500 hover:text-primary hover:bg-slate-100 rounded transition-colors"
                          title="Open Application Page"
                        >
                          <Globe size={13} />
                        </a>
                        <button
                          onClick={() => handleOpenEdit(ip)}
                          className="p-1.5 text-slate-500 hover:text-primary hover:bg-slate-100 rounded transition-colors"
                          title="Edit Details"
                        >
                          <Edit2 size={13} />
                        </button>
                        <button
                          onClick={() => handleDelete(ip.id)}
                          className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                          title="Delete Post"
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

      {/* Add Modal */}
      <PortalModal isOpen={showModal} title={editPost ? 'Edit Internship Details' : 'Publish Internship Details'} onClose={() => setShowModal(false)}>
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
                placeholder="e.g. Goldman Sachs"
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
                placeholder="e.g. Software Development Intern"
                className="w-full border border-slate-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-primary"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="col-span-2">
              <label className="block text-xs font-bold text-slate-600 uppercase tracking-wide mb-1">
                Stipend Details
              </label>
              <input
                type="text"
                required
                value={stipend}
                onChange={e => setStipend(e.target.value)}
                placeholder="e.g. ₹40,000 / month"
                className="w-full border border-slate-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-primary"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-600 uppercase tracking-wide mb-1">
                Duration (Months)
              </label>
              <input
                type="number"
                required
                value={duration}
                onChange={e => setDuration(Number(e.target.value))}
                className="w-full border border-slate-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-primary"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-600 uppercase tracking-wide mb-1">
                Eligible Batch
              </label>
              <input
                type="text"
                required
                value={batch}
                onChange={e => setBatch(e.target.value)}
                placeholder="e.g. Batch 2027 (Pre-final)"
                className="w-full border border-slate-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-primary"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-600 uppercase tracking-wide mb-1">
                Apply Deadline
              </label>
              <input
                type="date"
                required
                value={deadline}
                onChange={e => setDeadline(e.target.value)}
                className="w-full border border-slate-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-primary"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-600 uppercase tracking-wide mb-1">
              Apply Link / Form URL
            </label>
            <input
              type="url"
              required
              value={applyUrl}
              onChange={e => setApplyUrl(e.target.value)}
              placeholder="https://example.com/careers/apply"
              className="w-full border border-slate-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-primary"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-600 uppercase tracking-wide mb-1">
              Internship Status
            </label>
            <select
              value={status}
              onChange={e => setStatus(e.target.value as InternshipPost['status'])}
              className="w-full border border-slate-200 rounded px-3 py-2 text-sm bg-white focus:outline-none focus:border-primary"
            >
              <option value="Open">Open</option>
              <option value="Closed">Closed</option>
            </select>
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
              Publish Internship
            </button>
          </div>
        </form>
      </PortalModal>

      {toast && <Toast message={toast} onClose={() => setToast('')} />}
    </div>
  )
}

export default PlacementInternships
