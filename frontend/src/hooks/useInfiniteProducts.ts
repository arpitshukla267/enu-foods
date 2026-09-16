import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  fetchProducts,
  getResponsiveBatchSize,
  mapListItemToProduct,
  mapSortToApi,
  ProductApiError,
  ProductQueryParams,
} from "../lib/productApi";
import { Product } from "../types";

interface UseInfiniteProductsOptions {
  search?: string;
  category?: string;
  subcategory?: string;
  sort?: string;
  minPrice?: number;
  maxPrice?: number;
  isFeatured?: boolean;
  isBestSeller?: boolean;
  isNewArrival?: boolean;
}

interface QueryCacheEntry {
  products: Product[];
  cursor: string | null;
  hasNextPage: boolean;
  fetchedAt: number;
}

const CACHE_MAX_ENTRIES = 8;
const CACHE_TTL_MS = 60_000;

const buildQueryKey = (params: ProductQueryParams) =>
  JSON.stringify({
    search: params.search || "",
    category: params.category || "",
    subcategory: params.subcategory || "",
    sort: params.sort || "newest",
    minPrice: params.minPrice ?? "",
    maxPrice: params.maxPrice ?? "",
    isFeatured: Boolean(params.isFeatured),
    isBestSeller: Boolean(params.isBestSeller),
    isNewArrival: Boolean(params.isNewArrival),
    limit: params.limit,
  });

const trimCache = (cache: Map<string, QueryCacheEntry>) => {
  if (cache.size <= CACHE_MAX_ENTRIES) return;

  const entries = [...cache.entries()].sort(
    (first, second) => first[1].fetchedAt - second[1].fetchedAt,
  );

  while (cache.size > CACHE_MAX_ENTRIES) {
    const oldest = entries.shift();
    if (oldest) cache.delete(oldest[0]);
  }
};

