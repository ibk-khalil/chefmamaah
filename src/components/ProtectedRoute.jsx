import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'

export default function ProtectedRoute({ children }) {
  const { session, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center text-grey-medium text-sm">
        Loading...
      </div>
    )
  }

  if (!session) {
    return <Navigate to="/student-portal/login" replace />
  }

  return children
}
