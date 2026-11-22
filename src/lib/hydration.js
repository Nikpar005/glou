export const ACTIVITY_EXTRA = { low: 0, moderate: 350, high: 700 }
export const HOT_DAY_EXTRA = 500
export const HOT_DAY_MAX = 30
const ML_PER_KG = 33
const MIN_GOAL = 1500
const MAX_GOAL = 4500

const round50 = (ml) => Math.round(ml / 50) * 50

export function baseGoal({ weight, activity }) {
  if (!weight) return null
  const ml = weight * ML_PER_KG + (ACTIVITY_EXTRA[activity] ?? 0)
  return Math.min(MAX_GOAL, Math.max(MIN_GOAL, round50(ml)))
}

export function hotDayExtra(weather) {
  return weather && weather.max >= HOT_DAY_MAX ? HOT_DAY_EXTRA : 0
}

export function dailyGoal(settings, weather) {
  return settings.goal + (settings.goalMode === 'auto' ? hotDayExtra(weather) : 0)
}
