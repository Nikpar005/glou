import { useId } from 'react'
import { OUTFITS } from '../lib/outfits.js'
import './Glou.css'

const INK = '#12324a'
const LIMB = '#2a86c2'
const HAND = '#4aa8dc'
const BODY = 'M60 6C76 30 98 52 98 78a38 38 0 0 1-76 0C22 52 44 30 60 6z'
const VIEW = { x: -24, y: -38, width: 168, height: 190 }
const HELD = new Set(['umbrella', 'icecream', 'flag', 'heart', 'wand'])

const HANDS = {
  happy: [
    [10, 104],
    [114, 60],
  ],
  proud: [
    [4, 54],
    [116, 54],
  ],
  thirsty: [
    [14, 108],
    [106, 108],
  ],
  sleepy: [
    [20, 112],
    [100, 112],
  ],
}

const SLEEVES = { sweater: '#d6455c', raincoat: '#f2c230', apron: LIMB }

function Arm({ from, to, color }) {
  const [x1, y1] = from
  const [x2, y2] = to
  const cx = (x1 + x2) / 2 + (x2 < 60 ? -6 : 6)
  const cy = Math.max(y1, y2) - 4
  return (
    <g>
      <path d={`M${x1} ${y1}Q${cx} ${cy} ${x2} ${y2}`} stroke={color} strokeWidth="7" strokeLinecap="round" fill="none" />
      <circle cx={x2} cy={y2} r="5.5" fill={HAND} />
    </g>
  )
}

function Legs({ boots }) {
  return (
    <g>
      <path d="M49 110L46 130M71 110L74 130" stroke={LIMB} strokeWidth="7" strokeLinecap="round" />
      {boots ? (
        <g fill="#f2c230" stroke="#c99a12" strokeWidth="1.5">
          <path d="M39 122h13v10q0 5-5 5h-13q-4 0-4-4t5-4h4z" />
          <path d="M68 122h13v8h4q5 0 5 4t-4 4h-13q-5 0-5-5z" />
        </g>
      ) : (
        <g fill={INK}>
          <ellipse cx="41" cy="133" rx="9" ry="5" />
          <ellipse cx="79" cy="133" rx="9" ry="5" />
          <ellipse cx="38" cy="131" rx="3" ry="1.4" fill="#fff" opacity="0.35" />
          <ellipse cx="76" cy="131" rx="3" ry="1.4" fill="#fff" opacity="0.35" />
        </g>
      )}
    </g>
  )
}

function Eyes({ mood }) {
  if (mood === 'sleepy')
    return (
      <g stroke={INK} strokeWidth="3" strokeLinecap="round" fill="none">
        <path d="M40 64q5 4 10 0" />
        <path d="M70 64q5 4 10 0" />
      </g>
    )
  if (mood === 'proud')
    return (
      <g stroke={INK} strokeWidth="3" strokeLinecap="round" fill="none">
        <path d="M40 66q5-6 10 0" />
        <path d="M70 66q5-6 10 0" />
      </g>
    )
  return (
    <g className="glou-eyes" fill={INK}>
      <ellipse cx="45" cy="64" rx="5.2" ry="6.8" />
      <ellipse cx="75" cy="64" rx="5.2" ry="6.8" />
      <circle cx="47" cy="61.2" r="2" fill="#fff" />
      <circle cx="77" cy="61.2" r="2" fill="#fff" />
    </g>
  )
}

const MOUTHS = {
  sleepy: <path d="M54 81q6 3 12 0" fill="none" stroke={INK} strokeWidth="3" strokeLinecap="round" />,
  thirsty: <path d="M52 85q8-7 16 0" fill="none" stroke={INK} strokeWidth="3" strokeLinecap="round" />,
  happy: <path d="M50 79q10 10 20 0" fill="none" stroke={INK} strokeWidth="3" strokeLinecap="round" />,
  proud: (
    <g>
      <path d="M48 77q12 16 24 0z" fill={INK} />
      <path d="M53 83q7 4 14 0q-7 5-14 0z" fill="#f07c8a" />
    </g>
  ),
}

function Cape({ color }) {
  return <path d="M30 80Q16 112 12 134Q60 146 108 134Q104 112 90 80z" fill={color} />
}

