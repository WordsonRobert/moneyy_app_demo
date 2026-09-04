/**
 * Home-screen content: the quick-book categories and the featured "moments"
 * carousel. These map to real routes in the app.
 */

export const quickActions = [
  { id: 'rooms', label: 'Rooms', icon: 'bed', to: '/rooms' },
  { id: 'dining', label: 'Room Service', icon: 'fork', to: '/room-service' },
  { id: 'table', label: 'Book a Table', icon: 'glass', to: '/booking' },
  { id: 'explore', label: 'Nearby', icon: 'location', to: '/explore' },
  { id: 'reels', label: 'Reels', icon: 'film', to: '/reels' },
]

export const featuredMoments = [
  {
    id: 'f1',
    title: 'Stay the night',
    subtitle: 'Rooms from $129',
    image: 'https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=800&q=80',
    to: '/rooms',
    accent: 'Rooms',
  },
  {
    id: 'f2',
    title: 'Late kitchen',
    subtitle: 'To your door til 2am',
    image: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&q=80',
    to: '/room-service',
    accent: 'Dining',
  },
  {
    id: 'f3',
    title: 'Rooftop hours',
    subtitle: 'Pool deck & spritz',
    image: 'https://images.unsplash.com/photo-1533104816931-20fa691ff6ca?w=800&q=80',
    to: '/reels',
    accent: 'Rooftop',
  },
]

/** "Tonight at The Ember" — happening-now strip on the home screen. */
export const happenings = [
  { id: 'h1', title: 'Live jazz in the pub', time: 'Tonight · 9:00 PM', image: 'https://images.unsplash.com/photo-1415201364774-f6f0bb35f28f?w=500&q=80' },
  { id: 'h2', title: 'Bartender’s smoked flight', time: 'All week · from 7 PM', image: 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?w=500&q=80' },
  { id: 'h3', title: 'Rooftop sunset set', time: 'Fri–Sun · 6:30 PM', image: 'https://images.unsplash.com/photo-1533104816931-20fa691ff6ca?w=500&q=80' },
]

export default quickActions
