import React, { useMemo, useState } from "react";
import { Product, NavigationPage, ComboItem } from "../../types";
import {
  ShoppingBag,
  Package,
  Eye,
  ArrowRight,
  Loader2,
  AlertCircle,
  RefreshCw,
} from "lucide-react";
import { usePublicCombos } from "../../hooks/usePublicCombos";
import { getComboPrices, getComboRouteSlug } from "../../lib/comboApi";

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
  const [addedComboId, setAddedComboId] = useState<string | null>(null);
  const { combos, isLoading, error, reload } = usePublicCombos();

  const handleCardClick = (combo: ComboItem) => {
    if (onSelectCombo) {
      onSelectCombo(combo);
    } else {
      onNavigate("combos", undefined, getComboRouteSlug(combo));
    }
  };

  const handleAddCombo = (e: React.MouseEvent, combo: ComboItem) => {
    e.stopPropagation();
    if (!onAddToCart) return;

    combo.items.forEach((item) => {
      onAddToCart(item.product, item.weight, item.quantity ?? 1);
    });
    setAddedComboId(combo.id);
    window.setTimeout(() => setAddedComboId(null), 2000);
  };

  if (isLoading && combos.length === 0) {
    return (
      <div className="min-h-screen bg-[#F7F5EF] pt-28 pb-20 flex items-center justify-center">
        <div className="flex items-center gap-2 text-[#284C38]">
          <Loader2 className="w-5 h-5 animate-spin" />
          <span className="text-sm">Loading spice bundles...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F7F5EF] pt-36 pb-20 text-left">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        {error && (
          <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 flex items-center justify-between gap-3">
            <div className="flex items-start gap-2">
              <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
              <span>{error}</span>
            </div>
            <button
              type="button"
              onClick={() => void reload()}
              className="inline-flex items-center gap-1.5 text-xs font-bold shrink-0"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Retry
            </button>
          </div>
        )}

        <div className="flex items-center justify-end gap-3 mb-5">
          <p className="text-[11px] sm:text-xs text-gray-500 shrink-0">
            Showing <strong>{combos.length}</strong> bundles
          </p>
        </div>

        {combos.length === 0 && !isLoading ? (
          <div className="rounded-2xl border border-[#D6A146]/20 bg-white p-10 text-center">
            <Package className="w-10 h-10 text-[#284C38]/40 mx-auto mb-3" />
            <h3 className="font-heading text-lg font-bold text-[#1D1D1D] mb-1">No bundles yet</h3>
            <p className="text-sm text-gray-500">
              New super saver combos will appear here soon.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4 lg:gap-5">
            {combos.map((combo) => {
              const { originalTotal, comboPrice, savings } = getComboPrices(combo);
              const isJustAdded = addedComboId === combo.id;

              return (
                <div
                  key={combo.id}
                  onClick={() => handleCardClick(combo)}
                  className="group bg-white rounded-xl sm:rounded-2xl overflow-hidden border border-[#D6A146]/20 shadow-xs hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between cursor-pointer"
                >
                  <div>
                    <div className="relative h-32 sm:h-36 md:h-40 overflow-hidden bg-[#1E3A2B]">
                      <img
                        src={combo.image}
                        alt={combo.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        referrerPolicy="no-referrer"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/15 to-transparent" />

                      <div className="absolute top-2 left-2 bg-[#C86D39] text-white text-[9px] sm:text-[10px] font-bold px-2 py-0.5 rounded-full shadow-xs">
                        SAVE {combo.discountPercent}%
                      </div>

                      {combo.badge && (
                        <div className="absolute top-2 right-2 bg-[#D6A146] text-[#1D1D1D] text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-md shadow-xs font-btn">
                          {combo.badge}
                        </div>
                      )}

                      <div className="absolute bottom-2 left-2 bg-black/60 backdrop-blur-md text-[#D6A146] text-[9px] sm:text-[10px] font-medium px-2 py-0.5 rounded-md">
                        {combo.tag}
                      </div>

                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <span className="bg-white/90 backdrop-blur-md text-[#1E3A2B] text-[10px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1 shadow-md">
                          <Eye className="w-3 h-3" />
                          <span>View Details</span>
                        </span>
                      </div>
                    </div>

                    <div className="p-2.5 sm:p-3 space-y-2">
                      <div>
                        <h3 className="font-heading text-xs sm:text-sm font-bold text-[#1D1D1D] leading-snug line-clamp-1 mb-0.5 group-hover:text-[#284C38] transition-colors">
                          {combo.title}
                        </h3>
                        <p className="text-[10px] sm:text-[11px] text-gray-500 line-clamp-2 leading-relaxed">
                          {combo.description}
                        </p>
                      </div>

                      <div className="flex items-center gap-1.5 text-[10px] text-gray-500">
                        <Package className="w-3 h-3 shrink-0" />
                        <span>{combo.items.length} spices included</span>
                      </div>
                    </div>
                  </div>

                  <div className="px-2.5 sm:px-3 pb-2.5 sm:pb-3">
                    <div className="flex items-end justify-between gap-2 mb-2">
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="font-heading text-sm sm:text-base font-bold text-[#284C38]">
                            ₹{comboPrice}
                          </span>
                          <span className="text-[10px] text-gray-400 line-through">
                            ₹{originalTotal}
                          </span>
                        </div>
                        <p className="text-[9px] text-[#C86D39] font-semibold">
                          Save ₹{savings}
                        </p>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={(e) => handleAddCombo(e, combo)}
                      disabled={combo.items.length === 0}
                      className={`w-full py-2 rounded-xl text-[10px] sm:text-xs font-bold flex items-center justify-center gap-1.5 transition-all font-btn ${
                        isJustAdded
                          ? "bg-[#284C38] text-white"
                          : "bg-[#D6A146] hover:bg-[#C86D39] text-[#1D1D1D] hover:text-white"
                      }`}
                    >
                      {isJustAdded ? (
                        <>
                          <ShoppingBag className="w-3.5 h-3.5" />
                          <span>Added!</span>
                        </>
                      ) : (
                        <>
                          <ShoppingBag className="w-3.5 h-3.5" />
                          <span>Add Bundle</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        <div className="hidden sm:flex mt-8 justify-center">
          <button
            type="button"
            onClick={() => onNavigate("products")}
            className="inline-flex items-center gap-2 text-sm font-semibold text-[#284C38] hover:text-[#C86D39] transition-colors font-btn"
          >
            Browse individual spices
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
