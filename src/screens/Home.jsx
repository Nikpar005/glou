import { useState } from 'react'
import CustomAmount from '../components/CustomAmount.jsx'
import Glou from '../components/Glou.jsx'
import Hero from '../components/Hero.jsx'
import ProgressRing from '../components/ProgressRing.jsx'
import QuickAdd from '../components/QuickAdd.jsx'
import TodayLog from '../components/TodayLog.jsx'
import { dayKey } from '../lib/dates.js'
import { formatMl, strings } from '../lib/i18n.js'
import { glouLine } from '../lib/lines.js'
import { mood } from '../lib/mood.js'
import { fraction, streak, totalFor } from '../lib/progress.js'
import { tipIndex } from '../lib/tips.js'
import './Home.css'

export default function Home({ state, goal, outfit, look, weather, repair, onAdd, onCustomSize, onRemove, lastAdded, onOpenWardrobe }) {
  const [custom, setCustom] = useState(false)
  const { settings, days } = state
  const t = strings(settings.language)
  const today = dayKey()
  const total = totalFor(days, today)
  const left = Math.max(goal - total, 0)
  const extra = goal - settings.goal
  const face = mood({ total, goal, now: new Date(), wakeStart: settings.wakeStart, wakeEnd: settings.wakeEnd })
  return (
    <section>
      <header className="home-header">
        <h1 className="title">{t.today}</h1>
        <span className="home-date">{new Date().toLocaleDateString(settings.language === 'el' ? 'el-GR' : 'en-GB', { weekday: 'long', day: 'numeric', month: 'long' })}</span>
      </header>
      <Hero
        scene={look.scene}
        outfit={outfit}
        mood={face}
        companion={look.companion}
        dance={look.dance}
        splashKey={lastAdded}
        label={t.wardrobeTitle}
        onOpen={onOpenWardrobe}
        line={glouLine(
          settings.language,
          { total, goal, now: new Date(), wakeStart: settings.wakeStart, wakeEnd: settings.wakeEnd, weather, streak: streak(days, today, settings.goal, state.wardrobe.repairs) },
          { left: formatMl(left, settings.language), total: formatMl(total, settings.language), goal: formatMl(goal, settings.language) },
        )}
      />
      {repair}
      <ProgressRing
        fraction={fraction(total, goal)}
        total={formatMl(total, settings.language)}
        goalText={t.ofGoal(formatMl(goal, settings.language))}
        leftText={left ? t.left(formatMl(left, settings.language)) : t.goalReached}
        waterStyle={look.water}
      />
      {extra > 0 && weather && <p className="hot-note">{t.hotDay(formatMl(extra, settings.language))}</p>}
      <QuickAdd
        sizes={[250, 500]}
        labels={[formatMl(250, settings.language), formatMl(500, settings.language)]}
        onAdd={onAdd}
        customLabel={t.custom}
        onCustom={() => setCustom(true)}
      />
      <aside className="card tip">
        <Glou mood="happy" outfit={outfit} size={44} />
        <p>{t.tips[tipIndex(today, t.tips.length)]}</p>
      </aside>
      <TodayLog drinks={days[today] || []} language={settings.language} t={t} onRemove={(at) => onRemove(today, at)} />
      {custom && (
        <CustomAmount
          open
          initial={settings.customSize}
          t={t}
          onClose={() => setCustom(false)}
          onAdd={(ml) => {
            setCustom(false)
            onCustomSize(ml)
            onAdd(ml)
          }}
        />
      )}
    </section>
  )
}
