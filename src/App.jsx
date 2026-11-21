import { useCallback, useState } from 'react'
import Toast from './components/Toast.jsx'
import { formatMl, strings } from './lib/i18n.js'
import Home from './screens/Home.jsx'
import { useWater } from './state/useWater.js'

export default function App() {
  const water = useWater()
  const [last, setLast] = useState(null)
  const clearLast = useCallback(() => setLast(null), [])
  if (!water.state) return null
  const { settings } = water.state
  const t = strings(settings.language)

  const add = (ml) => setLast(water.addDrink(ml))

  return (
    <main className="app">
      <Home state={water.state} onAdd={add} onCustomSize={(ml) => water.updateSettings({ customSize: ml })} />
      {last && (
        <Toast
          key={last.drink.at}
          message={t.added(formatMl(last.drink.ml, settings.language))}
          actionLabel={t.undo}
          onAction={() => {
            water.removeDrink(last.key, last.drink.at)
            setLast(null)
          }}
          onDone={clearLast}
        />
      )}
    </main>
  )
}
