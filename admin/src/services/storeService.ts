import { 
  Product, 
  Category, 
  Combo, 
  Order, 
  User, 
  Payment, 
  DashboardStats, 
  OrderStatus, 
  PaymentStatus, 
  Subcategory, 
  ProductWeightVariant,
  StoreSettings 
} from '../types';
import { 
  INITIAL_CATEGORIES, 
  INITIAL_PRODUCTS, 
  INITIAL_COMBOS, 
  INITIAL_USERS, 
  INITIAL_ORDERS, 
  INITIAL_PAYMENTS 
} from '../data/initialData';

const STORAGE_KEYS = {
  PRODUCTS: 'enu_admin_products_v1',
  CATEGORIES: 'enu_admin_categories_v1',
  COMBOS: 'enu_admin_combos_v1',
  USERS: 'enu_admin_users_v1',
  ORDERS: 'enu_admin_orders_v1',
  PAYMENTS: 'enu_admin_payments_v1',
  SETTINGS: 'enu_admin_settings_v1',
};

const DEFAULT_SETTINGS: StoreSettings = {
  storeName: 'ENU Foods',
  currency: '₹',
  supportEmail: 'care@enufoods.com',
  supportPhone: '+91 98765 43210',
  address: 'Spice Processing Mill #14, Industrial Estate, Kochi, Kerala 682001',
  freeShippingThreshold: 999,
  standardShippingFee: 60,
  expressShippingFee: 49,
  taxRatePercent: 5,
  gstNumber: '32AABCE1234F1Z8'
};

// Safe LocalStorage Helper
function getFromStorage<T>(key: string, fallback: T): T {
  try {
    const item = localStorage.getItem(key);
    if (!item) return fallback;
    return JSON.parse(item);
  } catch {
    return fallback;
  }
}

function setToStorage<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (err) {
    console.error(`Error saving to localStorage ${key}:`, err);
  }
}

// ---------------- PRODUCTS ---------------- //
export const getProducts = (): Product[] => {
  return getFromStorage<Product[]>(STORAGE_KEYS.PRODUCTS, INITIAL_PRODUCTS);
};

export const getProductById = (id: string): Product | undefined => {
  const products = getProducts();
  return products.find(p => p.id === id);
};

export const addProduct = (productData: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>): Product => {
  const products = getProducts();
  const newId = `prod-${Date.now().toString(36)}`;
  const now = new Date().toISOString();
  
  const newProduct: Product = {
    ...productData,
    id: newId,
    createdAt: now,
    updatedAt: now,
    salesCount: 0
  };

  const updatedProducts = [newProduct, ...products];
  setToStorage(STORAGE_KEYS.PRODUCTS, updatedProducts);
  syncCategoryProductCounts();
  return newProduct;
};

export const createProduct = addProduct;

export const updateProduct = (id: string, updates: Partial<Product>): Product => {
  const products = getProducts();
  const index = products.findIndex(p => p.id === id);
  if (index === -1) throw new Error('Product not found');

  const updated: Product = {
    ...products[index],
    ...updates,
    updatedAt: new Date().toISOString()
  };

  products[index] = updated;
  setToStorage(STORAGE_KEYS.PRODUCTS, products);
  syncCategoryProductCounts();
  return updated;
};

export const deleteProduct = (id: string): boolean => {
  const products = getProducts();
  const filtered = products.filter(p => p.id !== id);
  setToStorage(STORAGE_KEYS.PRODUCTS, filtered);
  syncCategoryProductCounts();
  return true;
};

export const duplicateProduct = (id: string): Product => {
  const original = getProductById(id);
  if (!original) throw new Error('Product not found');

  const newName = `${original.name} (Copy)`;
  const newSlug = `${original.slug}-copy-${Date.now().toString(36)}`;
  
  return addProduct({
    ...original,
    name: newName,
    slug: newSlug,
    status: 'draft',
    weightOptions: original.weightOptions.map((v, i) => ({
      ...v,
      id: `var-dup-${Date.now()}-${i}`
    }))
  });
};

// ---------------- CATEGORIES ---------------- //
export const getCategories = (): Category[] => {
  return getFromStorage<Category[]>(STORAGE_KEYS.CATEGORIES, INITIAL_CATEGORIES);
};

