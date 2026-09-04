import { Navigate, Route, Routes } from 'react-router-dom'
import { ToastProvider } from './context/ToastContext.jsx'
import { useAuth } from './context/AuthContext.jsx'
import AppLayout from './components/AppLayout.jsx'
import RequireAuth from './components/RequireAuth.jsx'

import AuthScreen from './features/auth/AuthScreen.jsx'
import WelcomeScreen from './features/auth/WelcomeScreen.jsx'
import HomeScreen from './features/home/HomeScreen.jsx'
import ExploreScreen from './features/explore/ExploreScreen.jsx'
import RoomsScreen from './features/rooms/RoomsScreen.jsx'
import RoomServiceScreen from './features/roomservice/RoomServiceScreen.jsx'
import ReelsScreen from './features/reels/ReelsScreen.jsx'
import ProfileScreen from './features/profile/ProfileScreen.jsx'
import BookingsScreen from './features/bookings/BookingsScreen.jsx'
import BookingHubScreen from './features/booking/BookingHubScreen.jsx'

/** Sends signed-in guests who haven't set a name to onboarding first. */
function RequireName({ children }) {
  const { needsName } = useAuth()
  if (needsName) return <Navigate to="/welcome" replace />
  return children
}

/** Onboarding is only for guests who still need a name; otherwise skip it. */
function OnboardingOnly({ children }) {
  const { needsName } = useAuth()
  if (!needsName) return <Navigate to="/" replace />
  return children
}

export default function App() {
  return (
    <ToastProvider>
      <div className="app-shell">
        <Routes>
          {/* Auth is outside the tabbed layout */}
          <Route path="/auth" element={<AuthScreen />} />

          {/* One-time name onboarding, gated to guests who still need it */}
          <Route
            path="/welcome"
            element={
              <RequireAuth>
                <OnboardingOnly>
                  <WelcomeScreen />
                </OnboardingOnly>
              </RequireAuth>
            }
          />

          {/* Everything else requires a signed-in, named guest */}
          <Route
            element={
              <RequireAuth>
                <RequireName>
                  <AppLayout />
                </RequireName>
              </RequireAuth>
            }
          >
            <Route path="/" element={<HomeScreen />} />
            <Route path="/explore" element={<ExploreScreen />} />
            <Route path="/rooms" element={<RoomsScreen />} />
            <Route path="/room-service" element={<RoomServiceScreen />} />
            <Route path="/reels" element={<ReelsScreen />} />
            <Route path="/booking" element={<BookingHubScreen />} />
            <Route path="/bookings" element={<BookingsScreen />} />
            <Route path="/profile" element={<ProfileScreen />} />
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </ToastProvider>
  )
}
