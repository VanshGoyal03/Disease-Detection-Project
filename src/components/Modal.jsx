import { useEffect } from 'react'

/**
 * Reusable Modal component.
 * Controlled by `isOpen` state from parent.
 * Closes on overlay click or ESC key.
 */
export default function Modal({ isOpen, onClose, title, children }) {
  // Close on ESC
  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onClose() }
    if (isOpen) window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [isOpen, onClose])

  // Prevent body scroll when modal open
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [isOpen])

  if (!isOpen) return null

  return (
    <div
      className="modal-overlay"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      onClick={onClose}
    >
      <div
        className="glass w-full max-w-md p-8 relative fade-up"
        onClick={e => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white text-2xl leading-none transition-colors"
          aria-label="Close modal"
        >
          ×
        </button>

        {/* Title */}
        {title && (
          <h2
            id="modal-title"
            className="font-poppins text-xl font-bold text-green-300 mb-6"
          >
            {title}
          </h2>
        )}

        {children}
      </div>
    </div>
  )
}
