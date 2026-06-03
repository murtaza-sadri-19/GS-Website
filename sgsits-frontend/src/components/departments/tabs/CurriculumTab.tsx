import React from 'react'
import { FileText, Eye } from 'lucide-react'

interface PdfDoc {
  title: string
  size: string
  url: string
}

interface CurriculumTabProps {
  onOpenPdf: (url: string, title: string) => void
}

const DOCS: PdfDoc[] = [
  { title: 'B.Tech Scheme & Syllabus (1st Year Batch 2025-26)', size: '2.4 MB', url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf' },
  { title: 'B.Tech Core Scheme & Electives (2nd to 4th Year)', size: '4.8 MB', url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf' },
  { title: 'M.Tech / PGCourses Scheme (All Branches 2025-26)', size: '1.9 MB', url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf' },
  { title: 'List of Open Electives & Audit Courses (NEP 2020)', size: '1.2 MB', url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf' },
]

const CurriculumTab: React.FC<CurriculumTabProps> = ({ onOpenPdf }) => (
  <div className="space-y-6">
    <div className="pb-3 border-b border-slate-200 flex items-center justify-between">
      <h2 className="text-xl font-display font-bold text-slate-900">Syllabi & Credit Schemes</h2>
      <span className="text-[10px] font-bold bg-slate-50 text-slate-700 px-2 py-0.5 rounded border border-slate-200 uppercase">NEP 2020 Ready</span>
    </div>
    <p className="text-xs md:text-sm text-slate-650 leading-relaxed font-sans">
      Download the official PDF schemes and syllabus booklets ratified by the Academic Council for respective academic batches.
    </p>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
      {DOCS.map((doc, idx) => (
        <div
          key={idx}
          className="p-4 bg-white border border-slate-200 rounded flex items-center justify-between hover:border-slate-350 hover:bg-slate-50/50 transition-colors duration-200 shadow-sm"
        >
          <div className="flex items-start gap-3 w-[80%]">
            <FileText className="w-5 h-5 text-accent-blue flex-shrink-0 mt-0.5" strokeWidth={1.75} />
            <div>
              <h4 className="text-xs font-bold text-slate-800 leading-snug line-clamp-1">{doc.title}</h4>
              <p className="text-[10px] text-slate-400 mt-0.5 font-medium font-sans">PDF Booklet • {doc.size}</p>
            </div>
          </div>
          <button
            onClick={() => onOpenPdf(doc.url, doc.title)}
            className="p-2 bg-white border border-slate-200 rounded hover:text-primary hover:border-slate-350 text-slate-500 hover:shadow-sm transition-colors duration-200"
            title="View PDF inline"
          >
            <Eye className="w-3.5 h-3.5" />
          </button>
        </div>
      ))}
    </div>
  </div>
)

export default CurriculumTab
