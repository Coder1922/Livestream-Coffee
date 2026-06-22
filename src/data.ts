import { MenuItem, Experience, JourneyStep, Testimonial, GalleryItem, Feature } from './types';
import { MENU_IMAGES } from './data/menuImages';

export const CORE_EXPERIENCES: Experience[] = [
  {
    id: 'specialty',
    title: 'Specialty Coffee',
    description: 'Single-origin beans curated and prepared by certified baristas to unlock pristine flavor profiles.',
    items: ['V60 pour-over with citrus notes', 'Cortado with velvet texture', 'Classic double shot Espresso', 'Precision cold-dripped Pour Over'],
    image: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&q=80&w=600'
  },
  {
    id: 'frappes',
    title: 'Signature Frappes',
    description: 'Luxurious blended ice coffee elixirs made with slow-brewed espresso & premium dairy bases.',
    items: ['Roasted Hazelnut cream top', 'Double dark chocolate Mocha', 'Caramel butter drizzle Delight'],
    image: 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?auto=format&fit=crop&q=80&w=600'
  },
  {
    id: 'fresh-food',
    title: 'Fresh Food Pairing',
    description: 'Artisanal bites baked daily. Sweet pairings and gourmet light meals chosen to crown your beverage.',
    items: ['Toasted sourdough Paninis', 'New York style berry Cheesecakes', 'Warm croissant & savory favorites'],
    image: 'https://images.unsplash.com/photo-1533134242443-d4fd215305ad?auto=format&fit=crop&q=80&w=600'
  },
  {
    id: 'late-night',
    title: 'Late Night Culture',
    description: 'Surat’s premier sanctuary for creative professionals, soft beats, midnight drafts, and deep table conversations.',
    items: ['Open until midnight daily', 'Curated lo-fi and jazz ambient music', 'Cozy Radisson-insulated lounges', 'Vibrant community tables'],
    image: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&q=80&w=600'
  }
];

export const JOURNEY_STEPS: JourneyStep[] = [
  {
    id: 'bean',
    title: 'Bean Selection',
    description: 'Ethically Sourced & Hand-Sorted',
    detail: 'We source micro-lots directly from award-winning high-altitude estates. Only premium Arabica graded above 84 points enters our inventory.'
  },
  {
    id: 'roast',
    title: 'Expert Roasting',
    description: 'Custom Profiles per Origin',
    detail: 'Our master roasters treat each batch individually, adjusting parameters dynamically to optimize floral undertones and reduce bitterness.'
  },
  {
    id: 'brew',
    title: 'Precision Brewing',
    description: 'Water Chemistry & Temperature Math',
    detail: 'Double-filtration water, gram-accurate dosing scale, temperature locked at 93.5°C, and timed extraction ensure absolute cup fidelity.'
  },
  {
    id: 'serve',
    title: 'Served Fresh',
    description: 'With Unrivaled Hospitality',
    detail: 'Poured into pre-heated custom ceramics. Served with tasting notes explaining our craft, in an environment made for taking your time.'
  }
];

export const TESTIMONIALS: Testimonial[] = [
  {
    id: '1',
    rating: 5,
    text: "Great coffee, great ambience, amazing staff and good food. Truly Surat's hidden premium sanctuary.",
    author: "Rohan Patel",
    role: "Creative Director",
    date: "2 days ago"
  },
  {
    id: '2',
    rating: 5,
    text: "Every coffee craving in town is sorted thanks to Livestream Coffee. The late-night lounge keeps my design sprints sane.",
    author: "Ishita Shah",
    role: "UX Designer & Freelancer",
    date: "1 week ago"
  },
  {
    id: '3',
    rating: 5,
    text: "Good atmosphere, cozy vibes and good music. Located neatly inside Radisson so parking is flawless and ambience is elite.",
    author: "Kabir Mehta",
    role: "Regular Guest",
    date: "3 days ago"
  }
];

