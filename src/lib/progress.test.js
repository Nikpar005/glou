import { describe, expect, it } from 'vitest'
import { fraction, goalMet, streak, totalFor } from './progress.js'

const drinks = (...amounts) => amounts.map((ml) => ({ at: '2026-11-21T10:00:00.000Z', ml }))

describe('progress', () => {
  const days = {
    '2026-11-18': drinks(2000, 2000),
    '2026-11-19': drinks(4000),
    '2026-11-20': drinks(1000, 3500),
    '2026-11-21': drinks(500),
  }

  it('adds up a day', () => {
    expect(totalFor(days, '2026-11-20')).toBe(4500)
    expect(totalFor(days, '2026-11-01')).toBe(0)
  })

  it('checks the goal', () => {
    expect(goalMet(days, '2026-11-19', 4000)).toBe(true)
    expect(goalMet(days, '2026-11-21', 4000)).toBe(false)
  })

  it('keeps yesterday\'s streak while today is still open', () => {
    expect(streak(days, '2026-11-21', 4000)).toBe(3)
  })

  it('counts today once its goal is met', () => {
    expect(streak({ ...days, '2026-11-21': drinks(4000) }, '2026-11-21', 4000)).toBe(4)
  })

  it('caps the fraction at a full glass', () => {
    expect(fraction(5000, 4000)).toBe(1)
    expect(fraction(1000, 4000)).toBe(0.25)
  })
})
