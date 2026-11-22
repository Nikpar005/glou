import { useId } from 'react'
import './ProgressRing.css'

export const WATER_STYLES = {
  water: { top: '#5cc2ea', bottom: '#0e7c9b', stroke: 'var(--sea)' },
  lemonade: { top: '#fff3a6', bottom: '#f2c230', stroke: '#e0a800' },
  matcha: { top: '#c4e6a6', bottom: '#5a9a3c', stroke: '#4f8a35' },
  strawberry: { top: '#ffc8d6', bottom: '#e0506e', stroke: '#d03c5c' },
  galaxy: { top: '#8b6ad8', bottom: '#20184d', stroke: '#6b4fc4', stars: true },
}

const SPARKS = [
  [60, 30], [90, 62], [130, 40], [170, 70], [150, 96], [100, 104], [190, 36], [70, 86], [120, 140], [176, 128], [52, 124], [140, 178],
]

export default function ProgressRing({ fraction, total, goalText, leftText, waterStyle = 'water' }) {
  const id = useId().replace(/:/g, '')
  const look = WATER_STYLES[waterStyle] || WATER_STYLES.water
  const size = 240
  const stroke = 16
  const radius = (size - stroke) / 2
  const circumference = 2 * Math.PI * radius
  const level = 1 - fraction
  return (
    <div className="ring" role="img" aria-label={`${total} ${goalText}`}>
      <svg viewBox={`0 0 ${size} ${size}`} width="100%" height="100%">
        <defs>
          <clipPath id={`${id}i`}>
            <circle cx={size / 2} cy={size / 2} r={radius - stroke / 2 - 6} />
          </clipPath>
          <linearGradient id={`${id}w`} x1="0" x2="0" y1="0" y2="1">
            <stop offset="0" stopColor={look.top} />
            <stop offset="1" stopColor={look.bottom} />
          </linearGradient>
        </defs>
        <circle cx={size / 2} cy={size / 2} r={radius - stroke / 2 - 6} fill="var(--mist)" />
        <g clipPath={`url(#${id}i)`}>
          <g className="ring-water" style={{ transform: `translateY(${level * size - 6}px)` }}>
            <path
              className="ring-wave"
              d={`M0 12 Q ${size / 8} 0 ${size / 4} 12 T ${size / 2} 12 T ${(size * 3) / 4} 12 T ${size} 12 T ${(size * 5) / 4} 12 T ${(size * 3) / 2} 12 V ${size * 2} H 0 Z`}
              fill={`url(#${id}w)`}
            />
            {look.stars &&
              SPARKS.map(([x, y]) => <circle key={`${x}${y}`} cx={x} cy={y} r="1.6" fill="#fff" opacity="0.85" />)}
          </g>
        </g>
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="var(--water-light)" strokeWidth={stroke} />
        <circle
          className="ring-progress"
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={look.stroke}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={circumference * (1 - fraction)}
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
      </svg>
      <div className="ring-label">
        <strong>{total}</strong>
        <span>{goalText}</span>
        <small>{leftText}</small>
      </div>
    </div>
  )
}
