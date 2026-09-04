/**
 * Per-guest data: profile, saved rooms (favorites) and bookings.
 *
 * Real mode (Firebase): everything lives under the signed-in guest's own
 * document tree, so their name, saved rooms and booking history follow them to
 * any device they sign in on with the same phone number.
 *
 *   users/{uid}                     -> { name, email, membership, joined, favorites: [] }
 *   users/{uid}/bookings/{autoId}   -> { type, title, subtitle, image, total, status, createdAt, ... }
 *
 * Demo mode (no Firebase): the same shape is kept in localStorage, keyed per
 * uid (so two guests on one browser never see each other's data), and changes
 * are broadcast to every mounted screen through a tiny in-tab event bus.
 *
 * Every function returns the same shape regardless of mode, so the UI never has
 * to know which backend is active.
 */
import {
  doc,
  collection,
  onSnapshot,
  getDoc,
  setDoc,
  updateDoc,
  addDoc,
  arrayUnion,
  arrayRemove,
  orderBy,
  query,
  serverTimestamp,
} from 'firebase/firestore'
import { firebaseEnabled, db } from './firebase.js'

/* ------------------------------------------------------------------ *
 * Demo-mode store (localStorage + a tiny in-tab event bus)
 * ------------------------------------------------------------------ */
const bus = new EventTarget()
const guestKey = (uid) => `lm.guest.${uid}`
const bookingsKey = (uid) => `lm.bookings.${uid}`

function read(key, fallback) {
  try {
    const raw = localStorage.getItem(key)
    return raw ? JSON.parse(raw) : fallback
  } catch {
    return fallback
  }
}

function write(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch {
    /* ignore */
  }
  bus.dispatchEvent(new Event('change'))
}

const onBus = (cb) => {
  bus.addEventListener('change', cb)
  return () => bus.removeEventListener('change', cb)
}

/* ------------------------------------------------------------------ *
 * Profile  (name / email / membership / joined)
 * ------------------------------------------------------------------ */

const PROFILE_FIELDS = ['name', 'email', 'membership', 'joined']

function pickProfile(data = {}) {
  const out = {}
  for (const f of PROFILE_FIELDS) if (data[f] != null) out[f] = data[f]
  return out
}

/** One-shot profile read — used to decide whether a guest still needs onboarding. */
export async function getProfileOnce(uid) {
  if (!uid) return {}
  if (firebaseEnabled) {
    const snap = await getDoc(doc(db, 'users', uid))
    return snap.exists() ? pickProfile(snap.data()) : {}
  }
  return pickProfile(read(guestKey(uid), {}))
}

/** Subscribe to a guest's profile fields. */
export function watchProfile(uid, cb) {
  if (!uid) {
    cb({})
    return () => {}
  }
  if (firebaseEnabled) {
    return onSnapshot(doc(db, 'users', uid), (snap) =>
      cb(snap.exists() ? pickProfile(snap.data()) : {}),
    )
  }
  const emit = () => cb(pickProfile(read(guestKey(uid), {})))
  emit()
  return onBus(emit)
}

/** Merge-write profile fields (never clobbers favorites or unrelated fields). */
export async function saveProfile(uid, patch) {
  if (!uid) return
  const clean = pickProfile(patch)
  if (firebaseEnabled) {
    await setDoc(doc(db, 'users', uid), clean, { merge: true })
    return
  }
  const cur = read(guestKey(uid), {})
  write(guestKey(uid), { ...cur, ...clean })
}

/* ------------------------------------------------------------------ *
 * Favorites  (saved room-type ids)
 * ------------------------------------------------------------------ */

/** Subscribe to the guest's saved-room ids. */
export function watchFavorites(uid, cb) {
  if (!uid) {
    cb([])
    return () => {}
  }
  if (firebaseEnabled) {
    return onSnapshot(doc(db, 'users', uid), (snap) =>
      cb(snap.exists() && Array.isArray(snap.data().favorites) ? snap.data().favorites : []),
    )
  }
  const emit = () => cb(read(guestKey(uid), {}).favorites || [])
  emit()
  return onBus(emit)
}

/** Add or remove a saved room. `next` is the desired state (true = saved). */
export async function setFavorite(uid, id, next) {
  if (!uid) return
  if (firebaseEnabled) {
    await setDoc(
      doc(db, 'users', uid),
      { favorites: next ? arrayUnion(id) : arrayRemove(id) },
      { merge: true },
    )
    return
  }
  const cur = read(guestKey(uid), {})
  const favorites = cur.favorites || []
  cur.favorites = next ? [...new Set([...favorites, id])] : favorites.filter((x) => x !== id)
  write(guestKey(uid), cur)
}

/* ------------------------------------------------------------------ *
 * Bookings
 * ------------------------------------------------------------------ */

/** Subscribe to a guest's bookings, newest first. */
export function watchBookings(uid, cb) {
  if (!uid) {
    cb([])
    return () => {}
  }
  if (firebaseEnabled) {
    const q = query(collection(db, 'users', uid, 'bookings'), orderBy('createdAt', 'desc'))
    return onSnapshot(q, (snap) => {
      cb(
        snap.docs.map((d) => {
          const b = d.data()
          return { ...b, id: d.id, createdAt: b.createdAt?.toMillis?.() ?? Date.now() }
        }),
      )
    })
  }
  const emit = () => cb(read(bookingsKey(uid), []))
  emit()
  return onBus(emit)
}

/** Create a booking. Returns the stored record (with its id). */
export async function addBooking(uid, booking) {
  const base = { status: 'Confirmed', ...booking }
  if (firebaseEnabled) {
    const ref = await addDoc(collection(db, 'users', uid, 'bookings'), {
      ...base,
      createdAt: serverTimestamp(),
    })
    return { ...base, id: ref.id, createdAt: Date.now() }
  }
  const record = { ...base, id: 'bk_' + Date.now().toString(36), createdAt: Date.now() }
  const list = read(bookingsKey(uid), [])
  write(bookingsKey(uid), [record, ...list])
  return record
}

/** Mark a booking cancelled. */
export async function cancelBooking(uid, id) {
  if (firebaseEnabled) {
    await updateDoc(doc(db, 'users', uid, 'bookings', id), { status: 'Cancelled' })
    return
  }
  const list = read(bookingsKey(uid), [])
  write(
    bookingsKey(uid),
    list.map((b) => (b.id === id ? { ...b, status: 'Cancelled' } : b)),
  )
}
