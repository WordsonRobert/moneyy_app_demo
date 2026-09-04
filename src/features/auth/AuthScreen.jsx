import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext.jsx'
import { requestOtp, confirmOtp, resetRecaptcha, toE164, firebaseEnabled } from '../../services/authService.js'
import Button from '../../components/Button.jsx'
import Icon from '../../components/Icon.jsx'
import { property } from '../../data/property.js'
import { img } from '../../utils/img.js'
import './auth.css'

const COUNTRIES = [
  { code: '+91', flag: '🇮🇳' },
  { code: '+1', flag: '🇺🇸' },
  { code: '+44', flag: '🇬🇧' },
  { code: '+61', flag: '🇦🇺' },
  { code: '+971', flag: '🇦🇪' },
]

// Real Firebase codes are 6 digits; the demo code is 4.
const OTP_LEN = firebaseEnabled ? 6 : 4

export default function AuthScreen() {
  const { finalizeDemoUser } = useAuth()
  const navigate = useNavigate()

  const [step, setStep] = useState('phone') // phone | otp
  const [country, setCountry] = useState(COUNTRIES[0])
  const [phone, setPhone] = useState('')
  const [sending, setSending] = useState(false)
  const [verifying, setVerifying] = useState(false)
  const [pending, setPending] = useState(null) // { mode, confirmation?, code? }
  const [otp, setOtp] = useState(() => Array(OTP_LEN).fill(''))
  const [error, setError] = useState('')
  const otpRefs = useRef([])

  const e164 = toE164(country.code, phone)

  // Reset any reCAPTCHA if the screen unmounts mid-flow.
  useEffect(() => () => resetRecaptcha(), [])

  async function handleSend() {
    if (phone.replace(/\D/g, '').length < 6) {
      setError('Enter a valid phone number')
      return
    }
    setError('')
    setSending(true)
    try {
      const result = await requestOtp(e164)
      setPending(result)
      setOtp(Array(OTP_LEN).fill(''))
      setStep('otp')
      setTimeout(() => otpRefs.current[0]?.focus(), 150)
    } catch (err) {
      setError(errorMessage(err))
    } finally {
      setSending(false)
    }
  }

  function handleOtpChange(i, val) {
    const digits = val.replace(/\D/g, '')
    setError('')
    if (digits.length > 1) {
      // Handle paste of a full code.
      const next = Array(OTP_LEN).fill('')
      digits.slice(0, OTP_LEN).split('').forEach((d, k) => (next[k] = d))
      setOtp(next)
      otpRefs.current[Math.min(digits.length, OTP_LEN - 1)]?.focus()
      return
    }
    const next = [...otp]
    next[i] = digits.slice(-1)
    setOtp(next)
    if (digits && i < OTP_LEN - 1) otpRefs.current[i + 1]?.focus()
  }

  function handleOtpKey(i, e) {
    if (e.key === 'Backspace' && !otp[i] && i > 0) otpRefs.current[i - 1]?.focus()
  }

  async function handleVerify() {
    const code = otp.join('')
    if (code.length < OTP_LEN) {
      setError(`Enter the ${OTP_LEN}-digit code`)
      return
    }
    setError('')
    setVerifying(true)
    try {
      const { ok } = await confirmOtp({ ...pending, expected: pending?.code }, code)
      if (ok) {
        // Real mode: onAuthStateChanged signs the user in. Demo mode: finalize now.
        if (pending?.mode === 'demo') finalizeDemoUser(e164)
        navigate('/', { replace: true })
      } else {
        setError('That code didn’t match. Try again.')
      }
    } catch (err) {
      setError(errorMessage(err))
    } finally {
      setVerifying(false)
    }
  }

  return (
    <div className="auth">
      <div className="auth__hero" style={{ backgroundImage: `url(${img('photo-1470337458703-46ad1756a187.jpg')})` }}>
        <div className="auth__hero-overlay" />
        <div className="auth__brand">
          <div className="auth__logo">
            <Icon name="sparkle" size={18} color="#241a0d" />
          </div>
          <span className="eyebrow">{property.brand}</span>
          <h1>
            Every night,
            <br />a moment.
          </h1>
          <p className="muted">{property.kind} · {property.name}</p>
        </div>
      </div>

      <div className="auth__card">
        {step === 'phone' ? (
          <div className="fade-up">
            <h2>Sign in</h2>
            <p className="muted auth__sub">We’ll text you a code to confirm it’s you.</p>

            <label className="auth__label">Phone number</label>
            <div className="auth__phone-row">
              <select
                className="auth__country"
                value={country.code}
                onChange={(e) => setCountry(COUNTRIES.find((c) => c.code === e.target.value))}
              >
                {COUNTRIES.map((c) => (
                  <option key={c.code} value={c.code}>
                    {c.flag} {c.code}
                  </option>
                ))}
              </select>
              <input
                className="auth__input"
                type="tel"
                inputMode="numeric"
                placeholder="98765 43210"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              />
            </div>
            {error && <p className="auth__error">{error}</p>}

            <Button full size="lg" onClick={handleSend} disabled={sending} iconRight="chevronRight" style={{ marginTop: 22 }}>
              {sending ? 'Sending…' : 'Send code'}
            </Button>
            <p className="auth__fine">
              By continuing you agree to the House rules & privacy terms.{' '}
              {firebaseEnabled
                ? 'Standard SMS rates may apply.'
                : 'This is a demo build — no real SMS is sent.'}
            </p>
          </div>
        ) : (
          <div className="fade-up">
            <button className="auth__back" onClick={() => setStep('phone')}>
              <Icon name="arrowLeft" size={18} /> Back
            </button>
            <h2>Enter the code</h2>
            <p className="muted auth__sub">
              Sent to <strong style={{ color: 'var(--text)' }}>{e164}</strong>
            </p>

            <div className="auth__otp">
              {otp.map((d, i) => (
                <input
                  key={i}
                  ref={(el) => (otpRefs.current[i] = el)}
                  className="auth__otp-box"
                  type="tel"
                  inputMode="numeric"
                  maxLength={OTP_LEN}
                  value={d}
                  onChange={(e) => handleOtpChange(i, e.target.value)}
                  onKeyDown={(e) => handleOtpKey(i, e)}
                />
              ))}
            </div>
            {error && <p className="auth__error">{error}</p>}

            {pending?.mode === 'demo' && (
              <div className="auth__demo">
                <Icon name="sparkle" size={15} color="var(--gold)" />
                <span>
                  Demo code: <strong>{pending.code}</strong> (or <strong>1234</strong>)
                </span>
              </div>
            )}

            <Button full size="lg" onClick={handleVerify} disabled={verifying} icon="check" style={{ marginTop: 18 }}>
              {verifying ? 'Verifying…' : 'Verify & continue'}
            </Button>
            <button className="auth__resend" onClick={handleSend} disabled={sending}>
              {sending ? 'Sending…' : 'Didn’t get it? Resend code'}
            </button>
          </div>
        )}
      </div>

      {/* Invisible reCAPTCHA mount point for Firebase Phone Auth. */}
      <div id="recaptcha-container" />
    </div>
  )
}

function errorMessage(err) {
  const code = err?.code || ''
  if (code.includes('invalid-verification-code')) return 'That code didn’t match. Try again.'
  if (code.includes('code-expired')) return 'That code expired. Tap resend.'
  if (code.includes('invalid-phone-number')) return 'That phone number looks off. Check it and retry.'
  if (code.includes('too-many-requests')) return 'Too many attempts. Give it a few minutes.'
  if (code.includes('quota-exceeded')) return 'SMS limit reached for now. Try again later.'
  if (code.includes('captcha')) return 'Verification check failed. Reload and try again.'
  return 'Something went wrong sending the code. Try again.'
}
