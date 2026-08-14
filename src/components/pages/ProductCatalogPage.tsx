import React, { useState, useMemo } from "react";
import Link from "next/link";
import { PRODUCTS, CATEGORIES } from "../../data/mockData";
import { Product } from "../../types";
import {
  Search,
  Flame,
  Sparkles,
  X,
  ArrowUpDown,
  ShoppingBag,
  Check,
  Plus,
  Percent,
} from "lucide-react";

interface ProductCatalogPageProps {
  selectedCategoryFilter?: string;
  onSelectProduct?: (product: Product) => void;
  onAddToCart?: (product: Product, weight?: string, qty?: number) => void;
}

export const ProductCatalogPage: React.FC<ProductCatalogPageProps> = ({
  selectedCategoryFilter,
  onAddToCart,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [addedMap, setAddedMap] = useState<{ [key: string]: boolean }>({});
  const [activeCategory, setActiveCategory] = useState<string>(
    selectedCategoryFilter || "All",
  );
  const [selectedWeight] = useState<string>("All");
  const [maxHeat] = useState<number>(5);
  const [sortBy, setSortBy] = useState<"featured" | "name" | "heat">(
    "featured",
  );
  const [sortOpen, setSortOpen] = useState(false);

  React.useEffect(() => {
    setActiveCategory(selectedCategoryFilter || "All");
  }, [selectedCategoryFilter]);

  const handleQuickAdd = (product: Product, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (onAddToCart) {
      onAddToCart(product);
      setAddedMap((prev) => ({ ...prev, [product.id]: true }));
      setTimeout(() => {
        setAddedMap((prev) => ({ ...prev, [product.id]: false }));
      }, 1500);
    }
  };

  const filteredProducts = useMemo(() => {
    return PRODUCTS.filter((product) => {
      const matchesCategory =
        activeCategory === "All" || product.category === activeCategory;
      const matchesSearch =
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.shortDescription
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        product.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.ingredients.some((ing) =>
          ing.toLowerCase().includes(searchTerm.toLowerCase()),
        );
      const matchesWeight =
        selectedWeight === "All" ||
        product.weightOptions.includes(selectedWeight);
      const matchesHeat = product.spicinessLevel <= maxHeat;
      return matchesCategory && matchesSearch && matchesWeight && matchesHeat;
    }).sort((a, b) => {
      if (sortBy === "name") return a.name.localeCompare(b.name);
      if (sortBy === "heat") return b.spicinessLevel - a.spicinessLevel;
      return (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0);
    });
  }, [activeCategory, searchTerm, selectedWeight, maxHeat, sortBy]);

  const SORT_LABELS: Record<typeof sortBy, string> = {
    featured: "Featured First",
    name: "A – Z",
    heat: "Spiciest First",
  };

  return (
    <div className="pt-24 sm:pt-24 pb-20 bg-[#F7F5EF] min-h-screen text-left">
      {/* Banner */}
      <div className="bg-[#1E3A2B] text-white py-10 sm:py-16 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="max-w-7xl mx-auto relative z-10 text-center max-w-3xl">
          
          <h1 className="font-heading text-3xl sm:text-5xl font-bold">
            Our Authentic Spice Range
          </h1>
          <p className="font-body text-white/80 mt-2 text-sm sm:text-base font-light px-2">
            Discover our handcrafted masalas, turmeric, red chilli, and
            specialty regional blends.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 mt-4 sm:mt-8">
        {/* Sticky Search & Filter Bar */}
        <div className="sticky top-0 sm:top-20 z-30 -mx-3 sm:mx-0 px-3 sm:px-0 pt-3 sm:pt-0 pb-2 sm:pb-0 bg-[#F7F5EF]/95 backdrop-blur-md sm:bg-transparent sm:backdrop-blur-none">
          <div className="bg-white rounded-2xl p-3 sm:p-6 shadow-md border border-[#D6A146]/20 mb-4 sm:mb-8 space-y-3 sm:space-y-4">
            {/* Search + Sort row */}
            <div className="flex flex-row gap-2 sm:gap-4 items-center justify-between">
              <div className="relative flex-1 sm:w-96">
                <Search className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 absolute left-3 sm:left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search spices, masalas..."
                  className="w-full bg-[#F7F5EF] pl-9 sm:pl-10 pr-9 sm:pr-10 py-2.5 sm:py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-[#284C38] text-xs sm:text-sm font-body"
                />
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm("")}
                    className="absolute right-2.5 sm:right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer"
                    aria-label="Clear search"
                  >
                    <X className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  </button>
                )}
              </div>

              {/* Sort - compact icon dropdown on mobile, labeled select on desktop */}
              <div className="relative shrink-0">
                <button
                  onClick={() => setSortOpen((o) => !o)}
                  className="sm:hidden flex items-center justify-center w-10 h-10 rounded-xl border border-gray-200 bg-[#F7F5EF] text-[#284C38] cursor-pointer"
                  aria-label="Sort options"
                >
                  <ArrowUpDown className="w-4 h-4" />
                </button>
                {sortOpen && (
                  <div className="sm:hidden absolute right-0 mt-2 w-44 bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden z-40">
                    {(Object.keys(SORT_LABELS) as Array<typeof sortBy>).map(
                      (key) => (
                        <button
                          key={key}
                          onClick={() => {
                            setSortBy(key);
                            setSortOpen(false);
                          }}
                          className={`w-full text-left px-4 py-2.5 text-xs font-body cursor-pointer ${sortBy === key ? "bg-[#284C38]/10 text-[#284C38] font-semibold" : "text-gray-700"}`}
                        >
                          {SORT_LABELS[key]}
                        </button>
                      ),
                    )}
                  </div>
                )}
                <div className="hidden sm:flex items-center gap-2 text-gray-600 font-body">
                  <ArrowUpDown className="w-4 h-4 text-[#284C38]" />
                  <span className="text-xs font-semibold font-btn">Sort:</span>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as any)}
                    className="bg-[#F7F5EF] border border-gray-200 rounded-lg px-3 py-2 text-xs font-body font-medium text-[#1D1D1D] focus:outline-none focus:border-[#284C38] cursor-pointer"
                  >
                    <option value="featured">Featured First</option>
                    <option value="name">Alphabetical (A-Z)</option>
                    <option value="heat">Spiciness Level (High to Low)</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Category Pill Buttons */}
            <div className="pt-2 border-t border-gray-100 flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none -mx-1 px-1">
              <button
                onClick={() => setActiveCategory("All")}
                className={`px-3.5 sm:px-4 py-1.5 sm:py-2 rounded-full text-[11px] sm:text-xs font-semibold font-btn transition-colors shrink-0 cursor-pointer whitespace-nowrap ${
                  activeCategory === "All"
                    ? "bg-[#284C38] text-[#D6A146] shadow-sm"
                    : "bg-[#F7F5EF] text-gray-700 hover:bg-[#284C38]/10"
                }`}
              >
                All ({PRODUCTS.length})
              </button>
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.name)}
                  className={`px-3.5 sm:px-4 py-1.5 sm:py-2 rounded-full text-[11px] sm:text-xs font-semibold font-btn transition-colors shrink-0 cursor-pointer whitespace-nowrap ${
                    activeCategory === cat.name
                      ? "bg-[#284C38] text-[#D6A146] shadow-sm"
                      : "bg-[#F7F5EF] text-gray-700 hover:bg-[#284C38]/10"
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Results Counter */}
        <div className="mb-3 sm:mb-6 flex items-center justify-between text-xs sm:text-sm font-body text-gray-600">
          <div>
            <strong className="text-[#284C38] font-bold">
              {filteredProducts.length}
            </strong>{" "}
            products
            {activeCategory !== "All" && (
              <span className="hidden sm:inline">
                {" "}
                in "
                <span className="text-[#284C38] font-semibold">
                  {activeCategory}
                </span>
                "
              </span>
            )}
          </div>
          {(activeCategory !== "All" || searchTerm) && (
            <button
              onClick={() => {
                setActiveCategory("All");
                setSearchTerm("");
              }}
              className="text-[11px] sm:text-xs text-[#C86D39] hover:underline font-btn font-semibold cursor-pointer"
            >
              Reset Filters
            </button>
          )}
        </div>

        {/* Product Cards Grid */}
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2 gap-y-4 sm:gap-5 lg:gap-6">
            {filteredProducts.map((product) => {
              const discount =
                product.originalPrice > product.price
                  ? Math.round(
                      (1 - product.price / product.originalPrice) * 100,
                    )
                  : 0;

              return (
                <Link
                  key={product.id}
                  href={`/products/${product.id}`}
                  className="bg-white rounded-lg md:rounded-xl lg:rounded-xl overflow-visible border border-[#F2DCBC] hover:shadow-2xl transition-all duration-300 flex flex-col group transform hover:-translate-y-1 sm:hover:-translate-y-2 text-left block"
                >
                  {/* Image Container */}
                  <div className="relative">
                    <div className="relative aspect-6/5 bg-[#1E3A2B] overflow-hidden rounded-t-lg sm:rounded-t-xl">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        referrerPolicy="no-referrer"
                      />

                      {/* Bestseller Badge */}
                      {product.isFeatured && (
                        <div className="absolute top-2 left-2 sm:top-3 sm:left-3 bg-[#D6A146] text-[#1E3A2B] text-[9px] sm:text-[10px] px-2 py-0.5 sm:py-1 rounded-full uppercase tracking-wide">
                          Bestseller
                        </div>
                      )}

                      {/* Discount Badge */}
                      {discount > 0 && (
                        <div className="absolute top-2 right-2 sm:top-3 sm:right-3 bg-[#284C38] text-white text-[9px] sm:text-[10px] px-2 py-0.5 sm:py-1 rounded-full flex items-center gap-0.5">
                          {discount}
                          <Percent className="w-2.5 h-2.5" />
                          OFF
                        </div>
                      )}

                      {/* Heat Level */}
                      {/* <div className="absolute bottom-2 left-2 sm:bottom-3 sm:left-3 bg-[#1D1D1D]/80 backdrop-blur-md text-white text-[9px] sm:text-[11px] px-2 py-0.5 sm:py-1 rounded-full flex items-center gap-1 font-body">
                        <Flame className="w-2.5 h-2.5 sm:w-3.5 sm:h-3.5 text-[#C86D39]" />
                        <span>{product.spicinessLevel}/5</span>
                      </div> */}
                    </div>

                    {/* Floating Quick-Add Button, overlapping image edge */}
                    <button
                      onClick={(e) => handleQuickAdd(product, e)}
                      aria-label={
                        addedMap[product.id] ? "Added to cart" : "Add to cart"
                      }
                      className={`absolute -bottom-4 right-2.5 sm:-bottom-5 sm:right-4 w-9 h-9 sm:w-11 sm:h-11 rounded-full shadow-lg border-2 flex items-center justify-center cursor-pointer transition-all duration-300 z-10 ${
                        addedMap[product.id]
                          ? "bg-[#284C38] border-[#284C38]"
                          : "bg-white border-[#284C38] hover:bg-[#284C38]"
                      }`}
                    >
                      {addedMap[product.id] ? (
                        <Check className="w-4 h-4 sm:w-5 sm:h-5 text-[#D6A146]" />
                      ) : (
                        <Plus
                          className="w-4 h-4 sm:w-5 sm:h-5 text-[#284C38] group-hover:text-[#284C38] hover:!text-[#D6A146]"
                          strokeWidth={2.5}
                        />
                      )}
                    </button>
                  </div>

                  {/* Content */}
                  <div className="p-3 pt-1 sm:p-3 sm:pt-3 flex-1 flex flex-col justify-between">
                    <div>
                      <span className="text-[9px] sm:text-[11px] text-[#284C38] uppercase tracking-wider font-semibold font-btn">
                        {product.category}
                      </span>
                      <h3 className=" text-sm md:text-md lg:text-[16px] font-semibold text-gray-800 group-hover:text-[#284C38] transition-colors mt-0.5 sm:mt-1 break-words line-clamp-2 leading-snug">
                        {product.name}
                      </h3>
                      {/* <p className="hidden sm:block font-body text-xs text-gray-600 mt-2 font-light line-clamp-2 leading-relaxed">
                        {product.shortDescription}
                      </p> */}
                    </div>

                    <div className="mt-1 sm:mt-2 pt-1 sm:pt-2 border-t border-gray-100 space-y-1">
                      <div className="text-[9px] sm:text-[11px] text-gray-500 font-body truncate">
                        {product.defaultWeight} ·{" "}
                        {product.weightOptions.length > 1
                          ? `${product.weightOptions.length} sizes`
                          : product.weightOptions[0]}
                      </div>
                      <div className="flex items-baseline gap-1.5 flex-wrap">
                        <span className="font-bold text-[#284C38] text-sm sm:text-lg">
                          ₹{product.price}
                        </span>
                        {product.originalPrice > product.price && (
                          <span className="text-gray-400 line-through text-[10px] sm:text-xs font-normal">
                            ₹{product.originalPrice}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        ) : (
          <div className="bg-white rounded-3xl p-8 sm:p-12 text-center border border-gray-200 shadow-sm max-w-md mx-auto my-8 sm:my-12 space-y-3 sm:space-y-4">
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-[#F7F5EF] text-[#284C38] flex items-center justify-center mx-auto">
              <Search className="w-7 h-7 sm:w-8 sm:h-8 text-gray-400" />
            </div>
            <h3 className="font-heading text-xl sm:text-2xl font-bold text-[#1D1D1D]">
              No Spices Found
            </h3>
            <p className="font-body text-xs sm:text-sm text-gray-600 font-light">
              We couldn't find any products matching your search query. Try
              resetting filters or searching for another term like "Turmeric" or
              "Sambhar".
            </p>
            <button
              onClick={() => {
                setActiveCategory("All");
                setSearchTerm("");
              }}
              className="bg-[#284C38] text-white text-xs font-semibold px-6 py-3 rounded-full font-btn shadow-md cursor-pointer"
            >
              Reset Search Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
