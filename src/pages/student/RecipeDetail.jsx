import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { Clock, Users as UsersIcon, ChefHat, CheckCircle, ArrowLeft } from 'lucide-react'
import StudentLayout from '../../components/student/StudentLayout.jsx'
import Button from '../../components/Button.jsx'
import { useAuth } from '../../context/AuthContext.jsx'
import { supabase } from '../../lib/supabase.js'

export default function RecipeDetail() {
  const { id } = useParams()
  const { profile } = useAuth()
  const [recipe, setRecipe] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [completed, setCompleted] = useState(false)
  const [marking, setMarking] = useState(false)

  useEffect(() => {
    loadRecipe()
  }, [id])

  async function loadRecipe() {
    setLoading(true)
    setError('')

    // RLS ensures this only returns the recipe if it's published AND
    // assigned to the current student's batch — no extra client-side
    // batch check needed, but we still don't trust a missing row silently.
    const { data, error } = await supabase.from('recipes').select('*').eq('id', id).single()

    if (error || !data) {
      setError('Recipe not found.')
      setLoading(false)
      return
    }

    setRecipe(data)

    const { data: progress } = await supabase
      .from('recipe_progress')
      .select('recipe_id')
      .eq('recipe_id', id)
      .eq('student_id', profile.id)
      .maybeSingle()

    setCompleted(!!progress)
    setLoading(false)
  }

  async function handleMarkCompleted() {
    setMarking(true)
    const { error } = await supabase
      .from('recipe_progress')
      .insert({ recipe_id: id, student_id: profile.id })
    if (!error) setCompleted(true)
    setMarking(false)
  }

  if (loading) {
    return (
      <StudentLayout>
        <p className="text-sm text-grey-medium">Loading recipe...</p>
      </StudentLayout>
    )
  }

  if (error || !recipe) {
    return (
      <StudentLayout>
        <p className="text-sm text-red-600">{error || 'Recipe not found.'}</p>
        <Link to="/student-portal/recipes" className="text-sm text-champagne hover:underline mt-4 inline-block">
          Back to Recipes
        </Link>
      </StudentLayout>
    )
  }

  return (
    <StudentLayout>
      <Link to="/student-portal/recipes" className="inline-flex items-center gap-2 text-sm text-grey-medium hover:text-charcoal-deep mb-6">
        <ArrowLeft size={16} /> Back to Recipes
      </Link>

      <div className="bg-white rounded-lg border border-cream-light overflow-hidden max-w-3xl">
        <div className="aspect-video bg-cream-soft flex items-center justify-center text-sm text-grey-medium">
          {recipe.image_url ? (
            <img src={recipe.image_url} alt={recipe.name} className="w-full h-full object-cover" />
          ) : (
            'Recipe photo'
          )}
        </div>

        <div className="p-6 md:p-10">
          <p className="text-xs text-champagne font-medium uppercase tracking-wide">{recipe.category}</p>
          <h1 className="text-2xl md:text-3xl font-bold mt-2">{recipe.name}</h1>
          {recipe.description && (
            <p className="mt-3 text-charcoal-text/80 leading-relaxed">{recipe.description}</p>
          )}

          <div className="mt-6 flex flex-wrap gap-6 text-sm text-grey-medium border-y border-cream-light py-4">
            <span className="flex items-center gap-2"><Clock size={16} /> Prep {recipe.prep_time_minutes} min</span>
            <span className="flex items-center gap-2"><Clock size={16} /> Cook {recipe.cook_time_minutes} min</span>
            <span className="flex items-center gap-2"><UsersIcon size={16} /> Serves {recipe.servings}</span>
            <span className="flex items-center gap-2 capitalize"><ChefHat size={16} /> {recipe.difficulty}</span>
          </div>

          <div className="mt-8 grid md:grid-cols-2 gap-10">
            <div>
              <h2 className="font-heading font-semibold text-lg mb-4">Ingredients</h2>
              <ul className="space-y-2 text-sm">
                {(recipe.ingredients || []).map((ing, i) => (
                  <li key={i} className="flex justify-between border-b border-cream-light pb-2">
                    <span>{ing.name}</span>
                    <span className="text-grey-medium">{ing.amount}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h2 className="font-heading font-semibold text-lg mb-4">Instructions</h2>
              <ol className="space-y-4 text-sm">
                {(recipe.instructions || []).map((step, i) => (
                  <li key={i} className="flex gap-3">
                    <span className="shrink-0 w-6 h-6 rounded-full bg-charcoal-deep text-white text-xs flex items-center justify-center">
                      {i + 1}
                    </span>
                    <span className="leading-relaxed">{step}</span>
                  </li>
                ))}
              </ol>
            </div>
          </div>

          {recipe.chef_notes && (
            <div className="mt-10 bg-cream-soft rounded-lg p-6">
              <h2 className="font-heading font-semibold text-sm mb-2">Chef's Notes</h2>
              <p className="text-sm text-charcoal-text/80 leading-relaxed">{recipe.chef_notes}</p>
            </div>
          )}

          <div className="mt-10">
            <Button
              onClick={handleMarkCompleted}
              disabled={completed || marking}
              variant={completed ? 'secondary' : 'primary'}
              className="w-full sm:w-auto"
            >
              <CheckCircle size={18} />
              {completed ? 'Completed' : marking ? 'Marking...' : 'Mark as Completed'}
            </Button>
          </div>
        </div>
      </div>
    </StudentLayout>
  )
}
