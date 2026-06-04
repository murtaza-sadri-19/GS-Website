import { SkeletonPage } from '../../components/ui/Skeleton'
import { useState, useEffect } from 'react';
import PageSeo from '../../components/global/PageSeo'
import { Link } from 'react-router-dom';
import * as Icons from 'lucide-react';
import { getUGAdmission } from '../../services/adminContentService';

export default function UGAdmission({ previewData }: { previewData?: any } = {}) {
  const [fetchedData, setFetchedData] = useState<any>(null);

  useEffect(() => {
    if (!previewData) getUGAdmission().then(setFetchedData);
  }, [previewData]);

  const data = previewData ?? fetchedData;

  if (!data) return <SkeletonPage />

  const {
    title,
    description,
    applyUrl,
    mpdteUrl,
    prospectusUrl,
    admissionEmail,
    admissionPhone,
    steps       = [],
    programs    = [],
    keyDates    = [],
    fees        = [],
    documents   = [],
  } = data;

  return (
    <div className="min-h-screen bg-white">
      <PageSeo pageKey="admission/ug" />

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
            <span className="text-white font-semibold">UG Admission</span>
          </nav>
          <span className="text-xs uppercase font-bold tracking-widest text-accent block mb-1.5">Undergraduate</span>
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

        {/* Admission Process */}
        <section>
          <div className="border-b border-slate-200 pb-4 mb-6">
            <span className="text-xs uppercase font-bold tracking-widest text-accent block mb-1">How to Apply</span>
            <h2 className="text-xl font-display font-bold text-slate-900">Admission Process</h2>
            <div className="w-10 h-[2px] bg-accent mt-2" />
          </div>
          <p className="text-sm text-slate-500 font-medium mb-6">Follow these {steps.length || 5} steps to secure your seat at SGSITS.</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {steps.map((step: any, i: number) => {
              const Icon = (Icons as any)[step.iconName] || Icons.FileText;
              return (
                <div key={i} className="bg-white rounded border border-slate-200 p-5 flex flex-col items-center text-center hover:border-slate-400 transition-colors duration-200">
                  <div className="w-12 h-12 rounded bg-slate-50 border border-slate-200 flex items-center justify-center mb-3 text-primary">
                    <Icon className="w-6 h-6" strokeWidth={1.75} />
                  </div>
                  <div className="w-6 h-6 rounded-full bg-accent text-primary font-bold text-xs flex items-center justify-center mb-2">
                    {i + 1}
                  </div>
                  <h3 className="font-bold text-primary text-sm mb-1 font-sans">{step.title}</h3>
                  <p className="text-slate-500 text-xs leading-relaxed font-medium">{step.desc}</p>
                </div>
              );
            })}
          </div>
        </section>

        {/* Programs Table */}
        <section>
          <div className="border-b border-slate-200 pb-4 mb-6">
            <span className="text-xs uppercase font-bold tracking-widest text-accent block mb-1">Courses Offered</span>
            <h2 className="text-xl font-display font-bold text-slate-900">Programs &amp; Eligibility</h2>
            <div className="w-10 h-[2px] bg-accent mt-2" />
          </div>
          <p className="text-sm text-slate-500 font-medium mb-4">All B.Tech programs are 4-year full-time courses. B.Pharm is a 4-year full-time course.</p>
          <div className="overflow-x-auto border border-slate-200 rounded">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-primary">
                  <th className="text-left text-white px-4 py-3 font-semibold">Program</th>
                  <th className="text-center text-white px-4 py-3 font-semibold">Seats</th>
                  <th className="text-left text-white px-4 py-3 font-semibold">Eligibility</th>
                  <th className="text-left text-white px-4 py-3 font-semibold">Admission Basis</th>
                </tr>
              </thead>
              <tbody>
                {programs.map((p: any, i: number) => (
                  <tr key={i} className="bg-white hover:bg-slate-50 transition-colors">
                    <td className="px-4 py-3 border-b border-slate-100 font-semibold text-primary">{p.name}</td>
                    <td className="px-4 py-3 border-b border-slate-100 text-center font-bold text-accent">{p.seats}</td>
                    <td className="px-4 py-3 border-b border-slate-100 text-slate-600 font-medium">{p.eligibility}</td>
                    <td className="px-4 py-3 border-b border-slate-100 text-slate-600 font-medium">{p.basis}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-xs text-slate-400 mt-2 flex items-center gap-1 font-sans">
            <Icons.AlertCircle className="w-3 h-3 shrink-0" /> Seats subject to approval by AICTE / PCI. SC/ST/OBC reservations as per Government norms.
          </p>
        </section>

        {/* Key Dates */}
        <section>
          <div className="border-b border-slate-200 pb-4 mb-6">
            <span className="text-xs uppercase font-bold tracking-widest text-accent block mb-1">Schedule</span>
            <h2 className="text-xl font-display font-bold text-slate-900">Important Dates</h2>
            <div className="w-10 h-[2px] bg-accent mt-2" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {keyDates.map((d: any, i: number) => (
              <div key={i} className="flex items-center gap-4 bg-white border border-slate-200 rounded px-5 py-4 hover:border-slate-400 transition-colors duration-200">
                <div className="w-8 h-8 rounded bg-accent/15 text-primary font-bold flex items-center justify-center text-xs shrink-0 font-display">
                  {i + 1}
                </div>
                <div>
                  <p className="font-semibold text-slate-800 text-sm">{d.event}</p>
                  <p className="text-slate-500 text-xs font-medium mt-0.5">{d.date}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Fee Structure */}
        <section>
          <div className="border-b border-slate-200 pb-4 mb-6">
            <span className="text-xs uppercase font-bold tracking-widest text-accent block mb-1">Financials</span>
            <h2 className="text-xl font-display font-bold text-slate-900">Fee Structure (Per Annum)</h2>
            <div className="w-10 h-[2px] bg-accent mt-2" />
          </div>
          <p className="text-sm text-slate-500 font-medium mb-4">Fees as approved by the Fee Regulatory Committee, Govt. of Madhya Pradesh.</p>
          <div className="overflow-x-auto border border-slate-200 rounded">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-primary">
                  <th className="text-left text-white px-4 py-3 font-semibold">Category</th>
                  <th className="text-center text-white px-4 py-3 font-semibold">Tuition Fee / Year</th>
                  <th className="text-center text-white px-4 py-3 font-semibold">Other Fees</th>
                  <th className="text-center text-white px-4 py-3 font-semibold">Total / Year</th>
                </tr>
              </thead>
              <tbody>
                {fees.map((f: any, i: number) => (
                  <tr key={i} className="bg-white hover:bg-slate-50 transition-colors">
                    <td className="px-4 py-3 border-b border-slate-100 font-semibold text-slate-800">{f.category}</td>
                    <td className="px-4 py-3 border-b border-slate-100 text-center text-slate-600 font-medium">{f.tuition}</td>
                    <td className="px-4 py-3 border-b border-slate-100 text-center text-slate-600 font-medium">{f.other}</td>
                    <td className="px-4 py-3 border-b border-slate-100 text-center font-bold text-primary">{f.total}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Documents Checklist */}
        <section>
          <div className="border-b border-slate-200 pb-4 mb-6">
            <span className="text-xs uppercase font-bold tracking-widest text-accent block mb-1">Before You Apply</span>
            <h2 className="text-xl font-display font-bold text-slate-900">Documents Checklist</h2>
            <div className="w-10 h-[2px] bg-accent mt-2" />
          </div>
          <div className="bg-slate-50 border border-slate-200 rounded p-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {documents.map((doc: string, i: number) => (
                <div key={i} className="flex items-start gap-3">
                  <Icons.CheckCircle2 className="w-4 h-4 text-slate-600 shrink-0 mt-0.5" strokeWidth={2} />
                  <span className="text-slate-700 text-sm font-medium">{doc}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Contact Box */}
        <section>
          <div className="bg-primary rounded p-6 text-white flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div>
              <h2 className="text-base font-display font-bold mb-1">Admission Office – SGSITS</h2>
              <p className="text-white/75 text-sm mb-4 font-sans">For queries related to UG admissions, contact our dedicated admission office.</p>
              <div className="flex flex-col gap-2 text-sm font-sans">
                <div className="flex items-center gap-2 text-white/80">
                  <Icons.Phone className="w-3.5 h-3.5 shrink-0" />
                  <span>{admissionPhone}</span>
                </div>
                <div className="flex items-center gap-2 text-white/80">
                  <Icons.Mail className="w-3.5 h-3.5 shrink-0" />
                  <span>{admissionEmail}</span>
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-3 shrink-0">
              <a
                href={mpdteUrl}
                className="inline-flex items-center justify-center gap-2 bg-accent text-primary font-bold text-xs px-5 py-2.5 rounded hover:bg-accent/90 transition-colors"
              >
                MPDTE Counselling Portal
              </a>
              <Link
                to={prospectusUrl}
                className="inline-flex items-center justify-center gap-2 border border-white/40 text-white font-bold text-xs px-5 py-2.5 rounded hover:bg-white/10 transition-colors"
              >
                <Icons.Download className="w-3.5 h-3.5" /> Download Prospectus
              </Link>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
}
