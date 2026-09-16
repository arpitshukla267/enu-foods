import React, { useState, useEffect, useCallback } from 'react';
import { 
  ActiveTab, 
  Product, 
  Combo, 
  Recipe,
  Category, 
  Coupon,
  Order, 
  User, 
  Payment, 
  StoreSettings, 
  OrderStatus, 
  PaymentStatus,
  Subcategory 
} from './types';
import * as storeService from './services/storeService';
import * as adminCategoryApi from './lib/adminCategoryApi';
import * as adminProductApi from './lib/adminProductApi';
import { generateVariantSku } from './lib/productSku';
import * as adminComboApi from './lib/adminComboApi';
import * as adminRecipeApi from './lib/adminRecipeApi';
import * as adminCouponApi from './lib/adminCouponApi';
import * as adminOrderApi from './lib/adminOrderApi';
import * as adminDashboardApi from './lib/adminDashboardApi';
import * as adminSettingsApi from './lib/adminSettingsApi';
import { ApiError } from './lib/apiClient';
import { AdminLayout } from './components/layout/AdminLayout';
import { DashboardView } from './components/dashboard/DashboardView';
import { ProductsView } from './components/products/ProductsView';
import { ProductFormModal } from './components/products/ProductFormModal';
import { CombosView } from './components/combos/CombosView';
import { ComboFormModal } from './components/combos/ComboFormModal';
import { RecipesView } from './components/recipes/RecipesView';
import { RecipeFormModal } from './components/recipes/RecipeFormModal';
import { CategoriesView } from './components/categories/CategoriesView';
import { CategoryFormModal } from './components/categories/CategoryFormModal';
import { CouponsView } from './components/coupons/CouponsView';
import { CouponFormModal } from './components/coupons/CouponFormModal';
import { OrdersView } from './components/orders/OrdersView';
import { OrderDetailModal } from './components/orders/OrderDetailModal';
import { UsersView } from './components/users/UsersView';
import { UserDetailModal } from './components/users/UserDetailModal';
import { PaymentsView } from './components/payments/PaymentsView';
import { SettingsView } from './components/settings/SettingsView';
import { StorefrontPreview } from './components/storefront/StorefrontPreview';
import { Toast, ToastProps } from './components/common/Toast';

