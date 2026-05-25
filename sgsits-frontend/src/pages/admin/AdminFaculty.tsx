import React, { useState, useEffect } from 'react'
import { Pencil, Trash2, Plus, X, User } from 'lucide-react'
import { mockStore } from '../../data/mockStore'
import type { FacultyMember } from '../../data/mockStore'

const DEPARTMENTS = [
  'Computer Engineering',
  'Information Technology',
  'Mechanical Engineering',
  'Civil Engineering',
  'Electronics & Instrumentation',
  'Electrical Engineering',
  'Applied Mathematics',
  'Applied Physics',
  'Pharmacy',
  'MBA',
  'MCA',
]

const EMPTY: Omit<FacultyMember, 'id'> = {
  name: '',
  designation: '',
  department: 'Computer Engineering',
  email: '',
  phone: '',
  photo: '',
  qualification: '',
  specialization: '',
  experience: '',
  publications: 0,
}

function Toast({ message, onClose }: { message: string; onClose: () => void }) {
  useEffect(() => { const t = setTimeout(onClose, 3000); return () => clearTimeout(t) }, [onClose])
  return (
    <div className="fixed bottom-4 right-4 z-50 bg-[#bfa15f] text-white px-5 py-3 rounded-lg shadow-lg flex items-center gap-3 text-sm font-medium">
      {message}<button onClick={onClose}><X size={14} /></button>
    </div>
  )
}

