import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext.jsx'
import { useBooking } from '../../context/BookingContext.jsx'
import Icon from '../../components/Icon.jsx'
import Sheet from '../../components/Sheet.jsx'
import Button from '../../components/Button.jsx'
import { roomTypeById } from '../../data/rooms.js'
import './profile.css'

const MENU = [
  { id: 'bookings', icon: 'calendar', label: 'My bookings', to: '/bookings' },
  { id: 'favorites', icon: 'heart', label: 'Saved rooms' },
  { id: 'payment', icon: 'bag', label: 'Payment methods' },
  { id: 'help', icon: 'concierge', label: 'Concierge & help' },
  { id: 'about', icon: 'sparkle', label: 'About The Ember House' },
]

export default function ProfileScreen() {
  const { user, updateProfile, logout } = useAuth()
  const { bookings, favorites } = useBooking()
  const navigate = useNavigate()

  const [editOpen, setEditOpen] = useState(false)
  const [favOpen, setFavOpen] = useState(false)
  const [name, setName] = useState(user?.name === 'Guest' ? '' : user?.name || '')
  const [email, setEmail] = useState(user?.email || '')

  const savedRooms = favorites.map((id) => roomTypeById[id]).filter(Boolean)

  function saveProfile() {
    updateProfile({ name: name.trim() || 'Guest', email: email.trim() })
    setEditOpen(false)
  }

  return (
    <div className="pf">
      <header className="pf__head">
        <div className="pf__avatar">{user?.initial || 'G'}</div>
        <h2>{user?.name && user.name !== 'Guest' ? user.name : 'Welcome, guest'}</h2>
        <p className="muted">{user?.phone}</p>
        <span className="pf__member"><Icon name="sparkle" size={13} color="var(--gold)" /> {user?.membership || 'Ember Club'}</span>
        <button className="pf__edit" onClick={() => setEditOpen(true)}>
          <Icon name="edit" size={15} /> Edit profile
        </button>
      </header>

      <div className="pf__stats container">
        <div className="pf__stat" onClick={() => navigate('/bookings')}>
          <strong>{bookings.filter((b) => b.status !== 'Cancelled').length}</strong>
          <span>Bookings</span>
        </div>
        <div className="pf__stat" onClick={() => setFavOpen(true)}>
          <strong>{favorites.length}</strong>
          <span>Saved</span>
        </div>
        <div className="pf__stat">
          <strong>4.8★</strong>
          <span>Guest score</span>
        </div>
      </div>

      <div className="pf__menu container">
        {MENU.map((m) => (
          <button
            key={m.id}
            className="pf__row"
            onClick={() => (m.to ? navigate(m.to) : m.id === 'favorites' ? setFavOpen(true) : null)}
          >
            <span className="pf__row-icon"><Icon name={m.icon} size={19} color="var(--gold)" /></span>
            <span className="pf__row-label">{m.label}</span>
            <Icon name="chevronRight" size={18} color="var(--text-faint)" />
          </button>
        ))}
      </div>

      <button className="pf__logout container" onClick={() => { logout(); navigate('/auth') }}>
        <Icon name="logout" size={18} color="var(--danger)" /> Sign out
      </button>

      <p className="pf__version">Life Moments · The Ember House · prototype v0.1</p>
      <div style={{ height: 20 }} />

      {/* Edit profile */}
      <Sheet open={editOpen} onClose={() => setEditOpen(false)} title="Edit profile">
        <label className="pf__label">Name</label>
        <input className="pf__input" value={name} placeholder="Your name" onChange={(e) => setName(e.target.value)} />
        <label className="pf__label">Email (optional)</label>
        <input className="pf__input" value={email} placeholder="you@email.com" onChange={(e) => setEmail(e.target.value)} />
        <label className="pf__label">Phone</label>
        <input className="pf__input" value={user?.phone || ''} disabled />
        <Button full size="lg" onClick={saveProfile} icon="check" style={{ marginTop: 20 }}>Save changes</Button>
      </Sheet>

      {/* Saved rooms */}
      <Sheet open={favOpen} onClose={() => setFavOpen(false)} title="Saved rooms">
        {savedRooms.length === 0 ? (
          <div className="pf__fav-empty">
            <Icon name="heart" size={34} color="var(--text-faint)" />
            <p>No saved rooms yet. Tap the heart on any room to save it.</p>
          </div>
        ) : (
          <div className="pf__favs">
            {savedRooms.map((r) => (
              <button key={r.id} className="pf__fav" onClick={() => { setFavOpen(false); navigate('/rooms') }}>
                <img src={r.photos[0]} alt={r.name} />
                <div>
                  <strong>{r.name}</strong>
                  <span>${r.price}/night · {r.size}</span>
                </div>
                <Icon name="chevronRight" size={18} color="var(--text-faint)" />
              </button>
            ))}
          </div>
        )}
      </Sheet>
    </div>
  )
}
