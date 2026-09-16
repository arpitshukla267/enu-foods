import { apiRequest } from "./apiClient";

export const uploadProductImage = async (file: File) => {
  const formData = new FormData();
  formData.append("image", file);

  const token = localStorage.getItem("enu_admin_token");
  const baseUrl = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

  const response = await fetch(`${baseUrl}/v1/admin/uploads/image`, {
    method: "POST",
    headers: token ? { Authorization: `Bearer ${token}` } : {},
    body: formData,
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Image upload failed");
  }

  return data.data as { url: string; publicId: string };
};
