import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { Search } from 'lucide-react'
import StudentLayout from '../../components/student/StudentLayout.jsx'
import { useAuth } from '../../context/AuthContext.jsx'
import { supabase } from '../../lib/supabase.js'

const CATEGORIES = ['All', 'African', 'Continental', 'Desserts', 'Pastries', 'Bread', 'Beverages', 'Mocktails']

export default function Recipes() {
  const { profile } = useAuth()
  const [recipes, setRecipes] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('All')

  useEffect(() => {
    if (!profile?.batch_id) {
      setLoading(false)
      return
    }
    loadRecipes()
  }, [profile?.batch_id])

  async function loadRecipes() {
    setLoading(true)
    setError('')
    const { data, error } = await supabase
      .from('batch_recipes')
      .select('recipe:recipes(*)')
      .eq('batch_id', profile.batch_id)

    if (error) setError('Unable to load recipes.')
    else setRecipes((data || []).map((r) => r.recipe).filter(Boolean))
    setLoading(false)
  }

  const filtered = useMemo(() => {
    return recipes.filter((r) => {
      const matchesCategory = category === 'All' || r.category === category
      const matchesQuery = r.name.toLowerCase().includes(query.toLowerCase())
      return matchesCategory && matchesQuery
    })
  }, [recipes, category, query])

  return (
    <StudentLayout>
      <h1 className="text-2xl md:text-3xl font-bold">Recipes</h1>

      <div className="mt-6 flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-grey-medium" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search recipes..."
            className="focus-ring w-full rounded border border-cream-light bg-white pl-9 pr-4 py-2.5 text-sm"
          />
        </div>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="focus-ring rounded border border-cream-light bg-white px-4 py-2.5 text-sm"
        >
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
      </div>

      <div className="mt-8">
        {!profile?.batch_id ? (
          <p className="text-sm text-grey-medium bg-white rounded-lg p-6 border border-cream-light">
            You haven't been assigned to a batch yet. Contact FoodWorld admin for access.
          </p>
        ) : loading ? (
          <p className="text-sm text-grey-medium">Loading recipes...</p>
        ) : error ? (
          <p className="text-sm text-red-600">{error}</p>
        ) : filtered.length === 0 ? (
          <p className="text-sm text-grey-medium bg-white rounded-lg p-6 border border-cream-light">
            {recipes.length === 0
              ? 'No recipes have been assigned to your batch yet.'
              : 'No recipes match your search.'}
          </p>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filtered.map((recipe) => (
              <Link
                key={recipe.id}
                to={`/student-portal/recipes/${recipe.id}`}
                className="bg-white rounded-lg border border-cream-light overflow-hidden hover:shadow-sm transition-shadow"
              >
                <div className="aspect-video bg-cream-soft flex items-center justify-center text-xs text-grey-medium">
                  {recipe.image_url ? (
                    <img src={recipe.image_url} alt={recipe.name} className="w-full h-full object-cover" />
                  ) : (
                    'Recipe photo'
                  )}
                </div>
                <div className="p-4">
                  <p className="text-xs text-champagne font-medium">{recipe.category}</p>
                  <p className="font-heading font-semibold mt-1">{recipe.name}</p>
                  <p className="text-xs text-grey-medium mt-2 capitalize">
                    {recipe.difficulty} · {recipe.prep_time_minutes + recipe.cook_time_minutes} min
                  </p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </StudentLayout>
  )
}
