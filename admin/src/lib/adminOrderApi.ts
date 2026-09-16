import { apiRequest } from "./apiClient";
import { Order, OrderStatus, PaymentStatus, PaymentMethod } from "../types";

export interface AdminOrderRecord {
  id: string;
  orderNumber: string;
  customer: {
    id: string;
    name: string;
    email: string;
    phone: string;
    address: {
      street: string;
      city: string;
      state: string;
      pincode: string;
      country: string;
    };
  } | null;
  items: Array<{
    productId: string;
    productName: string;
    image: string;
    weight: string;
    unitPrice?: number;
    price?: number;
    quantity: number;
    subtotal: number;
  }>;
  subtotal: number;
  discount: number;
  shippingFee: number;
  tax: number;
  total: number;
  paymentStatus: PaymentStatus;
  paymentMethod: PaymentMethod;
  orderStatus: OrderStatus;
  shippingMethod?: string;
  trackingNumber?: string;
  carrier?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
  statusHistory: Array<{
    status: OrderStatus;
    timestamp: string;
    note?: string;
  }>;
}

interface OrdersListResponse {
  success: boolean;
  message: string;
  data: {
    orders: AdminOrderRecord[];
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
    order: AdminOrderRecord;
  };
}

export interface GetAdminOrdersParams {
  page?: number;
  limit?: number;
  search?: string;
  orderStatus?: string;
  paymentStatus?: string;
  sort?: "newest" | "oldest" | "amount-high" | "amount-low";
}

export const mapOrderRecord = (record: AdminOrderRecord): Order => ({
  id: record.id,
  orderNumber: record.orderNumber,
  customer: record.customer
    ? {
        id: record.customer.id,
        name: record.customer.name,
        email: record.customer.email,
        phone: record.customer.phone,
        address: record.customer.address,
      }
    : {
        id: "",
        name: "Unknown",
        email: "",
        phone: "",
        address: {
          street: "",
          city: "",
          state: "",
          pincode: "",
          country: "India",
        },
      },
  items: record.items.map((item) => ({
    productId: item.productId,
    productName: item.productName,
    image: item.image,
    weight: item.weight,
    price: item.price ?? item.unitPrice ?? 0,
    quantity: item.quantity,
    subtotal: item.subtotal,
  })),
  subtotal: record.subtotal,
  discount: record.discount,
  shippingFee: record.shippingFee,
  tax: record.tax,
  total: record.total,
  paymentStatus: record.paymentStatus,
  paymentMethod: record.paymentMethod,
  orderStatus: record.orderStatus,
  shippingMethod: record.shippingMethod || 'free',
  trackingNumber: record.trackingNumber,
  carrier: record.carrier,
  notes: record.notes,
  createdAt: record.createdAt,
  updatedAt: record.updatedAt,
  statusHistory: record.statusHistory,
});

export const getOrders = async (params: GetAdminOrdersParams = {}) => {
  const searchParams = new URLSearchParams();
  if (params.page) searchParams.set("page", String(params.page));
  if (params.limit) searchParams.set("limit", String(params.limit));
  if (params.search) searchParams.set("search", params.search);
  if (params.orderStatus && params.orderStatus !== "all") {
    searchParams.set("orderStatus", params.orderStatus);
  }
  if (params.paymentStatus && params.paymentStatus !== "all") {
    searchParams.set("paymentStatus", params.paymentStatus);
  }
  if (params.sort) searchParams.set("sort", params.sort);

  const query = searchParams.toString();
  const data = await apiRequest<OrdersListResponse>(
    `/v1/admin/orders${query ? `?${query}` : ""}`,
  );

  return {
    orders: data.data.orders.map(mapOrderRecord),
    pagination: data.data.pagination,
  };
};

export const getOrderById = async (id: string) => {
  const data = await apiRequest<OrderResponse>(`/v1/admin/orders/${id}`);
  return mapOrderRecord(data.data.order);
};

export const updateOrderStatus = async (
  id: string,
  payload: {
    orderStatus: OrderStatus;
    paymentStatus: PaymentStatus;
    trackingNumber?: string;
    carrier?: string;
    notes?: string;
    note?: string;
  },
) => {
  const data = await apiRequest<OrderResponse>(`/v1/admin/orders/${id}/status`, {
    method: "PATCH",
    body: payload,
  });
  return mapOrderRecord(data.data.order);
};
