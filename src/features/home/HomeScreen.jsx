import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext.jsx'
import { useNearby } from '../../hooks/useNearby.js'
import Icon from '../../components/Icon.jsx'
import ImageWithFallback from '../../components/ImageWithFallback.jsx'
import RatingStars from '../../components/RatingStars.jsx'
import { quickActions, featuredMoments, happenings } from '../../data/experiences.js'
import { property } from '../../data/property.js'
import './home.css'

function greeting() {
  const h = new Date().getHours()
  if (h < 12) return 'Good morning'
  if (h < 18) return 'Good afternoon'
  return 'Good evening'
}

export default function HomeScreen() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const { location, places, status } = useNearby()

  const name = user?.name && user.name !== 'Guest' ? user.name : 'there'
  const cityLabel = location?.city || 'Locating…'

  return (
    <div className="home fade-up">
      {/* Top bar */}
      <header className="home__top">
        <button className="home__loc" onClick={() => navigate('/explore')}>
          <Icon name="location" size={16} color="var(--gold)" />
          <span>{cityLabel}</span>
          <Icon name="chevronDown" size={14} color="var(--text-dim)" />
        </button>
        <button className="home__bell" aria-label="Notifications">
          <Icon name="bell" size={21} />
          <span className="home__dot" />
        </button>
      </header>

      {/* Greeting */}
      <div className="home__greet container">
        <p className="eyebrow">{property.brand}</p>
        <h1>
          {greeting()},<br />
          {name} <span className="home__wave">👋</span>
        </h1>
      </div>

      {/* Search */}
      <button className="home__search container" onClick={() => navigate('/explore')}>
        <Icon name="search" size={19} color="var(--text-dim)" />
        <span>Search rooms, dishes, things to do…</span>
      </button>

      {/* Quick actions */}
      <div className="home__quick hide-scroll">
        {quickActions.map((q) => (
          <Link key={q.id} to={q.to} className="quick">
            <div className="quick__icon">
              <Icon name={q.icon} size={22} color="var(--gold)" />
            </div>
            <span>{q.label}</span>
          </Link>
        ))}
      </div>

      {/* Featured moments */}
      <div className="section-title container">
        <h3>Moments at {property.name.split(' ')[1] || 'The Ember'}</h3>
      </div>
      <div className="home__featured hide-scroll">
        {featuredMoments.map((m) => (
          <Link key={m.id} to={m.to} className="feat">
            <ImageWithFallback src={m.image} alt={m.title} className="feat__img" />
            <div className="feat__overlay" />
            <div className="feat__body">
              <span className="feat__accent">{m.accent}</span>
              <h4>{m.title}</h4>
              <p>{m.subtitle}</p>
            </div>
          </Link>
        ))}
      </div>

      {/* Tonight */}
      <div className="section-title container">
        <h3>Tonight at the House</h3>
        <Link to="/reels" className="link-more">Watch reels</Link>
      </div>
      <div className="home__happen hide-scroll">
        {happenings.map((h) => (
          <div key={h.id} className="happen">
            <ImageWithFallback src={h.image} alt={h.title} className="happen__img" />
            <div className="happen__body">
              <h4>{h.title}</h4>
              <span><Icon name="clock" size={12} color="var(--text-faint)" /> {h.time}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Nearby preview */}
      <div className="section-title container">
        <h3>Nice things to do nearby</h3>
        <Link to="/explore" className="link-more">See all</Link>
      </div>
      <p className="home__nearby-note container">
        {status === 'live' ? (
          <><Icon name="location" size={12} color="var(--gold)" /> Live picks around {cityLabel}</>
        ) : (
          <><Icon name="sparkle" size={12} color="var(--gold)" /> Curated picks near the House</>
        )}
      </p>
      <div className="home__nearby hide-scroll">
        {places.slice(0, 6).map((p) => (
          <div key={p.id} className="near">
            <ImageWithFallback src={p.image} alt={p.name} className="near__img" />
            <div className="near__body">
              <h4>{p.name}</h4>
              <div className="near__meta">
                <RatingStars value={p.rating || 4.5} />
                {p.distance && <span className="faint">· {p.distance}</span>}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div style={{ height: 24 }} />
    </div>
  )
}
