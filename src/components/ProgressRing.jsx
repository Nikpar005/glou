import './ProgressRing.css'

export default function ProgressRing({ fraction, total, goalText, leftText }) {
  const size = 240
  const stroke = 16
  const radius = (size - stroke) / 2
  const circumference = 2 * Math.PI * radius
  const level = 1 - fraction
  return (
    <div className="ring" role="img" aria-label={`${total} ${goalText}`}>
      <svg viewBox={`0 0 ${size} ${size}`} width="100%" height="100%">
        <defs>
          <clipPath id="ring-inside">
            <circle cx={size / 2} cy={size / 2} r={radius - stroke / 2 - 6} />
          </clipPath>
          <linearGradient id="ring-water" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0" stopColor="#5cc2ea" />
            <stop offset="1" stopColor="#0e7c9b" />
          </linearGradient>
        </defs>
        <circle cx={size / 2} cy={size / 2} r={radius - stroke / 2 - 6} fill="#eef7fb" />
        <g clipPath="url(#ring-inside)">
          <g className="ring-water" style={{ transform: `translateY(${level * size - 6}px)` }}>
            <path
              className="ring-wave"
              d={`M0 12 Q ${size / 8} 0 ${size / 4} 12 T ${size / 2} 12 T ${(size * 3) / 4} 12 T ${size} 12 T ${(size * 5) / 4} 12 T ${(size * 3) / 2} 12 V ${size * 2} H 0 Z`}
              fill="url(#ring-water)"
            />
          </g>
        </g>
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="#cfeaf6" strokeWidth={stroke} />
        <circle
          className="ring-progress"
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="#0e7c9b"
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
