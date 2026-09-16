export const slugifyForSku = (value: string): string =>
  value
    .trim()
    .toUpperCase()
    .replace(/[^A-Z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");

export const generateVariantSku = (productName: string, weight: string): string => {
  const namePart = slugifyForSku(productName) || "PRODUCT";
  const weightPart = slugifyForSku(weight) || "VARIANT";
  return `ENU-${namePart}-${weightPart}`;
};

export const normalizeWeightLabel = (weight: string): string => weight.trim().toLowerCase();
