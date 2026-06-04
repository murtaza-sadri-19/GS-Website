/**
 * HOD Department Profile — full CMS editor for all 8 department section tabs.
 * Each section fetches from and saves to GET/PUT /v1/departments/:slug/sections/:section
 */

import React, { useState, useEffect, useCallback } from 'react'
import { PageHeader, PortalCard } from '../../components/layout/PortalLayout'
import { useAdminStore } from '../../store/adminStore'
import {
  Save, Loader2, CheckCircle2, Plus, Trash2,
  Info, Sparkles, FileText, BookOpen, Calendar,
  Award, Building, Image as ImageIcon, Edit3, X,
} from 'lucide-react'
import { departmentService } from '../../services/departmentService'
import { getDeptSection, saveDeptSection, type DeptSection } from '../../services/departmentService'
import type { DepartmentSummary } from '../../services/departmentService'

// ── Shared primitives ────────────────────────────────────────────────────────

const inputCls = 'w-full border border-slate-200 rounded px-3 py-2 text-sm bg-white focus:outline-none focus:border-primary'
const areaCls  = `${inputCls} resize-y min-h-[80px]`
const labelCls = 'block text-xs font-bold text-slate-600 uppercase tracking-wide mb-1'

const SaveBtn: React.FC<{ saving: boolean; saved: boolean; onClick: () => void }> = ({ saving, saved, onClick }) => (
  <button
    onClick={onClick}
    disabled={saving}
    className="inline-flex items-center gap-1.5 px-4 py-2 bg-primary text-white text-xs font-bold rounded hover:bg-primary/90 disabled:opacity-60"
  >
    {saving ? <><Loader2 size={13} className="animate-spin" />Saving…</>
             : saved  ? <><CheckCircle2 size={13} />Saved!</>
                      : <><Save size={13} />Save</>}
  </button>
)

function useSection<T extends Record<string, unknown>>(
  slug: string | null, section: DeptSection
): [T, (updater: (p: T) => T) => void, () => void, boolean, boolean] {
  const [data,   setData]   = useState<T>({} as T)
  const [saving, setSaving] = useState(false)
  const [saved,  setSaved]  = useState(false)

  useEffect(() => {
    if (!slug) return
    getDeptSection<T>(slug, section).then(d => { if (d) setData(d) }).catch(() => {})
  }, [slug, section])

  const update = useCallback((updater: (p: T) => T) => setData(prev => updater(prev)), [])

  const save = useCallback(async () => {
    if (!slug) return
    setSaving(true)
    try {
      await saveDeptSection(slug, section, data)
      setSaved(true)
      setTimeout(() => setSaved(false), 2500)
    } catch { /* noop */ } finally { setSaving(false) }
  }, [slug, section, data])

  return [data, update, save, saving, saved]
}

// ── String list editor ────────────────────────────────────────────────────────

const StrList: React.FC<{ label: string; items: string[]; onChange: (i: string[]) => void; placeholder?: string }> = ({ label, items, onChange, placeholder }) => (
  <div>
    <label className={labelCls}>{label}</label>
    <div className="space-y-2">
      {items.map((item, i) => (
        <div key={i} className="flex gap-2">
          <input value={item} onChange={e => { const n = [...items]; n[i] = e.target.value; onChange(n) }} className={inputCls} placeholder={placeholder} />
          <button onClick={() => onChange(items.filter((_, j) => j !== i))} className="text-red-400 hover:text-red-600"><Trash2 size={14} /></button>
        </div>
      ))}
      <button onClick={() => onChange([...items, ''])} className="text-xs font-bold text-primary hover:text-primary/80 flex items-center gap-1"><Plus size={13} />Add item</button>
    </div>
  </div>
)

// ── Card list editor (title + desc) ──────────────────────────────────────────

