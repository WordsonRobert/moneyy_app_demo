import { useNavigate } from 'react-router-dom'
import ScreenHeader from '../../components/ScreenHeader.jsx'
import Icon from '../../components/Icon.jsx'
import ImageWithFallback from '../../components/ImageWithFallback.jsx'
import Button from '../../components/Button.jsx'
import { useBooking } from '../../context/BookingContext.jsx'
import './bookings.css'

const TYPE_META = {
  room: { icon: 'bed', label: 'Room' },
  roomservice: { icon: 'fork', label: 'Room service' },
  table: { icon: 'glass', label: 'Table' },
}

export default function BookingsScreen() {
  const { bookings, cancelBooking } = useBooking()
  const navigate = useNavigate()

  return (
    <div className="bk">
      <ScreenHeader title="My bookings" subtitle={`${bookings.length} ${bookings.length === 1 ? 'booking' : 'bookings'}`} onBack={() => navigate('/')} />

      {bookings.length === 0 ? (
        <div className="bk__empty">
          <div className="bk__empty-icon"><Icon name="calendar" size={34} color="var(--gold)" /></div>
          <h3>No bookings yet</h3>
          <p className="muted">Book a room, a table or order in — it’ll show up here.</p>
          <Button onClick={() => navigate('/booking')} icon="plus" style={{ marginTop: 18 }}>
            Start a booking
          </Button>
        </div>
      ) : (
        <div className="bk__list container">
          {bookings.map((b) => {
            const meta = TYPE_META[b.type] || { icon: 'sparkle', label: 'Booking' }
            const cancelled = b.status === 'Cancelled'
            return (
              <div key={b.id} className={`bk-card ${cancelled ? 'is-cancelled' : ''}`}>
                <ImageWithFallback src={b.image} alt={b.title} className="bk-card__img" />
                <div className="bk-card__body">
                  <div className="bk-card__top">
                    <span className="bk-card__type"><Icon name={meta.icon} size={13} color="var(--gold)" /> {meta.label}</span>
                    <span className={`bk-card__status bk-card__status--${cancelled ? 'off' : 'on'}`}>{b.status}</span>
                  </div>
                  <h4>{b.title}</h4>
                  <p className="muted">{b.subtitle}</p>
                  <div className="bk-card__foot">
                    {b.total > 0 && <strong>${b.total}</strong>}
                    {b.unit && <span className="faint">Room {b.unit}</span>}
                    {!cancelled && (
                      <button className="bk-card__cancel" onClick={() => cancelBooking(b.id)}>
                        Cancel
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
      <div style={{ height: 24 }} />
    </div>
  )
}
