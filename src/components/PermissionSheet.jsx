import Glou from './Glou.jsx'
import Sheet from './Sheet.jsx'
import './PermissionSheet.css'

export default function PermissionSheet({ t, onAllow, onLater }) {
  return (
    <Sheet open onClose={onLater} label={t.permissionTitle}>
      <div className="permission">
        <Glou mood="happy" size={96} />
        <h2>{t.permissionTitle}</h2>
        <p>{t.permissionText}</p>
      </div>
      <div className="sheet-actions">
        <button className="button-secondary" onClick={onLater}>{t.notNow}</button>
        <button className="button-primary" onClick={onAllow}>{t.allow}</button>
      </div>
    </Sheet>
  )
}
