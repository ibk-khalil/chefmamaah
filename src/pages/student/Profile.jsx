import StudentLayout from '../../components/student/StudentLayout.jsx'
import { useAuth } from '../../context/AuthContext.jsx'

export default function Profile() {
  const { profile } = useAuth()

  return (
    <StudentLayout>
      <h1 className="text-2xl md:text-3xl font-bold">Profile</h1>

      <div className="mt-8 bg-white rounded-lg border border-cream-light p-8 max-w-md space-y-5 text-sm">
        <div className="flex justify-between border-b border-cream-light pb-3">
          <span className="text-grey-medium">Full Name</span>
          <span className="font-medium">{profile?.full_name}</span>
        </div>
        <div className="flex justify-between border-b border-cream-light pb-3">
          <span className="text-grey-medium">Email</span>
          <span className="font-medium">{profile?.email}</span>
        </div>
        <div className="flex justify-between border-b border-cream-light pb-3">
          <span className="text-grey-medium">Phone</span>
          <span className="font-medium">{profile?.phone || '—'}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-grey-medium">Batch</span>
          <span className="font-medium">{profile?.batch?.name || 'Not assigned'}</span>
        </div>
      </div>

      <p className="text-xs text-grey-medium mt-4">
        To update your details, contact FoodWorld admin on WhatsApp.
      </p>
    </StudentLayout>
  )
}
