const SORT_OPTIONS = new Set([
  "newest",
  "oldest",
  "price-asc",
  "price-desc",
  "name-asc",
  "name-desc",
]);

const ADMIN_SORT_OPTIONS = new Set([
  "newest",
  "oldest",
  "price-asc",
  "price-desc",
  "name-asc",
  "name-desc",
  "stock-asc",
  "stock-desc",
]);

const STATUS_OPTIONS = new Set(["active", "draft", "archived"]);

export const parsePositiveInt = (value, fallback, max) => {
  const parsed = Number.parseInt(value, 10);
  if (Number.isNaN(parsed) || parsed < 1) {
    return fallback;
  }

  return Math.min(parsed, max);
};

export const parseNonNegativeNumber = (value) => {
  if (value === undefined || value === null || value === "") {
    return undefined;
  }

  const parsed = Number(value);
  if (Number.isNaN(parsed) || parsed < 0) {
    const error = new Error("Price values must be non-negative numbers");
    error.statusCode = 400;
    throw error;
  }

  return parsed;
};

export const validateSort = (sort, allowed = SORT_OPTIONS) => {
  if (!sort) {
    return "newest";
  }

  if (!allowed.has(sort)) {
    const error = new Error("Invalid sort option");
    error.statusCode = 400;
    throw error;
  }

  return sort;
};

export const validateStatus = (status) => {
  if (!status) {
    return undefined;
  }

  if (!STATUS_OPTIONS.has(status)) {
    const error = new Error("Invalid product status");
    error.statusCode = 400;
    throw error;
  }

  return status;
};

export const validateProductPayload = (payload, { isUpdate = false } = {}) => {
  const errors = [];

  if (!isUpdate || payload.name !== undefined) {
    if (!payload.name?.trim()) {
      errors.push("Product name is required");
    }
  }

  if (!isUpdate || payload.slug !== undefined) {
    if (!payload.slug?.trim()) {
      errors.push("Product slug is required");
    }
  }

  if (!isUpdate || payload.sku !== undefined) {
    if (!payload.sku?.trim()) {
      errors.push("Product SKU is required");
    }
  }

  if (!isUpdate || payload.categoryId !== undefined) {
    if (!payload.categoryId) {
      errors.push("Category is required");
    }
  }

  if (!isUpdate || payload.price !== undefined) {
    const price = Number(payload.price);
    if (Number.isNaN(price) || price < 0) {
      errors.push("Price must be a non-negative number");
    }
  }

  if (payload.compareAtPrice !== undefined) {
    const compareAtPrice = Number(payload.compareAtPrice);
    if (Number.isNaN(compareAtPrice) || compareAtPrice < 0) {
      errors.push("Compare at price must be a non-negative number");
    }
  }

  if (!isUpdate || payload.stock !== undefined) {
    const stock = Number(payload.stock);
    if (Number.isNaN(stock) || stock < 0 || !Number.isInteger(stock)) {
      errors.push("Stock must be a non-negative integer");
    }
  }

  if (payload.weightVariants?.length) {
    payload.weightVariants.forEach((variant, index) => {
      if (!variant.weight?.trim()) {
        errors.push(`Variant ${index + 1}: weight is required`);
      }
      if (Number.isNaN(Number(variant.price)) || Number(variant.price) < 0) {
        errors.push(`Variant ${index + 1}: price must be non-negative`);
      }
      if (
        Number.isNaN(Number(variant.stock)) ||
        Number(variant.stock) < 0 ||
        !Number.isInteger(Number(variant.stock))
      ) {
        errors.push(`Variant ${index + 1}: stock must be a non-negative integer`);
      }
      if (!variant.sku?.trim()) {
        errors.push(`Variant ${index + 1}: SKU is required`);
      }
    });
  }

  if (errors.length > 0) {
    const error = new Error(errors.join(". "));
    error.statusCode = 400;
    throw error;
  }
};

export { SORT_OPTIONS, ADMIN_SORT_OPTIONS, STATUS_OPTIONS };
