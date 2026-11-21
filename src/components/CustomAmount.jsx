import { useState } from 'react'
import Sheet from './Sheet.jsx'
import './CustomAmount.css'

const STEP = 50
const MIN = 50
const MAX = 2000

export default function CustomAmount({ open, initial, onClose, onAdd, t }) {
  const [ml, setMl] = useState(initial)
  const change = (delta) => setMl((value) => Math.min(MAX, Math.max(MIN, value + delta)))
  return (
    <Sheet open={open} onClose={onClose} label={t.custom}>
      <div className="amount">
        <button className="amount-step" onClick={() => change(-STEP)} aria-label="−50 ml">−</button>
        <output className="amount-value">{ml} ml</output>
        <button className="amount-step" onClick={() => change(STEP)} aria-label="+50 ml">+</button>
      </div>
      <input
        className="amount-slider"
        type="range"
        min={MIN}
        max={MAX}
        step={STEP}
        value={ml}
        onChange={(event) => setMl(Number(event.target.value))}
        aria-label={t.custom}
      />
      <div className="sheet-actions">
        <button className="button-secondary" onClick={onClose}>{t.cancel}</button>
        <button className="button-primary" onClick={() => onAdd(ml)}>{t.add}</button>
      </div>
    </Sheet>
  )
}
