import { describe, expect, it } from 'vitest'
import { strings } from '../lib/i18n.js'
import { reminderItems, reminderTexts } from './notifications.js'

describe('reminderItems', () => {
  const t = strings('el')

  it('numbers reminders from one and sends epoch milliseconds', () => {
    const times = [new Date(2026, 10, 22, 10, 0), new Date(2026, 10, 22, 10, 30)]
    const items = reminderItems(times, t)
    expect(items.map(({ id }) => id)).toEqual([1, 2])
    expect(items[0].at).toBe(times[0].getTime())
    expect(items[0].title).toBe(t.notificationTitle)
  })

  it('caps the number of pending reminders', () => {
    const times = Array.from({ length: 80 }, (_, index) => new Date(2026, 10, 22, 0, index))
    expect(reminderItems(times, t)).toHaveLength(60)
  })
})

describe('reminderTexts', () => {
  it('gives the native side every string it needs in both languages', () => {
    for (const language of ['el', 'en']) {
      const texts = reminderTexts(strings(language))
      for (const value of Object.values(texts)) expect(value.length).toBeGreaterThan(0)
      for (const group of ['titles', 'low', 'mid', 'almost', 'evening', 'logged', 'done']) expect(Array.isArray(texts[group])).toBe(true)
      expect(texts.progress).toContain('{left}')
      expect(texts.loggedBody).toContain('{goal}')
      for (const line of texts.logged) expect(line).toContain('{ml}')
      expect(texts.doneBody).toContain('{total}')
    }
  })
})
