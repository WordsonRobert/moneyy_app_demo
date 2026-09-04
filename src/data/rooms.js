import { img } from '../utils/img.js'
/**
 * Room catalogue + floor-plan layout.
 *
 * `roomTypes` describes each bookable category (price, size, facilities, photos).
 * `floors` lays out the physical rooms with x/y/w/h coordinates (on a 0–100 grid)
 * so the FloorPlan component can render an interactive SVG map and colour each
 * unit by availability.
 */

export const roomTypes = [
  {
    id: 'ember-queen',
    name: 'Ember Queen',
    tagline: 'Cosy queen with brick & brass',
    price: 189,
    size: '26 m²',
    guests: 2,
    bed: '1 Queen bed',
    photos: [
      img('photo-1611892440504-42a792e24d32.jpg'),
      img('photo-1618773928121-c32242e63f39.jpg'),
    ],
    facilities: ['wifi', 'bed', 'spa', 'clock'],
    facilityLabels: ['Fast Wi-Fi', 'Queen bed', 'Rain shower', '24h service'],
    description:
      'Our signature room. Warm oak floors, a deep queen bed, blackout drapes and a walk-in rain shower. Overlooks the lantern-lit courtyard.',
    color: '#c99a5b',
  },
  {
    id: 'lantern-king',
    name: 'Lantern King',
    tagline: 'Spacious king, courtyard view',
    price: 249,
    size: '34 m²',
    guests: 2,
    bed: '1 King bed',
    photos: [
      img('photo-1631049307264-da0ec9d70304.jpg'),
      img('photo-1582719478250-c89cae4dc85b.jpg'),
    ],
    facilities: ['wifi', 'bed', 'glass', 'spa'],
    facilityLabels: ['Fast Wi-Fi', 'King bed', 'Mini bar', 'Soaking tub'],
    description:
      'A generous king with a lounge nook, a curated mini-bar and a deep soaking tub. Big windows onto the courtyard and the rooftop stair.',
    color: '#e0b978',
  },
  {
    id: 'loft-suite',
    name: 'The Loft Suite',
    tagline: 'Top-floor suite with terrace',
    price: 389,
    size: '52 m²',
    guests: 3,
    bed: '1 King + sofa bed',
    photos: [
      img('photo-1590490360182-c33d57733427.jpg'),
      img('photo-1560448204-e02f11c3d0e2.jpg'),
    ],
    facilities: ['wifi', 'bed', 'glass', 'pool'],
    facilityLabels: ['Fast Wi-Fi', 'King + sofa', 'Private terrace', 'Rooftop access'],
    description:
      'The crown of the house. A double-height loft with its own terrace, a wet bar and direct access to the rooftop pool deck. Sleeps three.',
    color: '#edc98d',
  },
  {
    id: 'snug-single',
    name: 'The Snug',
    tagline: 'Compact single for solo stays',
    price: 129,
    size: '18 m²',
    guests: 1,
    bed: '1 Double bed',
    photos: [
      img('photo-1505692952047-1a78307da8f2.jpg'),
      img('photo-1560185007-cde436f6a4d0.jpg'),
    ],
    facilities: ['wifi', 'bed', 'clock'],
    facilityLabels: ['Fast Wi-Fi', 'Double bed', 'Desk nook'],
    description:
      'Small, smart and warm. A double bed, a fold-down desk and everything you need for a quick city stay right above the pub.',
    color: '#8a6f4a',
  },
]

export const roomTypeById = Object.fromEntries(roomTypes.map((r) => [r.id, r]))

// Physical layout. status: "available" | "booked" | "held"
const unit = (number, typeId, x, y, status = 'available') => ({
  number,
  typeId,
  x,
  y,
  w: 20,
  h: 22,
  status,
})

export const floors = [
  {
    id: 1,
    name: 'Ground · Pub & Snugs',
    note: 'Rooms above the bar — lively, central.',
    units: [
      unit('101', 'snug-single', 6, 8),
      unit('102', 'snug-single', 30, 8, 'booked'),
      unit('103', 'ember-queen', 54, 8),
      unit('104', 'ember-queen', 78, 8, 'held'),
      unit('105', 'snug-single', 6, 40, 'booked'),
      unit('106', 'ember-queen', 30, 40),
    ],
    amenities: [
      { label: 'Stair', x: 54, y: 40, w: 20, h: 22, kind: 'core' },
      { label: 'Pub', x: 78, y: 40, w: 20, h: 22, kind: 'amenity' },
    ],
  },
  {
    id: 2,
    name: 'First · Courtyard',
    note: 'Quieter floor facing the courtyard.',
    units: [
      unit('201', 'ember-queen', 6, 8),
      unit('202', 'lantern-king', 30, 8),
      unit('203', 'lantern-king', 54, 8, 'booked'),
      unit('204', 'ember-queen', 78, 8),
      unit('205', 'ember-queen', 6, 40, 'held'),
      unit('206', 'lantern-king', 30, 40),
      unit('207', 'lantern-king', 78, 40, 'booked'),
    ],
    amenities: [
      { label: 'Stair', x: 54, y: 40, w: 20, h: 22, kind: 'core' },
    ],
  },
  {
    id: 3,
    name: 'Top · Loft & Rooftop',
    note: 'Suites with terrace and rooftop deck.',
    units: [
      unit('301', 'loft-suite', 6, 8),
      unit('302', 'loft-suite', 30, 8, 'booked'),
      unit('303', 'lantern-king', 54, 8),
      unit('304', 'ember-queen', 78, 8),
    ],
    amenities: [
      { label: 'Rooftop Pool', x: 6, y: 40, w: 44, h: 22, kind: 'amenity' },
      { label: 'Bar', x: 54, y: 40, w: 20, h: 22, kind: 'amenity' },
      { label: 'Stair', x: 78, y: 40, w: 20, h: 22, kind: 'core' },
    ],
  },
]

export default roomTypes
