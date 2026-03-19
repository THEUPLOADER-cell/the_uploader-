import { memo } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'

function ToolCard({ to, title, description, icon: Icon, featured = false }) {
  const padding = featured ? 'p-7 sm:p-8' : 'p-6'
  const iconSize = featured ? 28 : 24
  const titleSize = featured ? 'text-xl' : 'text-lg'

  return (
    <Link to={to} className="h-full">
      <motion.article
        whileHover={{ y: -4 }}
        whileTap={{ scale: 0.98 }}
        className={`h-full flex flex-col justify-between ${padding} rounded-2xl bg-dark-700/95 border border-dark-600 hover:border-accent-primary/60 hover:shadow-glow transition-shadow`}
      >
        <div className="w-12 h-12 rounded-xl bg-accent-primary/20 flex items-center justify-center text-accent-primary mb-4">
          {Icon && <Icon size={iconSize} />}
        </div>
        <h3 className={`font-display font-semibold ${titleSize} text-white`}>{title}</h3>
        <p className="mt-2 text-slate-400 text-sm">{description}</p>
      </motion.article>
    </Link>
  )
}

export default memo(ToolCard)
