import { Check } from 'lucide-react'
import Button from './Button.jsx'

export default function ClassCard({ name, price, duration, popular, features, ctaHref, compact = false }) {
  return (
    <div
      className={`relative rounded-lg border p-8 flex flex-col ${
        popular ? 'border-charcoal-deep shadow-sm' : 'border-cream-light'
      } bg-white`}
    >
      {popular && (
        <span className="absolute -top-3 left-8 bg-charcoal-deep text-white text-xs font-medium px-3 py-1 rounded-full">
          Most Popular
        </span>
      )}
      <h3 className="font-heading font-semibold text-xl">{name}</h3>
      <p className="mt-3 text-3xl font-heading font-bold">{price}</p>
      <p className="text-sm text-grey-medium mt-1">{duration}</p>

      {!compact && (
        <ul className="mt-6 space-y-3 flex-1">
          {features.map((f) => (
            <li key={f} className="flex items-start gap-2 text-sm text-charcoal-text">
              <Check size={16} className="mt-0.5 text-champagne shrink-0" />
              {f}
            </li>
          ))}
        </ul>
      )}

      <Button as="a" href={ctaHref} target="_blank" rel="noopener noreferrer" variant={popular ? 'primary' : 'secondary'} className="mt-8 w-full">
        View Class Details
      </Button>
    </div>
  )
}
