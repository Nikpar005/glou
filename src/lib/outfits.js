export const OUTFITS = {
  casual: { parts: [], kind: 'weather' },
  winter: { parts: ['sweater', 'scarf', 'beanie'], kind: 'weather' },
  chilly: { parts: ['scarf', 'beret'], kind: 'weather' },
  rainy: { parts: ['raincoat', 'boots', 'umbrella'], kind: 'weather' },
  sunny: { parts: ['sunglasses'], kind: 'weather' },
  heatwave: { parts: ['sunglasses', 'sunhat', 'icecream'], kind: 'weather' },
  christmas: { parts: ['sweater', 'scarf', 'santa'], kind: 'special' },
  newyear: { parts: ['bowtie', 'partyhat'], kind: 'special' },
  halloween: { parts: ['cape', 'witchhat'], kind: 'special' },
  valentine: { parts: ['heart'], kind: 'special' },
  greece: { parts: ['flag'], kind: 'special' },
  crown: { parts: ['cape', 'crown'], kind: 'reward' },
  chef: { parts: ['apron', 'chefhat'], kind: 'reward' },
  wizard: { parts: ['wizardhat', 'wand'], kind: 'reward' },
  dj: { parts: ['headphones', 'sunglasses'], kind: 'reward' },
  hero: { parts: ['cape', 'mask'], kind: 'reward' },
  flowers: { parts: ['flowercrown'], kind: 'reward' },
  pirate: { parts: ['eyepatch', 'piratehat'], kind: 'reward' },
  cowboy: { parts: ['bandana', 'cowboyhat'], kind: 'reward' },
  gentleman: { parts: ['bowtie', 'tophat', 'monocle'], kind: 'reward' },
}

export const REWARD_OUTFITS = Object.keys(OUTFITS).filter((id) => OUTFITS[id].kind === 'reward')

export function specialOutfit(date) {
  const month = date.getMonth() + 1
  const day = date.getDate()
  if ((month === 12 && day === 31) || (month === 1 && day === 1)) return 'newyear'
  if ((month === 12 && day >= 20) || (month === 1 && day <= 6)) return 'christmas'
  if (month === 10 && day === 31) return 'halloween'
  if (month === 2 && day === 14) return 'valentine'
  if ((month === 3 && day === 25) || (month === 10 && day === 28)) return 'greece'
  return null
}

export function seasonOutfit(date) {
  const month = date.getMonth() + 1
  if (month === 12 || month <= 2) return 'winter'
  if (month <= 4 || month >= 10) return 'chilly'
  if (month >= 6 && month <= 8) return 'sunny'
  return 'casual'
}

export function weatherOutfit(weather) {
  if (weather.snow) return 'winter'
  if (weather.rain) return 'rainy'
  if (weather.max >= 31) return 'heatwave'
  if (weather.max >= 25) return 'sunny'
  if (weather.max <= 11) return 'winter'
  if (weather.max <= 17) return 'chilly'
  return 'casual'
}

export function autoOutfit({ date, weather }) {
  return specialOutfit(date) || (weather ? weatherOutfit(weather) : seasonOutfit(date))
}

export function wornOutfit({ wardrobe, date, weather }) {
  const chosen = wardrobe.wearing
  if (chosen !== 'auto' && OUTFITS[chosen] && isUnlocked(wardrobe, chosen)) return chosen
  return autoOutfit({ date, weather })
}

export function isUnlocked(wardrobe, id) {
  return OUTFITS[id]?.kind !== 'reward' || wardrobe.unlocked.includes(id)
}
