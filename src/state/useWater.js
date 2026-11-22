import { useCallback, useEffect, useRef, useState } from 'react'
import { dayKey } from '../lib/dates.js'
import { store as defaultStore } from '../lib/platform.js'

export function useWater(store = defaultStore) {
  const [state, setState] = useState(null)
  const loaded = useRef(false)

  const reload = useCallback(() => {
    let cancelled = false
    store.load().then((value) => {
      if (!cancelled) {
        loaded.current = true
        setState(value)
      }
    })
    return () => {
      cancelled = true
    }
  }, [store])

  useEffect(reload, [reload])

  useEffect(() => {
    if (loaded.current && state) store.save(state)
  }, [state, store])

  const addDrink = useCallback((ml, at = new Date()) => {
    const drink = { at: at.toISOString(), ml }
    const key = dayKey(at)
    setState((current) => ({ ...current, days: { ...current.days, [key]: [...(current.days[key] || []), drink] } }))
    return { key, drink }
  }, [])

  const removeDrink = useCallback((key, at) => {
    setState((current) => {
      const remaining = (current.days[key] || []).filter((drink) => drink.at !== at)
      const days = { ...current.days }
      if (remaining.length) days[key] = remaining
      else delete days[key]
      return { ...current, days }
    })
  }, [])

  const updateSettings = useCallback((changes) => {
    setState((current) => ({ ...current, settings: { ...current.settings, ...changes } }))
  }, [])

  return { state, addDrink, removeDrink, updateSettings, reload }
}
