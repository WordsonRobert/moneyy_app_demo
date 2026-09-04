/**
 * Central design tokens for Life Moments.
 * Everything visual references these so the whole app can be re-skinned from one place.
 */
export const theme = {
  brand: {
    name: 'Life Moments',
    property: 'The Ember House',
    tagline: 'Boutique hotel & pub',
  },
  color: {
    bg: '#0f0d0b',
    bgElevated: '#191512',
    surface: '#1f1a16',
    surfaceHi: '#2a231d',
    line: '#332b23',
    gold: '#e0b978',
    goldSoft: '#c99a5b',
    text: '#f4efe8',
    textDim: '#b8ab9b',
    textFaint: '#7d7264',
    danger: '#e0736b',
    success: '#8fbf82',
  },
  radius: { sm: '10px', md: '16px', lg: '22px', xl: '30px', pill: '999px' },
  font: {
    display: "'Fraunces', Georgia, serif",
    body: "'Inter', system-ui, -apple-system, sans-serif",
  },
}

export default theme
