import { useEffect, useRef, useState } from 'react'
import { reels } from '../../data/reels.js'
import ReelItem from './ReelItem.jsx'
import './reels.css'

/**
 * Vertical, snap-scrolling reels feed of the hotel's own ads.
 * Tracks which reel is centered so only that one plays.
 */
export default function ReelsScreen() {
  const containerRef = useRef(null)
  const [activeIdx, setActiveIdx] = useState(0)

  useEffect(() => {
    const root = containerRef.current
    if (!root) return
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting && e.intersectionRatio > 0.6) {
            const idx = Number(e.target.dataset.idx)
            setActiveIdx(idx)
          }
        })
      },
      { root, threshold: [0.6] },
    )
    root.querySelectorAll('.reel-wrap').forEach((el) => obs.observe(el))
    return () => obs.disconnect()
  }, [])

  return (
    <div className="reels" ref={containerRef}>
      <div className="reels__top">
        <h2>Reels</h2>
        <span className="reels__sub">@theemberhouse</span>
      </div>

      <div className="reels__progress">
        {reels.map((_, i) => (
          <span key={i} className={i === activeIdx ? 'is-active' : ''} />
        ))}
      </div>

      {reels.map((reel, i) => (
        <div className="reel-wrap" data-idx={i} key={reel.id}>
          <ReelItem reel={reel} active={i === activeIdx} />
        </div>
      ))}
    </div>
  )
}
