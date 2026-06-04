/**
 * Admin Facilities CMS — 12 facility sections
 * Route: /dashboard/central-admin/facilities
 */

import React, { useState, useEffect, useCallback } from 'react'
import { Save, Loader2, CheckCircle2, Plus, Trash2, Building } from 'lucide-react'
import {
  getLibrary, saveLibrary,
  getComputerCenter, saveComputerCenter,
  getWorkshop, saveWorkshop,
  getGymnasium, saveGymnasium,
  getDispensary, saveDispensary,
  getCIDI, saveCIDI,
  getIDEALab, saveIDEALab,
  getGamesSports, saveGamesSports,
  getBoysHostel, saveBoysHostel,
  getGirlsHostel, saveGirlsHostel,
  getTransitHostel, saveTransitHostel,
  getStaffQuarters, saveStaffQuarters,
} from '../../services/facilitiesService'

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
    try {
      await saver(data)
      setSaved(true)
      setTimeout(() => setSaved(false), 2500)
    } catch { /* noop */ } finally { setSaving(false) }
  }, [data, saver])

  return [data, update, save, saving, saved]
}

// ── String list editor ───────────────────────────────────────────────────────

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
          <input
            value={item}
            onChange={e => { const n = [...items]; n[i] = e.target.value; onChange(n) }}
            className={inputCls}
            placeholder={placeholder}
          />
          <button onClick={() => onChange(items.filter((_, j) => j !== i))} className="text-red-400 hover:text-red-600 shrink-0">
            <Trash2 size={14} />
          </button>
        </div>
      ))}
      <button
        onClick={() => onChange([...items, ''])}
        className="inline-flex items-center gap-1 text-xs font-bold text-primary hover:text-primary/80"
      >
        <Plus size={13} /> Add item
      </button>
    </div>
  </div>
)

// ── Fee structure editor (label + value rows) ────────────────────────────────

interface FeeRow { label: string; value: string; note?: boolean }
const FeeEditor: React.FC<{
  rows: FeeRow[]
  onChange: (rows: FeeRow[]) => void
}> = ({ rows, onChange }) => (
  <div>
    <label className={labelCls}>Fee Structure</label>
    <div className="space-y-2">
      {rows.map((row, i) => (
        <div key={i} className="flex gap-2 items-center">
          <input
            value={row.label}
            onChange={e => { const n = [...rows]; n[i] = { ...n[i], label: e.target.value }; onChange(n) }}
            className={inputCls}
            placeholder={row.note ? 'Note text...' : 'Label (e.g. Hostel Rent)'}
          />
          {!row.note && (
            <input
              value={row.value}
              onChange={e => { const n = [...rows]; n[i] = { ...n[i], value: e.target.value }; onChange(n) }}
              className={`${inputCls} w-48`}
              placeholder="Value (e.g. ₹15,000)"
            />
          )}
          <button onClick={() => onChange(rows.filter((_, j) => j !== i))} className="text-red-400 hover:text-red-600 shrink-0">
            <Trash2 size={14} />
          </button>
        </div>
      ))}
      <div className="flex gap-2">
        <button onClick={() => onChange([...rows, { label: '', value: '' }])} className="inline-flex items-center gap-1 text-xs font-bold text-primary hover:text-primary/80">
          <Plus size={13} /> Add row
        </button>
        <button onClick={() => onChange([...rows, { label: '', value: '', note: true }])} className="inline-flex items-center gap-1 text-xs font-bold text-slate-500 hover:text-slate-700">
          <Plus size={13} /> Add note
        </button>
      </div>
    </div>
  </div>
)

// ── Key-spec row editor ──────────────────────────────────────────────────────

