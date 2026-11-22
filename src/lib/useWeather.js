import { CapacitorHttp } from '@capacitor/core'
import { useEffect, useState } from 'react'
import { dayKey } from './dates.js'
import { isNative } from './platform.js'
import { fetchForecast, parseForecast } from './weather.js'

const CACHE_KEY = 'glou.weather.v1'

async function http(url, headers) {
  if (isNative) {
    const response = await CapacitorHttp.get({ url, headers })
    if (response.status !== 200) throw new Error(String(response.status))
    return typeof response.data === 'string' ? JSON.parse(response.data) : response.data
  }
  const response = await fetch(url, { headers: { Accept: headers.Accept } })
  if (!response.ok) throw new Error(String(response.status))
  return response.json()
}

function readCache(location) {
  try {
    const cached = JSON.parse(globalThis.localStorage?.getItem(CACHE_KEY) || 'null')
    if (cached && cached.day === dayKey() && cached.lat === location.lat && cached.lon === location.lon) return cached.weather
  } catch {
    return null
  }
  return null
}

function writeCache(location, weather) {
  try {
    globalThis.localStorage?.setItem(CACHE_KEY, JSON.stringify({ day: dayKey(), lat: location.lat, lon: location.lon, weather }))
  } catch {
    return
  }
}

export function useWeather(location) {
  const [weather, setWeather] = useState(() => (location ? readCache(location) : null))
  const lat = location?.lat
  const lon = location?.lon

  useEffect(() => {
    if (lat == null || lon == null) {
      setWeather(null)
      return undefined
    }
    const place = { lat, lon }
    const cached = readCache(place)
    if (cached) {
      setWeather(cached)
      return undefined
    }
    let cancelled = false
    fetchForecast(place, http)
      .then((json) => {
        const parsed = parseForecast(json)
        if (cancelled || !parsed) return
        writeCache(place, parsed)
        setWeather(parsed)
      })
      .catch(() => {})
    return () => {
      cancelled = true
    }
  }, [lat, lon])

  return weather
}
