import { useState } from 'react'
import { floors, roomTypeById } from '../../data/rooms.js'
import './floorplan.css'

const STATUS_FILL = {
  available: 'rgba(143, 191, 130, 0.16)',
  held: 'rgba(224, 185, 120, 0.16)',
  booked: 'rgba(224, 115, 107, 0.14)',
}
const STATUS_STROKE = {
  available: '#8fbf82',
  held: '#e0b978',
  booked: '#6b5a4a',
}

/**
 * Interactive SVG floor plan. Guests pick a floor, see every unit coloured by
 * availability, and tap an available room to book it.
 */
export default function FloorPlan({ onPick }) {
  const [floorIdx, setFloorIdx] = useState(0)
  const floor = floors[floorIdx]

  return (
    <div className="fp">
      <div className="fp__floors">
        {floors.map((f, i) => (
          <button
            key={f.id}
            className={`fp__floor-btn ${i === floorIdx ? 'is-active' : ''}`}
            onClick={() => setFloorIdx(i)}
          >
            <strong>{f.id}</strong>
            <span>{f.name.split('·')[1]?.trim() || f.name}</span>
          </button>
        ))}
      </div>

      <p className="fp__note">{floor.note}</p>

      <div className="fp__canvas">
        <svg viewBox="0 0 104 68" width="100%" preserveAspectRatio="xMidYMid meet">
          {/* building outline */}
          <rect x="1" y="1" width="102" height="66" rx="4" className="fp__outline" />
          {/* corridor */}
          <rect x="3" y="31.5" width="98" height="5" className="fp__corridor" />

          {/* amenities / cores */}
          {floor.amenities?.map((a, i) => (
            <g key={'a' + i}>
              <rect
                x={a.x}
                y={a.y}
                width={a.w}
                height={a.h}
                rx="2.5"
                className={`fp__amenity fp__amenity--${a.kind}`}
              />
              <text x={a.x + a.w / 2} y={a.y + a.h / 2 + 1.4} className="fp__amenity-label">
                {a.label}
              </text>
            </g>
          ))}

          {/* room units */}
          {floor.units.map((u) => {
            const type = roomTypeById[u.typeId]
            const tappable = u.status === 'available'
            return (
              <g
                key={u.number}
                className={`fp__unit ${tappable ? 'is-open' : ''}`}
                onClick={() => tappable && onPick?.(type, u)}
              >
                <rect
                  x={u.x}
                  y={u.y}
                  width={u.w}
                  height={u.h}
                  rx="2.5"
                  fill={STATUS_FILL[u.status]}
                  stroke={STATUS_STROKE[u.status]}
                  strokeWidth="0.6"
                />
                <text x={u.x + u.w / 2} y={u.y + 8} className="fp__unit-num">
                  {u.number}
                </text>
                <text x={u.x + u.w / 2} y={u.y + 14} className="fp__unit-type">
                  {type.name.split(' ')[0]}
                </text>
                <text x={u.x + u.w / 2} y={u.y + 19} className="fp__unit-price">
                  ${type.price}
                </text>
              </g>
            )
          })}
        </svg>
      </div>

      <div className="fp__legend">
        <span><i style={{ background: STATUS_STROKE.available }} /> Available</span>
        <span><i style={{ background: STATUS_STROKE.held }} /> On hold</span>
        <span><i style={{ background: STATUS_STROKE.booked }} /> Booked</span>
      </div>
      <p className="fp__tip">Tap an available room to book it.</p>
    </div>
  )
}
