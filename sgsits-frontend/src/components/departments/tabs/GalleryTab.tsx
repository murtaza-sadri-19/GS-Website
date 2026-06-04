import React, { useState, useEffect } from 'react'
import { getDeptSection } from '../../../services/departmentService'

interface GalleryImage {
  url: string
  caption?: string
}

interface GallerySection {
  intro?: string
  images?: GalleryImage[]
}

interface GalleryTabProps {
  slug: string
}

const GalleryTab: React.FC<GalleryTabProps> = ({ slug }) => {
  const [data, setData] = useState<GallerySection | null>(null)

  useEffect(() => {
    getDeptSection<GallerySection>(slug, 'gallery').then(d => { if (d) setData(d) })
  }, [slug])

  const images = data?.images ?? []

  return (
    <div className="space-y-6">
      <div className="pb-3 border-b border-slate-200">
        <h2 className="text-xl font-display font-bold text-slate-900">Department Photo Gallery</h2>
      </div>
      <p className="text-xs md:text-sm text-slate-600 leading-relaxed font-sans">
        {data?.intro || 'Highlights of industrial visits, conference presentations, and technical seminars.'}
      </p>

      {images.length === 0 ? (
        <p className="text-xs text-slate-400 italic py-8 text-center">No gallery images uploaded yet. Contact HOD.</p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 pt-4">
          {images.map((img, idx) => (
            <div key={idx} className="relative aspect-video rounded overflow-hidden border border-slate-200 shadow-sm group">
              <img
                src={img.url}
                alt={img.caption || `Department photo ${idx + 1}`}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              {img.caption && (
                <div className="absolute bottom-0 inset-x-0 bg-black/50 text-white text-xs p-1.5 text-center font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                  {img.caption}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default GalleryTab
