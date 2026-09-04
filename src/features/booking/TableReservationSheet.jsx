import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Sheet from '../../components/Sheet.jsx'
import Button from '../../components/Button.jsx'
import Icon from '../../components/Icon.jsx'
import { useBooking } from '../../context/BookingContext.jsx'
import { useToast } from '../../context/ToastContext.jsx'

const TIMES = ['6:00 PM', '6:30 PM', '7:00 PM', '7:30 PM', '8:00 PM', '8:30 PM', '9:00 PM', '9:30 PM']
const AREAS = [
  { id: 'pub', label: 'Pub floor', note: 'Lively, by the bar' },
  { id: 'fire', label: 'By the fire', note: 'Warm & quiet' },
  { id: 'roof', label: 'Rooftop', note: 'Open-air, sunset' },
]

function isoToday() {
  return new Date().toISOString().slice(0, 10)
}

export default function TableReservationSheet({ open, onClose }) {
  const { addBooking } = useBooking()
  const toast = useToast()
  const navigate = useNavigate()

  const [date, setDate] = useState(isoToday())
  const [time, setTime] = useState('7:30 PM')
  const [party, setParty] = useState(2)
  const [area, setArea] = useState('fire')

  function reserve() {
    const areaLabel = AREAS.find((a) => a.id === area)?.label
    addBooking({
      type: 'table',
      title: `Table for ${party} · ${areaLabel}`,
      subtitle: `${new Date(date).toLocaleDateString(undefined, { weekday: 'short', day: 'numeric', month: 'short' })} · ${time}`,
      image: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=500&q=80',
      total: 0,
      party,
      time,
      date,
    })
    toast('Table reserved — see you soon')
    onClose?.()
    navigate('/bookings')
  }

  return (
    <Sheet open={open} onClose={onClose} title="Book a table">
      <div className="tr">
        <label className="tr__label"><Icon name="calendar" size={14} /> Date</label>
        <input className="tr__date" type="date" min={isoToday()} value={date} onChange={(e) => setDate(e.target.value)} />

        <label className="tr__label"><Icon name="clock" size={14} /> Time</label>
        <div className="tr__times hide-scroll">
          {TIMES.map((t) => (
            <button key={t} className={`tr__time ${time === t ? 'is-active' : ''}`} onClick={() => setTime(t)}>
              {t}
            </button>
          ))}
        </div>

        <label className="tr__label"><Icon name="guests" size={14} /> Party size</label>
        <div className="tr__party">
          <button onClick={() => setParty((p) => Math.max(1, p - 1))}>–</button>
          <strong>{party} {party === 1 ? 'guest' : 'guests'}</strong>
          <button onClick={() => setParty((p) => Math.min(12, p + 1))}>+</button>
        </div>

        <label className="tr__label"><Icon name="glass" size={14} /> Seating</label>
        <div className="tr__areas">
          {AREAS.map((a) => (
            <button key={a.id} className={`tr__area ${area === a.id ? 'is-active' : ''}`} onClick={() => setArea(a.id)}>
              <strong>{a.label}</strong>
              <span>{a.note}</span>
            </button>
          ))}
        </div>

        <Button full size="lg" onClick={reserve} icon="checkCircle" style={{ marginTop: 22 }}>
          Reserve table
        </Button>
        <p className="tr__fine">Free to reserve · hold released after 15 min.</p>
      </div>
    </Sheet>
  )
}
