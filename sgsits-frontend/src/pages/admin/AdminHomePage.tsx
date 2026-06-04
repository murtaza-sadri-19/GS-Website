/**
 * Admin Home Page Manager
 *
 * Manages every CMS section rendered by Home.tsx.
 * Each tab saves independently to the cms_sections table via PUT /api/v1/settings/cms/:key.
 *
 * Route: /dashboard/central-admin/home
 */
import React, { useState, useEffect, useCallback } from 'react'
import {
  Image, Type, Users, BookOpen, BarChart2, Globe, HelpCircle,
  List, Building, Megaphone, Eye, EyeOff, GripVertical,
  Save, Loader2, CheckCircle2, AlertTriangle, RefreshCw,
} from 'lucide-react'
import { getCmsSection, saveCmsSection } from '../../services/settingsService'
import { usePageCacheStore } from '../../store/pageCacheStore'

// ─── Shared section editor skeleton ──────────────────────────────────────────

interface JsonEditorProps {
  sectionKey: string
  label: string
  description: string
}

const JsonEditor: React.FC<JsonEditorProps> = ({ sectionKey, label, description }) => {
  const [raw, setRaw]       = useState('')
  const [loading, setLoading] = useState(false)
  const [saving, setSaving]   = useState(false)
  const [saved, setSaved]     = useState(false)
  const [error, setError]     = useState('')

  const load = useCallback(async () => {
    setLoading(true); setError('')
    try {
      const d = await getCmsSection(sectionKey)
      setRaw(JSON.stringify(d, null, 2))
    } catch { setError('Failed to load') }
    finally { setLoading(false) }
  }, [sectionKey])

  useEffect(() => { load() }, [load])

  const save = async () => {
    setSaving(true); setError('')
    try {
      const parsed = JSON.parse(raw)
      await saveCmsSection(sectionKey, parsed)
      usePageCacheStore.getState().invalidate('home')
      setSaved(true); setTimeout(() => setSaved(false), 3000)
    } catch (e) {
      setError(e instanceof SyntaxError ? 'Invalid JSON — fix syntax before saving.' : 'Save failed.')
    } finally { setSaving(false) }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-start justify-between">
        <div>
          <h3 className="font-semibold text-slate-800">{label}</h3>
          <p className="text-xs text-slate-500 mt-0.5">{description}</p>
          <code className="text-xs bg-slate-100 px-1.5 py-0.5 rounded text-slate-500 mt-1 inline-block">{sectionKey}</code>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <button onClick={load} disabled={loading}
            className="p-2 border border-slate-200 text-slate-500 rounded hover:bg-slate-50 transition-colors disabled:opacity-60">
            <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
          </button>
          <button onClick={save} disabled={saving || !raw}
            className="px-4 py-2 text-sm font-semibold bg-primary text-white rounded hover:bg-primary/90 transition-colors disabled:opacity-60 flex items-center gap-2">
            {saving ? <Loader2 size={14} className="animate-spin" /> : saved ? <CheckCircle2 size={14} /> : <Save size={14} />}
            {saved ? 'Saved!' : 'Save'}
          </button>
        </div>
      </div>
      {error && (
        <div className="flex items-start gap-2 bg-red-50 border border-red-200 rounded p-3 text-sm text-red-700">
          <AlertTriangle size={14} className="shrink-0 mt-0.5" />
          {error}
        </div>
      )}
      <textarea
        value={raw}
        onChange={e => setRaw(e.target.value)}
        className="w-full h-96 font-mono text-xs bg-slate-50 border border-slate-200 rounded p-3 focus:outline-none focus:border-primary resize-y"
        placeholder="Loading…"
        spellCheck={false}
      />
      <p className="text-xs text-slate-400">
        Edit JSON directly. Invalid JSON will be rejected on save. Use the{' '}
        <a href="https://jsonlint.com" target="_blank" rel="noopener noreferrer" className="underline">JSON Lint</a>{' '}
        validator if needed.
      </p>
    </div>
  )
}

