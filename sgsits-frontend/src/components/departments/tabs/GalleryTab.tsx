import React from 'react'

const GALLERY_IMAGES = [
  'https://images.unsplash.com/photo-1581092921461-eab62e97a780?q=80&w=300&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=300&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?q=80&w=300&auto=format&fit=crop',
]

const GalleryTab: React.FC = () => (
  <div className="space-y-6">
    <div className="pb-3 border-b border-slate-200">
      <h2 className="text-xl font-display font-bold text-slate-900">Department Photo Logs</h2>
    </div>
    <p className="text-xs md:text-sm text-slate-655 leading-relaxed font-sans">
      Highlights of industrial visits, conference presentations, and technical seminars.
    </p>
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 pt-4">
      {GALLERY_IMAGES.map((img, idx) => (
        <div key={idx} className="relative aspect-video rounded overflow-hidden border border-slate-200 shadow-sm">
          <img src={img} alt="Dept Event" className="w-full h-full object-cover" />
        </div>
      ))}
    </div>
  </div>
)

export default GalleryTab
