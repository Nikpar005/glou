import { describe, expect, it } from 'vitest'
import { addDays, dayKey, monthDays, parseTime, weekdayIndex } from './dates.js'

describe('dates', () => {
  it('uses the local calendar day', () => {
    expect(dayKey(new Date(2026, 0, 5, 23, 59))).toBe('2026-01-05')
  })

  it('adds days across a month and a year', () => {
    expect(addDays('2026-01-31', 1)).toBe('2026-02-01')
    expect(addDays('2026-01-01', -1)).toBe('2025-12-31')
  })

  it('lists the days of a month', () => {
    expect(monthDays(2028, 1)).toHaveLength(29)
    expect(monthDays(2026, 10)[0]).toBe('2026-11-01')
  })

  it('starts weeks on Monday', () => {
    expect(weekdayIndex('2026-11-23')).toBe(0)
    expect(weekdayIndex('2026-11-22')).toBe(6)
  })

  it('reads clock times as minutes', () => {
    expect(parseTime('09:30')).toBe(570)
  })
})
