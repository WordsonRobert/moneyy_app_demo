import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { onAuthStateChanged, signOut } from 'firebase/auth'
import { firebaseEnabled, auth } from '../services/firebase.js'

const AuthContext = createContext(null)

// Editable profile fields live per-user in localStorage, keyed by uid, in both
// modes. Identity (uid/phone) comes from Firebase in real mode.
const profileKey = (uid) => `lm.profile.${uid}`
const DEMO_KEY = 'lm.user' // demo-mode identity (no Firebase)

function loadProfile(uid) {
  try {
    const raw = localStorage.getItem(profileKey(uid))
    return raw ? JSON.parse(raw) : {}
  } catch {
    return {}
  }
}

function saveProfile(uid, profile) {
  try {
    localStorage.setItem(profileKey(uid), JSON.stringify(profile))
  } catch {
    /* ignore */
  }
}

/** Assemble the app's user object from an identity + its stored profile. */
function composeUser({ uid, phone }) {
  const profile = loadProfile(uid)
  const name = profile.name || 'Guest'
  return {
    id: uid,
    phone,
    name,
    email: profile.email || '',
    initial: name.trim().charAt(0).toUpperCase() || 'G',
    membership: profile.membership || 'Ember Club',
    joined: profile.joined || new Date().toISOString(),
  }
}

// Demo mode: restore identity synchronously so a hard refresh on a protected
// route doesn't flash the auth screen before the user is loaded.
function initialDemoUser() {
  if (firebaseEnabled) return null
  try {
    const raw = localStorage.getItem(DEMO_KEY)
    if (!raw) return null
    const { uid, phone } = JSON.parse(raw)
    return composeUser({ uid, phone })
  } catch {
    return null
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(initialDemoUser)
  // In real mode we wait for Firebase to report the initial auth state before
  // deciding whether to bounce to /auth; in demo mode we're ready immediately.
  const [authReady, setAuthReady] = useState(!firebaseEnabled)

  // Real mode: track Firebase auth state.
  useEffect(() => {
    if (!firebaseEnabled) return
    const unsub = onAuthStateChanged(auth, (fbUser) => {
      if (fbUser) {
        const uid = fbUser.uid
        const profile = loadProfile(uid)
        if (!profile.joined) saveProfile(uid, { ...profile, joined: new Date().toISOString() })
        setUser(composeUser({ uid, phone: fbUser.phoneNumber || '' }))
      } else {
        setUser(null)
      }
      setAuthReady(true)
    })
    return () => unsub()
  }, [])

  const value = useMemo(
    () => ({
      user,
      isAuthed: !!user,
      authReady,
      firebaseEnabled,

      /**
       * Finish a DEMO-mode sign-in (no Firebase). Real mode signs in through
       * Firebase and picks the user up via onAuthStateChanged instead.
       */
      finalizeDemoUser(phone) {
        const uid = 'u_' + phone.replace(/\D/g, '').slice(-10)
        try {
          localStorage.setItem(DEMO_KEY, JSON.stringify({ uid, phone }))
        } catch {
          /* ignore */
        }
        const profile = loadProfile(uid)
        if (!profile.joined) saveProfile(uid, { ...profile, joined: new Date().toISOString() })
        setUser(composeUser({ uid, phone }))
      },

      updateProfile(patch) {
        setUser((prev) => {
          if (!prev) return prev
          const merged = {
            name: patch.name ?? prev.name,
            email: patch.email ?? prev.email,
            membership: patch.membership ?? prev.membership,
            joined: prev.joined,
          }
          saveProfile(prev.id, merged)
          return {
            ...prev,
            ...merged,
            initial: (merged.name || 'G').trim().charAt(0).toUpperCase() || 'G',
          }
        })
      },

      async logout() {
        if (firebaseEnabled) {
          await signOut(auth)
        } else {
          try {
            localStorage.removeItem(DEMO_KEY)
          } catch {
            /* ignore */
          }
          setUser(null)
        }
      },
    }),
    [user, authReady],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
