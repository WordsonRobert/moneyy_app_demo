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

/** Deep link to Google Maps search for a place near the guest. */
export function mapsSearchUrl(query, loc) {
  const q = encodeURIComponent(query)
  const near = loc ? `&center=${loc.lat},${loc.lng}` : ''
  return `https://www.google.com/maps/search/?api=1&query=${q}${near}`
}
