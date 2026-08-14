import { Product, Category, Recipe, Testimonial, Certification, ManufacturingStep } from '../types';

export const HERO_IMAGE = '/src/assets/images/enu_hero_spices_1786092718165.jpg';
export const TRADITION_IMAGE = '/src/assets/images/enu_tradition_spice_1786092769919.jpg';

export const CATEGORIES: Category[] = [
  {
    id: 'sambhar-masala',
    name: 'Sambhar Masala',
    description: 'Aromatic blend of roasted lentils and whole spices for authentic South Indian Sambhar.',
    image: 'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?auto=format&fit=crop&w=800&q=80',
    count: 3,
  },
  {
    id: 'kitchen-king',
    name: 'Kitchen King',
    description: 'The versatile royal spice blend that elevates every everyday vegetable and curry.',
    image: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=800&q=80',
    count: 2,
  },
  {
    id: 'turmeric-powder',
    name: 'Turmeric Powder',
    description: 'High-curcumin golden turmeric sourced from select organic farms of Erode & Lakadong.',
    image: 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&w=800&q=80',
    count: 4,
  },
  {
    id: 'red-chilli-powder',
    name: 'Red Chilli Powder',
    description: 'Rich red color and balanced pungent heat from handpicked Byadgi & Guntur chillies.',
    image: 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?auto=format&fit=crop&w=800&q=80',
    count: 3,
  },
  {
    id: 'coriander-powder',
    name: 'Coriander Powder',
    description: 'Cold-milled green coriander seeds delivering citrusy aroma and rich curry body.',
    image: 'https://images.unsplash.com/photo-1509358217973-883fe8a1e808?auto=format&fit=crop&w=800&q=80',
    count: 3,
  },
  {
    id: 'garam-masala',
    name: 'Garam Masala',
    description: 'Signature 14-spice warming blend slow-roasted to release essential aromatic oils.',
    image: 'https://images.unsplash.com/photo-1599940824399-b87987ceb72a?auto=format&fit=crop&w=800&q=80',
    count: 3,
  },
  {
    id: 'biryani-masala',
    name: 'Biryani Masala',
    description: 'Royal aromatic blend enriched with mace, star anise, cardamom, and shahi jeera.',
    image: 'https://images.unsplash.com/photo-1633945274405-b6c8069047b0?auto=format&fit=crop&w=800&q=80',
    count: 2,
  },
  {
    id: 'pav-bhaji-masala',
    name: 'Pav Bhaji Masala',
    description: 'Mumbai street style tanginess and robust spice balance for irresistible pav bhaji.',
    image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=800&q=80',
    count: 2,
  },
  {
    id: 'kasuri-methi',
    name: 'Kasuri Methi',
    description: 'Naturally shade-dried Nagauri fenugreek leaves with distinct herbal fragrance.',
    image: 'https://images.unsplash.com/photo-1532336414038-cf19250c5757?auto=format&fit=crop&w=800&q=80',
    count: 2,
  },
  {
    id: 'paneer-masala',
    name: 'Paneer Masala',
    description: 'Creamy gravy perfecting spice mix ideal for Shahi Paneer, Kadhai, and Paneer Tikka.',
    image: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?auto=format&fit=crop&w=800&q=80',
    count: 3,
  },
];

