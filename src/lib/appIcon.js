import { registerPlugin } from '@capacitor/core'
import { isNative } from './platform.js'

const GlouIcon = registerPlugin('GlouIcon')

export async function setAppIcon(icon) {
  if (!isNative) return
  await GlouIcon.set({ icon })
}