function Garments({ parts, clip }) {
  return (
    <g clipPath={`url(#${clip})`}>
      {parts.includes('sweater') && (
        <g>
          <rect x="16" y="94" width="88" height="30" fill="#d6455c" />
          <path d="M16 104l6 5 6-5 6 5 6-5 6 5 6-5 6 5 6-5 6 5 6-5 6 5 6-5 6 5 6-5" stroke="#fff" strokeWidth="2.2" fill="none" strokeLinejoin="round" />
          <path d="M16 113h88" stroke="#b8344a" strokeWidth="2" />
        </g>
      )}
      {parts.includes('raincoat') && (
        <g>
          <rect x="16" y="92" width="88" height="32" fill="#f2c230" />
          <path d="M60 92v32" stroke="#c99a12" strokeWidth="1.6" />
          <circle cx="64" cy="100" r="1.8" fill="#c99a12" />
          <circle cx="64" cy="109" r="1.8" fill="#c99a12" />
        </g>
      )}
      {parts.includes('apron') && (
        <g>
          <path d="M40 90h40v34H40z" fill="#fff" />
          <rect x="52" y="102" width="16" height="9" rx="2" fill="none" stroke="#cfd8e0" strokeWidth="1.5" />
        </g>
      )}
    </g>
  )
}

function Face({ parts }) {
  return (
    <g>
      {parts.includes('sunglasses') && (
        <g>
          <path d="M34 59h20q2 0 2 3q-1 10-11 10q-10 0-11-10q0-3 0-3zM66 59h20q0 0 0 3q-1 10-11 10q-10 0-11-10q0-3 2-3z" fill="#16202b" />
          <path d="M54 62q6-3 12 0M34 61l-8-3M86 61l8-3" stroke="#16202b" strokeWidth="2.4" fill="none" strokeLinecap="round" />
          <path d="M38 62l5 0M70 62l5 0" stroke="#fff" strokeWidth="2" opacity="0.5" strokeLinecap="round" />
        </g>
      )}
      {parts.includes('mask') && (
        <g>
          <path d="M28 58q32-10 64 0q0 14-6 14q-6 0-12-5q-4-2-8 0q-6 5-12 5q-6 0-6-14z" fill="#d6455c" />
          <ellipse cx="45" cy="64" rx="6" ry="4.5" fill="#fff" />
          <ellipse cx="75" cy="64" rx="6" ry="4.5" fill="#fff" />
          <circle cx="45.5" cy="64" r="3" fill={INK} />
          <circle cx="75.5" cy="64" r="3" fill={INK} />
        </g>
      )}
      {parts.includes('eyepatch') && (
        <g>
          <path d="M32 50L94 72" stroke="#16202b" strokeWidth="2" />
          <ellipse cx="75" cy="64" rx="8" ry="7.5" fill="#16202b" />
        </g>
      )}
      {parts.includes('monocle') && (
        <g fill="none" stroke="#c9962b" strokeWidth="2">
          <circle cx="75" cy="64" r="9" />
          <path d="M84 66q4 10 0 22" strokeWidth="1.2" />
        </g>
      )}
    </g>
  )
}

function Neck({ parts }) {
  return (
    <g>
      {parts.includes('scarf') && (
        <g>
          <path d="M23 88q37 12 74 0l1 9q-38 13-76 0z" fill="#2f6f8f" />
          <path d="M78 94l4 22l9-2l-4-20z" fill="#2f6f8f" />
          <path d="M80 112l2 6M84 111l2 6M88 110l1.6 6" stroke="#2f6f8f" strokeWidth="1.6" strokeLinecap="round" />
          <path d="M30 92l3 6M42 95l2 6M54 96l1 6M66 96l-1 6M78 94l-2 6" stroke="#fff" strokeWidth="1.6" opacity="0.5" strokeLinecap="round" />
        </g>
      )}
      {parts.includes('bandana') && <path d="M28 88q32 10 64 0l-32 22z" fill="#c8413a" />}
      {parts.includes('bowtie') && (
        <g>
          <path d="M60 94l-13-7v14zM60 94l13-7v14z" fill="#16202b" />
          <circle cx="60" cy="94" r="3" fill="#2c3a48" />
        </g>
      )}
    </g>
  )
}