interface CardRow { title: string; desc: string }
const CardList: React.FC<{ label: string; items: CardRow[]; onChange: (i: CardRow[]) => void }> = ({ label, items, onChange }) => (
  <div>
    <label className={labelCls}>{label}</label>
    <div className="space-y-3">
      {items.map((item, i) => (
        <div key={i} className="bg-slate-50 border border-slate-200 rounded p-3 space-y-2">
          <div className="flex gap-2">
            <input value={item.title} onChange={e => { const n = [...items]; n[i] = { ...n[i], title: e.target.value }; onChange(n) }} className={inputCls} placeholder="Title" />
            <button onClick={() => onChange(items.filter((_, j) => j !== i))} className="text-red-400 hover:text-red-600 shrink-0"><Trash2 size={14} /></button>
          </div>
          <textarea value={item.desc} onChange={e => { const n = [...items]; n[i] = { ...n[i], desc: e.target.value }; onChange(n) }} className={areaCls} placeholder="Description" rows={2} />
        </div>
      ))}
      <button onClick={() => onChange([...items, { title: '', desc: '' }])} className="text-xs font-bold text-primary hover:text-primary/80 flex items-center gap-1"><Plus size={13} />Add item</button>
    </div>
  </div>
)

// ── Stat card editor ──────────────────────────────────────────────────────────

interface StatRow { label: string; value: string }
const StatList: React.FC<{ items: StatRow[]; onChange: (i: StatRow[]) => void }> = ({ items, onChange }) => (
  <div>
    <label className={labelCls}>Statistics (value + label)</label>
    <div className="space-y-2">
      {items.map((s, i) => (
        <div key={i} className="flex gap-2">
          <input value={s.value} onChange={e => { const n = [...items]; n[i] = { ...n[i], value: e.target.value }; onChange(n) }} className={`${inputCls} w-36`} placeholder="₹18.5 LPA" />
          <input value={s.label} onChange={e => { const n = [...items]; n[i] = { ...n[i], label: e.target.value }; onChange(n) }} className={inputCls} placeholder="Label" />
          <button onClick={() => onChange(items.filter((_, j) => j !== i))} className="text-red-400 hover:text-red-600"><Trash2 size={14} /></button>
        </div>
      ))}
      <button onClick={() => onChange([...items, { label: '', value: '' }])} className="text-xs font-bold text-primary hover:text-primary/80 flex items-center gap-1"><Plus size={13} />Add stat</button>
    </div>
  </div>
)

// ── PDF doc editor (title + size + url) ──────────────────────────────────────

interface DocRow { title: string; size?: string; url: string }
const DocList: React.FC<{ label: string; items: DocRow[]; onChange: (i: DocRow[]) => void }> = ({ label, items, onChange }) => (
  <div>
    <label className={labelCls}>{label}</label>
    <div className="space-y-3">
      {items.map((d, i) => (
        <div key={i} className="bg-slate-50 border border-slate-200 rounded p-3 space-y-2">
          <div className="flex gap-2">
            <input value={d.title} onChange={e => { const n = [...items]; n[i] = { ...n[i], title: e.target.value }; onChange(n) }} className={inputCls} placeholder="Document title" />
            <button onClick={() => onChange(items.filter((_, j) => j !== i))} className="text-red-400 hover:text-red-600 shrink-0"><Trash2 size={14} /></button>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <input value={d.url} onChange={e => { const n = [...items]; n[i] = { ...n[i], url: e.target.value }; onChange(n) }} className={inputCls} placeholder="PDF URL (https://...)" />
            <input value={d.size || ''} onChange={e => { const n = [...items]; n[i] = { ...n[i], size: e.target.value }; onChange(n) }} className={inputCls} placeholder="File size (e.g. 2.4 MB)" />
          </div>
        </div>
      ))}
      <button onClick={() => onChange([...items, { title: '', url: '' }])} className="text-xs font-bold text-primary hover:text-primary/80 flex items-center gap-1"><Plus size={13} />Add document</button>
    </div>
  </div>
)

// ── Gallery image editor ──────────────────────────────────────────────────────

