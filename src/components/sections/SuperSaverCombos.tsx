import React, { useState } from 'react';
import { COMBOS } from '../../data/combosData';
import { Product, NavigationPage, ComboItem } from '../../types';
import { ArrowRight, Check, Package, Sparkles } from 'lucide-react';

interface SuperSaverCombosProps {
  onNavigate: (page: NavigationPage, categoryId?: string, productId?: string) => void;
  onAddComboToCart?: (product: Product, weight?: string, qty?: number) => void;
}

export const SuperSaverCombos: React.FC<SuperSaverCombosProps> = ({ onNavigate, onAddComboToCart }) => {
  const [activeIndex, setActiveIndex] = useState(0);

  const active: ComboItem = COMBOS[activeIndex] || COMBOS[0];
  if (!active) return null;

  const originalTotal = active.items.reduce((sum, item) => sum + item.product.price, 0);
  const comboPrice = Math.round(originalTotal * (1 - active.discountPercent / 100));
  const savings = originalTotal - comboPrice;

  const addComboToCart = (combo: ComboItem) => {
    combo.items.forEach((item) => onAddComboToCart?.(item.product, item.weight));
  };

  return (
    <section className="py-8 lg:py-16 bg-[#1E3A2B] text-left overflow-hidden relative">
      {/* Subtle texture */}
      <div
        className="absolute inset-0 opacity-[0.02] pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23D6A146' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Section label */}
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-6 mt-4 lg:mb-14">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#D6A146] uppercase tracking-wider mb-2 font-btn">
              <Sparkles className="w-4 h-4" />
              <span>Curated Value Sets</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-[2.75rem] text-white font-semibold leading-tight">
              Super Saver Combos
            </h2>
            <p className="text-white/70 text-sm mt-2 max-w-md font-body">
              Hand-picked spice bundles up to 25% off — explore all included masalas, flavor profiles, and chef recipes.
            </p>
          </div>

          <button
            onClick={() => onNavigate('combos')}
            className="hidden sm:inline-flex items-center gap-2 text-[#D6A146] text-sm font-semibold hover:gap-3 transition-all font-btn"
          >
            View all {COMBOS.length} combos <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Main layout: featured + selector */}
        <div className="grid lg:grid-cols-[1fr_340px] gap-6 lg:gap-8">
          {/* Featured combo card */}
          <div className="relative bg-[#284C38] rounded-3xl overflow-hidden border border-[#D6A146]/20 shadow-2xl flex flex-col justify-between">
            <div className="grid md:grid-cols-2">
              {/* Image side */}
              <div
                onClick={() => onNavigate('combos', undefined, active.id)}
                className="relative h-56 md:h-auto md:min-h-[340px] cursor-pointer group"
              >
                <img
                  src={active.image}
                  alt={active.title}
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />

                {/* Savings stamp */}
                <div className="absolute top-4 left-4 w-16 h-16 rounded-full border-2 border-dashed border-[#D6A146] flex flex-col items-center justify-center bg-[#1E3A2B]/90 rotate-[-12deg] shadow-lg">
                  <span className="text-[#D6A146] text-[10px] font-bold uppercase leading-none">Save</span>
                  <span className="text-white text-lg font-bold leading-none">{active.discountPercent}%</span>
                </div>

                <div className="absolute bottom-4 left-4 bg-black/60 backdrop-blur-md text-[#D6A146] text-xs font-semibold px-3 py-1 rounded-md">
                  {active.tag}
                </div>
              </div>

              {/* Details side */}
              <div className="p-6 md:p-8 flex flex-col justify-between">
                <div>
                  <p className="text-[#D6A146] text-xs font-semibold uppercase tracking-wider mb-1 font-btn">
                    {active.subtitle || active.tag}
                  </p>
                  <h3
                    onClick={() => onNavigate('combos', undefined, active.id)}
                    className="font-heading text-2xl text-white font-bold mb-2 cursor-pointer hover:text-[#D6A146] transition-colors"
                  >
                    {active.title}
                  </h3>
                  <p className="text-xs text-white/70 line-clamp-2 mb-4 font-body">
                    {active.description}
                  </p>

                  <div className="bg-black/20 rounded-xl p-3 border border-white/10 mb-6">
                    <p className="text-[11px] font-bold text-[#D6A146] uppercase tracking-wider mb-2 flex items-center gap-1">
                      <Package className="w-3.5 h-3.5" />
                      <span>Every Masala Included:</span>
                    </p>
                    <ul className="space-y-1.5">
                      {active.items.map((item, idx) => (
                        <li key={idx} className="flex items-center justify-between text-xs text-white/80">
                          <span className="flex items-center gap-1.5 truncate">
                            <Check className="w-3 h-3 text-[#D6A146] shrink-0" />
                            <span className="truncate">{item.product.name}</span>
                          </span>
                          <span className="text-[10px] text-white/50 bg-white/10 px-2 py-0.5 rounded shrink-0 ml-2">
                            {item.weight}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div>
                  <div className="flex items-baseline justify-between mb-4">
                    <div>
                      <span className="text-3xl font-bold text-white">₹{comboPrice}</span>
                      <span className="text-white/40 line-through text-base ml-2">₹{originalTotal}</span>
                    </div>
                    <span className="text-[#D6A146] text-xs font-semibold bg-[#D6A146]/15 px-2.5 py-1 rounded-lg">
                      Save ₹{savings}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => addComboToCart(active)}
                      className="w-full bg-[#D6A146] hover:bg-[#E8BF73] text-[#1D1D1D] font-bold text-xs sm:text-sm py-3 rounded-xl transition-all shadow-md font-btn"
                    >
                      Add Bundle to Cart
                    </button>
                    <button
                      onClick={() => onNavigate('combos', undefined, active.id)}
                      className="w-full bg-white/10 hover:bg-white/20 text-white font-semibold text-xs sm:text-sm py-3 rounded-xl transition-all border border-white/20 flex items-center justify-center gap-1 font-btn"
                    >
                      <span>Check Details</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Combo selector list */}
          <div className="flex flex-col gap-3">
            {COMBOS.slice(0, 4).map((combo, i) => {
              const isActive = i === activeIndex;
              const original = combo.items.reduce((s, it) => s + it.product.price, 0);
              const price = Math.round(original * (1 - combo.discountPercent / 100));
              const comboSavings = original - price;

              return (
                <button
                  key={combo.id}
                  onClick={() => setActiveIndex(i)}
                  className={`flex items-center gap-4 p-3.5 rounded-2xl border text-left transition-all ${
                    isActive
                      ? 'bg-[#D6A146]/15 border-[#D6A146] ring-1 ring-[#D6A146]/30'
                      : 'bg-[#284C38]/50 border-white/10 hover:border-[#D6A146]/30 hover:bg-[#284C38]'
                  }`}
                >
                  <div className="w-14 h-14 rounded-xl overflow-hidden shrink-0 border border-white/10">
                    <img
                      src={combo.image}
                      alt={combo.title}
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`text-xs sm:text-sm font-semibold truncate ${isActive ? 'text-[#D6A146]' : 'text-white'}`}>
                      {combo.title}
                    </p>
                    <p className="text-[11px] text-white/50 truncate mt-0.5">
                      {combo.items.length} spices · Save ₹{comboSavings}
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-white font-bold text-xs sm:text-sm">₹{price}</p>
                    <p className="text-white/40 line-through text-[10px]">₹{original}</p>
                  </div>
                </button>
              );
            })}

            <button
              onClick={() => onNavigate('combos')}
              className="mt-1 flex items-center justify-center gap-2 text-[#D6A146] text-xs font-semibold py-2.5 hover:underline"
            >
              <span>Explore all {COMBOS.length} Super Saver Combos</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
