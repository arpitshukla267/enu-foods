import React, { useState, useMemo } from "react";
import { PRODUCTS } from "../../data/mockData";
import { Product, NavigationPage } from "../../types";
import {
  Flame,
  Star,
  Award,
  CheckCircle2,
  ShoppingBag,
  Sparkles,
  ShieldCheck,
  Search,
} from "lucide-react";
import { WeightDropdown } from "../ui/WeightDropdown";

interface BestsellersPageProps {
  onNavigate: (page: NavigationPage) => void;
  onSelectProduct?: (product: Product) => void;
  onAddToCart?: (product: Product, weight?: string, qty?: number) => void;
}

export const BestsellersPage: React.FC<BestsellersPageProps> = ({
  onNavigate,
  onSelectProduct,
  onAddToCart,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedWeight, setSelectedWeight] = useState<{ [key: string]: string }>({});
  const [addedProductId, setAddedProductId] = useState<string | null>(null);

  // Ranked bestseller list from PRODUCTS
  const bestsellers = useMemo(() => {
    // Featured / high-demand products prioritized
    const priorityIds = [
      "enu-sambhar-masala",
      "enu-garam-masala",
      "enu-ginger-garlic-paste",
      "enu-kitchen-king",
      "enu-turmeric-powder",
      "enu-biryani-masala",
      "enu-coriander-powder",
      "enu-red-chilli-powder",
      "enu-paneer-masala",
      "enu-pav-bhaji-masala",
    ];

    const sorted = [...PRODUCTS].sort((a, b) => {
      const idxA = priorityIds.indexOf(a.id);
      const idxB = priorityIds.indexOf(b.id);
      if (idxA !== -1 && idxB !== -1) return idxA - idxB;
      if (idxA !== -1) return -1;
      if (idxB !== -1) return 1;
      return 0;
    });

    return sorted;
  }, []);

  const filteredProducts = useMemo(() => {
    return bestsellers.filter((product) => {
      const matchesCategory =
        selectedCategory === "All" ||
        product.category.toLowerCase().includes(selectedCategory.toLowerCase());
      const matchesSearch =
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.shortDescription.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [bestsellers, selectedCategory, searchQuery]);

  const handleCardClick = (product: Product) => {
    if (onSelectProduct) {
      onSelectProduct(product);
    } else {
      onNavigate("product-detail");
    }
  };

  const handleAdd = (e: React.MouseEvent, product: Product) => {
    e.stopPropagation();
    const weight = selectedWeight[product.id] || product.defaultWeight;
    if (onAddToCart) {
      onAddToCart(product, weight, 1);
      setAddedProductId(product.id);
      setTimeout(() => setAddedProductId(null), 1800);
    }
  };

  return (
    <div className="min-h-screen bg-[#F7F5EF] pt-32 pb-20 text-left">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        {/* Hero Banner */}
        {/* <div className="relative bg-[#1E3A2B] text-white rounded-2xl sm:rounded-3xl overflow-hidden shadow-xl p-5 sm:p-8 mb-6 border border-[#D6A146]/30">
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#D6A146]/10 rounded-full blur-2xl pointer-events-none" />
          <div className="relative z-10 max-w-2xl">
            <div className="inline-flex items-center gap-1.5 bg-[#D6A146]/20 border border-[#D6A146]/40 text-[#D6A146] text-[10px] sm:text-xs font-semibold px-2.5 py-0.5 rounded-full uppercase tracking-wider mb-2 font-btn">
              <Award className="w-3.5 h-3.5" />
              <span>Customer Favorites</span>
            </div>

            <h1 className="font-heading text-2xl sm:text-3xl lg:text-4xl font-bold leading-tight mb-2 text-white">
              Our <span className="text-[#D6A146]">Bestseller</span> Collection
            </h1>

            <p className="font-body text-gray-300 text-xs sm:text-sm leading-relaxed">
              Loved by thousands of home cooks and executive chefs. 100% cold-ground pure spices with maximum aroma and volatile essential oils.
            </p>
          </div>
        </div> */}

        {/* Filter & Search Strip */}
        <div className="bg-white rounded-xl sm:rounded-2xl border border-[#D6A146]/20 shadow-xs p-3 sm:p-4 mb-6 space-y-3">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search bestselling spices..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#F7F5EF] border border-gray-200 focus:border-[#D6A146] focus:bg-white rounded-xl py-2 pl-9 pr-4 text-xs sm:text-sm outline-none transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-gray-400 hover:text-gray-600 bg-gray-200 rounded-full w-4 h-4 flex items-center justify-center"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Category Tabs */}
            <div className="flex items-center gap-1 overflow-x-auto pb-0.5 sm:pb-0 scrollbar-none">
              {[
                { id: "All", label: "All Bestsellers" },
                { id: "blended", label: "Blended Masalas" },
                { id: "pure", label: "Pure Spices" },
                { id: "pastes", label: "Pastes & Herbs" },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setSelectedCategory(tab.id)}
                  className={`px-3 py-1.5 text-[11px] sm:text-xs font-semibold rounded-lg transition-colors shrink-0 ${
                    selectedCategory === tab.id
                      ? "bg-[#284C38] text-white shadow-xs"
                      : "bg-[#F7F5EF] text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Results Header */}
        <div className="flex items-center justify-between mb-4 px-1">
          <p className="text-xs sm:text-sm text-gray-600">
            Showing <strong className="text-[#1D1D1D] font-semibold">{filteredProducts.length}</strong> bestsellers
          </p>
        </div>

        {/* Compact Responsive Grid: 2 cols on mobile, 3 on tab, 4-5 on desktop */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4 lg:gap-5">
          {filteredProducts.map((product, idx) => {
            const weight = selectedWeight[product.id] || product.defaultWeight;
            const isJustAdded = addedProductId === product.id;
            const discount =
              product.originalPrice > product.price
                ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
                : 0;

            return (
              <div
                key={product.id}
                onClick={() => handleCardClick(product)}
                className="group bg-white rounded-xl sm:rounded-2xl overflow-hidden border border-[#D6A146]/20 shadow-xs hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between cursor-pointer text-left"
              >
                <div>
                  {/* Image Container - Compact */}
                  <div className="relative h-32 sm:h-36 md:h-40 overflow-hidden bg-white">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      referrerPolicy="no-referrer"
                      loading="lazy"
                    />



                    {/* Discount Badge */}
                    {discount > 0 && (
                      <div className="absolute top-2 right-2 bg-[#C86D39] text-white text-[9px] sm:text-[10px] font-bold px-1.5 py-0.5 rounded shadow-xs">
                        {discount}% OFF
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="p-2.5 sm:p-3 space-y-2">
                    <div>
                      <h3 className="text-[#1D1D1D] font-bold text-xs sm:text-sm leading-snug line-clamp-1 group-hover:text-[#284C38] transition-colors">
                        {product.name}
                      </h3>
                      <p className="text-[10px] sm:text-xs text-gray-500 line-clamp-1 mt-0.5">
                        {product.shortDescription}
                      </p>
                    </div>

                    {/* Price & Weight */}
                    <div className="flex items-center justify-between pt-1">
                      <div className="flex items-baseline gap-1.5">
                        <span className="text-[#1F5136] font-bold text-sm sm:text-base">
                          ₹{product.price}
                        </span>
                        {product.originalPrice > product.price && (
                          <span className="text-gray-400 line-through text-[10px] sm:text-xs">
                            ₹{product.originalPrice}
                          </span>
                        )}
                      </div>
                      <span className="text-[10px] text-gray-500 font-medium">
                        {product.defaultWeight}
                      </span>
                    </div>

                    {/* Weight Dropdown */}
                    <div onClick={(e) => e.stopPropagation()}>
                      <WeightDropdown
                        options={product.weightOptions}
                        value={weight}
                        onChange={(v) =>
                          setSelectedWeight((prev) => ({
                            ...prev,
                            [product.id]: v,
                          }))
                        }
                      />
                    </div>
                  </div>
                </div>

                {/* Add to Cart Button */}
                <div className="p-2.5 sm:p-3 pt-0">
                  <button
                    onClick={(e) => handleAdd(e, product)}
                    className={`w-full py-2 sm:py-2.5 px-2 rounded-xl text-[11px] sm:text-xs font-semibold flex items-center justify-center gap-1.5 shadow-xs transition-all active:scale-95 ${
                      isJustAdded
                        ? "bg-emerald-600 text-white"
                        : "bg-[#1F5136] hover:bg-[#183F2A] text-white"
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
                        <span>Add to Cart</span>
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
