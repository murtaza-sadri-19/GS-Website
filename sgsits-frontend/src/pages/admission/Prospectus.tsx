import { useState, useEffect } from 'react';
import PageSeo from '../../components/global/PageSeo'
import { Link } from 'react-router-dom';
import * as Icons from 'lucide-react';
import { getProspectus } from '../../services/adminContentService';

export default function Prospectus() {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    getProspectus().then(setData);
  }, []);

  if (!data) {
    return (
      <div className="flex items-center justify-center min-h-[50vh] w-full">
      <PageSeo pageKey="admission/prospectus" />
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  const {
    title,
    description,
    englishUrl,
    hindiUrl,
    publishedDate,
    fileDetails,
    quickFacts,
    highlights,
    relatedLinks,
    archive
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
            <span className="text-white font-medium">Prospectus</span>
          </div>
          <h1 className="text-4xl font-display font-bold mb-3">{title}</h1>
          <p className="text-white/85 text-lg max-w-2xl">{description}</p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-12 space-y-14">

        {/* Prospectus Download Card */}
        <section>
          <div className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden">
            <div className="grid grid-cols-1 md:grid-cols-3">
              {/* Cover Mockup */}
              <div className="bg-primary flex flex-col items-center justify-center p-10 min-h-[280px]">
                <div className="w-40 h-52 bg-white rounded-lg shadow-xl flex flex-col items-center justify-center border-4 border-accent p-4 text-center">
                  <div className="w-14 h-14 rounded-full bg-primary flex items-center justify-center mb-2">
                    <Icons.BookOpen className="w-7 h-7 text-accent" />
                  </div>
                  <p className="text-primary font-display font-bold text-sm leading-tight">SGSITS</p>
                  <p className="text-gray-600 text-xs mt-1">Prospectus</p>
                  <p className="text-accent font-bold text-sm mt-1">2025–26</p>
                  <p className="text-gray-400 text-xs mt-2 border-t pt-2 w-full text-center">Indore, M.P.</p>
                </div>
              </div>
              {/* Info */}
              <div className="col-span-2 p-8 flex flex-col justify-center">
                <div className="flex items-center gap-2 mb-3">
                  <span className="bg-[#bfa15f]/20 text-[#bfa15f] text-xs font-semibold px-3 py-1 rounded-full">Latest Edition</span>
                  <span className="text-gray-400 text-xs">{publishedDate}</span>
                </div>
                <h2 className="text-2xl font-display font-bold text-primary mb-2">
                  SGSITS Admissions Prospectus
                </h2>
                <p className="text-gray-600 text-sm mb-6 leading-relaxed">
                  The official SGSITS prospectus contains everything you need to know before applying — from program details and eligibility to fee structures, scholarships, campus facilities, and placement records. Available for download in PDF format (English & Hindi).
                </p>
                <div className="flex flex-col sm:flex-row gap-3">
                  <a
                    href={englishUrl}
                    className="inline-flex items-center gap-2 bg-primary text-white font-semibold px-6 py-3 rounded-lg hover:bg-accent-blue transition-colors text-sm justify-center"
                  >
                    <Icons.Download className="w-4 h-4" /> Download PDF (English)
                  </a>
                  <a
                    href={hindiUrl}
                    className="inline-flex items-center gap-2 bg-accent text-primary font-semibold px-6 py-3 rounded-lg hover:bg-[#bfa15f]/90 transition-colors text-sm justify-center"
                  >
                    <Icons.Download className="w-4 h-4" /> Download PDF (Hindi)
                  </a>
                </div>
                <p className="text-xs text-gray-400 mt-4">{fileDetails}</p>
              </div>
            </div>
          </div>
        </section>

        {/* Quick Facts */}
        <section>
          <h2 className="text-2xl font-display font-bold text-primary mb-6">SGSITS at a Glance</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {quickFacts.map((fact: any, i: number) => {
              const Icon = (Icons as any)[fact.iconName] || Icons.Star;
              return (
                <div key={i} className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 text-center hover:shadow-md transition-shadow">
                  <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center mx-auto mb-3">
                    <Icon className="w-6 h-6" />
                  </div>
                  <p className="text-2xl font-display font-bold text-primary">{fact.value}</p>
                  <p className="text-gray-500 text-xs mt-1">{fact.label}</p>
                </div>
              );
            })}
          </div>
        </section>

        {/* Highlights */}
        <section>
          <h2 className="text-2xl font-display font-bold text-primary mb-2">What's Inside the Prospectus</h2>
          <p className="text-gray-500 mb-6">The prospectus covers all major aspects of student life and academic programs at SGSITS.</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {highlights.map((section: any, i: number) => (
              <div key={i} className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 hover:shadow-md transition-shadow">
                <h3 className="font-bold text-primary mb-4 pb-2 border-b border-gray-100">{section.title}</h3>
                <ul className="space-y-2">
                  {section.items.map((item: string, j: number) => (
                    <li key={j} className="flex items-start gap-2 text-sm text-gray-700">
                      <Icons.CheckCircle className="w-4 h-4 text-accent shrink-0 mt-0.5" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        {/* Related Links */}
        <section>
          <h2 className="text-2xl font-display font-bold text-primary mb-6">Explore Admissions</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {relatedLinks.map((link: any, i: number) => (
              <Link
                key={i}
                to={link.to}
                className="flex items-center justify-between bg-white rounded-xl border border-gray-200 shadow-sm px-6 py-5 hover:shadow-md hover:border-accent transition-all group"
              >
                <div>
                  <h3 className="font-semibold text-primary group-hover:text-accent transition-colors">{link.label}</h3>
                  <p className="text-gray-500 text-sm">{link.desc}</p>
                </div>
                <Icons.ExternalLink className="w-5 h-5 text-gray-400 group-hover:text-accent transition-colors" />
              </Link>
            ))}
          </div>
        </section>

        {/* Old prospectus archive */}
        <section>
          <h2 className="text-2xl font-display font-bold text-primary mb-6">Previous Editions</h2>
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm divide-y divide-gray-100">
            {archive.map((item: any, i: number) => (
              <div key={i} className="flex items-center justify-between px-6 py-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-center gap-3">
                  <Icons.BookOpen className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="font-medium text-gray-700 text-sm">SGSITS Prospectus {item.year}</p>
                    <p className="text-gray-400 text-xs">Archived Edition</p>
                  </div>
                </div>
                <a href={item.fileUrl} className="flex items-center gap-1 text-primary hover:text-accent transition-colors text-sm font-medium">
                  <Icons.Download className="w-4 h-4" /> Download
                </a>
              </div>
            ))}
          </div>
        </section>

      </div>
    </div>
  );
}
