import React, { useState, useMemo } from "react";
import { COMBOS } from "../../data/combosData";
import { Product, NavigationPage, ComboItem } from "../../types";
import {
  Tag,
  ShoppingBag,
  Sparkles,
  ShieldCheck,
  Truck,
  Leaf,
  CheckCircle2,
  Package,
  Eye,
  ArrowRight,
} from "lucide-react";

interface CombosPageProps {
  onNavigate: (page: NavigationPage, categoryId?: string, productId?: string) => void;
  onSelectCombo?: (combo: ComboItem) => void;
  onAddToCart?: (product: Product, weight?: string, qty?: number) => void;
}

export const CombosPage: React.FC<CombosPageProps> = ({
  onNavigate,
  onSelectCombo,
  onAddToCart,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [addedComboId, setAddedComboId] = useState<string | null>(null);

  const filteredCombos = useMemo(() => {
    if (selectedCategory === "All") return COMBOS;
    return COMBOS.filter((c) => c.category === selectedCategory);
  }, [selectedCategory]);

  const handleCardClick = (combo: ComboItem) => {
    if (onSelectCombo) {
      onSelectCombo(combo);
    } else {
      onNavigate("combos", undefined, combo.id);
    }
  };

  const handleAddCombo = (e: React.MouseEvent, combo: ComboItem) => {
    e.stopPropagation();
    if (onAddToCart) {
      combo.items.forEach((item) => {
        onAddToCart(item.product, item.weight, 1);
      });
      setAddedComboId(combo.id);
      setTimeout(() => {
        setAddedComboId(null);
      }, 2000);
    }
  };

  return (
    <div className="min-h-screen bg-[#F7F5EF] pt-28 pb-20 text-left">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        {/* Banner Section */}
        {/* <div className="relative bg-[#1E3A2B] text-white rounded-2xl sm:rounded-3xl overflow-hidden shadow-xl p-5 sm:p-8 mb-6 border border-[#D6A146]/30">
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#D6A146]/10 rounded-full blur-2xl pointer-events-none" />
          <div className="relative z-10 max-w-2xl">
            <div className="inline-flex items-center gap-1.5 bg-[#D6A146]/20 border border-[#D6A146]/40 text-[#D6A146] text-[10px] sm:text-xs font-semibold px-2.5 py-0.5 rounded-full uppercase tracking-wider mb-2 font-btn">
              <Tag className="w-3.5 h-3.5" />
              <span>Gourmet Value Bundles</span>
            </div>

            <h1 className="font-heading text-2xl sm:text-3xl lg:text-4xl font-bold leading-tight mb-2 text-white">
              Super Saver <span className="text-[#D6A146]">Spice Bundles</span>
            </h1>

            <p className="font-body text-gray-300 text-xs sm:text-sm leading-relaxed">
              Save up to 25% with chef-curated recipe combos. Click any bundle to see every masala included, full flavor notes, and recipe pairings.
            </p>
          </div>
        </div> */}

        {/* Value Highlights Strip - Compact */}
        {/* <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3 mb-6">
          <div className="bg-white rounded-xl p-2.5 sm:p-3 border border-[#D6A146]/20 flex items-center gap-2.5 shadow-xs">
            <div className="w-8 h-8 rounded-lg bg-[#284C38]/10 flex items-center justify-center shrink-0">
              <Tag className="w-4 h-4 text-[#284C38]" />
            </div>
            <div>
              <p className="text-[11px] sm:text-xs font-bold text-[#1D1D1D]">15%–25% Off</p>
              <p className="text-[9px] sm:text-[10px] text-gray-500">Bundle discount</p>
            </div>
          </div>

          <div className="bg-white rounded-xl p-2.5 sm:p-3 border border-[#D6A146]/20 flex items-center gap-2.5 shadow-xs">
            <div className="w-8 h-8 rounded-lg bg-[#284C38]/10 flex items-center justify-center shrink-0">
              <Truck className="w-4 h-4 text-[#284C38]" />
            </div>
            <div>
              <p className="text-[11px] sm:text-xs font-bold text-[#1D1D1D]">Free Shipping</p>
              <p className="text-[9px] sm:text-[10px] text-gray-500">On all bundles</p>
            </div>
          </div>

          <div className="bg-white rounded-xl p-2.5 sm:p-3 border border-[#D6A146]/20 flex items-center gap-2.5 shadow-xs">
            <div className="w-8 h-8 rounded-lg bg-[#284C38]/10 flex items-center justify-center shrink-0">
              <Leaf className="w-4 h-4 text-[#284C38]" />
            </div>
            <div>
              <p className="text-[11px] sm:text-xs font-bold text-[#1D1D1D]">Cold Ground</p>
              <p className="text-[9px] sm:text-[10px] text-gray-500">Essential oils intact</p>
            </div>
          </div>

          <div className="bg-white rounded-xl p-2.5 sm:p-3 border border-[#D6A146]/20 flex items-center gap-2.5 shadow-xs">
            <div className="w-8 h-8 rounded-lg bg-[#284C38]/10 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-4 h-4 text-[#284C38]" />
            </div>
            <div>
              <p className="text-[11px] sm:text-xs font-bold text-[#1D1D1D]">FSSAI Tested</p>
              <p className="text-[9px] sm:text-[10px] text-gray-500">Zero artificial dyes</p>
            </div>
          </div>
        </div> */}

        {/* Category Filter Tabs */}
        <div className="flex items-center justify-between gap-3 mb-5">
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
            {[
              { id: "All", label: "All Bundles" },
              { id: "daily", label: "Daily Essentials" },
              { id: "regional", label: "Regional Specials" },
              { id: "feast", label: "Feast & Curry" },
              { id: "all-in-one", label: "Master Pantry" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setSelectedCategory(tab.id)}
                className={`px-3 py-1.5 text-[11px] sm:text-xs font-semibold rounded-xl transition-all shrink-0 ${
                  selectedCategory === tab.id
                    ? "bg-[#284C38] text-white shadow-xs"
                    : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-200"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <p className="text-[11px] sm:text-xs text-gray-500 shrink-0 hidden sm:inline">
            Showing <strong>{filteredCombos.length}</strong> bundles
          </p>
        </div>

        {/* Compact Responsive Combos Grid: 2 cols on mobile, 3 on tab, 4-5 on desktop */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4 lg:gap-5">
          {filteredCombos.map((combo) => {
            const originalTotal = combo.items.reduce(
              (sum, item) => sum + item.product.price,
              0
            );
            const comboPrice = Math.round(
              originalTotal * (1 - combo.discountPercent / 100)
            );
            const savings = originalTotal - comboPrice;
            const isJustAdded = addedComboId === combo.id;

            return (
              <div
                key={combo.id}
                onClick={() => handleCardClick(combo)}
                className="group bg-white rounded-xl sm:rounded-2xl overflow-hidden border border-[#D6A146]/20 shadow-xs hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between cursor-pointer"
              >
                <div>
                  {/* Top Image Container - Compact height */}
                  <div className="relative h-32 sm:h-36 md:h-40 overflow-hidden bg-[#1E3A2B]">
                    <img
                      src={combo.image}
                      alt={combo.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      referrerPolicy="no-referrer"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/15 to-transparent" />

                    {/* Savings Tag */}
                    <div className="absolute top-2 left-2 bg-[#C86D39] text-white text-[9px] sm:text-[10px] font-bold px-2 py-0.5 rounded-full shadow-xs">
                      SAVE {combo.discountPercent}%
                    </div>

                    {/* Badge */}
                    {combo.badge && (
                      <div className="absolute top-2 right-2 bg-[#D6A146] text-[#1D1D1D] text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-md shadow-xs font-btn">
                        {combo.badge}
                      </div>
                    )}

                    {/* Category Tag */}
                    <div className="absolute bottom-2 left-2 bg-black/60 backdrop-blur-md text-[#D6A146] text-[9px] sm:text-[10px] font-medium px-2 py-0.5 rounded-md">
                      {combo.tag}
                    </div>

                    {/* Hover detail indicator */}
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <span className="bg-white/90 backdrop-blur-md text-[#1E3A2B] text-[10px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1 shadow-md">
                        <Eye className="w-3 h-3" />
                        <span>View Details</span>
                      </span>
                    </div>
                  </div>

                  {/* Body Content - Compact */}
                  <div className="p-2.5 sm:p-3 space-y-2">
                    <div>
                      <h3 className="font-heading text-xs sm:text-sm font-bold text-[#1D1D1D] leading-snug line-clamp-1 mb-0.5 group-hover:text-[#284C38] transition-colors">
                        {combo.title}
                      </h3>
                      <p className="text-[10px] sm:text-xs text-gray-500 leading-tight line-clamp-1">
                        {combo.description}
                      </p>
                    </div>

                    {/* Included Items Summary Pill Box */}
                    <div className="bg-[#F7F5EF] rounded-lg p-2 border border-gray-200/70">
                      <p className="text-[9px] font-bold text-[#284C38] uppercase tracking-wider mb-1 flex items-center justify-between">
                        <span className="flex items-center gap-1">
                          <Package className="w-3 h-3 text-[#D6A146]" />
                          <span>Includes {combo.items.length} Spices:</span>
                        </span>
                        <span className="text-[#C86D39] text-[9px] font-bold flex items-center gap-0.5">
                          Details &rarr;
                        </span>
                      </p>
                      <p className="text-[10px] text-gray-600 line-clamp-2 leading-tight">
                        {combo.items
                          .map((i) => `${i.product.name.replace("ENU ", "")} (${i.weight})`)
                          .join(" + ")}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Footer with Price and Add to Cart Button */}
                <div className="p-2.5 sm:p-3 pt-0 space-y-2">
                  <div className="flex items-baseline justify-between border-t border-gray-100 pt-2">
                    <div>
                      <span className="text-base sm:text-lg font-bold text-[#284C38]">
                        ₹{comboPrice}
                      </span>
                      <span className="text-[10px] sm:text-xs text-gray-400 line-through ml-1.5">
                        ₹{originalTotal}
                      </span>
                    </div>
                    <span className="text-[9px] sm:text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-1.5 py-0.5 rounded-full">
                      Save ₹{savings}
                    </span>
                  </div>

                  <button
                    onClick={(e) => handleAddCombo(e, combo)}
                    className={`w-full py-2 sm:py-2.5 px-2 rounded-xl font-btn font-bold text-[11px] sm:text-xs flex items-center justify-center gap-1.5 shadow-xs transition-all active:scale-95 ${
                      isJustAdded
                        ? "bg-emerald-600 text-white"
                        : "bg-[#D6A146] hover:bg-[#E8BF73] text-[#1D1D1D]"
                    }`}
                  >
                    {isJustAdded ? (
                      <>
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Added!</span>
                      </>
                    ) : (
                      <>
                        <ShoppingBag className="w-3.5 h-3.5" />
                        <span>Add {combo.items.length} Spices</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
