import React, { useState } from 'react'
import PageSeo from '../../components/global/PageSeo'
import { Play, Video, Monitor, Dumbbell, FlaskConical, ExternalLink } from 'lucide-react'

const MAIN_VIDEO_ID = 'dQw4w9WgXcQ'

const highlights = [
  {
    icon: FlaskConical,
    title: 'Modern Laboratories',
    desc: 'State-of-the-art labs across all departments — CAD/CAM center, high-performance computing cluster, IoT lab, and material testing facilities.',
    color: 'bg-[#0b2545]/5 border-[#0b2545]/15',
    iconColor: 'text-[#0b2545]',
  },
  {
    icon: Monitor,
    title: 'Beautiful Campus',
    desc: 'Spread across 52 acres in the heart of Indore, SGSITS features lush green gardens, heritage architecture, and modern academic blocks.',
    color: 'bg-[#bfa15f]/15 border-[#bfa15f]/30',
    iconColor: 'text-[#bfa15f]',
  },
  {
    icon: Dumbbell,
    title: 'Sports Facilities',
    desc: 'Dedicated sports complex with cricket ground, basketball court, volleyball, badminton, athletics track, and an indoor gymnasium.',
    color: 'bg-[#bfa15f]/5 border-[#bfa15f]/20',
    iconColor: 'text-[#bfa15f]',
  },
]

const tourStops = [
  {
    title: 'Main Academic Building',
    desc: 'The iconic heritage structure housing the administrative and key academic departments.',
    img: 'https://picsum.photos/seed/mainbldg/400/250',
    videoId: MAIN_VIDEO_ID,
  },
  {
    title: 'Central Library',
    desc: 'Fully digitized library with 80,000+ books, e-journals, and silent study zones.',
    img: 'https://picsum.photos/seed/library2024/400/250',
    videoId: MAIN_VIDEO_ID,
  },
  {
    title: 'Computer Center',
    desc: 'High-speed networking, server infrastructure, and 24×7 computing resources.',
    img: 'https://picsum.photos/seed/ccenter/400/250',
    videoId: MAIN_VIDEO_ID,
  },
  {
    title: 'Hostel & Campus Life',
    desc: 'Modern residential blocks, mess, common rooms, and recreational facilities for students.',
    img: 'https://picsum.photos/seed/hostellife/400/250',
    videoId: MAIN_VIDEO_ID,
  },
]

