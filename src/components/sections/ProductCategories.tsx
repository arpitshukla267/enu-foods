import React from "react";
import { CATEGORIES } from "../../data/mockData";
import { ArrowUpRight } from "lucide-react";
import { NavigationPage } from "../../types";
import { useCarouselScroll } from "../../hooks/useCarouselScroll";
import { CarouselArrows } from "../ui/CarouselArrows";

interface ProductCategoriesProps {
  onSelectCategory: (categoryName: string) => void;
  onNavigate: (page: NavigationPage) => void;
}

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=300&q=70";

/* Circular tiles styled like the compartments of a masala dabba — a warm
   cream base, a thin gold ring that deepens on hover, and a soft lift so
   the row feels tactile rather than like a flat grid of thumbnails. */
export const ProductCategories: React.FC<ProductCategoriesProps> = ({
  onSelectCategory,
  onNavigate,
}) => {
  const { trackRef, canScrollLeft, canScrollRight, scrollByPage } =
    useCarouselScroll<HTMLDivElement>();

  const handleCategoryClick = (categoryName: string) => {
    onSelectCategory(categoryName);
    onNavigate("products");
  };

  return (
    <section
      id="categories-section"
      className="bg-[#F2ECDD] "
      style={{ fontFamily: "'Poppins', sans-serif" }}
    >
      <div className="max-w-[95vw] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="flex flex-row sm:flex-row sm:items-end justify-between mb-4 lg:mb-6 gap-4">
          <div className="text-left">
          
            <h2 className="text-lg sm:text-3xl lg:text-[34px] font-semibold text-[#1F5136] md:mt-1.5 leading-snug">
              Shop by Category
            </h2>
          </div>

          <button
            onClick={() => onNavigate("products")}
            className="inline-flex items-center gap-0.5 md:gap-1.5 text-[#1F5136] hover:text-[#D6A146] font-medium text-xs md:text-sm transition-colors self-end sm:self-auto group"
          >
            <span className="border-b border-transparent group-hover:border-[#D6A146] transition-colors">
              View all categories
            </span>
            <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </button>
        </div>

        {/* Category tiles */}
        <div className="relative">
          <CarouselArrows
            canScrollLeft={canScrollLeft}
            canScrollRight={canScrollRight}
            onScrollLeft={() => scrollByPage("left")}
            onScrollRight={() => scrollByPage("right")}
          />

          <div
            ref={trackRef}
            className="flex gap-3 sm:gap-4 lg:gap-5 overflow-x-auto scroll-smooth snap-x snap-mandatory pb-3 px-1 no-scrollbar"
          >
            {CATEGORIES.map((category) => (
              <button
                key={category.id}
                type="button"
                onClick={() => handleCategoryClick(category.name)}
                data-card
                className="group shrink-0 snap-start w-[84px] sm:w-[100px] lg:w-[112px] flex flex-col items-center gap-3 focus-visible:outline-none"
              >
                <span
                  className="relative w-[87px] h-[87px] sm:w-[100px] sm:h-[100px] lg:w-[120px] lg:h-[120px] rounded-full overflow-hidden bg-white
                             p-[1px]
                             shadow-[0_4px_14px_rgba(31,81,54,0.08)] group-hover:shadow-[0_8px_20px_rgba(214,161,70,0.25)]
                             transition-all duration-300 group-hover:-translate-y-1"
                >
                  <span className="block w-full h-full rounded-full overflow-hidden bg-[#EAF3E5]">
                    <img
                      src={category.image || FALLBACK_IMAGE}
                      alt={category.name}
                      loading="lazy"
                      onError={(e) => {
                        (e.currentTarget as HTMLImageElement).src =
                          FALLBACK_IMAGE;
                      }}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      referrerPolicy="no-referrer"
                    />
                  </span>
                </span>

                <span className="text-[11px] sm:text-xs font-medium text-[#22331F] group-hover:text-[#1F5136] text-center leading-snug line-clamp-2 transition-colors">
                  {category.name}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </section>
  );
};
