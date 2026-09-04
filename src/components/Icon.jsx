/**
 * A single lightweight SVG icon component. All icons share one stroke style
 * so the UI stays visually consistent. Add new glyphs to the PATHS map.
 */
const PATHS = {
  home: <path d="M3 10.5 12 3l9 7.5M5 9.5V20h5v-6h4v6h5V9.5" />,
  compass: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="m15.5 8.5-2 5-5 2 2-5z" />
    </>
  ),
  film: (
    <>
      <rect x="3" y="4" width="18" height="16" rx="2.5" />
      <path d="M3 9h18M3 15h18M8 4v16M16 4v16" />
    </>
  ),
  user: (
    <>
      <circle cx="12" cy="8" r="4" />
      <path d="M4 20c1.5-4 4.5-6 8-6s6.5 2 8 6" />
    </>
  ),
  plus: <path d="M12 5v14M5 12h14" />,
  bell: <path d="M6 9a6 6 0 0 1 12 0c0 5 2 6 2 6H4s2-1 2-6M9.5 19a2.5 2.5 0 0 0 5 0" />,
  search: (
    <>
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-3.5-3.5" />
    </>
  ),
  filter: <path d="M3 5h18M6 12h12M10 19h4" />,
  chevronRight: <path d="m9 5 7 7-7 7" />,
  chevronLeft: <path d="m15 5-7 7 7 7" />,
  chevronDown: <path d="m5 9 7 7 7-7" />,
  arrowLeft: <path d="M20 12H4M10 6l-6 6 6 6" />,
  star: <path d="m12 3 2.7 5.9 6.3.7-4.7 4.3 1.3 6.4L12 17.8 6.1 20.3l1.3-6.4L2.7 9.6l6.3-.7z" />,
  heart: <path d="M12 20s-7-4.4-9.3-8.7C1 8 2.6 4.8 6 4.8c2 0 3.2 1.2 4 2.4.8-1.2 2-2.4 4-2.4 3.4 0 5 3.2 3.3 6.5C19 15.6 12 20 12 20z" />,
  location: (
    <>
      <path d="M12 21s7-6.2 7-11a7 7 0 1 0-14 0c0 4.8 7 11 7 11z" />
      <circle cx="12" cy="10" r="2.6" />
    </>
  ),
  calendar: (
    <>
      <rect x="3" y="5" width="18" height="16" rx="2.5" />
      <path d="M3 10h18M8 3v4M16 3v4" />
    </>
  ),
  guests: (
    <>
      <circle cx="9" cy="8" r="3.2" />
      <path d="M3.5 20c.8-3.2 3-5 5.5-5s4.7 1.8 5.5 5" />
      <path d="M16 5.2A3.2 3.2 0 0 1 18 11M17.5 15c2 .4 3.6 2 4 5" />
    </>
  ),
  wifi: <path d="M2.5 9a15 15 0 0 1 19 0M5.5 12.5a10 10 0 0 1 13 0M8.5 16a5 5 0 0 1 7 0M12 19.5h.01" />,
  bag: (
    <>
      <path d="M6 8h12l1 12H5z" />
      <path d="M9 8a3 3 0 0 1 6 0" />
    </>
  ),
  clock: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </>
  ),
  phone: <path d="M6 3h3l2 5-2.5 1.5a11 11 0 0 0 5 5L16 12l5 2v3a2 2 0 0 1-2 2A16 16 0 0 1 4 5a2 2 0 0 1 2-2z" />,
  check: <path d="m5 12 5 5 9-11" />,
  checkCircle: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="m8 12 3 3 5-6" />
    </>
  ),
  close: <path d="M6 6l12 12M18 6 6 18" />,
  menu: <path d="M4 7h16M4 12h16M4 17h16" />,
  sparkle: <path d="M12 3v6M12 15v6M3 12h6M15 12h6M6 6l3 3M15 15l3 3M18 6l-3 3M9 15l-3 3" />,
  heart_fill: <path d="M12 20s-7-4.4-9.3-8.7C1 8 2.6 4.8 6 4.8c2 0 3.2 1.2 4 2.4.8-1.2 2-2.4 4-2.4 3.4 0 5 3.2 3.3 6.5C19 15.6 12 20 12 20z" fill="currentColor" stroke="none" />,
  comment: <path d="M4 5h16v11H9l-4 3v-3H4z" />,
  share: <path d="M4 12v7a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-7M12 3v13M8 7l4-4 4 4" />,
  music: (
    <>
      <path d="M9 18V5l10-2v13" />
      <circle cx="6.5" cy="18" r="2.5" />
      <circle cx="16.5" cy="16" r="2.5" />
    </>
  ),
  bed: <path d="M3 8v11M3 13h18v6M21 19v-4a3 3 0 0 0-3-3H9v-1a2 2 0 0 1 2-2h1M7 12a2 2 0 1 0 0-.01" />,
  door: (
    <>
      <path d="M6 21V4a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v17M4 21h16" />
      <path d="M14 12h.01" />
    </>
  ),
  fork: <path d="M6 3v6a2 2 0 0 0 4 0V3M8 3v18M18 3c-1.5 0-2.5 2-2.5 5s1 4 2.5 4v9" />,
  spa: <path d="M12 3c3 3 3 7 0 10-3-3-3-7 0-10zM12 13c0 3 2 5 5 5M12 13c0 3-2 5-5 5M12 13v8" />,
  dumbbell: <path d="M4 9v6M7 7v10M17 7v10M20 9v6M7 12h10" />,
  pool: <path d="M3 18c1.5 1 3 1 4.5 0s3-1 4.5 0 3 1 4.5 0 3-1 4.5 0M4 14V6a2 2 0 0 1 4 0v8M16 14V6a2 2 0 0 1 4 0v8M8 8h8M8 12h8" />,
  car: <path d="M5 11l1.5-4h11L19 11M4 16h16v-4a1 1 0 0 0-1-1H5a1 1 0 0 0-1 1zM7 16v2M17 16v2M7.5 13.5h.01M16.5 13.5h.01" />,
  glass: <path d="M6 3h12l-1 8a5 5 0 0 1-10 0zM12 16v4M8 20h8" />,
  logout: <path d="M14 4h4a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2h-4M10 12H3M6 8l-3 4 3 4" />,
  edit: <path d="M4 20h4L19 9l-4-4L4 16zM14 6l4 4" />,
  chef: <path d="M7 21h10M7 21v-6M17 21v-6M6 15h12v-2a4 4 0 0 0-1.5-7.8A4 4 0 0 0 9 4a4 4 0 0 0-3 9z" />,
  concierge: <path d="M12 3a7 7 0 0 1 7 7v1H5v-1a7 7 0 0 1 7-7zM3 13h18M12 11v-1M8 21l1-4M16 21l-1-4" />,
}

export default function Icon({ name, size = 22, color = 'currentColor', strokeWidth = 1.7, className = '', style }) {
  const glyph = PATHS[name]
  if (!glyph) return null
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      style={style}
      aria-hidden="true"
    >
      {glyph}
    </svg>
  )
}