function Hat({ parts }) {
  if (parts.includes('beanie'))
    return (
      <g>
        <path d="M36 28Q36 -6 60 -6Q84 -6 84 28z" fill="#e2b44a" />
        <path d="M44 4v22M52 -3v29M60 -5v31M68 -3v29M76 4v22" stroke="#c9962b" strokeWidth="1.6" />
        <rect x="33" y="22" width="54" height="11" rx="5.5" fill="#c9962b" />
        <circle cx="60" cy="-10" r="7" fill="#fff4dc" stroke="#e8d4a8" strokeWidth="1.5" />
      </g>
    )
  if (parts.includes('beret'))
    return (
      <g>
        <ellipse cx="62" cy="14" rx="27" ry="9" transform="rotate(-10 62 14)" fill="#7a3b54" />
        <path d="M62 5v-5" stroke="#7a3b54" strokeWidth="3" strokeLinecap="round" />
      </g>
    )
  if (parts.includes('sunhat'))
    return (
      <g>
        <ellipse cx="60" cy="24" rx="40" ry="9" fill="#ecd29a" />
        <path d="M40 24Q40 -4 60 -4Q80 -4 80 24z" fill="#f2deae" />
        <path d="M40 18q20 6 40 0v5q-20 6-40 0z" fill="#e0606e" />
      </g>
    )
  if (parts.includes('santa'))
    return (
      <g>
        <path d="M36 24Q40 -10 66 -14Q90 -14 96 8Q82 -2 72 4Q82 12 84 24z" fill="#d23b46" />
        <circle cx="97" cy="10" r="7" fill="#fff" stroke="#e3e9ef" strokeWidth="1.5" />
        <rect x="32" y="18" width="56" height="12" rx="6" fill="#fff" stroke="#e3e9ef" strokeWidth="1.5" />
      </g>
    )
  if (parts.includes('partyhat'))
    return (
      <g>
        <path d="M44 26L60 -24L76 26z" fill="#8b6ad8" />
        <path d="M49 12l22-6M53 0l14-4M46 20l28-8" stroke="#ffd166" strokeWidth="3" />
        <circle cx="60" cy="-26" r="5" fill="#ffd166" />
      </g>
    )
  if (parts.includes('witchhat'))
    return (
      <g>
        <ellipse cx="60" cy="24" rx="36" ry="7" fill="#2a2140" />
        <path d="M40 24Q50 -2 58 -18Q64 -32 82 -28Q68 -20 72 0Q76 14 80 24z" fill="#2a2140" />
        <path d="M42 18q18 5 37 0v5q-19 5-37 0z" fill="#8b6ad8" />
      </g>
    )
  if (parts.includes('crown'))
    return (
      <g>
        <path d="M38 26L36 0L48 12L60 -6L72 12L84 0L82 26z" fill="#f2c230" stroke="#c99a12" strokeWidth="1.6" strokeLinejoin="round" />
        <circle cx="60" cy="18" r="3.4" fill="#d6455c" />
        <circle cx="46" cy="20" r="2.4" fill="#2a86c2" />
        <circle cx="74" cy="20" r="2.4" fill="#2a86c2" />
      </g>
    )
  if (parts.includes('chefhat'))
    return (
      <g>
        <path d="M40 18Q26 6 36 -8Q42 -20 52 -14Q58 -28 70 -18Q84 -24 86 -8Q96 6 80 18z" fill="#fff" stroke="#dde5ec" strokeWidth="1.5" />
        <rect x="40" y="14" width="40" height="14" rx="3" fill="#fff" stroke="#dde5ec" strokeWidth="1.5" />
      </g>
    )
  if (parts.includes('wizardhat'))
    return (
      <g>
        <ellipse cx="60" cy="24" rx="34" ry="7" fill="#3b4aa8" />
        <path d="M40 24L60 -36L80 24z" fill="#4a5bc4" />
        <path d="M56 -6l2 4 4 1-3 3 1 4-4-2-4 2 1-4-3-3 4-1z" fill="#ffd166" />
        <circle cx="68" cy="10" r="1.8" fill="#ffd166" />
        <circle cx="52" cy="14" r="1.4" fill="#ffd166" />
      </g>
    )
  if (parts.includes('tophat'))
    return (
      <g>
        <rect x="44" y="-18" width="32" height="40" rx="3" fill="#16202b" />
        <rect x="44" y="12" width="32" height="6" fill="#d6455c" />
        <ellipse cx="60" cy="23" rx="26" ry="5" fill="#16202b" />
      </g>
    )
  if (parts.includes('piratehat'))
    return (
      <g>
        <path d="M26 24Q36 -6 60 -6Q84 -6 94 24Q60 12 26 24z" fill="#16202b" />
        <path d="M30 22Q60 10 90 22" stroke="#e2b44a" strokeWidth="2" fill="none" />
        <circle cx="60" cy="6" r="4.5" fill="#fff" />
        <path d="M55 13l10-3M55 10l10 3" stroke="#fff" strokeWidth="1.6" />
      </g>
    )
  if (parts.includes('cowboyhat'))
    return (
      <g>
        <path d="M18 18Q30 30 60 28Q90 30 102 18Q96 32 60 32Q24 32 18 18z" fill="#8a5a33" />
        <path d="M42 24Q40 -6 52 -6Q56 -2 60 -4Q64 -2 68 -6Q80 -6 78 24z" fill="#a06a3c" />
        <path d="M42 18q18 4 36 0v4q-18 4-36 0z" fill="#5b3a20" />
      </g>
    )
  if (parts.includes('flowercrown'))
    return (
      <g>
        <path d="M36 28q24-12 48 0" stroke="#4f9a5b" strokeWidth="3" fill="none" />
        {[
          [38, 26, '#f07c8a'],
          [48, 20, '#ffd166'],
          [60, 18, '#ffffff'],
          [72, 20, '#b48ce8'],
          [82, 26, '#f07c8a'],
        ].map(([x, y, color]) => (
          <g key={x}>
            <circle cx={x} cy={y} r="5.5" fill={color} />
            <circle cx={x} cy={y} r="2" fill="#e2a23a" />
          </g>
        ))}
      </g>
    )
  if (parts.includes('headphones'))
    return (
      <g>
        <path d="M22 66Q18 2 60 2Q102 2 98 66" stroke="#16202b" strokeWidth="5" fill="none" strokeLinecap="round" />
        <rect x="12" y="56" width="14" height="24" rx="6" fill="#16202b" />
        <rect x="94" y="56" width="14" height="24" rx="6" fill="#16202b" />
        <rect x="15" y="60" width="4" height="16" rx="2" fill="#2a86c2" />
        <rect x="101" y="60" width="4" height="16" rx="2" fill="#2a86c2" />
      </g>
    )
  return null
}

