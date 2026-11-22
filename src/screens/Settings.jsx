import { formatMl, LANGUAGES, strings } from '../lib/i18n.js'
import { useEffect, useState } from 'react'
import { isNative } from '../lib/platform.js'
import { permissionState } from '../reminders/notifications.js'
import { ProfileFields } from '../components/ProfileSheet.jsx'
import { baseGoal } from '../lib/hydration.js'
import { currentPosition } from '../lib/weather.js'
import './Settings.css'

const GOALS = [1500, 2000, 2500, 3000, 3500, 4000, 4500, 5000]
const INTERVALS = [30, 45, 60, 90, 120]

export default function Settings({ settings, onChange, weather }) {
  const t = strings(settings.language)
  const [permission, setPermission] = useState('unavailable')
  const [locating, setLocating] = useState(false)
  const [locateFailed, setLocateFailed] = useState(false)
  const auto = settings.goalMode === 'auto'
  const weight = settings.weight || 70
  const updateProfile = (changes) => {
    const next = { weight, activity: settings.activity, ...changes }
    onChange({ ...next, goal: baseGoal(next) })
  }
  const locate = async () => {
    setLocating(true)
    setLocateFailed(false)
    try {
      onChange({ location: await currentPosition() })
    } catch {
      setLocateFailed(true)
    } finally {
      setLocating(false)
    }
  }
  useEffect(() => {
    permissionState().then(setPermission).catch(() => setPermission('unavailable'))
  }, [settings.reminders])
  return (
    <section>
      <h1 className="title">{t.settings}</h1>
      <div className="card settings">
        <div className="setting">
          <span>{t.goalMode}</span>
          <div className="segmented" role="radiogroup" aria-label={t.goalMode}>
            {['auto', 'manual'].map((mode) => (
              <button
                key={mode}
                role="radio"
                aria-checked={settings.goalMode === mode}
                className={settings.goalMode === mode ? 'segment segment-on' : 'segment'}
                onClick={() => (mode === 'auto' ? updateProfile({ goalMode: 'auto' }) : onChange({ goalMode: 'manual' }))}
              >
                {t.goalModes[mode]}
              </button>
            ))}
          </div>
        </div>
        {auto ? (
          <>
            <ProfileFields
              t={t}
              weight={weight}
              activity={settings.activity}
              onWeight={(value) => updateProfile({ weight: value })}
              onActivity={(value) => updateProfile({ activity: value })}
            />
            <div className="setting">
              <span>{t.goal}</span>
              <strong className="goal-value">{formatMl(settings.goal, settings.language)}</strong>
            </div>
            <p className="setting-note">{t.hotDayRule}</p>
          </>
        ) : (
          <label className="setting">
            <span>{t.goal}</span>
            <select value={settings.goal} onChange={(event) => onChange({ goal: Number(event.target.value) })}>
              {(GOALS.includes(settings.goal) ? GOALS : [...GOALS, settings.goal].sort((a, b) => a - b)).map((goal) => (
                <option key={goal} value={goal}>
                  {formatMl(goal, settings.language)}
                </option>
              ))}
            </select>
          </label>
        )}
      </div>
      <div className="card settings">
        <label className="setting">
          <span>{t.reminders}</span>
          <input
            className="switch"
            type="checkbox"
            role="switch"
            checked={settings.reminders}
            onChange={(event) => onChange({ reminders: event.target.checked })}
          />
        </label>
        <label className="setting">
          <span>{t.wakeStart}</span>
          <input type="time" value={settings.wakeStart} onChange={(event) => event.target.value && onChange({ wakeStart: event.target.value })} />
        </label>
        <label className="setting">
          <span>{t.wakeEnd}</span>
          <input type="time" value={settings.wakeEnd} onChange={(event) => event.target.value && onChange({ wakeEnd: event.target.value })} />
        </label>
        <label className="setting">
          <span>{t.interval}</span>
          <select value={settings.interval} onChange={(event) => onChange({ interval: Number(event.target.value) })} disabled={!settings.reminders}>
            {INTERVALS.map((minutes) => (
              <option key={minutes} value={minutes}>
                {t.minutes(minutes)}
              </option>
            ))}
          </select>
        </label>
      </div>
      {isNative && settings.reminders && permission === 'denied' && <p className="card notice">{t.remindersOff}</p>}
      {isNative && settings.reminders && (
        <details className="card help">
          <summary>{t.batteryTitle}</summary>
          <p>{t.batteryText}</p>
        </details>
      )}
      <div className="card settings">
        <div className="setting">
          <span>{t.weatherTitle}</span>
          {settings.location ? (
            <button className="link-button" onClick={() => onChange({ location: null })}>
              {t.weatherOff}
            </button>
          ) : (
            <button className="link-button" onClick={locate} disabled={locating}>
              {t.weatherUse}
            </button>
          )}
        </div>
        <p className="setting-note">
          {settings.location ? `${t.weatherOn}${weather ? ` · ${t.weatherToday(weather.max)}` : ''}` : t.weatherText}
        </p>
        {locateFailed && <p className="setting-note setting-warning">{t.weatherFailed}</p>}
        {settings.location && <p className="setting-note">{t.weatherCredit}</p>}
      </div>
      <div className="card settings">
        <div className="setting">
          <span>{t.language}</span>
          <div className="segmented" role="radiogroup" aria-label={t.language}>
            {LANGUAGES.map((language) => (
              <button
                key={language.code}
                role="radio"
                aria-checked={settings.language === language.code}
                className={settings.language === language.code ? 'segment segment-on' : 'segment'}
                onClick={() => onChange({ language: language.code })}
              >
                {language.label}
              </button>
            ))}
          </div>
        </div>
      </div>
      <p className="disclaimer-footer">{t.disclaimer}</p>
    </section>
  )
}
