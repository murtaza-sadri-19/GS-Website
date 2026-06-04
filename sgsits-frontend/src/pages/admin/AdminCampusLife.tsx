/**
 * Admin Campus Life CMS — Activities, NCC, NSS, SSS, Scholarships
 * Route: /dashboard/central-admin/campus-life
 */

import React, { useState, useEffect, useCallback } from 'react'
import { Save, Loader2, CheckCircle2, Plus, Trash2, Users } from 'lucide-react'
import {
  getActivities, saveActivities,
  getNCC, saveNCC,
  getNSS, saveNSS,
  getSSS, saveSSS,
  getScholarshipGovt, saveScholarshipGovt,
  getScholarshipInstitute, saveScholarshipInstitute,
} from '../../services/studentsService'

// ── Shared primitives ────────────────────────────────────────────────────────

const inputCls = 'w-full border border-slate-200 rounded px-3 py-2 text-sm bg-white focus:outline-none focus:border-primary'
const labelCls = 'block text-xs font-bold text-slate-600 uppercase tracking-wide mb-1'
const areaCls  = `${inputCls} min-h-[80px] resize-y`

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

function useSection<T extends Record<string, any>>(
  getter: () => Promise<T>,
  saver: (d: T) => Promise<unknown>,
): [T, (updater: (prev: T) => T) => void, () => void, boolean, boolean] {
  const [data,   setData]   = useState<T>({} as T)
  const [saving, setSaving] = useState(false)
  const [saved,  setSaved]  = useState(false)

  useEffect(() => {
    getter().then(d => { if (d && Object.keys(d).length > 0) setData(d) }).catch(() => {})
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const update = useCallback((updater: (prev: T) => T) => setData(prev => updater(prev)), [])
  const save = useCallback(async () => {
    setSaving(true)
    try { await saver(data); setSaved(true); setTimeout(() => setSaved(false), 2500) }
    catch { /* noop */ } finally { setSaving(false) }
  }, [data, saver])

  return [data, update, save, saving, saved]
}

const StringListEditor: React.FC<{
  label: string
  items: string[]
  onChange: (items: string[]) => void
  placeholder?: string
}> = ({ label, items, onChange, placeholder = 'Enter item...' }) => (
  <div>
    <label className={labelCls}>{label}</label>
    <div className="space-y-2">
      {items.map((item, i) => (
        <div key={i} className="flex gap-2">
          <input value={item} onChange={e => { const n = [...items]; n[i] = e.target.value; onChange(n) }} className={inputCls} placeholder={placeholder} />
          <button onClick={() => onChange(items.filter((_, j) => j !== i))} className="text-red-400 hover:text-red-600 shrink-0"><Trash2 size={14} /></button>
        </div>
      ))}
      <button onClick={() => onChange([...items, ''])} className="inline-flex items-center gap-1 text-xs font-bold text-primary hover:text-primary/80">
        <Plus size={13} /> Add item
      </button>
    </div>
  </div>
)

// ── Stat editor (value + label pairs) ───────────────────────────────────────

interface StatRow { value: string; label: string }
const StatEditor: React.FC<{ stats: StatRow[]; onChange: (s: StatRow[]) => void }> = ({ stats, onChange }) => (
  <div>
    <label className={labelCls}>Stats (value + label)</label>
    <div className="space-y-2">
      {stats.map((s, i) => (
        <div key={i} className="flex gap-2">
          <input value={s.value} onChange={e => { const n = [...stats]; n[i] = { ...n[i], value: e.target.value }; onChange(n) }} className={`${inputCls} w-32`} placeholder="Value" />
          <input value={s.label} onChange={e => { const n = [...stats]; n[i] = { ...n[i], label: e.target.value }; onChange(n) }} className={inputCls} placeholder="Label" />
          <button onClick={() => onChange(stats.filter((_, j) => j !== i))} className="text-red-400 hover:text-red-600 shrink-0"><Trash2 size={14} /></button>
        </div>
      ))}
      <button onClick={() => onChange([...stats, { value: '', label: '' }])} className="inline-flex items-center gap-1 text-xs font-bold text-primary hover:text-primary/80">
        <Plus size={13} /> Add stat
      </button>
    </div>
  </div>
)

// ── Certificate editor for NCC ───────────────────────────────────────────────

interface CertRow { cert: string; desc: string }
const CertEditor: React.FC<{ certs: CertRow[]; onChange: (c: CertRow[]) => void }> = ({ certs, onChange }) => (
  <div>
    <label className={labelCls}>NCC Certificates</label>
    <div className="space-y-3">
      {certs.map((c, i) => (
        <div key={i} className="bg-slate-50 border border-slate-200 rounded p-3 space-y-2">
          <div className="flex gap-2">
            <input value={c.cert} onChange={e => { const n = [...certs]; n[i] = { ...n[i], cert: e.target.value }; onChange(n) }} className={`${inputCls} w-40`} placeholder="A Certificate" />
            <button onClick={() => onChange(certs.filter((_, j) => j !== i))} className="text-red-400 hover:text-red-600 shrink-0 ml-auto"><Trash2 size={14} /></button>
          </div>
          <textarea value={c.desc} onChange={e => { const n = [...certs]; n[i] = { ...n[i], desc: e.target.value }; onChange(n) }} className={areaCls} placeholder="Description of benefits..." rows={2} />
        </div>
      ))}
      <button onClick={() => onChange([...certs, { cert: '', desc: '' }])} className="inline-flex items-center gap-1 text-xs font-bold text-primary hover:text-primary/80">
        <Plus size={13} /> Add certificate
      </button>
    </div>
  </div>
)

// ── Scholarship editor ────────────────────────────────────────────────────────

interface ScholarshipRow { title: string; description: string; eligibility?: string; amount?: string; criteria?: string; portalUrl?: string }
const ScholarshipEditor: React.FC<{ items: ScholarshipRow[]; onChange: (s: ScholarshipRow[]) => void; showAmount?: boolean }> = ({ items, onChange, showAmount }) => (
  <div>
    <label className={labelCls}>Scholarship Schemes</label>
    <div className="space-y-4">
      {items.map((s, i) => (
        <div key={i} className="bg-slate-50 border border-slate-200 rounded p-4 space-y-2">
          <div className="flex gap-2 items-center">
            <input value={s.title} onChange={e => { const n = [...items]; n[i] = { ...n[i], title: e.target.value }; onChange(n) }} className={inputCls} placeholder="Scholarship name" />
            <button onClick={() => onChange(items.filter((_, j) => j !== i))} className="text-red-400 hover:text-red-600 shrink-0"><Trash2 size={14} /></button>
          </div>
          <textarea value={s.description} onChange={e => { const n = [...items]; n[i] = { ...n[i], description: e.target.value }; onChange(n) }} className={areaCls} placeholder="Description" rows={2} />
          <div className="grid grid-cols-2 gap-2">
            <input value={s.eligibility || s.criteria || ''} onChange={e => { const n = [...items]; n[i] = { ...n[i], eligibility: e.target.value, criteria: e.target.value }; onChange(n) }} className={inputCls} placeholder="Eligibility / Criteria" />
            {showAmount && <input value={s.amount || ''} onChange={e => { const n = [...items]; n[i] = { ...n[i], amount: e.target.value }; onChange(n) }} className={inputCls} placeholder="Amount" />}
            <input value={s.portalUrl || ''} onChange={e => { const n = [...items]; n[i] = { ...n[i], portalUrl: e.target.value }; onChange(n) }} className={inputCls} placeholder="Portal URL (optional)" />
          </div>
        </div>
      ))}
      <button onClick={() => onChange([...items, { title: '', description: '' }])} className="inline-flex items-center gap-1 text-xs font-bold text-primary hover:text-primary/80">
        <Plus size={13} /> Add scholarship
      </button>
    </div>
  </div>
)

// ── Section: Activities ──────────────────────────────────────────────────────

const ActivitiesSection: React.FC = () => {
  const [data, update, save, saving, saved] = useSection(getActivities, saveActivities)
  interface ActivityRow { title: string; description: string }
  const activities: ActivityRow[] = data.activities || []
  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold text-primary uppercase tracking-wider">Student Activities</h3>
        <SaveBtn saving={saving} saved={saved} onClick={save} />
      </div>
      <div><label className={labelCls}>Intro paragraph</label><textarea value={data.intro || ''} onChange={e => update(p => ({ ...p, intro: e.target.value }))} className={areaCls} /></div>
      <div>
        <label className={labelCls}>Activities</label>
        <div className="space-y-3">
          {activities.map((a, i) => (
            <div key={i} className="bg-slate-50 border border-slate-200 rounded p-3 space-y-2">
              <div className="flex gap-2">
                <input value={a.title} onChange={e => { const n = [...activities]; n[i] = { ...n[i], title: e.target.value }; update(p => ({ ...p, activities: n })) }} className={inputCls} placeholder="Activity title" />
                <button onClick={() => update(p => ({ ...p, activities: activities.filter((_, j) => j !== i) }))} className="text-red-400 hover:text-red-600 shrink-0"><Trash2 size={14} /></button>
              </div>
              <textarea value={a.description} onChange={e => { const n = [...activities]; n[i] = { ...n[i], description: e.target.value }; update(p => ({ ...p, activities: n })) }} className={areaCls} placeholder="Description" rows={2} />
            </div>
          ))}
          <button onClick={() => update(p => ({ ...p, activities: [...activities, { title: '', description: '' }] }))} className="inline-flex items-center gap-1 text-xs font-bold text-primary hover:text-primary/80">
            <Plus size={13} /> Add activity
          </button>
        </div>
      </div>
    </div>
  )
}

// ── Section: NCC ──────────────────────────────────────────────────────────────

const NCCSection: React.FC = () => {
  const [data, update, save, saving, saved] = useSection(getNCC, saveNCC)
  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold text-primary uppercase tracking-wider">NCC Wing</h3>
        <SaveBtn saving={saving} saved={saved} onClick={save} />
      </div>
      <div><label className={labelCls}>Unit Details (shown as subtitle)</label><input value={data.unitDetails || ''} onChange={e => update(p => ({ ...p, unitDetails: e.target.value }))} className={inputCls} /></div>
      <div><label className={labelCls}>About paragraph</label><textarea value={data.about || ''} onChange={e => update(p => ({ ...p, about: e.target.value }))} className={areaCls} /></div>
      <StatEditor stats={data.stats || []} onChange={stats => update(p => ({ ...p, stats }))} />
      <StringListEditor label="NCC Activities" items={data.activities || []} onChange={items => update(p => ({ ...p, activities: items }))} />
      <CertEditor certs={data.certificates || []} onChange={certs => update(p => ({ ...p, certificates: certs }))} />
      <StringListEditor label="NCC Achievements" items={data.achievements || []} onChange={items => update(p => ({ ...p, achievements: items }))} />
      <StringListEditor label="Enrollment Rules (How to Enroll)" items={data.enrollmentRules || []} onChange={items => update(p => ({ ...p, enrollmentRules: items }))} placeholder="Open to 1st and 2nd year UG students" />
      <div className="grid grid-cols-2 gap-3">
        <div><label className={labelCls}>Officer Contact Phone</label><input value={data.officerContact || ''} onChange={e => update(p => ({ ...p, officerContact: e.target.value }))} className={inputCls} /></div>
        <div><label className={labelCls}>Officer Email</label><input value={data.officerEmail || ''} onChange={e => update(p => ({ ...p, officerEmail: e.target.value }))} className={inputCls} /></div>
      </div>
    </div>
  )
}