import livestreamcounter from "./livestreamcounter.jpg";
export const GALLERY_ITEMS: GalleryItem[] = [
  {
    id: 'g1',
    src: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&q=80&w=800',
    alt: 'Specialty pour over coffee',
    category: 'coffee',
    span: 'normal'
  },
  {
    id: 'g2',
    src: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&q=80&w=800',
    alt: 'Cozy modern seating area',
    category: 'interior',
    span: 'tall'
  },
  {
    id: 'g3',
    src: 'https://images.unsplash.com/photo-1541658016709-82535e94bc69?auto=format&fit=crop&q=80&w=800',
    alt: 'Blended chocolate mocha frappe',
    category: 'coffee',
    span: 'normal'
  },
  {
    id: 'g4',
    src: livestreamcounter,
    alt: 'Livestream coffee bar counter',
    category: 'interior',
    span: 'wide'
  },
  {
    id: 'g5',
    src: 'https://images.unsplash.com/photo-1520072959219-c595dc870360?auto=format&fit=crop&q=80&w=800',
    alt: 'Artisanal grilled sandwich',
    category: 'food',
    span: 'normal'
  },
  {
    id: 'g6',
    src: 'https://images.unsplash.com/photo-1533134242443-d4fd215305ad?auto=format&fit=crop&q=80&w=800',
    alt: 'Slice of premium signature cheesecake',
    category: 'food',
    span: 'tall'
  },
  {
    id: 'g7',
    src: 'https://images.unsplash.com/photo-1511920170033-f8396924c348?auto=format&fit=crop&q=80&w=800',
    alt: 'Creative professional typing with espresso',
    category: 'lifestyle',
    span: 'normal'
  },
  {
    id: 'g8',
    src: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&q=80&w=800',
    alt: 'People enjoying drinks at Park Inn lounge',
    category: 'people',
    span: 'wide'
  }
];

export const FEATURES: Feature[] = [
  {
    id: 'f1',
    title: 'Premium Coffee',
    description: 'Carefully crafted specialty brews with meticulous measurement and temperature calibration.',
    iconName: 'Coffee'
  },
  {
    id: 'f2',
    title: 'Cozy Ambience',
    description: 'Lush velvet armchairs, dim amber-lit acoustics, and noise isolation perfect for connection.',
    iconName: 'Compass'
  },
  {
    id: 'f3',
    title: 'Hotel Convenience',
    description: 'Located inside the majestic ground floor of Park Inn by Radisson with premium valet parking.',
    iconName: 'MapPin'
  },
  {
    id: 'f4',
    title: 'Dine-In • Pickup • Delivery',
    description: 'Sip slow in our lounges, order ahead for a swift pickup, or get hot brews delivered to your door.',
    iconName: 'Sparkles'
  }
];

