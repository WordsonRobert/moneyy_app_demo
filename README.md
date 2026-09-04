# Life Moments — The Ember House

A clickable **prototype** for a boutique hotel & pub, built as a modern
mobile-first web app. It brings together everything a guest's night needs in one
place: discovering things to do nearby, booking a room from an interactive floor
plan, ordering room service, reserving a table, and scrolling the hotel's own
Instagram-style **reels** — all behind a phone-number sign-in.

Built with **React + Vite**. Dark, warm-luxe theme. Fully modular.

---

## Quick start

```bash
npm install
npm run dev      # open the printed http://localhost:5173 on your phone or browser
```

Build for production:

```bash
npm run build
npm run preview
```

> Tip: it's designed phone-first. On desktop it renders as a centered phone
> column — resize the window narrow, or use your browser's device toolbar.

### Signing in (prototype auth)
Enter any phone number → tap **Send code**. This is a prototype, so **no real
SMS is sent** — the demo code is shown on screen. You can also always use
`1234`. Your profile is saved in the browser so you stay signed in.

---

## Features

| Area | What it does |
|------|--------------|
| **Phone sign-in** | Country code + number → OTP verification → profile. Persists locally. |
| **Home** | Greeting, quick-book actions, featured "moments", tonight's happenings, and a nearby preview. |
| **Nearby (Explore)** | Detects your location and shows nice things to do around you, each deep-linking to Google Maps. |
| **Rooms** | Room types with photos, facilities and prices + an **interactive SVG floor plan** you tap to book. |
| **Room service** | Full menu with dish descriptions, prices, prep times, service windows and who to order from — plus a cart & checkout. |
| **Book a table** | Date, time, party size and seating area (pub / fireside / rooftop). |
| **Reels** | Vertical, swipeable, Instagram-style feed of the hotel's own ads, each with a call-to-action into the app. |
| **Bookings** | Every room, table and room-service order in one list, with cancel. |
| **Profile** | Editable profile, saved rooms, stats, sign out. |

---

## Location & Google Maps

The **Nearby** screen finds the guest's location (browser GPS → IP lookup →
sensible default) and lists things to do around them.

- **Out of the box** it works with a curated list — no key needed.
- **With a Google Maps key** it shows live places from the Places API.

To enable live places:

1. Copy `.env.example` to `.env`
2. Add your key: `VITE_GOOGLE_MAPS_API_KEY=your_key_here`
   (enable **Maps JavaScript API** + **Places API** in Google Cloud)
3. Restart `npm run dev`

Every place card also deep-links to a Google Maps search near the guest.

---

## Project structure

Everything is modular — data, services, state and UI are cleanly separated, so
each feature can be edited, replaced or extended on its own.

```
src/
├── main.jsx                 App entry — wraps providers & router
├── App.jsx                  Routes + the tabbed layout
├── components/              Reusable UI (Button, Sheet, Icon, BottomNav, …)
├── context/                 Global state
│   ├── AuthContext.jsx        phone/OTP sign-in + profile
│   ├── BookingContext.jsx     bookings, favorites, room-service cart
│   └── ToastContext.jsx       transient confirmations
├── services/                Side-effects & integrations
│   ├── authService.js         OTP send/verify (prototype)
│   ├── geolocationService.js  GPS → IP → default location
│   └── mapsService.js         Google Places + Maps deep links
├── hooks/
│   └── useNearby.js           location + places, with graceful fallback
├── data/                    All content (swap freely)
│   ├── property.js  rooms.js  menu.js  reels.js
│   ├── facilities.js  experiences.js  nearbyFallback.js
├── features/                One folder per screen
│   ├── auth/  home/  explore/  rooms/  roomservice/
│   ├── reels/  booking/  bookings/  profile/
└── styles/                  Theme tokens + global CSS
```

### Where to change things
- **Rooms & floor plan** → `src/data/rooms.js` (room types + per-floor unit layout)
- **Room-service menu, timings, who to order from** → `src/data/menu.js`
- **Reels (the hotel's ads)** → `src/data/reels.js`
- **Facilities** → `src/data/facilities.js`
- **Colors / fonts / spacing** → `src/styles/theme.js` and `src/styles/global.css`

---

## What's real vs. prototype

This is a **design/clickable prototype**, in line with the Life Moments brief.
Deliberately mocked (no production backend): SMS/OTP delivery, payments,
real-time room inventory, and supplier integrations. Bookings, favorites and the
cart persist in the browser (localStorage) so the flows feel complete. Swapping
these services for real APIs is isolated to the `services/` folder.

---

_Life Moments · The Ember House · prototype v0.1_
