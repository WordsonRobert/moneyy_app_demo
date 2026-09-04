import { img } from '../utils/img.js'
/**
 * Room-service menu.
 *
 * `serviceWindows` describes when each part of the kitchen is open and who
 * fulfils the order (used on the Room Service screen so guests know exactly
 * when and from whom they can order). `menu` is the dish catalogue grouped by
 * category, each dish with a plain-language description, price and prep time.
 */

export const serviceWindows = [
  {
    id: 'all-day',
    label: 'All-Day Kitchen',
    hours: '7:00 AM – 11:00 PM',
    team: 'Main Kitchen',
    orderFrom: 'In-Room Dining desk · dial 3',
    icon: 'fork',
  },
  {
    id: 'late',
    label: 'Late Pub Menu',
    hours: '11:00 PM – 2:00 AM',
    team: 'Pub Line',
    orderFrom: 'Night Concierge · dial 0',
    icon: 'glass',
  },
  {
    id: 'breakfast',
    label: 'Breakfast',
    hours: '7:00 AM – 11:00 AM',
    team: 'Pastry & Grill',
    orderFrom: 'In-Room Dining desk · dial 3',
    icon: 'chef',
  },
]

export const menuCategories = [
  { id: 'breakfast', label: 'Breakfast', window: 'breakfast' },
  { id: 'smallplates', label: 'Small Plates', window: 'all-day' },
  { id: 'mains', label: 'Mains', window: 'all-day' },
  { id: 'pub', label: 'Late & Pub', window: 'late' },
  { id: 'sweets', label: 'Sweets', window: 'all-day' },
  { id: 'drinks', label: 'Drinks', window: 'late' },
]

const dish = (id, category, name, description, price, prep, opts = {}) => ({
  id,
  category,
  name,
  description,
  price,
  prep,
  tags: opts.tags || [],
  image: opts.image,
  popular: opts.popular || false,
})

export const menu = [
  // Breakfast
  dish('b1', 'breakfast', 'Ember Full Plate', 'Two eggs your way, cured bacon, roast tomato, field mushrooms, sourdough and house beans.', 18, '20 min', { tags: ['Hearty'], popular: true, image: img('photo-1533089860892-a7c6f0a88666.jpg') }),
  dish('b2', 'breakfast', 'Brioche French Toast', 'Thick-cut brioche, burnt-honey butter, mascarpone and seasonal berries.', 14, '15 min', { tags: ['Sweet'], image: img('photo-1484723091739-30a097e8f929.jpg') }),
  dish('b3', 'breakfast', 'Avocado & Poached Egg', 'Smashed avocado on toasted rye, two poached eggs, chilli, lime and dukkah.', 13, '15 min', { tags: ['Veg'], image: img('photo-1482049016688-2d3e1b311543.jpg') }),

  // Small plates
  dish('s1', 'smallplates', 'Truffle Fries', 'Skin-on fries, truffle oil, parmesan and confit garlic aioli.', 9, '12 min', { tags: ['Veg', 'Share'], popular: true, image: img('photo-1573080496219-bb080dd4f877.jpg') }),
  dish('s2', 'smallplates', 'Crispy Calamari', 'Lightly floured squid, smoked paprika salt, lemon and saffron aioli.', 12, '15 min', { image: img('photo-1599487488170-d11ec9c172f0.jpg') }),
  dish('s3', 'smallplates', 'Burrata & Peach', 'Whole burrata, grilled peach, basil oil, toasted hazelnut and sourdough crisps.', 14, '10 min', { tags: ['Veg'], image: img('photo-1608897013039-887f21d8c804.jpg') }),

  // Mains
  dish('m1', 'mains', 'Dry-Aged Ember Burger', 'Dry-aged beef, smoked cheddar, house pickles, burnt-onion mayo, brioche and fries.', 21, '25 min', { popular: true, image: img('photo-1568901346375-23c9450c58cd.jpg') }),
  dish('m2', 'mains', 'Pan-Roast Sea Bass', 'Sea bass fillet, brown-butter potatoes, charred greens and caper salsa.', 27, '30 min', { image: img('photo-1519708227418-c8fd9a32b7a2.jpg') }),
  dish('m3', 'mains', 'Wild Mushroom Risotto', 'Carnaroli rice, wild mushrooms, aged parmesan, truffle and crispy sage.', 19, '28 min', { tags: ['Veg'], image: img('photo-1476124369491-e7addf5db371.jpg') }),

  // Late & pub
  dish('p1', 'pub', 'Midnight Wings', 'Slow-cooked wings, ember glaze, blue-cheese dip and celery.', 13, '18 min', { popular: true, image: img('photo-1608039755401-742074f0548d.jpg') }),
  dish('p2', 'pub', 'Loaded Nachos', 'Corn chips, melted cheese, jalapeño, guacamole, sour cream and pico.', 12, '15 min', { tags: ['Share', 'Veg'], image: img('photo-1513456852971-30c0b8199d4d.jpg') }),
  dish('p3', 'pub', 'Toasted Club', 'Triple-stack club, roast chicken, bacon, egg, tomato and fries.', 15, '18 min', { image: img('photo-1567234669003-dce7a7a88821.jpg') }),

  // Sweets
  dish('d1', 'sweets', 'Sticky Toffee Pudding', 'Warm date sponge, toffee sauce and vanilla-bean ice cream.', 10, '12 min', { tags: ['Warm'], image: img('photo-1541599468348-e96984315921.jpg') }),
  dish('d2', 'sweets', 'Dark Chocolate Tart', 'Bitter chocolate ganache, sea salt, crème fraîche and cocoa nib.', 11, '10 min', { image: img('photo-1624353365286-3f8d62daad51.jpg') }),

  // Drinks
  dish('k1', 'drinks', 'Ember Old Fashioned', 'Bourbon, smoked maple, aromatic bitters and orange oil.', 14, '8 min', { tags: ['Signature'], popular: true, image: img('photo-1514362545857-3bc16c4c7d1b.jpg') }),
  dish('k2', 'drinks', 'Garden Spritz', 'Elderflower, prosecco, cucumber, mint and soda.', 12, '6 min', { image: img('photo-1536935338788-846bb9981813.jpg') }),
  dish('k3', 'drinks', 'Pot of Loose Tea', 'Choice of English breakfast, mint or chamomile, served in a cast-iron pot.', 5, '6 min', { tags: ['Non-alc'], image: img('photo-1544787219-7f47ccb76574.jpg') }),
]

export const dishById = Object.fromEntries(menu.map((d) => [d.id, d]))

export default menu