interface ImgRow { url: string; caption?: string }
const ImgList: React.FC<{ items: ImgRow[]; onChange: (i: ImgRow[]) => void }> = ({ items, onChange }) => (
  <div>
    <label className={labelCls}>Gallery Images</label>
    <div className="space-y-3">
      {items.map((img, i) => (
        <div key={i} className="bg-slate-50 border border-slate-200 rounded p-3 space-y-2">
          <div className="flex gap-2">
            <input value={img.url} onChange={e => { const n = [...items]; n[i] = { ...n[i], url: e.target.value }; onChange(n) }} className={inputCls} placeholder="Image URL (https://...)" />
            <button onClick={() => onChange(items.filter((_, j) => j !== i))} className="text-red-400 hover:text-red-600 shrink-0"><Trash2 size={14} /></button>
          </div>
          <input value={img.caption || ''} onChange={e => { const n = [...items]; n[i] = { ...n[i], caption: e.target.value }; onChange(n) }} className={inputCls} placeholder="Caption (optional)" />
          {img.url && <img src={img.url} alt="Preview" className="h-24 rounded border border-slate-200 object-cover" onError={e => { (e.target as HTMLImageElement).style.display = 'none' }} />}
        </div>
      ))}
      <button onClick={() => onChange([...items, { url: '' }])} className="text-xs font-bold text-primary hover:text-primary/80 flex items-center gap-1"><Plus size={13} />Add image</button>
    </div>
  </div>
)

// ── Section editors ───────────────────────────────────────────────────────────

const AboutEditor: React.FC<{ slug: string; dept: DepartmentSummary }> = ({ slug, dept }) => {
  const [data, update, save, saving, saved] = useSection<any>(slug, 'about')
  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold text-primary uppercase tracking-wider">About the Department</h3>
        <SaveBtn saving={saving} saved={saved} onClick={save} />
      </div>
      <p className="text-xs text-slate-500">These paragraphs appear in the "About" tab on the public department page.</p>
      <StrList
        label="About paragraphs (one per item)"
        items={data.paragraphs ?? []}
        onChange={paragraphs => update(p => ({ ...p, paragraphs }))}
        placeholder="Write one paragraph about the department..."
      />
      <StrList
        label="Infrastructure highlights"
        items={data.highlights ?? []}
        onChange={highlights => update(p => ({ ...p, highlights }))}
        placeholder="• Dedicated Computer Center"
      />
      <StrList
        label="Programs & Intake"
        items={data.programs ?? []}
        onChange={programs => update(p => ({ ...p, programs }))}
        placeholder="B.Tech (4-Year) — 120 Intake"
      />
      <div className="bg-slate-50 border border-slate-200 rounded p-3 text-xs text-slate-500 space-y-1">
        <p className="font-bold text-slate-700">Vision & Mission are edited from Dept Details below ↓</p>
        <p>Current Vision: {dept.vision || <em className="text-slate-400">Not set</em>}</p>
        <p>Current Mission: {dept.mission || <em className="text-slate-400">Not set</em>}</p>
      </div>
    </div>
  )
}

const ObeEditor: React.FC<{ slug: string; dept: DepartmentSummary }> = ({ slug, dept }) => {
  const [data, update, save, saving, saved] = useSection<any>(slug, 'obe')
  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold text-primary uppercase tracking-wider">OBE & PEOs</h3>
        <SaveBtn saving={saving} saved={saved} onClick={save} />
      </div>
      <div>
        <label className={labelCls}>OBE Description</label>
        <textarea value={data.description ?? ''} onChange={e => update(p => ({ ...p, description: e.target.value }))} className={areaCls} placeholder="Describe the department's OBE implementation and NBA compliance..." rows={3} />
      </div>
      <div>
        <label className={labelCls}>Department Vision (overrides main field)</label>
        <textarea value={data.vision ?? dept.vision ?? ''} onChange={e => update(p => ({ ...p, vision: e.target.value }))} className={areaCls} rows={2} />
      </div>
      <div>
        <label className={labelCls}>Department Mission (overrides main field)</label>
        <textarea value={data.mission ?? dept.mission ?? ''} onChange={e => update(p => ({ ...p, mission: e.target.value }))} className={areaCls} rows={2} />
      </div>
      <StrList label="Program Educational Objectives (PEOs)" items={data.peos ?? []} onChange={peos => update(p => ({ ...p, peos }))} placeholder="To produce graduates who excel in engineering careers..." />
      <StrList label="Program Outcomes (POs)" items={data.pos ?? []} onChange={pos => update(p => ({ ...p, pos }))} placeholder="Engineering Knowledge: Apply mathematics, science..." />
    </div>
  )
}

