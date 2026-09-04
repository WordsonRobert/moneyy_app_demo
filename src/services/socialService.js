/**
 * Social layer for reels: likes and comments that actually add up.
 *
 * Real mode (Firebase): likes and comments live in Firestore and stream to every
 * viewer in real time. One like per signed-in guest (keyed by uid), so counts
 * are honest and toggling is idempotent.
 *
 *   reels/{reelId}/likes/{uid}        -> { at }
 *   reels/{reelId}/comments/{autoId}  -> { uid, name, text, createdAt }
 *
 * Demo mode (no Firebase): the same shape is kept in localStorage and updates
 * are broadcast to every mounted reel in this browser, so the UI still feels
 * live (just not shared across devices).
 *
 * Every function returns the same shape regardless of mode, so the UI never has
 * to care which backend is active.
 */
import {
  collection,
  doc,
  onSnapshot,
  setDoc,
  deleteDoc,
  addDoc,
  orderBy,
  query,
  serverTimestamp,
} from 'firebase/firestore'
import { firebaseEnabled, db } from './firebase.js'

/* ------------------------------------------------------------------ *
 * Demo-mode store (localStorage + a tiny in-tab event bus)
 * ------------------------------------------------------------------ */
const LS_KEY = 'lm.social'
const bus = new EventTarget()

function readStore() {
  try {
    const raw = localStorage.getItem(LS_KEY)
    return raw ? JSON.parse(raw) : { likes: {}, comments: {} }
  } catch {
    return { likes: {}, comments: {} }
  }
}

function writeStore(store) {
  try {
    localStorage.setItem(LS_KEY, JSON.stringify(store))
  } catch {
    /* ignore */
  }
  bus.dispatchEvent(new Event('change'))
}

/* ------------------------------------------------------------------ *
 * Likes
 * ------------------------------------------------------------------ */

/** Subscribe to a reel's like count + whether `uid` has liked it. */
export function watchLikes(reelId, uid, cb) {
  if (firebaseEnabled) {
    return onSnapshot(collection(db, 'reels', reelId, 'likes'), (snap) => {
      cb({ count: snap.size, liked: uid ? snap.docs.some((d) => d.id === uid) : false })
    })
  }

  const emit = () => {
    const likes = readStore().likes[reelId] || {}
    cb({ count: Object.keys(likes).length, liked: uid ? !!likes[uid] : false })
  }
  emit()
  bus.addEventListener('change', emit)
  return () => bus.removeEventListener('change', emit)
}

/** Toggle the current guest's like. `nextLiked` is the desired state. */
export async function setLike(reelId, uid, nextLiked) {
  if (!uid) return
  if (firebaseEnabled) {
    const ref = doc(db, 'reels', reelId, 'likes', uid)
    if (nextLiked) await setDoc(ref, { at: serverTimestamp() })
    else await deleteDoc(ref)
    return
  }
  const store = readStore()
  store.likes[reelId] = store.likes[reelId] || {}
  if (nextLiked) store.likes[reelId][uid] = true
  else delete store.likes[reelId][uid]
  writeStore(store)
}

/* ------------------------------------------------------------------ *
 * Comments
 * ------------------------------------------------------------------ */

/** Subscribe to a reel's comments, oldest first. */
export function watchComments(reelId, cb) {
  if (firebaseEnabled) {
    const q = query(collection(db, 'reels', reelId, 'comments'), orderBy('createdAt', 'asc'))
    return onSnapshot(q, (snap) => {
      cb(
        snap.docs.map((d) => {
          const c = d.data()
          return {
            id: d.id,
            uid: c.uid,
            name: c.name || 'Guest',
            text: c.text || '',
            createdAt: c.createdAt?.toMillis?.() ?? Date.now(),
          }
        }),
      )
    })
  }

  const emit = () => cb((readStore().comments[reelId] || []).slice())
  emit()
  bus.addEventListener('change', emit)
  return () => bus.removeEventListener('change', emit)
}

/** Post a comment. Returns nothing; the watcher will deliver it. */
export async function addComment(reelId, { uid, name, text }) {
  const clean = String(text || '').trim().slice(0, 500)
  if (!clean) return
  if (firebaseEnabled) {
    await addDoc(collection(db, 'reels', reelId, 'comments'), {
      uid: uid || null,
      name: name || 'Guest',
      text: clean,
      createdAt: serverTimestamp(),
    })
    return
  }
  const store = readStore()
  store.comments[reelId] = store.comments[reelId] || []
  store.comments[reelId].push({
    id: 'c_' + Date.now().toString(36),
    uid,
    name: name || 'Guest',
    text: clean,
    createdAt: Date.now(),
  })
  writeStore(store)
}
