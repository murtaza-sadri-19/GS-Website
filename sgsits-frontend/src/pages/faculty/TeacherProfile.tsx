import React, { useState, useEffect } from 'react'
import { PageHeader, PortalCard, PortalModal } from '../../components/layout/PortalLayout'
import { type TeacherProfile as ProfileType } from '../../services/facultyService'
import { getTeacherProfile, updateTeacherProfile } from '../../services/facultyService'
import {
  User, Save, X, Edit3, Eye, Mail, Phone,
  GraduationCap, Globe, Send, Upload, CheckCircle2, Clock, AlertCircle, Loader2,
} from 'lucide-react'
import ExtendedFacultyFields from '../../components/faculty/ExtendedFacultyFields'

const EMPTY_PROFILE: ProfileType = {
  faculty_id: '', name: '', email: '', phone: '',
  designation: '', qualification: '', experience_years: 0,
  specialization: '', subjects_taught: [], bio: '',
  profile_photo: '', office_location: '', linkedin_url: '',
  google_scholar_url: '', personal_website: '', branch_id: '',
  status: 'pending', last_submitted: '',
  phd_guided: 0, phd_ongoing: 0, pg_guided: 0,
  admin_roles: [], memberships: [],
}

const Linkedin: React.FC<{ size?: number; className?: string }> = ({ size = 24, className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect width="4" height="12" x="2" y="9" />
    <circle cx="4" cy="4" r="2" />
  </svg>
)

const TeacherProfilePage: React.FC = () => {
  const [profile,    setProfile]    = useState<ProfileType>(EMPTY_PROFILE)
  const [draft,      setDraft]      = useState<ProfileType>(EMPTY_PROFILE)
  const [editing,    setEditing]    = useState(false)
  const [photoModal, setPhotoModal] = useState(false)
  const [preview,    setPreview]    = useState(false)
  const [toast,      setToast]      = useState('')
  const [loading,    setLoading]    = useState(true)
  const [saving,     setSaving]     = useState(false)

  useEffect(() => {
    getTeacherProfile().then(p => {
      if (p) { setProfile(p); setDraft(p) }
    }).finally(() => setLoading(false))
  }, [])

  const set = <K extends keyof ProfileType>(k: K, v: ProfileType[K]) =>
    setDraft(prev => ({ ...prev, [k]: v }))

  const startEdit = () => { setDraft(profile); setEditing(true) }
  const cancelEdit = () => { setDraft(profile); setEditing(false) }
  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(''), 2400) }

  const save = async (submit: boolean) => {
    setSaving(true)
    try {
      const updated = await updateTeacherProfile({
        ...draft,
        status: submit ? 'pending' : profile.status,
      } as any)
      if (updated) { setProfile(updated); setDraft(updated) }
      else { setProfile(draft) }
      setEditing(false)
      showToast(submit ? 'Profile submitted for HOD approval.' : 'Changes saved.')
    } catch {
      showToast('Failed to save. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24 text-slate-400">
        <Loader2 size={24} className="animate-spin mr-2" />
        <span className="text-sm">Loading profile…</span>
      </div>
    )
  }

  const v = editing ? draft : profile

  return (
    <div className="space-y-5">
      <PageHeader
        title="My Profile"
        subtitle="Manage your public faculty profile shown on the institute website"
        action={
          editing ? (
            <div className="flex gap-2">
              <button onClick={cancelEdit} className="inline-flex items-center gap-1.5 px-3.5 py-2 border border-slate-200 text-slate-700 text-xs font-bold rounded-md hover:bg-slate-50">
                <X size={13} /> Cancel
              </button>
              <button onClick={() => save(false)} disabled={saving} className="inline-flex items-center gap-1.5 px-3.5 py-2 border border-primary/20 text-primary text-xs font-bold rounded-md hover:bg-primary/5 disabled:opacity-50">
                {saving ? <Loader2 size={13} className="animate-spin" /> : <Save size={13} />} Save Draft
              </button>
              <button onClick={() => save(true)} disabled={saving} className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-primary text-white text-xs font-bold rounded-md hover:bg-primary/90 disabled:opacity-50">
                {saving ? <Loader2 size={13} className="animate-spin" /> : <Send size={13} />} Submit for Approval
              </button>
            </div>
          ) : (
            <div className="flex gap-2">
              <button onClick={() => setPreview(true)} className="inline-flex items-center gap-1.5 px-3.5 py-2 border border-slate-200 text-slate-700 text-xs font-bold rounded-md hover:bg-slate-50">
                <Eye size={13} /> Public Preview
              </button>
              <button onClick={startEdit} className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-primary text-white text-xs font-bold rounded-md hover:bg-primary/90">
                <Edit3 size={13} /> Edit Profile
              </button>
            </div>
          )
        }
      />

      <PortalCard>
        <div className="grid grid-cols-1 lg:grid-cols-[200px_1fr] gap-6">
          <div>
            <div className="aspect-square w-full bg-slate-50 border border-slate-200 rounded-lg overflow-hidden group relative">
              {v.profile_photo
                ? <img src={v.profile_photo} alt={v.name} className="w-full h-full object-cover" />
                : <div className="w-full h-full flex items-center justify-center"><User size={40} className="text-slate-300" /></div>
              }
              {editing && (
                <button
                  onClick={() => setPhotoModal(true)}
                  className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center"
                >
                  <span className="opacity-0 group-hover:opacity-100 inline-flex items-center gap-1.5 text-white text-xs font-bold transition-opacity">
                    <Upload size={13} /> Change Photo
                  </span>
                </button>
              )}
            </div>
            <StatusCard status={profile.status} note={profile.approval_note} lastSubmitted={profile.last_submitted} />
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <Field label="Full Name" required>
                <input type="text" value={v.name} onChange={(e) => set('name', e.target.value)} disabled={!editing} className={inputCls(editing)} />
              </Field>
              <Field label="Designation" required>
                <input type="text" value={v.designation} onChange={(e) => set('designation', e.target.value)} disabled={!editing} className={inputCls(editing)} />
              </Field>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <Field label="Email">
                <input type="email" value={v.email} onChange={(e) => set('email', e.target.value)} disabled={!editing} className={inputCls(editing)} />
              </Field>
              <Field label="Phone">
                <input type="tel" value={v.phone} onChange={(e) => set('phone', e.target.value)} disabled={!editing} className={inputCls(editing)} />
              </Field>
            </div>

            <Field label="Qualification">
              <input type="text" value={v.qualification} onChange={(e) => set('qualification', e.target.value)} disabled={!editing} className={inputCls(editing)} />
            </Field>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <Field label="Experience (Years)">
                <input type="number" min={0} value={v.experience_years} onChange={(e) => set('experience_years', Number(e.target.value))} disabled={!editing} className={inputCls(editing)} />
              </Field>
              <Field label="Office Location">
                <input type="text" value={v.office_location} onChange={(e) => set('office_location', e.target.value)} disabled={!editing} className={inputCls(editing)} />
              </Field>
              <Field label="Branch">
                <input type="text" value={v.branch_id} disabled className={inputCls(false)} />
              </Field>
            </div>

            <Field label="Specialization">
              <input type="text" value={v.specialization} onChange={(e) => set('specialization', e.target.value)} disabled={!editing} className={inputCls(editing)} />
            </Field>

            <Field label="Bio">
              <textarea rows={4} value={v.bio} onChange={(e) => set('bio', e.target.value)} disabled={!editing} className={inputCls(editing)} />
            </Field>

            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider pt-2 border-t border-slate-100">Social &amp; Web Links</p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <Field label="LinkedIn URL">
                <input type="text" value={v.linkedin_url} onChange={(e) => set('linkedin_url', e.target.value)} disabled={!editing} className={inputCls(editing)} placeholder="https://linkedin.com/in/..." />
              </Field>
              <Field label="Google Scholar URL">
                <input type="text" value={v.google_scholar_url} onChange={(e) => set('google_scholar_url', e.target.value)} disabled={!editing} className={inputCls(editing)} placeholder="https://scholar.google.com/..." />
              </Field>
              <Field label="Personal Website">
                <input type="text" value={v.personal_website} onChange={(e) => set('personal_website', e.target.value)} disabled={!editing} className={inputCls(editing)} placeholder="https://..." />
              </Field>
            </div>
          </div>
        </div>

        {/* Extended profile — guidance, courses, admin roles, memberships */}
        <ExtendedFacultyFields
          editing={editing}
          value={{
            phd_guided:      v.phd_guided,
            phd_ongoing:     v.phd_ongoing,
            pg_guided:       v.pg_guided,
            subjects_taught: v.subjects_taught,
            admin_roles:     v.admin_roles,
            memberships:     v.memberships,
          }}
          onChange={patch => {
            if (patch.phd_guided  !== undefined) set('phd_guided',  patch.phd_guided)
            if (patch.phd_ongoing !== undefined) set('phd_ongoing', patch.phd_ongoing)
            if (patch.pg_guided   !== undefined) set('pg_guided',   patch.pg_guided)
            if (patch.subjects_taught !== undefined) set('subjects_taught', patch.subjects_taught)
            if (patch.admin_roles !== undefined) set('admin_roles', patch.admin_roles)
            if (patch.memberships !== undefined) set('memberships', patch.memberships)
          }}
        />
      </PortalCard>

      {/* Photo upload modal (mock) */}
      <PortalModal isOpen={photoModal} title="Change Profile Photo" onClose={() => setPhotoModal(false)} width="max-w-md">
        <div className="text-center py-4">
          <div className="border-2 border-dashed border-slate-200 rounded-lg p-6">
            <Upload size={28} className="text-accent mx-auto mb-2" />
            <p className="text-sm font-semibold text-slate-700">Drop a photo or click to select</p>
            <p className="text-xs text-slate-400 mt-1">JPG / PNG / WebP, square preferred, &lt; 2 MB</p>
          </div>
          <input
            type="text"
            value={draft.profile_photo}
            onChange={(e) => set('profile_photo', e.target.value)}
            placeholder="Paste image URL here"
            className="mt-3 w-full border border-slate-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-primary"
          />
          <button onClick={() => { setPhotoModal(false); showToast('Photo URL set. Save changes to apply.') }} className="mt-3 px-4 py-2 bg-primary text-white text-xs font-bold rounded hover:bg-primary/90">
            Use This URL
          </button>
        </div>
      </PortalModal>

      {/* Public preview modal */}
      <PortalModal isOpen={preview} title="Public Profile Preview" onClose={() => setPreview(false)} width="max-w-2xl">
        <div className="space-y-4">
          <div className="flex items-start gap-4">
            <img src={profile.profile_photo} alt={profile.name} className="w-24 h-24 object-cover rounded-lg border border-slate-200" />
            <div className="min-w-0 flex-1">
              <h2 className="text-xl font-display font-bold text-primary">{profile.name}</h2>
              <p className="text-sm text-slate-600">{profile.designation} · Dept. of {profile.branch_id}</p>
              <p className="text-xs text-slate-500 mt-1">{profile.qualification}</p>
              <div className="flex items-center gap-3 mt-2 text-xs">
                <a href={`mailto:${profile.email}`} className="text-primary hover:underline inline-flex items-center gap-1"><Mail size={11} />{profile.email}</a>
                <span className="text-slate-400">·</span>
                <span className="text-slate-600 inline-flex items-center gap-1"><Phone size={11} />{profile.phone}</span>
              </div>
            </div>
          </div>

          <Section title="Specialization">{profile.specialization}</Section>
          <Section title="Biography">{profile.bio}</Section>
          <Section title="Subjects Taught">
            <div className="flex flex-wrap gap-1.5">
              {profile.subjects_taught.map(s => <span key={s} className="text-xs bg-primary/5 text-primary border border-primary/15 px-2 py-0.5 rounded font-medium">{s}</span>)}
            </div>
          </Section>

          <div className="flex gap-3 pt-3 border-t border-slate-100">
            {profile.linkedin_url && <a href={profile.linkedin_url} target="_blank" rel="noreferrer" className="text-xs text-primary hover:underline inline-flex items-center gap-1"><Linkedin size={11} /> LinkedIn</a>}
            {profile.google_scholar_url && <a href={profile.google_scholar_url} target="_blank" rel="noreferrer" className="text-xs text-primary hover:underline inline-flex items-center gap-1"><GraduationCap size={11} /> Scholar</a>}
            {profile.personal_website && <a href={profile.personal_website} target="_blank" rel="noreferrer" className="text-xs text-primary hover:underline inline-flex items-center gap-1"><Globe size={11} /> Website</a>}
          </div>
        </div>
      </PortalModal>

      {toast && (
        <div className="fixed bottom-4 right-4 z-50 bg-accent text-white px-5 py-3 rounded-lg shadow-lg flex items-center gap-2 text-sm font-medium">
          <User size={14} /> {toast}
          <button onClick={() => setToast('')} className="ml-1"><X size={13} /></button>
        </div>
      )}
    </div>
  )
}

