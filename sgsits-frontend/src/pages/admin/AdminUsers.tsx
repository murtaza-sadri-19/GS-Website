import React, { useState, useEffect, useCallback } from 'react'
import { KeyRound, Copy, CheckCheck, Loader2, AlertTriangle } from 'lucide-react'
import CrudPage, { Modal, FormField, Input, Select, StatusBadge } from '../../components/admin/CrudPage'
import apiClient from '../../api/client'

// ── Types ─────────────────────────────────────────────────────────────────────

interface Role {
  id: number
  role_name: string
}

interface Department {
  id: number
  name: string
}

interface UserAccount {
  id: number
  name: string
  email: string
  phone: string | null
  role: string
  department_id: number | null
  status: 'ACTIVE' | 'INACTIVE'
  created_at: string
}

interface UserForm {
  name: string
  email: string
  phone: string
  role_id: string
  department_id: string
}

const EMPTY_FORM: UserForm = {
  name: '',
  email: '',
  phone: '',
  role_id: '',
  department_id: '',
}

const ROLE_NEEDS_DEPT = new Set(['HOD', 'TEACHER'])

// ── Helpers ───────────────────────────────────────────────────────────────────

function roleLabel(roleName: string) {
  const map: Record<string, string> = {
    HOD: 'HOD',
    TEACHER: 'Teacher',
    EXAM_CONTROLLER: 'Exam Controller',
    PLACEMENT_OFFICER: 'Placement Officer',
  }
  return map[roleName] ?? roleName
}

// ── Password reveal modal ─────────────────────────────────────────────────────

