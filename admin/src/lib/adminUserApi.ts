import { apiRequest } from "./apiClient";
import { User, UserStatus } from "../types";

export interface AdminUserRecord {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: "customer" | "admin";
  status: UserStatus;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface UsersListResponse {
  success: boolean;
  message: string;
  data: {
    users: AdminUserRecord[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  };
}

export interface UserDetailResponse {
  success: boolean;
  message: string;
  data: {
    user: AdminUserRecord;
  };
}

export interface UserStatsResponse {
  success: boolean;
  message: string;
  data: {
    totalUsers: number;
    activeUsers: number;
    newUsers: number;
  };
}

export interface GetUsersParams {
  page?: number;
  limit?: number;
  search?: string;
  role?: string;
  sort?: string;
}

export const mapAdminUserToUser = (record: AdminUserRecord): User => ({
  id: record.id,
  name: record.name,
  email: record.email,
  phone: record.phone,
  status: record.status,
  joinedDate: record.createdAt,
  totalOrders: 0,
  totalSpent: 0,
  averageOrderValue: 0,
  addresses: [],
  activityHistory: [],
});

export const getUsers = async (
  params: GetUsersParams = {},
): Promise<UsersListResponse["data"]> => {
  const searchParams = new URLSearchParams();

  if (params.page) searchParams.set("page", String(params.page));
  if (params.limit) searchParams.set("limit", String(params.limit));
  if (params.search) searchParams.set("search", params.search);
  if (params.role) searchParams.set("role", params.role);
  if (params.sort) searchParams.set("sort", params.sort);

  const query = searchParams.toString();
  const path = `/v1/admin/users${query ? `?${query}` : ""}`;

  const data = await apiRequest<UsersListResponse>(path);

  if (!data.data) {
    throw new Error("Invalid users response");
  }

  return data.data;
};

export const getUserById = async (id: string): Promise<AdminUserRecord> => {
  const data = await apiRequest<UserDetailResponse>(`/v1/admin/users/${id}`);

  if (!data.data?.user) {
    throw new Error("Invalid user detail response");
  }

  return data.data.user;
};

export const getUserStats = async (): Promise<UserStatsResponse["data"]> => {
  const data = await apiRequest<UserStatsResponse>("/v1/admin/users/stats");

  if (!data.data) {
    throw new Error("Invalid user stats response");
  }

  return data.data;
};
