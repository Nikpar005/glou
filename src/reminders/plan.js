import { parseTime } from '../lib/dates.js'

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

export function planReminders({ now, settings, days = 2 }) {
  if (!settings.reminders || settings.interval <= 0) return []
  const plan = []
  for (let offset = -1; offset < days; offset += 1) {
    for (const slot of wakingSlots(at(now, offset, 0), settings)) {
      if (slot > now) plan.push(slot)
    }
  }
  return plan.sort((a, b) => a - b)
}
