import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Plus, Trash2, Search, Package, Loader2, Boxes, X } from 'lucide-react';
import { Product, ComboItem } from '../../types';
import * as adminProductApi from '../../lib/adminProductApi';

interface ComboProductSelectorProps {
  comboItems: ComboItem[];
  onChange: (items: ComboItem[]) => void;
  onSelectedProductsChange?: (products: Record<string, Product>) => void;
  hasError?: boolean;
  errorMessage?: string;
}

const getLineKey = (productId: string, weight: string) => `${productId}:${weight}`;

export const ComboProductSelector: React.FC<ComboProductSelectorProps> = ({
  comboItems,
  onChange,
  onSelectedProductsChange,
  hasError = false,
  errorMessage,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const [productCache, setProductCache] = useState<Record<string, Product>>({});
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);
  const [isPickerOpen, setIsPickerOpen] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => setDebouncedSearch(searchQuery.trim()), 350);
    return () => window.clearTimeout(timer);
  }, [searchQuery]);

  const updateCache = useCallback((products: Product[]) => {
    setProductCache((current) => {
      const next = { ...current };
      products.forEach((product) => {
        next[product.id] = product;
      });
      return next;
    });
  }, []);

  useEffect(() => {
    onSelectedProductsChange?.(productCache);
  }, [productCache, onSelectedProductsChange]);

  useEffect(() => {
    const missingIds = comboItems
      .map((item) => item.productId)
      .filter((productId) => productId && !productCache[productId]);

    if (missingIds.length === 0) {
      return;
    }

    let cancelled = false;

    const loadSelectedProducts = async () => {
      try {
        const products = await Promise.all(
          missingIds.map((productId) => adminProductApi.getProductById(productId)),
        );
        if (!cancelled) {
          updateCache(products);
        }
      } catch {
        // Fallback labels remain until individual fetch succeeds.
      }
    };

    loadSelectedProducts();

    return () => {
      cancelled = true;
    };
  }, [comboItems, productCache, updateCache]);

  useEffect(() => {
    if (!isPickerOpen) {
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
          status: 'active',
          sort: 'name-asc',
        });

        if (!cancelled) {
          setSearchResults(result.products);
        }
      } catch (error) {
        if (!cancelled) {
          setSearchResults([]);
          setSearchError(
            error instanceof Error ? error.message : 'Failed to search products',
          );
        }
      } finally {
        if (!cancelled) {
          setIsSearching(false);
        }
      }
    };

    fetchProducts();

    return () => {
      cancelled = true;
    };
  }, [debouncedSearch, isPickerOpen]);

  const usedLineKeys = useMemo(
    () => new Set(comboItems.map((item) => getLineKey(item.productId, item.weight))),
    [comboItems],
  );

  const handleAddProduct = (product: Product, preferredWeight?: string) => {
    const defaultVariant =
      product.weightOptions.find((variant) => variant.weight === preferredWeight) ||
      product.weightOptions.find((variant) => variant.isDefault) ||
      product.weightOptions[0];

    const weight = defaultVariant ? defaultVariant.weight : product.defaultWeight;
    const lineKey = getLineKey(product.id, weight);

    if (usedLineKeys.has(lineKey)) {
      const existingIndex = comboItems.findIndex(
        (item) => getLineKey(item.productId, item.weight) === lineKey,
      );
      if (existingIndex >= 0) {
        const currentQty = comboItems[existingIndex].quantity || 1;
        handleUpdateItem(existingIndex, { quantity: currentQty + 1 });
      }
      setSearchQuery('');
      setIsPickerOpen(false);
      return;
    }

    const newItem: ComboItem = {
      productId: product.id,
      productName: product.name,
      weight,
      quantity: 1,
      role: '',
      description: product.shortDescription,
    };

    updateCache([product]);
    onChange([...comboItems, newItem]);
    setSearchQuery('');
    setIsPickerOpen(false);
  };

  const handleAddAnotherWeight = (index: number) => {
    const item = comboItems[index];
    const product = productCache[item.productId];
    if (!product) return;

    const unusedVariant = product.weightOptions.find(
      (variant) => !usedLineKeys.has(getLineKey(item.productId, variant.weight)),
    );

    if (!unusedVariant) return;

    const newItem: ComboItem = {
      productId: item.productId,
      productName: product.name,
      weight: unusedVariant.weight,
      quantity: 1,
      role: item.role || '',
      description: item.description || product.shortDescription,
    };

    onChange([...comboItems, newItem]);
  };

  const handleRemoveItem = (index: number) => {
    onChange(comboItems.filter((_, itemIndex) => itemIndex !== index));
  };

  const handleUpdateItem = (index: number, updates: Partial<ComboItem>) => {
    onChange(
      comboItems.map((item, itemIndex) =>
        itemIndex === index ? { ...item, ...updates } : item,
      ),
    );
  };

  const handleWeightChange = (index: number, nextWeight: string) => {
    const item = comboItems[index];
    const lineKey = getLineKey(item.productId, nextWeight);
    if (usedLineKeys.has(lineKey) && item.weight !== nextWeight) {
      return;
    }
    handleUpdateItem(index, { weight: nextWeight });
  };

  return (
    <div
      className={`space-y-4 rounded-2xl border p-4 transition-colors ${
        hasError
          ? 'border-[#9E382B] bg-[#FDF0EE]/40 ring-1 ring-[#9E382B]/20'
          : 'border-[#E8E2D5] bg-[#FAF8F5]'
      }`}
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#173D2A]/10 flex items-center justify-center shrink-0">
            <Boxes className="w-5 h-5 text-[#173D2A]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="text-sm font-bold text-[#173D2A] font-serif-brand">
                Bundle Products
              </h4>
              <span className="px-2 py-0.5 rounded-full bg-[#173D2A] text-white text-[10px] font-bold">
                {comboItems.length}
              </span>
            </div>
            <p className="text-xs text-[#736854] mt-0.5">
              Add products with different weights or quantities. Same product can appear multiple times.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setIsPickerOpen((open) => !open)}
          className="inline-flex items-center justify-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-[#173D2A] hover:bg-[#0F281B] rounded-xl transition-colors shadow-xs shrink-0"
        >
          <Plus className="w-3.5 h-3.5" />
          {isPickerOpen ? 'Close Product Search' : 'Add Product to Bundle'}
        </button>
      </div>

      {hasError && errorMessage ? (
        <p className="text-xs font-semibold text-[#9E382B]">{errorMessage}</p>
      ) : null}

      {isPickerOpen && (
        <div className="p-4 bg-white border-2 border-[#D99B26]/40 rounded-2xl shadow-sm space-y-3">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 text-xs font-bold text-[#173D2A] uppercase tracking-wide">
              <Search className="w-4 h-4 text-[#D99B26]" />
              <span>Search Active Products</span>
            </div>
            <button
              type="button"
              onClick={() => setIsPickerOpen(false)}
              className="p-1 rounded-lg text-[#736854] hover:bg-[#F4EFE6]"
              aria-label="Close search"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="relative">
            <Search className="w-4 h-4 text-[#8F816B] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder="Search by product name, category, or SKU..."
              className="w-full pl-9 pr-3 py-2.5 text-xs bg-[#F9F7F2] border border-[#DCD4C0] rounded-xl text-[#1A211D] focus:outline-none focus:border-[#173D2A]"
              autoFocus
            />
          </div>

          <div className="max-h-52 overflow-y-auto rounded-xl border border-[#DCD4C0] bg-white divide-y divide-[#E8E2D5]">
            {isSearching ? (
              <div className="p-5 flex items-center justify-center text-xs text-[#736854]">
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
                Searching products...
              </div>
            ) : searchError ? (
              <div className="p-5 text-center text-xs text-[#9E382B]">{searchError}</div>
            ) : searchResults.length === 0 ? (
              <div className="p-5 text-center text-xs text-[#8F816B]">
                {debouncedSearch
                  ? 'No matching active products found.'
                  : 'Start typing to search active products.'}
              </div>
            ) : (
              searchResults.map((product) => (
                <button
                  key={product.id}
                  type="button"
                  onClick={() => handleAddProduct(product)}
                  className="w-full p-3 hover:bg-[#F9F7F2] flex items-center justify-between gap-3 text-left transition-colors"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-11 h-11 rounded-xl object-cover border border-[#DCD4C0] shrink-0"
                    />
                    <div className="min-w-0">
                      <div className="text-xs font-bold text-[#1A211D] truncate font-serif-brand">
                        {product.name}
                      </div>
                      <div className="text-[10px] text-[#8F816B] truncate">
                        {product.categoryName} • From ₹{product.price}
                      </div>
                    </div>
                  </div>
                  <span className="inline-flex items-center gap-1 px-3 py-1.5 text-[11px] font-bold text-[#173D2A] bg-[#F4EFE6] hover:bg-[#D99B26] hover:text-white rounded-lg transition-colors shrink-0">
                    <Plus className="w-3 h-3" />
                    Add
                  </span>
                </button>
              ))
            )}
          </div>
        </div>
      )}

      {comboItems.length === 0 ? (
        <div className="p-8 text-center rounded-2xl border border-dashed border-[#DCD4C0] bg-white">
          <Package className="w-9 h-9 text-[#8F816B] mx-auto mb-2 opacity-70" />
          <p className="text-sm font-semibold text-[#173D2A]">No products in this bundle yet</p>
          <p className="text-xs text-[#736854] mt-1">
            Click &quot;Add Product to Bundle&quot; to search and select spices.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {comboItems.map((item, index) => {
            const product = productCache[item.productId];
            const label = product?.name || item.productName || `Product ${index + 1}`;
            const variant = product?.weightOptions.find((entry) => entry.weight === item.weight);
            const unitPrice = variant?.price ?? product?.price ?? 0;
            const quantity = item.quantity && item.quantity > 0 ? item.quantity : 1;
            const hasUnusedWeights =
              product &&
              product.weightOptions.some(
                (entry) => !usedLineKeys.has(getLineKey(item.productId, entry.weight)),
              );

            return (
              <div
                key={`${item.productId}-${item.weight}-${index}`}
                className="bg-white p-4 rounded-2xl border border-[#E8E2D5] shadow-xs space-y-3"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    {product?.image ? (
                      <img
                        src={product.image}
                        alt={label}
                        className="w-12 h-12 rounded-xl object-cover border border-[#DCD4C0] shrink-0"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-xl bg-[#F4EFE6] border border-[#DCD4C0] shrink-0" />
                    )}
                    <div className="min-w-0">
                      <span className="inline-flex px-2 py-0.5 rounded-md bg-[#173D2A]/10 text-[#173D2A] text-[10px] font-bold uppercase">
                        Item {index + 1}
                      </span>
                      <p className="text-sm font-bold text-[#1A211D] truncate font-serif-brand mt-1">
                        {label}
                      </p>
                      {product?.categoryName ? (
                        <p className="text-[10px] text-[#8F816B]">{product.categoryName}</p>
                      ) : null}
                    </div>
                  </div>

                  <div className="flex items-center gap-1 shrink-0">
                    {hasUnusedWeights ? (
                      <button
                        type="button"
                        onClick={() => handleAddAnotherWeight(index)}
                        className="px-2.5 py-1.5 text-[10px] font-bold text-[#173D2A] bg-[#F4EFE6] hover:bg-[#EAE2D2] rounded-lg border border-[#DCD4C0]"
                      >
                        + Another weight
                      </button>
                    ) : null}
                    <button
                      type="button"
                      onClick={() => handleRemoveItem(index)}
                      className="p-2 text-[#9E382B] hover:bg-[#FDF0EE] rounded-lg transition-colors"
                      title="Remove from bundle"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1 border-t border-[#F0EBE0]">
                  <div>
                    <label className="block text-[10px] font-bold text-[#736854] uppercase">
                      Package Weight
                    </label>
                    {product ? (
                      <select
                        value={item.weight}
                        onChange={(event) => handleWeightChange(index, event.target.value)}
                        className="w-full mt-1 px-3 py-2 text-xs bg-[#F9F7F2] border border-[#DCD4C0] rounded-xl text-[#1A211D] focus:outline-none focus:border-[#173D2A]"
                      >
                        {product.weightOptions.map((entry) => (
                          <option
                            key={entry.id}
                            value={entry.weight}
                            disabled={
                              entry.weight !== item.weight &&
                              usedLineKeys.has(getLineKey(item.productId, entry.weight))
                            }
                          >
                            {entry.weight} (₹{entry.price})
                            {entry.weight !== item.weight &&
                            usedLineKeys.has(getLineKey(item.productId, entry.weight))
                              ? ' — already added'
                              : ''}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <p className="mt-1 text-xs text-[#736854]">{item.weight}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-[#736854] uppercase">
                      Quantity
                    </label>
                    <input
                      type="number"
                      min={1}
                      max={variant?.stock ?? 999}
                      value={quantity}
                      onChange={(event) =>
                        handleUpdateItem(index, {
                          quantity: Math.max(1, Number(event.target.value) || 1),
                        })
                      }
                      className="w-full mt-1 px-3 py-2 text-xs bg-[#F9F7F2] border border-[#DCD4C0] rounded-xl text-[#1A211D] focus:outline-none focus:border-[#173D2A]"
                    />
                    {variant ? (
                      <p className="text-[10px] text-[#8F816B] mt-1">Stock: {variant.stock}</p>
                    ) : null}
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-[#736854] uppercase">
                      Line Total
                    </label>
                    <p className="mt-2 text-sm font-bold text-[#173D2A]">
                      ₹{unitPrice * quantity}
                    </p>
                  </div>

                  <div className="sm:col-span-3">
                    <label className="block text-[10px] font-bold text-[#736854] uppercase">
                      Role in Combo
                    </label>
                    <input
                      type="text"
                      value={item.role || ''}
                      onChange={(event) =>
                        handleUpdateItem(index, { role: event.target.value })
                      }
                      placeholder="e.g. Warming Royal Aroma"
                      className="w-full mt-1 px-3 py-2 text-xs bg-[#F9F7F2] border border-[#DCD4C0] rounded-xl text-[#1A211D] focus:outline-none focus:border-[#173D2A]"
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
