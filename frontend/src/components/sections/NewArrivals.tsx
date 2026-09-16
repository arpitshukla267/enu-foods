import React from "react";
import { Product, NavigationPage } from "../../types";
import { Sparkles } from "lucide-react";
import { useCarouselScroll } from "../../hooks/useCarouselScroll";
import { CarouselArrows } from "../ui/CarouselArrows";
import { WeightDropdown } from "../ui/WeightDropdown";
import { useProductBatch } from "../../hooks/useProductBatch";
import { getVariantPricing, getProductWeightVariants, isVariantInStock, getPreferredWeight } from "../../lib/productPricing";
import { OutOfStockBadge } from "../ui/OutOfStockBadge";

interface NewArrivalsProps {
  onSelectProduct?: (product: Product) => void;
  onNavigate: (page: NavigationPage) => void;
  onAddToCart?: (product: Product, weight?: string, qty?: number) => void;
}

/* base: 2, sm: 3, md: 4, lg: 5, xl: 6 whole cards per row (gap-5 = 20px) */
const CARD_WIDTH_CLASSES =
  "w-[calc((100%-20px)/2.2)] sm:w-[calc((100%-40px)/3)] md:w-[calc((100%-60px)/4)] lg:w-[calc((100%-80px)/5)] xl:w-[calc((100%-100px)/6)]";

export const NewArrivals: React.FC<NewArrivalsProps> = ({
  onNavigate,
  onSelectProduct,
  onAddToCart,
}) => {
  const [selectedWeight, setSelectedWeight] = React.useState<{
    [key: string]: string;
  }>({});
  const { trackRef, canScrollLeft, canScrollRight, scrollByPage } =
    useCarouselScroll<HTMLDivElement>();

  const { products: newArrivals, isLoading } = useProductBatch({
    isNewArrival: true,
    limit: 8,
    sort: "newest",
  });

  return (
    <section className="py-8 lg:py-20 bg-[#F2ECDD] text-left">
      <div className="max-w-[95vw] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-6 lg:mb-12">
          <h2
            className="text-3xl sm:text-4xl lg:text-[2.75rem] text-[#1F5136] mt-2 font-semibold">
            New Arrivals
          </h2>
        </div>

        {/* Carousel */}
        <div className="relative">
          <CarouselArrows
            canScrollLeft={canScrollLeft}
            canScrollRight={canScrollRight}
            onScrollLeft={() => scrollByPage("left")}
            onScrollRight={() => scrollByPage("right")}
          />

          <div
            ref={trackRef}
            className="flex gap-3 md:gap-5 overflow-x-auto scroll-smooth snap-x snap-mandatory pb-2 no-scrollbar"
          >
            {isLoading
              ? Array.from({ length: 8 }).map((_, index) => (
                  <div
                    key={`new-skeleton-${index}`}
                    className={`shrink-0 snap-start ${CARD_WIDTH_CLASSES} h-72 bg-white/60 rounded-xl animate-pulse`}
                  />
                ))
              : newArrivals.map((product) => {
              const weight =
                selectedWeight[product.id] || getPreferredWeight(product);
              const { price: displayPrice, originalPrice: displayOriginalPrice } =
                getVariantPricing(product, weight);
              const selectedInStock = isVariantInStock(product, weight);

              return (
                <a
                  key={product.id}
                  href={`/products/${product.slug || product.id}`}
                  onClick={(e) => {
                    e.preventDefault();
                    onSelectProduct?.(product);
                  }}
                  data-card
                  className={`group shrink-0 snap-start ${CARD_WIDTH_CLASSES} flex flex-col text-left`}
                >
                  {/* Image panel - image fills the frame */}
                  <div className="relative bg-white rounded-xl h-44 sm:h-48 lg:h-52 overflow-hidden border border-[#E4DCC5]">
                    <span className="absolute top-3 left-3 z-10 bg-[#1F5136] text-white text-[11px] font-semibold px-3 py-1 rounded-full">
                      NEW
                    </span>
                    <img
                      src={product.image}
                      alt={product.name}
                      className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      referrerPolicy="no-referrer"
                    />
                  </div>

                  {/* Info */}
                  <div className="mt-4 flex flex-col gap-2">
                    <h3 className="text-[#22331F] font-semibold text-[15px] leading-snug line-clamp-1">
                      {product.name}
                    </h3>

                    {/* <div className="flex items-center gap-2">
                      <span className="text-[#1F5136] font-bold text-base">
                        ₹{displayPrice}
                      </span>
                      {displayOriginalPrice > displayPrice && (
                        <span className="text-gray-400 line-through text-sm">
                          ₹{displayOriginalPrice}
                        </span>
                      )}
                    </div> */}

                    <WeightDropdown
                      options={product.weightOptions}
                      variants={getProductWeightVariants(product)}
                      value={weight}
                      onChange={(v) =>
                        setSelectedWeight((prev) => ({
                          ...prev,
                          [product.id]: v,
                        }))
                      }
                    />

                    {/* {!selectedInStock && <OutOfStockBadge compact />} */}

                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        if (!selectedInStock) return;
                        onAddToCart?.(product, weight);
                      }}
                      disabled={!selectedInStock}
                      className={`mt-1 w-full text-sm font-semibold py-2.5 rounded-full transition-colors ${
                        selectedInStock
                          ? "bg-[#1F5136] hover:bg-[#183F2A] text-white"
                          : "bg-gray-200 text-gray-500 cursor-not-allowed"
                      }`}
                    >
                      {selectedInStock ? "Add to Cart" : "Out of Stock"}
                    </button>
                  </div>
                </a>
              );
            })}
          </div>
        </div>

        {/* View All */}
        <div className="mt-10 text-center">
          <button
            onClick={() => onNavigate("new-arrivals")}
            className="text-[#1F5136] font-semibold text-sm border-b border-[#1F5136]/40 hover:border-[#1F5136] pb-0.5 transition-colors"
            style={{ fontFamily: "'Poppins', sans-serif" }}
          >
            View All New Arrivals
          </button>
        </div>
      </div>

      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </section>
  );
};
