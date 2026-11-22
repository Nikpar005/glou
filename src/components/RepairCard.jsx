import './RepairCard.css'

export default function RepairCard({ t, days, onRepair }) {
  return (
    <div className="card repair">
      <span className="repair-flame" aria-hidden="true">
        🔥
      </span>
      <div>
        <strong>{t.repairTitle(days)}</strong>
        <p>{t.repairText}</p>
        <button className="button-primary" onClick={onRepair}>
          {t.repairButton}
        </button>
      </div>
    </div>
  )
}
