import { useCallback, useState } from 'react'
import TabBar from './components/TabBar.jsx'
import Toast from './components/Toast.jsx'
import { formatMl, strings } from './lib/i18n.js'
import Home from './screens/Home.jsx'
import { useWater } from './state/useWater.js'

export default function App() {
  const water = useWater()
  const [last, setLast] = useState(null)
  const [tab, setTab] = useState('today')
  const clearLast = useCallback(() => setLast(null), [])
  if (!water.state) return null
  const { settings } = water.state
  const t = strings(settings.language)

  const add = (ml) => setLast(water.addDrink(ml))

  return (
    <main className="app">
      {tab === 'today' && (
        <Home state={water.state} onAdd={add} onCustomSize={(ml) => water.updateSettings({ customSize: ml })}
        onRemove={water.removeDrink}
        />
      )}
      {tab === 'calendar' && <h1 className="title">{t.calendar}</h1>}
      {tab === 'settings' && <h1 className="title">{t.settings}</h1>}
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
      <TabBar
        tabs={[
          { id: 'today', label: t.today },
          { id: 'calendar', label: t.calendar },
          { id: 'settings', label: t.settings },
        ]}
        current={tab}
        onChange={setTab}
      />
    </main>
  )
}