export const getCategoryById = (id: string): Category | undefined => {
  return getCategories().find(c => c.id === id);
};

export const addCategory = (catData: Omit<Category, 'id' | 'subcategories' | 'productCount'>): Category => {
  const categories = getCategories();
  const newId = `cat-${Date.now().toString(36)}`;
  
  const newCat: Category = {
    ...catData,
    id: newId,
    subcategories: [],
    productCount: 0
  };

  const updated = [...categories, newCat];
  setToStorage(STORAGE_KEYS.CATEGORIES, updated);
  return newCat;
};

export const createCategory = addCategory;

export const updateCategory = (id: string, updates: Partial<Category>): Category => {
  const categories = getCategories();
  const index = categories.findIndex(c => c.id === id);
  if (index === -1) throw new Error('Category not found');

  const updated = { ...categories[index], ...updates };
  categories[index] = updated;
  setToStorage(STORAGE_KEYS.CATEGORIES, categories);
  return updated;
};

export const deleteCategory = (id: string): boolean => {
  const categories = getCategories();
  const filtered = categories.filter(c => c.id !== id);
  setToStorage(STORAGE_KEYS.CATEGORIES, filtered);
  return true;
};

export const addSubcategory = (categoryId: string, name: string, slug: string): Subcategory => {
  const categories = getCategories();
  const category = categories.find(c => c.id === categoryId);
  if (!category) throw new Error('Category not found');

  const newSub: Subcategory = {
    id: `sub-${Date.now().toString(36)}`,
    name,
    slug,
    categoryId,
    status: 'active',
    productCount: 0
  };

  category.subcategories = [...(category.subcategories || []), newSub];
  setToStorage(STORAGE_KEYS.CATEGORIES, categories);
  return newSub;
};

export const updateSubcategory = (categoryId: string, subcategoryId: string, updates: Partial<Subcategory>): Subcategory => {
  const categories = getCategories();
  const category = categories.find(c => c.id === categoryId);
  if (!category) throw new Error('Category not found');

  const subIndex = category.subcategories.findIndex(s => s.id === subcategoryId);
  if (subIndex === -1) throw new Error('Subcategory not found');

  const updatedSub = { ...category.subcategories[subIndex], ...updates };
  category.subcategories[subIndex] = updatedSub;
  setToStorage(STORAGE_KEYS.CATEGORIES, categories);
  return updatedSub;
};

export const deleteSubcategory = (categoryId: string, subcategoryId: string): boolean => {
  const categories = getCategories();
  const category = categories.find(c => c.id === categoryId);
  if (!category) throw new Error('Category not found');

  category.subcategories = category.subcategories.filter(s => s.id !== subcategoryId);
  setToStorage(STORAGE_KEYS.CATEGORIES, categories);
  return true;
};

const syncCategoryProductCounts = () => {
  const categories = getCategories();
  const products = getProducts();

  const updated = categories.map(cat => {
    const count = products.filter(p => p.categoryId === cat.id).length;
    const updatedSubs = (cat.subcategories || []).map(sub => ({
      ...sub,
      productCount: products.filter(p => p.subcategoryId === sub.id).length
    }));

    return {
      ...cat,
      productCount: count,
      subcategories: updatedSubs
    };
  });

  setToStorage(STORAGE_KEYS.CATEGORIES, updated);
};

// ---------------- COMBOS ---------------- //
export const getCombos = (): Combo[] => {
  return getFromStorage<Combo[]>(STORAGE_KEYS.COMBOS, INITIAL_COMBOS);
};

export const getComboById = (id: string): Combo | undefined => {
  return getCombos().find(c => c.id === id);
};

export const addCombo = (comboData: Omit<Combo, 'id' | 'createdAt' | 'updatedAt'>): Combo => {
  const combos = getCombos();
  const newId = `combo-${Date.now().toString(36)}`;
  const now = new Date().toISOString();

  const newCombo: Combo = {
    ...comboData,
    id: newId,
    createdAt: now,
    updatedAt: now
  };

  const updated = [newCombo, ...combos];
  setToStorage(STORAGE_KEYS.COMBOS, updated);
  return newCombo;
};

export const createCombo = addCombo;

