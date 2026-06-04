/**
 * Admin Academics CMS — all 12 sections of the Academics landing page
 * Route: /dashboard/central-admin/academics
 */

import React, { useState, useEffect, useCallback } from 'react'
import { Save, Loader2, CheckCircle2, AlertTriangle, Plus, Trash2, GraduationCap } from 'lucide-react'
import {
  getUGCourses, saveUGCourses,
  getPGCourses, savePGCourses,
  getPhDCourses, savePhDCourses,
  getPTDCCourses, savePTDCCourses,
  getAcademicCalendar, saveAcademicCalendar,
  getOnlineCourses, saveOnlineCourses,
  getFirstYearInfo, saveFirstYearInfo,
  getExamResults, saveExamResults,
  getOrdinances, saveOrdinances,
  getPlagiarism, savePlagiarism,
  getCodeOfEthics, saveCodeOfEthics,
  getObeNep, saveObeNep,
  getAcademicsLandingCards, saveAcademicsLandingCards,
  getAcademicsLandingMeta, saveAcademicsLandingMeta,
  academicsLandingCardsDefault,
  academicsLandingMetaDefault,
  ordinancesDefault,
  plagiarismDefault,
  codeOfEthicsDefault,
  obeNepDefault,
} from '../../services/academicsService'

// ─── Shared primitives ────────────────────────────────────────────────────────

const inputCls = 'w-full border border-slate-200 rounded px-3 py-2 text-sm bg-white focus:outline-none focus:border-primary'
const labelCls = 'block text-xs font-bold text-slate-600 uppercase tracking-wide mb-1'

const SaveBtn: React.FC<{ saving: boolean; saved: boolean; onClick: () => void }> = ({ saving, saved, onClick }) => (
  <button
    onClick={onClick}
    disabled={saving}
    className="inline-flex items-center gap-1.5 px-4 py-2 bg-primary text-white text-xs font-bold rounded hover:bg-primary/90 disabled:opacity-60"
  >
    {saving ? <><Loader2 size={13} className="animate-spin" />Saving…</>
             : saved  ? <><CheckCircle2 size={13} />Saved!</>
                      : <><Save size={13} />Save</>}
  </button>
)

