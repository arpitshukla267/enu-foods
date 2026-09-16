export type SortOption =
  | "newest"
  | "oldest"
  | "name-asc"
  | "name-desc"
  | "price-asc"
  | "price-desc";

export interface ProductCatalogQuery {
  category?: string;
  search?: string;
  sort?: SortOption;
  subcategory?: string;
  minPrice?: number;
  maxPrice?: number;
  isFeatured?: boolean;
  isBestSeller?: boolean;
  isNewArrival?: boolean;
}

export const SORT_LABELS: Record<SortOption, string> = {
  newest: "Newest First",
  oldest: "Oldest First",
  "name-asc": "Name: A to Z",
  "name-desc": "Name: Z to A",
  "price-asc": "Price: Low to High",
  "price-desc": "Price: High to Low",
};

export const parseProductCatalogQuery = (
  searchParams: URLSearchParams,
): Required<Pick<ProductCatalogQuery, "category" | "search" | "sort">> &
  Omit<ProductCatalogQuery, "category" | "search" | "sort"> => {
  const sortParam = searchParams.get("sort");
  const validSorts: SortOption[] = [
    "newest",
    "oldest",
    "name-asc",
    "name-desc",
    "price-asc",
    "price-desc",
  ];

  const minPriceRaw = searchParams.get("minPrice");
  const maxPriceRaw = searchParams.get("maxPrice");

  return {
    category: searchParams.get("category") || "All",
    search: searchParams.get("search") || "",
    sort: validSorts.includes(sortParam as SortOption)
      ? (sortParam as SortOption)
      : "newest",
    subcategory: searchParams.get("subcategory") || undefined,
    minPrice: minPriceRaw ? Number(minPriceRaw) : undefined,
    maxPrice: maxPriceRaw ? Number(maxPriceRaw) : undefined,
    isFeatured: searchParams.get("isFeatured") === "true" || undefined,
    isBestSeller: searchParams.get("isBestSeller") === "true" || undefined,
    isNewArrival: searchParams.get("isNewArrival") === "true" || undefined,
  };
};

export const buildProductsUrl = (query: ProductCatalogQuery) => {
  const params = new URLSearchParams();

  if (query.category && query.category !== "All") {
    params.set("category", query.category);
  }
  if (query.search) {
    params.set("search", query.search);
  }
  if (query.sort && query.sort !== "newest") {
    params.set("sort", query.sort);
  }
  if (query.subcategory) {
    params.set("subcategory", query.subcategory);
  }
  if (query.minPrice !== undefined && !Number.isNaN(query.minPrice)) {
    params.set("minPrice", String(query.minPrice));
  }
  if (query.maxPrice !== undefined && !Number.isNaN(query.maxPrice)) {
    params.set("maxPrice", String(query.maxPrice));
  }
  if (query.isFeatured) {
    params.set("isFeatured", "true");
  }
  if (query.isBestSeller) {
    params.set("isBestSeller", "true");
  }
  if (query.isNewArrival) {
    params.set("isNewArrival", "true");
  }

  const queryString = params.toString();
  return queryString ? `/products?${queryString}` : "/products";
};

export const countActiveFilters = (query: ProductCatalogQuery) => {
  let count = 0;
  if (query.subcategory) count += 1;
  if (query.minPrice !== undefined || query.maxPrice !== undefined) count += 1;
  if (query.isFeatured) count += 1;
  if (query.isBestSeller) count += 1;
  if (query.isNewArrival) count += 1;
  return count;
};