export const updateCombo = (id: string, updates: Partial<Combo>): Combo => {
  const combos = getCombos();
  const index = combos.findIndex(c => c.id === id);
  if (index === -1) throw new Error('Combo not found');

  const updated = {
    ...combos[index],
    ...updates,
    updatedAt: new Date().toISOString()
  };

  combos[index] = updated;
  setToStorage(STORAGE_KEYS.COMBOS, combos);
  return updated;
};

export const deleteCombo = (id: string): boolean => {
  const combos = getCombos();
  const filtered = combos.filter(c => c.id !== id);
  setToStorage(STORAGE_KEYS.COMBOS, filtered);
  return true;
};

// ---------------- ORDERS ---------------- //
export const getOrders = (): Order[] => {
  return getFromStorage<Order[]>(STORAGE_KEYS.ORDERS, INITIAL_ORDERS);
};

export const getOrderById = (id: string): Order | undefined => {
  return getOrders().find(o => o.id === id);
};

export const updateOrderStatus = (
  orderId: string, 
  orderStatus: OrderStatus, 
  paymentStatus?: PaymentStatus, 
  trackingNumber?: string,
  note?: string
): Order => {
  const orders = getOrders();
  const index = orders.findIndex(o => o.id === orderId);
  if (index === -1) throw new Error('Order not found');

  const order = orders[index];
  const now = new Date().toISOString();
  
  const updatedHistory = [
    ...(order.statusHistory || []),
    { status: orderStatus, timestamp: now, note: note || `Order marked as ${orderStatus}` }
  ];

  const updatedOrder: Order = {
    ...order,
    orderStatus,
    paymentStatus: paymentStatus || order.paymentStatus,
    trackingNumber: trackingNumber !== undefined ? trackingNumber : order.trackingNumber,
    updatedAt: now,
    statusHistory: updatedHistory
  };

  orders[index] = updatedOrder;
  setToStorage(STORAGE_KEYS.ORDERS, orders);

  // Sync payments ledger if paymentStatus provided
  if (paymentStatus) {
    const payments = getPayments();
    const payIndex = payments.findIndex(p => p.orderId === orderId);
    if (payIndex !== -1) {
      payments[payIndex] = { ...payments[payIndex], status: paymentStatus };
      setToStorage(STORAGE_KEYS.PAYMENTS, payments);
    }
  }

  return updatedOrder;
};

// ---------------- USERS ---------------- //
export const getUsers = (): User[] => {
  return getFromStorage<User[]>(STORAGE_KEYS.USERS, INITIAL_USERS);
};

export const getUserById = (id: string): User | undefined => {
  return getUsers().find(u => u.id === id);
};

export const getUserOrders = (userId: string): Order[] => {
  const orders = getOrders();
  return orders.filter(o => o.customer.id === userId || o.customer.email === getUserById(userId)?.email);
};

export const updateUser = (id: string, updates: Partial<User>): User => {
  const users = getUsers();
  const index = users.findIndex(u => u.id === id);
  if (index === -1) throw new Error('User not found');

  const updated = { ...users[index], ...updates };
  users[index] = updated;
  setToStorage(STORAGE_KEYS.USERS, users);
  return updated;
};

export const deleteUser = (id: string): boolean => {
  const users = getUsers();
  const filtered = users.filter(u => u.id !== id);
  setToStorage(STORAGE_KEYS.USERS, filtered);
  return true;
};

// ---------------- PAYMENTS ---------------- //
export const getPayments = (): Payment[] => {
  return getFromStorage<Payment[]>(STORAGE_KEYS.PAYMENTS, INITIAL_PAYMENTS);
};

// ---------------- STORE SETTINGS ---------------- //
export const getSettings = (): StoreSettings => {
  return getFromStorage<StoreSettings>(STORAGE_KEYS.SETTINGS, DEFAULT_SETTINGS);
};

export const saveSettings = (newSettings: StoreSettings): StoreSettings => {
  setToStorage(STORAGE_KEYS.SETTINGS, newSettings);
  return newSettings;
};

