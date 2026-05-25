import React, { useEffect, useState } from 'react'
import { Network, RefreshCw } from 'lucide-react'
import footerService, { type FooterDepartmentConfig } from '../../../services/footerService'
import { departmentService } from '../../../services'
import type { DepartmentSummary } from '../../../services/departmentService'
import { useSectionSave, SectionCard, Card, CardHeading, Field, Inp, Toggle, BackendNote, LoadingSkeleton } from './_shared'

const FooterDepartmentsEditor: React.FC = () => {
  const { data, setData, loading, saving, saved, handleSave } = useSectionSave<FooterDepartmentConfig>(
    footerService.getDepartmentConfig,
    footerService.saveDepartmentConfig,
  )
  const [allDepts, setAllDepts] = useState<DepartmentSummary[]>([])

  useEffect(() => {
    departmentService.getDepartments().then(setAllDepts)
  }, [])

  if (loading) return <LoadingSkeleton />
  if (!data) return null

  const set = <K extends keyof FooterDepartmentConfig>(key: K, val: FooterDepartmentConfig[K]) =>
    setData(d => d ? { ...d, [key]: val } : d)

  const toggleSlug = (slug: string) => {
    const current = data.visibleSlugs
    const updated = current.includes(slug) ? current.filter(s => s !== slug) : [...current, slug]
    set('visibleSlugs', updated)
  }

  const activeDepts = allDepts.filter(d => d.isActive)

  return (
    <SectionCard
      title="Department Links"
      subtitle="Auto-syncs from Department CMS — control which departments appear in the footer"
      saving={saving}
      saved={saved}
      onSave={() => handleSave(data)}
    >
      <Card>
        <CardHeading icon={<Network size={15} />}>Department Column Settings</CardHeading>
        <div className="space-y-4">
          <Toggle
            checked={data.visible}
            onChange={v => set('visible', v)}
            label="Show Department Links Column"
            desc="Adds a department column to the footer grid when enabled"
          />
          <div className="grid grid-cols-2 gap-4">
            <Field label="Column Heading">
              <Inp value={data.heading} onChange={e => set('heading', e.target.value)} placeholder="Departments" />
            </Field>
            <Field label="Max Visible" hint="Maximum department links to display">
              <Inp type="number" min={1} max={20} value={data.maxVisible}
                onChange={e => set('maxVisible', Number(e.target.value))} />
            </Field>
          </div>
          <Toggle
            checked={data.autoSync}
            onChange={v => set('autoSync', v)}
            label="Auto-Sync with Department CMS"
            desc="When enabled, footer automatically shows all active departments. Disable to manually select."
          />
        </div>
      </Card>

      {!data.autoSync && (
        <Card>
          <CardHeading icon={<RefreshCw size={15} />}>Manual Department Selection</CardHeading>
          <p className="text-xs text-slate-500 mb-4">
            Select which departments appear in the footer. Only active departments are listed.
          </p>
          {activeDepts.length === 0 ? (
            <p className="text-sm text-slate-400 text-center py-4">No departments found. Add departments via Department CMS.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-64 overflow-y-auto pr-1">
              {activeDepts.map(dept => (
                <label key={dept.slug} className="flex items-center gap-2.5 cursor-pointer p-2 border border-slate-100 rounded hover:bg-slate-50 transition-colors">
                  <input
                    type="checkbox"
                    checked={data.visibleSlugs.length === 0 || data.visibleSlugs.includes(dept.slug)}
                    onChange={() => toggleSlug(dept.slug)}
                    className="w-4 h-4 accent-primary flex-shrink-0"
                  />
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-slate-700 truncate">{dept.shortName}</p>
                    <p className="text-[10px] text-slate-400 truncate">{dept.slug}</p>
                  </div>
                </label>
              ))}
            </div>
          )}
          <p className="text-[10px] text-slate-400 mt-3">
            {data.visibleSlugs.length === 0
              ? '⚡ All active departments selected (same as Auto-Sync)'
              : `${data.visibleSlugs.length} department(s) manually selected`}
          </p>
        </Card>
      )}

      {data.autoSync && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-xs text-green-700">
          <p className="font-bold mb-1">✓ Auto-Sync Active</p>
          <p>Footer will automatically show up to <strong>{data.maxVisible}</strong> active departments from the Department CMS. Department additions/removals are reflected immediately without any footer config changes.</p>
          <p className="mt-1 text-green-600">{activeDepts.length} active department(s) currently in CMS.</p>
        </div>
      )}

      <BackendNote endpoint="PUT /api/cms/footer/departments" />
    </SectionCard>
  )
}

export default FooterDepartmentsEditor
