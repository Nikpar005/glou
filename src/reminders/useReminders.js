import { useEffect, useState } from 'react'
import { strings } from '../lib/i18n.js'
import { totalFor } from '../lib/progress.js'
import { scheduleReminders } from './notifications.js'
import { planReminders } from './plan.js'

export function lastDrink(days) {
  let latest = null
  for (const drinks of Object.values(days)) {
    for (const drink of drinks) if (!latest || drink.at > latest) latest = drink.at
  }
  return latest ? new Date(latest) : null
}

export function useReminders(state, goal) {
  const [wake, setWake] = useState(0)

  useEffect(() => {
    const onVisible = () => document.visibilityState === 'visible' && setWake((count) => count + 1)
    document.addEventListener('visibilitychange', onVisible)
    return () => document.removeEventListener('visibilitychange', onVisible)
  }, [])

  useEffect(() => {
    if (!state) return undefined
    const timer = setTimeout(() => {
      const { settings, days } = state
      const times = planReminders({
        now: new Date(),
        settings,
        goal: goal ?? settings.goal,
        totalFor: (key) => totalFor(days, key),
        lastDrinkAt: lastDrink(days),
      })
      scheduleReminders(times, strings(settings.language)).catch(() => {})
    }, 800)
    return () => clearTimeout(timer)
  }, [state, goal, wake])
}