interface SpecRow { iconName?: string; title: string; desc: string }
const SpecEditor: React.FC<{ specs: SpecRow[]; onChange: (s: SpecRow[]) => void }> = ({ specs, onChange }) => (
  <div>
    <label className={labelCls}>Key Specs (cards)</label>
    <div className="space-y-3">
      {specs.map((s, i) => (
        <div key={i} className="bg-slate-50 rounded border border-slate-200 p-3 space-y-2">
          <div className="flex gap-2">
            <input value={s.iconName || ''} onChange={e => { const n = [...specs]; n[i] = { ...n[i], iconName: e.target.value }; onChange(n) }} className={`${inputCls} w-32`} placeholder="Icon (e.g. Wifi)" />
            <input value={s.title} onChange={e => { const n = [...specs]; n[i] = { ...n[i], title: e.target.value }; onChange(n) }} className={inputCls} placeholder="Title" />
            <button onClick={() => onChange(specs.filter((_, j) => j !== i))} className="text-red-400 hover:text-red-600 shrink-0"><Trash2 size={14} /></button>
          </div>
          <textarea value={s.desc} onChange={e => { const n = [...specs]; n[i] = { ...n[i], desc: e.target.value }; onChange(n) }} className={areaCls} placeholder="Description" rows={2} />
        </div>
      ))}
      <button onClick={() => onChange([...specs, { title: '', desc: '' }])} className="inline-flex items-center gap-1 text-xs font-bold text-primary hover:text-primary/80">
        <Plus size={13} /> Add spec
      </button>
    </div>
  </div>
)

// ── Quarter types editor ─────────────────────────────────────────────────────

interface QuarterRow { type: string; for: string; units: number; desc: string }
const QuarterEditor: React.FC<{ rows: QuarterRow[]; onChange: (r: QuarterRow[]) => void }> = ({ rows, onChange }) => (
  <div>
    <label className={labelCls}>Quarter Types</label>
    <div className="space-y-3">
      {rows.map((r, i) => (
        <div key={i} className="bg-slate-50 border border-slate-200 rounded p-3 space-y-2">
          <div className="flex gap-2 items-center">
            <input value={r.type} onChange={e => { const n = [...rows]; n[i] = { ...n[i], type: e.target.value }; onChange(n) }} className={`${inputCls} w-24`} placeholder="Type D" />
            <input value={r.for} onChange={e => { const n = [...rows]; n[i] = { ...n[i], for: e.target.value }; onChange(n) }} className={inputCls} placeholder="Eligible For" />
            <input type="number" value={r.units} onChange={e => { const n = [...rows]; n[i] = { ...n[i], units: Number(e.target.value) }; onChange(n) }} className={`${inputCls} w-20`} placeholder="Units" />
            <button onClick={() => onChange(rows.filter((_, j) => j !== i))} className="text-red-400 hover:text-red-600 shrink-0"><Trash2 size={14} /></button>
          </div>
          <input value={r.desc} onChange={e => { const n = [...rows]; n[i] = { ...n[i], desc: e.target.value }; onChange(n) }} className={inputCls} placeholder="Description" />
        </div>
      ))}
      <button onClick={() => onChange([...rows, { type: '', for: '', units: 0, desc: '' }])} className="inline-flex items-center gap-1 text-xs font-bold text-primary hover:text-primary/80">
        <Plus size={13} /> Add type
      </button>
    </div>
  </div>
)

// ── Section: Library ─────────────────────────────────────────────────────────