// ── Section: NSS ──────────────────────────────────────────────────────────────

const NSSSection: React.FC = () => {
  const [data, update, save, saving, saved] = useSection(getNSS, saveNSS)
  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold text-primary uppercase tracking-wider">NSS Wing</h3>
        <SaveBtn saving={saving} saved={saved} onClick={save} />
      </div>
      <div><label className={labelCls}>Unit Details (shown as subtitle)</label><input value={data.unitDetails || ''} onChange={e => update(p => ({ ...p, unitDetails: e.target.value }))} className={inputCls} /></div>
      <div><label className={labelCls}>About paragraph</label><textarea value={data.about || ''} onChange={e => update(p => ({ ...p, about: e.target.value }))} className={areaCls} /></div>
      <StatEditor stats={data.stats || []} onChange={stats => update(p => ({ ...p, stats }))} />
      <StringListEditor label="NSS Activities" items={data.activities || []} onChange={items => update(p => ({ ...p, activities: items }))} />
      <StringListEditor label="NSS Achievements" items={data.achievements || []} onChange={items => update(p => ({ ...p, achievements: items }))} />
      <StringListEditor label="NSS Benefits" items={data.benefits || []} onChange={items => update(p => ({ ...p, benefits: items }))} placeholder="NSS Certificate after 2 years of active service" />
      <StringListEditor label="How to Join Steps" items={data.joinSteps || []} onChange={items => update(p => ({ ...p, joinSteps: items }))} placeholder="Open to all UG/PG students" />
      <div className="grid grid-cols-2 gap-3">
        <div><label className={labelCls}>Program Officer Name</label><input value={data.programOfficerName || ''} onChange={e => update(p => ({ ...p, programOfficerName: e.target.value }))} className={inputCls} /></div>
        <div><label className={labelCls}>Program Officer Phone</label><input value={data.programOfficerContact || ''} onChange={e => update(p => ({ ...p, programOfficerContact: e.target.value }))} className={inputCls} /></div>
      </div>
      <div><label className={labelCls}>Program Officer Email</label><input value={data.programOfficerEmail || ''} onChange={e => update(p => ({ ...p, programOfficerEmail: e.target.value }))} className={inputCls} /></div>
    </div>
  )
}

