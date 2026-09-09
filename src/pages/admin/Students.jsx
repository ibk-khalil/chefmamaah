import { useEffect, useState } from 'react'
import { Plus, Pencil, Trash2 } from 'lucide-react'
import AdminLayout from '../../components/admin/AdminLayout.jsx'
import Modal from '../../components/Modal.jsx'
import Button from '../../components/Button.jsx'
import { supabase } from '../../lib/supabase.js'

const EMPTY_FORM = { full_name: '', email: '', phone: '', batch_id: '' }

export default function Students() {
  const [students, setStudents] = useState([])
  const [batches, setBatches] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState(EMPTY_FORM)
  const [saving, setSaving] = useState(false)
  const [saveError, setSaveError] = useState('')
  const [createdCredentials, setCreatedCredentials] = useState(null)

  useEffect(() => {
    loadAll()
  }, [])

  async function loadAll() {
    setLoading(true)
    const [{ data: studentData, error: studentError }, { data: batchData }] = await Promise.all([
      supabase
        .from('profiles')
        .select('*, batch:batches(name)')
        .eq('role', 'student')
        .order('created_at', { ascending: false }),
      supabase.from('batches').select('id, name').order('name'),
    ])
    if (studentError) setError('Unable to load students.')
    else setStudents(studentData || [])
    setBatches(batchData || [])
    setLoading(false)
  }

  function openCreate() {
    setEditing(null)
    setForm(EMPTY_FORM)
    setSaveError('')
    setCreatedCredentials(null)
    setModalOpen(true)
  }

  function openEdit(student) {
    setEditing(student)
    setForm({
      full_name: student.full_name,
      email: student.email,
      phone: student.phone || '',
      batch_id: student.batch_id || '',
    })
    setSaveError('')
    setCreatedCredentials(null)
    setModalOpen(true)
  }

  async function handleSave(e) {
    e.preventDefault()
    setSaving(true)
    setSaveError('')

    if (editing) {
      const { error } = await supabase
        .from('profiles')
        .update({ full_name: form.full_name, phone: form.phone || null, batch_id: form.batch_id || null })
        .eq('id', editing.id)
      setSaving(false)
      if (error) {
        setSaveError(error.message)
        return
      }
      setModalOpen(false)
      loadAll()
      return
    }

    const { data: sessionData } = await supabase.auth.getSession()
    const { data, error } = await supabase.functions.invoke('create-student', {
      body: {
        full_name: form.full_name,
        email: form.email,
        phone: form.phone || null,
        batch_id: form.batch_id || null,
      },
      headers: { Authorization: `Bearer ${sessionData.session.access_token}` },
    })

    setSaving(false)
    if (error || data?.error) {
      setSaveError(data?.error || error.message)
      return
    }

    setCreatedCredentials({ email: form.email, password: data.temporary_password })
    loadAll()
  }

  async function handleDelete(student) {
    if (!confirm(`Remove ${student.full_name}? This deletes their account.`)) return
    await supabase.from('profiles').delete().eq('id', student.id)
    loadAll()
  }

  return (
    <AdminLayout>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl md:text-3xl font-bold">Students</h1>
        <Button onClick={openCreate} variant="primary" size="sm">
          <Plus size={16} /> Add Student
        </Button>
      </div>

      <div className="mt-8">
        {loading ? (
          <p className="p-6 text-sm text-grey-medium bg-white rounded-lg border border-cream-light">Loading...</p>
        ) : error ? (
          <p className="p-6 text-sm text-red-600 bg-white rounded-lg border border-cream-light">{error}</p>
        ) : students.length === 0 ? (
          <p className="p-6 text-sm text-grey-medium bg-white rounded-lg border border-cream-light">No students have been added yet.</p>
        ) : (
          <>
            {/* Desktop table */}
            <div className="hidden md:block bg-white rounded-lg border border-cream-light overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-grey-medium border-b border-cream-light">
                    <th className="px-6 py-3 font-medium">Name</th>
                    <th className="px-6 py-3 font-medium">Email</th>
                    <th className="px-6 py-3 font-medium">Batch</th>
                    <th className="px-6 py-3 font-medium">Status</th>
                    <th className="px-6 py-3"></th>
                  </tr>
                </thead>
                <tbody>
                  {students.map((s) => (
                    <tr key={s.id} className="border-b border-cream-light last:border-0">
                      <td className="px-6 py-4 font-medium">{s.full_name}</td>
                      <td className="px-6 py-4 text-grey-medium">{s.email}</td>
                      <td className="px-6 py-4">{s.batch?.name || '—'}</td>
                      <td className="px-6 py-4 capitalize">{s.status}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3 justify-end">
                          <button onClick={() => openEdit(s)} className="focus-ring text-grey-medium hover:text-charcoal-deep">
                            <Pencil size={16} />
                          </button>
                          <button onClick={() => handleDelete(s)} className="focus-ring text-grey-medium hover:text-red-600">
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
              {students.map((s) => (
                <div key={s.id} className="bg-white rounded-lg border border-cream-light p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="font-medium truncate">{s.full_name}</p>
                      <p className="text-sm text-grey-medium mt-0.5 truncate">{s.email}</p>
                    </div>
                    <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-cream-soft capitalize shrink-0">
                      {s.status}
                    </span>
                  </div>
                  <p className="text-xs text-grey-medium mt-3">Batch: {s.batch?.name || 'Not assigned'}</p>
                  <div className="flex items-center gap-4 mt-4 pt-3 border-t border-cream-light">
                    <button onClick={() => openEdit(s)} className="focus-ring flex items-center gap-1.5 text-sm text-grey-medium hover:text-charcoal-deep">
                      <Pencil size={14} /> Edit
                    </button>
                    <button onClick={() => handleDelete(s)} className="focus-ring flex items-center gap-1.5 text-sm text-grey-medium hover:text-red-600">
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
        <Modal title={editing ? 'Edit Student' : 'Add Student'} onClose={() => setModalOpen(false)}>
          {createdCredentials ? (
            <div className="space-y-4">
              <p className="text-sm text-charcoal-text">
                Student account created. Share these credentials with them securely (e.g. WhatsApp):
              </p>
              <div className="bg-cream-soft rounded p-4 text-sm space-y-1">
                <p><span className="text-grey-medium">Email:</span> {createdCredentials.email}</p>
                <p><span className="text-grey-medium">Temporary password:</span> {createdCredentials.password}</p>
              </div>
              <Button variant="primary" className="w-full" onClick={() => setModalOpen(false)}>
                Done
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1.5">Full Name</label>
                <input
                  required
                  value={form.full_name}
                  onChange={(e) => setForm({ ...form, full_name: e.target.value })}
                  className="focus-ring w-full rounded border border-cream-light px-3 py-2 text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5">Email</label>
                <input
                  required
                  type="email"
                  disabled={!!editing}
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="focus-ring w-full rounded border border-cream-light px-3 py-2 text-sm disabled:bg-cream-soft"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5">Phone</label>
                <input
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  className="focus-ring w-full rounded border border-cream-light px-3 py-2 text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5">Batch</label>
                <select
                  value={form.batch_id}
                  onChange={(e) => setForm({ ...form, batch_id: e.target.value })}
                  className="focus-ring w-full rounded border border-cream-light px-3 py-2 text-sm"
                >
                  <option value="">Not assigned</option>
                  {batches.map((b) => (
                    <option key={b.id} value={b.id}>{b.name}</option>
                  ))}
                </select>
              </div>

              {saveError && <p className="text-sm text-red-600">{saveError}</p>}

              <Button type="submit" variant="primary" className="w-full" disabled={saving}>
                {saving ? 'Saving...' : editing ? 'Save Changes' : 'Create Student Account'}
              </Button>
            </form>
          )}
        </Modal>
      )}
    </AdminLayout>
  )
}
