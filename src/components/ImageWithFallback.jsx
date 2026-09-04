import { useState } from 'react'

/**
 * Image that fades in when loaded and shows a warm gradient placeholder while
 * loading or if the source fails — so the UI never shows a broken-image icon.
 */
export default function ImageWithFallback({ src, alt = '', className = '', style, ratio }) {
  const [loaded, setLoaded] = useState(false)
  const [failed, setFailed] = useState(false)

  const wrapStyle = {
    position: 'relative',
    overflow: 'hidden',
    background: 'linear-gradient(135deg, #2a231d, #14100d)',
    ...(ratio ? { aspectRatio: ratio } : {}),
    ...style,
  }

  return (
    <div className={className} style={wrapStyle}>
      {!failed && (
        <img
          src={src}
          alt={alt}
          loading="lazy"
          onLoad={() => setLoaded(true)}
          onError={() => setFailed(true)}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            opacity: loaded ? 1 : 0,
            transition: 'opacity 0.5s ease',
          }}
        />
      )}
      {failed && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--text-faint)',
            fontFamily: 'var(--font-display)',
            fontSize: 13,
          }}
        >
          {alt || 'Life Moments'}
        </div>
      )}
    </div>
  )
}
