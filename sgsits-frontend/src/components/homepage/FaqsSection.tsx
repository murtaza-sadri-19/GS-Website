import React from 'react'
import { Link } from 'react-router-dom'
import { C } from './homeConstants'
import { Sk } from '../ui/Skeleton'
import FaqItem from './FaqItem'
import type { FaqItem as FaqItemData } from '../../cms/home/faqs/types'

interface FaqsSectionProps {
  section: Record<string, any>
  viewAllLabel: string
  loading: boolean
}

const SkeletonFaqs: React.FC = () => (
  <div aria-hidden="true">
    {Array.from({ length: 6 }).map((_, i) => (
      <div key={i} className="py-3 border-b flex items-start gap-3" style={{ borderColor: C.navy10 }}>
        <Sk className="shrink-0 w-5 h-5 rounded" />
        <div className="flex-grow space-y-1.5">
          <Sk className="h-3.5 w-4/5 rounded" />
          <Sk className="h-3.5 w-3/5 rounded" />
        </div>
      </div>
    ))}
  </div>
)

const FaqsSection: React.FC<FaqsSectionProps> = ({ section, viewAllLabel, loading }) => (
  <div>
    <div className="flex items-center gap-3 mb-1">
      {loading ? (
        <div className="flex items-center gap-3 w-full" aria-hidden="true">
          <Sk className="h-7 w-48 rounded" />
          <Sk className="h-6 w-16 rounded" />
        </div>
      ) : (
        <div className="flex items-center gap-3 animate-fade-in">
          <h2
            className="text-xl md:text-2xl font-display font-bold uppercase tracking-tight"
            style={{ color: C.navy }}
          >
            {section.heading}
          </h2>
          <Link
            to={section.viewAllLink ?? '#'}
            className="text-xs font-bold border rounded px-2 py-0.5 hover:opacity-80 transition-opacity"
            style={{ borderColor: C.navy, color: C.navy }}
          >
            {viewAllLabel}
          </Link>
        </div>
      )}
    </div>
    {loading ? (
      <div className="space-y-2 mb-6" aria-hidden="true">
        <Sk className="h-2.5 w-36 rounded" />
        <div className="w-8 h-[2px] bg-slate-200 rounded" />
      </div>
    ) : (
      <div className="animate-fade-in">
        <p className="text-xs uppercase font-bold tracking-widest mb-1" style={{ color: C.gold }}>
          {section.subLabel}
        </p>
        <div className="w-8 h-[2px] mb-6" style={{ backgroundColor: C.gold }} />
      </div>
    )}

    <div>
      {loading ? (
        <SkeletonFaqs />
      ) : (
        <div className="animate-fade-in">
          {(section.items ?? []).map((faq: FaqItemData) => (
            <FaqItem
              key={faq.id}
              question={faq.question}
              answer={faq.answer as any}
              contact={faq.contact as any}
              defaultOpen={(faq as any).defaultOpen}
            />
          ))}
        </div>
      )}
    </div>
  </div>
)

export default FaqsSection
