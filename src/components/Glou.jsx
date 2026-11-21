import './Glou.css'

const MOUTHS = {
  sleepy: <path d="M54 80q6 3 12 0" fill="none" stroke="#12324a" strokeWidth="3" strokeLinecap="round" />,
  thirsty: <path d="M52 84q8-7 16 0" fill="none" stroke="#12324a" strokeWidth="3" strokeLinecap="round" />,
  happy: <path d="M50 78q10 10 20 0" fill="none" stroke="#12324a" strokeWidth="3" strokeLinecap="round" />,
  proud: <path d="M48 76q12 16 24 0z" fill="#12324a" />,
}

function Eyes({ mood }) {
  if (mood === 'sleepy')
    return (
      <g stroke="#12324a" strokeWidth="3" strokeLinecap="round" fill="none">
        <path d="M40 64q5 4 10 0" />
        <path d="M70 64q5 4 10 0" />
      </g>
    )
  if (mood === 'proud')
    return (
      <g stroke="#12324a" strokeWidth="3" strokeLinecap="round" fill="none">
        <path d="M40 66q5-6 10 0" />
        <path d="M70 66q5-6 10 0" />
      </g>
    )
  return (
    <g className="glou-eyes" fill="#12324a">
      <ellipse cx="45" cy="64" rx="5" ry="6.5" />
      <ellipse cx="75" cy="64" rx="5" ry="6.5" />
      <circle cx="47" cy="61.5" r="1.8" fill="#fff" />
      <circle cx="77" cy="61.5" r="1.8" fill="#fff" />
    </g>
  )
}

export default function Glou({ mood = 'happy', size = 120 }) {
  return (
    <svg className={`glou glou-${mood}`} viewBox="0 0 120 130" width={size} height={size * (130 / 120)} role="img" aria-label="Glou">
      <defs>
        <linearGradient id="glou-body" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor="#8fd7f4" />
          <stop offset="1" stopColor="#2c98c8" />
        </linearGradient>
      </defs>
      <ellipse cx="60" cy="124" rx="30" ry="5" fill="#12324a" opacity="0.08" />
      <path d="M60 6C76 30 98 52 98 78a38 38 0 0 1-76 0C22 52 44 30 60 6z" fill="url(#glou-body)" />
      <path d="M38 56c3-10 9-19 16-28" stroke="#fff" strokeWidth="5" strokeLinecap="round" opacity="0.55" fill="none" />
      <Eyes mood={mood} />
      <circle cx="36" cy="76" r="5" fill="#f08a7a" opacity="0.45" />
      <circle cx="84" cy="76" r="5" fill="#f08a7a" opacity="0.45" />
      {MOUTHS[mood]}
      {mood === 'thirsty' && <path d="M90 40q4 6 0 10q-4-4 0-10z" fill="#8fd7f4" />}
      {mood === 'sleepy' && (
        <text x="88" y="34" fontSize="14" fontWeight="900" fill="#5b7487">
          z
        </text>
      )}
    </svg>
  )
}
