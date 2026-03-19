import { memo } from 'react'
import { motion } from 'framer-motion'
import { ArrowUpCircle, Shield, Lock, Maximize2, RefreshCw, FileDown } from 'lucide-react'
import { Link } from 'react-router-dom'
import Logo from './Logo'

function Hero() {
  const baseBtn =
    'inline-flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-colors border shadow-card'
  const primaryBtn = `${baseBtn} bg-dark-700 border-dark-500 text-white hover:bg-dark-600`
  const highlightBtn = `${baseBtn} bg-accent-primary border-accent-primary/40 text-white hover:bg-accent-secondary shadow-glow`

  return (
    <section className="relative overflow-hidden py-20 sm:py-28">
      {/* premium background mark (CSS animated, lightweight) */}
      <div aria-hidden className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(99,102,241,0.10),transparent_55%)]" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="hero-mark">
            <div className="hero-mark__halo" />
            <Logo variant="mark" className="hero-mark__logo" />
          </div>
        </div>
      </div>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-dark-700 border border-dark-500 text-slate-300 text-sm mb-6"
        >
          <Shield size={16} className="text-emerald-400" />
          <span>100% client-side processing</span>
        </motion.div>
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold text-white tracking-tight"
        >
          THE UPLOADER
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mt-4 text-xl text-slate-400 max-w-2xl mx-auto"
        >
          Upload. Fix. Download. The easiest way to fix your files.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.25 }}
          className="mt-5 inline-flex items-center gap-2 rounded-full bg-emerald-500/10 border border-emerald-500/40 px-4 py-2 text-sm text-emerald-200"
        >
          <Lock size={16} className="text-emerald-300" />
          <span className="font-medium">
            100% Free Tools • No Login Required • Your Files Stay Private
          </span>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-8 flex flex-wrap justify-center gap-4"
        >
          <Link
            to="/image-to-pdf"
            className={highlightBtn}
          >
            <ArrowUpCircle size={20} />
            Get started
          </Link>
          <Link
            to="/pdf-compressor"
            className={primaryBtn}
          >
            <FileDown size={20} />
            Compress PDF
          </Link>
          <Link
            to="/image-resizer"
            className={primaryBtn}
          >
            <Maximize2 size={20} />
            Image Resizer
          </Link>
          <Link
            to="/image-format-converter"
            className={primaryBtn}
          >
            <RefreshCw size={20} />
            Image Format Converter
          </Link>
        </motion.div>
      </div>
    </section>
  )
}

export default memo(Hero)
