/**
 * Reusable CRUD admin page scaffold.
 * Provides: header, search bar, "Add New" button, table with actions, pagination shell.
 * Each admin page wraps this with its specific columns and modal forms.
 */
import React, { useState } from 'react'
import { Plus, Search, Pencil, Trash2, Loader2, ChevronDown } from 'lucide-react'

// ── Generic column definition ──────────────────────────────────────────────
export interface Column<T> {
  header: string
  key: keyof T | string
  render?: (row: T) => React.ReactNode
  className?: string
}

// ── Status badge helper ────────────────────────────────────────────────────
export const StatusBadge: React.FC<{ label: string; color?: 'green' | 'red' | 'orange' | 'blue' | 'gray' }> = ({ label, color = 'gray' }) => {
  const map = {
    green: 'bg-[#bfa15f]/10 text-[#bfa15f] border-[#bfa15f]/30',
    red: 'bg-[#0b2545]/5 text-[#0b2545] border-[#0b2545]/20',
    orange: 'bg-[#bfa15f]/15 text-[#bfa15f] border-[#bfa15f]/40',
    blue: 'bg-[#0b2545]/10 text-[#0b2545] border-[#0b2545]/25',
    gray: 'bg-slate-50 text-slate-600 border-slate-200',
  }
  return (
    <span className={`text-[10px] font-bold px-2 py-0.5 rounded border uppercase tracking-wide ${map[color]}`}>
      {label}
    </span>
  )
}

// ── Confirm Delete Dialog ──────────────────────────────────────────────────
interface DeleteDialogProps {
  isOpen: boolean
  itemName: string
  onConfirm: () => void
  onCancel: () => void
  isDeleting: boolean
}

export const DeleteDialog: React.FC<DeleteDialogProps> = ({ isOpen, itemName, onConfirm, onCancel, isDeleting }) => {
  if (!isOpen) return null
  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg border border-slate-200 shadow-xl p-6 max-w-sm w-full">
        <div className="w-12 h-12 bg-[#0b2545]/5 rounded-full flex items-center justify-center mx-auto mb-4">
          <Trash2 size={22} className="text-[#0b2545]" />
        </div>
        <h3 className="font-display font-bold text-lg text-slate-800 text-center">Confirm Delete</h3>
        <p className="text-sm text-slate-600 text-center mt-2">
          Are you sure you want to delete <strong className="text-slate-800">"{itemName}"</strong>?
          This action cannot be undone.
        </p>
        <div className="flex gap-3 mt-6">
          <button
            onClick={onCancel}
            disabled={isDeleting}
            className="flex-1 py-2 border border-slate-200 text-slate-700 rounded font-semibold text-sm hover:bg-slate-50 transition-colors disabled:opacity-60"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={isDeleting}
            className="flex-1 py-2 bg-[#0b2545] text-white rounded font-semibold text-sm hover:bg-[#0b2545]/90 transition-colors flex items-center justify-center gap-2 disabled:opacity-60"
          >
            {isDeleting ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} />}
            Delete
          </button>
        </div>
      </div>
    </div>
  )
}

// ── Modal wrapper ──────────────────────────────────────────────────────────
interface ModalProps {
  isOpen: boolean
  title: string
  onClose: () => void
  children: React.ReactNode
  width?: string
}

export const Modal: React.FC<ModalProps> = ({ isOpen, title, onClose, children, width = 'max-w-2xl' }) => {
  if (!isOpen) return null
  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-start justify-center p-4 overflow-y-auto">
      <div className={`bg-white rounded-lg border border-slate-200 shadow-xl w-full ${width} my-8`}>
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
          <h3 className="font-display font-bold text-base text-slate-800">{title}</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors p-1">
            ✕
          </button>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>
  )
}

// ── Form field helpers ─────────────────────────────────────────────────────
export const FormField: React.FC<{ label: string; required?: boolean; children: React.ReactNode; hint?: string }> = ({ label, required, children, hint }) => (
  <div className="space-y-1.5">
    <label className="text-xs font-bold text-slate-600 uppercase tracking-wide">
      {label} {required && <span className="text-[#bfa15f]">*</span>}
    </label>
    {children}
    {hint && <p className="text-[11px] text-slate-400">{hint}</p>}
  </div>
)

export const Input: React.FC<React.InputHTMLAttributes<HTMLInputElement>> = (props) => (
  <input
    {...props}
    className={`w-full border border-slate-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary placeholder-slate-400 transition-all bg-white ${props.className ?? ''}`}
  />
)

