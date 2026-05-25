import { useState, useEffect } from 'react';
import PageSeo from '../../components/global/PageSeo'
import { Link } from 'react-router-dom';
import * as Icons from 'lucide-react';
import { getUGAdmission } from '../../services/adminContentService';

export default function UGAdmission() {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    getUGAdmission().then(setData);
  }, []);

  if (!data) {
    return (
      <div className="flex items-center justify-center min-h-[50vh] w-full">
      <PageSeo pageKey="admission/ug" />
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  const {
    title,
    description,
    applyUrl,
    mpdteUrl,
    prospectusUrl,
    admissionEmail,
    admissionPhone,
    steps,
    programs,
    keyDates,
    fees,
    documents
  } = data;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <div className="bg-primary text-white py-14 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center gap-2 text-sm text-white/70 mb-3">
            <Link to="/" className="hover:text-white transition-colors">Home</Link>
            <Icons.ChevronRight className="w-4 h-4" />
            <span>Admissions</span>
            <Icons.ChevronRight className="w-4 h-4" />
            <span className="text-white font-medium">UG Admission</span>
          </div>
          <h1 className="text-4xl font-display font-bold mb-3">{title}</h1>
          <p className="text-white/85 text-lg max-w-2xl">{description}</p>
          <a
            href={applyUrl}
            className="mt-6 inline-flex items-center gap-2 bg-accent text-primary font-semibold px-6 py-3 rounded-lg hover:bg-[#bfa15f]/90 transition-colors"
          >
            Apply Now <Icons.ChevronRight className="w-4 h-4" />
          </a>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-12 space-y-14">

        {/* Admission Process */}
        <section>
          <h2 className="text-2xl font-display font-bold text-primary mb-2">Admission Process</h2>
          <p className="text-gray-500 mb-6">Follow these 5 steps to secure your seat at SGSITS.</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {steps.map((step: any, i: number) => {
              const Icon = (Icons as any)[step.iconName] || Icons.FileText;
              return (
                <div key={i} className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 flex flex-col items-center text-center hover:shadow-md transition-shadow">
                  <div className="w-14 h-14 rounded-full bg-primary/10 text-primary flex items-center justify-center mb-3">
                    <Icon className="w-8 h-8" />
                  </div>
                  <div className="w-7 h-7 rounded-full bg-accent text-primary font-bold text-sm flex items-center justify-center mb-2">
                    {i + 1}
                  </div>
                  <h3 className="font-semibold text-primary text-sm mb-1">{step.title}</h3>
                  <p className="text-gray-500 text-xs leading-relaxed">{step.desc}</p>
                </div>
              );
            })}
          </div>
        </section>

        {/* Programs Table */}
        <section>
          <h2 className="text-2xl font-display font-bold text-primary mb-2">Programs & Eligibility</h2>
          <p className="text-gray-500 mb-6">All B.Tech programs are 4-year full-time courses. B.Pharm is a 4-year full-time course.</p>
          <div className="overflow-x-auto rounded-xl shadow-sm border border-gray-200">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-primary text-white">
                  <th className="text-left px-4 py-3 font-semibold">Program</th>
                  <th className="text-center px-4 py-3 font-semibold">Seats</th>
                  <th className="text-left px-4 py-3 font-semibold">Eligibility</th>
                  <th className="text-left px-4 py-3 font-semibold">Admission Basis</th>
                </tr>
              </thead>
              <tbody>
                {programs.map((p: any, i: number) => (
                  <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                    <td className="px-4 py-3 font-medium text-primary">{p.name}</td>
                    <td className="px-4 py-3 text-center font-bold text-accent">{p.seats}</td>
                    <td className="px-4 py-3 text-gray-600">{p.eligibility}</td>
                    <td className="px-4 py-3 text-gray-600">{p.basis}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-xs text-gray-400 mt-2 flex items-center gap-1">
            <Icons.AlertCircle className="w-3 h-3" /> Seats subject to approval by AICTE / PCI. SC/ST/OBC reservations as per Government norms.
          </p>
        </section>

        {/* Key Dates */}
        <section>
          <h2 className="text-2xl font-display font-bold text-primary mb-6">Important Dates</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {keyDates.map((d: any, i: number) => (
              <div key={i} className="flex items-center gap-4 bg-white border border-gray-100 rounded-xl px-5 py-4 shadow-sm hover:shadow-md transition-shadow">
                <div className="w-10 h-10 rounded-full bg-accent/20 text-accent font-bold flex items-center justify-center text-sm shrink-0">
                  {i + 1}
                </div>
                <div>
                  <p className="font-medium text-primary text-sm">{d.event}</p>
                  <p className="text-gray-500 text-sm">{d.date}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Fee Structure */}
        <section>
          <h2 className="text-2xl font-display font-bold text-primary mb-2">Fee Structure (Per Annum)</h2>
          <p className="text-gray-500 mb-6">Fees as approved by the Fee Regulatory Committee, Govt. of Madhya Pradesh.</p>
          <div className="overflow-x-auto rounded-xl shadow-sm border border-gray-200">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-primary text-white">
                  <th className="text-left px-4 py-3 font-semibold">Category</th>
                  <th className="text-center px-4 py-3 font-semibold">Tuition Fee / Year</th>
                  <th className="text-center px-4 py-3 font-semibold">Other Fees</th>
                  <th className="text-center px-4 py-3 font-semibold">Total / Year</th>
                </tr>
              </thead>
              <tbody>
                {fees.map((f: any, i: number) => (
                  <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                    <td className="px-4 py-3 font-medium text-gray-700">{f.category}</td>
                    <td className="px-4 py-3 text-center text-gray-600">{f.tuition}</td>
                    <td className="px-4 py-3 text-center text-gray-600">{f.other}</td>
                    <td className="px-4 py-3 text-center font-bold text-primary">{f.total}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Documents Checklist */}
        <section>
          <h2 className="text-2xl font-display font-bold text-primary mb-6">Documents Checklist</h2>
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {documents.map((doc: string, i: number) => (
                <div key={i} className="flex items-start gap-3">
                  <Icons.CheckCircle className="w-5 h-5 text-[#bfa15f] shrink-0 mt-0.5" />
                  <span className="text-gray-700 text-sm">{doc}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Contact Box */}
        <section>
          <div className="bg-primary rounded-xl p-8 text-white flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div>
              <h2 className="text-xl font-display font-bold mb-2">Admission Office – SGSITS</h2>
              <p className="text-white/85 text-sm mb-4">For queries related to UG admissions, contact our dedicated admission office.</p>
              <div className="flex flex-col gap-2 text-sm">
                <div className="flex items-center gap-2 text-white/85">
                  <Icons.Phone className="w-4 h-4" />
                  <span>{admissionPhone}</span>
                </div>
                <div className="flex items-center gap-2 text-white/85">
                  <Icons.Mail className="w-4 h-4" />
                  <span>{admissionEmail}</span>
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-3 shrink-0">
              <a href={mpdteUrl} className="bg-accent text-primary font-semibold px-6 py-3 rounded-lg text-center hover:bg-[#bfa15f]/90 transition-colors text-sm">
                MPDTE Counselling Portal
              </a>
              <Link to={prospectusUrl} className="border border-white text-white font-semibold px-6 py-3 rounded-lg text-center hover:bg-white/10 transition-colors text-sm">
                Download Prospectus
              </Link>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
}
