/**
 * AttachmentUpload — Enterprise Dual Upload Component
 *
 * Supports both:
 *   MODE A: Real file upload (drag-drop + file picker, validation, progress bar)
 *   MODE B: External URL attachment (validated URL input with link preview)
 *
 * Usage:
 *   <AttachmentUpload
 *     usage="notices"
 *     onAttached={(record) => setFileId(record.id)}
 *     onClear={() => setFileId(null)}
 *     initialValue={existingAttachment}
 *   />
 *
 * Both modes call the backend, get a file_id, and call onAttached with the
 * full AttachmentRecord. The parent form submits file_id to the resource API.
 */

import React, { useState, useRef, useCallback, useEffect } from 'react'
import {
  Upload, Link2, X, FileText, Image, File, CheckCircle2,
  Loader2, AlertCircle, ExternalLink, Trash2, RefreshCw,
} from 'lucide-react'
import { filesAPI } from '../../api/index'
import type { AttachmentRecord } from '../../api/index'

// ── Types ──────────────────────────────────────────────────────────────────────

type AttachmentMode = 'file' | 'link'

// Config per usage context
interface UsageConfig {
  accept: string           // HTML accept attribute
  maxMB: number
  label: string            // e.g. "PDF or Word document"
  allowedExts: string[]
}

const USAGE_CONFIGS: Record<string, UsageConfig> = {
  notices:     { accept: '.pdf,.doc,.docx,.jpg,.jpeg,.png', maxMB: 10, label: 'PDF, Word, or Image',  allowedExts: ['.pdf','.doc','.docx','.jpg','.jpeg','.png'] },
  downloads:   { accept: '.pdf,.doc,.docx,.zip',            maxMB: 25, label: 'PDF, Word, or ZIP',    allowedExts: ['.pdf','.doc','.docx','.zip'] },
  exam:        { accept: '.pdf',                            maxMB: 10, label: 'PDF document',         allowedExts: ['.pdf'] },
  placement:   { accept: '.pdf,.doc,.docx',                 maxMB: 10, label: 'PDF or Word document', allowedExts: ['.pdf','.doc','.docx'] },
  tenders:     { accept: '.pdf,.doc,.docx',                 maxMB: 10, label: 'PDF or Word document', allowedExts: ['.pdf','.doc','.docx'] },
  events:      { accept: '.jpg,.jpeg,.png,.webp',           maxMB: 2,  label: 'JPEG, PNG, or WebP',   allowedExts: ['.jpg','.jpeg','.png','.webp'] },
  gallery:     { accept: '.jpg,.jpeg,.png,.webp',           maxMB: 2,  label: 'JPEG, PNG, or WebP',   allowedExts: ['.jpg','.jpeg','.png','.webp'] },
  faculty:     { accept: '.jpg,.jpeg,.png,.webp',           maxMB: 2,  label: 'JPEG or PNG photo',    allowedExts: ['.jpg','.jpeg','.png','.webp'] },
  departments: { accept: '.jpg,.jpeg,.png,.webp',           maxMB: 2,  label: 'JPEG or PNG',          allowedExts: ['.jpg','.jpeg','.png','.webp'] },
  research:    { accept: '.pdf,.doc,.docx',                 maxMB: 25, label: 'PDF or Word document', allowedExts: ['.pdf','.doc','.docx'] },
  chatbot:     { accept: '.pdf,.doc,.docx',                 maxMB: 25, label: 'PDF or Word document', allowedExts: ['.pdf','.doc','.docx'] },
  labs:        { accept: '.jpg,.jpeg,.png,.pdf',            maxMB: 10, label: 'Image or PDF',         allowedExts: ['.jpg','.jpeg','.png','.pdf'] },
  cms:         { accept: '.jpg,.jpeg,.png,.pdf,.doc,.docx', maxMB: 10, label: 'Image or Document',    allowedExts: ['.jpg','.jpeg','.png','.pdf','.doc','.docx'] },
}

const DEFAULT_USAGE_CONFIG: UsageConfig = USAGE_CONFIGS.notices

// ── Helpers ────────────────────────────────────────────────────────────────────

