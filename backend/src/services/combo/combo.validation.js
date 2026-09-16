import { parsePositiveInt, validateStatus } from "../product/product.validation.js";

const STATUS_OPTIONS = new Set(["active", "draft", "archived"]);

export const validateComboStatus = (status) => {
  if (!status) {
    return undefined;
  }

  if (!STATUS_OPTIONS.has(status)) {
    const error = new Error("Invalid combo status");
    error.statusCode = 400;
    throw error;
  }

  return status;
};

export const slugifyComboTitle = (value = "") =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");

const normalizeComboPayload = (payload = {}) => ({
  title: payload.title,
  subtitle: payload.subtitle,
  slug: payload.slug,
  category: payload.category,
  tag: payload.tag,
  badge: payload.badge,
  description: payload.description,
  fullStory: payload.fullStory ?? payload.fullDescription ?? "",
  image: payload.image,
  secondaryImages: payload.secondaryImages,
  discountPercent: payload.discountPercent,
  chefTip: payload.chefTip ?? payload.customChefTip ?? "",
  highlights: payload.highlights,
  idealRecipes: payload.idealRecipes,
  status: payload.status,
  items: payload.items,
  originalPrice: payload.originalPrice,
  discountedPrice: payload.discountedPrice ?? payload.price,
});

export const validateComboPayload = (payload, { isUpdate = false } = {}) => {
  const normalized = normalizeComboPayload(payload);
  const errors = [];

  if (!isUpdate || normalized.title !== undefined) {
    if (!normalized.title?.trim()) {
      errors.push("Combo title is required");
    }
  }

  if (!isUpdate || normalized.category !== undefined) {
    if (!normalized.category?.trim()) {
      errors.push("Combo category is required");
    }
  }

  if (!isUpdate || normalized.description !== undefined) {
    if (!normalized.description?.trim()) {
      errors.push("Combo description is required");
    }
  }

  if (!isUpdate || normalized.image !== undefined) {
    if (!normalized.image?.trim()) {
      errors.push("Combo image is required");
    }
  }

  if (!isUpdate || normalized.items !== undefined) {
    if (!Array.isArray(normalized.items) || normalized.items.length === 0) {
      errors.push("At least one product item is required");
    } else {
      normalized.items.forEach((item, index) => {
        if (!item?.productId?.trim()) {
          errors.push(`Item ${index + 1}: productId is required`);
        }
        if (!item?.weight?.trim()) {
          errors.push(`Item ${index + 1}: weight is required`);
        }
        if (item?.quantity !== undefined && item?.quantity !== null && item?.quantity !== "") {
          const quantity = Number(item.quantity);
          if (!Number.isInteger(quantity) || quantity < 1) {
            errors.push(`Item ${index + 1}: quantity must be a whole number of at least 1`);
          }
        }
      });

      const lineKeys = normalized.items
        .map((item) => `${item?.productId?.trim()}:${item?.weight?.trim()}`)
        .filter((key) => key && !key.endsWith(":"));
      if (new Set(lineKeys).size !== lineKeys.length) {
        errors.push(
          "Duplicate product and weight combinations are not allowed. Increase quantity instead.",
        );
      }
    }
  }

  if (normalized.originalPrice !== undefined) {
    const parsed = Number(normalized.originalPrice);
    if (Number.isNaN(parsed) || parsed < 0) {
      errors.push("Original price must be a non-negative number");
    }
  } else if (!isUpdate) {
    errors.push("Original price is required");
  }

  if (normalized.discountedPrice !== undefined) {
    const parsed = Number(normalized.discountedPrice);
    if (Number.isNaN(parsed) || parsed < 0) {
      errors.push("Discounted price must be a non-negative number");
    }
  } else if (!isUpdate) {
    errors.push("Discounted price is required");
  }

  if (normalized.discountPercent !== undefined) {
    const parsed = Number(normalized.discountPercent);
    if (Number.isNaN(parsed) || parsed < 0 || parsed > 100) {
      errors.push("Discount percent must be between 0 and 100");
    }
  }

  if (normalized.status !== undefined) {
    validateComboStatus(normalized.status);
  }

  if (errors.length > 0) {
    const error = new Error(errors.join(", "));
    error.statusCode = 400;
    throw error;
  }

  return normalized;
};

export { parsePositiveInt, validateStatus };
