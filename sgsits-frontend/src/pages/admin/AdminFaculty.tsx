import React, { useState, useEffect } from 'react'
import { Pencil, Trash2, Plus, X, User, Loader2, Eye, EyeOff } from 'lucide-react'
import { facultyAPI } from '../../api/index'
import AttachmentUpload from '../../components/admin/AttachmentUpload'
import AdminPreviewPanel from '../../components/admin/AdminPreviewPanel'
import type { AttachmentRecord } from '../../api/index'
import { mediaUrl } from '../../utils/mediaUrl'
import apiClient from '../../api/client'

interface LocalFaculty {
  id: string
  user_id: number | null
  teacher_name: string
  teacher_email: string
  department_id: number | null
  department_name: string
  designation: string
  qualification: string
  specialization: string
  experience: string
  bio: string
  publications: number
  profile_image_file_id: number | null
  profile_image_url: string
  status: string
}

interface DeptOption { id: number; name: string }
interface UserOption { id: number; name: string; email: string }

function mapFromApi(f: Record<string, unknown>): LocalFaculty {
  return {
    id:                    String(f.id ?? ''),
    user_id:               f.user_id != null ? Number(f.user_id) : null,
    teacher_name:          String(f.teacher_name ?? f.name ?? ''),
    teacher_email:         String(f.teacher_email ?? f.email ?? ''),
    department_id:         f.department_id != null ? Number(f.department_id) : null,
    department_name:       String(f.department_name ?? ''),
    designation:           String(f.designation ?? ''),
    qualification:         String(f.qualification ?? ''),
    specialization:        String(f.specialization ?? ''),
    experience:            String(f.experience ?? ''),
    bio:                   String(f.bio ?? ''),
    publications:          Number(f.publications ?? 0),
    profile_image_file_id: f.profile_image_file_id != null ? Number(f.profile_image_file_id) : null,
    profile_image_url:     mediaUrl(String(f.profile_image_url ?? '')),
    status:                String(f.status ?? 'ACTIVE'),
  }
}

const EMPTY_FORM = {
  user_id: null as number | null,
  department_id: null as number | null,
  designation: '',
  qualification: '',
  specialization: '',
  experience: '',
  bio: '',
  publications: 0,
  profile_image_file_id: null as number | null,
}

function Toast({ message, onClose }: { message: string; onClose: () => void }) {
  useEffect(() => { const t = setTimeout(onClose, 3000); return () => clearTimeout(t) }, [onClose])
  return (
    <div className="fixed bottom-4 right-4 z-50 bg-accent text-white px-5 py-3 rounded-lg shadow-lg flex items-center gap-3 text-sm font-medium">
      {message}<button onClick={onClose}><X size={14} /></button>
    </div>
  )
}