// ── Section: SSS ──────────────────────────────────────────────────────────────

const SSSSection: React.FC = () => {
  const [data, update, save, saving, saved] = useSection(getSSS, saveSSS)
  interface SvcRow { title: string; description: string }
  const services: SvcRow[] = data.services || []
  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold text-primary uppercase tracking-wider">Students' Support Services (SSS)</h3>
        <SaveBtn saving={saving} saved={saved} onClick={save} />
      </div>
      <div><label className={labelCls}>About paragraph</label><textarea value={data.about || ''} onChange={e => update(p => ({ ...p, about: e.target.value }))} className={areaCls} /></div>
      <div>
        <label className={labelCls}>Support Services</label>
        <div className="space-y-3">
          {services.map((s, i) => (
            <div key={i} className="bg-slate-50 border border-slate-200 rounded p-3 space-y-2">
              <div className="flex gap-2">
                <input value={s.title} onChange={e => { const n = [...services]; n[i] = { ...n[i], title: e.target.value }; update(p => ({ ...p, services: n })) }} className={inputCls} placeholder="Service title" />
                <button onClick={() => update(p => ({ ...p, services: services.filter((_, j) => j !== i) }))} className="text-red-400 hover:text-red-600 shrink-0"><Trash2 size={14} /></button>
              </div>
              <textarea value={s.description} onChange={e => { const n = [...services]; n[i] = { ...n[i], description: e.target.value }; update(p => ({ ...p, services: n })) }} className={areaCls} placeholder="Description" rows={2} />
            </div>
          ))}
          <button onClick={() => update(p => ({ ...p, services: [...services, { title: '', description: '' }] }))} className="inline-flex items-center gap-1 text-xs font-bold text-primary hover:text-primary/80">
            <Plus size={13} /> Add service
          </button>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div><label className={labelCls}>Contact Phone</label><input value={data.contactPhone || ''} onChange={e => update(p => ({ ...p, contactPhone: e.target.value }))} className={inputCls} /></div>
        <div><label className={labelCls}>Contact Email</label><input value={data.contactEmail || ''} onChange={e => update(p => ({ ...p, contactEmail: e.target.value }))} className={inputCls} /></div>
      </div>
    </div>
  )
}

