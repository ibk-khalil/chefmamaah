import PageHeader from '../components/PageHeader.jsx'
import { Check } from 'lucide-react'
import Button from '../components/Button.jsx'
import { waLink, WA_MESSAGES } from '../lib/whatsapp.js'

const INCLUSIONS = [
  '50+ curated recipes',
  'Continental & African cuisines',
  'Mocktail creation & beverage presentation',
  'Desserts & pastries — cakes, tarts & plated sweets',
  'Bread making — artisanal & everyday bread techniques',
  'Additional essential culinary skills',
  'Certificate of Completion',
  "Chef's apron",
  'Instalment payment available',
]

const PLANS = [
  {
    name: 'General Culinary Class',
    price: '₦250,000',
    duration: '2 Weeks',
    location: 'Gwarinpa Extension, Abuja',
    popular: false,
    whatsapp: WA_MESSAGES.general,
    image: '/images/gallery/event-01.jpeg',
  },
  {
    name: 'Private Culinary Class',
    price: '₦400,000',
    duration: '1 Week',
    location: 'Gwarinpa Extension, Abuja',
    popular: false,
    whatsapp: WA_MESSAGES.private,
    image: '/images/gallery/event-02.jpeg',
  },
]

export default function Classes() {
  return (
    <>
      <PageHeader title="Culinary Classes" crumb="Home / Culinary Classes" />

      <section className="max-w-content mx-auto px-5 md:px-8 py-8 md:py-16">
        <div className="rounded-lg overflow-hidden">
          <img
            src="/images/classes-flyer.png"
            alt="FoodWorld Culinary Classes flyer showing course details, pricing, and enrollment information"
            className="w-full h-auto"
          />
        </div>
      </section>

      <section className="max-w-content mx-auto px-5 md:px-8 py-16 md:py-24">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <h2 className="text-3xl md:text-4xl font-bold">Two Ways to Learn</h2>
          <p className="mt-4 text-charcoal-text/80 leading-relaxed">
            Whichever path you choose, you'll leave with practical skills, a rich recipe
            collection, and a Certificate of Completion from Chef Maamah.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {PLANS.map((plan) => (
            <div
              key={plan.name}
              className={`relative rounded-lg border overflow-hidden flex flex-col bg-white ${
                plan.popular ? 'border-charcoal-deep shadow-sm' : 'border-cream-light'
              }`}
            >
              {plan.popular && (
                <span className="absolute z-10 top-4 left-4 bg-charcoal-deep text-white text-xs font-medium px-3 py-1 rounded-full">
                  Most Popular
                </span>
              )}

              <img
                src={plan.image}
                alt={`${plan.name} flyer showing fees, duration, and what's included`}
                className="w-full h-48 md:h-56 object-cover object-top"
              />

              <div className="p-8 md:p-10 flex flex-col flex-1">
                <h3 className="font-heading font-semibold text-2xl">{plan.name}</h3>
                <p className="mt-3 text-4xl font-heading font-bold">{plan.price}</p>
                <p className="text-sm text-grey-medium mt-1">
                  {plan.duration} · {plan.location}
                </p>

                <ul className="mt-8 space-y-3 flex-1">
                  {INCLUSIONS.map((item) => (
                    <li key={item} className="flex items-start gap-2 text-sm text-charcoal-text">
                      <Check size={16} className="mt-0.5 text-champagne shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>

                <Button
                  as="a"
                  href={waLink(plan.whatsapp)}
                  target="_blank"
                  rel="noopener noreferrer"
                  variant={plan.popular ? 'primary' : 'secondary'}
                  icon
                  className="mt-10 w-full"
                >
                  Enrol Now on WhatsApp
                </Button>
              </div>
            </div>
          ))}
        </div>

        <p className="text-center text-sm text-grey-medium mt-10 max-w-xl mx-auto">
          Have questions about batch dates or instalment plans? Reach out on WhatsApp and Chef
          Maamah's team will guide you through enrolment.
        </p>
      </section>
    </>
  )
}
