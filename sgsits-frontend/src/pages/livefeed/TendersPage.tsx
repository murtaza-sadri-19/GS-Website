import React, { useState, useEffect } from 'react'
import PageSeo from '../../components/global/PageSeo'
import { Download, FileText } from 'lucide-react'
import { livefeedService, tendersDefault, type Tender } from '../../services/livefeedService'

const TendersPage: React.FC = () => {
  const [tenders, setTenders] = useState<Tender[]>(tendersDefault)
  const [meta, setMeta] = useState({ contactEmail: 'purchase@sgsits.ac.in', contactPhone: '0731-2582115', note: 'All tender documents are available for download. Interested vendors must submit bids before the last date.' })

  useEffect(() => {
    livefeedService.getTenders().then(setTenders)
    livefeedService.getTenderMeta().then(setMeta)
  }, [])

  const open   = tenders.filter(t => t.status === 'Open' || t.status === 'Extended')
  const closed = tenders.filter(t => t.status === 'Closed')

  return (
    <div className="space-y-8">
      <PageSeo pageKey="tenders" />
      <div className="border-b border-slate-200 pb-5">
        <span className="text-[10px] uppercase font-bold tracking-widest text-accent block mb-1">Procurement</span>
        <h2 className="text-2xl md:text-3xl font-display font-bold text-primary">Tenders</h2>
        <p className="text-sm text-slate-500 mt-1 font-medium">Procurement tenders, quotations and works notices — SGSITS Indore</p>
      </div>

      <div className="bg-slate-50 border border-slate-200 rounded p-4 text-sm text-slate-600 font-sans">
        <p>{meta.note} For queries: <a href={`mailto:${meta.contactEmail}`} className="text-accent-blue hover:underline">{meta.contactEmail}</a> | {meta.contactPhone}</p>
      </div>

      {/* Open / Extended Tenders */}
      {open.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-3">
            <span className="text-xs font-bold bg-[#bfa15f]/10 text-[#bfa15f] border border-[#bfa15f]/30 px-2.5 py-0.5 rounded">Active Tenders</span>
            <div className="flex-grow h-px bg-slate-200"></div>
          </div>
          <div className="space-y-3">
            {open.map((tender) => (
              <div key={tender.ref} className="bg-white rounded border border-slate-200 border-l-4 border-l-[#bfa15f] p-4 shadow-sm hover:border-slate-400 transition-colors">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3 flex-grow">
                    <FileText size={18} className="text-slate-400 shrink-0 mt-0.5" />
                    <div>
                      <h3 className="font-semibold text-sm text-primary">{tender.title}</h3>
                      <div className="flex flex-wrap gap-x-4 gap-y-1 mt-1.5 text-xs text-slate-500 font-medium">
                        <span>Ref: {tender.ref}</span>
                        <span>Dept: {tender.dept}</span>
                        {tender.amount && <span>Est: {tender.amount}</span>}
                        <span className="text-[#0b2545] font-bold">Last Date: {tender.lastDate}</span>
                      </div>
                    </div>
                  </div>
                  <a
                    href={tender.fileUrl ?? '#'}
                    className="flex items-center gap-1.5 text-xs font-bold text-primary border border-primary/20 bg-primary/5 px-3 py-1.5 rounded hover:bg-primary hover:text-white transition-colors shrink-0"
                  >
                    <Download size={12} /> Download
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Closed Tenders */}
      {closed.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-3">
            <span className="text-xs font-bold bg-slate-100 text-slate-600 border border-slate-200 px-2.5 py-0.5 rounded">Closed / Archived</span>
            <div className="flex-grow h-px bg-slate-200"></div>
          </div>
          <div className="space-y-3">
            {closed.map((tender) => (
              <div key={tender.ref} className="bg-white rounded border border-slate-200 p-4 shadow-sm hover:bg-slate-50 transition-colors opacity-75">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3 flex-grow">
                    <FileText size={18} className="text-slate-300 shrink-0 mt-0.5" />
                    <div>
                      <h3 className="font-medium text-sm text-slate-700">{tender.title}</h3>
                      <div className="flex flex-wrap gap-x-4 gap-y-1 mt-1.5 text-xs text-slate-400 font-medium">
                        <span>Ref: {tender.ref}</span>
                        <span>Published: {tender.publishDate}</span>
                        <span className="text-slate-500">Closed: {tender.lastDate}</span>
                      </div>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold bg-slate-100 text-slate-500 px-2 py-0.5 rounded border border-slate-200 shrink-0">Closed</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default TendersPage
