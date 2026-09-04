# Life Moments — The Ember House

A modern, mobile-first web app for a boutique hotel & pub. It brings everything a
guest's night needs into one place: discovering things to do nearby, booking a
room from an interactive floor plan, ordering room service, reserving a table,
and scrolling the hotel's own Instagram-style **reels** — all behind a
**real phone-number sign-in**.

Built with **React + Vite**. Dark, warm-luxe theme. Fully modular. Every photo
ships in the repo (`public/images/`) — no third-party image CDN at runtime, so
the whole app works offline once it's built.

It runs two ways:

- **Demo mode (zero setup)** — `npm install && npm run dev` and everything is
  clickable. OTP shows an on-screen code, likes & comments live in your browser.
- **Live mode** — add a Firebase project and it flips on **real SMS OTP** (great
  with Indian +91 numbers) and **real, shared likes & comments** that add up
  across everyone. Nearby already gets **free, live** places via OpenStreetMap
  — no key needed for that at all.

Nothing about the code changes between the two — it detects what's configured
and lights up automatically.

---

## Quick start

```bash
npm install
npm run dev      # open the printed http://localhost:5173
```

Build for production:

```bash
npm run build
npm run preview
```

> It's phone-first. On desktop it renders as a centered phone column — use your
> browser's device toolbar for the full effect.

---

## Features

| Area | What it does |
|------|--------------|
| **Phone sign-in** | Real Firebase OTP (defaults to 🇮🇳 +91). Falls back to an on-screen demo code with no setup. |
| **Home** | Greeting, quick-book actions, featured "moments", tonight's happenings, nearby preview. |
| **Nearby** | Detects location and shows nice things to do around you, each deep-linking to Google Maps. |
| **Rooms** | Room types with photos, facilities & prices + an **interactive SVG floor plan** you tap to book. |
| **Room service** | Full menu — dish descriptions, prices, prep times, service windows, who to order from — plus a cart & checkout. |
| **Book a table** | Date, time, party size and seating area (pub / fireside / rooftop). |
| **Reels** | Vertical, swipeable, Instagram-style feed of the hotel's own ads. **Likes & comments are real.** |
| **Bookings** | Every room, table and room-service order in one list, with cancel. |
| **Profile** | Editable profile, saved rooms, stats, sign out. |

---

## Turning on the real features

### 1) Firebase — real OTP + real likes & comments

1. Create a project at **https://console.firebase.google.com**.
2. **Authentication → Sign-in method → Phone → Enable.**
   - Add your GitHub Pages domain (`your-name.github.io`) and `localhost` under
     **Authentication → Settings → Authorized domains**.
   - To test without spending SMS, add a **test phone number** under Phone →
     *Phone numbers for testing* (e.g. `+91 98765 43210` → code `123456`).
3. **Firestore Database → Create database** (production mode is fine), then paste
   the rules from [`firestore.rules`](firestore.rules) into **Rules → Publish**.
4. **Project settings → Your apps → Web app** → copy the config values.
5. Copy `.env.example` to `.env` and fill in the `VITE_FIREBASE_*` values.
6. Restart `npm run dev`. The sign-in now sends a real 6-digit SMS, and reel
   likes/comments are stored in Firestore and shared across every visitor.

> Firebase's free **Spark** plan includes a limited daily SMS quota — plenty for
> a prototype. The web config values are *not* secrets; they're meant to ship in
> the browser. Access is protected by the Firestore rules + authorized domains.

### 2) Nearby places — free by default, no key needed

Nearby tries three sources, in order:

1. **Google Places** — only if `VITE_GOOGLE_MAPS_API_KEY` is set. Richest data
   (photos, ratings), but requires a Google Cloud **Blaze** billing account.
2. **OpenStreetMap (Overpass API)** — used automatically otherwise. **Completely
   free, no key, no signup, no billing, ever.** Real live place data, just
   without photos/ratings (the UI hides those gracefully when absent).
3. **Curated fallback list** — if both live sources are unreachable.

Most people can just leave `VITE_GOOGLE_MAPS_API_KEY` blank forever and get real
live places via OpenStreetMap for free. Every place — from any source — still
deep-links to Google Maps to open (that's a plain URL, always free, no key
needed either).

### 3) Reel videos

Drop vertical `.mp4` clips into [`public/reels/`](public/reels/README.md) as
`reel-1.mp4 … reel-5.mp4`. Until then each reel shows its poster image with a
slow pan.

---

## Deploying to GitHub Pages (free, GitHub-only)

A workflow at [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml)
builds and publishes on every push to `main`.

1. Create a repo on GitHub and push this project (see below).
2. **Settings → Pages → Build and deployment → Source: GitHub Actions.**
3. **Settings → Secrets and variables → Actions → Variables** → add repository
   **Variables** (not secrets — they're public client config):
   `VITE_FIREBASE_API_KEY`, `VITE_FIREBASE_AUTH_DOMAIN`,
   `VITE_FIREBASE_PROJECT_ID`, `VITE_FIREBASE_STORAGE_BUCKET`,
   `VITE_FIREBASE_MESSAGING_SENDER_ID`, `VITE_FIREBASE_APP_ID`,
   and optionally `VITE_GOOGLE_MAPS_API_KEY`.
   - Skip these to deploy in demo mode.
4. Push. The Actions run publishes to `https://<user>.github.io/<repo>/`.
5. Add that `<user>.github.io` domain to Firebase **Authorized domains** so OTP
   works on the live site.

The build sets the correct base path (`/<repo>/`) automatically, and a
`404.html` fallback keeps client-side routing (deep links / refresh) working on
Pages.

### First push

```bash
git add -A
git commit -m "Real OTP, live likes & comments, GitHub Pages deploy"
git branch -M main
git remote add origin https://github.com/<user>/<repo>.git
git push -u origin main
```

---

## Project structure

Everything is modular — data, services, state and UI are cleanly separated.

```
src/
├── main.jsx                 App entry — providers & router (Pages base-aware)
├── App.jsx                  Routes + tabbed layout
├── components/              Reusable UI (Button, Sheet, Icon, BottomNav, …)
├── context/                 Global state
│   ├── AuthContext.jsx        Firebase/demo sign-in + profile
│   ├── BookingContext.jsx     bookings, favorites, room-service cart
│   └── ToastContext.jsx       transient confirmations
├── services/                Side-effects & integrations
│   ├── firebase.js            Firebase bootstrap (auto-detects config)
│   ├── authService.js         phone OTP (Firebase → demo fallback)
│   ├── socialService.js       reel likes & comments (Firestore → localStorage)
│   ├── geolocationService.js  GPS → IP → default location
│   └── mapsService.js         Google Places + Maps deep links
├── hooks/useNearby.js         location + places, with graceful fallback
├── data/                    All content (rooms, menu, reels, facilities, …)
├── features/                One folder per screen
└── styles/                  Theme tokens + global CSS
```

### Where to change things
- **Rooms & floor plan** → `src/data/rooms.js`
- **Room-service menu, timings, who to order from** → `src/data/menu.js`
- **Reels (the hotel's ads)** → `src/data/reels.js` (+ clips in `public/reels/`)
- **Facilities** → `src/data/facilities.js`
- **Colors / fonts / spacing** → `src/styles/theme.js`, `src/styles/global.css`

---

## What's real vs. prototype

**Real now:** phone-OTP sign-in, one-like-per-guest reel likes, live reel
comments, location + Google Maps deep links, and persisted bookings/favorites/
cart. **Still mocked:** payments, real-time room inventory, and supplier
integrations — each isolated to `services/` so swapping in real APIs is a
contained change.

---

_Life Moments · The Ember House_
