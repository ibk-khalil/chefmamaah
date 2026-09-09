import { Quote } from 'lucide-react'

export default function TestimonialCard({ quote }) {
  return (
    <div className="bg-cream-soft rounded-lg p-8 h-full flex flex-col">
      <Quote size={28} className="text-champagne mb-4" />
      <p className="text-charcoal-text leading-relaxed flex-1">{quote}</p>
    </div>
  )
}
