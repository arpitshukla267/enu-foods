import React, { useState, useMemo } from "react";
import { PRODUCTS } from "../../data/mockData";
import { Product, NavigationPage } from "../../types";
import {
  Tag,
  ShoppingBag,
  Sparkles,
  ShieldCheck,
  Truck,
  Leaf,
  CheckCircle2,
  Package,
} from "lucide-react";

interface CombosPageProps {
  onNavigate: (page: NavigationPage) => void;
  onAddToCart?: (product: Product, weight?: string, qty?: number) => void;
}

export interface ComboItem {
  id: string;
  title: string;
  category: "daily" | "regional" | "feast" | "all-in-one";
  tag: string;
  badge?: string;
  description: string;
  image: string;
  items: {
    product: Product;
    weight: string;
  }[];
  discountPercent: number;
}

export const CombosPage: React.FC<CombosPageProps> = ({
  onNavigate,
  onAddToCart,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [addedComboId, setAddedComboId] = useState<string | null>(null);

  // Curated handcrafted combo bundles
  const comboDeals: ComboItem[] = useMemo(() => {
    const findProduct = (id: string) =>
      PRODUCTS.find((p) => p.id === id) || PRODUCTS[0];

    return [
      {
        id: "combo-south-indian",
        title: "South Indian Meal Kit",
        category: "regional",
        tag: "Regional Special",
        badge: "Bestseller",
        description:
          "Traditional slow-roasted Sambhar Masala paired with organic Turmeric and Byadgi Red Chilli Powder.",
        image:
          "https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?auto=format&fit=crop&w=800&q=80",
        items: [
          { product: findProduct("enu-sambhar-masala"), weight: "100g" },
          { product: findProduct("enu-turmeric-powder"), weight: "100g" },
          { product: findProduct("enu-red-chilli-powder"), weight: "100g" },
        ],
        discountPercent: 15,
      },
      {
        id: "combo-royal-gravy",
        title: "Royal North Indian Curry Kit",
        category: "feast",
        tag: "Chef's Special",
        badge: "High Savings",
        description:
          "Velvety restaurant-style Paneer Butter Masala, Shahi gravies, and fragrant tikkas.",
        image:
          "https://images.unsplash.com/photo-1565557623262-b51c2513a641?auto=format&fit=crop&w=800&q=80",
        items: [
          { product: findProduct("enu-paneer-masala"), weight: "100g" },
          { product: findProduct("enu-garam-masala"), weight: "100g" },
          { product: findProduct("enu-ginger-garlic-paste"), weight: "200g" },
          { product: findProduct("enu-kasuri-methi"), weight: "50g" },
        ],
        discountPercent: 18,
      },
      {
        id: "combo-daily-trio",
        title: "Everyday Foundation Trio",
        category: "daily",
        tag: "Daily Essentials",
        badge: "Must-Have",
        description:
          "Three fundamental pure spices essential for daily cooking: Haldi, Mirch, and Dhaniya.",
        image:
          "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=800&q=80",
        items: [
          { product: findProduct("enu-turmeric-powder"), weight: "100g" },
          { product: findProduct("enu-red-chilli-powder"), weight: "100g" },
          { product: findProduct("enu-coriander-powder"), weight: "100g" },
        ],
        discountPercent: 15,
      },
      {
        id: "combo-biryani-feast",
        title: "Shahi Biryani Feast Pack",
        category: "feast",
        tag: "Weekend Feast",
        badge: "Top Rated",
        description:
          "Aromatic royal star anise, mace, and whole cardamom blend for authentic dum biryani.",
        image:
          "https://images.unsplash.com/photo-1633945274405-b6c8069047b0?auto=format&fit=crop&w=800&q=80",
        items: [
          { product: findProduct("enu-biryani-masala"), weight: "100g" },
          { product: findProduct("enu-garam-masala"), weight: "100g" },
          { product: findProduct("enu-ginger-garlic-paste"), weight: "200g" },
          { product: findProduct("enu-kasuri-methi"), weight: "50g" },
        ],
        discountPercent: 20,
      },
      {
        id: "combo-street-food",
        title: "Mumbai Street Food Pack",
        category: "regional",
        tag: "Street Style",
        badge: "Flavor Burst",
        description:
          "Recreate authentic Chowpatty Pav Bhaji, spiced Tawa Pulao, and lip-smacking snack chaats.",
        image:
          "https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=800&q=80",
        items: [
          { product: findProduct("enu-pav-bhaji-masala"), weight: "100g" },
          { product: findProduct("enu-kitchen-king"), weight: "100g" },
          { product: findProduct("enu-red-chilli-powder"), weight: "100g" },
        ],
        discountPercent: 15,
      },
      {
        id: "combo-pure-essentials",
        title: "Pure Powder Quad Set",
        category: "daily",
        tag: "Purity Pack",
        badge: "Value Pack",
        description:
          "Essential cold-ground kitchen powders: Turmeric, Chilli, Coriander, and Kitchen King.",
        image:
          "https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&w=800&q=80",
        items: [
          { product: findProduct("enu-turmeric-powder"), weight: "100g" },
          { product: findProduct("enu-coriander-powder"), weight: "100g" },
          { product: findProduct("enu-red-chilli-powder"), weight: "100g" },
          { product: findProduct("enu-kitchen-king"), weight: "100g" },
        ],
        discountPercent: 16,
      },
      {
        id: "combo-aroma-masters",
        title: "Aromatic Finishing Duo",
        category: "daily",
        tag: "Finishing Touch",
        badge: "Chef Choice",
        description:
          "14-spice warming Garam Masala paired with crisp, shade-dried Nagauri Kasuri Methi.",
        image:
          "https://images.unsplash.com/photo-1599940824399-b87987ceb72a?auto=format&fit=crop&w=800&q=80",
        items: [
          { product: findProduct("enu-garam-masala"), weight: "100g" },
          { product: findProduct("enu-kasuri-methi"), weight: "50g" },
        ],
        discountPercent: 12,
      },
      {
        id: "combo-curry-starter",
        title: "Quick Weeknight Curry Duo",
        category: "daily",
        tag: "Quick Cooking",
        badge: "Time Saver",
        description:
          "All-purpose royal Kitchen King blend with 100% pure Himalayan Ginger Garlic Paste.",
        image:
          "https://images.unsplash.com/photo-1509358217973-883fe8a1e808?auto=format&fit=crop&w=800&q=80",
        items: [
          { product: findProduct("enu-kitchen-king"), weight: "100g" },
          { product: findProduct("enu-ginger-garlic-paste"), weight: "200g" },
        ],
        discountPercent: 14,
      },
      {
        id: "combo-punjabi-dhaba",
        title: "Punjabi Dhaba Master Set",
        category: "regional",
        tag: "Dhaba Style",
        badge: "Authentic",
        description:
          "Craft authentic Dhaba Chole, Dal Makhani, Kadai gravies, and spiced Tandoori dishes.",
        image:
          "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?auto=format&fit=crop&w=800&q=80",
        items: [
          { product: findProduct("enu-kitchen-king"), weight: "100g" },
          { product: findProduct("enu-garam-masala"), weight: "100g" },
          { product: findProduct("enu-kasuri-methi"), weight: "50g" },
        ],
        discountPercent: 15,
      },
      {
        id: "combo-ultimate-pantry",
        title: "Master Chef Grand Pantry",
        category: "all-in-one",
        tag: "Ultimate Value",
        badge: "Max Savings",
        description:
          "Complete six-blend gourmet collection to elevate every regional delicacy from Sambhar to Biryani.",
        image:
          "https://images.unsplash.com/photo-1532336414038-cf19250c5757?auto=format&fit=crop&w=800&q=80",
        items: [
          { product: findProduct("enu-sambhar-masala"), weight: "100g" },
          { product: findProduct("enu-kitchen-king"), weight: "100g" },
          { product: findProduct("enu-biryani-masala"), weight: "100g" },
          { product: findProduct("enu-paneer-masala"), weight: "100g" },
          { product: findProduct("enu-garam-masala"), weight: "100g" },
          { product: findProduct("enu-kasuri-methi"), weight: "50g" },
        ],
        discountPercent: 22,
      },
    ];
  }, []);

  const filteredCombos = useMemo(() => {
    if (selectedCategory === "All") return comboDeals;
    return comboDeals.filter((c) => c.category === selectedCategory);
  }, [selectedCategory, comboDeals]);

  const handleAddCombo = (combo: ComboItem) => {
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
    <div className="min-h-screen bg-[#F7F5EF] pt-32 pb-20 text-left">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        {/* Banner Section */}
        {/* <div className="relative bg-[#1E3A2B] text-white rounded-2xl sm:rounded-3xl overflow-hidden shadow-xl p-5 sm:p-8 mb-6 border border-[#D6A146]/30">
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#D6A146]/10 rounded-full blur-2xl pointer-events-none" />
          <div className="relative z-10 max-w-2xl">
            

            <h1 className="font-heading text-2xl sm:text-3xl lg:text-4xl font-bold leading-tight mb-2 text-white">
              Super Saver <span className="text-[#D6A146]">Spice Bundles</span>
            </h1>

            <p className="font-body text-gray-300 text-xs sm:text-sm leading-relaxed">
              Save up to 25% with chef-curated recipe combos. 100% cold-ground purity with zero synthetic preservatives.
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
                className="bg-white rounded-xl sm:rounded-2xl overflow-hidden border border-[#D6A146]/20 shadow-xs hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  {/* Top Image Container - Compact height */}
                  <div className="relative h-32 sm:h-36 md:h-40 overflow-hidden bg-[#1E3A2B]">
                    <img
                      src={combo.image}
                      alt={combo.title}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
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
                  </div>

                  {/* Body Content - Compact */}
                  <div className="p-2.5 sm:p-3 space-y-2">
                    <div>
                      <h3 className="font-heading text-xs sm:text-sm font-bold text-[#1D1D1D] leading-snug line-clamp-1 mb-0.5">
                        {combo.title}
                      </h3>
                      <p className="text-[10px] sm:text-xs text-gray-500 leading-tight line-clamp-1">
                        {combo.description}
                      </p>
                    </div>

                    {/* Included Items Summary Pill Box */}
                    <div className="bg-[#F7F5EF] rounded-lg p-2 border border-gray-200/70">
                      <p className="text-[9px] font-bold text-[#284C38] uppercase tracking-wider mb-1 flex items-center gap-1">
                        <Package className="w-3 h-3 text-[#D6A146]" />
                        <span>Includes {combo.items.length} Spices:</span>
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
                    onClick={() => handleAddCombo(combo)}
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
