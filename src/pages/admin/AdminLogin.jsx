import { useState } from 'react'
import { useNavigate, Navigate } from 'react-router-dom'
import { ChefHat } from 'lucide-react'
import Button from '../../components/Button.jsx'
import { useAuth } from '../../context/AuthContext.jsx'

export default function AdminLogin() {
  const { signIn, session, profile } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  if (session && profile?.role === 'admin') {
    return <Navigate to="/admin/dashboard" replace />
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setSubmitting(true)
    const { error } = await signIn(email, password)
    setSubmitting(false)
    if (error) {
      setError('Incorrect email or password.')
      return
    }
    navigate('/admin/dashboard')
  }

  return (
    <div className="min-h-screen bg-charcoal-deep flex items-center justify-center px-5">
      <div className="bg-white rounded-lg p-8 md:p-10 w-full max-w-md">
        <div className="flex items-center gap-2 mb-8">
          <ChefHat size={22} className="text-champagne" />
          <span className="font-heading font-semibold text-lg">FoodWorld Admin</span>
        </div>

        <h1 className="text-2xl font-bold">Admin Sign In</h1>
        <p className="text-sm text-grey-medium mt-2">Manage batches, students, and recipes.</p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-5">
          <div>
            <label htmlFor="email" className="block text-sm font-medium mb-2">Email</label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="focus-ring w-full rounded border border-cream-light px-4 py-3 text-sm"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium mb-2">Password</label>
            <input
              id="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="focus-ring w-full rounded border border-cream-light px-4 py-3 text-sm"
            />
          </div>

          {error && <p className="text-sm text-red-600">{error}</p>}

          <Button type="submit" variant="primary" className="w-full" disabled={submitting}>
            {submitting ? 'Signing In...' : 'Sign In'}
          </Button>
        </form>
      </div>
    </div>
  )
}
