import React, { useState } from 'react'
import PageSeo from '../../components/global/PageSeo'
import { Play, Pause, Volume2, VolumeX, SkipBack, SkipForward, Music, Award } from 'lucide-react'

const stanzas = [
  {
    hindi: 'ज्ञान की ज्योत जलाएं हम,\nहर पल आगे बढ़ते जाएं हम।\nSGSITS का नाम रोशन करें,\nदेश की सेवा का संकल्प लें।',
    english: 'We shall light the lamp of knowledge,\nForward we march every moment.\nWe shall illuminate the name of SGSITS,\nWe pledge to serve our nation.',
  },
  {
    hindi: 'पार्क रोड की शान हैं हम,\nइंदौर की मान हैं हम।\nसात दशक की विरासत लेकर,\nउत्कृष्टता की राह पे चलते हैं।',
    english: 'We are the pride of Park Road,\nWe are the honor of Indore.\nCarrying seven decades of legacy,\nWe walk the path of excellence.',
  },
  {
    hindi: 'विज्ञान, तकनीक, अनुसंधान से,\nहम जग को नई दिशा देंगे।\nएकता, अनुशासन, समर्पण से,\nनई ऊंचाइयाँ हम पाएंगे।',
    english: 'Through science, technology, and research,\nWe shall show the world a new path.\nThrough unity, discipline, and dedication,\nWe shall reach new heights.',
  },
  {
    hindi: 'गोविंदराम जी के सपनों का संस्थान,\nहम हैं इसकी अमर पहचान।\nआओ मिलकर संकल्प करें,\nSGSITS को गौरवशाली बनाएं।',
    english: 'The institution of Govindram Ji\'s dreams,\nWe are its eternal identity.\nCome, let us resolve together,\nTo make SGSITS glorious.',
  },
]

const instrumentalNotes = [
  { note: 'Sa', freq: 'C4', desc: 'Root note — represents foundation' },
  { note: 'Re', freq: 'D4', desc: 'Rising hope and aspiration' },
  { note: 'Ga', freq: 'E4', desc: 'Knowledge and wisdom' },
  { note: 'Ma', freq: 'F4', desc: 'Stability of character' },
  { note: 'Pa', freq: 'G4', desc: 'Progress and achievement' },
  { note: 'Dha', freq: 'A4', desc: 'Glory and recognition' },
  { note: 'Ni', freq: 'B4', desc: 'Eternal excellence' },
]

