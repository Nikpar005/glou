import ProgressRing from '../components/ProgressRing.jsx'
import QuickAdd from '../components/QuickAdd.jsx'
import { dayKey } from '../lib/dates.js'
import { formatMl, strings } from '../lib/i18n.js'
import { fraction, totalFor } from '../lib/progress.js'

export default function Home({ state, onAdd }) {
  const { settings, days } = state
  const t = strings(settings.language)
  const today = dayKey()
  const total = totalFor(days, today)
  const left = Math.max(settings.goal - total, 0)
  return (
    <section>
      <h1 className="title">{t.today}</h1>
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
        onCustom={() => onAdd(settings.customSize)}
      />
    </section>
  )
}
