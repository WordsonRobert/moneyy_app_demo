import { createContext, useCallback, useContext, useState } from 'react'
import Icon from '../components/Icon.jsx'
import './toast.css'

const ToastContext = createContext(null)

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])

  const toast = useCallback((message, opts = {}) => {
    const id = Math.random().toString(36).slice(2)
    setToasts((t) => [...t, { id, message, icon: opts.icon || 'checkCircle' }])
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), opts.duration || 2600)
  }, [])

  return (
    <ToastContext.Provider value={toast}>
      {children}
      <div className="toast-wrap">
        {toasts.map((t) => (
          <div key={t.id} className="toast">
            <Icon name={t.icon} size={18} color="var(--gold)" />
            <span>{t.message}</span>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}

export const useToast = () => {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error('useToast must be used within ToastProvider')
  return ctx
}
