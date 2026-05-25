import React from 'react'
import { AlignCenter } from 'lucide-react'
import footerService, { type FooterBottomBar } from '../../../services/footerService'
import { useSectionSave, SectionCard, Card, CardHeading, Field, Inp, Txta, Toggle, BackendNote, LoadingSkeleton } from './_shared'

const FooterBottomBarEditor: React.FC = () => {
  const { data, setData, loading, saving, saved, handleSave } = useSectionSave<FooterBottomBar>(
    footerService.getBottomBar,
    footerService.saveBottomBar,
  )

  if (loading) return <LoadingSkeleton />
  if (!data) return null

  const set = <K extends keyof FooterBottomBar>(key: K, val: FooterBottomBar[K]) =>
    setData(d => d ? { ...d, [key]: val } : d)

  const currentYear = new Date().getFullYear()

  return (
    <SectionCard
      title="Bottom Bar"
      subtitle="The very bottom strip: copyright, powered-by, and developer credits"
      saving={saving}
      saved={saved}
      onSave={() => handleSave(data)}
    >
      <Card>
        <CardHeading icon={<AlignCenter size={15} />}>Bottom Strip Content</CardHeading>
        <div className="space-y-4">
          <Toggle
            checked={data.visible}
            onChange={v => set('visible', v)}
            label="Show Bottom Bar"
            desc="Toggle the entire copyright/credits bottom strip"
          />
          <Toggle
            checked={data.showCopyrightYear}
            onChange={v => set('showCopyrightYear', v)}
            label="Auto-prepend Current Year"
            desc={`Automatically shows the current year (${currentYear}) before the copyright text`}
          />
          <Field label="Copyright Owner Text" required hint={`Preview: © ${currentYear} ${data.copyrightOwner}`}>
            <Inp value={data.copyrightOwner} onChange={e => set('copyrightOwner', e.target.value)}
              placeholder="SGSITS Indore (M.P.), India. All rights reserved." />
          </Field>
          <Field label="Developer / Technical Credit" hint="Short line about how the site was developed">
            <Txta rows={2} value={data.developerCredit} onChange={e => set('developerCredit', e.target.value)}
              placeholder="Designed and developed as a responsive React single page application." />
          </Field>
          <Field label="Powered By" hint="Team or department credited for the website">
            <Inp value={data.poweredBy} onChange={e => set('poweredBy', e.target.value)}
              placeholder="SGSITS Web Cell" />
          </Field>
        </div>
      </Card>

      {/* Live preview */}
      <Card className="bg-[#0b2545] border-none">
        <p className="text-[10px] text-slate-400 uppercase tracking-widest mb-3 font-semibold">Preview (dark footer context)</p>
        <p className="text-[10px] text-slate-400 text-center leading-relaxed font-sans font-medium">
          {data.showCopyrightYear && `© ${currentYear} `}{data.copyrightOwner}
          {data.developerCredit && <><br />{data.developerCredit}</>}
          {data.poweredBy && <><br />Powered by: {data.poweredBy}</>}
        </p>
      </Card>

      <BackendNote endpoint="PUT /api/cms/footer/bottom-bar" />
    </SectionCard>
  )
}

export default FooterBottomBarEditor
