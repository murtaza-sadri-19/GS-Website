import React, { useState, useEffect } from 'react'
import PageSeo from '../../components/global/PageSeo'
import { FileText, Download, AlertCircle, CheckCircle2 } from 'lucide-react'
import { getOrdinances, ordinancesDefault, type OrdinancesData } from '../../services/academicsService'

const Ordinances: React.FC = () => {
  const [data, setData] = useState<OrdinancesData>(ordinancesDefault)

  useEffect(() => {
    getOrdinances().then(d => { if (d && Object.keys(d).length > 0) setData(d) }).catch(() => {})
  }, [])

  const gradeTable    = data.gradeTable    ?? ordinancesDefault.gradeTable    ?? []
  const documents     = data.documents     ?? ordinancesDefault.documents     ?? []
  const attendanceRules  = data.attendanceRules  ?? ordinancesDefault.attendanceRules  ?? []
  const examRules     = data.examRules     ?? ordinancesDefault.examRules     ?? []
  const integrityRules   = data.integrityRules   ?? ordinancesDefault.integrityRules   ?? []

  return (
    <div className="space-y-10">
      <PageSeo pageKey="academics/ordinances" />
      <div className="border-b border-slate-200 pb-5">
        <span className="text-xs uppercase font-bold tracking-widest text-accent block mb-1">Academics</span>
        <h2 className="text-2xl md:text-3xl font-display font-bold text-primary">Academic Ordinances</h2>
        <p className="text-sm text-slate-500 mt-1 font-medium">Rules & Regulations Governing Academic Affairs — SGSITS Indore</p>
      </div>

      <div className="border-l-2 border-accent pl-5">
        <p className="text-sm text-slate-700 leading-relaxed font-sans">{data.intro}</p>
      </div>

      {/* Attendance Policy */}
      <div className="bg-white border border-slate-200 rounded shadow-sm overflow-hidden">
        <div className="bg-primary px-5 py-3">
          <h3 className="font-display font-bold text-sm text-white uppercase tracking-wider">Attendance Policy</h3>
        </div>
        <div className="p-5 space-y-3">
          {attendanceRules.map((rule, i) => (
            <div key={i} className="flex items-start gap-2">
              {i === 3
                ? <CheckCircle2 size={15} className="text-accent shrink-0 mt-0.5" />
                : <AlertCircle size={15} className={`${i === 1 ? 'text-accent' : 'text-primary'} shrink-0 mt-0.5`} />
              }
              <span className="text-sm text-slate-700 font-medium" dangerouslySetInnerHTML={{ __html: rule }} />
            </div>
          ))}
        </div>
      </div>

      {/* Grading System */}
      <div>
        <span className="text-xs uppercase font-bold tracking-widest text-accent block mb-1">Grading</span>
        <h3 className="text-xl font-display font-bold text-slate-900 mb-4">10-Point Grading System (CGPA)</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-primary">
                <th className="text-center text-white px-4 py-3 font-semibold">Grade</th>
                <th className="text-center text-white px-4 py-3 font-semibold">Grade Points</th>
                <th className="text-center text-white px-4 py-3 font-semibold">Marks Range (%)</th>
                <th className="text-left text-white px-4 py-3 font-semibold">Performance</th>
              </tr>
            </thead>
            <tbody>
              {gradeTable.map((row, i) => (
                <tr key={i} className={`hover:bg-slate-50 transition-colors ${row.grade === 'F' ? 'bg-primary/5' : 'bg-white'}`}>
                  <td className="px-4 py-3 border-b border-slate-100 text-center font-display font-bold text-primary text-base">{row.grade}</td>
                  <td className="px-4 py-3 border-b border-slate-100 text-center font-bold text-accent">{row.points}</td>
                  <td className="px-4 py-3 border-b border-slate-100 text-center text-slate-700 font-medium">{row.range}</td>
                  <td className={`px-4 py-3 border-b border-slate-100 font-medium ${row.grade === 'F' ? 'text-primary' : 'text-slate-600'}`}>{row.desc}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Key Rules */}
      {(examRules.length > 0 || integrityRules.length > 0) && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {examRules.length > 0 && (
            <div className="bg-white border border-slate-200 rounded p-5">
              <h4 className="font-bold text-sm text-primary uppercase tracking-wider border-b border-slate-200 pb-2 mb-3">Examination Rules</h4>
              <div className="space-y-2 text-sm text-slate-600 font-sans">
                {examRules.map((r, i) => <p key={i}>• {r}</p>)}
              </div>
            </div>
          )}
          {integrityRules.length > 0 && (
            <div className="bg-white border border-slate-200 rounded p-5">
              <h4 className="font-bold text-sm text-primary uppercase tracking-wider border-b border-slate-200 pb-2 mb-3">Academic Integrity</h4>
              <div className="space-y-2 text-sm text-slate-600 font-sans">
                {integrityRules.map((r, i) => <p key={i}>• {r}</p>)}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Ordinance Documents */}
      {documents.length > 0 && (
        <div>
          <span className="text-xs uppercase font-bold tracking-widest text-accent block mb-1">Downloads</span>
          <h3 className="text-xl font-display font-bold text-slate-900 mb-4">Ordinance Documents</h3>
          <div className="space-y-3">
            {documents.map((doc, i) => (
              <div key={i} className="bg-white border border-slate-200 rounded p-4 flex items-center justify-between hover:border-slate-400 hover:bg-slate-50 transition-colors shadow-sm">
                <div className="flex items-center gap-3">
                  <FileText size={18} className="text-accent shrink-0" strokeWidth={1.75} />
                  <div>
                    <p className="font-semibold text-sm text-slate-800">{doc.title}</p>
                    <p className="text-xs text-slate-400 mt-0.5 font-medium">PDF • {doc.size} • Updated {doc.year}</p>
                  </div>
                </div>
                {doc.url
                  ? <a href={doc.url} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 text-xs font-bold text-primary border border-primary/20 bg-primary/5 px-3 py-1.5 rounded hover:bg-primary hover:text-white transition-colors shrink-0">
                      <Download size={12} /> Download
                    </a>
                  : <button className="flex items-center gap-1.5 text-xs font-bold text-primary border border-primary/20 bg-primary/5 px-3 py-1.5 rounded hover:bg-primary hover:text-white transition-colors shrink-0">
                      <Download size={12} /> Download
                    </button>
                }
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default Ordinances
