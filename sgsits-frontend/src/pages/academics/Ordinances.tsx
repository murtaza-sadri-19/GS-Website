import React from 'react'
import PageSeo from '../../components/global/PageSeo'
import { FileText, Download, AlertCircle, CheckCircle2 } from 'lucide-react'

const gradeTable = [
  { grade: 'O', points: 10, range: '90–100', desc: 'Outstanding' },
  { grade: 'A+', points: 9, range: '80–89', desc: 'Excellent' },
  { grade: 'A', points: 8, range: '70–79', desc: 'Very Good' },
  { grade: 'B+', points: 7, range: '60–69', desc: 'Good' },
  { grade: 'B', points: 6, range: '55–59', desc: 'Above Average' },
  { grade: 'C', points: 5, range: '50–54', desc: 'Average' },
  { grade: 'P', points: 4, range: '45–49', desc: 'Pass' },
  { grade: 'F', points: 0, range: 'Below 45', desc: 'Fail (Repeat required)' },
]

const ordinanceDocuments = [
  { title: 'B.Tech Ordinances & Regulations (NEP 2020)', size: '1.8 MB', year: '2024' },
  { title: 'M.Tech Ordinances & Scheme of Examination', size: '1.2 MB', year: '2024' },
  { title: 'Ph.D. Ordinances & Research Regulations', size: '0.9 MB', year: '2023' },
  { title: 'MBA / MCA Ordinances & Evaluation System', size: '0.7 MB', year: '2024' },
]

