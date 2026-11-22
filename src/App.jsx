import { useCallback, useEffect, useState } from 'react'
import AdPlayer from './components/AdPlayer.jsx'
import PermissionSheet from './components/PermissionSheet.jsx'
import ProfileSheet from './components/ProfileSheet.jsx'
import TabBar from './components/TabBar.jsx'
import Toast from './components/Toast.jsx'
import { dailyGoal } from './lib/hydration.js'
import { formatMl, strings } from './lib/i18n.js'
import { ADS_TO_UNLOCK, recordAd, wornOutfit } from './lib/outfits.js'
import { isNative } from './lib/platform.js'
import { useWeather } from './lib/useWeather.js'
import Calendar from './screens/Calendar.jsx'
import Home from './screens/Home.jsx'
import Settings from './screens/Settings.jsx'
import Wardrobe from './screens/Wardrobe.jsx'
import { onExternalDrink, requestPermission } from './reminders/notifications.js'
import { useReminders } from './reminders/useReminders.js'
import { useWater } from './state/useWater.js'

export default function App() {
  const water = useWater()
  const [last, setLast] = useState(null)
  const [tab, setTab] = useState('today')
  const [ad, setAd] = useState(null)
  const [notice, setNotice] = useState(null)
  const weather = useWeather(water.state?.settings.location)
  const goal = water.state ? dailyGoal(water.state.settings, weather) : null
  useReminders(water.state, goal)
  const { reload } = water
  useEffect(() => onExternalDrink(reload), [reload])
  useEffect(() => {
    const onVisible = () => document.visibilityState === 'visible' && reload()
    document.addEventListener('visibilitychange', onVisible)
    return () => document.removeEventListener('visibilitychange', onVisible)
  }, [reload])
  const clearLast = useCallback(() => setLast(null), [])
  const clearNotice = useCallback(() => setNotice(null), [])
  if (!water.state) return null
  const { settings, wardrobe } = water.state
  const t = strings(settings.language)
  document.documentElement.lang = settings.language
  const outfit = wornOutfit({ wardrobe, date: new Date(), weather })

  const add = (ml) => setLast(water.addDrink(ml))
  const reward = () => {
    const id = ad
    setAd(null)
    const before = wardrobe.unlocked.includes(id)
    water.updateWardrobe((current) => recordAd(current, id))
    if (!before && (wardrobe.views[id] || 0) + 1 >= ADS_TO_UNLOCK) setNotice(`${t.unlocked} ${t.outfits[id]}`)
  }

  return (
    <main className="app">
      {tab === 'today' && (
        <Home
          state={water.state}
          goal={goal}
          outfit={outfit}
          weather={weather}
          onAdd={add}
          onCustomSize={(ml) => water.updateSettings({ customSize: ml })}
          onRemove={water.removeDrink}
          lastAdded={last?.drink.at}
          onOpenWardrobe={() => setTab('wardrobe')}
        />
      )}
      {tab === 'calendar' && <Calendar state={water.state} />}
      {tab === 'wardrobe' && (
        <Wardrobe
          state={water.state}
          outfit={outfit}
          weather={weather}
          onWear={(id) => water.updateWardrobe((current) => ({ ...current, wearing: id }))}
          onWatchAd={setAd}
        />
      )}
      {tab === 'settings' && <Settings settings={settings} weather={weather} onChange={water.updateSettings} />}
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
      {notice && <Toast key={notice} message={notice} onDone={clearNotice} />}
      {!settings.askedProfile && (
        <ProfileSheet
          t={t}
          settings={settings}
          onSave={({ weight, activity, goal: base }) => water.updateSettings({ weight, activity, goal: base, goalMode: 'auto', askedProfile: true })}
          onSkip={() => water.updateSettings({ askedProfile: true })}
        />
      )}
      {isNative && settings.askedProfile && !settings.askedPermission && (
        <PermissionSheet
          t={t}
          onAllow={async () => {
            const result = await requestPermission()
            water.updateSettings({ askedPermission: true, reminders: result === 'granted' })
          }}
          onLater={() => water.updateSettings({ askedPermission: true })}
        />
      )}
      {ad && <AdPlayer t={t} outfit={ad} onReward={reward} onClose={() => setAd(null)} />}
      <TabBar
        tabs={[
          { id: 'today', label: t.today },
          { id: 'calendar', label: t.calendar },
          { id: 'wardrobe', label: t.wardrobe },
          { id: 'settings', label: t.settings },
        ]}
        current={tab}
        onChange={setTab}
      />
    </main>
  )
}
