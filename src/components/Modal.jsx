import { X } from 'lucide-react'

export default function Modal({ title, onClose, children }) {
  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center px-4 py-8 overflow-y-auto">
      <div className="bg-white rounded-lg w-full max-w-lg my-auto">
        <div className="flex items-center justify-between px-6 py-4 border-b border-cream-light">
          <h2 className="font-heading font-semibold text-lg">{title}</h2>
          <button onClick={onClose} className="focus-ring rounded p-1 text-grey-medium hover:text-charcoal-deep">
            <X size={20} />
          </button>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>
  )
}
