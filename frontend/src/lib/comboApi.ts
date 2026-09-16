import { ComboItem, Product } from "../types";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export interface ComboApiRecord {
  id: string;
  slug: string;
  title: string;
  subtitle?: string;
  category: string;
  tag?: string;
  badge?: string;
  description: string;
  fullStory?: string;
  image: string;
  discountPercent: number;
  originalPrice: number;
  discountedPrice: number;
  chefTip?: string;
  highlights?: string[];
  idealRecipes?: string[];
  items: Array<{
    productId: string;
    weight: string;
    quantity?: number;
    role?: string;
    description?: string;
    keyNotes?: string[];
    product?: Record<string, unknown>;
  }>;
}

interface CombosListResponse {
  success: boolean;
  message: string;
  data: {
    combos: ComboApiRecord[];
  };
}

interface ComboDetailResponse {
  success: boolean;
  message: string;
  data: {
    combo: ComboApiRecord;
  };
}

export class ComboApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = "ComboApiError";
    this.status = status;
  }
}

const mapEmbeddedProduct = (record: Record<string, unknown>): Product => ({
  id: String(record.id),
  name: String(record.name || ""),
  slug: String(record.slug || ""),
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
  weightOptions: Array.isArray(record.weightOptions)
    ? (record.weightOptions as string[])
    : Array.isArray(record.weightVariants)
      ? (record.weightVariants as Array<Record<string, unknown>>).map((variant) =>
          String(variant.weight || ""),
        )
      : [String(record.defaultWeight || "100g")],
  defaultWeight: String(record.defaultWeight || "100g"),
  price: Number(record.price || 0),
  originalPrice: Number(record.originalPrice || record.compareAtPrice || record.price || 0),
  shortDescription: String(record.shortDescription || ""),
  fullDescription: String(record.fullDescription || record.shortDescription || ""),
  image: String(record.image || ""),
  secondaryImages: [],
  ingredients: [],
  benefits: [],
  storageInstructions: "",
  aromaProfile: "",
  spicinessLevel: 3,
  isFeatured: Boolean(record.isFeatured),
  isBestSeller: Boolean(record.isBestSeller),
  isNewArrival: Boolean(record.isNewArrival),
  bestFor: [],
  inStock: Boolean(record.inStock ?? true),
});

export const mapComboRecord = (record: ComboApiRecord): ComboItem => ({
  id: record.id,
  slug: record.slug,
  title: record.title,
  subtitle: record.subtitle,
  category: record.category,
  tag: record.tag || "",
  badge: record.badge,
  description: record.description,
  fullStory: record.fullStory,
  image: record.image,
  discountPercent: record.discountPercent || 0,
  originalPrice: record.originalPrice,
  discountedPrice: record.discountedPrice,
  highlights: record.highlights,
  idealRecipes: record.idealRecipes,
  chefTip: record.chefTip,
  items: record.items
    .filter((item) => item.product)
    .map((item) => ({
      product: mapEmbeddedProduct(item.product as Record<string, unknown>),
      weight: item.weight,
      quantity: item.quantity && item.quantity > 0 ? item.quantity : 1,
      role: item.role,
      description: item.description,
      keyNotes: item.keyNotes,
    })),
});

export const getComboRouteSlug = (combo: ComboItem) => combo.slug || combo.id;

export const getComboPrices = (combo: ComboItem) => {
  const originalTotal =
    combo.originalPrice ??
    combo.items.reduce((sum, item) => {
      const variant = item.product.weightVariants?.find((entry) => entry.weight === item.weight);
      const unitPrice = variant?.price ?? item.product.price;
      const quantity = item.quantity && item.quantity > 0 ? item.quantity : 1;
      return sum + unitPrice * quantity;
    }, 0);

  const comboPrice =
    combo.discountedPrice ?? Math.round(originalTotal * (1 - combo.discountPercent / 100));

  return {
    originalTotal,
    comboPrice,
    savings: originalTotal - comboPrice,
  };
};

export const fetchCombos = async (
  params: { category?: string; limit?: number } = {},
  signal?: AbortSignal,
): Promise<ComboItem[]> => {
  const searchParams = new URLSearchParams();
  if (params.category && params.category !== "all") {
    searchParams.set("category", params.category);
  }
  if (params.limit) {
    searchParams.set("limit", String(params.limit));
  }

  const query = searchParams.toString();
  const response = await fetch(`${API_URL}/v1/combos${query ? `?${query}` : ""}`, {
    signal,
  });

  const data = (await response.json().catch(() => ({}))) as CombosListResponse;

  if (!response.ok) {
    throw new ComboApiError(data.message || "Failed to load combos", response.status);
  }

  return data.data.combos.map(mapComboRecord);
};

export const fetchComboBySlug = async (slug: string, signal?: AbortSignal): Promise<ComboItem> => {
  const response = await fetch(`${API_URL}/v1/combos/${encodeURIComponent(slug)}`, {
    signal,
  });

  const data = (await response.json().catch(() => ({}))) as ComboDetailResponse;

  if (!response.ok) {
    throw new ComboApiError(data.message || "Failed to load combo", response.status);
  }

  return mapComboRecord(data.data.combo);
};
