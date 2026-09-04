import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { onAuthStateChanged, signOut } from 'firebase/auth'
import { firebaseEnabled, auth } from '../services/firebase.js'
import { watchProfile, saveProfile } from '../services/guestService.js'

const AuthContext = createContext(null)
const DEMO_KEY = 'lm.user' // demo-mode identity (no Firebase)

// Demo mode: restore identity synchronously so a hard refresh on a protected
// route doesn't flash the auth screen before the guest is loaded.
function initialDemoIdentity() {
  if (firebaseEnabled) return null
  try {
    const raw = localStorage.getItem(DEMO_KEY)
    return raw ? JSON.parse(raw) : null // { uid, phone }
  } catch {
    return null
  }
}

/** Build the app's user object from an identity + its (async-loaded) profile. */
function composeUser(identity, profile) {
  if (!identity) return null
  const name = profile.name || 'Guest'
  return {
    id: identity.uid,
    phone: identity.phone,
    name,
    email: profile.email || '',
    initial: (name.trim().charAt(0) || 'G').toUpperCase(),
    membership: profile.membership || 'Ember Club',
    joined: profile.joined || null,
  }
}

export function AuthProvider({ children }) {
  const [identity, setIdentity] = useState(initialDemoIdentity) // { uid, phone } | null
  const [profile, setProfile] = useState({})
  const [profileLoaded, setProfileLoaded] = useState(false)
  // Whether the auth backend has reported its initial state yet.
  const [authResolved, setAuthResolved] = useState(!firebaseEnabled)

  // Real mode: track the Firebase identity.
  useEffect(() => {
    if (!firebaseEnabled) return
    const unsub = onAuthStateChanged(auth, (fbUser) => {
      setIdentity(fbUser ? { uid: fbUser.uid, phone: fbUser.phoneNumber || '' } : null)
      setAuthResolved(true)
    })
    return () => unsub()
  }, [])

  // Live profile for the current guest (follows them across devices in real mode).
  useEffect(() => {
    setProfileLoaded(false)
    if (!identity?.uid) {
      setProfile({})
      setProfileLoaded(true)
      return
    }
    const unsub = watchProfile(identity.uid, (p) => {
      setProfile(p)
      setProfileLoaded(true)
    })
    return () => unsub()
  }, [identity?.uid])

  const user = useMemo(() => composeUser(identity, profile), [identity, profile])
  // "Ready" only once we know both the identity and (if signed in) the profile,
  // so guards never flash the wrong screen.
  const authReady = authResolved && profileLoaded

  const value = useMemo(
    () => ({
      user,
      isAuthed: !!user,
      authReady,
      firebaseEnabled,
      // Signed in, profile resolved, but the guest hasn't told us their name yet.
      needsName: !!user && authReady && !profile.name,

      /** Finish a DEMO-mode sign-in (no Firebase). Real mode uses Firebase auth state. */
      finalizeDemoUser(phone) {
        const uid = 'u_' + phone.replace(/\D/g, '').slice(-10)
        try {
          localStorage.setItem(DEMO_KEY, JSON.stringify({ uid, phone }))
        } catch {
          /* ignore */
        }
        setIdentity({ uid, phone })
      },

      /** Save the guest's name (onboarding), seeding membership + join date. */
      async saveName(name) {
        if (!identity?.uid) return
        await saveProfile(identity.uid, {
          name: name.trim() || 'Guest',
          membership: profile.membership || 'Ember Club',
          joined: profile.joined || new Date().toISOString(),
        })
      },

      /** Update editable profile fields. */
      async updateProfile(patch) {
        if (!identity?.uid) return
        const clean = {}
        if (patch.name != null) clean.name = patch.name.trim() || 'Guest'
        if (patch.email != null) clean.email = patch.email
        if (Object.keys(clean).length) await saveProfile(identity.uid, clean)
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
          setIdentity(null)
        }
      },
    }),
    [user, authReady, identity, profile],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
