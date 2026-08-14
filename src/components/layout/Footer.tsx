import React from 'react';
import { Leaf, Phone, Mail, MapPin, Instagram, Facebook, Youtube, Twitter } from 'lucide-react';
import { CATEGORIES, RECIPES } from '../../data/mockData';
import { NavigationPage } from '../../types';

interface FooterProps {
  onNavigate: (page: NavigationPage, categoryId?: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer className="bg-[#1D1D1D] text-white font-body pt-6 lg:pt-16 pb-8 border-t border-[#D6A146]/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 lg:gap-10 pb-6 lg:pb-12 border-b border-white/10 text-left">
          
          {/* Col 1: Company Profile */}
          <div className="lg:col-span-2 space-y-4">
            <button 
              onClick={() => onNavigate('home')} 
              className="flex items-center gap-3 text-left focus:outline-none"
            >
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#D6A146] to-[#C86D39] p-0.5">
                <div className="w-full h-full bg-[#284C38] rounded-full flex items-center justify-center">
                  <Leaf className="w-5 h-5 text-[#D6A146]" />
                </div>
              </div>
              <div>
                <div className="font-heading text-2xl font-bold tracking-wide text-white">
                  ENU <span className="text-[#D6A146] font-light">FOODS</span>
                </div>
                <div className="text-[10px] tracking-widest uppercase text-[#D6A146] font-body">
                  Pure Masala Spices
                </div>
              </div>
            </button>

            <p className="text-sm text-gray-400 font-light leading-relaxed max-w-sm">
              ENU Foods is a premier Indian spice manufacturer crafting 100% natural, cold-ground masalas. Ground below 35°C without added colors, starch fillers, or synthetic chemicals.
            </p>

            <div className="pt-2">
              <div className="font-serif italic text-base text-[#D6A146]">
                "Pure By Nature. Trusted By You."
              </div>
            </div>

            {/* Social Links */}
            <div className="flex items-center gap-3 pt-2">
              <a href="#instagram" className="w-9 h-9 rounded-full bg-white/5 hover:bg-[#D6A146] text-white/80 hover:text-[#1D1D1D] flex items-center justify-center transition-colors">
                <Instagram className="w-4 h-4" />
              </a>
              <a href="#facebook" className="w-9 h-9 rounded-full bg-white/5 hover:bg-[#D6A146] text-white/80 hover:text-[#1D1D1D] flex items-center justify-center transition-colors">
                <Facebook className="w-4 h-4" />
              </a>
              <a href="#youtube" className="w-9 h-9 rounded-full bg-white/5 hover:bg-[#D6A146] text-white/80 hover:text-[#1D1D1D] flex items-center justify-center transition-colors">
                <Youtube className="w-4 h-4" />
              </a>
              <a href="#twitter" className="w-9 h-9 rounded-full bg-white/5 hover:bg-[#D6A146] text-white/80 hover:text-[#1D1D1D] flex items-center justify-center transition-colors">
                <Twitter className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Col 2: Quick Links */}
          <div className="space-y-3 hidden lg:block">
            <h3 className="font-heading text-lg font-bold text-[#D6A146]">Quick Links</h3>
            <ul className="space-y-2 text-sm text-gray-400 font-light">
              <li>
                <button onClick={() => onNavigate('home')} className="hover:text-white transition-colors">
                  Home
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('products')} className="hover:text-white transition-colors">
                  Our Products
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('bestsellers')} className="hover:text-white transition-colors">
                  Bestsellers
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('new-arrivals')} className="hover:text-white transition-colors">
                  New Arrivals
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('combos')} className="hover:text-white transition-colors">
                  Super Saver Combos
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('recipes')} className="hover:text-white transition-colors">
                  Authentic Recipes
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('contact')} className="hover:text-white transition-colors">
                  Contact Us
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Products */}
          {/* <div className="space-y-3">
            <h3 className="font-heading text-lg font-bold text-[#D6A146]">Our Categories</h3>
            <ul className="space-y-2 text-sm text-gray-400 font-light">
              {CATEGORIES.slice(0, 5).map((cat) => (
                <li key={cat.id}>
                  <button 
                    onClick={() => onNavigate('products', cat.name)} 
                    className="hover:text-white transition-colors text-left"
                  >
                    {cat.name}
                  </button>
                </li>
              ))}
            </ul>
          </div> */}

          {/* Col 4: Contact Us */}
          <div className="space-y-3">
            <h3 className="font-heading text-lg font-bold text-[#D6A146]">Contact Us</h3>
            <ul className="space-y-3 text-sm text-gray-400 font-light">
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-[#D6A146] shrink-0 mt-1" />
                <span>ENU Foods Spice Park, Plot 42, Organic Agro Hub, Gujarat 380001, India</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-[#D6A146] shrink-0" />
                <span>+91 1800-200-3688 (Toll Free)</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-[#D6A146] shrink-0" />
                <span>care@enufoods.com</span>
              </li>
            </ul>
          </div>

        </div>

        {/* Copyright Footer Bar */}
        <div className="pt-4 lg:pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-gray-500 font-light gap-4">
          <div>
            © {new Date().getFullYear()} <strong className="text-white font-medium">ENU Foods</strong>. All rights reserved.
          </div>
          <div className="flex items-center gap-6">
            <button onClick={() => onNavigate('privacy')} className="hover:text-white transition-colors text-nowrap">Privacy Policy</button>
            <button onClick={() => onNavigate('terms')} className="hover:text-white transition-colors text-nowrap">Terms of Service</button>
          </div>
        </div>

      </div>
    </footer>
  );
};
