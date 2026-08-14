"use client";

import React, { useState } from "react";
import { ComboItem, Product, NavigationPage } from "../../types";
import {
  ArrowLeft,
  ShoppingBag,
  CheckCircle2,
  Tag,
  Leaf,
  Flame,
  ExternalLink,
} from "lucide-react";

interface ComboDetailPageProps {
  combo: ComboItem;
  onBack: () => void;
  onNavigate: (page: NavigationPage, categoryId?: string, productId?: string) => void;
  onAddToCart?: (product: Product, weight?: string, qty?: number) => void;
}

export const ComboDetailPage: React.FC<ComboDetailPageProps> = ({
  combo,
  onBack,
  onNavigate,
  onAddToCart,
}) => {
  const [isJustAdded, setIsJustAdded] = useState(false);

  const originalTotal = combo.items.reduce(
    (sum, item) => sum + item.product.price,
    0
  );
  const comboPrice = Math.round(
    originalTotal * (1 - combo.discountPercent / 100)
  );
  const totalSavings = originalTotal - comboPrice;

  const handleAddComboToCart = () => {
    if (onAddToCart) {
      combo.items.forEach((item) => {
        onAddToCart(item.product, item.weight, 1);
      });
      setIsJustAdded(true);
      setTimeout(() => setIsJustAdded(false), 2000);
    }
  };

  return (
    <div className="min-h-screen bg-[#F7F5EF] pt-32 sm:pt-28 pb-20 text-left font-body">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        {/* Back Navigation */}
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 text-[#284C38] hover:text-[#C86D39] font-semibold text-xs sm:text-sm font-btn transition-colors mb-5 group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span>Back to All Combos</span>
        </button>

        {/* Combo Header Card */}
        <div className="bg-white rounded-2xl sm:rounded-3xl p-5 sm:p-7 border border-[#D6A146]/25 shadow-sm mb-8 flex flex-col md:flex-row items-center gap-6">
          {/* Combo Image */}
          <div className="relative w-full md:w-56 h-48 sm:h-52 rounded-2xl overflow-hidden shrink-0 bg-[#1E3A2B]">
            <img
              src={combo.image}
              alt={combo.title}
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
            <div className="absolute top-3 left-3 bg-[#C86D39] text-white text-[11px] font-semibold px-2.5 py-1 rounded-full shadow-md flex items-center gap-1">
              <Tag className="w-3 h-3" />
              <span>SAVE {combo.discountPercent}%</span>
            </div>
            {combo.badge && (
              <div className="absolute top-3 right-3 bg-[#D6A146] text-[#1D1D1D] text-[10px] font-semibold uppercase px-2 py-0.5 rounded shadow font-btn">
                {combo.badge}
              </div>
            )}
          </div>

          {/* Combo Overview & CTA */}
          <div className="flex-1 w-full flex flex-col justify-between">
            <div>
              <span className="text-xs font-semibold text-[#C86D39] uppercase tracking-wider font-btn">
                {combo.tag}
              </span>
              <h1 className="font-heading text-2xl sm:text-3xl font-semibold text-[#1D1D1D] mt-1 mb-2">
                {combo.title}
              </h1>
              <p className="text-xs sm:text-sm text-gray-600 leading-relaxed mb-4">
                {combo.description}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-4 border-t border-gray-100">
              <div>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl sm:text-3xl font-semibold text-[#284C38]">
                    ₹{comboPrice}
                  </span>
                  <span className="text-sm sm:text-base text-gray-400 line-through">
                    ₹{originalTotal}
                  </span>
                  <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                    Save ₹{totalSavings}
                  </span>
                </div>
                <p className="text-[11px] text-gray-500 mt-0.5">
                  Includes {combo.items.length} full-size spice packs
                </p>
              </div>

              <button
                onClick={handleAddComboToCart}
                className={`py-3 px-6 rounded-xl font-btn font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md transition-all shrink-0 ${
                  isJustAdded
                    ? "bg-emerald-600 text-white"
                    : "bg-[#D6A146] hover:bg-[#E8BF73] text-[#1D1D1D]"
                }`}
              >
                {isJustAdded ? (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Added to Cart!</span>
                  </>
                ) : (
                  <>
                    <ShoppingBag className="w-4 h-4" />
                    <span>Add All {combo.items.length} Spices to Cart</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Spices Included Section */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg sm:text-xl font-semibold text-[#1D1D1D]">
              Spices Included in this Combo ({combo.items.length})
            </h2>
          </div>

          <div className="space-y-4">
            {combo.items.map((item, index) => {
              const p = item.product;
              return (
                <div
                  key={p.id}
                  className="bg-white rounded-2xl p-4 sm:p-5 border border-[#D6A146]/20 shadow-xs flex flex-col sm:flex-row items-start sm:items-center gap-4 transition-all hover:border-[#D6A146]/50"
                >
                  {/* Image */}
                  {/* <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-xl overflow-hidden shrink-0 bg-gray-50 border border-gray-100">
                    <img
                      src={p.image}
                      alt={p.name}
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </div> */}

                  {/* Spice Details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center justify-between gap-2 mb-1">
                      <div className="flex items-center gap-2">
                        <h3 className="text-base sm:text-lg font-semibold text-[#1D1D1D]">
                          {p.name}
                        </h3>
                        <span className="text-[11px] font-semibold text-[#284C38] bg-[#F7F5EF] border border-[#284C38]/20 px-2 py-0.5 rounded-md">
                          {item.weight} Pack
                        </span>
                      </div>
                      <span className="text-xs font-semibold text-gray-500">
                        MRP: ₹{p.price}
                      </span>
                    </div>

                    {/* <p className="text-xs text-gray-600 leading-relaxed mb-2">
                      {item.description || p.shortDescription}
                    </p> */}

                    {/* Ingredients & Flavor Profile */}
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-[11px] text-gray-500 pt-1 border-t border-gray-100">
                      <div className="flex items-center gap-1">
                        <Leaf className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span className="font-medium text-gray-700">
                          {p.ingredients.slice(0, 4).join(", ")}
                          {p.ingredients.length > 4 ? "..." : ""}
                        </span>
                      </div>

                      <div className="flex items-center gap-1">
                        <Flame className="w-3.5 h-3.5 text-[#C86D39] shrink-0" />
                        <span>Spiciness: {p.spicinessLevel}/5</span>
                      </div>

                      {p.aromaProfile && (
                        <span className="text-gray-400">
                          · {p.aromaProfile.split(".")[0]}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Individual Product Link */}
                  <button
                    onClick={() => onNavigate("product-detail", undefined, p.id)}
                    className="self-end sm:self-center px-3 py-1.5 rounded-lg bg-[#F7F5EF] hover:bg-[#284C38] text-[#284C38] hover:text-white text-[11px] font-semibold transition-colors flex items-center gap-1 shrink-0 font-btn border border-gray-200"
                  >
                    <span>View Spice</span>
                    <ExternalLink className="w-3 h-3" />
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
