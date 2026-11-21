import { describe, expect, it } from 'vitest'
import { createStore, DEFAULT_SETTINGS, STORAGE_KEY } from './store.js'

function memory(initial = {}) {
  const values = { ...initial }
  return { values, get: async (key) => values[key] ?? null, set: async (key, value) => { values[key] = value } }
}

describe('store', () => {
  it('starts with the default settings', async () => {
    const state = await createStore(memory()).load()
    expect(state.settings).toEqual(DEFAULT_SETTINGS)
    expect(state.days).toEqual({})
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