function useJsonSection<T>(
  getter: () => Promise<T>,
  saver: (d: T) => Promise<unknown>,
  fallback: T,
): [T, (updater: (prev: T) => T) => void, () => void, boolean, boolean, string] {
  const [data,   setData]   = useState<T>(fallback)
  const [saving, setSaving] = useState(false)
  const [saved,  setSaved]  = useState(false)
  const [error,  setError]  = useState('')

  useEffect(() => {
    getter().then(d => { if (d && typeof d === 'object' && Object.keys(d as object).length > 0) setData(d) }).catch(() => {})
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const update = useCallback((updater: (prev: T) => T) => setData(updater), [])

  const save = useCallback(async () => {
    setSaving(true); setError('')
    try {
      await saver(data)
      setSaved(true); setTimeout(() => setSaved(false), 3000)
    } catch { setError('Save failed.') }
    finally { setSaving(false) }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data])

  return [data, update, save, saving, saved, error]
}

// ─── Tab types ────────────────────────────────────────────────────────────────

type Tab =
  | 'landing' | 'ug' | 'pg' | 'phd' | 'ptdc' | 'online'
  | 'firstyear' | 'exam' | 'ordinances' | 'plagiarism' | 'ethics' | 'obe'

const TABS: { id: Tab; label: string }[] = [
  { id: 'landing',    label: '🏠 Landing Page' },
  { id: 'ug',         label: 'UG Courses' },
  { id: 'pg',         label: 'PG Courses' },
  { id: 'phd',        label: 'Ph.D. Programs' },
  { id: 'ptdc',       label: 'PTDC Courses' },
  { id: 'online',     label: 'Online / MOOC' },
  { id: 'firstyear',  label: 'First Year Info' },
  { id: 'exam',       label: 'Exam & Results' },
  { id: 'ordinances', label: 'Ordinances' },
  { id: 'plagiarism', label: 'Plagiarism Policy' },
  { id: 'ethics',     label: 'Code of Ethics' },
  { id: 'obe',        label: 'OBE & NEP 2020' },
]

// ─── Paragraph list editor ────────────────────────────────────────────────────

const ParagraphList: React.FC<{
  items: string[]
  onChange: (items: string[]) => void
  placeholder?: string
}> = ({ items, onChange, placeholder = 'Enter paragraph...' }) => (
  <div className="space-y-2">
    {items.map((p, i) => (
      <div key={i} className="flex gap-2">
        <textarea
          rows={2}
          value={p}
          onChange={e => { const n = [...items]; n[i] = e.target.value; onChange(n) }}
          className={inputCls + ' flex-1'}
          placeholder={placeholder}
        />
        <button onClick={() => onChange(items.filter((_, j) => j !== i))} className="p-2 text-slate-400 hover:text-primary">
          <Trash2 size={14} />
        </button>
      </div>
    ))}
    <button onClick={() => onChange([...items, ''])} className="text-xs font-semibold text-primary flex items-center gap-1 hover:underline">
      <Plus size={12} /> Add paragraph
    </button>
  </div>
)

// ─── Main page ────────────────────────────────────────────────────────────────

const AdminAcademicsCms: React.FC = () => {
  const [tab, setTab] = useState<Tab>('landing')

  // Landing meta + cards
  const [landingMeta, updateLandingMeta, saveLandingMeta, savingMeta, savedMeta, errorMeta] =
    useJsonSection(getAcademicsLandingMeta, saveAcademicsLandingMeta, academicsLandingMetaDefault)
  const [landingCards, updateLandingCards, saveLandingCards, savingCards, savedCards, errorCards] =
    useJsonSection(getAcademicsLandingCards, saveAcademicsLandingCards as any, academicsLandingCardsDefault)

  // Courses
  const [ug, updateUg, saveUg, savingUg, savedUg, errorUg]       = useJsonSection(getUGCourses,   saveUGCourses,   { intro: '', courses: [] })
  const [pg, updatePg, savePg, savingPg, savedPg, errorPg]       = useJsonSection(getPGCourses,   savePGCourses,   { intro: '', programs: [] })
  const [phd, updatePhd, savePhd, savingPhd, savedPhd, errorPhd] = useJsonSection(getPhDCourses,  savePhDCourses,  {} as any)
  const [ptdc, updatePtdc, savePtdc, savingPtdc, savedPtdc, errorPtdc] = useJsonSection(getPTDCCourses, savePTDCCourses as any, [] as any)
  const [online, updateOnline, saveOnline, savingOnline, savedOnline, errorOnline] = useJsonSection(getOnlineCourses, saveOnlineCourses as any, [] as any)

  // First Year + Exam
  const [fy, updateFy, saveFy, savingFy, savedFy, errorFy] = useJsonSection(getFirstYearInfo, saveFirstYearInfo, { checklist: [], subjects: [], contacts: [] })
  const [exam, updateExam, saveExam, savingExam, savedExam, errorExam] = useJsonSection(getExamResults, saveExamResults, { reEvaluationNote: '', schedules: [] })

  // Policy pages
  const [ord, updateOrd, saveOrd, savingOrd, savedOrd, errorOrd] = useJsonSection(getOrdinances,  saveOrdinances,  ordinancesDefault)
  const [plag, updatePlag, savePlag, savingPlag, savedPlag, errorPlag] = useJsonSection(getPlagiarism, savePlagiarism, plagiarismDefault)
  const [ethics, updateEthics, saveEthics, savingEthics, savedEthics, errorEthics] = useJsonSection(getCodeOfEthics, saveCodeOfEthics, codeOfEthicsDefault)
  const [obe, updateObe, saveObe, savingObe, savedObe, errorObe] = useJsonSection(getObeNep, saveObeNep, obeNepDefault)

  // JSON raw editor helper (for complex objects)
  const [rawJson, setRawJson] = useState<Record<string, string>>({})
  const [rawError, setRawError] = useState<Record<string, string>>({})

  const initRaw = (key: string, data: unknown) => {
    if (!rawJson[key]) setRawJson(p => ({ ...p, [key]: JSON.stringify(data, null, 2) }))
  }

  const JsonEditor: React.FC<{ tabKey: string; data: unknown; onSave: (parsed: any) => void; saving: boolean; saved: boolean }> =
    ({ tabKey, data, onSave, saving, saved }) => {
    useEffect(() => { initRaw(tabKey, data) }, [tabKey, data])
    return (
      <div className="space-y-3">
        <textarea
          rows={14}
          value={rawJson[tabKey] ?? ''}
          onChange={e => { setRawJson(p => ({ ...p, [tabKey]: e.target.value })); setRawError(p => ({ ...p, [tabKey]: '' })) }}
          className="w-full font-mono text-xs border border-slate-200 rounded px-3 py-2 bg-slate-50 focus:outline-none focus:border-primary"
          spellCheck={false}
        />
        {rawError[tabKey] && <p className="text-xs text-red-600 flex items-center gap-1"><AlertTriangle size={12} />{rawError[tabKey]}</p>}
        <div className="flex justify-end">
          <button
            disabled={saving}
            onClick={() => {
              try { onSave(JSON.parse(rawJson[tabKey])) }
              catch { setRawError(p => ({ ...p, [tabKey]: 'Invalid JSON — fix syntax before saving.' })) }
            }}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-primary text-white text-xs font-bold rounded hover:bg-primary/90 disabled:opacity-60"
          >
            {saving ? <><Loader2 size={13} className="animate-spin" />Saving…</> : saved ? <><CheckCircle2 size={13} />Saved!</> : <><Save size={13} />Save</>}
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-2 pb-4 border-b border-slate-200">
        <GraduationCap size={22} className="text-accent" />
        <div>
          <h2 className="font-display text-2xl font-bold text-slate-800">Academics CMS</h2>
          <p className="text-xs text-slate-500 mt-0.5">Manage all 12 sections of the Academics landing page</p>
        </div>
      </div>

      {/* Tab bar */}
      <div className="flex flex-wrap gap-1.5 border-b border-slate-200 pb-3">
        {TABS.map(t => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`px-3 py-1.5 text-xs font-semibold rounded transition-colors ${
              tab === t.id ? 'bg-primary text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* ── Landing Page ── */}
      {tab === 'landing' && (
        <div className="space-y-8">
          <div className="space-y-4 bg-white border border-slate-200 rounded p-5">
            <h3 className="font-bold text-slate-800 text-sm border-b pb-2">Hero Text</h3>
            <div>
              <label className={labelCls}>Section Badge Label</label>
              <input className={inputCls} value={landingMeta.sectionLabel ?? ''} onChange={e => updateLandingMeta(m => ({ ...m, sectionLabel: e.target.value }))} />
            </div>
            <div>
              <label className={labelCls}>Page Title (H1)</label>
              <input className={inputCls} value={landingMeta.heroTitle ?? ''} onChange={e => updateLandingMeta(m => ({ ...m, heroTitle: e.target.value }))} />
            </div>
            <div>
              <label className={labelCls}>Subtitle</label>
              <textarea rows={2} className={inputCls} value={landingMeta.heroSubtitle ?? ''} onChange={e => updateLandingMeta(m => ({ ...m, heroSubtitle: e.target.value }))} />
            </div>
            {errorMeta && <p className="text-xs text-red-600">{errorMeta}</p>}
            <div className="flex justify-end"><SaveBtn saving={savingMeta} saved={savedMeta} onClick={saveLandingMeta} /></div>
          </div>

          <div className="space-y-4 bg-white border border-slate-200 rounded p-5">
            <h3 className="font-bold text-slate-800 text-sm border-b pb-2">Navigation Cards (12 cards)</h3>
            <p className="text-xs text-slate-500">Each card: title, description, path, iconName (Lucide icon name), badge (optional).</p>
            <div className="space-y-3">
              {(landingCards as any[]).map((card: any, i: number) => (
                <div key={i} className="border border-slate-200 rounded p-3 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono text-slate-400">Card #{i + 1}</span>
                    <button onClick={() => updateLandingCards((c: any) => (c as any[]).filter((_: any, j: number) => j !== i))} className="text-slate-300 hover:text-primary"><Trash2 size={13} /></button>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div><label className={labelCls}>Title</label><input className={inputCls} value={card.title} onChange={e => updateLandingCards((c: any) => { const n = [...c]; n[i] = { ...n[i], title: e.target.value }; return n as any })} /></div>
                    <div><label className={labelCls}>Icon Name</label><input className={inputCls + ' font-mono'} value={card.iconName} onChange={e => updateLandingCards((c: any) => { const n = [...c]; n[i] = { ...n[i], iconName: e.target.value }; return n as any })} /></div>
                  </div>
                  <div><label className={labelCls}>Description</label><input className={inputCls} value={card.description} onChange={e => updateLandingCards((c: any) => { const n = [...c]; n[i] = { ...n[i], description: e.target.value }; return n as any })} /></div>
                  <div className="grid grid-cols-2 gap-2">
                    <div><label className={labelCls}>Path</label><input className={inputCls + ' font-mono'} value={card.path} onChange={e => updateLandingCards((c: any) => { const n = [...c]; n[i] = { ...n[i], path: e.target.value }; return n as any })} /></div>
                    <div><label className={labelCls}>Badge (optional)</label><input className={inputCls} value={card.badge ?? ''} onChange={e => updateLandingCards((c: any) => { const n = [...c]; n[i] = { ...n[i], badge: e.target.value || undefined }; return n as any })} /></div>
                  </div>
                </div>
              ))}
            </div>
            <button onClick={() => updateLandingCards((c: any) => [...c, { iconName: 'BookOpen', title: 'New Section', description: '', path: '/academics/new' }] as any)} className="text-xs font-semibold text-primary flex items-center gap-1 hover:underline">
              <Plus size={12} /> Add card
            </button>
            {errorCards && <p className="text-xs text-red-600">{errorCards}</p>}
            <div className="flex justify-end"><SaveBtn saving={savingCards} saved={savedCards} onClick={saveLandingCards} /></div>
          </div>
        </div>
      )}

      {/* ── UG Courses ── */}
      {tab === 'ug' && (
        <div className="space-y-4 bg-white border border-slate-200 rounded p-5">
          <h3 className="font-bold text-slate-800 text-sm border-b pb-2">Undergraduate (UG) Courses</h3>
          <div>
            <label className={labelCls}>Intro Narrative</label>
            <textarea rows={3} className={inputCls} value={(ug as any).intro ?? ''} onChange={e => updateUg((d: any) => ({ ...d, intro: e.target.value }))} />
          </div>
          <div>
            <label className={labelCls}>UG Course List</label>
            <table className="w-full text-xs border border-slate-200 rounded overflow-hidden mb-2">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="px-3 py-2 text-left text-slate-600 font-bold">Course Name</th>
                  <th className="px-3 py-2 text-left text-slate-600 font-bold w-24">Intake</th>
                  <th className="px-3 py-2 text-left text-slate-600 font-bold w-24">Code</th>
                  <th className="px-3 py-2 w-10"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {((ug as any).courses ?? []).map((c: any, i: number) => (
                  <tr key={i}>
                    <td className="px-2 py-1"><input className={inputCls} value={c.name} onChange={e => updateUg((d: any) => { const l = [...d.courses]; l[i] = { ...l[i], name: e.target.value }; return { ...d, courses: l } })} /></td>
                    <td className="px-2 py-1"><input type="number" className={inputCls} value={c.seats} onChange={e => updateUg((d: any) => { const l = [...d.courses]; l[i] = { ...l[i], seats: +e.target.value }; return { ...d, courses: l } })} /></td>
                    <td className="px-2 py-1"><input className={inputCls + ' uppercase font-mono'} value={c.code} onChange={e => updateUg((d: any) => { const l = [...d.courses]; l[i] = { ...l[i], code: e.target.value }; return { ...d, courses: l } })} /></td>
                    <td className="px-2 py-1 text-center"><button onClick={() => updateUg((d: any) => ({ ...d, courses: d.courses.filter((_: any, j: number) => j !== i) }))} className="text-slate-400 hover:text-primary"><Trash2 size={13} /></button></td>
                  </tr>
                ))}
              </tbody>
            </table>
            <button onClick={() => updateUg((d: any) => ({ ...d, courses: [...(d.courses ?? []), { name: 'New Program', seats: 60, code: 'NEW' }] }))} className="text-xs font-semibold text-primary flex items-center gap-1 hover:underline"><Plus size={12} />Add course</button>
          </div>
          {errorUg && <p className="text-xs text-red-600">{errorUg}</p>}
          <div className="flex justify-end"><SaveBtn saving={savingUg} saved={savedUg} onClick={saveUg} /></div>
        </div>
      )}

      {/* ── PG Courses ── */}
      {tab === 'pg' && (
        <div className="space-y-4 bg-white border border-slate-200 rounded p-5">
          <h3 className="font-bold text-slate-800 text-sm border-b pb-2">Postgraduate (PG) Courses</h3>
          <div>
            <label className={labelCls}>Intro Narrative</label>
            <textarea rows={3} className={inputCls} value={(pg as any).intro ?? ''} onChange={e => updatePg((d: any) => ({ ...d, intro: e.target.value }))} />
          </div>
          <div>
            <label className={labelCls}>PG Programs List</label>
            <table className="w-full text-xs border border-slate-200 rounded overflow-hidden mb-2">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="px-3 py-2 text-left text-slate-600 font-bold">Program</th>
                  <th className="px-3 py-2 text-left text-slate-600 font-bold">Department</th>
                  <th className="px-3 py-2 text-left text-slate-600 font-bold w-16">Intake</th>
                  <th className="px-3 py-2 text-left text-slate-600 font-bold w-40">Eligibility</th>
                  <th className="px-3 py-2 w-10"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {((pg as any).programs ?? []).map((p: any, i: number) => (
                  <tr key={i}>
                    <td className="px-2 py-1"><input className={inputCls} value={p.program} onChange={e => updatePg((d: any) => { const l = [...d.programs]; l[i] = { ...l[i], program: e.target.value }; return { ...d, programs: l } })} /></td>
                    <td className="px-2 py-1"><input className={inputCls} value={p.dept} onChange={e => updatePg((d: any) => { const l = [...d.programs]; l[i] = { ...l[i], dept: e.target.value }; return { ...d, programs: l } })} /></td>
                    <td className="px-2 py-1"><input type="number" className={inputCls} value={p.intake} onChange={e => updatePg((d: any) => { const l = [...d.programs]; l[i] = { ...l[i], intake: +e.target.value }; return { ...d, programs: l } })} /></td>
                    <td className="px-2 py-1"><input className={inputCls} value={p.eligibility} onChange={e => updatePg((d: any) => { const l = [...d.programs]; l[i] = { ...l[i], eligibility: e.target.value }; return { ...d, programs: l } })} /></td>
                    <td className="px-2 py-1 text-center"><button onClick={() => updatePg((d: any) => ({ ...d, programs: d.programs.filter((_: any, j: number) => j !== i) }))} className="text-slate-400 hover:text-primary"><Trash2 size={13} /></button></td>
                  </tr>
                ))}
              </tbody>
            </table>
            <button onClick={() => updatePg((d: any) => ({ ...d, programs: [...(d.programs ?? []), { program: 'New Program', dept: 'Department', intake: 18, eligibility: 'B.Tech/GATE' }] }))} className="text-xs font-semibold text-primary flex items-center gap-1 hover:underline"><Plus size={12} />Add program</button>
          </div>
          {errorPg && <p className="text-xs text-red-600">{errorPg}</p>}
          <div className="flex justify-end"><SaveBtn saving={savingPg} saved={savedPg} onClick={savePg} /></div>
        </div>
      )}

      {/* ── PhD / PTDC / Online — JSON editors (complex nested data) ── */}
      {tab === 'phd' && (
        <div className="space-y-3 bg-white border border-slate-200 rounded p-5">
          <h3 className="font-bold text-slate-800 text-sm border-b pb-2">Ph.D. Programs</h3>
          <p className="text-xs text-slate-500">Fields: intro, stats [{'{'}value, label{'}'}], departments [{'{'}dept, areas{'}'}], processSteps [{'{'}step, desc{'}'}]</p>
          <JsonEditor tabKey="phd" data={phd} onSave={d => { updatePhd(() => d); savePhd() }} saving={savingPhd} saved={savedPhd} />
          {errorPhd && <p className="text-xs text-red-600">{errorPhd}</p>}
        </div>
      )}

      {tab === 'ptdc' && (
        <div className="space-y-3 bg-white border border-slate-200 rounded p-5">
          <h3 className="font-bold text-slate-800 text-sm border-b pb-2">PTDC Courses</h3>
          <p className="text-xs text-slate-500">Array of course objects. Each course: name, duration, fee, eligibility, etc.</p>
          <JsonEditor tabKey="ptdc" data={ptdc} onSave={d => { updatePtdc(() => d); savePtdc() }} saving={savingPtdc} saved={savedPtdc} />
          {errorPtdc && <p className="text-xs text-red-600">{errorPtdc}</p>}
        </div>
      )}

      {tab === 'online' && (
        <div className="space-y-3 bg-white border border-slate-200 rounded p-5">
          <h3 className="font-bold text-slate-800 text-sm border-b pb-2">Online Courses (MOOC)</h3>
          <p className="text-xs text-slate-500">Array of course links. Each: title, platform, url, credits.</p>
          <JsonEditor tabKey="online" data={online} onSave={d => { updateOnline(() => d); saveOnline() }} saving={savingOnline} saved={savedOnline} />
          {errorOnline && <p className="text-xs text-red-600">{errorOnline}</p>}
        </div>
      )}

      {tab === 'firstyear' && (
        <div className="space-y-3 bg-white border border-slate-200 rounded p-5">
          <h3 className="font-bold text-slate-800 text-sm border-b pb-2">First Year Info</h3>
          <p className="text-xs text-slate-500">Fields: welcomeText, checklist [{'{'}item, when{'}'}], subjects [{'{'}code, subject, credits{'}'}], contacts [{'{'}label, phone, email, note{'}'}]</p>
          <JsonEditor tabKey="firstyear" data={fy} onSave={d => { updateFy(() => d); saveFy() }} saving={savingFy} saved={savedFy} />
          {errorFy && <p className="text-xs text-red-600">{errorFy}</p>}
        </div>
      )}

      {tab === 'exam' && (
        <div className="space-y-3 bg-white border border-slate-200 rounded p-5">
          <h3 className="font-bold text-slate-800 text-sm border-b pb-2">Exam & Results</h3>
          <p className="text-xs text-slate-500">Fields: reEvaluationNote, schedules [{'{'}type, months, note{'}'}]</p>
          <JsonEditor tabKey="exam" data={exam} onSave={d => { updateExam(() => d); saveExam() }} saving={savingExam} saved={savedExam} />
          {errorExam && <p className="text-xs text-red-600">{errorExam}</p>}
        </div>
      )}

      {/* ── Ordinances ── */}
      {tab === 'ordinances' && (
        <div className="space-y-5 bg-white border border-slate-200 rounded p-5">
          <h3 className="font-bold text-slate-800 text-sm border-b pb-2">Academic Ordinances</h3>
          <div><label className={labelCls}>Intro Text</label><textarea rows={3} className={inputCls} value={ord.intro ?? ''} onChange={e => updateOrd(d => ({ ...d, intro: e.target.value }))} /></div>
          <div><label className={labelCls}>Attendance Rules (one per line = one bullet)</label><ParagraphList items={ord.attendanceRules ?? []} onChange={v => updateOrd(d => ({ ...d, attendanceRules: v }))} /></div>
          <div><label className={labelCls}>Examination Rules</label><ParagraphList items={ord.examRules ?? []} onChange={v => updateOrd(d => ({ ...d, examRules: v }))} /></div>
          <div><label className={labelCls}>Academic Integrity Rules</label><ParagraphList items={ord.integrityRules ?? []} onChange={v => updateOrd(d => ({ ...d, integrityRules: v }))} /></div>
          <div>
            <label className={labelCls}>Ordinance Documents</label>
            <div className="space-y-2">
              {(ord.documents ?? []).map((doc, i) => (
                <div key={i} className="flex gap-2 items-center border border-slate-100 rounded p-2">
                  <input className={inputCls} placeholder="Title" value={doc.title} onChange={e => updateOrd(d => { const l = [...(d.documents ?? [])]; l[i] = { ...l[i], title: e.target.value }; return { ...d, documents: l } })} />
                  <input className="w-20 border border-slate-200 rounded px-2 py-2 text-xs" placeholder="Size" value={doc.size} onChange={e => updateOrd(d => { const l = [...(d.documents ?? [])]; l[i] = { ...l[i], size: e.target.value }; return { ...d, documents: l } })} />
                  <input className="w-16 border border-slate-200 rounded px-2 py-2 text-xs" placeholder="Year" value={doc.year} onChange={e => updateOrd(d => { const l = [...(d.documents ?? [])]; l[i] = { ...l[i], year: e.target.value }; return { ...d, documents: l } })} />
                  <input className="flex-1 border border-slate-200 rounded px-2 py-2 text-xs font-mono" placeholder="URL (optional)" value={doc.url ?? ''} onChange={e => updateOrd(d => { const l = [...(d.documents ?? [])]; l[i] = { ...l[i], url: e.target.value }; return { ...d, documents: l } })} />
                  <button onClick={() => updateOrd(d => ({ ...d, documents: (d.documents ?? []).filter((_, j) => j !== i) }))} className="text-slate-400 hover:text-primary"><Trash2 size={13} /></button>
                </div>
              ))}
              <button onClick={() => updateOrd(d => ({ ...d, documents: [...(d.documents ?? []), { title: '', size: '', year: '' }] }))} className="text-xs font-semibold text-primary flex items-center gap-1 hover:underline"><Plus size={12} />Add document</button>
            </div>
          </div>
          {errorOrd && <p className="text-xs text-red-600">{errorOrd}</p>}
          <div className="flex justify-end"><SaveBtn saving={savingOrd} saved={savedOrd} onClick={saveOrd} /></div>
        </div>
      )}

      {/* ── Plagiarism ── */}
      {tab === 'plagiarism' && (
        <div className="space-y-5 bg-white border border-slate-200 rounded p-5">
          <h3 className="font-bold text-slate-800 text-sm border-b pb-2">Plagiarism Policy</h3>
          <div><label className={labelCls}>Intro Paragraph</label><textarea rows={3} className={inputCls} value={plag.intro ?? ''} onChange={e => updatePlag(d => ({ ...d, intro: e.target.value }))} /></div>
          <div><label className={labelCls}>Policy Paragraphs</label><ParagraphList items={plag.paragraphs ?? []} onChange={v => updatePlag(d => ({ ...d, paragraphs: v }))} /></div>
          {errorPlag && <p className="text-xs text-red-600">{errorPlag}</p>}
          <div className="flex justify-end"><SaveBtn saving={savingPlag} saved={savedPlag} onClick={savePlag} /></div>
        </div>
      )}

      {/* ── Code of Ethics ── */}
      {tab === 'ethics' && (
        <div className="space-y-5 bg-white border border-slate-200 rounded p-5">
          <h3 className="font-bold text-slate-800 text-sm border-b pb-2">Code of Ethics</h3>
          <div><label className={labelCls}>Anti-Ragging Alert Text</label><textarea rows={3} className={inputCls} value={ethics.antiRaggingAlert ?? ''} onChange={e => updateEthics(d => ({ ...d, antiRaggingAlert: e.target.value }))} /></div>
          <div>
            <label className={labelCls}>Guidelines Cards</label>
            <div className="space-y-2">
              {(ethics.guidelines ?? []).map((g, i) => (
                <div key={i} className="flex gap-2 border border-slate-100 rounded p-2">
                  <div className="flex-1 space-y-1">
                    <input className={inputCls} placeholder="Title" value={g.title} onChange={e => updateEthics(d => { const l = [...(d.guidelines ?? [])]; l[i] = { ...l[i], title: e.target.value }; return { ...d, guidelines: l } })} />
                    <textarea rows={2} className={inputCls} placeholder="Description" value={g.desc} onChange={e => updateEthics(d => { const l = [...(d.guidelines ?? [])]; l[i] = { ...l[i], desc: e.target.value }; return { ...d, guidelines: l } })} />
                  </div>
                  <button onClick={() => updateEthics(d => ({ ...d, guidelines: (d.guidelines ?? []).filter((_, j) => j !== i) }))} className="text-slate-400 hover:text-primary self-start"><Trash2 size={13} /></button>
                </div>
              ))}
              <button onClick={() => updateEthics(d => ({ ...d, guidelines: [...(d.guidelines ?? []), { title: '', desc: '' }] }))} className="text-xs font-semibold text-primary flex items-center gap-1 hover:underline"><Plus size={12} />Add guideline</button>
            </div>
          </div>
          <div><label className={labelCls}>PDF Download URL</label><input className={inputCls + ' font-mono'} value={ethics.pdfUrl ?? ''} onChange={e => updateEthics(d => ({ ...d, pdfUrl: e.target.value }))} /></div>
          {errorEthics && <p className="text-xs text-red-600">{errorEthics}</p>}
          <div className="flex justify-end"><SaveBtn saving={savingEthics} saved={savedEthics} onClick={saveEthics} /></div>
        </div>
      )}

      {/* ── OBE & NEP 2020 ── */}
      {tab === 'obe' && (
        <div className="space-y-5 bg-white border border-slate-200 rounded p-5">
          <h3 className="font-bold text-slate-800 text-sm border-b pb-2">OBE & NEP 2020</h3>
          <div><label className={labelCls}>Intro Paragraph</label><textarea rows={3} className={inputCls} value={obe.intro ?? ''} onChange={e => updateObe(d => ({ ...d, intro: e.target.value }))} /></div>
          <div><label className={labelCls}>Content Paragraphs</label><ParagraphList items={obe.paragraphs ?? []} onChange={v => updateObe(d => ({ ...d, paragraphs: v }))} /></div>
          {errorObe && <p className="text-xs text-red-600">{errorObe}</p>}
          <div className="flex justify-end"><SaveBtn saving={savingObe} saved={savedObe} onClick={saveObe} /></div>
        </div>
      )}
    </div>
  )
}

export default AdminAcademicsCms
