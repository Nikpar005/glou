import { useState } from 'react'
import AppIcon from '../components/AppIcon.jsx'
import Companion from '../components/Companion.jsx'
import Glou from '../components/Glou.jsx'
import { WATER_STYLES } from '../components/ProgressRing.jsx'
import Scene from '../components/Scene.jsx'
import { dayKey } from '../lib/dates.js'
import { strings } from '../lib/i18n.js'
import { adsToday, canWatch, DAILY_AD_LIMIT, giftReady, KINDS, owns, progress, selected } from '../lib/rewards.js'
import './Wardrobe.css'

const THEME_SWATCHES = {
  ocean: ['#0e7c9b', '#3aa8d8', '#eef7fb'],
  sunset: ['#d0603a', '#f29e6d', '#fdf3ec'],
  forest: ['#3f8a55', '#6cbf84', '#f0f7f0'],
  lavender: ['#6b56c4', '#9b8ae6', '#f5f2fd'],
  midnight: ['#0f1c28', '#172838', '#5cc2ea'],
}

const PARTY = {
  bubbles: <g fill="none" stroke="#3aa8d8" strokeWidth="2.5"><circle cx="20" cy="40" r="8" /><circle cx="38" cy="24" r="6" /><circle cx="44" cy="46" r="4" /></g>,
  confetti: <g>{[['#f07c8a', 12, 14, 20], ['#ffd166', 32, 10, -30], ['#3aa8d8', 44, 30, 40], ['#4cb782', 18, 38, -10], ['#8b6ad8', 36, 46, 25]].map(([c, x, y, r]) => <rect key={c} x={x} y={y} width="9" height="4" rx="1" fill={c} transform={`rotate(${r} ${x} ${y})`} />)}</g>,
  fireworks: <g stroke="#f07c8a" strokeWidth="2.5" strokeLinecap="round">{Array.from({ length: 8 }, (_, i) => <path key={i} d="M32 32l0-16" transform={`rotate(${i * 45} 32 32)`} stroke={i % 2 ? '#ffd166' : '#f07c8a'} />)}</g>,
  stars: <g fill="#ffd166">{[[18, 20, 1], [40, 16, 0.7], [34, 40, 1.2]].map(([x, y, s]) => <path key={x} transform={`translate(${x} ${y}) scale(${s})`} d="M0-9l2.6 5.6 6.2.7-4.6 4.2 1.3 6.1L0 4.5l-5.5 3.1 1.3-6.1-4.6-4.2 6.2-.7z" />)}</g>,
}

const SOUND_ICON = (
  <svg viewBox="0 0 24 24" width="40" height="40" fill="none" stroke="var(--sea)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M4 10v4h4l5 4V6L8 10z" />
    <path d="M16 9a4 4 0 0 1 0 6M18.5 6.5a7.5 7.5 0 0 1 0 11" />
  </svg>
)

function Preview({ kind, id, playing }) {
  if (kind === 'outfit') return <Glou outfit={id} mood="happy" size={86} />
  if (kind === 'scene') return <Scene id={id} className="preview-scene" />
  if (kind === 'theme')
    return (
      <span className="swatches">
        {THEME_SWATCHES[id].map((color) => (
          <span key={color} style={{ background: color }} />
        ))}
      </span>
    )
  if (kind === 'water') {
    const look = WATER_STYLES[id]
    return <span className="water-dot" style={{ background: `linear-gradient(180deg, ${look.top}, ${look.bottom})` }} />
  }
  if (kind === 'companion') return id === 'none' ? <span className="empty-dot" /> : <Companion id={id} size={64} />
  if (kind === 'dance') return <Glou mood="happy" size={70} dance={playing ? id : null} key={playing ? 'p' : 'i'} />
  if (kind === 'sound') return id === 'mute' ? <span className="empty-dot" /> : SOUND_ICON
  if (kind === 'celebration')
    return (
      <svg viewBox="0 0 64 64" width="56" height="56" aria-hidden="true">
        {PARTY[id]}
      </svg>
    )
  if (kind === 'icon') return <AppIcon id={id} size={60} />
  return null
}

