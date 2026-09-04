import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Sheet from '../../components/Sheet.jsx'
import Button from '../../components/Button.jsx'
import Icon from '../../components/Icon.jsx'
import ImageWithFallback from '../../components/ImageWithFallback.jsx'
import { useBooking } from '../../context/BookingContext.jsx'
import { useToast } from '../../context/ToastContext.jsx'

function isoPlus(days) {
  const d = new Date()
  d.setDate(d.getDate() + days)
  return d.toISOString().slice(0, 10)
}
function nights(a, b) {
  const ms = new Date(b) - new Date(a)
  return Math.max(1, Math.round(ms / 86400000))
}
function pretty(iso) {
  return new Date(iso).toLocaleDateString(undefined, { day: 'numeric', month: 'short' })
}

/** Booking sheet for a specific room type (and optionally a specific unit). */
export default function RoomBookingSheet({ room, unit, open, onClose }) {
  const { addBooking } = useBooking()
  const toast = useToast()
  const navigate = useNavigate()

  const [checkIn, setCheckIn] = useState(isoPlus(1))
  const [checkOut, setCheckOut] = useState(isoPlus(3))
  const [guests, setGuests] = useState(2)

  const nightCount = useMemo(() => nights(checkIn, checkOut), [checkIn, checkOut])
  const subtotal = room ? room.price * nightCount : 0
  const taxes = Math.round(subtotal * 0.12)
  const total = subtotal + taxes

  if (!room) return null

  function confirm() {
    addBooking({
      type: 'room',
      title: room.name,
      unit: unit?.number,
      image: room.photos[0],
      checkIn,
      checkOut,
      guests,
      nights: nightCount,
      total,
      subtitle: `${pretty(checkIn)} – ${pretty(checkOut)} · ${nightCount} night${nightCount > 1 ? 's' : ''}`,
    })
    toast(`${room.name} booked${unit ? ` · Room ${unit.number}` : ''}`)
    onClose?.()
    navigate('/bookings')
  }

  return (
    <Sheet open={open} onClose={onClose} title="Book this room">
      <div className="rb">
        <div className="rb__room">
          <ImageWithFallback src={room.photos[0]} alt={room.name} className="rb__img" />
          <div>
            <h4>{room.name}</h4>
            <p className="muted">{room.tagline}</p>
            {unit && <span className="rb__unit">Room {unit.number}</span>}
          </div>
        </div>

        <div className="rb__dates">
          <label className="rb__field">
            <span><Icon name="calendar" size={14} /> Check-in</span>
            <input type="date" value={checkIn} min={isoPlus(0)} onChange={(e) => setCheckIn(e.target.value)} />
          </label>
          <label className="rb__field">
            <span><Icon name="calendar" size={14} /> Check-out</span>
            <input type="date" value={checkOut} min={checkIn} onChange={(e) => setCheckOut(e.target.value)} />
          </label>
        </div>

        <div className="rb__guests">
          <span><Icon name="guests" size={16} /> Guests</span>
          <div className="rb__stepper">
            <button onClick={() => setGuests((g) => Math.max(1, g - 1))}>–</button>
            <strong>{guests}</strong>
            <button onClick={() => setGuests((g) => Math.min(room.guests, g + 1))}>+</button>
          </div>
        </div>
        <p className="rb__cap">Sleeps up to {room.guests}</p>

        <div className="rb__summary">
          <div className="row" style={{ justifyContent: 'space-between' }}>
            <span className="muted">${room.price} × {nightCount} night{nightCount > 1 ? 's' : ''}</span>
            <span>${subtotal}</span>
          </div>
          <div className="row" style={{ justifyContent: 'space-between', marginTop: 8 }}>
            <span className="muted">Taxes & fees</span>
            <span>${taxes}</span>
          </div>
          <div className="rb__total">
            <span>Total</span>
            <span>${total}</span>
          </div>
        </div>

        <Button full size="lg" onClick={confirm} icon="checkCircle">
          Confirm booking
        </Button>
        <p className="rb__fine">Prototype checkout — no payment is taken.</p>
      </div>
    </Sheet>
  )
}
