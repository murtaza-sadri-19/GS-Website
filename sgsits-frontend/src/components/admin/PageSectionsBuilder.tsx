/**
 * PageSectionsBuilder — embedded section manager for the Static Pages CMS.
 *
 * Usage (inside each AdminStaticPages tab):
 *   <PageSectionsBuilder pageKey="about" />
 *   <PageSectionsBuilder pageKey="facilities" />
 */

import React, { useEffect, useState, useCallback } from 'react'
import * as Icons from 'lucide-react'
import {
  getPageSections,
  createPageSection,
  updatePageSection,
  deletePageSection,
  reorderPageSections,
  type PageSection,
  type SectionType,
} from '../../services/pageSectionsService'

// ── Types ─────────────────────────────────────────────────────────────────────

const SECTION_TYPES: { value: SectionType; label: string; desc: string }[] = [
  { value: 'hero',         label: 'Hero',         desc: 'Page header with title, subtitle and CTA buttons' },
  { value: 'nav_children', label: 'Nav Cards',    desc: 'Auto-generated cards from nav tree children' },
  { value: 'dynamic_data', label: 'Live Stats',   desc: 'Real-time counters from the database' },
  { value: 'stats',        label: 'Static Stats', desc: 'Fixed statistics grid with manual values' },
  { value: 'cards',        label: 'Cards',        desc: 'Manual card grid (title, desc, link)' },
  { value: 'cta',          label: 'CTA Band',     desc: 'Call-to-action section with link buttons' },
  { value: 'links',        label: 'Links List',   desc: 'Simple list of navigation links' },
  { value: 'announcements',label: 'Announcements','desc': 'Pull latest notices/news by tag' },
  { value: 'html',         label: 'HTML Block',   desc: 'Rich HTML content / text block' },
  { value: 'featured',     label: 'Featured',     desc: 'Featured content with text and aside card' },
  { value: 'gallery',      label: 'Gallery',      desc: 'Image gallery section' },
  { value: 'faq',          label: 'FAQ',          desc: 'Collapsible FAQ accordion' },
  { value: 'downloads',    label: 'Downloads',    desc: 'File download links list' },
]

const TYPE_BADGES: Record<SectionType, string> = {
  hero:          'bg-blue-50 text-blue-700 border-blue-200',
  nav_children:  'bg-violet-50 text-violet-700 border-violet-200',
  dynamic_data:  'bg-green-50 text-green-700 border-green-200',
  stats:         'bg-amber-50 text-amber-700 border-amber-200',
  cards:         'bg-cyan-50 text-cyan-700 border-cyan-200',
  cta:           'bg-orange-50 text-orange-700 border-orange-200',
  links:         'bg-slate-50 text-slate-700 border-slate-200',
  announcements: 'bg-red-50 text-red-700 border-red-200',
  html:          'bg-stone-50 text-stone-700 border-stone-200',
  featured:      'bg-pink-50 text-pink-700 border-pink-200',
  gallery:       'bg-indigo-50 text-indigo-700 border-indigo-200',
  faq:           'bg-teal-50 text-teal-700 border-teal-200',
  downloads:     'bg-lime-50 text-lime-700 border-lime-200',
}

// ── Form blank ────────────────────────────────────────────────────────────────

const blank = (pageKey: string): Partial<PageSection> => ({
  page_key:     pageKey,
  section_key:  '',
  section_type: 'html',
  title:        '',
  subtitle:     '',
  content:      '',
  settings_json:null,
  display_order: 0,
  is_active:    true,
})

// ── Settings JSON helper ──────────────────────────────────────────────────────

const SettingsEditor: React.FC<{
  value: Record<string, any> | null
  onChange: (v: Record<string, any> | null) => void
}> = ({ value, onChange }) => {
  const [raw, setRaw] = useState(value ? JSON.stringify(value, null, 2) : '')
  const [err, setErr]  = useState('')

  const handleChange = (text: string) => {
    setRaw(text)
    if (!text.trim()) { setErr(''); onChange(null); return }
    try {
      const parsed = JSON.parse(text)
      setErr('')
      onChange(parsed)
    } catch {
      setErr('Invalid JSON')
    }
  }

  return (
    <div>
      <label className="block text-xs font-bold text-slate-600 uppercase tracking-wide mb-1">
        Settings JSON
      </label>
      <textarea
        rows={8}
        value={raw}
        onChange={e => handleChange(e.target.value)}
        className="w-full border border-slate-200 rounded px-3 py-2 text-xs font-mono bg-slate-50 focus:outline-none focus:border-primary resize-y"
        placeholder={'{\n  "navLabel": "Facilities",\n  "descriptions": {}\n}'}
      />
      {err && <p className="text-xs text-red-500 mt-1">{err}</p>}
    </div>
  )
}

// ── Section form modal ────────────────────────────────────────────────────────