const CurriculumEditor: React.FC<{ slug: string }> = ({ slug }) => {
  const [data, update, save, saving, saved] = useSection<any>(slug, 'curriculum')
  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold text-primary uppercase tracking-wider">Curriculum & Schemes</h3>
        <SaveBtn saving={saving} saved={saved} onClick={save} />
      </div>
      <div>
        <label className={labelCls}>Intro text</label>
        <textarea value={data.intro ?? ''} onChange={e => update(p => ({ ...p, intro: e.target.value }))} className={areaCls} rows={2} placeholder="Download the official PDF schemes..." />
      </div>
      <DocList label="Curriculum Documents (PDF links)" items={data.docs ?? []} onChange={docs => update(p => ({ ...p, docs }))} />
    </div>
  )
}

const ResearchEditor: React.FC<{ slug: string }> = ({ slug }) => {
  const [data, update, save, saving, saved] = useSection<any>(slug, 'research')
  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold text-primary uppercase tracking-wider">Research & Labs</h3>
        <SaveBtn saving={saving} saved={saved} onClick={save} />
      </div>
      <div>
        <label className={labelCls}>Intro paragraph</label>
        <textarea value={data.intro ?? ''} onChange={e => update(p => ({ ...p, intro: e.target.value }))} className={areaCls} rows={2} />
      </div>
      <CardList label="Research Grants / Funded Projects" items={data.grants ?? []} onChange={grants => update(p => ({ ...p, grants }))} />
      <CardList label="Research Labs" items={data.labs ?? []} onChange={labs => update(p => ({ ...p, labs }))} />
    </div>
  )
}

const TimetablesEditor: React.FC<{ slug: string }> = ({ slug }) => {
  const [data, update, save, saving, saved] = useSection<any>(slug, 'timetables')
  interface SchRow { sem: string; slot: string; url: string }
  const schedules: SchRow[] = data.schedules ?? []
  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold text-primary uppercase tracking-wider">Timetables</h3>
        <SaveBtn saving={saving} saved={saved} onClick={save} />
      </div>
      <div>
        <label className={labelCls}>Intro text</label>
        <textarea value={data.intro ?? ''} onChange={e => update(p => ({ ...p, intro: e.target.value }))} className={areaCls} rows={2} />
      </div>
      <div>
        <label className={labelCls}>Timetable PDFs</label>
        <div className="space-y-3">
          {schedules.map((s, i) => (
            <div key={i} className="bg-slate-50 border border-slate-200 rounded p-3 space-y-2">
              <div className="flex gap-2">
                <input value={s.sem} onChange={e => { const n = [...schedules]; n[i] = { ...n[i], sem: e.target.value }; update(p => ({ ...p, schedules: n })) }} className={inputCls} placeholder="e.g. B.Tech V Semester" />
                <button onClick={() => update(p => ({ ...p, schedules: schedules.filter((_, j) => j !== i) }))} className="text-red-400 hover:text-red-600 shrink-0"><Trash2 size={14} /></button>
              </div>
              <input value={s.slot} onChange={e => { const n = [...schedules]; n[i] = { ...n[i], slot: e.target.value }; update(p => ({ ...p, schedules: n })) }} className={inputCls} placeholder="Class Lectures & Labs" />
              <input value={s.url} onChange={e => { const n = [...schedules]; n[i] = { ...n[i], url: e.target.value }; update(p => ({ ...p, schedules: n })) }} className={inputCls} placeholder="PDF URL" />
            </div>
          ))}
          <button onClick={() => update(p => ({ ...p, schedules: [...schedules, { sem: '', slot: '', url: '' }] }))} className="text-xs font-bold text-primary hover:text-primary/80 flex items-center gap-1"><Plus size={13} />Add timetable</button>
        </div>
      </div>
    </div>
  )
}