// ---------------- EXPORT / IMPORT / RESET ---------------- //
export const exportStoreData = (): string => {
  const snapshot = {
    version: '1.0',
    exportedAt: new Date().toISOString(),
    products: getProducts(),
    categories: getCategories(),
    combos: getCombos(),
    orders: getOrders(),
    users: getUsers(),
    payments: getPayments(),
    settings: getSettings()
  };
  return JSON.stringify(snapshot, null, 2);
};

export const importStoreData = (jsonString: string): boolean => {
  try {
    const data = JSON.parse(jsonString);
    if (data.products && Array.isArray(data.products)) {
      setToStorage(STORAGE_KEYS.PRODUCTS, data.products);
    }
    if (data.categories && Array.isArray(data.categories)) {
      setToStorage(STORAGE_KEYS.CATEGORIES, data.categories);
    }
    if (data.combos && Array.isArray(data.combos)) {
      setToStorage(STORAGE_KEYS.COMBOS, data.combos);
    }
    if (data.orders && Array.isArray(data.orders)) {
      setToStorage(STORAGE_KEYS.ORDERS, data.orders);
    }
    if (data.users && Array.isArray(data.users)) {
      setToStorage(STORAGE_KEYS.USERS, data.users);
    }
    if (data.payments && Array.isArray(data.payments)) {
      setToStorage(STORAGE_KEYS.PAYMENTS, data.payments);
    }
    if (data.settings) {
      setToStorage(STORAGE_KEYS.SETTINGS, data.settings);
    }
    return true;
  } catch (err) {
    console.error('Failed to import JSON data:', err);
    return false;
  }
};

export const resetAllData = (): void => {
  localStorage.removeItem(STORAGE_KEYS.PRODUCTS);
  localStorage.removeItem(STORAGE_KEYS.CATEGORIES);
  localStorage.removeItem(STORAGE_KEYS.COMBOS);
  localStorage.removeItem(STORAGE_KEYS.USERS);
  localStorage.removeItem(STORAGE_KEYS.ORDERS);
  localStorage.removeItem(STORAGE_KEYS.PAYMENTS);
  localStorage.removeItem(STORAGE_KEYS.SETTINGS);
  syncCategoryProductCounts();
};

export const resetStoreToDefault = resetAllData;

