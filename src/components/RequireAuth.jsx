import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'

/** Redirects to /auth if there's no signed-in guest. */
export default function RequireAuth({ children }) {
  const { isAuthed } = useAuth()
  const location = useLocation()
  if (!isAuthed) return <Navigate to="/auth" replace state={{ from: location.pathname }} />
  return children
}
