import { NavLink, useNavigate } from 'react-router-dom'
import { LayoutDashboard, Users, BookOpen, ChefHat, LogOut, Settings } from 'lucide-react'
import { useAuth } from '../../context/AuthContext.jsx'

const NAV = [
  { to: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/admin/batches', label: 'Batches', icon: Users },
  { to: '/admin/students', label: 'Students', icon: Users },
  { to: '/admin/recipes', label: 'Recipes', icon: BookOpen },
  { to: '/admin/settings', label: 'Settings', icon: Settings },
]

export default function AdminLayout({ children }) {
  const { profile, signOut } = useAuth()
  const navigate = useNavigate()

  async function handleSignOut() {
    await signOut()
    navigate('/admin/login')
  }

  return (
    <div className="min-h-screen bg-cream-soft flex flex-col md:flex-row">
      <aside className="md:w-64 bg-charcoal-deep text-white flex md:flex-col md:sticky md:top-0 md:h-screen">
        <div className="flex items-center gap-2 px-6 py-6 border-b border-white/10">
          <ChefHat size={20} className="text-champagne" />
          <span className="font-heading font-semibold">FoodWorld Admin</span>
        </div>

        <nav className="flex-1 flex md:flex-col overflow-x-auto md:overflow-visible px-2 md:px-3 py-2 md:py-4 gap-1">
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