const Ordinances: React.FC = () => {
  return (
    <div className="space-y-10">
      <PageSeo pageKey="academics/ordinances" />
      <div className="border-b border-slate-200 pb-5">
        <span className="text-[10px] uppercase font-bold tracking-widest text-accent block mb-1">Academics</span>
        <h2 className="text-2xl md:text-3xl font-display font-bold text-primary">Academic Ordinances</h2>
        <p className="text-sm text-slate-500 mt-1 font-medium">Rules & Regulations Governing Academic Affairs — SGSITS Indore</p>
      </div>

      <div className="border-l-2 border-accent pl-5">
        <p className="text-sm text-slate-700 leading-relaxed font-sans">
          The Academic Ordinances of SGSITS govern all aspects of academic affairs including admission, registration,
          attendance, examinations, grading, and award of degrees. The ordinances are ratified by the
          <strong> Academic Council</strong> and are in accordance with the guidelines of <strong>RGPV, DAVV, AICTE</strong>, and
          <strong> NEP 2020</strong>. All students are expected to read and comply with the ordinances.
        </p>
      </div>

      {/* Attendance Policy */}
      <div className="bg-white border border-slate-200 rounded shadow-sm overflow-hidden">
        <div className="bg-primary px-5 py-3">
          <h3 className="font-display font-bold text-sm text-white uppercase tracking-wider">Attendance Policy</h3>
        </div>
        <div className="p-5 space-y-3">
          <div className="flex items-start gap-2">
            <AlertCircle size={15} className="text-[#0b2545] shrink-0 mt-0.5" />
            <span className="text-sm text-slate-700 font-medium"><strong>75% minimum</strong> attendance mandatory to sit for end-semester examinations</span>
          </div>
          <div className="flex items-start gap-2">
            <AlertCircle size={15} className="text-[#bfa15f] shrink-0 mt-0.5" />
            <span className="text-sm text-slate-700 font-medium"><strong>65–74%:</strong> Allowed with penalty/fine at discretion of Head of Department</span>
          </div>
          <div className="flex items-start gap-2">
            <AlertCircle size={15} className="text-[#0b2545] shrink-0 mt-0.5" />
            <span className="text-sm text-slate-700 font-medium"><strong>Below 65%:</strong> Debarred from appearing in examinations — must repeat the semester</span>
          </div>
          <div className="flex items-start gap-2">
            <CheckCircle2 size={15} className="text-[#bfa15f] shrink-0 mt-0.5" />
            <span className="text-sm text-slate-700 font-medium">Medical/sports exemptions for up to 10% attendance with proper documentation</span>
          </div>
        </div>
      </div>

      {/* Grading System */}
      <div>
        <span className="text-[10px] uppercase font-bold tracking-widest text-accent block mb-1">Grading</span>
        <h3 className="text-xl font-display font-bold text-slate-900 mb-4">10-Point Grading System (CGPA)</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr style={{ backgroundColor: 'var(--color-primary)' }}>
                <th className="text-center text-white px-4 py-3 font-semibold">Grade</th>
                <th className="text-center text-white px-4 py-3 font-semibold">Grade Points</th>
                <th className="text-center text-white px-4 py-3 font-semibold">Marks Range (%)</th>
                <th className="text-left text-white px-4 py-3 font-semibold">Performance</th>
              </tr>
            </thead>
            <tbody>
              {gradeTable.map((row, i) => (
                <tr key={i} className={`hover:bg-slate-50 transition-colors ${row.grade === 'F' ? 'bg-[#0b2545]/5' : 'bg-white'}`}>
                  <td className="px-4 py-3 border-b border-slate-100 text-center font-display font-bold text-primary text-base">{row.grade}</td>
                  <td className="px-4 py-3 border-b border-slate-100 text-center font-bold text-accent">{row.points}</td>
                  <td className="px-4 py-3 border-b border-slate-100 text-center text-slate-700 font-medium">{row.range}</td>
                  <td className={`px-4 py-3 border-b border-slate-100 font-medium ${row.grade === 'F' ? 'text-[#0b2545]' : 'text-slate-600'}`}>{row.desc}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mt-3 bg-slate-50 border border-slate-200 rounded p-3 text-xs text-slate-600 font-sans space-y-1">
          <p>• <strong>SGPA</strong> = Sum of (Grade Points × Credits) / Total Credits in semester</p>
          <p>• <strong>CGPA</strong> = Cumulative GPA across all completed semesters</p>
          <p>• Minimum CGPA of <strong>4.0</strong> required for award of B.Tech degree</p>
        </div>
      </div>

      {/* Key Rules */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="bg-white border border-slate-200 rounded p-5">
          <h4 className="font-bold text-sm text-primary uppercase tracking-wider border-b border-slate-200 pb-2 mb-3">Examination Rules</h4>
          <div className="space-y-2 text-sm text-slate-600 font-sans">
            <p>• Mid-semester exams: 2 per semester (best of 2 counted)</p>
            <p>• End-semester exams: 70 marks (theory) + 30 marks (sessional)</p>
            <p>• Minimum 40% in end-sem and 35% aggregate to pass a subject</p>
            <p>• Supplementary exams for failed students after results declaration</p>
            <p>• Re-checking / re-evaluation facility available on payment of fee</p>
          </div>
        </div>
        <div className="bg-white border border-slate-200 rounded p-5">
          <h4 className="font-bold text-sm text-primary uppercase tracking-wider border-b border-slate-200 pb-2 mb-3">Academic Integrity</h4>
          <div className="space-y-2 text-sm text-slate-600 font-sans">
            <p>• Use of unfair means leads to cancellation of exam paper</p>
            <p>• Mobile phones/electronic devices prohibited in examination hall</p>
            <p>• Plagiarism in reports/projects subject to zero marks</p>
            <p>• Submission of false certificates: disciplinary action</p>
            <p>• SGSITS Plagiarism policy follows UGC Regulations 2018</p>
          </div>
        </div>
      </div>

      {/* Ordinance Documents */}
      <div>
        <span className="text-[10px] uppercase font-bold tracking-widest text-accent block mb-1">Downloads</span>
        <h3 className="text-xl font-display font-bold text-slate-900 mb-4">Ordinance Documents</h3>
        <div className="space-y-3">
          {ordinanceDocuments.map((doc, i) => (
            <div key={i} className="bg-white border border-slate-200 rounded p-4 flex items-center justify-between hover:border-slate-400 hover:bg-slate-50 transition-colors shadow-sm">
              <div className="flex items-center gap-3">
                <FileText size={18} className="text-accent-blue shrink-0" strokeWidth={1.75} />
                <div>
                  <p className="font-semibold text-sm text-slate-800">{doc.title}</p>
                  <p className="text-[11px] text-slate-400 mt-0.5 font-medium">PDF • {doc.size} • Updated {doc.year}</p>
                </div>
              </div>
              <button className="flex items-center gap-1.5 text-xs font-bold text-primary border border-primary/20 bg-primary/5 px-3 py-1.5 rounded hover:bg-primary hover:text-white transition-colors shrink-0">
                <Download size={12} /> Download
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Ordinances
