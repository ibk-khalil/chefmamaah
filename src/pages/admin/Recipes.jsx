import { useEffect, useState } from 'react'
import { Plus, Pencil, Trash2, Upload } from 'lucide-react'
import AdminLayout from '../../components/admin/AdminLayout.jsx'
import Modal from '../../components/Modal.jsx'
import Button from '../../components/Button.jsx'
import { supabase } from '../../lib/supabase.js'

const CATEGORIES = ['African', 'Continental', 'Desserts', 'Pastries', 'Bread', 'Beverages', 'Mocktails']

const EMPTY_FORM = {
  name: '',
  description: '',
  image_url: '',
  category: 'African',
  prep_time_minutes: '',
  cook_time_minutes: '',
  servings: '',
  difficulty: 'beginner',
  ingredients: '', // newline-separated "Name | Amount"
  instructions: '', // newline-separated steps
  chef_notes: '',
  status: 'draft',
  batch_ids: [],
}

function recipeToForm(recipe, batchIds) {
  return {
    name: recipe.name,
    description: recipe.description || '',
    image_url: recipe.image_url || '',
    category: recipe.category,
    prep_time_minutes: recipe.prep_time_minutes ?? '',
    cook_time_minutes: recipe.cook_time_minutes ?? '',
    servings: recipe.servings ?? '',
    difficulty: recipe.difficulty,
    ingredients: (recipe.ingredients || []).map((i) => `${i.name} | ${i.amount}`).join('\n'),
    instructions: (recipe.instructions || []).join('\n'),
    chef_notes: recipe.chef_notes || '',
    status: recipe.status,
    batch_ids: batchIds || [],
  }
}

function formToPayload(form) {
  return {
    name: form.name,
    description: form.description || null,
    image_url: form.image_url || null,
    category: form.category,
    prep_time_minutes: form.prep_time_minutes ? Number(form.prep_time_minutes) : null,
    cook_time_minutes: form.cook_time_minutes ? Number(form.cook_time_minutes) : null,
    servings: form.servings ? Number(form.servings) : null,
    difficulty: form.difficulty,
    ingredients: form.ingredients
      .split('\n')
      .map((l) => l.trim())
      .filter(Boolean)
      .map((l) => {
        const [name, amount] = l.split('|').map((s) => s.trim())
        return { name, amount: amount || '' }
      }),
    instructions: form.instructions.split('\n').map((l) => l.trim()).filter(Boolean),
    chef_notes: form.chef_notes || null,
    status: form.status,
  }
}

