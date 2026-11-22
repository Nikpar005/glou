import { useState } from 'react'
import Companion from './Companion.jsx'
import Glou from './Glou.jsx'
import Scene from './Scene.jsx'
import './Hero.css'

export default function Hero({ scene, outfit, mood, companion, dance, line, splashKey, label, onOpen }) {
  const [dancing, setDancing] = useState(0)
  return (
    <section className={`hero hero-${scene}`} aria-label={label}>
      <Scene id={scene} className="hero-scene" />
      <p className="hero-bubble">{line}</p>
      <div className="hero-ground">
        <button className="hero-glou" onClick={() => setDancing((count) => count + 1)} aria-label={label}>
          <Glou key={`${splashKey}-${dancing}`} mood={mood} outfit={outfit} size={112} splash={Boolean(splashKey) && !dancing} dance={dancing ? dance : null} />
        </button>
        {companion !== 'none' && <Companion id={companion} size={companion === 'goldfish' || companion === 'cloud' ? 48 : 52} />}
      </div>
      <button className="hero-wardrobe" onClick={onOpen} aria-label={label}>
        <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M12 6a2 2 0 1 1 2 2c-1 0-2 .7-2 1.6V10" />
          <path d="M12 10l-8.4 6.3A1 1 0 0 0 4.2 18h15.6a1 1 0 0 0 .6-1.7z" />
        </svg>
      </button>
    </section>
  )
}
