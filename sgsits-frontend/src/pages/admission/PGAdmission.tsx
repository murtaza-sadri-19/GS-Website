import { SkeletonPage } from '../../components/ui/Skeleton'
import { useState, useEffect } from 'react';
import PageSeo from '../../components/global/PageSeo'
import { Link } from 'react-router-dom';
import * as Icons from 'lucide-react';
import { getPGAdmission } from '../../services/adminContentService';

export default function PGAdmission({ previewData }: { previewData?: any } = {}) {
  const [fetchedData, setFetchedData] = useState<any>(null);
  useEffect(() => { if (!previewData) getPGAdmission().then(setFetchedData) }, [previewData]);
  const data = previewData ?? fetchedData;

  if (!data) return <SkeletonPage />

  const {
    title,
    description,
    applyUrl,
    programs = [],
    steps = [],
    fees = [],
    scholarships = [],
    contacts = [],
  } = data;

  return (
    <div className="min-h-screen bg-white">
      <PageSeo pageKey="admission/pg" />

      {/* Hero */}
      <div className="bg-primary text-white py-12 px-4">
        <div className="max-w-[1400px] mx-auto px-4 lg:px-12">
          <nav className="flex items-center gap-1.5 text-xs text-white/60 font-medium mb-4 flex-wrap" aria-label="Breadcrumb">
            <Link to="/" className="flex items-center gap-1 hover:text-white transition-colors">
              <Icons.Home className="w-3 h-3" />Home
            </Link>
            <Icons.ChevronRight className="w-3 h-3 text-white/40" />
            <span>Admissions</span>
            <Icons.ChevronRight className="w-3 h-3 text-white/40" />
            <span className="text-white font-semibold">PG Admission</span>
          </nav>
          <span className="text-xs uppercase font-bold tracking-widest text-accent block mb-1.5">Postgraduate</span>
          <h1 className="text-2xl md:text-3xl font-display font-bold mb-2">{title}</h1>
          <p className="text-white/80 text-sm max-w-2xl font-medium">{description}</p>
          <a
            href={applyUrl}
            className="mt-5 inline-flex items-center gap-2 bg-accent text-primary font-bold text-sm px-5 py-2.5 rounded hover:bg-accent/90 transition-colors"
          >
            Apply Now <Icons.ChevronRight className="w-4 h-4" />
          </a>
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto px-4 lg:px-12 py-10 space-y-12">

        {/* Programs Table */}
        <section>
          <div className="border-b border-slate-200 pb-4 mb-6">
            <span className="text-xs uppercase font-bold tracking-widest text-accent block mb-1">Courses Offered</span>
            <h2 className="text-xl font-display font-bold text-slate-900">Programs Offered</h2>
            <div className="w-10 h-[2px] bg-accent mt-2" />
          </div>
          <p className="text-sm text-slate-500 font-medium mb-4">All M.Tech and M.E. programs are 2-year full-time courses. MBA is 2-year and MCA is 3-year program.</p>
          <div className="overflow-x-auto border border-slate-200 rounded">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-primary">
                  <th className="text-left text-white px-4 py-3 font-semibold">Program</th>
                  <th className="text-left text-white px-4 py-3 font-semibold">Department</th>
                  <th className="text-center text-white px-4 py-3 font-semibold">Seats</th>
                  <th className="text-left text-white px-4 py-3 font-semibold">Eligibility</th>
                  <th className="text-left text-white px-4 py-3 font-semibold">Basis</th>
                </tr>
              </thead>
              <tbody>
                {programs.map((p: any, i: number) => (
                  <tr key={i} className="bg-white hover:bg-slate-50 transition-colors">
                    <td className="px-4 py-3 border-b border-slate-100 font-semibold text-primary">{p.name}</td>
                    <td className="px-4 py-3 border-b border-slate-100 text-slate-600 font-medium">{p.dept}</td>
                    <td className="px-4 py-3 border-b border-slate-100 text-center font-bold text-accent">{p.seats}</td>
                    <td className="px-4 py-3 border-b border-slate-100 text-slate-600 font-medium">{p.eligibility}</td>
                    <td className="px-4 py-3 border-b border-slate-100 text-slate-600 font-medium">{p.basis}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Admission Process */}
        <section>
          <div className="border-b border-slate-200 pb-4 mb-6">
            <span className="text-xs uppercase font-bold tracking-widest text-accent block mb-1">How to Apply</span>
            <h2 className="text-xl font-display font-bold text-slate-900">Admission Process</h2>
            <div className="w-10 h-[2px] bg-accent mt-2" />
          </div>
          <div className="relative">
            <div className="hidden md:block absolute top-10 left-[calc(10%+2rem)] right-[calc(10%+2rem)] h-px bg-slate-200 z-0" />
            <div className="grid grid-cols-1 md:grid-cols-5 gap-6 relative z-10">
              {steps.map((step: any, i: number) => {
                const Icon = (Icons as any)[step.iconName] || Icons.GraduationCap;
                return (
                  <div key={i} className="flex flex-col items-center text-center">
                    <div className="w-16 h-16 rounded-full bg-primary text-white flex items-center justify-center mb-3">
                      <Icon className="w-6 h-6" strokeWidth={1.75} />
                    </div>
                    <h3 className="font-bold text-primary text-sm mb-1">{step.title}</h3>
                    <p className="text-slate-500 text-xs leading-relaxed font-medium">{step.desc}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Fee Structure */}
        <section>
          <div className="border-b border-slate-200 pb-4 mb-6">
            <span className="text-xs uppercase font-bold tracking-widest text-accent block mb-1">Financials</span>
            <h2 className="text-xl font-display font-bold text-slate-900">Fee Structure (Per Annum)</h2>
            <div className="w-10 h-[2px] bg-accent mt-2" />
          </div>
          <div className="overflow-x-auto border border-slate-200 rounded">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-primary">
                  <th className="text-left text-white px-4 py-3 font-semibold">Program</th>
                  <th className="text-center text-white px-4 py-3 font-semibold">Tuition Fee</th>
                  <th className="text-center text-white px-4 py-3 font-semibold">Other Fees</th>
                  <th className="text-center text-white px-4 py-3 font-semibold">Total</th>
                </tr>
              </thead>
              <tbody>
                {fees.map((f: any, i: number) => (
                  <tr key={i} className="bg-white hover:bg-slate-50 transition-colors">
                    <td className="px-4 py-3 border-b border-slate-100 font-semibold text-slate-800">{f.program}</td>
                    <td className="px-4 py-3 border-b border-slate-100 text-center text-slate-600 font-medium">{f.tuition}</td>
                    <td className="px-4 py-3 border-b border-slate-100 text-center text-slate-600 font-medium">{f.other}</td>
                    <td className="px-4 py-3 border-b border-slate-100 text-center font-bold text-primary">{f.total}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Scholarships */}
        <section>
          <div className="border-b border-slate-200 pb-4 mb-6">
            <span className="text-xs uppercase font-bold tracking-widest text-accent block mb-1">Financial Aid</span>
            <h2 className="text-xl font-display font-bold text-slate-900">Scholarships &amp; Fellowships</h2>
            <div className="w-10 h-[2px] bg-accent mt-2" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {scholarships.map((s: any, i: number) => (
              <div key={i} className="bg-white rounded border border-slate-200 p-5 hover:border-slate-400 transition-colors duration-200">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-9 h-9 rounded bg-slate-50 border border-slate-200 flex items-center justify-center shrink-0">
                    <Icons.Award className="w-4 h-4 text-accent" strokeWidth={1.75} />
                  </div>
                  <h3 className="font-bold text-primary text-sm">{s.title}</h3>
                </div>
                <p className="text-xl font-display font-bold text-accent mb-2">{s.amount}</p>
                <p className="text-slate-600 text-sm font-medium mb-3">{s.desc}</p>
                <div className="flex items-center gap-2 text-xs text-slate-500 bg-slate-50 rounded px-3 py-2 border border-slate-100">
                  <Icons.CheckCircle2 className="w-3 h-3 text-slate-600 shrink-0" strokeWidth={2} />
                  {s.eligibility}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Key Contacts */}
        <section>
          <div className="border-b border-slate-200 pb-4 mb-6">
            <span className="text-xs uppercase font-bold tracking-widest text-accent block mb-1">Reach Out</span>
            <h2 className="text-xl font-display font-bold text-slate-900">Key Contacts</h2>
            <div className="w-10 h-[2px] bg-accent mt-2" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {contacts.map((c: any, i: number) => (
              <div key={i} className="bg-white rounded border border-slate-200 p-5 hover:border-slate-400 transition-colors duration-200">
                <div className="w-10 h-10 rounded bg-slate-50 border border-slate-200 flex items-center justify-center mb-3">
                  <Icons.BookOpen className="w-5 h-5 text-primary" strokeWidth={1.75} />
                </div>
                <p className="text-xs text-accent font-bold uppercase tracking-widest mb-1">{c.role}</p>
                <h3 className="font-bold text-primary text-sm mb-1">{c.name}</h3>
                <p className="text-slate-500 text-xs font-medium mb-3">{c.dept}</p>
                <div className="space-y-1.5 text-xs text-slate-600 font-medium border-t border-slate-100 pt-3">
                  <div className="flex items-center gap-2">
                    <Icons.Phone className="w-3 h-3 text-accent shrink-0" />
                    <span>{c.phone}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Icons.Mail className="w-3 h-3 text-accent shrink-0" />
                    <span>{c.email}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

      </div>
    </div>
  );
}