function formatBytes(bytes: number): string {
  if (bytes < 1024)        return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / 1024 / 1024).toFixed(2)} MB`
}

function getFileIcon(mimeOrName: string) {
  const s = mimeOrName.toLowerCase()
  if (s.includes('image'))                           return <Image   size={18} className="text-[#0b2545]" />
  if (s.includes('pdf'))                             return <FileText size={18} className="text-[#bfa15f]" />
  if (s.includes('word') || s.includes('.doc'))      return <FileText size={18} className="text-[#0b2545]" />
  return <File size={18} className="text-slate-500" />
}

function isValidUrl(url: string): boolean {
  try {
    const u = new URL(url)
    if (u.protocol !== 'http:' && u.protocol !== 'https:') return false
    // Disallow private/loopback
    const h = u.hostname
    if (/^(localhost|127\.|0\.0\.0\.0|192\.168\.|10\.|169\.254\.)/.test(h)) return false
    return true
  } catch {
    return false
  }
}

// ── Props ──────────────────────────────────────────────────────────────────────

export interface AttachmentUploadProps {
  /** Usage context determines allowed MIME types and size limits */
  usage?: string
  /** Called when an attachment is successfully registered (file uploaded or link saved) */
  onAttached: (record: AttachmentRecord) => void
  /** Called when the current attachment is cleared */
  onClear: () => void
  /** Pre-existing attachment record (for edit mode) */
  initialValue?: AttachmentRecord | null
  /** Additional CSS class for the outer wrapper */
  className?: string
  /** Show the component in compact (single-line) mode */
  compact?: boolean
  /** Disable all interaction */
  disabled?: boolean
  /** Label shown above the component */
  label?: string
  /** Whether an attachment is required */
  required?: boolean
}

// ── Component ──────────────────────────────────────────────────────────────────

const AttachmentUpload: React.FC<AttachmentUploadProps> = ({
  usage = 'notices',
  onAttached,
  onClear,
  initialValue = null,
  className = '',
  compact = false,
  disabled = false,
  label,
  required = false,
}) => {
  const config = USAGE_CONFIGS[usage] || DEFAULT_USAGE_CONFIG

  const [mode, setMode]               = useState<AttachmentMode>('file')
  const [attached, setAttached]       = useState<AttachmentRecord | null>(initialValue)
  const [dragging, setDragging]       = useState(false)
  const [uploading, setUploading]     = useState(false)
  const [uploadPct, setUploadPct]     = useState(0)
  const [error, setError]             = useState<string | null>(null)

  // Link mode state
  const [linkUrl, setLinkUrl]         = useState('')
  const [linkName, setLinkName]       = useState('')
  const [linkValid, setLinkValid]     = useState<boolean | null>(null)
  const [savingLink, setSavingLink]   = useState(false)

  const fileInputRef = useRef<HTMLInputElement>(null)

  // Sync initialValue changes (e.g., when parent opens edit modal)
  useEffect(() => {
    setAttached(initialValue ?? null)
    setError(null)
    if (initialValue?.attachment_type === 'EXTERNAL_LINK') {
      setMode('link')
      setLinkUrl(initialValue.external_url || initialValue.file_url || '')
      setLinkName(initialValue.original_name || '')
    } else {
      setMode('file')
      setLinkUrl('')
      setLinkName('')
    }
  }, [initialValue])

  // ── File upload handler ────────────────────────────────────────────────────

  const validateFile = (file: File): string | null => {
    const ext = '.' + file.name.split('.').pop()?.toLowerCase()
    if (!config.allowedExts.includes(ext)) {
      return `File type not allowed. Accepted: ${config.allowedExts.join(', ')}`
    }
    if (file.size > config.maxMB * 1024 * 1024) {
      return `File too large — maximum size is ${config.maxMB} MB`
    }
    return null
  }

  const processFile = useCallback(async (file: File) => {
    const validationError = validateFile(file)
    if (validationError) {
      setError(validationError)
      return
    }

    setError(null)
    setUploading(true)
    setUploadPct(0)

    try {
      const record = await filesAPI.upload(file, usage, (pct) => setUploadPct(pct))
      setAttached(record)
      onAttached(record)
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } }; message?: string })
        ?.response?.data?.message || (err as { message?: string })?.message || 'Upload failed'
      setError(msg)
    } finally {
      setUploading(false)
      setUploadPct(0)
    }
  }, [usage, onAttached]) // eslint-disable-line react-hooks/exhaustive-deps

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) processFile(file)
    e.target.value = ''
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setDragging(false)
    if (disabled || uploading) return
    const file = e.dataTransfer.files?.[0]
    if (file) processFile(file)
  }

  // ── Link mode handler ──────────────────────────────────────────────────────

  const handleLinkUrlChange = (val: string) => {
    setLinkUrl(val)
    setLinkValid(val.trim().length > 0 ? isValidUrl(val.trim()) : null)
    setError(null)
  }

  const handleSaveLink = async () => {
    if (!linkUrl.trim()) { setError('URL is required'); return }
    if (!isValidUrl(linkUrl.trim())) { setError('Please enter a valid https:// URL'); return }

    setSavingLink(true)
    setError(null)

    try {
      const record = await filesAPI.registerLink({
        external_url:  linkUrl.trim(),
        original_name: linkName.trim() || undefined,
        usage,
      })
      setAttached(record)
      onAttached(record)
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } }; message?: string })
        ?.response?.data?.message || (err as { message?: string })?.message || 'Failed to save link'
      setError(msg)
    } finally {
      setSavingLink(false)
    }
  }

  // ── Clear handler ──────────────────────────────────────────────────────────

  const handleClear = () => {
    setAttached(null)
    setError(null)
    setLinkUrl('')
    setLinkName('')
    setLinkValid(null)
    if (fileInputRef.current) fileInputRef.current.value = ''
    onClear()
  }

  // ── Render: Attached state ─────────────────────────────────────────────────

  if (attached) {
    const isLink = attached.attachment_type === 'EXTERNAL_LINK'
    return (
      <div className={`rounded-lg border border-[#0b2545]/20 bg-[#0b2545]/3 p-3 ${className}`}>
        {label && (
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">
            {label}{required && <span className="text-red-500 ml-1">*</span>}
          </p>
        )}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded flex items-center justify-center bg-white border border-slate-200 flex-shrink-0">
            {isLink
              ? <Link2 size={16} className="text-[#0b2545]" />
              : getFileIcon(attached.file_type || attached.original_name)
            }
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-slate-800 truncate">{attached.original_name}</p>
            <div className="flex items-center gap-2 flex-wrap">
              {isLink
                ? <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wide bg-[#0b2545]/8 px-1.5 py-0.5 rounded">External Link</span>
                : <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wide bg-[#bfa15f]/15 px-1.5 py-0.5 rounded">
                    {attached.file_type?.split('/')[1]?.toUpperCase() || 'FILE'}
                  </span>
              }
              {attached.file_size && (
                <span className="text-[10px] text-slate-400">{formatBytes(attached.file_size)}</span>
              )}
              <span className="text-[10px] text-[#bfa15f] flex items-center gap-0.5">
                <CheckCircle2 size={10} /> Saved
              </span>
            </div>
          </div>
          <div className="flex items-center gap-1 flex-shrink-0">
            {isLink && attached.file_url && (
              <a
                href={attached.file_url}
                target="_blank"
                rel="noopener noreferrer"
                className="p-1.5 text-slate-400 hover:text-[#0b2545] transition-colors"
                title="Open link"
              >
                <ExternalLink size={14} />
              </a>
            )}
            {!disabled && (
              <button
                type="button"
                onClick={handleClear}
                className="p-1.5 text-slate-400 hover:text-red-500 transition-colors"
                title="Remove attachment"
              >
                <Trash2 size={14} />
              </button>
            )}
          </div>
        </div>
      </div>
    )
  }

  // ── Render: Upload/Link form ───────────────────────────────────────────────

  return (
    <div className={`space-y-3 ${className}`}>
      {/* Label */}
      {label && (
        <p className="text-xs font-semibold text-slate-700 uppercase tracking-wide">
          {label}{required && <span className="text-red-500 ml-1">*</span>}
        </p>
      )}

      {/* Mode toggle */}
      <div className="flex rounded-lg border border-slate-200 overflow-hidden text-xs font-semibold">
        <button
          type="button"
          disabled={disabled || uploading || savingLink}
          onClick={() => { setMode('file'); setError(null) }}
          className={`flex-1 flex items-center justify-center gap-1.5 py-2 transition-colors ${
            mode === 'file'
              ? 'bg-[#0b2545] text-white'
              : 'bg-white text-slate-600 hover:bg-slate-50'
          } disabled:opacity-50`}
        >
          <Upload size={13} /> Upload File
        </button>
        <button
          type="button"
          disabled={disabled || uploading || savingLink}
          onClick={() => { setMode('link'); setError(null) }}
          className={`flex-1 flex items-center justify-center gap-1.5 py-2 transition-colors border-l border-slate-200 ${
            mode === 'link'
              ? 'bg-[#0b2545] text-white'
              : 'bg-white text-slate-600 hover:bg-slate-50'
          } disabled:opacity-50`}
        >
          <Link2 size={13} /> External Link
        </button>
      </div>

      {/* FILE MODE */}
      {mode === 'file' && (
        <div>
          {uploading ? (
            /* Upload progress */
            <div className="border border-dashed border-[#0b2545]/30 rounded-lg p-5 text-center space-y-2">
              <Loader2 size={22} className="animate-spin text-[#0b2545] mx-auto" />
              <p className="text-sm font-semibold text-[#0b2545]">Uploading…</p>
              <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                <div
                  className="h-full bg-[#bfa15f] rounded-full transition-all duration-300"
                  style={{ width: `${uploadPct}%` }}
                />
              </div>
              <p className="text-xs text-slate-500">{uploadPct}%</p>
            </div>
          ) : (
            /* Drag-drop zone */
            <div
              onDragOver={(e) => { e.preventDefault(); if (!disabled) setDragging(true) }}
              onDragLeave={() => setDragging(false)}
              onDrop={handleDrop}
              onClick={() => !disabled && fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-lg p-5 text-center cursor-pointer transition-colors ${
                dragging
                  ? 'border-[#0b2545] bg-[#0b2545]/5'
                  : 'border-slate-200 hover:border-[#0b2545]/40 hover:bg-slate-50'
              } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <Upload size={22} className="mx-auto text-slate-400 mb-2" />
              <p className="text-sm font-semibold text-slate-700">
                {dragging ? 'Drop file here' : 'Drag & drop or click to browse'}
              </p>
              <p className="text-xs text-slate-400 mt-0.5">
                {config.label} — max {config.maxMB} MB
              </p>
              <input
                ref={fileInputRef}
                type="file"
                accept={config.accept}
                onChange={handleFileChange}
                disabled={disabled}
                className="hidden"
              />
            </div>
          )}
        </div>
      )}

      {/* LINK MODE */}
      {mode === 'link' && (
        <div className="space-y-2">
          <div className="relative">
            <Link2
              size={14}
              className={`absolute left-3 top-1/2 -translate-y-1/2 ${
                linkValid === true  ? 'text-green-500' :
                linkValid === false ? 'text-red-400'   :
                'text-slate-400'
              }`}
            />
            <input
              type="url"
              value={linkUrl}
              onChange={(e) => handleLinkUrlChange(e.target.value)}
              disabled={disabled || savingLink}
              placeholder="https://example.com/document.pdf"
              className={`w-full pl-9 pr-9 py-2 text-sm border rounded-lg outline-none transition-colors ${
                linkValid === true  ? 'border-green-400 bg-green-50/30'  :
                linkValid === false ? 'border-red-400 bg-red-50/30'      :
                'border-slate-200 focus:border-[#0b2545]/50'
              } disabled:opacity-50`}
            />
            {linkUrl && (
              <button
                type="button"
                onClick={() => { setLinkUrl(''); setLinkValid(null) }}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X size={12} />
              </button>
            )}
          </div>

          {/* Optional display name */}
          <input
            type="text"
            value={linkName}
            onChange={(e) => setLinkName(e.target.value)}
            disabled={disabled || savingLink}
            placeholder="Display name (optional)"
            className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg outline-none focus:border-[#0b2545]/50 disabled:opacity-50"
          />

          {/* Link preview */}
          {linkValid === true && linkUrl && (
            <div className="flex items-center gap-2 text-xs text-slate-500 bg-slate-50 px-3 py-2 rounded-lg">
              <ExternalLink size={11} />
              <span className="truncate">{linkUrl}</span>
              <a
                href={linkUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="ml-auto text-[#0b2545] font-semibold hover:underline flex-shrink-0"
              >
                Preview
              </a>
            </div>
          )}

          <button
            type="button"
            onClick={handleSaveLink}
            disabled={disabled || savingLink || linkValid !== true}
            className="w-full py-2 bg-[#0b2545] text-white text-sm font-semibold rounded-lg hover:bg-[#0b2545]/90 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {savingLink
              ? <><Loader2 size={14} className="animate-spin" /> Saving…</>
              : <><Link2 size={14} /> Attach Link</>
            }
          </button>
        </div>
      )}

      {/* Error message */}
      {error && (
        <div className="flex items-start gap-2 text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2 text-xs">
          <AlertCircle size={13} className="flex-shrink-0 mt-0.5" />
          <span>{error}</span>
          <button
            type="button"
            onClick={() => setError(null)}
            className="ml-auto text-red-400 hover:text-red-600 flex-shrink-0"
          >
            <X size={11} />
          </button>
        </div>
      )}

      {/* Retry hint */}
      {error && (
        <button
          type="button"
          onClick={() => setError(null)}
          className="text-xs text-slate-500 hover:text-[#0b2545] flex items-center gap-1"
        >
          <RefreshCw size={11} /> Try again
        </button>
      )}
    </div>
  )
}

export default AttachmentUpload
