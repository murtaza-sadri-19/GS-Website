import React, { useState, useEffect } from 'react'
import { PageHeader, PortalCard } from '../../components/layout/PortalLayout'
import { Building, Save, Image as ImageIcon, Edit3, X, Eye } from 'lucide-react'
import { useAdminStore } from '../../store/adminStore'
import { departmentService, type DepartmentSummary } from '../../services/departmentService'

const HodDepartmentProfile: React.FC = () => {
  const user = useAdminStore(s => s.user)
  const [loading, setLoading] = useState(true)
  const [activeDept, setActiveDept] = useState<DepartmentSummary | null>(null)
  
  // States for draft and profile details
  const [profile, setProfile] = useState<DepartmentSummary | null>(null)
  const [draft, setDraft] = useState<DepartmentSummary | null>(null)
  
  const [editing, setEditing] = useState(false)
  const [preview, setPreview] = useState(false)
  const [toast, setToast] = useState('')

  // Textarea state helpers for array fields
  const [aboutText, setAboutText] = useState('')
  const [infraText, setInfraText] = useState('')
  const [intakeText, setIntakeText] = useState('')

  const loadData = async () => {
    try {
      setLoading(true)
      const depts = await departmentService.getDepartments()
      
      // Match active HOD based on auth email or fallback to CSE
      const matched = depts.find(d => d.hodEmail === user?.email) || depts.find(d => d.slug === 'computer-engineering')
      if (matched) {
        setActiveDept(matched)
        setProfile(matched)
        setDraft(matched)
        
        // Populate array text fields
        setAboutText((matched.aboutParagraphs || []).join('\n\n'))
        setInfraText((matched.infraHighlights || []).join('\n'))
        setIntakeText((matched.programsIntake || []).join('\n'))
      }
    } catch (err) {
      console.error('Error loading HOD department profile:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [user])

  const setField = <K extends keyof DepartmentSummary>(k: K, v: DepartmentSummary[K]) => {
    if (draft) {
      setDraft({ ...draft, [k]: v })
    }
  }

  const startEdit = () => {
    if (profile) {
      setDraft(profile)
      setAboutText((profile.aboutParagraphs || []).join('\n\n'))
      setInfraText((profile.infraHighlights || []).join('\n'))
      setIntakeText((profile.programsIntake || []).join('\n'))
      setEditing(true)
    }
  }

  const cancelEdit = () => {
    setEditing(false)
  }

  const save = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!draft || !activeDept) return

    // Reassemble arrays from textarea states
    const resolvedAbout = aboutText
      .split('\n\n')
      .map(p => p.trim())
      .filter(p => p.length > 0)
    
    const resolvedInfra = infraText
      .split('\n')
      .map(line => line.replace(/^•\s*/, '').trim())
      .filter(line => line.length > 0)
    
    const resolvedIntake = intakeText
      .split('\n')
      .map(line => line.replace(/^•\s*/, '').trim())
      .filter(line => line.length > 0)

    const next: DepartmentSummary = {
      ...draft,
      aboutParagraphs: resolvedAbout,
      infraHighlights: resolvedInfra,
      programsIntake: resolvedIntake,
    }

    try {
      await departmentService.saveDepartmentBySlug(activeDept.slug, next)
      setProfile(next)
      setEditing(false)
      setToast('Department profile saved successfully.')
      setTimeout(() => setToast(''), 3000)
    } catch (err) {
      console.error('Failed to save HOD department changes:', err)
    }
  }

  if (loading || !profile || !draft) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  const v = editing ? draft : profile

  return (
    <div className="space-y-5">
      <PageHeader
        title="Department Profile"
        subtitle={`Administrative dashboard for the Department of ${profile.name}`}
        action={
          editing ? (
            <div className="flex gap-2">
              <button
                type="button"
                onClick={cancelEdit}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 border border-slate-200 text-slate-700 text-xs font-bold rounded-md hover:bg-slate-50 transition-colors"
              >
                <X size={13} /> Cancel
              </button>
              <button
                type="button"
                onClick={save}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-[#0b2545] text-white text-xs font-bold rounded-md hover:bg-[#0b2545]/90 transition-colors"
              >
                <Save size={13} /> Save Changes
              </button>
            </div>
          ) : (
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setPreview(true)}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 border border-slate-200 text-slate-700 text-xs font-bold rounded-md hover:bg-slate-50 transition-colors"
              >
                <Eye size={13} /> Public Preview
              </button>
              <button
                type="button"
                onClick={startEdit}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-[#0b2545] text-white text-xs font-bold rounded-md hover:bg-[#0b2545]/90 transition-colors"
              >
                <Edit3 size={13} /> Edit Profile
              </button>
            </div>
          )
        }
      />

      <PortalCard>
        <div className="grid grid-cols-1 lg:grid-cols-[240px_1fr] gap-8">
          {/* Left Column - Branch Image & Metadata */}
          <div className="space-y-5">
            <div>
              <span className="block text-[11px] font-bold text-slate-650 uppercase tracking-wider mb-2">
                Branch Representative Image
              </span>
              <div className="aspect-[4/3] w-full bg-slate-50 border border-slate-200 rounded-lg overflow-hidden flex items-center justify-center shadow-xs">
                {v.imageUrl ? (
                  <img src={v.imageUrl} alt={v.name} className="w-full h-full object-cover" />
                ) : (
                  <ImageIcon size={40} className="text-slate-350" />
                )}
              </div>
              {editing && (
                <div className="mt-2.5">
                  <input
                    type="text"
                    value={v.imageUrl || ''}
                    onChange={(e) => setField('imageUrl', e.target.value)}
                    placeholder="https://image-url..."
                    className="w-full text-xs border border-slate-200 rounded px-2.5 py-2 focus:outline-none focus:border-[#0b2545] bg-white font-mono"
                  />
                </div>
              )}
            </div>

            <div className="bg-slate-50 border border-slate-200 p-4 rounded-lg text-xs text-slate-600 space-y-2.5 font-sans">
              <p><strong className="text-slate-700 font-semibold">Established:</strong> {v.established}</p>
              <p><strong className="text-slate-700 font-semibold">Active Faculty:</strong> {v.facultyCount} Members</p>
              <p>
                <strong className="text-slate-700 font-semibold">Academic Tracks:</strong>{' '}
                <span className="font-bold text-[#bfa15f]">{v.programsOffered.join(' • ')}</span>
              </p>
            </div>
          </div>

          {/* Right Column - Main Editing Form */}
          <form onSubmit={save} className="space-y-5">
            <h3 className="text-sm font-bold text-[#0b2545] uppercase tracking-wider border-b border-slate-200 pb-1.5 flex items-center gap-1.5">
              <Building size={16} /> 1 · Basic Department Parameters
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Field label="Department Title" required>
                <input
                  type="text"
                  value={v.name}
                  onChange={(e) => setField('name', e.target.value)}
                  disabled={!editing}
                  className={inputClass(editing)}
                />
              </Field>
              <Field label="Short Name" required>
                <input
                  type="text"
                  value={v.shortName}
                  onChange={(e) => setField('shortName', e.target.value)}
                  disabled={!editing}
                  className={inputClass(editing)}
                />
              </Field>
              <Field label="Established Year" required>
                <input
                  type="text"
                  value={v.established}
                  onChange={(e) => setField('established', e.target.value)}
                  disabled={!editing}
                  className={inputClass(editing)}
                />
              </Field>
            </div>

            <h3 className="text-sm font-bold text-[#0b2545] uppercase tracking-wider border-b border-slate-200 pb-1.5 pt-2">
              👤 2 · HOD Profile & Extensions
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Field label="HOD Name" required>
                <input
                  type="text"
                  value={v.hodName}
                  onChange={(e) => setField('hodName', e.target.value)}
                  disabled={!editing}
                  className={inputClass(editing)}
                />
              </Field>
              <Field label="HOD Email Address" required>
                <input
                  type="email"
                  value={v.hodEmail}
                  onChange={(e) => setField('hodEmail', e.target.value)}
                  disabled={!editing}
                  className={inputClass(editing)}
                />
              </Field>
              <Field label="Department Phone Extension">
                <input
                  type="text"
                  value={v.hodPhone || ''}
                  onChange={(e) => setField('hodPhone', e.target.value)}
                  disabled={!editing}
                  className={inputClass(editing)}
                />
              </Field>
            </div>

            <h3 className="text-sm font-bold text-[#0b2545] uppercase tracking-wider border-b border-slate-200 pb-1.5 pt-2">
              📝 3 · Narrative Description & OBE Vision
            </h3>

            <Field label="Short Page Sub-Header Description">
              <input
                type="text"
                value={v.description || ''}
                onChange={(e) => setField('description', e.target.value)}
                disabled={!editing}
                placeholder="Fostering engineering breakthroughs..."
                className={inputClass(editing)}
              />
            </Field>

            <Field label="Detailed Overview (Use double Enter to separate paragraphs)">
              <textarea
                rows={5}
                value={editing ? aboutText : (v.aboutParagraphs || []).join('\n\n')}
                onChange={(e) => setAboutText(e.target.value)}
                disabled={!editing}
                className={inputClass(editing)}
              />
            </Field>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Field label="OBE Vision Statement">
                <textarea
                  rows={3}
                  value={v.vision || ''}
                  onChange={(e) => setField('vision', e.target.value)}
                  disabled={!editing}
                  className={inputClass(editing)}
                />
              </Field>
              <Field label="OBE Mission Statement">
                <textarea
                  rows={3}
                  value={v.mission || ''}
                  onChange={(e) => setField('mission', e.target.value)}
                  disabled={!editing}
                  className={inputClass(editing)}
                />
              </Field>
            </div>

            <h3 className="text-sm font-bold text-[#0b2545] uppercase tracking-wider border-b border-slate-200 pb-1.5 pt-2">
              🔬 4 · Academic Lists & Highlights
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Field label="Infrastructure Highlights (One per line)">
                <textarea
                  rows={4}
                  value={editing ? infraText : (v.infraHighlights || []).join('\n')}
                  onChange={(e) => setInfraText(e.target.value)}
                  disabled={!editing}
                  placeholder="e.g. Dedicated Computer Center"
                  className={inputClass(editing)}
                />
              </Field>
              <Field label="Offered Programs & Intake Details (One per line)">
                <textarea
                  rows={4}
                  value={editing ? intakeText : (v.programsIntake || []).join('\n')}
                  onChange={(e) => setIntakeText(e.target.value)}
                  disabled={!editing}
                  placeholder="e.g. B.Tech (4-Year Degree) - 120 Intake"
                  className={inputClass(editing)}
                />
              </Field>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Field label="Status">
                <select
                  value={v.status}
                  onChange={(e) => setField('status', e.target.value as DepartmentSummary['status'])}
                  disabled={!editing}
                  className={inputClass(editing)}
                >
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                  <option value="archived">Archived</option>
                </select>
              </Field>
            </div>
          </form>
        </div>
      </PortalCard>

      {/* Public Preview Modal */}
      {preview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50" onClick={() => setPreview(false)} />
          <div className="relative bg-white rounded-xl shadow-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-200 sticky top-0 bg-white z-10">
              <h3 className="font-bold text-slate-800 flex items-center gap-2">
                <Eye size={16} className="text-[#bfa15f]" /> Public Preview — {profile.name}
              </h3>
              <button
                type="button"
                onClick={() => setPreview(false)}
                className="p-1 rounded hover:bg-slate-100 text-slate-400 hover:text-slate-650 transition-colors"
              >
                <X size={18} />
              </button>
            </div>
            
            <div className="p-6 space-y-6">
              <div className="flex flex-col md:flex-row gap-5 items-start">
                {profile.imageUrl && (
                  <img
                    src={profile.imageUrl}
                    alt="dept"
                    className="w-full md:w-48 aspect-[4/3] object-cover bg-slate-50 rounded-lg border border-slate-200"
                  />
                )}
                <div className="space-y-1.5 flex-1">
                  <h2 className="font-display text-xl font-bold text-[#0b2545]">{profile.name}</h2>
                  <p className="text-xs text-slate-550 italic">{profile.description}</p>
                  <p className="text-xs text-slate-500">
                    Established {profile.established} · {profile.hodEmail} · {profile.hodPhone || 'N/A'}
                  </p>
                </div>
              </div>
              
              <Section title="Overview & Academic Mission">
                <div className="space-y-2">
                  {(profile.aboutParagraphs || []).map((p, idx) => (
                    <p key={idx} className="text-xs text-slate-650 leading-relaxed font-sans">{p}</p>
                  ))}
                </div>
              </Section>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <Section title="Vision Statement">{profile.vision}</Section>
                <Section title="Mission Statement">{profile.mission}</Section>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-2 border-t border-slate-100">
                <Section title="Infrastructure Highlights">
                  <ul className="list-disc list-inside text-xs text-slate-650 space-y-1">
                    {(profile.infraHighlights || []).map((hl, idx) => (
                      <li key={idx}>{hl}</li>
                    ))}
                  </ul>
                </Section>
                <Section title="Offered Programs & Intake">
                  <ul className="list-disc list-inside text-xs text-slate-650 space-y-1">
                    {(profile.programsIntake || []).map((pi, idx) => (
                      <li key={idx}>{pi}</li>
                    ))}
                  </ul>
                </Section>
              </div>
            </div>
          </div>
        </div>
      )}

      {toast && (
        <div className="fixed bottom-4 right-4 z-50 bg-[#0b2545] border border-[#bfa15f]/30 text-white px-5 py-3 rounded-lg shadow-lg flex items-center gap-2 text-sm font-medium">
          <Building size={14} className="text-[#bfa15f]" /> {toast}
        </div>
      )}
    </div>
  )
}

const Field: React.FC<{ label: string; required?: boolean; children: React.ReactNode }> = ({
  label,
  required,
  children
}) => (
  <label className="block">
    <span className="block text-[11px] font-bold text-slate-600 uppercase tracking-wide mb-1.5">
      {label} {required && <span className="text-[#bfa15f]">*</span>}
    </span>
    {children}
  </label>
)

const inputClass = (editing: boolean) =>
  `w-full border rounded px-3 py-2 text-xs focus:outline-none transition-colors duration-150 ${
    editing
      ? 'border-slate-200 bg-white focus:border-[#0b2545]'
      : 'border-transparent bg-slate-50 text-slate-700 cursor-default font-semibold'
  }`

const Section: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <div className="space-y-1">
    <p className="text-[10px] font-bold text-[#bfa15f] uppercase tracking-widest leading-none mb-1.5">{title}</p>
    <div className="text-xs text-slate-700 leading-relaxed font-sans">{children}</div>
  </div>
)

export default HodDepartmentProfile
