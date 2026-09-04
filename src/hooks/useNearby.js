import { useEffect, useState } from 'react'
import { detectLocation } from '../services/geolocationService.js'
import { hasMapsKey, searchNearby } from '../services/mapsService.js'
import { nearbyFallback } from '../data/nearbyFallback.js'

/**
 * Resolves the guest's location and a list of "things to do nearby".
 * Prefers live Google Places results; gracefully falls back to a curated list.
 *
 * @param {object} opts
 * @param {boolean} opts.preferGps  ask the browser for precise location
 */
export function useNearby({ preferGps = false } = {}) {
  const [location, setLocation] = useState(null)
  const [places, setPlaces] = useState([])
  const [status, setStatus] = useState('loading') // loading | live | curated | error
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
            return
          }
        } catch {
          /* fall back below */
        }
      }
      if (!alive) return
      setPlaces(nearbyFallback)
      setStatus('curated')
    })()

    return () => {
      alive = false
    }
  }, [preferGps, reload])

  return { location, places, status, refresh }
}
