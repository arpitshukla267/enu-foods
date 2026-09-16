import { Recipe } from "../types";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export interface RecipeApiRecord {
  id: string;
  slug: string;
  title: string;
  subtitle?: string;
  prepTime?: string;
  cookTime?: string;
  difficulty?: Recipe["difficulty"];
  servings?: string;
  image: string;
  description: string;
  enuSpicesUsed?: string[];
  ingredientsList?: string[];
  instructions?: string[];
}

interface RecipesListResponse {
  success: boolean;
  message: string;
  data: {
    recipes: RecipeApiRecord[];
  };
}

interface RecipeDetailResponse {
  success: boolean;
  message: string;
  data: {
    recipe: RecipeApiRecord;
  };
}

export class RecipeApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = "RecipeApiError";
    this.status = status;
  }
}

export const mapRecipeRecord = (record: RecipeApiRecord): Recipe => ({
  id: record.id,
  slug: record.slug,
  title: record.title,
  subtitle: record.subtitle || "",
  prepTime: record.prepTime || "",
  cookTime: record.cookTime || "",
  difficulty: record.difficulty || "Easy",
  servings: record.servings || "",
  image: record.image,
  description: record.description,
  enuSpicesUsed: record.enuSpicesUsed || [],
  ingredientsList: record.ingredientsList || [],
  instructions: record.instructions || [],
});

export const getRecipeRouteSlug = (recipe: Recipe) => recipe.slug || recipe.id;

export const fetchRecipes = async (
  params: { search?: string; limit?: number } = {},
  signal?: AbortSignal,
): Promise<Recipe[]> => {
  const searchParams = new URLSearchParams();
  if (params.search?.trim()) {
    searchParams.set("search", params.search.trim());
  }
  if (params.limit) {
    searchParams.set("limit", String(params.limit));
  }

  const query = searchParams.toString();
  const response = await fetch(`${API_URL}/v1/recipes${query ? `?${query}` : ""}`, {
    signal,
  });

  const data = (await response.json().catch(() => ({}))) as RecipesListResponse;

  if (!response.ok) {
    throw new RecipeApiError(data.message || "Failed to load recipes", response.status);
  }

  return data.data.recipes.map(mapRecipeRecord);
};

export const fetchRecipeBySlug = async (slug: string, signal?: AbortSignal): Promise<Recipe> => {
  const response = await fetch(`${API_URL}/v1/recipes/${encodeURIComponent(slug)}`, {
    signal,
  });

  const data = (await response.json().catch(() => ({}))) as RecipeDetailResponse;

  if (!response.ok) {
    throw new RecipeApiError(data.message || "Failed to load recipe", response.status);
  }

  return mapRecipeRecord(data.data.recipe);
};