const PasswordModal: React.FC<{
  name: string
  email: string
  password: string
  onClose: () => void
}> = ({ name, email, password, onClose }) => {
  const [copied, setCopied] = useState(false)

  const copy = () => {
    navigator.clipboard.writeText(password).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  return (
    <Modal isOpen title="Account Created — Save the Password" onClose={onClose} width="max-w-md">
      <div className="space-y-4">
        <div className="flex items-start gap-3 p-3 bg-amber-50 border border-amber-200 rounded-lg">
          <AlertTriangle size={16} className="text-amber-600 mt-0.5 shrink-0" />
          <p className="text-xs text-amber-800 leading-relaxed">
            This password is shown <strong>only once</strong>. Copy and share it securely with{' '}
            <strong>{name}</strong> ({email}). They can change it after first login.
          </p>
        </div>

        <div className="space-y-1">
          <p className="text-xs font-semibold text-slate-600">Initial Password</p>
          <div className="flex items-center gap-2">
            <div className="flex-1 flex items-center gap-2 font-mono text-sm bg-slate-100 border border-slate-200 rounded px-3 py-2.5">
              <KeyRound size={14} className="text-slate-400 shrink-0" />
              <span className="text-slate-800 font-bold tracking-wider select-all">{password}</span>
            </div>
            <button
              onClick={copy}
              className="shrink-0 flex items-center gap-1.5 px-3 py-2.5 bg-primary text-white text-xs font-bold rounded hover:bg-primary/90 transition-colors"
            >
              {copied ? <CheckCheck size={13} /> : <Copy size={13} />}
              {copied ? 'Copied' : 'Copy'}
            </button>
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-full py-2 bg-green-600 text-white text-sm font-bold rounded hover:bg-green-700 transition-colors"
        >
          Done — I've saved the password
        </button>
      </div>
    </Modal>
  )
}

// ── Main Component ────────────────────────────────────────────────────────────

const AdminUsers: React.FC = () => {
  const [users, setUsers]           = useState<UserAccount[]>([])
  const [roles, setRoles]           = useState<Role[]>([])
  const [departments, setDepartments] = useState<Department[]>([])
  const [loading, setLoading]       = useState(true)
  const [apiError, setApiError]     = useState('')
  const [isOpen, setIsOpen]         = useState(false)
  const [editing, setEditing]       = useState<UserAccount | null>(null)
  const [form, setForm]             = useState<UserForm>(EMPTY_FORM)
  const [saving, setSaving]         = useState(false)
  const [formError, setFormError]   = useState('')
  const [createdPassword, setCreatedPassword] = useState<{ name: string; email: string; password: string } | null>(null)

  // ── Data fetching ───────────────────────────────────────────────────────

  const fetchAll = useCallback(async () => {
    setLoading(true)
    setApiError('')
    try {
      const [usersRes, rolesRes, deptsRes] = await Promise.all([
        apiClient.get('/v1/users?pageSize=100'),
        apiClient.get('/v1/users/roles'),
        apiClient.get('/v1/departments?pageSize=100'),
      ])

      const usersData = (usersRes.data as Record<string, unknown>).data as Record<string, unknown>
      const rolesData = (rolesRes.data as Record<string, unknown>).data
      const deptsRaw  = (deptsRes.data as Record<string, unknown>).data

      setUsers((usersData.users ?? []) as UserAccount[])
      setRoles(Array.isArray(rolesData) ? (rolesData as Role[]) : [])
      // departments API returns a bare array, not { departments: [] }
      setDepartments((Array.isArray(deptsRaw) ? deptsRaw : []) as Department[])
    } catch {
      setApiError('Failed to load users. Make sure the backend is running.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetchAll() }, [fetchAll])

  // ── Derived helpers ─────────────────────────────────────────────────────

  const selectedRole = roles.find(r => String(r.id) === form.role_id)
  const needsDept    = selectedRole ? ROLE_NEEDS_DEPT.has(selectedRole.role_name) : false

  // ── Handlers ────────────────────────────────────────────────────────────

  const openAdd = () => {
    setEditing(null)
    setForm(EMPTY_FORM)
    setFormError('')
    setIsOpen(true)
  }

  const openEdit = (user: UserAccount) => {
    const matchedRole = roles.find(r => r.role_name === user.role)
    setEditing(user)
    setForm({
      name:          user.name,
      email:         user.email,
      phone:         user.phone ?? '',
      role_id:       matchedRole ? String(matchedRole.id) : '',
      department_id: user.department_id ? String(user.department_id) : '',
    })
    setFormError('')
    setIsOpen(true)
  }

  const handleDeactivate = async (user: UserAccount) => {
    // confirmation check removed — deactivate button should have own confirmation UI
    try {
      await apiClient.patch(`/v1/users/${user.id}/status`, { status: 'INACTIVE' })
      setUsers(prev => prev.map(u => u.id === user.id ? { ...u, status: 'INACTIVE' } : u))
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message
      setApiError(msg ?? 'Failed to deactivate user.')
    }
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setFormError('')

    if (!form.role_id) { setFormError('Please select a role.'); return }
    if (needsDept && !form.department_id) { setFormError('Department is required for this role.'); return }

    setSaving(true)
    try {
      if (editing) {
        // Update existing user — always send role_id and department_id so
        // the backend can enforce one-HOD-per-dept and cascade dept changes.
        const payload: Record<string, unknown> = {
          name:          form.name,
          phone:         form.phone || null,
          role_id:       parseInt(form.role_id),
          department_id: form.department_id ? parseInt(form.department_id) : null,
        }
        const res = await apiClient.put(`/v1/users/${editing.id}`, payload)
        const updated = ((res.data as Record<string, unknown>).data) as UserAccount
        // Backend may have demoted another HOD, so refresh full list
        await fetchAll()
        setUsers(prev => prev.map(u => u.id === updated.id ? updated : u))
        setIsOpen(false)
      } else {
        // Create new user
        const payload: Record<string, unknown> = {
          name:    form.name.trim(),
          email:   form.email.trim(),
          phone:   form.phone.trim() || undefined,
          role_id: parseInt(form.role_id),
        }
        if (form.department_id) payload.department_id = parseInt(form.department_id)

        const res = await apiClient.post('/v1/users', payload)
        const data = (res.data as Record<string, unknown>).data as { user: UserAccount; initial_password: string }
        setUsers(prev => [data.user, ...prev])
        setIsOpen(false)
        setCreatedPassword({ name: data.user.name, email: data.user.email, password: data.initial_password })
      }
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message
      setFormError(msg ?? 'Failed to save. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  // ── Table columns ────────────────────────────────────────────────────────

  const columns = [
    { header: 'Name', key: 'name' },
    { header: 'Email', key: 'email' },
    {
      header: 'Role',
      key: 'role',
      render: (u: UserAccount) => (
        <span className="font-semibold text-slate-700">{roleLabel(u.role)}</span>
      ),
    },
    {
      header: 'Department',
      key: 'department_id',
      render: (u: UserAccount) => {
        const dept = departments.find(d => d.id === u.department_id)
        return <span className="text-slate-600">{dept?.name ?? '—'}</span>
      },
    },
    {
      header: 'Status',
      key: 'status',
      render: (u: UserAccount) => (
        <StatusBadge label={u.status} color={u.status === 'ACTIVE' ? 'green' : 'red'} />
      ),
    },
  ]

  // ── Loading / error states ───────────────────────────────────────────────

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[40vh] gap-3 text-slate-500">
        <Loader2 size={20} className="animate-spin" />
        <span className="text-sm">Loading users…</span>
      </div>
    )
  }

  if (apiError) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[40vh] gap-3">
        <AlertTriangle size={24} className="text-amber-500" />
        <p className="text-sm text-slate-600">{apiError}</p>
        <button onClick={fetchAll} className="px-4 py-2 bg-primary text-white text-sm font-semibold rounded">Retry</button>
      </div>
    )
  }

  return (
    <>
      <CrudPage
        title="User Management"
        subtitle="Create and manage HOD, Teacher, Exam Controller, and Placement Officer portal logins"
        addLabel="Add User"
        data={users}
        columns={columns}
        searchKeys={['name', 'email', 'role']}
        onAdd={openAdd}
        onEdit={openEdit}
        onDelete={handleDeactivate}
      />

      {/* Create / Edit Modal */}
      <Modal
        isOpen={isOpen}
        title={editing ? `Edit User — #${editing.id}` : 'Create User Account'}
        onClose={() => setIsOpen(false)}
        width="max-w-md"
      >
        <form onSubmit={handleSave} className="space-y-4">
          <FormField label="Full Name" required>
            <Input
              required
              value={form.name}
              onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
              placeholder="e.g. Dr. Rajesh Kumar"
            />
          </FormField>

          {!editing && (
            <FormField label="Email Address" required>
              <Input
                type="email"
                required
                value={form.email}
                onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                placeholder="e.g. email@sgsits.ac.in"
              />
            </FormField>
          )}

          <FormField label="Phone (optional)">
            <Input
              value={form.phone}
              onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
              placeholder="e.g. +91-9876543210"
            />
          </FormField>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <FormField label="Role" required>
              <Select
                value={form.role_id}
                onChange={e => setForm(f => ({ ...f, role_id: e.target.value, department_id: '' }))}
              >
                <option value="" disabled>Select role…</option>
                {roles.map(r => (
                  <option key={r.id} value={String(r.id)}>{roleLabel(r.role_name)}</option>
                ))}
              </Select>
            </FormField>

            {needsDept && (
              <FormField label="Department" required>
                <Select
                  value={form.department_id}
                  onChange={e => setForm(f => ({ ...f, department_id: e.target.value }))}
                >
                  <option value="" disabled>Select department…</option>
                  {departments.map(d => (
                    <option key={d.id} value={String(d.id)}>{d.name}</option>
                  ))}
                </Select>
              </FormField>
            )}
          </div>

          {/* One-HOD rule: warn admin that the existing HOD will be demoted */}
          {editing && selectedRole?.role_name === 'HOD' && form.department_id && (
            <div className="flex items-start gap-2 p-2.5 bg-amber-50 border border-amber-200 rounded text-xs text-amber-800">
              <AlertTriangle size={13} className="mt-0.5 shrink-0" />
              If this department already has an HOD, they will automatically be demoted to Teacher.
            </div>
          )}

          {formError && (
            <p className="text-xs text-red-600 font-medium">{formError}</p>
          )}

          {!editing && (
            <p className="text-xs text-slate-500 bg-slate-50 border border-slate-200 rounded p-2.5">
              A secure initial password will be generated automatically. You'll see it once after saving — copy it to share with the new user.
            </p>
          )}

          <div className="flex gap-3 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="flex-1 py-2 border border-slate-200 text-slate-700 rounded font-semibold text-sm hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex-1 py-2 bg-primary text-white rounded font-semibold text-sm hover:bg-primary/90 disabled:opacity-60 flex items-center justify-center gap-2"
            >
              {saving && <Loader2 size={13} className="animate-spin" />}
              {saving ? 'Saving…' : editing ? 'Update User' : 'Create User'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Initial password reveal */}
      {createdPassword && (
        <PasswordModal
          name={createdPassword.name}
          email={createdPassword.email}
          password={createdPassword.password}
          onClose={() => setCreatedPassword(null)}
        />
      )}
    </>
  )
}

export default AdminUsers
