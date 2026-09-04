import { Outlet, useLocation } from 'react-router-dom'
import BottomNav from './BottomNav.jsx'

/**
 * The tabbed app frame: a scrollable content area with a persistent bottom nav.
 * The Reels screen is immersive, so the nav floats over it (handled in CSS).
 */
export default function AppLayout() {
  const { pathname } = useLocation()
  const immersive = pathname === '/reels'

  return (
    <>
      <div className={`app-scroll ${immersive ? 'app-scroll--immersive' : ''}`}>
        <Outlet />
      </div>
      <BottomNav immersive={immersive} />
    </>
  )
}
