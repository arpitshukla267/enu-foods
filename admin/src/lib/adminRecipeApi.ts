import { apiRequest } from "./apiClient";
import { Recipe, RecipeDifficulty, RecipeStatus } from "../types";

interface RecipeRecord {
  id: string;
  title: string;
  subtitle?: string;
  slug: string;
  prepTime?: string;
  cookTime?: string;
  difficulty?: RecipeDifficulty;
  servings?: string;
  image: string;
  description: string;
  enuSpicesUsed?: string[];
  ingredientsList?: string[];
  instructions?: string[];
  status: RecipeStatus;
  createdAt: string;
  updatedAt: string;
}

interface RecipesListResponse {
  success: boolean;
  message: string;
  data: {
    recipes: RecipeRecord[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  };
}

interface RecipeResponse {
  success: boolean;
  message: string;
  data: {
    recipe: RecipeRecord;
  };
}

export interface GetAdminRecipesParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: "all" | RecipeStatus;
}

export interface RecipePayload {
  title: string;
  subtitle?: string;
  slug?: string;
  prepTime?: string;
  cookTime?: string;
  difficulty?: RecipeDifficulty;
  servings?: string;
  image: string;
  description: string;
  enuSpicesUsed?: string[];
  ingredientsList?: string[];
  instructions?: string[];
  status?: RecipeStatus;
}

const mapRecipeRecord = (record: RecipeRecord): Recipe => ({
  id: record.id,
  title: record.title,
  subtitle: record.subtitle || "",
  slug: record.slug,
  prepTime: record.prepTime || "",
  cookTime: record.cookTime || "",
  difficulty: record.difficulty || "Easy",
  servings: record.servings || "",
  image: record.image,
  description: record.description,
  enuSpicesUsed: record.enuSpicesUsed || [],
  ingredientsList: record.ingredientsList || [],
  instructions: record.instructions || [],
  status: record.status,
  createdAt: record.createdAt,
  updatedAt: record.updatedAt,
});

export const getRecipes = async (params: GetAdminRecipesParams = {}) => {
  const searchParams = new URLSearchParams();
  if (params.page) searchParams.set("page", String(params.page));
  if (params.limit) searchParams.set("limit", String(params.limit));
  if (params.search) searchParams.set("search", params.search);
  if (params.status && params.status !== "all") searchParams.set("status", params.status);

  const query = searchParams.toString();
  const data = await apiRequest<RecipesListResponse>(
    `/v1/admin/recipes${query ? `?${query}` : ""}`,
  );

  return {
    recipes: data.data.recipes.map(mapRecipeRecord),
    pagination: data.data.pagination,
  };
};

export const getRecipeById = async (id: string) => {
  const data = await apiRequest<RecipeResponse>(`/v1/admin/recipes/${id}`);
  return mapRecipeRecord(data.data.recipe);
};

export const createRecipe = async (payload: RecipePayload) => {
  const data = await apiRequest<RecipeResponse>("/v1/admin/recipes", {
    method: "POST",
    body: payload,
  });
  return mapRecipeRecord(data.data.recipe);
};

export const updateRecipe = async (id: string, payload: Partial<RecipePayload>) => {
  const data = await apiRequest<RecipeResponse>(`/v1/admin/recipes/${id}`, {
    method: "PATCH",
    body: payload,
  });
  return mapRecipeRecord(data.data.recipe);
};

export const deleteRecipe = async (id: string) => {
  await apiRequest(`/v1/admin/recipes/${id}`, {
    method: "DELETE",
  });
};
