const pad = (value) => String(value).padStart(2, '0')

export function dayKey(date = new Date()) {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`
}

export function parseDayKey(key) {
  const [year, month, day] = key.split('-').map(Number)
  return new Date(year, month - 1, day)
}

export function addDays(key, days) {
  const date = parseDayKey(key)
  date.setDate(date.getDate() + days)
  return dayKey(date)
}

export function minutesOfDay(date) {
  return date.getHours() * 60 + date.getMinutes()
}

export function parseTime(text) {
  const [hours, minutes] = text.split(':').map(Number)
  return hours * 60 + minutes
}

export function formatTime(date) {
  return `${pad(date.getHours())}:${pad(date.getMinutes())}`
}

export function monthDays(year, month) {
  const count = new Date(year, month + 1, 0).getDate()
  return Array.from({ length: count }, (_, index) => dayKey(new Date(year, month, index + 1)))
}

export function weekdayIndex(key) {
  return (parseDayKey(key).getDay() + 6) % 7
}
