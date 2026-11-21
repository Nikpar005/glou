import { describe, expect, it } from 'vitest'
import { tipIndex } from './tips.js'

describe('tips', () => {
  it('keeps the same tip for the whole day', () => {
    expect(tipIndex('2026-11-21', 5)).toBe(tipIndex('2026-11-21', 5))
  })

  it('stays inside the list', () => {
    for (let day = 1; day <= 28; day += 1) {
      const index = tipIndex(`2026-02-${String(day).padStart(2, '0')}`, 5)
      expect(index).toBeGreaterThanOrEqual(0)
      expect(index).toBeLessThan(5)
    }
  })
})
