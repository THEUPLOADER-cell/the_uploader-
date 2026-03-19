import { memo } from 'react'
import { motion } from 'framer-motion'
import { Helmet } from 'react-helmet-async'

function ToolLayout({ title, description, children }) {
  return (
    <>
      <Helmet>
        <title>{title} | THE UPLOADER</title>
        <meta name="description" content={description} />
      </Helmet>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12"
      >
        <div className="mb-8">
          <h1 className="font-display text-2xl sm:text-3xl font-bold text-white">{title}</h1>
          <p className="mt-2 text-slate-400">{description}</p>
          <div className="mt-4 rounded-2xl bg-dark-700/60 border border-dark-600 px-4 py-3">
            <p className="text-slate-300 text-sm">Your files never leave your device.</p>
            <p className="text-slate-400 text-sm">We do NOT store, back up, or access your files or data.</p>
            <p className="text-slate-400 text-sm">All processing happens on your device to keep your files safe.</p>
          </div>
        </div>
        <div className="rounded-2xl bg-dark-800 border border-dark-600 p-6 sm:p-8 shadow-card">
          {children}
        </div>
      </motion.div>
    </>
  )
}

export default memo(ToolLayout)
