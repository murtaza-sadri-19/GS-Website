import React, { useMemo, useState, useEffect } from 'react'
import { PageHeader, PortalCard, PortalTable, PortalModal, Badge } from '../../components/layout/PortalLayout'
import { getSubjects, type FacultyMember, type Subject } from '../../services/examService'
import { useAdminStore } from '../../store/adminStore'
import { Search, BookPlus, Mail, Phone, X, UserPlus, KeyRound, Copy, CheckCheck, AlertTriangle, Loader2, UserMinus, Crown } from 'lucide-react'
import apiClient from '../../api/client'

// FacultyMember extended with a real backend user id (set when loaded from API)
type FacultyMemberEx = FacultyMember & { user_id?: number }

const HOD_BRANCH = 'CSE'

// ── Add-teacher form state ─────────────────────────────────────────────────

interface TeacherForm {
  name: string
  email: string
  phone: string
}

const EMPTY_TEACHER: TeacherForm = { name: '', email: '', phone: '' }

// ── Password reveal banner ─────────────────────────────────────────────────

const PasswordBanner: React.FC<{
  name: string
  password: string
  onClose: () => void
}> = ({ name, password, onClose }) => {
  const [copied, setCopied] = useState(false)

  const copy = () => {
    navigator.clipboard.writeText(password).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  return (
    <PortalModal isOpen title={`Teacher Account Created`} onClose={onClose} width="max-w-md">
      <div className="space-y-4">
        <div className="flex items-start gap-2.5 p-3 bg-amber-50 border border-amber-200 rounded-lg">
          <AlertTriangle size={15} className="text-amber-600 mt-0.5 shrink-0" />
          <p className="text-xs text-amber-800 leading-relaxed">
            Share this password securely with <strong>{name}</strong>. It is shown{' '}
            <strong>only once</strong> — they can change it after their first login.
          </p>
        </div>

        <div className="space-y-1">
          <p className="text-xs font-semibold text-slate-600">Initial Password</p>
          <div className="flex items-center gap-2">
            <div className="flex-1 flex items-center gap-2 font-mono text-sm bg-slate-100 border border-slate-200 rounded px-3 py-2.5">
              <KeyRound size={13} className="text-slate-400 shrink-0" />
              <span className="text-slate-800 font-bold tracking-wider select-all">{password}</span>
            </div>
            <button
              onClick={copy}
              className="shrink-0 flex items-center gap-1.5 px-3 py-2.5 bg-[#0b2545] text-white text-xs font-bold rounded hover:bg-[#0b2545]/90 transition-colors"
            >
              {copied ? <CheckCheck size={12} /> : <Copy size={12} />}
              {copied ? 'Copied' : 'Copy'}
            </button>
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-full py-2 bg-green-600 text-white text-sm font-bold rounded hover:bg-green-700 transition-colors"
        >
          Done — password saved
        </button>
      </div>
    </PortalModal>
  )
}

// ── Main component ─────────────────────────────────────────────────────────

const HodFaculty: React.FC = () => {
  const { user } = useAdminStore()
  const hodBranch = user?.department_id ? String(user.department_id) : HOD_BRANCH

  const [faculty, setFaculty]       = useState<FacultyMemberEx[]>([])
  const [loading, setLoading]       = useState(true)
  const [search, setSearch]         = useState('')
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'on_leave'>('all')
  const [allocating, setAllocating] = useState<FacultyMemberEx | null>(null)
  const [removing, setRemoving]     = useState<string | null>(null)  // faculty id being removed
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>([])
  const [toast, setToast]           = useState('')

  // Add-teacher state
  const [addOpen, setAddOpen]       = useState(false)
  const [teacherForm, setTeacherForm] = useState<TeacherForm>(EMPTY_TEACHER)
  const [addSaving, setAddSaving]   = useState(false)
  const [addError, setAddError]     = useState('')
  const [newPassword, setNewPassword] = useState<{ name: string; password: string } | null>(null)

  const [allSubjects, setAllSubjects] = useState<Subject[]>([])

  useEffect(() => {
    let cancelled = false
    setLoading(true)

    // HOD self-entry — always first row so HOD can allot subjects to themselves
    const hodSelf: FacultyMemberEx | null = user ? {
      id:             `hod-self-${user.id}`,
      user_id:        user.id,
      name:           user.name,
      email:          user.email,
      phone:          '—',
      employeeId:     '—',
      designation:    'Head of Department',
      specialization: '',
      subjects:       [],
      status:         'active',
      branch_id:      hodBranch,
      joinDate:       '',
    } : null

    apiClient.get('/v1/users?pageSize=200')
      .then(res => {
        if (cancelled) return
        const apiUsers = (
          (res.data as { data: { users: { id: number; name: string; email: string; phone: string | null; status: string }[] } }).data.users
        )
        const mapped: FacultyMemberEx[] = apiUsers.map(u => ({
          id:             String(u.id),
          user_id:        u.id,
          name:           u.name,
          email:          u.email,
          phone:          u.phone || '—',
          employeeId:     '—',
          designation:    'Teacher',
          specialization: '',
          subjects:       [],
          status:         u.status === 'ACTIVE' ? 'active' : 'on_leave',
          branch_id:      hodBranch,
          joinDate:       '',
        }))
        setFaculty(hodSelf ? [hodSelf, ...mapped] : mapped)
      })
      .catch(() => {
        if (!cancelled) setFaculty(hodSelf ? [hodSelf] : [])
      })
      .finally(() => { if (!cancelled) setLoading(false) })
    return () => { cancelled = true }
  }, [hodBranch, user])

  useEffect(() => {
    getSubjects(hodBranch).then(setAllSubjects)
  }, [hodBranch])

  const branchSubjects = useMemo(
    () => allSubjects.filter(s => s.branch_id === hodBranch),
    [allSubjects, hodBranch]
  )

  const visible = useMemo(() => {
    return faculty.filter(f => {
      if (statusFilter !== 'all' && f.status !== statusFilter) return false
      if (search.trim()) {
        const q = search.toLowerCase()
        if (!f.name.toLowerCase().includes(q) && !f.employeeId.toLowerCase().includes(q)) return false
      }
      return true
    })
  }, [faculty, search, statusFilter])

  // ── Subject allocation ───────────────────────────────────────────────────

  const openAllocate = (f: FacultyMemberEx) => {
    setAllocating(f)
    setSelectedSubjects(f.subjects)
  }

  const toggleSubject = (subjectId: string) => {
    setSelectedSubjects(prev =>
      prev.includes(subjectId) ? prev.filter(s => s !== subjectId) : [...prev, subjectId]
    )
  }

  const saveAllocation = () => {
    if (!allocating) return
    setFaculty(prev => prev.map(f =>
      f.id === allocating.id ? { ...f, subjects: selectedSubjects } : f
    ))
    setToast(`Subjects updated for ${allocating.name}.`)
    setTimeout(() => setToast(''), 2400)
    setAllocating(null)
  }

  // ── Remove teacher (deactivate) ──────────────────────────────────────────

  const handleRemoveTeacher = async (f: FacultyMemberEx) => {
    if (!window.confirm(`Remove ${f.name} from your department? They will lose portal access.`)) return
    if (!f.user_id) {
      // Mock-only record: just remove from local list
      setFaculty(prev => prev.filter(m => m.id !== f.id))
      setToast(`${f.name} removed.`)
      setTimeout(() => setToast(''), 2400)
      return
    }
    setRemoving(f.id)
    try {
      await apiClient.patch(`/v1/users/${f.user_id}/status`, { status: 'INACTIVE' })
      setFaculty(prev => prev.filter(m => m.id !== f.id))
      setToast(`${f.name} has been removed.`)
      setTimeout(() => setToast(''), 2400)
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message
      alert(msg ?? 'Failed to remove teacher. Please try again.')
    } finally {
      setRemoving(null)
    }
  }

  // ── Add teacher ──────────────────────────────────────────────────────────

  const openAdd = () => {
    setTeacherForm(EMPTY_TEACHER)
    setAddError('')
    setAddOpen(true)
  }

  const handleAddTeacher = async (e: React.FormEvent) => {
    e.preventDefault()
    setAddError('')
    setAddSaving(true)
    try {
      // Backend enforces: HOD can only create TEACHER in their department.
      // We fetch the TEACHER role_id from the roles endpoint first.
      const rolesRes = await apiClient.get('/v1/users/roles')
      const roles = (rolesRes.data as { data: { id: number; role_name: string }[] }).data
      const teacherRole = roles.find(r => r.role_name === 'TEACHER')
      if (!teacherRole) throw new Error('TEACHER role not found')

      const payload: Record<string, unknown> = {
        name:    teacherForm.name.trim(),
        email:   teacherForm.email.trim(),
        role_id: teacherRole.id,
      }
      if (teacherForm.phone.trim()) payload.phone = teacherForm.phone.trim()

      const res = await apiClient.post('/v1/users', payload)
      const data = (res.data as { data: { user: { id: number; name: string; email: string }; initial_password: string } }).data

      // Add to local faculty list as a stub so the HOD sees the new member immediately
      const stub: FacultyMemberEx = {
        id:             String(Date.now()),
        user_id:        data.user.id,
        name:           data.user.name,
        email:          data.user.email,
        phone:          teacherForm.phone.trim() || '—',
        employeeId:     '—',
        designation:    'Teacher',
        specialization: '',
        subjects:       [],
        status:         'active',
        branch_id:      hodBranch,
        joinDate:       '',
      }
      setFaculty(prev => [stub, ...prev])
      setAddOpen(false)
      setNewPassword({ name: data.user.name, password: data.initial_password })
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message
      setAddError(msg ?? (err as Error).message ?? 'Failed to create teacher account.')
    } finally {
      setAddSaving(false)
    }
  }

  return (
    <div className="space-y-5">
      <PageHeader
        title="Department Faculty"
        subtitle="Roster, subject allocation, and teacher accounts"
      />

      {/* Search + filter + add-teacher button */}
      <PortalCard className="!p-3">
        <div className="flex flex-col sm:flex-row gap-2.5">
          <div className="relative flex-1 min-w-0">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search by name or employee ID…"
              className="w-full pl-9 pr-3 py-2 text-sm border border-slate-200 rounded focus:outline-none focus:border-[#0b2545] bg-white"
            />
          </div>
          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value as 'all' | 'active' | 'on_leave')}
            className="border border-slate-200 rounded px-3 py-2 text-sm bg-white focus:outline-none focus:border-[#0b2545]"
          >
            <option value="all">All Statuses</option>
            <option value="active">Active</option>
            <option value="on_leave">On Leave</option>
          </select>
          <button
            onClick={openAdd}
            className="inline-flex items-center gap-2 px-4 py-2 bg-[#0b2545] text-white text-sm font-bold rounded hover:bg-[#0b2545]/90 transition-colors shrink-0"
          >
            <UserPlus size={14} />
            Add Teacher
          </button>
        </div>
      </PortalCard>

      {/* Faculty table */}
      <PortalCard className="!p-0 overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center gap-2 text-slate-400 py-12">
            <Loader2 size={18} className="animate-spin" />
            <span className="text-sm">Loading faculty…</span>
          </div>
        ) : (
          <PortalTable
            headers={['Faculty', 'Employee ID', 'Designation', 'Specialization', 'Allotted Subjects', 'Status', 'Actions']}
            rows={visible}
            empty="No faculty members match the filters."
            renderRow={f => {
              const isSelf = f.user_id === user?.id
              return (
                <tr
                  key={f.id}
                  className={`hover:bg-slate-50/60 transition-colors ${isSelf ? 'bg-[#bfa15f]/5' : ''}`}
                >
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="text-sm font-semibold text-slate-800">{f.name}</p>
                      {isSelf && (
                        <span className="inline-flex items-center gap-0.5 text-[9px] font-bold bg-[#bfa15f]/10 text-[#bfa15f] border border-[#bfa15f]/30 px-1.5 py-0.5 rounded uppercase tracking-wide">
                          <Crown size={9} /> You (HOD)
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-[11px] text-slate-500 mt-1">
                      <Mail size={11} /><span>{f.email}</span>
                      <span className="text-slate-300">·</span>
                      <Phone size={11} /><span>{f.phone}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-xs font-mono text-slate-700">{f.employeeId}</td>
                  <td className="px-4 py-3 text-xs text-slate-600">{f.designation}</td>
                  <td className="px-4 py-3 text-xs text-slate-600">{f.specialization}</td>
                  <td className="px-4 py-3">
                    {f.subjects.length === 0 ? (
                      <span className="text-xs text-slate-400 italic">None allotted</span>
                    ) : (
                      <div className="flex flex-wrap gap-1">
                        {f.subjects.map(sid => (
                          <span key={sid} className="text-[10px] font-mono font-bold bg-[#0b2545]/10 text-[#0b2545] border border-[#0b2545]/20 px-1.5 py-0.5 rounded">
                            {sid}
                          </span>
                        ))}
                      </div>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    {f.status === 'active'
                      ? <Badge label="Active" variant="success" />
                      : <Badge label="On Leave" variant="warning" />}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => openAllocate(f)}
                        className="inline-flex items-center gap-1 text-[11px] font-bold text-[#0b2545] hover:bg-[#0b2545]/5 border border-[#0b2545]/20 px-2.5 py-1 rounded transition-colors"
                      >
                        <BookPlus size={12} /> Allot Subjects
                      </button>
                      {!isSelf && (
                        <button
                          onClick={() => handleRemoveTeacher(f)}
                          disabled={removing === f.id}
                          title="Remove teacher from department"
                          className="inline-flex items-center gap-1 text-[11px] font-bold text-red-600 hover:bg-red-50 border border-red-200 px-2.5 py-1 rounded transition-colors disabled:opacity-50"
                        >
                          {removing === f.id
                            ? <Loader2 size={12} className="animate-spin" />
                            : <UserMinus size={12} />
                          }
                          Remove
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              )
            }}
          />
        )}
      </PortalCard>

      {/* ── Add Teacher Modal ─────────────────────────────────────────────── */}
      <PortalModal
        isOpen={addOpen}
        title="Add Teacher to Department"
        onClose={() => setAddOpen(false)}
        width="max-w-md"
      >
        <form onSubmit={handleAddTeacher} className="space-y-4">
          <p className="text-xs text-slate-500">
            Creates a new Teacher portal account for your department. A login password will be generated automatically.
          </p>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Full Name <span className="text-red-500">*</span></label>
            <input
              required
              type="text"
              value={teacherForm.name}
              onChange={e => setTeacherForm(f => ({ ...f, name: e.target.value }))}
              placeholder="e.g. Dr. Anjali Sharma"
              className="w-full border border-slate-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#0b2545]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Email Address <span className="text-red-500">*</span></label>
            <input
              required
              type="email"
              value={teacherForm.email}
              onChange={e => setTeacherForm(f => ({ ...f, email: e.target.value }))}
              placeholder="e.g. anjali@sgsits.ac.in"
              className="w-full border border-slate-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#0b2545]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Phone (optional)</label>
            <input
              type="tel"
              value={teacherForm.phone}
              onChange={e => setTeacherForm(f => ({ ...f, phone: e.target.value }))}
              placeholder="e.g. +91-9876543210"
              className="w-full border border-slate-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#0b2545]"
            />
          </div>

          {addError && (
            <div className="flex items-start gap-2 p-2.5 bg-red-50 border border-red-200 rounded text-xs text-red-700">
              <AlertTriangle size={13} className="mt-0.5 shrink-0" />
              {addError}
            </div>
          )}

          <div className="flex gap-2.5 pt-2 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setAddOpen(false)}
              className="flex-1 py-2 border border-slate-200 text-slate-700 text-sm font-semibold rounded hover:bg-slate-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={addSaving}
              className="flex-1 py-2 bg-[#0b2545] text-white text-sm font-bold rounded hover:bg-[#0b2545]/90 disabled:opacity-60 transition-colors flex items-center justify-center gap-2"
            >
              {addSaving && <Loader2 size={13} className="animate-spin" />}
              {addSaving ? 'Creating…' : 'Create Teacher Account'}
            </button>
          </div>
        </form>
      </PortalModal>

      {/* ── Subject Allocation Modal ─────────────────────────────────────── */}
      <PortalModal
        isOpen={!!allocating}
        title={`Allot Subjects — ${allocating?.name ?? ''}`}
        onClose={() => setAllocating(null)}
        width="max-w-xl"
      >
        <div className="space-y-3">
          <p className="text-xs text-slate-500">
            Select subjects to allot. Allocations are reflected in the faculty profile and timetable.
          </p>

          {selectedSubjects.length > 0 && (
            <div className="bg-slate-50 border border-slate-100 rounded-lg p-3">
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wide mb-1.5">Selected</p>
              <div className="flex flex-wrap gap-1.5">
                {selectedSubjects.map(sid => (
                  <span
                    key={sid}
                    className="inline-flex items-center gap-1 text-[11px] font-mono font-bold bg-[#0b2545] text-white px-2 py-0.5 rounded"
                  >
                    {sid}
                    <button onClick={() => toggleSubject(sid)} className="hover:opacity-70">
                      <X size={11} />
                    </button>
                  </span>
                ))}
              </div>
            </div>
          )}

          <div className="space-y-1.5 max-h-72 overflow-y-auto pr-1">
            {[1, 2, 3, 4, 5, 6, 7, 8].map(sem => {
              const semSubs = branchSubjects.filter(s => s.semester === sem)
              if (semSubs.length === 0) return null
              return (
                <div key={sem}>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-2 mb-1">Semester {sem}</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                    {semSubs.map((s: Subject) => {
                      const checked = selectedSubjects.includes(s.id)
                      return (
                        <label
                          key={s.id}
                          className={`flex items-start gap-2 p-2 rounded border cursor-pointer transition-all ${
                            checked ? 'border-[#0b2545]/40 bg-[#0b2545]/5' : 'border-slate-200 hover:border-slate-300'
                          }`}
                        >
                          <input
                            type="checkbox"
                            checked={checked}
                            onChange={() => toggleSubject(s.id)}
                            className="mt-0.5 accent-[#0b2545]"
                          />
                          <div className="min-w-0">
                            <p className="text-[11px] font-mono font-bold text-[#0b2545]">{s.id}</p>
                            <p className="text-xs text-slate-700 truncate">{s.name}</p>
                            <p className="text-[10px] text-slate-400">{s.type} · {s.credits} cr</p>
                          </div>
                        </label>
                      )
                    })}
                  </div>
                </div>
              )
            })}
          </div>

          <div className="flex gap-2.5 pt-2 border-t border-slate-100">
            <button
              onClick={() => setAllocating(null)}
              className="flex-1 py-2 border border-slate-200 text-slate-700 text-sm font-semibold rounded hover:bg-slate-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={saveAllocation}
              className="flex-1 py-2 bg-[#0b2545] text-white text-sm font-bold rounded hover:bg-[#0b2545]/90 transition-colors"
            >
              Save Allocation ({selectedSubjects.length})
            </button>
          </div>
        </div>
      </PortalModal>

      {/* Initial password reveal */}
      {newPassword && (
        <PasswordBanner
          name={newPassword.name}
          password={newPassword.password}
          onClose={() => setNewPassword(null)}
        />
      )}

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-4 right-4 z-50 bg-[#bfa15f] text-white px-5 py-3 rounded-lg shadow-lg text-sm font-medium">
          {toast}
        </div>
      )}
    </div>
  )
}

export default HodFaculty
