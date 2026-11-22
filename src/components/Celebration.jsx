import { useEffect, useMemo } from 'react'
import './Celebration.css'

const COLORS = ['#3aa8d8', '#ffd166', '#f07c8a', '#8b6ad8', '#4cb782', '#ffffff']

function pieces(count, seed) {
  let value = seed
  const random = () => {
    value = (value * 9301 + 49297) % 233280
    return value / 233280
  }
  return Array.from({ length: count }, (_, index) => ({
    index,
    x: random() * 100,
    delay: random() * 0.6,
    size: 6 + random() * 10,
    drift: (random() - 0.5) * 80,
    turn: random() * 720 - 360,
    color: COLORS[index % COLORS.length],
  }))
}

export default function Celebration({ id, onDone }) {
  const items = useMemo(() => pieces(id === 'fireworks' ? 4 : 36, 7), [id])
  useEffect(() => {
    const timer = setTimeout(onDone, 2800)
    return () => clearTimeout(timer)
  }, [onDone])
  return (
    <div className={`celebration celebration-${id}`} aria-hidden="true">
      {id === 'fireworks'
        ? items.map((item) => (
            <div key={item.index} className="burst" style={{ left: `${15 + item.index * 22}%`, top: `${18 + (item.index % 2) * 16}%`, animationDelay: `${item.index * 0.35}s` }}>
              {Array.from({ length: 12 }, (_, ray) => (
                <span key={ray} style={{ '--angle': `${ray * 30}deg`, background: COLORS[(ray + item.index) % 5] }} />
              ))}
            </div>
          ))
        : items.map((item) => (
            <span
              key={item.index}
              className="piece"
              style={{
                left: `${item.x}%`,
                width: item.size,
                height: id === 'confetti' ? item.size * 0.45 : item.size,
                animationDelay: `${item.delay}s`,
                '--drift': `${item.drift}px`,
                '--turn': `${item.turn}deg`,
                '--color': item.color,
              }}
            />
          ))}
    </div>
  )
}
