import React, { useState, useEffect } from 'react'
import { brandingService } from '../../services/brandingService'

const Preloader: React.FC = () => {
  const [activeIconIndex, setActiveIconIndex] = useState(0)
  const [isVisible, setIsVisible] = useState(() => {
    // Skip if already shown in this browser session
    const shown = sessionStorage.getItem('preloader_shown')
    if (shown === 'true') {
      return false
    }
    return true
  })
  const [isFadingOut, setIsFadingOut] = useState(false)

  // 1. Array of images cycling through the official logo and the four custom SVGs from public/svgs/
  const icons = [
    // 1. Official SGSITS Logo
    () => (
      <img 
        src="/assets/image.png" 
        className="w-18 h-18 sm:w-22 sm:h-22 object-contain animate-pulse" 
        alt="SGSITS Logo" 
      />
    ),
    // 2. Education Learning SVG 2
    () => (
      <img 
        src="/svgs/education-learning-2-svgrepo-com.svg" 
        className="w-18 h-18 sm:w-22 sm:h-22 object-contain" 
        alt="Education Icon 2" 
      />
    ),
    // 3. Education Learning SVG 23
    () => (
      <img 
        src="/svgs/education-learning-23-svgrepo-com.svg" 
        className="w-18 h-18 sm:w-22 sm:h-22 object-contain" 
        alt="Education Icon 23" 
      />
    ),
    // 4. Education Learning SVG 24
    () => (
      <img 
        src="/svgs/education-learning-24-svgrepo-com.svg" 
        className="w-18 h-18 sm:w-22 sm:h-22 object-contain" 
        alt="Education Icon 24" 
      />
    ),
    // 5. Education Learning SVG 28
    () => (
      <img 
        src="/svgs/education-learning-28-svgrepo-com (1).svg" 
        className="w-18 h-18 sm:w-22 sm:h-22 object-contain" 
        alt="Education Icon 28" 
      />
    )
  ]

  // 2. Cycle active icon index every 450ms
  useEffect(() => {
    const cycleInterval = setInterval(() => {
      setActiveIconIndex((prev) => (prev + 1) % icons.length)
    }, 450)

    return () => clearInterval(cycleInterval)
  }, [icons.length])

  // 3. Fade out after 2.8 seconds, complete unmount after 3.5 seconds
  useEffect(() => {
    if (!isVisible) return

    // Set sessionStorage flag on mount so it doesn't show again in this session
    sessionStorage.setItem('preloader_shown', 'true')

    // Fetch dynamic branding config to check if admin has disabled the preloader
    let active = true
    brandingService.getBranding().then((config) => {
      if (!active) return
      if (config.preloaderEnabled === false) {
        setIsVisible(false)
      }
    }).catch(err => {
      console.error('Failed to load branding preloader config:', err)
    })

    const fadeTimer = setTimeout(() => {
      setIsFadingOut(true)
    }, 2800)

    const destroyTimer = setTimeout(() => {
      setIsVisible(false)
    }, 3500)

    return () => {
      active = false
      clearTimeout(fadeTimer)
      clearTimeout(destroyTimer)
    }
  }, [isVisible])

  // Immediate dismiss action
  const handleDismiss = () => {
    setIsFadingOut(true)
    setTimeout(() => {
      setIsVisible(false)
    }, 600)
  }

  if (!isVisible) return null

  return (
    <div
      className={`fixed inset-0 z-[99999] flex flex-col items-center justify-center bg-white text-[#0b2545] select-none transition-all duration-700 ease-in-out ${
        isFadingOut ? 'opacity-0 scale-105 pointer-events-none' : 'opacity-100 scale-100'
      }`}
    >
      {/* 1. Custom CSS keyframe rules inside component for perfect encapsulation */}
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes preloaderProgressBar {
          0% { transform: translateX(-100%); }
          50% { transform: translateX(0%); }
          100% { transform: translateX(100%); }
        }
        .animate-preloader-bar {
          animation: preloaderProgressBar 2s cubic-bezier(0.4, 0, 0.2, 1) infinite;
        }
      `}} />

      {/* 2. Main Visual Center Container */}
      <div className="flex flex-col items-center justify-center px-6 text-center max-w-lg">
        {/* Custom Circular Ring Frame */}
        <div className="relative w-28 h-28 sm:w-32 sm:h-32 flex items-center justify-center rounded-full p-2 border border-[#0b2545]/10 bg-slate-50/50">
          
          {/* Pulsing glow ring */}
          <div className="absolute inset-0 rounded-full animate-ping bg-[#0b2545] opacity-5" style={{ animationDuration: '3s' }}></div>

          {/* Render icons stacked absolutely, cycling opacity and scale */}
          {icons.map((IconComponent, idx) => {
            const isActive = idx === activeIconIndex
            return (
              <div
                key={idx}
                className={`absolute inset-0 flex items-center justify-center p-4 transition-all duration-300 transform ${
                  isActive
                    ? 'opacity-100 scale-100 rotate-0'
                    : 'opacity-0 scale-75 rotate-12 pointer-events-none'
                }`}
              >
                <IconComponent />
              </div>
            )
          })}
        </div>

        {/* College Name & Prestige Details */}
        <h1 className="mt-8 text-lg sm:text-xl font-extrabold tracking-[0.12em] uppercase font-sans text-[#0b2545]">
          Shri G. S. Institute of Technology and Science
        </h1>
        
        {/* Estd separator */}
        <div className="flex items-center gap-2 mt-2.5">
          <span className="h-[1px] w-6 bg-[#0b2545]/20"></span>
          <p className="text-xs sm:text-sm font-bold tracking-[0.2em] text-[#bfa15f] uppercase">
            Indore • Estd. 1952
          </p>
          <span className="h-[1px] w-6 bg-[#0b2545]/20"></span>
        </div>

        {/* Dynamic subtag */}
        <p className="mt-3 text-[10px] sm:text-xs tracking-wider uppercase font-medium text-slate-500 max-w-xs leading-relaxed">
          70+ Years of Academic Excellence & Technological Innovation
        </p>

        {/* Premium linear loader bar */}
        <div className="w-40 sm:w-48 h-[2px] rounded-full mt-8 overflow-hidden relative bg-[#0b2545]/10">
          <div className="absolute inset-y-0 left-0 w-1/2 rounded-full animate-preloader-bar bg-[#0b2545]"></div>
        </div>
      </div>

      {/* 3. Bottom Skip Toolbar (Only Skip, no Mode selector) */}
      <div className="absolute bottom-6 right-6 flex justify-end text-[11px] sm:text-xs">
        <button
          onClick={handleDismiss}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-[#0b2545]/10 text-[#0b2545]/80 hover:bg-[#0b2545]/5 hover:text-[#0b2545] font-semibold tracking-wider uppercase transition-all duration-200 cursor-pointer"
        >
          Hide Preloader
        </button>
      </div>
    </div>
  )
}

export default Preloader