export const PRODUCTS: Product[] = [
  {
    id: 'enu-sambhar-masala',
    name: 'ENU Sambhar Masala',
    category: 'Sambhar Masala',
    weightOptions: ['100g', '200g', '500g'],
    defaultWeight: '100g',
    price: 185,
    originalPrice: 240,
    shortDescription: 'Traditional South Indian blend made from slow-roasted coriander, Bengal gram, red chilli, and fenugreek.',
    fullDescription: 'ENU Sambhar Masala captures the age-old culinary secret of authentic Tamil Nadu & Karnataka kitchens. Ground using traditional low-temperature technology, this blend retains volatile aroma oils and delivers a rich, golden, flavorful sambhar gravy without any added MSG, preservatives, or artificial colors.',
    image: 'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?auto=format&fit=crop&w=800&q=80',
    secondaryImages: [
      'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1599940824399-b87987ceb72a?auto=format&fit=crop&w=800&q=80'
    ],
    ingredients: ['Coriander Seeds', 'Bengal Gram', 'Red Chilli', 'Fenugreek', 'Cumin', 'Asafoetida (Hing)', 'Curry Leaves', 'Turmeric', 'Black Pepper'],
    benefits: ['100% Natural & Chemical Free', 'Cold Ground to retain Natural Oils', 'Zero Added Preservatives or Artificial Flavors', 'Rich in Digestive Fiber & Spices'],
    storageInstructions: 'Store in a cool, dry place. Once opened, transfer to an airtight glass container away from direct sunlight.',
    aromaProfile: 'Earthy, roasted legume base with warm citrus notes and gentle heat.',
    spicinessLevel: 3,
    isFeatured: true,
    bestFor: ['Traditional Vegetable Sambhar', 'Idli-Vada Dip', 'Rasam Base', 'Lentil Stews']
  },
  {
    id: 'enu-ginger-garlic-paste',
    name: 'ENU Ginger Garlic Paste',
    category: 'Kitchen King',
    weightOptions: ['200g', '500g', '1kg Jar'],
    defaultWeight: '200g',
    price: 145,
    originalPrice: 190,
    shortDescription: '100% fresh, thick, unadulterated paste ground from prime Himalayan ginger and Desi garlic.',
    fullDescription: 'Crafted with 50% fresh ginger root and 50% peeled garlic cloves without water dilution or artificial thickeners. ENU Ginger Garlic Paste adds instant depth, enticing aroma, and authentic restaurant-style richness to curries, marinades, and gravies.',
    image: 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&w=800&q=80',
    secondaryImages: [
      'https://images.unsplash.com/photo-1509358217973-883fe8a1e808?auto=format&fit=crop&w=800&q=80'
    ],
    ingredients: ['Fresh Ginger (50%)', 'Fresh Garlic (50%)', 'Edible Vegetable Oil', 'Iodized Salt'],
    benefits: ['No Synthetic Acids', 'Thick Granular Texture', 'Saves Prep Time in Kitchen', 'Preserves Natural Pungency'],
    storageInstructions: 'Refrigerate immediately after opening. Use clean, dry spoon for every use.',
    aromaProfile: 'Pungent, zesty, fresh root aroma.',
    spicinessLevel: 2,
    isFeatured: true,
    bestFor: ['Biryani Marinades', 'Paneer Gravies', 'Dal Tadka', 'Non-Veg Curries']
  },
  {
    id: 'enu-garam-masala',
    name: 'ENU Garam Masala',
    category: 'Garam Masala',
    weightOptions: ['50g', '100g', '250g'],
    defaultWeight: '100g',
    price: 210,
    originalPrice: 280,
    shortDescription: 'Master 14-spice warming blend slow-roasted in iron kadhai for royal aroma.',
    fullDescription: 'Our Master Garam Masala is an opulent harmony of whole black cardamom, royal green cardamom, Ceylon cinnamon, star anise, and nutmeg. A tiny pinch sprinkled towards the end of cooking unlocks intoxicating aroma and rich complex flavors.',
    image: 'https://images.unsplash.com/photo-1599940824399-b87987ceb72a?auto=format&fit=crop&w=800&q=80',
    secondaryImages: [
      'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?auto=format&fit=crop&w=800&q=80'
    ],
    ingredients: ['Black Cardamom', 'Green Cardamom', 'Cinnamon', 'Cloves', 'Nutmeg', 'Mace', 'Star Anise', 'Black Pepper', 'Cumin', 'Coriander'],
    benefits: ['100% Whole Spices Ground Fresh', 'No Husk or Starch Fillers', 'High Concentration of Natural Essential Oils'],
    storageInstructions: 'Keep tightly sealed in a cool, dark kitchen cabinet.',
    aromaProfile: 'Warm, sweet-spicy, woody and intoxicatingly aromatic.',
    spicinessLevel: 4,
    isFeatured: true,
    bestFor: ['Final Finishing Pinch on Curries', 'Korma & Rich Gravies', 'Rajma & Chole', 'Pulao']
  },
  {
    id: 'enu-kitchen-king',
    name: 'ENU Kitchen King',
    category: 'Kitchen King',
    weightOptions: ['100g', '200g', '500g'],
    defaultWeight: '100g',
    price: 195,
    originalPrice: 250,
    shortDescription: 'The supreme all-rounder masala for everyday sabzi, curries, and vegetable gravies.',
    fullDescription: 'ENU Kitchen King is expertly balanced so that no single spice overpowers the dish. It enhances the natural sweetness of vegetables while infusing a golden color and rich North Indian dhaba-style taste.',
    image: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=800&q=80',
    ingredients: ['Coriander', 'Cumin', 'Red Chilli', 'Turmeric', 'Fenugreek Leaves', 'Dry Mango Powder', 'Cardamom', 'Ginger', 'Black Salt'],
    benefits: ['Versatile for 50+ Dishes', 'Perfect Balance of Tangy & Spicy', 'Enhances Natural Vegetable Flavor'],
    storageInstructions: 'Store in airtight container away from steam and heat.',
    aromaProfile: 'Balanced, mildly sweet, tangy, and savory.',
    spicinessLevel: 3,
    isFeatured: true,
    bestFor: ['Aloo Gobi', 'Mix Veg Curry', 'Bhindi Masala', 'Stuffed Parathas']
  },
  {
    id: 'enu-turmeric-powder',
    name: 'ENU Turmeric Powder',
    category: 'Turmeric Powder',
    weightOptions: ['100g', '200g', '500g', '1kg Pack'],
    defaultWeight: '200g',
    price: 217,
    originalPrice: 290,
    shortDescription: 'Pure Golden Haldi with guaranteed >5% high curcumin content for health & color.',
    fullDescription: 'Milled from whole finger turmeric roots sourced from pesticide-free farms. ENU Turmeric Powder brings brilliant natural golden color, immunity-boosting antioxidant goodness, and earthy warmth to your daily meals.',
    image: 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&w=800&q=80',
    ingredients: ['100% Pure Whole Turmeric Roots (Haldi)'],
    benefits: ['High Natural Curcumin Content (>5%)', 'No Lead or Chemical Dyes', 'Powerful Anti-Inflammatory Properties'],
    storageInstructions: 'Store in a dark tin or glass box to protect natural yellow pigment.',
    aromaProfile: 'Earthy, slightly bitter, warm and herbal.',
    spicinessLevel: 1,
    isFeatured: true,
    bestFor: ['Golden Haldi Milk', 'Dal Tadka', 'Khichdi', 'Daily Cooking']
  },
  {
    id: 'enu-red-chilli-powder',
    name: 'ENU Red Chilli Powder',
    category: 'Red Chilli Powder',
    weightOptions: ['100g', '200g', '500g'],
    defaultWeight: '200g',
    price: 225,
    originalPrice: 300,
    shortDescription: 'Custom blend of Byadgi for deep ruby red color and Guntur for fiery heat.',
    fullDescription: 'Stemless, sun-dried red chillies stone-milled under chilled conditions. ENU Red Chilli Powder imparts an enviable deep red gravy color without artificial oil sprays or dyes, combined with clean, appetizing heat.',
    image: 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?auto=format&fit=crop&w=800&q=80',
    ingredients: ['Sun-dried Stemless Byadgi & Guntur Red Chillies'],
    benefits: ['100% Free of Added Color / Sudan Red', 'Stemless chilli processing for pure flavor', 'Rich in Vitamin C and Capsaicin'],
    storageInstructions: 'Keep airtight. Avoid damp spoons.',
    aromaProfile: 'Smoky, fiery, pungent chilli fragrance.',
    spicinessLevel: 5,
    isFeatured: false,
    bestFor: ['Tadka & Tempering', 'Pickles', 'Paneer Tikka Marinade', 'Curry Gravies']
  },
  {
    id: 'enu-coriander-powder',
    name: 'ENU Coriander Powder',
    category: 'Coriander Powder',
    weightOptions: ['100g', '200g', '500g'],
    defaultWeight: '200g',
    price: 175,
    originalPrice: 230,
    shortDescription: 'Fresh green Dhaniya powder ground from aromatic whole seeds.',
    fullDescription: 'Processed from green parrot-grade coriander seeds grown in Ramganj Mandi. ENU Coriander Powder lends a thick, aromatic gravy body with subtle citrus undertones that absorb and highlight other spices.',
    image: 'https://images.unsplash.com/photo-1509358217973-883fe8a1e808?auto=format&fit=crop&w=800&q=80',
    ingredients: ['100% Selected Green Coriander Seeds (Dhaniya)'],
    benefits: ['Coarsely Ground for Thick Gravy', 'Retains Essential Linalool Oils', 'Zero Starch Adulteration'],
    storageInstructions: 'Store in cool ambient conditions.',
    aromaProfile: 'Sweet, citrusy, nutty, and herbal.',
    spicinessLevel: 1,
    isFeatured: true,
    bestFor: ['Gravy Thickener', 'Chana Masala', 'Vegetable Fries', 'Sambar & Rasam']
  },
  {
    id: 'enu-biryani-masala',
    name: 'ENU Biryani Masala',
    category: 'Biryani Masala',
    weightOptions: ['100g', '200g'],
    defaultWeight: '100g',
    price: 240,
    originalPrice: 320,
    shortDescription: 'Mughlai style aromatic spice blend for restaurant-grade Dum Biryani.',
    fullDescription: 'Hand-blended with whole mace, dagad phool (black stone flower), green cardamom, nutmeg, and caraway seeds. Transforms basmati rice and vegetables into an aromatic masterpiece.',
    image: 'https://images.unsplash.com/photo-1633945274405-b6c8069047b0?auto=format&fit=crop&w=800&q=80',
    ingredients: ['Mace', 'Nutmeg', 'Shahi Jeera', 'Star Anise', 'Green Cardamom', 'Stone Flower', 'Cinnamon', 'Bay Leaves'],
    benefits: ['Infuses Basmati Grains with Rich Aroma', 'Authentic Lucknowi & Hyderabadi Flavor Profile'],
    storageInstructions: 'Keep in airtight glass jar.',
    aromaProfile: 'Highly aromatic, floral, warm, and regal.',
    spicinessLevel: 3,
    isFeatured: false,
    bestFor: ['Hyderabadi Veg Dum Biryani', 'Kathal Biryani', 'Paneer Pulao']
  },
  {
    id: 'enu-pav-bhaji-masala',
    name: 'ENU Pav Bhaji Masala',
    category: 'Pav Bhaji Masala',
    weightOptions: ['100g', '200g'],
    defaultWeight: '100g',
    price: 180,
    originalPrice: 235,
    shortDescription: 'Tangy, spicy Chowpatty style blend for mouthwatering vegetable bhaji.',
    fullDescription: 'Blend of dry mango powder, star anise, fennel, red chilli, and roasted coriander that recreates authentic Mumbai beachside Pav Bhaji right at home.',
    image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=800&q=80',
    ingredients: ['Coriander', 'Red Chilli', 'Amchur', 'Fennel', 'Cumin', 'Cinnamon', 'Clove', 'Black Salt'],
    benefits: ['Perfect Tangy-Spicy Ratio', 'Creates Rich Red Butter Bhaji Texture'],
    storageInstructions: 'Keep sealed in container.',
    aromaProfile: 'Tangy, savory, fiery and spiced.',
    spicinessLevel: 4,
    isFeatured: false,
    bestFor: ['Mumbai Pav Bhaji', 'Tawa Pulao', 'Masala Pav', 'Stuffed Capsicum']
  },
  {
    id: 'enu-kasuri-methi',
    name: 'ENU Kasuri Methi',
    category: 'Kasuri Methi',
    weightOptions: ['50g', '100g'],
    defaultWeight: '50g',
    price: 135,
    originalPrice: 175,
    shortDescription: 'Naturally shade-dried Nagauri fenugreek leaves bursting with earthy aroma.',
    fullDescription: 'Hand-picked from Rajasthan Nagaur farms, carefully shade-dried to retain natural green chlorophyll and intense fragrance. A quick palm-crush releases instant luxury restaurant aroma into your gravies.',
    image: 'https://images.unsplash.com/photo-1532336414038-cf19250c5757?auto=format&fit=crop&w=800&q=80',
    ingredients: ['100% Shade-Dried Nagauri Fenugreek Leaves (Methi)'],
    benefits: ['Crisp & Fragrant Leaves', 'Zero Dust or Stems', 'Imparts Restaurant-Style Finishing Flavor'],
    storageInstructions: 'Store in moisture-proof zip lock or glass jar.',
    aromaProfile: 'Earthy, herbal, slightly bitter and fragrance-rich.',
    spicinessLevel: 1,
    isFeatured: false,
    bestFor: ['Butter Chicken / Paneer Makhani', 'Methi Paratha', 'Dal Makhani', 'Aloo Methi']
  },
  {
    id: 'enu-paneer-masala',
    name: 'ENU Paneer Masala',
    category: 'Paneer Masala',
    weightOptions: ['100g', '200g'],
    defaultWeight: '100g',
    price: 190,
    originalPrice: 245,
    shortDescription: 'Special blend crafted for rich, velvety paneer gravies and tikkas.',
    fullDescription: 'Specifically formulated to complement cottage cheese. Formulated with roasted cashew powder, kasuri methi, cardamom, and melon seeds for silky, restaurant-style gravy.',
    image: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?auto=format&fit=crop&w=800&q=80',
    ingredients: ['Coriander', 'Cumin', 'Cashew Powder', 'Kashmiri Chilli', 'Kasuri Methi', 'Cardamom', 'Melon Seeds'],
    benefits: ['Rich Silky Gravy Base', 'Blends effortlessly with cream and butter'],
    storageInstructions: 'Store away from humidity.',
    aromaProfile: 'Creamy, mildly spiced, fragrant and luxurious.',
    spicinessLevel: 2,
    isFeatured: false,
    bestFor: ['Paneer Butter Masala', 'Kadhai Paneer', 'Shahi Paneer', 'Paneer Tikka Gravy']
  }
];


