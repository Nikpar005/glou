import { useState } from 'react'
import CustomAmount from '../components/CustomAmount.jsx'
import Glou from '../components/Glou.jsx'
import ProgressRing from '../components/ProgressRing.jsx'
import QuickAdd from '../components/QuickAdd.jsx'
import TodayLog from '../components/TodayLog.jsx'
import { dayKey } from '../lib/dates.js'
import { formatMl, strings } from '../lib/i18n.js'
import { mood } from '../lib/mood.js'
import { fraction, totalFor } from '../lib/progress.js'
import { tipIndex } from '../lib/tips.js'
import './Home.css'

export default function Home({ state, goal, outfit, weather, onAdd, onCustomSize, onRemove, lastAdded, onOpenWardrobe }) {
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
      <div className="home-header">
        <h1 className="title">{t.today}</h1>
        <button className="home-glou" onClick={onOpenWardrobe} aria-label={t.wardrobeTitle}>
          <Glou key={lastAdded || 'idle'} mood={face} outfit={outfit} size={84} splash={Boolean(lastAdded)} />
        </button>
      </div>
      <p className="bubble">{t.moods[face]}</p>
      <ProgressRing
        fraction={fraction(total, goal)}
        total={formatMl(total, settings.language)}
        goalText={t.ofGoal(formatMl(goal, settings.language))}
        leftText={left ? t.left(formatMl(left, settings.language)) : t.goalReached}
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
