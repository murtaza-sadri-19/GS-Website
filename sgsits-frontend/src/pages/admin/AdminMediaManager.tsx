import React, { useState, useEffect, useCallback } from 'react'
import { Image, FileText, Link2, Search, Trash2, RefreshCw, Filter, ExternalLink, Copy, Check } from 'lucide-react'
import { apiClient } from '../../api/client'

interface MediaFile {
  id: number
  attachment_type: 'FILE' | 'EXTERNAL_LINK'
  usage: string | null
  original_name: string
  stored_name: string | null
  file_url: string
  external_url: string | null
  thumbnail_url: string | null
  alt_text: string | null
  file_type: string | null
  file_size: number | null
  storage_type: string
  uploaded_by: number
  uploader_name: string
  created_at: string
}

interface Pagination {
  total: number
  page: number
  pageSize: number
  totalPages: number
}

const USAGE_OPTIONS = [
  'all', 'gallery', 'faculty', 'events', 'departments', 'notices',
  'downloads', 'exam', 'placement', 'admissions', 'labs', 'achievements',
  'research', 'cms', 'chatbot', 'pages', 'settings', 'users', 'homepage',
  'uncategorized',
]

const TYPE_ICONS: Record<string, React.ElementType> = {
  'image/jpeg': Image, 'image/jpg': Image, 'image/png': Image, 'image/webp': Image,
}

