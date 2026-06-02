import React, { useState, useEffect, useCallback } from 'react'
import { PageHeader, PortalCard, PortalModal, Badge } from '../../components/layout/PortalLayout'
import { Plus, Search, Trash2, X, Link2, FileText, RefreshCw } from 'lucide-react'
import AttachmentUpload from '../../components/admin/AttachmentUpload'
import type { AttachmentRecord } from '../../api/index'
import { apiClient } from '../../api/client'

interface ToastProps { message: string; onClose: () => void }
const Toast: React.FC<ToastProps> = ({ message, onClose }) => {
  useEffect(() => {
    const t = setTimeout(onClose, 3000)
    return () => clearTimeout(t)
  }, [onClose])
  return (
    <div className="fixed bottom-4 right-4 z-50 bg-[#0b2545] text-white px-5 py-3 rounded-lg shadow-lg flex items-center gap-3 text-sm font-medium">
      {message}
      <button onClick={onClose} className="hover:text-slate-300"><X size={14} /></button>
    </div>
  )
}

type DocCategory = 'Form' | 'Ordinance' | 'Rulebook' | 'Other'
const CATEGORY_OPTIONS: DocCategory[] = ['Form', 'Ordinance', 'Rulebook', 'Other']

interface DownloadItem {
  id: number
  title: string
  category: string
  created_at: string
  file_url: string
  file_id: number
  attachment_type: 'FILE' | 'EXTERNAL_LINK'
  original_name: string
  status: string
}

const ExamDownloads: React.FC = () => {
  const [downloads, setDownloads] = useState<DownloadItem[]>([])
  const [loading, setLoading]     = useState(true)
  const [search, setSearch]       = useState('')
  const [showModal, setShowModal] = useState(false)
  const [toast, setToast]         = useState('')
  const [saving, setSaving]       = useState(false)

  const [title, setTitle]                       = useState('')
  const [category, setCategory]                 = useState<DocCategory>('Form')
  const [fileId, setFileId]                     = useState<number | null>(null)
  const [attachmentRecord, setAttachmentRecord] = useState<AttachmentRecord | null>(null)

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const res = await apiClient.get('/v1/downloads', { params: { pageSize: 100, category: 'Form,Ordinance,Rulebook,Other' } })
      setDownloads(res.data?.data?.downloads ?? [])
    } catch {
      setToast('Failed to load downloads.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { load() }, [load])

  const handleOpenAdd = () => {
    setTitle(''); setCategory('Form')
    setFileId(null); setAttachmentRecord(null)
    setShowModal(true)
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim() || !fileId) {
      setToast('Please provide a title and attach a file or external link.')
      return
    }
    setSaving(true)
    try {
      await apiClient.post('/v1/downloads', { title: title.trim(), category, file_id: fileId })
      setToast('Resource added successfully.')
      setShowModal(false)
      load()
    } catch {
      setToast('Failed to save resource.')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this resource?')) return
    try {
      await apiClient.delete(`/v1/downloads/${id}`)
      setToast('Resource deleted successfully.')
      load()
    } catch {
      setToast('Failed to delete resource.')
    }
  }

  const filtered = downloads.filter(d =>
    d.title.toLowerCase().includes(search.toLowerCase()) ||
    d.category.toLowerCase().includes(search.toLowerCase())
  )

  const getCategoryBadgeVariant = (cat: string) => {
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
          <div className="flex items-center gap-2">
            <button
              onClick={load}
              className="p-2 border border-slate-200 rounded-lg text-slate-500 hover:text-primary hover:bg-slate-50 transition-colors"
              title="Refresh"
            >
              <RefreshCw size={15} />
            </button>
            <button
              onClick={handleOpenAdd}
              className="bg-primary hover:bg-primary/95 text-white text-sm font-semibold px-4 py-2 rounded-lg flex items-center gap-2 transition-colors shadow-sm"
            >
              <Plus size={15} />
              <span>Upload Resource</span>
            </button>
          </div>
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
        {loading ? (
          <div className="space-y-3 p-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-10 bg-slate-100 rounded animate-pulse" />
            ))}
          </div>
        ) : (
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
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="text-center py-8 text-slate-400 text-xs">
                      {downloads.length === 0
                        ? 'No downloadable resources yet. Upload one to get started.'
                        : 'No resources match your search.'}
                    </td>
                  </tr>
                ) : (
                  filtered.map(dl => (
                    <tr key={dl.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-4 py-3">
                        <a
                          href={dl.file_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-semibold text-slate-800 hover:text-primary hover:underline block"
                        >
                          {dl.title}
                        </a>
                        <span className="text-xs text-slate-400">{dl.original_name}</span>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <Badge label={dl.category} variant={getCategoryBadgeVariant(dl.category)} />
                      </td>
                      <td className="px-4 py-3 text-slate-500 text-xs font-semibold whitespace-nowrap">
                        {dl.created_at?.slice(0, 10)}
                      </td>
                      <td className="px-4 py-3 text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          <a
                            href={dl.file_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1.5 text-slate-500 hover:text-primary hover:bg-slate-100 rounded transition-colors flex items-center justify-center"
                            title="Open Resource"
                          >
                            {dl.attachment_type === 'EXTERNAL_LINK' ? <Link2 size={13} /> : <FileText size={13} />}
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
        )}
      </PortalCard>

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
              onChange={e => setCategory(e.target.value as DocCategory)}
              required
              className="w-full border border-slate-200 rounded px-3 py-2 text-sm bg-white focus:outline-none focus:border-primary"
            >
              {CATEGORY_OPTIONS.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          <AttachmentUpload
            usage="exam"
            label="Document Attachment *"
            required
            onAttached={(record) => {
              setAttachmentRecord(record)
              setFileId(record.id)
            }}
            onClear={() => {
              setAttachmentRecord(null)
              setFileId(null)
            }}
            initialValue={attachmentRecord}
          />

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
              disabled={saving}
              className="flex-1 py-2 bg-primary text-white rounded font-semibold text-sm hover:bg-primary/95 transition-colors disabled:opacity-60"
            >
              {saving ? 'Saving…' : 'Upload Resource'}
            </button>
          </div>
        </form>
      </PortalModal>

      {toast && <Toast message={toast} onClose={() => setToast('')} />}
    </div>
  )
}

export default ExamDownloads
