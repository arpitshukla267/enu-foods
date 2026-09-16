export interface ProductWeightVariant {
  weight: string;
  price: number;
  originalPrice: number;
  inStock?: boolean;
  stock?: number;
}

export interface Product {
  id: string;
  name: string;
  slug?: string;
  category: string;
  categorySlug?: string;
  weightOptions: string[];
  weightVariants?: ProductWeightVariant[];
  defaultWeight: string;
  price: number;
  originalPrice: number;
  priceEstimate?: string;
  shortDescription: string;
  fullDescription: string;
  image: string;
  secondaryImages?: string[];
  ingredients: string[];
  benefits: string[];
  storageInstructions: string;
  aromaProfile: string;
  spicinessLevel: number;
  isFeatured?: boolean;
  isBestSeller?: boolean;
  isNewArrival?: boolean;
  inStock?: boolean;
  bestFor: string[];
}

export interface CartItem {
  id?: string;
  product: Product;
  selectedWeight: string;
  quantity: number;
  unitPrice?: number;
  subtotal?: number;
  stock?: number;
  status?: "available" | "out_of_stock" | "inactive" | "variant_unavailable" | "quantity_exceeded";
  isAvailable?: boolean;
  statusMessage?: string;
}

export interface ShippingAddress {
  fullName: string;
  phone: string;
  pincode: string;
  addressLine: string;
  city: string;
  state: string;
}

export type PaymentMethod = "upi" | "card" | "netbanking" | "cod";

export interface OrderDetails {
  orderId: string;
  items: CartItem[];
  shippingAddress: ShippingAddress;
  paymentMethod: PaymentMethod;
  subtotal: number;
  discount: number;
  total: number;
  date: string;
}

export interface Subcategory {
  id: string;
  name: string;
  slug: string;
}

export interface Category {
  id: string;
  name: string;
  slug?: string;
  description: string;
  image: string;
  subcategories?: Subcategory[];
  count?: number;
}

export interface Recipe {
  id: string;
  slug?: string;
  title: string;
  subtitle: string;
  prepTime: string;
  cookTime: string;
  difficulty: "Easy" | "Medium" | "Advanced";
  servings: string;
  image: string;
  description: string;
  enuSpicesUsed: string[];
  ingredientsList: string[];
  instructions: string[];
}

export interface Testimonial {
  id: string;
  name: string;
  location: string;
  rating: number;
  comment: string;
  highlight: string;
  avatar: string;
  verified: boolean;
}

export interface Certification {
  id: string;
  title: string;
  subtitle: string;
  iconName: string;
}

export interface ManufacturingStep {
  stepNumber: number;
  title: string;
  subtitle: string;
  description: string;
  iconName: string;
  detailPoints: string[];
}

export interface ComboProductItem {
  product: Product;
  weight: string;
  quantity?: number;
  role?: string;
  description?: string;
  keyNotes?: string[];
}

export interface ComboItem {
  id: string;
  slug?: string;
  title: string;
  subtitle?: string;
  category: "daily" | "regional" | "feast" | "all-in-one" | string;
  tag: string;
  badge?: string;
  description: string;
  fullStory?: string;
  image: string;
  items: ComboProductItem[];
  discountPercent: number;
  originalPrice?: number;
  discountedPrice?: number;
  highlights?: string[];
  idealRecipes?: string[];
  chefTip?: string;
}

export type NavigationPage =
  | "home"
  | "products"
  | "product-detail"
  | "recipes"
  | "recipe-detail"
  | "combos"
  | "combo-detail"
  | "bestsellers"
  | "new-arrivals"
  | "story"
  | "cart"
  | "contact"
  | "checkout"
  | "login"
  | "signup"
  | "orders"
  | "order-detail"
  | "privacy"
  | "terms";

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: "customer" | "admin";
}