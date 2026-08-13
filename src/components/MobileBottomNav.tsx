import React from 'react';
import { NavigationPage } from '../types';
import { Home, Flame, BookOpen, ShoppingBag, PhoneCall } from 'lucide-react';

interface MobileBottomNavProps {
  currentPage: NavigationPage;
  onNavigate: (page: NavigationPage) => void;
  cartCount: number;
  onOpenCart: () => void;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  currentPage,
  onNavigate,
  cartCount,
  onOpenCart
}) => {
  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-[#1E3A2B] text-white border-t border-[#D6A146]/30 shadow-2xl px-2 py-1.5 flex items-center justify-around font-btn">
      
      {/* Home */}
      <button 
        onClick={() => onNavigate('home')}
        className={`flex flex-col items-center py-1 px-3 rounded-xl transition-colors ${
          currentPage === 'home' ? 'text-[#D6A146] font-bold bg-white/10' : 'text-gray-300 hover:text-white'
        }`}
      >
        <Home className="w-5 h-5" />
        <span className="text-[10px] mt-0.5">Home</span>
      </button>

      {/* Spices */}
      <button 
        onClick={() => onNavigate('products')}
        className={`flex flex-col items-center py-1 px-3 rounded-xl transition-colors ${
          currentPage === 'products' ? 'text-[#D6A146] font-bold bg-white/10' : 'text-gray-300 hover:text-white'
        }`}
      >
        <Flame className="w-5 h-5" />
        <span className="text-[10px] mt-0.5">Spices</span>
      </button>

      {/* Cart (with badge) */}
      <button 
        onClick={onOpenCart}
        className="flex flex-col items-center py-1 px-3 rounded-xl relative text-[#D6A146] font-bold"
      >
        <div className="relative">
          <ShoppingBag className="w-5 h-5" />
          {cartCount > 0 && (
            <span className="absolute -top-1.5 -right-2 bg-red-500 text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center animate-pulse">
              {cartCount}
            </span>
          )}
        </div>
        <span className="text-[10px] mt-0.5">Cart</span>
      </button>

      {/* Story */}
      <button 
        onClick={() => onNavigate('story')}
        className={`flex flex-col items-center py-1 px-3 rounded-xl transition-colors ${
          currentPage === 'story' ? 'text-[#D6A146] font-bold bg-white/10' : 'text-gray-300 hover:text-white'
        }`}
      >
        <BookOpen className="w-5 h-5" />
        <span className="text-[10px] mt-0.5">Story</span>
      </button>

      {/* Contact */}
      <button 
        onClick={() => onNavigate('contact')}
        className={`flex flex-col items-center py-1 px-3 rounded-xl transition-colors ${
          currentPage === 'contact' ? 'text-[#D6A146] font-bold bg-white/10' : 'text-gray-300 hover:text-white'
        }`}
      >
        <PhoneCall className="w-5 h-5" />
        <span className="text-[10px] mt-0.5">Contact</span>
      </button>

    </nav>
  );
};
