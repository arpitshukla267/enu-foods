import React from 'react';
import { CATEGORIES } from '../data/mockData';
import { ArrowUpRight } from 'lucide-react';
import { NavigationPage } from '../types';

interface ProductCategoriesProps {
  onSelectCategory: (categoryName: string) => void;
  onNavigate: (page: NavigationPage) => void;
}

export const ProductCategories: React.FC<ProductCategoriesProps> = ({ onSelectCategory, onNavigate }) => {
  const handleCategoryClick = (categoryName: string) => {
    onSelectCategory(categoryName);
    onNavigate('products');
  };

  return (
    <section
      id="categories-section"
      className="py-10 lg:py-28 bg-[#F7F5EF] relative"
    >
      <div className="max-w-[95vw] lg:max-w-7xl mx-auto px-0 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col lg:flex-row md:items-start lg:items-end justify-between mb-12 gap-6 px-4 md:px-0">
          <div className="text-left max-w-2xl">
            <span className="text-xs font-semibold uppercase tracking-widest text-[#C86D39] font-btn">
              Explore By Category
            </span>

            <h2 className="font-heading text-2xl md:text-3xl lg:text-5xl font-bold text-[#1D1D1D] mt-1">
              Handcrafted Spice Range For Every Kitchen
            </h2>

            <p className="font-body text-gray-600 mt-2 font-light text-xs lg:text-base">
              From daily cooking staples to exotic regional spice blends,
              discover our complete range of pure cold-ground masalas.
            </p>
          </div>

          <button
            id="view-all-categories-btn"
            onClick={() => onNavigate("products")}
            className="inline-flex items-center gap-2 bg-transparent text-[#284C38] hover:text-[#D6A146] font-semibold text-sm border-b-2 border-[#284C38] hover:border-[#D6A146] pb-1 font-btn transition-colors self-start lg:self-end"
          >
            <span>View Complete Range</span>
            <ArrowUpRight className="w-4 h-4" />
          </button>
        </div>

        {/* Categories Grid - 10 Cards */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-5 gap-x-1 gap-y-3 md:gap-x-3 md:gap-y-5 lg:gap-6">
          {CATEGORIES.map((category) => (
            <div
              key={category.id}
              onClick={() => handleCategoryClick(category.name)}
              className="group cursor-pointer rounded-md md:rounded-xl bg-white overflow-hidden border border-[#D6A146]/20 shadow-md hover:shadow-2xl transition-all duration-300 flex flex-col justify-between transform hover:-translate-y-2 relative"
            >
              {/* Image Container */}
              <div className="relative h-44 overflow-hidden bg-[#284C38]">
                <img
                  src={category.image}
                  alt={category.name}
                  className="w-full h-full object-cover object-center group-hover:scale-110 transition-transform duration-700 opacity-90 group-hover:opacity-100"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#1D1D1D]/70 via-transparent to-transparent" />

                {/* Arrow Action Badge */}
                <div className="absolute bottom-3 right-3 w-8 h-8 rounded-full bg-white/20 backdrop-blur-md group-hover:bg-[#D6A146] text-white group-hover:text-[#1D1D1D] flex items-center justify-center transition-all duration-300">
                  <ArrowUpRight className="w-4 h-4" />
                </div>
              </div>

              {/* Card Body */}
              <div className="p-3 lg:p-5 flex-1 flex flex-col justify-between text-left">
                <div>
                  <h3 className="font-heading text-md md:text-lg font-bold text-[#1D1D1D] group-hover:text-[#284C38] transition-colors">
                    {category.name}
                  </h3>
                  <p className="font-body text-[10px] md:text-xs text-gray-600 mt-1 md:mt-1.5 line-clamp-2 leading-relaxed font-light">
                    {category.description}
                  </p>
                </div>

                <div className="mt-2 md:mt-4 pt-2 md:pt-3 border-t border-gray-100 flex items-center justify-between text-xs text-[#284C38] font-medium font-btn">
                  <span>Explore Packets</span>
                  <span className="text-[#D6A146] group-hover:translate-x-1 transition-transform">
                    &rarr;
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
