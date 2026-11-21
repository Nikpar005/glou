import { minutesOfDay, parseTime } from './dates.js'

export function expectedFraction(now, wakeStart, wakeEnd) {
  const start = parseTime(wakeStart)
  let end = parseTime(wakeEnd)
  let minute = minutesOfDay(now)
  if (end <= start) end += 24 * 60
  if (minute < start && end > 24 * 60) minute += 24 * 60
  if (minute <= start) return 0
  if (minute >= end) return 1
  return (minute - start) / (end - start)
}

export function mood({ total, goal, now, wakeStart, wakeEnd }) {
  if (goal > 0 && total >= goal) return 'proud'
  const expected = expectedFraction(now, wakeStart, wakeEnd)
  if (total === 0 && expected < 0.15) return 'sleepy'
  if (goal > 0 && total / goal < expected - 0.15) return 'thirsty'
  return 'happy'
}
