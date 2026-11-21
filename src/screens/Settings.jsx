import { formatMl, strings } from '../lib/i18n.js'
import './Settings.css'

const GOALS = [1500, 2000, 2500, 3000, 3500, 4000, 4500, 5000]

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
    </section>
  )
}
