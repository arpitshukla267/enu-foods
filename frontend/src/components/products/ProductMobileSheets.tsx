import React, { useEffect, useMemo, useState } from "react";
import { Check, Loader2 } from "lucide-react";
import { useCategories } from "../../context/CategoryContext";
import { ProductBottomSheet } from "./ProductBottomSheet";
import {
  ProductCatalogQuery,
  SORT_LABELS,
  SortOption,
} from "../../lib/productCatalogUrl";

type MobileSheet = "categories" | "filter" | "sort" | null;

type PriceRangeOption = "" | "0-500" | "500-1000" | "1000+";

interface FilterDraft {
  subcategory: string;
  priceRange: PriceRangeOption;
  isFeatured: boolean;
  isBestSeller: boolean;
  isNewArrival: boolean;
}

interface ProductMobileSheetsProps {
  activeSheet: MobileSheet;
  onClose: () => void;
  query: ProductCatalogQuery;
  onApplyQuery: (updates: Partial<ProductCatalogQuery>) => void;
  onClearFilters: () => void;
}

const PRICE_OPTIONS: Array<{ id: PriceRangeOption; label: string }> = [
  { id: "", label: "Any Price" },
  { id: "0-500", label: "₹0 – ₹500" },
  { id: "500-1000", label: "₹500 – ₹1000" },
  { id: "1000+", label: "₹1000+" },
];

const getPriceRangeFromQuery = (query: ProductCatalogQuery): PriceRangeOption => {
  if (query.minPrice === 0 && query.maxPrice === 500) return "0-500";
  if (query.minPrice === 500 && query.maxPrice === 1000) return "500-1000";
  if (query.minPrice === 1000 && query.maxPrice === undefined) return "1000+";
  return "";
};

const priceRangeToQuery = (
  range: PriceRangeOption,
): Pick<ProductCatalogQuery, "minPrice" | "maxPrice"> => {
  switch (range) {
    case "0-500":
      return { minPrice: 0, maxPrice: 500 };
    case "500-1000":
      return { minPrice: 500, maxPrice: 1000 };
    case "1000+":
      return { minPrice: 1000, maxPrice: undefined };
    default:
      return { minPrice: undefined, maxPrice: undefined };
  }
};

const draftFromQuery = (query: ProductCatalogQuery): FilterDraft => ({
  subcategory: query.subcategory || "",
  priceRange: getPriceRangeFromQuery(query),
  isFeatured: Boolean(query.isFeatured),
  isBestSeller: Boolean(query.isBestSeller),
  isNewArrival: Boolean(query.isNewArrival),
});

