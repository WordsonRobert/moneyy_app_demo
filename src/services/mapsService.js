/**
 * Google Maps Places integration.
 *
 * Reads the key from VITE_GOOGLE_MAPS_API_KEY. If no key is set the caller is
 * expected to fall back to curated data (see nearbyFallback.js), so the
 * prototype works out-of-the-box and gets richer once a key is added.
 *
 * Docs: https://developers.google.com/maps/documentation/javascript/places
 */

const API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || ''

export const hasMapsKey = () => Boolean(API_KEY)

let loaderPromise = null

/** Inject the Google Maps JS SDK (with the Places library) exactly once. */
export function loadGoogleMaps() {
  if (!API_KEY) return Promise.reject(new Error('no-maps-key'))
  if (window.google?.maps?.places) return Promise.resolve(window.google)
  if (loaderPromise) return loaderPromise

  loaderPromise = new Promise((resolve, reject) => {
    const cbName = '__lm_gmaps_cb'
    window[cbName] = () => resolve(window.google)
    const script = document.createElement('script')
    script.src = `https://maps.googleapis.com/maps/api/js?key=${API_KEY}&libraries=places&loading=async&callback=${cbName}`
    script.async = true
    script.defer = true
    script.onerror = () => reject(new Error('maps-load-failed'))
    document.head.appendChild(script)
  })
  return loaderPromise
}

const TYPE_LABEL = {
  bar: 'Nightlife',
  night_club: 'Nightlife',
  restaurant: 'Restaurant',
  cafe: 'Cafe',
  tourist_attraction: 'Attraction',
  art_gallery: 'Culture',
  museum: 'Culture',
  park: 'Walk',
  lodging: 'Stay',
}

function labelForTypes(types = []) {
  for (const t of types) if (TYPE_LABEL[t]) return TYPE_LABEL[t]
  return 'Nearby'
}

function metersToLabel(m) {
  if (m == null) return ''
  return m < 1000 ? `${Math.round(m / 50) * 50} m` : `${(m / 1000).toFixed(1)} km`
}

/**
 * Search for interesting places near a coordinate.
 * Returns a normalised array: { id, name, category, rating, image, distance, mapsQuery }
 */
export async function searchNearby({ lat, lng }, { radius = 1500 } = {}) {
  const google = await loadGoogleMaps()
  const center = new google.maps.LatLng(lat, lng)
  const service = new google.maps.places.PlacesService(document.createElement('div'))

  const request = {
    location: center,
    radius,
    type: ['tourist_attraction'],
    keyword: 'things to do bar cafe restaurant attraction',
  }

  return new Promise((resolve, reject) => {
    service.nearbySearch(request, (results, status) => {
      if (status !== google.maps.places.PlacesServiceStatus.OK || !results) {
        return reject(new Error('places-' + status))
      }
      const mapped = results.slice(0, 12).map((p) => {
        const loc = p.geometry?.location
        const dist =
          loc && google.maps.geometry?.spherical
            ? google.maps.geometry.spherical.computeDistanceBetween(center, loc)
            : null
        return {
          id: p.place_id,
          name: p.name,
          category: labelForTypes(p.types),
          rating: p.rating || 0,
          image: p.photos?.[0]?.getUrl({ maxWidth: 500 }) || '',
          distance: metersToLabel(dist),
          mapsQuery: p.name,
        }
      })
      resolve(mapped)
    })
  })
}

/** Deep link to Google Maps search for a place near the guest. Free, no key, always available. */
export function mapsSearchUrl(query, loc) {
  const q = encodeURIComponent(query)
  const near = loc ? `&center=${loc.lat},${loc.lng}` : ''
  return `https://www.google.com/maps/search/?api=1&query=${q}${near}`
}

/* ------------------------------------------------------------------ *
 * OpenStreetMap (Overpass API) — free, no key, no billing, ever.
 * Used automatically when no Google Maps key is configured.
 * ------------------------------------------------------------------ */

const OVERPASS_ENDPOINT = 'https://overpass-api.de/api/interpreter'

const OSM_TAG_LABEL = [
  [/^bar$|^pub$|^nightclub$/, 'Nightlife'],
  [/^restaurant$|^fast_food$/, 'Restaurant'],
  [/^cafe$/, 'Cafe'],
  [/^attraction$|^viewpoint$/, 'Attraction'],
  [/^gallery$|^museum$/, 'Culture'],
  [/^park$/, 'Walk'],
  [/^marketplace$/, 'Market'],
]

function labelForOsmTag(tag = '') {
  for (const [re, label] of OSM_TAG_LABEL) if (re.test(tag)) return label
  return 'Nearby'
}

/** Great-circle distance in meters between two lat/lng points. */
function haversine(lat1, lng1, lat2, lng2) {
  const R = 6371000
  const toRad = (d) => (d * Math.PI) / 180
  const dLat = toRad(lat2 - lat1)
  const dLng = toRad(lng2 - lng1)
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2
  return 2 * R * Math.asin(Math.sqrt(a))
}

/**
 * Search for interesting places near a coordinate using OpenStreetMap data —
 * completely free, no API key, no billing account, ever. Slightly less rich
 * than Google Places (no photos/ratings — the UI falls back gracefully for
 * both), and the public Overpass server is best-effort/rate-limited, so this
 * is wrapped in a timeout and the caller falls back to the curated list.
 *
 * Docs: https://wiki.openstreetmap.org/wiki/Overpass_API
 */
export async function searchNearbyOSM({ lat, lng }, { radius = 1500, timeoutMs = 8000 } = {}) {
  const query = `[out:json][timeout:20];
(
  node["amenity"~"^(restaurant|cafe|bar|pub|nightclub|fast_food)$"](around:${radius},${lat},${lng});
  node["tourism"~"^(attraction|gallery|museum|viewpoint)$"](around:${radius},${lat},${lng});
  node["leisure"="park"](around:${radius},${lat},${lng});
  node["amenity"="marketplace"](around:${radius},${lat},${lng});
);
out body 30;`

  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), timeoutMs)

  let res
  try {
    res = await fetch(OVERPASS_ENDPOINT, {
      method: 'POST',
      body: 'data=' + encodeURIComponent(query),
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      signal: controller.signal,
    })
  } finally {
    clearTimeout(timer)
  }
  if (!res.ok) throw new Error('overpass-' + res.status)
  const data = await res.json()

  return (data.elements || [])
    .filter((el) => el.tags?.name)
    .map((el) => {
      const tag = el.tags.amenity || el.tags.tourism || el.tags.leisure || ''
      const meters = haversine(lat, lng, el.lat, el.lon)
      return {
        id: 'osm_' + el.id,
        name: el.tags.name,
        category: labelForOsmTag(tag),
        rating: 0,
        image: '',
        _meters: meters,
        distance: metersToLabel(meters),
        mapsQuery: el.tags.name,
      }
    })
    .sort((a, b) => a._meters - b._meters)
    .slice(0, 20)
    .map(({ _meters, ...place }) => place)
}
