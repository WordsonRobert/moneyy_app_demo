/**
 * Auth service — real phone OTP via Firebase, with a zero-setup demo fallback.
 *
 * Real mode (Firebase config present):
 *   1. setupRecaptcha() mounts an invisible reCAPTCHA (required by Firebase to
 *      stop abuse of the free SMS quota).
 *   2. requestOtp(e164) sends a real SMS and returns a `confirmation` handle.
 *   3. confirmOtp(confirmation, code) verifies the 6-digit code and signs the
 *      guest in. `auth.onAuthStateChanged` (see AuthContext) then has the user.
 *
 * Demo mode (no Firebase config):
 *   requestOtp() returns a 4-digit code shown on screen; confirmOtp() accepts it
 *   (or the universal 1234). Nothing is sent, nothing is stored server-side.
 *
 * Docs: https://firebase.google.com/docs/auth/web/phone-auth
 */
import {
  RecaptchaVerifier,
  signInWithPhoneNumber,
} from 'firebase/auth'
import { firebaseEnabled, auth } from './firebase.js'

export { firebaseEnabled }

let recaptcha = null

/**
 * Turn a country code + typed number into strict E.164 (e.g. "+919876543210").
 * Firebase rejects anything else.
 */
export function toE164(countryCode, number) {
  const cc = String(countryCode).replace(/[^\d+]/g, '')
  const digits = String(number).replace(/\D/g, '')
  return `${cc.startsWith('+') ? cc : '+' + cc}${digits}`
}

/** Create (once) an invisible reCAPTCHA bound to a DOM node. Real mode only. */
export async function setupRecaptcha(containerId = 'recaptcha-container') {
  if (!firebaseEnabled) return null
  if (recaptcha) return recaptcha
  recaptcha = new RecaptchaVerifier(auth, containerId, { size: 'invisible' })
  await recaptcha.render()
  return recaptcha
}

/** Tear down the reCAPTCHA (e.g. after a failed send, so a retry gets a fresh one). */
export function resetRecaptcha() {
  try {
    recaptcha?.clear()
  } catch {
    /* ignore */
  }
  recaptcha = null
}

/**
 * Send an OTP.
 * @returns real mode: { mode:'firebase', confirmation }
 *          demo mode: { mode:'demo', code }
 */
export async function requestOtp(e164) {
  if (!firebaseEnabled) {
    const code = String(Math.floor(1000 + Math.random() * 9000))
    await new Promise((r) => setTimeout(r, 500))
    return { mode: 'demo', code }
  }
  const verifier = await setupRecaptcha()
  try {
    const confirmation = await signInWithPhoneNumber(auth, e164, verifier)
    return { mode: 'firebase', confirmation }
  } catch (err) {
    // A failed attempt burns the reCAPTCHA token; reset so the next try works.
    resetRecaptcha()
    throw err
  }
}

/**
 * Verify a code.
 * @returns { ok, user? }  — in real mode `user` is the Firebase user.
 */
export async function confirmOtp({ mode, confirmation, expected }, code) {
  if (mode === 'firebase') {
    const result = await confirmation.confirm(code) // throws on wrong code
    return { ok: true, user: result.user }
  }
  const ok = code === expected || code === '1234'
  return { ok }
}
