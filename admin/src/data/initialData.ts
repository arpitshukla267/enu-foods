import { Product, Category, Combo, Order, User, Payment } from '../types';

export const INITIAL_CATEGORIES: Category[] = [
  {
    id: 'cat-blends',
    name: 'Specialty Blends',
    slug: 'specialty-blends',
    description: 'Slow-roasted, small-batch traditional royal spice blends crafted with heritage recipes.',
    image: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=600&q=80',
    status: 'active',
    productCount: 6,
    subcategories: [
      { id: 'sub-curry-blends', name: 'Curry & Gravy Blends', slug: 'curry-gravy-blends', categoryId: 'cat-blends', status: 'active', productCount: 3 },
      { id: 'sub-biryani-blends', name: 'Biryani & Rice Masalas', slug: 'biryani-rice-masalas', categoryId: 'cat-blends', status: 'active', productCount: 1 },
      { id: 'sub-street-blends', name: 'Street Food & Chaat', slug: 'street-food-chaat', categoryId: 'cat-blends', status: 'active', productCount: 2 }
    ]
  },
  {
    id: 'cat-singles',
    name: 'Pure Ground Spices',
    slug: 'pure-ground-spices',
    description: 'Single-origin sun-dried whole spices cold-ground to preserve volatile essential oils.',
    image: 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&w=600&q=80',
    status: 'active',
    productCount: 3,
    subcategories: [
      { id: 'sub-turmeric', name: 'Heritage Turmerics', slug: 'heritage-turmerics', categoryId: 'cat-singles', status: 'active', productCount: 1 },
      { id: 'sub-chillies', name: 'Regional Chillies', slug: 'regional-chillies', categoryId: 'cat-singles', status: 'active', productCount: 1 },
      { id: 'sub-coriander', name: 'Aromatic Corianders', slug: 'aromatic-corianders', categoryId: 'cat-singles', status: 'active', productCount: 1 }
    ]
  },
  {
    id: 'cat-south-indian',
    name: 'South Indian Specialties',
    slug: 'south-indian-specialties',
    description: 'Authentic stone-pounded lentil and spice masalas for heritage South Indian dishes.',
    image: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=600&q=80',
    status: 'active',
    productCount: 2,
    subcategories: [
      { id: 'sub-sambhar-rasam', name: 'Sambhar & Rasam Podi', slug: 'sambhar-rasam-podi', categoryId: 'cat-south-indian', status: 'active', productCount: 2 }
    ]
  },
  {
    id: 'cat-herbs',
    name: 'Dried Herbs & Seasonings',
    slug: 'dried-herbs-seasonings',
    description: 'Fragrant shade-dried herbs from Nagaur and Kashmir.',
    image: 'https://images.unsplash.com/photo-1599940824399-b87987ceb72a?auto=format&fit=crop&w=600&q=80',
    status: 'active',
    productCount: 1,
    subcategories: [
      { id: 'sub-nagaur-methi', name: 'Hand-Picked Leaves', slug: 'hand-picked-leaves', categoryId: 'cat-herbs', status: 'active', productCount: 1 }
    ]
  }
];

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'prod-garam-masala',
    name: 'ENU Royal Garam Masala',
    slug: 'enu-royal-garam-masala',
    categoryId: 'cat-blends',
    categoryName: 'Specialty Blends',
    subcategoryId: 'sub-curry-blends',
    subcategoryName: 'Curry & Gravy Blends',
    weightOptions: [
      { id: 'var-gm-100', weight: '100g', price: 185, originalPrice: 220, stock: 48, sku: 'ENU-GM-100', isDefault: true },
      { id: 'var-gm-200', weight: '200g', price: 340, originalPrice: 410, stock: 24, sku: 'ENU-GM-200', isDefault: false },
      { id: 'var-gm-500', weight: '500g', price: 780, originalPrice: 950, stock: 12, sku: 'ENU-GM-500', isDefault: false }
    ],
    defaultWeight: '100g',
    price: 185,
    originalPrice: 220,
    shortDescription: 'Master blend of 14 royal whole spices slow-roasted on iron griddles for intoxicating aroma.',
    fullDescription: 'Our signature royal Garam Masala represents generational Indian culinary excellence. Handcrafted from selected green cardamom from Idukki, cinnamon quills from Kerala, black mace, star anise, nutmeg, and stone flowers (dagad phool). Dry-roasted over gentle wood fires to activate essential aromatic oils before coarse milling.',
    image: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=600&q=80',
    secondaryImages: [
      'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1509358271058-acd22cc93898?auto=format&fit=crop&w=600&q=80'
    ],
    ingredients: ['Black Cardamom', 'Green Cardamom', 'Cinnamon Bark', 'Cloves', 'Nutmeg', 'Mace (Javitri)', 'Star Anise', 'Cumin', 'Black Pepper', 'Stone Flower (Dagad Phool)', 'Bay Leaf'],
    benefits: [
      'Rich in volatile antioxidants (piperine and eugenol)',
      'Promotes digestive fire (Agni) without excess heartburn',
      'No added preservatives, synthetic fragrances, or fillers'
    ],
    storageInstructions: 'Store in airtight tin container in a cool, dark pantry away from direct sunlight.',
    aromaProfile: 'Warming, intensely fragrant with woody notes of sweet cinnamon, camphoraceous cardamom and nutty mace.',
    spicinessLevel: 3,
    isFeatured: true,
    status: 'active',
    bestFor: ['Dum Aloo', 'Paneer Butter Masala', 'Mutton Korma', 'Dal Makhani', 'Rich Mughlai Gravies'],
    createdAt: '2026-06-10T10:00:00.000Z',
    updatedAt: '2026-08-14T15:30:00.000Z',
    salesCount: 420
  },
  {
    id: 'prod-turmeric-powder',
    name: 'ENU Lakadong High-Curcumin Turmeric',
    slug: 'enu-lakadong-turmeric-powder',
    categoryId: 'cat-singles',
    categoryName: 'Pure Ground Spices',
    subcategoryId: 'sub-turmeric',
    subcategoryName: 'Heritage Turmerics',
    weightOptions: [
      { id: 'var-tur-100', weight: '100g', price: 145, originalPrice: 175, stock: 85, sku: 'ENU-TUR-100', isDefault: false },
      { id: 'var-tur-200', weight: '200g', price: 260, originalPrice: 320, stock: 52, sku: 'ENU-TUR-200', isDefault: true },
      { id: 'var-tur-500', weight: '500g', price: 590, originalPrice: 720, stock: 19, sku: 'ENU-TUR-500', isDefault: false }
    ],
    defaultWeight: '200g',
    price: 260,
    originalPrice: 320,
    shortDescription: 'Naturally potent turmeric from Meghalaya boasting 7.5%+ active natural curcumin.',
    fullDescription: 'Sourced directly from indigenous tribal farmers in the pristine Jaintia Hills of Meghalaya. Lakadong turmeric is globally revered as the golden standard for therapeutic purity and vibrant earthy flavor. Ground at ultra-low temperatures below 38°C to retain all natural curcuminoids and fragrant aromatic oils.',
    image: 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&w=600&q=80',
    secondaryImages: [
      'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=600&q=80'
    ],
    ingredients: ['100% Pure Lakadong Turmeric Rhizomes (Curcuma longa)'],
    benefits: [
      'Verified 7.5% - 8.2% natural Curcumin potency',
      'Powerful anti-inflammatory and cellular longevity booster',
      'Deep golden glow without artificial lead chromate or starch adulterants'
    ],
    storageInstructions: 'Keep sealed in an opaque container to prevent UV oxidation of active curcumin.',
    aromaProfile: 'Earthy, peppery, with subtle floral ginger and mustard undertones.',
    spicinessLevel: 1,
    isFeatured: true,
    status: 'active',
    bestFor: ['Golden Milk (Haldi Doodh)', 'Daily Lentil Tadkas', 'Subzis', 'Immunity Elixirs'],
    createdAt: '2026-06-12T11:00:00.000Z',
    updatedAt: '2026-08-12T09:15:00.000Z',
    salesCount: 680
  },
  {
    id: 'prod-red-chilli',
    name: 'ENU Kashmiri & Guntur Hand-Pounded Chilli',
    slug: 'enu-kashmiri-guntur-chilli-powder',
    categoryId: 'cat-singles',
    categoryName: 'Pure Ground Spices',
    subcategoryId: 'sub-chillies',
    subcategoryName: 'Regional Chillies',
    weightOptions: [
      { id: 'var-rc-100', weight: '100g', price: 160, originalPrice: 190, stock: 64, sku: 'ENU-RC-100', isDefault: false },
      { id: 'var-rc-200', weight: '200g', price: 295, originalPrice: 350, stock: 41, sku: 'ENU-RC-200', isDefault: true },
      { id: 'var-rc-500', weight: '500g', price: 650, originalPrice: 790, stock: 8, sku: 'ENU-RC-500', isDefault: false }
    ],
    defaultWeight: '200g',
    price: 295,
    originalPrice: 350,
    shortDescription: 'Vibrant crimson blend giving royal red color and balanced pleasant medium heat.',
    fullDescription: 'A balanced marriage of deep sun-cured Kashmiri chillies for royal rouge color and ripe Guntur chillies for appetizing zest. Stem-plucked and sun-dried on clay courtyards, then stone-crushed to preserve the crimson pericarp oils.',
    image: 'https://images.unsplash.com/photo-1588252303782-cb80119abd6d?auto=format&fit=crop&w=600&q=80',
    secondaryImages: [
      'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&w=600&q=80'
    ],
    ingredients: ['Sun-Dried Kashmiri Red Chillies', 'Selected Guntur S17 Chillies', 'Pure Mustard Oil (Trace for oil retention)'],
    benefits: [
      'Natural high capsanthin content for brilliant appetizing red gravies',
      'No added synthetic dyes, Sudan dyes, or brick powder',
      'Pleasant warmth that elevates food without overpowering spice'
    ],
    storageInstructions: 'Store in a dry amber glass jar away from moisture and steam.',
    aromaProfile: 'Fruity, lightly smoky, with a sharp crisp piquant bouquet.',
    spicinessLevel: 4,
    isFeatured: true,
    status: 'active',
    bestFor: ['Rogan Josh', 'Paneer Tikka Marinades', 'Pav Bhaji', 'Spicy Sambhar', 'Tawa Fries'],
    createdAt: '2026-06-15T14:20:00.000Z',
    updatedAt: '2026-08-15T10:00:00.000Z',
    salesCount: 510
  },
  {
    id: 'prod-sambhar-masala',
    name: 'ENU Traditional Udupi Sambhar Masala',
    slug: 'enu-traditional-udupi-sambhar-masala',
    categoryId: 'cat-south-indian',
    categoryName: 'South Indian Specialties',
    subcategoryId: 'sub-sambhar-rasam',
    subcategoryName: 'Sambhar & Rasam Podi',
    weightOptions: [
      { id: 'var-sm-100', weight: '100g', price: 170, originalPrice: 200, stock: 35, sku: 'ENU-SM-100', isDefault: true },
      { id: 'var-sm-200', weight: '200g', price: 310, originalPrice: 380, stock: 18, sku: 'ENU-SM-200', isDefault: false }
    ],
    defaultWeight: '100g',
    price: 170,
    originalPrice: 200,
    shortDescription: 'Roasted chana dal, curry leaves, fenugreek & whole spices for temple-style Sambhar.',
    fullDescription: 'Crafted following the revered temple recipes of coastal Udupi. Golden Bengal gram and split black gram are gently toasted with heirloom coriander seeds, Byadgi chillies, fragrant whole cumin, fenugreek seeds, and fresh air-dried curry leaves.',
    image: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=600&q=80',
    secondaryImages: [],
    ingredients: ['Coriander Seeds', 'Byadgi Red Chilli', 'Roasted Chana Dal', 'Urad Dal', 'Cumin Seeds', 'Fenugreek (Methi)', 'Curry Leaves', 'Asafoetida (Hing)', 'Turmeric'],
    benefits: [
      'Lentil-toasted base creates naturally velvety, thick sambhar broth',
      'Digestive support with roasted fenugreek and asafoetida',
      'Authentic coastal Karnataka flavor profile'
    ],
    storageInstructions: 'Reseal pouch tightly after opening or transfer to an airtight stainless steel canister.',
    aromaProfile: 'Nutty roasted lentil fragrance accented by fresh curry leaf and sweet toasted cumin.',
    spicinessLevel: 2,
    isFeatured: true,
    status: 'active',
    bestFor: ['Udupi Hotel Sambhar', 'Tiffin Sambhar for Idli/Dosa', 'Mixed Vegetable Dal Stems'],
    createdAt: '2026-06-20T08:30:00.000Z',
    updatedAt: '2026-08-11T12:00:00.000Z',
    salesCount: 390
  },
  {
    id: 'prod-kitchen-king',
    name: 'ENU Signature Kitchen King Masala',
    slug: 'enu-signature-kitchen-king-masala',
    categoryId: 'cat-blends',
    categoryName: 'Specialty Blends',
    subcategoryId: 'sub-curry-blends',
    subcategoryName: 'Curry & Gravy Blends',
    weightOptions: [
      { id: 'var-kk-100', weight: '100g', price: 165, originalPrice: 195, stock: 40, sku: 'ENU-KK-100', isDefault: true },
      { id: 'var-kk-200', weight: '200g', price: 300, originalPrice: 360, stock: 26, sku: 'ENU-KK-200', isDefault: false },
      { id: 'var-kk-500', weight: '500g', price: 690, originalPrice: 840, stock: 6, sku: 'ENU-KK-500', isDefault: false }
    ],
    defaultWeight: '100g',
    price: 165,
    originalPrice: 195,
    shortDescription: 'The versatile all-purpose curry seasoning that elevates everyday homestyle vegetables.',
    fullDescription: 'The crown jewel of Indian daily cooking. Balanced with coriander, cumin, dry ginger, cardamom, mace, nutmeg, and black salt, this multi-purpose culinary enhancer delivers rich mouthfeel to dry and semi-gravy dishes.',
    image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=600&q=80',
    secondaryImages: [],
    ingredients: ['Coriander', 'Cumin', 'Red Chilli', 'Turmeric', 'Black Pepper', 'Dry Ginger', 'Cardamom', 'Cinnamon', 'Nutmeg', 'Mace', 'Black Salt', 'Kasuri Methi'],
    benefits: [
      'Single spoon completes any everyday vegetarian recipe',
      'Zero MSG or artificial taste boosters',
      'Enhances natural vegetable sweetness'
    ],
    storageInstructions: 'Keep in dry cupboard away from steam.',
    aromaProfile: 'Savory, rounded, gently spiced with warm ginger and cardamom.',
    spicinessLevel: 3,
    isFeatured: false,
    status: 'active',
    bestFor: ['Aloo Gobi', 'Matar Paneer', 'Mix Veg Curry', 'Bhindi Masala', 'Chana Masala'],
    createdAt: '2026-06-25T16:00:00.000Z',
    updatedAt: '2026-08-10T14:10:00.000Z',
    salesCount: 310
  },
  {
    id: 'prod-biryani-masala',
    name: 'ENU Shahi Dum Biryani Masala',
    slug: 'enu-shahi-dum-biryani-masala',
    categoryId: 'cat-blends',
    categoryName: 'Specialty Blends',
    subcategoryId: 'sub-biryani-blends',
    subcategoryName: 'Biryani & Rice Masalas',
    weightOptions: [
      { id: 'var-bm-100', weight: '100g', price: 210, originalPrice: 250, stock: 55, sku: 'ENU-BM-100', isDefault: true },
      { id: 'var-bm-200', weight: '200g', price: 390, originalPrice: 470, stock: 28, sku: 'ENU-BM-200', isDefault: false }
    ],
    defaultWeight: '100g',
    price: 210,
    originalPrice: 250,
    shortDescription: 'Infused with royal saffron strands, mace, shahi jeera, and fragrant Kewra notes.',
    fullDescription: 'Specially created for the connoisseur of Awadhi and Hyderabadi Dum Biryanis. Whole Kashmiri saffron threads, green cardamom pods, royal caraway (shahi jeera), star anise, and whole cloves create layers of scent trapped inside steaming Basmati grain pots.',
    image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=600&q=80',
    secondaryImages: [],
    ingredients: ['Shahi Jeera', 'Kashmiri Saffron (Kesar)', 'Green Cardamom', 'Black Cardamom', 'Cloves', 'Cinnamon Quills', 'Mace', 'Nutmeg', 'Star Anise', 'Rose Petals', 'Bay Leaf'],
    benefits: [
      'Transforms ordinary rice into feast-worthy dum biryani',
      'Infused with real saffron and dried damask rose petals',
      'Coarse ground to release burst aromas on dum cooking'
    ],
    storageInstructions: 'Refrigerate after opening to preserve saffron potency and delicate floral essences.',
    aromaProfile: 'Hypnotic floral and sweet-warm royal bouquet with saffron and rose.',
    spicinessLevel: 2,
    isFeatured: true,
    status: 'active',
    bestFor: ['Hyderabadi Dum Biryani', 'Lucknowi Pulao', 'Yakhni Pulao', 'Vegetable Dum Biryani'],
    createdAt: '2026-07-01T09:00:00.000Z',
    updatedAt: '2026-08-13T17:45:00.000Z',
    salesCount: 460
  },
  {
    id: 'prod-pav-bhaji',
    name: 'ENU Bombay Street-Style Pav Bhaji Masala',
    slug: 'enu-bombay-pav-bhaji-masala',
    categoryId: 'cat-blends',
    categoryName: 'Specialty Blends',
    subcategoryId: 'sub-street-blends',
    subcategoryName: 'Street Food & Chaat',
    weightOptions: [
      { id: 'var-pb-100', weight: '100g', price: 175, originalPrice: 205, stock: 32, sku: 'ENU-PB-100', isDefault: true },
      { id: 'var-pb-200', weight: '200g', price: 320, originalPrice: 380, stock: 15, sku: 'ENU-PB-200', isDefault: false }
    ],
    defaultWeight: '100g',
    price: 175,
    originalPrice: 205,
    shortDescription: 'Tangy, buttery, robust spice blend capturing the authentic Chowpatty tawa punch.',
    fullDescription: 'The secret to Bombay street-corner pav bhaji. Dried mango (amchur), toasted coriander, crushed fennel seeds, black salt, and roasted cumin balanced with Kashmiri chillies to emulsify perfectly with sizzling butter on iron tawas.',
    image: 'https://images.unsplash.com/photo-1606491956689-2ea866880c84?auto=format&fit=crop&w=600&q=80',
    secondaryImages: [],
    ingredients: ['Coriander', 'Red Chilli', 'Amchur (Dried Mango)', 'Cumin', 'Fennel Seeds (Saunf)', 'Black Salt', 'Black Pepper', 'Cloves', 'Cinnamon', 'Kasuri Methi'],
    benefits: [
      'Brings iconic Mumbai street aroma right to home kitchens',
      'Natural tanginess without artificial citric acid additives',
      'Superb buttery caramelization properties'
    ],
    storageInstructions: 'Store in a cool dry place away from heat and direct sunlight.',
    aromaProfile: 'Punchy, citrus-tart, fennel-accented and deeply savory.',
    spicinessLevel: 3,
    isFeatured: false,
    status: 'active',
    bestFor: ['Classic Pav Bhaji', 'Tawa Pulao', 'Spiced Butter Buns', 'Masala Pav'],
    createdAt: '2026-07-05T12:00:00.000Z',
    updatedAt: '2026-08-08T11:20:00.000Z',
    salesCount: 290
  },
  {
    id: 'prod-kasuri-methi',
    name: 'ENU Nagaur Hand-Cured Kasuri Methi',
    slug: 'enu-nagaur-kasuri-methi',
    categoryId: 'cat-herbs',
    categoryName: 'Dried Herbs & Seasonings',
    subcategoryId: 'sub-nagaur-methi',
    subcategoryName: 'Hand-Picked Leaves',
    weightOptions: [
      { id: 'var-km-50', weight: '50g Pack', price: 110, originalPrice: 130, stock: 75, sku: 'ENU-KM-50', isDefault: true },
      { id: 'var-km-100', weight: '100g Pack', price: 195, originalPrice: 240, stock: 44, sku: 'ENU-KM-100', isDefault: false }
    ],
    defaultWeight: '50g Pack',
    price: 110,
    originalPrice: 130,
    shortDescription: 'Shade-dried tender whole fenugreek leaves grown in the arid mineral soils of Nagaur.',
    fullDescription: 'World-renowned Nagaur fenugreek leaves harvested at peak maturity just before flowering. Hand-cleaned to eliminate stalks, then dried in shaded desert rooms to preserve vibrant chlorophyll green color and intoxicating butter-caramel perfume.',
    image: 'https://images.unsplash.com/photo-1599940824399-b87987ceb72a?auto=format&fit=crop&w=600&q=80',
    secondaryImages: [],
    ingredients: ['100% Nagaur Sun-Shade Cured Fenugreek Leaves (Trigonella foenum-graecum)'],
    benefits: [
      'Intense maple-caramel aroma when rubbed between palms',
      'Crisp, clean, stalk-free premium grade',
      'Imparts royal restaurant finish to gravies and parathas'
    ],
    storageInstructions: 'Keep pouch tightly sealed; crush between palms right before adding to sizzling dishes.',
    aromaProfile: 'Sweet herbal, warm maple, savory caramelized green notes.',
    spicinessLevel: 1,
    isFeatured: true,
    status: 'active',
    bestFor: ['Butter Chicken', 'Paneer Gravies', 'Methi Paratha', 'Dal Tadka', 'Kofta Curries'],
    createdAt: '2026-07-10T15:00:00.000Z',
    updatedAt: '2026-08-14T08:00:00.000Z',
    salesCount: 540
  },
  {
    id: 'prod-coriander-powder',
    name: 'ENU Cold-Ground Ramganj Coriander Powder',
    slug: 'enu-ramganj-coriander-powder',
    categoryId: 'cat-singles',
    categoryName: 'Pure Ground Spices',
    subcategoryId: 'sub-coriander',
    subcategoryName: 'Aromatic Corianders',
    weightOptions: [
      { id: 'var-cp-100', weight: '100g', price: 125, originalPrice: 150, stock: 70, sku: 'ENU-CP-100', isDefault: false },
      { id: 'var-cp-200', weight: '200g', price: 230, originalPrice: 280, stock: 45, sku: 'ENU-CP-200', isDefault: true },
      { id: 'var-cp-500', weight: '500g', price: 520, originalPrice: 640, stock: 14, sku: 'ENU-CP-500', isDefault: false }
    ],
    defaultWeight: '200g',
    price: 230,
    originalPrice: 280,
    shortDescription: 'Selected green coriander seeds milled cold to retain lush citrusy sweetness and body.',
    fullDescription: 'Selected from the famous coriander mandis of Ramganj Mandi, Rajasthan. Premium round parrot-green seeds chosen for their essential linalool oil concentration, delivering exceptional aroma and natural sauce thickening.',
    image: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=600&q=80',
    secondaryImages: [],
    ingredients: ['100% Selected Rajasthan Green Coriander Seeds (Dhania)'],
    benefits: [
      'Gives natural thickness and body to Indian curries',
      'High natural linalool and vitamin C retention',
      'Zero starch or husk fillers'
    ],
    storageInstructions: 'Store in a cool dry cabinet in an airtight container.',
    aromaProfile: 'Lemony, sweet, floral and delicately woodsy.',
    spicinessLevel: 1,
    isFeatured: false,
    status: 'active',
    bestFor: ['Daily Sabzis', 'Curry Bases', 'Marinations', 'Kadhi', 'Samosa Fillings'],
    createdAt: '2026-07-12T10:00:00.000Z',
    updatedAt: '2026-08-09T16:20:00.000Z',
    salesCount: 380
  },
  {
    id: 'prod-chaat-masala',
    name: 'ENU Chunky Tangy Chaat Masala',
    slug: 'enu-chunky-chaat-masala',
    categoryId: 'cat-blends',
    categoryName: 'Specialty Blends',
    subcategoryId: 'sub-street-blends',
    subcategoryName: 'Street Food & Chaat',
    weightOptions: [
      { id: 'var-cm-100', weight: '100g', price: 155, originalPrice: 180, stock: 50, sku: 'ENU-CM-100', isDefault: true },
      { id: 'var-cm-200', weight: '200g', price: 280, originalPrice: 340, stock: 22, sku: 'ENU-CM-200', isDefault: false }
    ],
    defaultWeight: '100g',
    price: 155,
    originalPrice: 180,
    shortDescription: 'Zesty blend of Himalayan rock salt, sun-dried mango, pomegranate seeds and roasted cumin.',
    fullDescription: 'The irresistible zing that makes Indian salads, snacks, and street food memorable. Combines wild anardana (pomegranate seed), black salt from Sambhar Lake, tart amchur, mint powder, and crushed peppercorns.',
    image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=600&q=80',
    secondaryImages: [],
    ingredients: ['Black Salt (Kala Namak)', 'Dried Green Mango (Amchur)', 'Cumin', 'Pomegranate Seeds (Anardana)', 'Black Pepper', 'Dry Mint', 'Ginger', 'Asafoetida'],
    benefits: [
      'Instant burst of mouth-watering umami and tanginess',
      'Digestive support with black salt and wild pomegranate',
      'Versatile sprinkle for fruits, salads, and drinks'
    ],
    storageInstructions: 'Keep in shaker with sealed cap to prevent moisture caking.',
    aromaProfile: 'Sour, sulfurous-savory, minty and zesty with roasted cumin top notes.',
    spicinessLevel: 2,
    isFeatured: false,
    status: 'active',
    bestFor: ['Fresh Fruit Platters', 'Papdi Chaat', 'Dahi Vada', 'Crispy Pakoras', 'Spiced Buttermilk'],
    createdAt: '2026-07-15T11:30:00.000Z',
    updatedAt: '2026-08-07T13:40:00.000Z',
    salesCount: 340
  }
];