// ─── Section Ordering Editor ──────────────────────────────────────────────────

interface SectionItem {
  id: string
  type: string
  enabled: boolean
  order: number
}

const SECTION_LABELS: Record<string, string> = {
  hero:         'Hero Banner + Tiles',
  about:        'About + Director + Announcements',
  news:         'Campus News',
  academics:    'Academic Programs',
  departments:  'Departments Grid',
  stats:        'Stats Banner (Parallax)',
  campus_life:  'Campus Life Facilities',
  faqs_gallery: 'FAQs + Photo Gallery',
}

const SectionsEditor: React.FC = () => {
  const [sections, setSections] = useState<SectionItem[]>([])
  const [loading, setLoading]   = useState(true)
  const [saving, setSaving]     = useState(false)
  const [saved, setSaved]       = useState(false)
  const [error, setError]       = useState('')

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const d = await getCmsSection<SectionItem[]>('home.sections')
      if (Array.isArray(d) && d.length > 0) {
        setSections([...d].sort((a, b) => a.order - b.order))
      } else {
        setSections([
          { id: 'hero',         type: 'hero',         enabled: true, order: 1 },
          { id: 'about',        type: 'about',        enabled: true, order: 2 },
          { id: 'news',         type: 'news',         enabled: true, order: 3 },
          { id: 'academics',    type: 'academics',    enabled: true, order: 4 },
          { id: 'departments',  type: 'departments',  enabled: true, order: 5 },
          { id: 'stats',        type: 'stats',        enabled: true, order: 6 },
          { id: 'campus_life',  type: 'campus_life',  enabled: true, order: 7 },
          { id: 'faqs_gallery', type: 'faqs_gallery', enabled: true, order: 8 },
        ])
      }
    } catch { setError('Failed to load sections.') }
    finally { setLoading(false) }
  }, [])

  useEffect(() => { load() }, [load])

  const toggle = (id: string) => {
    setSections(prev => prev.map(s => s.id === id ? { ...s, enabled: !s.enabled } : s))
  }

  const move = (id: string, direction: 'up' | 'down') => {
    setSections(prev => {
      const arr = [...prev]
      const idx = arr.findIndex(s => s.id === id)
      const swapIdx = direction === 'up' ? idx - 1 : idx + 1
      if (swapIdx < 0 || swapIdx >= arr.length) return prev
      ;[arr[idx], arr[swapIdx]] = [arr[swapIdx], arr[idx]]
      return arr.map((s, i) => ({ ...s, order: i + 1 }))
    })
  }

  const save = async () => {
    setSaving(true); setError('')
    try {
      await saveCmsSection('home.sections', sections)
      setSaved(true); setTimeout(() => setSaved(false), 3000)
    } catch { setError('Save failed.') }
    finally { setSaving(false) }
  }

  if (loading) return <div className="h-48 flex items-center justify-center text-slate-400 text-sm">Loading sections…</div>

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-semibold text-slate-800">Section Visibility & Order</h3>
          <p className="text-xs text-slate-500 mt-0.5">Enable/disable and reorder home page sections. Changes take effect immediately after saving.</p>
        </div>
        <button onClick={save} disabled={saving}
          className="px-4 py-2 text-sm font-semibold bg-primary text-white rounded hover:bg-primary/90 transition-colors disabled:opacity-60 flex items-center gap-2">
          {saving ? <Loader2 size={14} className="animate-spin" /> : saved ? <CheckCircle2 size={14} /> : <Save size={14} />}
          {saved ? 'Saved!' : 'Save Order'}
        </button>
      </div>

      {error && (
        <div className="flex items-start gap-2 bg-red-50 border border-red-200 rounded p-3 text-sm text-red-700">
          <AlertTriangle size={14} className="shrink-0 mt-0.5" />{error}
        </div>
      )}

      <div className="space-y-2">
        {sections.map((section, idx) => (
          <div key={section.id}
            className={`flex items-center gap-3 p-3 rounded-lg border transition-colors ${
              section.enabled ? 'bg-white border-slate-200' : 'bg-slate-50 border-slate-200 opacity-60'
            }`}
          >
            <GripVertical size={16} className="text-slate-300 shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-slate-800">{SECTION_LABELS[section.id] ?? section.id}</p>
              <p className="text-xs text-slate-400 font-mono mt-0.5">type: {section.type} · order: {section.order}</p>
            </div>
            <div className="flex items-center gap-1 shrink-0">
              <button onClick={() => move(section.id, 'up')} disabled={idx === 0}
                className="p-1 text-slate-400 hover:text-primary disabled:opacity-30 transition-colors">
                ↑
              </button>
              <button onClick={() => move(section.id, 'down')} disabled={idx === sections.length - 1}
                className="p-1 text-slate-400 hover:text-primary disabled:opacity-30 transition-colors">
                ↓
              </button>
              <button onClick={() => toggle(section.id)}
                className={`p-1.5 rounded transition-colors ${
                  section.enabled ? 'text-emerald-600 hover:text-emerald-700' : 'text-slate-400 hover:text-slate-600'
                }`}
                title={section.enabled ? 'Click to hide section' : 'Click to show section'}
              >
                {section.enabled ? <Eye size={15} /> : <EyeOff size={15} />}
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-amber-50 border border-amber-200 rounded p-3 text-xs text-amber-700">
        <strong>Note:</strong> When no sections are saved, all sections are shown by default. Empty the saved list to restore default behaviour.
      </div>
    </div>
  )
}

// ─── Tab definition ───────────────────────────────────────────────────────────

type TabId =
  | 'sections' | 'hero' | 'about' | 'director' | 'news'
  | 'academics' | 'departments' | 'stats' | 'campus_life'
  | 'faqs' | 'gallery' | 'seo' | 'labels'

interface Tab {
  id: TabId
  label: string
  icon: React.FC<{ size?: number; className?: string }>
}

const TABS: Tab[] = [
  { id: 'sections',    label: 'Section Order',    icon: List },
  { id: 'hero',        label: 'Hero Banner',       icon: Image },
  { id: 'about',       label: 'About',             icon: Type },
  { id: 'director',    label: 'Director',          icon: Users },
  { id: 'news',        label: 'News Labels',       icon: Megaphone },
  { id: 'academics',   label: 'Academics',         icon: BookOpen },
  { id: 'departments', label: 'Departments',       icon: Building },
  { id: 'stats',       label: 'Stats Banner',      icon: BarChart2 },
  { id: 'campus_life', label: 'Campus Life',       icon: Globe },
  { id: 'faqs',        label: 'FAQs',              icon: HelpCircle },
  { id: 'gallery',     label: 'Gallery Config',    icon: Image },
  { id: 'seo',         label: 'SEO',               icon: Globe },
  { id: 'labels',      label: 'UI Labels',         icon: Type },
]

// ─── Main Component ───────────────────────────────────────────────────────────

const AdminHomePage: React.FC = () => {
  const [active, setActive] = useState<TabId>('sections')

  const renderContent = () => {
    switch (active) {
      case 'sections':
        return <SectionsEditor />
      case 'hero':
        return (
          <JsonEditor
            sectionKey="home.hero"
            label="Hero Banner + Tiles"
            description="Controls the full-screen banner (images, text) and the 4-tile grid below it. Tiles: {iconName, title, subtitle, path, dark}. iconName values: BookOpen, GraduationCap, FlaskConical, Rocket, Newspaper, Landmark, Microscope, Users, Building, FileText."
          />
        )
      case 'about':
        return (
          <JsonEditor
            sectionKey="home.about"
            label="About Section"
            description="The institute overview paragraph and CTA buttons on the left column. Fields: label, heading, accentText, body, primaryButton {label, to}, secondaryButton {label, to}."
          />
        )
      case 'director':
        return (
          <JsonEditor
            sectionKey="home.director"
            label="Director's Corner"
            description="Director card displayed below the About section. Fields: label, heading, accentText, photo (URL), name, bio, readMoreTo, readMoreLabel. Upload director photo via Media Manager → copy URL here."
          />
        )
      case 'news':
        return (
          <JsonEditor
            sectionKey="home.news"
            label="News Section Labels"
            description="Section heading and description for the campus news grid. Actual news articles come from the News module. Fields: label, heading, accentText, description."
          />
        )
      case 'academics':
        return (
          <JsonEditor
            sectionKey="home.academics"
            label="Academic Programs Section"
            description="Section heading and 3 program cards. Each card: {id, iconName, title, description, to, ctaLabel}. Add/remove/edit programme cards here."
          />
        )
      case 'departments':
        return (
          <JsonEditor
            sectionKey="home.departments"
            label="Departments Grid"
            description="Department list shown on the home page. Each item: {name, slug}. Slug must match the departments table and /departments/{slug} route."
          />
        )
      case 'stats':
        return (
          <JsonEditor
            sectionKey="home.stats"
            label="Stats Banner"
            description="Parallax stats counter section. Fields: backgroundImage (URL), fallbackImage (URL), items [{val, label}]. Upload a dark campus photo as background via Media Manager."
          />
        )
      case 'campus_life':
        return (
          <JsonEditor
            sectionKey="home.campus_life"
            label="Campus Life Facilities"
            description="6 facility cards. Each: {id, iconName, title, description, to, imageUrl}. Upload facility photos via Media Manager → paste URLs in imageUrl fields."
          />
        )
      case 'faqs':
        return (
          <JsonEditor
            sectionKey="home.faqs"
            label="FAQ Accordion"
            description="Frequently asked questions. Fields: heading, subLabel, viewAllLink, items[]. Each item: {id, question, answer, defaultOpen?, contact?}. Contact: {name, phone, email}."
          />
        )
      case 'gallery':
        return (
          <JsonEditor
            sectionKey="home.gallery"
            label="Gallery Section Config"
            description="Section heading only. Gallery thumbnail images come from the Gallery module (Admin → Gallery). Fields: heading, accentText, subLabel, viewAllLink."
          />
        )
      case 'seo':
        return (
          <JsonEditor
            sectionKey="home.seo"
            label="Home Page SEO"
            description="Meta title, meta description, Open Graph tags, canonical URL, and robots directive for the home page."
          />
        )
      case 'labels':
        return (
          <JsonEditor
            sectionKey="ui_labels"
            label="UI Text Labels"
            description="All static text strings used across the site UI. homepage: {announcementsHeading, announcementsBadge, viewAllNoticesLabel, viewAllDepartmentsLabel, viewAllFaqsLabel, viewAllGalleryLabel}."
          />
        )
      default:
        return null
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="pb-4 border-b border-slate-200">
        <h2 className="font-display text-2xl font-bold text-slate-800 flex items-center gap-2">
          <Image size={22} className="text-accent" />
          Home Page Manager
        </h2>
        <p className="text-xs text-slate-500 mt-1">
          Edit every section of the home page. Changes are live immediately after saving.
          Gallery thumbnails and news cards are managed in their respective modules.
        </p>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm text-blue-800">
        <strong>How it works:</strong> Each tab edits one CMS section stored in the database. Load → edit → save.
        The home page reads these sections on every visit. No code changes or deployments required.
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-1.5 border-b border-slate-200 pb-3">
        {TABS.map(tab => {
          const Icon = tab.icon
          return (
            <button
              key={tab.id}
              onClick={() => setActive(tab.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-semibold transition-colors ${
                active === tab.id
                  ? 'bg-primary text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              <Icon size={13} />
              {tab.label}
            </button>
          )
        })}
      </div>

      {/* Tab Content */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-6">
        {renderContent()}
      </div>
    </div>
  )
}

export default AdminHomePage
