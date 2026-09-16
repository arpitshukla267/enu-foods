import React, { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Search,
  X,
  ArrowRight,
  Loader2,
  AlertCircle,
  RefreshCw,
} from "lucide-react";
import { Product, Recipe, NavigationPage } from "../../types";
import { useCategories } from "../../context/CategoryContext";
import {
  fetchProducts,
  mapListItemToProduct,
  ProductApiError,
} from "../../lib/productApi";
import { fetchRecipes, RecipeApiError } from "../../lib/recipeApi";
import { buildProductsUrl } from "../../lib/productCatalogUrl";

interface SearchOverlayModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectProduct?: (product: Product) => void;
  onSelectRecipe: (recipe: Recipe) => void;
  onNavigate: (page: NavigationPage, categorySlug?: string) => void;
}

const SUGGESTION_LIMIT = 8;
const DEBOUNCE_MS = 350;

const getProductBadge = (product: Product) => {
  if (product.isNewArrival) return "New";
  if (product.isBestSeller) return "Bestseller";
  if (product.isFeatured) return "Featured";
  return null;
};

export const SearchOverlayModal: React.FC<SearchOverlayModalProps> = ({
  isOpen,
  onClose,
  onSelectRecipe,
  onNavigate,
}) => {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const requestIdRef = useRef(0);
  const abortRef = useRef<AbortController | null>(null);

  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [matchedProducts, setMatchedProducts] = useState<Product[]>([]);
  const [matchedRecipes, setMatchedRecipes] = useState<Recipe[]>([]);
  const [isSearchingRecipes, setIsSearchingRecipes] = useState(false);
  const [totalMatches, setTotalMatches] = useState<number | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);
  const { categories } = useCategories();

  useEffect(() => {
    if (!isOpen) {
      setQuery("");
      setDebouncedQuery("");
      setMatchedProducts([]);
      setMatchedRecipes([]);
      setTotalMatches(null);
      setSearchError(null);
      setIsSearching(false);
      setIsSearchingRecipes(false);
      requestIdRef.current += 1;
      return;
    }

    inputRef.current?.focus();
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;

    const timer = window.setTimeout(() => {
      setDebouncedQuery(query.trim());
    }, DEBOUNCE_MS);

    return () => window.clearTimeout(timer);
  }, [query, isOpen]);

  useEffect(() => {
    if (!isOpen) return;

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [isOpen, onClose]);

  const runProductSearch = useCallback((searchTerm: string) => {
    abortRef.current?.abort();

    if (!searchTerm) {
      setMatchedProducts([]);
      setTotalMatches(null);
      setSearchError(null);
      setIsSearching(false);
      return;
    }

    const requestId = ++requestIdRef.current;
    const controller = new AbortController();
    abortRef.current = controller;

    setIsSearching(true);
    setSearchError(null);

    fetchProducts({ search: searchTerm, limit: SUGGESTION_LIMIT }, controller.signal)
      .then((data) => {
        if (requestId !== requestIdRef.current) return;
        setMatchedProducts(data.products.map(mapListItemToProduct));
        setTotalMatches(data.pagination.total ?? null);
      })
      .catch((fetchError) => {
        if (controller.signal.aborted) return;
        if (requestId !== requestIdRef.current) return;

        setMatchedProducts([]);
        setSearchError(
          fetchError instanceof ProductApiError
            ? fetchError.message
            : fetchError instanceof Error
              ? fetchError.message
              : "Search failed",
        );
      })
      .finally(() => {
        if (requestId !== requestIdRef.current) return;
        if (!controller.signal.aborted) {
          setIsSearching(false);
        }
      });
  }, []);

  useEffect(() => {
    if (!isOpen) return;

    runProductSearch(debouncedQuery);

    return () => {
      abortRef.current?.abort();
    };
  }, [debouncedQuery, isOpen, runProductSearch]);

  useEffect(() => {
    if (!isOpen || !debouncedQuery) {
      setMatchedRecipes([]);
      setIsSearchingRecipes(false);
      return;
    }

    const controller = new AbortController();
    setIsSearchingRecipes(true);

    fetchRecipes({ search: debouncedQuery, limit: 8 }, controller.signal)
      .then((recipes) => {
        if (!controller.signal.aborted) {
          setMatchedRecipes(recipes);
        }
      })
      .catch((fetchError) => {
        if (controller.signal.aborted) return;
        if (fetchError instanceof RecipeApiError) {
          setMatchedRecipes([]);
        }
      })
      .finally(() => {
        if (!controller.signal.aborted) {
          setIsSearchingRecipes(false);
        }
      });

    return () => {
      controller.abort();
    };
  }, [debouncedQuery, isOpen]);

  if (!isOpen) return null;

  const trimmedQuery = query.trim();
  const isQueryPending = trimmedQuery !== debouncedQuery;
  const showProductLoading = isSearching || isQueryPending;
  const showRecipeLoading = isSearchingRecipes || isQueryPending;

  const matchedCategories = trimmedQuery
    ? categories.filter(
        (category) =>
          category.name.toLowerCase().includes(trimmedQuery.toLowerCase()) ||
          category.slug.toLowerCase().includes(trimmedQuery.toLowerCase()),
      )
    : [];

  const submitSearch = (term?: string) => {
    const nextTerm = (term ?? query).trim();
    if (!nextTerm) return;

    onClose();
    router.push(
      buildProductsUrl({
        category: "All",
        search: nextTerm,
        sort: "newest",
      }),
    );
  };

  const hasProductSection =
    showProductLoading || matchedProducts.length > 0 || Boolean(searchError);
  const showNoMatches =
    trimmedQuery &&
    !showProductLoading &&
    !showRecipeLoading &&
    !searchError &&
    matchedProducts.length === 0 &&
    matchedRecipes.length === 0 &&
    matchedCategories.length === 0;

  return (
    <div
      className="fixed inset-0 z-[10050] flex items-start justify-center pt-20 px-4 bg-black/70 backdrop-blur-md animate-fadeIn text-left"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-3xl max-w-2xl w-full overflow-hidden shadow-2xl border border-[#D6A146]/40 relative max-h-[80vh] flex flex-col"
        onClick={(event) => event.stopPropagation()}
      >
        <form
          onSubmit={(event) => {
            event.preventDefault();
            submitSearch();
          }}
          className="p-4 sm:p-6 border-b border-gray-100 flex items-center gap-3 bg-[#F7F5EF]"
        >
          <Search className="w-6 h-6 text-[#284C38] shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search ENU Spices (e.g., Sambhar, Garam Masala, Turmeric)..."
            className="w-full bg-transparent text-lg text-[#1D1D1D] placeholder-gray-400 focus:outline-none"
            aria-label="Search products"
          />
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-200 text-gray-500 hover:text-gray-800 transition-colors"
            aria-label="Close search"
          >
            <X className="w-5 h-5" />
          </button>
        </form>

        <div className="p-6 overflow-y-auto space-y-6">
          {!trimmedQuery ? (
            <div className="space-y-4">
              <div className="text-xs font-bold text-[#C86D39] font-btn uppercase tracking-wider">
                Popular Searches:
              </div>
              <div className="flex flex-wrap gap-2">
                {[
                  "Sambhar Masala",
                  "Garam Masala",
                  "Turmeric Powder",
                  "Kitchen King",
                  "Paneer Butter Masala",
                ].map((term) => (
                  <button
                    key={term}
                    type="button"
                    onClick={() => setQuery(term)}
                    className="text-xs bg-[#F7F5EF] hover:bg-[#284C38] text-gray-700 hover:text-white px-3 py-1.5 rounded-full font-body transition-colors border border-gray-200"
                  >
                    {term}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <>
              {matchedCategories.length > 0 && (
                <div>
                  <div className="text-xs font-bold text-[#284C38] font-btn uppercase tracking-wider mb-3">
                    Categories ({matchedCategories.length})
                  </div>
                  <div className="space-y-2">
                    {matchedCategories.map((category) => (
                      <button
                        key={category.id}
                        type="button"
                        onClick={() => {
                          onClose();
                          onNavigate("products", category.slug);
                        }}
                        className="w-full p-3 rounded-2xl hover:bg-[#F7F5EF] flex items-center justify-between cursor-pointer border border-transparent hover:border-[#D6A146]/30 transition-all group text-left"
                      >
                        <div>
                          <div className="font-heading font-bold text-base text-[#1D1D1D] group-hover:text-[#284C38]">
                            {category.name}
                          </div>
                          <div className="text-xs text-gray-500 font-body">
                            Browse {category.name}
                          </div>
                        </div>
                        <ArrowRight className="w-4 h-4 text-[#D6A146] opacity-0 group-hover:opacity-100 transition-opacity" />
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {hasProductSection && (
                <div>
                  <div className="flex items-center justify-between gap-3 mb-3">
                    <div className="text-xs font-bold text-[#284C38] font-btn uppercase tracking-wider">
                      Spices & Masalas
                      {!showProductLoading && matchedProducts.length > 0
                        ? ` (${totalMatches ?? matchedProducts.length})`
                        : ""}
                    </div>
                    {debouncedQuery && !showProductLoading && !searchError && (
                      <button
                        type="button"
                        onClick={() => submitSearch(debouncedQuery)}
                        className="text-[11px] font-bold text-[#C86D39] hover:underline font-btn"
                      >
                        View all {totalMatches ?? matchedProducts.length} results
                      </button>
                    )}
                  </div>

                  {showProductLoading && (
                    <div className="flex items-center justify-center py-6 text-[#284C38]">
                      <Loader2 className="w-5 h-5 animate-spin mr-2" />
                      <span className="text-sm">Searching spices...</span>
                    </div>
                  )}

                  {searchError && !showProductLoading && (
                    <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 flex items-center justify-between gap-3">
                      <div className="flex items-start gap-2">
                        <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
                        <span>{searchError}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => runProductSearch(debouncedQuery)}
                        className="inline-flex items-center gap-1.5 text-xs font-bold shrink-0"
                      >
                        <RefreshCw className="w-3.5 h-3.5" />
                        Retry
                      </button>
                    </div>
                  )}

                  {!showProductLoading && !searchError && matchedProducts.length > 0 && (
                    <div className="space-y-2">
                      {matchedProducts.map((product) => {
                        const badge = getProductBadge(product);

                        return (
                          <Link
                            key={product.id}
                            href={`/products/${product.slug || product.id}`}
                            onClick={onClose}
                            className="p-3 rounded-2xl hover:bg-[#F7F5EF] flex items-center justify-between cursor-pointer border border-transparent hover:border-[#D6A146]/30 transition-all group"
                          >
                            <div className="flex items-center gap-3 min-w-0">
                              <img
                                src={product.image}
                                alt={product.name}
                                className="w-12 h-12 rounded-xl object-cover bg-[#1E3A2B] shrink-0"
                                loading="lazy"
                                referrerPolicy="no-referrer"
                              />
                              <div className="min-w-0">
                                <div className="flex items-center gap-2 min-w-0">
                                  <div className="font-heading font-bold text-base text-[#1D1D1D] group-hover:text-[#284C38] truncate">
                                    {product.name}
                                  </div>
                                  {badge && (
                                    <span className="text-[10px] font-bold uppercase tracking-wide px-1.5 py-0.5 rounded-full bg-[#284C38] text-[#D6A146] shrink-0">
                                      {badge}
                                    </span>
                                  )}
                                </div>
                                <div className="text-xs text-gray-500 font-body truncate">
                                  {product.category} • {product.defaultWeight} • ₹
                                  {product.price}
                                </div>
                              </div>
                            </div>
                            <ArrowRight className="w-4 h-4 text-[#D6A146] opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
                          </Link>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}

              {matchedRecipes.length > 0 && (
                <div>
                  <div className="text-xs font-bold text-[#C86D39] font-btn uppercase tracking-wider mb-3">
                    Culinary Recipes ({matchedRecipes.length})
                  </div>
                  <div className="space-y-2">
                    {matchedRecipes.map((recipe) => (
                      <button
                        key={recipe.id}
                        type="button"
                        onClick={() => {
                          onClose();
                          onSelectRecipe(recipe);
                        }}
                        className="w-full p-3 rounded-2xl hover:bg-[#F7F5EF] flex items-center justify-between cursor-pointer border border-transparent hover:border-[#D6A146]/30 transition-all group text-left"
                      >
                        <div className="flex items-center gap-3">
                          <img
                            src={recipe.image}
                            alt={recipe.title}
                            className="w-12 h-12 rounded-xl object-cover bg-[#1E3A2B]"
                            loading="lazy"
                            referrerPolicy="no-referrer"
                          />
                          <div>
                            <div className="font-heading font-bold text-base text-[#1D1D1D] group-hover:text-[#284C38]">
                              {recipe.title}
                            </div>
                            <div className="text-xs text-gray-500 font-body">
                              {recipe.cookTime} • {recipe.difficulty}
                            </div>
                          </div>
                        </div>
                        <ArrowRight className="w-4 h-4 text-[#D6A146] opacity-0 group-hover:opacity-100 transition-opacity" />
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {showNoMatches && (
                <div className="text-center py-8 text-gray-500 font-body text-sm space-y-3">
                  <p>No matching ENU spices or recipes found for &quot;{trimmedQuery}&quot;.</p>
                  <button
                    type="button"
                    onClick={() => submitSearch(trimmedQuery)}
                    className="text-xs font-bold text-[#284C38] hover:underline font-btn"
                  >
                    Search catalog for &quot;{trimmedQuery}&quot;
                  </button>
                </div>
              )}

              {trimmedQuery && !showProductLoading && (
                <div className="pt-2 border-t border-gray-100">
                  <button
                    type="button"
                    onClick={() => submitSearch(trimmedQuery)}
                    className="w-full py-3 rounded-xl bg-[#284C38] hover:bg-[#1E3A2B] text-white text-sm font-bold font-btn transition-colors"
                  >
                    Search catalog for &quot;{trimmedQuery}&quot;
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};
