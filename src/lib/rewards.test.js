import { describe, expect, it } from 'vitest'
import { DEFAULT_WARDROBE } from './store.js'
import { adsToday, canWatch, DAILY_AD_LIMIT, giftReady, KINDS, lockedItems, openGift, owns, progress, recordAd, repair, repairable, selected } from './rewards.js'
import { streak } from './progress.js'

const today = '2026-11-22'
const empty = { ...DEFAULT_WARDROBE }

describe('unlocking with ads', () => {
  it('unlocks after the number of ads for that kind and selects it', () => {
    let state = empty
    for (let count = 1; count < KINDS.scene.ads; count += 1) {
      state = recordAd(state, 'scene', 'beach', today)
      expect(owns(state, 'scene', 'beach')).toBe(false)
      expect(progress(state, 'scene', 'beach')).toBe(count)
    }
    state = recordAd(state, 'scene', 'beach', today)
    expect(owns(state, 'scene', 'beach')).toBe(true)
    expect(selected(state, 'scene')).toBe('beach')
    expect(adsToday(state, today)).toBe(KINDS.scene.ads)
  })

  it('puts on an unlocked outfit', () => {
    let state = empty
    for (let count = 0; count < KINDS.outfit.ads; count += 1) state = recordAd(state, 'outfit', 'crown', today)
    expect(state.unlocked).toContain('crown')
    expect(state.wearing).toBe('crown')
  })

  it('unlocks a one-ad sound straight away', () => {
    const state = recordAd(empty, 'sound', 'chime', today)
    expect(owns(state, 'sound', 'chime')).toBe(true)
  })

  it('ignores free, owned or unknown items', () => {
    expect(recordAd(empty, 'scene', 'sky', today)).toBe(empty)
    expect(recordAd(empty, 'scene', 'moon', today)).toBe(empty)
    expect(recordAd(empty, 'hat', 'x', today)).toBe(empty)
  })

  it('stops at the daily limit and resets the next day', () => {
    let state = empty
    for (const [kind, id] of lockedItems(empty)) state = recordAd(state, kind, id, today)
    expect(adsToday(state, today)).toBe(DAILY_AD_LIMIT)
    const full = { ...empty, ads: { day: today, count: DAILY_AD_LIMIT } }
    expect(canWatch(full, today)).toBe(false)
    expect(recordAd(full, 'scene', 'beach', today)).toBe(full)
    expect(canWatch(full, '2026-11-23')).toBe(true)
  })

  it('falls back to the free item when the selection is not owned', () => {
    expect(selected({ ...empty, selected: { theme: 'midnight' } }, 'theme')).toBe('ocean')
  })
})

describe('daily gift', () => {
  it('unlocks one random locked item once a day', () => {
    const before = lockedItems(empty).length
    const { wardrobe, gift } = openGift(empty, today, () => 0)
    expect(gift).toEqual({ kind: 'outfit', id: KINDS.outfit.paid[0] })
    expect(lockedItems(wardrobe)).toHaveLength(before - 1)
    expect(giftReady(wardrobe, today)).toBe(false)
    expect(giftReady(wardrobe, '2026-11-23')).toBe(true)
    expect(openGift(wardrobe, today).gift).toBeNull()
  })

  it('can land on the last item', () => {
    const { gift } = openGift(empty, today, () => 0.9999)
    expect(gift.kind).toBe('icon')
  })
})

describe('streak repair', () => {
  const met = [{ at: 'x', ml: 2000 }]
  const days = { '2026-11-18': met, '2026-11-19': met, '2026-11-20': met }
  const args = { wardrobe: empty, days, today, goal: 2000 }

  it('offers to save a streak broken yesterday', () => {
    expect(repairable({ ...args, streakBefore: streak(days, '2026-11-20', 2000) })).toBe(true)
  })

  it('counts the repaired day so the streak continues', () => {
    const fixed = repair(empty, today)
    expect(fixed.repairs).toEqual(['2026-11-21'])
    const withToday = { ...days, [today]: met }
    expect(streak(withToday, today, 2000, fixed.repairs)).toBe(5)
  })

  it('needs a streak worth saving and a week between repairs', () => {
    expect(repairable({ ...args, streakBefore: 1 })).toBe(false)
    expect(repairable({ ...args, wardrobe: { ...empty, repairs: ['2026-11-17'] }, streakBefore: 3 })).toBe(false)
    expect(repairable({ ...args, wardrobe: { ...empty, repairs: ['2026-11-10'] }, streakBefore: 3 })).toBe(true)
    expect(repairable({ ...args, days: { ...days, '2026-11-21': met }, streakBefore: 4 })).toBe(false)
  })
})
