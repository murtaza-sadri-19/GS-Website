/**
 * MediaUrlInput — Text input with an "Upload" button that opens AttachmentUpload
 * in a modal overlay.
 *
 * Supports both FILE upload and EXTERNAL_LINK modes (via AttachmentUpload).
 * The caller receives the accessible URL via `onChange` and, optionally, the
 * full AttachmentRecord via `onRecord`.
 *
 * Usage:
 *   <MediaUrlInput
 *     value={form.imageUrl}
 *     onChange={url => setForm(f => ({ ...f, imageUrl: url }))}
 *     usage="homepage"
 *     placeholder="https://example.com/banner.jpg"
 *   />
 */

import React, { useState } from 'react'
import { Upload, X } from 'lucide-react'
import AttachmentUpload from './AttachmentUpload'
import type { AttachmentRecord } from '../../api/index'

export interface MediaUrlInputProps {
  value: string
  onChange: (url: string) => void
  /** Called with the full AttachmentRecord when a file or link is attached */
  onRecord?: (record: AttachmentRecord) => void
  usage?: string
  placeholder?: string
  className?: string
  /** Label shown above the input (optional) */
  label?: string
}

const MediaUrlInput: React.FC<MediaUrlInputProps> = ({
  value,
  onChange,
  onRecord,
  usage = 'cms',
  placeholder = 'https://...',
  className = '',
  label,
}) => {
  const [showModal, setShowModal] = useState(false)

  const currentRecord: AttachmentRecord | null = value
    ? {
        id: 0,
        attachment_type: 'EXTERNAL_LINK',
        original_name: 'Current Attachment',
        stored_name: null,
        file_url: value,
        external_url: value,
        thumbnail_url: null,
        alt_text: null,
        meta_title: null,
        meta_description: null,
        file_type: null,
        file_size: null,
        storage_type: 'EXTERNAL',
        uploaded_by: 0,
        uploader_name: '',
        created_at: '',
      }
    : null

  return (
    <div className={`w-full ${className}`}>
      {label && (
        <label className="text-xs font-bold text-slate-500 uppercase block mb-1">
          {label}
        </label>
      )}

      <div className="flex items-center gap-2 w-full">
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="flex-1 border border-slate-200 rounded px-3 py-2 text-xs focus:outline-none focus:border-primary/50 font-mono bg-white"
        />
        <button
          type="button"
          onClick={() => setShowModal(true)}
          className="px-3 py-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded text-slate-600 hover:text-primary transition-all flex items-center gap-1 shrink-0 active:scale-95 text-xs font-bold"
          title="Upload file or attach link"
        >
          <Upload size={12} className="text-accent" />
          <span>Upload</span>
        </button>
      </div>

      {/* Upload / Link modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 z-[9999] flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 relative border border-slate-100">
            <button
              type="button"
              onClick={() => setShowModal(false)}
              className="absolute right-4 top-4 p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors"
            >
              <X size={15} />
            </button>
            <h3 className="font-bold text-slate-800 text-sm mb-1 uppercase tracking-wider">
              Attach Media
            </h3>
            <p className="text-xs text-slate-400 mb-4">
              Upload a file from your device, or register an external URL.
            </p>

            <AttachmentUpload
              usage={usage}
              onAttached={(record) => {
                onChange(record.file_url)
                onRecord?.(record)
                setShowModal(false)
              }}
              onClear={() => {
                onChange('')
                onRecord?.(null as unknown as AttachmentRecord)
              }}
              initialValue={currentRecord}
            />
          </div>
        </div>
      )}
    </div>
  )
}

export default MediaUrlInput
