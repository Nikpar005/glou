import { useState } from 'react'
import Sheet from '../components/Sheet.jsx'
import { formatTime } from '../lib/dates.js'
import { dayKey, monthDays, parseDayKey, weekdayIndex } from '../lib/dates.js'
import { formatMl, strings } from '../lib/i18n.js'
import { goalMet, streak, totalFor } from '../lib/progress.js'
import './Calendar.css'

function locale(language) {
  return language === 'el' ? 'el-GR' : 'en-GB'
}

export default function Calendar({ state, repair }) {
  const { settings, days } = state
  const repairs = state.wardrobe.repairs
  const t = strings(settings.language)
  const today = dayKey()
  const now = parseDayKey(today)
  const [month, setMonth] = useState({ year: now.getFullYear(), month: now.getMonth() })
  const [selected, setSelected] = useState(null)
  const first = Object.keys(days).sort()[0] || today
  const keys = monthDays(month.year, month.month)
  const title = new Date(month.year, month.month, 1).toLocaleDateString(locale(settings.language), { month: 'long', year: 'numeric' })
  const weekdays = Array.from({ length: 7 }, (_, index) =>
    new Date(2026, 10, 23 + index).toLocaleDateString(locale(settings.language), { weekday: 'narrow' }),
  )
  const move = (delta) =>
    setMonth(({ year, month: current }) => {
      const date = new Date(year, current + delta, 1)
      return { year: date.getFullYear(), month: date.getMonth() }
    })

  return (
    <section>
      <h1 className="title">{t.calendar}</h1>
      {(() => {
        const days_ = streak(days, today, settings.goal, repairs)
        const past = keys.filter((key) => key <= today && key >= first)
        const met = past.filter((key) => goalMet(days, key, settings.goal) || repairs.includes(key)).length
        return (
          <div className="summary">
            <div className="card summary-card">
              <span className="summary-flame" aria-hidden="true">🔥</span>
              <strong>{days_ ? t.streak(days_) : t.noStreak}</strong>
            </div>
            <div className="card summary-card">
              <span className="summary-flame" aria-hidden="true">💧</span>
              <strong>{t.goalMetDays(met, past.length)}</strong>
            </div>
          </div>
        )
      })()}
      {repair}
      <div className="card calendar">
        <header className="calendar-header">
          <button onClick={() => move(-1)} aria-label="‹">‹</button>
          <h2>{title}</h2>
          <button onClick={() => move(1)} aria-label="›">›</button>
        </header>
        <div className="calendar-grid">
          {weekdays.map((name, index) => (
            <span key={index} className="calendar-weekday">
              {name}
            </span>
          ))}
          {Array.from({ length: weekdayIndex(keys[0]) }, (_, index) => (
            <span key={`gap-${index}`} />
          ))}
          {keys.map((key) => {
            const future = key > today
            const status =
              future || key < first ? 'future' : goalMet(days, key, settings.goal) ? 'met' : repairs.includes(key) ? 'saved' : key < today ? 'missed' : 'open'
            return (
              <button
                key={key}
                className={`calendar-day calendar-${status}${key === today ? ' calendar-today' : ''}`}
                onClick={() => setSelected(key)}
                disabled={future}
              >
                {parseDayKey(key).getDate()}
              </button>
            )
          })}
        </div>
      </div>
      {selected && (
        <Sheet open onClose={() => setSelected(null)} label={selected}>
          <h2 className="day-title">
            {parseDayKey(selected).toLocaleDateString(locale(settings.language), { weekday: 'long', day: 'numeric', month: 'long' })}
          </h2>
          <p className="day-total">{t.dayTotal(formatMl(totalFor(days, selected), settings.language), formatMl(settings.goal, settings.language))}</p>
          {repairs.includes(selected) && <p className="muted">{t.savedDay}</p>}
          {(days[selected] || []).length === 0 ? (
            <p className="muted">{t.noDrinks}</p>
          ) : (
            <ul className="day-list">
              {[...days[selected]].sort((a, b) => a.at.localeCompare(b.at)).map((drink) => (
                <li key={drink.at}>
                  <span className="muted">{formatTime(new Date(drink.at))}</span>
                  <strong>{formatMl(drink.ml, settings.language)}</strong>
                </li>
              ))}
            </ul>
          )}
        </Sheet>
      )}
    </section>
  )
}