const LibrarySection: React.FC = () => {
  const [data, update, save, saving, saved] = useSection(getLibrary, saveLibrary)
  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold text-primary uppercase tracking-wider">Central Library</h3>
        <SaveBtn saving={saving} saved={saved} onClick={save} />
      </div>
      <div><label className={labelCls}>Introduction paragraph</label><textarea value={data.intro || ''} onChange={e => update(p => ({ ...p, intro: e.target.value }))} className={areaCls} /></div>
      <StringListEditor label="Collections (value + label)" items={data.collections?.map((c: any) => `${c.label}:${c.value}`) || []} onChange={items => update(p => ({ ...p, collections: items.map(s => { const [label, value] = s.split(':'); return { label: label || s, value: value || '' } }) }))} placeholder="Label:Value" />
      <div><label className={labelCls}>Opening Hours</label><input value={data.openingHours || ''} onChange={e => update(p => ({ ...p, openingHours: e.target.value }))} className={inputCls} /></div>
      <FeeEditor rows={data.feeStructure || []} onChange={rows => update(p => ({ ...p, feeStructure: rows }))} />
      <StringListEditor label="Reading Hall Features" items={data.readingHallFeatures || []} onChange={items => update(p => ({ ...p, readingHallFeatures: items }))} />
      <div><label className={labelCls}>Fine Policy</label><input value={data.finePolicy || ''} onChange={e => update(p => ({ ...p, finePolicy: e.target.value }))} className={inputCls} placeholder="Fine for overdue books: ₹X per book per day" /></div>
      <div><label className={labelCls}>OPAC URL</label><input value={data.opacUrl || ''} onChange={e => update(p => ({ ...p, opacUrl: e.target.value }))} className={inputCls} placeholder="https://..." /></div>
      <div className="grid grid-cols-2 gap-3">
        <div><label className={labelCls}>Phone</label><input value={data.phone || ''} onChange={e => update(p => ({ ...p, phone: e.target.value }))} className={inputCls} /></div>
        <div><label className={labelCls}>Email</label><input value={data.email || ''} onChange={e => update(p => ({ ...p, email: e.target.value }))} className={inputCls} /></div>
      </div>
    </div>
  )
}

// ── Section: Computer Center ─────────────────────────────────────────────────

const ComputerCenterSection: React.FC = () => {
  const [data, update, save, saving, saved] = useSection(getComputerCenter, saveComputerCenter)
  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold text-primary uppercase tracking-wider">Computer Center</h3>
        <SaveBtn saving={saving} saved={saved} onClick={save} />
      </div>
      <div><label className={labelCls}>Intro (shown as subtitle)</label><input value={data.intro || ''} onChange={e => update(p => ({ ...p, intro: e.target.value }))} className={inputCls} /></div>
      <div><label className={labelCls}>Hero Badge text</label><input value={data.heroBadge || ''} onChange={e => update(p => ({ ...p, heroBadge: e.target.value }))} className={inputCls} placeholder="Central Computing Facility" /></div>
      <div><label className={labelCls}>Hero Title</label><input value={data.heroTitle || ''} onChange={e => update(p => ({ ...p, heroTitle: e.target.value }))} className={inputCls} placeholder="500+ High-Performance Workstations" /></div>
      <div><label className={labelCls}>Hero Description</label><textarea value={data.heroDesc || ''} onChange={e => update(p => ({ ...p, heroDesc: e.target.value }))} className={areaCls} /></div>
      <SpecEditor specs={data.keySpecs || []} onChange={specs => update(p => ({ ...p, keySpecs: specs }))} />
      <StringListEditor label="Software list" items={data.software || []} onChange={items => update(p => ({ ...p, software: items }))} placeholder="e.g. MATLAB R2024" />
      <StringListEditor label="Stats (value:label)" items={data.stats?.map((s: any) => `${s.value}:${s.label}`) || []} onChange={items => update(p => ({ ...p, stats: items.map(s => { const [value, ...rest] = s.split(':'); return { value, label: rest.join(':') } }) }))} placeholder="500+:Workstations" />
    </div>
  )
}

// ── Section: Workshop ────────────────────────────────────────────────────────

const WorkshopSection: React.FC = () => {
  const [data, update, save, saving, saved] = useSection(getWorkshop, saveWorkshop)
  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold text-primary uppercase tracking-wider">Central Workshop</h3>
        <SaveBtn saving={saving} saved={saved} onClick={save} />
      </div>
      <div><label className={labelCls}>About</label><textarea value={data.about || ''} onChange={e => update(p => ({ ...p, about: e.target.value }))} className={areaCls} /></div>
      <StringListEditor label="Modern Equipment" items={data.modernEquipment || []} onChange={items => update(p => ({ ...p, modernEquipment: items }))} />
      <div><label className={labelCls}>Contact Phone</label><input value={data.contactPhone || ''} onChange={e => update(p => ({ ...p, contactPhone: e.target.value }))} className={inputCls} /></div>
      <div><label className={labelCls}>Contact Email</label><input value={data.contactEmail || ''} onChange={e => update(p => ({ ...p, contactEmail: e.target.value }))} className={inputCls} /></div>
    </div>
  )
}

