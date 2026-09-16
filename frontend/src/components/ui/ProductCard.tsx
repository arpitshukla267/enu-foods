import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Check, Percent, Plus, Sparkles } from "lucide-react";
import { Product } from "../../types";
import { WeightDropdown } from "./WeightDropdown";
import { getVariantDiscountPercent, getVariantPricing, getProductWeightVariants, isVariantInStock, getPreferredWeight } from "../../lib/productPricing";
import { OutOfStockBadge } from "./OutOfStockBadge";

interface ProductCardProps {
  product: Product;
  added?: boolean;
  onQuickAdd?: (product: Product, event: React.MouseEvent, weight?: string) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  added = false,
  onQuickAdd,
}) => {
  const [selectedWeight, setSelectedWeight] = useState(
    () => getPreferredWeight(product),
  );

  useEffect(() => {
    setSelectedWeight(getPreferredWeight(product));
  }, [product.id, product.defaultWeight, product.weightOptions, product.weightVariants]);

  const weightOptions =
    product.weightOptions.length > 0
      ? product.weightOptions
      : product.defaultWeight
        ? [product.defaultWeight]
        : [];

  const { price: displayPrice, originalPrice: displayOriginalPrice } = useMemo(
    () => getVariantPricing(product, selectedWeight),
    [product, selectedWeight],
  );

  const discount = getVariantDiscountPercent(product, selectedWeight);
  const selectedInStock = isVariantInStock(product, selectedWeight);

  return (
    <Link
      href={`/products/${product.slug || product.id}`}
      className="bg-white rounded-lg md:rounded-xl lg:rounded-xl overflow-visible border border-[#F2DCBC] hover:shadow-2xl transition-all duration-300 flex flex-col group transform hover:-translate-y-1 sm:hover:-translate-y-2 text-left block"
    >
      <div className="relative">
        <div className="relative aspect-6/5 bg-[#1E3A2B] overflow-hidden rounded-t-lg sm:rounded-t-xl">
          <img
            src={product.image}
            alt={product.name}
            loading="lazy"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            referrerPolicy="no-referrer"
          />

          {product.isFeatured && (
            <div className="absolute top-2 left-2 sm:top-3 sm:left-3 bg-[#1E3A2B] text-white text-[9px] sm:text-[10px] px-2 py-0.5 sm:py-1 rounded-full uppercase tracking-wide flex items-center gap-1">
              Featured
            </div>
          )}

          {product.isBestSeller && (
            <div className="absolute top-2 right-2 sm:top-3 sm:right-3 bg-[#284C38] text-white text-[9px] sm:text-[10px] px-2 py-0.5 sm:py-1 rounded-full">
              Bestseller
            </div>
          )}

          {discount > 0 && (
            <div className="absolute bottom-2 left-2 sm:bottom-3 sm:left-3 bg-[#284C38] text-white text-[9px] sm:text-[10px] px-2 py-0.5 sm:py-1 rounded-full flex items-center gap-0.5">
              {discount}
              <Percent className="w-2.5 h-2.5" />
              OFF
            </div>
          )}
        </div>

        {onQuickAdd && (
          <button
            onClick={(event) => {
              if (!selectedInStock) {
                event.preventDefault();
                event.stopPropagation();
                return;
              }
              onQuickAdd(product, event, selectedWeight);
            }}
            disabled={!selectedInStock}
            aria-label={
              !selectedInStock
                ? "Out of stock"
                : added
                  ? "Added to cart"
                  : "Add to cart"
            }
            className={`absolute -bottom-4 right-2.5 sm:-bottom-5 sm:right-4 w-9 h-9 sm:w-11 sm:h-11 rounded-full shadow-lg border-2 flex items-center justify-center transition-all duration-300 z-10 ${
              !selectedInStock
                ? "bg-gray-100 border-gray-300 cursor-not-allowed opacity-60"
                : added
                  ? "bg-[#284C38] border-[#284C38] cursor-pointer"
                  : "bg-white border-[#284C38] hover:bg-[#284C38] cursor-pointer"
            }`}
          >
            {added ? (
              <Check className="w-4 h-4 sm:w-5 sm:h-5 text-[#D6A146]" />
            ) : (
              <Plus
                className={`w-4 h-4 sm:w-5 sm:h-5 ${
                  selectedInStock
                    ? "text-[#284C38] hover:!text-[#D6A146]"
                    : "text-gray-400"
                }`}
                strokeWidth={2.5}
              />
            )}
          </button>
        )}
      </div>

      <div className="p-3 pt-1 sm:p-3 sm:pt-3 flex-1 flex flex-col justify-between">
        <div>
          <span className="text-[9px] sm:text-[11px] text-[#284C38] uppercase tracking-wider font-medium font-btn">
            {product.category}
          </span>
          <h3 className="text-sm md:text-md lg:text-[16px] font-semibold text-gray-800 group-hover:text-[#284C38] transition-colors mt-0.5 sm:mt-1 break-words line-clamp-2 leading-snug">
            {product.name}
          </h3>
        </div>

        <div className="mt-1 sm:mt-2 pt-1 sm:pt-2 border-t border-gray-100 space-y-1.5">
          {weightOptions.length > 0 && (
            <div>
              <div className="text-[9px] sm:text-[11px] text-gray-500 font-medium mb-1">
                Select Size
              </div>
              <WeightDropdown
                options={weightOptions}
                variants={getProductWeightVariants(product)}
                value={selectedWeight || weightOptions[0]}
                onChange={setSelectedWeight}
              />
              {!selectedInStock && <OutOfStockBadge className="mt-1" compact />}
            </div>
          )}

          {/* <div className="flex items-baseline gap-1.5 flex-wrap">
            <span className="font-bold text-[#284C38] text-sm sm:text-lg">
              ₹{displayPrice}
            </span>
            {displayOriginalPrice > displayPrice && (
              <span className="text-gray-400 line-through text-[10px] sm:text-xs font-normal">
                ₹{displayOriginalPrice}
              </span>
            )}
          </div> */}
        </div>
      </div>
    </Link>
  );
};
