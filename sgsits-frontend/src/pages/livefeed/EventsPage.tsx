import React from 'react'
import PageSeo from '../../components/global/PageSeo'
import { livefeedService, type PublicEvent } from '../../services/livefeedService'
import { SkeletonEventRow } from '../../components/ui/Skeleton'
import { usePageData } from '../../hooks/usePageData'
import { RefreshCw } from 'lucide-react'

const CATEGORY_CLASS: Record<string, string> = {
  Academic:  'bg-primary/5 text-primary border-primary/20',
  Cultural:  'bg-accent/10 text-accent border-accent/30',
  Technical: 'bg-primary/5 text-primary border-primary/20',
  Sports:    'bg-accent/10 text-accent border-accent/30',
  Placement: 'bg-primary/5 text-primary border-primary/20',
}
const DEFAULT_CAT_CLASS = 'bg-slate-100 text-slate-600 border-slate-200'

const getPublicEvents = () => livefeedService.getPublicEvents()

const EventsPage: React.FC = () => {
  const { data: events, loading, isFetching, refresh } = usePageData<PublicEvent[]>('events', getPublicEvents)

  return (
    <div className="space-y-8">
      <PageSeo pageKey="events" />
      <div className="border-b border-slate-200 pb-4 flex items-start justify-between gap-4">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold text-primary">Upcoming Events</h2>
          <p className="text-sm text-slate-500 mt-1">Events and programs at SGSITS</p>
        </div>
        <button
          onClick={refresh}
          disabled={isFetching}
          title="Refresh events"
          className="flex items-center gap-1.5 text-xs font-bold text-slate-400 hover:text-primary transition-colors disabled:opacity-40 shrink-0 mt-1"
        >
          <RefreshCw size={13} className={isFetching ? 'animate-spin' : ''} />
          Refresh
        </button>
      </div>

      <div className="space-y-3">
        {loading ? (
          Array.from({ length: 5 }).map((_, i) => <SkeletonEventRow key={i} />)
        ) : (
          <div className="space-y-3 animate-fade-in">
            {(events ?? []).map((event) => (
              <div key={event.id} className="bg-white rounded-md p-4 border border-slate-200 shadow-sm hover:border-slate-400 hover:bg-slate-50/50 transition-all duration-200">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-grow">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-sm text-primary">{event.title}</h3>
                      <span className={`text-xs font-bold border px-2 py-0.5 rounded ${CATEGORY_CLASS[event.category] ?? DEFAULT_CAT_CLASS}`}>
                        {event.category}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5 font-medium">{event.description}</p>
                    {event.venue && (
                      <p className="text-xs text-slate-400 mt-0.5">📍 {event.venue}</p>
                    )}
                  </div>
                  <span className="text-xs text-slate-400 whitespace-nowrap flex-shrink-0 font-semibold">{event.date}</span>
                </div>
              </div>
            ))}

            {(events ?? []).length === 0 && (
              <div className="text-center py-12 text-slate-400 text-sm">No upcoming events at this time.</div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default EventsPage
