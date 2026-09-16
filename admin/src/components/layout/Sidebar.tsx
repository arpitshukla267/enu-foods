import React from 'react';
import { 
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
  Store,
  ChevronRight,
  ShieldCheck
} from 'lucide-react';
import { ActiveTab } from '../../types';

interface SidebarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  pendingOrdersCount?: number;
  lowStockCount?: number;
  onOpenStorePreview?: () => void;
  isDrawer?: boolean;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  pendingOrdersCount = 0,
  lowStockCount = 0,
  onOpenStorePreview,
  isDrawer = false
}) => {
  const navItems = [
    { id: 'dashboard' as ActiveTab, label: 'Dashboard', icon: LayoutDashboard },
    { 
      id: 'orders' as ActiveTab, 
      label: 'Orders', 
      icon: ShoppingBag, 
      badge: pendingOrdersCount > 0 ? pendingOrdersCount : undefined,
      badgeColor: 'bg-[#D99B26] text-[#173D2A]'
    },
    { 
      id: 'products' as ActiveTab, 
      label: 'Products', 
      icon: Package,
      badge: lowStockCount > 0 ? `${lowStockCount} Low` : undefined,
      badgeColor: 'bg-[#9E382B] text-white'
    },
    { id: 'combos' as ActiveTab, label: 'Combos & Kits', icon: Boxes },
    { id: 'recipes' as ActiveTab, label: 'Recipes', icon: ChefHat },
    { id: 'categories' as ActiveTab, label: 'Categories', icon: Tags },
    { id: 'coupons' as ActiveTab, label: 'Coupons', icon: Ticket },
    { id: 'users' as ActiveTab, label: 'Customers', icon: Users },
    { id: 'payments' as ActiveTab, label: 'Payments', icon: CreditCard },
    { id: 'settings' as ActiveTab, label: 'Store Settings', icon: Settings },
  ];

  return (
    <aside className={`${
      isDrawer 
        ? 'flex flex-col w-full h-full bg-[#173D2A] text-[#F9F7F2]' 
        : 'hidden lg:flex flex-col w-64 bg-[#173D2A] text-[#F9F7F2] border-r border-[#0F281B] select-none h-screen sticky top-0 shrink-0'
    }`}>
      {/* Brand Header */}
      <div className="p-6 border-b border-[#245A3F] flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#D99B26] flex items-center justify-center text-[#173D2A] font-medium text-xl shadow-md border border-[#E2B04A]">
            <span className="font-brand-logo">E</span>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-brand-logo text-lg font-semibold tracking-widest text-[#F9F7F2]">
                ENU
              </span>
              <span className="text-xs uppercase px-1.5 py-0.5 rounded-sm bg-[#D99B26]/20 text-[#D99B26] font-medium border border-[#D99B26]/40">
                FOODS
              </span>
            </div>
            <p className="text-[11px] text-[#A6C5B3] font-medium tracking-wide uppercase mt-0.5">
              Operations CMS
            </p>
          </div>
        </div>
      </div>

      {/* Main Nav Items */}
      <div className="flex-1 px-3 py-5 overflow-y-auto space-y-1.5">
        <div className="px-3 pb-2 text-[10px] font-medium uppercase tracking-wider text-[#7FA690]">
          Management Modules
        </div>

        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                isActive
                  ? 'bg-[#D99B26] text-[#173D2A] shadow-md font-medium'
                  : 'text-[#E2EBE5] hover:bg-[#245A3F] hover:text-[#FFFFFF]'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-[#173D2A]' : 'text-[#A6C5B3]'}`} />
                <span>{item.label}</span>
              </div>
              
              <div className="flex items-center gap-1.5">
                {item.badge && (
                  <span className={`text-[11px] px-2 py-0.5 rounded-full font-medium uppercase ${item.badgeColor}`}>
                    {item.badge}
                  </span>
                )}
                {isActive && <ChevronRight className="w-3.5 h-3.5 text-[#173D2A]" />}
              </div>
            </button>
          );
        })}
      </div>

      {/* Storefront Link & Admin Info */}
      <div className="p-4 border-t border-[#245A3F] bg-[#112E20]/60 space-y-3">
        {onOpenStorePreview && (
          <button
            onClick={onOpenStorePreview}
            className="w-full flex items-center justify-center gap-2 px-3 py-2.5 text-xs font-medium text-[#173D2A] bg-[#D99B26] hover:bg-[#E2B04A] rounded-xl shadow-xs transition-colors"
          >
            <Store className="w-4 h-4 text-[#173D2A]" />
            <span>Preview Live Storefront</span>
          </button>
        )}

        <div className="flex items-center gap-3 pt-1">
          <div className="w-8 h-8 rounded-full bg-[#245A3F] border border-[#3E805E] flex items-center justify-center text-xs font-medium text-[#D99B26]">
            EA
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-medium text-[#F9F7F2] truncate">
              Operations Lead
            </p>
            <div className="flex items-center gap-1 text-[10px] text-[#A6C5B3]">
              <ShieldCheck className="w-3 h-3 text-[#D99B26]" />
              <span>Full Admin Access</span>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
};
