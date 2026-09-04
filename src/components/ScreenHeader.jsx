import { useNavigate } from 'react-router-dom'
import Icon from './Icon.jsx'
import './ScreenHeader.css'

/** Reusable inner-page header with a back button, title and optional right slot. */
export default function ScreenHeader({ title, subtitle, right, onBack, transparent }) {
  const navigate = useNavigate()
  return (
    <header className={`screen-header ${transparent ? 'screen-header--t' : ''}`}>
      <button className="screen-header__back" onClick={onBack || (() => navigate(-1))} aria-label="Back">
        <Icon name="arrowLeft" size={20} />
      </button>
      <div className="screen-header__titles">
        <h3>{title}</h3>
        {subtitle && <span>{subtitle}</span>}
      </div>
      <div className="screen-header__right">{right}</div>
    </header>
  )
}
