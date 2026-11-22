const INK = '#12324a'

function Goldfish() {
  return (
    <g className="companion-float">
      <path d="M14 30q16-18 34 0q-18 18-34 0z" fill="#f59a3c" />
      <path d="M14 30l-12-10v20z" fill="#f2c230" />
      <path d="M30 18q4-8 10-6q-2 6-6 8z" fill="#f2c230" />
      <circle cx="40" cy="28" r="2.6" fill={INK} />
      <circle cx="41" cy="27" r="0.9" fill="#fff" />
      <path d="M24 26q2 4 0 8" stroke="#fff" strokeWidth="1.4" fill="none" opacity="0.6" />
      <g fill="none" stroke="#9fd8f0" strokeWidth="1.2">
        <circle cx="54" cy="18" r="2.4" />
        <circle cx="58" cy="10" r="1.6" />
      </g>
    </g>
  )
}

function Duckling() {
  return (
    <g className="companion-walk">
      <ellipse cx="30" cy="58" rx="16" ry="2.4" fill={INK} opacity="0.1" />
      <ellipse cx="28" cy="44" rx="16" ry="12" fill="#ffd84d" />
      <circle cx="40" cy="28" r="10" fill="#ffd84d" />
      <path d="M48 28l9 2-9 3z" fill="#f59a3c" />
      <circle cx="42" cy="26" r="1.8" fill={INK} />
      <path d="M18 42q6 6 14 2" stroke="#e8b92c" strokeWidth="2" fill="none" strokeLinecap="round" />
      <path d="M24 55v3M32 55v3" stroke="#f59a3c" strokeWidth="2.4" strokeLinecap="round" />
    </g>
  )
}

function Cloud() {
  return (
    <g className="companion-float">
      <g fill="#fff" stroke="#d8e6ef" strokeWidth="1.2">
        <circle cx="20" cy="26" r="11" />
        <circle cx="34" cy="20" r="14" />
        <circle cx="48" cy="28" r="10" />
        <rect x="12" y="26" width="44" height="12" rx="6" stroke="none" />
      </g>
      <circle cx="28" cy="26" r="1.8" fill={INK} />
      <circle cx="40" cy="26" r="1.8" fill={INK} />
      <path d="M31 31q3 3 6 0" stroke={INK} strokeWidth="1.4" fill="none" strokeLinecap="round" />
      <g stroke="#7fc6e8" strokeWidth="1.6" strokeLinecap="round">
        <path d="M22 44l-2 6M34 44l-2 6M46 44l-2 6" />
      </g>
    </g>
  )
}

function Turtle() {
  return (
    <g className="companion-walk">
      <ellipse cx="30" cy="58" rx="20" ry="2.4" fill={INK} opacity="0.1" />
      <path d="M8 52q4-22 24-22t24 22z" fill="#4f9a5b" />
      <path d="M18 50q2-12 14-12t14 12M32 38v14" stroke="#3b7a47" strokeWidth="1.6" fill="none" />
      <circle cx="56" cy="46" r="7" fill="#8fc78a" />
      <circle cx="58" cy="44" r="1.6" fill={INK} />
      <path d="M14 52v5M46 52v5" stroke="#8fc78a" strokeWidth="5" strokeLinecap="round" />
    </g>
  )
}

const COMPANIONS = { goldfish: Goldfish, duckling: Duckling, cloud: Cloud, turtle: Turtle }

export default function Companion({ id, size = 56 }) {
  const Body = COMPANIONS[id]
  if (!Body) return null
  return (
    <svg className={`companion companion-${id}`} viewBox="0 0 64 64" width={size} height={size} aria-hidden="true">
      <Body />
    </svg>
  )
}