export default function App() {
  // Navigation
  const [activeTab, setActiveTab] = useState<ActiveTab>('dashboard');

  // Core Data State
  const [products, setProducts] = useState<Product[]>([]);
  const [productsVersion, setProductsVersion] = useState(0);
  const [combos, setCombos] = useState<Combo[]>([]);
  const [combosVersion, setCombosVersion] = useState(0);
  const [recipesVersion, setRecipesVersion] = useState(0);
  const [couponsVersion, setCouponsVersion] = useState(0);
  const [ordersVersion, setOrdersVersion] = useState(0);
  const [pendingOrdersCount, setPendingOrdersCount] = useState(0);
  const [lowStockCount, setLowStockCount] = useState(0);
  const [categories, setCategories] = useState<Category[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [settings, setSettings] = useState<StoreSettings>(storeService.getSettings());

  // Modal States
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [productToEdit, setProductToEdit] = useState<Product | null>(null);

  const [isComboModalOpen, setIsComboModalOpen] = useState(false);
  const [comboToEdit, setComboToEdit] = useState<Combo | null>(null);

  const [isRecipeModalOpen, setIsRecipeModalOpen] = useState(false);
  const [recipeToEdit, setRecipeToEdit] = useState<Recipe | null>(null);

  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [categoryToEdit, setCategoryToEdit] = useState<Category | null>(null);

  const [isCouponModalOpen, setIsCouponModalOpen] = useState(false);
  const [couponToEdit, setCouponToEdit] = useState<Coupon | null>(null);

  const [isOrderDetailOpen, setIsOrderDetailOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const [isUserDetailOpen, setIsUserDetailOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const [isStorefrontPreviewOpen, setIsStorefrontPreviewOpen] = useState(false);

  // Toast Notification State
  const [toast, setToast] = useState<{ isVisible: boolean; message: string; type: ToastProps['type'] }>({
    isVisible: false,
    message: '',
    type: 'success'
  });

  const showToast = useCallback((message: string, type: ToastProps['type'] = 'success') => {
    setToast({ isVisible: true, message, type });
  }, []);

  const hideToast = useCallback(() => {
    setToast(prev => ({ ...prev, isVisible: false }));
  }, []);

  const reloadCategories = useCallback(async () => {
    try {
      const nextCategories = await adminCategoryApi.getCategories();
      setCategories(nextCategories);
    } catch (error) {
      showToast(
        error instanceof ApiError
          ? error.message
          : error instanceof Error
            ? error.message
            : 'Failed to load categories',
        'error',
      );
    }
  }, [showToast]);

  const reloadData = useCallback(() => {
    setOrders(storeService.getOrders());
    setUsers(storeService.getUsers());
    setPayments(storeService.getPayments());
    setSettings(storeService.getSettings());
    setProductsVersion((value) => value + 1);
    setCombosVersion((value) => value + 1);
    setRecipesVersion((value) => value + 1);
  }, []);

  const refreshDashboardSummary = useCallback(async () => {
    try {
      const summary = await adminDashboardApi.getDashboardSummary();
      setPendingOrdersCount(summary.pendingOrders);
      setLowStockCount(summary.lowStock);
    } catch {
      setPendingOrdersCount(0);
      setLowStockCount(0);
    }
  }, []);

  const reloadSettings = useCallback(async () => {
    try {
      const liveSettings = await adminSettingsApi.getSettings();
      setSettings(liveSettings);
      storeService.saveSettings(liveSettings);
    } catch {
      setSettings(storeService.getSettings());
    }
  }, []);

  useEffect(() => {
    reloadData();
    reloadCategories();
    void reloadSettings();
  }, [reloadData, reloadCategories, reloadSettings, ordersVersion]);

  useEffect(() => {
    void refreshDashboardSummary();
  }, [refreshDashboardSummary, ordersVersion, productsVersion]);

  const lowStockCountDisplay = lowStockCount;

  // ----------------------------------------------------
  // PRODUCT HANDLERS
  // ----------------------------------------------------
  const handleOpenNewProduct = () => {
    setProductToEdit(null);
    setIsProductModalOpen(true);
  };

  const handleOpenEditProduct = (product: Product) => {
    setProductToEdit(product);
    setIsProductModalOpen(true);
  };

  const handleSaveProduct = async (
    productData: Omit<Product, "id" | "createdAt" | "updatedAt"> & {
      isBestSeller?: boolean;
      isNewArrival?: boolean;
    },
  ) => {
    try {
      if (productToEdit) {
        await adminProductApi.updateProduct(productToEdit.id, productData);
        showToast(`Updated "${productData.name}" successfully.`);
      } else {
        await adminProductApi.createProduct(productData);
        showToast(`Added new spice "${productData.name}" to catalog.`);
      }
      setIsProductModalOpen(false);
      setProductToEdit(null);
      setProductsVersion((value) => value + 1);
    } catch (error) {
      showToast(
        error instanceof ApiError
          ? error.message
          : error instanceof Error
            ? error.message
            : "Failed to save product",
        "error",
      );
    }
  };

  const handleDuplicateProduct = async (id: string) => {
    const source = products.find((product) => product.id === id);
    if (!source) return;

    try {
      await adminProductApi.createProduct({
        ...source,
        name: `${source.name} Copy`,
        slug: `${source.slug}-copy-${Date.now().toString(36)}`,
        status: "draft",
        weightOptions: source.weightOptions.map((variant) => ({
          ...variant,
          id: `var-${Date.now()}-${variant.weight}`,
          sku: generateVariantSku(`${source.name} Copy`, variant.weight),
        })),
      });
      showToast(`Duplicated "${source.name}" successfully.`);
      setProductsVersion((value) => value + 1);
    } catch (error) {
      showToast(
        error instanceof ApiError
          ? error.message
          : error instanceof Error
            ? error.message
            : "Failed to duplicate product",
        "error",
      );
    }
  };

  const handleDeleteProduct = async (id: string) => {
    const prod = products.find((p) => p.id === id);
    try {
      await adminProductApi.deleteProduct(id);
      showToast(`Deleted "${prod?.name || "product"}".`, "info");
      setProductsVersion((value) => value + 1);
    } catch (error) {
      showToast(
        error instanceof ApiError
          ? error.message
          : error instanceof Error
            ? error.message
            : "Failed to delete product",
        "error",
      );
    }
  };

  // ----------------------------------------------------
  // COMBO HANDLERS
  // ----------------------------------------------------
  const handleOpenNewCombo = () => {
    setComboToEdit(null);
    setIsComboModalOpen(true);
  };

  const handleOpenEditCombo = (combo: Combo) => {
    setComboToEdit(combo);
    setIsComboModalOpen(true);
  };

  const handleSaveCombo = async (
    comboData: Omit<Combo, 'id' | 'createdAt' | 'updatedAt'> & {
      price?: number;
      fullDescription?: string;
      customChefTip?: string;
    },
  ) => {
    try {
      if (comboToEdit) {
        await adminComboApi.updateCombo(comboToEdit.id, comboData);
        showToast(`Updated combo bundle "${comboData.title}".`);
      } else {
        await adminComboApi.createCombo(comboData);
        showToast(`Created new combo bundle "${comboData.title}".`);
      }
      setIsComboModalOpen(false);
      setComboToEdit(null);
      setCombosVersion((value) => value + 1);
    } catch (error) {
      showToast(
        error instanceof ApiError
          ? error.message
          : error instanceof Error
            ? error.message
            : 'Failed to save combo',
        'error',
      );
    }
  };

  const handleDeleteCombo = async (id: string) => {
    const combo = combos.find(c => c.id === id);
    try {
      await adminComboApi.deleteCombo(id);
      showToast(`Deleted combo "${combo?.title || 'bundle'}".`, 'info');
      setCombosVersion((value) => value + 1);
    } catch (error) {
      showToast(
        error instanceof ApiError
          ? error.message
          : error instanceof Error
            ? error.message
            : 'Failed to delete combo',
        'error',
      );
    }
  };

  // ----------------------------------------------------
  // RECIPE HANDLERS
  // ----------------------------------------------------
  const handleOpenNewRecipe = () => {
    setRecipeToEdit(null);
    setIsRecipeModalOpen(true);
  };

  const handleOpenEditRecipe = (recipe: Recipe) => {
    setRecipeToEdit(recipe);
    setIsRecipeModalOpen(true);
  };

  const handleSaveRecipe = async (
    recipeData: Omit<Recipe, 'id' | 'createdAt' | 'updatedAt'>,
  ) => {
    try {
      if (recipeToEdit) {
        await adminRecipeApi.updateRecipe(recipeToEdit.id, recipeData);
        showToast(`Updated recipe "${recipeData.title}".`);
      } else {
        await adminRecipeApi.createRecipe(recipeData);
        showToast(`Created recipe "${recipeData.title}".`);
      }
      setIsRecipeModalOpen(false);
      setRecipeToEdit(null);
      setRecipesVersion((value) => value + 1);
    } catch (error) {
      showToast(
        error instanceof ApiError
          ? error.message
          : error instanceof Error
            ? error.message
            : 'Failed to save recipe',
        'error',
      );
    }
  };

  const handleDeleteRecipe = async (id: string) => {
    try {
      await adminRecipeApi.deleteRecipe(id);
      showToast('Recipe deleted.', 'info');
      setRecipesVersion((value) => value + 1);
    } catch (error) {
      showToast(
        error instanceof ApiError
          ? error.message
          : error instanceof Error
            ? error.message
            : 'Failed to delete recipe',
        'error',
      );
    }
  };

  // ----------------------------------------------------
  // CATEGORY & SUBCATEGORY HANDLERS
  // ----------------------------------------------------
  const handleOpenNewCategory = () => {
    setCategoryToEdit(null);
    setIsCategoryModalOpen(true);
  };

  const handleOpenEditCategory = (category: Category) => {
    setCategoryToEdit(category);
    setIsCategoryModalOpen(true);
  };

  const handleSaveCategory = async (catData: Omit<Category, 'id' | 'subcategories' | 'productCount'>) => {
    try {
      if (categoryToEdit) {
        await adminCategoryApi.updateCategory(categoryToEdit.id, catData);
        showToast(`Updated category "${catData.name}".`);
      } else {
        await adminCategoryApi.createCategory(catData);
        showToast(`Created new category "${catData.name}".`);
      }
      setIsCategoryModalOpen(false);
      setCategoryToEdit(null);
      await reloadCategories();
    } catch (error) {
      showToast(
        error instanceof ApiError
          ? error.message
          : error instanceof Error
            ? error.message
            : 'Failed to save category',
        'error',
      );
    }
  };

  const handleDeleteCategory = async (id: string) => {
    const cat = categories.find(c => c.id === id);
    try {
      await adminCategoryApi.deleteCategory(id);
      showToast(`Deleted category "${cat?.name || ''}".`, 'info');
      await reloadCategories();
    } catch (error) {
      showToast(
        error instanceof ApiError
          ? error.message
          : error instanceof Error
            ? error.message
            : 'Failed to delete category',
        'error',
      );
    }
  };

  const handleAddSubcategory = async (categoryId: string, name: string, slug: string) => {
    try {
      await adminCategoryApi.addSubcategory(categoryId, { name, slug });
      showToast(`Added subcategory "${name}".`);
      await reloadCategories();
    } catch (error) {
      showToast(
        error instanceof ApiError
          ? error.message
          : error instanceof Error
            ? error.message
            : 'Failed to add subcategory',
        'error',
      );
    }
  };

  const handleUpdateSubcategory = async (categoryId: string, subcategoryId: string, updates: Partial<Subcategory>) => {
    try {
      await adminCategoryApi.updateSubcategory(categoryId, subcategoryId, updates);
      showToast(`Updated subcategory.`);
      await reloadCategories();
    } catch (error) {
      showToast(
        error instanceof ApiError
          ? error.message
          : error instanceof Error
            ? error.message
            : 'Failed to update subcategory',
        'error',
      );
    }
  };

  const handleDeleteSubcategory = async (categoryId: string, subcategoryId: string) => {
    try {
      await adminCategoryApi.deleteSubcategory(categoryId, subcategoryId);
      showToast(`Removed subcategory.`, 'info');
      await reloadCategories();
    } catch (error) {
      showToast(
        error instanceof ApiError
          ? error.message
          : error instanceof Error
            ? error.message
            : 'Failed to delete subcategory',
        'error',
      );
    }
  };

  // ----------------------------------------------------
  // COUPON HANDLERS
  // ----------------------------------------------------
  const handleOpenNewCoupon = () => {
    setCouponToEdit(null);
    setIsCouponModalOpen(true);
  };

  const handleOpenEditCoupon = (coupon: Coupon) => {
    setCouponToEdit(coupon);
    setIsCouponModalOpen(true);
  };

  const handleSaveCoupon = async (payload: adminCouponApi.CouponPayload) => {
    try {
      if (couponToEdit) {
        await adminCouponApi.updateCoupon(couponToEdit.id, payload);
        showToast(`Updated coupon "${payload.code}".`);
      } else {
        await adminCouponApi.createCoupon(payload);
        showToast(`Created coupon "${payload.code}".`);
      }
      setIsCouponModalOpen(false);
      setCouponToEdit(null);
      setCouponsVersion((current) => current + 1);
    } catch (error) {
      showToast(
        error instanceof ApiError
          ? error.message
          : error instanceof Error
            ? error.message
            : 'Failed to save coupon',
        'error',
      );
    }
  };

  // ----------------------------------------------------
  // ORDER HANDLERS
  // ----------------------------------------------------
  const handleViewOrder = (order: Order) => {
    setSelectedOrder(order);
    setIsOrderDetailOpen(true);
  };

  const handleUpdateOrderStatus = async (
    orderId: string,
    orderStatus: OrderStatus,
    paymentStatus: PaymentStatus,
    trackingNumber?: string,
  ) => {
    try {
      const updated = await adminOrderApi.updateOrderStatus(orderId, {
        orderStatus,
        paymentStatus,
        trackingNumber,
      });
      showToast(`Order status updated to ${orderStatus.toUpperCase()}.`);
      setOrdersVersion((current) => current + 1);
      if (selectedOrder && selectedOrder.id === orderId) {
        setSelectedOrder(updated);
      }
    } catch (error) {
      showToast(
        error instanceof ApiError
          ? error.message
          : error instanceof Error
            ? error.message
            : 'Failed to update order status',
        'error',
      );
    }
  };

  // ----------------------------------------------------
  // USER HANDLERS
  // ----------------------------------------------------
  const handleViewUser = (user: User) => {
    setSelectedUser(user);
    setIsUserDetailOpen(true);
  };

  // ----------------------------------------------------
  // SETTINGS & DATA BACKUP HANDLERS
  // ----------------------------------------------------
  const handleSaveSettings = async (newSettings: StoreSettings) => {
    try {
      const saved = await adminSettingsApi.updateSettings(newSettings);
      setSettings(saved);
      storeService.saveSettings(saved);
      showToast('Store settings saved successfully.');
    } catch (err) {
      storeService.saveSettings(newSettings);
      setSettings(newSettings);
      showToast(err instanceof Error ? err.message : 'Settings saved locally', 'info');
    }
  };

  const handleExportData = () => {
    const data = storeService.exportStoreData();
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `enu-foods-store-backup-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showToast('Downloaded complete JSON backup.');
  };

  const handleImportData = (jsonData: string) => {
    const success = storeService.importStoreData(jsonData);
    if (success) {
      reloadData();
      showToast('Store data imported successfully!');
    } else {
      showToast('Invalid backup file format.', 'error');
    }
  };

  const handleResetSeedData = () => {
    storeService.resetAllData();
    reloadData();
    showToast('Reset store data to factory seed state.', 'info');
  };

  return (
    <AdminLayout
      activeTab={activeTab}
      setActiveTab={setActiveTab}
      pendingOrdersCount={pendingOrdersCount}
      lowStockCount={lowStockCountDisplay}
      onOpenStorePreview={() => setIsStorefrontPreviewOpen(true)}
      onNewProduct={handleOpenNewProduct}
      onNewCombo={handleOpenNewCombo}
      onNewCategory={handleOpenNewCategory}
    >
      {/* Dynamic Tab Page Views */}
      {activeTab === 'dashboard' && (
        <DashboardView
          setActiveTab={setActiveTab}
          onViewOrder={handleViewOrder}
          onViewUser={handleViewUser}
          refreshToken={ordersVersion}
        />
      )}

      {activeTab === 'products' && (
        <ProductsView
          categories={categories}
          refreshToken={productsVersion}
          onProductsLoaded={setProducts}
          onNewProduct={handleOpenNewProduct}
          onEditProduct={handleOpenEditProduct}
          onDuplicateProduct={handleDuplicateProduct}
          onDeleteProduct={handleDeleteProduct}
          onViewProduct={() => setIsStorefrontPreviewOpen(true)}
        />
      )}

      {activeTab === 'combos' && (
        <CombosView
          refreshToken={combosVersion}
          onCombosLoaded={setCombos}
          onNewCombo={handleOpenNewCombo}
          onEditCombo={handleOpenEditCombo}
          onDeleteCombo={handleDeleteCombo}
        />
      )}

      {activeTab === 'recipes' && (
        <RecipesView
          refreshToken={recipesVersion}
          onNewRecipe={handleOpenNewRecipe}
          onEditRecipe={handleOpenEditRecipe}
          onDeleteRecipe={handleDeleteRecipe}
        />
      )}

      {activeTab === 'categories' && (
        <CategoriesView
          categories={categories}
          onNewCategory={handleOpenNewCategory}
          onEditCategory={handleOpenEditCategory}
          onDeleteCategory={handleDeleteCategory}
          onAddSubcategory={handleAddSubcategory}
          onUpdateSubcategory={handleUpdateSubcategory}
          onDeleteSubcategory={handleDeleteSubcategory}
        />
      )}

      {activeTab === 'coupons' && (
        <CouponsView
          categories={categories}
          refreshToken={couponsVersion}
          onNewCoupon={handleOpenNewCoupon}
          onEditCoupon={handleOpenEditCoupon}
        />
      )}

      {activeTab === 'orders' && (
        <OrdersView
          refreshToken={ordersVersion}
          onViewOrder={handleViewOrder}
          onUpdateOrderStatus={handleUpdateOrderStatus}
        />
      )}

      {activeTab === 'users' && (
        <UsersView
          onViewUser={handleViewUser}
        />
      )}

      {activeTab === 'payments' && (
        <PaymentsView
          payments={payments}
        />
      )}

      {activeTab === 'settings' && (
        <SettingsView
          settings={settings}
          onSaveSettings={handleSaveSettings}
          onExportData={handleExportData}
          onImportData={handleImportData}
          onResetSeedData={handleResetSeedData}
        />
      )}

      {/* Global Modals */}
      <ProductFormModal
        isOpen={isProductModalOpen}
        onClose={() => setIsProductModalOpen(false)}
        onSave={handleSaveProduct}
        productToEdit={productToEdit}
        categories={categories}
      />

      <ComboFormModal
        isOpen={isComboModalOpen}
        onClose={() => setIsComboModalOpen(false)}
        onSave={handleSaveCombo}
        comboToEdit={comboToEdit}
      />

      <RecipeFormModal
        isOpen={isRecipeModalOpen}
        onClose={() => setIsRecipeModalOpen(false)}
        onSave={handleSaveRecipe}
        recipeToEdit={recipeToEdit}
      />

      <CategoryFormModal
        isOpen={isCategoryModalOpen}
        onClose={() => setIsCategoryModalOpen(false)}
        onSave={handleSaveCategory}
        categoryToEdit={categoryToEdit}
      />

      <CouponFormModal
        isOpen={isCouponModalOpen}
        onClose={() => setIsCouponModalOpen(false)}
        onSave={handleSaveCoupon}
        couponToEdit={couponToEdit}
        categories={categories}
      />

      <OrderDetailModal
        isOpen={isOrderDetailOpen}
        onClose={() => setIsOrderDetailOpen(false)}
        order={selectedOrder}
        onUpdateStatus={handleUpdateOrderStatus}
      />

      <UserDetailModal
        isOpen={isUserDetailOpen}
        onClose={() => setIsUserDetailOpen(false)}
        user={selectedUser}
        userOrders={selectedUser ? orders.filter(o => o.customer?.id === selectedUser.id || o.customer?.email === selectedUser.email) : []}
        onViewOrder={handleViewOrder}
      />

      <StorefrontPreview
        isOpen={isStorefrontPreviewOpen}
        onClose={() => setIsStorefrontPreviewOpen(false)}
        products={products}
        combos={combos}
        categories={categories}
      />

      {/* Toast Notification */}
      <Toast
        message={toast.message}
        type={toast.type}
        isVisible={toast.isVisible}
        onClose={hideToast}
      />
    </AdminLayout>
  );
}
