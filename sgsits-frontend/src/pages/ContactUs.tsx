import React, { useState, useEffect } from 'react'
import { MapPin, Phone, Mail, Clock, Send, CheckCircle2, ChevronDown } from 'lucide-react'
import PageSeo from '../components/global/PageSeo'
import { contactService, contactDefault, type ContactData } from '../services/contactService'

type SubjectKey = 'Admissions' | 'Academics' | 'Faculty' | 'Admin' | 'Placement' | 'Other'
const subjects: SubjectKey[] = ['Admissions', 'Academics', 'Faculty', 'Admin', 'Placement', 'Other']

interface FormData {
  name: string
  email: string
  phone: string
  subject: SubjectKey | ''
  message: string
}

const ContactUs: React.FC = () => {
  const [contactData, setContactData] = useState<ContactData>(contactDefault)
  const [form, setForm] = useState<FormData>({ name: '', email: '', phone: '', subject: '', message: '' })
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    contactService.getContactData().then(setContactData)
  }, [])

  // Build info cards dynamically from contactData
  const infoCards = [
    {
      icon: MapPin,
      title: 'Visit Us',
      color: 'bg-[#0b2545]/5 border-[#0b2545]/20',
      iconColor: 'text-[#0b2545] bg-[#0b2545]/10',
      items: [
        contactData.instituteName,
        contactData.address,
        `${contactData.city}, ${contactData.state} — ${contactData.pincode}, India`,
      ],
    },
    {
      icon: Phone,
      title: 'Call Us',
      color: 'bg-[#bfa15f]/10 border-[#bfa15f]/30',
      iconColor: 'text-[#bfa15f] bg-[#bfa15f]/15',
      items: contactData.offices.slice(0, 4).map(o => `${o.phone} — ${o.title}`),
    },
    {
      icon: Mail,
      title: 'Write to Us',
      color: 'bg-[#0b2545]/10 border-[#0b2545]/25',
      iconColor: 'text-[#0b2545] bg-[#0b2545]/15',
      items: contactData.offices.slice(0, 4).map(o => o.email),
    },
  ]

  // Build helplines from offices
  const helplines = contactData.offices.map(o => ({
    dept: o.title,
    person: o.name,
    phone: o.phone,
    email: o.email,
  }))

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      setSubmitted(true)
    }, 1200)
  }

  return (
    <div className="min-h-screen bg-white">
      <PageSeo pageKey="contact" />
      {/* Hero Banner */}
      <div className="relative bg-primary overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-72 h-72 bg-accent rounded-full -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-accent rounded-full translate-y-1/2 -translate-x-1/2" />
        </div>
        <div className="relative max-w-6xl mx-auto px-6 py-14 text-center">
          <div className="flex items-center justify-center gap-2 mb-3">
            <span className="h-px w-8 bg-accent" />
            <span className="text-[11px] uppercase font-bold tracking-widest text-accent font-sans">Get in Touch</span>
            <span className="h-px w-8 bg-accent" />
          </div>
          <h1 className="text-3xl md:text-5xl font-display font-bold text-white mb-3">Contact Us</h1>
          <p className="text-slate-300 text-base font-sans max-w-xl mx-auto">
            Reach out to SGSITS Indore — we're here to help with admissions, academics, placements, and more.
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-12 space-y-14">

        {/* Info Cards */}
        <div className="grid sm:grid-cols-3 gap-6 -mt-8 relative z-10">
          {infoCards.map((card) => (
            <div key={card.title} className={`border-2 ${card.color} rounded-xl p-6 bg-white shadow-md`}>
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${card.iconColor} mb-4`}>
                <card.icon size={18} />
              </div>
              <h3 className="font-display font-bold text-primary text-lg mb-3">{card.title}</h3>
              <ul className="space-y-1.5">
                {card.items.map((item, i) => (
                  <li key={i} className="text-sm text-slate-700 font-sans leading-relaxed">{item}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Contact Form + Map */}
        <div className="grid md:grid-cols-2 gap-10">
          {/* Contact Form */}
          <div>
            <span className="text-[11px] uppercase font-bold tracking-widest text-accent block mb-2">Send a Message</span>
            <h2 className="text-2xl font-display font-bold text-primary mb-6">We'd love to hear from you</h2>

            {submitted ? (
              <div className="bg-[#bfa15f]/10 border-2 border-[#bfa15f]/30 rounded-xl p-8 text-center">
                <div className="w-14 h-14 bg-[#bfa15f]/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle2 size={28} className="text-[#bfa15f]" />
                </div>
                <h3 className="font-display font-bold text-[#0b2545] text-xl mb-2">Message Sent Successfully!</h3>
                <p className="text-[#0b2545] text-sm font-sans leading-relaxed">
                  Thank you for reaching out, <strong>{form.name}</strong>. Our team will get back to you at{' '}
                  <strong>{form.email}</strong> within 1–2 working days.
                </p>
                <button
                  onClick={() => { setSubmitted(false); setForm({ name: '', email: '', phone: '', subject: '', message: '' }) }}
                  className="mt-5 text-sm font-bold text-[#bfa15f] underline hover:no-underline"
                >
                  Send another message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wide">Full Name *</label>
                    <input
                      type="text"
                      name="name"
                      required
                      value={form.name}
                      onChange={handleChange}
                      placeholder="Your full name"
                      className="w-full border border-slate-300 rounded-lg px-3.5 py-2.5 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wide">Email Address *</label>
                    <input
                      type="email"
                      name="email"
                      required
                      value={form.email}
                      onChange={handleChange}
                      placeholder="you@example.com"
                      className="w-full border border-slate-300 rounded-lg px-3.5 py-2.5 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors"
                    />
                  </div>
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wide">Phone Number</label>
                    <input
                      type="tel"
                      name="phone"
                      value={form.phone}
                      onChange={handleChange}
                      placeholder="+91 98765 43210"
                      className="w-full border border-slate-300 rounded-lg px-3.5 py-2.5 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wide">Subject *</label>
                    <div className="relative">
                      <select
                        name="subject"
                        required
                        value={form.subject}
                        onChange={handleChange}
                        className="w-full border border-slate-300 rounded-lg px-3.5 py-2.5 text-sm text-slate-800 appearance-none focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors bg-white"
                      >
                        <option value="">Select subject...</option>
                        {subjects.map(s => <option key={s} value={s}>{s}</option>)}
                      </select>
                      <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                    </div>
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wide">Message *</label>
                  <textarea
                    name="message"
                    required
                    rows={5}
                    value={form.message}
                    onChange={handleChange}
                    placeholder="Write your message here..."
                    className="w-full border border-slate-300 rounded-lg px-3.5 py-2.5 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors resize-none"
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-primary text-white py-3 rounded-lg font-bold text-sm flex items-center justify-center gap-2 hover:bg-primary/90 transition-colors disabled:opacity-70"
                >
                  {loading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send size={15} /> Send Message
                    </>
                  )}
                </button>
              </form>
            )}
          </div>

          {/* Map */}
          <div>
            <span className="text-[11px] uppercase font-bold tracking-widest text-accent block mb-2">Find Us</span>
            <h2 className="text-2xl font-display font-bold text-primary mb-5">{contactData.instituteName.split('(')[0].trim()}, {contactData.city}</h2>
            <div className="rounded-xl overflow-hidden border-2 border-slate-200 shadow-md mb-5" style={{ height: '320px' }}>
              <iframe
                src={contactData.mapEmbedUrl}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title={`${contactData.instituteName} Location Map`}
              />
            </div>
            {/* Office Hours */}
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-5">
              <div className="flex items-center gap-2 mb-4">
                <Clock size={16} className="text-accent" />
                <h3 className="font-bold text-primary">Office Hours</h3>
              </div>
              <div className="space-y-2">
                {[
                  { day: 'Monday – Friday', time: '9:30 AM – 5:30 PM', open: true },
                  { day: 'Saturday', time: '9:30 AM – 1:00 PM', open: true },
                  { day: 'Sunday & Public Holidays', time: 'Closed', open: false },
                ].map((h) => (
                  <div key={h.day} className="flex items-center justify-between text-sm">
                    <span className="text-slate-600 font-medium">{h.day}</span>
                    <span className={`font-semibold ${h.open ? 'text-primary' : 'text-[#bfa15f]'}`}>{h.time}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Department Helpline Table */}
        <div>
          <span className="text-[11px] uppercase font-bold tracking-widest text-accent block mb-2">Quick Contacts</span>
          <h2 className="text-2xl font-display font-bold text-primary mb-6">Department-wise Helplines</h2>
          <div className="overflow-x-auto rounded-xl border border-slate-200 shadow-sm">
            <table className="w-full text-sm font-sans">
              <thead>
                <tr className="bg-primary text-white">
                  <th className="text-left px-5 py-3 font-bold text-xs uppercase tracking-wide">Department / Office</th>
                  <th className="text-left px-5 py-3 font-bold text-xs uppercase tracking-wide">Contact Person</th>
                  <th className="text-left px-5 py-3 font-bold text-xs uppercase tracking-wide">Phone</th>
                  <th className="text-left px-5 py-3 font-bold text-xs uppercase tracking-wide">Email</th>
                </tr>
              </thead>
              <tbody>
                {helplines.map((h, i) => (
                  <tr key={h.dept} className={i % 2 === 0 ? 'bg-white' : 'bg-slate-50'}>
                    <td className="px-5 py-3.5 font-semibold text-primary">{h.dept}</td>
                    <td className="px-5 py-3.5 text-slate-600">{h.person}</td>
                    <td className="px-5 py-3.5">
                      <a href={`tel:${h.phone.replace(/-/g, '')}`} className="text-accent-blue hover:underline font-medium">{h.phone}</a>
                    </td>
                    <td className="px-5 py-3.5">
                      <a href={`mailto:${h.email}`} className="text-accent-blue hover:underline">{h.email}</a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  )
}

export default ContactUs
