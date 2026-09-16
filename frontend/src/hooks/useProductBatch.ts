import { useEffect, useState } from "react";
import {
  fetchProducts,
  mapListItemToProduct,
  ProductQueryParams,
} from "../lib/productApi";
import { Product } from "../types";

export const useProductBatch = (params: ProductQueryParams, enabled = true) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(enabled);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!enabled) {
      setProducts([]);
      setIsLoading(false);
      return;
    }

    const controller = new AbortController();
    setIsLoading(true);
    setError(null);

    fetchProducts(params, controller.signal)
      .then((data) => {
        setProducts(data.products.map(mapListItemToProduct));
      })
      .catch((fetchError) => {
        if (controller.signal.aborted) return;
        setProducts([]);
        setError(
          fetchError instanceof Error ? fetchError.message : "Failed to load products",
        );
      })
      .finally(() => {
        if (!controller.signal.aborted) {
          setIsLoading(false);
        }
      });

    return () => controller.abort();
  }, [
    enabled,
    params.search,
    params.category,
    params.subcategory,
    params.sort,
    params.limit,
    params.isFeatured,
    params.isBestSeller,
    params.isNewArrival,
    params.minPrice,
    params.maxPrice,
  ]);

  return { products, isLoading, error };
};
