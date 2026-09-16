import { apiRequest } from "./apiClient";
import { PaymentMethod, ShippingAddress } from "../types";

export type OrderStatus =
  | "pending_payment"
  | "confirmed"
  | "processing"
  | "shipped"
  | "delivered"
  | "cancelled"
  | "payment_failed";

export type OrderPaymentStatus = "pending" | "paid" | "failed" | "refunded";

export interface OrderStatusHistoryItem {
  status: OrderStatus;
  paymentStatus?: OrderPaymentStatus;
  note?: string;
  timestamp: string;
}

export interface CustomerOrderItem {
  productId: string;
  productName: string;
  productSlug: string;
  image: string;
  sku: string;
  weight: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
}

export interface CustomerOrder {
  id: string;
  orderNumber: string;
  items: CustomerOrderItem[];
  shippingAddress: ShippingAddress;
  shippingMethod: "free" | "express";
  paymentMethod: PaymentMethod;
  subtotal: number;
  discount: number;
  shippingFee: number;
  total: number;
  coupon: { code: string; discount: number } | null;
  orderStatus: OrderStatus;
  paymentStatus: OrderPaymentStatus;
  trackingNumber: string;
  carrier: string;
  createdAt: string;
  updatedAt: string;
  statusHistory?: OrderStatusHistoryItem[];
}

export interface CreateOrderPayload {
  shippingAddress: ShippingAddress;
  shippingMethod: "free" | "express";
  paymentMethod: PaymentMethod;
  idempotencyKey?: string;
}

export interface CreateOrderResult {
  order: CustomerOrder;
  payment: {
    id: string;
    provider: string;
    status: string;
    amount: number;
    amountPaise: number;
  } | null;
  razorpay?: {
    keyId: string;
    orderId: string;
    amount: number;
    currency: string;
    orderNumber: string;
  };
}

interface CreateOrderResponse {
  success: boolean;
  message: string;
  data: CreateOrderResult;
}

interface OrdersListResponse {
  success: boolean;
  message: string;
  data: {
    orders: CustomerOrder[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  };
}

interface OrderResponse {
  success: boolean;
  message: string;
  data: {
    order: CustomerOrder;
  };
}

export const createOrder = async (payload: CreateOrderPayload) => {
  const data = await apiRequest<CreateOrderResponse>("/v1/orders", {
    method: "POST",
    body: payload,
  });
  return data.data;
};

export const getOrders = async (params: { page?: number; limit?: number } = {}) => {
  const searchParams = new URLSearchParams();
  if (params.page) searchParams.set("page", String(params.page));
  if (params.limit) searchParams.set("limit", String(params.limit));

  const query = searchParams.toString();
  const data = await apiRequest<OrdersListResponse>(
    `/v1/orders${query ? `?${query}` : ""}`,
  );

  return data.data;
};

export const getOrderById = async (orderId: string) => {
  const data = await apiRequest<OrderResponse>(`/v1/orders/${orderId}`);
  return data.data.order;
};

export const createIdempotencyKey = () => {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }

  return `order-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
};
