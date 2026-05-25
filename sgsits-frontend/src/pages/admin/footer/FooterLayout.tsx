import React from 'react'
import { LayoutDashboard, CheckCircle2, XCircle } from 'lucide-react'
import footerService, { type FooterLayoutConfig } from '../../../services/footerService'
import { useSectionSave, SectionCard, Card, CardHeading, Toggle, BackendNote, LoadingSkeleton } from './_shared'

interface ToggleItem {
  key: keyof FooterLayoutConfig
  label: string
  desc: string
  group: 'columns' | 'strips'
}

const TOGGLES: ToggleItem[] = [
  // Columns
  { key: 'showBrandingColumn',  label: 'Branding + Contact Column',     desc: 'Logo, name, tagline, address, phone, email', group: 'columns' },
  { key: 'showQuickLinks',      label: 'Quick Links Column',            desc: 'Administration, About, Governing Body links', group: 'columns' },
  { key: 'showStudentLinks',    label: 'Student Links Column',          desc: 'Academic Calendar, Exam Results, Scholarships', group: 'columns' },
  { key: 'showDepartmentLinks', label: 'Department Links Column',       desc: 'Auto-synced department list (disabled by default)', group: 'columns' },
  { key: 'showExternalLinks',   label: 'External / Portals Column',     desc: 'AICTE, DTE MP, RGPV and other external links', group: 'columns' },
  { key: 'showVisitorStats',    label: 'Visitor Statistics Widget',     desc: 'Visitor count box in the portals column', group: 'columns' },
  { key: 'showSocialMedia',     label: 'Social Media Links',            desc: 'Facebook, Twitter, YouTube etc. (disabled by default)', group: 'columns' },
  // Bottom strips
  { key: 'showPolicyBar',       label: 'Policy Links Bar',              desc: 'Privacy Policy, Terms, Disclaimer horizontal strip', group: 'strips' },
  { key: 'showBottomBar',       label: 'Copyright / Bottom Bar',        desc: 'Copyright text, developer credits, powered-by line', group: 'strips' },
]

const FooterLayoutEditor: React.FC = () => {
  const { data, setData, loading, saving, saved, handleSave } = useSectionSave<FooterLayoutConfig>(
    footerService.getLayoutConfig,
    footerService.saveLayoutConfig,
  )

  if (loading) return <LoadingSkeleton />
  if (!data) return null

  const set = <K extends keyof FooterLayoutConfig>(key: K, val: FooterLayoutConfig[K]) =>
    setData(d => d ? { ...d, [key]: val } : d)

  const columnToggles = TOGGLES.filter(t => t.group === 'columns')
  const stripToggles  = TOGGLES.filter(t => t.group === 'strips')

  const enabledColumns = columnToggles.filter(t => data[t.key]).length

  return (
    <SectionCard
      title="Layout & Visibility"
      subtitle="Master switches — control which footer sections are visible on the public site"
      saving={saving}
      saved={saved}
      onSave={() => handleSave(data)}
    >
      {/* Visual layout summary */}
      <Card className="bg-slate-800 border-none">
        <p className="text-[10px] text-slate-400 uppercase tracking-widest mb-3 font-semibold">Footer Column Preview</p>
        <div className={`grid gap-2 ${
          enabledColumns >= 4 ? 'grid-cols-4' :
          enabledColumns === 3 ? 'grid-cols-3' :
          enabledColumns === 2 ? 'grid-cols-2' :
          'grid-cols-1'
        }`}>
          {columnToggles.map(t => data[t.key] && (
            <div key={t.key} className="bg-white/10 border border-white/20 rounded p-2 text-center">
              <p className="text-[9px] text-slate-300 font-semibold truncate">{t.label}</p>
            </div>
          ))}
          {enabledColumns === 0 && <p className="text-sm text-slate-400 text-center py-2">No columns enabled</p>}
        </div>
        <div className="mt-2 border-t border-white/10 pt-2 space-y-1">
          {stripToggles.map(t => (
            <div key={t.key} className={`flex items-center gap-2 text-[9px] ${data[t.key] ? 'text-slate-300' : 'text-slate-600'}`}>
              {data[t.key] ? <CheckCircle2 size={10} className="text-[#bfa15f]" /> : <XCircle size={10} />}
              {t.label}
            </div>
          ))}
        </div>
      </Card>

      <Card>
        <CardHeading icon={<LayoutDashboard size={15} />}>Footer Columns</CardHeading>
        <div className="space-y-2">
          {columnToggles.map(t => (
            <Toggle key={t.key} checked={!!data[t.key]} onChange={v => set(t.key, v as boolean)} label={t.label} desc={t.desc} />
          ))}
        </div>
      </Card>

      <Card>
        <CardHeading>Footer Bottom Strips</CardHeading>
        <div className="space-y-2">
          {stripToggles.map(t => (
            <Toggle key={t.key} checked={!!data[t.key]} onChange={v => set(t.key, v as boolean)} label={t.label} desc={t.desc} />
          ))}
        </div>
      </Card>

      <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 text-xs text-amber-700">
        <p className="font-bold mb-1">⚠️ Important</p>
        <p>These are <strong>master visibility controls</strong>. Hiding a section here does not delete its content — it only prevents it from rendering on the public site. You can re-enable any section at any time without losing data.</p>
      </div>

      <BackendNote endpoint="PUT /api/cms/footer/layout" />
    </SectionCard>
  )
}

export default FooterLayoutEditor
