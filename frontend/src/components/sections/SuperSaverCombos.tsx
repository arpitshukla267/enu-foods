import React, { useState } from "react";
import { Product, NavigationPage, ComboItem } from "../../types";
import { ArrowRight, Check, Loader2 } from "lucide-react";
import { usePublicCombos } from "../../hooks/usePublicCombos";
import { getComboPrices, getComboRouteSlug } from "../../lib/comboApi";

interface SuperSaverCombosProps {
  onNavigate: (
    page: NavigationPage,
    categoryId?: string,
    productId?: string,
  ) => void;
  onAddComboToCart?: (product: Product, weight?: string, qty?: number) => void;
}

export const SuperSaverCombos: React.FC<SuperSaverCombosProps> = ({
  onNavigate,
  onAddComboToCart,
}) => {
  const { combos, isLoading } = usePublicCombos({ limit: 12 });
  const [activeIndex, setActiveIndex] = useState(0);

  if (isLoading && combos.length === 0) {
    return (
      <section className="py-10 lg:py-16 bg-[#F6EFE1] text-left">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-center gap-2 text-[#14261B]/60">
          <Loader2 className="w-5 h-5 animate-spin" />
          <span className="text-sm">Loading combos...</span>
        </div>
      </section>
    );
  }

  if (combos.length === 0) {
    return null;
  }

  const active: ComboItem = combos[activeIndex] || combos[0];
  const { originalTotal, comboPrice, savings } = getComboPrices(active);
  const selectorCombos = combos.slice(0, 4);

  const addComboToCart = (combo: ComboItem) => {
    combo.items.forEach((item) =>
      onAddComboToCart?.(item.product, item.weight, item.quantity ?? 1),
    );
  };

  return (
    <section className="py-10 lg:py-16 bg-[#F6EFE1] text-left">
      <div className="max-w-[95vw] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8 lg:mb-10">
          <div>
            <h2 className="text-3xl sm:text-4xl text-[#14261B] font-semibold leading-tight">
              Super Saver Combos
            </h2>
            <p className="text-[#14261B]/65 text-sm mt-2 max-w-md font-body">
              Curated spice bundles at up to 25% off the individual price.
            </p>
          </div>

          <button
            onClick={() => onNavigate("combos")}
            className="hidden sm:inline-flex items-center gap-2 text-[#14261B] text-sm font-semibold hover:underline underline-offset-4 font-btn shrink-0"
          >
            View all {combos.length} combos <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid lg:grid-cols-[1fr_340px] gap-5 lg:gap-6">
          {/* Featured combo */}
          <div className="bg-white rounded-2xl overflow-hidden border border-[#14261B]/10">
            <div className="grid md:grid-cols-2">
              <div
                onClick={() =>
                  onNavigate("combos", undefined, getComboRouteSlug(active))
                }
                className="relative h-64 sm:h-72 md:h-auto md:min-h-[360px] cursor-pointer overflow-hidden bg-[#F6EFE1]"
              >
                <img
                  src={active.image}
                  alt={active.title}
                  className="absolute inset-0 w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
                <span className="absolute top-4 left-4 bg-[#14261B] text-white text-xs font-semibold px-3 py-1 rounded-md">
                  Save {active.discountPercent}%
                </span>
              </div>

              <div className="p-5 sm:p-7 flex flex-col justify-between">
                <div>
                  <p className="text-[#D9673B] text-xs font-semibold uppercase tracking-wider mb-2 font-btn">
                    {active.tag}
                  </p>
                  <h3 className="text-xl sm:text-2xl text-[#14261B] font-semibold leading-snug mb-2">
                    {active.title}
                  </h3>
                  <p className="text-[#14261B]/65 text-sm leading-relaxed mb-4 line-clamp-3">
                    {active.description}
                  </p>

                  <ul className="flex flex-wrap gap-2 mb-5">
                    {active.items.slice(0, 4).map((item) => (
                      <li
                        key={`${item.product.id}-${item.weight}`}
                        className="text-xs bg-[#F6EFE1] text-[#14261B]/80 px-2.5 py-1 rounded-md flex items-center gap-1"
                      >
                        <Check className="w-3 h-3 text-[#14261B]/60" />
                        {item.product.name}
                      </li>
                    ))}
                    {active.items.length > 4 && (
                      <li className="text-xs text-[#14261B]/50 px-1 py-1">
                        +{active.items.length - 4} more
                      </li>
                    )}
                  </ul>
                </div>

                <div>
                  <div className="flex items-baseline gap-2 mb-4">
                    <span className="text-2xl sm:text-3xl font-bold text-[#14261B]">
                      ₹{comboPrice}
                    </span>
                    <span className="text-sm text-[#14261B]/40 line-through">
                      ₹{originalTotal}
                    </span>
                    <span className="text-xs font-medium text-[#14261B]/70">
                      You save ₹{savings}
                    </span>
                  </div>

                  <div className="flex flex-col gap-2.5">
                    <button
                      onClick={() => addComboToCart(active)}
                      disabled={active.items.length === 0}
                      className="w-full bg-[#14261B] hover:bg-[#1E3628] text-white font-semibold text-sm py-3 rounded-lg transition-colors font-btn disabled:opacity-50"
                    >
                      Add Bundle to Cart
                    </button>
                    <button
                      onClick={() =>
                        onNavigate(
                          "combos",
                          undefined,
                          getComboRouteSlug(active),
                        )
                      }
                      className="w-full bg-white hover:bg-[#F6EFE1] text-[#14261B] font-semibold text-sm py-3 rounded-lg transition-colors border border-[#14261B]/20 flex items-center justify-center gap-1.5 font-btn"
                    >
                      <span>View Details</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Selector list */}
          <div className="flex flex-col gap-2.5">
            {selectorCombos.map((combo, i) => {
              const isActive = i === activeIndex;
              const prices = getComboPrices(combo);

              return (
                <button
                  key={combo.id}
                  onClick={() => setActiveIndex(i)}
                  className={`flex items-center gap-4 p-3 rounded-xl border text-left transition-colors ${
                    isActive
                      ? "bg-white border-[#14261B]"
                      : "bg-white/60 border-[#14261B]/10 hover:border-[#14261B]/30 hover:bg-white"
                  }`}
                >
                  <div className="w-14 h-14 rounded-lg overflow-hidden shrink-0 bg-[#F6EFE1]">
                    <img
                      src={combo.image}
                      alt={combo.title}
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold truncate text-[#14261B]">
                      {combo.title}
                    </p>
                    <p className="text-xs truncate mt-0.5 text-[#14261B]/55">
                      {combo.items.length} spices · Save ₹{prices.savings}
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="font-semibold text-sm text-[#14261B]">
                      ₹{prices.comboPrice}
                    </p>
                    <p className="text-[#14261B]/40 line-through text-[11px]">
                      ₹{prices.originalTotal}
                    </p>
                  </div>
                </button>
              );
            })}

            <button
              onClick={() => onNavigate("combos")}
              className="mt-1 flex items-center justify-center gap-2 text-[#14261B] text-sm font-semibold py-3 hover:underline underline-offset-4"
            >
              <span>Explore all {combos.length} combos</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
