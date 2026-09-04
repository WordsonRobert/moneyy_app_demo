import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { requestOtp, verifyOtp } from '../services/authService.js'

const AuthContext = createContext(null)
const STORAGE_KEY = 'lm.user'

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      return raw ? JSON.parse(raw) : null
    } catch {
      return null
    }
  })

  useEffect(() => {
    try {
      if (user) localStorage.setItem(STORAGE_KEY, JSON.stringify(user))
      else localStorage.removeItem(STORAGE_KEY)
    } catch {
      /* storage may be unavailable — ignore */
    }
  }, [user])

  const value = useMemo(
    () => ({
      user,
      isAuthed: !!user,
      /** Step 1: send an OTP to a phone number. Returns a demo code for the prototype. */
      sendOtp: (phone) => requestOtp(phone),
      /** Step 2: verify the code. On success, creates/loads the profile. */
      confirmOtp: (phone, code, expected) => {
        const ok = verifyOtp(code, expected)
        if (!ok) return false
        setUser((prev) =>
          prev && prev.phone === phone
            ? prev
            : {
                id: 'u_' + phone.replace(/\D/g, '').slice(-6),
                phone,
                name: 'Guest',
                initial: 'G',
                joined: new Date().toISOString(),
                membership: 'Ember Club',
              },
        )
        return true
      },
      updateProfile: (patch) =>
        setUser((prev) => ({
          ...prev,
          ...patch,
          initial: (patch.name || prev?.name || 'G').trim().charAt(0).toUpperCase(),
        })),
      logout: () => setUser(null),
    }),
    [user],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
