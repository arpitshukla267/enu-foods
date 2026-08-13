import React, { useState } from 'react';
import Link from 'next/link';
import { PRODUCTS } from '../data/mockData';
import { Product, NavigationPage } from '../types';
import { ArrowRight, ShieldCheck, Flame, ShoppingBag, Check } from 'lucide-react';

interface FeaturedProductsProps {
  onSelectProduct?: (product: Product) => void;
  onNavigate: (page: NavigationPage) => void;
  onAddToCart?: (product: Product, weight?: string, qty?: number) => void;
}

export const FeaturedProducts: React.FC<FeaturedProductsProps> = ({ onNavigate, onAddToCart }) => {
  const [addedMap, setAddedMap] = useState<{ [key: string]: boolean }>({});

  const handleQuickAdd = (product: Product, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (onAddToCart) {
      onAddToCart(product);
      setAddedMap(prev => ({ ...prev, [product.id]: true }));
      setTimeout(() => {
        setAddedMap(prev => ({ ...prev, [product.id]: false }));
      }, 1500);
    }
  };

  const featuredList = PRODUCTS.filter(p => p.isFeatured || [
    'enu-sambhar-masala',
    'enu-ginger-garlic-paste',
    'enu-garam-masala',
    'enu-kitchen-king',
    'enu-turmeric-powder',
    'enu-coriander-powder'
  ].includes(p.id)).slice(0, 6);

  return (
    <section
      id="featured-products-section"
      className="py-20 lg:py-28 bg-[#1E3A2B] text-white relative overflow-hidden text-left"
    >
      {/* Decorative Gold Radial Light */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#D6A146]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-10 w-96 h-96 bg-[#284C38] rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-[95vw] lg:max-w-7xl mx-auto px-0 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 px-4 sm:px-0">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#D6A146]/20 border border-[#D6A146]/30 text-[#D6A146] text-xs font-semibold uppercase tracking-wider font-btn mb-3">
            <ShieldCheck className="w-4 h-4" />
            <span>Customer Favorites</span>
          </div>
          <h2 className="font-heading text-2xl sm:text-4xl lg:text-5xl font-bold text-white">
            Our Signature Spice Packaging & Blends
          </h2>
          <p className="font-body text-white/80 mt-3 text-xs md:text-base font-light">
            Sourced at peak harvest and sealed in 4-layer aroma barrier pouches.
          </p>
        </div>

        {/* Featured Grid - 6 Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-x-1 gap-y-3 md:gap-x-3 md:gap-y-5 lg:gap-x-5 lg:gap-y-8">
          {featuredList.map((product) => (
            <Link
              key={product.id}
              href={`/products/${product.id}`}
              className="group bg-[#284C38]/90 rounded-xl lg:rounded-2xl overflow-hidden border border-[#D6A146]/30 shadow-xl hover:shadow-2xl hover:border-[#D6A146] transition-all duration-300 flex flex-col justify-between transform hover:-translate-y-2 text-left block"
            >
              {/* Product Image Frame */}
              <div className="relative h-60 overflow-hidden bg-[#1D3527] p- flex items-center justify-center">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover rounded-t-xl group-hover:scale-105 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />

                {/* Available Weights Badge */}
                <div className="absolute top-4 right-2 md:left-4 bg-[#1D1D1D]/80 backdrop-blur-md text-[#D6A146] text-[10px] md:text-xs px-3 py-1 rounded-full font-btn font-semibold border border-[#D6A146]/40">
                  {product.defaultWeight} / {product.weightOptions.join(", ")}
                </div>

                {/* Spiciness Indicator */}
                <div className="absolute bottom-4 right-4 bg-[#1D1D1D]/80 backdrop-blur-md text-white text-[11px] px-2.5 py-1 rounded-full flex items-center gap-1 font-body">
                  <Flame className="w-3.5 h-3.5 text-[#C86D39]" />
                  <span>Heat: {product.spicinessLevel}/5</span>
                </div>
              </div>

              {/* Product Content */}
              <div className="p-2 py-3 md:p-4 flex-1 flex flex-col min-h-0">
                {/* Product Info */}
                <div className="min-w-0">
                  {/* Category + Price */}
                  <div className="flex items-center justify-between gap-3 min-h-[20px]">
                    <span className="text-xs text-[#D6A146] uppercase tracking-wider font-semibold font-btn truncate">
                      {product.category}
                    </span>

                    <div className="flex items-center gap-1 shrink-0 whitespace-nowrap">
                      <span className="font-bold text-[#D6A146] text-sm">
                        ₹{product.price}
                      </span>

                      <span className="text-gray-400 line-through text-xs font-normal">
                        ₹{product.originalPrice}
                      </span>
                    </div>
                  </div>

                  {/* Product Name - 1 Line */}
                  <h3
                    title={product.name}
                    className="font-heading text-lg md:text-xl font-semibold md:font-bold text-white group-hover:text-[#D6A146] transition-colors mt-1 md:mt-2 truncate"
                  >
                    {product.name}
                  </h3>

                  {/* Description - 2 Lines */}
                  <p
                    title={product.shortDescription}
                    className="font-body text-xs md:text-sm text-white/80 mt-1 md:mt-2 font-light leading-relaxed line-clamp-2 min-h-[40px]"
                  >
                    {product.shortDescription}
                  </p>
                </div>

                {/* Ingredients */}
                <div className="mt-2 md:mt-4 pt-2 md:pt-4 border-t border-white/10 min-h-[48px]">
                  <div className="flex flex-wrap gap-1.5 max-h-[48px] overflow-hidden">
                    {product.ingredients.slice(0, 3).map((ing, i) => (
                      <span
                        key={i}
                        className="text-[10px] bg-white/10 text-white/90 px-2.5 py-1 rounded-md font-body whitespace-nowrap"
                      >
                        {ing}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="mt-5 flex items-center gap-2">
                  <button
                    onClick={(e) => handleQuickAdd(product, e)}
                    className="w-full h-10 bg-[#D6A146] hover:bg-[#E8BF73] text-[#1D1D1D] font-bold text-xs px-3 rounded-xl font-btn shadow-md transition-all flex items-center justify-center gap-1.5 whitespace-nowrap cursor-pointer"
                  >
                    {addedMap[product.id] ? (
                      <>
                        <Check className="w-3.5 h-3.5 shrink-0" />
                        <span>Added To Cart!</span>
                      </>
                    ) : (
                      <>
                        <ShoppingBag className="w-3.5 h-3.5 shrink-0" />
                        <span>ADD TO CART</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* View All CTA Banner */}
        <div className="mt-14 text-center">
          <button
            id="featured-explore-all-btn"
            onClick={() => onNavigate("products")}
            className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 text-[#D6A146] border border-[#D6A146]/40 hover:border-[#D6A146] font-semibold text-base px-8 py-4 rounded-full font-btn transition-all duration-300 cursor-pointer"
          >
            <span>Explore All 10+ ENU Masalas</span>
            <ArrowRight className="w-5 h-5 text-[#D6A146]" />
          </button>
        </div>
      </div>
    </section>
  );
};

