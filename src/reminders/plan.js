import { dayKey, parseTime } from '../lib/dates.js'

const DAY = 24 * 60

function at(base, dayOffset, minute) {
  const date = new Date(base.getFullYear(), base.getMonth(), base.getDate() + dayOffset, 0, 0, 0, 0)
  date.setMinutes(minute)
  return date
}

export function wakingSlots(day, settings) {
  const start = parseTime(settings.wakeStart)
  let end = parseTime(settings.wakeEnd)
  if (end <= start) end += DAY
  const slots = []
  for (let minute = start; minute <= end; minute += settings.interval) slots.push(at(day, 0, minute))
  return slots
}

export function planReminders({ now, settings, goal = Infinity, totalFor = () => 0, lastDrinkAt = null, days = 2 }) {
  if (!settings.reminders || settings.interval <= 0) return []
  const quietUntil = lastDrinkAt ? new Date(lastDrinkAt.getTime() + settings.interval * 60000) : null
  const plan = []
  for (let offset = -1; offset < days; offset += 1) {
    const day = at(now, offset, 0)
    if (totalFor(dayKey(day)) >= goal) continue
    for (const slot of wakingSlots(day, settings)) {
      if (slot <= now) continue
      if (quietUntil && slot < quietUntil) continue
      plan.push(slot)
    }
  }
  return plan.sort((a, b) => a - b)
}
