import { useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext.jsx'
import Button from '../../components/Button.jsx'
import Icon from '../../components/Icon.jsx'
import { property } from '../../data/property.js'
import './auth.css'

const COUNTRIES = [
  { code: '+1', flag: '🇺🇸' },
  { code: '+44', flag: '🇬🇧' },
  { code: '+91', flag: '🇮🇳' },
  { code: '+61', flag: '🇦🇺' },
  { code: '+971', flag: '🇦🇪' },
]

export default function AuthScreen() {
  const { sendOtp, confirmOtp } = useAuth()
  const navigate = useNavigate()

  const [step, setStep] = useState('phone') // phone | otp
  const [country, setCountry] = useState(COUNTRIES[0])
  const [phone, setPhone] = useState('')
  const [sending, setSending] = useState(false)
  const [expected, setExpected] = useState('')
  const [otp, setOtp] = useState(['', '', '', ''])
  const [error, setError] = useState('')
  const otpRefs = [useRef(), useRef(), useRef(), useRef()]

  const fullPhone = `${country.code} ${phone}`

  async function handleSend() {
    if (phone.replace(/\D/g, '').length < 6) {
      setError('Enter a valid phone number')
      return
    }
    setError('')
    setSending(true)
    const { code } = await sendOtp(fullPhone)
    setExpected(code)
    setSending(false)
    setStep('otp')
    setTimeout(() => otpRefs[0].current?.focus(), 150)
  }

  function handleOtpChange(i, val) {
    const digit = val.replace(/\D/g, '').slice(-1)
    const next = [...otp]
    next[i] = digit
    setOtp(next)
    setError('')
    if (digit && i < 3) otpRefs[i + 1].current?.focus()
  }

  function handleOtpKey(i, e) {
    if (e.key === 'Backspace' && !otp[i] && i > 0) otpRefs[i - 1].current?.focus()
  }

  function handleVerify() {
    const code = otp.join('')
    if (code.length < 4) {
      setError('Enter the 4-digit code')
      return
    }
    const ok = confirmOtp(fullPhone, code, expected)
    if (ok) navigate('/', { replace: true })
    else setError('That code didn’t match. Try again.')
  }

  return (
    <div className="auth">
      <div className="auth__hero">
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
                placeholder="555 018 2245"
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
              By continuing you agree to the House rules & privacy terms. This is a prototype — no real SMS is sent.
            </p>
          </div>
        ) : (
          <div className="fade-up">
            <button className="auth__back" onClick={() => setStep('phone')}>
              <Icon name="arrowLeft" size={18} /> Back
            </button>
            <h2>Enter the code</h2>
            <p className="muted auth__sub">
              Sent to <strong style={{ color: 'var(--text)' }}>{fullPhone}</strong>
            </p>

            <div className="auth__otp">
              {otp.map((d, i) => (
                <input
                  key={i}
                  ref={otpRefs[i]}
                  className="auth__otp-box"
                  type="tel"
                  inputMode="numeric"
                  maxLength={1}
                  value={d}
                  onChange={(e) => handleOtpChange(i, e.target.value)}
                  onKeyDown={(e) => handleOtpKey(i, e)}
                />
              ))}
            </div>
            {error && <p className="auth__error">{error}</p>}

            <div className="auth__demo">
              <Icon name="sparkle" size={15} color="var(--gold)" />
              <span>
                Demo code: <strong>{expected}</strong> (or <strong>1234</strong>)
              </span>
            </div>

            <Button full size="lg" onClick={handleVerify} icon="check" style={{ marginTop: 18 }}>
              Verify & continue
            </Button>
            <button className="auth__resend" onClick={handleSend}>
              Didn’t get it? Resend code
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
