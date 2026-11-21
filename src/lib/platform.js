import { Capacitor } from '@capacitor/core'
import { Preferences } from '@capacitor/preferences'
import { createStore, localBackend, preferencesBackend } from './store.js'

export const isNative = Capacitor.isNativePlatform()

export const store = createStore(isNative ? preferencesBackend(Preferences) : localBackend)
