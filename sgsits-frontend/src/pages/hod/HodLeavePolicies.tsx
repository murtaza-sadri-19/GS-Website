/**
 * HOD Leave Policy Management
 * HODs can view/edit leave allocations for their department.
 * Admins can manage global (all-department) policies.
 */

import React, { useState, useEffect, useCallback } from 'react'
import { PageHeader, PortalCard, PortalModal } from '../../components/layout/PortalLayout'
import { useAdminStore } from '../../store/adminStore'
import {
  Plus, Trash2, Edit3, Save, Loader2, CheckCircle2, RefreshCw, X, Info,
} from 'lucide-react'
import {
  getLeaveTypes, getLeavePolicies, createLeavePolicy, updateLeavePolicy, deleteLeavePolicy,
  currentAcademicYear,
  type LeaveType, type LeavePolicy,
} from '../../services/leaveService'

// ── Helpers ───────────────────────────────────────────────────────────────────

const ROLES = ['TEACHER', 'HOD', 'CENTRAL_ADMIN', 'EXAM_CONTROLLER', 'PLACEMENT_OFFICER']
const YEARS = ['2024-25', '2025-26', '2026-27', '2027-28', '2028-29']

function genYears() {
  const cur = currentAcademicYear()
  if (!YEARS.includes(cur)) YEARS.push(cur)
  return [...new Set(YEARS)].sort()
}

// ── Form state ─────────────────────────────────────────────────────────────────

interface PolicyForm {
  leave_type_id:               number | ''
  role:                        string
  academic_year:               string
  max_days:                    number
  carry_forward:               boolean
  requires_attachment:         boolean
  requires_hod_approval:       boolean
  requires_principal_approval: boolean
}

const EMPTY_FORM: PolicyForm = {
  leave_type_id:               '',
  role:                        'TEACHER',
  academic_year:               currentAcademicYear(),
  max_days:                    0,
  carry_forward:               false,
  requires_attachment:         false,
  requires_hod_approval:       true,
  requires_principal_approval: false,
}

// ── Main Component ────────────────────────────────────────────────────────────

