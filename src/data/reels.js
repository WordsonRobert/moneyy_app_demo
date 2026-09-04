/**
 * Reels — the hotel's own advertisements, shown Instagram-style.
 *
 * DEMO VIDEOS LIVE IN THE REPO: drop your clips into `public/reels/` as
 * reel-1.mp4 … reel-5.mp4 (see public/reels/README.md). They're referenced with
 * BASE_URL so they work both locally and on GitHub Pages (which serves the app
 * under /<repo>/). Until a clip is added, each reel gracefully falls back to its
 * poster image with a slow Ken-Burns pan, so the feed always looks alive.
 *
 * `cta` links a reel to a real action inside the app (book a room, order, etc.).
 */

// Vite serves everything in public/ at BASE_URL; string URLs aren't rewritten
// automatically, so we build them here.
const clip = (file) => `${import.meta.env.BASE_URL}reels/${file}`

export const reels = [
  {
    id: 'r1',
    type: 'video',
    src: clip('reel-1.mp4'),
    poster: 'https://images.unsplash.com/photo-1470337458703-46ad1756a187?w=800&q=80',
    handle: 'theemberhouse',
    headline: 'The pub never really closes',
    caption: 'Late menu til 2am. Signature Old Fashioned, smoked to order. Pull up. 🥃',
    music: 'The Ember House · Original audio',
    likes: 4820,
    comments: 132,
    cta: { label: 'See the late menu', to: '/room-service' },
    tag: 'Pub Nights',
  },
  {
    id: 'r2',
    type: 'video',
    src: clip('reel-2.mp4'),
    poster: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800&q=80',
    handle: 'theemberhouse',
    headline: 'Wake up in the Lantern King',
    caption: 'Courtyard light, a soaking tub, and breakfast to the door. Book direct, skip the fees.',
    music: 'Sunday Mornings · lofi',
    likes: 6910,
    comments: 208,
    cta: { label: 'Book this room', to: '/rooms' },
    tag: 'Rooms',
  },
  {
    id: 'r3',
    type: 'video',
    src: clip('reel-3.mp4'),
    poster: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&q=80',
    handle: 'theemberhouse',
    headline: 'Dry-aged, flame-kissed',
    caption: 'The Ember Burger, straight to your room in 25. This is the one everyone films. 🔥',
    music: 'Kitchen Sessions · Original audio',
    likes: 9240,
    comments: 415,
    cta: { label: 'Order to my room', to: '/room-service' },
    tag: 'Kitchen',
  },
  {
    id: 'r4',
    type: 'video',
    src: clip('reel-4.mp4'),
    poster: 'https://images.unsplash.com/photo-1533104816931-20fa691ff6ca?w=800&q=80',
    handle: 'theemberhouse',
    headline: 'Rooftop hours',
    caption: 'Pool deck, golden hour, a spritz in hand. Loft Suite guests get first access. 🌅',
    music: 'Rooftop Set · house',
    likes: 7530,
    comments: 189,
    cta: { label: 'See the Loft Suite', to: '/rooms' },
    tag: 'Rooftop',
  },
  {
    id: 'r5',
    type: 'video',
    src: clip('reel-5.mp4'),
    poster: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&q=80',
    handle: 'theemberhouse',
    headline: 'Book a table by the fire',
    caption: 'Friday jazz, low light, a full pour. Reserve a spot before the weekend goes. 🎷',
    music: 'Friday Jazz · live',
    likes: 3410,
    comments: 97,
    cta: { label: 'Reserve a table', to: '/booking' },
    tag: 'Events',
  },
]

export default reels
