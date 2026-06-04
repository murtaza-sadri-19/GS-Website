/**
 * ExtendedFacultyFields — reusable sections for both HOD and Teacher profile pages.
 * Covers: Doctoral/PG Guidance, Courses Taught, Admin Roles, Memberships.
 */

import React, { useState } from 'react'
import { Plus, Trash2, GraduationCap, Bookmark, Award, Globe } from 'lucide-react'
import type { AdminRole } from '../../types/faculty'

// ── Shared styles ─────────────────────────────────────────────────────────────

const inputCls = (editing: boolean) =>
  `w-full border rounded px-3 py-2 text-sm focus:outline-none ${editing
    ? 'border-slate-200 bg-white focus:border-primary'
    : 'border-transparent bg-slate-50 text-slate-700 cursor-default'}`

const sectionLabel = 'text-xs font-bold text-slate-500 uppercase tracking-wider'

// ── Props ─────────────────────────────────────────────────────────────────────

export interface ExtendedFields {
  phd_guided:  number
  phd_ongoing: number
  pg_guided:   number
  subjects_taught: string[]
  admin_roles: AdminRole[]
  memberships: string[]
}

interface Props {
  value: ExtendedFields
  editing: boolean
  onChange: (patch: Partial<ExtendedFields>) => void
}

// ── Guidance counts ────────────────────────────────────────────────────────────

const GuidanceSection: React.FC<Props> = ({ value, editing, onChange }) => (
  <div className="space-y-3">
    <p className={sectionLabel + ' flex items-center gap-1.5'}><GraduationCap size={12} /> Doctoral &amp; Postgraduate Guidance</p>
    <div className="grid grid-cols-3 gap-3">
      {([
        { key: 'phd_guided',  label: 'Ph.D Dissertations Guided' },
        { key: 'phd_ongoing', label: 'Active Doctoral Scholars' },
        { key: 'pg_guided',   label: 'M.Tech / PG Guided' },
      ] as { key: keyof ExtendedFields; label: string }[]).map(({ key, label }) => (
        <div key={key}>
          <label className="block text-xs text-slate-500 mb-1">{label}</label>
          <input
            type="number"
            min={0}
            value={value[key] as number}
            onChange={e => onChange({ [key]: Math.max(0, Number(e.target.value)) })}
            disabled={!editing}
            className={inputCls(editing)}
          />
        </div>
      ))}
    </div>
  </div>
)

// ── Courses taught ────────────────────────────────────────────────────────────

const CoursesSection: React.FC<Props> = ({ value, editing, onChange }) => {
  const [draft, setDraft] = useState('')

  const add = () => {
    const t = draft.trim()
    if (!t) return
    onChange({ subjects_taught: [...value.subjects_taught, t] })
    setDraft('')
  }

  const remove = (i: number) =>
    onChange({ subjects_taught: value.subjects_taught.filter((_, idx) => idx !== i) })

  return (
    <div className="space-y-3">
      <p className={sectionLabel + ' flex items-center gap-1.5'}><Bookmark size={12} /> Courses Taught (UG &amp; PG Level)</p>
      <div className="flex flex-wrap gap-2 min-h-[36px]">
        {value.subjects_taught.map((s, i) => (
          <span key={i} className="inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 bg-primary/5 border border-primary/20 text-primary rounded">
            {s}
            {editing && (
              <button onClick={() => remove(i)} className="hover:text-red-500 transition-colors">
                <Trash2 size={10} />
              </button>
            )}
          </span>
        ))}
        {value.subjects_taught.length === 0 && !editing && (
          <span className="text-xs text-slate-400">No courses listed.</span>
        )}
      </div>
      {editing && (
        <div className="flex gap-2">
          <input
            type="text"
            value={draft}
            onChange={e => setDraft(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); add() } }}
            placeholder="e.g. Data Structures, DBMS, Machine Learning…"
            className="flex-1 border border-slate-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-primary bg-white"
          />
          <button
            onClick={add}
            className="inline-flex items-center gap-1 px-3 py-2 bg-primary text-white text-xs font-bold rounded hover:bg-primary/90"
          >
            <Plus size={12} /> Add
          </button>
        </div>
      )}
    </div>
  )
}

// ── Admin roles ───────────────────────────────────────────────────────────────

