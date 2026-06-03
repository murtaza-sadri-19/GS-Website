import React, { useState } from 'react'
import { C } from './homeConstants'

interface FaqItemProps {
  question: string
  answer?: string | null
  contact?: { name: string; phone: string; email: string } | null
  defaultOpen?: boolean
}

const FaqItem: React.FC<FaqItemProps> = ({ question, answer, contact, defaultOpen = false }) => {
  const [open, setOpen] = useState(defaultOpen)
  return (
    <div
      className="py-3 cursor-pointer select-none border-b"
      style={{ borderColor: C.navy10 }}
      onClick={() => setOpen(!open)}
    >
      <div className="flex items-start gap-3">
        <span
          className="shrink-0 w-5 h-5 flex items-center justify-center text-white text-xs font-bold mt-0.5 transition-colors"
          style={{ backgroundColor: open ? C.gold : C.navy }}
        >
          {open ? '−' : '+'}
        </span>
        <p className="text-sm font-semibold leading-snug" style={{ color: C.navy }}>{question}</p>
      </div>
      {open && (
        <div className="ml-8 mt-2 space-y-1">
          {answer && (
            <p className="text-sm leading-relaxed" style={{ color: C.navy70 }}>{answer}</p>
          )}
          {contact && (
            <div className="text-sm space-y-0.5" style={{ color: C.navy75 }}>
              <p className="font-semibold" style={{ color: C.navy }}>{contact.name}</p>
              <p>📞 {contact.phone}</p>
              <p>
                ✉{' '}
                <a href={`mailto:${contact.email}`} className="underline" style={{ color: C.gold }}>
                  {contact.email}
                </a>
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default FaqItem
