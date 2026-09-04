import Sheet from '../../components/Sheet.jsx'
import Button from '../../components/Button.jsx'
import Icon from '../../components/Icon.jsx'
import ImageWithFallback from '../../components/ImageWithFallback.jsx'

/** Shows a room type's photos, description and facilities, with a Book action. */
export default function RoomDetailSheet({ room, open, onClose, onBook }) {
  if (!room) return null
  return (
    <Sheet open={open} onClose={onClose} title={room.name} full>
      <div className="rd">
        <div className="rd__photos hide-scroll">
          {room.photos.map((p, i) => (
            <ImageWithFallback key={i} src={p} alt={room.name} className="rd__photo" />
          ))}
        </div>

        <div className="rd__facts">
          <span><Icon name="guests" size={15} /> {room.guests} guests</span>
          <span><Icon name="bed" size={15} /> {room.bed}</span>
          <span><Icon name="door" size={15} /> {room.size}</span>
        </div>

        <p className="rd__desc">{room.description}</p>

        <h4 className="rd__h">What’s in the room</h4>
        <div className="rd__facilities">
          {room.facilities.map((f, i) => (
            <div key={i} className="rd__fac">
              <Icon name={f} size={18} color="var(--gold)" />
              <span>{room.facilityLabels[i]}</span>
            </div>
          ))}
        </div>

        <div className="rd__cta">
          <div>
            <span className="muted" style={{ fontSize: 12 }}>From</span>
            <div className="rd__price">${room.price}<small>/night</small></div>
          </div>
          <Button size="lg" onClick={() => onBook(room)} iconRight="chevronRight">
            Book now
          </Button>
        </div>
      </div>
    </Sheet>
  )
}