export const RECIPES: Recipe[] = [
  {
    id: 'restaurant-sambhar',
    title: 'Restaurant-Style Authentic Sambhar',
    subtitle: 'Classic South Indian lentil stew enriched with ENU Sambhar Masala',
    prepTime: '15 Mins',
    cookTime: '25 Mins',
    difficulty: 'Easy',
    servings: '4 Persons',
    image: 'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?auto=format&fit=crop&w=800&q=80',
    description: 'A comforting, fragrant South Indian stew cooked with Toor Dal, shallots, drumsticks, tamarind pulp, and tempered with ENU Sambhar Masala.',
    enuSpicesUsed: ['ENU Sambhar Masala', 'ENU Turmeric Powder', 'ENU Red Chilli Powder'],
    ingredientsList: [
      '1 Cup Toor Dal (Pigeon Peas), pressure cooked',
      '2 tbsp ENU Sambhar Masala',
      '1/2 tsp ENU Turmeric Powder',
      '1/2 tsp ENU Red Chilli Powder',
      '10-12 Shallots (Sambar Onions), peeled',
      '1 Drumstick, cut into 2-inch pieces',
      '1 Tomato, chopped',
      '2 tbsp Tamarind Pulp',
      '1 tsp Mustard Seeds',
      '1/2 tsp Hing (Asafoetida)',
      'Fresh Curry Leaves & Coriander',
      '2 tbsp Ghee or Oil'
    ],
    instructions: [
      'Pressure cook Toor Dal with ENU Turmeric Powder and 3 cups of water until soft and smooth.',
      'In a thick pot, heat oil, sauté shallots, drumstick, and tomatoes for 4-5 minutes.',
      'Add tamarind water, 1 cup water, and boil until vegetables become tender.',
      'Add 2 tbsp ENU Sambhar Masala dissolved in 3 tbsp water to prevent lumps. Simmer for 5 minutes.',
      'Pour cooked dal into the pot, adjust salt and water consistency, and bring to a gentle boil.',
      'In a small pan, temper mustard seeds, dry red chillies, hing, and curry leaves in hot ghee.',
      'Pour the fragrant crackling temper into the Sambhar, cover immediately, and garnish with fresh cilantro.'
    ]
  },
  {
    id: 'paneer-butter-masala',
    title: 'Royal Paneer Butter Masala',
    subtitle: 'Rich, velvety tomato-cashew gravy made with ENU Paneer Masala & Garam Masala',
    prepTime: '20 Mins',
    cookTime: '20 Mins',
    difficulty: 'Medium',
    servings: '3-4 Persons',
    image: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?auto=format&fit=crop&w=800&q=80',
    description: 'Silky paneer cubes immersed in a rich, buttery, spiced tomato gravy garnished with crushed ENU Kasuri Methi.',
    enuSpicesUsed: ['ENU Paneer Masala', 'ENU Garam Masala', 'ENU Kasuri Methi', 'ENU Ginger Garlic Paste'],
    ingredientsList: [
      '250g Fresh Cottage Cheese (Paneer), cubed',
      '1.5 tbsp ENU Ginger Garlic Paste',
      '2 tbsp ENU Paneer Masala',
      '1/2 tsp ENU Garam Masala',
      '1 tbsp ENU Kasuri Methi, palm crushed',
      '4 Tomatoes & 10 Cashews (puréed together)',
      '2 tbsp Butter + 1 tbsp Oil',
      '3 tbsp Fresh Cream',
      '1 Bay Leaf & 2 Green Cardamoms'
    ],
    instructions: [
      'Melt butter and oil in a kadhai. Add bay leaf and green cardamom.',
      'Sauté 1.5 tbsp ENU Ginger Garlic Paste until golden and raw smell departs.',
      'Add tomato-cashew purée and cook until oil separates on the edges.',
      'Add ENU Paneer Masala, salt, and half cup warm water. Cook gravy for 5 minutes.',
      'Gently fold in paneer cubes and simmer for 3 minutes.',
      'Finish with ENU Garam Masala, fresh cream, and crushed ENU Kasuri Methi on top.'
    ]
  },
  {
    id: 'dal-tadka',
    title: 'Dhaba Style Dhungar Dal Tadka',
    subtitle: 'Golden Arhar Dal with fiery ghee tempering using ENU Turmeric & Red Chilli',
    prepTime: '10 Mins',
    cookTime: '20 Mins',
    difficulty: 'Easy',
    servings: '4 Persons',
    image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=800&q=80',
    description: 'The quintessential North Indian comfort food: creamy boiled yellow dal finished with a crackling ghee temper of garlic, cumin, and ENU Red Chilli Powder.',
    enuSpicesUsed: ['ENU Turmeric Powder', 'ENU Red Chilli Powder', 'ENU Coriander Powder', 'ENU Garam Masala'],
    ingredientsList: [
      '1 Cup Arhar/Toor Dal, washed',
      '1 tsp ENU Turmeric Powder',
      '1 tsp ENU Coriander Powder',
      '1 tsp ENU Red Chilli Powder',
      '1/2 tsp ENU Garam Masala',
      '1 Onion & 2 Tomatoes, finely chopped',
      '1 tbsp ENU Ginger Garlic Paste',
      '2 tbsp Desi Ghee',
      '1 tsp Cumin Seeds & 1/4 tsp Hing'
    ],
    instructions: [
      'Boil dal in pressure cooker with 3.5 cups water, salt, and ENU Turmeric Powder for 3-4 whistles.',
      'Heat 1 tbsp ghee in a pan, sauté onions, ginger garlic paste, tomatoes, and ENU Coriander Powder until mushy.',
      'Pour boiled dal into the pan, stir well and bring to a simmer.',
      'Prepare second tadka in a small iron pan with ghee, cumin seeds, hing, whole red chilli, and ENU Red Chilli Powder.',
      'Pour crackling ghee temper over dal, sprinkle ENU Garam Masala, and cover immediately.'
    ]
  },
  {
    id: 'veg-biryani',
    title: 'Shahi Veg Dum Biryani',
    subtitle: 'Layered Basmati rice & spiced garden vegetables with ENU Biryani Masala',
    prepTime: '30 Mins',
    cookTime: '35 Mins',
    difficulty: 'Advanced',
    servings: '5 Persons',
    image: 'https://images.unsplash.com/photo-1633945274405-b6c8069047b0?auto=format&fit=crop&w=800&q=80',
    description: 'A feast for the senses! Aged long-grain Basmati rice sealed in a handi with yogurt-marinated vegetables and ENU Biryani Masala.',
    enuSpicesUsed: ['ENU Biryani Masala', 'ENU Ginger Garlic Paste', 'ENU Red Chilli Powder', 'ENU Kasuri Methi'],
    ingredientsList: [
      '2 Cups Aged Basmati Rice (70% parboiled with whole spices)',
      '2 Cups Mixed Veggies (Cauliflower, Carrot, Peas, Beans, Potato)',
      '2.5 tbsp ENU Biryani Masala',
      '1 tbsp ENU Ginger Garlic Paste',
      '1/2 Cup Fresh Curd (Yogurt)',
      '1/2 Cup Fried Onions (Birista)',
      '1/4 Cup Saffron Milk & Mint Leaves',
      '3 tbsp Ghee'
    ],
    instructions: [
      'Marinate vegetables with curd, ENU Ginger Garlic Paste, ENU Biryani Masala, and salt for 20 minutes.',
      'In a heavy-bottom handi, cook marinated veggies in ghee for 8-10 minutes until half done.',
      'Spread 70% cooked Basmati rice over the vegetable layer.',
      'Top with fried onions, fresh mint, coriander, saffron milk, and a pinch of ENU Biryani Masala.',
      'Seal lid tightly with dough or aluminum foil and dum cook on low flame for 18 minutes.',
      'Rest for 10 minutes before fluffing gently with a flat spoon.'
    ]
  },
  {
    id: 'masala-khichdi',
    title: 'Ayurvedic Healing Masala Khichdi',
    subtitle: 'Nourishing Moong Dal & Rice tempered with ENU Turmeric & Kitchen King',
    prepTime: '10 Mins',
    cookTime: '15 Mins',
    difficulty: 'Easy',
    servings: '2 Persons',
    image: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=800&q=80',
    description: 'Wholesome, easily digestible pot meal cooked with yellow moong dal, Basmati rice, fresh ghee, turmeric, and ENU Kitchen King.',
    enuSpicesUsed: ['ENU Turmeric Powder', 'ENU Kitchen King', 'ENU Coriander Powder'],
    ingredientsList: [
      '1/2 Cup Rice & 1/2 Cup Split Yellow Moong Dal',
      '1 tsp ENU Turmeric Powder',
      '1 tsp ENU Kitchen King Masala',
      '1/2 tsp Cumin Seeds & 1 Pinch Asafoetida',
      '1 Chopped Tomato & Green Chilli',
      '2 tbsp Pure Desi Ghee'
    ],
    instructions: [
      'Wash rice and moong dal together thoroughly.',
      'Heat ghee in pressure cooker, add cumin, hing, chopped tomato, and green chilli.',
      'Add ENU Turmeric Powder and ENU Kitchen King Masala.',
      'Add rice, dal, 4 cups water, and salt. Pressure cook for 4 whistles.',
      'Serve warm topped with extra Desi Ghee and roasted papad.'
    ]
  },
  {
    id: 'mumbai-pav-bhaji',
    title: 'Chowpatty Special Pav Bhaji',
    subtitle: 'Street-style buttery mashed vegetable curry with ENU Pav Bhaji Masala',
    prepTime: '15 Mins',
    cookTime: '25 Mins',
    difficulty: 'Easy',
    servings: '4 Persons',
    image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=800&q=80',
    description: 'Iconic Mumbai street delicacy made with mashed potatoes, peas, bell peppers, tomatoes, and generous dollops of butter seasoned with ENU Pav Bhaji Masala.',
    enuSpicesUsed: ['ENU Pav Bhaji Masala', 'ENU Red Chilli Powder', 'ENU Kasuri Methi'],
    ingredientsList: [
      '3 Boiled Potatoes, peeled and mashed',
      '1 Cup Boiled Green Peas & Cauliflower',
      '2 tbsp ENU Pav Bhaji Masala',
      '1 tsp ENU Red Chilli Powder',
      '1/2 tsp ENU Kasuri Methi',
      '2 Onions & 3 Tomatoes, finely minced',
      '1 Capsicum, finely diced',
      '3 tbsp Butter',
      'Fresh Coriander & Lemon wedges'
    ],
    instructions: [
      'Heat butter on a tawa or large pan, sauté onions, capsicum, and ginger garlic paste until soft.',
      'Add tomatoes and cook till oil separates.',
      'Add boiled veggies, water, and mash vigorously with a potato masher.',
      'Stir in ENU Pav Bhaji Masala, red chilli powder, and salt. Simmer for 10 minutes.',
      'Garnish with fresh butter, crushed ENU Kasuri Methi, and serve with toasted pav.'
    ]
  },
  {
    id: 'kadai-paneer-delight',
    title: 'Dhabawala Kadai Paneer',
    subtitle: 'Wok-tossed paneer cubes and crunchy bell peppers in robust spiced gravy',
    prepTime: '15 Mins',
    cookTime: '20 Mins',
    difficulty: 'Medium',
    servings: '3-4 Persons',
    image: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?auto=format&fit=crop&w=800&q=80',
    description: 'Fresh paneer tossed with crunchy onions and capsicum in a freshly pounded Kadai masala gravy made with ENU Coriander, Garam Masala, and Ginger Garlic Paste.',
    enuSpicesUsed: ['ENU Garam Masala', 'ENU Coriander Powder', 'ENU Ginger Garlic Paste', 'ENU Kasuri Methi'],
    ingredientsList: [
      '250g Paneer cubes',
      '1 Onion & 1 Capsicum cubed',
      '1 tbsp ENU Ginger Garlic Paste',
      '1.5 tbsp ENU Coriander Powder',
      '1 tsp ENU Garam Masala',
      '1/2 tsp ENU Kasuri Methi',
      '3 Fresh Tomatoes puréed',
      '2 tbsp Ghee'
    ],
    instructions: [
      'In a hot kadai, flash fry capsicum and onion petals in ghee for 2 minutes and set aside.',
      'Sauté ENU Ginger Garlic Paste and tomato purée until oil edges appear.',
      'Add ENU Coriander Powder, salt, and half cup water.',
      'Add paneer cubes, tossed peppers, and simmer for 3 minutes.',
      'Finish with aromatic ENU Garam Masala and palm-crushed ENU Kasuri Methi.'
    ]
  },
  {
    id: 'amritsari-pindi-chole',
    title: 'Authentic Amritsari Pindi Chole',
    subtitle: 'Dark, tangy, slow-simmered chickpea curry seasoned with ENU Kitchen King',
    prepTime: '20 Mins',
    cookTime: '30 Mins',
    difficulty: 'Medium',
    servings: '4 Persons',
    image: 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?auto=format&fit=crop&w=800&q=80',
    description: 'Traditional Punjabi chickpea curry steeped in tea bag infusion and tossed with aromatic ENU Kitchen King and roasted spices.',
    enuSpicesUsed: ['ENU Kitchen King', 'ENU Garam Masala', 'ENU Red Chilli Powder', 'ENU Ginger Garlic Paste'],
    ingredientsList: [
      '2 Cups Boiled Kabuli Chana',
      '2 tbsp ENU Kitchen King',
      '1 tsp ENU Garam Masala',
      '1 tsp ENU Red Chilli Powder',
      '1.5 tbsp ENU Ginger Garlic Paste',
      '2 Onions & 2 Tomatoes puréed',
      '2 tbsp Mustard Oil or Ghee'
    ],
    instructions: [
      'Boil soaked chana with whole spices and tea bag for deep authentic color.',
      'Heat oil, fry ginger garlic paste, onions, and tomato masala until deep brown.',
      'Add ENU Kitchen King and red chilli powder.',
      'Add boiled chickpeas with cooking stock and mash a few for thick gravy body.',
      'Simmer for 15 minutes, finish with hot ghee cumin tadka and ENU Garam Masala.'
    ]
  },
  {
    id: 'chettinad-vegetable-curry',
    title: 'Spicy Chettinad Veg Kurma',
    subtitle: 'Fiery Tamil Nadu coastal curry with coconut and stone-ground spices',
    prepTime: '20 Mins',
    cookTime: '25 Mins',
    difficulty: 'Advanced',
    servings: '4 Persons',
    image: 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&w=800&q=80',
    description: 'A fragrant, spicy South Indian specialty infused with coconut paste, curry leaves, ENU Turmeric, and roasted coriander.',
    enuSpicesUsed: ['ENU Sambhar Masala', 'ENU Turmeric Powder', 'ENU Coriander Powder'],
    ingredientsList: [
      '2 Cups Mixed Diced Vegetables (Carrots, Beans, Potatoes)',
      '1.5 tbsp ENU Sambhar Masala',
      '1/2 tsp ENU Turmeric Powder',
      '1 tsp ENU Coriander Powder',
      '1/2 Cup Fresh Grated Coconut ground to paste',
      'Fresh Curry Leaves, Mustard & Fennel seeds'
    ],
    instructions: [
      'Sauté mustard seeds, curry leaves, and fennel in coconut oil.',
      'Add diced vegetables, ENU Turmeric, and ENU Coriander Powder.',
      'Cook veggies in 1.5 cups water until tender.',
      'Stir in fresh coconut paste and ENU Sambhar Masala.',
      'Simmer on gentle heat for 5 minutes and serve with flaky Malabar Parottas.'
    ]
  }
];

