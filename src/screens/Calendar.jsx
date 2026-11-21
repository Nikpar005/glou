import { useState } from 'react'
import { dayKey, monthDays, parseDayKey, weekdayIndex } from '../lib/dates.js'
import { strings } from '../lib/i18n.js'
import { goalMet, totalFor } from '../lib/progress.js'
import './Calendar.css'

function locale(language) {
  return language === 'el' ? 'el-GR' : 'en-GB'
}

export default function Calendar({ state }) {
  const { settings, days } = state
  const t = strings(settings.language)
  const today = dayKey()
  const now = parseDayKey(today)
  const [month, setMonth] = useState({ year: now.getFullYear(), month: now.getMonth() })
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
            const logged = totalFor(days, key) > 0
            const status = future ? 'future' : goalMet(days, key, settings.goal) ? 'met' : logged || key < today ? 'missed' : 'open'
            return (
              <span key={key} className={`calendar-day calendar-${status}${key === today ? ' calendar-today' : ''}`}>
                {parseDayKey(key).getDate()}
              </span>
            )
          })}
        </div>
      </div>
    </section>
  )
}
