import React, { useState, useEffect } from 'react'
import { PageHeader, PortalCard, PortalModal, Badge } from '../../components/layout/PortalLayout'
import { Plus, Search, Trash2, Globe, X } from 'lucide-react'

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

interface DownloadItem {
  id: string
  title: string
  category: 'Form' | 'Ordinance' | 'Rulebook' | 'Other'
  dateAdded: string
  fileUrl: string
}

const MOCK_DOWNLOADS: DownloadItem[] = [
  {
    id: 'dl1',
    title: 'Application Form for Re-valuation / Re-totalling of Answer Books',
    category: 'Form',
    dateAdded: '2026-05-01',
    fileUrl: 'https://sgsits.ac.in/exam/downloads/reval_form.pdf',
  },
  {
    id: 'dl2',
    title: 'Rules & Guidelines for Ordinance 14 (Grading System)',
    category: 'Ordinance',
    dateAdded: '2025-10-15',
    fileUrl: 'https://sgsits.ac.in/exam/downloads/ordinance_14.pdf',
  },
  {
    id: 'dl3',
    title: 'Application Form for Duplicate Marksheet / Degree Certificate',
    category: 'Form',
    dateAdded: '2026-04-10',
    fileUrl: 'https://sgsits.ac.in/exam/downloads/duplicate_cert_form.pdf',
  },
  {
    id: 'dl4',
    title: 'Examination Discipline & Malpractice Preventive Regulations',
    category: 'Rulebook',
    dateAdded: '2024-08-20',
    fileUrl: 'https://sgsits.ac.in/exam/downloads/exam_rules.pdf',
  },
]

const ExamDownloads: React.FC = () => {
  const [downloads, setDownloads] = useState<DownloadItem[]>(MOCK_DOWNLOADS)
  const [search, setSearch] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [toast, setToast] = useState('')

  // Form State
  const [title, setTitle] = useState('')
  const [category, setCategory] = useState<'Form' | 'Ordinance' | 'Rulebook' | 'Other'>('Form')
  const [fileUrl, setFileUrl] = useState('')

  const handleOpenAdd = () => {
    setTitle('')
    setCategory('Form')
    setFileUrl('')
    setShowModal(true)
  }

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault()
    if (!title || !fileUrl) {
      setToast('Please fill all fields.')
      return
    }

    const newItem: DownloadItem = {
      id: `dl${Date.now()}`,
      title,
      category,
      dateAdded: new Date().toISOString().slice(0, 10),
      fileUrl,
    }

    setDownloads(prev => [newItem, ...prev])
    setToast('Resource uploaded successfully.')
    setShowModal(false)
  }

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this resource?')) {
      setDownloads(prev => prev.filter(d => d.id !== id))
      setToast('Resource deleted successfully.')
    }
  }

  const filteredDownloads = downloads.filter(d =>
    d.title.toLowerCase().includes(search.toLowerCase()) ||
    d.category.toLowerCase().includes(search.toLowerCase())
  )

  const getCategoryBadgeVariant = (cat: DownloadItem['category']) => {
    switch (cat) {
      case 'Form': return 'info'
      case 'Ordinance': return 'success'
      case 'Rulebook': return 'warning'
      default: return 'default'
    }
  }

  return (
    <div className="space-y-5">
      <PageHeader
        title="Exam Downloads"
        subtitle="Manage forms, ordinances, rules, and downloadable resources published by the examination office"
        action={
          <button
            onClick={handleOpenAdd}
            className="bg-primary hover:bg-primary/95 text-white text-sm font-semibold px-4 py-2 rounded-lg flex items-center gap-2 transition-colors shadow-sm"
          >
            <Plus size={15} />
            <span>Upload Resource</span>
          </button>
        }
      />

      <div className="flex items-center gap-3 bg-white p-3 border border-slate-200 rounded-xl shadow-sm">
        <Search className="text-slate-400 shrink-0" size={18} />
        <input
          type="text"
          placeholder="Search resources by title or category..."
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
                <th className="text-left px-4 py-3 text-[11px] font-bold text-slate-500 uppercase tracking-wider">Resource Title</th>
                <th className="text-center px-4 py-3 text-[11px] font-bold text-slate-500 uppercase tracking-wider">Category</th>
                <th className="text-left px-4 py-3 text-[11px] font-bold text-slate-500 uppercase tracking-wider">Date Added</th>
                <th className="text-center px-4 py-3 text-[11px] font-bold text-slate-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredDownloads.length === 0 ? (
                <tr>
                  <td colSpan={4} className="text-center py-8 text-slate-400 text-xs">
                    No downloadable resources found. Upload one to get started.
                  </td>
                </tr>
              ) : (
                filteredDownloads.map(dl => (
                  <tr key={dl.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-4 py-3">
                      <a
                        href={dl.fileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-semibold text-slate-800 hover:text-primary hover:underline block"
                      >
                        {dl.title}
                      </a>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <Badge
                        label={dl.category}
                        variant={getCategoryBadgeVariant(dl.category)}
                      />
                    </td>
                    <td className="px-4 py-3 text-slate-500 text-xs font-semibold whitespace-nowrap">
                      {dl.dateAdded}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        <a
                          href={dl.fileUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-1.5 text-slate-500 hover:text-primary hover:bg-slate-100 rounded transition-colors"
                          title="Open Resource PDF"
                        >
                          <Globe size={13} />
                        </a>
                        <button
                          onClick={() => handleDelete(dl.id)}
                          className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                          title="Delete Resource"
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
      <PortalModal isOpen={showModal} title="Upload Downloadable Resource" onClose={() => setShowModal(false)}>
        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-600 uppercase tracking-wide mb-1">
              Resource Title
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="e.g. Revaluation Application Form 2026-27"
              className="w-full border border-slate-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-primary"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-600 uppercase tracking-wide mb-1">
              Category
            </label>
            <select
              value={category}
              onChange={e => setCategory(e.target.value as DownloadItem['category'])}
              required
              className="w-full border border-slate-200 rounded px-3 py-2 text-sm bg-white focus:outline-none focus:border-primary"
            >
              <option value="Form">Form</option>
              <option value="Ordinance">Ordinance</option>
              <option value="Rulebook">Rulebook</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-600 uppercase tracking-wide mb-1">
              Resource PDF Link
            </label>
            <input
              type="url"
              required
              value={fileUrl}
              onChange={e => setFileUrl(e.target.value)}
              placeholder="https://example.com/exam/downloads/document.pdf"
              className="w-full border border-slate-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-primary"
            />
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
              Upload Resource
            </button>
          </div>
        </form>
      </PortalModal>

      {toast && <Toast message={toast} onClose={() => setToast('')} />}
    </div>
  )
}

export default ExamDownloads
