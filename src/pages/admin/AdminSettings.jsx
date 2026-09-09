import { useState } from 'react'
import AdminLayout from '../../components/admin/AdminLayout.jsx'
import Button from '../../components/Button.jsx'
import { useAuth } from '../../context/AuthContext.jsx'
import { supabase } from '../../lib/supabase.js'

export default function AdminSettings() {
  const { profile } = useAuth()
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  async function handleChangePassword(e) {
    e.preventDefault()
    setError('')
    setSuccess('')

    if (newPassword.length < 8) {
      setError('New password must be at least 8 characters.')
      return
    }
    if (newPassword !== confirmPassword) {
      setError('New password and confirmation do not match.')
      return
    }

    setSaving(true)

    // Re-verify the current password before allowing the change,
    // since Supabase's updateUser doesn't require it by itself.
    const { error: reauthError } = await supabase.auth.signInWithPassword({
      email: profile.email,
      password: currentPassword,
    })

    if (reauthError) {
      setSaving(false)
      setError('Current password is incorrect.')
      return
    }

    const { error: updateError } = await supabase.auth.updateUser({ password: newPassword })

    setSaving(false)
    if (updateError) {
      setError(updateError.message)
      return
    }

    setSuccess('Password updated.')
    setCurrentPassword('')
    setNewPassword('')
    setConfirmPassword('')
  }

  return (
    <AdminLayout>
      <h1 className="text-2xl md:text-3xl font-bold">Settings</h1>

      <div className="mt-8 bg-white rounded-lg border border-cream-light p-8 max-w-md space-y-5 text-sm">
        <div className="flex justify-between border-b border-cream-light pb-3">
          <span className="text-grey-medium">Name</span>
          <span className="font-medium">{profile?.full_name}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-grey-medium">Email</span>
          <span className="font-medium">{profile?.email}</span>
        </div>
      </div>

      <div className="mt-8 bg-white rounded-lg border border-cream-light p-8 max-w-md">
        <h2 className="font-heading font-semibold text-lg mb-6">Change Password</h2>
        <form onSubmit={handleChangePassword} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1.5">Current Password</label>
            <input
              type="password"
              required
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="focus-ring w-full rounded border border-cream-light px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1.5">New Password</label>
            <input
              type="password"
              required
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="focus-ring w-full rounded border border-cream-light px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1.5">Confirm New Password</label>
            <input
              type="password"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="focus-ring w-full rounded border border-cream-light px-3 py-2 text-sm"
            />
          </div>

          {error && <p className="text-sm text-red-600">{error}</p>}
          {success && <p className="text-sm text-green-700">{success}</p>}

          <Button type="submit" variant="primary" className="w-full" disabled={saving}>
            {saving ? 'Updating...' : 'Update Password'}
          </Button>
        </form>
      </div>
    </AdminLayout>
  )
}