export const FEATURED_MENU_ITEMS: MenuItem[] = [
  // --- HOT COFFEE ---
  {
    id: 'm-esp',
    name: 'Espresso Double Shot',
    category: 'specialty',
    subcategory: 'Hot Coffee',
    description: 'Freshly pulled double shot of our 100% Arabica house specialty blend, featuring rich golden crema and high-altitude complexity.',
    price: 150,
    tags: ['Hot Coffee', 'Pure Origin', 'Intense Details'],
    image: MENU_IMAGES['m-esp']
  },
  {
    id: 'm-cap',
    name: 'Cappuccino',
    category: 'specialty',
    subcategory: 'Hot Coffee',
    description: 'Classic rich espresso layers topped with balanced steamed milk and a thick blanket of satisfying microfoam chocolate dust.',
    price: 210,
    tags: ['Hot Coffee', 'Timeless'],
    image: MENU_IMAGES['m-cap']
  },
  {
    id: 'm-lat',
    name: 'Barista Latte Art',
    category: 'specialty',
    subcategory: 'Hot Coffee',
    description: 'Specialty espresso blended with textured silky milk, adorned with exquisite barista leaf or tulip art.',
    price: 210,
    tags: ['Hot Coffee', 'Barista Art', 'Silky Velvet'],
    image: MENU_IMAGES['m-lat']
  },

  // --- HOT CHOCOLATE ---
  {
    id: 'm-hc-sig',
    name: 'Signature Hot Chocolate',
    category: 'specialty',
    subcategory: 'Hot Chocolate',
    description: 'Warm, comforting rich milk chocolate slow-heated with fresh organic cream and cocoa dusting.',
    price: 260,
    tags: ['Hot Chocolate', 'Sweet Escape', 'Warm Cup'],
    image: MENU_IMAGES['m-hc-sig']
  },
  {
    id: 'm-hc-bel',
    name: 'Belgian Hot Chocolate',
    category: 'specialty',
    subcategory: 'Hot Chocolate',
    description: 'Imported melted Belgian dark chocolate chips steam-emulsified with creamy whole milk for heavy cocoa texture.',
    price: 290,
    tags: ['Hot Chocolate', 'Belgian Cocoa', 'Elite'],
    image: MENU_IMAGES['m-hc-bel']
  },
  {
    id: 'm-hc-fre',
    name: 'French Hot Chocolate',
    category: 'specialty',
    subcategory: 'Hot Chocolate',
    description: 'Parisian style slow-melted high percentage dark chocolate chips steam emulsified into a dense, luxurious drink.',
    price: 270,
    tags: ['Hot Chocolate', 'Parisian Blend', 'Gourmet'],
    image: MENU_IMAGES['m-hc-fre']
  },

  // --- MANUAL BREWS ---
  {
    id: 'm-v60',
    name: 'V60 Pour Over (Hot/Iced)',
    category: 'specialty',
    subcategory: 'Manual Brews',
    description: 'Clean hand-brewed cup filtered with precision ratio mechanics to tease out gorgeous bright fruit and floral notes.',
    price: 220,
    tags: ['Manual Brew', 'Bright Acid', 'Pure Origin'],
    image: MENU_IMAGES['m-v60']
  },
  {
    id: 'm-fpress',
    name: 'French Press',
    category: 'specialty',
    subcategory: 'Manual Brews',
    description: 'Traditional core immersion brewer delivering a heavy body, earthy complexity and rich coffee oil retention.',
    price: 220,
    tags: ['Manual Brew', 'Classic Immersion'],
    image: MENU_IMAGES['m-fpress']
  },
  {
    id: 'm-aero',
    name: 'Aeropress (Hot/Iced)',
    category: 'specialty',
    subcategory: 'Manual Brews',
    description: 'Medium-bodied extraction using air-pressure plungers, resulting in a clean yet exceptionally rich cup.',
    price: 220,
    tags: ['Manual Brew', 'Aeropress Custom', 'Robusta Blend'],
    image: MENU_IMAGES['m-aero']
  },

  // --- SPECIALTY TEAS ---
  {
    id: 'm-tea-sacred',
    name: 'Sacred Space (by Bai Mu Dan)',
    category: 'specialty',
    subcategory: 'Specialty Teas',
    description: 'Premium organic white peony tea blend featuring peaceful herbal integrity and soothing, calm notes.',
    price: 220,
    tags: ['Specialty Tea', 'Premium White', 'Calming'],
    image: MENU_IMAGES['m-tea-sacred']
  },
  {
    id: 'm-tea-lemon',
    name: 'Lemon Honey Tea',
    category: 'specialty',
    subcategory: 'Specialty Teas',
    description: 'Steaming biological green tea leaves combined with freshly pressed lemon wedges and organic wild honey.',
    price: 200,
    tags: ['Specialty Tea', 'Zesty Health', 'Sweet honey'],
    image: MENU_IMAGES['m-tea-lemon']
  },
  {
    id: 'm-tea-ruby',
    name: 'Ruby Heaven (by Bai Mu Dan)',
    category: 'specialty',
    subcategory: 'Specialty Teas',
    description: 'Seductive organic hibiscus & berry infused tea offering an exquisite gemstone red color and sweet sip.',
    price: 220,
    tags: ['Specialty Tea', 'Fruit Infusion', 'Tart Sweet'],
    image: MENU_IMAGES['m-tea-ruby']
  },

  // --- SIGNATURE COFFEE MOCKTAILS ---
  {
    id: 'm-mock-mj',
    name: 'Mary Jane Coffee Mocktail',
    category: 'specialty',
    subcategory: 'Signature Coffee Mocktails',
    description: 'Our proprietary herbal signature cold brew mocktail with a sparkling botanical finish and fresh aroma.',
    price: 270,
    tags: ['Coffee Mocktail', 'Herb & Fizz', 'Secret Recipe'],
    image: MENU_IMAGES['m-mock-mj']
  },
  {
    id: 'm-mock-bail',
    name: 'Almost Baileys (Chilled)',
    category: 'specialty',
    subcategory: 'Signature Coffee Mocktails',
    description: 'Lusciously thick non-alcoholic Irish cream creaminess fused with cold espresso roast. Ultimate late-night comfort.',
    price: 280,
    tags: ['Coffee Mocktail', 'Comfort Craft', 'New Arrival', 'Chilled'],
    image: MENU_IMAGES['m-mock-bail']
  },
  {
    id: 'm-mock-mint-mocha',
    name: 'Iced Mint Mocha',
    category: 'specialty',
    subcategory: 'Signature Coffee Mocktails',
    description: 'Refreshing cold-pressed garden peppermint extract blended with dense organic cocoa and double espresso.',
    price: 280,
    tags: ['Coffee Mocktail', 'Minty Fresh', 'Cocoa Mint'],
    image: MENU_IMAGES['m-mock-mint-mocha']
  },

  // --- ICED COFFEE ---
  {
    id: 'm-iclat',
    name: 'Iced Latte',
    category: 'specialty',
    subcategory: 'Iced Coffee',
    description: 'Espresso poured gently through cold textured milk, creating elegant natural marble layers.',
    price: 220,
    tags: ['Iced Coffee', 'Creamy Marble'],
    image: MENU_IMAGES['m-iclat']
  },
  {
    id: 'm-cbhouse',
    name: 'Cold Brew (House Blend)',
    category: 'specialty',
    subcategory: 'Iced Coffee',
    description: 'Slow-steeped in cold oxygenless chambers for 18 hours to yield highly smooth winey berry notes.',
    price: 220,
    tags: ['Iced Coffee', '18-Hour Steep', 'Zero Bitter'],
    image: MENU_IMAGES['m-cbhouse']
  },
  {
    id: 'm-viet',
    name: 'Vietnamese Iced Coffee',
    category: 'specialty',
    subcategory: 'Iced Coffee',
    description: 'Intensely dripped dark robusta poured elegantly over a sweet, velvety layer of premium condensed milk and ice.',
    price: 220,
    tags: ['Iced Coffee', 'Indulgent', 'Sweet Pick'],
    image: MENU_IMAGES['m-viet']
  },

  // --- FRAPPES ---
  {
    id: 'm-fr-haz',
    name: 'Hazelnut Frappe',
    category: 'frappe',
    subcategory: 'Frappes',
    description: 'A decadent blend of toasted Piedmont hazelnuts, roasted coffee, cold fresh cream, and smooth whipped peak.',
    price: 240,
    tags: ['Best Seller', 'Nutty Bliss', 'Frappe'],
    image: MENU_IMAGES['m-fr-haz']
  },
  {
    id: 'm-fr-bis',
    name: 'Biscoff Whipped Frappe (NEW)',
    category: 'frappe',
    subcategory: 'Frappes',
    description: 'Loaded with real speculoos Lotus Biscoff cookie crumble and caramel syrup blended with chilled espresso base.',
    price: 300,
    tags: ['New Arrival', 'Cookie Crunch', 'Biscoff Devotion'],
    image: MENU_IMAGES['m-fr-bis']
  },
  {
    id: 'm-fr-moc',
    name: 'Mocha Chocolate Frappe',
    category: 'frappe',
    subcategory: 'Frappes',
    description: 'Blended chocolate-layered coffee slush capped with homemade fluffy sweet whipped cream and dark cocoa sprinkles.',
    price: 240,
    tags: ['Frappe', 'Double Chocolate', 'Rich Sweet'],
    image: MENU_IMAGES['m-fr-moc']
  },

  // --- SHAKES ---
  {
    id: 'm-sk-nut',
    name: 'Nutella Cream Shake (NEW)',
    category: 'frappe',
    subcategory: 'Shakes',
    description: 'Rich roasted hazelnut Nutella spread blended deep with premium dairy gelato, topped with roasted cocoa chips.',
    price: 340,
    tags: ['Gelato Shake', 'Nutella Overload', 'New Arrival'],
    image: MENU_IMAGES['m-sk-nut']
  },
  {
    id: 'm-sk-ras',
    name: 'White Chocolate Raspberry Shake',
    category: 'frappe',
    subcategory: 'Shakes',
    description: 'Fresh organic raspberry sauce layers with sweet melted white chocolate and fresh chilled whipped cream.',
    price: 360,
    tags: ['Velvet Shake', 'Gourmet Fruit', 'Creamy Premium'],
    image: MENU_IMAGES['m-sk-ras']
  },
  {
    id: 'm-sk-matcha',
    name: 'Matcha Forest Shake',
    category: 'frappe',
    subcategory: 'Shakes',
    description: 'Authentic Japanese Uji green tea matcha blended with dark sweet cherry chocolate toppings and creamy vanilla gelato.',
    price: 340,
    tags: ['Matcha', 'Black Forest', 'Forest Herbal'],
    image: MENU_IMAGES['m-sk-matcha']
  },

  // --- MOCKTAILS ---
  {
    id: 'm-mock-mojito',
    name: 'Lush Mint Mojito',
    category: 'frappe',
    subcategory: 'Mocktails',
    description: 'Muddled garden mint leaves, sweet brown sugarcane crystals, fresh lime lime juice topped with fizzy club soda.',
    price: 230,
    tags: ['Mocktail', 'Mint Mojito', 'Cool Refreshment'],
    image: MENU_IMAGES['m-mock-mojito']
  },
  {
    id: 'm-mock-pina',
    name: 'Gourmet Pina Colada (NEW)',
    category: 'frappe',
    subcategory: 'Mocktails',
    description: 'Silky smooth blend of hand-pressed organic coconut milk cream with raw pineapple nectar and shaved ice.',
    price: 280,
    tags: ['Mocktail', 'Coconut Cream', 'Tropical Escape'],
    image: MENU_IMAGES['m-mock-pina']
  },
  {
    id: 'm-mock-star',
    name: 'Starlight Mocktail',
    category: 'frappe',
    subcategory: 'Mocktails',
    description: 'Dazzling sparkling citrus fruit cocktail finished with botanical lavender extract and golden glitter reflections.',
    price: 230,
    tags: ['Mocktail', 'Aesthetic Lavender', 'Fizzy Drink'],
    image: MENU_IMAGES['m-mock-star']
  },

  // --- ALL DAY BREAKFAST ---
  {
    id: 'm-fd-bagel',
    name: 'All Day Breakfast Bagel',
    category: 'food',
    subcategory: 'All Day Breakfast',
    description: 'Toasted artisanal sesame bagel schmeared with loaded herbed cream cheese, fresh crisp greens, and tomato slices.',
    price: 280,
    tags: ['All Day Breakfast', 'Freshened Bagel', 'Toasted'],
    image: MENU_IMAGES['m-fd-bagel']
  },
  {
    id: 'm-fd-burrata',
    name: 'Burrata & Pesto Croissant',
    category: 'food',
    subcategory: 'All Day Breakfast',
    description: 'Warm flaky butter croissant stuffed with rich, creamy Italian burrata cheese, home-ground basil pine nut pesto, and heirloom tomatoes.',
    price: 360,
    tags: ['All Day Breakfast', 'Pesto Elite', 'Best Seller'],
    image: MENU_IMAGES['m-fd-burrata']
  },
  {
    id: 'm-fd-toast',
    name: 'French Toast Babka',
    category: 'food',
    subcategory: 'All Day Breakfast',
    description: 'Artisanal brioche babka soaked in cinnamon butter cream, roasted to golden perfection and served with rich organic honey.',
    price: 320,
    tags: ['All Day Breakfast', 'Sweet Pastry', 'Babka Special'],
    image: MENU_IMAGES['m-fd-toast']
  },

  // --- TOASTS ---
  {
    id: 'm-fd-mush',
    name: 'Gourmet Mushroom On Toast',
    category: 'food',
    subcategory: 'Toasts',
    description: 'Sautéed forest shiitake and button mushrooms in rich white wine garlic cream reduction over toasted sourdough.',
    price: 360,
    tags: ['Artisanal Toast', 'Savory Cream', 'Shiitake'],
    image: MENU_IMAGES['m-fd-mush']
  },
  {
    id: 'm-fd-guac',
    name: 'Smashed Guac On Toast',
    category: 'food',
    subcategory: 'Toasts',
    description: 'Fresh Haas avocados smashed with sea salt, lime zest, and red pepper flakes over roasted seed loaf toast.',
    price: 420,
    tags: ['Artisanal Toast', 'Haas Avocado', 'Healthy Choice'],
    image: MENU_IMAGES['m-fd-guac']
  },
  {
    id: 'm-fd-mbagel',
    name: 'Margherita Bagel Melt',
    category: 'food',
    subcategory: 'Toasts',
    description: 'Fresh baked bagel crust smeared with sun-dried sweet cherry tomato sauce, basil leaf strips and heavy melted mozzarella.',
    price: 320,
    tags: ['Artisanal Toast', 'Bagel Baker', 'Cheesy Melt'],
    image: MENU_IMAGES['m-fd-mbagel']
  },

  // --- SANDWICHES ---
  {
    id: 'm-fd-cheese',
    name: 'Spicy Triple Grilled Cheese',
    category: 'food',
    subcategory: 'Sandwiches',
    description: 'Gooey melted cheddar, mozzarella, and gouda cheeses with chopped spicy green chilis sandwiched in crispy sourdough butter griddle.',
    price: 380,
    tags: ['Triple Cheese', 'Comfort Bite', 'Spicy Griddle'],
    image: MENU_IMAGES['m-fd-cheese']
  },
  {
    id: 'm-fd-avocrois',
    name: 'Avo Croissant Sandwich Deluxe',
    category: 'food',
    subcategory: 'Sandwiches',
    description: 'Buttery flaky golden croissant packed with fresh sliced Haas avocados, crisp baby spinach, and herby sauce.',
    price: 340,
    tags: ['Sandwich Elite', 'Avocado Croissant'],
    image: MENU_IMAGES['m-fd-avocrois']
  },
  {
    id: 'm-fd-tombas',
    name: 'Tomato Basil Sandwich',
    category: 'food',
    subcategory: 'Sandwiches',
    description: 'Italian style toasted ciabatta with slow-roasted tomatoes, sweet garden basil pesto sauce and fresh pulled mozzarella chunks.',
    price: 320,
    tags: ['Sandwich Elite', 'Italian Classic'],
    image: MENU_IMAGES['m-fd-tombas']
  },

  // --- APPETIZERS ---
  {
    id: 'm-fd-fries',
    name: 'Fries (Truffle / Peri Peri)',
    category: 'food',
    subcategory: 'Appetizers',
    description: 'Double fried crispy golden potato finger fries seasoned choice of premium French truffle oil or spicy African peri-peri dust.',
    price: 380,
    tags: ['Appetizer', 'Crispy Golden', 'Truffle or Peri Peri'],
    image: MENU_IMAGES['m-fd-fries']
  },
  {
    id: 'm-fd-arancini',
    name: 'Risotto Cheese Arancini',
    category: 'food',
    subcategory: 'Appetizers',
    description: 'Crispy golden fried saffron Italian risotto balls stuffed with warm oozing liquid mozzarella core, served over robust marinara sauce.',
    price: 420,
    tags: ['Appetizer', 'Italian Craft', 'Premium Mozzarella'],
    image: MENU_IMAGES['m-fd-arancini']
  },
  {
    id: 'm-fd-nachos',
    name: 'Nachos Supreme',
    category: 'food',
    subcategory: 'Appetizers',
    description: 'Premium Mexican tortilla corn chips baked with triple cheese sauce, loaded black beans, pickled jalapenos, and cool sour cream.',
    price: 390,
    tags: ['Appetizer', 'Triple Cheese Nacho', 'Party Tray'],
    image: MENU_IMAGES['m-fd-nachos']
  },

  // --- PASTA ---
  {
    id: 'm-fd-spag',
    name: 'Spaghetti Aglio e Olio',
    category: 'food',
    subcategory: 'Pasta',
    description: 'Fresh durum wheat spaghetti tossed in premium extra virgin olive oil, sweet thinly-sliced garlic, cherry tomatoes, and red pepper flakes.',
    price: 380,
    tags: ['Italian Pasta', 'Olive Oil Classic'],
    image: MENU_IMAGES['m-fd-spag']
  },
  {
    id: 'm-fd-blush',
    name: 'OG Blush Creamy Pasta',
    category: 'food',
    subcategory: 'Pasta',
    description: 'Penne pasta tossed in our chef’s iconic spiced red-and-white pink mix sauce, finished with fresh shredded parmesan cheese.',
    price: 390,
    tags: ['Creamy Pink', 'Chef Specialty'],
    image: MENU_IMAGES['m-fd-blush']
  },
  {
    id: 'm-fd-alfredo',
    name: 'Creamy Garlic Alfredo Pasta',
    category: 'food',
    subcategory: 'Pasta',
    description: 'Fettuccine pasta tossed gently in our chef’s rich garlic-parmesan cream reduction and fresh garden greens.',
    price: 410,
    tags: ['Creamy Alfredo', 'Garlic Parmesan', 'Comfort Food'],
    image: MENU_IMAGES['m-fd-alfredo']
  },

  // --- BOWLS ---
  {
    id: 'm-fd-mexbowl',
    name: 'Loaded Mexican Rice Bowl',
    category: 'food',
    subcategory: 'Bowls',
    description: 'Seasoned brown rice topped with roasted corn, black beans, smashed guacamole, fresh pico de gallo, and herbed sour cream.',
    price: 490,
    tags: ['Satisfying Bowl', 'Healthy Rich'],
    image: MENU_IMAGES['m-fd-mexbowl']
  },
  {
    id: 'm-fd-papcomp',
    name: 'Paprika Paneer Bistro Bowl',
    category: 'food',
    subcategory: 'Bowls',
    description: 'Warm premium paprika oil dressed paneer cubes, tossed on organic brown rice, sweet kernel corn, edamame and dynamic greens.',
    price: 460,
    tags: ['Satisfying Bowl', 'Paneer Paprika', 'Bistro Healthy'],
    image: MENU_IMAGES['m-fd-papcomp']
  },
  {
    id: 'm-fd-lentilbowl',
    name: 'Mediterranean Hummus Bowl',
    category: 'food',
    subcategory: 'Bowls',
    description: 'Loaded delicious brown grain base tossed with Greek salad olives, cucumber bits, roasted red bell peppers, and fresh creamy whipped hummus scoop.',
    price: 450,
    tags: ['Satisfying Bowl', 'Vegan Friendly', 'Mediterranean'],
    image: MENU_IMAGES['m-fd-lentilbowl']
  }
];
