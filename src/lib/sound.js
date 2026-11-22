let context = null

function audio() {
  const Context = globalThis.AudioContext || globalThis.webkitAudioContext
  if (!Context) return null
  if (!context) context = new Context()
  if (context.state === 'suspended') context.resume()
  return context
}

function tone(ctx, { at = 0, frequency, to, duration = 0.18, type = 'sine', volume = 0.18 }) {
  const start = ctx.currentTime + at
  const oscillator = ctx.createOscillator()
  const gain = ctx.createGain()
  oscillator.type = type
  oscillator.frequency.setValueAtTime(frequency, start)
  if (to) oscillator.frequency.exponentialRampToValueAtTime(to, start + duration)
  gain.gain.setValueAtTime(0.0001, start)
  gain.gain.exponentialRampToValueAtTime(volume, start + 0.015)
  gain.gain.exponentialRampToValueAtTime(0.0001, start + duration)
  oscillator.connect(gain).connect(ctx.destination)
  oscillator.start(start)
  oscillator.stop(start + duration + 0.02)
}

export const SOUNDS = {
  drop: [{ frequency: 1100, to: 320, duration: 0.16 }],
  bubble: [
    { frequency: 420, to: 900, duration: 0.08, volume: 0.12 },
    { at: 0.07, frequency: 520, to: 1100, duration: 0.08, volume: 0.12 },
    { at: 0.14, frequency: 640, to: 1300, duration: 0.1, volume: 0.12 },
  ],
  chime: [
    { frequency: 1046, duration: 0.5, volume: 0.12, type: 'triangle' },
    { at: 0.09, frequency: 1568, duration: 0.6, volume: 0.1, type: 'triangle' },
  ],
  marimba: [
    { frequency: 523, duration: 0.18, type: 'triangle' },
    { at: 0.08, frequency: 659, duration: 0.18, type: 'triangle' },
    { at: 0.16, frequency: 784, duration: 0.26, type: 'triangle' },
  ],
  mute: [],
}

export function playSound(id) {
  const notes = SOUNDS[id]
  if (!notes?.length) return
  try {
    const ctx = audio()
    if (ctx) for (const note of notes) tone(ctx, note)
  } catch {
    return
  }
}
