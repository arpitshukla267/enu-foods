import React, { useState } from 'react';
import { Sidebar } from './Sidebar';
import { Topbar } from './Topbar';
import { MobileBottomNav } from './MobileBottomNav';
import { ActiveTab } from '../../types';
import { X } from 'lucide-react';

interface AdminLayoutProps {
  children: React.ReactNode;
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  pendingOrdersCount?: number;
  lowStockCount?: number;
  onOpenStorePreview: () => void;
  onNewProduct: () => void;
  onNewCombo: () => void;
  onNewCategory: () => void;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({
  children,
  activeTab,
  setActiveTab,
  pendingOrdersCount = 0,
  lowStockCount = 0,
  onOpenStorePreview,
  onNewProduct,
  onNewCombo,
  onNewCategory
}) => {
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#F9F7F2] text-[#1A211D] flex flex-col lg:flex-row">
      {/* Desktop Persistent Sidebar */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        pendingOrdersCount={pendingOrdersCount}
        lowStockCount={lowStockCount}
        onOpenStorePreview={onOpenStorePreview}
      />

      {/* Mobile / Tablet Full Slide-out Drawer */}
      {isMobileDrawerOpen && (
        <div className="fixed inset-0 z-50 lg:hidden bg-black/60 backdrop-blur-xs flex animate-in fade-in duration-200">
          <div className="w-72 max-w-[85vw] h-full bg-[#173D2A] text-white flex flex-col shadow-2xl relative">
            <button
              onClick={() => setIsMobileDrawerOpen(false)}
              className="absolute top-4 right-4 p-2 rounded-xl bg-white/10 text-white hover:bg-white/20 transition-colors z-10"
              aria-label="Close navigation drawer"
            >
              <X className="w-5 h-5" />
            </button>

            <Sidebar
              isDrawer={true}
              activeTab={activeTab}
              setActiveTab={(tab) => {
                setActiveTab(tab);
                setIsMobileDrawerOpen(false);
              }}
              pendingOrdersCount={pendingOrdersCount}
              lowStockCount={lowStockCount}
              onOpenStorePreview={() => {
                setIsMobileDrawerOpen(false);
                onOpenStorePreview();
              }}
            />
          </div>
          <div 
            className="flex-1" 
            onClick={() => setIsMobileDrawerOpen(false)} 
          />
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 pb-16 lg:pb-0">
        {/* Topbar */}
        <Topbar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          pendingOrdersCount={pendingOrdersCount}
          lowStockCount={lowStockCount}
          onOpenStorePreview={onOpenStorePreview}
          onNewProduct={onNewProduct}
          onNewCombo={onNewCombo}
          onNewCategory={onNewCategory}
          onMobileMenuToggle={() => setIsMobileDrawerOpen(true)}
        />

        {/* Page Content Container */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>

      {/* Mobile Bottom Bar */}
      <MobileBottomNav
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        pendingOrdersCount={pendingOrdersCount}
        onOpenStorePreview={onOpenStorePreview}
      />
    </div>
  );
};
