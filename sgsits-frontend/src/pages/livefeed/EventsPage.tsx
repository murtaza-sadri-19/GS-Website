import React, { useState, useEffect } from 'react'
import PageSeo from '../../components/global/PageSeo'
import { livefeedService, publicEventsDefault, type PublicEvent } from '../../services/livefeedService'

const CATEGORY_CLASS: Record<string, string> = {
  Academic:  'bg-[#0b2545]/5 text-[#0b2545] border-[#0b2545]/20',
  Cultural:  'bg-[#bfa15f]/10 text-[#bfa15f] border-[#bfa15f]/30',
  Technical: 'bg-[#0b2545]/5 text-[#0b2545] border-[#0b2545]/20',
  Sports:    'bg-[#bfa15f]/10 text-[#bfa15f] border-[#bfa15f]/30',
  Placement: 'bg-[#0b2545]/5 text-[#0b2545] border-[#0b2545]/20',
}
const DEFAULT_CAT_CLASS = 'bg-slate-100 text-slate-600 border-slate-200'

const EventsPage: React.FC = () => {
  const [events, setEvents] = useState<PublicEvent[]>(publicEventsDefault)

  useEffect(() => {
    livefeedService.getPublicEvents().then(setEvents)
  }, [])

  return (
    <div className="space-y-8">
      <PageSeo pageKey="events" />
      <div className="border-b border-gray-200 pb-4">
        <h2 className="text-2xl md:text-3xl font-bold" style={{ color: 'var(--color-primary)' }}>Upcoming Events</h2>
        <p className="text-sm text-gray-500 mt-1">Events and programs at SGSITS</p>
      </div>

      <div className="space-y-3">
        {events.map((event) => (
          <div key={event.id} className="bg-white rounded-md p-4 border border-slate-200 shadow-sm hover:border-slate-400 hover:bg-slate-50/50 transition-all duration-200">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-grow">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-semibold text-sm" style={{ color: 'var(--color-primary)' }}>{event.title}</h3>
                  <span className={`text-[10px] font-bold border px-2 py-0.5 rounded ${CATEGORY_CLASS[event.category] ?? DEFAULT_CAT_CLASS}`}>
                    {event.category}
                  </span>
                </div>
                <p className="text-xs text-gray-500 mt-0.5 font-medium">{event.description}</p>
                {event.venue && (
                  <p className="text-xs text-gray-400 mt-0.5">📍 {event.venue}</p>
                )}
              </div>
              <span className="text-xs text-gray-400 whitespace-nowrap flex-shrink-0 font-semibold">{event.date}</span>
            </div>
          </div>
        ))}

        {events.length === 0 && (
          <div className="text-center py-12 text-gray-400 text-sm">No upcoming events at this time.</div>
        )}
      </div>
    </div>
  )
}

export default EventsPage