function Held({ parts, at }) {
  const [x, y] = at
  if (parts.includes('umbrella'))
    return (
      <g>
        <path d={`M${x} ${y}V${y - 46}`} stroke="#5b3a20" strokeWidth="2.6" />
        <path d={`M${x - 30} ${y - 44}Q${x} ${y - 82} ${x + 30} ${y - 44}Q${x + 20} ${y - 50} ${x + 10} ${y - 44}Q${x} ${y - 50} ${x - 10} ${y - 44}Q${x - 20} ${y - 50} ${x - 30} ${y - 44}z`} fill="#d6455c" />
        <path d={`M${x} ${y - 70}Q${x - 4} ${y - 56} ${x - 10} ${y - 44}M${x} ${y - 70}Q${x + 4} ${y - 56} ${x + 10} ${y - 44}`} stroke="#b8344a" strokeWidth="1.4" fill="none" />
      </g>
    )
  if (parts.includes('icecream'))
    return (
      <g>
        <path d={`M${x - 7} ${y - 8}L${x} ${y + 8}L${x + 7} ${y - 8}z`} fill="#e2b44a" />
        <circle cx={x} cy={y - 12} r="7.5" fill="#f7a1b5" />
        <circle cx={x - 2} cy={y - 21} r="6" fill="#fff4dc" />
        <circle cx={x + 2} cy={y - 25} r="1.8" fill="#d6455c" />
      </g>
    )
  if (parts.includes('flag'))
    return (
      <g>
        <path d={`M${x} ${y + 4}V${y - 44}`} stroke="#8a5a33" strokeWidth="2.4" />
        <g transform={`translate(${x} ${y - 44})`}>
          <rect width="30" height="20" fill="#0d5eaf" />
          {[2.2, 6.6, 11, 15.4].map((stripe) => (
            <rect key={stripe} y={stripe} width="30" height="2.2" fill="#fff" />
          ))}
          <rect width="11" height="11" fill="#0d5eaf" />
          <rect x="4.4" width="2.2" height="11" fill="#fff" />
          <rect y="4.4" width="11" height="2.2" fill="#fff" />
        </g>
      </g>
    )
  if (parts.includes('heart'))
    return (
      <g>
        <path d={`M${x} ${y}Q${x + 6} ${y - 20} ${x + 2} ${y - 36}`} stroke="#8aa0b2" strokeWidth="1.2" fill="none" />
        <path d={`M${x + 2} ${y - 36}c-10-6-14-14-8-19c4-3 8-1 8 2c0-3 4-5 8-2c6 5 2 13-8 19z`} fill="#f0536d" />
      </g>
    )
  if (parts.includes('wand'))
    return (
      <g>
        <path d={`M${x - 4} ${y + 6}L${x + 10} ${y - 22}`} stroke="#16202b" strokeWidth="3" strokeLinecap="round" />
        <path d={`M${x + 12} ${y - 34}l3 7 7 1-5 5 1 7-6-3-6 3 1-7-5-5 7-1z`} fill="#ffd166" />
      </g>
    )
  return null
}