export default function Recipes() {
  const [recipes, setRecipes] = useState([])
  const [batches, setBatches] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState(EMPTY_FORM)
  const [saving, setSaving] = useState(false)
  const [saveError, setSaveError] = useState('')
  const [uploading, setUploading] = useState(false)

  useEffect(() => {
    loadAll()
  }, [])

  async function loadAll() {
    setLoading(true)
    const [{ data: recipeData, error: recipeError }, { data: batchData }] = await Promise.all([
      supabase.from('recipes').select('*').order('created_at', { ascending: false }),
      supabase.from('batches').select('id, name').order('name'),
    ])
    if (recipeError) setError('Unable to load recipes.')
    else setRecipes(recipeData || [])
    setBatches(batchData || [])
    setLoading(false)
  }

  function openCreate() {
    setEditing(null)
    setForm(EMPTY_FORM)
    setSaveError('')
    setModalOpen(true)
  }

  async function openEdit(recipe) {
    const { data: assignments } = await supabase
      .from('batch_recipes')
      .select('batch_id')
      .eq('recipe_id', recipe.id)
    setEditing(recipe)
    setForm(recipeToForm(recipe, (assignments || []).map((a) => a.batch_id)))
    setSaveError('')
    setModalOpen(true)
  }

  async function handleImageUpload(e) {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    const path = `${Date.now()}-${file.name}`
    const { error } = await supabase.storage.from('recipe-images').upload(path, file)
    if (!error) {
      const { data } = supabase.storage.from('recipe-images').getPublicUrl(path)
      setForm((f) => ({ ...f, image_url: data.publicUrl }))
    }
    setUploading(false)
  }

  function toggleBatch(batchId) {
    setForm((f) => ({
      ...f,
      batch_ids: f.batch_ids.includes(batchId)
        ? f.batch_ids.filter((id) => id !== batchId)
        : [...f.batch_ids, batchId],
    }))
  }

  async function handleSave(e) {
    e.preventDefault()
    setSaving(true)
    setSaveError('')
    const payload = formToPayload(form)

    let recipeId = editing?.id
    if (editing) {
      const { error } = await supabase.from('recipes').update(payload).eq('id', editing.id)
      if (error) {
        setSaving(false)
        setSaveError(error.message)
        return
      }
    } else {
      const { data, error } = await supabase.from('recipes').insert(payload).select('id').single()
      if (error) {
        setSaving(false)
        setSaveError(error.message)
        return
      }
      recipeId = data.id
    }

    // Sync batch assignments
    await supabase.from('batch_recipes').delete().eq('recipe_id', recipeId)
    if (form.batch_ids.length > 0) {
      await supabase
        .from('batch_recipes')
        .insert(form.batch_ids.map((batch_id) => ({ batch_id, recipe_id: recipeId })))
    }

    setSaving(false)
    setModalOpen(false)
    loadAll()
  }

  async function handleDelete(recipe) {
    if (!confirm(`Delete "${recipe.name}"? This cannot be undone.`)) return
    await supabase.from('recipes').delete().eq('id', recipe.id)
    loadAll()
  }

  return (
    <AdminLayout>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl md:text-3xl font-bold">Recipes</h1>
        <Button onClick={openCreate} variant="primary" size="sm">
          <Plus size={16} /> New Recipe
        </Button>
      </div>

      <div className="mt-8 bg-white rounded-lg border border-cream-light overflow-x-auto">
        {loading ? (
          <p className="p-6 text-sm text-grey-medium">Loading...</p>
        ) : error ? (
          <p className="p-6 text-sm text-red-600">{error}</p>
        ) : recipes.length === 0 ? (
          <p className="p-6 text-sm text-grey-medium">No recipes created yet.</p>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-grey-medium border-b border-cream-light">
                <th className="px-6 py-3 font-medium">Name</th>
                <th className="px-6 py-3 font-medium">Category</th>
                <th className="px-6 py-3 font-medium">Status</th>
                <th className="px-6 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {recipes.map((r) => (
                <tr key={r.id} className="border-b border-cream-light last:border-0">
                  <td className="px-6 py-4 font-medium">{r.name}</td>
                  <td className="px-6 py-4">{r.category}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`text-xs font-medium px-2.5 py-1 rounded-full capitalize ${
                        r.status === 'published' ? 'bg-green-100 text-green-700' : 'bg-cream-light text-charcoal-text'
                      }`}
                    >
                      {r.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3 justify-end">
                      <button onClick={() => openEdit(r)} className="focus-ring text-grey-medium hover:text-charcoal-deep">
                        <Pencil size={16} />
                      </button>
                      <button onClick={() => handleDelete(r)} className="focus-ring text-grey-medium hover:text-red-600">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {modalOpen && (
        <Modal title={editing ? 'Edit Recipe' : 'New Recipe'} onClose={() => setModalOpen(false)}>
          <form onSubmit={handleSave} className="space-y-4 max-h-[70vh] overflow-y-auto pr-1">
            <div>
              <label className="block text-sm font-medium mb-1.5">Recipe Name</label>
              <input
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="focus-ring w-full rounded border border-cream-light px-3 py-2 text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1.5">Description</label>
              <textarea
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                rows={2}
                className="focus-ring w-full rounded border border-cream-light px-3 py-2 text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1.5">Recipe Image</label>
              {form.image_url && (
                <img src={form.image_url} alt="" className="w-full h-32 object-cover rounded mb-2" />
              )}
              <label className="focus-ring flex items-center gap-2 justify-center border border-dashed border-cream-light rounded px-3 py-3 text-sm text-grey-medium cursor-pointer hover:bg-cream-soft">
                <Upload size={16} />
                {uploading ? 'Uploading...' : 'Upload image'}
                <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} disabled={uploading} />
              </label>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1.5">Category</label>
                <select
                  value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value })}
                  className="focus-ring w-full rounded border border-cream-light px-3 py-2 text-sm"
                >
                  {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5">Difficulty</label>
                <select
                  value={form.difficulty}
                  onChange={(e) => setForm({ ...form, difficulty: e.target.value })}
                  className="focus-ring w-full rounded border border-cream-light px-3 py-2 text-sm"
                >
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1.5">Prep (min)</label>
                <input
                  type="number"
                  value={form.prep_time_minutes}
                  onChange={(e) => setForm({ ...form, prep_time_minutes: e.target.value })}
                  className="focus-ring w-full rounded border border-cream-light px-3 py-2 text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5">Cook (min)</label>
                <input
                  type="number"
                  value={form.cook_time_minutes}
                  onChange={(e) => setForm({ ...form, cook_time_minutes: e.target.value })}
                  className="focus-ring w-full rounded border border-cream-light px-3 py-2 text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5">Servings</label>
                <input
                  type="number"
                  value={form.servings}
                  onChange={(e) => setForm({ ...form, servings: e.target.value })}
                  className="focus-ring w-full rounded border border-cream-light px-3 py-2 text-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1.5">
                Ingredients <span className="text-grey-medium font-normal">(one per line: Name | Amount)</span>
              </label>
              <textarea
                value={form.ingredients}
                onChange={(e) => setForm({ ...form, ingredients: e.target.value })}
                rows={4}
                placeholder={'Rice | 3 cups\nChicken | 6 pieces'}
                className="focus-ring w-full rounded border border-cream-light px-3 py-2 text-sm font-mono"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1.5">
                Instructions <span className="text-grey-medium font-normal">(one step per line)</span>
              </label>
              <textarea
                value={form.instructions}
                onChange={(e) => setForm({ ...form, instructions: e.target.value })}
                rows={5}
                className="focus-ring w-full rounded border border-cream-light px-3 py-2 text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1.5">Chef's Notes</label>
              <textarea
                value={form.chef_notes}
                onChange={(e) => setForm({ ...form, chef_notes: e.target.value })}
                rows={2}
                className="focus-ring w-full rounded border border-cream-light px-3 py-2 text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1.5">Assign to Batches</label>
              <div className="flex flex-wrap gap-2">
                {batches.map((b) => (
                  <button
                    type="button"
                    key={b.id}
                    onClick={() => toggleBatch(b.id)}
                    className={`focus-ring text-xs px-3 py-1.5 rounded-full border ${
                      form.batch_ids.includes(b.id)
                        ? 'bg-charcoal-deep text-white border-charcoal-deep'
                        : 'border-cream-light text-charcoal-text hover:bg-cream-soft'
                    }`}
                  >
                    {b.name}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1.5">Status</label>
              <select
                value={form.status}
                onChange={(e) => setForm({ ...form, status: e.target.value })}
                className="focus-ring w-full rounded border border-cream-light px-3 py-2 text-sm"
              >
                <option value="draft">Draft</option>
                <option value="published">Published</option>
              </select>
            </div>

            {saveError && <p className="text-sm text-red-600">{saveError}</p>}

            <Button type="submit" variant="primary" className="w-full" disabled={saving}>
              {saving ? 'Saving...' : editing ? 'Save Changes' : 'Create Recipe'}
            </Button>
          </form>
        </Modal>
      )}
    </AdminLayout>
  )
}
