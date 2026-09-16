import { apiRequest } from "./apiClient";
import { Category, CategoryStatus, Subcategory } from "../types";

export interface AdminCategoryRecord {
  id: string;
  name: string;
  slug: string;
  description: string;
  image: string;
  status: CategoryStatus;
  productCount: number;
  subcategories: Subcategory[];
  createdAt?: string;
  updatedAt?: string;
}

interface CategoriesListResponse {
  success: boolean;
  message: string;
  data: {
    categories: AdminCategoryRecord[];
  };
}

interface CategoryResponse {
  success: boolean;
  message: string;
  data: {
    category: AdminCategoryRecord;
  };
}

export const mapAdminCategoryToCategory = (
  record: AdminCategoryRecord,
): Category => ({
  id: record.id,
  name: record.name,
  slug: record.slug,
  description: record.description,
  image: record.image,
  status: record.status,
  productCount: record.productCount,
  subcategories: record.subcategories,
});

export const getCategories = async (): Promise<Category[]> => {
  const data = await apiRequest<CategoriesListResponse>("/v1/admin/categories");

  if (!data.data?.categories) {
    throw new Error("Invalid categories response");
  }

  return data.data.categories.map(mapAdminCategoryToCategory);
};

export const createCategory = async (
  payload: Omit<Category, "id" | "subcategories" | "productCount">,
): Promise<Category> => {
  const data = await apiRequest<CategoryResponse>("/v1/admin/categories", {
    method: "POST",
    body: payload,
  });

  if (!data.data?.category) {
    throw new Error("Invalid create category response");
  }

  return mapAdminCategoryToCategory(data.data.category);
};

export const updateCategory = async (
  id: string,
  updates: Partial<Pick<Category, "name" | "slug" | "description" | "image" | "status">>,
): Promise<Category> => {
  const data = await apiRequest<CategoryResponse>(`/v1/admin/categories/${id}`, {
    method: "PATCH",
    body: updates,
  });

  if (!data.data?.category) {
    throw new Error("Invalid update category response");
  }

  return mapAdminCategoryToCategory(data.data.category);
};

export const deleteCategory = async (id: string): Promise<void> => {
  await apiRequest(`/v1/admin/categories/${id}`, {
    method: "DELETE",
  });
};

export const addSubcategory = async (
  categoryId: string,
  payload: { name: string; slug: string; status?: CategoryStatus },
): Promise<Category> => {
  const data = await apiRequest<CategoryResponse>(
    `/v1/admin/categories/${categoryId}/subcategories`,
    {
      method: "POST",
      body: payload,
    },
  );

  if (!data.data?.category) {
    throw new Error("Invalid add subcategory response");
  }

  return mapAdminCategoryToCategory(data.data.category);
};

export const updateSubcategory = async (
  categoryId: string,
  subcategoryId: string,
  updates: Partial<Pick<Subcategory, "name" | "slug" | "status">>,
): Promise<Category> => {
  const data = await apiRequest<CategoryResponse>(
    `/v1/admin/categories/${categoryId}/subcategories/${subcategoryId}`,
    {
      method: "PATCH",
      body: updates,
    },
  );

  if (!data.data?.category) {
    throw new Error("Invalid update subcategory response");
  }

  return mapAdminCategoryToCategory(data.data.category);
};

export const deleteSubcategory = async (
  categoryId: string,
  subcategoryId: string,
): Promise<Category> => {
  const data = await apiRequest<CategoryResponse>(
    `/v1/admin/categories/${categoryId}/subcategories/${subcategoryId}`,
    {
      method: "DELETE",
    },
  );

  if (!data.data?.category) {
    throw new Error("Invalid delete subcategory response");
  }

  return mapAdminCategoryToCategory(data.data.category);
};
