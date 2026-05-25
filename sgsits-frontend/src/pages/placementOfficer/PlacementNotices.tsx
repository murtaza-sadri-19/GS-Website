import React, { useState, useEffect } from 'react'
import { PageHeader, PortalCard, PortalModal, Badge } from '../../components/layout/PortalLayout'
import { Plus, Search, Edit2, Trash2, Globe, X } from 'lucide-react'

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

interface PlacementNotice {
  id: string
  title: string
  category: 'Job Announcement' | 'Internship Alert' | 'Training Notice' | 'General Circular'
  date: string
  description: string
  fileUrl?: string
  isPinned: boolean
}

const MOCK_NOTICES: PlacementNotice[] = [
  {
    id: 'pn1',
    title: 'Microsoft Campus Recruitment Drive 2026 for BE/ME',
    category: 'Job Announcement',
    date: '2026-05-20',
    description: 'Microsoft IDC is visiting for Software Engineering roles. CTC offered is 42 LPA. CGPA threshold is 8.0+.',
    fileUrl: 'https://sgsits.ac.in/tnp/microsoft_drive_details_2026.pdf',
    isPinned: true,
  },
  {
    id: 'pn2',
    title: 'Infosys SP & DSE Internship Opportunity - Pre-final Year',
    category: 'Internship Alert',
    date: '2026-05-18',
    description: 'Infosys hiring Specialist Programmer and Digital Specialist Engineer Interns. 3-6 months internship from Jan 2027.',
    fileUrl: 'https://sgsits.ac.in/tnp/infosys_internship_circular_2026.pdf',
    isPinned: false,
  },
  {
    id: 'pn3',
    title: 'Aptitude & Reasoning Online Boot Camp - Batch 2027',
    category: 'Training Notice',
    date: '2026-05-12',
    description: 'Mandatory aptitude prep sessions commencing next Monday. Register before Friday midnight.',
    isPinned: false,
  },
]