// ── Section: Govt Scholarships ────────────────────────────────────────────────

const ScholarshipGovtSection: React.FC = () => {
  const [data, update, save, saving, saved] = useSection(getScholarshipGovt, saveScholarshipGovt)
  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold text-primary uppercase tracking-wider">Government Scholarships</h3>
        <SaveBtn saving={saving} saved={saved} onClick={save} />
      </div>
      <div><label className={labelCls}>Intro paragraph</label><textarea value={data.intro || ''} onChange={e => update(p => ({ ...p, intro: e.target.value }))} className={areaCls} /></div>
      <ScholarshipEditor items={data.scholarships || []} onChange={items => update(p => ({ ...p, scholarships: items }))} />
      <div className="grid grid-cols-2 gap-3">
        <div><label className={labelCls}>Contact Phone</label><input value={data.contactPhone || ''} onChange={e => update(p => ({ ...p, contactPhone: e.target.value }))} className={inputCls} /></div>
        <div><label className={labelCls}>Contact Email</label><input value={data.contactEmail || ''} onChange={e => update(p => ({ ...p, contactEmail: e.target.value }))} className={inputCls} /></div>
      </div>
    </div>
  )
}

// ── Section: Institute Scholarships ──────────────────────────────────────────

const ScholarshipInstSection: React.FC = () => {
  const [data, update, save, saving, saved] = useSection(getScholarshipInstitute, saveScholarshipInstitute)
  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold text-primary uppercase tracking-wider">Institute Scholarships</h3>
        <SaveBtn saving={saving} saved={saved} onClick={save} />
      </div>
      <div><label className={labelCls}>Intro paragraph</label><textarea value={data.intro || ''} onChange={e => update(p => ({ ...p, intro: e.target.value }))} className={areaCls} /></div>
      <ScholarshipEditor items={data.scholarships || []} onChange={items => update(p => ({ ...p, scholarships: items }))} showAmount />
    </div>
  )
}