const Field: React.FC<{ label: string; required?: boolean; children: React.ReactNode }> = ({ label, required, children }) => (
  <label className="block">
    <span className="block text-xs font-bold text-slate-600 uppercase tracking-wide mb-1">{label} {required && <span className="text-accent">*</span>}</span>
    {children}
  </label>
)
const inputCls = (editing: boolean) =>
  `w-full border rounded px-3 py-2 text-sm focus:outline-none ${editing
    ? 'border-slate-200 bg-white focus:border-primary'
    : 'border-transparent bg-slate-50 text-slate-700 cursor-default'}`

const Section: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <div>
    <p className="text-xs font-bold text-accent uppercase tracking-widest mb-1">{title}</p>
    <div className="text-sm text-slate-700 leading-relaxed">{children}</div>
  </div>
)

const StatusCard: React.FC<{ status: ProfileType['status']; note?: string; lastSubmitted: string }> = ({ status, note, lastSubmitted }) => {
  const cfg =
    status === 'approved' ? { Icon: CheckCircle2, bg: 'bg-accent/10 border-accent/30', text: 'text-accent', label: 'Approved' } :
    status === 'pending'  ? { Icon: Clock,        bg: 'bg-primary/10 border-primary/25', text: 'text-primary', label: 'Pending HOD review' } :
                            { Icon: AlertCircle,  bg: 'bg-slate-100 border-slate-200',       text: 'text-slate-600', label: 'Rejected' }
  const { Icon } = cfg
  return (
    <div className={`mt-3 p-3 rounded-lg border ${cfg.bg}`}>
      <div className={`flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider ${cfg.text}`}>
        <Icon size={12} /> {cfg.label}
      </div>
      <p className="text-xs text-slate-500 mt-1">Last submitted {lastSubmitted}</p>
      {note && <p className="text-xs text-slate-600 mt-1 italic">{note}</p>}
    </div>
  )
}

export default TeacherProfilePage
