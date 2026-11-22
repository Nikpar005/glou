import { useEffect, useState } from 'react'
import Glou from './Glou.jsx'
import './AdPlayer.css'

const SECONDS = 5

export default function AdPlayer({ t, outfit, onReward, onClose }) {
  const [left, setLeft] = useState(SECONDS)
  useEffect(() => {
    if (left <= 0) return undefined
    const timer = setTimeout(() => setLeft((value) => value - 1), 1000)
    return () => clearTimeout(timer)
  }, [left])
  return (
    <div className="ad" role="dialog" aria-modal="true" aria-label={t.adTitle}>
      <div className="ad-top">
        <span className="ad-badge">{t.adTitle}</span>
        <span className="ad-count">{left > 0 ? t.adSkip(left) : ''}</span>
        <button className="ad-close" onClick={left > 0 ? onClose : onReward} aria-label={t.adClose}>
          ✕
        </button>
      </div>
      <div className="ad-body">
        <Glou outfit={outfit} mood="proud" size={170} />
        <p>{t.adTest}</p>
      </div>
      <div className="ad-bar" style={{ '--done': (SECONDS - left) / SECONDS }} />
      <button className="button-primary ad-reward" disabled={left > 0} onClick={onReward}>
        {t.adDone}
      </button>
    </div>
  )
}
