import React, { useState } from 'react'
import CrudPage, { Modal, FormField, Input, Select, StatusBadge } from '../../components/admin/CrudPage'

interface UserAccount {
  id: string
  name: string
  email: string
  role: 'HOD' | 'Teacher' | 'Exam Controller' | 'Placement Officer'
  department: string
  status: 'active' | 'inactive'
}

const INITIAL_USERS: UserAccount[] = [
  { id: 'U001', name: 'Dr. Rajesh Kumar Pandey', email: 'rkpandey@sgsits.ac.in', role: 'Teacher', department: 'Computer Science', status: 'active' },
  { id: 'U002', name: 'Prof. A. K. Sachan', email: 'aksachan@sgsits.ac.in', role: 'HOD', department: 'Computer Science', status: 'active' },
  { id: 'U003', name: 'Dr. Sunita Gupta', email: 'sgupta@sgsits.ac.in', role: 'Teacher', department: 'Computer Science', status: 'active' },
  { id: 'U004', name: 'Dr. Vivek Shrivastava', email: 'vshrivastava@sgsits.ac.in', role: 'Exam Controller', department: 'Exam Cell', status: 'active' },
  { id: 'U005', name: 'Shri Navneet Verma', email: 'nverma@sgsits.ac.in', role: 'Placement Officer', department: 'T&P Cell', status: 'active' },
]

const EMPTY_USER: Omit<UserAccount, 'id'> = {
  name: '',
  email: '',
  role: 'Teacher',
  department: 'Computer Science',
  status: 'active',
}

const AdminUsers: React.FC = () => {
  const [users, setUsers] = useState<UserAccount[]>(INITIAL_USERS)
  const [isOpen, setIsOpen] = useState(false)
  const [editing, setEditing] = useState<UserAccount | null>(null)
  const [form, setForm] = useState(EMPTY_USER)
  const [saving, setSaving] = useState(false)

  const handleAdd = () => {
    setEditing(null)
    setForm(EMPTY_USER)
    setIsOpen(true)
  }

  const handleEdit = (user: UserAccount) => {
    setEditing(user)
    setForm({
      name: user.name,
      email: user.email,
      role: user.role,
      department: user.department,
      status: user.status,
    })
    setIsOpen(true)
  }

  const handleDelete = (user: UserAccount) => {
    if (window.confirm(`Are you sure you want to delete user ${user.name}?`)) {
      setUsers(prev => prev.filter(u => u.id !== user.id))
    }
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    await new Promise(r => setTimeout(r, 500))

    if (editing) {
      setUsers(prev => prev.map(u => (u.id === editing.id ? { ...editing, ...form } : u)))
    } else {
      const id = `U${String(users.length + 1).padStart(3, '0')}`
      setUsers(prev => [...prev, { id, ...form }])
    }

    setSaving(false)
    setIsOpen(false)
  }

  const columns = [
    { header: 'Name', key: 'name' },
    { header: 'Email', key: 'email' },
    {
      header: 'Role',
      key: 'role',
      render: (u: UserAccount) => (
        <span className="font-semibold text-slate-700">{u.role}</span>
      ),
    },
    { header: 'Department', key: 'department' },
    {
      header: 'Status',
      key: 'status',
      render: (u: UserAccount) => (
        <StatusBadge label={u.status} color={u.status === 'active' ? 'green' : 'red'} />
      ),
    },
  ]

  return (
    <>
      <CrudPage
        title="User Management"
        subtitle="Create and manage HOD, Teacher, Exam Controller, and Placement Officer portal logins"
        addLabel="Add User"
        data={users}
        columns={columns}
        searchKeys={['name', 'email', 'role', 'department']}
        onAdd={handleAdd}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      <Modal isOpen={isOpen} title={editing ? `Edit User — ${editing.id}` : 'Create User Account'} onClose={() => setIsOpen(false)} width="max-w-md">
        <form onSubmit={handleSave} className="space-y-4">
          <FormField label="Full Name" required>
            <Input required value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="e.g. Dr. Rajesh Kumar Pandey" />
          </FormField>

          <FormField label="Email Address" required>
            <Input type="email" required value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} placeholder="e.g. email@sgsits.ac.in" />
          </FormField>

          <div className="grid grid-cols-2 gap-3">
            <FormField label="Role" required>
              <Select value={form.role} onChange={e => setForm(f => ({ ...f, role: e.target.value as UserAccount['role'] }))}>
                <option value="Teacher">Teacher</option>
                <option value="HOD">HOD</option>
                <option value="Exam Controller">Exam Controller</option>
                <option value="Placement Officer">Placement Officer</option>
              </Select>
            </FormField>

            <FormField label="Status" required>
              <Select value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value as UserAccount['status'] }))}>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </Select>
            </FormField>
          </div>

          <FormField label="Department / Cell" required>
            <Input required value={form.department} onChange={e => setForm(f => ({ ...f, department: e.target.value }))} placeholder="e.g. Computer Science / Exam Cell" />
          </FormField>

          <div className="flex gap-3 pt-3 border-t border-slate-100">
            <button type="button" onClick={() => setIsOpen(false)} className="flex-1 py-2 border border-slate-200 text-slate-700 rounded font-semibold text-sm hover:bg-slate-50">Cancel</button>
            <button type="submit" disabled={saving} className="flex-1 py-2 bg-primary text-white rounded font-semibold text-sm hover:bg-primary/90 disabled:opacity-60">{saving ? 'Saving...' : editing ? 'Update User' : 'Create User'}</button>
          </div>
        </form>
      </Modal>
    </>
  )
}

export default AdminUsers
