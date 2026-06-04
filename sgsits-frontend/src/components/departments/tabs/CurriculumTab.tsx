import React, { useState, useEffect } from 'react'
import { FileText, Eye, Download } from 'lucide-react'
import { getDeptSection } from '../../../services/departmentService'

interface CurriculumDoc {
  title: string
  size?: string
  url: string
}

interface CurriculumSection {
  intro?: string
  docs?: CurriculumDoc[]
}

interface CurriculumTabProps {
  slug: string
  onOpenPdf: (url: string, title: string) => void
}

const CurriculumTab: React.FC<CurriculumTabProps> = ({ slug, onOpenPdf }) => {
  const [data, setData] = useState<CurriculumSection | null>(null)

  useEffect(() => {
    getDeptSection<CurriculumSection>(slug, 'curriculum').then(d => { if (d) setData(d) })
  }, [slug])

  const docs = data?.docs ?? []

  return (
    <div className="space-y-6">
      <div className="pb-3 border-b border-slate-200 flex items-center justify-between">
        <h2 className="text-xl font-display font-bold text-slate-900">Syllabi & Credit Schemes</h2>
        <span className="text-xs font-bold bg-slate-50 text-slate-700 px-2 py-0.5 rounded border border-slate-200 uppercase">NEP 2020 Ready</span>
      </div>
      <p className="text-xs md:text-sm text-slate-600 leading-relaxed font-sans">
        {data?.intro || 'Download the official PDF schemes and syllabus booklets ratified by the Academic Council for respective academic batches.'}
      </p>

      {docs.length === 0 ? (
        <p className="text-xs text-slate-400 italic py-8 text-center">No curriculum documents uploaded yet. Contact HOD.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
          {docs.map((doc, idx) => (
            <div key={idx} className="p-4 bg-white border border-slate-200 rounded flex items-center justify-between hover:border-slate-350 hover:bg-slate-50/50 transition-colors duration-200 shadow-sm">
              <div className="flex items-start gap-3 flex-1 min-w-0 mr-2">
                <FileText className="w-5 h-5 text-accent-blue flex-shrink-0 mt-0.5" strokeWidth={1.75} />
                <div className="min-w-0">
                  <h4 className="text-xs font-bold text-slate-800 leading-snug line-clamp-2">{doc.title}</h4>
                  {doc.size && <p className="text-xs text-slate-400 mt-0.5 font-medium font-sans">PDF • {doc.size}</p>}
                </div>
              </div>
              <div className="flex gap-1 shrink-0">
                <button
                  onClick={() => onOpenPdf(doc.url, doc.title)}
                  className="p-2 bg-white border border-slate-200 rounded hover:text-primary hover:border-slate-350 text-slate-500 hover:shadow-sm transition-colors"
                  title="View PDF"
                >
                  <Eye className="w-3.5 h-3.5" />
                </button>
                <a
                  href={doc.url}
                  download
                  className="p-2 bg-white border border-slate-200 rounded hover:text-primary hover:border-slate-350 text-slate-500 hover:shadow-sm transition-colors"
                  title="Download"
                >
                  <Download className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default CurriculumTab
