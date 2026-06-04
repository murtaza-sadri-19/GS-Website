import { SkeletonPage } from '../../components/ui/Skeleton'
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

  if (!data) return <SkeletonPage />

  const {
    title,
    description,
    englishUrl,
    hindiUrl,
    publishedDate,
    fileDetails,
    quickFacts = [],
    highlights = [],
    relatedLinks = [],
    archive = [],
  } = data;

  return (
    <div className="min-h-screen bg-white">
      <PageSeo pageKey="admission/prospectus" />

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
            <span className="text-white font-semibold">Prospectus</span>
          </nav>
          <span className="text-xs uppercase font-bold tracking-widest text-accent block mb-1.5">Admissions</span>
          <h1 className="text-2xl md:text-3xl font-display font-bold mb-2">{title}</h1>
          <p className="text-white/80 text-sm max-w-2xl font-medium">{description}</p>
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto px-4 lg:px-12 py-10 space-y-12">

        {/* Prospectus Download Card */}
        <section>
          <div className="border border-slate-200 rounded overflow-hidden">
            <div className="grid grid-cols-1 md:grid-cols-3">
              {/* Cover Mockup */}
              <div className="bg-primary flex flex-col items-center justify-center p-8 min-h-[240px]">
                <div className="w-36 h-48 bg-white rounded border-2 border-accent flex flex-col items-center justify-center p-4 text-center shadow-md">
                  <div className="w-11 h-11 rounded-full bg-primary flex items-center justify-center mb-2">
                    <Icons.BookOpen className="w-5 h-5 text-accent" strokeWidth={1.75} />
                  </div>
                  <p className="text-primary font-display font-bold text-sm leading-tight">SGSITS</p>
                  <p className="text-slate-500 text-xs mt-1">Prospectus</p>
                  <p className="text-accent font-bold text-sm mt-1">2025–26</p>
                  <p className="text-slate-400 text-xs mt-2 border-t border-slate-200 pt-2 w-full text-center">Indore, M.P.</p>
                </div>
              </div>

              {/* Info */}
              <div className="col-span-2 p-7 flex flex-col justify-center bg-white">
                <div className="flex items-center gap-2 mb-3">
                  <span className="bg-accent/15 text-accent text-xs font-bold px-2.5 py-0.5 rounded uppercase tracking-wide">Latest Edition</span>
                  <span className="text-slate-400 text-xs font-medium">{publishedDate}</span>
                </div>
                <h2 className="text-xl font-display font-bold text-primary mb-2">SGSITS Admissions Prospectus</h2>
                <p className="text-slate-600 text-sm mb-5 leading-relaxed font-medium">
                  The official SGSITS prospectus contains everything you need to know before applying — from program details and eligibility to fee structures, scholarships, campus facilities, and placement records. Available for download in PDF format (English &amp; Hindi).
                </p>
                <div className="flex flex-col sm:flex-row gap-3">
                  <a
                    href={englishUrl}
                    className="inline-flex items-center gap-2 bg-primary text-white font-bold text-xs px-5 py-2.5 rounded hover:bg-primary/90 transition-colors justify-center"
                  >
                    <Icons.Download className="w-3.5 h-3.5" /> Download PDF (English)
                  </a>
                  <a
                    href={hindiUrl}
                    className="inline-flex items-center gap-2 bg-accent text-primary font-bold text-xs px-5 py-2.5 rounded hover:bg-accent/90 transition-colors justify-center"
                  >
                    <Icons.Download className="w-3.5 h-3.5" /> Download PDF (Hindi)
                  </a>
                </div>
                <p className="text-xs text-slate-400 mt-3 font-sans">{fileDetails}</p>
              </div>
            </div>
          </div>
        </section>

        {/* Quick Facts */}
        <section>
          <div className="border-b border-slate-200 pb-4 mb-6">
            <span className="text-xs uppercase font-bold tracking-widest text-accent block mb-1">Overview</span>
            <h2 className="text-xl font-display font-bold text-slate-900">SGSITS at a Glance</h2>
            <div className="w-10 h-[2px] bg-accent mt-2" />
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {quickFacts.map((fact: any, i: number) => {
              const Icon = (Icons as any)[fact.iconName] || Icons.Star;
              return (
                <div key={i} className="bg-white border border-slate-200 rounded p-5 text-center hover:border-slate-400 transition-colors duration-200">
                  <div className="w-10 h-10 rounded bg-slate-50 border border-slate-200 flex items-center justify-center mx-auto mb-3 text-primary">
                    <Icon className="w-5 h-5" strokeWidth={1.75} />
                  </div>
                  <p className="text-2xl font-display font-bold text-primary">{fact.value}</p>
                  <p className="text-slate-500 text-xs mt-1 font-medium">{fact.label}</p>
                </div>
              );
            })}
          </div>
        </section>

        {/* Highlights */}
        <section>
          <div className="border-b border-slate-200 pb-4 mb-6">
            <span className="text-xs uppercase font-bold tracking-widest text-accent block mb-1">Contents</span>
            <h2 className="text-xl font-display font-bold text-slate-900">What's Inside the Prospectus</h2>
            <div className="w-10 h-[2px] bg-accent mt-2" />
          </div>
          <p className="text-sm text-slate-500 font-medium mb-5">The prospectus covers all major aspects of student life and academic programs at SGSITS.</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {highlights.map((section: any, i: number) => (
              <div key={i} className="bg-white rounded border border-slate-200 p-5 hover:border-slate-400 transition-colors duration-200">
                <h3 className="font-bold text-primary text-sm mb-3 pb-2 border-b border-slate-100">{section.title}</h3>
                <ul className="space-y-2">
                  {section.items.map((item: string, j: number) => (
                    <li key={j} className="flex items-start gap-2 text-sm text-slate-700 font-medium">
                      <Icons.CheckCircle2 className="w-3.5 h-3.5 text-slate-600 shrink-0 mt-0.5" strokeWidth={2} />
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
          <div className="border-b border-slate-200 pb-4 mb-6">
            <span className="text-xs uppercase font-bold tracking-widest text-accent block mb-1">Next Steps</span>
            <h2 className="text-xl font-display font-bold text-slate-900">Explore Admissions</h2>
            <div className="w-10 h-[2px] bg-accent mt-2" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {relatedLinks.map((link: any, i: number) => (
              <Link
                key={i}
                to={link.to}
                className="flex items-center justify-between bg-white rounded border border-slate-200 px-5 py-4 hover:border-slate-400 hover:shadow-sm transition-all duration-200 group"
              >
                <div>
                  <h3 className="font-bold text-primary text-sm group-hover:text-accent transition-colors">{link.label}</h3>
                  <p className="text-slate-500 text-xs font-medium mt-0.5">{link.desc}</p>
                </div>
                <Icons.ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-accent group-hover:translate-x-0.5 transition-all shrink-0" />
              </Link>
            ))}
          </div>
        </section>

        {/* Previous Editions Archive */}
        {archive.length > 0 && (
          <section>
            <div className="border-b border-slate-200 pb-4 mb-6">
              <span className="text-xs uppercase font-bold tracking-widest text-accent block mb-1">Archive</span>
              <h2 className="text-xl font-display font-bold text-slate-900">Previous Editions</h2>
              <div className="w-10 h-[2px] bg-accent mt-2" />
            </div>
            <div className="border border-slate-200 rounded divide-y divide-slate-100">
              {archive.map((item: any, i: number) => (
                <div key={i} className="flex items-center justify-between px-5 py-4 hover:bg-slate-50 transition-colors">
                  <div className="flex items-center gap-3">
                    <Icons.BookOpen className="w-4 h-4 text-slate-400" strokeWidth={1.75} />
                    <div>
                      <p className="font-semibold text-slate-800 text-sm">SGSITS Prospectus {item.year}</p>
                      <p className="text-slate-400 text-xs font-medium">Archived Edition</p>
                    </div>
                  </div>
                  <a
                    href={item.fileUrl}
                    className="inline-flex items-center gap-1.5 text-primary hover:text-accent transition-colors text-xs font-bold"
                  >
                    <Icons.Download className="w-3.5 h-3.5" /> Download
                  </a>
                </div>
              ))}
            </div>
          </section>
        )}

      </div>
    </div>
  );
}
