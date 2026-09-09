import { useState } from 'react'
import PageHeader from '../components/PageHeader.jsx'
import Button from '../components/Button.jsx'
import { MapPin, MessageCircle, Instagram } from 'lucide-react'
import { waLink, WA_MESSAGES } from '../lib/whatsapp.js'

export default function Contact() {
  const [status, setStatus] = useState('idle') // idle | submitting | success | error
  const [form, setForm] = useState({ name: '', email: '', phone: '', message: '' })

  function handleChange(e) {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }))
  }

  function handleSubmit(e) {
    e.preventDefault()
    if (!form.name || !form.email || !form.message) {
      setStatus('error')
      return
    }
    // Wiring to a real backend/email service happens during the Supabase/integration phase.
    setStatus('success')
  }

  return (
    <>
      <PageHeader title="Contact" crumb="Home / Contact" />

      <section className="max-w-content mx-auto px-5 md:px-8 py-16 md:py-24 grid md:grid-cols-2 gap-14">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold">Get in Touch</h2>
          <p className="mt-4 text-charcoal-text/80 leading-relaxed">
            Reach out with any questions about our culinary classes, batches, or enrolment. The
            fastest way to reach us is WhatsApp.
          </p>

          <ul className="mt-8 space-y-5 text-sm">
            <li className="flex items-center gap-3">
              <MapPin size={18} className="text-champagne" /> Gwarinpa Extension, Abuja, Nigeria
            </li>
            <li className="flex items-center gap-3">
              <MessageCircle size={18} className="text-champagne" /> 0810 092 3070
            </li>
            <li className="flex items-center gap-3">
              <Instagram size={18} className="text-champagne" /> @___thefoodworld
            </li>
          </ul>

          <Button
            as="a"
            href={waLink(WA_MESSAGES.general_link_default)}
            target="_blank"
            rel="noopener noreferrer"
            variant="primary"
            icon
            className="mt-8"
          >
            Chat on WhatsApp
          </Button>

          <div className="mt-10 aspect-video rounded-lg bg-cream-soft border border-cream-light flex items-center justify-center text-grey-medium text-sm">
            Map — Gwarinpa Extension, Abuja placeholder
          </div>
        </div>

        <form onSubmit={handleSubmit} className="bg-cream-soft rounded-lg p-8 space-y-5">
          <div>
            <label htmlFor="name" className="block text-sm font-medium mb-2">Full Name</label>
            <input
              id="name"
              name="name"
              value={form.name}
              onChange={handleChange}
              className="focus-ring w-full rounded border border-cream-light bg-white px-4 py-3 text-sm"
              placeholder="Your full name"
            />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium mb-2">Email Address</label>
            <input
              id="email"
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              className="focus-ring w-full rounded border border-cream-light bg-white px-4 py-3 text-sm"
              placeholder="you@example.com"
            />
          </div>
          <div>
            <label htmlFor="phone" className="block text-sm font-medium mb-2">Phone Number</label>
            <input
              id="phone"
              name="phone"
              value={form.phone}
              onChange={handleChange}
              className="focus-ring w-full rounded border border-cream-light bg-white px-4 py-3 text-sm"
              placeholder="080..."
            />
          </div>
          <div>
            <label htmlFor="message" className="block text-sm font-medium mb-2">Message</label>
            <textarea
              id="message"
              name="message"
              rows={4}
              value={form.message}
              onChange={handleChange}
              className="focus-ring w-full rounded border border-cream-light bg-white px-4 py-3 text-sm"
              placeholder="How can we help?"
            />
          </div>

          {status === 'error' && (
            <p className="text-sm text-red-600">Please fill in your name, email, and message.</p>
          )}
          {status === 'success' && (
            <p className="text-sm text-green-700">Thanks — your message has been received.</p>
          )}

          <Button type="submit" variant="primary" className="w-full">
            Send Message
          </Button>
        </form>
      </section>
    </>
  )
}
