import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Icon from '../../components/Icon.jsx'

function fmt(n) {
  return n >= 1000 ? (n / 1000).toFixed(1).replace('.0', '') + 'k' : String(n)
}

/**
 * A single full-screen reel. Video reels autoplay (muted) when in view and
 * pause when scrolled away; if a clip fails to load we fall back to its poster
 * image with a slow Ken-Burns pan so the ad always looks alive.
 */
export default function ReelItem({ reel, active }) {
  const navigate = useNavigate()
  const videoRef = useRef(null)
  const [videoOk, setVideoOk] = useState(reel.type === 'video')
  const [paused, setPaused] = useState(false)
  const [liked, setLiked] = useState(false)
  const [burst, setBurst] = useState(false)

  const isVideo = reel.type === 'video' && videoOk

  useEffect(() => {
    const v = videoRef.current
    if (!v || !isVideo) return
    if (active && !paused) {
      v.play().catch(() => {})
    } else {
      v.pause()
    }
  }, [active, paused, isVideo])

  function togglePlay() {
    if (!isVideo) return
    setPaused((p) => !p)
  }

  function doubleLike() {
    if (!liked) setLiked(true)
    setBurst(true)
    setTimeout(() => setBurst(false), 700)
  }

  const likeCount = reel.likes + (liked ? 1 : 0)

  return (
    <section className="reel">
      {/* Media */}
      <div className="reel__media" onClick={togglePlay} onDoubleClick={doubleLike}>
        {isVideo ? (
          <video
            ref={videoRef}
            className="reel__video"
            src={reel.src}
            poster={reel.poster}
            muted
            loop
            playsInline
            preload="metadata"
            onError={() => setVideoOk(false)}
          />
        ) : (
          <div
            className={`reel__image ${active ? 'reel__image--active' : ''}`}
            style={{ backgroundImage: `url(${reel.poster || reel.src})` }}
          />
        )}
        <div className="reel__scrim" />
        {isVideo && paused && (
          <div className="reel__playicon">
            <Icon name="film" size={30} color="#fff" />
          </div>
        )}
        {burst && <div className="reel__burst"><Icon name="heart_fill" size={90} color="#fff" /></div>}
      </div>

      {/* Right action rail */}
      <div className="reel__rail">
        <button className={`reel__act ${liked ? 'is-liked' : ''}`} onClick={() => setLiked((l) => !l)}>
          <Icon name={liked ? 'heart_fill' : 'heart'} size={28} color={liked ? 'var(--gold)' : '#fff'} />
          <span>{fmt(likeCount)}</span>
        </button>
        <button className="reel__act">
          <Icon name="comment" size={27} color="#fff" />
          <span>{fmt(reel.comments)}</span>
        </button>
        <button className="reel__act">
          <Icon name="share" size={26} color="#fff" />
          <span>Share</span>
        </button>
        <div className="reel__disc" style={{ backgroundImage: `url(${reel.poster || reel.src})` }} />
      </div>

      {/* Bottom caption */}
      <div className="reel__foot">
        <div className="reel__handle">
          <div className="reel__avatar"><Icon name="sparkle" size={14} color="#241a0d" /></div>
          <strong>@{reel.handle}</strong>
          <span className="reel__tag">{reel.tag}</span>
        </div>
        <h3 className="reel__headline">{reel.headline}</h3>
        <p className="reel__caption">{reel.caption}</p>
        <div className="reel__music">
          <Icon name="music" size={14} color="#fff" />
          <span>{reel.music}</span>
        </div>
        {reel.cta && (
          <button className="reel__cta" onClick={() => navigate(reel.cta.to)}>
            {reel.cta.label}
            <Icon name="chevronRight" size={16} color="#241a0d" />
          </button>
        )}
      </div>
    </section>
  )
}