export const TESTIMONIALS: Testimonial[] = [
  {
    id: 't1',
    name: 'Ananya Sharma',
    location: 'Mumbai, Maharashtra',
    rating: 5,
    highlight: 'Amazing Aroma & Purity!',
    comment: 'I have tried many commercial spice brands, but ENU Foods Sambhar Masala and Garam Masala are on another level! The aroma when you open the pouch reminds me of my grandmother stone-milling spices in Mysore. 100% recommended!',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    verified: true,
  },
  {
    id: 't2',
    name: 'Chef Rajesh Verma',
    location: 'Executive Chef, New Delhi',
    rating: 5,
    highlight: 'Dhaba & Restaurant Quality at Home',
    comment: 'As a professional culinary consultant, spice purity and oil retention are non-negotiable for me. ENU Foods Turmeric and Ginger Garlic Paste deliver authentic color and zero bitterness. Their low-temperature grinding truly preserves volatile oils.',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
    verified: true,
  },
  {
    id: 't3',
    name: 'Priya Iyer',
    location: 'Bengaluru, Karnataka',
    rating: 5,
    highlight: 'Premium Packaging & Fresh Taste',
    comment: 'The resealable foil packaging keeps the spices fresh for months! My family noticed the difference in our Sunday Biryani immediately when I switched to ENU Biryani Masala.',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=200&q=80',
    verified: true,
  },
  {
    id: 't4',
    name: 'Vikram Mehta',
    location: 'Ahmedabad, Gujarat',
    rating: 5,
    highlight: 'Zero Preservatives, Pure Organic Feel',
    comment: 'Knowing that ENU Foods uses no added colors or artificial flavor enhancers gives me complete peace of mind when cooking for my kids. Kitchen King masala is now a staple in our home!',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
    verified: true,
  }
];

