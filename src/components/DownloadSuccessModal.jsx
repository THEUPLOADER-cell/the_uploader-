import { motion, AnimatePresence } from 'framer-motion'
import { Link } from 'react-router-dom'
import { useEffect } from 'react'

export default function DownloadSuccessModal({ open, onClose, onDownloadAgain }) {
  // Handle ESC key to close modal
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape' && open) {
        onClose()
      }
    }
    if (open) {
      window.addEventListener('keydown', handleEsc)
      return () => window.removeEventListener('keydown', handleEsc)
    }
  }, [open, onClose])

  // Close modal when clicking outside (on overlay)
  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

  return (
    <AnimatePresence mode="wait">
      {open && (
        <motion.div
          onClick={handleOverlayClick}
          className="fixed inset-0 z-40 flex items-center justify-center bg-black/60 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="w-full max-w-md rounded-2xl bg-dark-800 border border-dark-600 p-6 shadow-glow relative"
          >
            {/* Close button */}
            <motion.button
              type="button"
              onClick={onClose}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-200 transition-colors text-2xl leading-none"
              aria-label="Close modal"
            >
              ✕
            </motion.button>

            <div className="text-3xl mb-2">✅</div>
            <h2 className="font-display text-xl font-semibold text-white mb-2">
              Your file has been processed
            </h2>
            <p className="text-slate-300 text-sm mb-6">
              Your file has been successfully processed and downloaded.
              <br />
              Thank you for using THE UPLOADER.
            </p>
            <div className="flex flex-wrap gap-3">
              {onDownloadAgain && (
                <button
                  type="button"
                  onClick={onDownloadAgain}
                  className="px-4 py-2 rounded-xl bg-accent-primary text-white text-sm font-medium hover:bg-accent-secondary transition-colors"
                >
                  Download again
                </button>
              )}
              <Link
                to="/"
                onClick={onClose}
                className="px-4 py-2 rounded-xl bg-dark-700 text-slate-200 text-sm font-medium hover:bg-dark-600 border border-dark-500 transition-colors"
              >
                Back to home
              </Link>
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl text-slate-300 text-sm hover:text-white transition-colors"
              >
                Use another tool
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

