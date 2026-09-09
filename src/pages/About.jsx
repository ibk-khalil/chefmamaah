import PageHeader from '../components/PageHeader.jsx'
import Button from '../components/Button.jsx'
import { waLink, WA_MESSAGES } from '../lib/whatsapp.js'

const STORY_PARAGRAPHS = [
  "FoodWorld began with a simple passion for cooking and a desire to create meaningful experiences through food.",
  "My name is Mrs. Maryam Bello, a professionally trained chef, culinary coach, and passionate food enthusiast. I have always been fascinated by the art of cooking from experimenting with recipes and exploring different cuisines to teaching others and helping them discover their own creativity in the culinary world.",
  "What started as a personal passion around 2020 has grown into a journey that continues to inspire and excite me every day.",
  "After completing my culinary training, I took the next step in my journey by creating The Global Palate in 2025, bringing together my love for diverse flavours, culinary creativity, and professional cooking. Since then, the journey has been incredibly rewarding, and I am grateful for every person who has been part of it.",
  "Today, FoodWorld represents more than just food. It is a platform built around culinary education, creativity, passion, and growth. Through our work, we aim to inspire people to explore the culinary world, develop their skills, and appreciate the beauty and diversity of food.",
  "As we look ahead, we are excited to take an even bigger step expanding our vision, reaching more people, and creating greater opportunities within the culinary space.",
  "This is only the beginning.",
]

export default function About() {
  return (
    <>
      <PageHeader title="About Us" crumb="Home / About" />

      <section className="max-w-content mx-auto px-5 md:px-8 py-16 md:py-24 grid md:grid-cols-2 gap-14 items-start">
        <div className="aspect-[4/5] rounded-lg overflow-hidden md:sticky md:top-28">
          <img src="/images/chef-portrait.png" alt="Chef Maamah (Mrs. Maryam Bello) smiling in chef attire" className="w-full h-full object-cover" />
        </div>

        <div>
          <p className="uppercase tracking-widest text-xs text-champagne font-medium mb-4">
            Passion · Creativity · Culinary Excellence
          </p>
          <h2 className="text-3xl md:text-4xl font-bold leading-tight">
            Welcome to FoodWorld, where passion meets the plate
          </h2>
          <div className="mt-8 space-y-5 text-charcoal-text/85 leading-relaxed">
            {STORY_PARAGRAPHS.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>
        </div>
      </section>

      {/* MISSION / VISION */}
      <section className="bg-cream-soft py-16 md:py-24">
        <div className="max-w-content mx-auto px-5 md:px-8 grid md:grid-cols-2 gap-8">
          <div className="bg-white rounded-lg p-8 border border-cream-light">
            <h3 className="font-heading font-semibold text-xl">Our Mission</h3>
            <p className="mt-4 text-charcoal-text/80 leading-relaxed">
              To inspire people to explore the culinary world, develop practical skills, and
              appreciate the beauty and diversity of food through hands-on, chef-led education.
            </p>
          </div>
          <div className="bg-white rounded-lg p-8 border border-cream-light">
            <h3 className="font-heading font-semibold text-xl">Our Vision</h3>
            <p className="mt-4 text-charcoal-text/80 leading-relaxed">
              To grow FoodWorld into a platform that reaches more aspiring cooks across Nigeria,
              creating greater opportunities within the culinary space.
            </p>
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24 text-center">
        <div className="max-w-xl mx-auto px-5">
          <h2 className="text-2xl md:text-3xl font-bold">Ready to start your own culinary journey?</h2>
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
        </div>
      </section>
    </>
  )
}
