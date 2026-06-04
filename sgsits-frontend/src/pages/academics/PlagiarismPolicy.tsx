import React, { useState, useEffect } from 'react'
import PageSeo from '../../components/global/PageSeo'
import { getPlagiarism, plagiarismDefault, type PlagiarismData } from '../../services/academicsService'

const PlagiarismPolicy: React.FC = () => {
  const [data, setData] = useState<PlagiarismData>(plagiarismDefault)

  useEffect(() => {
    getPlagiarism().then(d => { if (d && Object.keys(d).length > 0) setData(d) }).catch(() => {})
  }, [])

  const paragraphs = data.paragraphs ?? plagiarismDefault.paragraphs ?? []

  return (
    <div className="space-y-8">
      <PageSeo pageKey="academics/plagiarism-policy" />
      <div className="border-b border-slate-200 pb-5">
        <h2 className="text-2xl md:text-3xl font-bold text-primary font-display">Plagiarism Policy</h2>
        <p className="text-sm text-slate-500 mt-1">Anti-plagiarism policy for academic work</p>
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

export default PlagiarismPolicy
