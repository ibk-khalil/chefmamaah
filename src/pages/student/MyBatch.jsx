import StudentLayout from '../../components/student/StudentLayout.jsx'
import { useAuth } from '../../context/AuthContext.jsx'

export default function MyBatch() {
  const { profile } = useAuth()
  const batch = profile?.batch

  return (
    <StudentLayout>
      <h1 className="text-2xl md:text-3xl font-bold">My Batch</h1>

      {!batch ? (
        <p className="mt-8 text-sm text-grey-medium bg-white rounded-lg p-6 border border-cream-light">
          You haven't been assigned to a batch yet. Contact FoodWorld admin for access.
        </p>
      ) : (
        <div className="mt-8 bg-white rounded-lg border border-cream-light p-8 max-w-xl">
          <div className="flex items-center justify-between">
            <h2 className="font-heading font-bold text-xl">{batch.name}</h2>
            <span
              className={`text-xs font-medium px-3 py-1 rounded-full capitalize ${
                batch.status === 'active'
                  ? 'bg-green-100 text-green-700'
                  : batch.status === 'upcoming'
                  ? 'bg-cream-light text-charcoal-text'
                  : 'bg-grey-medium/20 text-grey-medium'
              }`}
            >
              {batch.status}
            </span>
          </div>

          <dl className="mt-6 space-y-4 text-sm">
            <div className="flex justify-between border-b border-cream-light pb-3">
              <dt className="text-grey-medium">Class Type</dt>
              <dd className="font-medium">{batch.class_type}</dd>
            </div>
            <div className="flex justify-between border-b border-cream-light pb-3">
              <dt className="text-grey-medium">Start Date</dt>
              <dd className="font-medium">{batch.start_date || '—'}</dd>
            </div>
            <div className="flex justify-between border-b border-cream-light pb-3">
              <dt className="text-grey-medium">End Date</dt>
              <dd className="font-medium">{batch.end_date || '—'}</dd>
            </div>
          </dl>

          {batch.description && (
            <p className="mt-6 text-sm text-charcoal-text/80 leading-relaxed">{batch.description}</p>
          )}
        </div>
      )}
    </StudentLayout>
  )
}