const CAPES = { hero: '#d6455c', crown: '#6b3fa0', halloween: '#2a2140' }

export default function Glou({ mood = 'happy', size = 120, splash = false, outfit = 'casual', dance = null }) {
  const id = useId().replace(/:/g, '')
  const parts = OUTFITS[outfit]?.parts || []
  const holding = parts.some((part) => HELD.has(part))
  const [left, right] = HANDS[mood] || HANDS.happy
  const rightHand = holding ? [112, 90] : right
  const sleeve = SLEEVES[parts.find((part) => SLEEVES[part])] || LIMB
  const cape = parts.includes('cape') ? CAPES[outfit] || CAPES.hero : null
  return (
    <svg
      className={`glou glou-${mood}${splash ? ' glou-splash' : ''}${dance ? ` glou-dance-${dance}` : ''}`}
      viewBox={`${VIEW.x} ${VIEW.y} ${VIEW.width} ${VIEW.height}`}
      width={size}
      height={(size * VIEW.height) / VIEW.width}
      role="img"
      aria-label="Glou"
    >
      <defs>
        <linearGradient id={`${id}b`} x1="0.2" x2="0.8" y1="0" y2="1">
          <stop offset="0" stopColor="#a8e6fb" />
          <stop offset="0.55" stopColor="#5bbde8" />
          <stop offset="1" stopColor="#2582bd" />
        </linearGradient>
        <radialGradient id={`${id}g`} cx="0.35" cy="0.3" r="0.6">
          <stop offset="0" stopColor="#fff" stopOpacity="0.55" />
          <stop offset="1" stopColor="#fff" stopOpacity="0" />
        </radialGradient>
        <clipPath id={`${id}c`}>
          <path d={BODY} />
        </clipPath>
      </defs>
      <ellipse cx="60" cy="139" rx="36" ry="4.5" fill={INK} opacity="0.1" />
      {cape && <Cape color={cape} />}
      <Legs boots={parts.includes('boots')} />
      <Arm from={[28, 86]} to={left} color={sleeve} />
      <Arm from={[92, 86]} to={rightHand} color={sleeve} />
      <path d={BODY} fill={`url(#${id}b)`} />
      <path d={BODY} fill={`url(#${id}g)`} />
      <Garments parts={parts} clip={`${id}c`} />
      <path d="M37 58c3-11 9-20 16-29" stroke="#fff" strokeWidth="5" strokeLinecap="round" opacity="0.6" fill="none" />
      <circle cx="33" cy="74" r="2.4" fill="#fff" opacity="0.5" />
      <Eyes mood={mood} />
      <ellipse cx="35" cy="77" rx="5.5" ry="3.6" fill="#f07c8a" opacity="0.4" />
      <ellipse cx="85" cy="77" rx="5.5" ry="3.6" fill="#f07c8a" opacity="0.4" />
      {MOUTHS[mood]}
      <Face parts={parts} />
      <Neck parts={parts} />
      <Hat parts={parts} />
      <Held parts={parts} at={rightHand} />
      {mood === 'thirsty' && !holding && <path d="M104 34q5 7 0 12q-5-5 0-12z" fill="#8fd7f4" />}
      {mood === 'sleepy' && (
        <text x="92" y="30" fontSize="15" fontWeight="900" fill="#5b7487">
          z
        </text>
      )}
    </svg>
  )
}
