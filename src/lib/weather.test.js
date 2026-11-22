import { describe, expect, it } from 'vitest'
import { parseForecast, roundCoordinate } from './weather.js'

const at = (hour, temperature, symbol, rain = 0) => ({
  time: new Date(2026, 10, 22, hour).toISOString(),
  data: {
    instant: { details: { air_temperature: temperature } },
    next_1_hours: { summary: { symbol_code: symbol }, details: { precipitation_amount: rain } },
  },
})

const now = new Date(2026, 10, 22, 9)

describe('parseForecast', () => {
  it('finds the highest temperature of today', () => {
    const json = { properties: { timeseries: [at(9, 11.2, 'cloudy'), at(14, 16.6, 'partlycloudy_day'), at(20, 12, 'clearsky_night')] } }
    expect(parseForecast(json, now)).toEqual({ max: 17, rain: false, snow: false })
  })

  it('ignores other days', () => {
    const tomorrow = { time: new Date(2026, 10, 23, 14).toISOString(), data: { instant: { details: { air_temperature: 30 } } } }
    const json = { properties: { timeseries: [at(10, 12, 'cloudy'), tomorrow] } }
    expect(parseForecast(json, now).max).toBe(12)
  })

  it('needs more than a passing shower to call it rainy', () => {
    const shower = { properties: { timeseries: [at(10, 15, 'lightrainshowers_day'), at(11, 15, 'cloudy')] } }
    const wet = { properties: { timeseries: [at(10, 15, 'rain', 1.2), at(11, 15, 'rain', 2)] } }
    expect(parseForecast(shower, now).rain).toBe(false)
    expect(parseForecast(wet, now).rain).toBe(true)
  })

  it('spots snow and ignores the night', () => {
    const json = { properties: { timeseries: [at(3, -2, 'heavysnow'), at(12, 1, 'snow')] } }
    expect(parseForecast(json, now).snow).toBe(true)
    expect(parseForecast({ properties: { timeseries: [at(3, -2, 'heavysnow')] } }, now).snow).toBe(false)
  })

  it('returns nothing for a broken answer', () => {
    expect(parseForecast(null, now)).toBeNull()
    expect(parseForecast({ properties: { timeseries: [] } }, now)).toBeNull()
  })
})

describe('roundCoordinate', () => {
  it('keeps the location approximate', () => {
    expect(roundCoordinate(37.983917)).toBe(37.98)
    expect(roundCoordinate(23.72936)).toBe(23.73)
  })
})
