import { useState, useEffect } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { LayoutDashboard, Users, BookOpen, User, LogOut, ChefHat, Menu, X } from 'lucide-react'
import { useAuth } from '../../context/AuthContext.jsx'

const NAV = [
  { to: '/student-portal/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/student-portal/my-batch', label: 'My Batch', icon: Users },
  { to: '/student-portal/recipes', label: 'Recipes', icon: BookOpen },
  { to: '/student-portal/profile', label: 'Profile', icon: User },
]

export default function StudentLayout({ children }) {
  const { profile, signOut } = useAuth()
  const navigate = useNavigate()
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : ''
  }, [mobileOpen])

  async function handleSignOut() {
    await signOut()
    navigate('/student-portal/login')
  }

  return (
    <div className="min-h-screen bg-cream-soft flex flex-col md:flex-row">
      {/* Mobile top bar */}
      <div className="md:hidden sticky top-0 z-40 flex items-center justify-between bg-charcoal-deep text-white px-5 h-16">
        <div className="flex items-center gap-2">
          <ChefHat size={20} className="text-champagne" />
          <span className="font-heading font-semibold">FoodWorld</span>
        </div>
        <button
          className="focus-ring rounded p-2"
          aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
          onClick={() => setMobileOpen((v) => !v)}
        >
          {mobileOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile slide-in menu */}
      {mobileOpen && (
        <div className="md:hidden fixed inset-0 top-16 z-30 bg-charcoal-deep text-white flex flex-col shadow-lg overflow-y-auto">
          <nav className="flex-1 flex flex-col px-3 py-4 gap-1">
            {NAV.map(({ to, label, icon: Icon }) => (
              <NavLink
                key={to}
                to={to}
                onClick={() => setMobileOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 rounded text-sm transition-colors ${
                    isActive ? 'bg-white/10 text-white' : 'text-grey-medium hover:bg-white/5 hover:text-white'
                  }`
                }
              >
                <Icon size={18} /> {label}
              </NavLink>
            ))}
          </nav>
          <div className="px-3 py-4 border-t border-white/10">
            <button
              onClick={handleSignOut}
              className="focus-ring flex items-center gap-3 px-4 py-3 rounded text-sm text-grey-medium hover:bg-white/5 hover:text-white w-full"
            >
              <LogOut size={18} /> Logout
            </button>
          </div>
        </div>
      )}

      {/* Desktop sidebar */}
      <aside className="hidden md:flex md:w-64 bg-charcoal-deep text-white md:flex-col md:sticky md:top-0 md:h-screen">
        <div className="flex items-center gap-2 px-6 py-6 border-b border-white/10">
          <ChefHat size={20} className="text-champagne" />
          <span className="font-heading font-semibold">FoodWorld</span>
        </div>

        <nav className="flex-1 flex flex-col px-3 py-4 gap-1">
          {NAV.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded text-sm whitespace-nowrap transition-colors ${
                  isActive ? 'bg-white/10 text-white' : 'text-grey-medium hover:bg-white/5 hover:text-white'
                }`
              }
            >
              <Icon size={18} /> {label}
            </NavLink>
          ))}
        </nav>

        <div className="px-3 py-4 border-t border-white/10">
          <button
            onClick={handleSignOut}
            className="focus-ring flex items-center gap-3 px-4 py-3 rounded text-sm text-grey-medium hover:bg-white/5 hover:text-white w-full"
          >
            <LogOut size={18} /> Logout
          </button>
        </div>
      </aside>

      <main className="flex-1 px-5 md:px-10 py-8 md:py-12">
        {profile && (
          <p className="text-sm text-grey-medium mb-6">
            Signed in as <span className="font-medium text-charcoal-text">{profile.full_name}</span>
          </p>
        )}
        {children}
      </main>
    </div>
  )
}