export const Textarea: React.FC<React.TextareaHTMLAttributes<HTMLTextAreaElement>> = (props) => (
  <textarea
    {...props}
    className={`w-full border border-slate-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary placeholder-slate-400 transition-all bg-white resize-none ${props.className ?? ''}`}
  />
)

export const Select: React.FC<React.SelectHTMLAttributes<HTMLSelectElement>> = ({ children, ...props }) => (
  <div className="relative">
    <select
      {...props}
      className={`w-full border border-slate-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all bg-white appearance-none pr-8 ${props.className ?? ''}`}
    >
      {children}
    </select>
    <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
  </div>
)

// ── Main CrudPage Component ────────────────────────────────────────────────
interface CrudPageProps<T extends { id: string }> {
  title: string
  subtitle?: string
  addLabel?: string
  data: T[]
  columns: Column<T>[]
  loading?: boolean
  searchKeys?: (keyof T)[]
  onAdd?: () => void
  onEdit?: (row: T) => void
  onDelete?: (row: T) => void
  renderBadge?: (row: T) => React.ReactNode
  emptyMessage?: string
}

function CrudPage<T extends { id: string }>({
  title, subtitle, addLabel = 'Add New', data, columns, loading = false,
  searchKeys = [], onAdd, onEdit, onDelete, emptyMessage = 'No records found.'
}: CrudPageProps<T>) {
  const [search, setSearch] = useState('')

  const filtered = data.filter((row) => {
    if (!search.trim()) return true
    return searchKeys.some((key) => {
      const val = row[key]
      return typeof val === 'string' && val.toLowerCase().includes(search.toLowerCase())
    })
  })

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h2 className="font-display text-2xl font-bold text-slate-800">{title}</h2>
          {subtitle && <p className="text-xs text-slate-500 mt-0.5">{subtitle}</p>}
        </div>
        {onAdd && (
          <button
            onClick={onAdd}
            className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-white font-semibold text-sm rounded shadow-sm hover:bg-primary/90 transition-colors"
          >
            <Plus size={16} />
            {addLabel}
          </button>
        )}
      </div>

      {/* Search & Filter Bar */}
      {searchKeys.length > 0 && (
        <div className="flex items-center gap-3">
          <div className="relative flex-grow max-w-sm">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded text-sm focus:outline-none focus:border-primary transition-all bg-white"
            />
          </div>
          <span className="text-xs text-slate-500 font-medium">{filtered.length} record{filtered.length !== 1 ? 's' : ''}</span>
        </div>
      )}

      {/* Table */}
      <div className="bg-white border border-slate-200 rounded-lg shadow-sm overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-16 text-slate-400">
            <Loader2 size={24} className="animate-spin mr-3" />
            <span className="text-sm">Loading...</span>
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16 text-slate-400">
            <p className="text-sm">{emptyMessage}</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200">
                  {columns.map((col) => (
                    <th key={col.header} className={`text-left px-4 py-3 text-[11px] font-bold text-slate-500 uppercase tracking-wider ${col.className ?? ''}`}>
                      {col.header}
                    </th>
                  ))}
                  {(onEdit || onDelete) && (
                    <th className="text-right px-4 py-3 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                      Actions
                    </th>
                  )}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map((row) => (
                  <tr key={row.id} className="hover:bg-slate-50/60 transition-colors">
                    {columns.map((col) => (
                      <td key={col.header} className={`px-4 py-3 ${col.className ?? ''}`}>
                        {col.render
                          ? col.render(row)
                          : <span className="text-slate-700 font-medium">{String(row[col.key as keyof T] ?? '')}</span>
                        }
                      </td>
                    ))}
                    {(onEdit || onDelete) && (
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-2">
                          {onEdit && (
                            <button
                              onClick={() => onEdit(row)}
                              className="p-1.5 text-slate-500 hover:text-primary hover:bg-primary/5 rounded transition-colors"
                              title="Edit"
                            >
                              <Pencil size={14} />
                            </button>
                          )}
                          {onDelete && (
                            <button
                              onClick={() => onDelete(row)}
                              className="p-1.5 text-slate-500 hover:text-[#0b2545] hover:bg-slate-100 rounded transition-colors"
                              title="Delete"
                            >
                              <Trash2 size={14} />
                            </button>
                          )}
                        </div>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}

export default CrudPage
