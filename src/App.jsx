import { Navigate, Route, Routes } from 'react-router-dom'
import { ToastProvider } from './context/ToastContext.jsx'
import AppLayout from './components/AppLayout.jsx'
import RequireAuth from './components/RequireAuth.jsx'

import AuthScreen from './features/auth/AuthScreen.jsx'
import HomeScreen from './features/home/HomeScreen.jsx'
import ExploreScreen from './features/explore/ExploreScreen.jsx'
import RoomsScreen from './features/rooms/RoomsScreen.jsx'
import RoomServiceScreen from './features/roomservice/RoomServiceScreen.jsx'
import ReelsScreen from './features/reels/ReelsScreen.jsx'
import ProfileScreen from './features/profile/ProfileScreen.jsx'
import BookingsScreen from './features/bookings/BookingsScreen.jsx'
import BookingHubScreen from './features/booking/BookingHubScreen.jsx'

export default function App() {
  return (
    <ToastProvider>
      <div className="app-shell">
        <Routes>
          {/* Auth is outside the tabbed layout */}
          <Route path="/auth" element={<AuthScreen />} />

          {/* Everything else requires a signed-in guest */}
          <Route
            element={
              <RequireAuth>
                <AppLayout />
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
