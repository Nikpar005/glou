import { describe, expect, it } from 'vitest'
import { planReminders, wakingSlots } from './plan.js'

const settings = { reminders: true, wakeStart: '09:00', wakeEnd: '23:00', interval: 30 }
const time = (date) => `${date.getDate()} ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`

describe('reminder plan', () => {
  it('fills the waking hours of a day', () => {
    const slots = wakingSlots(new Date(2026, 10, 21), settings)
    expect(slots).toHaveLength(29)
    expect(time(slots[0])).toBe('21 09:00')
    expect(time(slots.at(-1))).toBe('21 23:00')
  })

  it('plans only future reminders, for today and tomorrow', () => {
    const plan = planReminders({ now: new Date(2026, 10, 21, 22, 10), settings })
    expect(plan.map(time).slice(0, 3)).toEqual(['21 22:30', '21 23:00', '22 09:00'])
    expect(time(plan.at(-1))).toBe('22 23:00')
  })

  it('crosses midnight for a late bedtime', () => {
    const late = { ...settings, wakeStart: '10:00', wakeEnd: '01:00', interval: 60 }
    const plan = planReminders({ now: new Date(2026, 10, 22, 0, 20), settings: late })
    expect(time(plan[0])).toBe('22 01:00')
    expect(time(plan[1])).toBe('22 10:00')
  })

  it('plans nothing when reminders are off', () => {
    expect(planReminders({ now: new Date(2026, 10, 21, 12), settings: { ...settings, reminders: false } })).toEqual([])
  })
})
