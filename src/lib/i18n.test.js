import { describe, expect, it } from 'vitest'
import { formatMl, strings } from './i18n.js'

describe('i18n', () => {
  it('has the same keys in both languages', () => {
    expect(Object.keys(strings('en')).sort()).toEqual(Object.keys(strings('el')).sort())
  })

  it('falls back to Greek', () => {
    expect(strings('fr').today).toBe('Σήμερα')
  })

  it('formats litres with the local decimal mark', () => {
    expect(formatMl(250, 'el')).toBe('250 ml')
    expect(formatMl(2500, 'el')).toBe('2,5 L')
    expect(formatMl(2500, 'en')).toBe('2.5 L')
  })
})