export default function AdminFaculty() {
  const [faculty, setFaculty]           = useState<LocalFaculty[]>([])
  const [departments, setDepartments]   = useState<DeptOption[]>([])
  const [teacherUsers, setTeacherUsers] = useState<UserOption[]>([])
  const [showModal, setShowModal]       = useState(false)
  const [editItem, setEditItem]         = useState<LocalFaculty | null>(null)
  const [form, setForm]                 = useState({ ...EMPTY_FORM })
  const [imageRecord, setImageRecord]   = useState<AttachmentRecord | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<LocalFaculty | null>(null)
  const [saving, setSaving]             = useState(false)
  const [toast, setToast]               = useState('')
  const [search, setSearch]             = useState('')
  const [showPreview, setShowPreview]   = useState(false)

  const load = async () => {
    try {
      const items = await facultyAPI.getAll()
      setFaculty((items as unknown as Record<string, unknown>[]).map(mapFromApi))
    } catch {
      setFaculty([])
    }
  }

  const loadDepts = async () => {
    try {
      const res = await apiClient.get('/v1/departments', { params: { pageSize: 100 } })
      const data = res.data?.data
      const rows = Array.isArray(data?.departments) ? data.departments : Array.isArray(data) ? data : []
      setDepartments(rows.map((d: Record<string, unknown>) => ({ id: Number(d.id), name: String(d.name) })))
    } catch { setDepartments([]) }
  }

  const loadTeacherUsers = async () => {
    try {
      const res = await apiClient.get('/v1/users', { params: { role: 'TEACHER', pageSize: 200 } })
      const data = res.data?.data
      const rows = Array.isArray(data?.users) ? data.users : Array.isArray(data) ? data : []
      setTeacherUsers(rows.map((u: Record<string, unknown>) => ({
        id: Number(u.id), name: String(u.name), email: String(u.email)
      })))
    } catch { setTeacherUsers([]) }
  }

  useEffect(() => {
    load()
    loadDepts()
    loadTeacherUsers()
  }, [])

  const filtered = faculty.filter(f =>
    f.teacher_name.toLowerCase().includes(search.toLowerCase()) ||
    f.department_name.toLowerCase().includes(search.toLowerCase()) ||
    f.designation.toLowerCase().includes(search.toLowerCase())
  )

  const openAdd = () => {
    setEditItem(null)
    setForm({ ...EMPTY_FORM })
    setImageRecord(null)
    setShowModal(true)
  }

  const openEdit = (m: LocalFaculty) => {
    setEditItem(m)
    setForm({
      user_id:               m.user_id,
      department_id:         m.department_id,
      designation:           m.designation,
      qualification:         m.qualification,
      specialization:        m.specialization,
      experience:            m.experience,
      bio:                   m.bio,
      publications:          m.publications,
      profile_image_file_id: m.profile_image_file_id,
    })
    setImageRecord(
      m.profile_image_file_id ? {
        id: m.profile_image_file_id,
        attachment_type: 'FILE',
        original_name: 'Profile Photo',
        stored_name: null,
        file_url: m.profile_image_url,
        external_url: null, thumbnail_url: m.profile_image_url,
        alt_text: null, meta_title: null, meta_description: null,
        file_type: 'image/jpeg', file_size: null, storage_type: 'LOCAL',
        uploaded_by: 0, uploader_name: '', created_at: '',
      } : null
    )
    setShowModal(true)
  }

  const closeModal = () => { setShowModal(false); setEditItem(null); setImageRecord(null) }

  const handleImageAttached = (record: AttachmentRecord) => {
    setImageRecord(record)
    setForm(f => ({ ...f, profile_image_file_id: record.id }))
  }

  const handleImageCleared = () => {
    setImageRecord(null)
    setForm(f => ({ ...f, profile_image_file_id: null }))
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editItem && !form.user_id) { setToast('Please select a teacher user'); return }
    if (!form.department_id) { setToast('Please select a department'); return }
    if (!form.designation.trim()) { setToast('Designation is required'); return }

    setSaving(true)
    const payload: Record<string, unknown> = {
      designation:           form.designation.trim(),
      qualification:         form.qualification || null,
      specialization:        form.specialization || null,
      experience:            form.experience || null,
      bio:                   form.bio || null,
      publications:          form.publications || null,
    }
    if (!editItem) {
      payload.user_id       = form.user_id
      payload.department_id = form.department_id
    }
    if (form.profile_image_file_id) {
      payload.profile_image_file_id = form.profile_image_file_id
    }

    try {
      if (editItem) {
        await facultyAPI.update(editItem.id, payload as never)
        setToast('Faculty profile updated!')
      } else {
        await facultyAPI.create(payload as never)
        setToast('Faculty profile created!')
      }
      await load()
      closeModal()
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } }; message?: string })
        ?.response?.data?.message || 'Failed to save faculty profile.'
      setToast(msg)
    }
    setSaving(false)
  }

  const handleDelete = async () => {
    if (!deleteTarget) return
    try {
      await facultyAPI.delete(deleteTarget.id)
      setToast('Faculty profile removed.')
      await load()
    } catch {
      setToast('Failed to remove faculty profile.')
    }
    setDeleteTarget(null)
  }

  const previewData = { name: form.teacher_name, designation: form.designation, department: form.department_name, email: form.teacher_email, photoUrl: form.profile_image_url, qualification: form.qualification }

  return (
    <div className="flex gap-0 h-full">
    <div className="flex-1 min-w-0 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-primary">Faculty Management</h1>
          <p className="text-sm text-slate-500 mt-0.5">Manage faculty profiles. Profiles are linked to existing TEACHER accounts.</p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => setShowPreview(p => !p)} className={`inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded border transition-colors ${showPreview ? 'bg-primary text-white border-primary' : 'text-slate-600 border-slate-200 hover:bg-slate-50'}`}>
            {showPreview ? <><EyeOff size={13}/>Hide Preview</> : <><Eye size={13}/>Live Preview</>}
          </button>
          <button onClick={openAdd} className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-white text-sm font-semibold rounded-lg hover:bg-primary/90 transition-colors">
            <Plus size={16} /> Add Profile
          </button>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <input
          className="border border-slate-300 rounded-lg px-3 py-2 text-sm w-72 focus:outline-none focus:ring-2 focus:ring-primary/30"
          placeholder="Search by name, department, designation..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <span className="text-sm text-slate-500">{filtered.length} profile(s)</span>
      </div>

      <div className="bg-white border border-slate-200 rounded-lg overflow-hidden shadow-sm">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="text-left px-4 py-3 font-semibold text-slate-600">Photo</th>
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
                  {m.profile_image_url && !m.profile_image_url.includes('placeholder') ? (
                    <img src={m.profile_image_url} alt={m.teacher_name} className="w-10 h-10 rounded-full object-cover border border-slate-200" />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <User size={18} className="text-primary" />
                    </div>
                  )}
                </td>
                <td className="px-4 py-3">
                  <p className="font-medium text-slate-800">{m.teacher_name}</p>
                </td>
                <td className="px-4 py-3 text-slate-600 text-xs">{m.designation}</td>
                <td className="px-4 py-3 text-slate-500 text-xs">{m.department_name}</td>
                <td className="px-4 py-3 text-slate-400 text-xs">{m.teacher_email}</td>
                <td className="px-4 py-3 text-center">
                  <div className="inline-flex items-center gap-2">
                    <button onClick={() => openEdit(m)} className="p-1.5 rounded hover:bg-primary/5 text-primary transition-colors" title="Edit">
                      <Pencil size={14} />
                    </button>
                    <button onClick={() => setDeleteTarget(m)} className="p-1.5 rounded hover:bg-slate-100 text-slate-500 transition-colors" title="Remove">
                      <Trash2 size={14} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <div className="text-center py-12 text-slate-400">No faculty profiles found.</div>
        )}
      </div>

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 z-40 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 sticky top-0 bg-white z-10">
              <h2 className="font-display text-lg font-bold text-primary">
                {editItem ? `Edit: ${editItem.teacher_name}` : 'Add Faculty Profile'}
              </h2>
              <button onClick={closeModal} className="p-1.5 rounded hover:bg-slate-100 text-slate-500">
                <X size={18} />
              </button>
            </div>
            <form onSubmit={handleSave} className="p-6 space-y-4">
              {/* Teacher selection — only for new profiles */}
              {!editItem && (
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">
                    Teacher Account <span className="text-accent">*</span>
                  </label>
                  <select
                    required
                    className="border border-slate-300 rounded px-3 py-2 w-full text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                    value={form.user_id ?? ''}
                    onChange={e => setForm(f => ({ ...f, user_id: e.target.value ? Number(e.target.value) : null }))}
                  >
                    <option value="">— Select TEACHER user —</option>
                    {teacherUsers.map(u => (
                      <option key={u.id} value={u.id}>{u.name} ({u.email})</option>
                    ))}
                  </select>
                  {teacherUsers.length === 0 && (
                    <p className="text-xs text-amber-600 mt-1">No TEACHER users found. Create a user with TEACHER role first.</p>
                  )}
                </div>
              )}

              {/* Department */}
              {!editItem && (
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">
                    Department <span className="text-accent">*</span>
                  </label>
                  <select
                    required
                    className="border border-slate-300 rounded px-3 py-2 w-full text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                    value={form.department_id ?? ''}
                    onChange={e => setForm(f => ({ ...f, department_id: e.target.value ? Number(e.target.value) : null }))}
                  >
                    <option value="">— Select Department —</option>
                    {departments.map(d => (
                      <option key={d.id} value={d.id}>{d.name}</option>
                    ))}
                  </select>
                </div>
              )}

              {/* Designation */}
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">
                  Designation <span className="text-accent">*</span>
                </label>
                <input
                  required
                  className="border border-slate-300 rounded px-3 py-2 w-full text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                  value={form.designation}
                  onChange={e => setForm(f => ({ ...f, designation: e.target.value }))}
                  placeholder="e.g. Assistant Professor"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Qualification</label>
                  <input
                    className="border border-slate-300 rounded px-3 py-2 w-full text-sm focus:outline-none"
                    value={form.qualification}
                    onChange={e => setForm(f => ({ ...f, qualification: e.target.value }))}
                    placeholder="e.g. Ph.D. Computer Science"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Experience</label>
                  <input
                    className="border border-slate-300 rounded px-3 py-2 w-full text-sm focus:outline-none"
                    value={form.experience}
                    onChange={e => setForm(f => ({ ...f, experience: e.target.value }))}
                    placeholder="e.g. 10 years"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Specialization</label>
                <input
                  className="border border-slate-300 rounded px-3 py-2 w-full text-sm focus:outline-none"
                  value={form.specialization}
                  onChange={e => setForm(f => ({ ...f, specialization: e.target.value }))}
                  placeholder="e.g. Machine Learning, Data Structures"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Bio</label>
                <textarea
                  rows={2}
                  className="border border-slate-300 rounded px-3 py-2 w-full text-sm focus:outline-none resize-none"
                  value={form.bio}
                  onChange={e => setForm(f => ({ ...f, bio: e.target.value }))}
                  placeholder="Brief faculty biography..."
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Publications Count</label>
                <input
                  type="number"
                  min="0"
                  className="border border-slate-300 rounded px-3 py-2 w-full text-sm focus:outline-none"
                  value={form.publications}
                  onChange={e => setForm(f => ({ ...f, publications: parseInt(e.target.value) || 0 }))}
                />
              </div>

              {/* Profile Photo */}
              <AttachmentUpload
                usage="faculty"
                label="Profile Photo (optional)"
                onAttached={handleImageAttached}
                onClear={handleImageCleared}
                initialValue={imageRecord}
              />

              {/* Preview */}
              {imageRecord && (
                <div className="flex items-center gap-3 bg-slate-50 rounded-lg p-3">
                  <img
                    src={mediaUrl(imageRecord.file_url)}
                    alt="Preview"
                    className="w-16 h-16 rounded-full object-cover border border-slate-200"
                    onError={e => { (e.target as HTMLImageElement).style.display = 'none' }}
                  />
                  <div>
                    <p className="text-xs font-medium text-slate-700">{imageRecord.original_name}</p>
                    <p className="text-xs text-slate-400">Profile photo preview</p>
                  </div>
                </div>
              )}

              <div className="flex gap-3 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={closeModal}
                  className="flex-1 py-2 border border-slate-300 text-slate-700 rounded font-semibold text-sm hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 py-2 bg-primary text-white rounded font-semibold text-sm hover:bg-primary/90 disabled:opacity-60 flex items-center justify-center gap-2"
                >
                  {saving ? <><Loader2 size={14} className="animate-spin" /> Saving…</> : editItem ? '✓ Update Profile' : '+ Add Profile'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {deleteTarget && (
        <div className="fixed inset-0 bg-black/50 z-40 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-sm p-6 text-center">
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
              <Trash2 size={22} className="text-primary" />
            </div>
            <h3 className="font-bold text-slate-800 text-lg mb-1">Remove Faculty Profile?</h3>
            <p className="text-slate-500 text-sm mb-5">"{deleteTarget.teacher_name}"</p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteTarget(null)} className="flex-1 py-2 border border-slate-300 text-slate-700 rounded font-semibold text-sm hover:bg-slate-50">Cancel</button>
              <button onClick={handleDelete} className="flex-1 py-2 bg-primary text-white rounded font-semibold text-sm hover:bg-primary/90">Remove</button>
            </div>
          </div>
        </div>
      )}

      {toast && <Toast message={toast} onClose={() => setToast('')} />}
    </div>
    {showPreview && <AdminPreviewPanel type="faculty" data={previewData} onClose={() => setShowPreview(false)} />}
    </div>
  )
}
