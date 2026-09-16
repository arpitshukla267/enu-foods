import React, { useState } from "react";
import { Product, NavigationPage, ComboItem } from "../../types";
import { ArrowRight, Check, Package, Sparkles, Loader2 } from "lucide-react";
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
      <section className="py-10 lg:py-16 bg-[#14261B] text-left">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-center gap-2 text-[#F6EFE1]/70">
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
    combo.items.forEach((item) => onAddComboToCart?.(item.product, item.weight, item.quantity ?? 1));
  };

  return (
    <section className="py-10 lg:py-16 bg-[#14261B] text-left overflow-hidden relative">
      <div className="absolute top-1/3 left-1/4 w-[500px] h-[500px] bg-[#D9673B]/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8 lg:mb-14">
          <div>
            <h2 className="text-3xl sm:text-4xl lg:text-[2.75rem] text-[#F6EFE1] font-semibold leading-tight">
              Super Saver Combos
            </h2>
            <p className="text-[#F6EFE1]/60 text-sm mt-2 max-w-md font-body">
              Hand-picked spice bundles up to 25% off — explore all included
              masalas, flavor profiles, and chef recipes.
            </p>
          </div>

          <button
            onClick={() => onNavigate("combos")}
            className="hidden sm:inline-flex items-center gap-2 text-[#E4B355] text-sm font-semibold hover:gap-3 transition-all font-btn shrink-0"
          >
            View all {combos.length} combos <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid lg:grid-cols-[1fr_340px] gap-5 lg:gap-8">
          <div className="relative bg-[#1E3628] rounded-3xl overflow-hidden border border-[#E4B355]/20 shadow-2xl flex flex-col justify-between">
            <div className="grid md:grid-cols-2">
              <div
                onClick={() => onNavigate("combos", undefined, getComboRouteSlug(active))}
                className="relative h-64 sm:h-72 md:h-auto md:min-h-[360px] cursor-pointer group"
              >
                <img
                  src={active.image}
                  alt={active.title}
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#14261B] via-[#14261B]/20 to-transparent" />
                <div className="absolute top-4 left-4 bg-[#D9673B] text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>SAVE {active.discountPercent}%</span>
                </div>
              </div>

              <div className="p-5 sm:p-7 flex flex-col justify-between">
                <div>
                  <p className="text-[#E4B355] text-xs font-semibold uppercase tracking-wider mb-2 font-btn">
                    {active.tag}
                  </p>
                  <h3 className="text-xl sm:text-2xl text-[#F6EFE1] font-semibold leading-snug mb-2">
                    {active.title}
                  </h3>
                  <p className="text-[#F6EFE1]/60 text-sm leading-relaxed mb-4 line-clamp-3">
                    {active.description}
                  </p>

                  <div className="flex flex-wrap gap-2 mb-5">
                    {active.items.slice(0, 4).map((item) => (
                      <span
                        key={`${item.product.id}-${item.weight}`}
                        className="text-[10px] bg-white/5 border border-white/10 text-[#F6EFE1]/80 px-2 py-1 rounded-lg flex items-center gap-1"
                      >
                        <Check className="w-3 h-3 text-[#E4B355]" />
                        {item.product.name}
                      </span>
                    ))}
                    {active.items.length > 4 && (
                      <span className="text-[10px] text-[#F6EFE1]/50 px-2 py-1">
                        +{active.items.length - 4} more
                      </span>
                    )}
                  </div>
                </div>

                <div>
                  <div className="flex items-baseline gap-2 mb-4">
                    <span className="text-2xl sm:text-3xl font-bold text-[#F6EFE1]">
                      ₹{comboPrice}
                    </span>
                    <span className="text-sm text-[#F6EFE1]/40 line-through">
                      ₹{originalTotal}
                    </span>
                    <span className="text-xs font-semibold text-[#D9673B] bg-[#D9673B]/15 px-2 py-0.5 rounded-full">
                      Save ₹{savings}
                    </span>
                  </div>

                  <div className="flex flex-col gap-2.5">
                    <button
                      onClick={() => addComboToCart(active)}
                      disabled={active.items.length === 0}
                      className="w-full bg-[#E4B355] hover:bg-[#F0C471] text-[#14261B] font-semibold text-sm py-3 rounded-xl transition-all shadow-md font-btn disabled:opacity-50"
                    >
                      Add Bundle to Cart
                    </button>
                    <button
                      onClick={() => onNavigate("combos", undefined, getComboRouteSlug(active))}
                      className="w-full bg-white/[0.06] hover:bg-white/[0.1] text-[#F6EFE1] font-semibold text-sm py-3 rounded-xl transition-all border border-white/15 flex items-center justify-center gap-1.5 font-btn"
                    >
                      <span>Check Details</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-2.5">
            {selectorCombos.map((combo, i) => {
              const isActive = i === activeIndex;
              const prices = getComboPrices(combo);

              return (
                <button
                  key={combo.id}
                  onClick={() => setActiveIndex(i)}
                  className={`flex items-center gap-4 p-3.5 rounded-2xl border text-left transition-all ${
                    isActive
                      ? "bg-[#2B4A35] border-[#E4B355]/70 shadow-lg shadow-black/20"
                      : "bg-[#1E3628]/70 border-[#E4B355]/10 hover:border-[#E4B355]/35 hover:bg-[#1E3628]"
                  }`}
                >
                  <div
                    className={`w-14 h-14 rounded-xl overflow-hidden shrink-0 border ${
                      isActive ? "border-[#E4B355]/50" : "border-white/10"
                    }`}
                  >
                    <img
                      src={combo.image}
                      alt={combo.title}
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p
                      className={`text-xs sm:text-sm font-semibold truncate ${isActive ? "text-[#E4B355]" : "text-[#F6EFE1]/85"}`}
                    >
                      {combo.title}
                    </p>
                    <p
                      className={`text-[11px] truncate mt-0.5 ${isActive ? "text-[#F6EFE1]/65" : "text-[#F6EFE1]/40"}`}
                    >
                      {combo.items.length} spices · Save ₹{prices.savings}
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    <p
                      className={`font-semibold text-xs sm:text-sm ${isActive ? "text-[#F6EFE1]" : "text-[#F6EFE1]/70"}`}
                    >
                      ₹{prices.comboPrice}
                    </p>
                    <p className="text-[#F6EFE1]/35 line-through text-[10px]">
                      ₹{prices.originalTotal}
                    </p>
                  </div>
                </button>
              );
            })}

            <button
              onClick={() => onNavigate("combos")}
              className="mt-1 flex items-center justify-center gap-2 text-[#E4B355] text-xs font-semibold py-3 hover:underline"
            >
              <span>Explore all {combos.length} Super Saver Combos</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
