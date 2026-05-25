/**
 * Shared UI primitives for Footer CMS section editors.
 * Keeps each section component lean — import from here.
 */
import React, { useState, useEffect, useCallback } from 'react'
import { Save, Loader2, CheckCircle2, ChevronUp, ChevronDown, Eye, EyeOff, Trash2, Plus, Pencil, X } from 'lucide-react'
import type { FooterLink, FooterSection, FooterPolicyLink } from '../../../services/footerService'

// ─── Unique ID generator ──────────────────────────────────────────────────────
export function uid(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 6)
}

// ─── Save status hook ─────────────────────────────────────────────────────────
export function useSectionSave<T>(
  getter: () => Promise<T>,
  saver: (data: T) => Promise<void>
) {
  const [data, setData] = useState<T | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    getter().then(d => {
      setData(d)
      setLoading(false)
    })
  }, [])

  const handleSave = useCallback(async (updated: T) => {
    setSaving(true)
    try {
      await saver(updated)
      setData(updated)
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    } finally {
      setSaving(false)
    }
  }, [saver])

  return { data, setData, loading, saving, saved, handleSave }
}

// ─── Section wrapper card ─────────────────────────────────────────────────────
export const SectionCard: React.FC<{
  title: string
  subtitle?: string
  saving?: boolean
  saved?: boolean
  onSave?: () => void
  children: React.ReactNode
}> = ({ title, subtitle, saving, saved, onSave, children }) => (
  <div className="space-y-5">
    <div className="flex items-start justify-between">
      <div>
        <h3 className="font-display font-bold text-lg text-slate-800">{title}</h3>
        {subtitle && <p className="text-xs text-slate-500 mt-0.5">{subtitle}</p>}
      </div>
      {onSave && (
        <div className="flex items-center gap-3 shrink-0">
          {saved && (
            <span className="text-sm text-[#bfa15f] font-semibold flex items-center gap-1">
              <CheckCircle2 size={15} /> Saved!
            </span>
          )}
          <button
            type="button"
            onClick={onSave}
            disabled={saving}
            className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-white font-semibold text-xs rounded shadow-sm hover:bg-primary/90 transition-colors disabled:opacity-60"
          >
            {saving ? <><Loader2 size={13} className="animate-spin" />Saving…</> : <><Save size={13} />Save</>}
          </button>
        </div>
      )}
    </div>
    <div className="space-y-4">{children}</div>
  </div>
)

// ─── Field + label wrapper ────────────────────────────────────────────────────
export const Field: React.FC<{
  label: string
  hint?: string
  required?: boolean
  children: React.ReactNode
  className?: string
}> = ({ label, hint, required, children, className }) => (
  <div className={className}>
    <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    {children}
    {hint && <p className="text-[10px] text-slate-400 mt-1">{hint}</p>}
  </div>
)

// ─── Text input ──────────────────────────────────────────────────────────────
export const Inp: React.FC<React.InputHTMLAttributes<HTMLInputElement>> = (props) => (
  <input
    {...props}
    className={`w-full px-3 py-2 text-sm border border-slate-200 rounded focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 bg-white ${props.className ?? ''}`}
  />
)

// ─── Textarea ────────────────────────────────────────────────────────────────
export const Txta: React.FC<React.TextareaHTMLAttributes<HTMLTextAreaElement>> = (props) => (
  <textarea
    {...props}
    className={`w-full px-3 py-2 text-sm border border-slate-200 rounded focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 bg-white resize-none ${props.className ?? ''}`}
  />
)

