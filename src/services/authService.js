/**
 * Prototype auth service.
 *
 * In production this would call your backend, which would send a real SMS via a
 * provider (Twilio, MSG91, etc.) and verify server-side. For the prototype we
 * generate a demo OTP client-side and "deliver" it on screen so the flow is
 * fully clickable without any SMS cost or backend.
 */

export function requestOtp(phone) {
  // Deterministic-ish 4 digit code for the demo.
  const code = String(Math.floor(1000 + Math.random() * 9000))
  return new Promise((resolve) => {
    setTimeout(() => resolve({ phone, code, sentAt: Date.now() }), 650)
  })
}

export function verifyOtp(entered, expected) {
  // Accept the generated code, or the universal demo code 1234.
  return entered === expected || entered === '1234'
}
