import { dayKey } from './dates.js'

export const MET_URL = 'https://api.met.no/weatherapi/locationforecast/2.0/compact'
export const USER_AGENT = 'Glou/0.2 github.com/Nikpar005/glou'

const RAIN_WORDS = ['rain', 'sleet', 'thunder']

export function roundCoordinate(value) {
  return Math.round(value * 100) / 100
}

export function parseForecast(json, now = new Date()) {
  const today = dayKey(now)
  const series = json?.properties?.timeseries
  if (!Array.isArray(series)) return null
  let max = -Infinity
  let rain = false
  let snow = false
  let wet = 0
  for (const entry of series) {
    const time = new Date(entry.time)
    if (dayKey(time) !== today) continue
    const temperature = entry.data?.instant?.details?.air_temperature
    if (Number.isFinite(temperature)) max = Math.max(max, temperature)
    const next = entry.data?.next_1_hours || entry.data?.next_6_hours
    const symbol = next?.summary?.symbol_code || ''
    const hour = time.getHours()
    if (hour < 8 || hour > 21) continue
    if (symbol.includes('snow')) snow = true
    if (RAIN_WORDS.some((word) => symbol.includes(word))) wet += 1
    if ((entry.data?.next_1_hours?.details?.precipitation_amount ?? 0) >= 0.5) wet += 1
  }
  if (max === -Infinity) return null
  rain = wet >= 2
  return { max: Math.round(max), rain, snow }
}

export async function fetchForecast({ lat, lon }, http) {
  const url = `${MET_URL}?lat=${roundCoordinate(lat)}&lon=${roundCoordinate(lon)}`
  return http(url, { Accept: 'application/json', 'User-Agent': USER_AGENT })
}

export function currentPosition() {
  return new Promise((resolve, reject) => {
    if (!globalThis.navigator?.geolocation) {
      reject(new Error('unavailable'))
      return
    }
    globalThis.navigator.geolocation.getCurrentPosition(
      ({ coords }) => resolve({ lat: roundCoordinate(coords.latitude), lon: roundCoordinate(coords.longitude) }),
      reject,
      { enableHighAccuracy: false, maximumAge: 6 * 60 * 60 * 1000, timeout: 15000 },
    )
  })
}
