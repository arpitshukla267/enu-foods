import React, { useState } from 'react';
import { 
  Search, 
  Bell, 
  Store, 
  Plus, 
  Clock,
  Menu,
  ChevronDown,
  LayoutDashboard,
  ShoppingBag,
  Package,
  Boxes,
  ChefHat,
  Tags,
  Ticket,
  Users,
  CreditCard,
  Settings,
  Check
} from 'lucide-react';
import { ActiveTab } from '../../types';

interface TopbarProps {
  activeTab: ActiveTab;
  setActiveTab?: (tab: ActiveTab) => void;
  pendingOrdersCount?: number;
  lowStockCount?: number;
  onOpenStorePreview: () => void;
  onNewProduct: () => void;
  onNewCombo: () => void;
  onNewCategory: () => void;
  onMobileMenuToggle?: () => void;
}

export const Topbar: React.FC<TopbarProps> = ({
  activeTab,
  setActiveTab,
  pendingOrdersCount = 0,
  lowStockCount = 0,
  onOpenStorePreview,
  onNewProduct,
  onNewCombo,
  onNewCategory,
  onMobileMenuToggle
}) => {
  const [isQuickOpen, setIsQuickOpen] = useState(false);
  const [isPageSelectorOpen, setIsPageSelectorOpen] = useState(false);

  const pages: { id: ActiveTab; label: string; icon: React.ElementType; badge?: string; badgeColor?: string; subtitle: string }[] = [
    { 
      id: 'dashboard', 
      label: 'Dashboard', 
      icon: LayoutDashboard,
      subtitle: 'Real-time sales, revenue trends, and dispatch metrics'
    },
    { 
      id: 'orders', 
      label: 'Orders', 
      icon: ShoppingBag, 
      badge: pendingOrdersCount > 0 ? `${pendingOrdersCount}` : undefined,
      badgeColor: 'bg-[#D99B26] text-[#173D2A]',
      subtitle: 'Track and process customer spice shipments'
    },
    { 
      id: 'products', 
      label: 'Products', 
      icon: Package,
      badge: lowStockCount > 0 ? `${lowStockCount} Low` : undefined,
      badgeColor: 'bg-[#9E382B] text-white',
      subtitle: 'Manage spice catalog, variants, pricing, and stock'
    },
    { 
      id: 'combos', 
      label: 'Combos & Kits', 
      icon: Boxes,
      subtitle: 'Curated spice bundles and culinary gift boxes'
    },
    { 
      id: 'recipes', 
      label: 'Recipes', 
      icon: ChefHat,
      subtitle: 'Manage chef-crafted recipes on the storefront'
    },
    { 
      id: 'categories', 
      label: 'Categories', 
      icon: Tags,
      subtitle: 'Spice families, subcategories, and origin taxonomy'
    },
    { 
      id: 'coupons', 
      label: 'Coupons', 
      icon: Ticket,
      subtitle: 'Discount codes, usage limits, and restrictions'
    },
    { 
      id: 'users', 
      label: 'Customers', 
      icon: Users,
      subtitle: 'Customer directory, order histories, and addresses'
    },
    { 
      id: 'payments', 
      label: 'Payments', 
      icon: CreditCard,
      subtitle: 'Financial ledger across UPI, Cards, Net Banking, COD'
    },
    { 
      id: 'settings', 
      label: 'Settings', 
      icon: Settings,
      subtitle: 'Store logistics, shipping thresholds, and backup'
    }
  ];

  const currentPage = pages.find(p => p.id === activeTab) || pages[0];

  return (
    <header className="sticky top-0 z-30 bg-[#FFFFFF] border-b border-[#E8E2D5] shadow-xs">
      {/* Primary Top Row */}
      <div className="px-4 lg:px-8 py-3 flex items-center justify-between gap-4">
        {/* Left: Mobile Menu & Current Page Title with Page Switcher */}
        <div className="flex items-center gap-3">
          {onMobileMenuToggle && (
            <button
              onClick={onMobileMenuToggle}
              className="lg:hidden p-2 rounded-xl text-[#173D2A] bg-[#F4EFE6] hover:bg-[#EAE2D2] border border-[#DCD4C0] transition-colors"
              aria-label="Toggle navigation menu"
            >
              <Menu className="w-5 h-5" />
            </button>
          )}

          <div className="relative">
            <button
              onClick={() => setIsPageSelectorOpen(!isPageSelectorOpen)}
              className="flex items-center gap-2 group text-left"
              title="Click to jump to any page"
            >
              <div className="flex flex-col">
                <span className="text-base sm:text-lg font-bold text-[#173D2A] font-serif-brand tracking-tight flex items-center gap-1 group-hover:text-[#D99B26] transition-colors">
                  {currentPage.label}
                </span>
                <div className="flex items-center gap-1.5">
                  <span className="text-[11px] font-bold text-[#8F816B] uppercase tracking-wider hidden sm:inline">
                    ENU Operations 
                  </span>
                </div>
                <p className="text-[11px] text-[#736854] hidden md:block mt-0.5">
                  {currentPage.subtitle}
                </p>
              </div>
            </button>
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
  

          {/* Quick Add Dropdown */}
          <div className="relative">
            <button
              onClick={() => setIsQuickOpen(!isQuickOpen)}
              className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold text-white bg-[#173D2A] hover:bg-[#0F281B] rounded-xl shadow-xs transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Quick Add</span>
              <ChevronDown className="w-3 h-3 ml-0.5 opacity-80" />
            </button>

            {isQuickOpen && (
              <>
                <div 
                  className="fixed inset-0 z-40" 
                  onClick={() => setIsQuickOpen(false)} 
                />
                <div className="absolute right-0 mt-2 w-52 bg-white rounded-2xl border border-[#E8E2D5] shadow-2xl py-2 z-50 animate-in fade-in zoom-in-95 duration-100">
                  <div className="px-3.5 py-1 text-[10px] font-bold uppercase tracking-wider text-[#736854] border-b border-[#F4EFE6]">
                    Add New Records
                  </div>
                  <button
                    onClick={() => {
                      setIsQuickOpen(false);
                      onNewProduct();
                    }}
                    className="w-full text-left px-3.5 py-2.5 text-xs font-medium text-[#1A211D] hover:bg-[#F9F7F2] hover:text-[#173D2A] flex items-center justify-between"
                  >
                    <span>Add New Spice / Product</span>
                    <span className="text-[10px] text-[#8F816B] font-semibold">+ Product</span>
                  </button>
                  <button
                    onClick={() => {
                      setIsQuickOpen(false);
                      onNewCombo();
                    }}
                    className="w-full text-left px-3.5 py-2.5 text-xs font-medium text-[#1A211D] hover:bg-[#F9F7F2] hover:text-[#173D2A] flex items-center justify-between"
                  >
                    <span>Add Combo / Recipe Kit</span>
                    <span className="text-[10px] text-[#8F816B] font-semibold">+ Combo</span>
                  </button>
                  <button
                    onClick={() => {
                      setIsQuickOpen(false);
                      onNewCategory();
                    }}
                    className="w-full text-left px-3.5 py-2.5 text-xs font-medium text-[#1A211D] hover:bg-[#F9F7F2] hover:text-[#173D2A] flex items-center justify-between"
                  >
                    <span>Add Spice Category</span>
                    <span className="text-[10px] text-[#8F816B] font-semibold">+ Category</span>
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Secondary Horizontal Nav Bar - Scrollable tabs available on all devices */}
  
    </header>
  );
};
