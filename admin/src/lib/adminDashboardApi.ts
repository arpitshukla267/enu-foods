import { apiRequest } from "./apiClient";
import { DashboardStats, Order, User, UserStatus } from "../types";
import { mapOrderRecord, AdminOrderRecord } from "./adminOrderApi";

export type DashboardDateRange = "7d" | "30d" | "3m" | "12m";

export interface DashboardSummary {
  totalSales: number;
  periodSales: number;
  totalOrders: number;
  pendingOrders: number;
  products: number;
  activeProducts: number;
  lowStock: number;
  customers: number;
  activeCoupons: number;
  categories: number;
  deliveredOrders: number;
}

export interface DashboardTopBuyer {
  id: string;
  name: string;
  email: string;
  phone: string;
  status: UserStatus;
  joinedDate: string;
  lastOrderDate?: string;
  totalOrders: number;
  totalSpent: number;
  averageOrderValue: number;
  addresses: User["addresses"];
  activityHistory: User["activityHistory"];
}

interface DashboardResponse {
  success: boolean;
  message: string;
  data: {
    summary: DashboardSummary;
    stats: DashboardStats;
    recentOrders: AdminOrderRecord[];
    topBuyers: DashboardTopBuyer[];
  };
}

interface DashboardSummaryResponse {
  success: boolean;
  message: string;
  data: {
    summary: Pick<
      DashboardSummary,
      "pendingOrders" | "lowStock" | "totalOrders" | "totalSales" | "products" | "customers"
    >;
  };
}

export interface AdminDashboardData {
  summary: DashboardSummary;
  stats: DashboardStats;
  recentOrders: Order[];
  topBuyers: User[];
}

const mapTopBuyerToUser = (buyer: DashboardTopBuyer): User => ({
  id: buyer.id,
  name: buyer.name,
  email: buyer.email,
  phone: buyer.phone,
  status: buyer.status,
  joinedDate: buyer.joinedDate,
  lastOrderDate: buyer.lastOrderDate,
  totalOrders: buyer.totalOrders,
  totalSpent: buyer.totalSpent,
  averageOrderValue: buyer.averageOrderValue,
  addresses: buyer.addresses,
  activityHistory: buyer.activityHistory,
});

export const getDashboard = async (
  range: DashboardDateRange = "30d",
): Promise<AdminDashboardData> => {
  const data = await apiRequest<DashboardResponse>(
    `/v1/admin/dashboard?range=${encodeURIComponent(range)}`,
  );

  if (!data.data) {
    throw new Error("Invalid dashboard response");
  }

  return {
    summary: data.data.summary,
    stats: data.data.stats,
    recentOrders: data.data.recentOrders.map(mapOrderRecord),
    topBuyers: data.data.topBuyers.map(mapTopBuyerToUser),
  };
};

export const getDashboardSummary = async (): Promise<
  DashboardSummaryResponse["data"]["summary"]
> => {
  const data = await apiRequest<DashboardSummaryResponse>("/v1/admin/dashboard/summary");

  if (!data.data?.summary) {
    throw new Error("Invalid dashboard summary response");
  }

  return data.data.summary;
};
