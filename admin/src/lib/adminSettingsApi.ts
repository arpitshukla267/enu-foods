import { apiRequest } from "./apiClient";
import { StoreSettings } from "../types";

interface SettingsResponse {
  success: boolean;
  message: string;
  data: {
    settings: StoreSettings;
  };
}

export const getSettings = async (): Promise<StoreSettings> => {
  const data = await apiRequest<SettingsResponse>("/v1/admin/settings");
  return data.data.settings;
};

export const updateSettings = async (settings: StoreSettings): Promise<StoreSettings> => {
  const data = await apiRequest<SettingsResponse>("/v1/admin/settings", {
    method: "PUT",
    body: settings,
  });
  return data.data.settings;
};
