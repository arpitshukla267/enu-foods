import React from 'react';
import { NavigationPage } from '../../types';
import { Home, Flame, ChefHat, Tag, User } from 'lucide-react';

interface MobileBottomNavProps {
  currentPage: NavigationPage;
  onNavigate: (page: NavigationPage) => void;
  cartCount?: number;
  onOpenCart?: () => void;
  onOpenAuth?: () => void;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  currentPage,
  onNavigate,
  onOpenAuth,
}) => {
  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-[#1E3A2B] text-white border-t border-[#D6A146]/30 shadow-2xl px-2 py-1.5 flex items-center justify-around font-btn">
      
      {/* Home */}
      <button 
        onClick={() => onNavigate('home')}
        className={`flex flex-col items-center py-1 px-2.5 rounded-xl transition-colors ${
          currentPage === 'home' ? 'text-[#D6A146] font-bold bg-white/10' : 'text-gray-300 hover:text-white'
        }`}
      >
        <Home className="w-5 h-5" />
        <span className="text-[10px] mt-0.5">Home</span>
      </button>

      {/* Spices */}
      <button 
        onClick={() => onNavigate('products')}
        className={`flex flex-col items-center py-1 px-2.5 rounded-xl transition-colors ${
          currentPage === 'products' || currentPage === 'product-detail' ? 'text-[#D6A146] font-bold bg-white/10' : 'text-gray-300 hover:text-white'
        }`}
      >
        <Flame className="w-5 h-5" />
        <span className="text-[10px] mt-0.5">Spices</span>
      </button>

      {/* Super Saver */}
      <button 
        onClick={() => onNavigate('combos')}
        className={`flex flex-col items-center py-1 px-2.5 rounded-xl transition-colors ${
          currentPage === 'combos' ? 'text-[#D6A146] font-bold bg-white/10' : 'text-gray-300 hover:text-white'
        }`}
      >
        <Tag className="w-5 h-5" />
        <span className="text-[10px] mt-0.5 whitespace-nowrap">Super Saver</span>
      </button>

      {/* Recipes */}
      <button 
        onClick={() => onNavigate('recipes')}
        className={`flex flex-col items-center py-1 px-2.5 rounded-xl transition-colors ${
          currentPage === 'recipes' || currentPage === 'recipe-detail' ? 'text-[#D6A146] font-bold bg-white/10' : 'text-gray-300 hover:text-white'
        }`}
      >
        <ChefHat className="w-5 h-5" />
        <span className="text-[10px] mt-0.5">Recipes</span>
      </button>

      {/* Account */}
      <button 
        onClick={() => {
          const storedUser = localStorage.getItem("enu_user");
          if (storedUser) {
            onNavigate('orders');
          } else if (onOpenAuth) {
            onOpenAuth();
          } else {
            onNavigate('login');
          }
        }}
        className={`flex flex-col items-center py-1 px-2.5 rounded-xl transition-colors ${
          currentPage === 'login' || currentPage === 'signup' || currentPage === 'orders' ? 'text-[#D6A146] font-bold bg-white/10' : 'text-gray-300 hover:text-white'
        }`}
      >
        <User className="w-5 h-5" />
        <span className="text-[10px] mt-0.5">Account</span>
      </button>

    </nav>
  );
};