// ── Section: Gymnasium ───────────────────────────────────────────────────────

const GymnasiumSection: React.FC = () => {
  const [data, update, save, saving, saved] = useSection(getGymnasium, saveGymnasium)
  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold text-primary uppercase tracking-wider">Gymnasium</h3>
        <SaveBtn saving={saving} saved={saved} onClick={save} />
      </div>
      <div><label className={labelCls}>About</label><textarea value={data.about || ''} onChange={e => update(p => ({ ...p, about: e.target.value }))} className={areaCls} /></div>
      <StringListEditor label="Equipment list" items={data.equipment || []} onChange={items => update(p => ({ ...p, equipment: items }))} />
      <StringListEditor label="Access / Policy Notes" items={data.accessNotes || []} onChange={items => update(p => ({ ...p, accessNotes: items }))} placeholder="e.g. Free access for enrolled students" />
      <div><label className={labelCls}>Contact Phone</label><input value={data.contactPhone || ''} onChange={e => update(p => ({ ...p, contactPhone: e.target.value }))} className={inputCls} /></div>
      <div><label className={labelCls}>Contact Email</label><input value={data.contactEmail || ''} onChange={e => update(p => ({ ...p, contactEmail: e.target.value }))} className={inputCls} /></div>
    </div>
  )
}

// ── Section: Dispensary ──────────────────────────────────────────────────────

const DispensarySection: React.FC = () => {
  const [data, update, save, saving, saved] = useSection(getDispensary, saveDispensary)
  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold text-primary uppercase tracking-wider">Dispensary &amp; Health Centre</h3>
        <SaveBtn saving={saving} saved={saved} onClick={save} />
      </div>
      <div><label className={labelCls}>About</label><textarea value={data.about || ''} onChange={e => update(p => ({ ...p, about: e.target.value }))} className={areaCls} /></div>
      <StringListEditor label="Services" items={data.services || []} onChange={items => update(p => ({ ...p, services: items }))} />
      <StringListEditor label="First Aid Facilities" items={data.firstAidFacilities || []} onChange={items => update(p => ({ ...p, firstAidFacilities: items }))} />
      <div className="grid grid-cols-2 gap-3">
        <div><label className={labelCls}>OPD Hours</label><input value={data.opdHours || ''} onChange={e => update(p => ({ ...p, opdHours: e.target.value }))} className={inputCls} /></div>
        <div><label className={labelCls}>Emergency Hours</label><input value={data.emergencyHours || ''} onChange={e => update(p => ({ ...p, emergencyHours: e.target.value }))} className={inputCls} /></div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div><label className={labelCls}>Phone</label><input value={data.phone || ''} onChange={e => update(p => ({ ...p, phone: e.target.value }))} className={inputCls} /></div>
        <div><label className={labelCls}>Email</label><input value={data.email || ''} onChange={e => update(p => ({ ...p, email: e.target.value }))} className={inputCls} /></div>
      </div>
    </div>
  )
}

// ── Section: CIDI ─────────────────────────────────────────────────────────────

