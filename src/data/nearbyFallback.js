import { img } from '../utils/img.js'
/**
 * Curated "things to do nearby" used when no Google Maps key is configured, or
 * if the Places request fails. Distances are illustrative. When a real key is
 * present, live Places results replace this list.
 */
export const nearbyFallback = [
  { id: 'n1', name: 'Riverside Boardwalk', category: 'Walk', rating: 4.7, distance: '400 m', image: img('photo-1519677100203-a0e668c92439.jpg'), mapsQuery: 'riverside boardwalk near me' },
  { id: 'n2', name: 'The Vault Cocktail Bar', category: 'Nightlife', rating: 4.8, distance: '650 m', image: img('photo-1514362545857-3bc16c4c7d1b.jpg'), mapsQuery: 'cocktail bar near me' },
  { id: 'n3', name: 'Old Town Market', category: 'Market', rating: 4.6, distance: '900 m', image: img('photo-1488459716781-31db52582fe9.jpg'), mapsQuery: 'street food market near me' },
  { id: 'n4', name: 'Lantern Art Gallery', category: 'Culture', rating: 4.5, distance: '1.1 km', image: img('photo-1518998053901-5348d3961a04.jpg'), mapsQuery: 'art gallery near me' },
  { id: 'n5', name: 'Grove Coffee Roasters', category: 'Cafe', rating: 4.9, distance: '300 m', image: img('photo-1445116572660-236099ec97a0.jpg'), mapsQuery: 'coffee roasters near me' },
  { id: 'n6', name: 'Harbour Viewpoint', category: 'View', rating: 4.7, distance: '1.4 km', image: img('photo-1502920917128-1aa500764cbd.jpg'), mapsQuery: 'scenic viewpoint near me' },
]

export const nearbyCategories = ['All', 'Nightlife', 'Cafe', 'Culture', 'Walk', 'Market', 'View']

export default nearbyFallback
