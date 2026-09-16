import { apiRequest } from "./apiClient";
import { Coupon, CouponDiscountType } from "../types";

interface CouponsListResponse {
  success: boolean;
  message: string;
  data: {
    coupons: CouponRecord[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  };
}

interface CouponResponse {
  success: boolean;
  message: string;
  data: {
    coupon: CouponRecord;
  };
}

interface CouponRecord {
  id: string;
  code: string;
  description?: string;
  discountType: CouponDiscountType;
  discountValue: number;
  minimumCartValue?: number;
  maximumDiscount?: number;
  startDate: string;
  expiryDate: string;
  usageLimit?: number;
  usedCount?: number;
  perUserLimit?: number;
  applicableProducts?: string[];
  applicableCategories?: string[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface GetAdminCouponsParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: "all" | "active" | "inactive" | "expired" | "scheduled";
}

export interface CouponPayload {
  code: string;
  description?: string;
  discountType: CouponDiscountType;
  discountValue: number;
  minimumCartValue?: number;
  maximumDiscount?: number;
  startDate: string;
  expiryDate: string;
  usageLimit?: number;
  perUserLimit?: number;
  applicableProducts?: string[];
  applicableCategories?: string[];
  isActive?: boolean;
}

const mapCouponRecord = (record: CouponRecord): Coupon => ({
  id: record.id,
  code: record.code,
  description: record.description || "",
  discountType: record.discountType,
  discountValue: record.discountValue,
  minimumCartValue: record.minimumCartValue || 0,
  maximumDiscount: record.maximumDiscount || 0,
  startDate: record.startDate,
  expiryDate: record.expiryDate,
  usageLimit: record.usageLimit || 0,
  usedCount: record.usedCount || 0,
  perUserLimit: record.perUserLimit || 0,
  applicableProducts: record.applicableProducts || [],
  applicableCategories: record.applicableCategories || [],
  isActive: record.isActive,
  createdAt: record.createdAt,
  updatedAt: record.updatedAt,
});

export const getCoupons = async (params: GetAdminCouponsParams = {}) => {
  const searchParams = new URLSearchParams();
  if (params.page) searchParams.set("page", String(params.page));
  if (params.limit) searchParams.set("limit", String(params.limit));
  if (params.search) searchParams.set("search", params.search);
  if (params.status && params.status !== "all") searchParams.set("status", params.status);

  const query = searchParams.toString();
  const data = await apiRequest<CouponsListResponse>(
    `/v1/admin/coupons${query ? `?${query}` : ""}`,
  );

  return {
    coupons: data.data.coupons.map(mapCouponRecord),
    pagination: data.data.pagination,
  };
};

export const getCouponById = async (id: string) => {
  const data = await apiRequest<CouponResponse>(`/v1/admin/coupons/${id}`);
  return mapCouponRecord(data.data.coupon);
};

export const createCoupon = async (payload: CouponPayload) => {
  const data = await apiRequest<CouponResponse>("/v1/admin/coupons", {
    method: "POST",
    body: payload,
  });
  return mapCouponRecord(data.data.coupon);
};

export const updateCoupon = async (id: string, payload: Partial<CouponPayload>) => {
  const data = await apiRequest<CouponResponse>(`/v1/admin/coupons/${id}`, {
    method: "PATCH",
    body: payload,
  });
  return mapCouponRecord(data.data.coupon);
};

export const updateCouponStatus = async (id: string, isActive: boolean) => {
  const data = await apiRequest<CouponResponse>(`/v1/admin/coupons/${id}/status`, {
    method: "PATCH",
    body: { isActive },
  });
  return mapCouponRecord(data.data.coupon);
};

export const deleteCoupon = async (id: string) => {
  await apiRequest(`/v1/admin/coupons/${id}`, {
    method: "DELETE",
  });
};
