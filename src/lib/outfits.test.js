import { describe, expect, it } from 'vitest'
import { ADS_TO_UNLOCK, autoOutfit, isUnlocked, recordAd, REWARD_OUTFITS, seasonOutfit, specialOutfit, weatherOutfit, wornOutfit } from './outfits.js'

const wardrobe = { wearing: 'auto', unlocked: [], views: {} }
const day = (month, date) => new Date(2026, month - 1, date, 12)

describe('special days', () => {
  it('dresses up for holidays', () => {
    expect(specialOutfit(day(12, 24))).toBe('christmas')
    expect(specialOutfit(day(1, 3))).toBe('christmas')
    expect(specialOutfit(day(12, 31))).toBe('newyear')
    expect(specialOutfit(day(1, 1))).toBe('newyear')
    expect(specialOutfit(day(10, 31))).toBe('halloween')
    expect(specialOutfit(day(2, 14))).toBe('valentine')
    expect(specialOutfit(day(3, 25))).toBe('greece')
    expect(specialOutfit(day(10, 28))).toBe('greece')
    expect(specialOutfit(day(6, 10))).toBeNull()
  })
})

describe('weather', () => {
  it('picks clothes for the temperature', () => {
    expect(weatherOutfit({ max: 8, rain: false, snow: false })).toBe('winter')
    expect(weatherOutfit({ max: 15, rain: false, snow: false })).toBe('chilly')
    expect(weatherOutfit({ max: 21, rain: false, snow: false })).toBe('casual')
    expect(weatherOutfit({ max: 27, rain: false, snow: false })).toBe('sunny')
    expect(weatherOutfit({ max: 35, rain: false, snow: false })).toBe('heatwave')
  })

  it('lets rain and snow win over temperature', () => {
    expect(weatherOutfit({ max: 22, rain: true, snow: false })).toBe('rainy')
    expect(weatherOutfit({ max: 1, rain: true, snow: true })).toBe('winter')
  })

  it('falls back to the season without a forecast', () => {
    expect(seasonOutfit(day(1, 15))).toBe('winter')
    expect(seasonOutfit(day(4, 15))).toBe('chilly')
    expect(seasonOutfit(day(5, 15))).toBe('casual')
    expect(seasonOutfit(day(7, 15))).toBe('sunny')
    expect(autoOutfit({ date: day(7, 15), weather: { max: 14, rain: false, snow: false } })).toBe('chilly')
    expect(autoOutfit({ date: day(12, 25), weather: { max: 30, rain: false, snow: false } })).toBe('christmas')
  })
})

describe('rewards', () => {
  it('unlocks an outfit after enough ads and puts it on', () => {
    let state = wardrobe
    for (let count = 1; count < ADS_TO_UNLOCK; count += 1) {
      state = recordAd(state, 'crown')
      expect(isUnlocked(state, 'crown')).toBe(false)
    }
    state = recordAd(state, 'crown')
    expect(isUnlocked(state, 'crown')).toBe(true)
    expect(state.wearing).toBe('crown')
    expect(state.views.crown).toBeUndefined()
  })

  it('ignores ads for free or already unlocked outfits', () => {
    expect(recordAd(wardrobe, 'winter')).toBe(wardrobe)
    const owned = { ...wardrobe, unlocked: ['chef'] }
    expect(recordAd(owned, 'chef')).toBe(owned)
  })

  it('wears a chosen outfit only when it is unlocked', () => {
    const date = day(6, 10)
    expect(wornOutfit({ wardrobe: { ...wardrobe, wearing: 'pirate' }, date, weather: null })).toBe('sunny')
    expect(wornOutfit({ wardrobe: { ...wardrobe, wearing: 'pirate', unlocked: ['pirate'] }, date, weather: null })).toBe('pirate')
    expect(wornOutfit({ wardrobe: { ...wardrobe, wearing: 'rainy' }, date, weather: null })).toBe('rainy')
  })

  it('has several outfits to unlock', () => {
    expect(REWARD_OUTFITS.length).toBeGreaterThanOrEqual(8)
  })
})
