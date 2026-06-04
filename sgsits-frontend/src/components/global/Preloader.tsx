import React, { useState, useEffect } from 'react'
import { brandingService } from '../../services/brandingService'
import { useAppStore } from '../../store/appStore'

const Preloader: React.FC = () => {
  const markAppReady = useAppStore(s => s.markAppReady)

  const [activeIconIndex, setActiveIconIndex] = useState(0)
  // Always visible on mount — React only mounts App on hard refresh/first load, not SPA navigation.
  const [isVisible, setIsVisible] = useState(true)
  const [isFadingOut, setIsFadingOut] = useState(false)

  const icons = [
    () => (
      <img
        src="/assets/image.png"
        className="w-18 h-18 sm:w-22 sm:h-22 object-contain animate-pulse"
        alt="SGSITS Logo"
      />
    ),
    () => (
      <img
        src="/svgs/education-learning-2-svgrepo-com.svg"
        className="w-18 h-18 sm:w-22 sm:h-22 object-contain"
        alt="Education Icon 2"
      />
    ),
    () => (
      <img
        src="/svgs/education-learning-23-svgrepo-com.svg"
        className="w-18 h-18 sm:w-22 sm:h-22 object-contain"
        alt="Education Icon 23"
      />
    ),
    () => (
      <img
        src="/svgs/education-learning-24-svgrepo-com.svg"
        className="w-18 h-18 sm:w-22 sm:h-22 object-contain"
        alt="Education Icon 24"
      />
    ),
    () => (
      <img
        src="/svgs/education-learning-28-svgrepo-com (1).svg"
        className="w-18 h-18 sm:w-22 sm:h-22 object-contain"
        alt="Education Icon 28"
      />
    ),
  ]

  // Cycle active icon every 450ms
  useEffect(() => {
    const id = setInterval(() => {
      setActiveIconIndex(prev => (prev + 1) % icons.length)
    }, 450)
    return () => clearInterval(id)
  // icons.length is always 5 — this is effectively []
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // API-driven lifecycle: complete as soon as branding responds AND ≥1s has passed.
  // Fallback: hard cap at 2s if branding API never responds.
  useEffect(() => {
    let active = true
    let minElapsed = false
    let apiDone = false

    const triggerDismiss = () => {
      if (!active) return
      setIsFadingOut(true)
      setTimeout(() => {
        if (!active) return
        setIsVisible(false)
        markAppReady()
      }, 400)
    }

    brandingService.getBranding().then(config => {
      if (!active) return
      if (config.preloaderEnabled === false) {
        setIsVisible(false)
        markAppReady()
        return
      }
      apiDone = true
      if (minElapsed) triggerDismiss()
    }).catch(() => {
      if (!active) return
      apiDone = true
      if (minElapsed) triggerDismiss()
    })

    // Minimum 1s of branding display — then dismiss if API is already done
    const minTimer = setTimeout(() => {
      minElapsed = true
      if (apiDone) triggerDismiss()
    }, 1000)

    // Hard cap: never wait more than 2s regardless of API
    const capTimer = setTimeout(() => {
      triggerDismiss()
    }, 2000)

    return () => {
      active = false
      clearTimeout(minTimer)
      clearTimeout(capTimer)
    }
  }, [markAppReady])

  const handleDismiss = () => {
    setIsFadingOut(true)
    setTimeout(() => {
      setIsVisible(false)
      markAppReady()
    }, 600)
  }

  if (!isVisible) return null

  return (
    <div
      className={`fixed inset-0 z-[99999] flex flex-col items-center justify-center bg-white text-primary select-none transition-all duration-700 ease-in-out ${
        isFadingOut ? 'opacity-0 scale-105 pointer-events-none' : 'opacity-100 scale-100'
      }`}
    >
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes preloaderProgressBar {
          0% { transform: translateX(-100%); }
          50% { transform: translateX(0%); }
          100% { transform: translateX(100%); }
        }
        .animate-preloader-bar {
          animation: preloaderProgressBar 2s cubic-bezier(0.4, 0, 0.2, 1) infinite;
        }
      ` }} />

      <div className="flex flex-col items-center justify-center px-6 text-center max-w-lg">
        <div className="relative w-28 h-28 sm:w-32 sm:h-32 flex items-center justify-center rounded-full p-2 border border-primary/10 bg-slate-50/50">
          <div className="absolute inset-0 rounded-full animate-ping bg-primary opacity-5" style={{ animationDuration: '3s' }} />

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

        <h1 className="mt-8 text-lg sm:text-xl font-extrabold tracking-[0.12em] uppercase font-sans text-primary">
          Shri G. S. Institute of Technology and Science
        </h1>

        <div className="flex items-center gap-2 mt-2.5">
          <span className="h-[1px] w-6 bg-primary/20" />
          <p className="text-xs sm:text-sm font-bold tracking-[0.2em] text-accent uppercase">
            Indore • Estd. 1952
          </p>
          <span className="h-[1px] w-6 bg-primary/20" />
        </div>

        <p className="mt-3 text-xs sm:text-xs tracking-wider uppercase font-medium text-slate-500 max-w-xs leading-relaxed">
          70+ Years of Academic Excellence &amp; Technological Innovation
        </p>

        <div className="w-40 sm:w-48 h-[2px] rounded-full mt-8 overflow-hidden relative bg-primary/10">
          <div className="absolute inset-y-0 left-0 w-1/2 rounded-full animate-preloader-bar bg-primary" />
        </div>
      </div>

      <div className="absolute bottom-6 right-6 flex justify-end text-xs sm:text-xs">
        <button
          onClick={handleDismiss}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-primary/10 text-primary/80 hover:bg-primary/5 hover:text-primary font-semibold tracking-wider uppercase transition-all duration-200 cursor-pointer"
        >
          Hide Preloader
        </button>
      </div>
    </div>
  )
}

export default Preloader