export const INITIAL_COMBOS: Combo[] = [
  {
    id: 'combo-daily-essentials',
    title: 'Daily Kitchen Heritage Trio',
    subtitle: 'The fundamental trio every Indian household relies upon daily',
    slug: 'daily-kitchen-heritage-trio',
    category: 'Essential Collections',
    tag: 'Daily Cooking',
    badge: 'Bestseller',
    description: 'Our most-loved daily cooking trio containing High-Curcumin Lakadong Turmeric, Kashmiri & Guntur Hand-Pounded Chilli, and Cold-Ground Ramganj Coriander.',
    fullStory: 'Before royal masalas, there is the sacred trinity: Haldi, Mirch, Dhania. This combo sources the very finest single-origin harvests from Meghalaya, Kashmir, and Rajasthan to ensure your daily homestyle meals taste like pure tradition.',
    image: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=800&q=80',
    discountPercent: 18,
    chefTip: 'Bloom the coriander and turmeric first in medium-hot ghee, then add chilli powder off heat to retain brilliant red color without scorching.',
    highlights: [
      '100% pure single-origin Indian spices',
      'No added starches, dyes, or artificial colorings',
      'Cold-ground below 38°C to retain all natural volatile oils',
      'Saves ₹140 compared to buying individually'
    ],
    idealRecipes: ['Homestyle Dal Tadka', 'Jeera Aloo', 'Paneer Bhurji', 'Curry Base Tadka'],
    status: 'active',
    items: [
      {
        productId: 'prod-turmeric-powder',
        weight: '200g',
        role: 'Golden Healing Base',
        description: 'Potent 7.5% curcumin Meghalaya turmeric for color and wellness.',
        keyNotes: ['7.5% Active Curcumin', 'Vibrant Golden Hue', 'Clean Earthy Aroma']
      },
      {
        productId: 'prod-red-chilli',
        weight: '200g',
        role: 'Crimson Warmth & Color',
        description: 'Deep natural red hue with balanced medium heat.',
        keyNotes: ['Natural Capsanthin', 'Mild-Medium Heat', 'Sun-Dried Purity']
      },
      {
        productId: 'prod-coriander-powder',
        weight: '200g',
        role: 'Sauce Body & Fragrance',
        description: 'Rajasthan green dhania providing citrusy sweetness and gravy body.',
        keyNotes: ['Linalool Rich', 'Cold-Ground', 'Natural Curry Thickener']
      }
    ],
    originalPrice: 785,
    discountedPrice: 640,
    createdAt: '2026-07-20T10:00:00.000Z',
    updatedAt: '2026-08-14T12:00:00.000Z'
  },
  {
    id: 'combo-royal-curry-kit',
    title: 'The Royal Feast & Biryani Master Kit',
    subtitle: 'Everything needed to recreate palace-worthy festive banquets',
    slug: 'royal-feast-biryani-master-kit',
    category: 'Gourmet Blends',
    tag: 'Festive & Royal',
    badge: 'Chef Choice',
    description: 'A curated kit of ENU Royal Garam Masala, Shahi Dum Biryani Masala with saffron, and Nagaur Kasuri Methi leaves.',
    fullStory: 'Curated for weekend banquets and celebratory family dinners. Combine the warming depths of our 14-spice Garam Masala with the saffron-scented Biryani Masala and finish with hand-cured Kasuri Methi.',
    image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=800&q=80',
    discountPercent: 20,
    chefTip: 'Sprinkle the Garam Masala and hand-crushed Kasuri Methi into the pot during the final 3 minutes of simmering, then cover tightly to trap the vapors.',
    highlights: [
      'Contains authentic Kashmiri saffron and green cardamom quills',
      'Whole Nagaur shade-dried whole leaves',
      'Coarse slow-milled texture for gradual aroma release',
      'Comes with a complimentary brass measuring spoon'
    ],
    idealRecipes: ['Hyderabadi Dum Biryani', 'Shahi Paneer', 'Mughlai Mutton Korma', 'Dal Makhani'],
    status: 'active',
    items: [
      {
        productId: 'prod-garam-masala',
        weight: '200g',
        role: 'Royal Aromatic Crown',
        description: 'Slow-roasted blend of 14 whole spices.',
        keyNotes: ['14 Whole Spices', 'Iron Griddle Roasted', 'Intense Fragrance']
      },
      {
        productId: 'prod-biryani-masala',
        weight: '200g',
        role: 'Saffron Rice Perfume',
        description: 'Awadhi recipe with saffron strands, shahi jeera and damask rose.',
        keyNotes: ['Real Saffron Strands', 'Awadhi Palace Recipe', 'Rose & Cardamom Bouquet']
      },
      {
        productId: 'prod-kasuri-methi',
        weight: '50g Pack',
        role: 'Velvety Finish',
        description: 'Fragrant Nagaur whole fenugreek leaves for rich restaurant gravies.',
        keyNotes: ['Nagaur Harvest', 'Sweet Maple Scent', 'Stalk-Free Whole Leaves']
      }
    ],
    originalPrice: 840,
    discountedPrice: 670,
    createdAt: '2026-07-22T14:00:00.000Z',
    updatedAt: '2026-08-15T09:30:00.000Z'
  },
  {
    id: 'combo-street-food-box',
    title: 'Bombay Street Food & Chaat Box',
    subtitle: 'Relive the electric flavors of Mumbai beachside food stalls',
    slug: 'bombay-street-food-chaat-box',
    category: 'Street Specials',
    tag: 'Street Food',
    badge: 'Popular',
    description: 'Chunky Chaat Masala, Bombay Pav Bhaji Masala, and Signature Kitchen King for the ultimate weekend street food party.',
    fullStory: 'Recreate the irresistible sizzle of iron tawas and the mouth-watering tang of chaat counters at home. Includes our top-rated Pav Bhaji and Chaat blends crafted with authentic sun-dried amchur and rock salts.',
    image: 'https://images.unsplash.com/photo-1606491956689-2ea866880c84?auto=format&fit=crop&w=800&q=80',
    discountPercent: 15,
    chefTip: 'For authentic Pav Bhaji, toast the pav buns on the same spiced buttery tawa right after plating the bhaji.',
    highlights: [
      'Real amchur and anardana tanginess',
      'Perfect for quick weekend snacks and family chaat nights',
      'Zero artificial MSG or chemical enhancers'
    ],
    idealRecipes: ['Mumbai Pav Bhaji', 'Fruit Chaat Platters', 'Tawa Pulao', 'Samosa Chaat'],
    status: 'active',
    items: [
      {
        productId: 'prod-pav-bhaji',
        weight: '200g',
        role: 'Buttery Tawa Magic',
        description: 'Chowpatty style blend with fennel, amchur and roasted cumin.',
        keyNotes: ['Fennel & Cumin Balance', 'Rich Butter Emulsion', 'Mumbai Authentic']
      },
      {
        productId: 'prod-chaat-masala',
        weight: '200g',
        role: 'Zesty Umami Zing',
        description: 'Wild pomegranate and black salt seasoning.',
        keyNotes: ['Wild Anardana', 'Sambhar Black Salt', 'Instant Zing']
      },
      {
        productId: 'prod-kitchen-king',
        weight: '200g',
        role: 'Savory Base Booster',
        description: 'All-purpose vegetable flavor booster.',
        keyNotes: ['Multi-Purpose Spice', 'Warm Ginger Notes', 'Savory Depth']
      }
    ],
    originalPrice: 900,
    discountedPrice: 765,
    createdAt: '2026-07-25T16:00:00.000Z',
    updatedAt: '2026-08-10T11:00:00.000Z'
  }
];

