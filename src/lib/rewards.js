import { addDays } from './dates.js'
import { OUTFITS } from './outfits.js'

export const DAILY_AD_LIMIT = 10
export const REPAIR_COOLDOWN_DAYS = 7

export const KINDS = {
  outfit: { ads: 3, free: Object.keys(OUTFITS).filter((id) => OUTFITS[id].kind !== 'reward'), paid: Object.keys(OUTFITS).filter((id) => OUTFITS[id].kind === 'reward') },
  scene: { ads: 3, free: ['sky'], paid: ['beach', 'mountain', 'city', 'space', 'sea', 'forest'] },
  theme: { ads: 2, free: ['ocean'], paid: ['sunset', 'forest', 'lavender', 'midnight'] },
  water: { ads: 2, free: ['water'], paid: ['lemonade', 'matcha', 'strawberry', 'galaxy'] },
  companion: { ads: 3, free: ['none'], paid: ['goldfish', 'duckling', 'cloud', 'turtle'] },
  dance: { ads: 2, free: ['wiggle'], paid: ['jump', 'spin', 'shake'] },
  sound: { ads: 1, free: ['drop', 'mute'], paid: ['bubble', 'chime', 'marimba'] },
  celebration: { ads: 2, free: ['bubbles'], paid: ['confetti', 'fireworks', 'stars'] },
  icon: { ads: 2, free: ['classic'], paid: ['night', 'sunset', 'mint'] },
}

export const DEFAULT_SELECTED = Object.fromEntries(Object.entries(KINDS).filter(([kind]) => kind !== 'outfit').map(([kind, { free }]) => [kind, free[0]]))

export function itemKey(kind, id) {
  return kind === 'outfit' ? id : `${kind}:${id}`
}

export function splitKey(key) {
  const index = key.indexOf(':')
  return index < 0 ? ['outfit', key] : [key.slice(0, index), key.slice(index + 1)]
}

export function owns(wardrobe, kind, id) {
  const info = KINDS[kind]
  if (!info) return false
  if (info.free.includes(id)) return true
  return info.paid.includes(id) && wardrobe.unlocked.includes(itemKey(kind, id))
}

export function selected(wardrobe, kind) {
  const id = wardrobe.selected?.[kind]
  return id && owns(wardrobe, kind, id) ? id : DEFAULT_SELECTED[kind]
}

export function adsToday(wardrobe, today) {
  return wardrobe.ads?.day === today ? wardrobe.ads.count : 0
}

export function canWatch(wardrobe, today) {
  return adsToday(wardrobe, today) < DAILY_AD_LIMIT
}

function countAd(wardrobe, today) {
  return { ...wardrobe, ads: { day: today, count: adsToday(wardrobe, today) + 1 } }
}

function unlock(wardrobe, kind, id) {
  const key = itemKey(kind, id)
  const views = { ...wardrobe.views }
  delete views[key]
  const next = { ...wardrobe, views, unlocked: [...wardrobe.unlocked, key] }
  if (kind === 'outfit') return { ...next, wearing: id }
  if (kind === 'icon') return next
  return { ...next, selected: { ...next.selected, [kind]: id } }
}

export function progress(wardrobe, kind, id) {
  return wardrobe.views[itemKey(kind, id)] || 0
}

export function recordAd(wardrobe, kind, id, today) {
  const info = KINDS[kind]
  if (!info || !info.paid.includes(id) || owns(wardrobe, kind, id) || !canWatch(wardrobe, today)) return wardrobe
  const counted = countAd(wardrobe, today)
  const seen = progress(wardrobe, kind, id) + 1
  if (seen >= info.ads) return unlock(counted, kind, id)
  return { ...counted, views: { ...counted.views, [itemKey(kind, id)]: seen } }
}

export function lockedItems(wardrobe) {
  const items = []
  for (const [kind, info] of Object.entries(KINDS)) {
    for (const id of info.paid) if (!owns(wardrobe, kind, id)) items.push([kind, id])
  }
  return items
}

export function giftReady(wardrobe, today) {
  return wardrobe.giftDay !== today && lockedItems(wardrobe).length > 0
}

export function openGift(wardrobe, today, random = Math.random) {
  if (!giftReady(wardrobe, today) || !canWatch(wardrobe, today)) return { wardrobe, gift: null }
  const items = lockedItems(wardrobe)
  const [kind, id] = items[Math.min(items.length - 1, Math.floor(random() * items.length))]
  const next = unlock(countAd({ ...wardrobe, giftDay: today }, today), kind, id)
  return { wardrobe: next, gift: { kind, id } }
}

export function repairable({ wardrobe, days, today, goal, streakBefore }) {
  const yesterday = addDays(today, -1)
  const total = (days[yesterday] || []).reduce((sum, drink) => sum + drink.ml, 0)
  if (total >= goal || wardrobe.repairs.includes(yesterday)) return false
  if (streakBefore < 2) return false
  const recent = wardrobe.repairs.some((key) => key > addDays(today, -REPAIR_COOLDOWN_DAYS - 1))
  return !recent && canWatch(wardrobe, today)
}

export function repair(wardrobe, today) {
  const yesterday = addDays(today, -1)
  if (wardrobe.repairs.includes(yesterday)) return wardrobe
  return { ...countAd(wardrobe, today), repairs: [...wardrobe.repairs, yesterday] }
}
