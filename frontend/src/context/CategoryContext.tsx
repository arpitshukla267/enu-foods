import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { Category } from "../types";
import { ApiCategory, CategoryApiError, fetchCategories } from "../lib/categoryApi";

interface CategoryContextValue {
  categories: Category[];
  isLoading: boolean;
  error: string | null;
  refetchCategories: () => Promise<void>;
  getCategoryBySlug: (slug: string) => Category | undefined;
}

const CategoryContext = createContext<CategoryContextValue | undefined>(
  undefined,
);

const mapApiCategory = (record: ApiCategory): Category => ({
  id: record.id,
  name: record.name,
  slug: record.slug,
  description: record.description,
  image: record.image,
  subcategories: record.subcategories ?? [],
});

export const CategoryProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refetchCategories = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const records = await fetchCategories();
      setCategories(records.map(mapApiCategory));
    } catch (fetchError) {
      setCategories([]);
      setError(
        fetchError instanceof CategoryApiError
          ? fetchError.message
          : fetchError instanceof Error
            ? fetchError.message
            : "Failed to load categories",
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    refetchCategories();
  }, [refetchCategories]);

  const getCategoryBySlug = useCallback(
    (slug: string) => categories.find((category) => category.slug === slug),
    [categories],
  );

  const value = useMemo(
    () => ({
      categories,
      isLoading,
      error,
      refetchCategories,
      getCategoryBySlug,
    }),
    [categories, isLoading, error, refetchCategories, getCategoryBySlug],
  );

  return (
    <CategoryContext.Provider value={value}>{children}</CategoryContext.Provider>
  );
};

export const useCategories = (): CategoryContextValue => {
  const context = useContext(CategoryContext);

  if (!context) {
    throw new Error("useCategories must be used within CategoryProvider");
  }

  return context;
};
