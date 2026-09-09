import { useState } from 'react'
import { useNavigate, Navigate } from 'react-router-dom'
import { ChefHat } from 'lucide-react'
import Button from '../../components/Button.jsx'
import { useAuth } from '../../context/AuthContext.jsx'
import { supabase } from '../../lib/supabase.js'

export default function StudentLogin() {
  const { signIn, session } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [resetMessage, setResetMessage] = useState('')

  if (session) return <Navigate to="/student-portal/dashboard" replace />

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setSubmitting(true)
    const { error } = await signIn(email, password)
    setSubmitting(false)
    if (error) {
      setError('Incorrect email or password. Please try again.')
      return
    }
    navigate('/student-portal/dashboard')
  }

  async function handleForgotPassword() {
    setResetMessage('')
    if (!email) {
      setResetMessage('Enter your email above first, then tap "Forgot Password".')
      return
    }
    const { error } = await supabase.auth.resetPasswordForEmail(email)
    setResetMessage(
      error ? 'Could not send reset email. Please try again.' : 'Password reset link sent to your email.'
    )
  }

  return (
    <div className="min-h-screen bg-charcoal-deep flex items-center justify-center px-5">
      <div className="bg-white rounded-lg p-8 md:p-10 w-full max-w-md">
        <div className="flex items-center gap-2 mb-8">
          <ChefHat size={22} className="text-champagne" />
          <span className="font-heading font-semibold text-lg">FoodWorld Student Portal</span>
        </div>

        <h1 className="text-2xl font-bold">Sign In</h1>
        <p className="text-sm text-grey-medium mt-2">
          Sign in to access your FoodWorld culinary recipes.
        </p>

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
              placeholder="you@example.com"
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
              placeholder="••••••••"
            />
          </div>

          {error && <p className="text-sm text-red-600">{error}</p>}

          <Button type="submit" variant="primary" className="w-full" disabled={submitting}>
            {submitting ? 'Signing In...' : 'Sign In'}
          </Button>

          <p className="text-center text-sm text-grey-medium">
            <button
              type="button"
              onClick={handleForgotPassword}
              className="focus-ring hover:text-charcoal-deep underline underline-offset-2"
            >
              Forgot Password
            </button>
          </p>
          {resetMessage && <p className="text-center text-xs text-grey-medium">{resetMessage}</p>}
        </form>

        <p className="text-xs text-grey-medium mt-8 text-center">
          Accounts are created by FoodWorld admin. Contact us on WhatsApp if you need access.
        </p>
      </div>
    </div>
  )
}
