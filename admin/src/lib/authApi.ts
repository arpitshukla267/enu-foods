import { apiRequest, setAuthToken } from "./apiClient";

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: "customer" | "admin";
}

interface AuthResponse {
  success: boolean;
  message: string;
  data?: {
    token: string;
    user: AuthUser;
  };
}

interface MeResponse {
  success: boolean;
  message?: string;
  data?: {
    user: AuthUser;
  };
}

const USER_KEY = "enu_admin_user";

export const getStoredUser = (): AuthUser | null => {
  const raw = localStorage.getItem(USER_KEY);
  if (!raw) return null;

  try {
    return JSON.parse(raw) as AuthUser;
  } catch {
    return null;
  }
};

export const setStoredUser = (user: AuthUser | null): void => {
  if (user) {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  } else {
    localStorage.removeItem(USER_KEY);
  }
};

export const loginAdmin = async (payload: {
  email: string;
  password: string;
}): Promise<AuthUser> => {
  const data = await apiRequest<AuthResponse>("/auth/login", {
    method: "POST",
    auth: false,
    body: payload,
  });

  if (!data.data?.token || !data.data.user) {
    throw new Error("Invalid login response");
  }

  if (data.data.user.role !== "admin") {
    throw new Error("Access denied. Admin account required.");
  }

  setAuthToken(data.data.token);
  setStoredUser(data.data.user);

  return data.data.user;
};

export const fetchCurrentUser = async (): Promise<AuthUser> => {
  const data = await apiRequest<MeResponse>("/auth/me");

  if (!data.data?.user) {
    throw new Error("Unable to restore session");
  }

  if (data.data.user.role !== "admin") {
    throw new Error("Access denied. Admin account required.");
  }

  setStoredUser(data.data.user);
  return data.data.user;
};

export const logoutAdmin = (): void => {
  setAuthToken(null);
  setStoredUser(null);
};
