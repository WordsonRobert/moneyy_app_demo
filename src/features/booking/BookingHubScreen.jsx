import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import ScreenHeader from '../../components/ScreenHeader.jsx'
import Icon from '../../components/Icon.jsx'
import ImageWithFallback from '../../components/ImageWithFallback.jsx'
import TableReservationSheet from './TableReservationSheet.jsx'
import './booking.css'
import { img } from '../../utils/img.js'

const OPTIONS = [
  { id: 'rooms', title: 'Book a room', desc: 'Stay the night · from $129', icon: 'bed', image: img('photo-1611892440504-42a792e24d32.jpg'), to: '/rooms' },
  { id: 'service', title: 'Order room service', desc: 'In-room dining · 7am–2am', icon: 'fork', image: img('photo-1414235077428-338989a2e8c0.jpg'), to: '/room-service' },
  { id: 'table', title: 'Book a table', desc: 'Pub, fireside or rooftop', icon: 'glass', image: img('photo-1551218808-94e220e084d2.jpg'), action: 'table' },
  { id: 'explore', title: 'Plan your night', desc: 'Nice things to do nearby', icon: 'location', image: img('photo-1519677100203-a0e668c92439.jpg'), to: '/explore' },
]

export default function BookingHubScreen() {
  const navigate = useNavigate()
  const [tableOpen, setTableOpen] = useState(false)

  return (
    <div className="hub">
      <ScreenHeader title="Book" subtitle="What are we planning?" onBack={() => navigate('/')} />

      <div className="hub__intro container">
        <p className="eyebrow">The Ember House</p>
        <h1>What would you like to book?</h1>
      </div>

      <div className="hub__grid container">
        {OPTIONS.map((o) => (
          <button
            key={o.id}
            className="hub__card fade-up"
            onClick={() => (o.action === 'table' ? setTableOpen(true) : navigate(o.to))}
          >
            <ImageWithFallback src={o.image} alt={o.title} className="hub__img" />
            <div className="hub__scrim" />
            <div className="hub__badge"><Icon name={o.icon} size={20} color="var(--gold)" /></div>
            <div className="hub__body">
              <h4>{o.title}</h4>
              <p>{o.desc}</p>
            </div>
            <div className="hub__go"><Icon name="chevronRight" size={18} color="#fff" /></div>
          </button>
        ))}
      </div>

      <div className="hub__help container">
        <Icon name="concierge" size={20} color="var(--gold)" />
        <div>
          <strong>Need a hand?</strong>
          <span>Concierge is on 24/7 — dial 0 from any room.</span>
        </div>
      </div>

      <div style={{ height: 20 }} />
      <TableReservationSheet open={tableOpen} onClose={() => setTableOpen(false)} />
    </div>
  )
}
