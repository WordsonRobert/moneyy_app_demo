/**
 * Reels — the hotel's own advertisements, shown Instagram-style.
 *
 * Each reel supports either a looping video (`type: 'video'`) or an image with a
 * slow Ken-Burns pan (`type: 'image'`). Videos use small, freely-hosted sample
 * clips; if a clip fails to load the component falls back to the poster image,
 * so the reel always shows something.
 *
 * `cta` links a reel to a real action inside the app (book a room, order, etc.).
 */

export const reels = [
  {
    id: 'r1',
    type: 'video',
    src: 'https://cdn.coverr.co/videos/coverr-pouring-a-cocktail-4881/1080p.mp4',
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
    type: 'image',
    src: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800&q=80',
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
    src: 'https://cdn.coverr.co/videos/coverr-a-chef-cooking-in-a-restaurant-3163/1080p.mp4',
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
    type: 'image',
    src: 'https://images.unsplash.com/photo-1533104816931-20fa691ff6ca?w=800&q=80',
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
    type: 'image',
    src: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&q=80',
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