const CIDISection: React.FC = () => {
  const [data, update, save, saving, saved] = useSection(getCIDI, saveCIDI)
  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold text-primary uppercase tracking-wider">CIDI — Innovation Centre</h3>
        <SaveBtn saving={saving} saved={saved} onClick={save} />
      </div>
      <div><label className={labelCls}>About</label><textarea value={data.about || ''} onChange={e => update(p => ({ ...p, about: e.target.value }))} className={areaCls} /></div>
      <StringListEditor label="Facilities" items={data.facilities || []} onChange={items => update(p => ({ ...p, facilities: items }))} />
      <div><label className={labelCls}>CTA Text</label><input value={data.ctaText || ''} onChange={e => update(p => ({ ...p, ctaText: e.target.value }))} className={inputCls} /></div>
      <div className="grid grid-cols-2 gap-3">
        <div><label className={labelCls}>External URL</label><input value={data.externalUrl || ''} onChange={e => update(p => ({ ...p, externalUrl: e.target.value }))} className={inputCls} placeholder="https://startupindia.gov.in" /></div>
        <div><label className={labelCls}>External URL Label</label><input value={data.externalUrlLabel || ''} onChange={e => update(p => ({ ...p, externalUrlLabel: e.target.value }))} className={inputCls} placeholder="Startup India" /></div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div><label className={labelCls}>Contact Phone</label><input value={data.contactPhone || ''} onChange={e => update(p => ({ ...p, contactPhone: e.target.value }))} className={inputCls} /></div>
        <div><label className={labelCls}>Contact Email</label><input value={data.contactEmail || ''} onChange={e => update(p => ({ ...p, contactEmail: e.target.value }))} className={inputCls} /></div>
      </div>
    </div>
  )
}

// ── Section: IDEA Lab ────────────────────────────────────────────────────────

const IDEALabSection: React.FC = () => {
  const [data, update, save, saving, saved] = useSection(getIDEALab, saveIDEALab)
  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold text-primary uppercase tracking-wider">IDEA Lab</h3>
        <SaveBtn saving={saving} saved={saved} onClick={save} />
      </div>
      <div><label className={labelCls}>About</label><textarea value={data.about || ''} onChange={e => update(p => ({ ...p, about: e.target.value }))} className={areaCls} /></div>
      <StringListEditor label="Equipment list" items={data.equipment || []} onChange={items => update(p => ({ ...p, equipment: items }))} />
      <div><label className={labelCls}>Access Note</label><input value={data.accessNote || ''} onChange={e => update(p => ({ ...p, accessNote: e.target.value }))} className={inputCls} placeholder="Registered students can access..." /></div>
      <div><label className={labelCls}>Portal URL</label><input value={data.portalUrl || ''} onChange={e => update(p => ({ ...p, portalUrl: e.target.value }))} className={inputCls} placeholder="https://..." /></div>
      <div className="grid grid-cols-2 gap-3">
        <div><label className={labelCls}>Contact Phone</label><input value={data.contactPhone || ''} onChange={e => update(p => ({ ...p, contactPhone: e.target.value }))} className={inputCls} /></div>
        <div><label className={labelCls}>Contact Email</label><input value={data.contactEmail || ''} onChange={e => update(p => ({ ...p, contactEmail: e.target.value }))} className={inputCls} /></div>
      </div>
    </div>
  )
}

// ── Section: Games & Sports ──────────────────────────────────────────────────

const GamesSportsSection: React.FC = () => {
  const [data, update, save, saving, saved] = useSection(getGamesSports, saveGamesSports)
  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold text-primary uppercase tracking-wider">Games &amp; Sports</h3>
        <SaveBtn saving={saving} saved={saved} onClick={save} />
      </div>
      <div><label className={labelCls}>Intro</label><textarea value={data.intro || ''} onChange={e => update(p => ({ ...p, intro: e.target.value }))} className={areaCls} /></div>
      <StringListEditor label="Indoor Games list" items={data.indoorGames || []} onChange={items => update(p => ({ ...p, indoorGames: items }))} placeholder="Badminton — 4 courts (indoor sports hall)" />
      <StringListEditor label="Notable Achievements" items={data.achievements || []} onChange={items => update(p => ({ ...p, achievements: items }))} />
      <div className="grid grid-cols-2 gap-3">
        <div><label className={labelCls}>Contact Phone</label><input value={data.contactPhone || ''} onChange={e => update(p => ({ ...p, contactPhone: e.target.value }))} className={inputCls} /></div>
        <div><label className={labelCls}>Contact Email</label><input value={data.contactEmail || ''} onChange={e => update(p => ({ ...p, contactEmail: e.target.value }))} className={inputCls} /></div>
      </div>
      <div><label className={labelCls}>Contact Name</label><input value={data.contactName || ''} onChange={e => update(p => ({ ...p, contactName: e.target.value }))} className={inputCls} /></div>
    </div>
  )
}

