import { NavLink } from 'react-router-dom'
import { Instagram, MessageCircle, MapPin } from 'lucide-react'
import { waLink, WA_MESSAGES } from '../lib/whatsapp.js'

export default function Footer() {
  return (
    <footer className="bg-charcoal-deep text-cream-soft">
      <div className="max-w-content mx-auto px-5 md:px-8 py-14 grid gap-10 md:grid-cols-4">
        <div>
          <p className="font-heading font-bold text-lg text-white">FoodWorld</p>
          <p className="text-sm text-grey-medium mt-1">by Chef Maamah</p>
          <p className="text-sm text-grey-medium mt-4 leading-relaxed">
            A premium culinary education brand built around passion, creativity, and hands-on learning.
          </p>
        </div>

        <div>
          <p className="font-heading font-semibold text-sm text-white mb-4">Navigate</p>
          <ul className="space-y-3 text-sm text-grey-medium">
            <li><NavLink to="/" className="hover:text-white">Home</NavLink></li>
            <li><NavLink to="/about" className="hover:text-white">About</NavLink></li>
            <li><NavLink to="/classes" className="hover:text-white">Culinary Classes</NavLink></li>
            <li><NavLink to="/gallery" className="hover:text-white">Gallery</NavLink></li>
            <li><NavLink to="/contact" className="hover:text-white">Contact</NavLink></li>
            <li><NavLink to="/student-portal" className="hover:text-white">Student Portal</NavLink></li>
          </ul>
        </div>

        <div>
          <p className="font-heading font-semibold text-sm text-white mb-4">Contact</p>
          <ul className="space-y-3 text-sm text-grey-medium">
            <li className="flex items-center gap-2"><MapPin size={16} /> Gwarinpa Extension, Abuja, Nigeria</li>
            <li className="flex items-center gap-2"><MessageCircle size={16} /> 0810 092 3070</li>
            <li className="flex items-center gap-2"><Instagram size={16} /> @___thefoodworld</li>
          </ul>
        </div>

        <div>
          <p className="font-heading font-semibold text-sm text-white mb-4">Begin your journey</p>
          <a
            href={waLink(WA_MESSAGES.general_link_default)}
            target="_blank"
            rel="noopener noreferrer"
            className="focus-ring inline-flex items-center gap-2 rounded bg-white text-charcoal-deep px-5 py-3 text-sm font-medium hover:bg-cream-soft transition-colors"
          >
            <MessageCircle size={16} /> Chat on WhatsApp
          </a>
        </div>
      </div>

      <div className="border-t border-white/10 py-6 text-center text-xs text-grey-medium">
        © {new Date().getFullYear()} The FoodWorld by Chef Maamah. All rights reserved.
      </div>
    </footer>
  )
}