export const INITIAL_USERS: User[] = [
  {
    id: 'usr-1',
    name: 'Ananya Sharma',
    email: 'ananya.sharma@gmail.com',
    phone: '+91 98201 45678',
    status: 'active',
    joinedDate: '2026-03-15T10:00:00.000Z',
    lastOrderDate: '2026-08-14T18:30:00.000Z',
    totalOrders: 6,
    totalSpent: 4850,
    averageOrderValue: 808,
    addresses: [
      { id: 'addr-1', type: 'Home', street: 'Flat 402, Green Glen Heights, Bellandur', city: 'Bengaluru', state: 'Karnataka', pincode: '560103', isDefault: true },
      { id: 'addr-2', type: 'Work', street: 'Tower B, Tech Park, Outer Ring Road', city: 'Bengaluru', state: 'Karnataka', pincode: '560103', isDefault: false }
    ],
    activityHistory: [
      { id: 'act-1', action: 'Placed Order #ENU-8842', timestamp: '2026-08-14T18:30:00.000Z', details: 'Ordered Daily Kitchen Heritage Trio + Kasuri Methi' },
      { id: 'act-2', action: 'Reviewed ENU Garam Masala', timestamp: '2026-08-01T14:15:00.000Z', details: 'Rated 5 stars: Unbelievable aroma in Dum Aloo!' }
    ]
  },
  {
    id: 'usr-2',
    name: 'Vikramaditya Rathore',
    email: 'vikram.rathore@outlook.com',
    phone: '+91 98112 34567',
    status: 'active',
    joinedDate: '2026-04-02T11:20:00.000Z',
    lastOrderDate: '2026-08-13T12:45:00.000Z',
    totalOrders: 4,
    totalSpent: 3620,
    averageOrderValue: 905,
    addresses: [
      { id: 'addr-3', type: 'Home', street: 'B-14, Maharani Bagh', city: 'New Delhi', state: 'Delhi', pincode: '110065', isDefault: true }
    ],
    activityHistory: [
      { id: 'act-3', action: 'Placed Order #ENU-8835', timestamp: '2026-08-13T12:45:00.000Z', details: 'Ordered The Royal Feast Kit' }
    ]
  },
  {
    id: 'usr-3',
    name: 'Pooja Hegde',
    email: 'pooja.hegde@yahoo.com',
    phone: '+91 97405 88912',
    status: 'active',
    joinedDate: '2026-04-18T09:10:00.000Z',
    lastOrderDate: '2026-08-12T15:20:00.000Z',
    totalOrders: 5,
    totalSpent: 4210,
    averageOrderValue: 842,
    addresses: [
      { id: 'addr-4', type: 'Home', street: '304, Palm Springs, Juhu Tara Road', city: 'Mumbai', state: 'Maharashtra', pincode: '400049', isDefault: true }
    ],
    activityHistory: [
      { id: 'act-4', action: 'Placed Order #ENU-8828', timestamp: '2026-08-12T15:20:00.000Z', details: 'Ordered Udupi Sambhar + Lakadong Turmeric' }
    ]
  },
  {
    id: 'usr-4',
    name: 'Rajesh Mukherjee',
    email: 'rajesh.mukherjee@tcs.com',
    phone: '+91 98302 99123',
    status: 'active',
    joinedDate: '2026-05-10T14:40:00.000Z',
    lastOrderDate: '2026-08-10T11:15:00.000Z',
    totalOrders: 3,
    totalSpent: 2190,
    averageOrderValue: 730,
    addresses: [
      { id: 'addr-5', type: 'Home', street: 'Salt Lake Sector 2, Block FD', city: 'Kolkata', state: 'West Bengal', pincode: '700091', isDefault: true }
    ],
    activityHistory: [
      { id: 'act-5', action: 'Placed Order #ENU-8812', timestamp: '2026-08-10T11:15:00.000Z', details: 'Ordered Garam Masala + Biryani Masala' }
    ]
  },
  {
    id: 'usr-5',
    name: 'Meera Krishnan',
    email: 'meera.krishnan@rediffmail.com',
    phone: '+91 94441 56789',
    status: 'active',
    joinedDate: '2026-05-24T16:00:00.000Z',
    lastOrderDate: '2026-08-08T19:00:00.000Z',
    totalOrders: 8,
    totalSpent: 7150,
    averageOrderValue: 893,
    addresses: [
      { id: 'addr-6', type: 'Home', street: '12, 4th Main Road, RA Puram', city: 'Chennai', state: 'Tamil Nadu', pincode: '600028', isDefault: true }
    ],
    activityHistory: [
      { id: 'act-6', action: 'Placed Order #ENU-8798', timestamp: '2026-08-08T19:00:00.000Z', details: 'Ordered 4x Sambhar Masala + Dhania' }
    ]
  },
  {
    id: 'usr-6',
    name: 'Gaurav Kulkarni',
    email: 'gaurav.kulkarni@gmail.com',
    phone: '+91 98220 77654',
    status: 'inactive',
    joinedDate: '2026-06-01T08:20:00.000Z',
    lastOrderDate: '2026-06-15T14:30:00.000Z',
    totalOrders: 1,
    totalSpent: 640,
    averageOrderValue: 640,
    addresses: [
      { id: 'addr-7', type: 'Home', street: 'Aundh Road, Near D-Mart', city: 'Pune', state: 'Maharashtra', pincode: '411007', isDefault: true }
    ],
    activityHistory: [
      { id: 'act-7', action: 'Account Created', timestamp: '2026-06-01T08:20:00.000Z' }
    ]
  }
];

