import { LocalNotifications } from '@capacitor/local-notifications'
import { isNative } from '../lib/platform.js'

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

const CHANNEL = 'reminders'
const MAX_PENDING = 60
let channelReady = false

async function ensureChannel(t) {
  if (channelReady) return
  await LocalNotifications.createChannel({
    id: CHANNEL,
    name: t.reminders,
    importance: 3,
    visibility: 1,
    vibration: true,
  })
  channelReady = true
}

export async function scheduleReminders(times, t) {
  if (!isNative) return
  const { notifications } = await LocalNotifications.getPending()
  if (notifications.length) await LocalNotifications.cancel({ notifications: notifications.map(({ id }) => ({ id })) })
  if (!times.length || (await permissionState()) !== 'granted') return
  await ensureChannel(t)
  await LocalNotifications.schedule({
    notifications: times.slice(0, MAX_PENDING).map((at, index) => ({
      id: index + 1,
      title: t.notificationTitle,
      body: t.reminderBodies[index % t.reminderBodies.length],
      channelId: CHANNEL,
      schedule: { at, allowWhileIdle: true },
    })),
  })
}
