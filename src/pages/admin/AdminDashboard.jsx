import { useEffect, useState } from 'react'
import { Users, BookOpen, Layers, Activity } from 'lucide-react'
import AdminLayout from '../../components/admin/AdminLayout.jsx'
import { supabase } from '../../lib/supabase.js'

export default function AdminDashboard() {
  const [stats, setStats] = useState({ batches: 0, students: 0, recipes: 0 })
  const [recent, setRecent] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadStats()
  }, [])

  async function loadStats() {
    setLoading(true)
    const [{ count: batches }, { count: students }, { count: recipes }, { data: recentBatches }, { data: recentRecipes }] =
      await Promise.all([
        supabase.from('batches').select('*', { count: 'exact', head: true }),
        supabase.from('profiles').select('*', { count: 'exact', head: true }).eq('role', 'student'),
        supabase.from('recipes').select('*', { count: 'exact', head: true }),
        supabase.from('batches').select('name, created_at').order('created_at', { ascending: false }).limit(3),
        supabase.from('recipes').select('name, created_at').order('created_at', { ascending: false }).limit(3),
      ])

    setStats({ batches: batches || 0, students: students || 0, recipes: recipes || 0 })

    const activity = [
      ...(recentBatches || []).map((b) => ({ label: `Batch "${b.name}" created`, at: b.created_at })),
      ...(recentRecipes || []).map((r) => ({ label: `Recipe "${r.name}" added`, at: r.created_at })),
    ]
      .sort((a, b) => new Date(b.at) - new Date(a.at))
      .slice(0, 5)

    setRecent(activity)
    setLoading(false)
  }

  const cards = [
    { label: 'Total Batches', value: stats.batches, icon: Layers },
    { label: 'Total Students', value: stats.students, icon: Users },
    { label: 'Total Recipes', value: stats.recipes, icon: BookOpen },
  ]

  return (
    <AdminLayout>
      <h1 className="text-2xl md:text-3xl font-bold">Dashboard</h1>

      <div className="mt-8 grid sm:grid-cols-3 gap-4">
        {cards.map(({ label, value, icon: Icon }) => (
          <div key={label} className="bg-white rounded-lg p-6 border border-cream-light">
            <Icon size={20} className="text-champagne" />
            <p className="text-sm text-grey-medium mt-3">{label}</p>
            <p className="font-heading font-bold text-3xl mt-1">{loading ? '—' : value}</p>
          </div>
        ))}
      </div>

      <div className="mt-10">
        <h2 className="font-heading font-semibold text-lg mb-4 flex items-center gap-2">
          <Activity size={18} className="text-champagne" /> Recent Activity
        </h2>
        <div className="bg-white rounded-lg border border-cream-light divide-y divide-cream-light">
          {loading ? (
            <p className="p-6 text-sm text-grey-medium">Loading...</p>
          ) : recent.length === 0 ? (
            <p className="p-6 text-sm text-grey-medium">No activity yet.</p>
          ) : (
            recent.map((item, i) => (
              <div key={i} className="p-4 text-sm flex justify-between">
                <span>{item.label}</span>
                <span className="text-grey-medium">{new Date(item.at).toLocaleDateString()}</span>
              </div>
            ))
          )}
        </div>
      </div>
    </AdminLayout>
  )
}
