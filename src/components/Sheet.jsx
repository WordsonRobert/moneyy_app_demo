import { useEffect } from 'react'
import Icon from './Icon.jsx'
import './Sheet.css'

/**
 * A bottom sheet / modal. Renders its children over a scrim.
 * Controlled via `open` + `onClose`.
 */
export default function Sheet({ open, onClose, title, children, full = false }) {
  useEffect(() => {
    if (!open) return
    const onKey = (e) => e.key === 'Escape' && onClose?.()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose])

  if (!open) return null

  return (
    <div className="sheet-scrim" onClick={onClose}>
      <div
        className={`sheet ${full ? 'sheet--full' : ''}`}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        <div className="sheet__grip" />
        <div className="sheet__head">
          <h3>{title}</h3>
          <button className="sheet__close" onClick={onClose} aria-label="Close">
            <Icon name="close" size={20} />
          </button>
        </div>
        <div className="sheet__body">{children}</div>
      </div>
    </div>
  )
}