// ---------------- DASHBOARD STATS ---------------- //
export const getDashboardStats = (dateRange: '7d' | '30d' | '3m' | '12m' = '30d'): DashboardStats => {
  const orders = getOrders();
  const products = getProducts();
  const users = getUsers();

  const totalRevenue = orders
    .filter(o => o.paymentStatus === 'paid')
    .reduce((sum, o) => sum + o.total, 0);

  const pendingOrdersCount = orders.filter(o => o.orderStatus === 'pending' || o.orderStatus === 'confirmed' || o.orderStatus === 'processing').length;
  const completedOrdersCount = orders.filter(o => o.orderStatus === 'delivered').length;

  const averageOrderValue = orders.length > 0 ? Math.round(totalRevenue / (orders.filter(o => o.paymentStatus === 'paid').length || 1)) : 0;
  
  const lowStockCount = products.filter(p => p.weightOptions.some(v => v.stock <= 15)).length;

  // Generate chart data based on date range
  let revenueByDate: { date: string; revenue: number; orders: number; cumulative?: number }[] = [];
  
  if (dateRange === '7d') {
    revenueByDate = [
      { date: 'Aug 09', revenue: 1420, orders: 2 },
      { date: 'Aug 10', revenue: 2150, orders: 3 },
      { date: 'Aug 11', revenue: 3400, orders: 4 },
      { date: 'Aug 12', revenue: 2850, orders: 3 },
      { date: 'Aug 13', revenue: 4120, orders: 5 },
      { date: 'Aug 14', revenue: 5390, orders: 6 },
      { date: 'Aug 15', revenue: 3950, orders: 4 }
    ];
  } else if (dateRange === '30d') {
    revenueByDate = [
      { date: 'Jul 18', revenue: 8400, orders: 11 },
      { date: 'Jul 23', revenue: 12100, orders: 15 },
      { date: 'Jul 28', revenue: 15600, orders: 19 },
      { date: 'Aug 02', revenue: 14200, orders: 18 },
      { date: 'Aug 07', revenue: 19800, orders: 24 },
      { date: 'Aug 12', revenue: 22400, orders: 27 },
      { date: 'Aug 15', revenue: 26800, orders: 31 }
    ];
  } else if (dateRange === '3m') {
    revenueByDate = [
      { date: 'Jun W1', revenue: 24500, orders: 32 },
      { date: 'Jun W3', revenue: 31200, orders: 41 },
      { date: 'Jul W1', revenue: 42800, orders: 53 },
      { date: 'Jul W3', revenue: 51600, orders: 64 },
      { date: 'Aug W1', revenue: 64300, orders: 78 },
      { date: 'Aug W2', revenue: 78900, orders: 92 }
    ];
  } else {
    revenueByDate = [
      { date: 'Sep 25', revenue: 48000, orders: 60 },
      { date: 'Nov 25', revenue: 72000, orders: 88 },
      { date: 'Jan 26', revenue: 95000, orders: 118 },
      { date: 'Mar 26', revenue: 120000, orders: 145 },
      { date: 'May 26', revenue: 165000, orders: 195 },
      { date: 'Jul 26', revenue: 210000, orders: 250 },
      { date: 'Aug 26', revenue: 248000, orders: 295 }
    ];
  }

  // Calculate cumulative amounts
  let runningTotal = 0;
  revenueByDate = revenueByDate.map(item => {
    runningTotal += item.revenue;
    return { ...item, cumulative: runningTotal };
  });

  const categoryRevenue = [
    { name: 'Ground Spices', revenue: 64200, orders: 74, color: '#173D2A' },
    { name: 'Whole Spices', revenue: 48500, orders: 56, color: '#245A3F' },
    { name: 'Artisanal Blends', revenue: 53100, orders: 62, color: '#D99B26' },
    { name: 'Gift Kits & Combos', revenue: 41800, orders: 38, color: '#E2B04A' },
    { name: 'Organic Specialties', revenue: 28400, orders: 30, color: '#4A7C59' }
  ];

  const orderStatusMap: Record<OrderStatus, number> = {
    pending: 0,
    confirmed: 0,
    processing: 0,
    shipped: 0,
    delivered: 0,
    cancelled: 0
  };
  orders.forEach(o => {
    orderStatusMap[o.orderStatus] = (orderStatusMap[o.orderStatus] || 0) + 1;
  });

  const orderStatusDistribution = [
    { name: 'Delivered', value: orderStatusMap.delivered || 3, color: '#173D2A' },
    { name: 'Shipped', value: orderStatusMap.shipped || 1, color: '#245A3F' },
    { name: 'Processing', value: orderStatusMap.processing || 1, color: '#D99B26' },
    { name: 'Confirmed', value: orderStatusMap.confirmed || 0, color: '#4A7C59' },
    { name: 'Pending', value: orderStatusMap.pending || 1, color: '#E2B04A' },
    { name: 'Cancelled', value: orderStatusMap.cancelled || 0, color: '#9E382B' }
  ].filter(item => item.value > 0);

  const paymentStatusMap: Record<PaymentStatus, number> = {
    paid: 0,
    pending: 0,
    failed: 0,
    refunded: 0
  };
  orders.forEach(o => {
    paymentStatusMap[o.paymentStatus] = (paymentStatusMap[o.paymentStatus] || 0) + 1;
  });

  const paymentDistribution = [
    { name: 'Paid', value: paymentStatusMap.paid || 5, color: '#173D2A' },
    { name: 'Pending', value: paymentStatusMap.pending || 1, color: '#D99B26' },
    { name: 'Failed', value: paymentStatusMap.failed || 0, color: '#9E382B' },
    { name: 'Refunded', value: paymentStatusMap.refunded || 0, color: '#882B20' }
  ].filter(item => item.value > 0);

  return {
    totalRevenue,
    revenueGrowth: 18.4,
    totalOrders: orders.length,
    ordersGrowth: 12.8,
    totalProducts: products.length,
    activeProducts: products.filter(p => p.status === 'active').length,
    totalUsers: users.length,
    usersGrowth: 24.1,
    pendingOrdersCount,
    completedOrdersCount,
    averageOrderValue,
    lowStockCount,
    revenueByDate,
    categoryRevenue,
    orderStatusDistribution,
    paymentDistribution
  };
};
