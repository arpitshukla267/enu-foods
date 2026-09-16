import { useCallback, useEffect, useRef, useState } from "react";
import { ComboItem } from "../types";
import { ComboApiError, fetchCombos } from "../lib/comboApi";

interface UsePublicCombosOptions {
  category?: string;
  limit?: number;
  enabled?: boolean;
}

const CACHE_TTL_MS = 60_000;
const cache = new Map<string, { combos: ComboItem[]; fetchedAt: number }>();

export const usePublicCombos = (options: UsePublicCombosOptions = {}) => {
  const { category, limit, enabled = true } = options;
  const [combos, setCombos] = useState<ComboItem[]>([]);
  const [isLoading, setIsLoading] = useState(enabled);
  const [error, setError] = useState<string | null>(null);
  const requestIdRef = useRef(0);
  const abortRef = useRef<AbortController | null>(null);

  const cacheKey = JSON.stringify({
    category: category || "all",
    limit: limit ?? "",
  });

  const loadCombos = useCallback(async () => {
    if (!enabled) return;

    const cached = cache.get(cacheKey);
    if (cached && Date.now() - cached.fetchedAt < CACHE_TTL_MS) {
      setCombos(cached.combos);
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
      const nextCombos = await fetchCombos({ category, limit }, controller.signal);
      if (requestId !== requestIdRef.current) return;

      cache.set(cacheKey, { combos: nextCombos, fetchedAt: Date.now() });
      setCombos(nextCombos);
    } catch (fetchError) {
      if (controller.signal.aborted) return;
      if (requestId !== requestIdRef.current) return;

      setCombos([]);
      setError(
        fetchError instanceof ComboApiError
          ? fetchError.message
          : fetchError instanceof Error
            ? fetchError.message
            : "Failed to load combos",
      );
    } finally {
      if (requestId === requestIdRef.current && !controller.signal.aborted) {
        setIsLoading(false);
      }
    }
  }, [cacheKey, category, limit, enabled]);

  useEffect(() => {
    void loadCombos();

    return () => {
      abortRef.current?.abort();
    };
  }, [loadCombos]);

  return {
    combos,
    isLoading,
    error,
    reload: loadCombos,
  };
};
