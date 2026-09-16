import { apiRequest } from "./apiClient";
import { Combo, ComboItem, ComboStatus } from "../types";

export interface AdminComboRecord {
  id: string;
  title: string;
  subtitle: string;
  slug: string;
  category: string;
  tag: string;
  badge: string;
  description: string;
  fullStory: string;
  fullDescription?: string;
  image: string;
  secondaryImages?: string[];
  discountPercent: number;
  chefTip: string;
  customChefTip?: string;
  highlights: string[];
  idealRecipes: string[];
  status: ComboStatus;
  items: ComboItem[];
  originalPrice: number;
  discountedPrice: number;
  price?: number;
  createdAt: string;
  updatedAt: string;
}

interface CombosListResponse {
  success: boolean;
  message: string;
  data: {
    combos: AdminComboRecord[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  };
}

interface ComboResponse {
  success: boolean;
  message: string;
  data: {
    combo: AdminComboRecord;
  };
}

export interface GetAdminCombosParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: ComboStatus | "all";
}

export type ComboSavePayload = Omit<Combo, "id" | "createdAt" | "updatedAt"> & {
  price?: number;
  fullDescription?: string;
  customChefTip?: string;
};

const mapAdminComboToCombo = (record: AdminComboRecord): Combo & {
  price: number;
  fullDescription: string;
  customChefTip: string;
} => ({
  id: record.id,
  title: record.title,
  subtitle: record.subtitle,
  slug: record.slug,
  category: record.category,
  tag: record.tag,
  badge: record.badge,
  description: record.description,
  fullStory: record.fullStory,
  fullDescription: record.fullDescription || record.fullStory,
  image: record.image,
  secondaryImages: record.secondaryImages || [],
  discountPercent: record.discountPercent,
  chefTip: record.chefTip,
  customChefTip: record.customChefTip || record.chefTip,
  highlights: record.highlights || [],
  idealRecipes: record.idealRecipes || [],
  status: record.status,
  items: record.items || [],
  originalPrice: record.originalPrice,
  discountedPrice: record.discountedPrice,
  price: record.price ?? record.discountedPrice,
  createdAt: record.createdAt,
  updatedAt: record.updatedAt,
});

const buildAdminPayload = (combo: ComboSavePayload) => ({
  title: combo.title,
  subtitle: combo.subtitle,
  slug: combo.slug,
  category: combo.category,
  tag: combo.tag,
  badge: combo.badge,
  description: combo.description,
  fullStory: combo.fullStory || combo.fullDescription || "",
  fullDescription: combo.fullDescription || combo.fullStory || "",
  image: combo.image,
  secondaryImages: combo.secondaryImages,
  discountPercent: combo.discountPercent,
  chefTip: combo.chefTip || combo.customChefTip || "",
  customChefTip: combo.customChefTip || combo.chefTip || "",
  highlights: combo.highlights,
  idealRecipes: combo.idealRecipes,
  status: combo.status,
  items: combo.items,
  originalPrice: combo.originalPrice,
  discountedPrice: combo.discountedPrice ?? combo.price,
  price: combo.price ?? combo.discountedPrice,
});

export const getCombos = async (
  params: GetAdminCombosParams = {},
): Promise<CombosListResponse["data"]> => {
  const searchParams = new URLSearchParams();
  if (params.page) searchParams.set("page", String(params.page));
  if (params.limit) searchParams.set("limit", String(params.limit));
  if (params.search) searchParams.set("search", params.search);
  if (params.status && params.status !== "all") searchParams.set("status", params.status);

  const query = searchParams.toString();
  const data = await apiRequest<CombosListResponse>(
    `/v1/admin/combos${query ? `?${query}` : ""}`,
  );

  return {
    combos: data.data.combos.map(mapAdminComboToCombo),
    pagination: data.data.pagination,
  };
};

export const createCombo = async (payload: ComboSavePayload) => {
  const data = await apiRequest<ComboResponse>("/v1/admin/combos", {
    method: "POST",
    body: buildAdminPayload(payload),
  });

  return mapAdminComboToCombo(data.data.combo);
};

export const updateCombo = async (id: string, payload: ComboSavePayload) => {
  const data = await apiRequest<ComboResponse>(`/v1/admin/combos/${id}`, {
    method: "PATCH",
    body: buildAdminPayload(payload),
  });

  return mapAdminComboToCombo(data.data.combo);
};

export const deleteCombo = async (id: string): Promise<void> => {
  await apiRequest(`/v1/admin/combos/${id}`, {
    method: "DELETE",
  });
};

export type { AdminComboRecord };
