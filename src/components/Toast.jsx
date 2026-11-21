import { useEffect } from 'react'
import './Toast.css'

export default function Toast({ message, actionLabel, onAction, onDone, duration = 4000 }) {
  useEffect(() => {
    const timer = setTimeout(onDone, duration)
    return () => clearTimeout(timer)
  }, [message, onDone, duration])
  return (
    <div className="toast" role="status">
      <span>{message}</span>
      {actionLabel && (
        <button className="toast-action" onClick={onAction}>
          {actionLabel}
        </button>
      )}
    </div>
  )
}
