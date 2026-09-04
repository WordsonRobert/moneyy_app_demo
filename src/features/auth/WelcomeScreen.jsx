import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext.jsx'
import Button from '../../components/Button.jsx'
import Icon from '../../components/Icon.jsx'
import './welcome.css'

/**
 * One-time onboarding shown right after a guest first verifies their phone —
 * we just ask what to call them. Reached via the onboarding gate (see App.jsx)
 * whenever a signed-in guest has no name saved yet.
 */
export default function WelcomeScreen() {
  const { user, saveName } = useAuth()
  const navigate = useNavigate()
  const [name, setName] = useState('')
  const [saving, setSaving] = useState(false)

  async function submit() {
    const trimmed = name.trim()
    if (trimmed.length < 2) return
    setSaving(true)
    try {
      await saveName(trimmed)
      navigate('/', { replace: true })
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="welcome">
      <div className="welcome__card fade-up">
        <div className="welcome__logo">
          <Icon name="sparkle" size={20} color="#241a0d" />
        </div>
        <p className="eyebrow">Welcome to The Ember House</p>
        <h1>What should we call you?</h1>
        <p className="muted welcome__sub">
          We’ll use it to greet you and put your name on your bookings.
        </p>

        <label className="welcome__label">Your name</label>
        <input
          className="welcome__input"
          type="text"
          autoFocus
          placeholder="e.g. Iyan"
          value={name}
          maxLength={40}
          onChange={(e) => setName(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && submit()}
        />

        <Button
          full
          size="lg"
          onClick={submit}
          disabled={saving || name.trim().length < 2}
          iconRight="chevronRight"
          style={{ marginTop: 22 }}
        >
          {saving ? 'Just a sec…' : 'Continue'}
        </Button>

        <p className="welcome__phone">
          <Icon name="phone" size={13} color="var(--text-faint)" /> {user?.phone}
        </p>
      </div>
    </div>
  )
}
