import React, { useState } from 'react'
import PageSeo from '../../components/global/PageSeo'

const FeedbackPage: React.FC = () => {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [subject, setSubject] = useState('')
  const [message, setMessage] = useState('')

  return (
    <div className="space-y-8">
      <PageSeo pageKey="policy/feedback" />
      <div className="border-b border-gray-200 pb-4">
        <h2 className="text-2xl md:text-3xl font-bold" style={{ color: 'var(--color-primary)' }}>Feedback</h2>
        <p className="text-sm text-gray-500 mt-1">We value your feedback to improve our website</p>
      </div>
      <form className="space-y-4 max-w-lg" onSubmit={e => e.preventDefault()}>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
          <input type="text" value={name} onChange={e => setName(e.target.value)} className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2" placeholder="Your name" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
          <input type="email" value={email} onChange={e => setEmail(e.target.value)} className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2" placeholder="your@email.com" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
          <input type="text" value={subject} onChange={e => setSubject(e.target.value)} className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2" placeholder="Feedback subject" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
          <textarea value={message} onChange={e => setMessage(e.target.value)} rows={5} className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2" placeholder="Your feedback..." />
        </div>
        <button type="submit" className="px-6 py-2.5 text-white text-sm font-semibold rounded-lg transition-colors hover:opacity-90" style={{ backgroundColor: 'var(--color-primary)' }}>
          Submit Feedback
        </button>
      </form>
    </div>
  )
}

export default FeedbackPage
