import { formatTime } from '../lib/dates.js'
import { formatMl } from '../lib/i18n.js'
import './TodayLog.css'

export default function TodayLog({ drinks, language, t, onRemove }) {
  const sorted = [...drinks].sort((a, b) => b.at.localeCompare(a.at))
  return (
    <section className="card log">
      <h2>{t.todayLog}</h2>
      {sorted.length === 0 ? (
        <p className="muted">{t.emptyLog}</p>
      ) : (
        <ul>
          {sorted.map((drink) => (
            <li key={drink.at}>
              <span className="log-time">{formatTime(new Date(drink.at))}</span>
              <span className="log-amount">{formatMl(drink.ml, language)}</span>
              <button className="log-remove" onClick={() => onRemove(drink.at)} aria-label={`${t.remove} ${formatMl(drink.ml, language)}`}>
                ×
              </button>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}
