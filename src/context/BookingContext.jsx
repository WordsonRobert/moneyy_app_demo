import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { useAuth } from './AuthContext.jsx'
import {
  watchBookings,
  addBooking as addBookingSvc,
  cancelBooking as cancelBookingSvc,
  watchFavorites,
  setFavorite,
} from '../services/guestService.js'

const BookingContext = createContext(null)

/**
 * Bookings and saved rooms for the signed-in guest, backed by guestService
 * (Firestore in real mode, per-uid localStorage in demo) so they follow the
 * guest across devices. The room-service cart is intentionally in-memory only
 * — it's a transient tray, not something to sync.
 */
export function BookingProvider({ children }) {
  const { user } = useAuth()
  const uid = user?.id || null

  const [bookings, setBookings] = useState([])
  const [favorites, setFavorites] = useState([])
  const [cart, setCart] = useState({}) // { [dishId]: qty }

  // Live subscriptions, re-bound whenever the guest changes (and cleared on logout).
  useEffect(() => {
    if (!uid) {
      setBookings([])
      setFavorites([])
      return
    }
    const unsubBookings = watchBookings(uid, setBookings)
    const unsubFavorites = watchFavorites(uid, setFavorites)
    return () => {
      unsubBookings()
      unsubFavorites()
    }
  }, [uid])

  const value = useMemo(
    () => ({
      bookings,
      addBooking: (b) => addBookingSvc(uid, b),
      cancelBooking: (id) => cancelBookingSvc(uid, id),

      favorites,
      isFavorite: (id) => favorites.includes(id),
      toggleFavorite: (id) => setFavorite(uid, id, !favorites.includes(id)),

      // Room-service cart (in-memory)
      cart,
      cartCount: Object.values(cart).reduce((a, b) => a + b, 0),
      addToCart: (id) => setCart((c) => ({ ...c, [id]: (c[id] || 0) + 1 })),
      removeFromCart: (id) =>
        setCart((c) => {
          const next = { ...c, [id]: (c[id] || 0) - 1 }
          if (next[id] <= 0) delete next[id]
          return next
        }),
      clearCart: () => setCart({}),
    }),
    [bookings, favorites, cart, uid],
  )

  return <BookingContext.Provider value={value}>{children}</BookingContext.Provider>
}

export const useBooking = () => {
  const ctx = useContext(BookingContext)
  if (!ctx) throw new Error('useBooking must be used within BookingProvider')
  return ctx
}
