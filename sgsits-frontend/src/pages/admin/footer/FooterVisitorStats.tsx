import React from 'react'
import { BarChart3, Globe } from 'lucide-react'
import footerService, { type FooterVisitorStats } from '../../../services/footerService'
import { useSectionSave, SectionCard, Card, CardHeading, Field, Inp, Txta, Toggle, BackendNote, LoadingSkeleton } from './_shared'

const FooterVisitorStatsEditor: React.FC = () => {
  const { data, setData, loading, saving, saved, handleSave } = useSectionSave<FooterVisitorStats>(
    footerService.getVisitorStats,
    footerService.saveVisitorStats,
  )

  if (loading) return <LoadingSkeleton />
  if (!data) return null

  const set = <K extends keyof FooterVisitorStats>(key: K, val: FooterVisitorStats[K]) =>
    setData(d => d ? { ...d, [key]: val } : d)

  return (
    <SectionCard
      title="Visitor Statistics"
      subtitle="The visitor count widget shown in the footer portals column"
      saving={saving}
      saved={saved}
      onSave={() => handleSave(data)}
    >
      <Card>
        <CardHeading icon={<BarChart3 size={15} />}>Visitor Count Widget</CardHeading>
        <div className="space-y-4">
          <Toggle
            checked={data.enabled}
            onChange={v => set('enabled', v)}
            label="Show Visitor Statistics Widget"
            desc="Display the visitor count box in the footer"
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Widget Label" hint="Small label above the count">
              <Inp value={data.label} onChange={e => set('label', e.target.value)} placeholder="Visitor Statistics" />
            </Field>
            <Field label="Visitor Count" hint="Static or API-driven count value">
              <Inp value={data.count} onChange={e => set('count', e.target.value)} placeholder="02,485,391" />
            </Field>
          </div>
          <Field label="Note / Sub-label" hint="Small text below the count (refresh interval, audit note, etc.)">
            <Inp value={data.note} onChange={e => set('note', e.target.value)}
              placeholder="Refreshed hourly • Institutional audit" />
          </Field>
        </div>
      </Card>

      {/* Live preview */}
      <Card className="bg-[#0b2545] border-none">
        <p className="text-[10px] text-slate-400 uppercase tracking-widest mb-3 font-semibold">Preview (footer context)</p>
        {data.enabled ? (
          <div className="bg-white/5 border border-white/15 rounded p-4 space-y-2 max-w-[200px]">
            <span className="text-[10px] uppercase font-serif text-[#bfa15f] tracking-widest block font-medium">{data.label || 'Visitor Statistics'}</span>
            <div className="flex items-center gap-2">
              <Globe className="w-4 h-4 text-[#bfa15f] shrink-0" />
              <span className="text-[17px] font-mono font-bold text-white tracking-widest leading-none">{data.count || '—'}</span>
            </div>
            <p className="text-[9px] text-slate-400 font-sans font-semibold leading-relaxed">{data.note}</p>
          </div>
        ) : (
          <p className="text-sm text-slate-500 italic">Widget hidden</p>
        )}
      </Card>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-xs text-blue-700">
        <p className="font-bold mb-1">🔌 Future API Integration</p>
        <p>When the analytics backend is ready, replace the static <strong>count</strong> value with a real-time API call to <code className="font-mono">GET /api/analytics/visitor-count</code>. The widget label and note will remain CMS-managed.</p>
      </div>

      <BackendNote endpoint="PUT /api/cms/footer/visitor-stats" />
    </SectionCard>
  )
}

export default FooterVisitorStatsEditor