export const useInfiniteProducts = (options: UseInfiniteProductsOptions) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [cursor, setCursor] = useState<string | null>(null);
  const [hasNextPage, setHasNextPage] = useState(true);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [isFetchingNewQuery, setIsFetchingNewQuery] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [batchSize, setBatchSize] = useState(() =>
    typeof window !== "undefined" ? getResponsiveBatchSize(window.innerWidth) : 12,
  );

  const requestIdRef = useRef(0);
  const abortRef = useRef<AbortController | null>(null);
  const loadingMoreRef = useRef(false);
  const productsRef = useRef<Product[]>([]);
  const queryCacheRef = useRef<Map<string, QueryCacheEntry>>(new Map());
  const activeQueryKeyRef = useRef("");

  useEffect(() => {
    productsRef.current = products;
  }, [products]);

  const queryParams = useMemo<ProductQueryParams>(
    () => ({
      search: options.search?.trim() || undefined,
      category: options.category && options.category !== "All" ? options.category : undefined,
      subcategory: options.subcategory,
      sort: mapSortToApi(options.sort || "newest"),
      minPrice: options.minPrice,
      maxPrice: options.maxPrice,
      isFeatured: options.isFeatured,
      isBestSeller: options.isBestSeller,
      isNewArrival: options.isNewArrival,
      limit: batchSize,
    }),
    [
      options.search,
      options.category,
      options.subcategory,
      options.sort,
      options.minPrice,
      options.maxPrice,
      options.isFeatured,
      options.isBestSeller,
      options.isNewArrival,
      batchSize,
    ],
  );

  const queryKey = useMemo(() => buildQueryKey(queryParams), [queryParams]);

  useEffect(() => {
    const handleResize = () => {
      setBatchSize(getResponsiveBatchSize(window.innerWidth));
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const loadProducts = useCallback(
    async ({
      reset = false,
      nextCursor = null,
      queryKeyOverride,
    }: {
      reset?: boolean;
      nextCursor?: string | null;
      queryKeyOverride?: string;
    }) => {
      const requestQueryKey = queryKeyOverride || queryKey;
      const requestId = ++requestIdRef.current;

      if (reset) {
        abortRef.current?.abort();
        activeQueryKeyRef.current = requestQueryKey;

        const cached = queryCacheRef.current.get(requestQueryKey);
        const hasVisibleProducts = productsRef.current.length > 0;
        const canUseCache =
          cached && Date.now() - cached.fetchedAt < CACHE_TTL_MS;

        if (canUseCache) {
          setProducts(cached.products);
          setCursor(cached.cursor);
          setHasNextPage(cached.hasNextPage);
          setIsInitialLoading(false);
          setIsFetchingNewQuery(true);
        } else if (hasVisibleProducts) {
          setIsFetchingNewQuery(true);
          setIsInitialLoading(false);
          setCursor(null);
          setHasNextPage(true);
        } else {
          setIsInitialLoading(true);
          setIsFetchingNewQuery(false);
          setProducts([]);
          setCursor(null);
          setHasNextPage(true);
        }

        setError(null);
      } else {
        if (loadingMoreRef.current) return;
        loadingMoreRef.current = true;
        setIsLoadingMore(true);
      }

      const controller = new AbortController();
      abortRef.current = controller;

      try {
        const data = await fetchProducts(
          {
            ...queryParams,
            cursor: nextCursor || undefined,
          },
          controller.signal,
        );

        if (requestId !== requestIdRef.current) return;
        if (activeQueryKeyRef.current !== requestQueryKey) return;

        const mapped = data.products.map(mapListItemToProduct);
        const nextPageCursor = data.pagination.nextCursor;
        const nextHasPage = Boolean(nextPageCursor);

        if (reset) {
          setProducts(mapped);
          queryCacheRef.current.set(requestQueryKey, {
            products: mapped,
            cursor: nextPageCursor,
            hasNextPage: nextHasPage,
            fetchedAt: Date.now(),
          });
          trimCache(queryCacheRef.current);
        } else {
          setProducts((current) => {
            const existingIds = new Set(current.map((product) => product.id));
            return [
              ...current,
              ...mapped.filter((product) => !existingIds.has(product.id)),
            ];
          });
        }

        setCursor(nextPageCursor);
        setHasNextPage(nextHasPage);
        setError(null);
      } catch (fetchError) {
        if (controller.signal.aborted) return;
        if (requestId !== requestIdRef.current) return;
        if (activeQueryKeyRef.current !== requestQueryKey) return;

        setError(
          fetchError instanceof ProductApiError
            ? fetchError.message
            : fetchError instanceof Error
              ? fetchError.message
              : "Failed to load products",
        );
      } finally {
        if (requestId !== requestIdRef.current) return;
        if (activeQueryKeyRef.current !== requestQueryKey) return;

        setIsInitialLoading(false);
        setIsFetchingNewQuery(false);
        setIsLoadingMore(false);
        loadingMoreRef.current = false;
      }
    },
    [queryKey, queryParams],
  );

  const loadProductsRef = useRef(loadProducts);
  loadProductsRef.current = loadProducts;

  useEffect(() => {
    loadProductsRef.current({ reset: true, queryKeyOverride: queryKey });
  }, [queryKey]);

  const loadMore = useCallback(async () => {
    if (
      !hasNextPage ||
      isInitialLoading ||
      isFetchingNewQuery ||
      isLoadingMore ||
      !cursor
    ) {
      return;
    }

    await loadProducts({ reset: false, nextCursor: cursor, queryKeyOverride: queryKey });
  }, [
    cursor,
    hasNextPage,
    isInitialLoading,
    isFetchingNewQuery,
    isLoadingMore,
    loadProducts,
    queryKey,
  ]);

  const retry = useCallback(async () => {
    await loadProducts({ reset: true, queryKeyOverride: queryKey });
  }, [loadProducts, queryKey]);

  return {
    products,
    isInitialLoading,
    isFetchingNewQuery,
    isLoadingMore,
    hasNextPage,
    error,
    batchSize,
    loadMore,
    retry,
  };
};
