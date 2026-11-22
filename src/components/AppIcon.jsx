const VARIANTS = {
  classic: { bg: ['#0b3a5c', '#1592c0'], drop: ['#ffffff', '#bfeefd'], ink: '#0b3a5c', sparkle: '#9fe3ff' },
  night: { bg: ['#0b1030', '#3a2a7a'], drop: ['#e8f7ff', '#8fd7f4'], ink: '#0b1030', sparkle: '#ffe08a' },
  sunset: { bg: ['#f6b26b', '#d0503a'], drop: ['#ffffff', '#ffe3cc'], ink: '#6a2a1c', sparkle: '#fff3c4' },
  mint: { bg: ['#d9f6e6', '#58c294'], drop: ['#ffffff', '#c8f1ff'], ink: '#14543e', sparkle: '#ffffff' },
}

export default function AppIcon({ id = 'classic', size = 64 }) {
  const v = VARIANTS[id] || VARIANTS.classic
  const g = `appicon-${id}`
  return (
    <svg viewBox="18 18 72 72" width={size} height={size} aria-hidden="true" style={{ borderRadius: size * 0.24 }}>
      <defs>
        <linearGradient id={`${g}b`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor={v.bg[0]} />
          <stop offset="1" stopColor={v.bg[1]} />
        </linearGradient>
        <linearGradient id={`${g}d`} x1="0.3" y1="0" x2="0.7" y2="1">
          <stop offset="0" stopColor={v.drop[0]} />
          <stop offset="1" stopColor={v.drop[1]} />
        </linearGradient>
      </defs>
      <rect x="18" y="18" width="72" height="72" fill={`url(#${g}b)`} />
      <path d="M54 26C61.5 37.3 71.8 47.6 71.8 59.8a17.8 17.8 0 0 1-35.6 0C36.2 47.6 46.5 37.3 54 26z" fill={`url(#${g}d)`} />
      <path d="M44.5 52c1.2-4.6 3.8-8.6 6.8-12.4" stroke="#fff" strokeWidth="2.4" strokeLinecap="round" fill="none" />
      <ellipse cx="48.6" cy="58" rx="2.1" ry="2.7" fill={v.ink} />
      <ellipse cx="59.4" cy="58" rx="2.1" ry="2.7" fill={v.ink} />
      <path d="M50.2 63.2q3.8 3.8 7.6 0" stroke={v.ink} strokeWidth="1.5" strokeLinecap="round" fill="none" />
      <path d="M75 32l1.2 3 3 1.2-3 1.2-1.2 3-1.2-3-3-1.2 3-1.2z" fill={v.sparkle} />
    </svg>
  )
}
