import { API_URL } from "./apiClient";

export interface ApiCategory {
  id: string;
  name: string;
  slug: string;
  description: string;
  image: string;
  subcategories?: ApiSubcategory[];
}

export interface ApiSubcategory {
  id: string;
  name: string;
  slug: string;
}

interface CategoriesResponse {
  success: boolean;
  message: string;
  data?: {
    categories: ApiCategory[];
  };
}

export class CategoryApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = "CategoryApiError";
    this.status = status;
  }
}

export const fetchCategories = async (): Promise<ApiCategory[]> => {
  const response = await fetch(`${API_URL}/v1/categories`);

  const data = (await response.json().catch(() => ({}))) as CategoriesResponse;

  if (!response.ok) {
    throw new CategoryApiError(
      data.message || "Failed to load categories",
      response.status,
    );
  }

  return data.data?.categories ?? [];
};
