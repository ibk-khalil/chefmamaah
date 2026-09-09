import { useEffect, useState } from 'react'
import { Plus, Pencil, Trash2 } from 'lucide-react'
import AdminLayout from '../../components/admin/AdminLayout.jsx'
import Modal from '../../components/Modal.jsx'
import Button from '../../components/Button.jsx'
import { supabase } from '../../lib/supabase.js'

const EMPTY_FORM = {
  name: '',
  class_type: 'General Culinary Class',
  description: '',
  start_date: '',
  end_date: '',
  status: 'upcoming',
}

export default function Batches() {
  const [batches, setBatches] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState(EMPTY_FORM)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    loadBatches()
  }, [])

  async function loadBatches() {
    setLoading(true)
    const { data, error } = await supabase.from('batches').select('*').order('created_at', { ascending: false })
    if (error) setError('Unable to load batches.')
    else setBatches(data || [])
    setLoading(false)
  }

  function openCreate() {
    setEditing(null)
    setForm(EMPTY_FORM)
    setModalOpen(true)
  }

  function openEdit(batch) {
    setEditing(batch)
    setForm({
      name: batch.name,
      class_type: batch.class_type,
      description: batch.description || '',
      start_date: batch.start_date || '',
      end_date: batch.end_date || '',
      status: batch.status,
    })
    setModalOpen(true)
  }

  async function handleSave(e) {
    e.preventDefault()
    setSaving(true)
    const payload = { ...form, start_date: form.start_date || null, end_date: form.end_date || null }

    const { error } = editing
      ? await supabase.from('batches').update(payload).eq('id', editing.id)
      : await supabase.from('batches').insert(payload)

    setSaving(false)
    if (!error) {
      setModalOpen(false)
      loadBatches()
    }
  }

  async function handleDelete(batch) {
    if (!confirm(`Delete "${batch.name}"? This cannot be undone.`)) return
    await supabase.from('batches').delete().eq('id', batch.id)
    loadBatches()
  }

  return (
    <AdminLayout>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl md:text-3xl font-bold">Batches</h1>
        <Button onClick={openCreate} variant="primary" size="sm">
          <Plus size={16} /> New Batch
        </Button>
      </div>

      <div className="mt-8">
        {loading ? (
          <p className="p-6 text-sm text-grey-medium bg-white rounded-lg border border-cream-light">Loading...</p>
        ) : error ? (
          <p className="p-6 text-sm text-red-600 bg-white rounded-lg border border-cream-light">{error}</p>
        ) : batches.length === 0 ? (
          <p className="p-6 text-sm text-grey-medium bg-white rounded-lg border border-cream-light">No batches created yet.</p>
        ) : (
          <>
            {/* Desktop table */}
            <div className="hidden md:block bg-white rounded-lg border border-cream-light overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-grey-medium border-b border-cream-light">
                    <th className="px-6 py-3 font-medium">Name</th>
                    <th className="px-6 py-3 font-medium">Class Type</th>
                    <th className="px-6 py-3 font-medium">Status</th>
                    <th className="px-6 py-3 font-medium">Dates</th>
                    <th className="px-6 py-3"></th>
                  </tr>
                </thead>
                <tbody>
                  {batches.map((batch) => (
                    <tr key={batch.id} className="border-b border-cream-light last:border-0">
                      <td className="px-6 py-4 font-medium">{batch.name}</td>
                      <td className="px-6 py-4">{batch.class_type}</td>
                      <td className="px-6 py-4 capitalize">{batch.status}</td>
                      <td className="px-6 py-4 text-grey-medium">
                        {batch.start_date || '—'} → {batch.end_date || '—'}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3 justify-end">
                          <button onClick={() => openEdit(batch)} className="focus-ring text-grey-medium hover:text-charcoal-deep">
                            <Pencil size={16} />
                          </button>
                          <button onClick={() => handleDelete(batch)} className="focus-ring text-grey-medium hover:text-red-600">
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile stacked cards — no horizontal scrolling */}
            <div className="md:hidden space-y-3">
              {batches.map((batch) => (
                <div key={batch.id} className="bg-white rounded-lg border border-cream-light p-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-medium">{batch.name}</p>
                      <p className="text-sm text-grey-medium mt-0.5">{batch.class_type}</p>
                    </div>
                    <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-cream-soft capitalize shrink-0">
                      {batch.status}
                    </span>
                  </div>
                  <p className="text-xs text-grey-medium mt-3">
                    {batch.start_date || '—'} → {batch.end_date || '—'}
                  </p>
                  <div className="flex items-center gap-4 mt-4 pt-3 border-t border-cream-light">
                    <button onClick={() => openEdit(batch)} className="focus-ring flex items-center gap-1.5 text-sm text-grey-medium hover:text-charcoal-deep">
                      <Pencil size={14} /> Edit
                    </button>
                    <button onClick={() => handleDelete(batch)} className="focus-ring flex items-center gap-1.5 text-sm text-grey-medium hover:text-red-600">
                      <Trash2 size={14} /> Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {modalOpen && (
        <Modal title={editing ? 'Edit Batch' : 'New Batch'} onClose={() => setModalOpen(false)}>
          <form onSubmit={handleSave} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1.5">Batch Name</label>
              <input
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="focus-ring w-full rounded border border-cream-light px-3 py-2 text-sm"
                placeholder="Batch 4"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5">Class Type</label>
              <select
                value={form.class_type}
                onChange={(e) => setForm({ ...form, class_type: e.target.value })}
                className="focus-ring w-full rounded border border-cream-light px-3 py-2 text-sm"
              >
                <option>General Culinary Class</option>
                <option>Private Culinary Class</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5">Description</label>
              <textarea
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                rows={3}
                className="focus-ring w-full rounded border border-cream-light px-3 py-2 text-sm"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1.5">Start Date</label>
                <input
                  type="date"
                  value={form.start_date}
                  onChange={(e) => setForm({ ...form, start_date: e.target.value })}
                  className="focus-ring w-full rounded border border-cream-light px-3 py-2 text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5">End Date</label>
                <input
                  type="date"
                  value={form.end_date}
                  onChange={(e) => setForm({ ...form, end_date: e.target.value })}
                  className="focus-ring w-full rounded border border-cream-light px-3 py-2 text-sm"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5">Status</label>
              <select
                value={form.status}
                onChange={(e) => setForm({ ...form, status: e.target.value })}
                className="focus-ring w-full rounded border border-cream-light px-3 py-2 text-sm"
              >
                <option value="upcoming">Upcoming</option>
                <option value="active">Active</option>
                <option value="completed">Completed</option>
              </select>
            </div>
            <Button type="submit" variant="primary" className="w-full" disabled={saving}>
              {saving ? 'Saving...' : editing ? 'Save Changes' : 'Create Batch'}
            </Button>
          </form>
        </Modal>
      )}
    </AdminLayout>
  )
}
