import { describe, expect, it } from 'vitest'
import { allLines, fill, glouLine, lineCategory, lineOptions } from './lines.js'

const base = { goal: 2000, wakeStart: '08:00', wakeEnd: '22:00', weather: null, streak: 0 }
const at = (hour, minute = 0) => new Date(2026, 10, 24, hour, minute)

describe('lineCategory', () => {
  it('follows the day', () => {
    expect(lineCategory({ ...base, total: 0, now: at(8, 30) })).toBe('morning')
    expect(lineCategory({ ...base, total: 250, now: at(14) })).toBe('behind')
    expect(lineCategory({ ...base, total: 250, now: at(20) })).toBe('evening')
    expect(lineCategory({ ...base, total: 900, now: at(15) })).toBe('onTrack')
    expect(lineCategory({ ...base, total: 1400, now: at(12) })).toBe('ahead')
    expect(lineCategory({ ...base, total: 1700, now: at(20) })).toBe('almost')
    expect(lineCategory({ ...base, total: 2000, now: at(20) })).toBe('done')
    expect(lineCategory({ ...base, total: 3000, now: at(20) })).toBe('overflow')
    expect(lineCategory({ ...base, total: 500, now: at(23, 30) })).toBe('night')
    expect(lineCategory({ ...base, total: 0, now: at(7) })).toBe('morning')
  })
})

describe('lineOptions', () => {
  it('adds weather lines on hot days', () => {
    const { options } = lineOptions('el', { ...base, total: 900, now: at(15), weather: { max: 34, rain: false, snow: false } })
    expect(options.some((line) => line.includes('{temp}'))).toBe(true)
  })

  it('celebrates a streak once the goal is met', () => {
    const { options } = lineOptions('en', { ...base, total: 2000, now: at(20), streak: 5 })
    expect(options.some((line) => line.includes('{streak}'))).toBe(true)
  })
})

describe('glouLine', () => {
  it('fills every placeholder', () => {
    for (const language of ['el', 'en']) {
      for (let hour = 0; hour < 24; hour += 1) {
        for (const total of [0, 500, 1000, 1600, 2000, 3000]) {
          const line = glouLine(language, { ...base, total, now: at(hour), weather: { max: 33, rain: false, snow: false }, streak: 4 }, { left: '1 L', total: '1 L', goal: '2 L' })
          expect(line).not.toMatch(/\{\w+\}/)
        }
      }
    }
  })

  it('changes after a drink', () => {
    const lines = new Set([0, 250, 500, 750, 1000].map((total) => glouLine('el', { ...base, total, now: at(15) }, { left: '', total: '', goal: '' })))
    expect(lines.size).toBeGreaterThan(1)
  })

  it('shows a different line on every turn', () => {
    const context = { ...base, total: 500, now: at(15) }
    const seen = [0, 1, 2, 3, 4].map((turn) => glouLine('el', context, { left: '', total: '', goal: '' }, turn))
    expect(new Set(seen).size).toBe(5)
  })

  it('never calls the goal a ring', () => {
    const { el, en } = allLines()
    for (const line of Object.values(el).flat()) expect(line).not.toMatch(/δαχτυλίδι/)
    for (const line of Object.values(en).flat()) expect(line).not.toMatch(/\bring\b/)
  })

  it('has the same groups in both languages', () => {
    const { el, en } = allLines()
    expect(Object.keys(en).sort()).toEqual(Object.keys(el).sort())
    for (const key of Object.keys(el)) expect(el[key].length).toBeGreaterThan(0)
  })
})

describe('fill', () => {
  it('leaves unknown placeholders alone', () => {
    expect(fill('{a} {b}', { a: 1 })).toBe('1 {b}')
  })
})
