import { useCallback, useEffect, useState } from 'react'
import AdPlayer from './components/AdPlayer.jsx'
import Celebration from './components/Celebration.jsx'
import PermissionSheet from './components/PermissionSheet.jsx'
import ProfileSheet from './components/ProfileSheet.jsx'
import RepairCard from './components/RepairCard.jsx'
import TabBar from './components/TabBar.jsx'
import Toast from './components/Toast.jsx'
import { setAppIcon } from './lib/appIcon.js'
import { addDays, dayKey } from './lib/dates.js'
import { dailyGoal } from './lib/hydration.js'
import { formatMl, strings } from './lib/i18n.js'
import { wornOutfit } from './lib/outfits.js'
import { isNative } from './lib/platform.js'
import { streak, totalFor } from './lib/progress.js'
import { openGift, recordAd, repair, repairable, selected } from './lib/rewards.js'
import { playSound } from './lib/sound.js'
import { useWeather } from './lib/useWeather.js'
import Calendar from './screens/Calendar.jsx'
import Home from './screens/Home.jsx'
import Settings from './screens/Settings.jsx'
import Wardrobe from './screens/Wardrobe.jsx'
import { onExternalDrink, requestPermission } from './reminders/notifications.js'
import { useReminders } from './reminders/useReminders.js'
import { useWater } from './state/useWater.js'

const LOOK_KINDS = ['scene', 'theme', 'water', 'companion', 'dance', 'sound', 'celebration', 'icon']

export default function App() {
  const water = useWater()
  const [last, setLast] = useState(null)
  const [tab, setTab] = useState('today')
  const [ad, setAd] = useState(null)
  const [notice, setNotice] = useState(null)
  const [party, setParty] = useState(null)
  const weather = useWeather(water.state?.settings.location)
  const goal = water.state ? dailyGoal(water.state.settings, weather) : null
  const theme = water.state ? selected(water.state.wardrobe, 'theme') : 'ocean'
  useReminders(water.state, goal)
  const { reload } = water
  useEffect(() => onExternalDrink(reload), [reload])
  useEffect(() => {
    const onVisible = () => document.visibilityState === 'visible' && reload()
    document.addEventListener('visibilitychange', onVisible)
    return () => document.removeEventListener('visibilitychange', onVisible)
  }, [reload])
  useEffect(() => {
    document.documentElement.dataset.theme = theme
  }, [theme])
  const clearLast = useCallback(() => setLast(null), [])
  const clearNotice = useCallback(() => setNotice(null), [])
  const clearParty = useCallback(() => setParty(null), [])
  if (!water.state) return null
  const { settings, wardrobe, days } = water.state
  const t = strings(settings.language)
  document.documentElement.lang = settings.language
  const today = dayKey()
  const outfit = wornOutfit({ wardrobe, date: new Date(), weather })
  const look = Object.fromEntries(LOOK_KINDS.map((kind) => [kind, selected(wardrobe, kind)]))
  const streakBefore = streak(days, addDays(today, -2), settings.goal, wardrobe.repairs)
  const canRepair = repairable({ wardrobe, days, today, goal: settings.goal, streakBefore })
  const repairCard = canRepair ? <RepairCard t={t} days={streakBefore + 1} onRepair={() => setAd({ type: 'repair' })} /> : null

  const add = (ml) => {
    const before = totalFor(days, today)
    setLast(water.addDrink(ml))
    playSound(look.sound)
    if (before < goal && before + ml >= goal) setParty({ id: look.celebration, at: Date.now() })
  }

  const reward = () => {
    const current = ad
    setAd(null)
    if (current.type === 'gift') {
      const { wardrobe: next, gift } = openGift(wardrobe, today)
      if (!gift) return
      water.updateWardrobe(() => next)
      const name = gift.kind === 'outfit' ? t.outfits[gift.id] : t.items[gift.kind][gift.id]
      setNotice(t.giftWon(t.kinds[gift.kind], name))
      return
    }
    if (current.type === 'repair') {
      water.updateWardrobe((value) => repair(value, today))
      setNotice(t.repaired)
      return
    }
    const next = recordAd(wardrobe, current.kind, current.id, today)
    water.updateWardrobe(() => next)
    const key = current.kind === 'outfit' ? current.id : `${current.kind}:${current.id}`
    if (!wardrobe.unlocked.includes(key) && next.unlocked.includes(key)) {
      const name = current.kind === 'outfit' ? t.outfits[current.id] : t.items[current.kind][current.id]
      setNotice(`${t.unlocked} ${name}`)
    }
  }

  const select = (kind, id) => {
    if (kind === 'icon') setAppIcon(id).catch(() => {})
    water.updateWardrobe((value) => (kind === 'outfit' ? { ...value, wearing: id } : { ...value, selected: { ...value.selected, [kind]: id } }))
  }

  return (
    <main className="app">
      {tab === 'today' && (
        <Home
          state={water.state}
          goal={goal}
          outfit={outfit}
          look={look}
          weather={weather}
          repair={repairCard}
          onAdd={add}
          onCustomSize={(ml) => water.updateSettings({ customSize: ml })}
          onRemove={water.removeDrink}
          lastAdded={last?.drink.at}
          onOpenWardrobe={() => setTab('wardrobe')}
        />
      )}
      {tab === 'calendar' && <Calendar state={water.state} repair={repairCard} />}
      {tab === 'wardrobe' && (
        <Wardrobe
          state={water.state}
          outfit={outfit}
          weather={weather}
          onSelect={select}
          onWatchAd={(kind, id) => setAd({ type: 'item', kind, id })}
          onGift={() => setAd({ type: 'gift' })}
          onPreview={(kind, id) => (kind === 'sound' ? playSound(id) : setParty({ id, at: Date.now() }))}
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
      {party && <Celebration key={party.at} id={party.id} onDone={clearParty} />}
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
      {ad && <AdPlayer t={t} outfit={ad.kind === 'outfit' ? ad.id : outfit} onReward={reward} onClose={() => setAd(null)} />}
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
