import { motion, useReducedMotion } from 'framer-motion'
import Logo from './Logo'

export default function AnimatedBackground() {
  const prefersReducedMotion = useReducedMotion()

  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <motion.div
        aria-hidden
        className="absolute inset-0 flex items-center justify-center"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
      >
        <motion.div
          animate={prefersReducedMotion ? undefined : { y: [-16, 16, -16] }}
          transition={prefersReducedMotion ? undefined : { duration: 14, repeat: Infinity, ease: 'easeInOut' }}
          className="relative"
        >
          <div className="absolute inset-0 blur-2xl opacity-50 bg-gradient-to-r from-cyan-500/18 via-fuchsia-500/18 to-lime-400/18 rounded-[96px]" />
          <div className="relative mix-blend-screen">
            <Logo
              variant="mark"
              className="w-[900px] h-[900px] sm:w-[1100px] sm:h-[1100px] md:w-[1300px] md:h-[1300px] opacity-[0.22]"
            />
          </div>
        </motion.div>
      </motion.div>
      <div className="absolute inset-0 bg-gradient-to-b from-accent-primary/5 via-dark-900/40 to-dark-900" />
    </div>
  )
}

