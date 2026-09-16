import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Product } from "../../types";
import { useCategories } from "../../context/CategoryContext";
import { useInfiniteProducts } from "../../hooks/useInfiniteProducts";
import { ProductCard } from "../ui/ProductCard";
import { ProductCardSkeleton } from "../ui/ProductCardSkeleton";
import { ProductMobileBottomBar } from "../products/ProductMobileBottomBar";
import {
  ProductMobileSheets,
  MobileSheet,
} from "../products/ProductMobileSheets";
import {
  buildProductsUrl,
  countActiveFilters,
  parseProductCatalogQuery,
  ProductCatalogQuery,
  SORT_LABELS,
  SortOption,
} from "../../lib/productCatalogUrl";
import {
  Search,
  X,
  ArrowUpDown,
  Loader2,
  AlertCircle,
  RefreshCw,
} from "lucide-react";

interface ProductCatalogPageProps {
  onAddToCart?: (product: Product, weight?: string, qty?: number) => void;
}

export const ProductCatalogPage: React.FC<ProductCatalogPageProps> = ({
  onAddToCart,
}) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { categories, isLoading: categoriesLoading } = useCategories();
  const loadMoreRef = useRef<HTMLDivElement | null>(null);

  const catalogQuery = useMemo(
    () => parseProductCatalogQuery(searchParams),
    [searchParams],
  );

  const [searchTerm, setSearchTerm] = useState(catalogQuery.search);
  const [addedMap, setAddedMap] = useState<Record<string, boolean>>({});
  const [activeSheet, setActiveSheet] = useState<MobileSheet>(null);

  useEffect(() => {
    setSearchTerm(catalogQuery.search);
  }, [catalogQuery.search]);

  const replaceProductsQuery = useCallback(
    (updates: Partial<ProductCatalogQuery>) => {
      const nextUrl = buildProductsUrl({ ...catalogQuery, ...updates });
      const currentUrl =
        typeof window !== "undefined"
          ? `${window.location.pathname}${window.location.search}`
          : "";

      if (nextUrl === currentUrl) {
        return;
      }

      router.replace(nextUrl);
    },
    [router, catalogQuery],
  );

  useEffect(() => {
    const trimmed = searchTerm.trim();
    if (trimmed === catalogQuery.search) {
      return;
    }

    const timer = window.setTimeout(() => {
      replaceProductsQuery({ search: trimmed });
    }, 350);

    return () => window.clearTimeout(timer);
  }, [searchTerm, catalogQuery.search, replaceProductsQuery]);

  const {
    products,
    isInitialLoading,
    isFetchingNewQuery,
    isLoadingMore,
    hasNextPage,
    error,
    batchSize,
    loadMore,
    retry,
  } = useInfiniteProducts({
    search: catalogQuery.search,
    category: catalogQuery.category,
    subcategory: catalogQuery.subcategory,
    sort: catalogQuery.sort,
    minPrice: catalogQuery.minPrice,
    maxPrice: catalogQuery.maxPrice,
    isFeatured: catalogQuery.isFeatured,
    isBestSeller: catalogQuery.isBestSeller,
    isNewArrival: catalogQuery.isNewArrival,
  });

  useEffect(() => {
    const node = loadMoreRef.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          loadMore();
        }
      },
      { rootMargin: "240px" },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [loadMore, products.length]);

  const handleCategoryChange = (category: string) => {
    if (category === catalogQuery.category) return;
    replaceProductsQuery({ category, subcategory: undefined });
  };

  const handleQuickAdd = (
    product: Product,
    event: React.MouseEvent,
    weight?: string,
  ) => {
    event.preventDefault();
    event.stopPropagation();
    if (!onAddToCart) return;

    onAddToCart(product, weight || product.defaultWeight);
    setAddedMap((prev) => ({ ...prev, [product.id]: true }));
    window.setTimeout(() => {
      setAddedMap((prev) => ({ ...prev, [product.id]: false }));
    }, 1500);
  };

  const activeFilterCount = countActiveFilters(catalogQuery);
  const showInitialSkeletons = isInitialLoading && products.length === 0;
  const showEmptyState =
    !showInitialSkeletons && !isFetchingNewQuery && products.length === 0 && !error;
  const hasCategoryFilter = catalogQuery.category !== "All";
  const sortActive = catalogQuery.sort !== "newest";

  const clearFilterParams = () => {
    replaceProductsQuery({
      subcategory: undefined,
      minPrice: undefined,
      maxPrice: undefined,
      isFeatured: undefined,
      isBestSeller: undefined,
      isNewArrival: undefined,
    });
  };

  return (
    <div className="pt-24 sm:pt-24 pb-mobile-products sm:pb-20 bg-[#F7F5EF] min-h-screen text-left">
      <div className="bg-[#1E3A2B] text-white py-8 sm:py-16 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="max-w-7xl mx-auto relative z-10 text-center max-w-3xl">
          <h1 className="font-heading text-2xl sm:text-5xl font-bold">
            Our Authentic Spice Range
          </h1>
          <p className="font-body text-white/80 mt-2 text-sm sm:text-base font-light px-2">
            Discover handcrafted masalas loaded in efficient batches from our live catalog.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 mt-4 sm:mt-8">
        <div className="sm:sticky sm:top-20 z-20 -mx-3 sm:mx-0 px-3 sm:px-0 pt-2 sm:pt-0 pb-2 sm:pb-0 bg-[#F7F5EF] sm:bg-[#F7F5EF]/95 sm:backdrop-blur-md">
          <div className="hidden md:block bg-white rounded-2xl p-3 sm:p-6 shadow-md border border-[#D6A146]/20 mb-4 sm:mb-8 space-y-3 sm:space-y-4">
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

              <div className="hidden sm:flex items-center gap-2 text-gray-600 font-body shrink-0">
                <ArrowUpDown className="w-4 h-4 text-[#284C38]" />
                <span className="text-xs font-semibold font-btn">Sort:</span>
                <select
                  value={catalogQuery.sort}
                  onChange={(e) =>
                    replaceProductsQuery({ sort: e.target.value as SortOption })
                  }
                  className="bg-[#F7F5EF] border border-gray-200 rounded-lg px-3 py-2 text-xs font-body font-medium text-[#1D1D1D] focus:outline-none focus:border-[#284C38] cursor-pointer"
                >
                  {(Object.keys(SORT_LABELS) as SortOption[]).map((key) => (
                    <option key={key} value={key}>
                      {SORT_LABELS[key]}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="hidden sm:flex pt-2 border-t border-gray-100 items-center gap-2 overflow-x-auto pb-1 scrollbar-none -mx-1 px-1">
              <button
                onClick={() => handleCategoryChange("All")}
                className={`px-3.5 sm:px-4 py-1.5 sm:py-2 rounded-full text-[11px] sm:text-xs font-semibold font-btn transition-colors shrink-0 cursor-pointer whitespace-nowrap ${
                  catalogQuery.category === "All"
                    ? "bg-[#284C38] text-[#D6A146] shadow-sm"
                    : "bg-[#F7F5EF] text-gray-700 hover:bg-[#284C38]/10"
                }`}
              >
                All
              </button>
              {categoriesLoading ? (
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 text-[11px] text-gray-500">
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  Loading categories...
                </span>
              ) : (
                categories.map((cat) => {
                  const categoryValue = cat.slug || cat.id;
                  return (
                    <button
                      key={cat.id}
                      onClick={() => handleCategoryChange(categoryValue)}
                      className={`px-3.5 sm:px-4 py-1.5 sm:py-2 rounded-full text-[11px] sm:text-xs font-semibold font-btn transition-colors shrink-0 cursor-pointer whitespace-nowrap ${
                        catalogQuery.category === categoryValue
                          ? "bg-[#284C38] text-[#D6A146] shadow-sm"
                          : "bg-[#F7F5EF] text-gray-700 hover:bg-[#284C38]/10"
                      }`}
                    >
                      {cat.name}
                    </button>
                  );
                })
              )}
            </div>
          </div>
        </div>

        {error && (
          <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 flex items-center justify-between gap-3">
            <div className="flex items-start gap-2">
              <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
              <span>{error}</span>
            </div>
            <button
              onClick={retry}
              className="inline-flex items-center gap-1.5 text-xs font-bold"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Retry
            </button>
          </div>
        )}

        <div className="mb-3 sm:mb-6 flex items-center justify-between text-xs sm:text-sm font-body text-gray-600">
          <div className="flex items-center gap-2 min-w-0">
            {showInitialSkeletons ? (
              "Loading products..."
            ) : isFetchingNewQuery ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin text-[#284C38] shrink-0" />
                <span>Updating products...</span>
              </>
            ) : (
              <>
                <strong className="text-[#284C38] font-bold">{products.length}</strong>{" "}
                products loaded
                {hasNextPage ? " · scroll for more" : " · end of results"}
              </>
            )}
          </div>
          {(hasCategoryFilter ||
            catalogQuery.search ||
            activeFilterCount > 0 ||
            sortActive) && (
            <button
              onClick={() => {
                setSearchTerm("");
                router.replace("/products");
              }}
              className="text-[11px] sm:text-xs text-[#C86D39] hover:underline font-btn font-semibold cursor-pointer shrink-0 ml-2"
            >
              Reset Filters
            </button>
          )}
        </div>

        <div
          className={`relative grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2 gap-y-4 sm:gap-5 lg:gap-6 transition-opacity duration-200 ${
            isFetchingNewQuery && products.length > 0 ? "opacity-75" : "opacity-100"
          }`}
        >
          {showInitialSkeletons
            ? Array.from({ length: batchSize }).map((_, index) => (
                <ProductCardSkeleton key={`skeleton-${index}`} />
              ))
            : products.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  added={addedMap[product.id]}
                  onQuickAdd={onAddToCart ? handleQuickAdd : undefined}
                />
              ))}

          {isLoadingMore &&
            Array.from({ length: Math.min(4, batchSize) }).map((_, index) => (
              <ProductCardSkeleton key={`loading-more-${index}`} />
            ))}
        </div>

        {showEmptyState && (
          <div className="bg-white rounded-3xl p-8 sm:p-12 text-center border border-gray-200 shadow-sm max-w-md mx-auto my-8 sm:my-12 space-y-3 sm:space-y-4">
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-[#F7F5EF] text-[#284C38] flex items-center justify-center mx-auto">
              <Search className="w-7 h-7 sm:w-8 sm:h-8 text-gray-400" />
            </div>
            <h3 className="font-heading text-xl sm:text-2xl font-bold text-[#1D1D1D]">
              No Spices Found
            </h3>
            <p className="font-body text-xs sm:text-sm text-gray-600 font-light">
              Try adjusting your search or category filters.
            </p>
          </div>
        )}

        <div ref={loadMoreRef} className="h-10 sm:h-8" />

        {isLoadingMore && (
          <div className="flex justify-center py-4 text-sm text-[#736854]">
            <Loader2 className="w-5 h-5 animate-spin mr-2" />
            Loading more products...
          </div>
        )}
      </div>

      <ProductMobileBottomBar
        hasCategoryFilter={hasCategoryFilter}
        activeFilterCount={activeFilterCount}
        sortActive={sortActive}
        onOpenCategories={() => setActiveSheet("categories")}
        onOpenFilter={() => setActiveSheet("filter")}
        onOpenSort={() => setActiveSheet("sort")}
      />

      <ProductMobileSheets
        activeSheet={activeSheet}
        onClose={() => setActiveSheet(null)}
        query={catalogQuery}
        onApplyQuery={replaceProductsQuery}
        onClearFilters={clearFilterParams}
      />
    </div>
  );
};