// ── Section: Boys Hostel ─────────────────────────────────────────────────────

const HostelSection: React.FC<{
  label: string
  getter: () => Promise<any>
  saver: (d: any) => Promise<unknown>
  showSecurity?: boolean
}> = ({ label, getter, saver, showSecurity }) => {
  const [data, update, save, saving, saved] = useSection(getter, saver)
  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold text-primary uppercase tracking-wider">{label}</h3>
        <SaveBtn saving={saving} saved={saved} onClick={save} />
      </div>
      <div><label className={labelCls}>Intro</label><textarea value={data.intro || ''} onChange={e => update(p => ({ ...p, intro: e.target.value }))} className={areaCls} /></div>
      <StringListEditor label="Amenities" items={data.amenities || []} onChange={items => update(p => ({ ...p, amenities: items }))} />
      <FeeEditor rows={data.feeStructure || []} onChange={rows => update(p => ({ ...p, feeStructure: rows }))} />
      {showSecurity && (
        <StringListEditor label="Security Rules" items={data.securityRules || []} onChange={items => update(p => ({ ...p, securityRules: items }))} />
      )}
      <div className="grid grid-cols-2 gap-3">
        <div><label className={labelCls}>Warden Phone</label><input value={data.wardenPhone || ''} onChange={e => update(p => ({ ...p, wardenPhone: e.target.value }))} className={inputCls} /></div>
        <div><label className={labelCls}>Warden Email</label><input value={data.wardenEmail || ''} onChange={e => update(p => ({ ...p, wardenEmail: e.target.value }))} className={inputCls} /></div>
      </div>
      <div><label className={labelCls}>Warden Name</label><input value={data.wardenName || ''} onChange={e => update(p => ({ ...p, wardenName: e.target.value }))} className={inputCls} /></div>
    </div>
  )
}

// ── Section: Transit Hostel ──────────────────────────────────────────────────

const TransitHostelSection: React.FC = () => {
  const [data, update, save, saving, saved] = useSection(getTransitHostel, saveTransitHostel)
  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold text-primary uppercase tracking-wider">Transit Hostel</h3>
        <SaveBtn saving={saving} saved={saved} onClick={save} />
      </div>
      <div><label className={labelCls}>About</label><textarea value={data.about || ''} onChange={e => update(p => ({ ...p, about: e.target.value }))} className={areaCls} /></div>
      <StringListEditor label="Room Amenities" items={data.amenities || []} onChange={items => update(p => ({ ...p, amenities: items }))} />
      <StringListEditor label="Booking Steps" items={data.bookingSteps || []} onChange={items => update(p => ({ ...p, bookingSteps: items }))} placeholder="Contact Registrar Office to check availability" />
      <div><label className={labelCls}>Priority Note</label><input value={data.priorityNote || ''} onChange={e => update(p => ({ ...p, priorityNote: e.target.value }))} className={inputCls} /></div>
      <div><label className={labelCls}>Timings</label><input value={data.timings || ''} onChange={e => update(p => ({ ...p, timings: e.target.value }))} className={inputCls} /></div>
      <div className="grid grid-cols-2 gap-3">
        <div><label className={labelCls}>Contact Phone</label><input value={data.contactPhone || ''} onChange={e => update(p => ({ ...p, contactPhone: e.target.value }))} className={inputCls} /></div>
        <div><label className={labelCls}>Contact Email</label><input value={data.contactEmail || ''} onChange={e => update(p => ({ ...p, contactEmail: e.target.value }))} className={inputCls} /></div>
      </div>
    </div>
  )
}

