import { LocalNotifications } from '@capacitor/local-notifications'
import { registerPlugin } from '@capacitor/core'
import { isNative } from '../lib/platform.js'

const GlouReminders = registerPlugin('GlouReminders')
const MAX_PENDING = 60
let legacyCleared = false

export async function permissionState() {
  if (!isNative) return 'unavailable'
  const { display } = await LocalNotifications.checkPermissions()
  return display
}

export async function requestPermission() {
  if (!isNative) return 'unavailable'
  const { display } = await LocalNotifications.requestPermissions()
  return display
}

async function clearLegacy() {
  if (legacyCleared) return
  legacyCleared = true
  const { notifications } = await LocalNotifications.getPending()
  if (notifications.length) await LocalNotifications.cancel({ notifications: notifications.map(({ id }) => ({ id })) })
}

export function reminderItems(times, t) {
  const bodies = t.reminderBodies
  const offset = times.length ? Math.floor(times[0].getTime() / 86400000) * 7 : 0
  return times.slice(0, MAX_PENDING).map((at, index) => ({
    id: index + 1,
    at: at.getTime(),
    title: t.notificationTitle,
    body: bodies[(offset + index) % bodies.length],
  }))
}

export function reminderTexts(t) {
  return {
    channel: t.reminders,
    action: t.notificationActions.drink,
    loggedTitle: t.notificationLogged.title,
    loggedBody: t.notificationLogged.body,
    doneTitle: t.notificationLogged.done,
  }
}

export function onExternalDrink(handler) {
  if (!isNative) return () => {}
  const listener = GlouReminders.addListener('drinkLogged', handler)
  return () => listener.then((handle) => handle.remove())
}

export async function scheduleReminders(times, t) {
  if (!isNative) return
  await clearLegacy().catch(() => {})
  const allowed = times.length && (await permissionState()) === 'granted'
  if (!allowed) {
    await GlouReminders.cancelAll()
    return
  }
  await GlouReminders.schedule({ items: reminderItems(times, t), texts: reminderTexts(t) })
}