const PlacementNotices: React.FC = () => {
  const [notices, setNotices] = useState<PlacementNotice[]>(MOCK_NOTICES)
  const [search, setSearch] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [editNotice, setEditNotice] = useState<PlacementNotice | null>(null)
  const [toast, setToast] = useState('')

  // Form State
  const [title, setTitle] = useState('')
  const [category, setCategory] = useState<PlacementNotice['category']>('Job Announcement')
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10))
  const [description, setDescription] = useState('')
  const [fileUrl, setFileUrl] = useState('')
  const [isPinned, setIsPinned] = useState(false)

  const handleOpenAdd = () => {
    setEditNotice(null)
    setTitle('')
    setCategory('Job Announcement')
    setDate(new Date().toISOString().slice(0, 10))
    setDescription('')
    setFileUrl('')
    setIsPinned(false)
    setShowModal(true)
  }

  const handleOpenEdit = (notice: PlacementNotice) => {
    setEditNotice(notice)
    setTitle(notice.title)
    setCategory(notice.category)
    setDate(notice.date)
    setDescription(notice.description)
    setFileUrl(notice.fileUrl || '')
    setIsPinned(notice.isPinned)
    setShowModal(true)
  }

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault()
    if (!title || !description) return

    if (editNotice) {
      setNotices(prev =>
        prev.map(n =>
          n.id === editNotice.id
            ? {
                ...n,
                title,
                category,
                date,
                description,
                fileUrl: fileUrl || undefined,
                isPinned,
              }
            : n
        )
      )
      setToast('Notice updated successfully.')
    } else {
      const newNotice: PlacementNotice = {
        id: `pn${Date.now()}`,
        title,
        category,
        date,
        description,
        fileUrl: fileUrl || undefined,
        isPinned,
      }
      setNotices(prev => [newNotice, ...prev])
      setToast('Circular published successfully.')
    }
    setShowModal(false)
  }

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this notice?')) {
      setNotices(prev => prev.filter(n => n.id !== id))
      setToast('Notice deleted successfully.')
    }
  }

  const filteredNotices = notices.filter(n =>
    n.title.toLowerCase().includes(search.toLowerCase()) ||
    n.description.toLowerCase().includes(search.toLowerCase())
  )

  const getCategoryBadgeVariant = (cat: PlacementNotice['category']) => {
    switch (cat) {
      case 'Job Announcement': return 'warning'
      case 'Internship Alert': return 'info'
      case 'Training Notice': return 'success'
      default: return 'default'
    }
  }

  return (
    <div className="space-y-5">
      <PageHeader
        title="Placement Notices"
        subtitle="Publish, edit, and manage T&P circulars, drives updates, and training schedules for students"
        action={
          <button
            onClick={handleOpenAdd}
            className="bg-primary hover:bg-primary/95 text-white text-sm font-semibold px-4 py-2 rounded-lg flex items-center gap-2 transition-colors shadow-sm"
          >
            <Plus size={15} />
            <span>Publish Notice</span>
          </button>
        }
      />

      <div className="flex items-center gap-3 bg-white p-3 border border-slate-200 rounded-xl shadow-sm">
        <Search className="text-slate-400 shrink-0" size={18} />
        <input
          type="text"
          placeholder="Search placement notices by title or content..."
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
                <th className="text-left px-4 py-3 text-[11px] font-bold text-slate-500 uppercase tracking-wider">Notice</th>
                <th className="text-center px-4 py-3 text-[11px] font-bold text-slate-500 uppercase tracking-wider">Category</th>
                <th className="text-left px-4 py-3 text-[11px] font-bold text-slate-500 uppercase tracking-wider">Date</th>
                <th className="text-center px-4 py-3 text-[11px] font-bold text-slate-500 uppercase tracking-wider">Attachment</th>
                <th className="text-center px-4 py-3 text-[11px] font-bold text-slate-500 uppercase tracking-wider">Status</th>
                <th className="text-center px-4 py-3 text-[11px] font-bold text-slate-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredNotices.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-8 text-slate-400 text-xs">
                    No placement notices found. Publish one to get started.
                  </td>
                </tr>
              ) : (
                filteredNotices.map(notice => (
                  <tr key={notice.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-4 py-3 max-w-md">
                      <p className="font-semibold text-slate-800 text-sm line-clamp-1">{notice.title}</p>
                      <p className="text-xs text-slate-500 line-clamp-2 mt-0.5">{notice.description}</p>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <Badge
                        label={notice.category}
                        variant={getCategoryBadgeVariant(notice.category)}
                      />
                    </td>
                    <td className="px-4 py-3 text-slate-500 text-xs font-semibold whitespace-nowrap">
                      {notice.date}
                    </td>
                    <td className="px-4 py-3 text-center">
                      {notice.fileUrl ? (
                        <a
                          href={notice.fileUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline"
                        >
                          <Globe size={12} />
                          <span>PDF</span>
                        </a>
                      ) : (
                        <span className="text-slate-300 text-xs">—</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-center">
                      {notice.isPinned ? (
                        <Badge label="PINNED" variant="warning" />
                      ) : (
                        <Badge label="NORMAL" variant="default" />
                      )}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          onClick={() => handleOpenEdit(notice)}
                          className="p-1.5 text-slate-500 hover:text-primary hover:bg-slate-100 rounded transition-colors"
                          title="Edit Notice"
                        >
                          <Edit2 size={13} />
                        </button>
                        <button
                          onClick={() => handleDelete(notice.id)}
                          className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                          title="Delete Notice"
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
        title={editNotice ? 'Edit Notice Details' : 'Publish Placement Circular'}
        onClose={() => setShowModal(false)}
      >
        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-600 uppercase tracking-wide mb-1">
              Notice Title
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="e.g. Microsoft Recruitment Drive 2026"
              className="w-full border border-slate-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-primary"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-600 uppercase tracking-wide mb-1">
                Category
              </label>
              <select
                value={category}
                onChange={e => setCategory(e.target.value as PlacementNotice['category'])}
                required
                className="w-full border border-slate-200 rounded px-3 py-2 text-sm bg-white focus:outline-none focus:border-primary"
              >
                <option value="Job Announcement">Job Announcement</option>
                <option value="Internship Alert">Internship Alert</option>
                <option value="Training Notice">Training Notice</option>
                <option value="General Circular">General Circular</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-600 uppercase tracking-wide mb-1">
                Publish Date
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
              Circular Description / Details
            </label>
            <textarea
              required
              rows={4}
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="Provide eligibility criteria, application process, syllabus, timings..."
              className="w-full border border-slate-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-primary resize-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-600 uppercase tracking-wide mb-1">
              File Attachment URL (Optional)
            </label>
            <input
              type="url"
              value={fileUrl}
              onChange={e => setFileUrl(e.target.value)}
              placeholder="https://example.com/circulars/details.pdf"
              className="w-full border border-slate-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-primary"
            />
          </div>

          <label className="flex items-center gap-2 cursor-pointer pt-1">
            <input
              type="checkbox"
              checked={isPinned}
              onChange={e => setIsPinned(e.target.checked)}
              className="w-4 h-4 accent-primary rounded"
            />
            <span className="text-sm font-semibold text-slate-700 select-none">
              Pin notice to top of the student board
            </span>
          </label>

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
              {editNotice ? 'Save Changes' : 'Publish circular'}
            </button>
          </div>
        </form>
      </PortalModal>

      {toast && <Toast message={toast} onClose={() => setToast('')} />}
    </div>
  )
}

export default PlacementNotices
