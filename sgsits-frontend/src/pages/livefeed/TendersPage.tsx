import React from 'react'
import PageSeo from '../../components/global/PageSeo'
import { Download, FileText, RefreshCw } from 'lucide-react'
import { livefeedService, type Tender } from '../../services/livefeedService'
import { SkeletonEventRow } from '../../components/ui/Skeleton'
import { usePageData } from '../../hooks/usePageData'

interface TenderMeta {
  contactEmail: string
  contactPhone: string
  note: string
}

const DEFAULT_META: TenderMeta = {
  contactEmail: 'purchase@sgsits.ac.in',
  contactPhone: '0731-2582115',
  note: 'All tender documents are available for download. Interested vendors must submit bids before the last date.',
}

const getTenders    = () => livefeedService.getTenders()
const getTenderMeta = () => livefeedService.getTenderMeta()

const TendersPage: React.FC = () => {
  const { data: tenders,    loading: tendersLoading, isFetching: tendersFetching, refresh: refreshTenders } = usePageData<Tender[]>('tenders',    getTenders)
  const { data: tenderMeta, loading: metaLoading,    isFetching: metaFetching,    refresh: refreshMeta    } = usePageData<TenderMeta>('tenderMeta', getTenderMeta)

  const loading  = tendersLoading || metaLoading
  const fetching = tendersFetching || metaFetching
  const refresh  = () => Promise.all([refreshTenders(), refreshMeta()])

  const meta = tenderMeta ?? DEFAULT_META
  const open   = (tenders ?? []).filter(t => t.status === 'Open' || t.status === 'Extended')
  const closed = (tenders ?? []).filter(t => t.status === 'Closed')

  return (
    <div className="space-y-8">
      <PageSeo pageKey="tenders" />
      <div className="border-b border-slate-200 pb-5 flex items-start justify-between gap-4">
        <div>
          <span className="text-xs uppercase font-bold tracking-widest text-accent block mb-1">Procurement</span>
          <h2 className="text-2xl md:text-3xl font-display font-bold text-primary">Tenders</h2>
          <p className="text-sm text-slate-500 mt-1 font-medium">Procurement tenders, quotations and works notices — SGSITS Indore</p>
        </div>
        <button
          onClick={refresh}
          disabled={fetching}
          title="Refresh tenders"
          className="flex items-center gap-1.5 text-xs font-bold text-slate-400 hover:text-primary transition-colors disabled:opacity-40 shrink-0 mt-1"
        >
          <RefreshCw size={13} className={fetching ? 'animate-spin' : ''} />
          Refresh
        </button>
      </div>

      <div className="bg-slate-50 border border-slate-200 rounded p-4 text-sm text-slate-600 font-sans">
        <p>
          {meta.note} For queries:{' '}
          <a href={`mailto:${meta.contactEmail}`} className="text-accent-blue hover:underline">{meta.contactEmail}</a>
          {' '}| {meta.contactPhone}
        </p>
      </div>

      {loading && (
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => <SkeletonEventRow key={i} />)}
        </div>
      )}

      {!loading && open.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-3">
            <span className="text-xs font-bold bg-accent/10 text-accent border border-accent/30 px-2.5 py-0.5 rounded">Active Tenders</span>
            <div className="flex-grow h-px bg-slate-200" />
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
                        <span className="text-primary font-bold">Last Date: {tender.lastDate}</span>
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

      {!loading && closed.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-3">
            <span className="text-xs font-bold bg-slate-100 text-slate-600 border border-slate-200 px-2.5 py-0.5 rounded">Closed / Archived</span>
            <div className="flex-grow h-px bg-slate-200" />
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
                  <span className="text-xs font-bold bg-slate-100 text-slate-500 px-2 py-0.5 rounded border border-slate-200 shrink-0">Closed</span>
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
