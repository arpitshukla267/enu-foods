import { apiRequest } from "./apiClient";
import { Product, ProductStatus } from "../types";

export interface AdminProductRecord extends Product {
  compareAtPrice?: number;
  isBestSeller?: boolean;
  isNewArrival?: boolean;
  isActive?: boolean;
  images?: Array<{ url: string; publicId?: string }>;
}

interface ProductsListResponse {
  success: boolean;
  message: string;
  data: {
    products: AdminProductRecord[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  };
}

interface ProductResponse {
  success: boolean;
  message: string;
  data: {
    product: AdminProductRecord;
  };
}

export interface GetAdminProductsParams {
  page?: number;
  limit?: number;
  search?: string;
  category?: string;
  subcategory?: string;
  sort?: string;
  status?: ProductStatus | "all";
}

const mapAdminProductToProduct = (record: AdminProductRecord): Product => ({
  id: record.id,
  name: record.name,
  slug: record.slug,
  categoryId: record.categoryId,
  categoryName: record.categoryName,
  subcategoryId: record.subcategoryId,
  subcategoryName: record.subcategoryName,
  weightOptions: record.weightOptions,
  defaultWeight: record.defaultWeight,
  price: record.price,
  originalPrice: record.originalPrice ?? record.compareAtPrice ?? record.price,
  shortDescription: record.shortDescription,
  fullDescription: record.fullDescription,
  image: record.image,
  secondaryImages: record.secondaryImages || [],
  ingredients: record.ingredients || [],
  benefits: record.benefits || [],
  storageInstructions: record.storageInstructions || "",
  aromaProfile: record.aromaProfile || "",
  spicinessLevel: record.spicinessLevel || 3,
  isFeatured: record.isFeatured,
  isBestSeller: record.isBestSeller,
  isNewArrival: record.isNewArrival,
  status: record.status,
  bestFor: record.bestFor || [],
  createdAt: record.createdAt,
  updatedAt: record.updatedAt,
  salesCount: record.salesCount,
});

const buildAdminPayload = (
  product: Omit<Product, "id" | "createdAt" | "updatedAt"> & {
    isBestSeller?: boolean;
    isNewArrival?: boolean;
    images?: Array<{ url: string; publicId?: string }>;
  },
) => ({
  name: product.name,
  slug: product.slug,
  categoryId: product.categoryId,
  subcategoryId: product.subcategoryId,
  shortDescription: product.shortDescription,
  fullDescription: product.fullDescription,
  description: product.fullDescription,
  image: product.image,
  secondaryImages: product.secondaryImages,
  images: product.images,
  weightOptions: product.weightOptions,
  weightVariants: product.weightOptions,
  price: product.price,
  compareAtPrice: product.originalPrice,
  stock: product.weightOptions.reduce((total, variant) => total + variant.stock, 0),
  sku: product.weightOptions.find((variant) => variant.isDefault)?.sku || product.weightOptions[0]?.sku,
  defaultWeight: product.defaultWeight,
  ingredients: product.ingredients,
  benefits: product.benefits,
  bestFor: product.bestFor,
  storageInstructions: product.storageInstructions,
  aromaProfile: product.aromaProfile,
  spicinessLevel: product.spicinessLevel,
  isFeatured: product.isFeatured,
  isBestSeller: product.isBestSeller ?? false,
  isNewArrival: product.isNewArrival ?? false,
  status: product.status,
});

export const getProducts = async (
  params: GetAdminProductsParams = {},
): Promise<ProductsListResponse["data"]> => {
  const searchParams = new URLSearchParams();
  if (params.page) searchParams.set("page", String(params.page));
  if (params.limit) searchParams.set("limit", String(params.limit));
  if (params.search) searchParams.set("search", params.search);
  if (params.category && params.category !== "all") searchParams.set("category", params.category);
  if (params.subcategory && params.subcategory !== "all") searchParams.set("subcategory", params.subcategory);
  if (params.sort) searchParams.set("sort", params.sort);
  if (params.status && params.status !== "all") searchParams.set("status", params.status);

  const query = searchParams.toString();
  const data = await apiRequest<ProductsListResponse>(
    `/v1/admin/products${query ? `?${query}` : ""}`,
  );

  return {
    products: data.data.products.map(mapAdminProductToProduct),
    pagination: data.data.pagination,
  };
};

export const createProduct = async (
  payload: Omit<Product, "id" | "createdAt" | "updatedAt"> & {
    isBestSeller?: boolean;
    isNewArrival?: boolean;
  },
): Promise<Product> => {
  const data = await apiRequest<ProductResponse>("/v1/admin/products", {
    method: "POST",
    body: buildAdminPayload(payload),
  });

  return mapAdminProductToProduct(data.data.product);
};

export const updateProduct = async (
  id: string,
  payload: Partial<Product> & { isBestSeller?: boolean; isNewArrival?: boolean },
): Promise<Product> => {
  const data = await apiRequest<ProductResponse>(`/v1/admin/products/${id}`, {
    method: "PATCH",
    body: buildAdminPayload(payload as Product),
  });

  return mapAdminProductToProduct(data.data.product);
};

export const updateProductStatus = async (
  id: string,
  status: ProductStatus,
): Promise<Product> => {
  const data = await apiRequest<ProductResponse>(`/v1/admin/products/${id}/status`, {
    method: "PATCH",
    body: { status },
  });

  return mapAdminProductToProduct(data.data.product);
};

export const deleteProduct = async (id: string): Promise<void> => {
  await apiRequest(`/v1/admin/products/${id}`, {
    method: "DELETE",
  });
};

export const getProductById = async (id: string): Promise<Product> => {
  const data = await apiRequest<ProductResponse>(`/v1/admin/products/${id}`);
  return mapAdminProductToProduct(data.data.product);
};
