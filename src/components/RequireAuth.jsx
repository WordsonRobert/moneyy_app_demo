import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'

/** Redirects to /auth if there's no signed-in guest. */
export default function RequireAuth({ children }) {
  const { isAuthed, authReady } = useAuth()
  const location = useLocation()

  // In real (Firebase) mode we don't know yet whether there's a session until
  // Firebase reports it — hold a warm splash instead of flashing the auth screen.
  if (!authReady) {
    return (
      <div className="auth-splash">
        <div className="auth-splash__mark" />
      </div>
    )
  }

  if (!isAuthed) return <Navigate to="/auth" replace state={{ from: location.pathname }} />
  return children
}
