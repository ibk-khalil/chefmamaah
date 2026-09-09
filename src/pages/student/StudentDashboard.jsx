import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { BookOpen, Users, Sparkles } from 'lucide-react'
import StudentLayout from '../../components/student/StudentLayout.jsx'
import { useAuth } from '../../context/AuthContext.jsx'
import { supabase } from '../../lib/supabase.js'

export default function StudentDashboard() {
  const { profile } = useAuth()
  const [recipes, setRecipes] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

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
      .order('assigned_at', { ascending: false })

    if (error) setError('Unable to load recipes.')
    else setRecipes((data || []).map((r) => r.recipe).filter(Boolean))
    setLoading(false)
  }

  return (
    <StudentLayout>
      <h1 className="text-2xl md:text-3xl font-bold">
        Welcome, {profile?.full_name?.split(' ')[0] || 'Student'}
      </h1>

      <div className="mt-8 grid sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-lg p-6 border border-cream-light">
          <Users size={20} className="text-champagne" />
          <p className="text-sm text-grey-medium mt-3">Assigned Batch</p>
          <p className="font-heading font-semibold text-lg mt-1">
            {profile?.batch?.name || 'Not yet assigned'}
          </p>
        </div>
        <div className="bg-white rounded-lg p-6 border border-cream-light">
          <BookOpen size={20} className="text-champagne" />
          <p className="text-sm text-grey-medium mt-3">Recipes Available</p>
          <p className="font-heading font-semibold text-lg mt-1">{recipes.length}</p>
        </div>
        <div className="bg-white rounded-lg p-6 border border-cream-light">
          <Sparkles size={20} className="text-champagne" />
          <p className="text-sm text-grey-medium mt-3">Class Type</p>
          <p className="font-heading font-semibold text-lg mt-1">
            {profile?.batch?.class_type || '—'}
          </p>
        </div>
      </div>

      <div className="mt-10">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-heading font-semibold text-lg">Recently Added Recipes</h2>
          <Link to="/student-portal/recipes" className="text-sm text-champagne hover:underline">
            View all
          </Link>
        </div>

        {!profile?.batch_id ? (
          <p className="text-sm text-grey-medium bg-white rounded-lg p-6 border border-cream-light">
            You haven't been assigned to a batch yet. Contact FoodWorld admin for access.
          </p>
        ) : loading ? (
          <p className="text-sm text-grey-medium">Loading recipes...</p>
        ) : error ? (
          <p className="text-sm text-red-600">{error}</p>
        ) : recipes.length === 0 ? (
          <p className="text-sm text-grey-medium bg-white rounded-lg p-6 border border-cream-light">
            No recipes have been assigned to your batch yet.
          </p>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {recipes.slice(0, 3).map((recipe) => (
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
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </StudentLayout>
  )
}
