import React, { useState, useEffect } from 'react'
import PageSeo from '../../components/global/PageSeo'
import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, ZoomIn, X, ChevronLeft, ChevronRight, Calendar, Camera, Share2 } from 'lucide-react'
import { getGalleryAlbums } from '../../services/mediaService'


const AlbumPage: React.FC = () => {
  const { albumSlug } = useParams<{ albumSlug: string }>()
  const [albums, setAlbums] = useState<any[]>([])
  useEffect(() => { getGalleryAlbums().then(setAlbums).catch(() => {}) }, [])
  const album = albums.find((a: any) => a.id === albumSlug)

  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [currentIndex, setCurrentIndex] = useState(0)

  const openLightbox = (index: number) => {
    setCurrentIndex(index)
    setLightboxOpen(true)
  }

  const closeLightbox = () => setLightboxOpen(false)

  const prevPhoto = () => {
    if (!album) return
    setCurrentIndex(i => (i - 1 + album.photos.length) % album.photos.length)
  }

  const nextPhoto = () => {
    if (!album) return
    setCurrentIndex(i => (i + 1) % album.photos.length)
  }

  // Handle keyboard navigation
  React.useEffect(() => {
    if (!lightboxOpen) return
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') prevPhoto()
      if (e.key === 'ArrowRight') nextPhoto()
      if (e.key === 'Escape') closeLightbox()
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [lightboxOpen])

  if (!album) {
    return (
      <div className="space-y-6">
      <PageSeo pageKey="gallery/album" />
        <Link
          to="/explore/gallery"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-primary transition-colors font-sans"
        >
          <ArrowLeft size={14} /> Back to Gallery
        </Link>
        <div className="text-center py-20">
          <Camera size={48} className="mx-auto mb-4 text-slate-200" />
          <h3 className="font-display font-bold text-xl text-slate-700">Album Not Found</h3>
          <p className="text-sm text-slate-400 mt-2">This album doesn't exist or may have been removed.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Back Link & Header */}
      <div>
        <Link
          to="/explore/gallery"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-primary transition-colors mb-4 font-sans"
        >
          <ArrowLeft size={14} /> Back to Gallery
        </Link>

        <div className="border-b border-slate-200 pb-5">
          <span className="text-[10px] uppercase font-bold tracking-widest text-accent block mb-1">
            {album.category}
          </span>
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="text-2xl md:text-3xl font-display font-bold text-primary">{album.title}</h2>
              <div className="w-12 h-0.5 bg-accent mt-2 mb-3" />
              <p className="text-sm text-slate-500 font-medium font-sans">{album.description}</p>
            </div>
            <button className="shrink-0 p-2 rounded-lg border border-slate-200 hover:border-accent/40 text-slate-500 hover:text-accent transition-all">
              <Share2 size={15} />
            </button>
          </div>
          <div className="flex items-center gap-5 mt-3">
            <div className="flex items-center gap-1.5 text-[11px] text-slate-400 font-medium">
              <Camera size={12} className="text-accent" />
              {album.photos.length} photographs
            </div>
            <div className="flex items-center gap-1.5 text-[11px] text-slate-400 font-medium">
              <Calendar size={12} className="text-accent" />
              {new Date(album.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
            </div>
          </div>
        </div>
      </div>

      {/* Photo Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {album.photos.map((photo, i) => (
          <div
            key={i}
            onClick={() => openLightbox(i)}
            className="group relative aspect-[4/3] bg-slate-100 rounded-lg overflow-hidden border border-slate-200 shadow-sm hover:border-accent/40 hover:shadow-md transition-all duration-200 cursor-pointer"
          >
            <img
              src={photo}
              alt={`${album.title} — Photo ${i + 1}`}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            {/* Overlay */}
            <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/40 transition-all duration-300 flex items-center justify-center">
              <div className="w-10 h-10 rounded-full bg-white/0 group-hover:bg-white/90 flex items-center justify-center transition-all duration-300 scale-75 group-hover:scale-100">
                <ZoomIn size={18} className="text-primary opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
              </div>
            </div>
            {/* Photo number */}
            <div className="absolute bottom-2 right-2 bg-black/50 text-white text-[10px] font-bold px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity">
              {i + 1}/{album.photos.length}
            </div>
          </div>
        ))}
      </div>

      {/* Lightbox Modal */}
      {lightboxOpen && album.photos[currentIndex] && (
        <div
          className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center"
          onClick={closeLightbox}
        >
          {/* Close button */}
          <button
            onClick={closeLightbox}
            className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors z-10"
          >
            <X size={20} />
          </button>

          {/* Counter */}
          <div className="absolute top-5 left-1/2 -translate-x-1/2 text-white/70 text-xs font-bold tracking-wider">
            {currentIndex + 1} / {album.photos.length}
          </div>

          {/* Prev Button */}
          <button
            onClick={(e) => { e.stopPropagation(); prevPhoto() }}
            className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 hover:bg-white/25 text-white flex items-center justify-center transition-colors z-10"
          >
            <ChevronLeft size={24} />
          </button>

          {/* Image */}
          <img
            src={album.photos[currentIndex]}
            alt={`${album.title} — Photo ${currentIndex + 1}`}
            className="max-w-[88vw] max-h-[85vh] object-contain rounded-lg shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          />

          {/* Next Button */}
          <button
            onClick={(e) => { e.stopPropagation(); nextPhoto() }}
            className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 hover:bg-white/25 text-white flex items-center justify-center transition-colors z-10"
          >
            <ChevronRight size={24} />
          </button>

          {/* Caption */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-center">
            <p className="text-white/80 text-sm font-medium">{album.title}</p>
            <p className="text-white/50 text-xs mt-0.5">Photo {currentIndex + 1} of {album.photos.length}</p>
          </div>

          {/* Thumbnail strip */}
          <div className="absolute bottom-16 left-1/2 -translate-x-1/2 flex gap-1.5 max-w-[80vw] overflow-x-auto pb-1">
            {album.photos.map((p, i) => (
              <div
                key={i}
                onClick={(e) => { e.stopPropagation(); setCurrentIndex(i) }}
                className={`w-10 h-10 shrink-0 rounded overflow-hidden cursor-pointer border-2 transition-all ${
                  i === currentIndex ? 'border-accent scale-110' : 'border-white/20 hover:border-white/60'
                }`}
              >
                <img src={p} alt="" className="w-full h-full object-cover" />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default AlbumPage
