import { useState } from 'react'
import ScreenHeader from '../../components/ScreenHeader.jsx'
import Icon from '../../components/Icon.jsx'
import ImageWithFallback from '../../components/ImageWithFallback.jsx'
import RatingStars from '../../components/RatingStars.jsx'
import Button from '../../components/Button.jsx'
import { useBooking } from '../../context/BookingContext.jsx'
import { roomTypes } from '../../data/rooms.js'
import { facilities } from '../../data/facilities.js'
import { property } from '../../data/property.js'
import FloorPlan from './FloorPlan.jsx'
import RoomDetailSheet from './RoomDetailSheet.jsx'
import RoomBookingSheet from './RoomBookingSheet.jsx'
import './rooms.css'

export default function RoomsScreen() {
  const { isFavorite, toggleFavorite } = useBooking()
  const [tab, setTab] = useState('rooms') // rooms | plan
  const [detail, setDetail] = useState(null)
  const [booking, setBooking] = useState(null) // { room, unit }

  const openBook = (room, unit = null) => {
    setDetail(null)
    setBooking({ room, unit })
  }

  return (
    <div className="rooms">
      <ScreenHeader title="Rooms & Suites" subtitle={property.name} />

      {/* Hero */}
      <div className="rooms__hero container">
        <ImageWithFallback src={property.hero} alt={property.name} className="rooms__hero-img" />
        <div className="rooms__hero-body">
          <RatingStars value={property.rating} count={property.reviews} />
          <h2>{property.name}</h2>
          <p className="muted">{property.about}</p>
        </div>
      </div>

      {/* Facilities */}
      <div className="section-title container"><h3>House facilities</h3></div>
      <div className="rooms__facilities hide-scroll">
        {facilities.map((f) => (
          <div key={f.id} className="fac-chip">
            <Icon name={f.icon} size={20} color="var(--gold)" />
            <strong>{f.label}</strong>
            <span>{f.note}</span>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="rooms__tabs container">
        <button className={tab === 'rooms' ? 'is-active' : ''} onClick={() => setTab('rooms')}>
          <Icon name="bed" size={17} /> Rooms
        </button>
        <button className={tab === 'plan' ? 'is-active' : ''} onClick={() => setTab('plan')}>
          <Icon name="door" size={17} /> Floor plan
        </button>
      </div>

      {tab === 'rooms' ? (
        <div className="rooms__list container">
          {roomTypes.map((r) => (
            <div key={r.id} className="room-card fade-up">
              <div className="room-card__media" onClick={() => setDetail(r)}>
                <ImageWithFallback src={r.photos[0]} alt={r.name} className="room-card__img" />
                <button
                  className="room-card__fav"
                  onClick={(e) => {
                    e.stopPropagation()
                    toggleFavorite(r.id)
                  }}
                  aria-label="Save"
                >
                  <Icon name={isFavorite(r.id) ? 'heart_fill' : 'heart'} size={18} color={isFavorite(r.id) ? 'var(--gold)' : '#fff'} />
                </button>
                <span className="room-card__size">{r.size}</span>
              </div>
              <div className="room-card__body">
                <div className="room-card__row">
                  <h4>{r.name}</h4>
                  <div className="room-card__price">${r.price}<small>/night</small></div>
                </div>
                <p className="muted">{r.tagline}</p>
                <div className="room-card__facs">
                  {r.facilities.slice(0, 4).map((f, i) => (
                    <span key={i}><Icon name={f} size={14} color="var(--text-dim)" /> {r.facilityLabels[i]}</span>
                  ))}
                </div>
                <div className="room-card__actions">
                  <Button variant="outline" size="md" onClick={() => setDetail(r)}>Details</Button>
                  <Button size="md" onClick={() => openBook(r)} full>Book</Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="container" style={{ paddingTop: 4 }}>
          <FloorPlan onPick={(room, unit) => openBook(room, unit)} />
        </div>
      )}

      <div style={{ height: 24 }} />

      <RoomDetailSheet room={detail} open={!!detail} onClose={() => setDetail(null)} onBook={(r) => openBook(r)} />
      <RoomBookingSheet
        room={booking?.room}
        unit={booking?.unit}
        open={!!booking}
        onClose={() => setBooking(null)}
      />
    </div>
  )
}
