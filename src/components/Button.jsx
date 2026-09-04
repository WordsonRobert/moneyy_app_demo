import './Button.css'
import Icon from './Icon.jsx'

/**
 * Primary button. variant: "solid" | "ghost" | "outline". size: "md" | "lg" | "sm".
 */
export default function Button({
  children,
  variant = 'solid',
  size = 'md',
  full,
  icon,
  iconRight,
  disabled,
  className = '',
  ...rest
}) {
  return (
    <button
      className={`btn btn--${variant} btn--${size} ${full ? 'btn--full' : ''} ${className}`}
      disabled={disabled}
      {...rest}
    >
      {icon && <Icon name={icon} size={18} />}
      <span>{children}</span>
      {iconRight && <Icon name={iconRight} size={18} />}
    </button>
  )
}