const AchievementsEditor: React.FC<{ slug: string }> = ({ slug }) => {
  const [data, update, save, saving, saved] = useSection<any>(slug, 'achievements')
  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold text-primary uppercase tracking-wider">Achievements & Placements</h3>
        <SaveBtn saving={saving} saved={saved} onClick={save} />
      </div>
      <div>
        <label className={labelCls}>Intro paragraph</label>
        <textarea value={data.intro ?? ''} onChange={e => update(p => ({ ...p, intro: e.target.value }))} className={areaCls} rows={2} />
      </div>
      <StatList items={data.stats ?? []} onChange={stats => update(p => ({ ...p, stats }))} />
      <StrList label="Notable Highlights" items={data.highlights ?? []} onChange={highlights => update(p => ({ ...p, highlights }))} placeholder="GATE 2024 — AIR 45 (CSE)" />
    </div>
  )
}

const InfraEditor: React.FC<{ slug: string }> = ({ slug }) => {
  const [data, update, save, saving, saved] = useSection<any>(slug, 'infrastructure')
  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold text-primary uppercase tracking-wider">Labs & Infrastructure</h3>
        <SaveBtn saving={saving} saved={saved} onClick={save} />
      </div>
      <div>
        <label className={labelCls}>Intro paragraph</label>
        <textarea value={data.intro ?? ''} onChange={e => update(p => ({ ...p, intro: e.target.value }))} className={areaCls} rows={2} />
      </div>
      <CardList label="Labs" items={data.labs ?? []} onChange={labs => update(p => ({ ...p, labs }))} />
    </div>
  )
}

const GalleryEditor: React.FC<{ slug: string }> = ({ slug }) => {
  const [data, update, save, saving, saved] = useSection<any>(slug, 'gallery')
  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold text-primary uppercase tracking-wider">Photo Gallery</h3>
        <SaveBtn saving={saving} saved={saved} onClick={save} />
      </div>
      <div>
        <label className={labelCls}>Gallery description</label>
        <textarea value={data.intro ?? ''} onChange={e => update(p => ({ ...p, intro: e.target.value }))} className={areaCls} rows={2} />
      </div>
      <ImgList items={data.images ?? []} onChange={images => update(p => ({ ...p, images }))} />
    </div>
  )
}

// ── Dept details editor (vision / mission / basic info) ───────────────────────

const DeptDetailsEditor: React.FC<{ dept: DepartmentSummary; onSaved: () => void }> = ({ dept, onSaved }) => {
  const [draft, setDraft] = useState({ vision: dept.vision ?? '', mission: dept.mission ?? '', description: dept.description ?? '', contact_email: dept.hodEmail ?? '', contact_phone: dept.hodPhone ?? '' })
  const [saving, setSaving] = useState(false)
  const [saved,  setSaved]  = useState(false)

  const save = async () => {
    setSaving(true)
    try {
      await departmentService.saveDepartmentBySlug(dept.slug, { ...dept, vision: draft.vision, mission: draft.mission, description: draft.description, hodEmail: draft.contact_email, hodPhone: draft.contact_phone } as any)
      setSaved(true); onSaved(); setTimeout(() => setSaved(false), 2500)
    } catch { /* noop */ } finally { setSaving(false) }
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold text-primary uppercase tracking-wider">Department Details</h3>
        <SaveBtn saving={saving} saved={saved} onClick={save} />
      </div>
      <div><label className={labelCls}>Department Description (hero)</label><textarea value={draft.description} onChange={e => setDraft(p => ({ ...p, description: e.target.value }))} className={areaCls} rows={3} /></div>
      <div><label className={labelCls}>Vision</label><textarea value={draft.vision} onChange={e => setDraft(p => ({ ...p, vision: e.target.value }))} className={areaCls} rows={3} /></div>
      <div><label className={labelCls}>Mission</label><textarea value={draft.mission} onChange={e => setDraft(p => ({ ...p, mission: e.target.value }))} className={areaCls} rows={3} /></div>
      <div className="grid grid-cols-2 gap-3">
        <div><label className={labelCls}>Contact Email</label><input value={draft.contact_email} onChange={e => setDraft(p => ({ ...p, contact_email: e.target.value }))} className={inputCls} /></div>
        <div><label className={labelCls}>Contact Phone</label><input value={draft.contact_phone ?? ''} onChange={e => setDraft(p => ({ ...p, contact_phone: e.target.value }))} className={inputCls} /></div>
      </div>
    </div>
  )
}