export const CERTIFICATIONS: Certification[] = [
  { id: 'fssai', title: 'FSSAI License Certified', subtitle: 'Food Safety & Standards Authority of India', iconName: 'ShieldCheck' },
  { id: 'iso', title: 'ISO 22000:2018 Certified', subtitle: 'Global Food Safety Management System', iconName: 'Award' },
  { id: 'made-in-india', title: '100% Made in India', subtitle: 'Supporting Local Organic Farmers', iconName: 'HeartHandshake' },
  { id: 'hygiene', title: 'Hygienically Packed', subtitle: 'Aseptic Touchless Automatic Packaging', iconName: 'Sparkles' },
  { id: 'quality', title: 'Quality Tested & Approved', subtitle: 'Strict Multi-stage Laboratory Testing', iconName: 'CheckCircle2' },
  { id: 'organic', title: 'Pure By Nature', subtitle: 'Zero Artificial Dyes & Preservatives', iconName: 'Leaf' }
];

export const MANUFACTURING_STEPS: ManufacturingStep[] = [
  {
    stepNumber: 1,
    title: 'Ingredient Selection',
    subtitle: 'Sourcing From Prime Organic Belts',
    description: 'We source whole spices directly from accredited organic farming hubs — Byadgi chillies from Karnataka, Erode turmeric from Tamil Nadu, Ramganj coriander from Rajasthan.',
    iconName: 'MapPin',
    detailPoints: ['Farm-gate direct procurement', 'Pesticide & heavy metal screening', 'High essential oil content verification']
  },
  {
    stepNumber: 2,
    title: 'Hygienic Cleaning',
    subtitle: 'Multi-stage Air & Magnetic De-stoning',
    description: 'Raw spices undergo multi-stage pneumatic air cleaning, optical color sorting, and magnetic metal detection to remove all dust, stems, and impurities.',
    iconName: 'Wind',
    detailPoints: ['Zero dust & debris guarantee', 'Optical sorting for uniform grade', 'Touchless automated handling']
  },
  {
    stepNumber: 3,
    title: 'Traditional Grinding',
    subtitle: 'Low-Temperature Cold Grinding (LTG)',
    description: 'Unlike fast commercial mills that heat and destroy delicate spice oils, ENU uses slow cold-milling technology under 35°C to preserve 100% natural aroma.',
    iconName: 'FlameOff',
    detailPoints: ['Cold grinding below 35°C', 'Preserves volatile aromatic esters', 'Authentic stone-milled texture']
  },
  {
    stepNumber: 4,
    title: 'Master Blending',
    subtitle: 'Secret Heritage Family Ratios',
    description: 'Master spice blenders meticulously weigh and dry-roast whole spices in small batches before homogenizing under controlled humidity.',
    iconName: 'Sparkles',
    detailPoints: ['Handcrafted small batch control', 'Precise humidity management', 'Zero starch fillers or MSG']
  },
  {
    stepNumber: 5,
    title: 'Quality Check',
    subtitle: 'Laboratory Assay & Micro-testing',
    description: 'Every single lot undergoes rigorous NABL accredited lab testing for moisture, curcumin content, capsaicin heat, and microbiological purity.',
    iconName: 'ShieldCheck',
    detailPoints: ['Curcumin assay verification', 'Zero artificial dye certification', 'Microbiological safety check']
  },
  {
    stepNumber: 6,
    title: 'Aseptic Packaging',
    subtitle: 'Multi-layer Nitrogen Flush Pouches',
    description: 'Locked in 4-layer aroma barrier zip pouches flushed with food-grade nitrogen to lock in mountain-fresh fragrance for 12+ months.',
    iconName: 'PackageCheck',
    detailPoints: ['4-layer UV & moisture shield', 'Nitrogen flush freshness lock', 'Easy resealable zipper design']
  }
];

