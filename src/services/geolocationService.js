/**
 * Figure out where the guest is, as accurately as we can, without being pushy.
 *
 * Strategy:
 *   1. Try the browser Geolocation API (most accurate, needs permission).
 *   2. Fall back to IP-based geolocation (ipapi.co — free, no key, city-level).
 *   3. Fall back to the property's own city so the UI always has something.
 *
 * Returns: { lat, lng, city, region, country, source }
 */

const DEFAULT_LOCATION = {
  lat: 51.5072,
  lng: -0.1276,
  city: 'Riverside Quarter',
  region: '',
  country: '',
  source: 'default',
}

function browserGeolocation(timeout = 6000) {
  return new Promise((resolve, reject) => {
    if (!('geolocation' in navigator)) return reject(new Error('no geolocation'))
    navigator.geolocation.getCurrentPosition(
      (pos) =>
        resolve({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
          source: 'gps',
        }),
      (err) => reject(err),
      { enableHighAccuracy: false, timeout, maximumAge: 5 * 60 * 1000 },
    )
  })
}

async function ipGeolocation() {
  // ipapi.co returns approximate location from the caller's IP address.
  const res = await fetch('https://ipapi.co/json/')
  if (!res.ok) throw new Error('ip lookup failed')
  const data = await res.json()
  if (data.error) throw new Error(data.reason || 'ip lookup error')
  return {
    lat: data.latitude,
    lng: data.longitude,
    city: data.city,
    region: data.region,
    country: data.country_name,
    source: 'ip',
  }
}

/** Reverse-geocode GPS coords to a city name via the same free service. */
async function cityFromIp(base) {
  try {
    const ip = await ipGeolocation()
    return { ...base, city: ip.city, region: ip.region, country: ip.country }
  } catch {
    return { ...base, city: 'Near you' }
  }
}

export async function detectLocation({ preferGps = true } = {}) {
  if (preferGps) {
    try {
      const gps = await browserGeolocation()
      return await cityFromIp(gps)
    } catch {
      /* fall through to IP */
    }
  }
  try {
    return await ipGeolocation()
  } catch {
    return DEFAULT_LOCATION
  }
}

export { DEFAULT_LOCATION }
