/**
 * Curated "things to do nearby" used when no Google Maps key is configured, or
 * if the Places request fails. Distances are illustrative. When a real key is
 * present, live Places results replace this list.
 */
export const nearbyFallback = [
  { id: 'n1', name: 'Riverside Boardwalk', category: 'Walk', rating: 4.7, distance: '400 m', image: 'https://images.unsplash.com/photo-1519677100203-a0e668c92439?w=500&q=80', mapsQuery: 'riverside boardwalk near me' },
  { id: 'n2', name: 'The Vault Cocktail Bar', category: 'Nightlife', rating: 4.8, distance: '650 m', image: 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=500&q=80', mapsQuery: 'cocktail bar near me' },
  { id: 'n3', name: 'Old Town Market', category: 'Market', rating: 4.6, distance: '900 m', image: 'https://images.unsplash.com/photo-1488459716781-31db52582fe9?w=500&q=80', mapsQuery: 'street food market near me' },
  { id: 'n4', name: 'Lantern Art Gallery', category: 'Culture', rating: 4.5, distance: '1.1 km', image: 'https://images.unsplash.com/photo-1518998053901-5348d3961a04?w=500&q=80', mapsQuery: 'art gallery near me' },
  { id: 'n5', name: 'Grove Coffee Roasters', category: 'Cafe', rating: 4.9, distance: '300 m', image: 'https://images.unsplash.com/photo-1445116572660-236099ec97a0?w=500&q=80', mapsQuery: 'coffee roasters near me' },
  { id: 'n6', name: 'Harbour Viewpoint', category: 'View', rating: 4.7, distance: '1.4 km', image: 'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=500&q=80', mapsQuery: 'scenic viewpoint near me' },
]

export const nearbyCategories = ['All', 'Nightlife', 'Cafe', 'Culture', 'Walk', 'Market', 'View']

export default nearbyFallback
