import Icon from './Icon.jsx'

export default function RatingStars({ value = 0, count, size = 13 }) {
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, color: 'var(--gold)', fontSize: size, fontWeight: 600 }}>
      <Icon name="star" size={size} color="var(--gold)" strokeWidth={0} style={{ fill: 'var(--gold)' }} />
      {value.toFixed(1)}
      {count != null && <span style={{ color: 'var(--text-faint)', fontWeight: 500 }}>({count})</span>}
    </span>
  )
}
