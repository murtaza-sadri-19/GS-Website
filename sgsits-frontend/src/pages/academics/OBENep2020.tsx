import React, { useState, useEffect } from 'react'
import PageSeo from '../../components/global/PageSeo'
import { getObeNep, obeNepDefault, type ObeNepData } from '../../services/academicsService'

const OBENep2020: React.FC = () => {
  const [data, setData] = useState<ObeNepData>(obeNepDefault)

  useEffect(() => {
    getObeNep().then(d => { if (d && Object.keys(d).length > 0) setData(d) }).catch(() => {})
  }, [])

  const paragraphs = data.paragraphs ?? obeNepDefault.paragraphs ?? []

  return (
    <div className="space-y-8">
      <PageSeo pageKey="academics/obe-nep-2020" />
      <div className="border-b border-slate-200 pb-5">
        <h2 className="text-2xl md:text-3xl font-bold text-primary font-display">OBE & NEP 2020</h2>
        <p className="text-sm text-slate-500 mt-1">Outcome-Based Education and National Education Policy implementation</p>
      </div>

      <div className="space-y-4">
        <p className="text-slate-700 text-sm leading-relaxed">{data.intro}</p>
        {paragraphs.map((para, i) => (
          <p key={i} className="text-slate-700 text-sm leading-relaxed" dangerouslySetInnerHTML={{ __html: para }} />
        ))}
      </div>
    </div>
  )
}

export default OBENep2020
