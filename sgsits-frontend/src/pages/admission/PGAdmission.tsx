import { useState, useEffect } from 'react';
import PageSeo from '../../components/global/PageSeo'
import { Link } from 'react-router-dom';
import * as Icons from 'lucide-react';
import { getPGAdmission } from '../../services/adminContentService';

export default function PGAdmission() {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    getPGAdmission().then(setData);
  }, []);

  if (!data) {
    return (
      <div className="flex items-center justify-center min-h-[50vh] w-full">
      <PageSeo pageKey="admission/pg" />
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  const {
    title,
    description,
    applyUrl,
    programs,
    steps,
    fees,
    scholarships,
    contacts
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
            <span className="text-white font-medium">PG Admission</span>
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

        {/* Programs Table */}
        <section>
          <h2 className="text-2xl font-display font-bold text-primary mb-2">Programs Offered</h2>
          <p className="text-gray-500 mb-6">All M.Tech and M.E. programs are 2-year full-time courses. MBA is 2-year and MCA is 3-year program.</p>
          <div className="overflow-x-auto rounded-xl shadow-sm border border-gray-200">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-primary text-white">
                  <th className="text-left px-4 py-3 font-semibold">Program</th>
                  <th className="text-left px-4 py-3 font-semibold">Department</th>
                  <th className="text-center px-4 py-3 font-semibold">Seats</th>
                  <th className="text-left px-4 py-3 font-semibold">Eligibility</th>
                  <th className="text-left px-4 py-3 font-semibold">Basis</th>
                </tr>
              </thead>
              <tbody>
                {programs.map((p: any, i: number) => (
                  <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                    <td className="px-4 py-3 font-medium text-primary">{p.name}</td>
                    <td className="px-4 py-3 text-gray-600">{p.dept}</td>
                    <td className="px-4 py-3 text-center font-bold text-accent">{p.seats}</td>
                    <td className="px-4 py-3 text-gray-600">{p.eligibility}</td>
                    <td className="px-4 py-3 text-gray-600">{p.basis}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Admission Process */}
        <section>
          <h2 className="text-2xl font-display font-bold text-primary mb-6">Admission Process</h2>
          <div className="relative">
            <div className="hidden md:block absolute top-10 left-[calc(10%+2rem)] right-[calc(10%+2rem)] h-0.5 bg-gray-200 z-0" />
            <div className="grid grid-cols-1 md:grid-cols-5 gap-6 relative z-10">
              {steps.map((step: any, i: number) => {
                const Icon = (Icons as any)[step.iconName] || Icons.GraduationCap;
                return (
                  <div key={i} className="flex flex-col items-center text-center">
                    <div className="w-20 h-20 rounded-full bg-primary text-white flex items-center justify-center mb-4 shadow-lg">
                      <Icon className="w-7 h-7" />
                    </div>
                    <h3 className="font-semibold text-primary text-sm mb-2">{step.title}</h3>
                    <p className="text-gray-500 text-xs leading-relaxed">{step.desc}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Fee Structure */}
        <section>
          <h2 className="text-2xl font-display font-bold text-primary mb-6">Fee Structure (Per Annum)</h2>
          <div className="overflow-x-auto rounded-xl shadow-sm border border-gray-200">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-primary text-white">
                  <th className="text-left px-4 py-3 font-semibold">Program</th>
                  <th className="text-center px-4 py-3 font-semibold">Tuition Fee</th>
                  <th className="text-center px-4 py-3 font-semibold">Other Fees</th>
                  <th className="text-center px-4 py-3 font-semibold">Total</th>
                </tr>
              </thead>
              <tbody>
                {fees.map((f: any, i: number) => (
                  <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                    <td className="px-4 py-3 font-medium text-gray-700">{f.program}</td>
                    <td className="px-4 py-3 text-center text-gray-600">{f.tuition}</td>
                    <td className="px-4 py-3 text-center text-gray-600">{f.other}</td>
                    <td className="px-4 py-3 text-center font-bold text-primary">{f.total}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Scholarships */}
        <section>
          <h2 className="text-2xl font-display font-bold text-primary mb-6">Scholarships & Fellowships</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {scholarships.map((s: any, i: number) => (
              <div key={i} className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 hover:shadow-md transition-shadow">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center">
                    <Icons.Award className="w-5 h-5 text-accent" />
                  </div>
                  <h3 className="font-bold text-primary">{s.title}</h3>
                </div>
                <p className="text-2xl font-bold text-accent mb-2">{s.amount}</p>
                <p className="text-gray-600 text-sm mb-3">{s.desc}</p>
                <div className="flex items-center gap-2 text-xs text-gray-500 bg-gray-50 rounded-lg px-3 py-2">
                  <Icons.CheckCircle className="w-3 h-3 text-[#bfa15f]" />
                  {s.eligibility}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Key Contacts */}
        <section>
          <h2 className="text-2xl font-display font-bold text-primary mb-6">Key Contacts</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {contacts.map((c: any, i: number) => (
              <div key={i} className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 hover:shadow-md transition-shadow">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <Icons.BookOpen className="w-6 h-6 text-primary" />
                </div>
                <p className="text-xs text-accent font-semibold uppercase tracking-wide mb-1">{c.role}</p>
                <h3 className="font-bold text-primary mb-1">{c.name}</h3>
                <p className="text-gray-500 text-sm mb-3">{c.dept}</p>
                <div className="space-y-1 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <Icons.Phone className="w-3 h-3" />
                    <span>{c.phone}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Icons.Mail className="w-3 h-3" />
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