// ── Section: Staff Quarters ──────────────────────────────────────────────────

const StaffQuartersSection: React.FC = () => {
  const [data, update, save, saving, saved] = useSection(getStaffQuarters, saveStaffQuarters)
  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold text-primary uppercase tracking-wider">Staff Quarters</h3>
        <SaveBtn saving={saving} saved={saved} onClick={save} />
      </div>
      <div><label className={labelCls}>About</label><textarea value={data.about || ''} onChange={e => update(p => ({ ...p, about: e.target.value }))} className={areaCls} /></div>
      <QuarterEditor rows={data.quarterTypes || []} onChange={rows => update(p => ({ ...p, quarterTypes: rows }))} />
      <StringListEditor label="Common Amenities" items={data.amenities || []} onChange={items => update(p => ({ ...p, amenities: items }))} />
      <StringListEditor label="Allotment Steps" items={data.allotmentSteps || []} onChange={items => update(p => ({ ...p, allotmentSteps: items }))} placeholder="Apply to Estate Section with designation proof" />
      <div><label className={labelCls}>Allotment Note</label><input value={data.allotmentNote || ''} onChange={e => update(p => ({ ...p, allotmentNote: e.target.value }))} className={inputCls} placeholder="Contact Estate Section for current vacancy status" /></div>
      <div className="grid grid-cols-2 gap-3">
        <div><label className={labelCls}>Contact Phone</label><input value={data.contactPhone || ''} onChange={e => update(p => ({ ...p, contactPhone: e.target.value }))} className={inputCls} /></div>
        <div><label className={labelCls}>Contact Email</label><input value={data.contactEmail || ''} onChange={e => update(p => ({ ...p, contactEmail: e.target.value }))} className={inputCls} /></div>
      </div>
    </div>
  )
}

// ── Tabs ──────────────────────────────────────────────────────────────────────

const TABS = [
  { id: 'library',        label: 'Library' },
  { id: 'computer',       label: 'Computer Center' },
  { id: 'workshop',       label: 'Workshop' },
  { id: 'gymnasium',      label: 'Gymnasium' },
  { id: 'dispensary',     label: 'Dispensary' },
  { id: 'cidi',           label: 'CIDI' },
  { id: 'idea-lab',       label: 'IDEA Lab' },
  { id: 'sports',         label: 'Games & Sports' },
  { id: 'boys-hostel',    label: 'Boys Hostel' },
  { id: 'girls-hostel',   label: 'Girls Hostel' },
  { id: 'transit',        label: 'Transit Hostel' },
  { id: 'staff-quarters', label: 'Staff Quarters' },
]

const AdminFacilities: React.FC = () => {
  const [tab, setTab] = useState('library')

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Building className="text-primary w-5 h-5" />
        <div>
          <h1 className="text-lg font-bold text-primary font-display">Facilities CMS</h1>
          <p className="text-xs text-slate-500">Manage content for all campus facility pages</p>
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
        {tab === 'library'        && <LibrarySection />}
        {tab === 'computer'       && <ComputerCenterSection />}
        {tab === 'workshop'       && <WorkshopSection />}
        {tab === 'gymnasium'      && <GymnasiumSection />}
        {tab === 'dispensary'     && <DispensarySection />}
        {tab === 'cidi'           && <CIDISection />}
        {tab === 'idea-lab'       && <IDEALabSection />}
        {tab === 'sports'         && <GamesSportsSection />}
        {tab === 'boys-hostel'    && <HostelSection label="Boys Hostel" getter={getBoysHostel} saver={saveBoysHostel} />}
        {tab === 'girls-hostel'   && <HostelSection label="Girls Hostel" getter={getGirlsHostel} saver={saveGirlsHostel} showSecurity />}
        {tab === 'transit'        && <TransitHostelSection />}
        {tab === 'staff-quarters' && <StaffQuartersSection />}
      </div>
    </div>
  )
}

export default AdminFacilities
