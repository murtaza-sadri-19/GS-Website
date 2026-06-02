import React, { useState } from 'react'
import { PageHeader, PortalCard, PortalModal } from '../../components/layout/PortalLayout'
import { useAdminStore } from '../../store/adminStore'
import {
  User, Save, X, Edit3, Eye, Mail, Phone,
  GraduationCap, Globe, Upload, CheckCircle2, Crown,
} from 'lucide-react'

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

interface HodProfileData {
  name: string
  email: string
  phone: string
  designation: string
  qualification: string
  experience_years: number
  specialization: string
  bio: string
  profile_photo: string
  office_location: string
  linkedin_url: string
  google_scholar_url: string
  personal_website: string
}

const HodProfilePage: React.FC = () => {
  const { user } = useAdminStore()

  const initial: HodProfileData = {
    name:              user?.name || '',
    email:             user?.email || '',
    phone:             '',
    designation:       'Head of Department',
    qualification:     '',
    experience_years:  0,
    specialization:    '',
    bio:               '',
    profile_photo:     '',
    office_location:   '',
    linkedin_url:      '',
    google_scholar_url: '',
    personal_website:  '',
  }

  const [profile, setProfile] = useState<HodProfileData>(initial)
  const [draft, setDraft]     = useState<HodProfileData>(initial)
  const [editing, setEditing] = useState(false)
  const [photoModal, setPhotoModal] = useState(false)
  const [preview, setPreview] = useState(false)
  const [toast, setToast]     = useState('')
  const [saved, setSaved]     = useState(false)

  const set = <K extends keyof HodProfileData>(k: K, v: HodProfileData[K]) =>
    setDraft(prev => ({ ...prev, [k]: v }))

  const startEdit = () => { setDraft(profile); setEditing(true) }
  const cancelEdit = () => { setDraft(profile); setEditing(false) }

  const showToast = (msg: string) => {
    setToast(msg)
    setTimeout(() => setToast(''), 2400)
  }

  const save = () => {
    setProfile(draft)
    setEditing(false)
    setSaved(true)
    showToast('Profile saved successfully.')
  }

  const v = editing ? draft : profile

  return (
    <div className="space-y-5">
      <PageHeader
        title="My Profile"
        subtitle="Manage your public faculty profile shown on the department page"
        action={
          editing ? (
            <div className="flex gap-2">
              <button
                onClick={cancelEdit}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 border border-slate-200 text-slate-700 text-xs font-bold rounded-md hover:bg-slate-50"
              >
                <X size={13} /> Cancel
              </button>
              <button
                onClick={save}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-[#0b2545] text-white text-xs font-bold rounded-md hover:bg-[#0b2545]/90"
              >
                <Save size={13} /> Save Profile
              </button>
            </div>
          ) : (
            <div className="flex gap-2">
              <button
                onClick={() => setPreview(true)}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 border border-slate-200 text-slate-700 text-xs font-bold rounded-md hover:bg-slate-50"
              >
                <Eye size={13} /> Public Preview
              </button>
              <button
                onClick={startEdit}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-[#0b2545] text-white text-xs font-bold rounded-md hover:bg-[#0b2545]/90"
              >
                <Edit3 size={13} /> Edit Profile
              </button>
            </div>
          )
        }
      />

      <PortalCard>
        <div className="grid grid-cols-1 lg:grid-cols-[200px_1fr] gap-6">
          {/* Photo + Status */}
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

            {/* HOD badge */}
            <div className="mt-3 p-3 rounded-lg border bg-[#0b2545]/5 border-[#0b2545]/20">
              <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-[#0b2545]">
                <Crown size={12} /> Head of Department
              </div>
              {saved && (
                <div className="flex items-center gap-1 mt-1.5 text-[10px] text-green-700 font-semibold">
                  <CheckCircle2 size={11} /> Profile saved
                </div>
              )}
              <p className="text-[10px] text-slate-500 mt-1">
                Your profile is shown first on the department faculty page.
              </p>
            </div>
          </div>

          {/* Fields */}
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <Field label="Full Name" required>
                <input
                  type="text"
                  value={v.name}
                  onChange={e => set('name', e.target.value)}
                  disabled={!editing}
                  className={inputCls(editing)}
                />
              </Field>
              <Field label="Designation" required>
                <input
                  type="text"
                  value={v.designation}
                  onChange={e => set('designation', e.target.value)}
                  disabled={!editing}
                  className={inputCls(editing)}
                />
              </Field>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <Field label="Email">
                <input
                  type="email"
                  value={v.email}
                  onChange={e => set('email', e.target.value)}
                  disabled={!editing}
                  className={inputCls(editing)}
                />
              </Field>
              <Field label="Phone">
                <input
                  type="tel"
                  value={v.phone}
                  onChange={e => set('phone', e.target.value)}
                  disabled={!editing}
                  className={inputCls(editing)}
                />
              </Field>
            </div>

            <Field label="Qualification">
              <input
                type="text"
                value={v.qualification}
                onChange={e => set('qualification', e.target.value)}
                disabled={!editing}
                placeholder="e.g. Ph.D. (Computer Science), IIT Bombay"
                className={inputCls(editing)}
              />
            </Field>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <Field label="Experience (Years)">
                <input
                  type="number"
                  min={0}
                  value={v.experience_years}
                  onChange={e => set('experience_years', Number(e.target.value))}
                  disabled={!editing}
                  className={inputCls(editing)}
                />
              </Field>
              <Field label="Office Location">
                <input
                  type="text"
                  value={v.office_location}
                  onChange={e => set('office_location', e.target.value)}
                  disabled={!editing}
                  placeholder="e.g. CSE Block, Room 101"
                  className={inputCls(editing)}
                />
              </Field>
            </div>

            <Field label="Specialization / Research Areas">
              <input
                type="text"
                value={v.specialization}
                onChange={e => set('specialization', e.target.value)}
                disabled={!editing}
                placeholder="e.g. Machine Learning, Data Science"
                className={inputCls(editing)}
              />
            </Field>

            <Field label="Biography">
              <textarea
                rows={4}
                value={v.bio}
                onChange={e => set('bio', e.target.value)}
                disabled={!editing}
                placeholder="Brief professional bio shown on your public profile…"
                className={inputCls(editing)}
              />
            </Field>

            <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider pt-2 border-t border-slate-100">
              Social &amp; Web Links
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <Field label="LinkedIn URL">
                <input
                  type="text"
                  value={v.linkedin_url}
                  onChange={e => set('linkedin_url', e.target.value)}
                  disabled={!editing}
                  placeholder="https://linkedin.com/in/..."
                  className={inputCls(editing)}
                />
              </Field>
              <Field label="Google Scholar URL">
                <input
                  type="text"
                  value={v.google_scholar_url}
                  onChange={e => set('google_scholar_url', e.target.value)}
                  disabled={!editing}
                  placeholder="https://scholar.google.com/..."
                  className={inputCls(editing)}
                />
              </Field>
              <Field label="Personal Website">
                <input
                  type="text"
                  value={v.personal_website}
                  onChange={e => set('personal_website', e.target.value)}
                  disabled={!editing}
                  placeholder="https://..."
                  className={inputCls(editing)}
                />
              </Field>
            </div>
          </div>
        </div>
      </PortalCard>

      {/* Photo upload modal */}
      <PortalModal isOpen={photoModal} title="Change Profile Photo" onClose={() => setPhotoModal(false)} width="max-w-md">
        <div className="text-center py-4">
          <div className="border-2 border-dashed border-slate-200 rounded-lg p-6">
            <Upload size={28} className="text-[#bfa15f] mx-auto mb-2" />
            <p className="text-sm font-semibold text-slate-700">Drop a photo or paste an image URL</p>
            <p className="text-[11px] text-slate-400 mt-1">JPG / PNG / WebP, square preferred, &lt; 2 MB</p>
          </div>
          <input
            type="text"
            value={draft.profile_photo}
            onChange={e => set('profile_photo', e.target.value)}
            placeholder="Paste image URL here"
            className="mt-3 w-full border border-slate-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#0b2545]"
          />
          <button
            onClick={() => { setPhotoModal(false); showToast('Photo URL set. Save changes to apply.') }}
            className="mt-3 px-4 py-2 bg-[#0b2545] text-white text-xs font-bold rounded hover:bg-[#0b2545]/90"
          >
            Use This URL
          </button>
        </div>
      </PortalModal>

      {/* Public preview modal */}
      <PortalModal isOpen={preview} title="Public Profile Preview" onClose={() => setPreview(false)} width="max-w-2xl">
        <div className="space-y-4">
          <div className="flex items-start gap-4">
            {profile.profile_photo
              ? <img src={profile.profile_photo} alt={profile.name} className="w-24 h-24 object-cover rounded-lg border border-slate-200" />
              : <div className="w-24 h-24 bg-slate-100 rounded-lg border border-slate-200 flex items-center justify-center"><User size={28} className="text-slate-300" /></div>
            }
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-xl font-display font-bold text-[#0b2545]">{profile.name || '—'}</h2>
                <span className="inline-flex items-center gap-1 text-[10px] bg-[#bfa15f]/10 text-[#bfa15f] border border-[#bfa15f]/30 px-2 py-0.5 rounded font-bold uppercase tracking-wider">
                  <Crown size={10} /> HOD
                </span>
              </div>
              <p className="text-sm text-slate-600">{profile.designation}</p>
              {profile.qualification && <p className="text-xs text-slate-500 mt-1">{profile.qualification}</p>}
              <div className="flex items-center gap-3 mt-2 text-[11px]">
                {profile.email && (
                  <a href={`mailto:${profile.email}`} className="text-[#0b2545] hover:underline inline-flex items-center gap-1">
                    <Mail size={11} />{profile.email}
                  </a>
                )}
                {profile.phone && (
                  <>
                    <span className="text-slate-400">·</span>
                    <span className="text-slate-600 inline-flex items-center gap-1"><Phone size={11} />{profile.phone}</span>
                  </>
                )}
              </div>
            </div>
          </div>

          {profile.specialization && <Section title="Specialization">{profile.specialization}</Section>}
          {profile.bio && <Section title="Biography">{profile.bio}</Section>}

          {(profile.linkedin_url || profile.google_scholar_url || profile.personal_website) && (
            <div className="flex gap-3 pt-3 border-t border-slate-100">
              {profile.linkedin_url && (
                <a href={profile.linkedin_url} target="_blank" rel="noreferrer" className="text-[11px] text-[#0b2545] hover:underline inline-flex items-center gap-1">
                  <Linkedin size={11} /> LinkedIn
                </a>
              )}
              {profile.google_scholar_url && (
                <a href={profile.google_scholar_url} target="_blank" rel="noreferrer" className="text-[11px] text-[#0b2545] hover:underline inline-flex items-center gap-1">
                  <GraduationCap size={11} /> Scholar
                </a>
              )}
              {profile.personal_website && (
                <a href={profile.personal_website} target="_blank" rel="noreferrer" className="text-[11px] text-[#0b2545] hover:underline inline-flex items-center gap-1">
                  <Globe size={11} /> Website
                </a>
              )}
            </div>
          )}
        </div>
      </PortalModal>

      {toast && (
        <div className="fixed bottom-4 right-4 z-50 bg-[#bfa15f] text-white px-5 py-3 rounded-lg shadow-lg flex items-center gap-2 text-sm font-medium">
          <Crown size={14} /> {toast}
          <button onClick={() => setToast('')}><X size={13} /></button>
        </div>
      )}
    </div>
  )
}

const Field: React.FC<{ label: string; required?: boolean; children: React.ReactNode }> = ({ label, required, children }) => (
  <label className="block">
    <span className="block text-[11px] font-bold text-slate-600 uppercase tracking-wide mb-1">
      {label} {required && <span className="text-[#bfa15f]">*</span>}
    </span>
    {children}
  </label>
)

const inputCls = (editing: boolean) =>
  `w-full border rounded px-3 py-2 text-sm focus:outline-none ${editing
    ? 'border-slate-200 bg-white focus:border-[#0b2545]'
    : 'border-transparent bg-slate-50 text-slate-700 cursor-default'}`

const Section: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <div>
    <p className="text-[10px] font-bold text-[#bfa15f] uppercase tracking-widest mb-1">{title}</p>
    <div className="text-sm text-slate-700 leading-relaxed">{children}</div>
  </div>
)

export default HodProfilePage