const HodLeavePolicies: React.FC = () => {
  const { user } = useAdminStore()
  const isAdmin = user?.role === 'CENTRAL_ADMIN'

  const [types,    setTypes]    = useState<LeaveType[]>([])
  const [policies, setPolicies] = useState<LeavePolicy[]>([])
  const [loading,  setLoading]  = useState(true)
  const [toast,    setToast]    = useState('')
  const [yearFilter, setYearFilter] = useState(currentAcademicYear())
  const [roleFilter, setRoleFilter] = useState('TEACHER')

  const [showForm,    setShowForm]    = useState(false)
  const [editing,     setEditing]     = useState<LeavePolicy | null>(null)
  const [form,        setForm]        = useState<PolicyForm>(EMPTY_FORM)
  const [saving,      setSaving]      = useState(false)
  const [deleting,    setDeleting]    = useState<LeavePolicy | null>(null)

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(''), 2800) }

  const load = useCallback(async () => {
    setLoading(true)
    const [t, p] = await Promise.all([
      getLeaveTypes(),
      getLeavePolicies({ academic_year: yearFilter, role: roleFilter }),
    ])
    setTypes(t)
    setPolicies(p)
    setLoading(false)
  }, [yearFilter, roleFilter])

  useEffect(() => { load() }, [load])

  const openCreate = () => {
    setEditing(null)
    setForm({ ...EMPTY_FORM, academic_year: yearFilter, role: roleFilter })
    setShowForm(true)
  }

  const openEdit = (p: LeavePolicy) => {
    setEditing(p)
    setForm({
      leave_type_id:               p.leave_type_id,
      role:                        p.role,
      academic_year:               p.academic_year,
      max_days:                    p.max_days,
      carry_forward:               !!p.carry_forward,
      requires_attachment:         !!p.requires_attachment,
      requires_hod_approval:       !!p.requires_hod_approval,
      requires_principal_approval: !!p.requires_principal_approval,
    })
    setShowForm(true)
  }

  const submitForm = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.leave_type_id) { showToast('Select a leave type.'); return }
    if (form.max_days < 0) { showToast('Max days must be >= 0.'); return }

    setSaving(true)
    try {
      const payload = {
        leave_type_id:               Number(form.leave_type_id),
        role:                        form.role,
        academic_year:               form.academic_year,
        max_days:                    form.max_days,
        carry_forward:               form.carry_forward ? 1 : 0,
        requires_attachment:         form.requires_attachment ? 1 : 0,
        requires_hod_approval:       form.requires_hod_approval ? 1 : 0,
        requires_principal_approval: form.requires_principal_approval ? 1 : 0,
        // HODs create dept-specific; admin creates global (department_id null unless specified)
        department_id: isAdmin ? null : user?.department_id ?? null,
      }
      if (editing) {
        await updateLeavePolicy(editing.id, payload)
        showToast('Policy updated.')
      } else {
        await createLeavePolicy(payload as any)
        showToast('Policy created.')
      }
      setShowForm(false)
      await load()
    } catch (err: any) {
      showToast(err?.response?.data?.message || 'Failed to save policy.')
    } finally { setSaving(false) }
  }

  const confirmDelete = async () => {
    if (!deleting) return
    try {
      await deleteLeavePolicy(deleting.id)
      showToast('Policy deleted.')
      setDeleting(null)
      await load()
    } catch (err: any) {
      showToast(err?.response?.data?.message || 'Cannot delete policy.')
      setDeleting(null)
    }
  }

  const set = <K extends keyof PolicyForm>(k: K, v: PolicyForm[K]) => setForm(p => ({ ...p, [k]: v }))

  const inputCls = 'w-full border border-slate-200 rounded px-3 py-2 text-sm bg-white focus:outline-none focus:border-primary'

  return (
    <div className="space-y-5">
      <PageHeader
        title="Leave Policy Management"
        subtitle="Configure leave allocations, rules, and approval workflows per role and academic year"
        action={
          <div className="flex gap-2">
            <button onClick={load} className="inline-flex items-center gap-1.5 px-3 py-2 border border-slate-200 text-slate-600 text-xs font-bold rounded-md hover:bg-slate-50">
              <RefreshCw size={12} className={loading ? 'animate-spin' : ''} />
            </button>
            <button onClick={openCreate} className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-primary text-white text-xs font-bold rounded-md hover:bg-primary/90">
              <Plus size={14} /> Add Policy
            </button>
          </div>
        }
      />

      {/* Info banner */}
      <PortalCard className="!p-3 bg-primary/5 border-primary/15">
        <div className="flex items-start gap-2">
          <Info size={14} className="text-primary mt-0.5 shrink-0" />
          <p className="text-xs text-primary/80">
            Policies define how many days each leave type allows per role and academic year.
            {!isAdmin && ' HOD-specific policies override global defaults for your department.'}
            Changes take effect immediately — teacher dashboards will reflect updated balances on next load.
          </p>
        </div>
      </PortalCard>

      {/* Filters */}
      <div className="flex gap-3 flex-wrap">
        <select
          value={yearFilter}
          onChange={e => setYearFilter(e.target.value)}
          className="border border-slate-200 rounded px-3 py-2 text-sm bg-white focus:outline-none focus:border-primary"
        >
          {genYears().map(y => <option key={y} value={y}>{y}</option>)}
        </select>
        <select
          value={roleFilter}
          onChange={e => setRoleFilter(e.target.value)}
          className="border border-slate-200 rounded px-3 py-2 text-sm bg-white focus:outline-none focus:border-primary"
        >
          {ROLES.map(r => <option key={r} value={r}>{r}</option>)}
        </select>
      </div>

      {/* Policy grid */}
      {loading ? (
        <PortalCard>
          <div className="flex items-center justify-center py-10 text-slate-400">
            <Loader2 size={20} className="animate-spin mr-2" /><span className="text-sm">Loading policies…</span>
          </div>
        </PortalCard>
      ) : policies.length === 0 ? (
        <PortalCard>
          <div className="text-center py-10">
            <p className="text-sm font-semibold text-slate-600">No policies for {roleFilter} in {yearFilter}</p>
            <p className="text-xs text-slate-400 mt-1">Click "Add Policy" to create leave allocations.</p>
          </div>
        </PortalCard>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm bg-white border border-slate-200 rounded overflow-hidden">
            <thead>
              <tr className="bg-primary text-white">
                {['Leave Type', 'Role', 'Dept', 'Year', 'Max Days', 'Carry Fwd', 'Attachment', 'HOD Approval', 'Actions'].map(h => (
                  <th key={h} className="text-left px-4 py-3 font-semibold text-xs uppercase tracking-wider whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {policies.map(p => (
                <tr key={p.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: p.leave_type_color }} />
                      <span className="font-semibold text-slate-800">{p.leave_type_name}</span>
                      <span className="text-xs text-slate-400 font-mono">({p.leave_type_code})</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-xs font-bold text-slate-600">{p.role}</td>
                  <td className="px-4 py-3 text-xs text-slate-500">{p.department_name ?? <em className="text-slate-300">Global</em>}</td>
                  <td className="px-4 py-3 text-xs font-mono text-slate-500">{p.academic_year}</td>
                  <td className="px-4 py-3">
                    <span className="font-bold text-primary text-base">{p.max_days}</span>
                    <span className="text-xs text-slate-400 ml-1">days</span>
                  </td>
                  <td className="px-4 py-3 text-center">{p.carry_forward ? '✓' : '—'}</td>
                  <td className="px-4 py-3 text-center">{p.requires_attachment ? '✓' : '—'}</td>
                  <td className="px-4 py-3 text-center">{p.requires_hod_approval ? '✓' : '—'}</td>
                  <td className="px-4 py-3">
                    <div className="flex gap-1">
                      <button onClick={() => openEdit(p)} className="p-1.5 rounded hover:bg-slate-100 text-primary">
                        <Edit3 size={13} />
                      </button>
                      <button onClick={() => setDeleting(p)} className="p-1.5 rounded hover:bg-red-50 text-red-400">
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Create / Edit Form Modal */}
      <PortalModal
        isOpen={showForm}
        title={editing ? `Edit Policy — ${editing.leave_type_name}` : 'Add Leave Policy'}
        onClose={() => setShowForm(false)}
        width="max-w-lg"
      >
        <form onSubmit={submitForm} className="space-y-4">
          {!editing && (
            <>
              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase tracking-wide mb-1">Leave Type *</label>
                <select value={form.leave_type_id} onChange={e => set('leave_type_id', Number(e.target.value) || '')} className={inputCls} required>
                  <option value="">— Select leave type —</option>
                  {types.map(t => <option key={t.id} value={t.id}>{t.name} ({t.code})</option>)}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-600 uppercase tracking-wide mb-1">Role *</label>
                  <select value={form.role} onChange={e => set('role', e.target.value)} className={inputCls}>
                    {ROLES.map(r => <option key={r} value={r}>{r}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-600 uppercase tracking-wide mb-1">Academic Year *</label>
                  <select value={form.academic_year} onChange={e => set('academic_year', e.target.value)} className={inputCls}>
                    {genYears().map(y => <option key={y} value={y}>{y}</option>)}
                  </select>
                </div>
              </div>
            </>
          )}
          {editing && (
            <div className="bg-slate-50 rounded p-3 text-xs text-slate-600 space-y-1">
              <p><strong>Type:</strong> {editing.leave_type_name} ({editing.leave_type_code})</p>
              <p><strong>Role:</strong> {editing.role} &nbsp;·&nbsp; <strong>Year:</strong> {editing.academic_year}</p>
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-slate-600 uppercase tracking-wide mb-1">Maximum Days *</label>
            <input type="number" min={0} max={365} value={form.max_days} onChange={e => set('max_days', Number(e.target.value))} className={inputCls} required />
          </div>

          <div className="space-y-2">
            {([
              ['carry_forward',               'Allow Carry Forward to Next Year'],
              ['requires_attachment',         'Require Supporting Document (Medical Certificate etc.)'],
              ['requires_hod_approval',       'Require HOD Approval'],
              ['requires_principal_approval', 'Require Principal Approval'],
            ] as [keyof PolicyForm, string][]).map(([key, label]) => (
              <label key={key} className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={!!form[key]}
                  onChange={e => set(key, e.target.checked as any)}
                  className="rounded border-slate-300 text-primary"
                />
                <span className="text-sm text-slate-700 font-medium">{label}</span>
              </label>
            ))}
          </div>

          <div className="flex gap-2.5 pt-3 border-t border-slate-100">
            <button type="button" onClick={() => setShowForm(false)} className="flex-1 py-2 border border-slate-200 text-slate-700 text-sm font-semibold rounded hover:bg-slate-50">
              Cancel
            </button>
            <button type="submit" disabled={saving} className="flex-1 py-2 bg-primary text-white text-sm font-bold rounded hover:bg-primary/90 disabled:opacity-50 inline-flex items-center justify-center gap-1.5">
              {saving ? <><Loader2 size={13} className="animate-spin" />Saving…</> : <><Save size={13} />{editing ? 'Update' : 'Create'}</>}
            </button>
          </div>
        </form>
      </PortalModal>

      {/* Delete Confirm */}
      <PortalModal isOpen={!!deleting} title="Delete Policy" onClose={() => setDeleting(null)} width="max-w-sm">
        {deleting && (
          <div className="text-center space-y-4">
            <div className="w-12 h-12 bg-red-50 rounded-full flex items-center justify-center mx-auto">
              <Trash2 size={20} className="text-red-500" />
            </div>
            <p className="text-sm text-slate-700">
              Delete the <strong>{deleting.leave_type_name}</strong> policy for <strong>{deleting.role}</strong> ({deleting.academic_year})?
            </p>
            <p className="text-xs text-slate-400">Teachers' balances will recalculate automatically on next load.</p>
            <div className="flex gap-2.5">
              <button onClick={() => setDeleting(null)} className="flex-1 py-2 border border-slate-200 text-slate-700 text-sm font-semibold rounded hover:bg-slate-50">Cancel</button>
              <button onClick={confirmDelete} className="flex-1 py-2 bg-red-500 text-white text-sm font-bold rounded hover:bg-red-600">Delete</button>
            </div>
          </div>
        )}
      </PortalModal>

      {toast && (
        <div className="fixed bottom-4 right-4 z-50 bg-primary text-white px-5 py-3 rounded-lg shadow-lg flex items-center gap-2 text-sm font-medium">
          <CheckCircle2 size={14} /> {toast}
          <button onClick={() => setToast('')}><X size={13} /></button>
        </div>
      )}
    </div>
  )
}

export default HodLeavePolicies
