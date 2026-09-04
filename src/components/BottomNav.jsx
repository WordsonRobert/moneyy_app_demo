import { NavLink, useNavigate } from 'react-router-dom'
import Icon from './Icon.jsx'
import './BottomNav.css'

const TABS = [
  { to: '/', icon: 'home', label: 'Home', end: true },
  { to: '/explore', icon: 'compass', label: 'Nearby' },
  { to: '/reels', icon: 'film', label: 'Reels' },
  { to: '/profile', icon: 'user', label: 'Profile' },
]

export default function BottomNav({ immersive }) {
  const navigate = useNavigate()

  return (
    <nav className={`bottom-nav ${immersive ? 'bottom-nav--immersive' : ''} safe-bottom`}>
      <div className="bottom-nav__inner">
        <NavLink to={TABS[0].to} end className="nav-item">
          <Icon name={TABS[0].icon} size={23} />
          <span>{TABS[0].label}</span>
        </NavLink>
        <NavLink to={TABS[1].to} className="nav-item">
          <Icon name={TABS[1].icon} size={23} />
          <span>{TABS[1].label}</span>
        </NavLink>

        {/* Center booking button */}
        <button className="nav-fab" onClick={() => navigate('/booking')} aria-label="Book">
          <Icon name="plus" size={26} color="#241a0d" />
        </button>

        <NavLink to={TABS[2].to} className="nav-item">
          <Icon name={TABS[2].icon} size={23} />
          <span>{TABS[2].label}</span>
        </NavLink>
        <NavLink to={TABS[3].to} className="nav-item">
          <Icon name={TABS[3].icon} size={23} />
          <span>{TABS[3].label}</span>
        </NavLink>
      </div>
    </nav>
  )
}