export const INITIAL_ORDERS: Order[] = [
  {
    id: 'ord-8842',
    orderNumber: 'ENU-8842',
    customer: {
      id: 'usr-1',
      name: 'Ananya Sharma',
      email: 'ananya.sharma@gmail.com',
      phone: '+91 98201 45678',
      address: { street: 'Flat 402, Green Glen Heights, Bellandur', city: 'Bengaluru', state: 'Karnataka', pincode: '560103', country: 'India' }
    },
    items: [
      { productId: 'prod-turmeric-powder', productName: 'ENU Lakadong High-Curcumin Turmeric', image: 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&w=300&q=80', weight: '200g', price: 260, quantity: 1, subtotal: 260 },
      { productId: 'prod-red-chilli', productName: 'ENU Kashmiri & Guntur Hand-Pounded Chilli', image: 'https://images.unsplash.com/photo-1588252303782-cb80119abd6d?auto=format&fit=crop&w=300&q=80', weight: '200g', price: 295, quantity: 1, subtotal: 295 },
      { productId: 'prod-kasuri-methi', productName: 'ENU Nagaur Hand-Cured Kasuri Methi', image: 'https://images.unsplash.com/photo-1599940824399-b87987ceb72a?auto=format&fit=crop&w=300&q=80', weight: '50g Pack', price: 110, quantity: 2, subtotal: 220 }
    ],
    subtotal: 775,
    discount: 50,
    shippingFee: 0,
    tax: 36,
    total: 761,
    paymentStatus: 'paid',
    paymentMethod: 'UPI',
    orderStatus: 'processing',
    trackingNumber: 'BLR-EXP-99210',
    carrier: 'BlueDart Express',
    notes: 'Please pack in eco-friendly cardboard box.',
    createdAt: '2026-08-14T18:30:00.000Z',
    updatedAt: '2026-08-15T09:10:00.000Z',
    statusHistory: [
      { status: 'pending', timestamp: '2026-08-14T18:30:00.000Z', note: 'Order created by customer' },
      { status: 'confirmed', timestamp: '2026-08-14T18:32:00.000Z', note: 'Payment verified via UPI' },
      { status: 'processing', timestamp: '2026-08-15T09:10:00.000Z', note: 'Order sent to packaging unit at Mysore facility' }
    ]
  },
  {
    id: 'ord-8835',
    orderNumber: 'ENU-8835',
    customer: {
      id: 'usr-2',
      name: 'Vikramaditya Rathore',
      email: 'vikram.rathore@outlook.com',
      phone: '+91 98112 34567',
      address: { street: 'B-14, Maharani Bagh', city: 'New Delhi', state: 'Delhi', pincode: '110065', country: 'India' }
    },
    items: [
      { productId: 'prod-biryani-masala', productName: 'ENU Shahi Dum Biryani Masala', image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=300&q=80', weight: '200g', price: 390, quantity: 2, subtotal: 780 },
      { productId: 'prod-garam-masala', productName: 'ENU Royal Garam Masala', image: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=300&q=80', weight: '200g', price: 340, quantity: 1, subtotal: 340 }
    ],
    subtotal: 1120,
    discount: 100,
    shippingFee: 0,
    tax: 51,
    total: 1071,
    paymentStatus: 'paid',
    paymentMethod: 'Credit Card',
    orderStatus: 'shipped',
    trackingNumber: 'DEL-DTDC-44129',
    carrier: 'DTDC Priority',
    createdAt: '2026-08-13T12:45:00.000Z',
    updatedAt: '2026-08-14T16:20:00.000Z',
    statusHistory: [
      { status: 'pending', timestamp: '2026-08-13T12:45:00.000Z', note: 'Order created' },
      { status: 'confirmed', timestamp: '2026-08-13T12:46:00.000Z', note: 'Credit Card authenticated' },
      { status: 'processing', timestamp: '2026-08-14T09:00:00.000Z', note: 'Spices batch certified and boxed' },
      { status: 'shipped', timestamp: '2026-08-14T16:20:00.000Z', note: 'Dispatched from Delhi hub' }
    ]
  },
  {
    id: 'ord-8828',
    orderNumber: 'ENU-8828',
    customer: {
      id: 'usr-3',
      name: 'Pooja Hegde',
      email: 'pooja.hegde@yahoo.com',
      phone: '+91 97405 88912',
      address: { street: '304, Palm Springs, Juhu Tara Road', city: 'Mumbai', state: 'Maharashtra', pincode: '400049', country: 'India' }
    },
    items: [
      { productId: 'prod-sambhar-masala', productName: 'ENU Traditional Udupi Sambhar Masala', image: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=300&q=80', weight: '200g', price: 310, quantity: 2, subtotal: 620 },
      { productId: 'prod-chaat-masala', productName: 'ENU Chunky Tangy Chaat Masala', image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=300&q=80', weight: '100g', price: 155, quantity: 2, subtotal: 310 }
    ],
    subtotal: 930,
    discount: 50,
    shippingFee: 0,
    tax: 44,
    total: 924,
    paymentStatus: 'paid',
    paymentMethod: 'UPI',
    orderStatus: 'delivered',
    trackingNumber: 'BOM-EXP-11029',
    carrier: 'BlueDart Express',
    createdAt: '2026-08-12T15:20:00.000Z',
    updatedAt: '2026-08-14T14:10:00.000Z',
    statusHistory: [
      { status: 'pending', timestamp: '2026-08-12T15:20:00.000Z', note: 'Order placed' },
      { status: 'confirmed', timestamp: '2026-08-12T15:21:00.000Z', note: 'Paid via GPay UPI' },
      { status: 'processing', timestamp: '2026-08-13T08:30:00.000Z', note: 'Packed' },
      { status: 'shipped', timestamp: '2026-08-13T16:00:00.000Z', note: 'In transit to Mumbai' },
      { status: 'delivered', timestamp: '2026-08-14T14:10:00.000Z', note: 'Delivered at security desk' }
    ]
  },
  {
    id: 'ord-8812',
    orderNumber: 'ENU-8812',
    customer: {
      id: 'usr-4',
      name: 'Rajesh Mukherjee',
      email: 'rajesh.mukherjee@tcs.com',
      phone: '+91 98302 99123',
      address: { street: 'Salt Lake Sector 2, Block FD', city: 'Kolkata', state: 'West Bengal', pincode: '700091', country: 'India' }
    },
    items: [
      { productId: 'prod-pav-bhaji', productName: 'ENU Bombay Street-Style Pav Bhaji Masala', image: 'https://images.unsplash.com/photo-1606491956689-2ea866880c84?auto=format&fit=crop&w=300&q=80', weight: '100g', price: 175, quantity: 2, subtotal: 350 },
      { productId: 'prod-kitchen-king', productName: 'ENU Signature Kitchen King Masala', image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=300&q=80', weight: '200g', price: 300, quantity: 1, subtotal: 300 }
    ],
    subtotal: 650,
    discount: 0,
    shippingFee: 49,
    tax: 35,
    total: 734,
    paymentStatus: 'paid',
    paymentMethod: 'Net Banking',
    orderStatus: 'delivered',
    createdAt: '2026-08-10T11:15:00.000Z',
    updatedAt: '2026-08-13T12:00:00.000Z',
    statusHistory: [
      { status: 'pending', timestamp: '2026-08-10T11:15:00.000Z', note: 'Order placed' },
      { status: 'confirmed', timestamp: '2026-08-10T11:18:00.000Z', note: 'HDFC Net Banking confirmed' },
      { status: 'shipped', timestamp: '2026-08-11T14:00:00.000Z', note: 'Dispatched to Kolkata Hub' },
      { status: 'delivered', timestamp: '2026-08-13T12:00:00.000Z', note: 'Received by customer' }
    ]
  },
  {
    id: 'ord-8805',
    orderNumber: 'ENU-8805',
    customer: {
      id: 'usr-5',
      name: 'Meera Krishnan',
      email: 'meera.krishnan@rediffmail.com',
      phone: '+91 94441 56789',
      address: { street: '12, 4th Main Road, RA Puram', city: 'Chennai', state: 'Tamil Nadu', pincode: '600028', country: 'India' }
    },
    items: [
      { productId: 'prod-sambhar-masala', productName: 'ENU Traditional Udupi Sambhar Masala', image: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=300&q=80', weight: '200g', price: 310, quantity: 4, subtotal: 1240 }
    ],
    subtotal: 1240,
    discount: 100,
    shippingFee: 0,
    tax: 57,
    total: 1197,
    paymentStatus: 'paid',
    paymentMethod: 'UPI',
    orderStatus: 'delivered',
    createdAt: '2026-08-08T19:00:00.000Z',
    updatedAt: '2026-08-11T16:30:00.000Z',
    statusHistory: [
      { status: 'pending', timestamp: '2026-08-08T19:00:00.000Z', note: 'Order placed' },
      { status: 'confirmed', timestamp: '2026-08-08T19:02:00.000Z', note: 'Paid via PhonePe' },
      { status: 'delivered', timestamp: '2026-08-11T16:30:00.000Z', note: 'Handed over directly' }
    ]
  },
  {
    id: 'ord-8850',
    orderNumber: 'ENU-8850',
    customer: {
      id: 'usr-1',
      name: 'Ananya Sharma',
      email: 'ananya.sharma@gmail.com',
      phone: '+91 98201 45678',
      address: { street: 'Flat 402, Green Glen Heights, Bellandur', city: 'Bengaluru', state: 'Karnataka', pincode: '560103', country: 'India' }
    },
    items: [
      { productId: 'prod-garam-masala', productName: 'ENU Royal Garam Masala', image: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=300&q=80', weight: '500g', price: 780, quantity: 1, subtotal: 780 }
    ],
    subtotal: 780,
    discount: 0,
    shippingFee: 0,
    tax: 39,
    total: 819,
    paymentStatus: 'pending',
    paymentMethod: 'Cash on Delivery',
    orderStatus: 'pending',
    notes: 'Please deliver after 6 PM.',
    createdAt: '2026-08-15T21:10:00.000Z',
    updatedAt: '2026-08-15T21:10:00.000Z',
    statusHistory: [
      { status: 'pending', timestamp: '2026-08-15T21:10:00.000Z', note: 'COD order placed, awaiting tele-confirmation' }
    ]
  }
];

export const INITIAL_PAYMENTS: Payment[] = [
  {
    id: 'pay-901',
    orderId: 'ord-8842',
    orderNumber: 'ENU-8842',
    customerName: 'Ananya Sharma',
    customerEmail: 'ananya.sharma@gmail.com',
    amount: 761,
    method: 'UPI',
    status: 'paid',
    transactionId: 'UPI-RAZOR-9912048',
    date: '2026-08-14T18:32:00.000Z',
    gateway: 'Razorpay UPI (GooglePay)'
  },
  {
    id: 'pay-902',
    orderId: 'ord-8835',
    orderNumber: 'ENU-8835',
    customerName: 'Vikramaditya Rathore',
    customerEmail: 'vikram.rathore@outlook.com',
    amount: 1071,
    method: 'Credit Card',
    status: 'paid',
    transactionId: 'CC-HDFC-8821034',
    date: '2026-08-13T12:46:00.000Z',
    gateway: 'HDFC PG / Visa'
  },
  {
    id: 'pay-903',
    orderId: 'ord-8828',
    orderNumber: 'ENU-8828',
    customerName: 'Pooja Hegde',
    customerEmail: 'pooja.hegde@yahoo.com',
    amount: 924,
    method: 'UPI',
    status: 'paid',
    transactionId: 'UPI-PHONEPE-334109',
    date: '2026-08-12T15:21:00.000Z',
    gateway: 'PhonePe Gateway'
  },
  {
    id: 'pay-904',
    orderId: 'ord-8812',
    orderNumber: 'ENU-8812',
    customerName: 'Rajesh Mukherjee',
    customerEmail: 'rajesh.mukherjee@tcs.com',
    amount: 734,
    method: 'Net Banking',
    status: 'paid',
    transactionId: 'NB-HDFC-1049281',
    date: '2026-08-10T11:18:00.000Z',
    gateway: 'HDFC NetBanking'
  },
  {
    id: 'pay-905',
    orderId: 'ord-8805',
    orderNumber: 'ENU-8805',
    customerName: 'Meera Krishnan',
    customerEmail: 'meera.krishnan@rediffmail.com',
    amount: 1197,
    method: 'UPI',
    status: 'paid',
    transactionId: 'UPI-GPAY-7761023',
    date: '2026-08-08T19:02:00.000Z',
    gateway: 'Razorpay UPI'
  },
  {
    id: 'pay-906',
    orderId: 'ord-8850',
    orderNumber: 'ENU-8850',
    customerName: 'Ananya Sharma',
    customerEmail: 'ananya.sharma@gmail.com',
    amount: 819,
    method: 'Cash on Delivery',
    status: 'pending',
    transactionId: 'COD-PENDING-8850',
    date: '2026-08-15T21:10:00.000Z',
    gateway: 'Cash on Delivery'
  }
];
