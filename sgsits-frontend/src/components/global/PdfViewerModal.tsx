import React, { useState, useEffect } from 'react'
import { X, Download, Loader2, ExternalLink } from 'lucide-react'

interface PdfViewerModalProps {
  isOpen: boolean
  onClose: () => void
  pdfUrl: string
  title: string
}

const PdfViewerModal: React.FC<PdfViewerModalProps> = ({
  isOpen,
  onClose,
  pdfUrl,
  title
}) => {
  const [isLoading, setIsLoading] = useState(true)

  // Resolve relative backend URLs (e.g., /uploads/...)
  const backendBase = (import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api').replace(/\/api$/, '')
  const resolvedUrl = pdfUrl.startsWith('/') ? `${backendBase}${pdfUrl}` : pdfUrl

  // Reset loading state when the URL changes
  useEffect(() => {
    if (isOpen) {
      setIsLoading(true)
    }
  }, [resolvedUrl, isOpen])

  // Prevent background scroll and register Escape key listener
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
      
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          onClose()
        }
      }
      
      window.addEventListener('keydown', handleKeyDown)
      
      return () => {
        document.body.style.overflow = ''
        window.removeEventListener('keydown', handleKeyDown)
      }
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    <div 
      className="fixed inset-0 z-[100] flex items-center justify-center bg-[#0b2545]/75 backdrop-blur-md p-4 transition-all duration-300 animate-fadeIn"
      onClick={onClose}
    >
      <div 
        className="relative w-full max-w-5xl h-[85vh] bg-white rounded-lg border border-slate-200 flex flex-col shadow-2xl overflow-hidden animate-scaleIn"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Bar */}
        <div className="flex items-center justify-between px-4 py-3 bg-[#0b2545] text-white border-b border-slate-200">
          <div className="flex-1 min-w-0 pr-4">
            <h3 className="text-sm font-bold font-sans truncate" title={title}>
              {title}
            </h3>
          </div>
          
          <div className="flex items-center gap-2 shrink-0">
            {/* Direct Open in New Tab (For mobile or alternative rendering) */}
            <a 
              href={resolvedUrl} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="p-1.5 hover:bg-white/10 rounded transition-colors text-slate-300 hover:text-white"
              title="Open in new tab"
            >
              <ExternalLink className="w-4 h-4" />
            </a>

            {/* Manual Download Override */}
            <a 
              href={resolvedUrl} 
              download 
              className="p-1.5 hover:bg-white/10 rounded transition-colors text-slate-300 hover:text-white"
              title="Download Document"
            >
              <Download className="w-4 h-4" />
            </a>

            <div className="w-px h-5 bg-white/20 mx-1"></div>

            {/* Close Button */}
            <button 
              onClick={onClose} 
              className="p-1.5 hover:bg-white/10 rounded transition-colors text-slate-300 hover:text-white"
              title="Close viewer (Esc)"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Content Viewer Body */}
        <div className="relative flex-1 bg-slate-50 flex flex-col overflow-hidden">
          {/* Loading Indicator */}
          {isLoading && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-50 z-10 space-y-3">
              <Loader2 className="w-8 h-8 text-[#bfa15f] animate-spin" />
              <p className="text-xs text-slate-500 font-semibold font-sans">
                Loading document preview...
              </p>
            </div>
          )}

          {/* PDF iframe */}
          <iframe 
            src={`${resolvedUrl}#toolbar=1`}
            title={title}
            className={`w-full h-full border-none transition-opacity duration-300 ${
              isLoading ? 'opacity-0' : 'opacity-100'
            }`}
            onLoad={() => setIsLoading(false)}
          />

          {/* Simple Mobile Helper Bar at bottom */}
          <div className="bg-slate-100 border-t border-slate-200 px-4 py-2 flex items-center justify-between text-[11px] text-slate-500 font-medium font-sans shrink-0">
            <span>Trouble viewing? Use the download button at top right.</span>
            <a 
              href={resolvedUrl} 
              download
              className="text-[#bfa15f] hover:text-[#a88a4c] font-bold hover:underline"
            >
              Download PDF
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PdfViewerModal
