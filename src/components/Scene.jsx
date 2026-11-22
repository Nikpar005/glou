import { useId } from 'react'

const STARS = [
  [22, 18, 1.2], [58, 40, 0.9], [96, 14, 1.4], [140, 34, 0.8], [176, 12, 1.1], [214, 44, 1], [252, 20, 1.3], [300, 38, 0.9], [334, 16, 1.2], [120, 62, 0.7], [270, 66, 0.8], [40, 76, 0.7],
]

function Sky({ g }) {
  return (
    <>
      <rect width="360" height="180" fill={`url(#${g}a)`} />
      <circle cx="300" cy="40" r="20" fill="#ffe7a3" />
      <circle cx="300" cy="40" r="30" fill="#ffe7a3" opacity="0.25" />
      <g fill="#fff" opacity="0.9">
        <ellipse cx="80" cy="44" rx="26" ry="9" />
        <ellipse cx="98" cy="38" rx="16" ry="10" />
        <ellipse cx="210" cy="28" rx="20" ry="6" opacity="0.7" />
      </g>
      <path d="M0 140Q90 112 180 132T360 124V180H0z" fill="#a9dca0" />
      <path d="M0 152Q120 134 240 150T360 146V180H0z" fill="#7cc47a" />
    </>
  )
}

function Beach() {
  return (
    <>
      <rect width="360" height="180" fill="#bfe8fb" />
      <circle cx="74" cy="44" r="18" fill="#ffd97a" />
      <rect y="98" width="360" height="40" fill="#3aa8d8" />
      <path d="M0 104q30-6 60 0t60 0 60 0 60 0 60 0 60 0" stroke="#fff" strokeWidth="2" fill="none" opacity="0.6" />
      <path d="M0 132Q180 120 360 134V180H0z" fill="#f4dca6" />
      <path d="M300 150q-6-40 6-74" stroke="#8a5a33" strokeWidth="6" fill="none" strokeLinecap="round" />
      <g fill="#4f9a5b">
        <path d="M306 76q-30-6-44 10q22-4 44-10z" />
        <path d="M306 76q26-12 44 2q-24-2-44-2z" />
        <path d="M306 76q-10-24 4-40q0 22-4 40z" />
        <path d="M306 76q22 0 30 20q-18-12-30-20z" />
      </g>
    </>
  )
}

function Mountain() {
  return (
    <>
      <rect width="360" height="180" fill="#dbeaf3" />
      <path d="M0 130L70 50L130 120L200 36L280 118L330 70L360 96V180H0z" fill="#9db6c8" />
      <path d="M70 50L86 68L74 66L62 74zM200 36L220 60L204 56L188 64zM330 70L342 84L330 82L320 88z" fill="#fff" />
      <path d="M0 146Q180 128 360 146V180H0z" fill="#fff" />
      <g fill="#fff">
        {[30, 90, 150, 210, 270, 330, 60, 180, 300].map((x, index) => (
          <circle key={x} cx={x} cy={20 + ((index * 37) % 100)} r="2" opacity="0.9" />
        ))}
      </g>
    </>
  )
}

function City() {
  return (
    <>
      <rect width="360" height="180" fill="#1b2a4a" />
      {STARS.slice(0, 8).map(([x, y, r]) => (
        <circle key={x} cx={x} cy={y} r={r} fill="#fff" opacity="0.7" />
      ))}
      <circle cx="290" cy="36" r="14" fill="#fdf1c7" />
      <circle cx="296" cy="32" r="12" fill="#1b2a4a" />
      <g fill="#2c3e66">
        <rect x="0" y="80" width="40" height="70" />
        <rect x="46" y="60" width="34" height="90" />
        <rect x="86" y="92" width="44" height="58" />
        <rect x="136" y="50" width="30" height="100" />
        <rect x="172" y="84" width="48" height="66" />
        <rect x="226" y="66" width="36" height="84" />
        <rect x="268" y="96" width="40" height="54" />
        <rect x="314" y="74" width="46" height="76" />
      </g>
      <g fill="#ffd97a">
        {[[8, 92], [20, 110], [54, 72], [66, 100], [96, 104], [144, 62], [154, 90], [180, 96], [204, 112], [234, 78], [246, 108], [276, 108], [322, 86], [340, 112]].map(([x, y]) => (
          <rect key={`${x}${y}`} x={x} y={y} width="6" height="8" rx="1" opacity="0.85" />
        ))}
      </g>
      <rect y="148" width="360" height="32" fill="#36486e" />
      <path d="M0 160h360" stroke="#ffd97a" strokeWidth="2" strokeDasharray="14 12" opacity="0.6" />
    </>
  )
}

