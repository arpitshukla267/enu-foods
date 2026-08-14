import { ComboItem } from "../types";
import { PRODUCTS } from "./mockData";

const findProduct = (id: string): Product => {
  if (typeof PRODUCTS !== "undefined" && Array.isArray(PRODUCTS)) {
    const found = PRODUCTS.find((p) => p.id === id);
    if (found) return found;
  }
  return {
    id,
    name: id.replace("enu-", "ENU ").split('-').map(s => s.charAt(0).toUpperCase() + s.slice(1)).join(' '),
    category: 'Spices',
    weightOptions: ['100g', '200g'],
    defaultWeight: '100g',
    price: 180,
    originalPrice: 220,
    shortDescription: '100% pure cold-ground spice.',
    fullDescription: '100% natural cold-ground whole spice blend.',
    image: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=800&q=80',
    ingredients: ['Natural Whole Spices'],
    benefits: ['100% Natural & Chemical Free'],
    storageInstructions: 'Store in an airtight container in a cool dry place.',
    aromaProfile: 'Rich, pungent, and aromatic.',
    spicinessLevel: 3,
    bestFor: ['Indian Curries', 'Daily Cooking'],
  };
};

export const COMBOS: ComboItem[] = [
  {
    id: "combo-south-indian",
    title: "South Indian Meal Kit",
    subtitle: "Authentic Coastal & Deccan Kitchen Staples",
    category: "regional",
    tag: "Regional Special",
    badge: "Bestseller",
    description:
      "Traditional slow-roasted Sambhar Masala paired with organic Turmeric and Byadgi Red Chilli Powder.",
    fullStory:
      "Crafted specifically for households that cherish authentic South Indian breakfasts and traditional multi-course meals. From morning tiffin Sambhar and Rasam to fragrant vegetable poriyals, this kit gives you the core aromatic building blocks ground cold to lock in natural essential oils.",
    image:
      "https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?auto=format&fit=crop&w=800&q=80",
    discountPercent: 15,
    highlights: [
      "Traditional stone-ground lentil & spice roasting profile",
      "High curcumin Erode Turmeric (3.5%+ active curcumin)",
      "Vibrant Byadgi Chilli for rich natural red color without chemical dyes",
      "Zero preservatives, starch fillers, or MSG",
    ],
    chefTip:
      "For restaurant-style Sambhar, bloom 1 tbsp ENU Sambhar Masala in hot ghee with mustard seeds and curry leaves before stirring it into your boiled dal and tamarind extract.",
    idealRecipes: ["classic-south-indian-sambhar", "chettinad-vegetable-curry"],
    items: [
      {
        product: findProduct("enu-sambhar-masala"),
        weight: "100g",
        role: "Primary Seasoning & Soul",
        description:
          "Traditional slow-roasted blend of roasted Bengal gram, coriander seeds, cumin, fenugreek, and asafoetida. Imparts the signature tangy, fragrant aroma to South Indian lentils.",
        keyNotes: ["Slow roasted below 35°C", "Lentil-thickened body", "Aroma-lock foil"],
      },
      {
        product: findProduct("enu-turmeric-powder"),
        weight: "100g",
        role: "Golden Color & Immunity",
        description:
          "Single-origin golden turmeric sourced from select organic farms of Erode. Provides deep earthy warmth, intense natural golden hue, and high curcumin goodness.",
        keyNotes: ["3.5%+ Natural Curcumin", "Zero lead chromate dyes", "Immunity boosting"],
      },
      {
        product: findProduct("enu-red-chilli-powder"),
        weight: "100g",
        role: "Vibrant Hue & Balanced Heat",
        description:
          "Fine blend of wrinkled Byadgi chillies and pungent Guntur chillies, providing glowing deep red color with a mild, delightful kick.",
        keyNotes: ["Cold stone ground", "High capsanthin color", "Balanced pungency"],
      },
    ],
  },
  {
    id: "combo-royal-gravy",
    title: "Royal North Indian Curry Kit",
    subtitle: "Dhaba & Restaurant-Grade Rich Gravy Collection",
    category: "feast",
    tag: "Chef's Special",
    badge: "High Savings",
    description:
      "Velvety restaurant-style Paneer Butter Masala, Shahi gravies, and fragrant tikkas.",
    fullStory:
      "Bring the rich, buttery essence of Punjabi dhabas and royal Mughlai dining into your home kitchen. This bundle features our specialized Paneer Masala, 14-spice Garam Masala, fresh Himalayan Ginger Garlic Paste, and fragrant Nagauri Kasuri Methi.",
    image:
      "https://images.unsplash.com/photo-1565557623262-b51c2513a641?auto=format&fit=crop&w=800&q=80",
    discountPercent: 18,
    highlights: [
      "100% whole paste from fresh ginger root and peeled garlic",
      "14 rare whole spices hand-roasted for royal Garam Masala",
      "Shade-dried Kasuri Methi from Nagaur, Rajasthan",
      "Instant restaurant-style smooth gravy texture",
    ],
    chefTip:
      "Always rub the ENU Kasuri Methi gently between your palms to release the volatile oils before sprinkling it over simmering gravies in the last 2 minutes.",
    idealRecipes: ["kadai-paneer-delight", "amritsari-pindi-chole", "royal-vegetable-biryani"],
    items: [
      {
        product: findProduct("enu-paneer-masala"),
        weight: "100g",
        role: "Gourmet Gravy Blend",
        description:
          "Silky aromatic spice formula crafted with cashew powder, cardamom, mace, and roasted coriander for restaurant-grade paneer dishes.",
        keyNotes: ["Mild sweetness & creamy finish", "Balanced spice matrix", "No artificial thickeners"],
      },
      {
        product: findProduct("enu-garam-masala"),
        weight: "100g",
        role: "Warming Royal Aroma",
        description:
          "Heritage 14-spice blend featuring green cardamom, black cardamom, cinnamon, cloves, and star anise for deep aromatic warmth.",
        keyNotes: ["14 whole spices", "Low heat grinding", "Finishing magic"],
      },
      {
        product: findProduct("enu-ginger-garlic-paste"),
        weight: "200g",
        role: "Fresh Pungent Foundation",
        description:
          "50:50 ratio of fresh Himalayan ginger and Indian garlic cloves ground thick without excessive water or starch dilution.",
        keyNotes: ["Zero chemical acid flavor", "Thick granular texture", "100% natural"],
      },
      {
        product: findProduct("enu-kasuri-methi"),
        weight: "50g",
        role: "Herbal Restaurant Garnish",
        description:
          "Clean, hand-sorted whole dried fenugreek leaves from Nagaur, renowned for sweet floral aroma without bitter stems.",
        keyNotes: ["Naturally shade-dried", "No sand or grit", "Intense herbal aroma"],
      },
    ],
  },
  {
    id: "combo-daily-trio",
    title: "Everyday Foundation Trio",
    subtitle: "The 3 Must-Have Spices for Every Indian Kitchen",
    category: "daily",
    tag: "Daily Essentials",
    badge: "Must-Have",
    description:
      "Three fundamental pure spices essential for daily cooking: Haldi, Mirch, and Dhaniya.",
    fullStory:
      "Every Indian dish begins with this sacred holy trinity of pure spices. Sourced directly from accredited organic farming belts and ground below 35°C to protect volatile aromas that heat-intensive industrial grinders destroy.",
    image:
      "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=800&q=80",
    discountPercent: 15,
    highlights: [
      "Complete core foundation for dal, sabzi, curries, and tadkas",
      "Tested for zero pesticide residues and zero adulteration",
      "Cold-processed to retain volatile terpene oils",
      "Air-tight resealable packs to preserve kitchen freshness",
    ],
    chefTip:
      "Fry the Haldi and Dhaniya powder together in warm oil or ghee for 20 seconds before adding tomatoes to unlock deep flavor layers.",
    idealRecipes: ["homestyle-dal-tadka", "comforting-khichdi", "classic-south-indian-sambhar"],
    items: [
      {
        product: findProduct("enu-turmeric-powder"),
        weight: "100g",
        role: "Natural Immunity & Color",
        description:
          "High-curcumin organic turmeric powder with deep golden pigment and rich earthy scent.",
        keyNotes: ["High Curcumin", "Pure & Unpolished", "Erode origin"],
      },
      {
        product: findProduct("enu-red-chilli-powder"),
        weight: "100g",
        role: "Warmth & Vivid Color",
        description:
          "Selected Byadgi & Guntur red chillies ground fine with natural essential oils preserved.",
        keyNotes: ["Zero Sudan red dye", "Mild heat & bright color", "Clean processed"],
      },
      {
        product: findProduct("enu-coriander-powder"),
        weight: "100g",
        role: "Body, Thickener & Citrus Aroma",
        description:
          "Green whole coriander seeds from Ramganj, Rajasthan that provide fresh lemony notes and velvety body to gravies.",
        keyNotes: ["Green seed milling", "Fresh citrus aroma", "Naturally cooling"],
      },
    ],
  },
  {
    id: "combo-biryani-feast",
    title: "Shahi Biryani Feast Pack",
    subtitle: "Royal Mughlai & Hyderabadi Dum Cooking Kit",
    category: "feast",
    tag: "Weekend Feast",
    badge: "Top Rated",
    description:
      "Aromatic royal star anise, mace, and whole cardamom blend for authentic dum biryani.",
    fullStory:
      "Transform ordinary long-grain Basmati rice into a regal banquet. This comprehensive bundle pairs our celebrated Shahi Biryani Masala with Garam Masala, fresh Ginger Garlic Paste, and aromatic Kasuri Methi.",
    image:
      "https://images.unsplash.com/photo-1633945274405-b6c8069047b0?auto=format&fit=crop&w=800&q=80",
    discountPercent: 20,
    highlights: [
      "Enriched with royal mace (javitri), star anise, and green cardamom pods",
      "Slow dum aroma lock formula",
      "Perfect for Veg Dum Biryani, Paneer Biryani, and Pulao feasts",
      "Save 20% on the complete gourmet collection",
    ],
    chefTip:
      "Layer half-cooked Basmati rice over your spiced vegetables, sprinkle Biryani Masala, saffron milk, and seal the pot with dough for true royal Dum cooking.",
    idealRecipes: ["royal-vegetable-biryani", "kadai-paneer-delight"],
    items: [
      {
        product: findProduct("enu-biryani-masala"),
        weight: "100g",
        role: "Star Biryani Seasoning",
        description:
          "Regal combination of whole Kashmiri saffron notes, mace, nutmeg, black cumin, and green cardamom.",
        keyNotes: ["Mughlai royal recipe", "Slow dum fragrance", "No artificial essence"],
      },
      {
        product: findProduct("enu-garam-masala"),
        weight: "100g",
        role: "Warm Layering Essence",
        description:
          "14-spice slow roasted finishing blend to add complexity and warming depth to the biryani masala base.",
        keyNotes: ["14 whole spices", "Rich clove & cinnamon warmth", "Aromatic finishing"],
      },
      {
        product: findProduct("enu-ginger-garlic-paste"),
        weight: "200g",
        role: "Marinade Foundation",
        description:
          "Coarsely ground fresh ginger and garlic paste that coats vegetables or proteins for marination.",
        keyNotes: ["Natural sulfur aroma", "High ginger fiber", "Zero preservatives"],
      },
      {
        product: findProduct("enu-kasuri-methi"),
        weight: "50g",
        role: "Layered Herb Garnish",
        description:
          "Fragrant Nagauri fenugreek leaves to sprinkle between rice layers before sealing the Dum handi.",
        keyNotes: ["Shade-dried delicacy", "Sweet aroma", "Crisp whole leaves"],
      },
    ],
  },
  {
    id: "combo-street-food",
    title: "Mumbai Street Food Pack",
    subtitle: "Chowpatty Pav Bhaji, Chaat & Snack Essentials",
    category: "regional",
    tag: "Street Style",
    badge: "Flavor Burst",
    description:
      "Recreate authentic Chowpatty Pav Bhaji, spiced Tawa Pulao, and lip-smacking snack chaats.",
    fullStory:
      "Experience the bustling aromas of Juhu beach and Mumbai khau gallis right at home. Features our tangy Pav Bhaji Masala with amchur (dry mango) and stone-ground spices, supported by versatile Kitchen King and vibrant Red Chilli.",
    image:
      "https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=800&q=80",
    discountPercent: 15,
    highlights: [
      "Tangy sun-dried Amchur (dry mango) blended into Pav Bhaji Masala",
      "Perfect balance of spicy, tangy, and savory street flavors",
      "Ideal for Pav Bhaji, Tawa Pulao, Sev Puri, and Ragda Patties",
      "100% natural colors for irresistible street style look",
    ],
    chefTip:
      "For authentic Mumbai pav bhaji, cook your masala directly in butter on a flat tawa and mash continuously with hot potato water until glossy.",
    idealRecipes: ["mumbai-pav-bhaji", "amritsari-pindi-chole"],
    items: [
      {
        product: findProduct("enu-pav-bhaji-masala"),
        weight: "100g",
        role: "Signature Street Seasoning",
        description:
          "Tangy and zesty spice blend combining sour dry mango, black pepper, cassia, and stone-roasted coriander.",
        keyNotes: ["Amchur infused", "Vibrant street flavor", "Authentic Mumbai aroma"],
      },
      {
        product: findProduct("enu-kitchen-king"),
        weight: "100g",
        role: "Curry & Tawa Base",
        description:
          "Master all-purpose blend of 20+ spices that adds depth and rich color to street style gravies and tawa pulao.",
        keyNotes: ["20+ whole spices", "All-purpose richness", "Cold milled"],
      },
      {
        product: findProduct("enu-red-chilli-powder"),
        weight: "100g",
        role: "Glossy Red Hue",
        description:
          "Gives the signature vibrant fiery red glaze to butter-toasted pav and simmering bhaji.",
        keyNotes: ["Natural Byadgi color", "No added food coloring", "Clean heat"],
      },
    ],
  },
  {
    id: "combo-pure-essentials",
    title: "Pure Powder Quad Set",
    subtitle: "Complete 4-Pillar Daily Cooking Pantry",
    category: "daily",
    tag: "Purity Pack",
    badge: "Value Pack",
    description:
      "Essential cold-ground kitchen powders: Turmeric, Chilli, Coriander, and Kitchen King.",
    fullStory:
      "A complete foundation for the modern home chef who demands absolute purity. Includes our three single-origin pure powders along with the versatile Kitchen King masala to effortlessly create over 100 Indian dishes.",
    image:
      "https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&w=800&q=80",
    discountPercent: 16,
    highlights: [
      "Covers 90% of daily North and South Indian home recipes",
      "Cold-ground at low RPM below 35°C to preserve essential oils",
      "Zero fillers, starch, or MSG",
      "Includes all-purpose Kitchen King blend",
    ],
    chefTip:
      "Use Kitchen King as your secret all-rounder seasoning for dry sabzis like Bhindi, Aloo Gobi, and Mix Veg stir fries.",
    idealRecipes: ["homestyle-dal-tadka", "comforting-khichdi", "amritsari-pindi-chole"],
    items: [
      {
        product: findProduct("enu-turmeric-powder"),
        weight: "100g",
        role: "Earthy Base & Golden Hue",
        description: "100% natural high-curcumin pure turmeric powder.",
        keyNotes: ["3.5%+ Curcumin", "Pure organic", "Immunity booster"],
      },
      {
        product: findProduct("enu-coriander-powder"),
        weight: "100g",
        role: "Citrusy Body & Thickener",
        description: "Cold milled green coriander seeds with fresh herbal aroma.",
        keyNotes: ["Aroma retention", "Natural curry body", "Digestive"],
      },
      {
        product: findProduct("enu-red-chilli-powder"),
        weight: "100g",
        role: "Balanced Heat & Color",
        description: "Pure Byadgi and Guntur chilli blend for natural redness.",
        keyNotes: ["Zero dyes", "Natural essential oil", "Balanced spicy heat"],
      },
      {
        product: findProduct("enu-kitchen-king"),
        weight: "100g",
        role: "Master Sabzi Blend",
        description: "Gourmet multi-spice blend that lifts any vegetable dish into a royal delicacy.",
        keyNotes: ["20 spices formula", "Aromatic coriander & cumin base", "Restaurant taste"],
      },
    ],
  },
  {
    id: "combo-aroma-masters",
    title: "Aromatic Finishing Duo",
    subtitle: "The Secret Touch of Master Chefs",
    category: "daily",
    tag: "Finishing Touch",
    badge: "Chef Choice",
    description:
      "14-spice warming Garam Masala paired with crisp, shade-dried Nagauri Kasuri Methi.",
    fullStory:
      "Great cooking is defined by the finishing aromas. This duo provides the final flourish to curries, dals, biryanis, and gravies right before serving.",
    image:
      "https://images.unsplash.com/photo-1599940824399-b87987ceb72a?auto=format&fit=crop&w=800&q=80",
    discountPercent: 12,
    highlights: [
      "The quintessential finishing duo used in royal kitchens",
      "Whole roasted spices ground at sub-zero temperatures",
      "Authentic Nagauri green fenugreek leaves",
      "Immediate aroma bloom upon contact with hot ghee or gravy",
    ],
    chefTip:
      "Always add both of these in the final 60 seconds of cooking. Shut the lid immediately so the aroma steeps into the dish.",
    idealRecipes: ["kadai-paneer-delight", "amritsari-pindi-chole", "royal-vegetable-biryani"],
    items: [
      {
        product: findProduct("enu-garam-masala"),
        weight: "100g",
        role: "Aromatic Finishing Powder",
        description: "14-spice slow roasted signature warming blend with green and black cardamom.",
        keyNotes: ["14 whole spices", "Slow roasted", "Zero adulteration"],
      },
      {
        product: findProduct("enu-kasuri-methi"),
        weight: "50g",
        role: "Herbal Fragrance Garnish",
        description: "Shade-dried tender Nagauri fenugreek leaves with intense maple-herbal fragrance.",
        keyNotes: ["Nagaur origin", "No stem debris", "Hand picked"],
      },
    ],
  },
  {
    id: "combo-curry-starter",
    title: "Quick Weeknight Curry Duo",
    subtitle: "Fast, Flavorful Home Gravies in Minutes",
    category: "daily",
    tag: "Quick Cooking",
    badge: "Time Saver",
    description:
      "All-purpose royal Kitchen King blend with 100% pure Himalayan Ginger Garlic Paste.",
    fullStory:
      "Designed for busy weeknights when you want home-cooked goodness without spending 20 minutes peeling ginger and grinding whole spices. Gives instantaneous aroma and rich body.",
    image:
      "https://images.unsplash.com/photo-1509358217973-883fe8a1e808?auto=format&fit=crop&w=800&q=80",
    discountPercent: 14,
    highlights: [
      "Saves up to 25 minutes of prep time per meal",
      "Thick, non-watery ginger garlic paste",
      "Versatile 20-spice Kitchen King for any curry or stir fry",
      "Guaranteed freshness with no synthetic acid smell",
    ],
    chefTip:
      "Sauté 1 tbsp ginger garlic paste for 1 minute, add chopped tomatoes and 1 tsp Kitchen King for a quick 10-minute curry base.",
    idealRecipes: ["comforting-khichdi", "amritsari-pindi-chole"],
    items: [
      {
        product: findProduct("enu-kitchen-king"),
        weight: "100g",
        role: "Complete Curry Seasoning",
        description: "Balanced multi-spice blend with cumin, coriander, turmeric, black pepper, and nutmeg.",
        keyNotes: ["All-in-one flavor", "Cold processed", "No artificial colors"],
      },
      {
        product: findProduct("enu-ginger-garlic-paste"),
        weight: "200g",
        role: "Instant Base Aromatics",
        description: "100% pure ginger and garlic paste made from farm-fresh roots and cloves.",
        keyNotes: ["Zero water dilution", "Natural texture", "Refrigerate after opening"],
      },
    ],
  },
  {
    id: "combo-punjabi-dhaba",
    title: "Punjabi Dhaba Master Set",
    subtitle: "Robust Rustic Punjabi Curry Trio",
    category: "regional",
    tag: "Dhaba Style",
    badge: "Authentic",
    description:
      "Craft authentic Dhaba Chole, Dal Makhani, Kadai gravies, and spiced Tandoori dishes.",
    fullStory:
      "Recreate the smoky, robust flavours of highway Punjabi dhabas. Combining Kitchen King for gravy body, Garam Masala for aromatic depth, and Kasuri Methi for the distinct dhaba aroma.",
    image:
      "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?auto=format&fit=crop&w=800&q=80",
    discountPercent: 15,
    highlights: [
      "Rustic, bold aroma profile with whole spice undertones",
      "Perfect for Pindi Chole, Dal Makhani, Paneer Tikka, and Rajma",
      "100% natural ingredients with zero preservatives",
      "Economical 3-in-1 combo bundle",
    ],
    chefTip:
      "Finish your Dal Makhani or Chole with hot ghee infused with ginger juliennes and crushed Kasuri Methi.",
    idealRecipes: ["amritsari-pindi-chole", "kadai-paneer-delight"],
    items: [
      {
        product: findProduct("enu-kitchen-king"),
        weight: "100g",
        role: "Robust Gravy Base",
        description: "Rich 20-spice masala that creates hearty, deeply flavorful Punjabi gravies.",
        keyNotes: ["Full bodied flavor", "Rich aroma", "Zero fillers"],
      },
      {
        product: findProduct("enu-garam-masala"),
        weight: "100g",
        role: "Warm Spiced Depth",
        description: "14 royal whole spices roasted to perfection for intense authentic finish.",
        keyNotes: ["Warming profile", "Cardamom & clove rich", "Low temp ground"],
      },
      {
        product: findProduct("enu-kasuri-methi"),
        weight: "50g",
        role: "Signature Dhaba Fragrance",
        description: "Shade-dried Nagauri fenugreek leaves that give Dhaba dishes their iconic taste.",
        keyNotes: ["Crisp whole leaves", "Intense fragrance", "No bitter twigs"],
      },
    ],
  },
  {
    id: "combo-ultimate-pantry",
    title: "Master Chef Grand Pantry",
    subtitle: "Complete 6-Pack Gourmet Collection",
    category: "all-in-one",
    tag: "Ultimate Value",
    badge: "Max Savings",
    description:
      "Complete six-blend gourmet collection to elevate every regional delicacy from Sambhar to Biryani.",
    fullStory:
      "The ultimate kitchen upgrade. Hand-packed in small batches, this six-piece master collection equips any passionate cook with everything needed to master North Indian, South Indian, Mughlai, and street food cuisine.",
    image:
      "https://images.unsplash.com/photo-1532336414038-cf19250c5757?auto=format&fit=crop&w=800&q=80",
    discountPercent: 22,
    highlights: [
      "Maximum 22% flat bundle discount",
      "Includes 6 signature handcrafted blends & herbs",
      "Covers regional cuisines from Kashmir to Kanyakumari",
      "Free express shipping included",
    ],
    chefTip:
      "Store each pack in an airtight jar in a dark pantry cupboard to keep the volatile essential oils fresh for up to 12 months.",
    idealRecipes: [
      "classic-south-indian-sambhar",
      "royal-vegetable-biryani",
      "kadai-paneer-delight",
      "amritsari-pindi-chole",
    ],
    items: [
      {
        product: findProduct("enu-sambhar-masala"),
        weight: "100g",
        role: "South Indian Specialty",
        description: "Slow roasted lentil and whole spice blend for authentic sambhar and rasam.",
        keyNotes: ["Roasted lentils", "Hing & curry leaf aroma", "Cold ground"],
      },
      {
        product: findProduct("enu-kitchen-king"),
        weight: "100g",
        role: "Everyday Master Blend",
        description: "Versatile 20-spice blend for all everyday vegetable curries and gravies.",
        keyNotes: ["20 whole spices", "Royal taste", "All purpose"],
      },
      {
        product: findProduct("enu-biryani-masala"),
        weight: "100g",
        role: "Royal Dum Biryani Blend",
        description: "Rich Mughlai blend with saffron, mace, star anise, and whole cardamom.",
        keyNotes: ["Saffron notes", "Mace & nutmeg", "Slow dum fragrance"],
      },
      {
        product: findProduct("enu-paneer-masala"),
        weight: "100g",
        role: "Creamy Gravy Spice",
        description: "Silky spice mix for Shahi Paneer, Paneer Butter Masala, and Kadhai.",
        keyNotes: ["Mild sweetness", "Smooth texture", "Cashew undertones"],
      },
      {
        product: findProduct("enu-garam-masala"),
        weight: "100g",
        role: "Finishing Aroma",
        description: "14-spice signature blend for the royal finishing touch.",
        keyNotes: ["14 whole spices", "Volatile oils intact", "Warming notes"],
      },
      {
        product: findProduct("enu-kasuri-methi"),
        weight: "50g",
        role: "Herbal Garnish",
        description: "Nagauri shade-dried fenugreek leaves for rich restaurant aroma.",
        keyNotes: ["Shade dried", "Nagaur specialty", "Clean sorted"],
      },
    ],
  },
];