// ── Tabs ──────────────────────────────────────────────────────────────────────

const TABS = [
  { id: 'activities',    label: 'Activities' },
  { id: 'ncc',           label: 'NCC' },
  { id: 'nss',           label: 'NSS' },
  { id: 'sss',           label: 'SSS' },
  { id: 'scholarship-g', label: 'Govt Scholarships' },
  { id: 'scholarship-i', label: 'Institute Scholarships' },
]

const AdminCampusLife: React.FC = () => {
  const [tab, setTab] = useState('activities')

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Users className="text-primary w-5 h-5" />
        <div>
          <h1 className="text-lg font-bold text-primary font-display">Campus Life CMS</h1>
          <p className="text-xs text-slate-500">Manage NCC, NSS, SSS, activities, and scholarships</p>
        </div>
      </div>

      {/* Tab bar */}
      <div className="flex flex-wrap gap-1 border-b border-slate-200 pb-1">
        {TABS.map(t => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`px-3 py-1.5 text-xs font-semibold rounded-t transition-colors ${
              tab === t.id ? 'bg-primary text-white' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Tab panels */}
      <div className="bg-white border border-slate-200 rounded-lg p-6">
        {tab === 'activities'    && <ActivitiesSection />}
        {tab === 'ncc'           && <NCCSection />}
        {tab === 'nss'           && <NSSSection />}
        {tab === 'sss'           && <SSSSection />}
        {tab === 'scholarship-g' && <ScholarshipGovtSection />}
        {tab === 'scholarship-i' && <ScholarshipInstSection />}
      </div>
    </div>
  )
}

export default AdminCampusLife