// ── Tabs ──────────────────────────────────────────────────────────────────────

const TABS = [
  { id: 'details',         label: 'Dept Details',    icon: Edit3 },
  { id: 'about',           label: 'About',            icon: Info },
  { id: 'obe',             label: 'OBE & PEOs',       icon: Sparkles },
  { id: 'curriculum',      label: 'Curriculum',       icon: FileText },
  { id: 'research',        label: 'Research & Labs',  icon: BookOpen },
  { id: 'timetables',      label: 'Timetables',       icon: Calendar },
  { id: 'achievements',    label: 'Achievements',     icon: Award },
  { id: 'infrastructure',  label: 'Infrastructure',   icon: Building },
  { id: 'gallery',         label: 'Gallery',          icon: ImageIcon },
]

// ── Main component ────────────────────────────────────────────────────────────

const HodDepartmentProfile: React.FC = () => {
  const user = useAdminStore(s => s.user)
  const [dept, setDept]     = useState<DepartmentSummary | null>(null)
  const [loading, setLoading] = useState(true)
  const [tab, setTab]       = useState('details')

  const loadDept = useCallback(async () => {
    if (!user?.department_id) return
    setLoading(true)
    try {
      const all = await departmentService.getDepartments()
      // Match by department_id from JWT
      const matched = all.find(d => {
        // getDepartments doesn't return numeric IDs in DepartmentSummary,
        // but slug-based matching via the HOD user link is the fallback
        return d.hodEmail === user.email || d.slug === user.department_id?.toString()
      }) || all[0] || null
      if (matched) setDept({ ...matched, hodName: user.name || matched.hodName, hodEmail: user.email || matched.hodEmail })
    } catch { /* noop */ } finally { setLoading(false) }
  }, [user])

  useEffect(() => { loadDept() }, [loadDept])

  if (loading) return (
    <div className="flex items-center justify-center py-24 text-slate-400">
      <Loader2 size={24} className="animate-spin mr-2" /><span className="text-sm">Loading department…</span>
    </div>
  )

  if (!dept) return (
    <PortalCard>
      <p className="text-sm text-center text-slate-500 py-8">Department not found. Ensure your account has a department assigned.</p>
    </PortalCard>
  )

  return (
    <div className="space-y-6">
      <PageHeader
        title="Department CMS"
        subtitle={`Editing content for the Department of ${dept.name}`}
      />

      {/* Tab bar */}
      <div className="flex flex-wrap gap-1 border-b border-slate-200 pb-1">
        {TABS.map(t => {
          const Icon = t.icon
          return (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-t transition-colors ${
                tab === t.id ? 'bg-primary text-white' : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <Icon size={12} /> {t.label}
            </button>
          )
        })}
      </div>

      {/* Tab content */}
      <PortalCard>
        {tab === 'details'        && <DeptDetailsEditor dept={dept} onSaved={loadDept} />}
        {tab === 'about'          && <AboutEditor   slug={dept.slug} dept={dept} />}
        {tab === 'obe'            && <ObeEditor     slug={dept.slug} dept={dept} />}
        {tab === 'curriculum'     && <CurriculumEditor  slug={dept.slug} />}
        {tab === 'research'       && <ResearchEditor    slug={dept.slug} />}
        {tab === 'timetables'     && <TimetablesEditor  slug={dept.slug} />}
        {tab === 'achievements'   && <AchievementsEditor slug={dept.slug} />}
        {tab === 'infrastructure' && <InfraEditor        slug={dept.slug} />}
        {tab === 'gallery'        && <GalleryEditor      slug={dept.slug} />}
      </PortalCard>
    </div>
  )
}

export default HodDepartmentProfile
