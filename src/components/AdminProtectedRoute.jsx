import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'

export default function AdminProtectedRoute({ children }) {
  const { session, profile, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center text-grey-medium text-sm">
        Loading...
      </div>
    )
  }

  if (!session) return <Navigate to="/admin/login" replace />
  if (profile && profile.role !== 'admin') return <Navigate to="/admin/login" replace />

  return children
}
