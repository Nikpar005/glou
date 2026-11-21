import { describe, expect, it } from 'vitest'
import { expectedFraction, mood } from './mood.js'

const at = (hours, minutes = 0) => new Date(2026, 10, 21, hours, minutes)
const day = { goal: 4000, wakeStart: '09:00', wakeEnd: '23:00' }

describe('mood', () => {
  it('expects progress through the waking hours', () => {
    expect(expectedFraction(at(8), '09:00', '23:00')).toBe(0)
    expect(expectedFraction(at(16), '09:00', '23:00')).toBe(0.5)
    expect(expectedFraction(at(23, 30), '09:00', '23:00')).toBe(1)
  })

  it('handles a bedtime after midnight', () => {
    expect(expectedFraction(at(1), '10:00', '02:00')).toBeCloseTo(15 / 16)
  })

  it('is sleepy before the first drink of the morning', () => {
    expect(mood({ ...day, total: 0, now: at(9, 30) })).toBe('sleepy')
  })

  it('is thirsty when the day runs ahead of the drinks', () => {
    expect(mood({ ...day, total: 500, now: at(16) })).toBe('thirsty')
  })

  it('is happy on schedule and proud at the goal', () => {
    expect(mood({ ...day, total: 2000, now: at(16) })).toBe('happy')
    expect(mood({ ...day, total: 4000, now: at(12) })).toBe('proud')
  })
})
