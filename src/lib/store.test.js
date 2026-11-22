import { describe, expect, it } from 'vitest'
import { createStore, DEFAULT_SETTINGS, DEFAULT_WARDROBE, STORAGE_KEY } from './store.js'

function memory(initial = {}) {
  const values = { ...initial }
  return { values, get: async (key) => values[key] ?? null, set: async (key, value) => { values[key] = value } }
}

describe('store', () => {
  it('starts with the default settings', async () => {
    const state = await createStore(memory()).load()
    expect(state.settings).toEqual({ ...DEFAULT_SETTINGS, location: null })
    expect(state.days).toEqual({})
    expect(state.wardrobe).toEqual(DEFAULT_WARDROBE)
  })

  it('keeps a valid location and wardrobe and drops broken parts', async () => {
    const backend = memory()
    await backend.set(
      'glou.state.v1',
      JSON.stringify({
        settings: { location: { lat: 37.98, lon: 23.73 } },
        wardrobe: { wearing: 'crown', unlocked: ['crown', 4], views: { pirate: 2, chef: -1 } },
      }),
    )
    const state = await createStore(backend).load()
    expect(state.settings.location).toEqual({ lat: 37.98, lon: 23.73 })
    expect(state.wardrobe).toEqual({ ...DEFAULT_WARDROBE, wearing: 'crown', unlocked: ['crown'], views: { pirate: 2 } })
  })

  it('ignores a location without coordinates', async () => {
    const backend = memory()
    await backend.set('glou.state.v1', JSON.stringify({ settings: { location: { lat: 'x' } } }))
    expect((await createStore(backend).load()).settings.location).toBeNull()
  })

  it('round-trips a saved state', async () => {
    const backend = memory()
    const store = createStore(backend)
    const state = await store.load()
    state.days['2026-11-21'] = [{ at: '2026-11-21T09:00:00.000Z', ml: 250 }]
    state.settings.goal = 3000
    await store.save(state)
    expect(await store.load()).toEqual(state)
  })

  it('drops broken entries instead of failing', async () => {
    const backend = memory({
      [STORAGE_KEY]: JSON.stringify({
        settings: { goal: 'lots', interval: 45 },
        days: { 'not-a-day': [], '2026-11-20': [{ at: 'x', ml: -5 }, { at: 'y', ml: 500 }] },
      }),
    })
    const state = await createStore(backend).load()
    expect(state.settings.goal).toBe(DEFAULT_SETTINGS.goal)
    expect(state.settings.interval).toBe(45)
    expect(state.days).toEqual({ '2026-11-20': [{ at: 'y', ml: 500 }] })
  })

  it('survives text that is not JSON', async () => {
    const state = await createStore(memory({ [STORAGE_KEY]: '{oops' })).load()
    expect(state.days).toEqual({})
  })
})

describe('preferences backend', () => {
  it('reads and writes through the Preferences plugin', async () => {
    const { preferencesBackend } = await import('./store.js')
    const values = {}
    const backend = preferencesBackend({
      get: async ({ key }) => ({ value: values[key] ?? null }),
      set: async ({ key, value }) => {
        values[key] = value
      },
    })
    await backend.set('a', '1')
    expect(await backend.get('a')).toBe('1')
    expect(await backend.get('b')).toBeNull()
  })
})
