export type ProductStatus = 'active' | 'draft' | 'archived';
export type ComboStatus = 'active' | 'draft' | 'archived';
export type OrderStatus = 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
export type PaymentStatus = 'paid' | 'pending' | 'failed' | 'refunded';
export type PaymentMethod = 'UPI' | 'Credit Card' | 'Net Banking' | 'Cash on Delivery';
export type CategoryStatus = 'active' | 'inactive';
export type UserStatus = 'active' | 'inactive';

export interface ProductWeightVariant {
  id: string;
  weight: string; // e.g. "100g", "200g", "500g", "1kg"
  price: number; // in INR ₹
  originalPrice: number; // MRP ₹
  stock: number;
  sku?: string;
  isDefault: boolean;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  categoryId: string;
  categoryName: string;
  subcategoryId?: string;
  subcategoryName?: string;
  weightOptions: ProductWeightVariant[];
  defaultWeight: string;
  price: number;
  originalPrice: number;
  shortDescription: string;
  fullDescription: string;
  image: string;
  secondaryImages: string[];
  ingredients: string[];
  benefits: string[];
  storageInstructions: string;
  aromaProfile: string;
  spicinessLevel: number; // 1 to 5
  isFeatured: boolean;
  isBestSeller?: boolean;
  isNewArrival?: boolean;
  status: ProductStatus;
  bestFor: string[];
  createdAt: string;
  updatedAt: string;
  salesCount?: number;
}

export interface Subcategory {
  id: string;
  name: string;
  slug: string;
  categoryId: string;
  status: CategoryStatus;
  productCount?: number;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  image: string;
  status: CategoryStatus;
  subcategories: Subcategory[];
  productCount: number;
}

export interface ComboItem {
  productId: string;
  productName?: string;
  weight: string;
  role?: string;
  description?: string;
  keyNotes?: string[];
  quantity?: number;
}

export interface Combo {
  id: string;
  title: string;
  subtitle: string;
  slug: string;
  category: string;
  tag: string;
  badge: string; // e.g. "Bestseller", "Festive Special", "Chef's Choice"
  description: string;
  fullStory: string;
  image: string;
  secondaryImages?: string[];
  discountPercent: number;
  chefTip: string;
  highlights: string[];
  idealRecipes: string[];
  status: ProductStatus;
  items: ComboItem[];
  originalPrice: number;
  discountedPrice: number;
  price?: number;
  fullDescription?: string;
  customChefTip?: string;
  createdAt: string;
  updatedAt: string;
}

export interface OrderCustomer {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: {
    street: string;
    city: string;
    state: string;
    pincode: string;
    country: string;
  };
}

export interface OrderItem {
  productId: string;
  productName: string;
  image: string;
  weight: string;
  price: number;
  quantity: number;
  subtotal: number;
}

export interface OrderStatusHistoryItem {
  status: OrderStatus;
  timestamp: string;
  note?: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  customer: OrderCustomer;
  items: OrderItem[];
  subtotal: number;
  discount: number;
  shippingFee: number;
  tax: number;
  total: number;
  paymentStatus: PaymentStatus;
  paymentMethod: PaymentMethod;
  orderStatus: OrderStatus;
  shippingMethod?: string;
  trackingNumber?: string;
  carrier?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
  statusHistory: OrderStatusHistoryItem[];
}

export interface UserAddress {
  id: string;
  type: 'Home' | 'Work' | 'Other';
  street: string;
  city: string;
  state: string;
  pincode: string;
  isDefault: boolean;
}

export interface UserActivity {
  id: string;
  action: string;
  timestamp: string;
  details?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  status: UserStatus;
  joinedDate: string;
  lastOrderDate?: string;
  totalOrders: number;
  totalSpent: number;
  averageOrderValue: number;
  addresses: UserAddress[];
  activityHistory: UserActivity[];
}

export interface Payment {
  id: string;
  orderId: string;
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  amount: number;
  method: PaymentMethod;
  status: PaymentStatus;
  transactionId: string;
  date: string;
  gateway?: string;
}

export interface DashboardStats {
  totalRevenue: number;
  revenueGrowth: number;
  totalOrders: number;
  ordersGrowth: number;
  totalProducts: number;
  activeProducts: number;
  totalUsers: number;
  usersGrowth: number;
  pendingOrdersCount: number;
  completedOrdersCount: number;
  averageOrderValue: number;
  lowStockCount: number;
  revenueByDate: { date: string; revenue: number; orders: number; cumulative?: number }[];
  categoryRevenue?: { name: string; revenue: number; orders: number; color: string }[];
  orderStatusDistribution: { name: string; value: number; color: string }[];
  paymentDistribution: { name: string; value: number; color: string }[];
}

export type ActiveTab = 'dashboard' | 'orders' | 'products' | 'combos' | 'recipes' | 'categories' | 'coupons' | 'users' | 'payments' | 'settings';

export type RecipeStatus = 'active' | 'draft' | 'archived';
export type RecipeDifficulty = 'Easy' | 'Medium' | 'Advanced';

export interface Recipe {
  id: string;
  title: string;
  subtitle: string;
  slug: string;
  prepTime: string;
  cookTime: string;
  difficulty: RecipeDifficulty;
  servings: string;
  image: string;
  description: string;
  enuSpicesUsed: string[];
  ingredientsList: string[];
  instructions: string[];
  status: RecipeStatus;
  createdAt: string;
  updatedAt: string;
}

export type CouponDiscountType = 'percentage' | 'fixed';

export interface Coupon {
  id: string;
  code: string;
  description: string;
  discountType: CouponDiscountType;
  discountValue: number;
  minimumCartValue: number;
  maximumDiscount: number;
  startDate: string;
  expiryDate: string;
  usageLimit: number;
  usedCount: number;
  perUserLimit: number;
  applicableProducts: string[];
  applicableCategories: string[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface StoreSettings {
  storeName: string;
  currency: string;
  supportEmail: string;
  supportPhone: string;
  address: string;
  freeShippingThreshold: number;
  standardShippingFee: number;
  expressShippingFee: number;
  taxRatePercent: number;
  gstNumber: string;
}
