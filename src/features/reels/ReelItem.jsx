import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Icon from '../../components/Icon.jsx'
import Sheet from '../../components/Sheet.jsx'
import { useAuth } from '../../context/AuthContext.jsx'
import { useToast } from '../../context/ToastContext.jsx'
import { watchLikes, setLike, watchComments, addComment } from '../../services/socialService.js'

function fmt(n) {
  return n >= 1000 ? (n / 1000).toFixed(1).replace('.0', '') + 'k' : String(n)
}

function timeAgo(ts) {
  const s = Math.max(1, Math.floor((Date.now() - ts) / 1000))
  if (s < 60) return `${s}s`
  const m = Math.floor(s / 60)
  if (m < 60) return `${m}m`
  const h = Math.floor(m / 60)
  if (h < 24) return `${h}h`
  return `${Math.floor(h / 24)}d`
}

/**
 * A single full-screen reel. Video reels autoplay (muted) when in view and
 * pause when scrolled away; if a clip fails to load we fall back to its poster
 * image with a slow Ken-Burns pan so the ad always looks alive.
 *
 * Likes and comments are backed by socialService — real & shared with Firebase,
 * per-browser without it — so the numbers actually move.
 */
export default function ReelItem({ reel, active }) {
  const navigate = useNavigate()
  const { user } = useAuth()
  const toast = useToast()
  const videoRef = useRef(null)
  const [videoOk, setVideoOk] = useState(reel.type === 'video')
  const [paused, setPaused] = useState(false)
  const [burst, setBurst] = useState(false)

  const [like, setLikeState] = useState({ count: 0, liked: false })
  const [comments, setComments] = useState([])
  const [commentsOpen, setCommentsOpen] = useState(false)
  const [draft, setDraft] = useState('')
  const [posting, setPosting] = useState(false)

  const isVideo = reel.type === 'video' && videoOk
  const uid = user?.id

  // Live likes + comments for this reel.
  useEffect(() => watchLikes(reel.id, uid, setLikeState), [reel.id, uid])
  useEffect(() => watchComments(reel.id, setComments), [reel.id])

  useEffect(() => {
    const v = videoRef.current
    if (!v || !isVideo) return
    if (active && !paused) v.play().catch(() => {})
    else v.pause()
  }, [active, paused, isVideo])

  function togglePlay() {
    if (!isVideo) return
    setPaused((p) => !p)
  }

  function toggleLike() {
    setLike(reel.id, uid, !like.liked)
  }

  function doubleLike() {
    if (!like.liked) setLike(reel.id, uid, true)
    setBurst(true)
    setTimeout(() => setBurst(false), 700)
  }

  async function postComment() {
    const text = draft.trim()
    if (!text || posting) return
    setPosting(true)
    try {
      await addComment(reel.id, { uid, name: user?.name || 'Guest', text })
      setDraft('')
    } catch {
      toast('Couldn’t post that comment. Try again.', { icon: 'close' })
    } finally {
      setPosting(false)
    }
  }

  // Seed numbers give the ad presence; real interactions add on top.
  const likeCount = reel.likes + like.count
  const commentCount = reel.comments + comments.length

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
        <button className={`reel__act ${like.liked ? 'is-liked' : ''}`} onClick={toggleLike}>
          <Icon name={like.liked ? 'heart_fill' : 'heart'} size={28} color={like.liked ? 'var(--gold)' : '#fff'} />
          <span>{fmt(likeCount)}</span>
        </button>
        <button className="reel__act" onClick={() => setCommentsOpen(true)}>
          <Icon name="comment" size={27} color="#fff" />
          <span>{fmt(commentCount)}</span>
        </button>
        <button
          className="reel__act"
          onClick={() => {
            const url = window.location.origin + import.meta.env.BASE_URL + 'reels'
            if (navigator.share) navigator.share({ title: reel.headline, url }).catch(() => {})
            else {
              navigator.clipboard?.writeText(url)
              toast('Link copied')
            }
          }}
        >
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

      {/* Comments */}
      <Sheet open={commentsOpen} onClose={() => setCommentsOpen(false)} title={`Comments · ${fmt(commentCount)}`}>
        <div className="reel-comments">
          {comments.length === 0 ? (
            <div className="reel-comments__empty">
              <Icon name="comment" size={30} color="var(--text-faint)" />
              <p>No comments yet. Be the first to say something.</p>
            </div>
          ) : (
            <ul className="reel-comments__list">
              {comments.map((c) => (
                <li key={c.id} className="reel-comment">
                  <div className="reel-comment__avatar">
                    {(c.name || 'G').trim().charAt(0).toUpperCase()}
                  </div>
                  <div className="reel-comment__body">
                    <p>
                      <strong>{c.name}</strong>
                      <span className="reel-comment__time">{timeAgo(c.createdAt)}</span>
                    </p>
                    <p className="reel-comment__text">{c.text}</p>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
        <div className="reel-comments__compose">
          <input
            className="reel-comments__input"
            placeholder="Add a comment…"
            value={draft}
            maxLength={500}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && postComment()}
          />
          <button
            className="reel-comments__send"
            onClick={postComment}
            disabled={!draft.trim() || posting}
            aria-label="Post comment"
          >
            <Icon name="chevronRight" size={20} color="#241a0d" />
          </button>
        </div>
      </Sheet>
    </section>
  )
}
