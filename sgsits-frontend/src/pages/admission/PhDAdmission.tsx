import { useState, useEffect } from 'react';
import PageSeo from '../../components/global/PageSeo'
import { Link } from 'react-router-dom';
import * as Icons from 'lucide-react';
import { getPhDAdmission } from '../../services/adminContentService';

export default function PhDAdmission() {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    getPhDAdmission().then(setData);
  }, []);

  if (!data) {
    return (
      <div className="flex items-center justify-center min-h-[50vh] w-full">
      <PageSeo pageKey="admission/phd" />
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  const {
    title,
    description,
    applyUrl,
    brochureUrl,
    guidelinesUrl,
    rdPhone,
    rdEmail,
    rdAddress,
    eligibilityQualifications,
    eligibilityFellowships,
    researchAreas,
    selectionSteps,
    vacancies,
    facilities
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
            <span className="text-white font-medium">PhD Admission</span>
          </div>
          <h1 className="text-4xl font-display font-bold mb-3">{title}</h1>
          <p className="text-white/85 text-lg max-w-2xl">{description}</p>
          <a
            href={applyUrl}
            className="mt-6 inline-flex items-center gap-2 bg-accent text-primary font-semibold px-6 py-3 rounded-lg hover:bg-[#bfa15f]/90 transition-colors"
          >
            Apply for PhD <Icons.ChevronRight className="w-4 h-4" />
          </a>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-12 space-y-14">

        {/* Eligibility */}
        <section>
          <h2 className="text-2xl font-display font-bold text-primary mb-6">Eligibility Criteria</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
              <h3 className="font-bold text-primary mb-4 flex items-center gap-2">
                <Icons.BookOpen className="w-5 h-5 text-accent" /> Academic Qualification
              </h3>
              <ul className="space-y-2 text-sm text-gray-700">
                {eligibilityQualifications.map((item: string, idx: number) => (
                  <li key={idx} className="flex gap-2">
                    <Icons.CheckCircle className="w-4 h-4 text-[#bfa15f] shrink-0 mt-0.5" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
              <h3 className="font-bold text-primary mb-4 flex items-center gap-2">
                <Icons.Award className="w-5 h-5 text-accent" /> Fellowship (JRF/SRF)
              </h3>
              <ul className="space-y-2 text-sm text-gray-700">
                {eligibilityFellowships.map((item: string, idx: number) => (
                  <li key={idx} className="flex gap-2">
                    <Icons.CheckCircle className="w-4 h-4 text-[#bfa15f] shrink-0 mt-0.5" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* Research Areas */}
        <section>
          <h2 className="text-2xl font-display font-bold text-primary mb-2">Research Areas by Department</h2>
          <p className="text-gray-500 mb-6">SGSITS offers research opportunities in cutting-edge areas across all engineering and science disciplines.</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {researchAreas.map((dept: any, i: number) => {
              const Icon = (Icons as any)[dept.iconName] || Icons.Cpu;
              return (
                <div key={i} className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 hover:shadow-md transition-shadow">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center">
                      <Icon className="w-5 h-5" />
                    </div>
                    <h3 className="font-bold text-primary">{dept.dept}</h3>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {dept.areas.map((area: string, j: number) => (
                      <span key={j} className="bg-[#0b2545]/10 text-[#0b2545] text-xs px-3 py-1 rounded-full font-medium">
                        {area}
                      </span>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Selection Process */}
        <section>
          <h2 className="text-2xl font-display font-bold text-primary mb-6">Selection Process</h2>
          <div className="space-y-4">
            {selectionSteps.map((step: any, i: number) => (
              <div key={i} className="flex gap-4 items-start bg-white rounded-xl border border-gray-100 shadow-sm px-6 py-4 hover:shadow-md transition-shadow">
                <div className="w-9 h-9 rounded-full bg-primary text-white font-bold flex items-center justify-center shrink-0 text-sm">
                  {i + 1}
                </div>
                <div>
                  <h3 className="font-semibold text-primary">{step.title}</h3>
                  <p className="text-gray-500 text-sm">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Current Vacancies */}
        <section>
          <h2 className="text-2xl font-display font-bold text-primary mb-2">Current PhD Vacancies</h2>
          <p className="text-gray-500 mb-6">Available positions for the academic year. Contact respective supervisor for research proposals.</p>
          <div className="overflow-x-auto rounded-xl shadow-sm border border-gray-200">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-primary text-white">
                  <th className="text-left px-4 py-3 font-semibold">Department</th>
                  <th className="text-center px-4 py-3 font-semibold">Vacancies</th>
                  <th className="text-left px-4 py-3 font-semibold">Supervisors</th>
                  <th className="text-left px-4 py-3 font-semibold">Research Areas</th>
                </tr>
              </thead>
              <tbody>
                {vacancies.map((v: any, i: number) => (
                  <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                    <td className="px-4 py-3 font-medium text-primary">{v.dept}</td>
                    <td className="px-4 py-3 text-center">
                      <span className="bg-[#bfa15f]/20 text-[#bfa15f] font-bold px-3 py-1 rounded-full text-xs">
                        {v.vacancies} open
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-600">{v.supervisors}</td>
                    <td className="px-4 py-3 text-gray-600">{v.area}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Research Facilities */}
        <section>
          <h2 className="text-2xl font-display font-bold text-primary mb-6">Research Facilities</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
            {facilities.map((f: any, i: number) => (
              <div key={i} className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 hover:shadow-md transition-shadow">
                <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center mb-3">
                  <Icons.FlaskConical className="w-5 h-5 text-accent" />
                </div>
                <h3 className="font-semibold text-primary text-sm mb-2">{f.name}</h3>
                <p className="text-gray-500 text-xs leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Contact CTA */}
        <section>
          <div className="bg-primary rounded-xl p-8 text-white flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div>
              <h2 className="text-xl font-display font-bold mb-2">Research & Development Cell</h2>
              <p className="text-white/85 text-sm mb-4">For PhD admission queries, contact the R&D office or the respective department supervisor.</p>
              <div className="space-y-1 text-sm text-white/85">
                <div className="flex items-center gap-2"><Icons.Phone className="w-4 h-4" /><span>{rdPhone}</span></div>
                <div className="flex items-center gap-2"><Icons.Mail className="w-4 h-4" /><span>{rdEmail}</span></div>
                <div className="flex items-center gap-2"><Icons.Users className="w-4 h-4" /><span>{rdAddress}</span></div>
              </div>
            </div>
            <div className="flex flex-col gap-3 shrink-0">
              <a href={brochureUrl} className="bg-accent text-primary font-semibold px-6 py-3 rounded-lg text-center hover:bg-[#bfa15f]/90 transition-colors text-sm">
                Download PhD Brochure
              </a>
              <a href={guidelinesUrl} className="border border-white text-white font-semibold px-6 py-3 rounded-lg text-center hover:bg-white/10 transition-colors text-sm">
                Research Proposal Guidelines
              </a>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
}
