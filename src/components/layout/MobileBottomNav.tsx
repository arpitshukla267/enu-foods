import React from 'react';
import { NavigationPage } from '../../types';
import {
  Home,
  Flame,
  Tag,
  ChefHat,
  PackagePlus,
  TrendingUp,
} from 'lucide-react';

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
}) => {
  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-[#1E3A2B] text-white border-t border-[#D6A146]/30 shadow-2xl px-1 py-1.5 flex items-center justify-around">

      {/* Home */}
      <button
        onClick={() => onNavigate('home')}
        className={`flex flex-col items-center py-1.5 px-2 rounded-lg transition-colors ${
          currentPage === 'home'
            ? 'text-[#D6A146] font-bold bg-white/10'
            : 'text-gray-300 hover:text-white'
        }`}
      >
        <Home className="w-5 h-5" />
        <span className="text-[9px] mt-0.5">Home</span>
      </button>

      {/* Spices */}
      <button
        onClick={() => onNavigate('products')}
        className={`flex flex-col items-center py-1.5 px-2 rounded-lg transition-colors ${
          currentPage === 'products' ||
          currentPage === 'product-detail'
            ? 'text-[#D6A146] font-bold bg-white/10'
            : 'text-gray-300 hover:text-white'
        }`}
      >
        <Flame className="w-5 h-5" />
        <span className="text-[9px] mt-0.5">Spices</span>
      </button>

      {/* Super Saver */}
      <button
        onClick={() => onNavigate('combos')}
        className={`flex flex-col items-center py-1.5 px-2 rounded-lg transition-colors ${
          currentPage === 'combos'
            ? 'text-[#D6A146] font-bold bg-white/10'
            : 'text-gray-300 hover:text-white'
        }`}
      >
        <Tag className="w-5 h-5" />
        <span className="text-[9px] mt-0.5 whitespace-nowrap">
          Super Saver
        </span>
      </button>

      {/* Recipes */}
      <button
        onClick={() => onNavigate('recipes')}
        className={`flex flex-col items-center py-1.5 px-2 rounded-lg transition-colors ${
          currentPage === 'recipes' ||
          currentPage === 'recipe-detail'
            ? 'text-[#D6A146] font-bold bg-white/10'
            : 'text-gray-300 hover:text-white'
        }`}
      >
        <ChefHat className="w-5 h-5" />
        <span className="text-[9px] mt-0.5">Recipes</span>
      </button>

      {/* New Arrival */}
      <button
        onClick={() => onNavigate('new-arrivals')}
        className={`flex flex-col items-center py-1.5 px-2 rounded-lg transition-colors ${
          currentPage === 'new-arrivals'
            ? 'text-[#D6A146] font-bold bg-white/10'
            : 'text-gray-300 hover:text-white'
        }`}
      >
        <PackagePlus className="w-5 h-5" />
        <span className="text-[9px] mt-0.5 whitespace-nowrap">
          New Arrival
        </span>
      </button>

      {/* Best Seller */}
      <button
        onClick={() => onNavigate('bestsellers')}
        className={`flex flex-col items-center py-1.5 px-2 rounded-lg transition-colors ${
          currentPage === 'best-sellers'
            ? 'text-[#D6A146] font-bold bg-white/10'
            : 'text-gray-300 hover:text-white'
        }`}
      >
        <TrendingUp className="w-5 h-5" />
        <span className="text-[9px] mt-0.5 whitespace-nowrap">
          Best Seller
        </span>
      </button>

    </nav>
  );
};