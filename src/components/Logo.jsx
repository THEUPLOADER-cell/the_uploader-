import { useId } from 'react'

export default function Logo({ className = 'w-10 h-10', variant = 'full' }) {
  const uid = useId()
  const bg = `tuBg-${uid}`
  const stroke = `tuStroke-${uid}`
  const glow = `tuGlow-${uid}`
  return (
    <svg
      className={className}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <defs>
        <linearGradient id={bg} x1="6" y1="8" x2="42" y2="44" gradientUnits="userSpaceOnUse">
          <stop stopColor="#0b0f1a" />
          <stop offset="1" stopColor="#14102a" />
        </linearGradient>
        <linearGradient id={stroke} x1="8" y1="10" x2="40" y2="38" gradientUnits="userSpaceOnUse">
          <stop stopColor="#00D4FF" />
          <stop offset="0.55" stopColor="#FF4FD8" />
          <stop offset="1" stopColor="#A3FF12" />
        </linearGradient>
        <radialGradient id={glow} cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(24 18) rotate(90) scale(18 22)">
          <stop stopColor="#00D4FF" stopOpacity="0.22" />
          <stop offset="1" stopColor="#00D4FF" stopOpacity="0" />
        </radialGradient>
      </defs>
      {/* background tile (omit for subtle hero mark) */}
      {variant === 'full' && (
        <>
          <rect width="48" height="48" rx="12" fill={`url(#${bg})`} />
          <rect x="1" y="1" width="46" height="46" rx="11" stroke={`url(#${stroke})`} strokeWidth="1.4" opacity="0.85" />
        </>
      )}
      <circle cx="24" cy="18" r="18" fill={`url(#${glow})`} opacity={variant === 'full' ? 1 : 0.85} />

      {/* cloud outline */}
      <path
        d="M18.2 30.2h10.7c3.1 0 5.6-2.2 5.6-5.1 0-2.6-1.9-4.6-4.4-5
           -.7-3.1-3.6-5.4-7-5.4-3.8 0-6.9 2.8-7.2 6.3
           -2.4.5-4.2 2.5-4.2 5 0 2.8 2.4 4.2 4.5 4.2Z"
        fill="rgba(255,255,255,0.04)"
        stroke={`url(#${stroke})`}
        strokeWidth="2.2"
        strokeLinejoin="round"
        strokeLinecap="round"
      />

      {/* upload arrow (minimal) */}
      <path
        d="M24 30v-9m0 0l-3.2 3.2M24 21l3.2 3.2"
        stroke="rgba(255,255,255,0.92)"
        strokeWidth="2.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* subtle base bar */}
      <path d="M19.5 31.8h9" stroke="rgba(255,255,255,0.28)" strokeWidth="2" strokeLinecap="round" />
    </svg>
  )
}
