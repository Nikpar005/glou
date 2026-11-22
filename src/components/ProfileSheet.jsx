import { useState } from 'react'
import { baseGoal } from '../lib/hydration.js'
import { formatMl } from '../lib/i18n.js'
import Glou from './Glou.jsx'
import Sheet from './Sheet.jsx'
import './ProfileSheet.css'

export function ProfileFields({ t, weight, activity, onWeight, onActivity }) {
  return (
    <div className="profile-fields">
      <div className="field">
        <span>{t.weight}</span>
        <div className="stepper">
          <button aria-label="-1 kg" onClick={() => onWeight(Math.max(30, weight - 1))}>−</button>
          <strong>{weight} kg</strong>
          <button aria-label="+1 kg" onClick={() => onWeight(Math.min(200, weight + 1))}>+</button>
        </div>
      </div>
      <input
        className="slider"
        type="range"
        min="30"
        max="200"
        value={weight}
        aria-label={t.weight}
        onChange={(event) => onWeight(Number(event.target.value))}
      />
      <div className="field field-column">
        <span>{t.activity}</span>
        <div className="segmented" role="radiogroup" aria-label={t.activity}>
          {['low', 'moderate', 'high'].map((level) => (
            <button
              key={level}
              role="radio"
              aria-checked={activity === level}
              className={activity === level ? 'segment segment-on' : 'segment'}
              onClick={() => onActivity(level)}
            >
              {t.activities[level]}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

export default function ProfileSheet({ t, settings, onSave, onSkip }) {
  const [weight, setWeight] = useState(settings.weight || 70)
  const [activity, setActivity] = useState(settings.activity)
  const goal = baseGoal({ weight, activity })
  return (
    <Sheet open onClose={onSkip} label={t.profileTitle}>
      <div className="profile">
        <Glou mood="happy" size={84} />
        <h2>{t.profileTitle}</h2>
        <p className="muted">{t.profileText}</p>
      </div>
      <ProfileFields t={t} weight={weight} activity={activity} onWeight={setWeight} onActivity={setActivity} />
      <div className="suggested">
        <span>{t.suggestedGoal}</span>
        <strong>{formatMl(goal, settings.language)}</strong>
      </div>
      <p className="disclaimer">{t.disclaimer}</p>
      <div className="sheet-actions">
        <button className="button-secondary" onClick={onSkip}>{t.ownGoal}</button>
        <button className="button-primary" onClick={() => onSave({ weight, activity, goal })}>{t.useGoal}</button>
      </div>
    </Sheet>
  )
}