// ─── Toggle switch ────────────────────────────────────────────────────────────
export const Toggle: React.FC<{
  checked: boolean
  onChange: (v: boolean) => void
  label: string
  desc?: string
}> = ({ checked, onChange, label, desc }) => (
  <label className="flex items-start gap-3 cursor-pointer p-3 border border-slate-100 rounded hover:bg-slate-50 transition-colors">
    <div
      onClick={() => onChange(!checked)}
      className={`relative w-10 h-5 rounded-full transition-colors flex-shrink-0 mt-0.5 cursor-pointer ${checked ? 'bg-primary' : 'bg-slate-300'}`}
    >
      <span className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${checked ? 'translate-x-5' : ''}`} />
    </div>
    <div>
      <p className="text-sm font-semibold text-slate-800">{label}</p>
      {desc && <p className="text-xs text-slate-500 mt-0.5">{desc}</p>}
    </div>
  </label>
)

// ─── Section card shell ───────────────────────────────────────────────────────
export const Card: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className }) => (
  <div className={`bg-white border border-slate-200 rounded-lg p-5 shadow-sm ${className ?? ''}`}>
    {children}
  </div>
)

// ─── CardHeading ─────────────────────────────────────────────────────────────
export const CardHeading: React.FC<{ icon?: React.ReactNode; children: React.ReactNode }> = ({ icon, children }) => (
  <div className="flex items-center gap-2 border-b border-slate-100 pb-3 mb-4">
    {icon && <span className="text-accent">{icon}</span>}
    <h4 className="font-bold text-sm text-primary uppercase tracking-wider">{children}</h4>
  </div>
)

// ─── Loading skeleton ─────────────────────────────────────────────────────────
export const LoadingSkeleton: React.FC = () => (
  <div className="space-y-4 animate-pulse">
    {[1, 2, 3].map(i => (
      <div key={i} className="h-10 bg-slate-100 rounded" />
    ))}
  </div>
)

// ─── Backend note banner ──────────────────────────────────────────────────────
export const BackendNote: React.FC<{ endpoint: string }> = ({ endpoint }) => (
  <div className="bg-[#bfa15f]/10 border border-[#bfa15f]/30 rounded-lg p-3 text-xs text-[#0b2545]">
    <span className="font-bold">Backend ready: </span>
    Changes persist to localStorage now. Wire to{' '}
    <code className="font-mono bg-[#bfa15f]/20 px-1 rounded">{endpoint}</code>{' '}
    when API is available.
  </div>
)

// ─── Generic link list editor (reused for 4 sections) ────────────────────────

interface LinkListEditorProps {
  section: FooterSection
  onChange: (s: FooterSection) => void
  linkType?: 'internal' | 'external' | 'both'
  placeholder?: { label: string; route?: string; url?: string }
}

interface EditState {
  id: string
  label: string
  to: string
  href: string
  visible: boolean
}

const emptyEdit = (): EditState => ({ id: '', label: '', to: '', href: '', visible: true })

export const LinkListEditor: React.FC<LinkListEditorProps> = ({
  section,
  onChange,
  linkType = 'both',
  placeholder = { label: 'Link Label', route: '/path', url: 'https://example.com' },
}) => {
  const [editState, setEditState] = useState<EditState | null>(null)
  const [isAdding, setIsAdding] = useState(false)

  const sorted = [...section.links].sort((a, b) => a.order - b.order)

  const moveUp = (idx: number) => {
    if (idx === 0) return
    const arr = [...sorted]
    const tmp = arr[idx].order
    arr[idx] = { ...arr[idx], order: arr[idx - 1].order }
    arr[idx - 1] = { ...arr[idx - 1], order: tmp }
    onChange({ ...section, links: arr })
  }

  const moveDown = (idx: number) => {
    if (idx === sorted.length - 1) return
    const arr = [...sorted]
    const tmp = arr[idx].order
    arr[idx] = { ...arr[idx], order: arr[idx + 1].order }
    arr[idx + 1] = { ...arr[idx + 1], order: tmp }
    onChange({ ...section, links: arr })
  }

  const toggleVisible = (id: string) => {
    onChange({ ...section, links: section.links.map(l => l.id === id ? { ...l, visible: !l.visible } : l) })
  }

  const deleteLink = (id: string) => {
    onChange({ ...section, links: section.links.filter(l => l.id !== id) })
  }

  const startEdit = (link: FooterLink) => {
    setEditState({ id: link.id, label: link.label, to: link.to ?? '', href: link.href ?? '', visible: link.visible })
    setIsAdding(false)
  }

  const startAdd = () => {
    setEditState(emptyEdit())
    setIsAdding(true)
  }

  const cancelEdit = () => { setEditState(null); setIsAdding(false) }

  const commitEdit = () => {
    if (!editState || !editState.label.trim()) return
    if (isAdding) {
      const newLink: FooterLink = {
        id:       uid(),
        label:    editState.label.trim(),
        to:       editState.to.trim() || undefined,
        href:     editState.href.trim() || undefined,
        external: !!editState.href.trim(),
        order:    sorted.length + 1,
        visible:  editState.visible,
      }
      onChange({ ...section, links: [...section.links, newLink] })
    } else {
      onChange({
        ...section,
        links: section.links.map(l => l.id === editState.id
          ? { ...l, label: editState.label.trim(), to: editState.to.trim() || undefined, href: editState.href.trim() || undefined, external: !!editState.href.trim(), visible: editState.visible }
          : l
        ),
      })
    }
    cancelEdit()
  }

  return (
    <div className="space-y-3">
      {/* Section heading row */}
      <div className="grid grid-cols-2 gap-3">
        <Field label="Column Heading">
          <Inp value={section.heading} onChange={e => onChange({ ...section, heading: e.target.value })} placeholder="e.g. Administration" />
        </Field>
        <Field label="Visibility">
          <label className="flex items-center gap-2 cursor-pointer mt-2">
            <input type="checkbox" checked={section.visible}
              onChange={e => onChange({ ...section, visible: e.target.checked })}
              className="w-4 h-4 accent-primary" />
            <span className="text-sm font-medium text-slate-700">Show this column</span>
          </label>
        </Field>
      </div>

      {/* Link list */}
      <div className="border border-slate-200 rounded-lg overflow-hidden">
        <div className="bg-slate-50 px-3 py-2 border-b border-slate-200 flex items-center justify-between">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Links ({sorted.length})</span>
          <button type="button" onClick={startAdd}
            className="flex items-center gap-1 text-xs font-semibold text-primary hover:text-accent transition-colors">
            <Plus size={13} /> Add Link
          </button>
        </div>

        {sorted.length === 0 && !isAdding && (
          <div className="p-6 text-center text-sm text-slate-400">No links yet — click "Add Link" above.</div>
        )}

        <div className="divide-y divide-slate-100">
          {sorted.map((link, idx) => (
            <div key={link.id} className={`flex items-center gap-2 px-3 py-2.5 hover:bg-slate-50 transition-colors ${!link.visible ? 'opacity-50' : ''}`}>
              {/* Reorder */}
              <div className="flex flex-col gap-0.5">
                <button type="button" onClick={() => moveUp(idx)} disabled={idx === 0}
                  className="p-0.5 text-slate-300 hover:text-primary disabled:opacity-30 transition-colors">
                  <ChevronUp size={13} />
                </button>
                <button type="button" onClick={() => moveDown(idx)} disabled={idx === sorted.length - 1}
                  className="p-0.5 text-slate-300 hover:text-primary disabled:opacity-30 transition-colors">
                  <ChevronDown size={13} />
                </button>
              </div>
              {/* Label */}
              <span className="flex-1 text-sm text-slate-700 truncate">{link.label}</span>
              {/* Path/URL */}
              <span className="text-[10px] text-slate-400 truncate max-w-[140px]">{link.to ?? link.href ?? '—'}</span>
              {/* Actions */}
              <div className="flex items-center gap-1 shrink-0">
                <button type="button" onClick={() => toggleVisible(link.id)} title={link.visible ? 'Hide' : 'Show'}
                  className="p-1 text-slate-400 hover:text-primary transition-colors">
                  {link.visible ? <Eye size={13} /> : <EyeOff size={13} />}
                </button>
                <button type="button" onClick={() => startEdit(link)}
                  className="p-1 text-slate-400 hover:text-primary transition-colors">
                  <Pencil size={13} />
                </button>
                <button type="button" onClick={() => deleteLink(link.id)}
                  className="p-1 text-slate-400 hover:red-500 transition-colors">
                  <Trash2 size={13} />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Inline add / edit form */}
        {editState !== null && (
          <div className="border-t border-accent/30 bg-[#bfa15f]/5 p-4 space-y-3">
            <p className="text-[11px] font-bold text-accent uppercase tracking-wider">
              {isAdding ? '＋ New Link' : '✎ Edit Link'}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Field label="Label" required>
                <Inp value={editState.label} onChange={e => setEditState(s => s ? { ...s, label: e.target.value } : s)}
                  placeholder={placeholder.label} />
              </Field>
              {(linkType === 'internal' || linkType === 'both') && (
                <Field label="Internal Route" hint="e.g. /about/institute">
                  <Inp value={editState.to} onChange={e => setEditState(s => s ? { ...s, to: e.target.value } : s)}
                    placeholder={placeholder.route ?? '/path'} />
                </Field>
              )}
              {(linkType === 'external' || linkType === 'both') && (
                <Field label="External URL" hint="Leave blank if internal only">
                  <Inp type="url" value={editState.href} onChange={e => setEditState(s => s ? { ...s, href: e.target.value } : s)}
                    placeholder={placeholder.url ?? 'https://example.com'} />
                </Field>
              )}
              <Field label="Visible">
                <label className="flex items-center gap-2 cursor-pointer mt-2">
                  <input type="checkbox" checked={editState.visible}
                    onChange={e => setEditState(s => s ? { ...s, visible: e.target.checked } : s)}
                    className="w-4 h-4 accent-primary" />
                  <span className="text-sm text-slate-700">Show in footer</span>
                </label>
              </Field>
            </div>
            <div className="flex gap-2">
              <button type="button" onClick={commitEdit}
                className="px-4 py-1.5 bg-primary text-white text-xs font-bold rounded hover:bg-primary/90 transition-colors">
                {isAdding ? 'Add Link' : 'Update Link'}
              </button>
              <button type="button" onClick={cancelEdit}
                className="px-4 py-1.5 border border-slate-200 text-slate-700 text-xs font-bold rounded hover:bg-slate-50 transition-colors flex items-center gap-1">
                <X size={12} /> Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

// ─── Policy link list editor (simpler — only internal routes) ─────────────────

interface PolicyListEditorProps {
  links: FooterPolicyLink[]
  onChange: (links: FooterPolicyLink[]) => void
}

interface PolicyEditState {
  id: string; label: string; to: string; visible: boolean
}

export const PolicyLinkListEditor: React.FC<PolicyListEditorProps> = ({ links, onChange }) => {
  const [editState, setEditState] = useState<PolicyEditState | null>(null)
  const [isAdding, setIsAdding] = useState(false)

  const sorted = [...links].sort((a, b) => a.order - b.order)

  const moveUp = (idx: number) => {
    if (idx === 0) return
    const arr = [...sorted]
    const tmp = arr[idx].order
    arr[idx] = { ...arr[idx], order: arr[idx - 1].order }
    arr[idx - 1] = { ...arr[idx - 1], order: tmp }
    onChange(arr)
  }
  const moveDown = (idx: number) => {
    if (idx === sorted.length - 1) return
    const arr = [...sorted]
    const tmp = arr[idx].order
    arr[idx] = { ...arr[idx], order: arr[idx + 1].order }
    arr[idx + 1] = { ...arr[idx + 1], order: tmp }
    onChange(arr)
  }
  const toggleVisible = (id: string) => onChange(links.map(l => l.id === id ? { ...l, visible: !l.visible } : l))
  const deleteLink = (id: string) => onChange(links.filter(l => l.id !== id))

  const startEdit = (l: FooterPolicyLink) => { setEditState({ id: l.id, label: l.label, to: l.to, visible: l.visible }); setIsAdding(false) }
  const startAdd = () => { setEditState({ id: '', label: '', to: '', visible: true }); setIsAdding(true) }
  const cancel = () => { setEditState(null); setIsAdding(false) }

  const commit = () => {
    if (!editState || !editState.label.trim()) return
    if (isAdding) {
      const nl: FooterPolicyLink = { id: uid(), label: editState.label.trim(), to: editState.to.trim(), order: sorted.length + 1, visible: editState.visible }
      onChange([...links, nl])
    } else {
      onChange(links.map(l => l.id === editState.id ? { ...l, label: editState.label.trim(), to: editState.to.trim(), visible: editState.visible } : l))
    }
    cancel()
  }

  return (
    <div className="border border-slate-200 rounded-lg overflow-hidden">
      <div className="bg-slate-50 px-3 py-2 border-b border-slate-200 flex items-center justify-between">
        <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Policy Links ({sorted.length})</span>
        <button type="button" onClick={startAdd} className="flex items-center gap-1 text-xs font-semibold text-primary hover:text-accent transition-colors">
          <Plus size={13} /> Add
        </button>
      </div>
      {sorted.length === 0 && !isAdding && <div className="p-6 text-center text-sm text-slate-400">No policy links yet.</div>}
      <div className="divide-y divide-slate-100">
        {sorted.map((link, idx) => (
          <div key={link.id} className={`flex items-center gap-2 px-3 py-2.5 hover:bg-slate-50 ${!link.visible ? 'opacity-50' : ''}`}>
            <div className="flex flex-col gap-0.5">
              <button type="button" onClick={() => moveUp(idx)} disabled={idx === 0} className="p-0.5 text-slate-300 hover:text-primary disabled:opacity-30"><ChevronUp size={13} /></button>
              <button type="button" onClick={() => moveDown(idx)} disabled={idx === sorted.length - 1} className="p-0.5 text-slate-300 hover:text-primary disabled:opacity-30"><ChevronDown size={13} /></button>
            </div>
            <span className="flex-1 text-sm text-slate-700">{link.label}</span>
            <span className="text-[10px] text-slate-400 max-w-[180px] truncate">{link.to}</span>
            <div className="flex items-center gap-1">
              <button type="button" onClick={() => toggleVisible(link.id)} className="p-1 text-slate-400 hover:text-primary">{link.visible ? <Eye size={13} /> : <EyeOff size={13} />}</button>
              <button type="button" onClick={() => startEdit(link)} className="p-1 text-slate-400 hover:text-primary"><Pencil size={13} /></button>
              <button type="button" onClick={() => deleteLink(link.id)} className="p-1 text-slate-400 hover:red-500"><Trash2 size={13} /></button>
            </div>
          </div>
        ))}
      </div>
      {editState !== null && (
        <div className="border-t border-accent/30 bg-[#bfa15f]/5 p-4 space-y-3">
          <p className="text-[11px] font-bold text-accent uppercase tracking-wider">{isAdding ? '＋ New Policy Link' : '✎ Edit Policy Link'}</p>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Label" required><Inp value={editState.label} onChange={e => setEditState(s => s ? { ...s, label: e.target.value } : s)} placeholder="e.g. Privacy Policy" /></Field>
            <Field label="Route" required hint="Internal route e.g. /policy/privacy"><Inp value={editState.to} onChange={e => setEditState(s => s ? { ...s, to: e.target.value } : s)} placeholder="/policy/privacy" /></Field>
            <Field label="Visible">
              <label className="flex items-center gap-2 cursor-pointer mt-2">
                <input type="checkbox" checked={editState.visible} onChange={e => setEditState(s => s ? { ...s, visible: e.target.checked } : s)} className="w-4 h-4 accent-primary" />
                <span className="text-sm text-slate-700">Show in footer</span>
              </label>
            </Field>
          </div>
          <div className="flex gap-2">
            <button type="button" onClick={commit} className="px-4 py-1.5 bg-primary text-white text-xs font-bold rounded hover:bg-primary/90 transition-colors">{isAdding ? 'Add' : 'Update'}</button>
            <button type="button" onClick={cancel} className="px-4 py-1.5 border border-slate-200 text-slate-700 text-xs font-bold rounded hover:bg-slate-50 transition-colors flex items-center gap-1"><X size={12} /> Cancel</button>
          </div>
        </div>
      )}
    </div>
  )
}
