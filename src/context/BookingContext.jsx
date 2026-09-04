import { createContext, useContext, useEffect, useMemo, useState } from 'react'

const BookingContext = createContext(null)
const BOOK_KEY = 'lm.bookings'
const FAV_KEY = 'lm.favorites'

const load = (key, fallback) => {
  try {
    const raw = localStorage.getItem(key)
    return raw ? JSON.parse(raw) : fallback
  } catch {
    return fallback
  }
}

export function BookingProvider({ children }) {
  const [bookings, setBookings] = useState(() => load(BOOK_KEY, []))
  const [favorites, setFavorites] = useState(() => load(FAV_KEY, []))
  // Room-service cart: { [dishId]: qty }
  const [cart, setCart] = useState({})

  useEffect(() => {
    try {
      localStorage.setItem(BOOK_KEY, JSON.stringify(bookings))
    } catch { /* ignore */ }
  }, [bookings])

  useEffect(() => {
    try {
      localStorage.setItem(FAV_KEY, JSON.stringify(favorites))
    } catch { /* ignore */ }
  }, [favorites])

  const value = useMemo(
    () => ({
      bookings,
      addBooking: (b) => {
        const record = { id: 'bk_' + Date.now().toString(36), createdAt: Date.now(), status: 'Confirmed', ...b }
        setBookings((prev) => [record, ...prev])
        return record
      },
      cancelBooking: (id) =>
        setBookings((prev) => prev.map((b) => (b.id === id ? { ...b, status: 'Cancelled' } : b))),

      favorites,
      isFavorite: (id) => favorites.includes(id),
      toggleFavorite: (id) =>
        setFavorites((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id])),

      // Room-service cart
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
    [bookings, favorites, cart],
  )

  return <BookingContext.Provider value={value}>{children}</BookingContext.Provider>
}

export const useBooking = () => {
  const ctx = useContext(BookingContext)
  if (!ctx) throw new Error('useBooking must be used within BookingProvider')
  return ctx
}
