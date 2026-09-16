import React, { useCallback, useEffect, useState } from "react";
import { Plus, Trash2, Search, Package, Loader2, Sparkles } from "lucide-react";
import { Product } from "../../types";
import * as adminProductApi from "../../lib/adminProductApi";

export interface SpiceEntry {
  rowId: string;
  productId?: string;
  productName: string;
}

interface RecipeSpiceSelectorProps {
  entries: SpiceEntry[];
  onChange: (entries: SpiceEntry[]) => void;
}

const createRowId = () => `spice-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

export const spiceEntriesFromNames = (names: string[]): SpiceEntry[] => {
  if (names.length === 0) {
    return [{ rowId: createRowId(), productName: "" }];
  }

  return names.map((productName) => ({
    rowId: createRowId(),
    productName,
  }));
};

export const spiceNamesFromEntries = (entries: SpiceEntry[]) =>
  entries.map((entry) => entry.productName.trim()).filter(Boolean);

export const RecipeSpiceSelector: React.FC<RecipeSpiceSelectorProps> = ({
  entries,
  onChange,
}) => {
  const [activeRowId, setActiveRowId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const [productCache, setProductCache] = useState<Record<string, Product>>({});
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);

  useEffect(() => {
    const timer = window.setTimeout(() => setDebouncedSearch(searchQuery.trim()), 350);
    return () => window.clearTimeout(timer);
  }, [searchQuery]);

  useEffect(() => {
    if (!activeRowId) {
      setSearchResults([]);
      return;
    }

    let cancelled = false;

    const fetchProducts = async () => {
      setIsSearching(true);
      setSearchError(null);

      try {
        const result = await adminProductApi.getProducts({
          page: 1,
          limit: 20,
          search: debouncedSearch || undefined,
          status: "active",
          sort: "name-asc",
        });

        if (!cancelled) {
          setSearchResults(result.products);
        }
      } catch (error) {
        if (!cancelled) {
          setSearchResults([]);
          setSearchError(error instanceof Error ? error.message : "Failed to search products");
        }
      } finally {
        if (!cancelled) {
          setIsSearching(false);
        }
      }
    };

    void fetchProducts();

    return () => {
      cancelled = true;
    };
  }, [activeRowId, debouncedSearch]);

  const updateCache = useCallback((products: Product[]) => {
    setProductCache((current) => {
      const next = { ...current };
      products.forEach((product) => {
        next[product.id] = product;
      });
      return next;
    });
  }, []);

  const usedNames = new Set(
    entries.map((entry) => entry.productName.trim().toLowerCase()).filter(Boolean),
  );

  const handleAddRow = () => {
    onChange([...entries, { rowId: createRowId(), productName: "" }]);
  };

  const handleRemoveRow = (rowId: string) => {
    const next = entries.filter((entry) => entry.rowId !== rowId);
    onChange(next.length > 0 ? next : [{ rowId: createRowId(), productName: "" }]);
    if (activeRowId === rowId) {
      setActiveRowId(null);
      setSearchQuery("");
    }
  };

  const handleSelectProduct = (rowId: string, product: Product) => {
    const normalizedName = product.name.trim();
    if (usedNames.has(normalizedName.toLowerCase())) {
      const existing = entries.find(
        (entry) => entry.productName.trim().toLowerCase() === normalizedName.toLowerCase(),
      );
      if (existing && existing.rowId !== rowId) {
        return;
      }
    }

    updateCache([product]);
    onChange(
      entries.map((entry) =>
        entry.rowId === rowId
          ? { ...entry, productId: product.id, productName: product.name }
          : entry,
      ),
    );
    setActiveRowId(null);
    setSearchQuery("");
  };

  const openSearchForRow = (rowId: string, currentName: string) => {
    setActiveRowId(rowId);
    setSearchQuery(currentName);
  };

  return (
    <div className="space-y-3 rounded-2xl border border-[#E8E2D5] bg-[#FAF8F5] p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-2">
          <div className="w-9 h-9 rounded-xl bg-[#173D2A]/10 flex items-center justify-center shrink-0">
            <Sparkles className="w-4 h-4 text-[#173D2A]" />
          </div>
          <div>
            <label className="block text-xs font-bold text-[#1A211D] uppercase tracking-wide">
              ENU Spices Used
            </label>
            <p className="text-[11px] text-[#736854] mt-0.5">
              Search and pick products used in this recipe.
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={handleAddRow}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-bold text-[#173D2A] bg-[#F4EFE6] border border-[#DCD4C0] rounded-xl hover:bg-[#EAE2D2] transition-colors shrink-0"
        >
          <Plus className="w-3.5 h-3.5" />
          Add Spice
        </button>
      </div>

      <div className="space-y-2">
        {entries.map((entry, index) => {
          const product = entry.productId ? productCache[entry.productId] : undefined;
          const isActive = activeRowId === entry.rowId;

          return (
            <div
              key={entry.rowId}
              className="relative bg-white rounded-xl border border-[#E8E2D5] p-3 space-y-2"
            >
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-[#173D2A] text-white text-[10px] font-bold flex items-center justify-center shrink-0">
                  {index + 1}
                </span>

                {entry.productName && !isActive ? (
                  <div className="flex-1 flex items-center gap-2 min-w-0">
                    {product?.image ? (
                      <img
                        src={product.image}
                        alt={entry.productName}
                        className="w-9 h-9 rounded-lg object-cover border border-[#DCD4C0] shrink-0"
                      />
                    ) : (
                      <div className="w-9 h-9 rounded-lg bg-[#F9F7F2] border border-[#DCD4C0] flex items-center justify-center shrink-0">
                        <Package className="w-4 h-4 text-[#8F816B]" />
                      </div>
                    )}
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-bold text-[#1A211D] truncate">{entry.productName}</p>
                      {product?.categoryName && (
                        <p className="text-[10px] text-[#8F816B] truncate">{product.categoryName}</p>
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={() => openSearchForRow(entry.rowId, entry.productName)}
                      className="text-[10px] font-semibold text-[#173D2A] hover:underline shrink-0"
                    >
                      Change
                    </button>
                  </div>
                ) : (
                  <div className="flex-1 relative">
                    <Search className="w-3.5 h-3.5 text-[#8F816B] absolute left-2.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={isActive ? searchQuery : entry.productName}
                      onChange={(event) => {
                        setSearchQuery(event.target.value);
                        if (!isActive) {
                          openSearchForRow(entry.rowId, event.target.value);
                        }
                      }}
                      onFocus={() => openSearchForRow(entry.rowId, entry.productName)}
                      placeholder="Search products..."
                      className="w-full pl-8 pr-3 py-2 text-xs bg-[#F9F7F2] border border-[#DCD4C0] rounded-lg focus:outline-none focus:border-[#173D2A]"
                    />
                  </div>
                )}

                <button
                  type="button"
                  onClick={() => handleRemoveRow(entry.rowId)}
                  className="p-2 text-[#9E382B] hover:bg-[#FDF0EE] rounded-lg transition-colors shrink-0"
                  aria-label="Remove spice"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              {isActive && (
                <div className="rounded-xl border border-[#DCD4C0] bg-[#F9F7F2] max-h-44 overflow-y-auto divide-y divide-[#E8E2D5]">
                  {isSearching ? (
                    <div className="p-4 flex items-center justify-center text-xs text-[#736854]">
                      <Loader2 className="w-4 h-4 animate-spin mr-2" />
                      Searching...
                    </div>
                  ) : searchError ? (
                    <div className="p-4 text-center text-xs text-[#9E382B]">{searchError}</div>
                  ) : searchResults.length === 0 ? (
                    <div className="p-4 text-center text-xs text-[#8F816B]">
                      {debouncedSearch ? "No matching products." : "Type to search active products."}
                    </div>
                  ) : (
                    searchResults.map((product) => {
                      const isUsed =
                        usedNames.has(product.name.trim().toLowerCase()) &&
                        entry.productName.trim().toLowerCase() !== product.name.trim().toLowerCase();

                      return (
                        <button
                          key={product.id}
                          type="button"
                          disabled={isUsed}
                          onClick={() => handleSelectProduct(entry.rowId, product)}
                          className={`w-full p-2.5 flex items-center gap-2.5 text-left transition-colors ${
                            isUsed
                              ? "opacity-50 cursor-not-allowed"
                              : "hover:bg-white"
                          }`}
                        >
                          <img
                            src={product.image}
                            alt={product.name}
                            className="w-9 h-9 rounded-lg object-cover border border-[#DCD4C0] shrink-0"
                          />
                          <div className="min-w-0 flex-1">
                            <p className="text-xs font-bold text-[#1A211D] truncate">{product.name}</p>
                            <p className="text-[10px] text-[#8F816B] truncate">
                              {product.categoryName} • ₹{product.price}
                            </p>
                          </div>
                          {isUsed ? (
                            <span className="text-[10px] text-[#8F816B] shrink-0">Added</span>
                          ) : (
                            <Plus className="w-3.5 h-3.5 text-[#173D2A] shrink-0" />
                          )}
                        </button>
                      );
                    })
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
