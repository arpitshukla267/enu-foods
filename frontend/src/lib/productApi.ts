import { Product } from "../types";
import { API_URL } from "./apiClient";

export interface ProductListItem {
  id: string;
  name: string;
  slug: string;
  thumbnail: string;
  price: number;
  compareAtPrice: number;
  category: {
    id: string;
    name: string;
    slug: string;
  };
  badges: {
    isFeatured: boolean;
    isBestSeller: boolean;
    isNewArrival: boolean;
  };
  inStock: boolean;
  weightOptions?: string[];
  weightVariants?: Array<{
    weight: string;
    price: number;
    compareAtPrice: number;
    inStock?: boolean;
  }>;
  defaultWeight: string;
  shortDescription: string;
}

export interface ProductQueryParams {
  search?: string;
  category?: string;
  subcategory?: string;
  minPrice?: number;
  maxPrice?: number;
  sort?: string;
  isFeatured?: boolean;
  isBestSeller?: boolean;
  isNewArrival?: boolean;
  limit?: number;
  cursor?: string | null;
}

interface ProductsResponse {
  success: boolean;
  message: string;
  data: {
    products: ProductListItem[];
    pagination: {
      limit: number;
      nextCursor: string | null;
      total?: number | null;
    };
  };
}

interface ProductDetailResponse {
  success: boolean;
  message: string;
  data: {
    product: Record<string, unknown>;
  };
}

export class ProductApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = "ProductApiError";
    this.status = status;
  }
}

export const mapListItemToProduct = (item: ProductListItem): Product => ({
  id: item.id,
  name: item.name,
  slug: item.slug,
  category: item.category.name,
  categorySlug: item.category.slug,
  weightVariants:
    item.weightVariants?.map((variant) => ({
      weight: variant.weight,
      price: variant.price,
      originalPrice: variant.compareAtPrice || variant.price,
      inStock: variant.inStock ?? item.inStock ?? false,
    })) || [],
  weightOptions:
    item.weightVariants?.map((variant) => variant.weight) ||
    (item.weightOptions?.length
      ? item.weightOptions
      : item.defaultWeight
        ? [item.defaultWeight]
        : []),
  defaultWeight: item.defaultWeight,
  price: item.price,
  originalPrice: item.compareAtPrice || item.price,
  shortDescription: item.shortDescription,
  fullDescription: item.shortDescription,
  image: item.thumbnail,
  secondaryImages: [],
  ingredients: [],
  benefits: [],
  storageInstructions: "",
  aromaProfile: "",
  spicinessLevel: 3,
  isFeatured: item.badges.isFeatured,
  isBestSeller: item.badges.isBestSeller,
  isNewArrival: item.badges.isNewArrival,
  bestFor: [],
  inStock: item.inStock,
});

export const mapDetailToProduct = (record: Record<string, unknown>): Product => ({
  id: String(record.id),
  name: String(record.name),
  slug: String(record.slug),
  category: String(record.category || ""),
  categorySlug: String(record.categorySlug || ""),
  weightVariants: Array.isArray(record.weightVariants)
    ? record.weightVariants.map((variant) => {
        const entry = variant as Record<string, unknown>;
        return {
          weight: String(entry.weight || ""),
          price: Number(entry.price || 0),
          originalPrice: Number(entry.compareAtPrice || entry.originalPrice || entry.price || 0),
          inStock: Boolean(entry.inStock ?? true),
        };
      })
    : [],
  weightOptions:
    (Array.isArray(record.weightVariants)
      ? record.weightVariants.map((variant) => String((variant as Record<string, unknown>).weight || ""))
      : (record.weightOptions as string[])) || [String(record.defaultWeight || "100g")],
  defaultWeight: String(record.defaultWeight || "100g"),
  price: Number(record.price || 0),
  originalPrice: Number(record.originalPrice || record.compareAtPrice || record.price || 0),
  shortDescription: String(record.shortDescription || ""),
  fullDescription: String(record.fullDescription || record.description || ""),
  image: String(record.image || ""),
  secondaryImages: (record.secondaryImages as string[]) || [],
  ingredients: (record.ingredients as string[]) || [],
  benefits: (record.benefits as string[]) || [],
  storageInstructions: String(record.storageInstructions || ""),
  aromaProfile: String(record.aromaProfile || ""),
  spicinessLevel: Number(record.spicinessLevel || 3),
  isFeatured: Boolean(record.isFeatured),
  isBestSeller: Boolean(record.isBestSeller),
  isNewArrival: Boolean(record.isNewArrival),
  bestFor: (record.bestFor as string[]) || [],
  inStock: Boolean(record.inStock ?? Number(record.stock || 0) > 0),
});

const buildQueryString = (params: ProductQueryParams) => {
  const searchParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value === undefined || value === null || value === "") return;
    if (typeof value === "boolean") {
      searchParams.set(key, value ? "true" : "false");
      return;
    }
    searchParams.set(key, String(value));
  });
  return searchParams.toString();
};

export const fetchProducts = async (
  params: ProductQueryParams,
  signal?: AbortSignal,
): Promise<ProductsResponse["data"]> => {
  const query = buildQueryString(params);
  const response = await fetch(`${API_URL}/v1/products${query ? `?${query}` : ""}`, {
    signal,
  });

  const data = (await response.json().catch(() => ({}))) as ProductsResponse;

  if (!response.ok) {
    throw new ProductApiError(data.message || "Failed to load products", response.status);
  }

  return data.data;
};

export const fetchProductBySlug = async (
  slug: string,
  signal?: AbortSignal,
): Promise<Product> => {
  const response = await fetch(`${API_URL}/v1/products/${encodeURIComponent(slug)}`, {
    signal,
  });

  const data = (await response.json().catch(() => ({}))) as ProductDetailResponse;

  if (!response.ok) {
    throw new ProductApiError(data.message || "Failed to load product", response.status);
  }

  return mapDetailToProduct(data.data.product);
};

export const getResponsiveBatchSize = (width: number) => {
  if (width < 640) return 6;
  if (width < 1024) return 9;
  return 12;
};

export const mapSortToApi = (sort: string) => {
  switch (sort) {
    case "featured":
      return "newest";
    case "name":
      return "name-asc";
    case "heat":
      return "newest";
    case "price-asc":
      return "price-asc";
    case "price-desc":
      return "price-desc";
    case "oldest":
      return "oldest";
    default:
      return sort;
  }
};
