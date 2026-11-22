import { describe, expect, it } from 'vitest'
import { baseGoal, dailyGoal, hotDayExtra } from './hydration.js'

describe('baseGoal', () => {
  it('scales with weight and activity and rounds to 50 ml', () => {
    expect(baseGoal({ weight: 70, activity: 'low' })).toBe(2300)
    expect(baseGoal({ weight: 70, activity: 'moderate' })).toBe(2650)
    expect(baseGoal({ weight: 70, activity: 'high' })).toBe(3000)
  })

  it('stays within sensible limits', () => {
    expect(baseGoal({ weight: 35, activity: 'low' })).toBe(1500)
    expect(baseGoal({ weight: 160, activity: 'high' })).toBe(4500)
    expect(baseGoal({ weight: 0, activity: 'low' })).toBeNull()
  })
})

describe('dailyGoal', () => {
  const hot = { max: 34, rain: false, snow: false }
  it('adds extra water on hot days only in automatic mode', () => {
    expect(hotDayExtra(hot)).toBe(500)
    expect(hotDayExtra({ max: 25 })).toBe(0)
    expect(dailyGoal({ goal: 2650, goalMode: 'auto' }, hot)).toBe(3150)
    expect(dailyGoal({ goal: 2650, goalMode: 'manual' }, hot)).toBe(2650)
    expect(dailyGoal({ goal: 2650, goalMode: 'auto' }, null)).toBe(2650)
  })
})
