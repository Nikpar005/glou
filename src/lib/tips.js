export function tipIndex(key, count) {
  let hash = 0
  for (const character of key) hash = (hash * 31 + character.charCodeAt(0)) >>> 0
  return count > 0 ? hash % count : 0
}
