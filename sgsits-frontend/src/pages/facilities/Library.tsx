import React, { useEffect, useState } from 'react'
import PageSeo from '../../components/global/PageSeo'
import { BookOpen, Monitor, Clock, Phone, Mail, ExternalLink, Users, CheckCircle2 } from 'lucide-react'
import { getLibrary } from '../../services/facilitiesService'

const Library: React.FC = () => {
  const [data, setData] = useState<any>(null)
  useEffect(() => { getLibrary().then(setData) }, [])
  if (!data) return null

  return (
    <div className="space-y-10">
      <PageSeo pageKey="facilities/library" />
      {/* Page Header */}
      <div className="border-b border-slate-200 pb-5">
        <span className="text-[10px] uppercase font-bold tracking-widest text-accent block mb-1">Facilities</span>
        <h2 className="text-2xl md:text-3xl font-display font-bold text-primary">Central Library</h2>
        <p className="text-sm text-slate-500 mt-1 font-medium">Knowledge Resource Centre — SGSITS Indore</p>
      </div>

      {/* Intro */}
      <div className="border-l-2 border-accent pl-5">
        <p className="text-sm text-slate-700 leading-relaxed font-sans">{data.intro}</p>
      </div>

      {/* Collection Stats */}
      <div>
        <span className="text-[10px] uppercase font-bold tracking-widest text-accent block mb-1">Collection</span>
        <h3 className="text-xl font-display font-bold text-slate-900 mb-4">Library Holdings</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {(data.collections || []).map((item: any) => (
            <div key={item.label} className="bg-white border border-slate-200 rounded p-4 text-center shadow-sm">
              <p className="text-2xl font-display font-bold text-primary">{item.value}</p>
              <p className="text-[11px] text-slate-500 font-bold uppercase tracking-wider font-sans mt-1">{item.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* E-Resources */}
      <div>
        <span className="text-[10px] uppercase font-bold tracking-widest text-accent block mb-1">Digital Access</span>
        <h3 className="text-xl font-display font-bold text-slate-900 mb-4">E-Resources &amp; Digital Library</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {(data.eResources || []).map((res: any) => (
            <a
              key={res.name}
              href={res.url}
              target="_blank"
              rel="noreferrer"
              className="flex items-start gap-3 p-4 bg-white border border-slate-200 rounded hover:border-accent-blue hover:shadow-sm transition-all duration-200 group"
            >
              <Monitor size={16} className="text-accent-blue shrink-0 mt-0.5" strokeWidth={1.75} />
              <div>
                <p className="text-sm font-bold text-slate-800 group-hover:text-primary transition-colors flex items-center gap-1">
                  {res.name} <ExternalLink size={11} className="text-slate-400" />
                </p>
                <p className="text-[11px] text-slate-500 mt-0.5 font-medium font-sans">{res.desc}</p>
              </div>
            </a>
          ))}
        </div>
      </div>

      {/* Borrowing Rules */}
      <div>
        <span className="text-[10px] uppercase font-bold tracking-widest text-accent block mb-1">Borrowing Policy</span>
        <h3 className="text-xl font-display font-bold text-slate-900 mb-4">Book Issue Rules</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr style={{ backgroundColor: 'var(--color-primary)' }}>
                <th className="text-left text-white px-4 py-3 font-semibold">Category</th>
                <th className="text-center text-white px-4 py-3 font-semibold">Books Allowed</th>
                <th className="text-center text-white px-4 py-3 font-semibold">Loan Period</th>
              </tr>
            </thead>
            <tbody>
              {(data.borrowingRules || []).map((row: any, i: number) => (
                <tr key={i} className="bg-white hover:bg-slate-50 transition-colors">
                  <td className="px-4 py-3 border-b border-slate-100 font-medium text-slate-800">{row.category}</td>
                  <td className="px-4 py-3 border-b border-slate-100 text-center font-bold text-primary">{row.books}</td>
                  <td className="px-4 py-3 border-b border-slate-100 text-center text-slate-600">{row.period}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-[11px] text-slate-400 mt-2 font-sans">Fine for overdue books: ₹1 per book per day</p>
      </div>

      {/* Facilities & Rules */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-slate-50 border border-slate-200 rounded p-5 space-y-3">
          <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
            <Clock size={16} className="text-accent" />
            <h4 className="font-bold text-sm text-primary uppercase tracking-wider">Working Hours</h4>
          </div>
          <div className="text-sm font-sans text-slate-700">
            <p>{data.openingHours}</p>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded p-5 space-y-3">
          <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
            <Users size={16} className="text-accent" />
            <h4 className="font-bold text-sm text-primary uppercase tracking-wider">Reading Hall</h4>
          </div>
          <div className="space-y-2 text-sm font-sans">
            {[
              'Seating capacity for 300+ students simultaneously',
              'Separate section for reference books and periodicals',
              'Competitive exam preparation corner (GATE, UPSC, SSC)',
              'Newspaper reading area with 12 daily subscriptions',
              'Air-conditioned environment with Wi-Fi access',
            ].map((point, i) => (
              <div key={i} className="flex items-start gap-2">
                <CheckCircle2 size={14} className="text-slate-600 shrink-0 mt-0.5" />
                <span className="text-slate-600 font-medium">{point}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* OPAC */}
      <div className="bg-primary text-white rounded p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h4 className="font-bold font-display text-base">OPAC — Online Book Search</h4>
          <p className="text-sm text-slate-300 mt-1 font-sans">Search the library catalogue, check availability, and place holds online</p>
        </div>
        <a
          href="https://sgsits.ac.in"
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-2 bg-accent text-primary px-4 py-2 rounded text-xs font-bold hover:bg-accent/90 transition-colors shrink-0"
        >
          <BookOpen size={14} /> Open OPAC
        </a>
      </div>

      {/* Contact */}
      <div className="bg-slate-50 border border-slate-200 rounded p-5 space-y-3">
        <h4 className="font-bold text-sm text-primary uppercase tracking-wider border-b border-slate-200 pb-2">Library Administration</h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm font-sans">
          <div className="flex items-center gap-2">
            <Phone size={14} className="text-accent shrink-0" />
            <span className="text-slate-600">{data.phone}</span>
          </div>
          <div className="flex items-center gap-2">
            <Mail size={14} className="text-accent shrink-0" />
            <a href={`mailto:${data.email}`} className="text-accent-blue hover:underline">{data.email}</a>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Library