export const ProductMobileSheets: React.FC<ProductMobileSheetsProps> = ({
  activeSheet,
  onClose,
  query,
  onApplyQuery,
  onClearFilters,
}) => {
  const { categories, isLoading: categoriesLoading } = useCategories();
  const [filterDraft, setFilterDraft] = useState<FilterDraft>(() => draftFromQuery(query));

  useEffect(() => {
    if (activeSheet === "filter") {
      setFilterDraft(draftFromQuery(query));
    }
  }, [activeSheet, query]);

  const activeCategoryRecord = useMemo(
    () =>
      categories.find(
        (category) => (category.slug || category.id) === query.category,
      ),
    [categories, query.category],
  );

  const subcategories = activeCategoryRecord?.subcategories || [];

  const handleCategorySelect = (category: string) => {
    onApplyQuery({
      category,
      subcategory: undefined,
    });
    onClose();
  };

  const handleSortSelect = (sort: SortOption) => {
    onApplyQuery({ sort });
    onClose();
  };

  const handleApplyFilters = () => {
    const priceQuery = priceRangeToQuery(filterDraft.priceRange);
    onApplyQuery({
      subcategory: filterDraft.subcategory || undefined,
      ...priceQuery,
      isFeatured: filterDraft.isFeatured || undefined,
      isBestSeller: filterDraft.isBestSeller || undefined,
      isNewArrival: filterDraft.isNewArrival || undefined,
    });
    onClose();
  };

  const handleClearFilterDraft = () => {
    setFilterDraft({
      subcategory: "",
      priceRange: "",
      isFeatured: false,
      isBestSeller: false,
      isNewArrival: false,
    });
    onClearFilters();
    onClose();
  };

  return (
    <>
      <ProductBottomSheet
        isOpen={activeSheet === "categories"}
        onClose={onClose}
        title="Categories"
      >
        {categoriesLoading ? (
          <div className="flex items-center justify-center py-8 text-[#736854]">
            <Loader2 className="w-5 h-5 animate-spin mr-2" />
            Loading categories...
          </div>
        ) : (
          <div className="space-y-1">
            <button
              type="button"
              onClick={() => handleCategorySelect("All")}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-left transition-colors ${
                query.category === "All"
                  ? "bg-[#284C38]/10 text-[#284C38] font-semibold"
                  : "text-[#1D1D1D] hover:bg-[#F7F5EF]"
              }`}
            >
              <span>All Products</span>
              {query.category === "All" ? <Check className="w-4 h-4" /> : null}
            </button>

            {categories.map((category) => {
              const value = category.slug || category.id;
              const isActive = query.category === value;

              return (
                <button
                  key={category.id}
                  type="button"
                  onClick={() => handleCategorySelect(value)}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-left transition-colors ${
                    isActive
                      ? "bg-[#284C38]/10 text-[#284C38] font-semibold"
                      : "text-[#1D1D1D] hover:bg-[#F7F5EF]"
                  }`}
                >
                  <span>{category.name}</span>
                  {isActive ? <Check className="w-4 h-4" /> : null}
                </button>
              );
            })}
          </div>
        )}
      </ProductBottomSheet>

      <ProductBottomSheet
        isOpen={activeSheet === "filter"}
        onClose={onClose}
        title="Filter Products"
        footer={
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleClearFilterDraft}
              className="flex-1 py-3 rounded-xl border border-[#DCD4C0] text-[#5C5343] text-sm font-semibold"
            >
              Clear All
            </button>
            <button
              type="button"
              onClick={handleApplyFilters}
              className="flex-1 py-3 rounded-xl bg-[#284C38] text-white text-sm font-semibold"
            >
              Apply Filters
            </button>
          </div>
        }
      >
        <div className="space-y-6">
          <section>
            <h3 className="text-xs font-bold uppercase tracking-wide text-[#736854] mb-3">
              Price Range
            </h3>
            <div className="space-y-2">
              {PRICE_OPTIONS.map((option) => (
                <label
                  key={option.id || "any"}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-[#F7F5EF] cursor-pointer"
                >
                  <input
                    type="radio"
                    name="price-range"
                    checked={filterDraft.priceRange === option.id}
                    onChange={() =>
                      setFilterDraft((current) => ({
                        ...current,
                        priceRange: option.id,
                      }))
                    }
                    className="accent-[#284C38]"
                  />
                  <span className="text-sm text-[#1D1D1D]">{option.label}</span>
                </label>
              ))}
            </div>
          </section>

          {subcategories.length > 0 ? (
            <section>
              <h3 className="text-xs font-bold uppercase tracking-wide text-[#736854] mb-3">
                Subcategory
              </h3>
              <div className="space-y-2">
                <label className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-[#F7F5EF] cursor-pointer">
                  <input
                    type="radio"
                    name="subcategory"
                    checked={!filterDraft.subcategory}
                    onChange={() =>
                      setFilterDraft((current) => ({ ...current, subcategory: "" }))
                    }
                    className="accent-[#284C38]"
                  />
                  <span className="text-sm text-[#1D1D1D]">All subcategories</span>
                </label>
                {subcategories.map((subcategory) => (
                  <label
                    key={subcategory.id}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-[#F7F5EF] cursor-pointer"
                  >
                    <input
                      type="radio"
                      name="subcategory"
                      checked={filterDraft.subcategory === (subcategory.slug || subcategory.id)}
                      onChange={() =>
                        setFilterDraft((current) => ({
                          ...current,
                          subcategory: subcategory.slug || subcategory.id,
                        }))
                      }
                      className="accent-[#284C38]"
                    />
                    <span className="text-sm text-[#1D1D1D]">{subcategory.name}</span>
                  </label>
                ))}
              </div>
            </section>
          ) : null}

          <section>
            <h3 className="text-xs font-bold uppercase tracking-wide text-[#736854] mb-3">
              Product Badges
            </h3>
            <div className="space-y-2">
              {[
                { key: "isFeatured" as const, label: "Featured" },
                { key: "isBestSeller" as const, label: "Best Seller" },
                { key: "isNewArrival" as const, label: "New Arrival" },
              ].map((item) => (
                <label
                  key={item.key}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-[#F7F5EF] cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={filterDraft[item.key]}
                    onChange={(event) =>
                      setFilterDraft((current) => ({
                        ...current,
                        [item.key]: event.target.checked,
                      }))
                    }
                    className="accent-[#284C38]"
                  />
                  <span className="text-sm text-[#1D1D1D]">{item.label}</span>
                </label>
              ))}
            </div>
          </section>
        </div>
      </ProductBottomSheet>

      <ProductBottomSheet
        isOpen={activeSheet === "sort"}
        onClose={onClose}
        title="Sort Products"
      >
        <div className="space-y-1">
          {(Object.keys(SORT_LABELS) as SortOption[]).map((option) => {
            const isActive = query.sort === option;

            return (
              <button
                key={option}
                type="button"
                onClick={() => handleSortSelect(option)}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-left transition-colors ${
                  isActive
                    ? "bg-[#284C38]/10 text-[#284C38] font-semibold"
                    : "text-[#1D1D1D] hover:bg-[#F7F5EF]"
                }`}
              >
                <span>{SORT_LABELS[option]}</span>
                {isActive ? <Check className="w-4 h-4" /> : null}
              </button>
            );
          })}
        </div>
      </ProductBottomSheet>
    </>
  );
};

export type { MobileSheet };