function Space({ g }) {
  return (
    <>
      <rect width="360" height="180" fill={`url(#${g}s)`} />
      {STARS.map(([x, y, r]) => (
        <circle key={x} cx={x} cy={y} r={r} fill="#fff" />
      ))}
      <circle cx="290" cy="54" r="24" fill="#e07a5f" />
      <ellipse cx="290" cy="54" rx="40" ry="8" fill="none" stroke="#f2c230" strokeWidth="3" transform="rotate(-18 290 54)" />
      <path d="M0 146Q180 124 360 146V180H0z" fill="#c9ccd6" />
      <g fill="#aeb2bf">
        <ellipse cx="40" cy="160" rx="14" ry="4" />
        <ellipse cx="250" cy="158" rx="18" ry="5" />
        <ellipse cx="330" cy="166" rx="10" ry="3" />
      </g>
    </>
  )
}

function Sea({ g }) {
  return (
    <>
      <rect width="360" height="180" fill={`url(#${g}w)`} />
      <g fill="#fff" opacity="0.18">
        <path d="M40 0l30 0l-60 180l-20 0z" />
        <path d="M160 0l24 0l-40 180l-18 0z" />
      </g>
      <g fill="none" stroke="#bfe8fb" strokeWidth="1.5" opacity="0.8">
        <circle cx="300" cy="60" r="5" />
        <circle cx="312" cy="40" r="3" />
        <circle cx="296" cy="24" r="2" />
        <circle cx="60" cy="90" r="4" />
      </g>
      <path d="M0 150Q180 136 360 152V180H0z" fill="#e6d39c" />
      <g stroke="#4f9a5b" strokeWidth="5" fill="none" strokeLinecap="round">
        <path d="M30 152q-10-20 0-40t0-36" />
        <path d="M44 154q8-18 0-34" />
        <path d="M320 152q10-22 0-44t4-30" />
      </g>
      <path d="M250 158l8-12 8 12-8 4z" fill="#f07c8a" />
    </>
  )
}

function Forest() {
  return (
    <>
      <rect width="360" height="180" fill="#e3f2e1" />
      <g fill="#8fc78a">
        <path d="M20 140L50 60L80 140z" />
        <path d="M280 140L310 50L340 140z" />
      </g>
      <g fill="#5fa65d">
        <path d="M60 146L96 40L132 146z" />
        <path d="M230 146L262 56L294 146z" />
        <path d="M320 146L348 70L376 146z" />
      </g>
      <path d="M0 140Q180 126 360 140V180H0z" fill="#79b86f" />
      <g fill="#f07c8a">
        <circle cx="180" cy="160" r="3" />
        <circle cx="210" cy="166" r="2.4" fill="#ffd166" />
        <circle cx="150" cy="168" r="2.4" fill="#fff" />
      </g>
    </>
  )
}

const SCENES = { sky: Sky, beach: Beach, mountain: Mountain, city: City, space: Space, sea: Sea, forest: Forest }

export default function Scene({ id = 'sky', className }) {
  const g = useId().replace(/:/g, '')
  const Body = SCENES[id] || Sky
  return (
    <svg className={className} viewBox="0 0 360 180" preserveAspectRatio="xMidYMax slice" aria-hidden="true">
      <defs>
        <linearGradient id={`${g}a`} x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor="#bfe6fa" />
          <stop offset="1" stopColor="#eaf7fd" />
        </linearGradient>
        <linearGradient id={`${g}s`} x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor="#0b1030" />
          <stop offset="1" stopColor="#2a2160" />
        </linearGradient>
        <linearGradient id={`${g}w`} x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor="#4fb6e0" />
          <stop offset="1" stopColor="#1a6f9e" />
        </linearGradient>
      </defs>
      <Body g={g} />
    </svg>
  )
}
