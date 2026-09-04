/**
 * Firebase bootstrap.
 *
 * The app reads its Firebase config from Vite env vars (VITE_FIREBASE_*). These
 * are NOT secrets — Firebase web config is meant to ship in the client — but we
 * keep them in env so the same code can point at different projects, and so the
 * prototype still runs with zero setup.
 *
 * If the config is missing we run in "demo mode": phone auth uses an on-screen
 * code and likes/comments live in this browser only. Add the env vars (see
 * .env.example) to switch on real OTP + real, shared likes & comments.
 */
import { initializeApp, getApps, getApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'

const config = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
}

// We need at least these three to talk to a real project.
export const firebaseEnabled = Boolean(
  config.apiKey && config.authDomain && config.projectId,
)

let app = null
let authInstance = null
let dbInstance = null

if (firebaseEnabled) {
  app = getApps().length ? getApp() : initializeApp(config)
  authInstance = getAuth(app)
  dbInstance = getFirestore(app)
}

export const firebaseApp = app
export const auth = authInstance
export const db = dbInstance