export default function AdminFaculty() {
  const [faculty, setFaculty] = useState<FacultyMember[]>([])
  const [showModal, setShowModal] = useState(false)
  const [editItem, setEditItem] = useState<FacultyMember | null>(null)
  const [form, setForm] = useState<Omit<FacultyMember, 'id'>>(EMPTY)
  const [deleteTarget, setDeleteTarget] = useState<FacultyMember | null>(null)
  const [toast, setToast] = useState('')
  const [search, setSearch] = useState('')

  useEffect(() => { setFaculty(mockStore.getFaculty()) }, [])

  const filtered = faculty.filter(f =>
    f.name.toLowerCase().includes(search.toLowerCase()) ||
    f.department.toLowerCase().includes(search.toLowerCase()) ||
    f.designation.toLowerCase().includes(search.toLowerCase())
  )

  const openAdd = () => { setEditItem(null); setForm(EMPTY); setShowModal(true) }
  const openEdit = (m: FacultyMember) => {
    setEditItem(m)
    setForm({ name: m.name, designation: m.designation, department: m.department, email: m.email, phone: m.phone ?? '', photo: m.photo ?? '', qualification: m.qualification, specialization: m.specialization, experience: m.experience, publications: m.publications ?? 0 })
    setShowModal(true)
  }
  const closeModal = () => { setShowModal(false); setEditItem(null) }

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault()
    if (editItem) { mockStore.updateFaculty(editItem.id, form); setToast('Faculty member updated!') }
    else { mockStore.addFaculty(form); setToast('Faculty member added!') }
    setFaculty(mockStore.getFaculty())
    closeModal()
  }

  const handleDelete = () => {
    if (!deleteTarget) return
    mockStore.deleteFaculty(deleteTarget.id)
    setFaculty(mockStore.getFaculty())
    setDeleteTarget(null)
    setToast('Faculty member deleted.')
  }

  const f = <K extends keyof Omit<FacultyMember, 'id'>>(key: K, val: Omit<FacultyMember, 'id'>[K]) =>
    setForm(prev => ({ ...prev, [key]: val }))

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-primary">Faculty Management</h1>
          <p className="text-sm text-slate-500 mt-0.5">Manage faculty profiles across all departments</p>
        </div>
        <button onClick={openAdd} className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-white text-sm font-semibold rounded-lg hover:bg-primary/90 transition-colors">
          <Plus size={16} /> Add Faculty
        </button>
      </div>

      <div className="flex items-center gap-4">
        <input
          className="border border-slate-300 rounded-lg px-3 py-2 text-sm w-72 focus:outline-none focus:ring-2 focus:ring-primary/30"
          placeholder="Search by name, department, designation..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <span className="text-sm text-slate-500">{filtered.length} member(s)</span>
      </div>

      <div className="bg-white border border-slate-200 rounded-lg overflow-hidden shadow-sm">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="text-left px-4 py-3 font-semibold text-slate-600">Name</th>
              <th className="text-left px-4 py-3 font-semibold text-slate-600">Designation</th>
              <th className="text-left px-4 py-3 font-semibold text-slate-600">Department</th>
              <th className="text-left px-4 py-3 font-semibold text-slate-600">Email</th>
              <th className="text-center px-4 py-3 font-semibold text-slate-600">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filtered.map(m => (
              <tr key={m.id} className="hover:bg-slate-50 transition-colors">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    {m.photo ? (
                      <img src={m.photo} alt="" className="w-9 h-9 rounded-full object-cover flex-shrink-0" />
                    ) : (
                      <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <User size={16} className="text-primary" />
                      </div>
                    )}
                    <div>
                      <p className="font-semibold text-slate-800">{m.name}</p>
                      <p className="text-xs text-slate-400">{m.qualification}</p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 text-xs text-slate-600">{m.designation}</td>
                <td className="px-4 py-3 text-xs text-slate-600">
                  <span className="px-2 py-0.5 bg-primary/10 text-primary rounded-full text-xs font-medium">{m.department}</span>
                </td>
                <td className="px-4 py-3 text-xs text-[#0b2545]">{m.email}</td>
                <td className="px-4 py-3 text-center">
                  <div className="inline-flex items-center gap-2">
                    <button onClick={() => openEdit(m)} className="p-1.5 rounded hover:bg-[#0b2545]/5 text-[#0b2545] transition-colors"><Pencil size={14} /></button>
                    <button onClick={() => setDeleteTarget(m)} className="p-1.5 rounded hover:bg-slate-100 text-slate-500 transition-colors"><Trash2 size={14} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && <div className="text-center py-12 text-slate-400">No faculty members found.</div>}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 z-40 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 sticky top-0 bg-white">
              <h2 className="font-display text-lg font-bold text-primary">{editItem ? 'Edit Faculty Member' : 'Add Faculty Member'}</h2>
              <button onClick={closeModal} className="p-1.5 rounded hover:bg-slate-100 text-slate-500"><X size={18} /></button>
            </div>
            <form onSubmit={handleSave} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Full Name <span className="text-[#bfa15f]">*</span></label>
                  <input required className="border border-slate-300 rounded px-3 py-2 w-full text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" value={form.name} onChange={e => f('name', e.target.value)} placeholder="Dr. Full Name" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Designation <span className="text-[#bfa15f]">*</span></label>
                  <input required className="border border-slate-300 rounded px-3 py-2 w-full text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" value={form.designation} onChange={e => f('designation', e.target.value)} placeholder="Professor & Head" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Department <span className="text-[#bfa15f]">*</span></label>
                <select required className="border border-slate-300 rounded px-3 py-2 w-full text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" value={form.department} onChange={e => f('department', e.target.value)}>
                  {DEPARTMENTS.map(d => <option key={d}>{d}</option>)}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Email <span className="text-[#bfa15f]">*</span></label>
                  <input type="email" required className="border border-slate-300 rounded px-3 py-2 w-full text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" value={form.email} onChange={e => f('email', e.target.value)} placeholder="faculty@sgsits.ac.in" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Phone</label>
                  <input className="border border-slate-300 rounded px-3 py-2 w-full text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" value={form.phone ?? ''} onChange={e => f('phone', e.target.value)} placeholder="+91-731-..." />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Qualification <span className="text-[#bfa15f]">*</span></label>
                  <input required className="border border-slate-300 rounded px-3 py-2 w-full text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" value={form.qualification} onChange={e => f('qualification', e.target.value)} placeholder="Ph.D. (IIT Bombay)" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Experience <span className="text-[#bfa15f]">*</span></label>
                  <input required className="border border-slate-300 rounded px-3 py-2 w-full text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" value={form.experience} onChange={e => f('experience', e.target.value)} placeholder="20 years" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Specialization <span className="text-[#bfa15f]">*</span></label>
                  <input required className="border border-slate-300 rounded px-3 py-2 w-full text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" value={form.specialization} onChange={e => f('specialization', e.target.value)} placeholder="Machine Learning, IoT" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Publications</label>
                  <input type="number" min={0} className="border border-slate-300 rounded px-3 py-2 w-full text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" value={form.publications ?? 0} onChange={e => f('publications', parseInt(e.target.value) || 0)} />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Photo URL</label>
                <input className="border border-slate-300 rounded px-3 py-2 w-full text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" value={form.photo ?? ''} onChange={e => f('photo', e.target.value)} placeholder="https://..." />
              </div>
              <div className="flex gap-3 pt-2 border-t border-slate-100">
                <button type="button" onClick={closeModal} className="flex-1 py-2 border border-slate-300 text-slate-700 rounded font-semibold text-sm hover:bg-slate-50">Cancel</button>
                <button type="submit" className="flex-1 py-2 bg-primary text-white rounded font-semibold text-sm hover:bg-primary/90">{editItem ? '✓ Update Faculty' : '+ Add Faculty'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {deleteTarget && (
        <div className="fixed inset-0 bg-black/50 z-40 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-sm p-6 text-center">
            <div className="w-12 h-12 bg-[#0b2545]/10 rounded-full flex items-center justify-center mx-auto mb-3"><Trash2 size={22} className="text-[#0b2545]" /></div>
            <h3 className="font-bold text-slate-800 text-lg mb-1">Delete Faculty?</h3>
            <p className="text-slate-500 text-sm mb-5">{deleteTarget.name}</p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteTarget(null)} className="flex-1 py-2 border border-slate-300 text-slate-700 rounded font-semibold text-sm hover:bg-slate-50">Cancel</button>
              <button onClick={handleDelete} className="flex-1 py-2 bg-[#0b2545] text-white rounded font-semibold text-sm hover:bg-[#0b2545]/90">Delete</button>
            </div>
          </div>
        </div>
      )}

      {toast && <Toast message={toast} onClose={() => setToast('')} />}
    </div>
  )
}
