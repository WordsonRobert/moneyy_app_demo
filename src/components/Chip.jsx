import './Chip.css'

export default function Chip({ children, active, onClick, icon }) {
  return (
    <button className={`chip ${active ? 'chip--active' : ''}`} onClick={onClick}>
      {icon}
      {children}
    </button>
  )
}
