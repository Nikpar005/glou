import { describe, expect, it, vi } from 'vitest'

vi.mock('./notifications.js', () => ({ scheduleReminders: vi.fn() }))

const { lastDrink } = await import('./useReminders.js')

describe('lastDrink', () => {
  it('finds the most recent drink across days', () => {
    const days = {
      '2026-11-20': [{ at: '2026-11-20T21:00:00.000Z', ml: 250 }],
      '2026-11-21': [{ at: '2026-11-21T08:00:00.000Z', ml: 250 }, { at: '2026-11-21T07:00:00.000Z', ml: 500 }],
    }
    expect(lastDrink(days).toISOString()).toBe('2026-11-21T08:00:00.000Z')
  })

  it('is empty before the first drink', () => {
    expect(lastDrink({})).toBeNull()
  })
})
