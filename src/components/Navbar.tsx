import React, { useState, useEffect } from 'react';
import { Menu, X, Search, ChevronDown, Leaf, PhoneCall, Sparkles, ShoppingBag } from 'lucide-react';
import { NavigationPage } from '../types';
import { CATEGORIES } from '../data/mockData';

interface NavbarProps {
  currentPage: NavigationPage;
  onNavigate: (page: NavigationPage, categoryId?: string, productId?: string) => void;
  onOpenSearch: () => void;
  cartCount: number;
  onOpenCart: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentPage, onNavigate, onOpenSearch, cartCount, onOpenCart }) => {

  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMegaMenuOpen, setIsMegaMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 30) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (page: NavigationPage, categoryId?: string, productId?: string) => {
    onNavigate(page, categoryId, productId);
    setIsMobileMenuOpen(false);
    setIsMegaMenuOpen(false);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 transition-all duration-300">
      {/* Top Banner for Premium Identity */}
      <div className="bg-[#1E3A2B] text-[9px] md:text-xs py-2 md:py-1.5 px-2 md:px-4 text-[#F7F5EF]/90 border-b border-[#D6A146]/20 font-body">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-2">
          {/* Left Content */}
          <div className="flex items-center min-w-0 flex-1">
            <span className="flex items-center gap-1 md:gap-1.5 text-[#D6A146] md:font-medium whitespace-nowrap">
              <Sparkles className="hidden md:block w-3.5 h-3.5 shrink-0" />

              <span className="md:hidden">100% Organic & Cold Ground</span>

              <span className="hidden md:inline">
                100% Organic & Cold Ground Spices
              </span>
            </span>

            <span className="text-white/30 mx-2 shrink-0">|</span>

            <span className="text-white/70 whitespace-nowrap truncate">
              <span className="md:hidden">No Preservatives</span>

              <span className="hidden md:inline">
                No Preservatives • No Artificial Colours
              </span>
            </span>
          </div>

          {/* Right Content */}
          <div className="flex items-center shrink-0">
            <span className="hidden md:inline text-[#D6A146] font-serif italic mr-4">
              Pure By Nature. Trusted By You.
            </span>

            <span className="hidden md:inline text-white/30 mr-4">|</span>

            <button
              onClick={() => handleNavClick("contact")}
              className="
          hover:text-[#D6A146]
          transition-colors
          flex items-center gap-1
          whitespace-nowrap
          font-medium
        "
            >
              <PhoneCall className="w-3 h-3 text-[#D6A146] shrink-0" />
              <span>Contact</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Glass Header */}
      <nav
        id="main-nav"
        className={`transition-all duration-300 ${
          isScrolled
            ? "bg-[#284C38]/95 backdrop-blur-md shadow-lg py-3 border-b border-[#D6A146]/30"
            : currentPage === "home"
              ? "bg-[#284C38]/85 backdrop-blur-sm py-4 border-b border-white/10"
              : "bg-[#284C38] py-4 border-b border-[#D6A146]/30"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          {/* Logo */}
          <button
            id="nav-logo"
            onClick={() => handleNavClick("home")}
            className="flex items-center gap-3 group text-left focus:outline-none"
          >
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-gradient-to-br from-[#D6A146] to-[#C86D39] p-0.5 shadow-md group-hover:scale-105 transition-transform">
              <div className="w-full h-full bg-[#284C38] rounded-full flex items-center justify-center">
                <Leaf className="w-5 h-5 text-[#D6A146]" />
              </div>
            </div>
            <div>
              <div className="font-heading text-2xl sm:text-3xl font-bold tracking-wide text-white flex items-center gap-1">
                ENU <span className="text-[#D6A146] font-light">FOODS</span>
              </div>
              <div className="text-[10px] tracking-widest uppercase text-[#D6A146] font-body font-medium -mt-1">
                Pure Masala Spices
              </div>
            </div>
          </button>

          {/* Desktop Navigation Links */}
          <div className="hidden lg:flex items-center gap-8">
            <button
              id="nav-link-home"
              onClick={() => handleNavClick("home")}
              className={`text-sm font-medium transition-colors relative py-1 font-body ${
                currentPage === "home"
                  ? "text-[#D6A146]"
                  : "text-white/90 hover:text-[#D6A146]"
              }`}
            >
              Home
              {currentPage === "home" && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#D6A146] rounded-full" />
              )}
            </button>

            {/* Products Dropdown / Mega Menu */}
            <div
              className="relative"
              onMouseEnter={() => setIsMegaMenuOpen(true)}
              onMouseLeave={() => setIsMegaMenuOpen(false)}
            >
              <button
                id="nav-link-products"
                onClick={() => handleNavClick("products")}
                className={`text-sm font-medium transition-colors flex items-center gap-1 py-1 font-body ${
                  currentPage === "products"
                    ? "text-[#D6A146]"
                    : "text-white/90 hover:text-[#D6A146]"
                }`}
              >
                Products
                <ChevronDown
                  className={`w-4 h-4 transition-transform duration-200 ${isMegaMenuOpen ? "rotate-180 text-[#D6A146]" : ""}`}
                />
                {currentPage === "products" && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#D6A146] rounded-full" />
                )}
              </button>

              {/* Mega Menu Overlay */}
              {isMegaMenuOpen && (
                <div className="absolute top-full left-1/2 -translate-x-1/2 w-[720px] bg-[#1E3A2B] border border-[#D6A146]/30 rounded-xl shadow-2xl p-6 mt-1 backdrop-blur-xl grid grid-cols-3 gap-6 z-50 text-white">
                  <div className="col-span-2 border-r border-white/10 pr-6">
                    <div className="flex items-center justify-between mb-3">
                      <span className="font-heading text-lg font-semibold text-[#D6A146]">
                        Spice Categories
                      </span>
                      <button
                        onClick={() => handleNavClick("products")}
                        className="text-xs text-[#D6A146] hover:underline"
                      >
                        View All Products &rarr;
                      </button>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      {CATEGORIES.slice(0, 8).map((cat) => (
                        <button
                          key={cat.id}
                          onClick={() => handleNavClick("products", cat.name)}
                          className="text-left px-3 py-2 rounded-lg hover:bg-[#284C38] text-white/80 hover:text-[#D6A146] transition-colors flex items-center justify-between group"
                        >
                          <span className="font-body text-xs font-medium">
                            {cat.name}
                          </span>
                          <span className="text-[10px] text-white/40 group-hover:text-[#D6A146]">
                            &rarr;
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="col-span-1 bg-[#284C38]/60 p-4 rounded-lg border border-[#D6A146]/20 flex flex-col justify-between">
                    <div>
                      <div className="text-xs font-bold text-[#D6A146] uppercase tracking-wider mb-1 font-btn">
                        Featured Blend
                      </div>
                      <div className="font-heading text-lg font-bold text-white mb-1">
                        ENU Sambhar Masala
                      </div>
                      <p className="text-xs text-white/70 line-clamp-3">
                        Traditional South Indian blend ground cold for volatile
                        aroma retention.
                      </p>
                    </div>
                    <button
                      onClick={() =>
                        handleNavClick(
                          "products",
                          undefined,
                          "enu-sambhar-masala",
                        )
                      }
                      className="mt-3 w-full bg-[#D6A146] text-[#1D1D1D] hover:bg-[#E8BF73] text-xs py-2 px-3 rounded-md font-semibold font-btn transition-colors text-center"
                    >
                      Explore Pack Details
                    </button>
                  </div>
                </div>
              )}
            </div>

            <button
              id="nav-link-story"
              onClick={() => handleNavClick("story")}
              className={`text-sm font-medium transition-colors relative py-1 font-body ${
                currentPage === "story"
                  ? "text-[#D6A146]"
                  : "text-white/90 hover:text-[#D6A146]"
              }`}
            >
              Our Story
              {currentPage === "story" && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#D6A146] rounded-full" />
              )}
            </button>

            <button
              id="nav-link-recipes"
              onClick={() => handleNavClick("recipes")}
              className={`text-sm font-medium transition-colors relative py-1 font-body ${
                currentPage === "recipes"
                  ? "text-[#D6A146]"
                  : "text-white/90 hover:text-[#D6A146]"
              }`}
            >
              Recipes
              {currentPage === "recipes" && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#D6A146] rounded-full" />
              )}
            </button>

            <button
              id="nav-link-contact"
              onClick={() => handleNavClick("contact")}
              className={`text-sm font-medium transition-colors relative py-1 font-body ${
                currentPage === "contact"
                  ? "text-[#D6A146]"
                  : "text-white/90 hover:text-[#D6A146]"
              }`}
            >
              Contact
              {currentPage === "contact" && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#D6A146] rounded-full" />
              )}
            </button>
          </div>

          {/* Right Action Icons & CTA Button */}
          <div className="flex items-center gap-3">
            {/* Quick Search */}
            <button
              id="nav-search-button"
              onClick={onOpenSearch}
              className="p-2 rounded-full text-white/80 hover:text-[#D6A146] hover:bg-white/10 transition-colors"
              title="Search Spices & Recipes"
            >
              <Search className="w-5 h-5" />
            </button>

            {/* Cart Button with Count Badge */}
            <button
              id="nav-cart-button"
              onClick={onOpenCart}
              className="p-2 rounded-full text-white/90 hover:text-[#D6A146] hover:bg-white/10 transition-colors relative"
              title="View Cart"
            >
              <ShoppingBag className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#D6A146] text-[#1D1D1D] text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center font-btn shadow-md border border-[#284C38]">
                  {cartCount}
                </span>
              )}
            </button>

            {/* Explore Products CTA */}
            <button
              id="nav-cta-button"
              onClick={() => handleNavClick("products")}
              className="hidden sm:inline-flex items-center gap-2 bg-[#D6A146] hover:bg-[#E8BF73] text-[#1D1D1D] font-medium text-sm px-5 py-2.5 rounded-full font-btn shadow-md hover:shadow-lg transition-all duration-200 transform hover:-translate-y-0.5 active:translate-y-0"
            >
              <span>Explore Range</span>
            </button>

            {/* Mobile Menu Toggle */}
            <button
              id="mobile-menu-button"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg text-white hover:text-[#D6A146] hover:bg-white/10 transition-colors relative w-10 h-10 flex items-center justify-center"
              aria-label="Toggle Navigation Menu"
            >
              <Menu
                className={`w-6 h-6 absolute transition-all duration-300 ${
                  isMobileMenuOpen
                    ? "opacity-0 rotate-90 scale-50"
                    : "opacity-100 rotate-0 scale-100"
                }`}
              />
              <X
                className={`w-6 h-6 absolute transition-all duration-300 ${
                  isMobileMenuOpen
                    ? "opacity-100 rotate-0 scale-100"
                    : "opacity-0 -rotate-90 scale-50"
                }`}
              />
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        <div
          className={`lg:hidden overflow-hidden transition-all duration-300 ease-in-out ${
            isMobileMenuOpen ? "max-h-[600px] opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <div className="bg-[#1E3A2B] border-t border-[#D6A146]/20 px-4 pt-4 pb-6 mt-3 space-y-3">
            <button
              onClick={() => handleNavClick("home")}
              className={`w-full text-left py-2.5 px-3 rounded-lg text-base font-medium font-body flex items-center justify-between transition-all duration-300 ${
                isMobileMenuOpen
                  ? "translate-y-0 opacity-100"
                  : "-translate-y-2 opacity-0"
              } ${currentPage === "home" ? "bg-[#284C38] text-[#D6A146]" : "text-white/90 hover:bg-[#284C38]/50"}`}
            >
              <span>Home</span>
            </button>

            <button
              onClick={() => handleNavClick("products")}
              className={`w-full text-left py-2.5 px-3 rounded-lg text-base font-medium font-body flex items-center justify-between transition-all duration-300 delay-[50ms] ${
                isMobileMenuOpen
                  ? "translate-y-0 opacity-100"
                  : "-translate-y-2 opacity-0"
              } ${currentPage === "products" ? "bg-[#284C38] text-[#D6A146]" : "text-white/90 hover:bg-[#284C38]/50"}`}
            >
              <span>Our Spices & Masalas</span>
              <span className="text-xs bg-[#D6A146]/20 text-[#D6A146] px-2 py-0.5 rounded-full">
                All Products
              </span>
            </button>

            <button
              onClick={() => handleNavClick("story")}
              className={`w-full text-left py-2.5 px-3 rounded-lg text-base font-medium font-body flex items-center justify-between transition-all duration-300 delay-[100ms] ${
                isMobileMenuOpen
                  ? "translate-y-0 opacity-100"
                  : "-translate-y-2 opacity-0"
              } ${currentPage === "story" ? "bg-[#284C38] text-[#D6A146]" : "text-white/90 hover:bg-[#284C38]/50"}`}
            >
              <span>Our Story & Manufacturing</span>
            </button>

            <button
              onClick={() => handleNavClick("recipes")}
              className={`w-full text-left py-2.5 px-3 rounded-lg text-base font-medium font-body flex items-center justify-between transition-all duration-300 delay-[150ms] ${
                isMobileMenuOpen
                  ? "translate-y-0 opacity-100"
                  : "-translate-y-2 opacity-0"
              } ${currentPage === "recipes" ? "bg-[#284C38] text-[#D6A146]" : "text-white/90 hover:bg-[#284C38]/50"}`}
            >
              <span>Authentic Recipes</span>
            </button>

            <button
              onClick={() => handleNavClick("contact")}
              className={`w-full text-left py-2.5 px-3 rounded-lg text-base font-medium font-body flex items-center justify-between transition-all duration-300 delay-[200ms] ${
                isMobileMenuOpen
                  ? "translate-y-0 opacity-100"
                  : "-translate-y-2 opacity-0"
              } ${currentPage === "contact" ? "bg-[#284C38] text-[#D6A146]" : "text-white/90 hover:bg-[#284C38]/50"}`}
            >
              <span>Contact Us</span>
            </button>

            <div
              className={`pt-3 border-t border-white/10 transition-all duration-300 delay-[250ms] ${
                isMobileMenuOpen
                  ? "translate-y-0 opacity-100"
                  : "-translate-y-2 opacity-0"
              }`}
            >
              <button
                onClick={() => handleNavClick("products")}
                className="w-full bg-[#D6A146] text-[#1D1D1D] font-semibold text-center py-3 rounded-lg font-btn shadow-md"
              >
                Explore Full Range
              </button>
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
};