export const TRUST_PILLARS = [
  {
    title: '100% Natural',
    description: 'Zero added chemicals, synthetic fillers, or anti-caking agents.',
    iconName: 'Leaf'
  },
  {
    title: 'No Artificial Colours',
    description: 'Natural deep ruby reds and golden yellows straight from nature.',
    iconName: 'DropletOff'
  },
  {
    title: 'Fresh Ingredients',
    description: 'Current season whole harvest spices ground fresh upon order.',
    iconName: 'Sparkles'
  },
  {
    title: 'Premium Quality',
    description: 'NABL lab tested for aroma oil retention & purity standard.',
    iconName: 'Award'
  }
];

export const WHY_CHOOSE_ENU = [
  {
    title: 'Farm Fresh Ingredients',
    description: 'Direct procurement from certified organic spice belts across India for uncompromised origin purity.',
    iconName: 'Sprout'
  },
  {
    title: 'Authentic Taste',
    description: 'Formulated with age-old traditional Indian recipes that bring authentic heritage flavor to every dish.',
    iconName: 'UtensilsCrossed'
  },
  {
    title: 'Premium Packaging',
    description: '4-layer aroma-lock zipper pouches with nitrogen flushing keep spices fresh like day one.',
    iconName: 'Shield'
  },
  {
    title: 'No Preservatives',
    description: 'Zero MSG, no artificial colors, no synthetic acids, and no chemical anti-caking additives.',
    iconName: 'Ban'
  },
  {
    title: 'Quality Tested',
    description: 'Every batch undergoes rigorous NABL lab checks for curcumin levels, moisture, and micro-purity.',
    iconName: 'CheckCircle'
  },
  {
    title: 'Traditional Grinding',
    description: 'Low Temperature Cold Grinding preserves natural volatile oils and rich essential aromas.',
    iconName: 'Cpu'
  }
];
