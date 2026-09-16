import { apiRequest } from "./apiClient";
import { Product } from "../types";

export type CartItemStatus =
  | "available"
  | "out_of_stock"
  | "inactive"
  | "variant_unavailable"
  | "quantity_exceeded";

export interface ServerCartItem {
  itemId: string;
  productId: string;
  name: string;
  slug: string;
  image: string;
  weight: string;
  quantity: number;
  unitPrice: number;
  unitPricePaise: number;
  subtotal: number;
  subtotalPaise: number;
  stock: number;
  status: CartItemStatus;
  isAvailable: boolean;
  statusMessage: string;
  product: Product | null;
}

export interface CartSummary {
  items: ServerCartItem[];
  subtotal: number;
  subtotalPaise: number;
  totalItems: number;
  coupon?: {
    code: string;
    discount: number;
  } | null;
  discount?: number;
  discountPaise?: number;
  total?: number;
  totalPaise?: number;
}

interface CartResponse {
  success: boolean;
  message: string;
  data: {
    cart: CartSummary;
    mergeWarnings?: Array<{
      productId: string;
      weight: string;
      message: string;
    }>;
  };
}

export interface GuestCartPayloadItem {
  productId: string;
  weight: string;
  quantity: number;
}

export const getCart = async (): Promise<CartSummary> => {
  const data = await apiRequest<CartResponse>("/v1/cart");
  return data.data.cart;
};

export const addToCart = async (payload: {
  productId: string;
  weight: string;
  quantity?: number;
}): Promise<CartSummary> => {
  const data = await apiRequest<CartResponse>("/v1/cart/items", {
    method: "POST",
    body: {
      productId: payload.productId,
      weight: payload.weight,
      quantity: payload.quantity ?? 1,
    },
  });

  return data.data.cart;
};

export const updateCartItem = async (
  itemId: string,
  quantity: number,
): Promise<CartSummary> => {
  const data = await apiRequest<CartResponse>(`/v1/cart/items/${itemId}`, {
    method: "PATCH",
    body: { quantity },
  });

  return data.data.cart;
};

export const removeCartItem = async (itemId: string): Promise<CartSummary> => {
  const data = await apiRequest<CartResponse>(`/v1/cart/items/${itemId}`, {
    method: "DELETE",
  });

  return data.data.cart;
};

export const clearCart = async (): Promise<CartSummary> => {
  const data = await apiRequest<CartResponse>("/v1/cart", {
    method: "DELETE",
  });

  return data.data.cart;
};

export const mergeGuestCart = async (
  items: GuestCartPayloadItem[],
): Promise<{ cart: CartSummary; mergeWarnings: CartResponse["data"]["mergeWarnings"] }> => {
  const data = await apiRequest<CartResponse>("/v1/cart/merge", {
    method: "POST",
    body: { items },
  });

  return {
    cart: data.data.cart,
    mergeWarnings: data.data.mergeWarnings || [],
  };
};

export const applyCoupon = async (code: string): Promise<CartSummary> => {
  const data = await apiRequest<CartResponse>("/v1/cart/coupon", {
    method: "POST",
    body: { code },
  });

  return data.data.cart;
};

export const removeCoupon = async (): Promise<CartSummary> => {
  const data = await apiRequest<CartResponse>("/v1/cart/coupon", {
    method: "DELETE",
  });

  return data.data.cart;
};

export const mapServerItemToCartItem = (item: ServerCartItem) => {
  const product: Product = item.product || {
    id: item.productId,
    name: item.name,
    slug: item.slug,
    category: "",
    weightOptions: [item.weight],
    weightVariants: [
      {
        weight: item.weight,
        price: item.unitPrice,
        originalPrice: item.unitPrice,
        inStock: item.stock > 0,
      },
    ],
    defaultWeight: item.weight,
    price: item.unitPrice,
    originalPrice: item.unitPrice,
    shortDescription: "",
    fullDescription: "",
    image: item.image,
    ingredients: [],
    benefits: [],
    storageInstructions: "",
    aromaProfile: "",
    spicinessLevel: 3,
    bestFor: [],
    inStock: item.stock > 0,
  };

  return {
    id: item.itemId,
    product,
    selectedWeight: item.weight,
    quantity: item.quantity,
    unitPrice: item.unitPrice,
    subtotal: item.subtotal,
    stock: item.stock,
    status: item.status,
    isAvailable: item.isAvailable,
    statusMessage: item.statusMessage,
  };
};

export const mapCartSummaryToItems = (cart: CartSummary) =>
  cart.items.map(mapServerItemToCartItem);