const AnthemPage: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [progress, setProgress] = useState(23)
  const [volume, setVolume] = useState(80)
  const [activeStanza, setActiveStanza] = useState<number | null>(null)

  return (
    <div className="space-y-10">
      <PageSeo pageKey="explore/anthem" />
      {/* Page Header */}
      <div className="border-b border-slate-200 pb-6">
        <span className="text-[10px] uppercase font-bold tracking-widest text-accent block mb-1.5">Institute Heritage</span>
        <h2 className="text-3xl md:text-4xl font-display font-bold text-primary">SGSITS Anthem</h2>
        <div className="w-16 h-0.5 bg-accent mt-2 mb-3" />
        <p className="text-sm text-slate-500 font-sans font-medium">
          गर्व, परंपरा और उत्कृष्टता का गान — A song of pride, tradition, and excellence
        </p>
      </div>

      {/* Anthem Info Card */}
      <div className="bg-primary rounded-2xl p-6 text-white">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-16 h-16 rounded-2xl bg-accent/20 border border-accent/30 flex items-center justify-center">
            <Music size={28} className="text-accent" />
          </div>
          <div>
            <h3 className="font-display font-bold text-xl">SGSITS Kulgeet</h3>
            <p className="text-accent text-sm font-medium mt-0.5">संस्थान गीत — Institute Anthem</p>
            <p className="text-white/60 text-xs mt-1">Composed in 2001 • Duration: 3:42 • Raga: Yaman Kalyan</p>
          </div>
        </div>

        {/* Visual Audio Player */}
        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/10">
          {/* Waveform Visual */}
          <div className="flex items-center gap-0.5 h-10 mb-4 justify-center">
            {Array.from({ length: 48 }).map((_, i) => {
              const h = isPlaying
                ? Math.sin(i * 0.4 + Date.now() / 500) * 15 + 18
                : [8, 14, 20, 16, 10, 18, 24, 12, 8, 16, 20, 14, 10, 18, 8, 22, 16, 10, 20, 14, 18, 12, 24, 16, 8, 18, 20, 12, 16, 10, 22, 14, 8, 20, 16, 10, 18, 12, 24, 14, 8, 16, 20, 10, 18, 12, 14, 8][i]
              const filled = (i / 48) * 100 < progress
              return (
                <div
                  key={i}
                  className={`w-1 rounded-full transition-all ${filled ? 'bg-accent' : 'bg-white/30'}`}
                  style={{ height: `${h}px` }}
                />
              )
            })}
          </div>

          {/* Progress Bar */}
          <div className="mb-3">
            <div className="w-full bg-white/20 rounded-full h-1.5 cursor-pointer" onClick={(e) => {
              const rect = e.currentTarget.getBoundingClientRect()
              setProgress(Math.round(((e.clientX - rect.left) / rect.width) * 100))
            }}>
              <div
                className="bg-accent h-1.5 rounded-full transition-all relative"
                style={{ width: `${progress}%` }}
              >
                <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-white shadow-md" />
              </div>
            </div>
            <div className="flex justify-between text-[10px] text-white/50 mt-1">
              <span>{Math.floor(progress * 3.42 / 100)}:{String(Math.floor((progress * 342 / 100) % 60)).padStart(2, '0')}</span>
              <span>3:42</span>
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsMuted(!isMuted)}
                className="w-7 h-7 flex items-center justify-center text-white/70 hover:text-white transition-colors"
              >
                {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
              </button>
              <div className="w-16 bg-white/20 rounded-full h-1 cursor-pointer" onClick={(e) => {
                const rect = e.currentTarget.getBoundingClientRect()
                setVolume(Math.round(((e.clientX - rect.left) / rect.width) * 100))
              }}>
                <div className="bg-white/70 h-1 rounded-full" style={{ width: `${isMuted ? 0 : volume}%` }} />
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setProgress(Math.max(0, progress - 10))}
                className="w-8 h-8 flex items-center justify-center text-white/70 hover:text-white transition-colors"
              >
                <SkipBack size={18} />
              </button>
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className="w-12 h-12 rounded-full bg-accent flex items-center justify-center text-primary hover:bg-accent/90 transition-colors shadow-lg"
              >
                {isPlaying ? <Pause size={20} fill="currentColor" /> : <Play size={20} fill="currentColor" className="ml-0.5" />}
              </button>
              <button
                onClick={() => setProgress(Math.min(100, progress + 10))}
                className="w-8 h-8 flex items-center justify-center text-white/70 hover:text-white transition-colors"
              >
                <SkipForward size={18} />
              </button>
            </div>

            <div className="text-[10px] text-white/50 w-20 text-right">
              {isPlaying ? 'Playing...' : 'Paused'}
            </div>
          </div>
        </div>

        {/* Composer Info */}
        <div className="grid grid-cols-3 gap-3 mt-4">
          {[
            { label: 'Lyrics', value: 'Dr. R.K. Sharma' },
            { label: 'Composition', value: 'Pt. Ravi Shankar Das' },
            { label: 'Vocals', value: 'Smt. Kavita Krishnamurthy' },
          ].map(info => (
            <div key={info.label} className="bg-white/10 rounded-lg p-3 text-center">
              <p className="text-[10px] text-white/50 uppercase tracking-wider font-bold">{info.label}</p>
              <p className="text-xs text-white font-semibold mt-1">{info.value}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Lyrics Section */}
      <div>
        <span className="text-[10px] uppercase font-bold tracking-widest text-accent block mb-1">Lyrics</span>
        <h3 className="text-xl font-display font-bold text-slate-900 mb-4">Anthem Lyrics — संस्थान गीत</h3>

        <div className="space-y-4">
          {stanzas.map((stanza, i) => (
            <div
              key={i}
              className={`rounded-xl border p-5 cursor-pointer transition-all duration-200 ${
                activeStanza === i
                  ? 'border-accent/40 bg-[#bfa15f]/10 shadow-md'
                  : 'border-slate-200 bg-white hover:border-accent/30 hover:bg-slate-50'
              }`}
              onClick={() => setActiveStanza(activeStanza === i ? null : i)}
            >
              <div className="flex items-start gap-4">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 font-display font-bold text-sm ${
                  activeStanza === i ? 'bg-accent text-primary' : 'bg-primary/5 text-accent'
                }`}>
                  {i + 1}
                </div>
                <div className="flex-grow">
                  <p className="text-sm text-slate-800 font-sans leading-relaxed whitespace-pre-line">
                    {stanza.hindi}
                  </p>
                  {activeStanza === i && (
                    <div className="mt-3 pt-3 border-t border-slate-200">
                      <p className="text-xs text-slate-500 font-medium leading-relaxed italic whitespace-pre-line font-sans">
                        {stanza.english}
                      </p>
                    </div>
                  )}
                  {activeStanza !== i && (
                    <p className="text-[10px] text-slate-400 mt-2 font-medium">Click to see translation</p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Instrumental Notes */}
      <div>
        <span className="text-[10px] uppercase font-bold tracking-widest text-accent block mb-1">Musical Notes</span>
        <h3 className="text-xl font-display font-bold text-slate-900 mb-4">Instrumental Composition</h3>
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
          <p className="text-sm text-slate-600 font-sans mb-4 leading-relaxed">
            The anthem is composed in <strong>Raga Yaman Kalyan</strong>, a classical Hindustani raga associated with devotion,
            peace, and elevated thoughts — perfectly capturing the spirit of SGSITS. The melody employs all seven swaras in ascending order.
          </p>
          <div className="grid grid-cols-7 gap-2">
            {instrumentalNotes.map((note) => (
              <div key={note.note} className="text-center">
                <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center mx-auto font-display font-bold text-sm mb-1.5">
                  {note.note}
                </div>
                <p className="text-[9px] text-accent font-bold">{note.freq}</p>
                <p className="text-[8px] text-slate-400 mt-0.5 leading-tight">{note.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Significance */}
      <div className="bg-slate-50 border border-slate-200 rounded-xl p-6">
        <div className="flex items-center gap-3 mb-4">
          <Award size={20} className="text-accent" />
          <h3 className="font-display font-bold text-primary text-lg">Significance of the Anthem</h3>
        </div>
        <div className="grid md:grid-cols-2 gap-4">
          {[
            { title: 'Heritage', text: 'Composed in 2001 to mark the Golden Jubilee of SGSITS, the anthem has been sung at every convocation and institute day since its inception.' },
            { title: 'Values', text: 'The lyrics encapsulate the core values of SGSITS — pursuit of knowledge, discipline, national service, and institutional pride.' },
            { title: 'Tradition', text: 'Every graduating batch learns the anthem and it is performed at major events, creating an emotional bond among students, faculty, and alumni.' },
            { title: 'Recognition', text: 'The anthem has been performed at the IIT-organized National Technical Symposium, earning recognition beyond the institute.' },
          ].map(item => (
            <div key={item.title} className="flex gap-3">
              <div className="w-1.5 h-1.5 rounded-full bg-accent mt-2 shrink-0" />
              <div>
                <p className="text-xs font-bold text-primary font-sans">{item.title}</p>
                <p className="text-xs text-slate-600 font-medium leading-relaxed mt-0.5">{item.text}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default AnthemPage
