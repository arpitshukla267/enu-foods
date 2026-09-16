import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  ShoppingBag, 
  Package, 
  Users, 
  MoreHorizontal,
  Boxes,
  ChefHat,
  Tags,
  Ticket,
  CreditCard,
  Settings,
  Store,
  X
} from 'lucide-react';
import { ActiveTab } from '../../types';

interface MobileBottomNavProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  pendingOrdersCount?: number;
  onOpenStorePreview?: () => void;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  activeTab,
  setActiveTab,
  pendingOrdersCount = 0,
  onOpenStorePreview
}) => {
  const [isMoreOpen, setIsMoreOpen] = useState(false);

  const mainItems = [
    { id: 'dashboard' as ActiveTab, label: 'Dashboard', icon: LayoutDashboard },
    { 
      id: 'orders' as ActiveTab, 
      label: 'Orders', 
      icon: ShoppingBag, 
      badge: pendingOrdersCount > 0 ? pendingOrdersCount : undefined 
    },
    { id: 'products' as ActiveTab, label: 'Products', icon: Package },
    { id: 'users' as ActiveTab, label: 'Customers', icon: Users },
  ];

  const moreItems = [
    { id: 'combos' as ActiveTab, label: 'Combos & Recipe Kits', icon: Boxes, desc: 'Curated spice bundles' },
    { id: 'recipes' as ActiveTab, label: 'Recipes', icon: ChefHat, desc: 'Chef-crafted storefront recipes' },
    { id: 'categories' as ActiveTab, label: 'Categories & Subcategories', icon: Tags, desc: 'Spice families & taxonomy' },
    { id: 'coupons' as ActiveTab, label: 'Coupons & Discounts', icon: Ticket, desc: 'Promo codes and usage rules' },
    { id: 'payments' as ActiveTab, label: 'Payments & Transactions', icon: CreditCard, desc: 'Ledger & payment methods' },
    { id: 'settings' as ActiveTab, label: 'Store Settings', icon: Settings, desc: 'Shipping & configuration' }
  ];

  const isMoreActive = ['combos', 'recipes', 'categories', 'payments', 'settings'].includes(activeTab);

  return (
    <>
      {/* More Drawer Sheet */}
      {isMoreOpen && (
        <div className="fixed inset-0 z-50 lg:hidden bg-black/60 backdrop-blur-xs flex flex-col justify-end animate-in fade-in duration-150">
          <div className="bg-white rounded-t-2xl border-t border-[#E8E2D5] p-5 shadow-2xl space-y-4 max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-[#F0EBE0]">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-[#173D2A] text-[#D99B26] flex items-center justify-center font-bold text-xs">
                  E
                </div>
                <h3 className="text-base font-bold text-[#173D2A] font-serif-brand">
                  More Operations
                </h3>
              </div>
              <button
                onClick={() => setIsMoreOpen(false)}
                className="p-1.5 rounded-lg text-[#7A7160] hover:bg-[#F4EFE6]"
                aria-label="Close drawer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-1 gap-2">
              {moreItems.map((item) => {
                const Icon = item.icon;
                const isCurrent = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setActiveTab(item.id);
                      setIsMoreOpen(false);
                    }}
                    className={`flex items-center gap-3.5 p-3 rounded-xl text-left transition-colors ${
                      isCurrent
                        ? 'bg-[#173D2A] text-[#F9F7F2]'
                        : 'bg-[#F9F7F2] text-[#1A211D] hover:bg-[#F4EFE6] border border-[#E8E2D5]'
                    }`}
                  >
                    <div className={`p-2 rounded-lg ${isCurrent ? 'bg-[#245A3F] text-[#D99B26]' : 'bg-white text-[#173D2A] border border-[#E5DEC9]'}`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-sm font-semibold">{item.label}</div>
                      <div className={`text-xs ${isCurrent ? 'text-[#A6C5B3]' : 'text-[#736854]'}`}>{item.desc}</div>
                    </div>
                  </button>
                );
              })}

              {onOpenStorePreview && (
                <button
                  onClick={() => {
                    setIsMoreOpen(false);
                    onOpenStorePreview();
                  }}
                  className="flex items-center gap-3.5 p-3 rounded-xl text-left bg-[#F4EFE6] text-[#173D2A] border border-[#DCD4C0] mt-2"
                >
                  <div className="p-2 rounded-lg bg-[#D99B26]/20 text-[#D99B26]">
                    <Store className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-sm font-semibold">Customer Storefront</div>
                    <div className="text-xs text-[#736854]">Preview live website</div>
                  </div>
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Fixed Bottom Bar */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#173D2A] border-t border-[#245A3F] text-[#E2EBE5] px-2 py-1.5 shadow-lg">
        <div className="flex items-center justify-around">
          {mainItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex flex-col items-center justify-center py-1 px-3 rounded-lg text-[10px] font-medium transition-all relative ${
                  isActive ? 'text-[#D99B26] font-bold' : 'text-[#E2EBE5]/80 hover:text-white'
                }`}
              >
                <div className="relative">
                  <Icon className={`w-5 h-5 mb-0.5 ${isActive ? 'text-[#D99B26]' : 'text-[#A6C5B3]'}`} />
                  {item.badge !== undefined && (
                    <span className="absolute -top-1 -right-2 px-1.5 py-0.2 bg-[#D99B26] text-[#173D2A] text-[9px] font-bold rounded-full">
                      {item.badge}
                    </span>
                  )}
                </div>
                <span>{item.label}</span>
              </button>
            );
          })}

          <button
            onClick={() => setIsMoreOpen(true)}
            className={`flex flex-col items-center justify-center py-1 px-3 rounded-lg text-[10px] font-medium transition-all ${
              isMoreActive ? 'text-[#D99B26] font-bold' : 'text-[#E2EBE5]/80 hover:text-white'
            }`}
          >
            <MoreHorizontal className={`w-5 h-5 mb-0.5 ${isMoreActive ? 'text-[#D99B26]' : 'text-[#A6C5B3]'}`} />
            <span>More</span>
          </button>
        </div>
      </nav>
    </>
  );
};
