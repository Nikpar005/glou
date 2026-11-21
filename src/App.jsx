import { useCallback, useState } from 'react'
import PermissionSheet from './components/PermissionSheet.jsx'
import TabBar from './components/TabBar.jsx'
import Toast from './components/Toast.jsx'
import { formatMl, strings } from './lib/i18n.js'
import Calendar from './screens/Calendar.jsx'
import Home from './screens/Home.jsx'
import Settings from './screens/Settings.jsx'
import { isNative } from './lib/platform.js'
import { requestPermission } from './reminders/notifications.js'
import { useWater } from './state/useWater.js'

export default function App() {
  const water = useWater()
  const [last, setLast] = useState(null)
  const [tab, setTab] = useState('today')
  const clearLast = useCallback(() => setLast(null), [])
  if (!water.state) return null
  const { settings } = water.state
  const t = strings(settings.language)
  document.documentElement.lang = settings.language

  const add = (ml) => setLast(water.addDrink(ml))

  return (
    <main className="app">
      {tab === 'today' && (
        <Home state={water.state} onAdd={add} onCustomSize={(ml) => water.updateSettings({ customSize: ml })}
        onRemove={water.removeDrink}
          lastAdded={last?.drink.at}
        />
      )}
      {tab === 'calendar' && <Calendar state={water.state} />}
      {tab === 'settings' && <Settings settings={settings} onChange={water.updateSettings} />}
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
      {isNative && !settings.askedPermission && (
        <PermissionSheet
          t={t}
          onAllow={async () => {
            const result = await requestPermission()
            water.updateSettings({ askedPermission: true, reminders: result === 'granted' })
          }}
          onLater={() => water.updateSettings({ askedPermission: true })}
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
