export interface Product {
  id: string;
  name: string;
  category: string;
  weightOptions: string[];
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
  spicinessLevel: number; // 1 to 5
  isFeatured?: boolean;
  bestFor: string[];
}

export interface CartItem {
  product: Product;
  selectedWeight: string;
  quantity: number;
}

export interface ShippingAddress {
  fullName: string;
  phone: string;
  pincode: string;
  addressLine: string;
  city: string;
  state: string;
}

export type PaymentMethod = 'upi' | 'card' | 'netbanking' | 'cod';

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

export interface Category {
  id: string;
  name: string;
  description: string;
  image: string;
  count: number;
}

export interface Recipe {
  id: string;
  title: string;
  subtitle: string;
  prepTime: string;
  cookTime: string;
  difficulty: 'Easy' | 'Medium' | 'Advanced';
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

export type NavigationPage = 'home' | 'products' | 'product-detail' | 'recipes' |'recipe-detail' | 'story' | 'cart' | 'contact';