const SectionFormModal: React.FC<{
  pageKey: string
  initial: Partial<PageSection> | null
  onSave: (section: Partial<PageSection>) => Promise<void>
  onClose: () => void
  saving: boolean
}> = ({ pageKey, initial, onSave, onClose, saving }) => {
  const [form, setForm] = useState<Partial<PageSection>>(initial ?? blank(pageKey))

  const set = (k: keyof PageSection, v: any) =>
    setForm(f => ({ ...f, [k]: v }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await onSave(form)
  }

  const inp  = 'w-full border border-slate-200 rounded px-3 py-2 text-sm bg-white focus:outline-none focus:border-primary'
  const lbl  = 'block text-xs font-bold text-slate-600 uppercase tracking-wide mb-1'

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-200 shrink-0">
          <h3 className="font-display font-bold text-slate-900 text-base">
            {initial?.id ? 'Edit Section' : 'Add Section'}
          </h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <Icons.X size={18} />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="overflow-y-auto flex-1 p-5 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            {/* Section key */}
            <div>
              <label className={lbl}>Section Key *</label>
              <input required className={inp} value={form.section_key ?? ''}
                onChange={e => set('section_key', e.target.value.toLowerCase().replace(/\s+/g, '_'))}
                placeholder="e.g. hero, quick_access" />
              <p className="text-xs text-slate-400 mt-0.5">Unique ID within this page (snake_case)</p>
            </div>

            {/* Section type */}
            <div>
              <label className={lbl}>Section Type *</label>
              <select required className={inp} value={form.section_type}
                onChange={e => set('section_type', e.target.value as SectionType)}>
                {SECTION_TYPES.map(t => (
                  <option key={t.value} value={t.value}>{t.label} — {t.desc}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Title */}
          <div>
            <label className={lbl}>Title</label>
            <input className={inp} value={form.title ?? ''}
              onChange={e => set('title', e.target.value)} placeholder="Section heading (optional)" />
          </div>

          {/* Subtitle */}
          <div>
            <label className={lbl}>Subtitle</label>
            <textarea rows={2} className={`${inp} resize-y`} value={form.subtitle ?? ''}
              onChange={e => set('subtitle', e.target.value)} placeholder="Brief description (optional)" />
          </div>

          {/* Content (HTML) */}
          {(form.section_type === 'html' || form.section_type === 'featured') && (
            <div>
              <label className={lbl}>Content (HTML)</label>
              <textarea rows={6} className={`${inp} font-mono text-xs resize-y`}
                value={form.content ?? ''}
                onChange={e => set('content', e.target.value)}
                placeholder="<p>HTML content…</p>" />
            </div>
          )}

          {/* Settings JSON */}
          <SettingsEditor
            value={form.settings_json ?? null}
            onChange={v => set('settings_json', v)}
          />

          <div className="grid grid-cols-2 gap-4">
            {/* Order */}
            <div>
              <label className={lbl}>Display Order</label>
              <input type="number" min={0} className={inp}
                value={form.display_order ?? 0}
                onChange={e => set('display_order', parseInt(e.target.value) || 0)} />
            </div>

            {/* Active */}
            <div className="flex items-end pb-1">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="w-4 h-4 rounded accent-primary"
                  checked={form.is_active !== false}
                  onChange={e => set('is_active', e.target.checked)} />
                <span className="text-sm font-medium text-slate-700">Active (visible on site)</span>
              </label>
            </div>
          </div>
        </form>

        {/* Footer */}
        <div className="flex justify-end gap-3 p-4 border-t border-slate-200 shrink-0">
          <button type="button" onClick={onClose}
            className="px-4 py-2 text-sm text-slate-600 border border-slate-200 rounded hover:bg-slate-50">
            Cancel
          </button>
          <button onClick={handleSubmit as any} disabled={saving}
            className="px-5 py-2 text-sm font-bold text-white bg-primary rounded hover:bg-primary/90 disabled:opacity-60 flex items-center gap-1.5">
            {saving ? <><Icons.Loader2 size={13} className="animate-spin" /> Saving…</> : <><Icons.Save size={13} /> Save Section</>}
          </button>
        </div>
      </div>
    </div>
  )
}

// ── Main ──────────────────────────────────────────────────────────────────────

interface PageSectionsBuilderProps {
  pageKey: string
}

const PageSectionsBuilder: React.FC<PageSectionsBuilderProps> = ({ pageKey }) => {
  const [sections, setSections] = useState<PageSection[]>([])
  const [loading, setLoading]   = useState(true)
  const [modal, setModal]       = useState<Partial<PageSection> | null | 'new'>(null)
  const [saving, setSaving]     = useState(false)
  const [toast, setToast]       = useState('')

  const showToast = (msg: string) => {
    setToast(msg)
    setTimeout(() => setToast(''), 3000)
  }

  const load = useCallback(async () => {
    setLoading(true)
    const data = await getPageSections(pageKey, { all: true })
    setSections(data)
    setLoading(false)
  }, [pageKey])

  useEffect(() => { load() }, [load])

  const handleSave = async (form: Partial<PageSection>) => {
    setSaving(true)
    try {
      if (form.id) {
        await updatePageSection(form.id, form)
        showToast('Section updated.')
      } else {
        await createPageSection({ ...form, page_key: pageKey })
        showToast('Section created.')
      }
      setModal(null)
      await load()
    } catch (e: any) {
      showToast(e?.response?.data?.message ?? 'Save failed.')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id: number) => {
    if (!window.confirm('Delete this section permanently?')) return
    await deletePageSection(id)
    showToast('Section deleted.')
    await load()
  }

  const move = async (idx: number, dir: -1 | 1) => {
    const next = [...sections]
    const swap = next[idx + dir]
    next[idx + dir] = next[idx]
    next[idx] = swap
    setSections(next)
    await reorderPageSections(pageKey, next.map(s => s.id))
  }

  return (
    <div className="mt-8 border-t border-dashed border-slate-200 pt-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="font-display font-bold text-slate-800 flex items-center gap-2">
            <Icons.Layers size={16} className="text-accent" />
            Page Sections Builder
            <span className="text-xs font-mono text-slate-400 bg-slate-100 px-2 py-0.5 rounded border ml-1">
              {pageKey}
            </span>
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Control what appears on the public <strong>/{pageKey}</strong> landing page. Changes go live immediately after saving.
          </p>
        </div>
        <button
          onClick={() => setModal('new')}
          className="px-3 py-1.5 bg-primary text-white text-xs font-bold rounded flex items-center gap-1.5 hover:bg-primary/90"
        >
          <Icons.Plus size={13} className="text-accent" /> Add Section
        </button>
      </div>

      {/* Section list */}
      {loading ? (
        <div className="space-y-2">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-14 rounded border border-slate-100 bg-slate-50 animate-pulse" />
          ))}
        </div>
      ) : sections.length === 0 ? (
        <div className="text-center py-10 border border-dashed border-slate-200 rounded-lg">
          <Icons.Layers className="w-8 h-8 mx-auto text-slate-300 mb-2" />
          <p className="text-sm text-slate-400">No sections yet. Click <strong>Add Section</strong> to get started.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {sections.map((sec, idx) => (
            <div key={sec.id}
              className={`flex items-center gap-3 p-3 rounded border bg-white text-sm transition-all ${
                sec.is_active ? 'border-slate-200 hover:border-slate-300' : 'border-slate-100 opacity-50'
              }`}
            >
              {/* Reorder */}
              <div className="flex flex-col gap-0.5 shrink-0">
                <button disabled={idx === 0} onClick={() => move(idx, -1)}
                  className="p-0.5 rounded hover:bg-slate-100 disabled:opacity-20 disabled:pointer-events-none">
                  <Icons.ChevronUp size={13} />
                </button>
                <button disabled={idx === sections.length - 1} onClick={() => move(idx, 1)}
                  className="p-0.5 rounded hover:bg-slate-100 disabled:opacity-20 disabled:pointer-events-none">
                  <Icons.ChevronDown size={13} />
                </button>
              </div>

              {/* Order badge */}
              <span className="text-xs font-mono text-slate-400 w-5 text-center shrink-0">{idx + 1}</span>

              {/* Type badge */}
              <span className={`text-xs font-bold px-2 py-0.5 rounded border uppercase tracking-wide shrink-0 ${TYPE_BADGES[sec.section_type] ?? ''}`}>
                {sec.section_type.replace('_', ' ')}
              </span>

              {/* Key + title */}
              <div className="flex-1 min-w-0">
                <span className="font-mono text-xs text-slate-600">{sec.section_key}</span>
                {sec.title && <span className="ml-2 text-slate-400 text-xs">— {sec.title}</span>}
              </div>

              {/* Status */}
              <span className={`text-xs font-semibold shrink-0 ${sec.is_active ? 'text-green-600' : 'text-slate-400'}`}>
                {sec.is_active ? '● Active' : '○ Hidden'}
              </span>

              {/* Actions */}
              <div className="flex items-center gap-1 shrink-0">
                <button onClick={() => setModal(sec)}
                  className="p-1.5 rounded hover:bg-slate-100 text-slate-500 hover:text-primary"
                  title="Edit section">
                  <Icons.Pencil size={13} />
                </button>
                <button onClick={() => handleDelete(sec.id)}
                  className="p-1.5 rounded hover:bg-red-50 text-slate-400 hover:text-red-500"
                  title="Delete section">
                  <Icons.Trash2 size={13} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {modal && (
        <SectionFormModal
          pageKey={pageKey}
          initial={modal === 'new' ? null : modal}
          onSave={handleSave}
          onClose={() => setModal(null)}
          saving={saving}
        />
      )}

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-4 right-4 z-50 bg-primary text-white px-4 py-2.5 rounded-lg shadow-xl text-sm font-semibold flex items-center gap-2">
          <Icons.CheckCircle2 size={15} className="text-accent" /> {toast}
        </div>
      )}
    </div>
  )
}

export default PageSectionsBuilder
