import { useMemo, useState } from 'react'
import { useNearby } from '../../hooks/useNearby.js'
import { mapsSearchUrl } from '../../services/mapsService.js'
import { nearbyCategories } from '../../data/nearbyFallback.js'
import Icon from '../../components/Icon.jsx'
import Chip from '../../components/Chip.jsx'
import ImageWithFallback from '../../components/ImageWithFallback.jsx'
import RatingStars from '../../components/RatingStars.jsx'
import './explore.css'

export default function ExploreScreen() {
  const { location, places, status, source, refresh } = useNearby({ preferGps: true })
  const [cat, setCat] = useState('All')
  const [query, setQuery] = useState('')

  const filtered = useMemo(() => {
    return places.filter((p) => {
      const okCat = cat === 'All' || p.category === cat
      const okQ = !query || p.name.toLowerCase().includes(query.toLowerCase())
      return okCat && okQ
    })
  }, [places, cat, query])

  const cityLabel = location?.city || 'Locating you…'
  const sourceText =
    status === 'live'
      ? source === 'google'
        ? 'Live from Google Maps'
        : 'Live from OpenStreetMap'
      : status === 'loading'
        ? 'Finding your spot…'
        : `Curated near ${cityLabel}`

  return (
    <div className="explore fade-up">
      <header className="explore__head">
        <div>
          <p className="eyebrow">Explore</p>
          <h1>Nearby</h1>
        </div>
        <button className="explore__refresh" onClick={refresh} aria-label="Refresh">
          <Icon name="location" size={18} color="var(--gold)" />
        </button>
      </header>

      <div className="explore__loc container">
        <Icon name="location" size={15} color="var(--gold)" />
        <span className="explore__city">{cityLabel}</span>
        <span className={`explore__badge explore__badge--${status}`}>{sourceText}</span>
      </div>

      <div className="explore__search container">
        <Icon name="search" size={18} color="var(--text-dim)" />
        <input
          placeholder="Search places nearby…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>

      <div className="explore__chips hide-scroll">
        {nearbyCategories.map((c) => (
          <Chip key={c} active={cat === c} onClick={() => setCat(c)}>
            {c}
          </Chip>
        ))}
      </div>

      {status === 'loading' ? (
        <div className="explore__grid container">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="skeleton" style={{ height: 200 }} />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="explore__empty">
          <Icon name="compass" size={40} color="var(--text-faint)" />
          <p>Nothing matches that yet. Try another filter.</p>
        </div>
      ) : (
        <div className="explore__grid container">
          {filtered.map((p) => (
            <a
              key={p.id}
              className="place fade-up"
              href={mapsSearchUrl(p.mapsQuery || p.name, location)}
              target="_blank"
              rel="noreferrer"
            >
              <ImageWithFallback src={p.image} alt={p.name} className="place__img" ratio="1 / 1" />
              <span className="place__cat">{p.category}</span>
              <div className="place__body">
                <h4>{p.name}</h4>
                <div className="place__meta">
                  {p.rating ? <RatingStars value={p.rating} /> : null}
                  {p.distance && <span className="faint">{p.rating ? '· ' : ''}{p.distance}</span>}
                </div>
                <span className="place__open">
                  Open in Maps <Icon name="chevronRight" size={13} />
                </span>
              </div>
            </a>
          ))}
        </div>
      )}

      {status === 'curated' && (
        <p className="explore__hint container">
          Couldn't reach live place data right now — showing our curated picks instead.
        </p>
      )}
      <div style={{ height: 20 }} />
    </div>
  )
}