const AdminRolesSection: React.FC<Props> = ({ value, editing, onChange }) => {
  const roles = value.admin_roles

  const update = (i: number, patch: Partial<AdminRole>) => {
    const next = roles.map((r, idx) => idx === i ? { ...r, ...patch } : r)
    onChange({ admin_roles: next })
  }

  const remove = (i: number) => onChange({ admin_roles: roles.filter((_, idx) => idx !== i) })

  const add = () => onChange({ admin_roles: [...roles, { role: '', period: '', description: '' }] })

  return (
    <div className="space-y-3">
      <p className={sectionLabel + ' flex items-center gap-1.5'}><Award size={12} /> Administrative Duties &amp; Governance</p>

      {roles.length === 0 && !editing && (
        <p className="text-xs text-slate-400">No administrative roles listed.</p>
      )}

      <div className="space-y-3">
        {roles.map((r, i) => (
          <div key={i} className="border border-slate-200 rounded p-3 bg-slate-50 space-y-2">
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={r.role}
                onChange={e => update(i, { role: e.target.value })}
                disabled={!editing}
                placeholder="Role / Position"
                className={`flex-1 ${inputCls(editing)}`}
              />
              <input
                type="text"
                value={r.period}
                onChange={e => update(i, { period: e.target.value })}
                disabled={!editing}
                placeholder="Period (e.g. 2020–2023)"
                className={`w-40 ${inputCls(editing)}`}
              />
              {editing && (
                <button onClick={() => remove(i)} className="text-red-400 hover:text-red-600 shrink-0">
                  <Trash2 size={14} />
                </button>
              )}
            </div>
            <input
              type="text"
              value={r.description || ''}
              onChange={e => update(i, { description: e.target.value })}
              disabled={!editing}
              placeholder="Brief description (optional)"
              className={inputCls(editing)}
            />
          </div>
        ))}
      </div>

      {editing && (
        <button
          onClick={add}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-primary hover:text-primary/80"
        >
          <Plus size={13} /> Add Role
        </button>
      )}
    </div>
  )
}

// ── Memberships ───────────────────────────────────────────────────────────────

const MembershipsSection: React.FC<Props> = ({ value, editing, onChange }) => {
  const [draft, setDraft] = useState('')

  const add = () => {
    const t = draft.trim()
    if (!t) return
    onChange({ memberships: [...value.memberships, t] })
    setDraft('')
  }

  const remove = (i: number) =>
    onChange({ memberships: value.memberships.filter((_, idx) => idx !== i) })

  return (
    <div className="space-y-3">
      <p className={sectionLabel + ' flex items-center gap-1.5'}><Globe size={12} /> Professional Memberships &amp; Affiliations</p>
      <div className="flex flex-wrap gap-2 min-h-[36px]">
        {value.memberships.map((m, i) => (
          <span key={i} className="inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 bg-slate-50 border border-slate-200 text-slate-700 rounded">
            {m}
            {editing && (
              <button onClick={() => remove(i)} className="hover:text-red-500 transition-colors">
                <Trash2 size={10} />
              </button>
            )}
          </span>
        ))}
        {value.memberships.length === 0 && !editing && (
          <span className="text-xs text-slate-400">No memberships listed.</span>
        )}
      </div>
      {editing && (
        <div className="flex gap-2">
          <input
            type="text"
            value={draft}
            onChange={e => setDraft(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); add() } }}
            placeholder="e.g. IEEE Senior Member, ACM Member…"
            className="flex-1 border border-slate-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-primary bg-white"
          />
          <button
            onClick={add}
            className="inline-flex items-center gap-1 px-3 py-2 bg-primary text-white text-xs font-bold rounded hover:bg-primary/90"
          >
            <Plus size={12} /> Add
          </button>
        </div>
      )}
    </div>
  )
}

// ── Composed export ───────────────────────────────────────────────────────────

const ExtendedFacultyFields: React.FC<Props> = (props) => (
  <div className="space-y-6 pt-4 border-t border-slate-100 mt-2">
    <GuidanceSection   {...props} />
    <CoursesSection    {...props} />
    <AdminRolesSection {...props} />
    <MembershipsSection {...props} />
  </div>
)

export default ExtendedFacultyFields
