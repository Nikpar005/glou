import Glou from '../components/Glou.jsx'
import { strings } from '../lib/i18n.js'
import { ADS_TO_UNLOCK, adsWatched, isUnlocked, OUTFITS, REWARD_OUTFITS } from '../lib/outfits.js'
import './Wardrobe.css'

const FREE = Object.keys(OUTFITS).filter((id) => OUTFITS[id].kind !== 'reward')

function Dots({ seen }) {
  return (
    <span className="dots" aria-hidden="true">
      {Array.from({ length: ADS_TO_UNLOCK }, (_, index) => (
        <span key={index} className={index < seen ? 'dot dot-on' : 'dot'} />
      ))}
    </span>
  )
}

export default function Wardrobe({ state, outfit, weather, onWear, onWatchAd }) {
  const { settings, wardrobe } = state
  const t = strings(settings.language)
  const auto = wardrobe.wearing === 'auto'

  const tile = (id) => {
    const unlocked = isUnlocked(wardrobe, id)
    const current = !auto && wardrobe.wearing === id
    const seen = adsWatched(wardrobe, id)
    return (
      <li key={id} className={`outfit${current ? ' outfit-on' : ''}${unlocked ? '' : ' outfit-locked'}`}>
        <button className="outfit-pick" disabled={!unlocked} onClick={() => onWear(id)} aria-pressed={current}>
          <Glou outfit={id} mood="happy" size={92} />
          <span className="outfit-name">{t.outfits[id]}</span>
          {current && <span className="outfit-tag">{t.wearing}</span>}
        </button>
        {!unlocked && (
          <button className="outfit-unlock" onClick={() => onWatchAd(id)}>
            <Dots seen={seen} />
            <span>{t.watchAd(seen, ADS_TO_UNLOCK)}</span>
          </button>
        )}
      </li>
    )
  }

  return (
    <section className="wardrobe">
      <h1 className="title">{t.wardrobeTitle}</h1>
      <div className="stage card">
        <Glou outfit={outfit} mood="happy" size={150} />
        <div className="stage-text">
          <strong>{t.outfits[outfit]}</strong>
          {weather && <span className="muted">{t.weatherToday(weather.max)}</span>}
        </div>
      </div>
      <button className={`card auto${auto ? ' auto-on' : ''}`} onClick={() => onWear('auto')} aria-pressed={auto}>
        <span>
          <strong>{t.wardrobeAuto}</strong>
          <span className="muted">{t.wardrobeAutoText}</span>
        </span>
        <span className="check" aria-hidden="true" />
      </button>
      <h2 className="section-title">{t.wardrobeRewards}</h2>
      <p className="muted section-text">{t.wardrobeRewardsText(ADS_TO_UNLOCK)}</p>
      <ul className="outfits">{REWARD_OUTFITS.map(tile)}</ul>
      <h2 className="section-title">{t.wardrobeFree}</h2>
      <ul className="outfits">{FREE.map(tile)}</ul>
    </section>
  )
}
