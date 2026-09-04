import { useEffect, useState } from 'react'
import { detectLocation } from '../services/geolocationService.js'
import { hasMapsKey, searchNearby, searchNearbyOSM } from '../services/mapsService.js'
import { nearbyFallback } from '../data/nearbyFallback.js'

/**
 * Resolves the guest's location and a list of "things to do nearby".
 *
 * Tries, in order: live Google Places (only if a paid API key is configured)
 * → live OpenStreetMap data (always free, no key, no billing) → a curated
 * static list. `source` tells the UI which one actually served the results.
 *
 * @param {object} opts
 * @param {boolean} opts.preferGps  ask the browser for precise location
 */
export function useNearby({ preferGps = false } = {}) {
  const [location, setLocation] = useState(null)
  const [places, setPlaces] = useState([])
  const [status, setStatus] = useState('loading') // loading | live | curated | error
  const [source, setSource] = useState(null) // 'google' | 'osm' | null
  const [reload, setReload] = useState(0)

  const refresh = () => setReload((n) => n + 1)

  useEffect(() => {
    let alive = true
    setStatus('loading')

    ;(async () => {
      const loc = await detectLocation({ preferGps })
      if (!alive) return
      setLocation(loc)

      if (hasMapsKey()) {
        try {
          const live = await searchNearby(loc)
          if (!alive) return
          if (live.length) {
            setPlaces(live)
            setStatus('live')
            setSource('google')
            return
          }
        } catch {
          /* fall through to OSM */
        }
      }

      try {
        const live = await searchNearbyOSM(loc)
        if (!alive) return
        if (live.length) {
          setPlaces(live)
          setStatus('live')
          setSource('osm')
          return
        }
      } catch {
        /* fall through to curated */
      }

      if (!alive) return
      setPlaces(nearbyFallback)
      setStatus('curated')
      setSource(null)
    })()

    return () => {
      alive = false
    }
  }, [preferGps, reload])

  return { location, places, status, source, refresh }
}
