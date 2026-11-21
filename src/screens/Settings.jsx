import { formatMl, LANGUAGES, strings } from '../lib/i18n.js'
import './Settings.css'

const GOALS = [1500, 2000, 2500, 3000, 3500, 4000, 4500, 5000]
const INTERVALS = [30, 45, 60, 90, 120]

export default function Settings({ settings, onChange }) {
  const t = strings(settings.language)
  return (
    <section>
      <h1 className="title">{t.settings}</h1>
      <div className="card settings">
        <label className="setting">
          <span>{t.goal}</span>
          <select value={settings.goal} onChange={(event) => onChange({ goal: Number(event.target.value) })}>
            {GOALS.map((goal) => (
              <option key={goal} value={goal}>
                {formatMl(goal, settings.language)}
              </option>
            ))}
          </select>
        </label>
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
    </section>
  )
}
