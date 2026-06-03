import React from 'react'
import { Link } from 'react-router-dom'
import { C } from './homeConstants'
import { Sk } from '../ui/Skeleton'
import type { GalleryThumbnail } from '../../services/mediaService'

interface GallerySectionProps {
  section: Record<string, any>
  thumbnails: GalleryThumbnail[]
  viewAllLabel: string
  loading: boolean
}

const SkeletonGallery: React.FC = () => (
  <div className="grid grid-cols-4 gap-1.5" aria-hidden="true">
    {Array.from({ length: 12 }).map((_, i) => (
      <Sk key={i} className="aspect-square rounded-sm" />
    ))}
  </div>
)

const GallerySection: React.FC<GallerySectionProps> = ({ section, thumbnails, viewAllLabel, loading }) => (
  <div>
    <div className="flex items-center justify-between mb-1">
      {loading ? (
        <div className="flex items-center justify-between w-full" aria-hidden="true">
          <div className="flex items-center gap-3">
            <Sk className="h-7 w-44 rounded" />
          </div>
          <Sk className="h-6 w-16 rounded" />
        </div>
      ) : (
        <div className="flex items-center justify-between w-full animate-fade-in">
          <div className="flex items-center gap-3">
            <h2
              className="text-xl md:text-2xl font-display font-bold uppercase tracking-tight"
              style={{ color: C.navy }}
            >
              {section.heading}{' '}
              <span style={{ color: C.gold }}>{section.accentText}</span>
            </h2>
          </div>
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
        <Sk className="h-2.5 w-32 rounded" />
        <div className="w-8 h-[2px] bg-slate-200 rounded" />
      </div>
    ) : (
      <div className="animate-fade-in">
        <p className="text-[10px] uppercase font-bold tracking-widest mb-1" style={{ color: C.gold }}>
          {section.subLabel}
        </p>
        <div className="w-8 h-[2px] mb-6" style={{ backgroundColor: C.gold }} />
      </div>
    )}

    {loading ? (
      <SkeletonGallery />
    ) : (
      <div className="grid grid-cols-4 gap-1.5 animate-fade-in">
        {thumbnails.map((thumb, idx) => (
          <Link
            key={idx}
            to={thumb.to}
            className="aspect-square overflow-hidden rounded-sm group block"
            style={{ border: `1px solid ${C.navy10}` }}
          >
            <img
              src={thumb.imageUrl || undefined}
              alt={thumb.alt}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            />
          </Link>
        ))}
      </div>
    )}
  </div>
)

export default GallerySection
