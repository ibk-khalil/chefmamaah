import { ChefHat, Utensils, Award, BookOpen } from 'lucide-react'
import Button from '../components/Button.jsx'
import ClassCard from '../components/ClassCard.jsx'
import TestimonialCard from '../components/TestimonialCard.jsx'
import { waLink, WA_MESSAGES } from '../lib/whatsapp.js'

const WHY = [
  { icon: BookOpen, label: '50+ Curated Recipes' },
  { icon: Utensils, label: 'Continental & African Cuisines' },
  { icon: ChefHat, label: 'Hands-On Training' },
  { icon: Award, label: 'Certificate of Completion' },
]

const TESTIMONIALS = [
  "Kinsan ni ba komi ne yake mun dadi amma nata ko wani irin nan banjinba samsam. Dassi.sosai ssosai. Excellent",
  "I've received it. I really liked it honestly speaking, it tastes really good 😋😋😋. I'm coming back soon to order for more",
  "Wow wow wow, wlhy ban taba cin shawarma mai dadi irin naki ba, hasbunAllah. Pls I want if you are making today",
  "Omo the taste is mad. Abi nxt time i shu come and help you with washing plates 👀",
]

export default function Home() {
  return (
    <>
      {/* HERO */}
      <section className="relative bg-charcoal-deep text-white min-h-[70vh] md:min-h-[90vh] flex items-center">
        {/* Blurred chef background */}
        <div className="absolute inset-0 z-0">
          <img
            src="/images/hero-photo.png"
            alt=""
            className="w-full h-full object-cover"
            aria-hidden="true"
          />
          <div className="absolute inset-0 bg-charcoal-deep/60" aria-hidden="true" />
        </div>
        
        <div className="max-w-content mx-auto px-5 md:px-8 py-24 md:py-36 relative z-10">
          <div className="max-w-2xl">
            <p className="uppercase tracking-widest text-xs text-black font-medium mb-4">
              Culinary Education · Gwarinpa Extension, Abuja
            </p>
            <h1 className="text-4xl md:text-5xl font-bold leading-tight text-indigo-50">
              Master the Art of Cooking
            </h1>
            <p className="mt-6 text-black text-lg leading-relaxed max-w-md">
              Learn from a professionally trained chef through hands-on culinary classes, expert
              techniques, and a rich blend of African and continental flavours.
            </p>
            <div className="mt-10 flex flex-wrap gap-4">
              <Button as="a" href="/classes" variant="primary" className="!bg-white !text-charcoal-deep hover:!bg-cream-soft">
                Explore Culinary Classes
              </Button>
              <Button as="a" href="/about" variant="secondary" className="!border-white !text-slate-900 hover:!bg-white/10">
                Meet Chef Maamah
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* INTRODUCTION */}
      <section className="max-w-content mx-auto px-5 md:px-8 py-20 md:py-28 text-center">
        <h2 className="text-3xl md:text-4xl font-bold max-w-2xl mx-auto">
          Where Passion Meets the Plate
        </h2>
        <p className="mt-6 text-charcoal-text/80 max-w-2xl mx-auto leading-relaxed">
          FoodWorld is built around passion, creativity, culinary education, and growth. Every
          class is an invitation to explore the culinary world, sharpen your skills, and discover
          the beauty and diversity of food.
        </p>
        <Button as="a" href="/about" variant="ghost" className="mt-6">
          Discover Our Story
        </Button>
      </section>

      {/* WHY FOODWORLD */}
      <section className="bg-cream-soft py-20 md:py-28">
        <div className="max-w-content mx-auto px-5 md:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-center max-w-xl mx-auto">
            More Than Just Cooking
          </h2>
          <div className="mt-14 grid grid-cols-2 md:grid-cols-4 gap-8">
            {WHY.map(({ icon: Icon, label }) => (
              <div key={label} className="flex flex-col items-center text-center gap-3">
                <Icon size={28} className="text-champagne" strokeWidth={1.5} />
                <p className="text-sm font-medium">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CLASSES PREVIEW */}
      <section className="max-w-content mx-auto px-5 md:px-8 py-20 md:py-28">
        <h2 className="text-3xl md:text-4xl font-bold text-center max-w-xl mx-auto">
          Choose Your Culinary Journey
        </h2>
        <div className="mt-14 grid md:grid-cols-2 gap-8 max-w-3xl mx-auto">
          <ClassCard
            name="General Culinary Class"
            price="₦250,000"
            duration="2 Weeks"
            popular
            compact
            features={[]}
            ctaHref="/classes"
          />
          <ClassCard
            name="Private Culinary Class"
            price="₦400,000"
            duration="1 Week"
            compact
            features={[]}
            ctaHref="/classes"
          />
        </div>
      </section>

      {/* MEET CHEF MAAMAH */}
      <section className="bg-cream-soft py-20 md:py-28">
        <div className="max-w-content mx-auto px-5 md:px-8 grid md:grid-cols-2 gap-12 items-center">
          <div className="aspect-square rounded-lg overflow-hidden order-2 md:order-1">
            <img src="/images/chef-portrait.png" alt="Chef Maamah (Mrs. Maryam Bello) smiling in chef attire" className="w-full h-full object-cover" />
          </div>
          <div className="order-1 md:order-2">
            <h2 className="text-3xl md:text-4xl font-bold">Meet Chef Maamah</h2>
            <p className="mt-2 font-heading font-semibold text-champagne">Mrs. Maryam Bello</p>
            <p className="mt-6 text-charcoal-text/80 leading-relaxed">
              A professionally trained chef, culinary coach, and passionate food enthusiast,
              dedicated to helping students discover their own creativity in the culinary world.
            </p>
            <Button as="a" href="/about" variant="secondary" className="mt-8">
              Read Her Story
            </Button>
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="max-w-content mx-auto px-5 md:px-8 py-20 md:py-28">
        <h2 className="text-3xl md:text-4xl font-bold text-center max-w-xl mx-auto">
          What Our Customers Say
        </h2>
        <div className="mt-14 grid md:grid-cols-2 gap-6">
          {TESTIMONIALS.map((t) => (
            <TestimonialCard key={t} quote={t} />
          ))}
        </div>
      </section>

      {/* GALLERY PREVIEW */}
      <section className="bg-cream-soft py-20 md:py-28">
        <div className="max-w-content mx-auto px-5 md:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-center max-w-xl mx-auto">
            A Taste of FoodWorld
          </h2>
          <div className="mt-14 grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: 'Signature Dishes', src: '/images/gallery/dish-04.jpeg' },
              { label: 'Baked & Pastries', src: '/images/gallery/dish-05.jpeg' },
              { label: 'Sweet Treats', src: '/images/gallery/behind-scenes-01.jpeg' },
              { label: 'Class Offers', src: '/images/gallery/event-01.jpeg' },
            ].map(({ label, src }) => (
              <a
                key={label}
                href="/gallery"
                className="group relative aspect-square rounded-lg overflow-hidden border border-cream-light block"
              >
                <img
                  src={src}
                  alt={label}
                  loading="lazy"
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-charcoal-deep/70 via-transparent to-transparent" />
                <p className="absolute bottom-0 left-0 right-0 p-4 text-xs font-medium text-white">{label}</p>
              </a>
            ))}
          </div>
          <div className="text-center mt-10">
            <Button as="a" href="/gallery" variant="secondary">
              View Gallery
            </Button>
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="bg-charcoal-deep text-white py-20 md:py-28 text-center">
        <div className="max-w-2xl mx-auto px-5">
          <h2 className="text-3xl md:text-4xl text-white font-bold">Ready to Begin Your Culinary Journey?</h2>
          <p className="mt-6 text-grey-medium leading-relaxed">
            Reach out on WhatsApp to enquire about upcoming batches and enrol in a class that fits
            your schedule.
          </p>
          <Button
            as="a"
            href={waLink(WA_MESSAGES.general_link_default)}
            target="_blank"
            rel="noopener noreferrer"
            variant="primary"
            icon
            className="mt-8 !bg-white !text-charcoal-deep hover:!bg-cream-soft"
          >
            Chat on WhatsApp
          </Button>
        </div>
      </section>
    </>
  )
}
