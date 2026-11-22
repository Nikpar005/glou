export const STORAGE_KEY = 'glou.state.v1'

export const DEFAULT_SETTINGS = {
  goal: 4000,
  wakeStart: '09:00',
  wakeEnd: '23:00',
  interval: 30,
  reminders: true,
  language: 'el',
  customSize: 330,
  askedPermission: false,
  weight: 0,
  activity: 'moderate',
  goalMode: 'manual',
  askedProfile: false,
}

export const DEFAULT_WARDROBE = { wearing: 'auto', unlocked: [], views: {}, selected: {}, ads: null, giftDay: null, repairs: [] }

export function emptyState() {
  return { settings: { ...DEFAULT_SETTINGS, location: null }, days: {}, wardrobe: { ...DEFAULT_WARDROBE } }
}

export function normalize(raw) {
  const state = emptyState()
  if (!raw || typeof raw !== 'object') return state
  if (raw.settings && typeof raw.settings === 'object') {
    for (const key of Object.keys(DEFAULT_SETTINGS)) {
      if (typeof raw.settings[key] === typeof DEFAULT_SETTINGS[key]) state.settings[key] = raw.settings[key]
    }
  }
  const location = raw.settings?.location
  if (location && Number.isFinite(location.lat) && Number.isFinite(location.lon)) state.settings.location = { lat: location.lat, lon: location.lon }
  const wardrobe = raw.wardrobe
  if (wardrobe && typeof wardrobe === 'object') {
    if (typeof wardrobe.wearing === 'string') state.wardrobe.wearing = wardrobe.wearing
    if (Array.isArray(wardrobe.unlocked)) state.wardrobe.unlocked = wardrobe.unlocked.filter((id) => typeof id === 'string')
    if (wardrobe.views && typeof wardrobe.views === 'object') {
      state.wardrobe.views = Object.fromEntries(Object.entries(wardrobe.views).filter(([, count]) => Number.isInteger(count) && count > 0))
    }
    if (wardrobe.selected && typeof wardrobe.selected === 'object') {
      state.wardrobe.selected = Object.fromEntries(Object.entries(wardrobe.selected).filter(([, id]) => typeof id === 'string'))
    }
    if (wardrobe.ads && typeof wardrobe.ads.day === 'string' && Number.isInteger(wardrobe.ads.count)) state.wardrobe.ads = { day: wardrobe.ads.day, count: wardrobe.ads.count }
    if (typeof wardrobe.giftDay === 'string') state.wardrobe.giftDay = wardrobe.giftDay
    if (Array.isArray(wardrobe.repairs)) state.wardrobe.repairs = wardrobe.repairs.filter((key) => /^\d{4}-\d{2}-\d{2}$/.test(key))
  }
  if (raw.days && typeof raw.days === 'object') {
    for (const [key, drinks] of Object.entries(raw.days)) {
      if (!/^\d{4}-\d{2}-\d{2}$/.test(key) || !Array.isArray(drinks)) continue
      const valid = drinks.filter((drink) => drink && typeof drink.at === 'string' && Number.isFinite(drink.ml) && drink.ml > 0)
      if (valid.length) state.days[key] = valid
    }
  }
  return state
}

export function createStore(backend) {
  return {
    async load() {
      try {
        const text = await backend.get(STORAGE_KEY)
        return normalize(text ? JSON.parse(text) : null)
      } catch {
        return emptyState()
      }
    },
    async save(state) {
      await backend.set(STORAGE_KEY, JSON.stringify(state))
    },
  }
}

export const localBackend = {
  async get(key) {
    try {
      return globalThis.localStorage?.getItem(key) ?? null
    } catch {
      return null
    }
  },
  async set(key, value) {
    try {
      globalThis.localStorage?.setItem(key, value)
    } catch {
      return
    }
  },
}

export function preferencesBackend(preferences) {
  return {
    async get(key) {
      const { value } = await preferences.get({ key })
      return value
    },
    async set(key, value) {
      await preferences.set({ key, value })
    },
  }
}