function Dots({ seen, total }) {
  return (
    <span className="dots" aria-hidden="true">
      {Array.from({ length: total }, (_, index) => (
        <span key={index} className={index < seen ? 'dot dot-on' : 'dot'} />
      ))}
    </span>
  )
}

export default function Wardrobe({ state, outfit, weather, onSelect, onWatchAd, onGift, onPreview }) {
  const { settings, wardrobe } = state
  const t = strings(settings.language)
  const today = dayKey()
  const [kind, setKind] = useState('outfit')
  const [playing, setPlaying] = useState(null)
  const info = KINDS[kind]
  const items = [...info.free, ...info.paid]
  const watchable = canWatch(wardrobe, today)
  const current = kind === 'outfit' ? (wardrobe.wearing === 'auto' ? 'auto' : wardrobe.wearing) : selected(wardrobe, kind)
  const name = (id) => (kind === 'outfit' ? t.outfits[id] : t.items[kind][id])

  const pick = (id) => {
    onSelect(kind, id)
    if (kind === 'sound' || kind === 'celebration') onPreview(kind, id)
    if (kind === 'dance') {
      setPlaying(id)
      setTimeout(() => setPlaying(null), 1100)
    }
  }

  return (
    <section className="wardrobe">
      <h1 className="title">{t.wardrobeTitle}</h1>
      <div className="stage card">
        <Glou outfit={outfit} mood="happy" size={130} />
        <div className="stage-text">
          <strong>{t.outfits[outfit]}</strong>
          {weather && <span className="muted">{t.weatherToday(weather.max)}</span>}
          <span className="muted ads-left">{t.adsLeft(adsToday(wardrobe, today), DAILY_AD_LIMIT)}</span>
        </div>
      </div>
      <div className="card gift">
        <div>
          <strong>🎁 {t.giftTitle}</strong>
          <p className="muted">{giftReady(wardrobe, today) ? t.giftText : t.giftDone}</p>
        </div>
        {giftReady(wardrobe, today) && (
          <button className="button-primary" onClick={onGift} disabled={!watchable}>
            {t.giftOpen}
          </button>
        )}
      </div>
      {!watchable && <p className="card notice">{t.adLimit}</p>}
      <div className="kinds" role="tablist">
        {Object.keys(KINDS).map((id) => (
          <button key={id} role="tab" aria-selected={kind === id} className={kind === id ? 'kind kind-on' : 'kind'} onClick={() => setKind(id)}>
            {t.kinds[id]}
          </button>
        ))}
      </div>
      <p className="muted section-text">{t.kindHints[kind] || t.wardrobeRewardsText}</p>
      {kind === 'outfit' && (
        <button className={`card auto${current === 'auto' ? ' auto-on' : ''}`} onClick={() => onSelect('outfit', 'auto')} aria-pressed={current === 'auto'}>
          <span>
            <strong>{t.wardrobeAuto}</strong>
            <span className="muted">{t.wardrobeAutoText}</span>
          </span>
          <span className="check" aria-hidden="true" />
        </button>
      )}
      <ul className={`outfits outfits-${kind}`}>
        {items.map((id) => {
          const mine = owns(wardrobe, kind, id)
          const on = current === id
          const seen = progress(wardrobe, kind, id)
          return (
            <li key={id} className={`outfit${on ? ' outfit-on' : ''}${mine ? '' : ' outfit-locked'}`}>
              <button className="outfit-pick" disabled={!mine} onClick={() => pick(id)} aria-pressed={on}>
                <span className="outfit-preview">
                  <Preview kind={kind} id={id} playing={playing === id} />
                </span>
                <span className="outfit-name">{name(id)}</span>
                {on && <span className="outfit-tag">✓</span>}
              </button>
              {!mine && (
                <button className="outfit-unlock" onClick={() => onWatchAd(kind, id)} disabled={!watchable}>
                  <Dots seen={seen} total={info.ads} />
                  <span>{t.watchAd(seen, info.ads)}</span>
                </button>
              )}
            </li>
          )
        })}
      </ul>
      {kind === 'outfit' && <p className="muted section-text">{t.wardrobeFree}: {info.free.map((id) => t.outfits[id]).join(', ')}</p>}
    </section>
  )
}