const VideoTourPage: React.FC = () => {
  const [activeStop, setActiveStop] = useState<number | null>(null)

  return (
    <div className="space-y-10">
      <PageSeo pageKey="explore/video-tour" />
      {/* Header */}
      <div className="border-b border-slate-200 pb-6">
        <span className="text-[10px] uppercase font-bold tracking-widest text-accent block mb-1.5">Explore SGSITS</span>
        <h2 className="text-3xl md:text-4xl font-display font-bold text-primary">Campus Video Tour</h2>
        <div className="w-16 h-0.5 bg-accent mt-2 mb-3" />
        <p className="text-sm text-slate-500 font-sans font-medium max-w-xl">
          Take a virtual tour of SGSITS Indore — explore our campus, facilities, and vibrant student life from anywhere in the world.
        </p>
      </div>

      {/* Intro paragraph */}
      <div className="border-l-4 border-accent pl-5">
        <p className="text-sm text-slate-700 leading-relaxed font-sans">
          Experience the beauty and infrastructure of <strong>Shri G. S. Institute of Technology & Science</strong> through
          our curated campus videos. From the grand main academic building and central library to annual technical festivals,
          convocation ceremonies, and sports events — discover SGSITS from anywhere in the world.
        </p>
      </div>

      {/* Featured Main Video */}
      <div>
        <span className="text-[10px] uppercase font-bold tracking-widest text-accent block mb-3">Featured Tour</span>
        <div className="rounded-2xl border border-slate-200 overflow-hidden shadow-lg group">
          <div className="aspect-video bg-slate-900">
            <iframe
              src={`https://www.youtube.com/embed/${MAIN_VIDEO_ID}?rel=0&modestbranding=1`}
              title="SGSITS Campus Virtual Tour"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="w-full h-full"
            />
          </div>
          <div className="p-5 bg-white border-t border-slate-100">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center shrink-0">
                <Play size={16} className="text-accent fill-accent" />
              </div>
              <div>
                <span className="text-[10px] bg-primary/5 text-primary border border-primary/10 px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider">
                  Campus Overview
                </span>
                <h3 className="font-display font-bold text-slate-900 text-base mt-1.5">SGSITS Campus — Official Virtual Tour 2024</h3>
                <p className="text-sm text-slate-500 font-medium mt-1 leading-relaxed">
                  A comprehensive walkthrough of the sprawling 52-acre SGSITS campus — main building, academic departments,
                  hostel complexes, library, sports complex, and research facilities.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Feature Highlights */}
      <div>
        <span className="text-[10px] uppercase font-bold tracking-widest text-accent block mb-1">Campus Highlights</span>
        <h3 className="text-xl font-display font-bold text-slate-900 mb-4">What Makes SGSITS Special</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {highlights.map((h) => {
            const Icon = h.icon
            return (
              <div key={h.title} className={`rounded-xl border p-5 ${h.color} hover:shadow-md transition-all duration-200`}>
                <div className={`w-10 h-10 rounded-lg bg-white flex items-center justify-center mb-3 shadow-sm`}>
                  <Icon size={20} className={h.iconColor} />
                </div>
                <h4 className="font-display font-bold text-primary text-sm mb-2">{h.title}</h4>
                <p className="text-xs text-slate-600 font-medium leading-relaxed font-sans">{h.desc}</p>
              </div>
            )
          })}
        </div>
      </div>

      {/* Virtual Tour Stops */}
      <div>
        <span className="text-[10px] uppercase font-bold tracking-widest text-accent block mb-1">Virtual Tour</span>
        <h3 className="text-xl font-display font-bold text-slate-900 mb-4">Explore Key Locations</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {tourStops.map((stop, i) => (
            <div
              key={stop.title}
              className="group rounded-xl overflow-hidden border border-slate-200 hover:border-accent/40 hover:shadow-md transition-all duration-200 cursor-pointer bg-white"
              onClick={() => setActiveStop(i === activeStop ? null : i)}
            >
              <div className="relative h-32 overflow-hidden bg-slate-100">
                <img
                  src={stop.img}
                  alt={stop.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-primary/20 group-hover:bg-primary/10 transition-colors flex items-center justify-center">
                  <div className="w-9 h-9 rounded-full bg-white/90 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <Play size={14} className="text-primary fill-primary ml-0.5" />
                  </div>
                </div>
              </div>
              <div className="p-3">
                <h4 className="font-bold text-xs text-primary font-sans leading-snug mb-1">{stop.title}</h4>
                <p className="text-[10px] text-slate-500 leading-relaxed">{stop.desc}</p>
              </div>
            </div>
          ))}
        </div>

        {activeStop !== null && (
          <div className="mt-4 rounded-xl border border-slate-200 overflow-hidden shadow-md">
            <div className="aspect-video">
              <iframe
                src={`https://www.youtube.com/embed/${tourStops[activeStop].videoId}?rel=0`}
                title={tourStops[activeStop].title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-full"
              />
            </div>
            <div className="p-4 bg-white flex items-center justify-between">
              <div>
                <h4 className="font-bold text-sm text-primary">{tourStops[activeStop].title}</h4>
                <p className="text-xs text-slate-500 mt-0.5">{tourStops[activeStop].desc}</p>
              </div>
              <button onClick={() => setActiveStop(null)} className="text-xs text-slate-400 hover:text-primary font-medium">
                Close
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Subscribe Banner */}
      <div className="bg-primary text-white rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-[#bfa15f] flex items-center justify-center shrink-0">
            <Video size={24} className="text-white" />
          </div>
          <div>
            <h4 className="font-bold font-display text-base">Follow SGSITS on YouTube</h4>
            <p className="text-sm text-slate-300 font-sans mt-0.5">Subscribe to stay updated with campus events, lectures, and achievements</p>
          </div>
        </div>
        <a
          href="https://www.youtube.com/@sgsitsindore"
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-2 bg-[#bfa15f] hover:bg-[#bfa15f]/90 text-white px-5 py-2.5 rounded-xl text-xs font-bold transition-colors shrink-0"
        >
          <ExternalLink size={14} />
          Subscribe Now
        </a>
      </div>
    </div>
  )
}

export default VideoTourPage