function formatBytes(bytes: number | null) {
  if (!bytes) return '—'
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`
}

const AdminMediaManager: React.FC = () => {
  const [files, setFiles]         = useState<MediaFile[]>([])
  const [pagination, setPagination] = useState<Pagination | null>(null)
  const [loading, setLoading]     = useState(true)
  const [page, setPage]           = useState(1)
  const [usage, setUsage]         = useState('all')
  const [typeFilter, setTypeFilter] = useState('all')
  const [q, setQ]                 = useState('')
  const [copied, setCopied]       = useState<number | null>(null)
  const [deleting, setDeleting]   = useState<number | null>(null)
  const [deleteError, setDeleteError] = useState('')

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const params: Record<string, string | number> = { page, pageSize: 20 }
      if (usage !== 'all') params.usage = usage
      if (typeFilter !== 'all') params.attachment_type = typeFilter
      if (q.trim()) params.q = q.trim()
      const res = await apiClient.get('/v1/files', { params })
      setFiles(res.data?.data?.files ?? [])
      setPagination(res.data?.data?.pagination ?? null)
    } catch {
      // silent — list stays empty
    } finally {
      setLoading(false)
    }
  }, [page, usage, typeFilter, q])

  useEffect(() => { load() }, [load])

  useEffect(() => { setPage(1) }, [usage, typeFilter, q])

  const handleCopy = (id: number, url: string) => {
    navigator.clipboard.writeText(url).then(() => {
      setCopied(id)
      setTimeout(() => setCopied(null), 2000)
    })
  }

  const handleDelete = async (id: number) => {
    setDeleting(id)
    try {
      await apiClient.delete(`/v1/files/${id}`)
      setFiles(prev => prev.filter(f => f.id !== id))
    } catch (e: any) {
      const msg = e?.response?.data?.message || 'Delete failed — file may still be in use.'
      setDeleteError(msg)
      setTimeout(() => setDeleteError(''), 3000)
    } finally {
      setDeleting(null)
    }
  }

  const isImage = (f: MediaFile) =>
    f.file_type?.startsWith('image/') || f.attachment_type === 'EXTERNAL_LINK' && /\.(jpg|jpeg|png|webp|gif)$/i.test(f.file_url)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 font-display">Media Manager</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Browse, search, and manage all uploaded files and external links
            {pagination && ` — ${pagination.total} total`}
          </p>
        </div>
        <button
          onClick={load}
          className="flex items-center gap-2 px-3 py-2 border border-slate-200 rounded-lg text-sm text-slate-600 hover:bg-slate-50 transition-colors self-start"
        >
          <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
          Refresh
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 flex flex-wrap gap-3 items-center">
        <div className="flex items-center gap-2 flex-1 min-w-48">
          <Search size={16} className="text-slate-400 shrink-0" />
          <input
            type="text"
            placeholder="Search by filename or description…"
            value={q}
            onChange={e => setQ(e.target.value)}
            className="w-full text-sm text-slate-700 bg-transparent focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-2">
          <Filter size={14} className="text-slate-400" />
          <select
            value={usage}
            onChange={e => setUsage(e.target.value)}
            className="text-sm border border-slate-200 rounded px-2 py-1.5 bg-white focus:outline-none focus:border-primary"
          >
            {USAGE_OPTIONS.map(u => (
              <option key={u} value={u}>
                {u === 'all' ? 'All modules' : u.charAt(0).toUpperCase() + u.slice(1)}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-2">
          <select
            value={typeFilter}
            onChange={e => setTypeFilter(e.target.value)}
            className="text-sm border border-slate-200 rounded px-2 py-1.5 bg-white focus:outline-none focus:border-primary"
          >
            <option value="all">All types</option>
            <option value="FILE">Uploads only</option>
            <option value="EXTERNAL_LINK">External links only</option>
          </select>
        </div>
      </div>

      {/* File Grid */}
      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {Array.from({ length: 15 }).map((_, i) => (
            <div key={i} className="aspect-square bg-slate-100 rounded-xl animate-pulse" />
          ))}
        </div>
      ) : files.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-xl p-12 text-center">
          <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-3">
            <Image size={20} className="text-slate-400" />
          </div>
          <p className="text-sm font-semibold text-slate-600">No files found</p>
          <p className="text-xs text-slate-400 mt-1">Try adjusting your filters or search query.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {files.map(file => {
            const FileIcon = file.attachment_type === 'EXTERNAL_LINK' ? Link2 : FileText
            const url = file.file_url
            return (
              <div
                key={file.id}
                className="bg-white border border-slate-200 rounded-xl overflow-hidden group hover:border-slate-300 hover:shadow-sm transition-all"
              >
                {/* Preview area */}
                <div className="aspect-square bg-slate-50 flex items-center justify-center relative overflow-hidden">
                  {isImage(file) ? (
                    <img
                      src={url}
                      alt={file.alt_text || file.original_name}
                      className="w-full h-full object-cover"
                      onError={e => {
                        e.currentTarget.style.display = 'none'
                        e.currentTarget.nextElementSibling?.removeAttribute('hidden')
                      }}
                    />
                  ) : null}
                  <div hidden={isImage(file)} className="flex flex-col items-center gap-1 p-3">
                    <FileIcon size={28} className="text-slate-300" />
                    <span className="text-xs font-mono text-slate-400 uppercase tracking-wider truncate w-full text-center">
                      {file.file_type?.split('/')[1] ?? file.attachment_type === 'EXTERNAL_LINK' ? 'link' : 'file'}
                    </span>
                  </div>

                  {/* Hover overlay */}
                  <div className="absolute inset-0 bg-slate-900/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    <button
                      onClick={() => handleCopy(file.id, url)}
                      className="p-1.5 bg-white/90 rounded hover:bg-white transition-colors"
                      title="Copy URL"
                    >
                      {copied === file.id ? <Check size={12} className="text-emerald-600" /> : <Copy size={12} className="text-slate-700" />}
                    </button>
                    <a
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-1.5 bg-white/90 rounded hover:bg-white transition-colors"
                      title="Open"
                    >
                      <ExternalLink size={12} className="text-slate-700" />
                    </a>
                    <button
                      onClick={() => handleDelete(file.id)}
                      disabled={deleting === file.id}
                      className="p-1.5 bg-white/90 rounded hover:bg-red-50 transition-colors disabled:opacity-50"
                      title="Delete"
                    >
                      <Trash2 size={12} className="text-red-500" />
                    </button>
                  </div>
                </div>

                {/* Meta */}
                <div className="p-2.5 border-t border-slate-100">
                  <p className="text-xs font-semibold text-slate-800 truncate" title={file.original_name}>
                    {file.original_name}
                  </p>
                  <div className="flex items-center justify-between mt-1">
                    <span className="text-xs text-slate-400 font-mono">{formatBytes(file.file_size)}</span>
                    {file.usage && (
                      <span className="text-xs bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded font-semibold uppercase tracking-wide">
                        {file.usage}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-400 mt-0.5 truncate">{file.uploader_name}</p>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Pagination */}
      {pagination && pagination.totalPages > 1 && (
        <div className="flex items-center justify-between bg-white border border-slate-200 rounded-xl px-4 py-3">
          <span className="text-xs text-slate-500">
            Page {pagination.page} of {pagination.totalPages} ({pagination.total} files)
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-3 py-1.5 border border-slate-200 rounded text-xs font-semibold text-slate-600 disabled:opacity-40 hover:bg-slate-50 transition-colors"
            >
              Previous
            </button>
            <button
              onClick={() => setPage(p => Math.min(pagination.totalPages, p + 1))}
              disabled={page === pagination.totalPages}
              className="px-3 py-1.5 border border-slate-200 rounded text-xs font-semibold text-slate-600 disabled:opacity-40 hover:bg-slate-50 transition-colors"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default AdminMediaManager
