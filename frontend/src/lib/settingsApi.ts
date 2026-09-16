import { apiRequest } from "./apiClient";

export interface StoreSettings {
  storeName: string;
  currency: string;
  supportEmail: string;
  supportPhone: string;
  address: string;
  freeShippingThreshold: number;
  standardShippingFee: number;
  expressShippingFee: number;
  taxRatePercent: number;
  gstNumber: string;
}

export const DEFAULT_SETTINGS: StoreSettings = {
  storeName: "ENU Foods",
  currency: "₹",
  supportEmail: "care@enufoods.com",
  supportPhone: "+91 98765 43210",
  address: "Spice Processing Mill #14, Industrial Estate, Kochi, Kerala 682001",
  freeShippingThreshold: 999,
  standardShippingFee: 60,
  expressShippingFee: 49,
  taxRatePercent: 5,
  gstNumber: "32AABCE1234F1Z8",
};

interface SettingsResponse {
  success: boolean;
  message: string;
  data: {
    settings: StoreSettings;
  };
}

export const getPublicSettings = async (): Promise<StoreSettings> => {
  try {
    const data = await apiRequest<SettingsResponse>("/v1/settings");
    return data.data.settings;
  } catch {
    return DEFAULT_SETTINGS;
  }
};
