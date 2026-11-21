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
import './Home.css'

export default function Home({ state, onAdd, onCustomSize, onRemove }) {
  const [custom, setCustom] = useState(false)
  const { settings, days } = state
  const t = strings(settings.language)
  const today = dayKey()
  const total = totalFor(days, today)
  const left = Math.max(settings.goal - total, 0)
  const face = mood({ total, goal: settings.goal, now: new Date(), wakeStart: settings.wakeStart, wakeEnd: settings.wakeEnd })
  return (
    <section>
      <div className="home-header">
        <h1 className="title">{t.today}</h1>
        <Glou mood={face} size={64} />
      </div>
      <p className="bubble">{t.moods[face]}</p>
      <ProgressRing
        fraction={fraction(total, settings.goal)}
        total={formatMl(total, settings.language)}
        goalText={t.ofGoal(formatMl(settings.goal, settings.language))}
        leftText={left ? t.left(formatMl(left, settings.language)) : t.goalReached}
      />
      <QuickAdd
        sizes={[250, 500]}
        labels={[formatMl(250, settings.language), formatMl(500, settings.language)]}
        onAdd={onAdd}
        customLabel={t.custom}
        onCustom={() => setCustom(true)}
      />
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
