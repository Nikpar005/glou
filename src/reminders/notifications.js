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
