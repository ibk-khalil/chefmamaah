import { useState, useEffect } from 'react'
import { NavLink } from 'react-router-dom'
import { Menu, X } from 'lucide-react'
import Button from './Button.jsx'
import { waLink, WA_MESSAGES } from '../lib/whatsapp.js'

const LINKS = [
  { to: '/', label: 'Home' },
  { to: '/about', label: 'About' },
  { to: '/classes', label: 'Culinary Classes' },
  { to: '/gallery', label: 'Gallery' },
  { to: '/student-portal', label: 'Student Portal' },
]

export default function Navbar() {
  const [open, setOpen] = useState(false)

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
  }, [open])

  return (
    <>
    <header className="sticky top-0 z-50 bg-charcoal-deep/95 backdrop-blur border-b border-white/10">
      <div className="max-w-content mx-auto flex items-center justify-between px-5 md:px-8 h-16 md:h-20"> 
        <NavLink to="/" className="flex items-center gap-2 font-heading font-bold text-lg text-white">
          <img src="/images/logo.png" alt="FoodWorld" className="h-8 w-auto" />
          <span className="hidden sm:inline text-xs font-body font-normal text-grey-medium">by Chef Maamah</span>
        </NavLink>

        <nav className="hidden lg:flex items-center gap-8">
          {LINKS.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                `text-sm font-medium transition-colors ${
                  isActive ? 'text-white' : 'text-grey-medium hover:text-white'
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        <div className="hidden lg:block">
          <Button
            as="a"
            href={waLink(WA_MESSAGES.general_link_default)}
            target="_blank"
            rel="noopener noreferrer"
            variant="secondary"
            size="sm"
            icon
            className="!border-white !text-white hover:!bg-white/10"
          >
            Chat on WhatsApp
          </Button>
        </div>

        <button
          className="lg:hidden focus-ring rounded p-2 text-white"
          aria-label={open ? 'Close menu' : 'Open menu'}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>
    </header>

      {open && (
        <div className="lg:hidden fixed inset-0 top-16 bg-charcoal-deep z-[60] flex flex-col px-6 py-8 gap-1 shadow-lg border-t border-white/10 overflow-y-auto">
          {LINKS.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              onClick={() => setOpen(false)}
              className={({ isActive }) =>
                `text-lg font-heading font-semibold py-3 border-b border-white/10 ${
                  isActive ? 'text-champagne' : 'text-white'
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
          <Button
            as="a"
            href={waLink(WA_MESSAGES.general_link_default)}
            target="_blank"
            rel="noopener noreferrer"
            variant="primary"
            icon
            className="mt-4 w-full !bg-white !text-charcoal-deep hover:!bg-cream-soft"
          >
            Chat on WhatsApp
          </Button>
        </div>
      )}
    </>
  )
}

