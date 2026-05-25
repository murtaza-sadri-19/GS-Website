import React, { useState, useEffect } from 'react'
import PageSeo from '../../components/global/PageSeo'
import { Link } from 'react-router-dom'
import { Image as ImageIcon, Calendar, ChevronRight, Camera, Filter } from 'lucide-react'
import { getGalleryAlbums } from '../../services/mediaService'

const CATEGORIES = ['All', 'Technical Fest', 'Cultural', 'Sports', 'Convocation', 'Campus', 'Social']

const PhotoGalleryPage: React.FC = () => {
  const [albums, setAlbums] = useState<any[]>([])
  useEffect(() => { getGalleryAlbums().then(setAlbums).catch(() => {}) }, [])
  const [activeCategory, setActiveCategory] = useState('All')

  const filtered = activeCategory === 'All'
    ? albums
    : albums.filter(a => a.category === activeCategory)

  const totalPhotos = albums.reduce((sum, a) => sum + a.photos.length, 0)

  return (
    <div className="space-y-8">
      <PageSeo pageKey="explore/gallery" />
      {/* Page Header */}
      <div className="border-b border-slate-200 pb-6">
        <span className="text-[10px] uppercase font-bold tracking-widest text-accent block mb-1.5">Visual Archive</span>
        <h2 className="text-3xl md:text-4xl font-display font-bold text-primary">
          Photo Gallery
        </h2>
        <div className="w-16 h-0.5 bg-accent mt-2 mb-3" />
        <p className="text-sm text-slate-500 font-sans font-medium max-w-xl">
          Multi-hued reflections of life at SGSITS — campus, academics, culture, sports, and community across seven decades.
        </p>
      </div>

      {/* Stats Bar */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { value: albums.length.toString(), label: 'Albums', icon: ImageIcon },
          { value: `${totalPhotos}+`, label: 'Photographs', icon: Camera },
          { value: '70+', label: 'Years of Legacy', icon: Calendar },
        ].map((stat) => {
          const Icon = stat.icon
          return (
            <div key={stat.label} className="bg-white rounded-lg border border-slate-200 p-5 text-center shadow-sm hover:shadow-md hover:border-accent/30 transition-all">
              <div className="w-10 h-10 rounded-full bg-primary/5 flex items-center justify-center mx-auto mb-2">
                <Icon size={18} className="text-accent" strokeWidth={1.75} />
              </div>
              <p className="text-2xl font-display font-bold text-primary">{stat.value}</p>
              <p className="text-[10px] uppercase tracking-wider font-bold text-slate-400 mt-1 font-sans">{stat.label}</p>
            </div>
          )
        })}
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 flex-wrap">
        <Filter size={14} className="text-slate-400 mr-1" />
        {CATEGORIES.map(cat => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all duration-200 border ${
              activeCategory === cat
                ? 'bg-primary text-white border-primary shadow-sm'
                : 'bg-white text-slate-600 border-slate-200 hover:border-primary/40 hover:text-primary'
            }`}
          >
            {cat}
          </button>
        ))}
        <span className="ml-auto text-[11px] text-slate-400 font-medium">{filtered.length} albums</span>
      </div>

      {/* Albums Grid */}
      {filtered.length === 0 ? (
        <div className="text-center py-16 text-slate-400">
          <ImageIcon size={40} className="mx-auto mb-3 opacity-30" />
          <p className="font-medium">No albums in this category yet.</p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
          {filtered.map((album) => (
            <Link
              key={album.id}
              to={`/explore/gallery/${album.id}`}
              className="bg-white rounded-xl overflow-hidden border border-slate-200 shadow-sm hover:border-accent/40 hover:shadow-lg transition-all duration-300 group flex flex-col"
            >
              {/* Cover Image */}
              <div className="h-52 bg-slate-100 overflow-hidden relative shrink-0">
                <img
                  src={album.coverImage}
                  alt={album.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                {/* Photo Count Badge */}
                <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm text-primary text-[10px] font-bold px-2.5 py-1 rounded-full border border-white/50 flex items-center gap-1">
                  <Camera size={10} />
                  {album.photos.length} photos
                </div>
                {/* Category Badge */}
                <div className="absolute top-3 left-3 bg-primary/80 backdrop-blur-sm text-white text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">
                  {album.category}
                </div>
                {/* Date on image */}
                <div className="absolute bottom-3 left-3 flex items-center gap-1 text-white/90 text-[10px] font-medium">
                  <Calendar size={10} />
                  {new Date(album.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                </div>
              </div>

              {/* Content */}
              <div className="p-4 flex-grow flex flex-col">
                <h3 className="font-display font-bold text-sm text-slate-800 group-hover:text-primary transition-colors mb-1.5 leading-snug">
                  {album.title}
                </h3>
                <p className="text-[11px] text-slate-500 font-medium font-sans leading-relaxed flex-grow">
                  {album.description}
                </p>
                <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[11px] text-slate-400 font-medium">{album.photos.length} photographs</span>
                  <span className="inline-flex items-center gap-1 text-accent text-[11px] font-bold group-hover:gap-2 transition-all">
                    Browse <ChevronRight size={12} />
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}

      {/* Bottom Banner */}
      <div className="bg-primary rounded-xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h4 className="font-display font-bold text-white text-base">Contribute to Our Gallery</h4>
          <p className="text-slate-300 text-sm font-sans mt-1">Share your SGSITS photos with the alumni and student community</p>
        </div>
        <a
          href="mailto:media@sgsits.ac.in"
          className="inline-flex items-center gap-2 bg-accent text-primary px-5 py-2.5 rounded-lg text-xs font-bold hover:bg-accent/90 transition-colors shrink-0"
        >
          <Camera size={14} />
          Submit Photos
        </a>
      </div>
    </div>
  )
}

export default PhotoGalleryPage
