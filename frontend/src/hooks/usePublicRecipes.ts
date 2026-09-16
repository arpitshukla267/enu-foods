import { useCallback, useEffect, useRef, useState } from "react";
import { Recipe } from "../types";
import { RecipeApiError, fetchRecipes } from "../lib/recipeApi";

interface UsePublicRecipesOptions {
  search?: string;
  limit?: number;
  enabled?: boolean;
}

const CACHE_TTL_MS = 60_000;
const cache = new Map<string, { recipes: Recipe[]; fetchedAt: number }>();

export const usePublicRecipes = (options: UsePublicRecipesOptions = {}) => {
  const { search, limit, enabled = true } = options;
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [isLoading, setIsLoading] = useState(enabled);
  const [error, setError] = useState<string | null>(null);
  const requestIdRef = useRef(0);
  const abortRef = useRef<AbortController | null>(null);

  const cacheKey = JSON.stringify({
    search: search?.trim() || "",
    limit: limit ?? "",
  });

  const loadRecipes = useCallback(async () => {
    if (!enabled) return;

    const cached = cache.get(cacheKey);
    if (cached && Date.now() - cached.fetchedAt < CACHE_TTL_MS) {
      setRecipes(cached.recipes);
      setError(null);
      setIsLoading(false);
      return;
    }

    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;
    const requestId = ++requestIdRef.current;

    setIsLoading(true);
    setError(null);

    try {
      const nextRecipes = await fetchRecipes({ search, limit }, controller.signal);
      if (requestId !== requestIdRef.current) return;

      cache.set(cacheKey, { recipes: nextRecipes, fetchedAt: Date.now() });
      setRecipes(nextRecipes);
    } catch (fetchError) {
      if (controller.signal.aborted) return;
      if (requestId !== requestIdRef.current) return;

      setRecipes([]);
      setError(
        fetchError instanceof RecipeApiError
          ? fetchError.message
          : fetchError instanceof Error
            ? fetchError.message
            : "Failed to load recipes",
      );
    } finally {
      if (requestId === requestIdRef.current && !controller.signal.aborted) {
        setIsLoading(false);
      }
    }
  }, [cacheKey, search, limit, enabled]);

  useEffect(() => {
    void loadRecipes();

    return () => {
      abortRef.current?.abort();
    };
  }, [loadRecipes]);

  return {
    recipes,
    isLoading,
    error,
    reload: loadRecipes,
  };
};
