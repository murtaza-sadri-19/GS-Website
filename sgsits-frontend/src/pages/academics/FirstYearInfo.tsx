import React, { useEffect, useState } from 'react'
import PageSeo from '../../components/global/PageSeo'
import { CheckCircle2, AlertCircle, Phone, Mail } from 'lucide-react'
import { Sk } from '../../components/ui/Skeleton'
import { useGatedLoading } from '../../hooks/useGatedLoading'
import { getFirstYearInfo, firstYearDefault, type FirstYearData } from '../../services/academicsService'

const FirstYearInfo: React.FC = () => {
  const [loading, setLoading] = useGatedLoading()
  const [data, setData]       = useState<FirstYearData>(firstYearDefault)

  useEffect(() => {
    getFirstYearInfo().then((d) => {
      setData(d)
      setLoading(false)
    })
  }, [])

  const antiRaggingContact = data.contacts?.find(c =>
    c.label.toLowerCase().includes('anti') || c.label.toLowerCase().includes('ragging')
  )

  return (
    <div className="space-y-10">
      <PageSeo pageKey="academics/first-year" />
      <div className="border-b border-slate-200 pb-5">
        <span className="text-xs uppercase font-bold tracking-widest text-accent block mb-1">Academics</span>
        <h2 className="text-2xl md:text-3xl font-display font-bold text-primary">First Year Information</h2>
        <p className="text-sm text-slate-500 mt-1 font-medium">Complete Guide for Incoming B.Tech Students — SGSITS Indore</p>
      </div>

      {/* Welcome Note */}
      <div className="bg-primary text-white rounded p-6">
        <h3 className="font-display font-bold text-lg mb-2">Welcome to SGSITS, Indore!</h3>
        <p className="text-sm text-slate-300 leading-relaxed font-sans">
          {data.welcomeText ?? firstYearDefault.welcomeText}{' '}
          As you begin your engineering journey at one of Central India's most prestigious institutes, this guide
          will help you navigate your first weeks smoothly. All B.Tech students undergo a{' '}
          <strong className="text-white">common first year</strong> before branching into their respective departments from the 2nd year.
        </p>
      </div>

      {/* Anti-Ragging Alert */}
      <div className="bg-accent/10 border border-accent/30 rounded p-4 flex items-start gap-3">
        <AlertCircle size={20} className="text-accent shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-bold text-primary">Anti-Ragging Policy — Zero Tolerance</p>
          <p className="text-xs text-primary font-medium mt-1 leading-relaxed">
            SGSITS strictly prohibits ragging in any form. All students must submit anti-ragging affidavits (self + parent) on Day 1.
            {antiRaggingContact?.phone && (
              <> <strong>National Anti-Ragging Helpline: {antiRaggingContact.phone}</strong> (24×7, toll-free).</>
            )}
            {antiRaggingContact?.email && (
              <> Campus committee: {antiRaggingContact.email}</>
            )}
            {!antiRaggingContact && (
              <> <strong>National Anti-Ragging Helpline: 1800-180-5522</strong> (24×7, toll-free). Campus committee: antiranging@sgsits.ac.in</>
            )}
          </p>
        </div>
      </div>

      {/* First Week Checklist */}
      <div>
        <span className="text-xs uppercase font-bold tracking-widest text-accent block mb-1">Checklist</span>
        <h3 className="text-xl font-display font-bold text-slate-900 mb-4">First Week Activities Checklist</h3>
        {loading ? (
          <div className="space-y-2">
            {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
              <div key={i} className="flex items-center gap-3 py-3 border-b border-slate-100">
                <Sk className="w-4 h-4 rounded" />
                <Sk className="h-3 flex-1 rounded" />
                <Sk className="h-4 w-16 rounded" />
              </div>
            ))}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr style={{ backgroundColor: 'var(--color-primary)' }}>
                  <th className="text-left text-white px-4 py-3 font-semibold">Activity</th>
                  <th className="text-center text-white px-4 py-3 font-semibold">Timing</th>
                </tr>
              </thead>
              <tbody>
                {data.checklist.map((row, i) => (
                  <tr key={i} className="bg-white hover:bg-slate-50 transition-colors">
                    <td className="px-4 py-3 border-b border-slate-100">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 size={14} className="text-slate-400 shrink-0" />
                        <span className="font-medium text-slate-800">{row.item}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 border-b border-slate-100 text-center text-xs font-bold text-accent">{row.when}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* First Year Curriculum */}
      <div>
        <span className="text-xs uppercase font-bold tracking-widest text-accent block mb-1">Curriculum</span>
        <h3 className="text-xl font-display font-bold text-slate-900 mb-4">Common First Year Subjects</h3>
        {loading ? (
          <div className="space-y-2">
            {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
              <div key={i} className="flex items-center gap-3 py-3 border-b border-slate-100">
                <Sk className="h-3 w-16 rounded" />
                <Sk className="h-3 flex-1 rounded" />
                <Sk className="h-4 w-8 rounded" />
              </div>
            ))}
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr style={{ backgroundColor: 'var(--color-primary)' }}>
                    <th className="text-left text-white px-4 py-3 font-semibold">Subject Code</th>
                    <th className="text-left text-white px-4 py-3 font-semibold">Subject</th>
                    <th className="text-center text-white px-4 py-3 font-semibold">Credits</th>
                  </tr>
                </thead>
                <tbody>
                  {data.subjects.map((sub, i) => (
                    <tr key={i} className="bg-white hover:bg-slate-50 transition-colors">
                      <td className="px-4 py-3 border-b border-slate-100 font-mono text-xs font-bold text-accent">{sub.code}</td>
                      <td className="px-4 py-3 border-b border-slate-100 font-medium text-slate-800">{sub.subject}</td>
                      <td className="px-4 py-3 border-b border-slate-100 text-center font-bold text-primary">{sub.credits}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-xs text-slate-400 mt-2">Note: Laboratory courses and sports are in addition to the above. Total credits: ~30 per semester</p>
          </>
        )}
      </div>

      {/* Important Contacts */}
      <div className="bg-slate-50 border border-slate-200 rounded p-5">
        <h4 className="font-bold text-sm text-primary uppercase tracking-wider border-b border-slate-200 pb-2 mb-3">Important Contacts for Freshers</h4>
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[1, 2, 3, 4].map(i => (
              <div key={i}>
                <Sk className="h-4 w-40 rounded mb-2" />
                <Sk className="h-3 w-28 rounded" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm font-sans">
            {data.contacts.filter(c => !c.label.toLowerCase().includes('anti')).map((contact, i) => (
              <div key={i}>
                <p className="font-semibold text-slate-800">{contact.label}</p>
                {contact.phone && (
                  <div className="flex items-center gap-1.5 mt-1">
                    <Phone size={12} className="text-accent" />
                    <span className="text-slate-600">{contact.phone}</span>
                  </div>
                )}
                {contact.email && (
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <Mail size={12} className="text-accent" />
                    <span className="text-slate-600">{contact.email}</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default FirstYearInfo
