import { addDays } from './dates.js'

export function totalFor(days, key) {
  return (days[key] || []).reduce((sum, drink) => sum + drink.ml, 0)
}

export function goalMet(days, key, goal) {
  return totalFor(days, key) >= goal
}

export function counted(days, key, goal, repairs = []) {
  return goalMet(days, key, goal) || repairs.includes(key)
}

export function streak(days, today, goal, repairs = []) {
  let key = goalMet(days, today, goal) ? today : addDays(today, -1)
  let count = 0
  while (counted(days, key, goal, repairs)) {
    count += 1
    key = addDays(key, -1)
  }
  return count
}

export function fraction(total, goal) {
  return goal > 0 ? Math.min(total / goal, 1) : 0
}
