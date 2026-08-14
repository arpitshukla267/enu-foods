import React, { useState } from 'react';
import { PRODUCTS } from '../../data/mockData';
import { Product, NavigationPage } from '../../types';
import { Tag, ArrowRight, Check } from 'lucide-react';

interface SuperSaverCombosProps {
  onNavigate: (page: NavigationPage) => void;
  onAddComboToCart?: (product: Product, weight?: string, qty?: number) => void;
}

interface ComboDeal {
  id: string;
  title: string;
  tagline: string;
  image: string;
  items: Product[];
  comboPrice: number;
  originalPrice: number;
}

const buildCombos = (products: Product[], groupSize = 3, discountPct = 0.15): ComboDeal[] => {
  const taglines = [
    'Daily kitchen essentials',
    'South Indian classics',
    'North Indian favourites',
    'Festive feast pack',
    'Beginner chef starter',
    'Family value bundle',
  ];

  const combos: ComboDeal[] = [];
  for (let i = 0; i + groupSize <= products.length && combos.length < 4; i += groupSize) {
    const items = products.slice(i, i + groupSize);
    const originalPrice = items.reduce((sum, p) => sum + p.price, 0);
    const comboPrice = Math.round(originalPrice * (1 - discountPct));
    combos.push({
      id: `combo-${items.map(p => p.id).join('-')}`,
      title: items[0]?.category ? `${items[0].category} Bundle` : 'Kitchen Bundle',
      tagline: taglines[combos.length] || 'Curated for you',
      image: items[0].image,
      items,
      comboPrice,
      originalPrice,
    });
  }
  return combos;
};

export const SuperSaverCombos: React.FC<SuperSaverCombosProps> = ({ onNavigate, onAddComboToCart }) => {
  const combos = React.useMemo(() => buildCombos(PRODUCTS), []);
  const [activeIndex, setActiveIndex] = useState(0);

  const active = combos[activeIndex];
  if (!active) return null;

  const savings = active.originalPrice - active.comboPrice;
  const savingsPct = Math.round((savings / active.originalPrice) * 100);

  const addComboToCart = (combo: ComboDeal) => {
    combo.items.forEach((item) => onAddComboToCart?.(item, item.defaultWeight));
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
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-10 lg:mb-14">
          <div>
           
            <h2 className="text-3xl sm:text-4xl lg:text-[2.75rem] text-white font-semibold leading-tight">
              Super Saver Combos
            </h2>
            <p className="text-white/50 text-sm mt-2 max-w-md">
              Hand-picked spice sets at 15% off — everything your kitchen needs in one order.
            </p>
          </div>

          <button
            onClick={() => onNavigate('combos')}
            className="hidden sm:inline-flex items-center gap-2 text-[#D6A146] text-sm font-semibold hover:gap-3 transition-all"
          >
            View all combos <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Main layout: featured + selector */}
        <div className="grid lg:grid-cols-[1fr_340px] gap-6 lg:gap-8">
          {/* Featured combo card */}
          <div className="relative bg-[#284C38] rounded-2xl overflow-hidden border border-[#D6A146]/20">
            <div className="grid md:grid-cols-2">
              {/* Image side */}
              <div className="relative h-56 md:h-auto md:min-h-[320px]">
                <img
                  src={active.image}
                  alt={active.title}
                  className="absolute inset-0 w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
                {/* <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-[#284C38] via-[#284C38]/40 to-transparent" /> */}

                {/* Savings stamp */}
                <div className="absolute top-4 left-4 w-16 h-16 rounded-full border-2 border-dashed border-[#D6A146] flex flex-col items-center justify-center bg-[#1E3A2B]/90 rotate-[-12deg]">
                  <span className="text-[#D6A146] text-[10px] font-bold uppercase leading-none">Save</span>
                  <span className="text-white text-lg font-bold leading-none">{savingsPct}%</span>
                </div>
              </div>

              {/* Details side */}
              <div className="p-6 md:p-8 flex flex-col justify-between">
                <div>
                  <p className="text-[#D6A146] text-xs font-semibold uppercase tracking-wider mb-1">
                    {active.tagline}
                  </p>
                  <h3 className="font-heading text-2xl text-white font-bold mb-4">
                    {active.title}
                  </h3>

                  <ul className="space-y-2 mb-6">
                    {active.items.map((item) => (
                      <li key={item.id} className="flex items-center gap-2 text-sm text-white/70">
                        <Check className="w-3.5 h-3.5 text-[#D6A146] shrink-0" />
                        <span>{item.name}</span>
                        <span className="text-white/30 text-xs ml-auto">₹{item.price}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <div className="flex items-baseline gap-3 mb-4">
                    <span className="text-3xl font-bold text-white">₹{active.comboPrice}</span>
                    <span className="text-white/40 line-through text-lg">₹{active.originalPrice}</span>
                    <span className="text-[#D6A146] text-xs font-semibold bg-[#D6A146]/15 px-2 py-0.5 rounded">
                      You save ₹{savings}
                    </span>
                  </div>

                  <button
                    onClick={() => addComboToCart(active)}
                    className="w-full bg-[#D6A146] hover:bg-[#E8BF73] text-[#1D1D1D] font-bold text-sm py-3.5 rounded-xl transition-colors"
                  >
                    Add Bundle to Cart — ₹{active.comboPrice}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Combo selector list */}
          <div className="flex flex-col gap-3">
            {combos.map((combo, i) => {
              const isActive = i === activeIndex;
              const comboSavings = combo.originalPrice - combo.comboPrice;

              return (
                <button
                  key={combo.id}
                  onClick={() => setActiveIndex(i)}
                  className={`flex items-center gap-4 p-4 rounded-xl border text-left transition-all ${
                    isActive
                      ? 'bg-[#D6A146]/10 border-[#D6A146]/50 ring-1 ring-[#D6A146]/30'
                      : 'bg-[#284C38]/50 border-white/10 hover:border-[#D6A146]/30 hover:bg-[#284C38]'
                  }`}
                >
                  <div className="w-14 h-14 rounded-lg overflow-hidden shrink-0 border border-white/10">
                    <img
                      src={combo.image}
                      alt={combo.title}
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm font-semibold truncate ${isActive ? 'text-[#D6A146]' : 'text-white'}`}>
                      {combo.title}
                    </p>
                    <p className="text-xs text-white/40 truncate mt-0.5">
                      {combo.items.length} items · Save ₹{comboSavings}
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-white font-bold text-sm">₹{combo.comboPrice}</p>
                    <p className="text-white/30 line-through text-[10px]">₹{combo.originalPrice}</p>
                  </div>
                </button>
              );
            })}

            <button
              onClick={() => onNavigate('combos')}
              className="sm:hidden mt-2 flex items-center justify-center gap-2 text-[#D6A146] text-sm font-semibold py-3"
            >
              View all combos <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
